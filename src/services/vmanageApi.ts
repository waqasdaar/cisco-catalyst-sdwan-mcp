/*
 * MIT License
 * Cisco Catalyst SD-WAN Manager (vManage) API Client
 * Supports JWT (20.18.1+) and session-based authentication
 * Docs: https://developer.cisco.com/docs/sdwan/overview/
 */

import { Agent, fetch, type Response } from 'undici';
import type { VManageConfig } from '../utils/config.js';

// Without a connect timeout, an unreachable host blocks for the OS TCP timeout (~75 s on macOS).
const CONNECT_TIMEOUT_MS = 10_000;
// Pooled keep-alive connections reuse TLS sessions; self-signed lab certificates are accepted.
const DISPATCHER = new Agent({
  connect: { rejectUnauthorized: false, timeout: CONNECT_TIMEOUT_MS },
  keepAliveTimeout: 30_000,
  connections: 32,
});

const MAX_RETRIES = 2;
const RETRY_STATUS = new Set([429, 502, 503, 504]);
const MAX_RETRY_AFTER_MS = 10_000;
// Dropped or stale keep-alive connections: a retry on a fresh connection usually succeeds.
const RETRYABLE_CODES = new Set(['ECONNRESET', 'EPIPE', 'UND_ERR_SOCKET']);
const UNREACHABLE_CODES = new Set([
  'ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'ENETUNREACH', 'EAI_AGAIN', 'ENOTFOUND', 'UND_ERR_CONNECT_TIMEOUT',
]);
// After vManage proves unreachable, later calls fail immediately for this long instead of each waiting for a timeout.
const UNREACHABLE_HOLD_MS = 10_000;
// Renew the JWT in the background this long before it expires, so no call waits for a login.
const JWT_REFRESH_AHEAD_S = 300;
const CACHE_MAX_ENTRIES = 500;
const LOGOUT_TIMEOUT_MS = 3_000;

interface JwtLoginResponse {
  token?: string;
  refresh?: string;
  csrf?: string;
  exp?: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type QueryValue = string | number | boolean | Array<string | number | boolean>;

export interface RequestOptions {
  query?: Record<string, QueryValue | undefined>;
  body?: unknown;
  bodyType?: 'json' | 'form';
  accept?: string;
  /** GET only: reuse a successful response for this many milliseconds. */
  cacheTtlMs?: number;
  /** GET only: after cacheTtlMs, keep answering from the old response for this long while it refreshes in the background. */
  staleMs?: number;
}

export interface ApiResponse {
  status: number;
  contentType: string;
  body: unknown;
}

/** Caps how many requests are in flight to vManage at once. */
class Limiter {
  private active = 0;
  private waiting: Array<() => void> = [];

  constructor(private readonly max: number) {}

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.active >= this.max) await new Promise<void>((resolve) => this.waiting.push(resolve));
    this.active++;
    try {
      return await task();
    } finally {
      this.active--;
      this.waiting.shift()?.();
    }
  }
}

class SessionExpiredError extends Error {}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function errorCode(err: unknown): string {
  // undici wraps network errors: TypeError('fetch failed') with the system error as `cause`.
  const e = err as { code?: string; cause?: { code?: string }; message?: string };
  return e?.cause?.code ?? e?.code ?? /\b(E[A-Z]{4,})\b/.exec(e?.message ?? '')?.[1] ?? '';
}

function isTimeout(err: unknown): boolean {
  const name = (err as { name?: string })?.name;
  return name === 'AbortError' || name === 'TimeoutError';
}

function isRetryable(err: unknown): boolean {
  if (isTimeout(err)) return false;
  return RETRYABLE_CODES.has(errorCode(err)) || /socket hang up/i.test((err as Error)?.message ?? '');
}

/** Turns an HTML error page into its readable text. */
function errorText(text: string): string {
  const body = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(text)?.[1] ?? text;
  return body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000);
}

/** Retry-After header (seconds or HTTP date) in milliseconds, capped. */
function retryAfterMs(header: string | null): number | undefined {
  if (!header) return undefined;
  const seconds = Number(header);
  const ms = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(header) - Date.now();
  return Number.isFinite(ms) && ms > 0 ? Math.min(ms, MAX_RETRY_AFTER_MS) : undefined;
}

export class VManageApiService {
  private config: VManageConfig;
  private baseUrl: string;
  private jwtToken: string | null = null;
  private xsrfToken: string | null = null;
  private jsessionId: string | null = null;
  private tokenExpiry: number = 0;
  private authInFlight: Promise<void> | null = null;
  private readonly limiter: Limiter;
  private readonly inFlightGets = new Map<string, Promise<ApiResponse>>();
  private readonly cache = new Map<string, { expires: number; value: ApiResponse }>();
  private unreachable: { until: number; message: string } | null = null;

  constructor(config: VManageConfig) {
    this.config = config;
    this.baseUrl = `https://${config.host}:${config.port}`;
    this.limiter = new Limiter(config.maxConcurrency);
  }

  get host(): string {
    return this.config.host;
  }

  private isAuthenticated(): boolean {
    if (this.config.useJwt) return !!this.jwtToken && this.tokenExpiry > Date.now() / 1000 + 60;
    return !!this.jsessionId;
  }

  /** Logs in once; concurrent callers share the same login. A JWT close to expiry is renewed in the background. */
  private async ensureAuthenticated(): Promise<void> {
    if (this.isAuthenticated()) {
      if (this.config.useJwt && !this.authInFlight && this.tokenExpiry - Date.now() / 1000 < JWT_REFRESH_AHEAD_S) {
        this.login().catch((err) => console.error(`Background JWT renewal failed: ${err instanceof Error ? err.message : err}`));
      }
      return;
    }
    return this.login();
  }

  private login(): Promise<void> {
    if (!this.authInFlight) {
      this.authInFlight = (this.config.useJwt ? this.authenticateJwt() : this.authenticateSession()).finally(() => {
        this.authInFlight = null;
      });
    }
    return this.authInFlight;
  }

  private invalidateAuth(): void {
    this.jwtToken = null;
    this.jsessionId = null;
    this.xsrfToken = null;
    this.tokenExpiry = 0;
  }

  private timeoutSignal(realTime = false): AbortSignal {
    return AbortSignal.timeout(realTime ? this.config.timeoutMs : this.config.listTimeoutMs);
  }

  /** Real-time device queries are proxied by vManage to the device and get the longer timeout. */
  private isRealTime(path: string, options: RequestOptions): boolean {
    return options.query?.deviceId !== undefined || /[?&]deviceId=/.test(path);
  }

  /** Ends a session-cookie login so it doesn't count against vManage's per-user session limit. JWTs simply expire. */
  async logout(): Promise<void> {
    const cookie = this.jsessionId;
    if (!cookie) return;
    this.invalidateAuth();
    try {
      await fetch(`${this.baseUrl}/logout?nocache=${Date.now()}`, {
        headers: { Cookie: cookie },
        redirect: 'manual',
        dispatcher: DISPATCHER,
        signal: AbortSignal.timeout(LOGOUT_TIMEOUT_MS),
      });
      if (this.config.logTiming) console.error('[vmanage] session logged out');
    } catch {
      // Shutting down: the session will expire on vManage anyway.
    }
  }

  private async authenticateJwt(): Promise<void> {
    const url = `${this.baseUrl}/jwt/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.config.username,
        password: this.config.password,
        // vManage rejects JWT durations above 1800 seconds
        duration: 1800,
      }),
      dispatcher: DISPATCHER,
      signal: this.timeoutSignal(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`JWT authentication failed: ${response.status} ${errorText(text)}`);
    }

    const data = (await response.json()) as JwtLoginResponse;
    if (!data.token) {
      throw new Error('JWT login response missing token');
    }

    this.jwtToken = data.token;
    this.xsrfToken = data.csrf || null;
    this.tokenExpiry = data.exp || Math.floor(Date.now() / 1000) + 1800;
  }

  private async authenticateSession(): Promise<void> {
    const url = `${this.baseUrl}/j_security_check`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        j_username: this.config.username,
        j_password: this.config.password,
      }),
      redirect: 'manual',
      dispatcher: DISPATCHER,
      signal: this.timeoutSignal(),
    });

    const setCookie = response.headers.get('set-cookie');
    if (!setCookie || !setCookie.includes('JSESSIONID')) {
      const text = await response.text();
      if (text.includes('<html') || text.includes('login')) {
        throw new Error('Session authentication failed: invalid credentials');
      }
      throw new Error(`Session authentication failed: ${response.status}`);
    }

    const match = setCookie.match(/JSESSIONID=([^;]+)/);
    if (!match) {
      throw new Error('Failed to extract JSESSIONID from response');
    }
    this.jsessionId = `JSESSIONID=${match[1]}`;

    const tokenUrl = `${this.baseUrl}/dataservice/client/token`;
    const tokenResponse = await fetch(tokenUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: this.jsessionId,
      },
      dispatcher: DISPATCHER,
      signal: this.timeoutSignal(),
    });

    if (tokenResponse.ok) {
      this.xsrfToken = (await tokenResponse.text()).replace(/"/g, '');
    }
  }

  async get<T = unknown>(path: string, params?: Record<string, string>, cacheTtlMs?: number, staleMs?: number): Promise<T> {
    return (await this.request('GET', path, { query: params, cacheTtlMs, staleMs })).body as T;
  }

  async post<T = unknown>(path: string, body?: object): Promise<T> {
    return (await this.request('POST', path, { body })).body as T;
  }

  async put<T = unknown>(path: string, body?: object): Promise<T> {
    return (await this.request('PUT', path, { body })).body as T;
  }

  async delete(path: string): Promise<unknown> {
    return (await this.request('DELETE', path)).body;
  }

  /**
   * Sends a request. Identical concurrent GETs share one call, and GETs may be cached
   * briefly (cacheTtlMs). GETs are retried on transient network errors and 429/502/503/504.
   */
  async request(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<ApiResponse> {
    if (method !== 'GET') return this.execute(method, path, options);

    const key = `${path}|${JSON.stringify(options.query ?? {})}|${options.accept ?? ''}`;
    if (options.cacheTtlMs) {
      const cached = this.cache.get(key);
      const now = Date.now();
      if (cached && cached.expires > now) {
        if (this.config.logTiming) console.error(`[vmanage] GET ${path.split('?')[0]} cache-hit`);
        return cached.value;
      }
      if (cached && options.staleMs && cached.expires + options.staleMs > now) {
        if (!this.inFlightGets.has(key)) {
          const refresh = this.execute(method, path, options).finally(() => this.inFlightGets.delete(key));
          this.inFlightGets.set(key, refresh);
          refresh.then((r) => this.cacheSet(key, r, options.cacheTtlMs as number)).catch(() => undefined);
        }
        if (this.config.logTiming) console.error(`[vmanage] GET ${path.split('?')[0]} stale-hit (refreshing in background)`);
        return cached.value;
      }
    }

    let pending = this.inFlightGets.get(key);
    if (!pending) {
      pending = this.execute(method, path, options).finally(() => this.inFlightGets.delete(key));
      this.inFlightGets.set(key, pending);
    }
    const result = await pending;
    if (options.cacheTtlMs) this.cacheSet(key, result, options.cacheTtlMs);
    return result;
  }

  private cacheSet(key: string, value: ApiResponse, ttlMs: number): void {
    const now = Date.now();
    if (this.cache.size >= CACHE_MAX_ENTRIES) {
      for (const [k, entry] of this.cache) if (entry.expires <= now) this.cache.delete(k);
      // Map keeps insertion order, so the first keys are the oldest entries.
      for (const k of this.cache.keys()) {
        if (this.cache.size < CACHE_MAX_ENTRIES) break;
        this.cache.delete(k);
      }
    }
    this.cache.delete(key);
    this.cache.set(key, { expires: now + ttlMs, value });
  }

  private logCall(method: HttpMethod, path: string, outcome: string, started: number, retries: number): void {
    if (!this.config.logTiming) return;
    console.error(`[vmanage] ${method} ${path.split('?')[0]} ${outcome} ${Date.now() - started}ms${retries ? ` retries=${retries}` : ''}`);
  }

  private async execute(method: HttpMethod, path: string, options: RequestOptions): Promise<ApiResponse> {
    const hold = this.unreachable;
    if (hold && Date.now() < hold.until) {
      throw new Error(`${hold.message} Retrying the connection in ${Math.ceil((hold.until - Date.now()) / 1000)} s.`);
    }
    const started = Date.now();
    const idempotent = method === 'GET';
    let reauthenticated = false;
    for (let attempt = 0; ; attempt++) {
      try {
        await this.ensureAuthenticated();
        const result = await this.limiter.run(() => this.sendOnce(method, path, options));
        this.unreachable = null;
        this.logCall(method, path, String(result.status), started, attempt);
        return result;
      } catch (err) {
        if (err instanceof SessionExpiredError && !reauthenticated) {
          // Credentials were rejected before the request was processed, so retrying is safe.
          reauthenticated = true;
          this.invalidateAuth();
          continue;
        }
        const { status, retryAfter } = err as { status?: number; retryAfter?: number };
        const retryable = idempotent && attempt < MAX_RETRIES && (isRetryable(err) || (status !== undefined && RETRY_STATUS.has(status)));
        if (retryable) {
          // Jitter keeps parallel calls from retrying in lockstep.
          const backoff = 300 * 3 ** attempt * (0.75 + Math.random() * 0.5);
          await sleep(Math.max(backoff, retryAfter ?? 0));
          continue;
        }
        this.logCall(method, path, status !== undefined ? String(status) : errorCode(err) || 'error', started, attempt);
        throw this.describeFailure(err, method, path, options);
      }
    }
  }

  private describeFailure(err: unknown, method: HttpMethod, path: string, options: RequestOptions): unknown {
    if (isTimeout(err) || (err as { type?: string }).type === 'aborted') {
      const [ms, variable] = this.isRealTime(path, options)
        ? [this.config.timeoutMs, 'VMANAGE_TIMEOUT_MS']
        : [this.config.listTimeoutMs, 'VMANAGE_LIST_TIMEOUT_MS'];
      return new Error(`vManage did not respond within ${ms} ms (${method} ${path.split('?')[0]}). Raise ${variable} if this query is expected to be slow.`);
    }
    const code = errorCode(err);
    if (UNREACHABLE_CODES.has(code) || isRetryable(err)) {
      const message = `Cannot reach vManage at ${this.config.host}:${this.config.port} (${code || 'connection dropped'}). Check network/VPN connectivity.`;
      if (UNREACHABLE_CODES.has(code)) this.unreachable = { until: Date.now() + UNREACHABLE_HOLD_MS, message };
      return new Error(message);
    }
    return err;
  }

  private async sendOnce(method: HttpMethod, path: string, options: RequestOptions): Promise<ApiResponse> {
    const signal = this.timeoutSignal(this.isRealTime(path, options));
    const response = await this.send(method, path, options, signal);
    const contentType = response.headers.get('content-type') || '';

    if (response.status === 401) {
      await response.arrayBuffer().catch(() => undefined);
      throw new SessionExpiredError('vManage rejected the session (401)');
    }
    if (!response.ok) {
      const text = await response.text();
      const error = new Error(`vManage API error ${response.status}: ${errorText(text)}`) as Error & { status: number; retryAfter?: number };
      error.status = response.status;
      error.retryAfter = retryAfterMs(response.headers.get('retry-after'));
      throw error;
    }

    if (/octet-stream|pdf|zip|image\//i.test(contentType)) {
      const size = (await response.arrayBuffer()).byteLength;
      return { status: response.status, contentType, body: { binaryContentOmitted: true, contentType, bytes: size } };
    }

    const text = await response.text();
    // An expired session cookie makes vManage answer with its HTML login page (HTTP 200).
    if (/text\/html/i.test(contentType) && /j_security_check|login-container/i.test(text)) {
      throw new SessionExpiredError('vManage session expired');
    }
    if (!text) return { status: response.status, contentType, body: {} };
    if (/json/i.test(contentType) || /^\s*[[{]/.test(text)) {
      try {
        return { status: response.status, contentType, body: JSON.parse(text) };
      } catch {
        // Fall through and return the raw text.
      }
    }
    return { status: response.status, contentType, body: text };
  }

  private async send(method: HttpMethod, path: string, options: RequestOptions, signal: AbortSignal): Promise<Response> {
    const url = new URL(`${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value === undefined || value === null) continue;
      for (const item of Array.isArray(value) ? value : [value]) {
        url.searchParams.append(key, String(item));
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': options.bodyType === 'form' ? 'application/x-www-form-urlencoded' : 'application/json',
    };
    if (options.accept) {
      headers['Accept'] = options.accept;
    }
    if (this.jwtToken) {
      headers['Authorization'] = `Bearer ${this.jwtToken}`;
    } else if (this.jsessionId) {
      headers['Cookie'] = this.jsessionId;
    }
    if (this.xsrfToken) {
      headers['X-XSRF-TOKEN'] = this.xsrfToken;
    }

    let body: string | undefined;
    if (options.body !== undefined) {
      body =
        options.bodyType === 'form'
          ? new URLSearchParams(options.body as Record<string, string>).toString()
          : JSON.stringify(options.body);
    }

    return fetch(url.toString(), { method, headers, body, dispatcher: DISPATCHER, signal });
  }
}
