// Monitoring and troubleshooting coverage check against the bundled SD-WAN Manager 26.2.1 OpenAPI spec (offline).
// Every operation of the Monitoring, Real-Time Monitoring and Troubleshooting categories must be implemented by a tool,
// or excluded with a reason; every view of the monitoring tools must be a supported (non-deprecated) operation.
// Usage: npm run build && npm run verify:monitoring [-- --write]   (--write refreshes the README inventory)
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { ApiCatalog } from '../build/services/apiCatalog.js';
import { MONITORING_VIEWS, STATISTICS_DATASETS, STATISTICS_OPERATIONS, view } from '../build/services/monitoringCatalog.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const spec = JSON.parse(readFileSync(join(ROOT, 'resources/vmanageapi-26.2.1.json'), 'utf8'));
const catalog = new ApiCatalog({ host: 'offline' }, true);
catalog.index(spec);
catalog.spec = spec;
const ops = catalog.allOperations();

// Categories of the official "Monitoring and Troubleshooting" API reference (26.2): Monitoring, Real-Time Monitoring,
// Troubleshooting Tools and Troubleshooting MRE. File-based real-time data collection is a real-time monitoring tool too.
const IN_SCOPE = /^(Monitoring - |Real[- ]Time Monitoring|Troubleshooting |File based RealTime)/;
const scope = ops.filter((o) => IN_SCOPE.test(o.tag));
const key = (method, path) => `${method} ${path}`;
const byKey = new Map(ops.map((o) => [key(o.method, o.path), o]));

// Operations served by tools that existed before 1.3.0 (paths as called in src/server.ts).
const EXISTING = {
  list_devices: ['/device'], get_device_details: ['/device'], list_reachable_devices: ['/device/reachable'],
  list_vedge_inventory: ['/device/vedgeinventory/detail'], get_device_tloc: ['/device/tloc'], list_alarms: ['/alarms'],
  get_fabric_health: ['/health/devices'],
  get_control_connections: ['/device/control/connections', '/device/control/synced/connections'],
  get_control_connections_history: ['/device/control/connectionshistory'],
  get_control_summary: ['/device/control/summary'], get_control_statistics: ['/device/control/statistics'],
  get_control_local_properties: ['/device/control/localproperties', '/device/control/synced/localproperties'],
  get_control_wan_interfaces: ['/device/control/waninterface', '/device/control/synced/waninterface'],
  get_control_valid_devices: ['/device/control/validdevices', '/device/control/validvsmarts', '/device/control/validvmanageid'],
  get_control_affinity: ['/device/control/affinity/config', '/device/control/affinity/status'],
  get_control_links: ['/device/control/links'], get_control_status: ['/device/control/status'],
  get_control_count: ['/device/control/count'], get_control_network_summary: ['/device/control/networksummary'],
  get_omp_peers: ['/device/omp/peers', '/device/omp/synced/peers'],
  get_omp_routes: ['/device/omp/routes/received', '/device/omp/routes/advertised', '/device/omp/routes/received/ompIpv6', '/device/omp/routes/advertised/ompIpv6'],
  get_omp_tlocs: ['/device/omp/tlocs/received', '/device/omp/tlocs/advertised'], get_omp_services: ['/device/omp/services'],
  get_omp_multicast: ['/device/omp/mcastroutesrecv', '/device/omp/mcastroutesadvt', '/device/omp/mcastautodiscoverrecv', '/device/omp/mcastautodiscoveradvt'],
  get_omp_cloudx: ['/device/omp/cloudx'], get_omp_links: ['/device/omp/links'], get_omp_status: ['/device/omp/status'], get_omp_summary: ['/device/omp/summary'],
  get_validator_connections: ['/device/orchestrator/connections', '/device/orchestrator/connectionshistory'],
  get_validator_summary: ['/device/orchestrator/summary'], get_validator_statistics: ['/device/orchestrator/statistics'],
  get_validator_local_properties: ['/device/orchestrator/localproperties'],
  get_validator_valid_devices: ['/device/orchestrator/validvedges', '/device/orchestrator/validvsmarts', '/device/orchestrator/validvmanageid'],
  get_validator_proxy_mapping: ['/device/orchestrator/proxymapping'],
  get_bfd_sessions: ['/device/bfd/sessions', '/device/bfd/synced/sessions'], get_bfd_summary: ['/device/bfd/summary'], get_bfd_tloc: ['/device/bfd/tloc'],
  get_device_interfaces: ['/device/interface', '/device/interface/synced'],
  get_system_status: ['/device/system/status', '/device/system/synced/status'], get_device_arp: ['/device/arp'],
  get_app_route_statistics: ['/device/app-route/statistics'], get_app_route_sla_class: ['/device/app-route/sla-class'],
  get_bgp_neighbors: ['/device/bgp/neighbors'], get_bgp_routes: ['/device/bgp/routes'], get_bgp_summary: ['/device/bgp/summary'],
  get_ospf_process: ['/device/ospf/process'], get_ospf_neighbors: ['/device/ospf/neighbor', '/device/ospf/v3neighbor'],
  get_ospf_interfaces: ['/device/ospf/interface', '/device/ospf/v3interface'], get_ospf_routes: ['/device/ospf/routes'],
  get_ospf_database: ['/device/ospf/database', '/device/ospf/databasesummary', '/device/ospf/databaseexternal'],
  get_eigrp_interfaces: ['/device/eigrp/interface'], get_eigrp_routes: ['/device/eigrp/route'], get_eigrp_topology: ['/device/eigrp/topology'],
  get_igmp_status: ['/device/igmp/groups', '/device/igmp/interface', '/device/igmp/statistics', '/device/igmp/summary'],
  get_pim_status: ['/device/pim/neighbor', '/device/pim/interface', '/device/pim/rp-mapping', '/device/pim/statistics'],
  get_multicast_status: ['/device/multicast/topology', '/device/multicast/rpf', '/device/multicast/replicator', '/device/multicast/tunnel'],
  get_mfib: ['/device/ip/mfibsummary', '/device/ip/mfiboil', '/device/ip/mfibstats'],
  get_ipv6_status: ['/device/ipv6/nd6', '/device/ndv6', '/device/ip/ipRoutes', '/device/ip/v6fib', '/device/interface/ipv6Stats', '/device/dhcpv6/interface', '/device/ip/nat64/translation', '/device/cedgecflowd/app-fwd-cflowd-v6-flows'],
  get_ipv6_policy_status: ['/device/policy/ipv6/accesslistnames', '/device/policy/ipv6/accesslistassociations', '/device/policy/ipv6/accesslistcounters', '/device/policy/ipv6/accesslistpolicers', '/device/roleBasedIpv6Counters', '/device/roleBasedIpv6Permissions'],
  get_cflowd_flows: ['/device/cflowd/flows'], get_cflowd_statistics: ['/device/cflowd/statistics'],
  get_app_log_flows: ['/device/app/log/flows'], get_app_log_flow_count: ['/device/app/log/flow-count'],
  get_sdwan_stats: ['/device/sdwan-stats'], get_device_vpn: ['/device/vpn'], get_bridge_table: ['/device/bridge/table'],
};

// In-scope reads deliberately not given a dedicated view, with the reason.
const SECRET_CONFIG = 'Returns device configuration text, which can hold passwords and keys; preview_config_group_device_config (view existing) returns a masked running config';
const SESSION_READ = 'Reads a streaming troubleshooting session (packet capture, debug log, speed test, DM log) that only a state-changing operation can start';
const EXCLUDED_READS = [
  [/\/csv$/, 'CSV export of the JSON raw-data operation (use query_statistics, operation raw or page)'],
  [/^\/device\/config$|^\/v1\/device\/(runningIosCliConfig|unsupportedCliConfig)\/|^\/device\/interface\/config$/, SECRET_CONFIG],
  [/^\/stream\/(device\/(capture|log|speed)|dmlog)\/(status|download|\{sessionId\})|^\/stream\/device\/(log|speed)\/\{sessionId\}$/, SESSION_READ],
  [/^\/stream\/device\/umts\//, SESSION_READ],
  [/download/, 'File download (binary content); not usable as an MCP JSON result'],
  [/^\/statistics\/process$/, 'processStatisticsData ("Process stats data") runs statistics processing on the Manager; not a monitoring read'],
];

const DEPRECATED_REPLACEMENT = [
  [/^\/statistics\/bfd/, 'None named by Cisco. Closest supported: get_bfd_sessions / get_fabric_bfd_status (real time), query_statistics dataset approute'],
  [/^\/statistics\/cflowd/, 'None named by Cisco. Closest supported: query_statistics dataset flowlog, get_cflowd_flows'],
  [/^\/statistics\/device/, 'None named by Cisco. Closest supported: query_statistics dataset system'],
  [/^\/statistics\/system\/stats/, 'None named by Cisco. Closest supported: query_statistics dataset system (/statistics/system)'],
  [/^\/device\/config\/html$/, 'None named by Cisco. Same data as text: GET /device/config (excluded here: holds secrets)'],
  [/^\/device\/dpi\/qosmos\/applications$/, 'None named by Cisco. Closest supported: get_device_dataplane_realtime view dpi-qosmos-static-applications'],
  [/^\/stream\/device\/umts\/statistics/, 'None named by Cisco'],
  [/./, 'None named by Cisco'],
];

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`FAIL  ${msg}`);
};

// 1. Every view is a supported operation of the 26.2.1 spec, read-only (diagnostics: action), not deprecated.
const implemented = new Map(); // key -> { tool, view }
const viewRows = [];
for (const [tool, views] of Object.entries(MONITORING_VIEWS)) {
  for (const [name, raw] of Object.entries(views)) {
    const v = view(raw);
    for (const [variant, path] of [['', v.path], [' (synced: true)', v.synced]]) {
      if (!path) continue;
      const op = byKey.get(key(v.method ?? 'GET', path));
      if (!op) {
        fail(`${tool} view ${name}${variant}: ${v.method ?? 'GET'} ${path} is not in the 26.2.1 spec`);
        continue;
      }
      if (op.deprecated) fail(`${tool} view ${name}: ${op.operationId} is deprecated`);
      const expected = tool === 'run_device_diagnostic' ? 'write' : 'read';
      if (op.access !== expected) fail(`${tool} view ${name}: ${op.operationId} is ${op.access} (${op.accessReason}), expected ${expected}`);
      if (implemented.has(key(op.method, op.path))) fail(`${op.method} ${op.path} has two views`);
      implemented.set(key(op.method, op.path), { tool, view: `${name}${variant}` });
      viewRows.push({ tool, view: `${name}${variant}`, op });
    }
  }
}
for (const [dataset, base] of Object.entries(STATISTICS_DATASETS)) {
  let found = 0;
  for (const [operation, o] of Object.entries(STATISTICS_OPERATIONS)) {
    for (const method of ['POST', 'GET']) {
      const path = `/statistics${base ? `/${base}` : ''}${o.path}`;
      const op = byKey.get(key(method, path));
      if (!op) continue;
      found++;
      if (op.deprecated) fail(`query_statistics ${dataset}/${operation}: ${op.operationId} is deprecated`);
      if (op.access !== 'read') fail(`query_statistics ${dataset}/${operation}: ${op.operationId} is ${op.access}`);
      implemented.set(key(method, path), { tool: 'query_statistics', view: `${dataset} / ${operation}` });
      viewRows.push({ tool: 'query_statistics', view: `${dataset} / ${operation}`, op });
    }
  }
  if (!found) fail(`query_statistics dataset ${dataset} has no operation in the spec`);
}

// 2. Every in-scope operation is implemented, served by an existing tool, or excluded with a reason.
const existing = new Map();
for (const [tool, paths] of Object.entries(EXISTING)) {
  for (const p of paths) {
    const k = key('GET', p);
    if (!byKey.has(k)) fail(`EXISTING ${tool}: GET ${p} is not in the spec`);
    if (implemented.has(k)) fail(`GET ${p} is both an existing tool and a new view`);
    existing.set(k, [...(existing.get(k) ?? []), tool]);
  }
}
const rows = { implemented: [], existing: [], deprecated: [], excluded: [] };
for (const op of scope) {
  const k = key(op.method, op.path);
  const entry = { op };
  if (implemented.has(k)) rows.implemented.push({ ...entry, ...implemented.get(k) });
  else if (existing.has(k)) rows.existing.push({ ...entry, tool: existing.get(k).join(', ') });
  else if (op.deprecated) rows.deprecated.push({ ...entry, replacement: DEPRECATED_REPLACEMENT.find(([re]) => re.test(op.path))[1] });
  else if (op.access === 'blocked') rows.excluded.push({ ...entry, status: 'Unsupported over MCP', reason: op.accessReason });
  else if (op.access === 'write') {
    rows.excluded.push({ ...entry, status: 'State-changing', reason: `${op.accessReason}; call_api_operation runs it when VMANAGE_ALLOW_WRITE=true and confirm: true` });
  } else {
    const rule = EXCLUDED_READS.find(([re]) => re.test(op.path));
    if (rule) rows.excluded.push({ ...entry, status: 'Excluded read', reason: rule[1] });
    else fail(`${op.method} ${op.path} (${op.operationId}, ${op.tag}) is a supported read with no tool and no exclusion reason`);
  }
}

const count = (list) => list.length;
const summary = {
  specVersion: spec.info?.version,
  inScope: scope.length,
  deprecated: scope.filter((o) => o.deprecated).length,
  supported: scope.filter((o) => !o.deprecated).length,
  newViews: count(rows.implemented),
  existingTools: count(rows.existing),
  excludedDeprecated: count(rows.deprecated),
  excludedOther: count(rows.excluded),
  excludedByStatus: rows.excluded.reduce((m, r) => ({ ...m, [r.status]: (m[r.status] ?? 0) + 1 }), {}),
};
console.log(JSON.stringify(summary, null, 2));
const accounted = summary.newViews + summary.existingTools + summary.excludedDeprecated + summary.excludedOther;
if (accounted !== summary.inScope) fail(`${summary.inScope} in-scope operations, ${accounted} accounted for`);

// 3. README inventory (between markers).
if (process.argv.includes('--write')) {
  const esc = (s) => String(s).replace(/\|/g, '\\|');
  const category = (tag) => tag.replace(/^Real[- ]Time Monitoring ?-? ?/, 'Real-Time: ').replace(/^Monitoring - /, 'Monitoring: ').replace(/^Troubleshooting Tools - /, 'Troubleshooting: ');
  const sortRows = (list) => list.sort((a, b) => category(a.op.tag).localeCompare(category(b.op.tag)) || a.op.path.localeCompare(b.op.path) || a.op.method.localeCompare(b.op.method));
  const lines = [];
  lines.push(`Generated by \`npm run verify:monitoring -- --write\` from the bundled SD-WAN Manager ${spec.info?.version ?? ''} spec (26.2.1).`, '');
  lines.push('| Item | Count |', '|---|---|');
  lines.push(`| Monitoring, Real-Time Monitoring and Troubleshooting operations | ${summary.inScope} |`);
  lines.push(`| Supported (not deprecated) | ${summary.supported} |`);
  lines.push(`| Implemented by the 1.3.0 monitoring tools and views | ${summary.newViews} |`);
  lines.push(`| Already served by earlier dedicated tools | ${summary.existingTools} |`);
  lines.push(`| Excluded: deprecated | ${summary.excludedDeprecated} |`);
  for (const [status, n] of Object.entries(summary.excludedByStatus)) lines.push(`| Excluded: ${status.toLowerCase()} | ${n} |`);
  lines.push('', '<details><summary>Implemented operations (tool and view per endpoint)</summary>', '');
  lines.push('| Category | Method | Endpoint | Tool | View |', '|---|---|---|---|---|');
  for (const r of sortRows(rows.implemented)) lines.push(`| ${esc(category(r.op.tag))} | ${r.op.method} | \`/dataservice${esc(r.op.path)}\` | \`${r.tool}\` | \`${esc(r.view)}\` |`);
  lines.push('', '</details>', '', '<details><summary>Operations served by earlier tools</summary>', '');
  lines.push('| Category | Method | Endpoint | Tool |', '|---|---|---|---|');
  for (const r of sortRows(rows.existing)) lines.push(`| ${esc(category(r.op.tag))} | ${r.op.method} | \`/dataservice${esc(r.op.path)}\` | \`${esc(r.tool)}\` |`);
  lines.push('', '</details>', '', '<details><summary>Deprecated operations (not implemented)</summary>', '');
  lines.push('| Category | Method | Endpoint | Operation | Replacement |', '|---|---|---|---|---|');
  for (const r of sortRows(rows.deprecated)) lines.push(`| ${esc(category(r.op.tag))} | ${r.op.method} | \`/dataservice${esc(r.op.path)}\` | ${r.op.operationId} | ${esc(r.replacement)} |`);
  lines.push('', '</details>', '', '<details><summary>Other operations without a dedicated view</summary>', '');
  lines.push('| Category | Method | Endpoint | Status | Reason |', '|---|---|---|---|---|');
  for (const r of sortRows(rows.excluded)) lines.push(`| ${esc(category(r.op.tag))} | ${r.op.method} | \`/dataservice${esc(r.op.path)}\` | ${r.status} | ${esc(r.reason)} |`);
  lines.push('', '</details>');
  const readmePath = join(ROOT, 'README.md');
  const readme = readFileSync(readmePath, 'utf8');
  const start = '<!-- monitoring-inventory:start -->';
  const end = '<!-- monitoring-inventory:end -->';
  const i = readme.indexOf(start);
  const j = readme.indexOf(end);
  if (i < 0 || j < i) fail('README markers for the monitoring inventory are missing');
  else writeFileSync(readmePath, `${readme.slice(0, i + start.length)}\n${lines.join('\n')}\n${readme.slice(j)}`);
}

console.log(failures ? `\n${failures} failure(s)` : '\nAll monitoring and troubleshooting operations accounted for');
process.exit(failures ? 1 : 0);
