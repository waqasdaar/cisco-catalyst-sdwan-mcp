// Offline regression test: runs the MCP server against a simulated vManage (HTTPS on localhost).
// No lab needed; used by CI. Requires openssl to create a throwaway certificate.
// Usage: npm test
import { execFileSync } from 'child_process';
import { mkdtempSync, readFileSync, rmSync } from 'fs';
import https from 'https';
import { tmpdir } from 'os';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const PROJECT_DIR = fileURLToPath(new URL('..', import.meta.url));
const SPEC = readFileSync(join(PROJECT_DIR, 'resources/vmanageapi-26.2.1.json'));

// ---------- Simulated vManage ----------
// Documentation addresses (RFC 5737) and generic names only.
const DEVICES = [
  { 'host-name': 'Manager', 'system-ip': '192.0.2.1', 'device-type': 'vmanage', reachability: 'reachable', 'site-id': '1', uuid: 'u-1' },
  { 'host-name': 'Controller-1', 'system-ip': '192.0.2.2', 'device-type': 'vsmart', reachability: 'reachable', 'site-id': '1', uuid: 'u-2' },
  { 'host-name': 'Validator', 'system-ip': '192.0.2.3', 'device-type': 'vbond', reachability: 'reachable', 'site-id': '1', uuid: 'u-3' },
  { 'host-name': 'Branch-1', 'system-ip': '192.0.2.11', 'device-type': 'vedge', reachability: 'reachable', 'site-id': '100', uuid: 'u-11' },
  { 'host-name': 'Branch-2', 'system-ip': '192.0.2.12', 'device-type': 'vedge', reachability: 'reachable', 'site-id': '200', uuid: 'u-12' },
  { 'host-name': 'Branch-3', 'system-ip': '192.0.2.13', 'device-type': 'vedge', reachability: 'unreachable', 'site-id': '300', uuid: 'u-13' },
];
const bfd = (deviceId) =>
  deviceId === '192.0.2.12'
    ? [{ 'system-ip': '192.0.2.11', color: 'mpls', 'local-color': 'mpls', state: 'down', 'site-id': 100 }]
    : [
        { 'system-ip': '192.0.2.12', color: 'mpls', 'local-color': 'mpls', state: 'up', 'site-id': 200 },
        { 'system-ip': '192.0.2.12', color: 'biz-internet', 'local-color': 'biz-internet', state: 'up', 'site-id': 200 },
      ];
const tlocs = () => [
  { color: 'mpls', interface: 'GigabitEthernet1', 'operation-state': 'up', 'admin-state': 'up', 'public-ip': '198.51.100.1', 'private-ip': '198.51.100.1' },
  { color: 'biz-internet', interface: 'GigabitEthernet2', 'operation-state': 'up', 'admin-state': 'up', 'public-ip': '203.0.113.1', 'private-ip': '203.0.113.1' },
];

const stats = { logins: 0, sessionLogins: 0, logouts: 0, ompStatusCalls: 0, ompSummaryCalls: 0, deviceIds: [] };
const tokens = new Set();
// Large-fabric mode for the fan-out tests: extra healthy edges, slow or overloaded BFD queries.
const mock = { extraEdges: 0, bfdDelayMs: 0, bfdStatus: 200, bfdCalls: 0, bfdInFlight: 0, bfdMaxInFlight: 0 };
// Multi-tenant Manager: provider account switches tenants with a VSessionId header.
const TENANTS = [
  { tenantId: 't-1', name: 'Tenant-A', orgName: 'Org A', subDomain: 'a.example.com' },
  { tenantId: 't-2', name: 'Tenant-B', orgName: 'Org B', subDomain: 'b.example.com' },
];
const TENANT_DEVICES = {
  't-1': DEVICES.slice(3, 5).map((d) => ({ ...d, 'host-name': `A-${d['host-name']}` })),
  't-2': DEVICES.slice(3, 4).map((d) => ({ ...d, 'host-name': `B-${d['host-name']}` })),
};
const vsessions = new Map(); // VSessionId -> tenantId
const tenantStats = { vsessionCalls: 0 };
const allDevices = () => [
  ...DEVICES,
  ...Array.from({ length: mock.extraEdges }, (_, i) => ({
    'host-name': `Edge-${i}`, 'system-ip': `10.255.${Math.floor(i / 250)}.${(i % 250) + 1}`, 'device-type': 'vedge', reachability: 'reachable', 'site-id': '900', uuid: `x-${i}`,
  })),
];

function handler(req, res) {
  const url = new URL(req.url, 'https://localhost');
  const send = (status, body, headers = {}) => {
    res.writeHead(status, { 'content-type': 'application/json', ...headers });
    res.end(typeof body === 'string' ? body : JSON.stringify(body));
  };
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => {
    const p = url.pathname;
    if (p === '/jwt/login' && req.method === 'POST') {
      const token = `tok-${++stats.logins}`;
      tokens.add(token);
      return send(200, { token, csrf: 'csrf', exp: Math.floor(Date.now() / 1000) + 1800 });
    }
    if (p === '/j_security_check') {
      stats.sessionLogins++;
      return send(200, '', { 'set-cookie': 'JSESSIONID=sess-1; Path=/; Secure' });
    }
    if (p === '/logout') {
      if (req.headers.cookie?.includes('JSESSIONID=sess-1')) stats.logouts++;
      return send(302, '', { location: '/' });
    }
    if (p === '/apidocs/vmanageapi.json') return send(200, SPEC.toString());

    const bearer = req.headers.authorization?.replace('Bearer ', '');
    const authorized = (bearer && tokens.has(bearer)) || req.headers.cookie?.includes('JSESSIONID=sess-1');
    if (!authorized) return send(401, { error: 'unauthorized' });
    if (p === '/dataservice/client/token') return send(200, '"xsrf"');

    if (p === '/dataservice/tenant' && req.method === 'GET') return send(200, { data: TENANTS });
    const vsessionPath = /^\/dataservice\/tenant\/([^/]+)\/vsessionid$/.exec(p);
    if (vsessionPath && req.method === 'POST') {
      tenantStats.vsessionCalls++;
      const id = `vs-${vsessionPath[1]}-${tenantStats.vsessionCalls}`;
      vsessions.set(id, vsessionPath[1]);
      return send(200, { VSessionId: id });
    }
    const vsessionHeader = req.headers.vsessionid;
    if (vsessionHeader && !vsessions.has(vsessionHeader)) return send(403, { error: 'invalid VSessionId' });
    const tenantId = vsessions.get(vsessionHeader);
    if (tenantId && p === '/dataservice/device') return send(200, { data: TENANT_DEVICES[tenantId] });

    const deviceId = url.searchParams.get('deviceId');
    if (deviceId) stats.deviceIds.push(deviceId);
    switch (p) {
      case '/dataservice/device':
        return send(200, { data: allDevices() });
      case '/dataservice/device/reachable':
        return send(200, { data: allDevices().filter((d) => d.reachability === 'reachable') });
      case '/dataservice/device/bfd/sessions':
      case '/dataservice/device/bfd/synced/sessions': {
        mock.bfdCalls++;
        mock.bfdMaxInFlight = Math.max(mock.bfdMaxInFlight, ++mock.bfdInFlight);
        const reply = () => {
          mock.bfdInFlight--;
          if (mock.bfdStatus !== 200) send(mock.bfdStatus, { error: 'busy' });
          else send(200, { data: bfd(deviceId) });
        };
        return mock.bfdDelayMs ? setTimeout(reply, mock.bfdDelayMs) : reply();
      }
      case '/dataservice/device/control/waninterface':
      case '/dataservice/device/control/synced/waninterface':
        return send(200, { data: tlocs() });
      case '/dataservice/device/omp/status':
        // First call fails like an overloaded Manager; the client must retry after Retry-After.
        if (++stats.ompStatusCalls === 1) return send(503, { error: 'busy' }, { 'retry-after': '1' });
        return send(200, { data: [{ name: 'up', count: 4 }] });
      case '/dataservice/device/omp/summary':
        // First call rejects the token like an expired session; the client must log in again and retry.
        if (++stats.ompSummaryCalls === 1) {
          tokens.delete(bearer);
          return send(401, { error: 'expired' });
        }
        return send(200, { data: [{ 'vdevice-name': deviceId, operstate: 'UP' }] });
      case '/dataservice/device/system/status':
        if (deviceId === '192.0.2.11') return setTimeout(() => send(200, { data: [] }), 3000);
        return send(200, { data: [{ state: 'green' }] });
      case '/dataservice/template/feature':
        return setTimeout(() => send(200, { data: [] }), 3000);
      case '/dataservice/device/control/status':
        return send(200, { data: [{ name: 'up', count: 5 }] });
      case '/dataservice/network/connectionssummary':
        return send(200, { data: [{ name: 'WAN Edge', count: 3 }] });
      case '/dataservice/alarms':
        return send(200, { data: [{ severity: 'Critical' }, { severity: 'Major' }, { severity: 'Major' }] });
      case '/dataservice/certificate/stats/summary':
        return send(200, { data: [{ expired: 0, warning: 1 }] });
      case '/dataservice/clusterManagement/health/status':
        return send(200, { data: [{ deviceIP: '10.0.0.1' }, { deviceIP: '10.0.0.1', 'application-server': true, 'messaging-server': false }] });
      case '/dataservice/clusterManagement/tenancy/mode':
        return send(200, { data: { mode: 'SingleTenant', deploymentmode: 'Single Node' } });
      case '/dataservice/clusterManagement/list':
        return send(200, { data: [{ data: [{ vmanageID: '0', configJson: { 'host-name': 'Manager', deviceIP: '10.0.0.1', state: 'Ready', persona: 'COMPUTE_AND_DATA' } }] }] });
      case '/dataservice/health/devices':
        return send(200, {
          total_devices: 2,
          devices: [
            { system_ip: '192.0.2.11', health: 'red', reason: null, cpu_load: 95.23, memory_utilization: 46.8, control_connections: 3, control_connections_up: 3, omp_peers: 2, omp_peers_up: 2, bfd_sessions: 2, bfd_sessions_up: 2, total_tloc_num: 2, up_tloc_num: 2 },
            { system_ip: '192.0.2.12', health: 'green', cpu_load: 10, memory_utilization: 30, control_connections: 3, control_connections_up: 3, omp_peers: 2, omp_peers_up: 2, bfd_sessions: 1, bfd_sessions_up: 0, total_tloc_num: 2, up_tloc_num: 2 },
          ],
        });
      case '/dataservice/statistics/approute/page': {
        const page = Number(url.searchParams.get('scrollId') ?? 0);
        const rows = [1, 2].map((i) => ({ row: page * 2 + i })).filter((r) => r.row <= 5);
        return send(200, { data: rows, pageInfo: { scrollId: String(page + 1), hasMoreData: page < 2, totalCount: 5 } });
      }
      default:
        return send(404, { error: `no mock for ${req.method} ${p}` });
    }
  });
}

const certDir = mkdtempSync(join(tmpdir(), 'sdwan-mcp-test-'));
try {
  execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1', '-subj', '/CN=localhost',
    '-keyout', join(certDir, 'key.pem'), '-out', join(certDir, 'cert.pem')], { stdio: 'ignore' });
} catch {
  console.error('openssl is required to run the offline tests');
  process.exit(1);
}
const server = https.createServer({ key: readFileSync(join(certDir, 'key.pem')), cert: readFileSync(join(certDir, 'cert.pem')) }, handler);
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port;

// ---------- MCP client helpers ----------
const baseEnv = {
  PATH: process.env.PATH,
  HOME: process.env.HOME,
  VMANAGE_HOST: '127.0.0.1',
  VMANAGE_PORT: String(PORT),
  VMANAGE_USERNAME: 'test',
  VMANAGE_PASSWORD: 'test',
  VMANAGE_USE_JWT: 'true',
  VMANAGE_ALLOW_WRITE: 'false',
  VMANAGE_TIMEOUT_MS: '1500',
  VMANAGE_LIST_TIMEOUT_MS: '1500',
};
async function connect(env = {}) {
  const client = new Client({ name: 'mock-test', version: '1.0.0' });
  const transport = new StdioClientTransport({ command: 'node', args: ['build/index.js'], cwd: PROJECT_DIR, stderr: 'ignore', env: { ...baseEnv, ...env } });
  await client.connect(transport);
  return client;
}

let failures = 0;
function check(label, ok, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`);
}
async function tool(client, name, args = {}) {
  const res = await client.callTool({ name, arguments: args }, undefined, { timeout: 60_000 });
  const text = res.content?.[0]?.text ?? '';
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    value = text;
  }
  return { error: res.isError ? text : null, value };
}

// ---------- Tests ----------
const c = await connect();
const { tools } = await c.listTools();
check('tool list', tools.length === 86, `${tools.length} tools`);

let t = Date.now();
let r = await tool(c, 'get_omp_status');
check('503 + Retry-After is retried', !r.error && stats.ompStatusCalls === 2 && Date.now() - t >= 900, `${Date.now() - t} ms`);

r = await tool(c, 'list_devices');
check('list_devices', r.value?.data?.length === 6);

r = await tool(c, 'list_devices', { fields: ['host-name'], filter: { 'device-type': 'vedge' } });
check('fields + filter', r.value?.data?.length === 3 && Object.keys(r.value.data[0]).join() === 'host-name' && r.value.selection?.of === 6);

r = await tool(c, 'get_bfd_sessions', { device_id: 'branch-1' });
check('hostname resolution (case-insensitive)', r.value?.data?.length === 2 && stats.deviceIds.includes('192.0.2.11'));

r = await tool(c, 'get_bfd_sessions', { device_id: 'no-such-device' });
check('unknown device rejected', /Unknown device/.test(r.error ?? ''));

r = await tool(c, 'get_fabric_health');
const healthRows = r.value?.devices?.rows ?? [];
const row = (ip) => healthRows.find((d) => d['system-ip'] === ip);
check(
  'get_fabric_health: full device table',
  r.value?.devices?.total === 6 && healthRows.length === 6 && r.value.devices.unreachableCount === 1 && r.value.alarms?.bySeverity?.Major === 2 &&
    row('192.0.2.11')?.status === 'problem' && /health red \(CPU 95.2%, memory 46.8%\)/.test(row('192.0.2.11').problems.join()) &&
    row('192.0.2.12')?.bfdSessions === '0/1' && row('192.0.2.2')?.status === 'ok' &&
    r.value.status === 'degraded' && r.value.issues.some((i) => /unreachable/.test(i)),
  JSON.stringify({ status: r.value?.status, issues: r.value?.issues, rows: healthRows })
);
check(
  'get_fabric_health: Manager deployment detected',
  r.value?.manager?.deployment === 'single-node' && r.value.manager.tenancy === 'single-tenant' &&
    r.value.manager.nodes.length === 1 && r.value.manager.nodes[0].servicesDown.includes('messaging-server') &&
    r.value.issues.some((i) => /^Manager Manager services down: messaging-server/.test(i)),
  JSON.stringify(r.value?.manager)
);

r = await tool(c, 'get_fabric_bfd_status');
const bfdSummary = r.value?.summary;
check(
  'get_fabric_bfd_status (small fabric: real time by default)',
  bfdSummary?.edgesQueried === 2 && bfdSummary.notUp === 1 && r.value.skippedUnreachable.length === 1 && bfdSummary.source === 'real-time device query',
  JSON.stringify(bfdSummary)
);

r = await tool(c, 'get_fabric_bfd_status', { synced: true });
check(
  'get_fabric_bfd_status synced: problems re-checked live',
  r.value?.summary?.notUp === 1 && /re-checked in real time/.test(r.value.summary.source) &&
    r.value.devices.find((d) => d['system-ip'] === '192.0.2.12')?.verifiedLive === true,
  JSON.stringify(r.value?.summary)
);

r = await tool(c, 'get_fabric_tlocs', { site_id: '100' });
check('get_fabric_tlocs site scope', r.value?.summary?.edgesQueried === 1 && r.value.summary.tlocs === 2);

const loginsBefore = stats.logins;
r = await tool(c, 'get_omp_summary', { device_id: 'Branch-2' });
check('expired token: re-login and retry', !r.error && stats.logins === loginsBefore + 1);

r = await tool(c, 'call_api_operation', {
  operation_id: 'getPostStatBulkRawData_MonitoringApplicationAwareRouting_2504',
  body: { query: { condition: 'AND', rules: [] } },
  all_pages: true,
  max_items: 10,
});
check('all_pages follows scrollId', r.value?.data?.length === 5 && r.value.pageInfo?.pagesFetched === 3, JSON.stringify(r.value?.pageInfo ?? r.error));

r = await tool(c, 'call_api_operation', { operation_id: 'createOMPSummary', all_pages: true, query: { deviceId: '192.0.2.11' } });
check('all_pages rejected for non-paged operation', /does not support paging/.test(r.error ?? ''));

const writeOp = (await tool(c, 'search_api_operations', { access: 'write', method: 'DELETE', limit: 1 })).value?.operations?.[0];
r = await tool(c, 'call_api_operation', { operation_id: writeOp?.operationId, confirm: true });
check('write operations disabled by default', /disabled/.test(r.error ?? ''), writeOp?.operationId);

t = Date.now();
r = await tool(c, 'get_system_status', { device_id: 'Branch-1' });
check('real-time timeout names VMANAGE_TIMEOUT_MS', /VMANAGE_TIMEOUT_MS/.test(r.error ?? '') && Date.now() - t < 2500, `${Date.now() - t} ms`);

r = await tool(c, 'list_feature_templates');
check('list timeout names VMANAGE_LIST_TIMEOUT_MS', /VMANAGE_LIST_TIMEOUT_MS/.test(r.error ?? ''));
await c.close();

// Unreachable Manager: the first call fails, the next ones fail immediately.
const closedPort = await new Promise((resolve) => {
  const s = https.createServer();
  s.listen(0, '127.0.0.1', () => {
    const p = s.address().port;
    s.close(() => resolve(p));
  });
});
const down = await connect({ VMANAGE_PORT: String(closedPort) });
await tool(down, 'list_devices');
t = Date.now();
r = await tool(down, 'list_devices');
check('unreachable Manager fails fast', /Cannot reach vManage/.test(r.error ?? '') && Date.now() - t < 500, `${Date.now() - t} ms`);
await down.close();

// Session-cookie login (older Managers) is logged out when the client disconnects.
const sess = await connect({ VMANAGE_USE_JWT: 'false' });
r = await tool(sess, 'list_devices');
check('session-cookie login', r.value?.data?.length === 6 && stats.sessionLogins >= 1);
await sess.close();
for (let i = 0; i < 30 && stats.logouts === 0; i++) await new Promise((res) => setTimeout(res, 100));
check('session logged out on disconnect', stats.logouts === 1);

// Large fabric: bounded fan-out, compact output, time budget with resume, overload breaker.
mock.extraEdges = 120;
mock.bfdDelayMs = 20;
let big = await connect();
mock.bfdMaxInFlight = 0;
r = await tool(big, 'get_fabric_bfd_status');
check(
  'large fabric: concurrency capped, problems-only listing',
  r.value?.summary?.edgesQueried === 122 && mock.bfdMaxInFlight <= 6 && r.value.devices.length === 1 && /problems/.test(r.value.devicesListed),
  `queried=${r.value?.summary?.edgesQueried} maxInFlight=${mock.bfdMaxInFlight} listed=${r.value?.devices?.length}`
);
await big.close();

mock.bfdDelayMs = 300;
big = await connect();
t = Date.now();
r = await tool(big, 'get_fabric_bfd_status', { max_wait_seconds: 0.5 });
const partialMs = Date.now() - t;
check('time budget returns partial result', r.value?.incomplete?.notQueried > 0 && partialMs < 1500, `${partialMs} ms, notQueried=${r.value?.incomplete?.notQueried}`);
await new Promise((res) => setTimeout(res, 400));
const callsBefore = mock.bfdCalls;
r = await tool(big, 'get_fabric_bfd_status', { max_wait_seconds: 30 });
check(
  'second call resumes from cached results',
  !r.value?.incomplete && r.value?.summary?.edgesQueried === 122 && mock.bfdCalls - callsBefore < 122,
  `new queries=${mock.bfdCalls - callsBefore}`
);
await big.close();

mock.bfdDelayMs = 0;
mock.bfdStatus = 503;
big = await connect();
const overloadBefore = mock.bfdCalls;
r = await tool(big, 'get_fabric_bfd_status');
check(
  'overload breaker stops the sweep',
  /overload/.test(r.value?.incomplete?.reason ?? '') && mock.bfdCalls - overloadBefore < 60,
  `requests=${mock.bfdCalls - overloadBefore}`
);
await big.close();
mock.bfdStatus = 200;
mock.extraEdges = 0;

// Large inventory: summary fields, count_by, paging, and a truncation cursor that continues where it stopped.
mock.extraEdges = 3000;
big = await connect();
r = await tool(big, 'list_devices', { count_by: 'reachability' });
check(
  'count_by aggregates the inventory',
  r.value?.data?.[0]?.reachability === 'reachable' && r.value.data[0].count === 3005 && r.value.countBy?.rows === 3006,
  JSON.stringify(r.value?.data)
);
r = await tool(big, 'list_devices', { filter: { 'site-id': '900' }, offset: 10, limit: 5 });
check(
  'offset/limit paging',
  r.value?.data?.length === 5 && r.value.data[0]['host-name'] === 'Edge-10' && r.value.page?.nextOffset === 15 && r.value.page.total === 3000,
  JSON.stringify(r.value?.page)
);
r = await tool(big, 'list_devices', { all_fields: true });
const cursor = r.value?.truncated?.nextOffset;
check('truncated response returns nextOffset', cursor > 0 && cursor < 3006 && r.value.data.length === cursor, JSON.stringify(r.value?.truncated));
r = await tool(big, 'list_devices', { all_fields: true, offset: cursor });
check('nextOffset continues the listing', r.value?.data?.[0]?.['host-name'] === `Edge-${cursor - 6}`, r.value?.data?.[0]?.['host-name']);
await big.close();
mock.extraEdges = 0;

// Multi-tenant: fixed tenant, per-call switching, cache isolation, expired VSessionId.
const names = (res) => (res.value?.data ?? []).map((d) => d['host-name']).join(',');
let mt = await connect({ VMANAGE_TENANT: 'org a' });
r = await tool(mt, 'list_devices');
check('VMANAGE_TENANT scopes calls to the tenant', names(r) === 'A-Branch-1,A-Branch-2', names(r) || r.error);
const vsBefore = tenantStats.vsessionCalls;
await tool(mt, 'get_fabric_tlocs');
check('VSessionId is reused across calls', tenantStats.vsessionCalls === vsBefore);
vsessions.clear();
r = await tool(mt, 'list_reachable_devices');
check('expired VSessionId is renewed', !r.error && tenantStats.vsessionCalls === vsBefore + 1, r.error ?? '');
r = await tool(mt, 'list_devices', { tenant: 'Tenant-B' });
check('per-call tenant disabled by default', /VMANAGE_ALLOW_TENANT_SWITCH/.test(r.error ?? ''));
await mt.close();

mt = await connect({ VMANAGE_ALLOW_TENANT_SWITCH: 'true' });
const listed = await mt.listTools();
check('tenant argument advertised when switching is enabled', listed.tools.every((t) => t.inputSchema.properties?.tenant));
const [ra, rb, rp] = await Promise.all([
  tool(mt, 'list_devices', { tenant: 'Tenant-A' }),
  tool(mt, 'list_devices', { tenant: 't-2' }),
  tool(mt, 'list_devices'),
]);
check(
  'parallel calls stay isolated per tenant',
  names(ra) === 'A-Branch-1,A-Branch-2' && names(rb) === 'B-Branch-1' && rp.value?.data?.length === 6,
  `${names(ra)} | ${names(rb)} | ${rp.value?.data?.length}`
);
r = await tool(mt, 'list_devices', { tenant: 'Tenant-Z' });
check('unknown tenant lists available tenants', /Unknown tenant.*Tenant-A, Tenant-B/.test(r.error ?? ''), r.error ?? '');
await mt.close();

server.close();
rmSync(certDir, { recursive: true, force: true });
console.log(`\n${failures === 0 ? 'All offline checks passed' : `${failures} offline check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
