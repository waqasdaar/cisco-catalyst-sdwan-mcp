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
import { loadConfig } from './utils/config.js';

const MAX_RESPONSE_CHARS = 200_000;

/** Serializes a result within MAX_RESPONSE_CHARS, dropping list rows rather than breaking the JSON. */
function toLimitedJson(result: unknown): string {
  // Compact JSON: roughly half the size of indented output, so faster for clients and fewer model tokens.
  const text = JSON.stringify(result) ?? '';
  if (text.length <= MAX_RESPONSE_CHARS) return text;

  const obj = result as { data?: unknown[]; items?: unknown[]; truncated?: { total?: number } };
  const key = Array.isArray(obj?.data) ? 'data' : Array.isArray(obj?.items) ? 'items' : null;
  if (key) {
    const rows = obj[key] as unknown[];
    const total = obj.truncated?.total ?? rows.length;
    let keep = Math.floor(rows.length * (MAX_RESPONSE_CHARS / text.length) * 0.9);
    while (keep > 0) {
      const trimmed = JSON.stringify({
        ...obj,
        [key]: rows.slice(0, keep),
        truncated: { returned: keep, total, reason: 'response size limit; filter the query to see more' },
      });
      if (trimmed.length <= MAX_RESPONSE_CHARS) return trimmed;
      keep = Math.floor(keep * 0.8);
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
}

interface UxGroup {
  id: string;
  name: string;
  [key: string]: unknown;
}

const DEVICE_INDEX_TTL_MS = 60_000;
const GROUP_LIST_TTL_MS = 30_000;
const MAX_FABRIC_DEVICES = 200;
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
    description:
      'Default true: use vManage cached (synced) data, which is fast. false queries every device in real time, which vManage processes slowly when many devices are queried at once.',
  },
};

const dataOf = (body: unknown) => (body as { data?: unknown })?.data ?? body;
const errorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err));

/** Device counts per type and reachability, plus the unreachable devices. */
function summarizeDevices(rows: DeviceRow[]) {
  const byType: Record<string, { total: number; reachable: number; unreachable: number }> = {};
  for (const d of rows) {
    const t = (byType[d['device-type'] ?? 'unknown'] ??= { total: 0, reachable: 0, unreachable: 0 });
    t.total++;
    if (d.reachability === 'reachable') t.reachable++;
    else t.unreachable++;
  }
  const unreachable = rows
    .filter((d) => d.reachability !== 'reachable')
    .map((d) => ({ 'host-name': d['host-name'], 'system-ip': d['system-ip'], 'device-type': d['device-type'], 'site-id': d['site-id'] }));
  return { total: rows.length, byType, unreachable };
}

/** Applies the optional `filter` and `fields` arguments to list rows (`data`, `items` or a top-level array). */
function selectRows(result: unknown, fields: unknown, filter: unknown): unknown {
  if (fields === undefined && filter === undefined) return result;
  if (fields !== undefined && (!Array.isArray(fields) || fields.some((f) => typeof f !== 'string'))) {
    throw new Error('fields must be an array of field names');
  }
  if (filter !== undefined && (filter === null || typeof filter !== 'object' || Array.isArray(filter))) {
    throw new Error('filter must be an object of field/value pairs');
  }
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
  if (fields) {
    const wanted = fields as string[];
    selected = selected.map((row) =>
      row && typeof row === 'object'
        ? Object.fromEntries(wanted.filter((f) => f in (row as object)).map((f) => [f, (row as Record<string, unknown>)[f]]))
        : row
    );
  }
  if (key === null) return selected;
  return { ...container, [key]: selected, ...(conditions.length ? { selection: { matched: selected.length, of: rows.length } } : {}) };
}

export class CatalystSdwanMCPServer {
  private server: Server;
  private apiService: VManageApiService;
  private catalog: ApiCatalog;

  constructor() {
    const config = loadConfig();
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
        const { fields, filter, ...toolArgs } = args ?? {};
        const result = NO_ROW_OPTIONS.has(name)
          ? await this.handleToolCall(name, args || {})
          : selectRows(await this.handleToolCall(name, toolArgs), fields, filter);
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
    this.tools ??= this.baseTools().map((tool) =>
      NO_ROW_OPTIONS.has(tool.name)
        ? tool
        : { ...tool, inputSchema: { ...tool.inputSchema, properties: { ...ROW_OPTIONS, ...(tool.inputSchema.properties ?? {}) } } }
    );
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
          },
          required: ['operation_id'],
        },
      },
      // === Fabric-wide (one call, all WAN edges queried in parallel) ===
      {
        name: 'get_fabric_health',
        description:
          'One-call fabric health check: device counts per type with unreachable devices, control-connection and OMP up/down status, reachability per device class, active alarms by severity, certificate status and Manager cluster health. Use this first for "is my fabric healthy?".',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_fabric_bfd_status',
        description:
          'BFD sessions of every reachable WAN edge (or one site / selected devices) in one call, queried in parallel: per-device session counts and the sessions that are not up, plus fabric totals. Prefer this over calling get_bfd_sessions per device.',
        inputSchema: { type: 'object', properties: { ...FABRIC_SCOPE } },
      },
      {
        name: 'get_fabric_tlocs',
        description:
          'TLOCs (WAN transports) of every reachable WAN edge (or one site / selected devices) in one call, queried in parallel: per-device TLOC color, interface, state and public/private IP, plus totals per color and TLOCs that are not up.',
        inputSchema: { type: 'object', properties: { ...FABRIC_SCOPE } },
      },

      // === Device Management ===
      {
        name: 'list_devices',
        description: 'List all devices in the SD-WAN fabric (vEdges, vSmarts, vBonds, vManage). Returns hostname, system-ip, device-type, status, site-id, version.',
        inputSchema: {
          type: 'object',
          properties: {
            model: { type: 'string', description: 'Filter by device model (e.g., vedge-C8000V, vsmart)' },
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
        });
      }
      case 'list_devices': {
        const params = args.model ? { 'device-model': String(args.model) } : undefined;
        return this.apiService.get('/dataservice/device', params);
      }
      case 'get_device_details': {
        if (!deviceId) throw new Error('device_id is required');
        const devices = await this.apiService.get<{ data?: DeviceRow[] }>('/dataservice/device', { 'system-ip': deviceId });
        return devices.data?.[0] ?? { error: 'Device not found', device_id: deviceId };
      }
      case 'list_reachable_devices':
        return this.apiService.get('/dataservice/device/reachable');
      case 'list_controllers':
        return this.apiService.get('/dataservice/system/device/controllers');

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
        return this.apiService.get('/dataservice/device/vedgeinventory/detail');
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
        const sections: Record<string, Promise<unknown>> = {
          devices: this.apiService.get<{ data?: DeviceRow[] }>('/dataservice/device').then((b) => summarizeDevices(b.data ?? [])),
          controlConnections: this.apiService.get('/dataservice/device/control/status').then(dataOf),
          ompPeers: this.apiService.get('/dataservice/device/omp/status').then(dataOf),
          reachabilityByClass: this.apiService.get('/dataservice/network/connectionssummary').then(dataOf),
          alarms: this.apiService.get<{ data?: Array<Record<string, unknown>> }>('/dataservice/alarms').then((b) => {
            const rows = b.data ?? [];
            const bySeverity: Record<string, number> = {};
            for (const a of rows) bySeverity[String(a.severity ?? 'unknown')] = (bySeverity[String(a.severity ?? 'unknown')] ?? 0) + 1;
            return { total: rows.length, bySeverity };
          }),
          certificates: this.apiService.get('/dataservice/certificate/stats/summary').then(dataOf),
          cluster: this.apiService.get('/dataservice/clusterManagement/health/status').then(dataOf),
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
        return Object.keys(errors).length ? { ...health, errors } : health;
      }
      case 'get_fabric_bfd_status': {
        const { edges, skipped } = await this.fabricEdges(args);
        const devices = await this.perEdge(edges, `/dataservice/device/bfd/${args.synced !== false ? 'synced/' : ''}sessions`, (rows) => {
          const notUp = rows.filter((r) => String(r.state).toLowerCase() !== 'up');
          return {
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
        });
        const sum = (key: string) => devices.reduce((n, d) => n + (Number(d[key]) || 0), 0);
        return {
          summary: {
            source: args.synced !== false ? 'vManage cached (synced) data' : 'real-time device query',
            edgesQueried: edges.length,
            sessions: sum('sessions'),
            up: sum('up'),
            notUp: sum('notUp'),
            edgesWithSessionsNotUp: devices.filter((d) => Number(d.notUp) > 0).map((d) => d['host-name']),
            edgesWithErrors: devices.filter((d) => d.error).length,
          },
          skippedUnreachable: skipped,
          devices,
        };
      }
      case 'get_fabric_tlocs': {
        const { edges, skipped } = await this.fabricEdges(args);
        const devices = await this.perEdge(edges, `/dataservice/device/control/${args.synced !== false ? 'synced/' : ''}waninterface`, (rows) => ({
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
            source: args.synced !== false ? 'vManage cached (synced) data' : 'real-time device query',
            edgesQueried: edges.length,
            tlocs: devices.reduce((n, d) => n + (Number(d.tlocCount) || 0), 0),
            byColor,
            notUp,
            edgesWithErrors: devices.filter((d) => d.error).length,
          },
          skippedUnreachable: skipped,
          devices,
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async deviceIndex(): Promise<DeviceRow[]> {
    const body = await this.apiService.get<{ data?: DeviceRow[] }>('/dataservice/device', undefined, DEVICE_INDEX_TTL_MS);
    return body.data ?? [];
  }

  /** WAN edges selected by site_id / devices; unreachable ones are reported instead of queried. */
  private async fabricEdges(args: Record<string, unknown>): Promise<{ edges: DeviceRow[]; skipped: DeviceRow[] }> {
    let rows = (await this.deviceIndex()).filter((d) => d['device-type'] === 'vedge');
    if (args.site_id !== undefined) rows = rows.filter((d) => String(d['site-id']) === String(args.site_id));
    if (args.devices !== undefined) {
      const list = args.devices;
      if (!Array.isArray(list) || !list.length || list.some((d) => typeof d !== 'string')) {
        throw new Error('devices must be a non-empty array of hostnames or system IPs');
      }
      const wanted = new Set((await Promise.all(list.map((d: string) => this.findDevice(d)))).map((d) => d['system-ip']));
      rows = rows.filter((d) => wanted.has(d['system-ip']));
    }
    if (rows.length > MAX_FABRIC_DEVICES) {
      throw new Error(`${rows.length} WAN edges selected (limit ${MAX_FABRIC_DEVICES}); narrow the query with site_id or devices`);
    }
    const edges = rows.filter((d) => d.reachability === 'reachable' && d['system-ip']);
    const skipped = rows
      .filter((d) => !edges.includes(d))
      .map((d) => ({ 'host-name': d['host-name'], 'system-ip': d['system-ip'], 'site-id': d['site-id'], reachability: d.reachability }));
    return { edges, skipped };
  }

  /** Runs one device query per edge in parallel (bounded by the client's concurrency limit); a failing device doesn't fail the call. */
  private async perEdge(
    edges: DeviceRow[],
    path: string,
    summarize: (rows: Array<Record<string, unknown>>) => Record<string, unknown>
  ): Promise<Array<Record<string, unknown>>> {
    const results = await Promise.allSettled(
      edges.map((d) => this.apiService.get<{ data?: Array<Record<string, unknown>> }>(path, { deviceId: d['system-ip'] as string }))
    );
    return edges.map((d, i) => {
      const base = { 'host-name': d['host-name'], 'system-ip': d['system-ip'], 'site-id': d['site-id'] };
      const r = results[i];
      return r.status === 'fulfilled' ? { ...base, ...summarize(r.value.data ?? []) } : { ...base, error: errorMessage(r.reason) };
    });
  }

  private async findDevice(input: string): Promise<DeviceRow> {
    const value = input.trim();
    const lower = value.toLowerCase();
    const rows = await this.deviceIndex();
    const hit = rows.find(
      (d) => d['system-ip'] === value || d['host-name']?.toLowerCase() === lower || d.uuid === value || d['board-serial'] === value
    );
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
}
