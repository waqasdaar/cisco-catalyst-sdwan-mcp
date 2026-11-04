/**
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
import { VManageApiService, type HttpMethod } from './services/vmanageApi.js';
import { ApiCatalog, shapeResponse } from './services/apiCatalog.js';
import { changes as parcelChanges, RULES as CONVERSION_RULES } from './services/configDefects.js';
import { maskConfig, maskLine, reviewConfig, SIG_LINES } from './services/configReview.js';
import { planTemplate, TemplateMigration, type MigrationDeps, type MigrationState } from './services/templateMigration.js';
import { shownPlan } from './services/configVariables.js';
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

interface UxProfile {
  id: string;
  name: string;
  type: string;
}

/** Whether feature data sets a secret (a static pre-shared key, a password), which must not reach the assistant. */
function holdsSecret(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  return Object.entries(data as Record<string, any>).some(
    ([key, value]) => (/secret|passw|key|psk/i.test(key) && value?.optionType === 'global' && typeof value.value === 'string') || holdsSecret(value)
  );
}

/** `fn` over `items` with at most `width` calls in flight; results keep the items' order. */
async function mapLimit<T, R>(items: T[], width: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(Math.max(1, width), items.length) }, worker));
  return out;
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
  'plan_config_group_variables',
  'find_config_group_conversion_defects',
  'deploy_template_migration',
  'list_api_categories',
  'search_api_operations',
  'describe_api_operation',
  'get_fabric_health',
  'get_fabric_bfd_status',
  'get_fabric_tlocs',
  'create_ospf_feature',
  'update_ospf_feature',
  'delete_ospf_feature',
  'associate_ospf_feature',
  'create_bgp_feature',
  'update_bgp_feature',
  'delete_bgp_feature',
  'associate_bgp_feature',
  'create_eigrp_feature',
  'update_eigrp_feature',
  'delete_eigrp_feature',
  'create_multicast_feature',
  'update_multicast_feature',
  'delete_multicast_feature',
  'associate_multicast_feature',
  'create_ipv6_policy_object',
  'update_ipv6_policy_object',
  'delete_ipv6_policy_object',
  'create_ipv6_tracker',
  'associate_ipv6_tracker',
  'update_ipv6_tracker',
  'delete_ipv6_tracker',
  'associate_eigrp_feature',
  'create_routing_template',
  'update_routing_template',
  'delete_routing_template',
  'clone_routing_template',
  'create_group',
  'update_group',
  'delete_group',
  'associate_group_devices',
  'update_group_variables',
  'deploy_group',
  'create_hierarchy_cybervision',
  'delete_hierarchy_cybervision',
  'create_cli_addon',
  'update_cli_addon',
  'delete_cli_addon',
  'create_cli_template',
  'update_cli_template',
  'delete_cli_template',
]);
// UX 1.0 feature template types for routing and multicast (cisco_*/cedge_*/eigrp for IOS XE, plain names for vEdge), by protocol.
const ROUTING_TEMPLATE_TYPES = new Map([
  ['cisco_bgp', 'bgp'],
  ['bgp', 'bgp'],
  ['cisco_ospf', 'ospf'],
  ['ospf', 'ospf'],
  ['cisco_ospfv3', 'ospfv3'],
  ['eigrp', 'eigrp'],
  ['cedge_igmp', 'igmp'],
  ['igmp', 'igmp'],
  ['cedge_pim', 'pim'],
  ['pim', 'pim'],
  ['cedge_multicast', 'multicast'],
  ['multicast', 'multicast'],
]);
const ROUTING_TEMPLATE_TYPE = {
  type: 'string',
  enum: [...ROUTING_TEMPLATE_TYPES.keys()],
  description:
    'Template type: cisco_bgp, cisco_ospf, cisco_ospfv3, eigrp, cedge_igmp, cedge_pim, cedge_multicast (IOS XE / cEdge) or bgp, ospf, igmp, pim, multicast (vEdge)',
};
const ROUTING_PROFILE_SCOPE = {
  profile_type: { type: 'string', enum: ['service', 'transport'], description: 'Feature profile type' },
  profile: { type: 'string', description: 'Feature profile ID or exact profile name' },
  solution: { type: 'string', enum: ['sdwan', 'sd-routing'], description: 'Solution family (default: sdwan)' },
};
const OSPF_VERSION = {
  version: { type: 'string', enum: ['ospf', 'ospfv3-ipv4', 'ospfv3-ipv6'], description: 'OSPF feature type (default: ospf)' },
};
const VPN_SCOPE = {
  vpn_feature_id: {
    type: 'string',
    description: 'VPN feature ID (sdwan: LAN VPN for service, WAN VPN for transport) or VRF feature ID (sd-routing)',
  },
  global_vrf: {
    type: 'boolean',
    description: 'sd-routing transport only: use the global VRF instead of a VRF (vpn_feature_id is then the global VRF feature)',
  },
};
const WRITE_CONFIRM = {
  confirm: { type: 'boolean', description: 'Must be true, only after the user explicitly approves this change' },
};
const WRITE_NOTE = 'Changes configuration: needs VMANAGE_ALLOW_WRITE=true on the server and confirm: true after explicit user approval.';
const WRITE_TOOL = /^(create|update|delete|associate|clone|deploy)_/;

type HierarchyNode = Record<string, unknown> & { name?: string; hierarchyPath?: string; deviceCount?: number; data?: Record<string, unknown> };
const hierarchyNodeId = (n: HierarchyNode) => String(n.id ?? n.uuid ?? '');
const hierarchyLabel = (n: HierarchyNode) => String(n.data?.label ?? '').toUpperCase();
const hierarchySiteId = (n: HierarchyNode) => (n.data?.hierarchyId as Record<string, unknown> | undefined)?.siteId;
const GROUP_KINDS: Record<string, 'config-group' | 'policy-group' | 'topology-group'> = {
  config: 'config-group',
  policy: 'policy-group',
  topology: 'topology-group',
};
const GROUP_SCOPE = {
  group_type: { type: 'string', enum: Object.keys(GROUP_KINDS), description: 'config (configuration group), policy (policy group) or topology (topology group)' },
  group: { type: 'string', description: 'Group ID or exact name' },
};
const GROUP_DEVICES = {
  devices: { type: 'array', items: { type: 'string' }, description: 'Devices: hostnames, system IPs, UUIDs or chassis numbers' },
};

// IPv6 real-time views: endpoint and the filters it accepts (tool argument -> query parameter).
const IPV6_VIEWS: Record<string, { path: string; filters?: Record<string, string>; local?: string[] }> = {
  nd: { path: '/dataservice/device/ipv6/nd6' },
  neighbors: { path: '/dataservice/device/ndv6', filters: { vpn_id: 'vpn-id', if_name: 'if-name', mac: 'mac' } },
  // IOS XE edges reject /device/ip/v6fib and return nothing from /device/ip/routetable; the IETF routing list works
  // everywhere but ignores its address-family filter, so IPv6, prefix and protocol are filtered here.
  routes: { path: '/dataservice/device/ip/ipRoutes', filters: { vpn_id: 'routing-instance-name' }, local: ['prefix', 'protocol'] },
  fib: { path: '/dataservice/device/ip/v6fib', filters: { vpn_id: 'vpn-id', prefix: 'prefix', tloc: 'tloc', color: 'color' } },
  'interface-stats': { path: '/dataservice/device/interface/ipv6Stats', filters: { vpn_id: 'vpn-id', if_name: 'ifname' } },
  dhcpv6: { path: '/dataservice/device/dhcpv6/interface' },
  nat64: { path: '/dataservice/device/ip/nat64/translation' },
  'omp-received': { path: '/dataservice/device/omp/routes/received/ompIpv6' },
  'omp-advertised': { path: '/dataservice/device/omp/routes/advertised/ompIpv6' },
  'cflowd-flows': {
    path: '/dataservice/device/cedgecflowd/app-fwd-cflowd-v6-flows',
    filters: { vpn_id: 'vpn-id', src_addr: 'src-addr', dst_addr: 'dst-addr', app: 'app' },
  },
};
const IPV6_FILTER_ARGS = ['vpn_id', 'prefix', 'protocol', 'if_name', 'mac', 'tloc', 'color', 'src_addr', 'dst_addr', 'app'];
const IPV6_POLICY_VIEWS: Record<string, string> = {
  'acl-names': '/dataservice/device/policy/ipv6/accesslistnames',
  'acl-associations': '/dataservice/device/policy/ipv6/accesslistassociations',
  'acl-counters': '/dataservice/device/policy/ipv6/accesslistcounters',
  'acl-policers': '/dataservice/device/policy/ipv6/accesslistpolicers',
  'sgacl-counters': '/dataservice/device/roleBasedIpv6Counters',
  'sgacl-permissions': '/dataservice/device/roleBasedIpv6Permissions',
};
// UX 1.0 IPv6 policy objects: prefix lists and IPv6 ACL / device-access definitions.
const IPV6_POLICY_OBJECTS: Record<string, string> = {
  'prefix-list': '/dataservice/template/policy/list/ipv6prefix',
  'data-prefix-list': '/dataservice/template/policy/list/dataipv6prefix',
  acl: '/dataservice/template/policy/definition/aclv6',
  'device-access': '/dataservice/template/policy/definition/deviceaccesspolicyv6',
};
const IPV6_POLICY_KIND = {
  kind: {
    type: 'string',
    enum: Object.keys(IPV6_POLICY_OBJECTS),
    description: 'prefix-list (ipv6prefix list), data-prefix-list (dataipv6prefix list), acl (aclv6 definition) or device-access (deviceaccesspolicyv6 definition)',
  },
};
const IPV6_TRACKER_SCOPE = {
  profile: { type: 'string', description: 'SD-WAN transport feature profile ID or exact name' },
  tracker_type: { type: 'string', enum: ['tracker', 'group'], description: 'IPv6 tracker or IPv6 tracker group (default: tracker)' },
  vpn_feature_id: { type: 'string', description: 'WAN VPN feature ID (with interface_type and interface_feature_id: trackers of one WAN interface)' },
  interface_type: { type: 'string', enum: ['ethernet', 'cellular'], description: 'WAN interface feature type' },
  interface_feature_id: { type: 'string', description: 'WAN interface feature ID' },
};
const CLI_PROFILE = {
  profile: { type: 'string', description: 'CLI feature profile ID or exact name' },
  solution: { type: 'string', enum: ['sdwan', 'sd-routing'], description: 'Solution family (default: sdwan)' },
};
const CLI_CONTENT = {
  name: { type: 'string', description: 'Name' },
  description: { type: 'string', description: 'Description' },
  config: { type: 'string', description: 'IOS XE configuration text, one command per line (e.g. "router rip\n version 2\n network 10.0.0.0")' },
};
const CLI_CONFIG_MAX = 100_000;

/** Configuration text of a CLI add-on feature payload (plain string or { optionType, value }). */
function cliText(config: unknown): string {
  if (typeof config === 'string') return config;
  const value = (config as { value?: unknown } | undefined)?.value;
  return typeof value === 'string' ? value : '';
}

type RoutingProtocol = 'ospf' | 'bgp' | 'eigrp' | 'multicast';
// UX 2.0 features that vManage has only in service profiles, and only for the sdwan solution.
const SERVICE_ONLY = new Set<RoutingProtocol>(['eigrp', 'multicast']);
const SDWAN_ONLY = new Set<RoutingProtocol>(['multicast']);

/** Read and write tools for the routing features (parcels) of UX 2.0 service and transport profiles. */
function routingFeatureTools(protocol: RoutingProtocol): Tool[] {
  const label = { ospf: 'OSPF / OSPFv3', bgp: 'BGP', eigrp: 'EIGRP', multicast: 'multicast (IGMP / PIM)' }[protocol];
  const serviceOnly = SERVICE_ONLY.has(protocol)
    ? { profile_type: { type: 'string', enum: ['service'], description: `Feature profile type (${label} features exist only in service profiles)` } }
    : {};
  const sdwanOnly = SDWAN_ONLY.has(protocol) ? { solution: { type: 'string', enum: ['sdwan'], description: 'Solution family (only sdwan)' } } : {};
  const scope = { ...ROUTING_PROFILE_SCOPE, ...serviceOnly, ...sdwanOnly, ...(protocol === 'ospf' ? OSPF_VERSION : {}) };
  const vpnScope = SERVICE_ONLY.has(protocol) ? { vpn_feature_id: VPN_SCOPE.vpn_feature_id } : VPN_SCOPE;
  const featureId = (suffix = '') => ({ feature_id: { type: 'string', description: `${label} feature ID${suffix}` } });
  return [
    {
      name: `get_${protocol}_config`,
      description: `Get ${label} routing features configured in a UX 2.0 service or transport feature profile. Without vpn_feature_id, lists the ${label} features of the profile; with it, those associated with that VPN/VRF feature. feature_id returns one feature.`,
      inputSchema: {
        type: 'object',
        properties: { ...scope, ...vpnScope, ...featureId(' to return a single feature') },
        required: ['profile_type', 'profile'],
      },
    },
    {
      name: `create_${protocol}_feature`,
      description: `Create a ${label} routing feature in a UX 2.0 service or transport feature profile. Returns the new feature ID; attach it to a VPN/VRF with associate_${protocol}_feature. ${WRITE_NOTE}`,
      inputSchema: {
        type: 'object',
        properties: {
          ...scope,
          ...(protocol === 'bgp' ? { global_vrf: VPN_SCOPE.global_vrf } : {}),
          body: { type: 'object', description: `Feature definition: { name, description, data } as in get_${protocol}_config output` },
          ...WRITE_CONFIRM,
        },
        required: ['profile_type', 'profile', 'body', 'confirm'],
      },
    },
    {
      name: `update_${protocol}_feature`,
      description: `Replace a ${label} routing feature (full definition, not a patch). With vpn_feature_id, edits the feature's association with that VPN/VRF instead. ${WRITE_NOTE}`,
      inputSchema: {
        type: 'object',
        properties: {
          ...scope,
          ...vpnScope,
          ...featureId(),
          body: { type: 'object', description: 'Complete feature definition: { name, description, data }' },
          ...WRITE_CONFIRM,
        },
        required: ['profile_type', 'profile', 'feature_id', 'body', 'confirm'],
      },
    },
    {
      name: `delete_${protocol}_feature`,
      description: `Delete a ${label} routing feature from a feature profile. With vpn_feature_id, only removes its association with that VPN/VRF; the feature itself is kept. ${WRITE_NOTE}`,
      inputSchema: {
        type: 'object',
        properties: { ...scope, ...vpnScope, ...featureId(), ...WRITE_CONFIRM },
        required: ['profile_type', 'profile', 'feature_id', 'confirm'],
      },
    },
    {
      name: `associate_${protocol}_feature`,
      description: `Associate an existing ${label} routing feature with a VPN feature (sdwan) or VRF feature (sd-routing) in the same profile. ${WRITE_NOTE}`,
      inputSchema: {
        type: 'object',
        properties: { ...scope, ...vpnScope, ...featureId(' to associate'), ...WRITE_CONFIRM },
        required: ['profile_type', 'profile', 'vpn_feature_id', 'feature_id', 'confirm'],
      },
    },
  ];
}
// Added to ~100 tools, so descriptions stay short: the tool list is sent to the model on every request.
const ROW_OPTIONS = {
  fields: { type: 'array', items: { type: 'string' }, description: 'Only these row fields' },
  filter: { type: 'object', additionalProperties: true, description: 'Only rows whose fields match (case-insensitive; array = any of)' },
  count_by: { type: 'string', description: 'Count rows per value of this field instead of returning rows' },
  offset: { type: 'integer', minimum: 0, description: 'Skip rows (use nextOffset to continue)' },
  limit: { type: 'integer', minimum: 1, description: 'Max rows' },
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
        version: '1.1.0',
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
  /** deploy_template_migration: per device, what step "prepare" saved (its running config stays in memory only). */
  private migrationState = new Map<string, MigrationState>();

  private getAllTools(): Tool[] {
    const tenantOption: Record<string, object> = this.config.allowTenantSwitch
      ? {
          tenant: {
            type: 'string',
            description: `Tenant to query on a multi-tenant Manager (name, ID, org name or subdomain).${this.config.tenant ? ` Default: ${this.config.tenant}.` : ' Default: provider view.'}`,
          },
        }
      : {};
    this.tools ??= this.baseTools()
      // Write tools only work with VMANAGE_ALLOW_WRITE=true; listing them otherwise costs tokens and tool slots.
      .filter((tool) => this.config.allowWrite || !WRITE_TOOL.test(tool.name))
      .map((tool) => {
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
        description: 'Get BGP neighbors for a device (real time).',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            vpn_id: { type: 'string', description: 'Only neighbors in this VPN' },
            peer_addr: { type: 'string', description: 'Only this neighbor address' },
            as: { type: 'string', description: 'Only neighbors with this AS number' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_bgp_routes',
        description: 'Get BGP routes for a device (real time).',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            vpn_id: { type: 'string', description: 'Only routes in this VPN' },
            prefix: { type: 'string', description: 'Only this prefix, e.g. 10.1.0.0/16' },
            nexthop: { type: 'string', description: 'Only routes with this next hop' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_bgp_summary',
        description: 'Get BGP summary for a device (real time).',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      ...routingFeatureTools('bgp'),
      {
        name: 'get_bgp_feature_schema',
        description:
          'Get the JSON schema vManage expects for an SD-WAN BGP feature body (create or update). Use it to build the body for create_bgp_feature / update_bgp_feature.',
        inputSchema: {
          type: 'object',
          properties: {
            profile_type: { type: 'string', enum: ['service', 'transport'], description: 'Feature profile type' },
            schema_type: { type: 'string', enum: ['post', 'put'], description: 'Schema for create (post, default) or update (put)' },
          },
          required: ['profile_type'],
        },
      },

      // === Real-time Monitoring - OSPF ===
      {
        name: 'get_ospf_process',
        description:
          'Get OSPF process details of a device (real time). Can be empty even when OSPF runs in a service VPN; use get_ospf_interfaces or get_ospf_neighbors to confirm whether OSPF is enabled.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_ospf_neighbors',
        description: 'Get OSPF (v2) or OSPFv3 neighbors of a device (real time).',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            version: { type: 'string', enum: ['ospfv2', 'ospfv3'], description: 'OSPF version (default: ospfv2)' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_ospf_interfaces',
        description: 'Get OSPF (v2) or OSPFv3 enabled interfaces of a device (real time).',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            version: { type: 'string', enum: ['ospfv2', 'ospfv3'], description: 'OSPF version (default: ospfv2)' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_ospf_routes',
        description: 'Get OSPF routes of a device (real time).',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_ospf_database',
        description: 'Get the OSPF link-state database of a device (real time): summary, full database, or external LSAs.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            view: { type: 'string', enum: ['summary', 'full', 'external'], description: 'Which database view (default: summary)' },
          },
          required: ['device_id'],
        },
      },
      ...routingFeatureTools('ospf'),

      // === Real-time Monitoring - EIGRP ===
      {
        name: 'get_eigrp_interfaces',
        description: 'Get EIGRP-enabled interfaces of a device (real time). An empty list means EIGRP is not running on the device.',
        inputSchema: {
          type: 'object',
          properties: { device_id: { type: 'string', description: 'Device ID or system-ip' } },
          required: ['device_id'],
        },
      },
      {
        name: 'get_eigrp_routes',
        description: 'Get EIGRP routes of a device (real time).',
        inputSchema: {
          type: 'object',
          properties: { device_id: { type: 'string', description: 'Device ID or system-ip' } },
          required: ['device_id'],
        },
      },
      {
        name: 'get_eigrp_topology',
        description: 'Get the EIGRP topology table of a device (real time): successors and feasible successors per prefix.',
        inputSchema: {
          type: 'object',
          properties: { device_id: { type: 'string', description: 'Device ID or system-ip' } },
          required: ['device_id'],
        },
      },
      ...routingFeatureTools('eigrp'),

      // === Multicast: real-time monitoring, UX 2.0 features ===
      {
        name: 'get_igmp_status',
        description: 'Get IGMP state of a device (real time): joined groups, IGMP interfaces, statistics or summary.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            view: { type: 'string', enum: ['groups', 'interface', 'statistics', 'summary'], description: 'What to return (default: groups)' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_pim_status',
        description: 'Get PIM state of a device (real time): neighbors, PIM interfaces, RP mappings or statistics.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            view: { type: 'string', enum: ['neighbor', 'interface', 'rp-mapping', 'statistics'], description: 'What to return (default: neighbor)' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_multicast_status',
        description: 'Get SD-WAN overlay multicast state of a device (real time): multicast topology, RPF, replicators or PIM tunnels.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            view: { type: 'string', enum: ['topology', 'rpf', 'replicator', 'tunnel'], description: 'What to return (default: topology)' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_mfib',
        description: 'Get the multicast forwarding information base (MFIB) of a device (real time): summary, outgoing interface lists or statistics.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            view: { type: 'string', enum: ['summary', 'oil', 'stats'], description: 'What to return (default: summary)' },
          },
          required: ['device_id'],
        },
      },
      ...routingFeatureTools('multicast'),
      {
        name: 'get_multicast_feature_schema',
        description:
          'Get the JSON schema vManage expects for an SD-WAN multicast feature body (create or update). Use it to build the body for create_multicast_feature / update_multicast_feature.',
        inputSchema: {
          type: 'object',
          properties: { schema_type: { type: 'string', enum: ['post', 'put'], description: 'Schema for create (post, default) or update (put)' } },
        },
      },

      // === IPv6: real-time monitoring, UX 1.0 policy objects, UX 2.0 trackers ===
      {
        name: 'get_ipv6_status',
        description:
          'Get IPv6 state of a device (real time): ND cache, IPv6 neighbors, IPv6 route table, IPv6 FIB (vEdge and controllers only), IPv6 interface statistics, DHCPv6 interfaces, NAT64 translations, OMP IPv6 routes received/advertised, or cflowd IPv6 flows.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            view: { type: 'string', enum: Object.keys(IPV6_VIEWS), description: 'What to return (default: nd)' },
            vpn_id: { type: 'string', description: 'VPN (neighbors, routes, fib, interface-stats, cflowd-flows)' },
            prefix: { type: 'string', description: 'IPv6 prefix (routes, fib)' },
            protocol: { type: 'string', description: 'Route source protocol, e.g. omp, connected, static, bgp, ospfv3 (routes; substring match)' },
            if_name: { type: 'string', description: 'Interface name (neighbors, interface-stats)' },
            mac: { type: 'string', description: 'MAC address (neighbors)' },
            tloc: { type: 'string', description: 'TLOC IP (fib)' },
            color: { type: 'string', description: 'TLOC color (fib)' },
            src_addr: { type: 'string', description: 'Source address (cflowd-flows)' },
            dst_addr: { type: 'string', description: 'Destination address (cflowd-flows)' },
            app: { type: 'string', description: 'Application (cflowd-flows)' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_ipv6_policy_status',
        description: 'Get IPv6 policy state of a device (real time): IPv6 ACL names, interface associations, counters or policers, or role-based (SGACL) IPv6 counters and permissions.',
        inputSchema: {
          type: 'object',
          properties: {
            device_id: { type: 'string', description: 'Device ID or system-ip' },
            view: { type: 'string', enum: Object.keys(IPV6_POLICY_VIEWS), description: 'What to return (default: acl-names)' },
          },
          required: ['device_id'],
        },
      },
      {
        name: 'get_ipv6_policy_object',
        description:
          'Get UX 1.0 IPv6 policy objects: IPv6 prefix lists, data IPv6 prefix lists, IPv6 ACL (aclv6) or IPv6 device-access definitions. Without object_id lists them (info_tag filters lists); preview renders the device CLI of a saved object (with object_id) or of an unsaved body (preview_body), without saving anything.',
        inputSchema: {
          type: 'object',
          properties: {
            ...IPV6_POLICY_KIND,
            object_id: { type: 'string', description: 'List or definition ID' },
            info_tag: { type: 'string', description: 'Only prefix lists with this info tag' },
            preview: { type: 'boolean', description: 'Render the device CLI of object_id instead of returning it' },
            preview_body: { type: 'object', description: 'Render the device CLI of this unsaved list or definition' },
          },
          required: ['kind'],
        },
      },
      {
        name: 'create_ipv6_policy_object',
        description: `Create a UX 1.0 IPv6 prefix list, data IPv6 prefix list, IPv6 ACL or IPv6 device-access definition. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            ...IPV6_POLICY_KIND,
            body: {
              type: 'object',
              description: 'Lists: { name, description, entries: [{ ipv6Prefix }] }. Definitions: { name, description, type, defaultAction, sequences }. Same shape as get_ipv6_policy_object output.',
            },
            ...WRITE_CONFIRM,
          },
          required: ['kind', 'body', 'confirm'],
        },
      },
      {
        name: 'update_ipv6_policy_object',
        description: `Replace a UX 1.0 IPv6 policy object (full definition). For ACL / device-access definitions, mode multiple edits a definition used by several policies and mode bulk saves several definitions at once (body: array). Devices get the change when the policies using it are activated or pushed again. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            ...IPV6_POLICY_KIND,
            object_id: { type: 'string', description: 'List or definition ID (not for mode bulk)' },
            mode: { type: 'string', enum: ['single', 'multiple', 'bulk'], description: 'single (default), multiple or bulk (definitions only)' },
            body: { description: 'Complete object (array of objects for mode bulk)' },
            ...WRITE_CONFIRM,
          },
          required: ['kind', 'body', 'confirm'],
        },
      },
      {
        name: 'delete_ipv6_policy_object',
        description: `Delete a UX 1.0 IPv6 policy object by ID, or all prefix lists with an info tag. vManage refuses objects still used by a policy. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            ...IPV6_POLICY_KIND,
            object_id: { type: 'string', description: 'List or definition ID' },
            info_tag: { type: 'string', description: 'Prefix lists only: delete every list with this info tag' },
            ...WRITE_CONFIRM,
          },
          required: ['kind', 'confirm'],
        },
      },
      {
        name: 'get_ipv6_tracker',
        description:
          'Get UX 2.0 IPv6 trackers or tracker groups of an SD-WAN transport profile, or those associated with one WAN interface (vpn_feature_id + interface_type + interface_feature_id). tracker_id returns one; schema_type returns the JSON schema for create/update bodies instead.',
        inputSchema: {
          type: 'object',
          properties: {
            ...IPV6_TRACKER_SCOPE,
            tracker_id: { type: 'string', description: 'IPv6 tracker or tracker group feature ID' },
            schema_type: { type: 'string', enum: ['post', 'put'], description: 'Return the body schema for create (post) or update (put); profile not needed' },
          },
        },
      },
      {
        name: 'create_ipv6_tracker',
        description: `Create a UX 2.0 IPv6 tracker or tracker group in an SD-WAN transport profile. Returns its ID; attach it to a WAN interface with associate_ipv6_tracker. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            profile: IPV6_TRACKER_SCOPE.profile,
            tracker_type: IPV6_TRACKER_SCOPE.tracker_type,
            body: { type: 'object', description: 'Feature definition: { name, description, data } (see get_ipv6_tracker schema_type: post)' },
            ...WRITE_CONFIRM,
          },
          required: ['profile', 'body', 'confirm'],
        },
      },
      {
        name: 'associate_ipv6_tracker',
        description: `Attach an existing IPv6 tracker or tracker group to a WAN Ethernet or cellular interface feature. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: { ...IPV6_TRACKER_SCOPE, tracker_id: { type: 'string', description: 'IPv6 tracker or tracker group feature ID' }, ...WRITE_CONFIRM },
          required: ['profile', 'vpn_feature_id', 'interface_type', 'interface_feature_id', 'tracker_id', 'confirm'],
        },
      },
      {
        name: 'update_ipv6_tracker',
        description: `Replace an IPv6 tracker or tracker group (full definition). With the interface scope, edits its association with that WAN interface instead. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            ...IPV6_TRACKER_SCOPE,
            tracker_id: { type: 'string', description: 'IPv6 tracker or tracker group feature ID' },
            body: { type: 'object', description: 'Complete feature definition: { name, description, data }' },
            ...WRITE_CONFIRM,
          },
          required: ['profile', 'tracker_id', 'body', 'confirm'],
        },
      },
      {
        name: 'delete_ipv6_tracker',
        description: `Delete an IPv6 tracker or tracker group. With the interface scope, only removes its association with that WAN interface. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: { ...IPV6_TRACKER_SCOPE, tracker_id: { type: 'string', description: 'IPv6 tracker or tracker group feature ID' }, ...WRITE_CONFIRM },
          required: ['profile', 'tracker_id', 'confirm'],
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
          'Read-only: render the configuration a configuration group would push to one device, compared with its running configuration. Shows a line diff by default. Passwords, secrets, keys and SNMP communities are masked. Nothing is deployed.',
        inputSchema: {
          type: 'object',
          properties: {
            config_group: { type: 'string', description: 'Configuration group ID or exact name' },
            device: { type: 'string', description: 'Device hostname, system-ip, UUID or chassis number (must be associated with the group)' },
            view: {
              type: 'string',
              enum: ['diff', 'review', 'new', 'existing', 'both'],
              description:
                'What to return (default: diff). review sorts the differences for a deploy decision: settings the group would drop, settings whose value changes, passwords and keys whose value changes (masked), settings it adds, and defaults that need no action',
            },
          },
          required: ['config_group', 'device'],
        },
      },
      {
        name: 'plan_config_group_variables',
        description:
          'Read-only: for the devices attached to a device template, map their template variable values onto the variables of the configuration group converted from it (the template-to-group conversion does not carry the values over), and of the policy group of the same name when there is one (where the conversion puts SIG). Returns per device the values ready for the deploy dialog or update_group_variables, and a report: defaults used, secrets left as placeholders, missing and invalid values, and template variables the groups do not use (a sign the conversion hard-coded or dropped that setting). Changes nothing.',
        inputSchema: {
          type: 'object',
          properties: {
            template: { type: 'string', description: 'Device template ID or exact name' },
            config_group: { type: 'string', description: "Configuration group ID or exact name (default: the template's name)" },
          },
          required: ['template'],
        },
      },
      {
        name: 'find_config_group_conversion_defects',
        description:
          "Read-only: known defects the template-to-configuration-group conversion leaves in groups (seen on 20.15 and 20.18), checked against the feature templates the groups were made from: tunnel settings on VPN 0 interfaces without a tunnel (deploy fails with CFGRP0012 'unknown command tunnel-interface'), tunnel services the template allowed by default (dhcp, icmp, https) that the group turns off, interface NAT in the older template form that becomes NAT off, and SIG tunnel settings (IKE group, IPsec cipher suite) reset to the group's defaults. The SIG feature of the policy group of the same name is checked too. Returns each defect with the fields the fix changes and the fixed feature data to PUT after review. Changes nothing.",
        inputSchema: {
          type: 'object',
          properties: {
            config_group: { type: 'string', description: 'Configuration group ID or exact name (default: all groups)' },
          },
        },
      },
      {
        name: 'deploy_template_migration',
        description: `Move ONE device from its device template to the configuration group converted from it, with its values, in steps the user approves one at a time. step "prepare": plans the device's values from its template (refused when values are missing or invalid), saves its running config, detaches the template (the running config stays), associates the configuration group and the policy group of the same name (SIG), sets the values, and returns the review of what the deploy would change; nothing is pushed. step "deploy": pushes the configuration group (needs accept_review when the review drops or changes settings, and sig_ready for a device with SIG, which then has no SIG tunnels until step "deploy_policy_group"). step "status": vSmart control connections and BFD sessions against before. step "deploy_policy_group": checks the policy group configures every SIG setting the device ran before, then pushes it. One device at a time: go on with the next only when status says healthy. The AAA user password comes from VMANAGE_MIGRATION_AAA_PASSWORD on the server. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            step: { type: 'string', enum: ['prepare', 'deploy', 'status', 'deploy_policy_group'], description: 'The migration step' },
            device: { type: 'string', description: 'Device hostname, system-ip, UUID or chassis number' },
            template: { type: 'string', description: 'prepare: the device template the device is attached to (ID or exact name)' },
            config_group: { type: 'string', description: "Configuration group ID or exact name (default: the template's name; needed after a server restart)" },
            accept_review: { type: 'boolean', description: 'Deploy although the review drops or changes settings or changes a password or key, only after the user accepts them' },
            sig_ready: { type: 'boolean', description: 'deploy: the user confirms the SIG provider credentials are set in vManage' },
            wait_seconds: { type: 'number', description: 'How long to wait for the vManage task (default 240, at most 900)' },
            ...WRITE_CONFIRM,
          },
          required: ['step', 'device'],
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
        name: 'get_group_variables',
        description:
          'Get device-specific variables of a configuration or policy group: values (all devices or one), the variables schema, or a vManage-side fetch with a query body. Use before update_group_variables.',
        inputSchema: {
          type: 'object',
          properties: {
            group_type: { type: 'string', enum: ['config', 'policy'], description: 'config (configuration group) or policy (policy group)' },
            group: GROUP_SCOPE.group,
            device: { type: 'string', description: 'Only this device: hostname, system IP, UUID or chassis number' },
            schema: { type: 'boolean', description: 'Return the variables schema instead of values' },
            suggestions: { type: 'boolean', description: 'Include suggested values (values view)' },
            fetch_body: { type: 'object', description: 'Fetch variables with this query body (POST .../device/variables; read-only)' },
          },
          required: ['group_type', 'group'],
        },
      },
      {
        name: 'get_group_rules',
        description: 'Get the automatic device-association rules of a configuration or policy group, or the bulk rule-association preview of a topology group.',
        inputSchema: { type: 'object', properties: { ...GROUP_SCOPE }, required: ['group_type', 'group'] },
      },
      {
        name: 'preview_group_device_config',
        description:
          'Read-only: render the configuration a policy group or topology group would push to one device, compared with its running configuration (line diff by default). Passwords, secrets, keys and SNMP communities are masked. Nothing is deployed. For configuration groups use preview_config_group_device_config.',
        inputSchema: {
          type: 'object',
          properties: {
            group_type: { type: 'string', enum: ['policy', 'topology'], description: 'policy (policy group) or topology (topology group)' },
            group: GROUP_SCOPE.group,
            device: { type: 'string', description: 'Device hostname, system IP, UUID or chassis number' },
            view: {
              type: 'string',
              enum: ['diff', 'review', 'new', 'existing', 'both'],
              description:
                'What to return (default: diff). review sorts the differences for a deploy decision: settings the group would drop, settings whose value changes, passwords and keys whose value changes (masked), settings it adds, and defaults that need no action',
            },
          },
          required: ['group_type', 'group', 'device'],
        },
      },
      {
        name: 'create_group',
        description: `Create a UX 2.0 configuration, policy or topology group. Returns its ID. Associate devices with associate_group_devices, then deploy_group. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            group_type: GROUP_SCOPE.group_type,
            body: {
              type: 'object',
              description: 'Group definition: { name, description, solution, profiles: [{ id }] } (same shape as get_config_group / get_policy_group / get_topology_group output)',
            },
            ...WRITE_CONFIRM,
          },
          required: ['group_type', 'body', 'confirm'],
        },
      },
      {
        name: 'update_group',
        description: `Replace a configuration, policy or topology group definition (name, description, profiles). Devices are not changed until deploy_group. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: { ...GROUP_SCOPE, body: { type: 'object', description: 'Complete group definition' }, ...WRITE_CONFIRM },
          required: ['group_type', 'group', 'body', 'confirm'],
        },
      },
      {
        name: 'delete_group',
        description: `Delete a configuration, policy or topology group. vManage refuses groups that still have associated devices. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            ...GROUP_SCOPE,
            delete_profiles: { type: 'boolean', description: 'Configuration and policy groups: also delete their feature profiles (default: false)' },
            ...WRITE_CONFIRM,
          },
          required: ['group_type', 'group', 'confirm'],
        },
      },
      {
        name: 'associate_group_devices',
        description: `Add, replace or remove the devices associated with a configuration or policy group. Devices are not reconfigured until deploy_group. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            group_type: { type: 'string', enum: ['config', 'policy'], description: 'config (configuration group) or policy (policy group)' },
            group: GROUP_SCOPE.group,
            ...GROUP_DEVICES,
            mode: { type: 'string', enum: ['add', 'replace', 'remove'], description: 'add (default), replace the whole list, or remove these devices' },
            ...WRITE_CONFIRM,
          },
          required: ['group_type', 'group', 'devices', 'confirm'],
        },
      },
      {
        name: 'update_group_variables',
        description: `Set device-specific variable values of a configuration or policy group (see get_group_variables for the current values and schema). Devices get them on deploy_group. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            group_type: { type: 'string', enum: ['config', 'policy'], description: 'config (configuration group) or policy (policy group)' },
            group: GROUP_SCOPE.group,
            body: { type: 'object', description: 'Variables body: { solution, devices: [{ device-id, variables: [{ name, value }] }] }' },
            ...WRITE_CONFIRM,
          },
          required: ['group_type', 'group', 'body', 'confirm'],
        },
      },
      {
        name: 'deploy_group',
        description: `DEPLOY a configuration, policy or topology group to devices: vManage pushes the rendered configuration to them. Preview first (preview_config_group_device_config / preview_group_device_config). Returns the vManage task. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: { ...GROUP_SCOPE, ...GROUP_DEVICES, ...WRITE_CONFIRM },
          required: ['group_type', 'group', 'devices', 'confirm'],
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
        description:
          'Get the UX 2.0 network hierarchy (global, regions, areas and sites) used by configuration groups and policies. With node, returns that node with its parent and children; label lists only one level.',
        inputSchema: {
          type: 'object',
          properties: {
            node: { type: 'string', description: 'Node name, hierarchy path (e.g. Global/USA-NewYork), site ID or node ID' },
            label: { type: 'string', enum: ['global', 'region', 'area', 'site'], description: 'Only nodes of this level' },
          },
        },
      },
      {
        name: 'get_hierarchy_cybervision',
        description:
          'Get the Cisco Cyber Vision centers configured as network settings of the network hierarchy (the Global node by default; vManage 26.2 allows network settings only there), or the ID of one center by name.',
        inputSchema: {
          type: 'object',
          properties: {
            node: { type: 'string', description: 'Node name, hierarchy path, site ID or node ID (default: Global)' },
            center_name: { type: 'string', description: 'Return only the ID of the Cyber Vision center with this name' },
          },
        },
      },
      {
        name: 'create_hierarchy_cybervision',
        description: `Add a Cisco Cyber Vision center to the network settings of the network hierarchy (Global node by default). ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            node: { type: 'string', description: 'Node name, hierarchy path, site ID or node ID (default: Global)' },
            body: { type: 'object', description: '{ data: { cvCenterInstances: [{ cvName: { value }, cvAddress: { value }, cvKey: { value }, cvVPNInterface: { value } }] } }' },
            ...WRITE_CONFIRM,
          },
          required: ['body', 'confirm'],
        },
      },
      {
        name: 'delete_hierarchy_cybervision',
        description: `Remove a Cisco Cyber Vision center from the network settings of the network hierarchy (Global node by default). ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            node: { type: 'string', description: 'Node name, hierarchy path, site ID or node ID (default: Global)' },
            center_id: { type: 'string', description: 'Cyber Vision center ID' },
            center_name: { type: 'string', description: 'Cyber Vision center name (looked up when center_id is not given)' },
            ...WRITE_CONFIRM,
          },
          required: ['confirm'],
        },
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

      // === BGP / OSPF / OSPFv3 feature templates (UX 1.0) ===
      {
        name: 'list_routing_templates',
        description: 'List UX 1.0 routing and multicast feature templates (BGP, OSPF, OSPFv3, EIGRP, IGMP, PIM, multicast), with the number of devices attached.',
        inputSchema: {
          type: 'object',
          properties: {
            protocol: {
              type: 'string',
              enum: ['all', 'bgp', 'ospf', 'ospfv3', 'eigrp', 'igmp', 'pim', 'multicast'],
              description: 'Only this protocol (default: all)',
            },
          },
        },
      },
      {
        name: 'get_routing_template',
        description: 'Get one UX 1.0 routing or multicast feature template: its definition and the device templates that use it.',
        inputSchema: {
          type: 'object',
          properties: { template_id: { type: 'string', description: 'Feature template ID' } },
          required: ['template_id'],
        },
      },
      {
        name: 'get_routing_template_schema',
        description:
          'Get the field definition vManage uses for a routing or multicast feature template type. Use it to build templateDefinition for create_routing_template / update_routing_template.',
        inputSchema: {
          type: 'object',
          properties: {
            template_type: ROUTING_TEMPLATE_TYPE,
            version: { type: 'string', description: 'Template definition version (default: 15.0.0)' },
          },
          required: ['template_type'],
        },
      },
      {
        name: 'create_routing_template',
        description: `Create a UX 1.0 routing or multicast feature template. body.templateType must be one of the routing / multicast template types. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            body: {
              type: 'object',
              description:
                'Template: { templateName, templateDescription, templateType, deviceType: [models], templateMinVersion, templateDefinition, factoryDefault: false }',
            },
            ...WRITE_CONFIRM,
          },
          required: ['body', 'confirm'],
        },
      },
      {
        name: 'update_routing_template',
        description: `Replace a UX 1.0 routing or multicast feature template (full definition; its template type cannot change). Devices using it are not updated until their device templates are pushed again. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            template_id: { type: 'string', description: 'Feature template ID' },
            body: { type: 'object', description: 'Complete template, same fields as for create_routing_template' },
            ...WRITE_CONFIRM,
          },
          required: ['template_id', 'body', 'confirm'],
        },
      },
      {
        name: 'delete_routing_template',
        description: `Delete a UX 1.0 routing or multicast feature template. vManage refuses templates still used by a device template. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: { template_id: { type: 'string', description: 'Feature template ID' }, ...WRITE_CONFIRM },
          required: ['template_id', 'confirm'],
        },
      },
      {
        name: 'clone_routing_template',
        description: `Copy a UX 1.0 routing or multicast feature template under a new name. Returns the new template ID; the copy is not attached to any device template. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            template_id: { type: 'string', description: 'ID of the feature template to copy' },
            name: { type: 'string', description: 'Name of the new template' },
            description: { type: 'string', description: 'Description of the new template (default: "Clone of <source name>")' },
            ...WRITE_CONFIRM,
          },
          required: ['template_id', 'name', 'confirm'],
        },
      },

      // === CLI add-on configuration (UX 2.0 CLI profile features, UX 1.0 cli-template) ===
      {
        name: 'list_cli_addons',
        description:
          'List UX 2.0 CLI add-on features (raw IOS XE configuration, e.g. RIP/RIPng, which has no dedicated API) of all CLI profiles or one. contains finds add-ons whose configuration includes a text, e.g. "router rip".',
        inputSchema: {
          type: 'object',
          properties: {
            profile: { type: 'string', description: 'CLI profile ID or exact name (default: all CLI profiles)' },
            solution: { type: 'string', enum: ['sdwan', 'sd-routing'], description: 'Solution family (default: sdwan)' },
            contains: { type: 'string', description: 'Only add-ons whose configuration contains this text (case-insensitive)' },
          },
        },
      },
      {
        name: 'get_cli_addon',
        description: 'Get one UX 2.0 CLI add-on feature with its full configuration text.',
        inputSchema: {
          type: 'object',
          properties: { ...CLI_PROFILE, feature_id: { type: 'string', description: 'CLI add-on feature ID' } },
          required: ['profile', 'feature_id'],
        },
      },
      {
        name: 'create_cli_addon',
        description: `Create a UX 2.0 CLI add-on feature in a CLI profile with raw IOS XE configuration (e.g. a "router rip" or "ipv6 router rip" block). Devices get it when their configuration group is deployed. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: { ...CLI_PROFILE, ...CLI_CONTENT, ...WRITE_CONFIRM },
          required: ['profile', 'name', 'config', 'confirm'],
        },
      },
      {
        name: 'update_cli_addon',
        description: `Change a UX 2.0 CLI add-on feature. Omitted fields keep their current value; config replaces the whole configuration text. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: { ...CLI_PROFILE, feature_id: { type: 'string', description: 'CLI add-on feature ID' }, ...CLI_CONTENT, ...WRITE_CONFIRM },
          required: ['profile', 'feature_id', 'confirm'],
        },
      },
      {
        name: 'delete_cli_addon',
        description: `Delete a UX 2.0 CLI add-on feature from a CLI profile. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: { ...CLI_PROFILE, feature_id: { type: 'string', description: 'CLI add-on feature ID' }, ...WRITE_CONFIRM },
          required: ['profile', 'feature_id', 'confirm'],
        },
      },
      {
        name: 'list_cli_templates',
        description:
          'List UX 1.0 CLI add-on feature templates (cli-template). contains finds templates whose configuration includes a text, e.g. "router rip" (reads each template).',
        inputSchema: {
          type: 'object',
          properties: { contains: { type: 'string', description: 'Only templates whose configuration contains this text (case-insensitive)' } },
        },
      },
      {
        name: 'get_cli_template',
        description: 'Get one UX 1.0 CLI add-on template: its configuration text and the device templates that use it.',
        inputSchema: {
          type: 'object',
          properties: { template_id: { type: 'string', description: 'cli-template feature template ID' } },
          required: ['template_id'],
        },
      },
      {
        name: 'create_cli_template',
        description: `Create a UX 1.0 CLI add-on feature template (cli-template) with raw IOS XE configuration. Attach it to a device template to use it. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: {
            ...CLI_CONTENT,
            device_types: { type: 'array', items: { type: 'string' }, description: 'Device models the template applies to, e.g. ["vedge-C8000V"]' },
            min_version: { type: 'string', description: 'Template minimum version (default: 15.0.0)' },
            ...WRITE_CONFIRM,
          },
          required: ['name', 'config', 'device_types', 'confirm'],
        },
      },
      {
        name: 'update_cli_template',
        description: `Change a UX 1.0 CLI add-on template. Omitted fields keep their current value; config replaces the whole configuration text. Devices are not updated until their device templates are pushed again. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: { template_id: { type: 'string', description: 'cli-template feature template ID' }, ...CLI_CONTENT, ...WRITE_CONFIRM },
          required: ['template_id', 'confirm'],
        },
      },
      {
        name: 'delete_cli_template',
        description: `Delete a UX 1.0 CLI add-on template. vManage refuses templates still used by a device template. ${WRITE_NOTE}`,
        inputSchema: {
          type: 'object',
          properties: { template_id: { type: 'string', description: 'cli-template feature template ID' }, ...WRITE_CONFIRM },
          required: ['template_id', 'confirm'],
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
    // Routing feature path up to /routing/<protocol>, shared by the OSPF and BGP configuration tools.
    const routingTarget = async (protocol: RoutingProtocol) => {
      const solution = pick('solution', SDWAN_ONLY.has(protocol) ? { sdwan: 'sdwan' } : { sdwan: 'sdwan', 'sd-routing': 'sd-routing' }, 'sdwan');
      const type = pick('profile_type', SERVICE_ONLY.has(protocol) ? { service: 'service' } : { service: 'service', transport: 'transport' }, '');
      const routing =
        protocol === 'ospf' ? pick('version', { ospf: 'ospf', 'ospfv3-ipv4': 'ospfv3/ipv4', 'ospfv3-ipv6': 'ospfv3/ipv6' }, 'ospf') : protocol;
      const featureIdArg = (arg: string) => {
        const value = args[arg];
        if (value === undefined || value === null || value === '') return undefined;
        if (!UUID.test(String(value))) throw new Error(`${arg} must be a feature ID (UUID)`);
        return String(value);
      };
      const vpnId = featureIdArg('vpn_feature_id');
      const featureId = featureIdArg('feature_id');
      const globalVrf = args.global_vrf === true;
      if (globalVrf && !(solution === 'sd-routing' && type === 'transport')) {
        throw new Error('global_vrf applies only to sd-routing transport profiles');
      }
      if (globalVrf && !vpnId && protocol === 'ospf') throw new Error('global_vrf requires vpn_feature_id (the global VRF feature ID)');
      const profileId = await this.resolveFeatureProfileId(solution, type, args.profile);
      let path = `/dataservice/v1/feature-profile/${solution}/${type}/${encodeURIComponent(profileId)}`;
      const vrf = globalVrf ? 'global-vrf' : 'vrf';
      if (solution === 'sdwan') {
        if (vpnId) path += `/${type === 'service' ? 'lan/vpn' : 'wan/vpn'}/${vpnId}`;
      } else if (vpnId) {
        path += `/${vrf}/${vpnId}`;
      } else if (protocol !== 'ospf') {
        // SD-Routing keeps profile-level BGP and EIGRP features under the VRF or global-VRF section.
        path += `/${vrf}`;
      }
      return { path: `${path}/routing/${routing}`, vpnId, featureId };
    };
    const writeBody = () => {
      const body = args.body;
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('body must be an object');
      return body;
    };
    // Goes through the catalog so the write gate, confirm check and spec validation apply.
    const routingWrite = async (method: HttpMethod, path: string, body?: unknown, query?: Record<string, unknown>) => {
      const { op, pathParams } = await this.catalog.match(method, path.replace(/^\/dataservice/, ''));
      const result = await this.catalog.call({ operationId: op.operationId, pathParams, query, body, confirm: args.confirm === true });
      return { operationId: op.operationId, method, path, result };
    };
    // The template-to-group migration's view of the server: reads, read-only POSTs, and changes through routingWrite.
    const migrationDeps = (): MigrationDeps => ({
      get: (path, query) => this.apiService.get(path, query),
      readPost: (path, body) => this.apiService.post(path, body as object),
      write: (method, path, body) => routingWrite(method, path, body),
      listGroups: (kind) => this.listGroups(kind),
      findGroup: (kind, ref) => this.findGroup(kind, ref),
      device: async (ref) => {
        const d = await this.findDevice(ref);
        if (!d.uuid || !d['system-ip']) throw new Error(`Device "${ref}" has no UUID or system IP`);
        return { uuid: d.uuid, systemIp: d['system-ip'], hostName: d['host-name'] ?? ref };
      },
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    });
    const routingProtocol: RoutingProtocol = name.includes('_bgp_')
      ? 'bgp'
      : name.includes('_eigrp_')
        ? 'eigrp'
        : name.includes('_multicast_')
          ? 'multicast'
          : 'ospf';
    // A UX 1.0 feature template, refused unless its type is one the calling tool manages.
    const typedTemplate = async (allowed: (type: string) => boolean, kind: string) => {
      const id = String(args.template_id ?? '');
      if (!UUID.test(id)) throw new Error('template_id must be a feature template ID (UUID)');
      const template = await this.apiService.get<Record<string, unknown>>(`/dataservice/template/feature/object/${id}`);
      if (!allowed(String(template?.templateType))) {
        throw new Error(`Template ${id} is a ${template?.templateType} template, not ${kind} template`);
      }
      return { id, template };
    };
    const routingTemplate = () =>
      typedTemplate((t) => ROUTING_TEMPLATE_TYPES.has(t), 'a routing or multicast (BGP, OSPF, OSPFv3, EIGRP, IGMP, PIM, multicast)');
    const cliTemplate = () => typedTemplate((t) => t === 'cli-template', 'a CLI add-on (cli-template)');
    const cliContains = () => {
      const text = String(args.contains ?? '').trim().toLowerCase();
      return text || undefined;
    };
    const cliName = (required: boolean) => {
      const value = args.name === undefined ? '' : String(args.name).trim();
      if (!value && required) throw new Error('name is required');
      if (value.length > 128) throw new Error('name must be at most 128 characters');
      return value || undefined;
    };
    const cliConfig = (required: boolean) => {
      if (args.config === undefined && !required) return undefined;
      if (typeof args.config !== 'string' || !args.config.trim()) throw new Error('config must be non-empty configuration text');
      if (args.config.length > CLI_CONFIG_MAX) throw new Error(`config must be at most ${CLI_CONFIG_MAX} characters`);
      return args.config;
    };
    const cybervisionBase = async () => {
      let node: HierarchyNode | undefined;
      if (args.node === undefined) {
        node = (await this.hierarchyNodes()).find((n) => hierarchyLabel(n) === 'GLOBAL');
        if (!node) throw new Error('The network hierarchy has no Global node');
      } else {
        node = await this.findHierarchyNode(args.node);
      }
      return `/dataservice/v1/network-hierarchy/${encodeURIComponent(hierarchyNodeId(node))}/network-settings/cybervisioncenters`;
    };
    const cybervisionName = () => {
      const value = String(args.center_name ?? '').trim();
      if (!value || value.length > 128) throw new Error('center_name must be 1-128 characters');
      return value;
    };
    const groupTarget = async (allowed: string[]) => {
      const type = pick('group_type', Object.fromEntries(allowed.map((k) => [k, k])), '');
      const kind = GROUP_KINDS[type];
      const group = await this.findGroup(kind, args.group);
      return { kind, group, path: `/dataservice/v1/${kind}/${encodeURIComponent(group.id)}` };
    };
    // Read-only render on vManage (POST with an empty body); it does not deploy anything.
    const renderPreview = async (groupPath: string, uuid: string, label: Record<string, unknown>) => {
      const view = pick('view', { diff: 'diff', review: 'review', new: 'new', existing: 'existing', both: 'both' }, 'diff');
      const preview = (await this.apiService.request('POST', `${groupPath}/device/${encodeURIComponent(uuid)}/preview`, { body: {} }))
        .body as { newConfig?: string; existingConfig?: string; [key: string]: unknown };
      const { newConfig: rendered = '', existingConfig: running = '', ...meta } = preview ?? {};
      if (view === 'review') {
        // The template-to-group conversion puts a template's SIG feature in a policy group of the group's name.
        let policyGroup: UxGroup | undefined;
        let policyGroupLookupError: string | undefined;
        if (typeof label.configGroup === 'string') {
          try {
            policyGroup = (await this.listGroups('policy-group')).find((g) => g.name === label.configGroup);
          } catch (error) {
            policyGroupLookupError = `Policy groups could not be listed, so SIG settings are not separated: ${(error as Error).message}`;
          }
        }
        const review = reviewConfig(running, rendered, policyGroup ? SIG_LINES : undefined);
        return {
          ...label,
          ...(policyGroup ? { policyGroup: policyGroup.name } : {}),
          ...(policyGroupLookupError ? { policyGroupLookupError } : {}),
          device: uuid,
          ...meta,
          summary: Object.fromEntries(Object.entries(review).map(([k, v]) => [k, v.length])),
          ...review,
        };
      }
      // Device configurations hold passwords, secret hashes, SIG keys and SNMP communities.
      const newConfig = maskConfig(rendered);
      const existingConfig = maskConfig(running);
      const head = { ...label, device: uuid, ...meta };
      if (view === 'new') return { ...head, newConfig };
      if (view === 'existing') return { ...head, existingConfig };
      if (view === 'both') return { ...head, newConfig, existingConfig };
      // Diff before masking so a changed secret still shows up as a change.
      const diff = lineDiff(running, rendered);
      return { ...head, ...diff, added: diff.added.map(maskLine), removed: diff.removed.map(maskLine) };
    };
    // UX 2.0 association and deploy bodies list devices by UUID.
    const groupDevices = async () => {
      const list = args.devices;
      if (!Array.isArray(list) || !list.length || list.length > 1000 || !list.every((d) => typeof d === 'string' && d.trim())) {
        throw new Error('devices must be a non-empty list (at most 1000) of hostnames, system IPs, UUIDs or chassis numbers');
      }
      const ids = await Promise.all(list.map((d) => this.resolveDeviceUuid(String(d))));
      return { devices: [...new Set(ids)].map((id) => ({ id })) };
    };
    const optionalId = (arg: string, what: string) => {
      const value = args[arg];
      if (value === undefined || value === null || value === '') return undefined;
      if (!UUID.test(String(value))) throw new Error(`${arg} must be ${what} (UUID)`);
      return String(value);
    };
    const ipv6PolicyTarget = () => {
      const kind = pick('kind', Object.fromEntries(Object.keys(IPV6_POLICY_OBJECTS).map((k) => [k, k])), '');
      const isList = kind.endsWith('prefix-list');
      const id = optionalId('object_id', 'a policy list or definition ID');
      const infoTag = args.info_tag === undefined ? undefined : String(args.info_tag);
      if (infoTag !== undefined && !/^[\w.-]{1,64}$/.test(infoTag)) throw new Error('info_tag must be 1-64 letters, digits, ".", "_" or "-"');
      if (infoTag !== undefined && !isList) throw new Error('info_tag applies only to prefix lists');
      return { base: IPV6_POLICY_OBJECTS[kind], id, infoTag, isList };
    };
    const ipv6TrackerTarget = async () => {
      const kind = pick('tracker_type', { tracker: 'ipv6-tracker', group: 'ipv6-trackergroup' }, 'tracker');
      const vpnId = optionalId('vpn_feature_id', 'a WAN VPN feature ID');
      const ifId = optionalId('interface_feature_id', 'an interface feature ID');
      const ifType = args.interface_type === undefined ? undefined : pick('interface_type', { ethernet: 'ethernet', cellular: 'cellular' }, '');
      const scoped = vpnId !== undefined || ifId !== undefined || ifType !== undefined;
      if (scoped && !(vpnId && ifId && ifType)) throw new Error('vpn_feature_id, interface_type and interface_feature_id must be given together');
      const trackerId = optionalId('tracker_id', 'an IPv6 tracker feature ID');
      const profileId = await this.resolveFeatureProfileId('sdwan', 'transport', args.profile);
      let path = `/dataservice/v1/feature-profile/sdwan/transport/${encodeURIComponent(profileId)}`;
      if (scoped) path += `/wan/vpn/${vpnId}/interface/${ifType}/${ifId}`;
      return { path: `${path}/${kind}`, trackerId, scoped };
    };
    // UX 2.0 CLI add-on features live under /cli/{profileId}/config.
    const cliAddonTarget = async (needFeature: boolean) => {
      if (name.startsWith('update_') && args.name === undefined && args.description === undefined && args.config === undefined) {
        throw new Error('Nothing to change: give name, description or config');
      }
      const solution = pick('solution', { sdwan: 'sdwan', 'sd-routing': 'sd-routing' }, 'sdwan');
      let featureId: string | undefined;
      if (needFeature) {
        featureId = String(args.feature_id ?? '');
        if (!UUID.test(featureId)) throw new Error('feature_id must be a feature ID (UUID)');
      }
      const profileId = await this.resolveFeatureProfileId(solution, 'cli', args.profile);
      return { path: `/dataservice/v1/feature-profile/${solution}/cli/${encodeURIComponent(profileId)}/config`, featureId };
    };

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
        return deviceGet('/dataservice/device/bgp/neighbors', { 'vpn-id': args.vpn_id, 'peer-addr': args.peer_addr, as: args.as });
      case 'get_bgp_routes':
        return deviceGet('/dataservice/device/bgp/routes', { 'vpn-id': args.vpn_id, prefix: args.prefix, nexthop: args.nexthop });
      case 'get_bgp_summary':
        return deviceGet('/dataservice/device/bgp/summary');
      case 'get_bgp_feature_schema':
        return this.apiService.get(
          pick(
            'profile_type',
            {
              service: '/dataservice/v1/feature-profile/sdwan/service/routing/bgp/schema',
              transport: '/dataservice/v1/feature-profile/sdwan/transport/routing/bgp/schema',
            },
            ''
          ),
          { schemaType: pick('schema_type', { post: 'post', put: 'put' }, 'post') }
        );

      case 'get_ospf_process':
        return deviceGet('/dataservice/device/ospf/process');
      case 'get_ospf_neighbors':
        return deviceGet(pick('version', { ospfv2: '/dataservice/device/ospf/neighbor', ospfv3: '/dataservice/device/ospf/v3neighbor' }, 'ospfv2'));
      case 'get_ospf_interfaces':
        return deviceGet(pick('version', { ospfv2: '/dataservice/device/ospf/interface', ospfv3: '/dataservice/device/ospf/v3interface' }, 'ospfv2'));
      case 'get_ospf_routes':
        return deviceGet('/dataservice/device/ospf/routes');
      case 'get_ospf_database':
        return deviceGet(
          pick(
            'view',
            {
              summary: '/dataservice/device/ospf/databasesummary',
              full: '/dataservice/device/ospf/database',
              external: '/dataservice/device/ospf/databaseexternal',
            },
            'summary'
          )
        );
      case 'get_eigrp_interfaces':
        return deviceGet('/dataservice/device/eigrp/interface');
      case 'get_eigrp_routes':
        return deviceGet('/dataservice/device/eigrp/route');
      case 'get_eigrp_topology':
        return deviceGet('/dataservice/device/eigrp/topology');
      case 'get_igmp_status':
        return deviceGet(
          pick(
            'view',
            {
              groups: '/dataservice/device/igmp/groups',
              interface: '/dataservice/device/igmp/interface',
              statistics: '/dataservice/device/igmp/statistics',
              summary: '/dataservice/device/igmp/summary',
            },
            'groups'
          )
        );
      case 'get_pim_status':
        return deviceGet(
          pick(
            'view',
            {
              neighbor: '/dataservice/device/pim/neighbor',
              interface: '/dataservice/device/pim/interface',
              'rp-mapping': '/dataservice/device/pim/rp-mapping',
              statistics: '/dataservice/device/pim/statistics',
            },
            'neighbor'
          )
        );
      case 'get_multicast_status':
        return deviceGet(
          pick(
            'view',
            {
              topology: '/dataservice/device/multicast/topology',
              rpf: '/dataservice/device/multicast/rpf',
              replicator: '/dataservice/device/multicast/replicator',
              tunnel: '/dataservice/device/multicast/tunnel',
            },
            'topology'
          )
        );
      case 'get_mfib':
        return deviceGet(
          pick(
            'view',
            {
              summary: '/dataservice/device/ip/mfibsummary',
              oil: '/dataservice/device/ip/mfiboil',
              stats: '/dataservice/device/ip/mfibstats',
            },
            'summary'
          )
        );
      case 'get_multicast_feature_schema':
        return this.apiService.get('/dataservice/v1/feature-profile/sdwan/service/routing/multicast/schema', {
          schemaType: pick('schema_type', { post: 'post', put: 'put' }, 'post'),
        });

      case 'get_ipv6_status': {
        const view = pick('view', Object.fromEntries(Object.keys(IPV6_VIEWS).map((v) => [v, v])), 'nd');
        const { path, filters = {}, local = [] } = IPV6_VIEWS[view];
        const query: Record<string, unknown> = {};
        for (const arg of IPV6_FILTER_ARGS) {
          if (args[arg] === undefined || local.includes(arg)) continue;
          if (!Object.hasOwn(filters, arg)) {
            const supported = [...Object.keys(filters), ...local];
            throw new Error(`${arg} does not apply to view ${view}${supported.length ? ` (filters: ${supported.join(', ')})` : ' (no filters)'}`);
          }
          query[filters[arg]] = args[arg];
        }
        const result = await deviceGet(path, query);
        if (view !== 'routes') return result;
        const prefix = args.prefix === undefined ? undefined : String(args.prefix).toLowerCase();
        const protocol = args.protocol === undefined ? undefined : String(args.protocol).toLowerCase();
        const rows = dataOf(result);
        const routes = (Array.isArray(rows) ? rows : []).filter(
          (r: Record<string, unknown>) =>
            String(r['rib-address-family']).toLowerCase() === 'ipv6' &&
            (!prefix || String(r['route-destination-prefix']).toLowerCase() === prefix) &&
            (!protocol || String(r['route-source-protocol']).toLowerCase().includes(protocol))
        );
        return { ...(result as object), data: routes };
      }
      case 'get_ipv6_policy_status':
        return deviceGet(pick('view', IPV6_POLICY_VIEWS, 'acl-names'));
      case 'get_ipv6_policy_object': {
        const { base, id, infoTag } = ipv6PolicyTarget();
        if (args.preview_body !== undefined) {
          if (id || args.preview === true) throw new Error('preview_body renders an unsaved object; do not combine it with object_id or preview');
          const body = args.preview_body;
          if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('preview_body must be an object');
          // Read-only render on vManage (POST); nothing is saved.
          return (await this.apiService.request('POST', `${base}/preview`, { body })).body;
        }
        if (args.preview === true) {
          if (!id) throw new Error('preview needs object_id');
          return this.apiService.get(`${base}/preview/${id}`);
        }
        if (id) return this.apiService.get(`${base}/${id}`);
        if (infoTag) return this.apiService.get(`${base}/filtered`, { infoTag });
        return this.apiService.get(base);
      }
      case 'create_ipv6_policy_object': {
        const { base, id, infoTag } = ipv6PolicyTarget();
        if (id || infoTag) throw new Error('create_ipv6_policy_object takes no object_id or info_tag');
        return routingWrite('POST', base, writeBody());
      }
      case 'update_ipv6_policy_object': {
        const { base, id, isList } = ipv6PolicyTarget();
        const mode = pick('mode', { single: 'single', multiple: 'multiple', bulk: 'bulk' }, 'single');
        if (mode !== 'single' && isList) throw new Error(`mode ${mode} applies only to acl and device-access definitions`);
        if (mode === 'bulk') {
          if (id) throw new Error('mode bulk takes no object_id');
          if (!Array.isArray(args.body) || !args.body.length) throw new Error('mode bulk needs body: a non-empty array of definitions');
          return routingWrite('PUT', `${base}/bulk`, args.body);
        }
        if (!id) throw new Error('object_id is required');
        return routingWrite('PUT', mode === 'multiple' ? `${base}/multiple/${id}` : `${base}/${id}`, writeBody());
      }
      case 'delete_ipv6_policy_object': {
        const { base, id, infoTag } = ipv6PolicyTarget();
        if (Boolean(id) === Boolean(infoTag)) throw new Error('Give exactly one of object_id or info_tag');
        return id ? routingWrite('DELETE', `${base}/${id}`) : routingWrite('DELETE', base, undefined, { infoTag });
      }
      case 'get_ipv6_tracker': {
        if (args.schema_type !== undefined) {
          const kind = pick('tracker_type', { tracker: 'ipv6-tracker', group: 'ipv6-trackergroup' }, 'tracker');
          return this.apiService.get(`/dataservice/v1/feature-profile/sdwan/transport/${kind}/schema`, {
            schemaType: pick('schema_type', { post: 'post', put: 'put' }, 'post'),
          });
        }
        const { path, trackerId } = await ipv6TrackerTarget();
        return this.apiService.get(trackerId ? `${path}/${trackerId}` : path);
      }
      case 'create_ipv6_tracker': {
        const { path, trackerId, scoped } = await ipv6TrackerTarget();
        if (scoped || trackerId) throw new Error('create_ipv6_tracker creates a profile-level tracker; use associate_ipv6_tracker to attach it to a WAN interface');
        return routingWrite('POST', path, writeBody());
      }
      case 'associate_ipv6_tracker': {
        const { path, trackerId, scoped } = await ipv6TrackerTarget();
        if (!scoped || !trackerId) throw new Error('vpn_feature_id, interface_type, interface_feature_id and tracker_id are required');
        return routingWrite('POST', path, { parcelId: trackerId });
      }
      case 'update_ipv6_tracker': {
        const { path, trackerId } = await ipv6TrackerTarget();
        if (!trackerId) throw new Error('tracker_id is required');
        return routingWrite('PUT', `${path}/${trackerId}`, writeBody());
      }
      case 'delete_ipv6_tracker': {
        const { path, trackerId } = await ipv6TrackerTarget();
        if (!trackerId) throw new Error('tracker_id is required');
        return routingWrite('DELETE', `${path}/${trackerId}`);
      }
      case 'get_ospf_config':
      case 'get_eigrp_config':
      case 'get_multicast_config':
      case 'get_bgp_config': {
        const { path, featureId } = await routingTarget(routingProtocol);
        return this.apiService.get(`${path}${featureId ? `/${featureId}` : ''}`);
      }
      case 'create_ospf_feature':
      case 'create_eigrp_feature':
      case 'create_multicast_feature':
      case 'create_bgp_feature': {
        const { path, vpnId, featureId } = await routingTarget(routingProtocol);
        if (vpnId || featureId) {
          throw new Error(`${name} creates a profile-level feature; use associate_${routingProtocol}_feature to attach it to a VPN/VRF`);
        }
        return routingWrite('POST', path, writeBody());
      }
      case 'update_ospf_feature':
      case 'update_eigrp_feature':
      case 'update_multicast_feature':
      case 'update_bgp_feature': {
        const { path, featureId } = await routingTarget(routingProtocol);
        if (!featureId) throw new Error('feature_id is required');
        return routingWrite('PUT', `${path}/${featureId}`, writeBody());
      }
      case 'delete_ospf_feature':
      case 'delete_eigrp_feature':
      case 'delete_multicast_feature':
      case 'delete_bgp_feature': {
        const { path, featureId } = await routingTarget(routingProtocol);
        if (!featureId) throw new Error('feature_id is required');
        return routingWrite('DELETE', `${path}/${featureId}`);
      }
      case 'associate_ospf_feature':
      case 'associate_eigrp_feature':
      case 'associate_multicast_feature':
      case 'associate_bgp_feature': {
        const { path, vpnId, featureId } = await routingTarget(routingProtocol);
        if (!vpnId || !featureId) throw new Error('vpn_feature_id and feature_id are required');
        return routingWrite('POST', path, { parcelId: featureId });
      }

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

      case 'list_routing_templates': {
        const protocol = pick(
          'protocol',
          { all: 'all', bgp: 'bgp', ospf: 'ospf', ospfv3: 'ospfv3', eigrp: 'eigrp', igmp: 'igmp', pim: 'pim', multicast: 'multicast' },
          'all'
        );
        const list = await this.apiService.get<{ data?: Array<Record<string, unknown>> }>('/dataservice/template/feature');
        const rows = (list.data ?? []).filter((t) => {
          const p = ROUTING_TEMPLATE_TYPES.get(String(t.templateType));
          return p !== undefined && (protocol === 'all' || p === protocol);
        });
        return { ...list, data: rows };
      }
      case 'get_routing_template': {
        const { id, template } = await routingTemplate();
        const usedBy = await this.apiService
          .get(`/dataservice/template/feature/devicetemplates/${id}`)
          .catch((e: Error) => ({ error: e.message }));
        return { ...template, deviceTemplates: dataOf(usedBy) };
      }
      case 'get_routing_template_schema': {
        const type = pick('template_type', Object.fromEntries([...ROUTING_TEMPLATE_TYPES.keys()].map((t) => [t, t])), '');
        const version = String(args.version ?? '15.0.0');
        if (!/^\d+(\.\d+){0,3}$/.test(version)) throw new Error('version must look like 15.0.0');
        return this.apiService.get(`/dataservice/template/feature/types/definition/${type}/${version}`);
      }
      case 'create_routing_template': {
        const body = writeBody() as Record<string, unknown>;
        if (!ROUTING_TEMPLATE_TYPES.has(String(body.templateType))) {
          throw new Error(`body.templateType must be one of: ${[...ROUTING_TEMPLATE_TYPES.keys()].join(', ')}`);
        }
        return routingWrite('POST', '/dataservice/template/feature', body);
      }
      case 'update_routing_template': {
        const body = writeBody() as Record<string, unknown>;
        const { id, template } = await routingTemplate();
        if (body.templateType !== undefined && body.templateType !== template.templateType) {
          throw new Error(`body.templateType must stay ${template.templateType}`);
        }
        return routingWrite('PUT', `/dataservice/template/feature/${id}`, { ...body, templateType: template.templateType });
      }
      case 'delete_routing_template': {
        const { id } = await routingTemplate();
        return routingWrite('DELETE', `/dataservice/template/feature/${id}`);
      }
      case 'clone_routing_template': {
        const newName = String(args.name ?? '').trim();
        if (!newName || newName.length > 128) throw new Error('name is required (at most 128 characters)');
        const { id, template } = await routingTemplate();
        const desc = String(args.description ?? '').trim() || `Clone of ${template.templateName}`;
        return routingWrite('POST', '/dataservice/template/feature/clone', undefined, { id, name: newName, desc });
      }

      case 'list_cli_addons': {
        const solution = pick('solution', { sdwan: 'sdwan', 'sd-routing': 'sd-routing' }, 'sdwan');
        const contains = cliContains();
        let profiles: Array<{ id: string; name: string }>;
        if (args.profile !== undefined) {
          const id = await this.resolveFeatureProfileId(solution, 'cli', args.profile);
          profiles = [{ id, name: String(args.profile) }];
        } else {
          const rows = await this.apiService.get<Array<Record<string, unknown>>>(`/dataservice/v1/feature-profile/${solution}/cli`, undefined, GROUP_LIST_TTL_MS);
          profiles = (Array.isArray(rows) ? rows : []).map((p) => ({ id: String(p.profileId), name: String(p.profileName) }));
        }
        const perProfile = await Promise.all(
          profiles.map(async (p) => {
            try {
              const res = await this.apiService.get(`/dataservice/v1/feature-profile/${solution}/cli/${encodeURIComponent(p.id)}/config`);
              const features = dataOf(res);
              return (Array.isArray(features) ? features : []).map((f: Record<string, any>) => ({
                profile: p.name,
                profileId: p.id,
                featureId: f.parcelId,
                name: f.payload?.name,
                description: f.payload?.description,
                config: cliText(f.payload?.data?.config),
                lastUpdatedBy: f.lastUpdatedBy,
                lastUpdatedOn: f.lastUpdatedOn,
              }));
            } catch (e) {
              return [{ profile: p.name, profileId: p.id, error: errorMessage(e) }];
            }
          })
        );
        const rows = perProfile.flat().filter((r) => !contains || ('config' in r && String(r.config).toLowerCase().includes(contains)));
        return { data: rows };
      }
      case 'get_cli_addon': {
        const { path, featureId } = await cliAddonTarget(true);
        return this.apiService.get(`${path}/${featureId}`);
      }
      case 'create_cli_addon': {
        const { path } = await cliAddonTarget(false);
        const body = { name: cliName(true), description: String(args.description ?? ''), data: { config: cliConfig(true) } };
        return routingWrite('POST', path, body);
      }
      case 'update_cli_addon': {
        const { path, featureId } = await cliAddonTarget(true);
        const current = await this.apiService.get<Record<string, any>>(`${path}/${featureId}`);
        const payload = current?.payload ?? current;
        const body = {
          name: cliName(false) ?? payload?.name,
          description: args.description !== undefined ? String(args.description) : payload?.description ?? '',
          data: { ...(payload?.data ?? {}), config: cliConfig(false) ?? payload?.data?.config },
        };
        return routingWrite('PUT', `${path}/${featureId}`, body);
      }
      case 'delete_cli_addon': {
        const { path, featureId } = await cliAddonTarget(true);
        return routingWrite('DELETE', `${path}/${featureId}`);
      }

      case 'list_cli_templates': {
        const contains = cliContains();
        const list = await this.apiService.get<{ data?: Array<Record<string, unknown>> }>('/dataservice/template/feature');
        let rows = (list.data ?? []).filter((t) => t.templateType === 'cli-template');
        if (contains) {
          const configs = await Promise.all(
            rows.map((t) =>
              this.apiService
                .get<Record<string, any>>(`/dataservice/template/feature/object/${encodeURIComponent(String(t.templateId))}`)
                .then((o) => cliText(o?.templateDefinition?.config?.vipValue))
                .catch(() => '')
            )
          );
          rows = rows.filter((_, i) => configs[i].toLowerCase().includes(contains)).map((t, i) => ({ ...t, config: configs[i] }));
        }
        return { ...list, data: rows };
      }
      case 'get_cli_template': {
        const { id, template } = await cliTemplate();
        const usedBy = await this.apiService
          .get(`/dataservice/template/feature/devicetemplates/${id}`)
          .catch((e: Error) => ({ error: e.message }));
        return { ...template, config: cliText((template.templateDefinition as any)?.config?.vipValue), deviceTemplates: dataOf(usedBy) };
      }
      case 'create_cli_template': {
        const types = args.device_types;
        if (!Array.isArray(types) || !types.length || !types.every((t) => typeof t === 'string' && /^[\w.-]+$/.test(t))) {
          throw new Error('device_types must be a non-empty list of device models, e.g. ["vedge-C8000V"]');
        }
        const minVersion = String(args.min_version ?? '15.0.0');
        if (!/^\d+(\.\d+){0,3}$/.test(minVersion)) throw new Error('min_version must look like 15.0.0');
        const body = {
          templateName: cliName(true),
          templateDescription: String(args.description ?? '').trim() || String(args.name),
          templateType: 'cli-template',
          deviceType: types,
          templateMinVersion: minVersion,
          templateDefinition: { config: { vipObjectType: 'object', vipType: 'constant', vipValue: cliConfig(true) } },
          factoryDefault: false,
        };
        return routingWrite('POST', '/dataservice/template/feature', body);
      }
      case 'update_cli_template': {
        if (args.name === undefined && args.description === undefined && args.config === undefined) {
          throw new Error('Nothing to change: give name, description or config');
        }
        const { id, template } = await cliTemplate();
        const definition = (template.templateDefinition ?? {}) as Record<string, any>;
        const config = cliConfig(false);
        const body = {
          templateName: cliName(false) ?? template.templateName,
          templateDescription: args.description !== undefined ? String(args.description) : template.templateDescription,
          templateType: 'cli-template',
          deviceType: template.deviceType,
          templateMinVersion: template.templateMinVersion,
          templateDefinition: config === undefined ? definition : { ...definition, config: { ...(definition.config ?? {}), vipObjectType: 'object', vipType: 'constant', vipValue: config } },
          factoryDefault: false,
        };
        return routingWrite('PUT', `/dataservice/template/feature/${id}`, body);
      }
      case 'delete_cli_template': {
        const { id } = await cliTemplate();
        return routingWrite('DELETE', `/dataservice/template/feature/${id}`);
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
        const group = await this.findGroup('config-group', args.config_group);
        const uuid = await this.resolveDeviceUuid(String(args.device ?? ''));
        return renderPreview(`/dataservice/v1/config-group/${encodeURIComponent(group.id)}`, uuid, { configGroup: group.name });
      }
      case 'plan_config_group_variables': {
        const plan = await planTemplate(migrationDeps(), String(args.template ?? ''), args.config_group);
        const devices = Object.fromEntries(Object.entries(plan.devices).map(([host, d]) => {
          const shown = shownPlan(plan.spec, d);
          const policy = plan.policySpec && d.policyGroupValues && d.policyGroupReport
            ? shownPlan(plan.policySpec, { values: d.policyGroupValues, report: d.policyGroupReport })
            : undefined;
          return [host, { ...d, ...shown, ...(policy ? { policyGroupValues: policy.values, policyGroupReport: policy.report } : {}) }];
        }));
        return { template: plan.template.templateName, configGroup: plan.group.name, policyGroup: plan.policyGroup?.name, devices };
      }
      case 'deploy_template_migration': {
        const migration = new TemplateMigration(migrationDeps(), this.migrationState);
        const step = pick('step', { prepare: 'prepare', deploy: 'deploy', status: 'status', deploy_policy_group: 'deploy_policy_group' }, '');
        const device = String(args.device ?? '').trim();
        if (!device) throw new Error('device is required (hostname, system IP, UUID or chassis number)');
        const waitSeconds = args.wait_seconds === undefined ? undefined : Number(args.wait_seconds);
        if (waitSeconds !== undefined && !(waitSeconds >= 0 && waitSeconds <= 900)) throw new Error('wait_seconds must be between 0 and 900');
        const common = { device, config_group: args.config_group, accept_review: args.accept_review === true, wait_seconds: waitSeconds };
        if (step === 'prepare') return migration.prepare({ ...common, template: String(args.template ?? '') });
        if (step === 'deploy') return migration.deploy({ ...common, sig_ready: args.sig_ready === true });
        if (step === 'status') return migration.status(common);
        return migration.deployPolicyGroup(common);
      }
      case 'find_config_group_conversion_defects': {
        const width = this.config.fabricConcurrency;
        const [groups, policyGroups, featureList] = await Promise.all([
          args.config_group ? this.findGroup('config-group', args.config_group).then((g) => [g]) : this.listGroups('config-group'),
          this.listGroups('policy-group'),
          this.apiService.get<{ data?: Array<{ templateId: string; templateName: string; templateType: string }> }>('/dataservice/template/feature'),
        ]);
        const featureTemplates = new Map((featureList.data ?? []).map((t) => [`${t.templateName}\u0000${t.templateType}`, t.templateId]));
        // Promises, so parcels sharing a feature template fetch it once even when read in parallel.
        const definitions = new Map<string, Promise<Record<string, any>>>();
        const source = (name: string, type: string) => {
          const id = featureTemplates.get(`${name}\u0000${type}`);
          if (!id) return Promise.resolve(undefined);
          if (!definitions.has(id)) {
            definitions.set(id, this.apiService
              .get<{ templateDefinition?: unknown }>(`/dataservice/template/feature/object/${encodeURIComponent(id)}`)
              .then((body) => (body.templateDefinition ?? {}) as Record<string, any>));
          }
          return definitions.get(id) as Promise<Record<string, any>>;
        };
        const groupProfiles = await mapLimit(groups, width, async (group) => {
          const policyGroup = policyGroups.find((g) => g.name === group.name);
          const [detail, policyDetail] = await Promise.all([
            this.apiService.get<{ profiles?: UxProfile[] }>(`/dataservice/v1/config-group/${encodeURIComponent(group.id)}`),
            policyGroup ? this.apiService.get<{ profiles?: UxProfile[] }>(`/dataservice/v1/policy-group/${encodeURIComponent(policyGroup.id)}`) : undefined,
          ]);
          return [...(detail.profiles ?? []), ...(policyDetail?.profiles ?? []).filter((p) => p.type === 'sig-security')].map((profile) => ({ group, profile }));
        });
        const seen = new Set<string>();
        const profiles = groupProfiles.flat().filter(({ profile }) => !seen.has(profile.id) && seen.add(profile.id));
        const parcelLists = await mapLimit(profiles, width, async ({ group, profile }) => {
          const url = `/dataservice/v1/feature-profile/sdwan/${profile.type}/${encodeURIComponent(profile.id)}`;
          const body = await this.apiService.get<{ associatedProfileParcels?: any[] }>(url, profile.type === 'sig-security' ? undefined : { details: 'true' });
          const parcels: Array<{ group: UxGroup; profile: UxProfile; parcelType: string; path: string }> = [];
          for (const parcel of body.associatedProfileParcels ?? []) {
            const path = `${url}/${parcel.parcelType}/${encodeURIComponent(parcel.parcelId)}`;
            parcels.push({ group, profile, parcelType: parcel.parcelType, path });
            for (const sub of parcel.subparcels ?? []) {
              const suffix = sub.parcelType.startsWith(`${parcel.parcelType}/`) ? sub.parcelType.slice(parcel.parcelType.length + 1) : sub.parcelType;
              parcels.push({ group, profile, parcelType: sub.parcelType, path: `${path}/${suffix}/${encodeURIComponent(sub.parcelId)}` });
            }
          }
          return parcels.filter((p) => p.parcelType === 'wan/vpn/interface/ethernet' || p.parcelType === 'sig');
        });
        const checked = await mapLimit(parcelLists.flat(), width, async ({ group, profile, parcelType, path }) => {
          const payload = (await this.apiService.get<{ payload?: any }>(path)).payload ?? {};
          const original = payload.data ?? {};
          let data = original;
          const applied: string[] = [];
          for (const rule of CONVERSION_RULES) {
            const template = rule.templateType ? await source(payload.name, rule.templateType) : undefined;
            if (rule.templateType && !template) continue;
            if (rule.applies(parcelType, data, template)) {
              data = rule.fix(data, template);
              applied.push(rule.name);
            }
          }
          if (!applied.length) return undefined;
          return {
            configGroup: group.name,
            profile: profile.name,
            feature: payload.name,
            defects: applied,
            changes: parcelChanges(original, data),
            fix: holdsSecret(data)
              ? { method: 'PUT', path, body: 'left out: the feature holds a secret; make the changes above in vManage' }
              : { method: 'PUT', path, body: { name: payload.name, description: payload.description, data } },
          };
        });
        const findings = checked.filter((f) => f !== undefined);
        return { defects: findings.length, findings };
      }
      case 'get_topology_group': {
        const group = await this.findGroup('topology-group', args.topology_group);
        return this.apiService.get(`/dataservice/v1/topology-group/${encodeURIComponent(group.id)}`);
      }

      case 'get_group_variables': {
        const { path } = await groupTarget(['config', 'policy']);
        if (args.fetch_body !== undefined) {
          const body = args.fetch_body;
          if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('fetch_body must be an object');
          // Read-only query sent as POST (fetchConfigGroupDeviceVariables / fetchPolicyGroupDeviceVariables).
          return (await this.apiService.request('POST', `${path}/device/variables`, { body })).body;
        }
        if (args.schema === true) return this.apiService.get(`${path}/device/variables/schema`);
        const query: Record<string, string> = {};
        if (args.device !== undefined) query['device-id'] = await this.resolveDeviceUuid(String(args.device));
        if (args.suggestions === true) query.suggestions = 'true';
        return this.apiService.get(`${path}/device/variables`, query);
      }
      case 'get_group_rules': {
        const { kind, path } = await groupTarget(['config', 'policy', 'topology']);
        return this.apiService.get(kind === 'topology-group' ? `${path}/rules/preview` : `${path}/rules`);
      }
      case 'preview_group_device_config': {
        const { kind, group, path } = await groupTarget(['policy', 'topology']);
        const uuid = await this.resolveDeviceUuid(String(args.device ?? ''));
        return renderPreview(path, uuid, { [kind === 'policy-group' ? 'policyGroup' : 'topologyGroup']: group.name });
      }
      case 'create_group': {
        const kind = GROUP_KINDS[pick('group_type', Object.fromEntries(Object.keys(GROUP_KINDS).map((k) => [k, k])), '')];
        return routingWrite('POST', `/dataservice/v1/${kind}`, writeBody());
      }
      case 'update_group': {
        const { path } = await groupTarget(['config', 'policy', 'topology']);
        return routingWrite('PUT', path, writeBody());
      }
      case 'delete_group': {
        const { kind, path } = await groupTarget(['config', 'policy', 'topology']);
        if (args.delete_profiles !== undefined && kind === 'topology-group') throw new Error('delete_profiles applies only to configuration and policy groups');
        return routingWrite('DELETE', path, undefined, args.delete_profiles === true ? { deleteProfiles: true } : undefined);
      }
      case 'associate_group_devices': {
        const { path } = await groupTarget(['config', 'policy']);
        const method = { add: 'POST', replace: 'PUT', remove: 'DELETE' }[pick('mode', { add: 'add', replace: 'replace', remove: 'remove' }, 'add')] as HttpMethod;
        return routingWrite(method, `${path}/device/associate`, await groupDevices());
      }
      case 'update_group_variables': {
        const { path } = await groupTarget(['config', 'policy']);
        return routingWrite('PUT', `${path}/device/variables`, writeBody());
      }
      case 'deploy_group': {
        const { path } = await groupTarget(['config', 'policy', 'topology']);
        return routingWrite('POST', `${path}/device/deploy`, await groupDevices());
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
        const profileId = await this.resolveFeatureProfileId(solution, type, args.profile);
        const withDetails = await this.catalog.hasQueryParam(`/v1/feature-profile/${solution}/${type}/{id}`, 'details');
        return this.apiService.get(`${listPath}/${encodeURIComponent(profileId)}`, withDetails ? { details: 'true' } : undefined);
      }
      case 'get_network_hierarchy': {
        const nodes = await this.hierarchyNodes();
        if (args.label !== undefined) {
          const label = pick('label', { global: 'GLOBAL', region: 'REGION', area: 'AREA', site: 'SITE' }, '');
          return nodes.filter((n) => hierarchyLabel(n) === label);
        }
        if (args.node === undefined) return nodes;
        const node = await this.findHierarchyNode(args.node);
        const id = hierarchyNodeId(node);
        const detail = await this.apiService.get<Record<string, unknown>>(`/dataservice/v1/network-hierarchy/${encodeURIComponent(id)}`);
        const parent = nodes.find((n) => hierarchyNodeId(n) === node.data?.parentUuid);
        const children = nodes.filter((n) => n.data?.parentUuid === id);
        return {
          ...detail,
          id,
          hierarchyPath: node.hierarchyPath,
          deviceCount: node.deviceCount,
          parent: parent ? { id: hierarchyNodeId(parent), name: parent.name, label: hierarchyLabel(parent) } : null,
          children: children.map((c) => ({ id: hierarchyNodeId(c), name: c.name, label: hierarchyLabel(c), deviceCount: c.deviceCount })),
        };
      }
      case 'get_hierarchy_cybervision': {
        const base = await cybervisionBase();
        if (args.center_name !== undefined) return this.apiService.get(`${base}/id`, { cvName: cybervisionName() });
        return this.apiService.get(base);
      }
      case 'create_hierarchy_cybervision':
        return routingWrite('POST', await cybervisionBase(), writeBody());
      case 'delete_hierarchy_cybervision': {
        const base = await cybervisionBase();
        let centerId = args.center_id === undefined ? undefined : String(args.center_id);
        if (centerId === undefined) {
          if (args.center_name === undefined) throw new Error('Give center_id or center_name');
          const found = await this.apiService.get<unknown>(`${base}/id`, { cvName: cybervisionName() });
          const value = typeof found === 'string' ? found : (found as Record<string, unknown> | null)?.id ?? (found as Record<string, unknown> | null)?.cvId;
          if (value === undefined || value === null || value === '') throw new Error(`No Cyber Vision center named "${args.center_name}" on this node`);
          centerId = String(value);
        }
        if (!/^[\w.-]{1,128}$/.test(centerId)) throw new Error('center_id must be a Cyber Vision center ID');
        return routingWrite('DELETE', `${base}/${encodeURIComponent(centerId)}`);
      }

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

  private async hierarchyNodes(): Promise<HierarchyNode[]> {
    const body = await this.apiService.get<unknown>('/dataservice/v1/network-hierarchy', undefined, GROUP_LIST_TTL_MS);
    const rows = dataOf(body);
    return Array.isArray(rows) ? (rows as HierarchyNode[]) : [];
  }

  /** Finds a hierarchy node by ID, exact name, hierarchy path or site ID. */
  private async findHierarchyNode(ref: unknown): Promise<HierarchyNode> {
    const value = String(ref ?? '').trim();
    if (!value) throw new Error('node is required (name, hierarchy path, site ID or node ID)');
    const nodes = await this.hierarchyNodes();
    const lower = value.toLowerCase();
    const byId = nodes.find((n) => hierarchyNodeId(n) === value);
    if (byId) return byId;
    const byPath = nodes.find((n) => String(n.hierarchyPath ?? '').toLowerCase() === lower);
    if (byPath) return byPath;
    const bySite = /^\d+$/.test(value) ? nodes.filter((n) => String(hierarchySiteId(n)) === value) : [];
    const byName = nodes.filter((n) => String(n.name ?? '').toLowerCase() === lower);
    const matches = bySite.length ? bySite : byName;
    if (matches.length === 1) return matches[0];
    if (matches.length > 1) {
      throw new Error(`"${value}" matches several nodes: ${matches.map((n) => n.hierarchyPath ?? n.name).join(', ')}. Use the hierarchy path or node ID.`);
    }
    throw new Error(`No network hierarchy node "${value}". Available: ${nodes.map((n) => n.hierarchyPath ?? n.name).join(', ') || 'none'}`);
  }

  private async featureProfileTypesFor(solution: string): Promise<string[]> {
    const types = await this.catalog.featureProfileTypes(solution);
    if (!types.length) {
      const solutions = await this.catalog.featureProfileSolutions();
      throw new Error(`Unknown solution "${solution}". Available: ${solutions.join(', ')}`);
    }
    return types;
  }

  private async resolveFeatureProfileId(solution: string, type: string, value: unknown): Promise<string> {
    const ref = String(value ?? '').trim();
    if (!ref) throw new Error('profile is required (profile ID or name)');
    if (UUID.test(ref)) return ref;
    const rows = await this.apiService.get<Array<Record<string, unknown>>>(
      `/dataservice/v1/feature-profile/${solution}/${type}`,
      undefined,
      GROUP_LIST_TTL_MS
    );
    const match = rows.find((p) => String(p.profileName).toLowerCase() === ref.toLowerCase());
    if (!match) {
      throw new Error(`No ${solution} ${type} profile named "${ref}". Available: ${rows.map((p) => p.profileName).join(', ') || 'none'}`);
    }
    return String(match.profileId);
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
