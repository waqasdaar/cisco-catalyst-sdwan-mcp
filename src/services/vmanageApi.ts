/*
 * MIT License
 * Cisco Catalyst SD-WAN Manager (vManage) API Client
 * Supports JWT (20.18.1+) and session-based authentication
 * Docs: https://developer.cisco.com/docs/sdwan/overview/
 */

import https from 'https';
import type { Socket } from 'net';
import fetch, { type Response } from 'node-fetch';
import type { VManageConfig } from '../utils/config.js';

// keepAlive reuses TLS sessions (~100 ms saved per call); self-signed lab certificates are accepted.
const HTTPS_AGENT = new https.Agent({ rejectUnauthorized: false, keepAlive: true, keepAliveMsecs: 30_000, maxSockets: 32 });

// Without this, an unreachable host blocks for the OS TCP timeout (~75 s on macOS).
const CONNECT_TIMEOUT_MS = 10_000;
const agentWithCreate = HTTPS_AGENT as unknown as { createConnection: (...args: unknown[]) => Socket };
const createConnection = agentWithCreate.createConnection.bind(HTTPS_AGENT);
agentWithCreate.createConnection = (...args: unknown[]) => {
  const socket = createConnection(...args);
  const timer = setTimeout(() => {
    socket.destroy(Object.assign(new Error(`connect timed out after ${CONNECT_TIMEOUT_MS} ms`), { code: 'ETIMEDOUT' }));
  }, CONNECT_TIMEOUT_MS);
  socket.once('secureConnect', () => clearTimeout(timer));
  socket.once('close', () => clearTimeout(timer));
  return socket;
};

const MAX_RETRIES = 2;
const RETRY_STATUS = new Set([429, 502, 503, 504]);
// Dropped or stale keep-alive connections: a retry on a fresh connection usually succeeds.
const RETRYABLE_CODES = new Set(['ECONNRESET', 'EPIPE']);
const UNREACHABLE_CODES = new Set(['ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'ENETUNREACH', 'EAI_AGAIN', 'ENOTFOUND']);

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
  const e = err as { code?: string; erroredSysCall?: string; message?: string };
  return e?.code ?? /\b(E[A-Z]{4,})\b/.exec(e?.message ?? '')?.[1] ?? '';
}

function isRetryable(err: unknown): boolean {
  if ((err as { name?: string })?.name === 'AbortError') return false;
  return RETRYABLE_CODES.has(errorCode(err)) || /socket hang up/i.test((err as Error)?.message ?? '');
}

/** Turns an HTML error page into its readable text. */
function errorText(text: string): string {
  const body = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(text)?.[1] ?? text;
  return body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000);
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

  /** Logs in once; concurrent callers share the same login. */
  private async ensureAuthenticated(): Promise<void> {
    if (this.isAuthenticated()) return;
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

  private timeoutSignal(): AbortSignal {
    return AbortSignal.timeout(this.config.timeoutMs);
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
      agent: HTTPS_AGENT,
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
      agent: HTTPS_AGENT,
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
      agent: HTTPS_AGENT,
      signal: this.timeoutSignal(),
    });

    if (tokenResponse.ok) {
      this.xsrfToken = (await tokenResponse.text()).replace(/"/g, '');
    }
  }

  async get<T = unknown>(path: string, params?: Record<string, string>, cacheTtlMs?: number): Promise<T> {
    return (await this.request('GET', path, { query: params, cacheTtlMs })).body as T;
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
      if (cached && cached.expires > Date.now()) return cached.value;
    }

    let pending = this.inFlightGets.get(key);
    if (!pending) {
      pending = this.execute(method, path, options).finally(() => this.inFlightGets.delete(key));
      this.inFlightGets.set(key, pending);
    }
    const result = await pending;
    if (options.cacheTtlMs) this.cache.set(key, { expires: Date.now() + options.cacheTtlMs, value: result });
    return result;
  }

  private async execute(method: HttpMethod, path: string, options: RequestOptions): Promise<ApiResponse> {
    const idempotent = method === 'GET';
    let reauthenticated = false;
    for (let attempt = 0; ; attempt++) {
      try {
        await this.ensureAuthenticated();
        return await this.limiter.run(() => this.sendOnce(method, path, options));
      } catch (err) {
        if (err instanceof SessionExpiredError && !reauthenticated) {
          // Credentials were rejected before the request was processed, so retrying is safe.
          reauthenticated = true;
          this.invalidateAuth();
          continue;
        }
        const status = (err as { status?: number }).status;
        const retryable = idempotent && attempt < MAX_RETRIES && (isRetryable(err) || (status !== undefined && RETRY_STATUS.has(status)));
        if (retryable) {
          await sleep(300 * 3 ** attempt);
          continue;
        }
        if ((err as { name?: string }).name === 'AbortError' || (err as { type?: string }).type === 'aborted') {
          throw new Error(`vManage did not respond within ${this.config.timeoutMs} ms (${method} ${path}). Raise VMANAGE_TIMEOUT_MS for slow real-time queries.`);
        }
        const code = errorCode(err);
        if (UNREACHABLE_CODES.has(code) || isRetryable(err)) {
          throw new Error(`Cannot reach vManage at ${this.config.host}:${this.config.port} (${code || 'connection dropped'}). Check network/VPN connectivity.`);
        }
        throw err;
      }
    }
  }

  private async sendOnce(method: HttpMethod, path: string, options: RequestOptions): Promise<ApiResponse> {
    const signal = this.timeoutSignal();
    const response = await this.send(method, path, options, signal);
    const contentType = response.headers.get('content-type') || '';

    if (response.status === 401) {
      await response.arrayBuffer().catch(() => undefined);
      throw new SessionExpiredError('vManage rejected the session (401)');
    }
    if (!response.ok) {
      const text = await response.text();
      const error = new Error(`vManage API error ${response.status}: ${errorText(text)}`) as Error & { status: number };
      error.status = response.status;
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

    return fetch(url.toString(), { method, headers, body, agent: HTTPS_AGENT, signal });
  }
}
