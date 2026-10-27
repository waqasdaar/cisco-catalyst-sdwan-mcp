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

    const deviceId = url.searchParams.get('deviceId');
    if (deviceId) stats.deviceIds.push(deviceId);
    switch (p) {
      case '/dataservice/device':
        return send(200, { data: DEVICES });
      case '/dataservice/device/bfd/sessions':
      case '/dataservice/device/bfd/synced/sessions':
        return send(200, { data: bfd(deviceId) });
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
        return send(200, { data: [{ status: 'healthy' }] });
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
check('get_fabric_health', r.value?.devices?.total === 6 && r.value.devices.unreachable.length === 1 && r.value.alarms?.bySeverity?.Major === 2);

r = await tool(c, 'get_fabric_bfd_status');
const bfdSummary = r.value?.summary;
check(
  'get_fabric_bfd_status',
  bfdSummary?.edgesQueried === 2 && bfdSummary.notUp === 1 && r.value.skippedUnreachable.length === 1 && bfdSummary.source.includes('cached'),
  JSON.stringify(bfdSummary)
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

server.close();
rmSync(certDir, { recursive: true, force: true });
console.log(`\n${failures === 0 ? 'All offline checks passed' : `${failures} offline check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
