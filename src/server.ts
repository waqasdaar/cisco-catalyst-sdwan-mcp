/**
 * Copyright 2026 Cisco Systems, Inc. and its affiliates
 * * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Cisco Catalyst SD-WAN MCP Server
 * Exposes vManage API capabilities as MCP tools
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { VManageApiService } from './services/vmanageApi.js';
import { ApiCatalog, shapeResponse } from './services/apiCatalog.js';
import { loadConfig, type VManageConfig } from './utils/config.js';

const MAX_RESPONSE_CHARS = 200_000;

/** Serializes a result within MAX_RESPONSE_CHARS, dropping list rows rather than breaking the JSON. */
function toLimitedJson(result: unknown): string {
  // Compact JSON: roughly half the size of indented output, so faster for clients and fewer model tokens.
  const text = JSON.stringify(result) ?? '';
  if (text.length <= MAX_RESPONSE_CHARS) return text;

  const obj = (Array.isArray(result) ? { items: result } : result) as Record<string, unknown>;
  const key = Array.isArray(obj?.data) ? 'data' : Array.isArray(obj?.items) ? 'items' : null;
  if (key) {
    const { [key]: rows, page, truncated, ...rest } = obj;
    const list = rows as unknown[];
    const offset = (page as { offset?: number } | undefined)?.offset ?? 0;
    const total = (page as { total?: number } | undefined)?.total ?? (truncated as { total?: number } | undefined)?.total ?? offset + list.length;
    // One pass: serialize each row once and stop when the budget is used.
    const budget = MAX_RESPONSE_CHARS - JSON.stringify(rest).length - 300;
    const parts: string[] = [];
    let size = 0;
    for (const row of list) {
      const s = JSON.stringify(row) ?? 'null';
      if (size + s.length + 1 > budget) break;
      parts.push(s);
      size += s.length + 1;
    }
    if (parts.length) {
      const head = JSON.stringify({
        ...rest,
        truncated: {
          returned: parts.length,
          total,
          nextOffset: offset + parts.length,
          reason: 'response size limit: call again with offset set to nextOffset, or narrow with filter, fields or count_by',
        },
      });
      return `${head.slice(0, -1)},"${key}":[${parts.join(',')}]}`;
    }
  }
  return JSON.stringify({
    truncated: true,
    reason: `Response is ${text.length} characters (limit ${MAX_RESPONSE_CHARS}); narrow the query.`,
    preview: text.slice(0, MAX_RESPONSE_CHARS / 2),
  });
}

interface DeviceRow {
  'system-ip'?: string;
  'host-name'?: string;
  uuid?: string;
  'board-serial'?: string;
  'device-type'?: string;
  reachability?: string;
  'site-id'?: string;
  controlConnections?: string;
  ompPeers?: string;
  bfdSessions?: string;
  bfdSessionsUp?: number;
  health?: string;
  state_description?: string;
  lastupdated?: number;
}

interface UxGroup {
  id: string;
  name: string;
  [key: string]: unknown;
}

const DEVICE_INDEX_TTL_MS = 60_000;
const DEVICE_INDEX_STALE_MS = 10 * 60_000;
const GROUP_LIST_TTL_MS = 30_000;
const INVENTORY_TTL_MS = 60_000;
const INVENTORY_STALE_MS = 10 * 60_000;
const REACHABLE_TTL_MS = 30_000;
// Device rows carry ~50 fields; list_devices returns these unless fields or all_fields is given.
const DEVICE_SUMMARY_FIELDS = [
  'host-name', 'system-ip', 'site-id', 'device-type', 'device-model', 'reachability', 'status', 'version', 'uuid', 'board-serial',
];
// Real-time queries are proxied to every device, so a fabric-wide real-time sweep stays capped.
const MAX_REALTIME_FABRIC_DEVICES = 200;
// Per-device results are reused briefly, so a repeated or resumed fabric call only queries what is missing.
const FABRIC_SYNCED_TTL_MS = 60_000;
const FABRIC_REALTIME_TTL_MS = 15_000;
const FABRIC_HEALTH_TTL_MS = 15_000;
// Selections up to this many edges are queried in real time unless synced is given; also caps live re-checks.
const FABRIC_REALTIME_AUTO_MAX = 25;
// Consecutive overload errors (429/5xx/timeouts) after which a sweep stops sending requests.
const FABRIC_BREAKER_FAILURES = 5;
// Above this many edges, only devices with problems are listed unless detail: "all".
const FABRIC_FULL_DETAIL_MAX = 50;
const FABRIC_LIST_CAP = 200;
const FABRIC_MAX_WAIT_CAP_S = 600;
const OVERLOAD_STATUS = new Set([429, 502, 503, 504]);
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Lines only in the running config (removed) and only in the rendered config (added), order preserved. */
function lineDiff(existing: string, rendered: string) {
  const count = (lines: string[]) => {
    const m = new Map<string, number>();
    for (const l of lines) m.set(l, (m.get(l) ?? 0) + 1);
    return m;
  };
  const oldLines = existing.split('\n').map((l) => l.trimEnd()).filter((l) => l.trim());
  const newLines = rendered.split('\n').map((l) => l.trimEnd()).filter((l) => l.trim());
  const oldCount = count(oldLines);
  const newCount = count(newLines);
  const only = (lines: string[], own: Map<string, number>, other: Map<string, number>) => {
    const budget = new Map<string, number>();
    for (const [l, n] of own) budget.set(l, Math.max(0, n - (other.get(l) ?? 0)));
    return lines.filter((l) => {
      const left = budget.get(l) ?? 0;
      if (left <= 0) return false;
      budget.set(l, left - 1);
      return true;
    });
  };
  const removed = only(oldLines, oldCount, newCount);
  const added = only(newLines, newCount, oldCount);
  return {
    inSync: removed.length === 0 && added.length === 0,
    summary: { existingLines: oldLines.length, renderedLines: newLines.length, added: added.length, removed: removed.length },
    added,
    removed,
  };
}

/** Compact view of a configuration / policy / topology group. */
function summarizeGroup(g: UxGroup) {
  const profiles = Array.isArray(g.profiles)
    ? (g.profiles as Array<Record<string, unknown>>).map((p) => ({ id: p.id, name: p.name, type: p.type }))
    : undefined;
  return {
    id: g.id,
    name: g.name,
    description: g.description,
    solution: g.solution,
    state: g.state,
    version: g.version,
    devices: g.numberOfDevices,
    devicesUpToDate: g.numberOfDevicesUpToDate,
    devicesFailed: g.numberOfDevicesFailed,
    devicesInProgress: g.numberOfDevicesInProgress,
    profiles,
    lastUpdatedBy: g.lastUpdatedBy,
    lastUpdatedOn: g.lastUpdatedOn,
  };
}

function summarizeProfile(p: Record<string, unknown>) {
  return {
    profileId: p.profileId,
    profileName: p.profileName,
    profileType: p.profileType,
    description: p.description,
    lastUpdatedBy: p.lastUpdatedBy,
    lastUpdatedOn: p.lastUpdatedOn,
  };
}

// Typed list/definition endpoints published by the vManage 26.2 OpenAPI spec.
const POLICY_LIST_TYPES = [
  'app', 'appprobe', 'aspath', 'class', 'color', 'community', 'dataipv6prefix', 'dataprefix', 'dataprefixall',
  'dataprefixfqdn', 'expandedcommunity', 'extcommunity', 'faxprotocol', 'fqdn', 'geolocation', 'identity',
  'ipprefixall', 'ipssignature', 'ipv6prefix', 'localapp', 'localdomain', 'mediaprofile', 'mirror',
  'modempassthrough', 'policer', 'port', 'preferredcolorgroup', 'prefix', 'protocolname', 'region',
  'scalablegrouptag', 'site', 'sla', 'supervisorydisc', 'tgapikey', 'tloc', 'translationprofile',
  'translationrules', 'trunkgroup', 'umbrelladata', 'urlblacklist', 'urlwhitelist', 'vpn', 'zone',
];
const POLICY_DEFINITION_TYPES = [
  'acl', 'aclv6', 'advancedMalwareProtection', 'advancedinspectionprofile', 'approute', 'cflowd', 'control', 'data',
  'deviceaccesspolicy', 'deviceaccesspolicyv6', 'dialpeer', 'dnssecurity', 'fxoport', 'fxsdidport', 'fxsport',
  'hubandspoke', 'intrusionprevention', 'mesh', 'priisdnport', 'qosmap', 'rewriterule', 'ruleset', 'securitygroup',
  'srstphoneprofile', 'ssldecryption', 'sslutdprofile', 'urlfiltering', 'vedgeroute', 'vpnmembershipgroup',
  'vpnqosmap', 'zonebasedfw',
];

/** Keeps only rows whose fields equal every provided filter value. */
function filterRows(result: unknown, filters: Record<string, unknown>): unknown {
  const active = Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== '');
  const data = (result as { data?: unknown })?.data;
  if (!active.length || !Array.isArray(data)) return result;
  const rows = data.filter((row) =>
    active.every(([k, v]) => String((row as Record<string, unknown>)[k]) === String(v))
  );
  return { ...(result as object), data: rows };
}

// Tools whose own arguments or result shape don't fit row selection (list_api_categories already uses `filter`).
const NO_ROW_OPTIONS = new Set([
  'list_api_categories',
  'search_api_operations',
  'describe_api_operation',
  'get_fabric_health',
  'get_fabric_bfd_status',
  'get_fabric_tlocs',
]);
const ROW_OPTIONS = {
  fields: {
    type: 'array',
    items: { type: 'string' },
    description: 'Return only these fields of each row (smaller, faster responses), e.g. host-name, system-ip, reachability',
  },
  filter: {
    type: 'object',
    additionalProperties: true,
    description: 'Return only rows whose fields match these values (case-insensitive; an array value matches any of its items), e.g. state: down',
  },
  count_by: {
    type: 'string',
    description: 'Return row counts per value of this field instead of rows (after filter), e.g. reachability, device-model, version, site-id. Fastest way to summarize large lists.',
  },
  offset: { type: 'integer', minimum: 0, description: 'Skip this many rows (after filter). Use nextOffset from a truncated or paged response to continue.' },
  limit: { type: 'integer', minimum: 1, description: 'Return at most this many rows (after filter and offset)' },
};
const SYNCED_OPTION = {
  type: 'boolean',
  description: 'Return vManage cached (synced) data instead of querying the device in real time (faster)',
};
const FABRIC_SCOPE = {
  site_id: { type: 'string', description: 'Only WAN edges at this site ID' },
  devices: { type: 'array', items: { type: 'string' }, description: 'Only these WAN edges (hostnames or system IPs)' },
  synced: {
    type: 'boolean',
    description: `Default: real time for up to ${FABRIC_REALTIME_AUTO_MAX} edges, otherwise vManage cached (synced) data. true forces synced data (fast); false forces real-time queries, which vManage processes slowly when many devices are queried at once.`,
  },
  max_wait_seconds: {
    type: 'number',
    description:
      'Time budget for the sweep (default VMANAGE_FABRIC_DEADLINE_MS, 25 s). Devices not reached in time are listed under incomplete; call again to continue, since finished devices are reused.',
  },
  detail: {
    type: 'string',
    enum: ['auto', 'all', 'problems'],
    description: `Which devices to list: all, only those with problems or errors, or auto (all up to ${FABRIC_FULL_DETAIL_MAX} edges, otherwise problems only). Summary totals always cover every queried device.`,
  },
};

const isOverload = (err: unknown) => {
  const status = (err as { status?: number })?.status;
  return (status !== undefined && OVERLOAD_STATUS.has(status)) || /did not respond within|Cannot reach vManage/.test(errorMessage(err));
};

const dataOf = (body: unknown) => (body as { data?: unknown })?.data ?? body;
const errorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err));

/** Device counts per type and reachability. */
function summarizeDevices(rows: DeviceRow[]) {
  const byType: Record<string, { total: number; reachable: number; unreachable: number }> = {};
  for (const d of rows) {
    const t = (byType[d['device-type'] ?? 'unknown'] ??= { total: 0, reachable: 0, unreachable: 0 });
    t.total++;
    if (d.reachability === 'reachable') t.reachable++;
    else t.unreachable++;
  }
  return { total: rows.length, byType };
}

const TYPE_ORDER = ['vmanage', 'vsmart', 'vbond', 'vedge'];
const pct = (v: unknown) => (v === null || v === undefined || v === '' ? undefined : Math.round(Number(v) * 10) / 10);

/**
 * One row per device: reachability, health with CPU/memory, and up/total counters for control connections,
 * OMP peers, BFD sessions and TLOCs. Uses /health/devices when available, else the device inventory counters.
 */
function deviceHealthTable(inventory: DeviceRow[], healthRows: Array<Record<string, any>> | undefined) {
  const bySystemIp = new Map((healthRows ?? []).map((h) => [String(h.system_ip), h]));
  const totals = { controlConnections: [0, 0], ompPeers: [0, 0], bfdSessions: [0, 0], tlocs: [0, 0] };
  const healthCounts: Record<string, number> = {};
  const ratio = (key: keyof typeof totals, up: unknown, total: unknown) => {
    if (total === undefined || total === null) return undefined;
    const u = Number(up) || 0;
    const t = Number(total) || 0;
    totals[key][0] += u;
    totals[key][1] += t;
    return `${u}/${t}`;
  };
  const rows = inventory.map((d) => {
    const h = bySystemIp.get(String(d['system-ip']));
    const type = d['device-type'] ?? 'unknown';
    const reachable = d.reachability === 'reachable';
    const health = String(h?.health ?? d.health ?? 'unknown');
    const cpu = pct(h?.cpu_load);
    const mem = pct(h?.memory_utilization);
    const control = h ? ratio('controlConnections', h.control_connections_up, h.control_connections) : ratio('controlConnections', d.controlConnections, d.controlConnections);
    const omp = h ? ratio('ompPeers', h.omp_peers_up, h.omp_peers) : ratio('ompPeers', d.ompPeers, d.ompPeers);
    const bfd = h ? ratio('bfdSessions', h.bfd_sessions_up, h.bfd_sessions) : ratio('bfdSessions', d.bfdSessionsUp, d.bfdSessions);
    const tlocs = h ? ratio('tlocs', h.up_tloc_num, h.total_tloc_num) : undefined;
    healthCounts[health] = (healthCounts[health] ?? 0) + 1;

    const problems: string[] = [];
    const down = (label: string, value: string | undefined) => {
      const [u, t] = (value ?? '0/0').split('/').map(Number);
      if (u < t) problems.push(`${t - u} of ${t} ${label} down`);
    };
    if (!reachable) problems.push('unreachable');
    if (reachable && health !== 'green' && health !== 'unknown') {
      const metrics = [cpu !== undefined ? `CPU ${cpu}%` : '', mem !== undefined ? `memory ${mem}%` : ''].filter(Boolean).join(', ');
      problems.push(`health ${health}${h?.reason ? `: ${h.reason}` : ''}${metrics ? ` (${metrics})` : ''}`);
    }
    if (reachable) {
      down('control connections', control);
      down('OMP peers', omp);
      down('BFD sessions', bfd);
      down('TLOCs', tlocs);
      if (h && Number(h.vsmart_control_connections) < Number(h.expected_vsmart_connections)) {
        problems.push(`connected to ${h.vsmart_control_connections} of ${h.expected_vsmart_connections} expected Controllers`);
      }
      if (!h && d.controlConnections !== undefined && !Number(d.controlConnections)) problems.push('no control connections');
      if (!h && d.ompPeers !== undefined && !Number(d.ompPeers) && (type === 'vedge' || type === 'vsmart')) problems.push('no OMP peers');
    }
    return {
      'host-name': d['host-name'],
      'system-ip': d['system-ip'],
      'site-id': d['site-id'],
      'device-type': type,
      reachability: d.reachability,
      health,
      ...(cpu !== undefined ? { cpuLoad: cpu } : {}),
      ...(mem !== undefined ? { memoryUtilization: mem } : {}),
      ...(control ? { controlConnections: control } : {}),
      ...(omp ? { ompPeers: omp } : {}),
      ...(bfd ? { bfdSessions: bfd } : {}),
      ...(tlocs ? { tlocs } : {}),
      status: problems.length ? 'problem' : 'ok',
      ...(problems.length ? { problems } : {}),
    };
  });
  const rank = (t: string) => (TYPE_ORDER.indexOf(t) + 1 || TYPE_ORDER.length + 1);
  rows.sort((a, b) => rank(a['device-type']) - rank(b['device-type']) || String(a['host-name']).localeCompare(String(b['host-name'])));
  const asCounter = ([up, total]: number[]) => ({ up, total });
  return {
    source: healthRows ? 'vManage device health (/health/devices)' : 'vManage device inventory counters',
    healthCounts,
    totals: {
      controlConnections: asCounter(totals.controlConnections),
      ompPeers: asCounter(totals.ompPeers),
      bfdSessions: asCounter(totals.bfdSessions),
      ...(healthRows ? { tlocs: asCounter(totals.tlocs) } : {}),
    },
    rows,
  };
}

/** Manager deployment (single node or cluster), tenancy, nodes and services that are down. */
function summarizeManager(
  mode: Record<string, unknown> | undefined,
  nodeList: unknown,
  serviceRows: unknown,
  tenants: Array<Record<string, unknown>> | undefined,
  tenantScope: string | undefined
) {
  const nodes = new Map<string, Record<string, unknown>>();
  for (const group of (Array.isArray(nodeList) ? nodeList : []) as Array<Record<string, any>>) {
    for (const n of (Array.isArray(group.data) ? group.data : []) as Array<Record<string, any>>) {
      const c = n.configJson ?? {};
      nodes.set(String(c.deviceIP), { 'host-name': c['host-name'], ip: c.deviceIP, state: c.state, persona: c.persona, servicesDown: [] });
    }
  }
  for (const s of (Array.isArray(serviceRows) ? serviceRows : []) as Array<Record<string, unknown>>) {
    const ip = String(s.deviceIP);
    const node = nodes.get(ip) ?? nodes.set(ip, { ip, servicesDown: [] }).get(ip)!;
    (node.servicesDown as string[]).push(...Object.entries(s).filter(([, v]) => v === false).map(([k]) => k));
  }
  const deploymentText = String(mode?.deploymentmode ?? '');
  const deployment = /cluster/i.test(deploymentText) || nodes.size > 1 ? 'cluster' : nodes.size || /single/i.test(deploymentText) ? 'single-node' : 'unknown';
  const tenancy = mode?.mode === undefined ? 'unknown' : /multi/i.test(String(mode.mode)) ? 'multi-tenant' : 'single-tenant';
  return {
    deployment,
    tenancy,
    ...(tenancy === 'multi-tenant'
      ? {
          view: tenantScope ? `tenant ${tenantScope}` : 'provider',
          ...(tenants ? { tenants: { count: tenants.length, names: tenants.slice(0, FABRIC_LIST_CAP).map((t) => t.name) } } : {}),
        }
      : {}),
    nodes: [...nodes.values()],
  };
}

/** Plain-language list of problems found across the fabric health sections. */
function healthIssues(health: Record<string, any>, errors: Record<string, string>): string[] {
  const issues: string[] = [];
  const unreachable = health.devices?.unreachableCount ?? 0;
  if (unreachable) issues.push(`${unreachable} device(s) unreachable`);
  const unhealthy = (health.devices?.withProblemsCount ?? 0) - unreachable;
  if (unhealthy > 0) issues.push(`${unhealthy} reachable device(s) with health or connectivity problems`);
  for (const [severity, n] of Object.entries((health.alarms?.bySeverity ?? {}) as Record<string, number>)) {
    if (/critical|major/i.test(severity)) issues.push(`${n} ${severity} alarm(s)`);
  }
  for (const c of (Array.isArray(health.certificates) ? health.certificates : []) as Array<Record<string, unknown>>) {
    for (const key of ['invalid', 'revoked', 'warning']) if (Number(c[key]) > 0) issues.push(`${c[key]} certificate(s) ${key}`);
  }
  const label = health.manager?.deployment === 'cluster' ? 'Manager cluster node' : 'Manager';
  for (const node of (health.manager?.nodes ?? []) as Array<Record<string, any>>) {
    if (node.state !== undefined && node.state !== 'Ready') issues.push(`${label} ${node['host-name'] ?? node.ip} is ${node.state}`);
    if (node.servicesDown?.length) issues.push(`${label} ${node['host-name'] ?? node.ip} services down: ${node.servicesDown.join(', ')}`);
  }
  for (const section of Object.keys(errors)) issues.push(`${section} could not be checked`);
  return issues;
}

/** Applies the optional filter, count_by, fields, offset and limit arguments to list rows (`data`, `items` or a top-level array). */
function selectRows(result: unknown, options: Record<string, unknown>): unknown {
  const { fields, filter, offset, limit, count_by: countBy } = options;
  if ([fields, filter, offset, limit, countBy].every((v) => v === undefined)) return result;
  if (fields !== undefined && (!Array.isArray(fields) || fields.some((f) => typeof f !== 'string'))) {
    throw new Error('fields must be an array of field names');
  }
  if (filter !== undefined && (filter === null || typeof filter !== 'object' || Array.isArray(filter))) {
    throw new Error('filter must be an object of field/value pairs');
  }
  if (offset !== undefined && !(Number.isInteger(offset) && (offset as number) >= 0)) throw new Error('offset must be a non-negative integer');
  if (limit !== undefined && !(Number.isInteger(limit) && (limit as number) > 0)) throw new Error('limit must be a positive integer');
  if (countBy !== undefined && (typeof countBy !== 'string' || !countBy)) throw new Error('count_by must be a field name');
  const container = result as Record<string, unknown>;
  const key = Array.isArray(result) ? null : Array.isArray(container?.data) ? 'data' : Array.isArray(container?.items) ? 'items' : undefined;
  if (key === undefined) return result;
  const rows = (key === null ? result : container[key]) as unknown[];

  const norm = (v: unknown) => String(v).toLowerCase();
  const conditions = Object.entries((filter ?? {}) as Record<string, unknown>).filter(([, v]) => v !== undefined && v !== null && v !== '');
  let selected = conditions.length
    ? rows.filter((row) => {
        const r = (row ?? {}) as Record<string, unknown>;
        return conditions.every(([k, v]) => k in r && (Array.isArray(v) ? v.some((x) => norm(x) === norm(r[k])) : norm(v) === norm(r[k])));
      })
    : rows;
  const meta: Record<string, unknown> = conditions.length ? { selection: { matched: selected.length, of: rows.length } } : {};
  if (countBy) {
    const counts = new Map<string, number>();
    for (const row of selected) {
      const value = String((row as Record<string, unknown> | null)?.[countBy as string] ?? '(none)');
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    selected = [...counts].sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ [countBy as string]: value, count }));
    meta.countBy = { field: countBy, rows: [...counts.values()].reduce((n, c) => n + c, 0), groups: counts.size };
  } else if (fields) {
    const wanted = fields as string[];
    selected = selected.map((row) =>
      row && typeof row === 'object'
        ? Object.fromEntries(wanted.filter((f) => f in (row as object)).map((f) => [f, (row as Record<string, unknown>)[f]]))
        : row
    );
  }
  if (offset !== undefined || limit !== undefined) {
    const start = (offset as number | undefined) ?? 0;
    const total = selected.length;
    selected = selected.slice(start, limit !== undefined ? start + (limit as number) : undefined);
    meta.page = { offset: start, returned: selected.length, total, ...(start + selected.length < total ? { nextOffset: start + selected.length } : {}) };
  }
  if (key === null) return meta.page || meta.countBy ? { ...meta, items: selected } : selected;
  return { ...container, ...meta, [key]: selected };
}

export class CatalystSdwanMCPServer {
  private server: Server;
  private config: VManageConfig;
  private apiService: VManageApiService;
  private catalog: ApiCatalog;

  constructor() {
    const config = loadConfig();
    this.config = config;
    this.apiService = new VManageApiService(config);
    this.catalog = new ApiCatalog(this.apiService, config.allowWrite);

    this.server = new Server(
      {
        name: 'catalyst-sdwan-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: { listChanged: false },
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getAllTools(),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      try {
        const { tenant, ...callArgs } = args ?? {};
        if (tenant !== undefined && (typeof tenant !== 'string' || !tenant.trim())) throw new Error('tenant must be a tenant name or ID');
        if (tenant !== undefined && !this.config.allowTenantSwitch) {
          throw new Error('Per-call tenant selection is disabled; set VMANAGE_ALLOW_TENANT_SWITCH=true or use VMANAGE_TENANT');
        }
        const { fields, filter, offset, limit, count_by, ...toolArgs } = callArgs;
        const defaultFields = name === 'list_devices' && fields === undefined && toolArgs.all_fields !== true ? DEVICE_SUMMARY_FIELDS : fields;
        const result = await this.apiService.runAsTenant(tenant as string | undefined, async () =>
          NO_ROW_OPTIONS.has(name)
            ? this.handleToolCall(name, callArgs)
            : selectRows(await this.handleToolCall(name, toolArgs), { fields: defaultFields, filter, offset, limit, count_by })
        );
        return {
          content: [{ type: 'text', text: toLimitedJson(shapeResponse(result, Number.MAX_SAFE_INTEGER)) }],
        };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text', text: `Error: ${message}` }],
          isError: true,
        };
      }
    });
  }

  private tools: Tool[] | null = null;

  private getAllTools(): Tool[] {
    const tenantOption: Record<string, object> = this.config.allowTenantSwitch
      ? {
          tenant: {
            type: 'string',
            description: `Tenant to query on a multi-tenant Manager (name, ID, org name or subdomain).${this.config.tenant ? ` Default: ${this.config.tenant}.` : ' Default: provider view.'}`,
          },
        }
      : {};
    this.tools ??= this.baseTools().map((tool) => {
      const rowOptions = NO_ROW_OPTIONS.has(tool.name) ? {} : ROW_OPTIONS;
      return { ...tool, inputSchema: { ...tool.inputSchema, properties: { ...rowOptions, ...tenantOption, ...(tool.inputSchema.properties ?? {}) } } };
    });
    return this.tools;
  }

  private baseTools(): Tool[] {
    return [
      // === Full vManage API (spec-driven, covers every 26.x operation) ===
      {
        name: 'list_api_categories',
        description:
          'List all vManage API categories (from the connected vManage OpenAPI spec) with counts of read, write and blocked operations. Start here to explore APIs not covered by a dedicated tool.',
        inputSchema: {
          type: 'object',
          properties: {
            filter: { type: 'string', description: 'Only categories containing this text (e.g. "Monitoring", "Feature Profile")' },
          },
        },
      },
      {
        name: 'search_api_operations',
        description:
          'Search every vManage API operation by keywords (matched against path, operationId, category and summary). Returns operation_id values for describe_api_operation / call_api_operation.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Space-separated keywords, all must match (e.g. "ospf neighbor", "config-group")' },
            category: { type: 'string', description: 'Filter by category name (substring)' },
            method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'], description: 'Filter by HTTP method' },
            access: { type: 'string', enum: ['read', 'write', 'blocked'], description: 'Filter by access level' },
            limit: { type: 'number', description: 'Max results (default 25, max 100)' },
          },
        },
      },
      {
        name: 'describe_api_operation',
        description:
          'Show the documented parameters, request body schema/example, access level and description for one vManage API operation.',
        inputSchema: {
          type: 'object',
          properties: {
            operation_id: { type: 'string', description: 'operationId from search_api_operations' },
          },
          required: ['operation_id'],
        },
      },
      {
        name: 'call_api_operation',
        description:
          'Call any vManage API operation by operation_id. Parameters and body are validated against the vManage OpenAPI spec. Read operations run directly; write operations require VMANAGE_ALLOW_WRITE=true on the server and confirm: true (only after the user approves the change).',
        inputSchema: {
          type: 'object',
          properties: {
            operation_id: { type: 'string', description: 'operationId from search_api_operations' },
            path_params: { type: 'object', description: 'Values for {placeholders} in the path', additionalProperties: true },
            query: { type: 'object', description: 'Query parameters (names exactly as documented)', additionalProperties: true },
            body: { description: 'Request body for POST/PUT operations (JSON)' },
            confirm: { type: 'boolean', description: 'Must be true for write operations, after explicit user approval' },
            max_items: { type: 'number', description: 'Max rows returned from list responses (default 200)' },
            all_pages: {
              type: 'boolean',
              description: 'For paged statistics operations (".../page" with scrollId): keep fetching pages until max_items rows are collected',
            },
          },
          required: ['operation_id'],
        },
      },
      // === Fabric-wide (one call, all WAN edges queried in parallel) ===
      {
        name: 'get_fabric_health',
        description:
          'One-call fabric health check with an overall status and list of issues: Manager deployment (single node or cluster, single- or multi-tenant) with node and service status, a table of every device (system IP, site, reachability, health with CPU/memory, up/total control connections, OMP peers, BFD sessions and TLOCs, and its problems), active alarms by severity and certificate status. Use this first for "is my fabric healthy?".',
        inputSchema: {
          type: 'object',
          properties: {
            detail: {
              type: 'string',
              enum: ['auto', 'all', 'problems'],
              description: `Which devices to list: all, only those with problems, or auto (all up to ${FABRIC_FULL_DETAIL_MAX} devices, otherwise problems only). Counts always cover every device.`,
            },
          },
        },
      },
      {
        name: 'get_fabric_bfd_status',
        description:
          'BFD sessions of every reachable WAN edge (or one site / selected devices) in one call, queried in parallel within a time budget: per-device session counts and the sessions that are not up, plus fabric totals. Prefer this over calling get_bfd_sessions per device. On large fabrics, scope with site_id/devices; if the result has incomplete, call again to continue.',
        inputSchema: { type: 'object', properties: { ...FABRIC_SCOPE } },
      },
      {
        name: 'get_fabric_tlocs',
        description:
          'TLOCs (WAN transports) of every reachable WAN edge (or one site / selected devices) in one call, queried in parallel within a time budget: per-device TLOC color, interface, state and public/private IP, plus totals per color and TLOCs that are not up. If the result has incomplete, call again to continue.',
        inputSchema: { type: 'object', properties: { ...FABRIC_SCOPE } },
      },

      // === Device Management ===
      {
        name: 'list_devices',
        description:
          'List all devices in the SD-WAN fabric (vEdges, vSmarts, vBonds, vManage) from a cached inventory (refreshed every 60 s). Returns hostname, system-ip, site-id, device-type, model, reachability, status, version. On large fabrics use count_by for summaries (e.g. count_by: reachability), filter to select, and offset/limit to page.',
        inputSchema: {
          type: 'object',
          properties: {
            model: { type: 'string', description: 'Filter by device model (e.g., vedge-C8000V, vsmart)' },
            all_fields: { type: 'boolean', description: 'Return every field of each device instead of the summary fields (much larger)' },
          },
        },
      },
      {
        name: 'get_device_details',
        description: 'Get detailed information for a specific device by device ID or system IP.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID (UUID) or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'list_reachable_devices',
        description: 'List devices that are currently reachable in the SD-WAN fabric.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'list_controllers',
        description: 'List vManage, vSmart, and vBond controllers in the fabric.',
        inputSchema: { type: 'object', properties: {} },
      },

      // === Real-time Monitoring - Control Plane ===
      {
        name: 'get_control_connections',
        description: 'Get control plane connection status for a device. Shows connections to vSmart/vBond.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            peer_type: { type: 'string', enum: ['vedge', 'vsmart', 'vmanage', 'vbond'], description: 'Only connections to this peer type' },
            system_ip: { type: 'string', description: 'Only connections to this peer system-ip' },
            synced: { type: 'boolean', description: 'Return vManage cached (synced) data instead of querying the device in real time' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_control_connections_history',
        description: 'Get control connection history for a device (past connection attempts, errors, and down reasons).',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_control_local_properties',
        description: 'Get control plane local properties for a device (system-ip, site-id, org name, certificate status, vBond address, max controllers).',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            synced: { type: 'boolean', description: 'Return vManage cached (synced) data instead of querying the device in real time' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_control_wan_interfaces',
        description: 'Get control plane WAN interface (TLOC) state for a device: color, public/private IP and port, control connection counts.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            synced: { type: 'boolean', description: 'Return vManage cached (synced) data instead of querying the device in real time' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_control_valid_devices',
        description: 'Get the authorized device lists held by a Controller (vSmart). Use a controller system-ip.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Controller (vSmart) system-ip' },
            list: {
              type: 'string',
              enum: ['devices', 'vsmarts', 'vmanage_id'],
              description: 'Which list to return (default: devices)',
            },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_control_affinity',
        description: 'Get controller group affinity configuration or status for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            type: { type: 'string', enum: ['config', 'status'], description: 'Affinity config or status (default: status)' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_control_links',
        description: 'Fabric-wide: list control connection links between all devices in the given state.',
        inputSchema: {
          type: 'object',
          properties: {
            state: { type: 'string', enum: ['up', 'down'], description: 'Link state' },
          },
          required: ['state'],
        },
      },
      {
        name: 'get_control_status',
        description: 'Fabric-wide: control connection up/down status counts (dashboard view).',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_control_count',
        description: 'Get fabric-wide control connection counts, optionally for one site.',
        inputSchema: {
          type: 'object',
          properties: {
            site_id: { type: 'string', description: 'Optional site ID' },
          },
        },
      },
      {
        name: 'get_control_network_summary',
        description: 'Fabric-wide: per-device control plane summary (control connections, OMP peers, vSmart peers, reachability).',
        inputSchema: {
          type: 'object',
          properties: {
            state: { type: 'string', enum: ['up', 'down'], description: 'Filter by control state' },
          },
        },
      },
      {
        name: 'get_network_connections_summary',
        description: 'Fabric-wide: reachable/unreachable counts per device class (vSmart, WAN Edge, vBond, vManage).',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_control_summary',
        description: 'Get control plane summary (device count) for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_control_statistics',
        description: 'Get control plane DTLS connection statistics for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },

      // === Real-time Monitoring - OMP ===
      {
        name: 'get_omp_peers',
        description: 'Get OMP (Overlay Management Protocol) peers for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            synced: { type: 'boolean', description: 'Return vManage cached (synced) data instead of querying the device in real time' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_omp_routes',
        description: 'Get OMP routes received or advertised by a device. Filter by VPN and/or prefix to limit output.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            direction: { type: 'string', enum: ['received', 'advertised'], description: 'Route direction (default: received)' },
            vpn_id: { type: 'string', description: 'Filter by service VPN ID (e.g. 10)' },
            prefix: { type: 'string', description: 'Filter by exact prefix (e.g. 10.10.116.1/32)' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_omp_tlocs',
        description: 'Get OMP TLOC routes received or advertised by a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            direction: { type: 'string', enum: ['received', 'advertised'], description: 'TLOC direction (default: received)' },
            color: { type: 'string', description: 'Filter by TLOC color (e.g. mpls, biz-internet)' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_omp_services',
        description: 'Get OMP service routes (VPN, firewall, IDS, etc.) known to a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_omp_multicast',
        description: 'Get OMP multicast routes or multicast auto-discovery entries for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            type: { type: 'string', enum: ['routes', 'autodiscover'], description: 'Multicast routes or auto-discovery (default: routes)' },
            direction: { type: 'string', enum: ['received', 'advertised'], description: 'Direction (default: received)' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_omp_cloudx',
        description: 'Get OMP Cloud OnRamp (CloudExpress) routes for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_omp_links',
        description: 'Fabric-wide: list OMP peering links between all devices in the given state.',
        inputSchema: {
          type: 'object',
          properties: {
            state: { type: 'string', enum: ['up', 'down'], description: 'Link state' },
          },
          required: ['state'],
        },
      },
      {
        name: 'get_omp_status',
        description: 'Fabric-wide: OMP peering up/down status counts (dashboard view).',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_omp_summary',
        description: 'Get OMP summary for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },

      // === Real-time Monitoring - Validator (vBond / orchestrator) ===
      {
        name: 'get_validator_connections',
        description: 'Get connections on a Validator (vBond), current or history. Use the validator system-ip.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Validator (vBond) system-ip' },
            history: { type: 'boolean', description: 'Return connection history instead of current connections' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_validator_summary',
        description: 'Get Validator (vBond) connection summary.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Validator (vBond) system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_validator_statistics',
        description: 'Get Validator (vBond) DTLS/control packet statistics.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Validator (vBond) system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_validator_local_properties',
        description: 'Get Validator (vBond) local properties (org name, certificate state, system-ip).',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Validator (vBond) system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_validator_valid_devices',
        description: 'Get the authorized device lists held by a Validator (vBond).',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Validator (vBond) system-ip' },
            list: {
              type: 'string',
              enum: ['vedges', 'vsmarts', 'vmanage_id'],
              description: 'Which list to return (default: vedges)',
            },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_validator_proxy_mapping',
        description: 'Get Validator (vBond) NAT/proxy mapping table.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Validator (vBond) system-ip' },
          },
          required: ['device_id'],
        },
      },

      // === Real-time Monitoring - BFD ===
      {
        name: 'get_bfd_sessions',
        description: 'Get BFD (Bidirectional Forwarding Detection) sessions for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            synced: SYNCED_OPTION,
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_bfd_summary',
        description: 'Get BFD session summary for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_bfd_tloc',
        description: 'Get BFD session summary per TLOC for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },

      // === Real-time Monitoring - Interfaces & System ===
      {
        name: 'get_device_interfaces',
        description: 'Get interface status and configuration for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            synced: SYNCED_OPTION,
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_system_status',
        description: 'Get system status (CPU, memory, uptime) for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            synced: SYNCED_OPTION,
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_device_arp',
        description: 'Get ARP table (IPv4 to MAC mappings) for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },

      // === Real-time Monitoring - Application Routing ===
      {
        name: 'get_app_route_statistics',
        description: 'Get application-aware routing statistics (tunnel stats) for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_app_route_sla_class',
        description: 'Get SLA class information for application-aware routing on a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },

      // === Real-time Monitoring - BGP ===
      {
        name: 'get_bgp_neighbors',
        description: 'Get BGP neighbors for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_bgp_routes',
        description: 'Get BGP routes for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_bgp_summary',
        description: 'Get BGP summary for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },

      // === Real-time Monitoring - Cflowd ===
      {
        name: 'get_cflowd_flows',
        description: 'Get cflowd flow information for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_cflowd_statistics',
        description: 'Get cflowd packet statistics for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },

      // === Real-time Monitoring - App Logs ===
      {
        name: 'get_app_log_flows',
        description: 'Get packet flow logging information for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_app_log_flow_count',
        description: 'Get count of packet flows being logged for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },

      // === SD-WAN Statistics ===
      {
        name: 'get_sdwan_stats',
        description: 'Get SD-WAN statistics (ACL drops, data policy, device metrics) for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },

      // === UX 2.0 configuration (configuration groups, feature profiles, policy & topology groups) ===
      {
        name: 'get_ux2_overview',
        description:
          'UX 2.0 configuration overview in one call: configuration groups, policy groups and topology groups with device counts and deployment state (up-to-date / failed / in progress), plus feature profile counts per type.',
        inputSchema: {
          type: 'object',
          properties: {
            solution: { type: 'string', description: 'Solution family (default: sdwan). Others: sd-routing, nfvirtual, mobility' },
          },
        },
      },
      {
        name: 'list_config_groups',
        description: 'List UX 2.0 configuration groups with their feature profiles, device counts and deployment state.',
        inputSchema: {
          type: 'object',
          properties: {
            solution: { type: 'string', description: 'Filter by solution (e.g. sdwan, sd-routing)' },
            name: { type: 'string', description: 'Exact configuration group name' },
          },
        },
      },
      {
        name: 'get_config_group',
        description: 'Get one configuration group (by ID or exact name) with its feature profiles and associated devices.',
        inputSchema: {
          type: 'object',
          properties: {
            config_group: { type: 'string', description: 'Configuration group ID or exact name' },
          },
          required: ['config_group'],
        },
      },
      {
        name: 'get_config_group_device_variables',
        description: 'Get device-specific variable values of a configuration group (all devices, or one device).',
        inputSchema: {
          type: 'object',
          properties: {
            config_group: { type: 'string', description: 'Configuration group ID or exact name' },
            device: { type: 'string', description: 'Optional device: hostname, system-ip, UUID or chassis number' },
          },
          required: ['config_group'],
        },
      },
      {
        name: 'preview_config_group_device_config',
        description:
          'Read-only: render the configuration a configuration group would push to one device, compared with its running configuration. Shows a line diff by default. Nothing is deployed.',
        inputSchema: {
          type: 'object',
          properties: {
            config_group: { type: 'string', description: 'Configuration group ID or exact name' },
            device: { type: 'string', description: 'Device hostname, system-ip, UUID or chassis number (must be associated with the group)' },
            view: { type: 'string', enum: ['diff', 'new', 'existing', 'both'], description: 'What to return (default: diff)' },
          },
          required: ['config_group', 'device'],
        },
      },
      {
        name: 'list_policy_groups',
        description: 'List UX 2.0 policy groups with their profiles, device counts and deployment state.',
        inputSchema: {
          type: 'object',
          properties: {
            solution: { type: 'string', description: 'Filter by solution (e.g. sdwan)' },
          },
        },
      },
      {
        name: 'get_policy_group',
        description: 'Get one policy group (by ID or exact name) with its profiles and associated devices.',
        inputSchema: {
          type: 'object',
          properties: {
            policy_group: { type: 'string', description: 'Policy group ID or exact name' },
          },
          required: ['policy_group'],
        },
      },
      {
        name: 'list_topology_groups',
        description: 'List UX 2.0 topology groups (hub-and-spoke / mesh topologies) with device counts and state.',
        inputSchema: {
          type: 'object',
          properties: {
            solution: { type: 'string', description: 'Filter by solution (e.g. sdwan)' },
          },
        },
      },
      {
        name: 'get_topology_group',
        description: 'Get one topology group (by ID or exact name) with its topology profiles.',
        inputSchema: {
          type: 'object',
          properties: {
            topology_group: { type: 'string', description: 'Topology group ID or exact name' },
          },
          required: ['topology_group'],
        },
      },
      {
        name: 'list_feature_profiles',
        description:
          'List UX 2.0 feature profiles. Without profile_type, returns every profile type of the solution (system, transport, service, cli, policy-object, application-priority, embedded-security, ...).',
        inputSchema: {
          type: 'object',
          properties: {
            solution: { type: 'string', description: 'Solution family (default: sdwan). Others: sd-routing, nfvirtual, mobility' },
            profile_type: { type: 'string', description: 'Profile type, e.g. system, transport, service, cli, policy-object, application-priority' },
          },
        },
      },
      {
        name: 'get_feature_profile',
        description:
          'Get one UX 2.0 feature profile with its features (parcels): e.g. system (AAA, banner, logging, NTP...), transport (WAN VPN, interfaces, routing), service (LAN VPNs, interfaces, routing).',
        inputSchema: {
          type: 'object',
          properties: {
            profile_type: { type: 'string', description: 'Profile type, e.g. system, transport, service, cli' },
            profile: { type: 'string', description: 'Profile ID or exact profile name' },
            solution: { type: 'string', description: 'Solution family (default: sdwan)' },
          },
          required: ['profile_type', 'profile'],
        },
      },
      {
        name: 'get_network_hierarchy',
        description: 'Get the UX 2.0 network hierarchy (global, regions, areas and sites) used by configuration groups and policies.',
        inputSchema: { type: 'object', properties: {} },
      },

      // === Templates ===
      {
        name: 'list_device_templates',
        description: 'List device templates (master templates) in vManage.',
        inputSchema: {
          type: 'object',
          properties: {
            feature: {
              type: 'string',
              enum: ['all', 'lawful-interception', 'cloud-dock', 'network-design', 'vmanage-default'],
              description: 'Template feature filter (default: all)',
            },
          },
        },
      },
      {
        name: 'list_feature_templates',
        description: 'List all feature templates in vManage.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_attached_devices',
        description: 'Get devices attached to a specific device template.',
        inputSchema: {
          type: 'object',
          properties: {
            template_id: { type: 'string', description: 'Template ID' },
          },
          required: ['template_id'],
        },
      },
      {
        name: 'get_template_definition',
        description: 'Get the definition/configuration of a device or feature template.',
        inputSchema: {
          type: 'object',
          properties: {
            template_id: { type: 'string', description: 'Template ID' },
            template_type: {
              type: 'string',
              enum: ['device', 'feature'],
              description: 'Type of template',
            },
          },
          required: ['template_id', 'template_type'],
        },
      },

      // === Policy ===
      {
        name: 'list_policy_lists',
        description: 'List policy lists (app, aspath, color, community, data-prefix, etc.).',
        inputSchema: {
          type: 'object',
          properties: {
            list_type: {
              type: 'string',
              description: 'List type, e.g. app, aspath, color, community, dataprefix, dataipv6prefix, policer, prefix, site, sla, tloc, vpn, zone (omit for all lists)',
            },
          },
        },
      },
      {
        name: 'list_policy_definitions',
        description: 'List policy definitions of one type (ACL, app-route, data, control, etc.).',
        inputSchema: {
          type: 'object',
          properties: {
            definition_type: {
              type: 'string',
              description: 'Definition type, e.g. acl, aclv6, approute, cflowd, control, data, hubandspoke, mesh, qosmap, vedgeroute, zonebasedfw',
            },
          },
          required: ['definition_type'],
        },
      },
      {
        name: 'list_policies',
        description: 'List centralized (vsmart), localized (vedge) and security policies.',
        inputSchema: {
          type: 'object',
          properties: {
            policy_type: { type: 'string', enum: ['vsmart', 'vedge', 'security'], description: 'Only this policy type (default: all three)' },
          },
        },
      },

      // === CloudExpress / Cloud OnRamp ===
      {
        name: 'get_cloudx_status',
        description: 'Get CloudExpress (Cloud OnRamp) status - sites per application.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_cloudx_gateway_list',
        description: 'Get CloudExpress gateway list.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_cloudx_client_list',
        description: 'Get CloudExpress client/site list.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_cloudx_apps',
        description: 'Get CloudExpress apps and VPNs configuration.',
        inputSchema: { type: 'object', properties: {} },
      },

      // === Administration ===
      {
        name: 'list_alarms',
        description: 'List active alarms from vManage.',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Max number of alarms to return (default 100)' },
            site_id: { type: 'string', description: 'Only alarms for this site ID' },
          },
        },
      },
      {
        name: 'get_certificate_summary',
        description: 'Get certificate validity summary for devices.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'list_vedge_inventory',
        description: 'List WAN edge inventory (authorized device list) with certificate and validity status.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_cluster_status',
        description: 'Get vManage cluster health status per node.',
        inputSchema: { type: 'object', properties: {} },
      },

      // === Custom Applications ===
      {
        name: 'list_custom_apps',
        description: 'List custom application definitions.',
        inputSchema: { type: 'object', properties: {} },
      },

      // === VPN ===
      {
        name: 'get_device_vpn',
        description: 'Get VPN configuration for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },

      // === TLOC ===
      {
        name: 'get_device_tloc',
        description: 'Get TLOC (Transport Locator) information for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },

      // === Bridge ===
      {
        name: 'get_bridge_table',
        description: 'Get bridge forwarding table for a device.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
    ];
  }

  private async handleToolCall(name: string, args: Record<string, unknown>): Promise<unknown> {
    const rawDevice = args.device_id;
    const deviceId =
      typeof rawDevice === 'string' || typeof rawDevice === 'number' ? await this.resolveDevice(String(rawDevice)) : undefined;
    const addDeviceId = (path: string) =>
      deviceId ? `${path}?deviceId=${encodeURIComponent(deviceId)}` : path;
    const deviceGet = (path: string, filters: Record<string, unknown> = {}) => {
      if (!deviceId) throw new Error('device_id is required');
      const params: Record<string, string> = { deviceId };
      for (const [k, v] of Object.entries(filters)) {
        if (v !== undefined && v !== null && v !== '') params[k] = String(v);
      }
      return this.apiService.get(path, params);
    };
    const pick = (arg: string, allowed: Record<string, string>, fallback: string) => {
      const value = (args[arg] as string | undefined) ?? fallback;
      if (!Object.hasOwn(allowed, value)) {
        throw new Error(`${arg} must be one of: ${Object.keys(allowed).join(', ')}`);
      }
      return allowed[value];
    };
    const stateParams = () => {
      const state = args.state as string | undefined;
      if (state === undefined) return undefined;
      if (state !== 'up' && state !== 'down') throw new Error('state must be up or down');
      return { state };
    };
    const requiredState = () => {
      if (args.state === undefined) throw new Error('state is required (up or down)');
      return stateParams();
    };
    const synced = args.synced === true;

    switch (name) {
      case 'list_api_categories':
        return this.catalog.categories(args.filter as string | undefined);
      case 'search_api_operations':
        return this.catalog.search({
          query: args.query as string | undefined,
          category: args.category as string | undefined,
          method: args.method as string | undefined,
          access: args.access as string | undefined,
          limit: args.limit as number | undefined,
        });
      case 'describe_api_operation':
        return this.catalog.describe(args.operation_id as string);
      case 'call_api_operation': {
        const asObject = (v: unknown, field: string) => {
          if (v === undefined || v === null) return undefined;
          if (typeof v !== 'object' || Array.isArray(v)) throw new Error(`${field} must be an object`);
          return v as Record<string, unknown>;
        };
        return this.catalog.call({
          operationId: args.operation_id as string,
          pathParams: asObject(args.path_params, 'path_params'),
          query: asObject(args.query, 'query'),
          body: args.body,
          confirm: args.confirm === true,
          maxItems: typeof args.max_items === 'number' ? args.max_items : undefined,
          allPages: args.all_pages === true,
        });
      }
      case 'list_devices': {
        const rows = await this.deviceIndex();
        const model = args.model === undefined ? undefined : String(args.model).toLowerCase();
        return { data: model === undefined ? rows : rows.filter((d) => String((d as Record<string, unknown>)['device-model']).toLowerCase() === model) };
      }
      case 'get_device_details': {
        if (!deviceId) throw new Error('device_id is required');
        const devices = await this.apiService.get<{ data?: DeviceRow[] }>('/dataservice/device', { 'system-ip': deviceId });
        return devices.data?.[0] ?? { error: 'Device not found', device_id: deviceId };
      }
      case 'list_reachable_devices':
        return this.apiService.get('/dataservice/device/reachable', undefined, REACHABLE_TTL_MS);
      case 'list_controllers':
        return this.apiService.get('/dataservice/system/device/controllers', undefined, INVENTORY_TTL_MS, INVENTORY_STALE_MS);

      case 'get_control_connections': {
        const filters: Record<string, unknown> = { 'system-ip': args.system_ip };
        if (args.peer_type !== undefined) {
          filters['peer-type'] = pick('peer_type', { vedge: 'vedge', vsmart: 'vsmart', vmanage: 'vmanage', vbond: 'vbond' }, 'vedge');
        }
        return deviceGet(`/dataservice/device/control/${synced ? 'synced/' : ''}connections`, filters);
      }
      case 'get_control_connections_history':
        return deviceGet('/dataservice/device/control/connectionshistory');
      case 'get_control_summary':
        return this.apiService.get(addDeviceId('/dataservice/device/control/summary'));
      case 'get_control_statistics':
        return this.apiService.get(addDeviceId('/dataservice/device/control/statistics'));
      case 'get_control_local_properties':
        return deviceGet(`/dataservice/device/control/${synced ? 'synced/' : ''}localproperties`);
      case 'get_control_wan_interfaces':
        return deviceGet(`/dataservice/device/control/${synced ? 'synced/' : ''}waninterface`);
      case 'get_control_valid_devices':
        return deviceGet(
          `/dataservice/device/control/${pick('list', { devices: 'validdevices', vsmarts: 'validvsmarts', vmanage_id: 'validvmanageid' }, 'devices')}`
        );
      case 'get_control_affinity':
        return deviceGet(
          `/dataservice/device/control/affinity/${pick('type', { config: 'config', status: 'status' }, 'status')}`
        );
      case 'get_control_links':
        return this.apiService.get('/dataservice/device/control/links', requiredState());
      case 'get_control_status':
        return this.apiService.get('/dataservice/device/control/status');
      case 'get_control_count': {
        const params: Record<string, string> = { isCached: 'true' };
        if (args.site_id !== undefined) params['site-id'] = String(args.site_id);
        return this.apiService.get('/dataservice/device/control/count', params);
      }
      case 'get_control_network_summary': {
        const state = stateParams();
        if (state) return this.apiService.get('/dataservice/device/control/networksummary', state);
        // Without a state filter vManage returns no rows, so merge both states.
        const [up, down] = await Promise.all(
          ['up', 'down'].map((s) =>
            this.apiService.get<{ data?: unknown[] }>('/dataservice/device/control/networksummary', { state: s })
          )
        );
        return { ...up, data: [...(up.data ?? []), ...(down.data ?? [])] };
      }
      case 'get_network_connections_summary':
        return this.apiService.get('/dataservice/network/connectionssummary');

      case 'get_omp_peers':
        return deviceGet(`/dataservice/device/omp/${synced ? 'synced/' : ''}peers`);
      case 'get_omp_routes':
        return filterRows(
          await deviceGet(
            `/dataservice/device/omp/routes/${pick('direction', { received: 'received', advertised: 'advertised' }, 'received')}`
          ),
          { 'vpn-id': args.vpn_id, prefix: args.prefix }
        );
      case 'get_omp_tlocs':
        return filterRows(
          await deviceGet(
            `/dataservice/device/omp/tlocs/${pick('direction', { received: 'received', advertised: 'advertised' }, 'received')}`
          ),
          { color: args.color }
        );
      case 'get_omp_services':
        return deviceGet('/dataservice/device/omp/services');
      case 'get_omp_multicast': {
        const prefix = pick('type', { routes: 'mcastroutes', autodiscover: 'mcastautodiscover' }, 'routes');
        const suffix = pick('direction', { received: 'recv', advertised: 'advt' }, 'received');
        return deviceGet(`/dataservice/device/omp/${prefix}${suffix}`);
      }
      case 'get_omp_cloudx':
        return deviceGet('/dataservice/device/omp/cloudx');
      case 'get_omp_links':
        return this.apiService.get('/dataservice/device/omp/links', requiredState());
      case 'get_omp_status':
        return this.apiService.get('/dataservice/device/omp/status');
      case 'get_omp_summary':
        return this.apiService.get(addDeviceId('/dataservice/device/omp/summary'));

      case 'get_validator_connections':
        return deviceGet(
          `/dataservice/device/orchestrator/${args.history === true ? 'connectionshistory' : 'connections'}`
        );
      case 'get_validator_summary':
        return deviceGet('/dataservice/device/orchestrator/summary');
      case 'get_validator_statistics':
        return deviceGet('/dataservice/device/orchestrator/statistics');
      case 'get_validator_local_properties':
        return deviceGet('/dataservice/device/orchestrator/localproperties');
      case 'get_validator_valid_devices':
        return deviceGet(
          `/dataservice/device/orchestrator/${pick('list', { vedges: 'validvedges', vsmarts: 'validvsmarts', vmanage_id: 'validvmanageid' }, 'vedges')}`
        );
      case 'get_validator_proxy_mapping':
        return deviceGet('/dataservice/device/orchestrator/proxymapping');

      case 'get_bfd_sessions':
        return synced
          ? deviceGet('/dataservice/device/bfd/synced/sessions')
          : this.apiService.get(addDeviceId('/dataservice/device/bfd/sessions'));
      case 'get_bfd_summary':
        return this.apiService.get(addDeviceId('/dataservice/device/bfd/summary'));
      case 'get_bfd_tloc':
        return this.apiService.get(addDeviceId('/dataservice/device/bfd/tloc'));

      case 'get_device_interfaces':
        return synced
          ? deviceGet('/dataservice/device/interface/synced')
          : this.apiService.get(addDeviceId('/dataservice/device/interface'));
      case 'get_system_status':
        return synced
          ? deviceGet('/dataservice/device/system/synced/status')
          : this.apiService.get(addDeviceId('/dataservice/device/system/status'));
      case 'get_device_arp':
        return this.apiService.get(addDeviceId('/dataservice/device/arp'));

      case 'get_app_route_statistics':
        return this.apiService.get(addDeviceId('/dataservice/device/app-route/statistics'));
      case 'get_app_route_sla_class':
        return this.apiService.get(addDeviceId('/dataservice/device/app-route/sla-class'));

      case 'get_bgp_neighbors':
        return this.apiService.get(addDeviceId('/dataservice/device/bgp/neighbors'));
      case 'get_bgp_routes':
        return this.apiService.get(addDeviceId('/dataservice/device/bgp/routes'));
      case 'get_bgp_summary':
        return this.apiService.get(addDeviceId('/dataservice/device/bgp/summary'));

      case 'get_cflowd_flows':
        return this.apiService.get(addDeviceId('/dataservice/device/cflowd/flows'));
      case 'get_cflowd_statistics':
        return this.apiService.get(addDeviceId('/dataservice/device/cflowd/statistics'));

      case 'get_app_log_flows':
        return this.apiService.get(addDeviceId('/dataservice/device/app/log/flows'));
      case 'get_app_log_flow_count':
        return this.apiService.get(addDeviceId('/dataservice/device/app/log/flow-count'));

      case 'get_sdwan_stats':
        return this.apiService.get(addDeviceId('/dataservice/device/sdwan-stats'));

      case 'list_device_templates':
        return this.apiService.get('/dataservice/template/device', {
          feature: pick(
            'feature',
            {
              all: 'all',
              'lawful-interception': 'lawful-interception',
              'cloud-dock': 'cloud-dock',
              'network-design': 'network-design',
              'vmanage-default': 'vmanage-default',
            },
            'all'
          ),
        });
      case 'list_feature_templates':
        return this.apiService.get('/dataservice/template/feature');
      case 'get_attached_devices': {
        const templateId = args.template_id as string;
        if (!templateId) throw new Error('template_id is required');
        return this.apiService.get(
          `/dataservice/template/device/config/attached/${encodeURIComponent(templateId)}`
        );
      }
      case 'get_template_definition': {
        const templateId = args.template_id as string;
        const templateType = args.template_type as string;
        if (!templateId || !templateType) throw new Error('template_id and template_type required');
        const path =
          templateType === 'device'
            ? `/dataservice/template/device/object/${encodeURIComponent(templateId)}`
            : `/dataservice/template/feature/object/${encodeURIComponent(templateId)}`;
        return this.apiService.get(path);
      }

      case 'list_policy_lists': {
        const listType = args.list_type as string | undefined;
        if (!listType) return this.apiService.get('/dataservice/template/policy/list');
        if (!POLICY_LIST_TYPES.includes(listType)) {
          throw new Error(`list_type must be one of: ${POLICY_LIST_TYPES.join(', ')}`);
        }
        return this.apiService.get(`/dataservice/template/policy/list/${listType}`);
      }
      case 'list_policy_definitions': {
        const defType = args.definition_type as string | undefined;
        if (!defType || !POLICY_DEFINITION_TYPES.includes(defType)) {
          throw new Error(`definition_type is required and must be one of: ${POLICY_DEFINITION_TYPES.join(', ')}`);
        }
        return this.apiService.get(`/dataservice/template/policy/definition/${defType}`);
      }
      case 'list_policies': {
        const types = ['vsmart', 'vedge', 'security'];
        const policyType = args.policy_type as string | undefined;
        if (policyType && !types.includes(policyType)) {
          throw new Error(`policy_type must be one of: ${types.join(', ')}`);
        }
        const selected = policyType ? [policyType] : types;
        const results = await Promise.all(
          selected.map((t) => this.apiService.get<{ data?: unknown }>(`/dataservice/template/policy/${t}`))
        );
        return Object.fromEntries(selected.map((t, i) => [t, results[i].data ?? results[i]]));
      }

      case 'get_cloudx_status':
        return this.apiService.get('/dataservice/template/cloudx');
      case 'get_cloudx_gateway_list':
        return this.apiService.get('/dataservice/template/cloudx/gatewaylist');
      case 'get_cloudx_client_list':
        return this.apiService.get('/dataservice/template/cloudx/clientlist');
      case 'get_cloudx_apps':
        return this.apiService.get('/dataservice/template/cloudx/manage/apps');

      case 'list_alarms': {
        const limit = Math.min(Math.max(Number(args.limit) || 100, 1), 1000);
        const params = args.site_id !== undefined ? { 'site-id': String(args.site_id) } : undefined;
        const result = await this.apiService.get<{ data?: unknown[] }>('/dataservice/alarms', params);
        if (Array.isArray(result.data) && result.data.length > limit) {
          return { ...result, data: result.data.slice(0, limit), truncated: { returned: limit, total: result.data.length } };
        }
        return result;
      }
      case 'get_certificate_summary':
        return this.apiService.get('/dataservice/certificate/stats/summary');
      case 'list_vedge_inventory':
        return this.apiService.get('/dataservice/device/vedgeinventory/detail', undefined, INVENTORY_TTL_MS, INVENTORY_STALE_MS);
      case 'get_cluster_status':
        return this.apiService.get('/dataservice/clusterManagement/health/status');

      case 'list_custom_apps':
        return this.apiService.get('/dataservice/template/policy/customapp');

      case 'get_device_vpn':
        return this.apiService.get(addDeviceId('/dataservice/device/vpn'));
      case 'get_device_tloc':
        return this.apiService.get(addDeviceId('/dataservice/device/tloc'));
      case 'get_bridge_table':
        return this.apiService.get(addDeviceId('/dataservice/device/bridge/table'));

      case 'get_ux2_overview': {
        const solution = String(args.solution ?? 'sdwan');
        const types = await this.featureProfileTypesFor(solution);
        const [configGroups, policyGroups, topologyGroups, ...profileLists] = await Promise.all([
          this.listGroups('config-group', solution),
          this.listGroups('policy-group', solution),
          this.listGroups('topology-group', solution),
          ...types.map((t) =>
            this.apiService
              .get<unknown[]>(`/dataservice/v1/feature-profile/${solution}/${t}`, undefined, GROUP_LIST_TTL_MS)
              .then((r) => (Array.isArray(r) ? r.length : 0))
              .catch(() => null)
          ),
        ]);
        return {
          solution,
          configGroups: configGroups.map(summarizeGroup),
          policyGroups: policyGroups.map(summarizeGroup),
          topologyGroups: topologyGroups.map(summarizeGroup),
          featureProfileCounts: Object.fromEntries(types.map((t, i) => [t, profileLists[i]])),
        };
      }
      case 'list_config_groups':
      case 'list_policy_groups':
      case 'list_topology_groups': {
        const kind = name === 'list_config_groups' ? 'config-group' : name === 'list_policy_groups' ? 'policy-group' : 'topology-group';
        const groups = await this.listGroups(kind, args.solution as string | undefined, args.name as string | undefined);
        return groups.map(summarizeGroup);
      }
      case 'get_config_group':
      case 'get_policy_group': {
        const kind = name === 'get_config_group' ? 'config-group' : 'policy-group';
        const group = await this.findGroup(kind, args[kind === 'config-group' ? 'config_group' : 'policy_group']);
        const base = `/dataservice/v1/${kind}/${encodeURIComponent(group.id)}`;
        const [detail, association] = await Promise.all([
          this.apiService.get<Record<string, unknown>>(base),
          this.apiService.get<Record<string, unknown>>(`${base}/device/associate`).catch((e: Error) => ({ error: e.message })),
        ]);
        return { ...detail, associatedDevices: (association as { devices?: unknown }).devices ?? association };
      }
      case 'get_config_group_device_variables': {
        const group = await this.findGroup('config-group', args.config_group);
        const query: Record<string, string> = {};
        if (args.device !== undefined) query['device-id'] = await this.resolveDeviceUuid(String(args.device));
        return this.apiService.get(`/dataservice/v1/config-group/${encodeURIComponent(group.id)}/device/variables`, query);
      }
      case 'preview_config_group_device_config': {
        const view = pick('view', { diff: 'diff', new: 'new', existing: 'existing', both: 'both' }, 'diff');
        const group = await this.findGroup('config-group', args.config_group);
        const uuid = await this.resolveDeviceUuid(String(args.device ?? ''));
        // Read-only render on vManage (POST with an empty body); it does not deploy anything.
        const preview = (
          await this.apiService.request(
            'POST',
            `/dataservice/v1/config-group/${encodeURIComponent(group.id)}/device/${encodeURIComponent(uuid)}/preview`,
            { body: {} }
          )
        ).body as { newConfig?: string; existingConfig?: string; [key: string]: unknown };
        const { newConfig = '', existingConfig = '', ...meta } = preview ?? {};
        if (view === 'new') return { configGroup: group.name, device: uuid, ...meta, newConfig };
        if (view === 'existing') return { configGroup: group.name, device: uuid, ...meta, existingConfig };
        if (view === 'both') return { configGroup: group.name, device: uuid, ...meta, newConfig, existingConfig };
        return { configGroup: group.name, device: uuid, ...meta, ...lineDiff(existingConfig, newConfig) };
      }
      case 'get_topology_group': {
        const group = await this.findGroup('topology-group', args.topology_group);
        return this.apiService.get(`/dataservice/v1/topology-group/${encodeURIComponent(group.id)}`);
      }
      case 'list_feature_profiles': {
        const solution = String(args.solution ?? 'sdwan');
        const types = await this.featureProfileTypesFor(solution);
        const selected = args.profile_type === undefined ? types : [this.checkProfileType(types, solution, args.profile_type)];
        const lists = await Promise.all(
          selected.map((t) =>
            this.apiService
              .get<Array<Record<string, unknown>>>(`/dataservice/v1/feature-profile/${solution}/${t}`, undefined, GROUP_LIST_TTL_MS)
              .then((rows) => (Array.isArray(rows) ? rows.map(summarizeProfile) : rows))
              .catch((e: Error) => ({ error: e.message }))
          )
        );
        return Object.fromEntries(selected.map((t, i) => [t, lists[i]]));
      }
      case 'get_feature_profile': {
        const solution = String(args.solution ?? 'sdwan');
        const type = this.checkProfileType(await this.featureProfileTypesFor(solution), solution, args.profile_type);
        const listPath = `/dataservice/v1/feature-profile/${solution}/${type}`;
        const ref = String(args.profile ?? '').trim();
        if (!ref) throw new Error('profile is required (profile ID or name)');
        let profileId = ref;
        if (!UUID.test(ref)) {
          const rows = await this.apiService.get<Array<Record<string, unknown>>>(listPath, undefined, GROUP_LIST_TTL_MS);
          const match = rows.find((p) => String(p.profileName).toLowerCase() === ref.toLowerCase());
          if (!match) {
            throw new Error(`No ${solution} ${type} profile named "${ref}". Available: ${rows.map((p) => p.profileName).join(', ') || 'none'}`);
          }
          profileId = String(match.profileId);
        }
        const withDetails = await this.catalog.hasQueryParam(`/v1/feature-profile/${solution}/${type}/{id}`, 'details');
        return this.apiService.get(`${listPath}/${encodeURIComponent(profileId)}`, withDetails ? { details: 'true' } : undefined);
      }
      case 'get_network_hierarchy':
        return this.apiService.get('/dataservice/v1/network-hierarchy');

      case 'get_fabric_health': {
        if (args.detail !== undefined && !['auto', 'all', 'problems'].includes(String(args.detail))) {
          throw new Error('detail must be one of: auto, all, problems');
        }
        const get = (path: string) => this.apiService.get(path, undefined, FABRIC_HEALTH_TTL_MS);
        // The dashboard status widgets often report 0 up / 0 down, so counts come per device instead.
        const inventory = this.deviceIndex();
        const deviceHealth = (get('/dataservice/health/devices') as Promise<{ devices?: Array<Record<string, unknown>> }>)
          .then((b) => (Array.isArray(b?.devices) ? b.devices : undefined))
          .catch(() => undefined);
        const sections: Record<string, Promise<unknown>> = {
          manager: this.managerDeployment(get),
          devices: Promise.all([inventory, deviceHealth]).then(([inv, h]) => {
            const { total, byType } = summarizeDevices(inv);
            const { rows, ...table } = deviceHealthTable(inv, h);
            const problems = rows.filter((r) => r.status === 'problem');
            const detail = String(args.detail ?? 'auto');
            const all = detail === 'all' || (detail === 'auto' && rows.length <= FABRIC_FULL_DETAIL_MAX);
            const listed = (all ? rows : problems).slice(0, FABRIC_LIST_CAP);
            return {
              total,
              byType,
              ...table,
              unreachableCount: rows.filter((r) => r.reachability !== 'reachable').length,
              withProblemsCount: problems.length,
              listed: all ? 'all devices' : 'devices with problems only (detail: "all" lists every device)',
              ...(listed.length < (all ? rows : problems).length ? { listTruncatedAt: FABRIC_LIST_CAP } : {}),
              rows: listed,
            };
          }),
          alarms: (get('/dataservice/alarms') as Promise<{ data?: Array<Record<string, unknown>> }>).then((b) => {
            const rows = b.data ?? [];
            const bySeverity: Record<string, number> = {};
            for (const a of rows) bySeverity[String(a.severity ?? 'unknown')] = (bySeverity[String(a.severity ?? 'unknown')] ?? 0) + 1;
            return { total: rows.length, bySeverity };
          }),
          certificates: get('/dataservice/certificate/stats/summary').then(dataOf),
        };
        const names = Object.keys(sections);
        const settled = await Promise.allSettled(Object.values(sections));
        const health: Record<string, unknown> = {};
        const errors: Record<string, string> = {};
        settled.forEach((r, i) => {
          if (r.status === 'fulfilled') health[names[i]] = r.value;
          else errors[names[i]] = errorMessage(r.reason);
        });
        if (Object.keys(errors).length === names.length) throw new Error(`Fabric health unavailable: ${Object.values(errors)[0]}`);
        const issues = healthIssues(health, errors);
        return { status: issues.length ? 'degraded' : 'healthy', issues, ...health, ...(Object.keys(errors).length ? { errors } : {}) };
      }
      case 'get_fabric_bfd_status': {
        const scope = await this.fabricEdges(args);
        const realTime = this.realTimeFor(args, scope.edges);
        const summarize = (live: boolean) => (rows: Array<Record<string, unknown>>) => {
          const notUp = rows.filter((r) => String(r.state).toLowerCase() !== 'up');
          const syncedAt = Math.max(0, ...rows.map((r) => Number(r.lastupdated) || 0));
          return {
            ...(!live && syncedAt ? { syncedAt: new Date(syncedAt).toISOString() } : {}),
            sessions: rows.length,
            up: rows.length - notUp.length,
            notUp: notUp.length,
            notUpSessions: notUp.map((r) => ({
              remoteSystemIp: r['system-ip'],
              remoteSiteId: r['site-id'],
              localColor: r['local-color'],
              remoteColor: r.color,
              state: r.state,
            })),
          };
        };
        const path = '/dataservice/device/bfd/sessions';
        const { devices, incomplete } = await this.perEdge(scope.edges, realTime ? path : path.replace('/sessions', '/synced/sessions'), realTime, args, summarize(realTime));
        let rechecked = 0;
        if (!realTime) {
          // Cached sessions may lag the device, so problems are confirmed live before they are reported.
          const suspect = new Set(devices.filter((d) => Number(d.notUp) > 0).map((d) => d['system-ip']));
          if (suspect.size && suspect.size <= FABRIC_REALTIME_AUTO_MAX) {
            const live = await this.perEdge(scope.edges.filter((e) => suspect.has(e['system-ip'])), path, true, args, summarize(true));
            for (const l of live.devices) {
              if (l.error) continue;
              devices[devices.findIndex((d) => d['system-ip'] === l['system-ip'])] = { ...l, verifiedLive: true };
              rechecked++;
            }
          }
        }
        const syncedTimes = devices.map((d) => Date.parse(String(d.syncedAt))).filter((t) => t > 0);
        const sum = (key: string) => devices.reduce((n, d) => n + (Number(d[key]) || 0), 0);
        const edgesNotUp = devices.filter((d) => Number(d.notUp) > 0).map((d) => d['host-name']);
        return {
          summary: {
            source: realTime
              ? 'real-time device query'
              : `vManage cached (synced) data${rechecked ? `; ${rechecked} edge(s) with sessions not up re-checked in real time` : ''}`,
            ...(syncedTimes.length ? { syncedDataAsOf: new Date(Math.min(...syncedTimes)).toISOString() } : {}),
            edgesSelected: scope.edges.length,
            edgesQueried: devices.length,
            sessions: sum('sessions'),
            up: sum('up'),
            notUp: sum('notUp'),
            edgesWithSessionsNotUpCount: edgesNotUp.length,
            edgesWithSessionsNotUp: edgesNotUp.slice(0, FABRIC_LIST_CAP),
            edgesWithErrors: devices.filter((d) => d.error).length,
          },
          ...(incomplete ? { incomplete } : {}),
          ...scope.skippedView,
          ...this.fabricDetail(devices, args, (d) => Number(d.notUp) > 0),
        };
      }
      case 'get_fabric_tlocs': {
        const scope = await this.fabricEdges(args);
        const realTime = this.realTimeFor(args, scope.edges);
        const { devices, incomplete } = await this.perEdge(scope.edges, `/dataservice/device/control/${realTime ? '' : 'synced/'}waninterface`, realTime, args, (rows) => ({
          tlocCount: rows.length,
          tlocs: rows.map((r) => ({
            color: r.color,
            interface: r.interface,
            state: r['operation-state'],
            adminState: r['admin-state'],
            publicIp: r['public-ip'],
            privateIp: r['private-ip'],
            controllers: r['num-vsmarts'],
            managers: r['num-vmanages'],
            lastResort: r['last-resort'],
          })),
        }));
        const byColor: Record<string, number> = {};
        const notUp: Array<Record<string, unknown>> = [];
        for (const d of devices) {
          for (const t of (d.tlocs as Array<Record<string, unknown>> | undefined) ?? []) {
            byColor[String(t.color)] = (byColor[String(t.color)] ?? 0) + 1;
            if (String(t.state).toLowerCase() !== 'up') notUp.push({ 'host-name': d['host-name'], color: t.color, interface: t.interface, state: t.state });
          }
        }
        return {
          summary: {
            source: realTime ? 'real-time device query' : 'vManage cached (synced) data',
            edgesSelected: scope.edges.length,
            edgesQueried: devices.length,
            tlocs: devices.reduce((n, d) => n + (Number(d.tlocCount) || 0), 0),
            byColor,
            notUpCount: notUp.length,
            notUp: notUp.slice(0, FABRIC_LIST_CAP),
            edgesWithErrors: devices.filter((d) => d.error).length,
          },
          ...(incomplete ? { incomplete } : {}),
          ...scope.skippedView,
          ...this.fabricDetail(devices, args, (d) =>
            ((d.tlocs as Array<Record<string, unknown>> | undefined) ?? []).some((t) => String(t.state).toLowerCase() !== 'up')
          ),
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  /** allowStale: answer name lookups from an older copy while it refreshes in the background. */
  private async deviceIndex(allowStale = false): Promise<DeviceRow[]> {
    const body = await this.apiService.get<{ data?: DeviceRow[] }>(
      '/dataservice/device',
      undefined,
      DEVICE_INDEX_TTL_MS,
      allowStale ? DEVICE_INDEX_STALE_MS : undefined
    );
    return body.data ?? [];
  }

  /** synced decides when given; otherwise small selections are queried in real time. */
  private realTimeFor(args: Record<string, unknown>, edges: DeviceRow[]): boolean {
    return args.synced === undefined ? edges.length <= FABRIC_REALTIME_AUTO_MAX : args.synced === false;
  }

  /** Detects single-node vs cluster and single- vs multi-tenant Manager, with node and service status. */
  private async managerDeployment(get: (path: string) => Promise<unknown>) {
    const [mode, list, services] = await Promise.allSettled([
      get('/dataservice/clusterManagement/tenancy/mode').then(dataOf),
      get('/dataservice/clusterManagement/list').then(dataOf),
      get('/dataservice/clusterManagement/health/status').then(dataOf),
    ]);
    if (mode.status === 'rejected' && list.status === 'rejected' && services.status === 'rejected') throw mode.reason;
    const value = <T>(r: PromiseSettledResult<unknown>) => (r.status === 'fulfilled' ? (r.value as T) : undefined);
    const modeValue = value<Record<string, unknown>>(mode);
    const tenantScope = this.apiService.currentTenant();
    let tenants: Array<Record<string, unknown>> | undefined;
    if (/multi/i.test(String(modeValue?.mode ?? '')) && !tenantScope) {
      tenants = await get('/dataservice/tenant')
        .then((b) => dataOf(b) as Array<Record<string, unknown>>)
        .then((rows) => (Array.isArray(rows) ? rows : undefined))
        .catch(() => undefined);
    }
    return summarizeManager(modeValue, value(list), value(services), tenants, tenantScope);
  }

  /** WAN edges selected by site_id / devices; unreachable ones are reported instead of queried. */
  private async fabricEdges(args: Record<string, unknown>): Promise<{ edges: DeviceRow[]; skippedView: Record<string, unknown> }> {
    if (args.detail !== undefined && !['auto', 'all', 'problems'].includes(String(args.detail))) {
      throw new Error('detail must be one of: auto, all, problems');
    }
    if (args.max_wait_seconds !== undefined && !(Number(args.max_wait_seconds) > 0)) {
      throw new Error('max_wait_seconds must be a positive number');
    }
    let rows = (await this.deviceIndex(true)).filter((d) => d['device-type'] === 'vedge');
    if (args.site_id !== undefined) rows = rows.filter((d) => String(d['site-id']) === String(args.site_id));
    if (args.devices !== undefined) {
      const list = args.devices;
      if (!Array.isArray(list) || !list.length || list.some((d) => typeof d !== 'string')) {
        throw new Error('devices must be a non-empty array of hostnames or system IPs');
      }
      const wanted = new Set((await Promise.all(list.map((d: string) => this.findDevice(d)))).map((d) => d['system-ip']));
      rows = rows.filter((d) => wanted.has(d['system-ip']));
    }
    const edges = rows.filter((d) => d.reachability === 'reachable' && d['system-ip']);
    const limit = args.synced === false ? Math.min(MAX_REALTIME_FABRIC_DEVICES, this.config.fabricMaxDevices) : this.config.fabricMaxDevices;
    if (edges.length > limit) {
      throw new Error(
        `${edges.length} reachable WAN edges selected (limit ${limit}${args.synced === false ? ' for real-time queries; use synced data or' : ';'} narrow the query with site_id or devices)`
      );
    }
    const skipped = rows
      .filter((d) => !edges.includes(d))
      .map((d) => ({ 'host-name': d['host-name'], 'system-ip': d['system-ip'], 'site-id': d['site-id'], reachability: d.reachability }));
    const skippedView: Record<string, unknown> = { skippedUnreachable: skipped.slice(0, FABRIC_LIST_CAP) };
    if (skipped.length > FABRIC_LIST_CAP) skippedView.skippedUnreachableCount = skipped.length;
    return { edges, skippedView };
  }

  /** Lists every device on small selections, otherwise only those with problems or errors. */
  private fabricDetail(
    devices: Array<Record<string, unknown>>,
    args: Record<string, unknown>,
    hasProblem: (d: Record<string, unknown>) => boolean
  ): { devicesListed: string; devices: Array<Record<string, unknown>> } {
    const detail = String(args.detail ?? 'auto');
    const all = detail === 'all' || (detail === 'auto' && devices.length <= FABRIC_FULL_DETAIL_MAX);
    return all
      ? { devicesListed: 'all', devices }
      : { devicesListed: 'with problems or errors only (detail: "all" lists every device)', devices: devices.filter((d) => d.error || hasProblem(d)) };
  }

  /**
   * Queries every edge through a fixed pool of workers, within a time budget. Devices not reached in time are
   * reported under `incomplete`; results are cached briefly, so calling again continues where this call stopped.
   * A run of overload errors stops the sweep instead of adding load to a struggling Manager.
   */
  private async perEdge(
    edges: DeviceRow[],
    path: string,
    realTime: boolean,
    args: Record<string, unknown>,
    summarize: (rows: Array<Record<string, unknown>>) => Record<string, unknown>
  ): Promise<{ devices: Array<Record<string, unknown>>; incomplete?: Record<string, unknown> }> {
    const budgetMs =
      args.max_wait_seconds !== undefined ? Math.min(Number(args.max_wait_seconds), FABRIC_MAX_WAIT_CAP_S) * 1000 : this.config.fabricDeadlineMs;
    const deadline = Date.now() + budgetMs;
    const ttl = realTime ? FABRIC_REALTIME_TTL_MS : FABRIC_SYNCED_TTL_MS;
    const base = (d: DeviceRow) => ({ 'host-name': d['host-name'], 'system-ip': d['system-ip'], 'site-id': d['site-id'] });
    const results: Array<Record<string, unknown> | undefined> = new Array(edges.length);
    let next = 0;
    let overloadStreak = 0;
    let stopReason: string | undefined;

    const worker = async () => {
      while (!stopReason && next < edges.length && Date.now() < deadline) {
        const i = next++;
        const d = edges[i];
        try {
          const body = await this.apiService.get<{ data?: Array<Record<string, unknown>> }>(path, { deviceId: d['system-ip'] as string }, ttl);
          results[i] = { ...base(d), ...summarize(body.data ?? []) };
          overloadStreak = 0;
        } catch (err) {
          results[i] = { ...base(d), error: errorMessage(err) };
          if (isOverload(err) && ++overloadStreak >= FABRIC_BREAKER_FAILURES) {
            stopReason = `stopped after ${FABRIC_BREAKER_FAILURES} consecutive overload errors to protect vManage (${errorMessage(err)})`;
          }
        }
      }
    };
    const width = Math.min(realTime ? this.config.fabricRealtimeConcurrency : this.config.fabricConcurrency, edges.length);
    let timer: NodeJS.Timeout | undefined;
    await Promise.race([
      Promise.all(Array.from({ length: width }, worker)),
      new Promise<void>((resolve) => (timer = setTimeout(resolve, budgetMs))),
    ]);
    clearTimeout(timer);

    const done = results.slice();
    const devices = done.filter((r): r is Record<string, unknown> => r !== undefined);
    const missing = edges.filter((_, i) => done[i] === undefined).map(base);
    if (!missing.length) return { devices };
    return {
      devices,
      incomplete: {
        notQueried: missing.length,
        reason: stopReason ?? `time budget of ${budgetMs / 1000} s reached`,
        hint: `Call again within ${ttl / 1000} s to continue: finished devices are reused, so only the remaining ones are queried. Or narrow with site_id/devices, or raise max_wait_seconds.`,
        devices: missing.slice(0, FABRIC_LIST_CAP),
      },
    };
  }

  private async findDevice(input: string): Promise<DeviceRow> {
    const value = input.trim();
    const lower = value.toLowerCase();
    const matches = (d: DeviceRow) =>
      d['system-ip'] === value || d['host-name']?.toLowerCase() === lower || d.uuid === value || d['board-serial'] === value;
    let rows = await this.deviceIndex(true);
    let hit = rows.find(matches);
    if (!hit) {
      // The older copy may predate a newly added device.
      rows = await this.deviceIndex();
      hit = rows.find(matches);
    }
    if (hit) return hit;
    const similar = rows
      .filter((d) => d['host-name']?.toLowerCase().includes(lower))
      .slice(0, 5)
      .map((d) => `${d['host-name']} (${d['system-ip']})`);
    throw new Error(
      `Unknown device "${input}".${similar.length ? ` Did you mean: ${similar.join(', ')}?` : ' Use list_devices to see hostnames and system IPs.'}`
    );
  }

  /** Accepts a system IP, hostname, UUID or serial number and returns the system IP that vManage expects. */
  private async resolveDevice(input: string): Promise<string> {
    const value = input.trim();
    if (IPV4.test(value)) return value;
    const device = await this.findDevice(value);
    if (!device['system-ip']) throw new Error(`Device "${input}" has no system IP yet`);
    return device['system-ip'];
  }

  /** UX 2.0 APIs identify devices by UUID (chassis number). */
  private async resolveDeviceUuid(input: string): Promise<string> {
    const device = await this.findDevice(input);
    if (!device.uuid) throw new Error(`Device "${input}" has no UUID`);
    return device.uuid;
  }

  private async listGroups(kind: 'config-group' | 'policy-group' | 'topology-group', solution?: string, groupName?: string): Promise<UxGroup[]> {
    const query: Record<string, string> = {};
    if (solution) query.solution = solution;
    if (groupName && kind === 'config-group') query.name = groupName;
    const rows = await this.apiService.get<UxGroup[]>(`/dataservice/v1/${kind}`, query, GROUP_LIST_TTL_MS);
    return Array.isArray(rows) ? rows : [];
  }

  private async findGroup(kind: 'config-group' | 'policy-group' | 'topology-group', ref: unknown): Promise<UxGroup> {
    const value = String(ref ?? '').trim();
    if (!value) throw new Error(`${kind.replace('-', '_')} is required (ID or name)`);
    const groups = await this.listGroups(kind);
    const match = groups.find((g) => g.id === value || g.name?.toLowerCase() === value.toLowerCase());
    if (!match) {
      throw new Error(`No ${kind} "${value}". Available: ${groups.map((g) => g.name).join(', ') || 'none'}`);
    }
    return match;
  }

  private async featureProfileTypesFor(solution: string): Promise<string[]> {
    const types = await this.catalog.featureProfileTypes(solution);
    if (!types.length) {
      const solutions = await this.catalog.featureProfileSolutions();
      throw new Error(`Unknown solution "${solution}". Available: ${solutions.join(', ')}`);
    }
    return types;
  }

  private checkProfileType(types: string[], solution: string, value: unknown): string {
    const type = String(value ?? '').trim();
    if (!types.includes(type)) {
      throw new Error(`profile_type must be one of (${solution}): ${types.join(', ')}`);
    }
    return type;
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Cisco Catalyst SD-WAN MCP Server running on stdio');
    // Warm the API catalog, login and device index in the background so the first calls are fast.
    this.catalog.load().catch((err) => console.error(`API catalog preload failed: ${err instanceof Error ? err.message : err}`));
    this.deviceIndex().catch((err) => console.error(`Device index preload failed: ${err instanceof Error ? err.message : err}`));
  }

  async shutdown(): Promise<void> {
    await this.apiService.logout();
    await this.server.close().catch(() => undefined);
  }
}
