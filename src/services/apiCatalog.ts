/*
 * MIT License
 * Catalog of every vManage REST operation, built from the OpenAPI spec that the
 * connected vManage publishes at /apidocs/vmanageapi.json.
 */

import { mkdir, readFile, rename, stat, writeFile } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';
import type { ApiResponse, HttpMethod, QueryValue, VManageApiService } from './vmanageApi.js';

export type Access = 'read' | 'write' | 'blocked';

interface SpecSchema {
  type?: string;
  format?: string;
  enum?: unknown[];
  default?: unknown;
  description?: string;
  items?: SpecSchema;
  properties?: Record<string, SpecSchema>;
  required?: string[];
  additionalProperties?: SpecSchema | boolean;
  $ref?: string;
  allOf?: SpecSchema[];
  oneOf?: SpecSchema[];
  anyOf?: SpecSchema[];
}

interface SpecParameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required?: boolean;
  description?: string;
  schema?: SpecSchema;
}

interface SpecMedia {
  schema?: SpecSchema;
  example?: unknown;
  examples?: Record<string, { value?: unknown }>;
}

interface SpecOperation {
  operationId?: string;
  tags?: string[];
  summary?: string;
  description?: string;
  deprecated?: boolean;
  parameters?: SpecParameter[];
  requestBody?: { required?: boolean; content?: Record<string, SpecMedia> };
  responses?: Record<string, { content?: Record<string, unknown> }>;
}

interface Spec {
  info?: { title?: string; version?: string };
  servers?: Array<{ url?: string }>;
  paths: Record<string, Record<string, SpecOperation>>;
  components?: { schemas?: Record<string, SpecSchema> };
}

export interface ApiOperation {
  operationId: string;
  method: HttpMethod;
  path: string;
  tag: string;
  summary: string;
  deprecated: boolean;
  access: Access;
  accessReason: string;
  bodyType?: 'json' | 'form';
  accept?: string;
  spec: SpecOperation;
}

export interface CallInput {
  operationId: string;
  pathParams?: Record<string, unknown>;
  query?: Record<string, unknown>;
  body?: unknown;
  confirm?: boolean;
  maxItems?: number;
}

const SPEC_PATH = '/apidocs/vmanageapi.json';
const SPEC_CACHE_DIR = join(homedir(), '.cache', 'catalyst-sdwan-mcp');
const SPEC_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const METHODS = ['get', 'post', 'put', 'delete', 'patch'];

// Endpoints that issue or reveal tokens, passwords, OTPs, credentials or bootstrap configs.
const SENSITIVE_PATH = /(token|password|credential|bootstrap|privatekey|\/otp(\/|$))/i;
// POSTs whose operationId marks them as queries that do not change state.
const READ_POST_OPERATION =
  /^(get|list|fetch|find|search|query)|^post(AggregationData|DocCount|Page|Count|RawAlarmData)|^(cellular|unique)Aggregation$/i;
// Query-style POSTs that nevertheless start device sessions or workflows.
const READ_POST_EXCLUDED_PATH = /^\/(stream|troubleshooting)\/|\/sync$|^\/setting\/configuration\/webserver\/certificate$/;
// GETs that change vManage or device state.
const SIDE_EFFECT_GET_PATH =
  /\/(reset|restart|demomode|syncvbond|startmonitor)(\/|$)|\/collect$|\/sync\/|\/enable\/|\/(start|stop|disable|renew|clear)\/\{/;
// Action verbs; vManage has GETs such as setvSmartMtHubList (pushes serial lists to
// controllers) and reTriggerNetworkMigration whose paths look like plain reads.
const ACTION_VERBS =
  'set|re-?trigger|trigger|push|sync|delete|remove|clean|clear|reset|restart|reboot|start|stop|enable|disable|activate|deactivate|install|upgrade|update|renew|revoke|invalidate|execute|run|apply|deploy|attach|detach|register|connect|disconnect|refresh|rediscover|import|export|lock|unlock|kill|abort|cancel|save|mark|force|migrate|authenticate|send|notify|dump';
const ACTION_OPERATION_ID = new RegExp(`^(${ACTION_VERBS})`, 'i');
const ACTION_DESCRIPTION = new RegExp(`^(${ACTION_VERBS})\\b|\\bopt[ -]?(in|out)\\b`, 'i');
const SECRET_KEY = /(password|passwd|secret|token|csrf|sessionid|privatekey|private-key)/i;

const MAX_ITEMS_DEFAULT = 200;

function stripHtml(text: string | undefined): string {
  return (text ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function firstLine(text: string, max = 160): string {
  const line = text.split('\n').find((l) => l.trim()) ?? '';
  return line.length > max ? `${line.slice(0, max - 1)}…` : line;
}

function isAction(op: SpecOperation): boolean {
  const description = stripHtml(op.summary || op.description).split(/Note:/)[0].trim();
  return ACTION_OPERATION_ID.test(op.operationId ?? '') || ACTION_DESCRIPTION.test(description);
}

export function redactSecrets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SECRET_KEY.test(k) && typeof v === 'string' && v ? '***redacted***' : redactSecrets(v);
    }
    return out;
  }
  return value;
}

export class ApiCatalog {
  private spec: Spec | null = null;
  private loading: Promise<Spec> | null = null;
  private operations: ApiOperation[] = [];
  private byId = new Map<string, ApiOperation>();

  constructor(
    private readonly api: VManageApiService,
    private readonly allowWrite: boolean
  ) {}

  async load(): Promise<void> {
    if (this.spec) return;
    if (!this.loading) {
      this.loading = this.loadSpec().catch((err) => {
        this.loading = null;
        throw err;
      });
    }
    const spec = await this.loading;
    if (this.spec) return;
    this.index(spec);
    this.spec = spec;
  }

  /** Uses a local copy (< 24 h old) when possible; falls back to an older copy if vManage is unreachable. */
  private async loadSpec(): Promise<Spec> {
    const file = join(SPEC_CACHE_DIR, `spec-${this.api.host.replace(/[^\w.-]/g, '_')}.json`);
    const cachedAge = await stat(file).then((s) => Date.now() - s.mtimeMs).catch(() => undefined);
    const readCached = async () => JSON.parse(await readFile(file, 'utf8')) as Spec;

    if (cachedAge !== undefined && cachedAge < SPEC_CACHE_MAX_AGE_MS) {
      try {
        return await readCached();
      } catch {
        // Corrupt cache file: fetch a fresh copy below.
      }
    }
    try {
      const res: ApiResponse = await this.api.request('GET', SPEC_PATH);
      const spec = (typeof res.body === 'string' ? JSON.parse(res.body) : res.body) as Spec;
      if (!spec?.paths) throw new Error('response is not an OpenAPI document');
      await mkdir(SPEC_CACHE_DIR, { recursive: true });
      const tmp = `${file}.${process.pid}.tmp`;
      await writeFile(tmp, JSON.stringify(spec));
      await rename(tmp, file);
      return spec;
    } catch (err) {
      if (cachedAge !== undefined) return readCached();
      throw new Error(`Could not load the vManage OpenAPI spec from ${SPEC_PATH}: ${err instanceof Error ? err.message : err}`);
    }
  }

  private index(spec: Spec): void {
    for (const [path, item] of Object.entries(spec.paths ?? {})) {
      for (const [m, op] of Object.entries(item)) {
        if (!METHODS.includes(m) || !op.operationId) continue;
        const method = m.toUpperCase() as HttpMethod;
        const classified = this.classify(method, path, op);
        const entry: ApiOperation = {
          operationId: op.operationId,
          method,
          path,
          tag: op.tags?.[0] ?? 'Untagged',
          summary: firstLine(stripHtml(op.summary || op.description)),
          deprecated: op.deprecated === true,
          spec: op,
          ...classified,
        };
        this.operations.push(entry);
        this.byId.set(entry.operationId.toLowerCase(), entry);
      }
    }
  }

  private classify(
    method: HttpMethod,
    path: string,
    op: SpecOperation
  ): Pick<ApiOperation, 'access' | 'accessReason' | 'bodyType' | 'accept'> {
    const responseTypes = Object.values(op.responses ?? {}).flatMap((r) => Object.keys(r.content ?? {}));
    if (responseTypes.some((t) => t.includes('event-stream'))) {
      return { access: 'blocked', accessReason: 'Server-sent event stream; not usable over MCP request/response' };
    }
    if (SENSITIVE_PATH.test(path)) {
      return { access: 'blocked', accessReason: 'Issues or exposes tokens, passwords, credentials or bootstrap secrets' };
    }

    let bodyType: 'json' | 'form' | undefined;
    const bodyTypes = Object.keys(op.requestBody?.content ?? {});
    if (bodyTypes.length) {
      if (bodyTypes.some((t) => t.includes('json') || t === '*/*')) bodyType = 'json';
      else if (bodyTypes.includes('application/x-www-form-urlencoded')) bodyType = 'form';
      else return { access: 'blocked', accessReason: `File upload (${bodyTypes.join(', ')}) is not supported over MCP` };
    }
    const distinctResponseTypes = [...new Set(responseTypes)];
    // Some endpoints (e.g. /util/logfile) reject requests without their exact text Accept type;
    // several "octet-stream" endpoints actually return JSON and reject a binary Accept.
    const accept =
      distinctResponseTypes.length === 1 && distinctResponseTypes[0].startsWith('text/') ? distinctResponseTypes[0] : undefined;

    if (method === 'GET') {
      if (SIDE_EFFECT_GET_PATH.test(path)) {
        return { access: 'write', accessReason: 'GET that changes vManage or device state', bodyType, accept };
      }
      if (isAction(op)) {
        return { access: 'write', accessReason: 'GET documented as an action (changes vManage or device state)', bodyType, accept };
      }
      return { access: 'read', accessReason: 'Read-only GET', bodyType, accept };
    }
    if (
      method === 'POST' &&
      READ_POST_OPERATION.test(op.operationId ?? '') &&
      !READ_POST_EXCLUDED_PATH.test(path) &&
      !isAction(op)
    ) {
      return { access: 'read', accessReason: 'Read-only query sent as POST', bodyType, accept };
    }
    return { access: 'write', accessReason: `${method} changes configuration or state`, bodyType, accept };
  }

  get version(): string | undefined {
    return this.spec?.info?.version;
  }

  /** Feature profile types the connected vManage publishes for a solution (e.g. system, transport, service). */
  async featureProfileTypes(solution: string): Promise<string[]> {
    await this.load();
    // Some types (e.g. policy-object, application-priority) only document sub-paths, yet their list GET works.
    const pattern = new RegExp(`^/v1/feature-profile/${solution.replace(/[^a-z-]/g, '')}/([a-z-]+)(/|$)`);
    const types = this.operations.map((o) => pattern.exec(o.path)?.[1]).filter((t): t is string => !!t);
    return [...new Set(types)].sort();
  }

  async featureProfileSolutions(): Promise<string[]> {
    await this.load();
    const solutions = this.operations
      .map((o) => /^\/v1\/feature-profile\/([a-z-]+)\/[a-z-]+(\/|$)/.exec(o.path)?.[1])
      .filter((s): s is string => !!s);
    return [...new Set(solutions)].sort();
  }

  /** True when the spec documents the query parameter for GET on this path (placeholder names ignored). */
  async hasQueryParam(path: string, name: string): Promise<boolean> {
    await this.load();
    const normalize = (p: string) => p.replace(/\{[^}]+\}/g, '{}');
    const target = normalize(path);
    const op = this.operations.find((o) => o.method === 'GET' && normalize(o.path) === target);
    return !!op?.spec.parameters?.some((p) => p.in === 'query' && p.name === name);
  }

  allOperations(): ApiOperation[] {
    return this.operations;
  }

  async categories(filter?: string) {
    await this.load();
    const counts = new Map<string, { read: number; write: number; blocked: number }>();
    for (const op of this.operations) {
      if (filter && !op.tag.toLowerCase().includes(filter.toLowerCase())) continue;
      const c = counts.get(op.tag) ?? { read: 0, write: 0, blocked: 0 };
      c[op.access]++;
      counts.set(op.tag, c);
    }
    return {
      totalOperations: this.operations.length,
      categories: [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([category, c]) => ({ category, ...c })),
    };
  }

  async search(opts: { query?: string; category?: string; method?: string; access?: string; limit?: number }) {
    await this.load();
    const terms = (opts.query ?? '').toLowerCase().split(/\s+/).filter(Boolean);
    const limit = Math.min(Math.max(opts.limit ?? 25, 1), 100);
    const matches = this.operations.filter((op) => {
      if (opts.method && op.method !== opts.method.toUpperCase()) return false;
      if (opts.access && op.access !== opts.access) return false;
      if (opts.category && !op.tag.toLowerCase().includes(opts.category.toLowerCase())) return false;
      const haystack = `${op.path} ${op.operationId} ${op.tag} ${op.summary}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
    // Prefer non-deprecated, then shorter (more general) paths.
    matches.sort((a, b) => Number(a.deprecated) - Number(b.deprecated) || a.path.length - b.path.length);
    return {
      total: matches.length,
      returned: Math.min(limit, matches.length),
      writeEnabled: this.allowWrite,
      operations: matches.slice(0, limit).map((op) => ({
        operationId: op.operationId,
        method: op.method,
        path: `/dataservice${op.path}`,
        category: op.tag,
        summary: op.summary,
        access: op.access,
        ...(op.deprecated ? { deprecated: true } : {}),
      })),
    };
  }

  async get(operationId: string): Promise<ApiOperation> {
    await this.load();
    const op = this.byId.get(String(operationId ?? '').toLowerCase());
    if (!op) throw new Error(`Unknown operation_id "${operationId}". Use search_api_operations to find one.`);
    return op;
  }

  async describe(operationId: string) {
    const op = await this.get(operationId);
    const media = Object.entries(op.spec.requestBody?.content ?? {})[0];
    const example = media?.[1].example ?? Object.values(media?.[1].examples ?? {})[0]?.value;
    const description = stripHtml(op.spec.description || op.spec.summary);
    return {
      operationId: op.operationId,
      method: op.method,
      path: `/dataservice${op.path}`,
      category: op.tag,
      description: description.length > 2000 ? `${description.slice(0, 2000)}…` : description,
      deprecated: op.deprecated,
      access: op.access,
      accessReason: op.accessReason,
      callable: this.callableReason(op) ?? 'yes',
      parameters: (op.spec.parameters ?? [])
        .filter((p) => p.in === 'path' || p.in === 'query')
        .map((p) => ({
          name: p.name,
          in: p.in,
          required: p.in === 'path' || p.required === true,
          type: p.schema?.type === 'array' ? `array<${p.schema.items?.type ?? 'string'}>` : (p.schema?.type ?? 'string'),
          ...(p.schema?.enum ? { enum: p.schema.enum } : {}),
          ...(p.schema?.default !== undefined ? { default: p.schema.default } : {}),
          ...(p.description ? { description: firstLine(stripHtml(p.description), 200) } : {}),
        })),
      requestBody: media
        ? {
            required: op.spec.requestBody?.required === true,
            contentType: media[0],
            schema: this.summarizeSchema(media[1].schema, 0, new Set()),
            ...(example !== undefined ? { example: truncateJson(example, 3000) } : {}),
          }
        : null,
    };
  }

  private summarizeSchema(schema: SpecSchema | undefined, depth: number, seen: Set<string>): unknown {
    if (!schema) return undefined;
    if (schema.$ref) {
      const name = schema.$ref.split('/').pop() ?? '';
      if (seen.has(name) || depth > 3) return { $ref: name };
      const resolved = this.spec?.components?.schemas?.[name];
      return this.summarizeSchema(resolved, depth, new Set([...seen, name]));
    }
    const combined = schema.allOf ?? schema.oneOf ?? schema.anyOf;
    if (combined) {
      const key = schema.allOf ? 'allOf' : schema.oneOf ? 'oneOf' : 'anyOf';
      return { [key]: combined.slice(0, 5).map((s) => this.summarizeSchema(s, depth + 1, seen)) };
    }
    if (schema.type === 'array') {
      return { type: 'array', items: this.summarizeSchema(schema.items, depth + 1, seen) };
    }
    if (schema.properties) {
      if (depth >= 3) return { type: 'object', properties: Object.keys(schema.properties) };
      const entries = Object.entries(schema.properties).slice(0, 40);
      return {
        type: 'object',
        ...(schema.required?.length ? { required: schema.required } : {}),
        properties: Object.fromEntries(entries.map(([k, v]) => [k, this.summarizeSchema(v, depth + 1, seen)])),
      };
    }
    const scalar: Record<string, unknown> = { type: schema.type ?? 'object' };
    if (schema.format) scalar.format = schema.format;
    if (schema.enum) scalar.enum = schema.enum;
    return Object.keys(scalar).length === 1 ? scalar.type : scalar;
  }

  private callableReason(op: ApiOperation): string | null {
    if (op.access === 'blocked') return `blocked: ${op.accessReason}`;
    if (op.access === 'write' && !this.allowWrite) {
      return 'disabled: write operations need VMANAGE_ALLOW_WRITE=true in the server .env';
    }
    return null;
  }

  /** Validates inputs against the spec, then calls vManage. */
  async call(input: CallInput): Promise<unknown> {
    const op = await this.get(input.operationId);
    const blocked = this.callableReason(op);
    if (blocked) throw new Error(`${op.operationId} is ${blocked}`);
    if (op.access === 'write' && input.confirm !== true) {
      throw new Error(`${op.operationId} (${op.method} ${op.path}) changes state. Re-run with confirm: true after the user approves.`);
    }

    const params = op.spec.parameters ?? [];
    const pathParams = { ...(input.pathParams ?? {}) };
    const query = { ...(input.query ?? {}) };

    let path = op.path;
    for (const p of params.filter((x) => x.in === 'path')) {
      const value = pathParams[p.name];
      if (value === undefined || value === null || value === '') {
        throw new Error(`Missing required path parameter "${p.name}" for ${op.path}`);
      }
      if (typeof value !== 'string' && typeof value !== 'number') {
        throw new Error(`Path parameter "${p.name}" must be a string or number`);
      }
      // URL parsing would resolve dot segments and reach a different endpoint.
      if (value === '.' || value === '..') {
        throw new Error(`Path parameter "${p.name}" cannot be "${value}"`);
      }
      checkEnum(p, value);
      path = path.split(`{${p.name}}`).join(encodeURIComponent(String(value)));
      delete pathParams[p.name];
    }
    const extraPath = Object.keys(pathParams);
    if (extraPath.length) throw new Error(`Unknown path parameter(s): ${extraPath.join(', ')}`);

    const querySpec = new Map(params.filter((x) => x.in === 'query').map((p) => [p.name, p]));
    const unknown = Object.keys(query).filter((k) => !querySpec.has(k));
    if (unknown.length) {
      throw new Error(`Unknown query parameter(s) for ${op.operationId}: ${unknown.join(', ')}. Allowed: ${[...querySpec.keys()].join(', ') || 'none'}`);
    }
    const finalQuery: Record<string, QueryValue> = {};
    for (const [name, p] of querySpec) {
      const value = query[name];
      if (value === undefined || value === null || value === '') {
        if (p.required) throw new Error(`Missing required query parameter "${name}" for ${op.operationId}`);
        continue;
      }
      finalQuery[name] = coerceQuery(p, value);
    }

    const requestBody = op.spec.requestBody;
    if (input.body !== undefined && !requestBody) {
      throw new Error(`${op.operationId} does not accept a request body`);
    }
    if (input.body === undefined && requestBody?.required) {
      throw new Error(`${op.operationId} requires a request body. Use describe_api_operation to see its schema.`);
    }
    if (op.bodyType === 'form' && input.body !== undefined && (typeof input.body !== 'object' || Array.isArray(input.body))) {
      throw new Error(`${op.operationId} expects a form body given as an object of string fields`);
    }

    const res = await this.api.request(op.method, `/dataservice${path}`, {
      query: finalQuery,
      body: input.body,
      bodyType: op.bodyType,
      accept: op.accept,
    });
    return shapeResponse(res.body, input.maxItems ?? MAX_ITEMS_DEFAULT);
  }
}

function checkEnum(p: SpecParameter, value: unknown): void {
  const allowed = p.schema?.enum ?? p.schema?.items?.enum;
  if (allowed && !allowed.map(String).includes(String(value))) {
    throw new Error(`Parameter "${p.name}" must be one of: ${allowed.join(', ')}`);
  }
}

function coerceQuery(p: SpecParameter, value: unknown): QueryValue {
  const type = p.schema?.type;
  if (type === 'array') {
    const items = Array.isArray(value) ? value : [value];
    items.forEach((v) => checkScalar({ ...p, schema: p.schema?.items ?? {} }, v));
    return items.map((v) => String(v));
  }
  checkScalar(p, value);
  return typeof value === 'object' ? JSON.stringify(value) : (value as string | number | boolean);
}

function checkScalar(p: SpecParameter, value: unknown): void {
  const type = p.schema?.type;
  const text = String(value);
  if ((type === 'integer' && !/^-?\d+$/.test(text)) || (type === 'number' && Number.isNaN(Number(text)))) {
    throw new Error(`Parameter "${p.name}" must be ${type === 'integer' ? 'an integer' : 'a number'}`);
  }
  if (type === 'boolean' && text !== 'true' && text !== 'false') {
    throw new Error(`Parameter "${p.name}" must be true or false`);
  }
  if (typeof value === 'object' && type !== undefined && type !== 'object' && type !== 'string') {
    throw new Error(`Parameter "${p.name}" must be a ${type}`);
  }
  checkEnum(p, value);
}

function truncateJson(value: unknown, max: number): unknown {
  const text = JSON.stringify(value);
  return text.length > max ? `${text.slice(0, max)}…(truncated)` : value;
}

/** Redacts secrets, drops UI column metadata and caps large lists. */
export function shapeResponse(body: unknown, maxItems: number): unknown {
  const clean = redactSecrets(body);
  if (Array.isArray(clean)) {
    return clean.length > maxItems
      ? { items: clean.slice(0, maxItems), truncated: { returned: maxItems, total: clean.length } }
      : clean;
  }
  if (clean && typeof clean === 'object') {
    const obj = { ...(clean as Record<string, unknown>) };
    if (obj.header && typeof obj.header === 'object') {
      const { columns: _columns, viewKeys: _viewKeys, fields: _fields, ...header } = obj.header as Record<string, unknown>;
      obj.header = header;
    }
    if (Array.isArray(obj.data) && obj.data.length > maxItems) {
      obj.truncated = { returned: maxItems, total: obj.data.length };
      obj.data = obj.data.slice(0, maxItems);
    }
    return obj;
  }
  return clean;
}
