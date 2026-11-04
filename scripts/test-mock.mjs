// Offline regression test: runs the MCP server against a simulated vManage (HTTPS on localhost).
// No lab needed; used by CI. Requires openssl to create a throwaway certificate.
// Usage: npm test
import { execFileSync } from 'child_process';
import { X509Certificate } from 'crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
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

const stats = { logins: 0, sessionLogins: 0, logouts: 0, ompStatusCalls: 0, ompSummaryCalls: 0, deviceIds: [], ospfPaths: [], ospfWrites: [], bgpPaths: [], bgpWrites: [], eigrpPaths: [], eigrpWrites: [], templateWrites: [], cliPaths: [], cliWrites: [], mcPaths: [], mcWrites: [], v6Paths: [], v6Writes: [], v6Previews: [], grpPaths: [], grpPosts: [], migrationWrites: [], nhPaths: [], nhWrites: [] };
const NH = { global: 'a0000000-0000-4000-8000-000000000000', region: 'a0000000-0000-4000-8000-000000000001', area: 'a0000000-0000-4000-8000-000000000002', siteA: 'a0000000-0000-4000-8000-000000000003', siteB: 'a0000000-0000-4000-8000-000000000004', siteC: 'a0000000-0000-4000-8000-000000000005' };
const HIERARCHY = [
  { id: NH.global, name: 'Global', data: { label: 'GLOBAL' }, hierarchyPath: 'Global' },
  { id: NH.region, name: 'EMEA', data: { label: 'REGION', parentUuid: NH.global }, hierarchyPath: 'Global/EMEA' },
  { id: NH.area, name: 'France', data: { label: 'AREA', parentUuid: NH.region }, hierarchyPath: 'Global/EMEA/France' },
  { id: NH.siteA, name: 'Paris', data: { label: 'SITE', parentUuid: NH.area, hierarchyId: { siteId: 105 } }, hierarchyPath: 'Global/EMEA/France/Paris', deviceCount: 1 },
  { id: NH.siteB, name: 'Lab', data: { label: 'SITE', parentUuid: NH.area, hierarchyId: { siteId: 900 } }, hierarchyPath: 'Global/EMEA/France/Lab', deviceCount: 0 },
  { id: NH.siteC, name: 'Lab', data: { label: 'SITE', parentUuid: NH.global, hierarchyId: { siteId: 901 } }, hierarchyPath: 'Global/Lab', deviceCount: 0 },
];
// A device's running config with secrets in it, and the config a group renders for it.
const RUNNING_CONFIG = `system
 host-name Branch-1
 console-baud-rate 115200
!
username admin privilege 15 secret 9 $9$hashOfTheSecret
secure-internet-gateway
 zscaler organization example.com
 zscaler partner-key PK-12345
 zscaler password Zs-Pass-1
!
snmp-server community public-ro RO
router ospf 1 vrf 1
 default-information originate
!
sdwan
 interface Tunnel100001
  tunnel-options tunnel-set secure-internet-gateway-zscaler
!
security
 ipsec
  authentication-type sha1-hmac ah-sha1-hmac
!
`;
const RENDERED_CONFIG = `system
 host-name Branch-1
 console-baud-rate 9600
!
username admin privilege 15 secret 9 $9$otherHashOfTheSecret
snmp-server community public-ro RO
router ospf 1 vrf 1
!
sdwan
 interface GigabitEthernet1
!
security
 ipsec
  integrity-type esp ip-udp-esp
!
no acc-gyro enable
`;
// Template-to-group migration: Branch-2 is still on device template Branch-CG, converted to the configuration group
// Branch-CG and to a policy group of the same name (SIG). Served only while mock.migration is set.
const CG_ID = '19191919-1919-4191-8191-191919191919';
const MIG_PG_ID = '24242424-2424-4242-8242-242424242424';
const IPV4_PATTERN = '^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)(\\.(?!$)|$)){4}$';
const variable = (value, metadata = {}) => ({ properties: { value, metadata } });
const MIGRATION = {
  '/dataservice/template/device': { data: [{ templateId: 'dt-1', templateName: 'Branch-CG', devicesAttached: 1, configType: 'template' }] },
  '/dataservice/template/device/config/attached/dt-1': { data: [{ uuid: 'u-12' }] },
  [`/dataservice/v1/config-group/${CG_ID}/device/variables/schema`]: [{ variables: [{ schema: {
    required: ['host_name', 'system_ip', 'site_id'],
    properties: {
      host_name: variable({ type: 'string' }),
      system_ip: variable({ type: 'string', format: 'ipv4' }),
      site_id: variable({ type: 'integer' }),
      transport1_ip_ip_address: variable({ type: 'string', format: 'ipv4' }),
      transport1_ip_subnet_mask: variable({ type: 'string', format: 'ipv4' }),
      vpn0_ip_host_ip_list: variable({ type: 'array', minItems: 1, items: { type: 'string', oneOf: [{ format: 'ipv4' }, { format: 'ipv6' }] } }),
      pseudo_commit_timer: variable({ type: 'integer' }),
      snmp_community: variable({ type: 'string' }),
      admin_password: variable({ type: 'string' }, { encrypted: true, paths: [{ parcel_type: 'aaa', path: 'user.password' }] }),
    },
  } }] }],
  [`/dataservice/v1/policy-group/${MIG_PG_ID}/device/variables/schema`]: [{ variables: [{ schema: {
    properties: { zscaler_vpn_trackersrcip: variable({ type: 'string', pattern: IPV4_PATTERN }) },
  } }] }],
  [`/dataservice/v1/config-group/${CG_ID}`]: { profiles: [{ id: 'tp-1', name: 'Branch-CG_transport', type: 'transport' }] },
  [`/dataservice/v1/policy-group/${MIG_PG_ID}`]: { profiles: [{ id: 'sp-1', name: 'Branch-CG_sig', type: 'sig-security' }, { id: 'po-1', name: 'Default', type: 'policy-object' }] },
  '/dataservice/v1/feature-profile/sdwan/transport/tp-1': {
    associatedProfileParcels: [{ parcelType: 'wan/vpn', parcelId: 'vpn-1', subparcels: [{ parcelType: 'wan/vpn/interface/ethernet', parcelId: 'eth-1' }] }],
  },
  // As the 20.18 conversion writes them: NAT off, services at the template default left out, SIG at group defaults.
  '/dataservice/v1/feature-profile/sdwan/transport/tp-1/wan/vpn/vpn-1/interface/ethernet/eth-1': { payload: { name: 'Branch_Transport1', data: {
    tunnelInterface: { optionType: 'global', value: true },
    nat: { optionType: 'global', value: false },
    allowService: { dns: { optionType: 'global', value: true } },
  } } },
  '/dataservice/v1/feature-profile/sdwan/sig-security/sp-1': { associatedProfileParcels: [{ parcelType: 'sig', parcelId: 'sig-1' }] },
  '/dataservice/v1/feature-profile/sdwan/sig-security/sp-1/sig/sig-1': { payload: { name: 'Branch_SIG', data: { interface: [{
    ifName: { optionType: 'global', value: 'ipsec1' },
    ikeGroup: { optionType: 'default', value: '16' },
    ipsecCiphersuite: { optionType: 'default', value: 'aes256-cbc-sha512' },
  }] } } },
  '/dataservice/template/feature': { data: [
    { templateId: 'ft-1', templateName: 'Branch_Transport1', templateType: 'cisco_vpn_interface' },
    { templateId: 'ft-2', templateName: 'Branch_SIG', templateType: 'cisco_secure_internet_gateway' },
  ] },
  '/dataservice/template/feature/object/ft-1': { templateDefinition: {
    'tunnel-interface': { 'allow-service': {
      dhcp: { vipType: 'ignore', vipValue: 'true' }, dns: { vipType: 'constant', vipValue: 'true' }, sshd: { vipType: 'ignore', vipValue: 'false' },
    } },
    nat: { vipType: 'constant', vipValue: 'true', vipObjectType: 'node-only' },
  } },
  '/dataservice/template/feature/object/ft-2': { templateDefinition: { interface: { vipValue: [{
    'if-name': { vipType: 'constant', vipValue: 'ipsec1' },
    ike: { 'ike-group': { vipType: 'notIgnore', vipValue: '14' } },
    ipsec: { 'ipsec-ciphersuite': { vipType: 'notIgnore', vipValue: 'aes256-gcm' } },
  }] } } },
};
// Branch-2's running config while on its template (SIG included), and what its groups render.
const MIGRATION_BASE = `system
 host-name Branch-2
!
sdwan
 interface GigabitEthernet2
  tunnel-interface
!
router ospf 1 vrf 1
!
`;
const MIGRATION_RUNNING = `system
 host-name Branch-2
!
secure-internet-gateway
 zscaler organization example.com
 zscaler partner-key PK-12345
!
sdwan
 interface GigabitEthernet2
  tunnel-interface
 interface Tunnel100001
  tunnel-options tunnel-set secure-internet-gateway-zscaler
!
router ospf 1 vrf 1
!
`;
// The template's device input (POST /template/device/config/input): one column per template variable.
const TEMPLATE_INPUT = {
  header: { columns: [
    { property: 'csv-deviceId' }, { property: 'csv-host-name' },
    { property: '//system/host-name', variable: 'system_host_name' },
    { property: '//system/system-ip', variable: 'system_system_ip' },
    { property: '//system/site-id', variable: 'system_site_id' },
    { property: '/0/GigabitEthernet2/interface/ip/address', variable: 'transport1_ip' },
    { property: '/0/vpn-instance/ip/host/ip', variable: 'vpn0_ip_host_ip_list' },
    { property: '/sig/tracker-src-ip', variable: 'zscaler_vpn_trackersrcip' },
    { property: '/0/old-setting', variable: 'old_setting' },
    { property: '/snmp/community', variable: 'snmp_community' },
  ] },
  data: [{
    'csv-deviceId': 'u-12', 'csv-host-name': 'Branch-2',
    '//system/host-name': 'Branch-2', '//system/system-ip': '192.0.2.12', '//system/site-id': '200',
    '/0/GigabitEthernet2/interface/ip/address': '198.51.100.12/24',
    '/0/vpn-instance/ip/host/ip': '192.0.2.50,192.0.2.51',
    '/sig/tracker-src-ip': '192.0.2.12/32',
    '/0/old-setting': 'x',
    '/snmp/community': 'Comm-Secret-1',
  }],
};
const GROUPS = {
  'config-group': [{ id: '19191919-1919-4191-8191-191919191919', name: 'Branch-CG', solution: 'sdwan' }],
  'policy-group': [{ id: '20202020-2020-4202-8202-202020202020', name: 'Branch-PG', solution: 'sdwan' }],
  'topology-group': [{ id: '21212121-2121-4212-8212-212121212121', name: 'Hub-Spoke', solution: 'sdwan' }],
};
const CLI_PROFILE_ID = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const CLI_FEATURE = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const CLI_TEMPLATE = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
const RIP_CLI = 'router rip\n version 2\n network 10.0.0.0';
const cliFeature = { parcelId: CLI_FEATURE, lastUpdatedBy: 'admin', payload: { name: 'RIP-Addon', description: 'RIP for LAN', data: { config: RIP_CLI } } };
const BGP_TEMPLATE = '66666666-6666-4666-8666-666666666666';
const OSPFV3_TEMPLATE = '77777777-7777-4777-8777-777777777777';
const VPN_TEMPLATE = '88888888-8888-4888-8888-888888888888';
const FEATURE_TEMPLATES = [
  { templateId: BGP_TEMPLATE, templateName: 'BGP-Hub', templateType: 'cisco_bgp', devicesAttached: 2 },
  { templateId: OSPFV3_TEMPLATE, templateName: 'OSPFv3-Branch', templateType: 'cisco_ospfv3', devicesAttached: 0 },
  { templateId: VPN_TEMPLATE, templateName: 'VPN-10', templateType: 'cisco_vpn', devicesAttached: 4 },
  { templateId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', templateName: 'EIGRP-Branch', templateType: 'eigrp', devicesAttached: 1 },
  { templateId: '13131313-1313-4131-8131-131313131313', templateName: 'PIM-Branch', templateType: 'cedge_pim', devicesAttached: 2 },
  {
    templateId: CLI_TEMPLATE, templateName: 'RIP-CLI', templateDescription: 'RIP add-on', templateType: 'cli-template', deviceType: ['vedge-C8000V'], templateMinVersion: '15.0.0', devicesAttached: 0,
    templateDefinition: { config: { vipObjectType: 'object', vipType: 'constant', vipValue: RIP_CLI } },
  },
  { templateId: 'ffffffff-ffff-4fff-8fff-ffffffffffff', templateName: 'Banner-CLI', templateType: 'cli-template', deviceType: ['vedge-C8000V'], devicesAttached: 3, templateDefinition: { config: { vipValue: 'banner motd ^hi^' } } },
];
const OSPF_PROFILE = '11111111-1111-4111-8111-111111111111';
const tokens = new Set();
// Large-fabric mode for the fan-out tests: extra healthy edges, slow or overloaded BFD queries.
const mock = { extraEdges: 0, bfdDelayMs: 0, bfdStatus: 200, bfdCalls: 0, bfdInFlight: 0, bfdMaxInFlight: 0, templateListDelayMs: 3000, preview: null, migration: false };
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
    if (mock.migration) {
      if (p === '/dataservice/template/device/config/input/' && req.method === 'POST') return send(200, TEMPLATE_INPUT);
      if (p === '/dataservice/template/config/device/mode/cli' && req.method === 'POST') {
        stats.migrationWrites.push({ method: req.method, path: p, body: JSON.parse(raw) });
        return send(200, { id: 'task-detach' });
      }
      if (p.startsWith('/dataservice/device/action/status/')) return send(200, { summary: { status: 'done' }, data: [{ statusId: 'success' }] });
      if (p === '/dataservice/device/config') {
        res.writeHead(200, { 'content-type': 'text/plain' });
        return res.end(MIGRATION_RUNNING);
      }
      if (p === '/dataservice/device/control/connections') return send(200, { data: [{ 'peer-type': 'vsmart', state: 'up' }] });
      if (p === '/dataservice/device/bfd/sessions') return send(200, { data: [{ state: 'up' }, { state: 'up' }] });
      if (Object.hasOwn(MIGRATION, p)) return send(200, MIGRATION[p]);
    }

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
    if (p.startsWith('/dataservice/device/ospf/')) {
      stats.ospfPaths.push(p);
      return send(200, { data: [{ 'vdevice-name': deviceId, view: p.slice('/dataservice/device/ospf/'.length) }] });
    }
    if (p === '/dataservice/v1/feature-profile/sdwan/service') return send(200, [{ profileId: OSPF_PROFILE, profileName: 'Branch-Service' }]);
    if (p.startsWith('/dataservice/v1/feature-profile/') && p.includes('/routing/ospf')) {
      if (req.method !== 'GET') {
        stats.ospfWrites.push({ method: req.method, path: p, body: raw ? JSON.parse(raw) : undefined });
        return send(200, req.method === 'POST' ? { parcelId: '44444444-4444-4444-8444-444444444444' } : {});
      }
      stats.ospfPaths.push(p);
      return send(200, { data: [{ path: p }] });
    }
    if (p.startsWith('/dataservice/device/bgp/') || (p.startsWith('/dataservice/v1/feature-profile/') && p.includes('/routing/bgp'))) {
      if (req.method !== 'GET') {
        stats.bgpWrites.push({ method: req.method, path: p, body: raw ? JSON.parse(raw) : undefined });
        return send(200, req.method === 'POST' ? { parcelId: '55555555-5555-4555-8555-555555555555' } : {});
      }
      stats.bgpPaths.push(p);
      return send(200, { data: [{ path: p, query: Object.fromEntries(url.searchParams) }] });
    }
    if (p.startsWith('/dataservice/v1/network-hierarchy')) {
      if (req.method !== 'GET') {
        stats.nhWrites.push({ method: req.method, path: p, body: raw ? JSON.parse(raw) : undefined });
        return send(200, { id: 'cv-1' });
      }
      stats.nhPaths.push({ path: p, query: Object.fromEntries(url.searchParams) });
      if (p === '/dataservice/v1/network-hierarchy') return send(200, HIERARCHY);
      if (p.endsWith('/cybervisioncenters/id')) return send(200, url.searchParams.get('cvName') === 'CV-Paris' ? 'cv-42' : '');
      if (p.endsWith('/cybervisioncenters')) return send(200, { data: [{ id: 'cv-42', name: 'CV-Paris' }] });
      const node = HIERARCHY.find((n) => p.endsWith(`/${n.id}`));
      return node ? send(200, { name: node.name, data: node.data }) : send(404, { error: 'no node' });
    }
    const groupPath = /^\/dataservice\/v1\/(config-group|policy-group|topology-group)(\/.*)?$/.exec(p);
    if (groupPath) {
      const [, kind, rest = ''] = groupPath;
      if (req.method !== 'GET') {
        const body = raw ? JSON.parse(raw) : undefined;
        stats.grpPosts.push({ method: req.method, path: p, query: Object.fromEntries(url.searchParams), body });
        if (mock.failAssociate && rest.endsWith('/device/associate')) return send(500, { error: { message: 'association rejected' } });
        if (req.method === 'POST' && rest === '') {
          const id = '22222222-0000-4000-8000-00000000000' + GROUPS[kind].length;
          GROUPS[kind].push({ id, name: body?.name, solution: 'sdwan' });
          return send(200, { id });
        }
        if (req.method === 'POST' && rest.endsWith('/preview') && mock.preview) {
          return send(200, typeof mock.preview === 'function' ? mock.preview(kind) : mock.preview);
        }
        return send(200, { id: 'task-1', path: p });
      }
      stats.grpPaths.push(p);
      if (rest === '') return send(200, GROUPS[kind]);
      return send(200, { path: p, query: Object.fromEntries(url.searchParams), devices: [] });
    }
    if (p === '/dataservice/v1/feature-profile/sdwan/transport') return send(200, [{ profileId: OSPF_PROFILE, profileName: 'Branch-Transport' }]);
    if (p === '/dataservice/device/ip/ipRoutes') {
      stats.v6Paths.push(p);
      const route = (family, prefix, source) => ({ 'rib-address-family': family, 'route-destination-prefix': prefix, 'route-source-protocol': source, 'routing-instance-name': url.searchParams.get('routing-instance-name') ?? '10', query: Object.fromEntries(url.searchParams) });
      return send(200, { data: [route('ipv4', '10.1.0.0/16', 'rt-ext:omp'), route('ipv6', '2001:db8:10::/64', 'rt-ext:omp'), route('ipv6', '2001:db8:20::/64', 'direct')] });
    }
    if (/ipv6|v6|nat64|dhcpv6/i.test(p) && !/ospf/i.test(p) && /^\/dataservice\/(device|template\/policy|v1\/feature-profile)\//.test(p)) {
      if (req.method === 'POST' && p.endsWith('/preview')) {
        stats.v6Previews.push({ path: p, body: raw ? JSON.parse(raw) : undefined });
        return send(200, { preview: 'ipv6 access-list acl6-test' });
      }
      if (req.method !== 'GET') {
        stats.v6Writes.push({ method: req.method, path: p, query: Object.fromEntries(url.searchParams), body: raw ? JSON.parse(raw) : undefined });
        return send(200, req.method === 'POST' ? { id: '15151515-1515-4151-8151-151515151515' } : {});
      }
      stats.v6Paths.push(p);
      return send(200, { data: [{ path: p, query: Object.fromEntries(url.searchParams) }] });
    }
    if (/^\/dataservice\/device\/(igmp|pim|multicast|ip\/mfib)/.test(p) || (p.startsWith('/dataservice/v1/feature-profile/') && p.includes('/routing/multicast'))) {
      if (req.method !== 'GET') {
        stats.mcWrites.push({ method: req.method, path: p, body: raw ? JSON.parse(raw) : undefined });
        return send(200, req.method === 'POST' ? { parcelId: '14141414-1414-4141-8141-141414141414' } : {});
      }
      stats.mcPaths.push(p);
      return send(200, { data: [{ path: p, query: Object.fromEntries(url.searchParams) }] });
    }
    if (p.startsWith('/dataservice/device/eigrp/') || (p.startsWith('/dataservice/v1/feature-profile/') && p.includes('/routing/eigrp'))) {
      if (req.method !== 'GET') {
        stats.eigrpWrites.push({ method: req.method, path: p, body: raw ? JSON.parse(raw) : undefined });
        return send(200, req.method === 'POST' ? { parcelId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' } : {});
      }
      stats.eigrpPaths.push(p);
      return send(200, { data: [{ path: p, query: Object.fromEntries(url.searchParams) }] });
    }
    if (/^\/dataservice\/v1\/feature-profile\/(sdwan|sd-routing)\/cli(\/|$)/.test(p)) {
      if (req.method !== 'GET') {
        stats.cliWrites.push({ method: req.method, path: p, body: raw ? JSON.parse(raw) : undefined });
        return send(200, req.method === 'POST' ? { parcelId: '12121212-1212-4121-8121-121212121212' } : {});
      }
      stats.cliPaths.push(p);
      if (/\/cli$/.test(p)) return send(200, [{ profileId: CLI_PROFILE_ID, profileName: 'Branch-CLI' }, { profileId: OSPF_PROFILE, profileName: 'Hub-CLI' }]);
      if (p.endsWith(`/cli/${OSPF_PROFILE}/config`)) return send(200, { data: [{ parcelId: FEATURE, payload: { name: 'Banner', data: { config: 'banner motd ^hi^' } } }] });
      if (/\/config$/.test(p)) return send(200, { data: [cliFeature] });
      return send(200, cliFeature);
    }
    if (p.startsWith('/dataservice/template/feature')) {
      const id = p.split('/').pop();
      if (req.method !== 'GET') {
        stats.templateWrites.push({ method: req.method, path: p, query: Object.fromEntries(url.searchParams), body: raw ? JSON.parse(raw) : undefined });
        return send(200, req.method === 'POST' ? { templateId: '99999999-9999-4999-8999-999999999999' } : {});
      }
      if (p === '/dataservice/template/feature') {
        return setTimeout(() => send(200, { data: FEATURE_TEMPLATES }), mock.templateListDelayMs);
      }
      if (p.startsWith('/dataservice/template/feature/object/')) {
        const t = FEATURE_TEMPLATES.find((x) => x.templateId === id);
        return t ? send(200, { templateDefinition: {}, ...t }) : send(404, { error: 'no template' });
      }
      if (p.startsWith('/dataservice/template/feature/devicetemplates/')) return send(200, { data: [{ templateName: 'DT-Hub' }] });
      if (p.startsWith('/dataservice/template/feature/types/definition/')) return send(200, { path: p });
    }
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
    '-addext', 'subjectAltName=IP:127.0.0.1', '-keyout', join(certDir, 'key.pem'), '-out', join(certDir, 'cert.pem')],
  { stdio: 'ignore' });
} catch {
  console.error('openssl is required to run the offline tests');
  process.exit(1);
}
const server = https.createServer({ key: readFileSync(join(certDir, 'key.pem')), cert: readFileSync(join(certDir, 'cert.pem')) }, handler);
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port;
// The throwaway certificate is self-signed: the tests pin it, as an application that checked it would.
const FINGERPRINT = new X509Certificate(readFileSync(join(certDir, 'cert.pem'))).fingerprint256;

// ---------- MCP client helpers ----------
const baseEnv = {
  PATH: process.env.PATH,
  HOME: process.env.HOME,
  VMANAGE_STATE_DIR: join(certDir, 'state'),
  VMANAGE_HOST: '127.0.0.1',
  VMANAGE_PORT: String(PORT),
  VMANAGE_USERNAME: 'test',
  VMANAGE_PASSWORD: 'test',
  VMANAGE_USE_JWT: 'true',
  VMANAGE_ALLOW_WRITE: 'false',
  VMANAGE_TIMEOUT_MS: '1500',
  VMANAGE_LIST_TIMEOUT_MS: '1500',
  VMANAGE_TLS_FINGERPRINT: FINGERPRINT,
};
async function connect(env = {}) {
  const client = new Client({ name: 'mock-test', version: '1.0.1' });
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

// ---------- TLS: the certificate of SD-WAN Manager is checked on every connection ----------
{
  const strict = await connect({ VMANAGE_TLS_FINGERPRINT: '' });
  let t = await tool(strict, 'list_devices');
  check('TLS: a self-signed certificate is refused by default', /certificate/i.test(t.error ?? ''), t.error ?? 'accepted');
  await strict.close();
  const wrong = await connect({ VMANAGE_TLS_FINGERPRINT: 'AA'.repeat(32) });
  t = await tool(wrong, 'list_devices');
  check('TLS: a certificate other than the pinned one is refused', /does not match the pinned fingerprint/.test(t.error ?? ''), t.error ?? 'accepted');
  await wrong.close();
  const ca = await connect({ VMANAGE_TLS_FINGERPRINT: '', VMANAGE_CA_FILE: join(certDir, 'cert.pem') });
  t = await tool(ca, 'list_devices');
  check('TLS: a certificate signed by VMANAGE_CA_FILE is trusted', !t.error, t.error ?? '');
  await ca.close();
  const insecure = await connect({ VMANAGE_TLS_FINGERPRINT: '', VMANAGE_TLS_INSECURE: 'true' });
  t = await tool(insecure, 'list_devices');
  check('TLS: VMANAGE_TLS_INSECURE=true is an explicit opt-out', !t.error, t.error ?? '');
  await insecure.close();
}

// ---------- Tests ----------
const c = await connect();
const { tools } = await c.listTools();
check('tool list (read-only server: write tools hidden)', tools.length === 121, `${tools.length} tools`);
check(
  'write tools hidden when writes are disabled; call_api_operation kept',
  !tools.some((x) => /^(create|update|delete|associate|clone|deploy)_/.test(x.name)) && tools.some((x) => x.name === 'call_api_operation')
);
check('tool list stays compact', JSON.stringify(tools).length < 110_000, `${JSON.stringify(tools).length} bytes`);

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

// OSPF: real-time monitoring and UX 2.0 configuration reads.
const ospfView = async (name, args) => (await tool(c, name, { device_id: 'Branch-1', ...args })).value?.data?.[0];
let v = await ospfView('get_ospf_process');
check('get_ospf_process', v?.view === 'process' && v['vdevice-name'] === '192.0.2.11', JSON.stringify(v));
check('get_ospf_neighbors (default v2)', (await ospfView('get_ospf_neighbors'))?.view === 'neighbor');
check('get_ospf_neighbors v3', (await ospfView('get_ospf_neighbors', { version: 'ospfv3' }))?.view === 'v3neighbor');
check('get_ospf_interfaces (default v2)', (await ospfView('get_ospf_interfaces'))?.view === 'interface');
check('get_ospf_interfaces v3', (await ospfView('get_ospf_interfaces', { version: 'ospfv3' }))?.view === 'v3interface');
check('get_ospf_routes', (await ospfView('get_ospf_routes'))?.view === 'routes');
check('get_ospf_database (default summary)', (await ospfView('get_ospf_database'))?.view === 'databasesummary');
check('get_ospf_database full', (await ospfView('get_ospf_database', { view: 'full' }))?.view === 'database');
check('get_ospf_database external', (await ospfView('get_ospf_database', { view: 'external' }))?.view === 'databaseexternal');

const VPN = '22222222-2222-4222-8222-222222222222';
const FEATURE = '33333333-3333-4333-8333-333333333333';
r = await tool(c, 'get_ospf_config', { profile_type: 'service', profile: 'branch-service' });
check(
  'get_ospf_config by profile name',
  r.value?.data?.[0]?.path === `/dataservice/v1/feature-profile/sdwan/service/${OSPF_PROFILE}/routing/ospf`,
  JSON.stringify(r.value ?? r.error)
);
r = await tool(c, 'get_ospf_config', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, version: 'ospfv3-ipv6', feature_id: FEATURE });
check(
  'get_ospf_config LAN VPN OSPFv3 IPv6 feature',
  r.value?.data?.[0]?.path === `/dataservice/v1/feature-profile/sdwan/service/${OSPF_PROFILE}/lan/vpn/${VPN}/routing/ospfv3/ipv6/${FEATURE}`,
  JSON.stringify(r.value ?? r.error)
);

// Every OSPF read operation in the published spec must be reachable through a dedicated tool.
const spec = JSON.parse(SPEC.toString());
const template = (path) => path.replace(/^\/dataservice/, '').replace(/\{[^}]+\}|[0-9a-f]{8}-[0-9a-f-]{27}/g, '{id}');
const specOspfGets = Object.entries(spec.paths).filter(([path, ops]) => /ospf/i.test(path) && ops.get).map(([path]) => template(path));
stats.ospfPaths = [];
for (const [name, args] of [
  ['get_ospf_process', {}], ['get_ospf_routes', {}],
  ...['ospfv2', 'ospfv3'].flatMap((version) => [['get_ospf_neighbors', { version }], ['get_ospf_interfaces', { version }]]),
  ...['summary', 'full', 'external'].map((view) => ['get_ospf_database', { view }]),
]) await tool(c, name, { device_id: 'Branch-1', ...args });
for (const solution of ['sdwan', 'sd-routing']) {
  for (const profile_type of ['service', 'transport']) {
    const extra = solution === 'sd-routing' && profile_type === 'transport' ? [{ vpn_feature_id: VPN, global_vrf: true }] : [];
    for (const scope of [{}, { vpn_feature_id: VPN }, ...extra]) {
      for (const version of ['ospf', 'ospfv3-ipv4', 'ospfv3-ipv6']) {
        for (const one of [{}, { feature_id: FEATURE }]) {
          await tool(c, 'get_ospf_config', { solution, profile_type, profile: OSPF_PROFILE, version, ...scope, ...one });
        }
      }
    }
  }
}
const reached = new Set(stats.ospfPaths.map(template));
const missing = specOspfGets.filter((path) => !reached.has(path));
check(`all ${specOspfGets.length} OSPF read operations in the spec covered`, specOspfGets.length === 63 && missing.length === 0, missing.join(', '));
const offSpec = [...reached].filter((path) => !specOspfGets.includes(path));
check('OSPF tools only call paths from the spec', offSpec.length === 0, offSpec.join(', '));
const isV3 = (path) => /ospfv3|\/v3(interface|neighbor)/.test(path);
const specV3Gets = specOspfGets.filter(isV3);
check(
  `all ${specV3Gets.length} OSPFv3 read operations covered (2 real-time + 36 IPv4/IPv6 features)`,
  specV3Gets.length === 38 && specV3Gets.every((path) => reached.has(path)),
  specV3Gets.filter((path) => !reached.has(path)).join(', ')
);

for (const [label, name, args, pattern] of [
  ['get_ospf_neighbors rejects unknown version', 'get_ospf_neighbors', { device_id: 'Branch-1', version: '../bgp' }, /version must be one of/],
  ['get_ospf_database rejects unknown view', 'get_ospf_database', { device_id: 'Branch-1', view: 'constructor' }, /view must be one of/],
  ['get_ospf_process requires device_id', 'get_ospf_process', {}, /device_id is required/],
  ['get_ospf_config rejects non-UUID vpn_feature_id', 'get_ospf_config', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: '../../x' }, /vpn_feature_id must be a feature ID/],
  ['get_ospf_config rejects global_vrf outside sd-routing transport', 'get_ospf_config', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, global_vrf: true }, /global_vrf applies only/],
  ['get_ospf_config rejects unknown profile_type', 'get_ospf_config', { profile_type: 'system', profile: OSPF_PROFILE }, /profile_type must be one of/],
  ['get_ospf_config unknown profile name', 'get_ospf_config', { profile_type: 'service', profile: 'nope' }, /No sdwan service profile named "nope"/],
]) {
  stats.ospfPaths = [];
  r = await tool(c, name, args);
  check(label, pattern.test(r.error ?? '') && stats.ospfPaths.length === 0, r.error ?? 'not rejected');
}
r = await tool(c, 'create_ospf_feature', { profile_type: 'service', profile: OSPF_PROFILE, body: { name: 'x' }, confirm: true });
check('OSPF writes disabled by default', /VMANAGE_ALLOW_WRITE=true/.test(r.error ?? '') && stats.ospfWrites.length === 0, r.error ?? 'not rejected');
await c.close();

// OSPF writes with VMANAGE_ALLOW_WRITE=true.
const w = await connect({ VMANAGE_ALLOW_WRITE: 'true' });
const OSPF_BODY = { name: 'OSPF-Area0', description: 'test', data: { routerId: { optionType: 'global', value: '10.0.0.1' } } };
const lastWrite = () => stats.ospfWrites.at(-1);
const base = `/dataservice/v1/feature-profile/sdwan/service/${OSPF_PROFILE}`;

r = await tool(w, 'create_ospf_feature', { profile_type: 'service', profile: 'Branch-Service', body: OSPF_BODY });
check('create_ospf_feature needs confirm: true', /confirm: true/.test(r.error ?? '') && stats.ospfWrites.length === 0, r.error ?? 'not rejected');
r = await tool(w, 'create_ospf_feature', { profile_type: 'service', profile: 'Branch-Service', body: OSPF_BODY, confirm: true });
check(
  'create_ospf_feature',
  !r.error && lastWrite()?.method === 'POST' && lastWrite().path === `${base}/routing/ospf` &&
    JSON.stringify(lastWrite().body) === JSON.stringify(OSPF_BODY) && r.value?.result?.parcelId,
  JSON.stringify(r.value ?? r.error)
);
r = await tool(w, 'update_ospf_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE, version: 'ospfv3-ipv4', body: OSPF_BODY, confirm: true });
check('update_ospf_feature', !r.error && lastWrite()?.method === 'PUT' && lastWrite().path === `${base}/routing/ospfv3/ipv4/${FEATURE}`, JSON.stringify(lastWrite()));
r = await tool(w, 'delete_ospf_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE, confirm: true });
check('delete_ospf_feature', !r.error && lastWrite()?.method === 'DELETE' && lastWrite().path === `${base}/routing/ospf/${FEATURE}` && lastWrite().body === undefined, JSON.stringify(lastWrite()));
r = await tool(w, 'delete_ospf_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, feature_id: FEATURE, confirm: true });
check('delete_ospf_feature with VPN removes only the association', lastWrite()?.method === 'DELETE' && lastWrite().path === `${base}/lan/vpn/${VPN}/routing/ospf/${FEATURE}`, JSON.stringify(lastWrite()));
r = await tool(w, 'associate_ospf_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, feature_id: FEATURE, confirm: true });
check(
  'associate_ospf_feature',
  !r.error && lastWrite()?.method === 'POST' && lastWrite().path === `${base}/lan/vpn/${VPN}/routing/ospf` && lastWrite().body?.parcelId === FEATURE,
  JSON.stringify(lastWrite())
);

for (const [label, name, args, pattern] of [
  ['create_ospf_feature rejects a VPN scope', 'create_ospf_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, body: OSPF_BODY, confirm: true }, /associate_ospf_feature/],
  ['create_ospf_feature requires an object body', 'create_ospf_feature', { profile_type: 'service', profile: OSPF_PROFILE, body: [1], confirm: true }, /body must be an object/],
  ['update_ospf_feature requires feature_id', 'update_ospf_feature', { profile_type: 'service', profile: OSPF_PROFILE, body: OSPF_BODY, confirm: true }, /feature_id is required/],
  ['delete_ospf_feature rejects non-UUID feature_id', 'delete_ospf_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: '../../config-group', confirm: true }, /feature_id must be a feature ID/],
  ['delete_ospf_feature needs confirm: true', 'delete_ospf_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE }, /confirm: true/],
  ['associate_ospf_feature requires vpn_feature_id', 'associate_ospf_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE, confirm: true }, /vpn_feature_id and feature_id are required/],
]) {
  stats.ospfWrites = [];
  r = await tool(w, name, args);
  check(label, pattern.test(r.error ?? '') && stats.ospfWrites.length === 0, r.error ?? 'not rejected');
}

// Every OSPF write operation in the spec must be reachable through a dedicated tool.
const specOspfWrites = Object.entries(spec.paths)
  .filter(([path]) => /ospf/i.test(path))
  .flatMap(([path, ops]) => ['post', 'put', 'delete'].filter((m) => ops[m]).map((m) => `${m.toUpperCase()} ${template(path)}`));
stats.ospfWrites = [];
for (const solution of ['sdwan', 'sd-routing']) {
  for (const profile_type of ['service', 'transport']) {
    const vpnScopes = [{ vpn_feature_id: VPN }, ...(solution === 'sd-routing' && profile_type === 'transport' ? [{ vpn_feature_id: VPN, global_vrf: true }] : [])];
    for (const version of ['ospf', 'ospfv3-ipv4', 'ospfv3-ipv6']) {
      const scope = { solution, profile_type, profile: OSPF_PROFILE, version, confirm: true };
      await tool(w, 'create_ospf_feature', { ...scope, body: OSPF_BODY });
      for (const vpn of [{}, ...vpnScopes]) {
        await tool(w, 'update_ospf_feature', { ...scope, ...vpn, feature_id: FEATURE, body: OSPF_BODY });
        await tool(w, 'delete_ospf_feature', { ...scope, ...vpn, feature_id: FEATURE });
      }
      for (const vpn of vpnScopes) await tool(w, 'associate_ospf_feature', { ...scope, ...vpn, feature_id: FEATURE });
    }
  }
}
const written = new Set(stats.ospfWrites.map((x) => `${x.method} ${template(x.path)}`));
const missingWrites = specOspfWrites.filter((op) => !written.has(op));
check(`all ${specOspfWrites.length} OSPF write operations in the spec covered`, specOspfWrites.length === 81 && missingWrites.length === 0, missingWrites.join(', '));
check('OSPF write tools only call operations from the spec', [...written].every((op) => specOspfWrites.includes(op)));
const specV3Writes = specOspfWrites.filter(isV3);
check(
  `all ${specV3Writes.length} OSPFv3 write operations covered (POST/PUT/DELETE, IPv4 and IPv6)`,
  specV3Writes.length === 54 && specV3Writes.every((op) => written.has(op)),
  specV3Writes.filter((op) => !written.has(op)).join(', ')
);
await w.close();

// BGP: real-time monitoring with filters, feature schema, configuration reads and writes.
const specBgp = (methods) =>
  Object.entries(spec.paths)
    .filter(([path]) => /bgp/i.test(path))
    .flatMap(([path, ops]) => methods.filter((m) => ops[m]).map((m) => `${m.toUpperCase()} ${template(path)}`));
const bgpBase = `/dataservice/v1/feature-profile/sdwan/service/${OSPF_PROFILE}`;
const BGP_BODY = { name: 'BGP-65001', description: 'test', data: { asNum: { optionType: 'global', value: 65001 } } };
// Profile-level and VPN/VRF-level scopes for each solution and profile type.
const bgpScopes = [
  ['sdwan', 'service', [{}], [{ vpn_feature_id: VPN }]],
  ['sdwan', 'transport', [{}], [{ vpn_feature_id: VPN }]],
  ['sd-routing', 'service', [{}], [{ vpn_feature_id: VPN }]],
  ['sd-routing', 'transport', [{}, { global_vrf: true }], [{ vpn_feature_id: VPN }, { vpn_feature_id: VPN, global_vrf: true }]],
];

const cb = await connect();
const bgpRow = async (name, args) => (await tool(cb, name, { device_id: 'Branch-1', ...args })).value?.data?.[0];
let b = await bgpRow('get_bgp_neighbors', { vpn_id: '10', peer_addr: '198.51.100.9', as: '65010' });
check(
  'get_bgp_neighbors with filters',
  b?.path === '/dataservice/device/bgp/neighbors' && b.query.deviceId === '192.0.2.11' && b.query['vpn-id'] === '10' && b.query['peer-addr'] === '198.51.100.9' && b.query.as === '65010',
  JSON.stringify(b)
);
b = await bgpRow('get_bgp_routes', { vpn_id: '10', prefix: '10.1.0.0/16', nexthop: '198.51.100.9' });
check('get_bgp_routes with filters', b?.path === '/dataservice/device/bgp/routes' && b.query.prefix === '10.1.0.0/16' && b.query.nexthop === '198.51.100.9', JSON.stringify(b));
b = await bgpRow('get_bgp_routes');
check('get_bgp_routes without filters', b?.query && Object.keys(b.query).join() === 'deviceId', JSON.stringify(b));
check('get_bgp_summary', (await bgpRow('get_bgp_summary'))?.path === '/dataservice/device/bgp/summary');
r = await tool(cb, 'get_bgp_feature_schema', { profile_type: 'transport', schema_type: 'put' });
check('get_bgp_feature_schema', r.value?.data?.[0]?.path === '/dataservice/v1/feature-profile/sdwan/transport/routing/bgp/schema' && r.value.data[0].query.schemaType === 'put', JSON.stringify(r.value ?? r.error));
r = await tool(cb, 'get_bgp_config', { profile_type: 'service', profile: 'Branch-Service' });
check('get_bgp_config by profile name', r.value?.data?.[0]?.path === `${bgpBase}/routing/bgp`, JSON.stringify(r.value ?? r.error));
r = await tool(cb, 'get_bgp_config', { solution: 'sd-routing', profile_type: 'transport', profile: OSPF_PROFILE, global_vrf: true });
check(
  'get_bgp_config sd-routing global VRF',
  r.value?.data?.[0]?.path === `/dataservice/v1/feature-profile/sd-routing/transport/${OSPF_PROFILE}/global-vrf/routing/bgp`,
  JSON.stringify(r.value ?? r.error)
);

const specBgpGets = specBgp(['get']);
stats.bgpPaths = [];
for (const args of [{}, { vpn_id: '1' }]) {
  for (const name of ['get_bgp_neighbors', 'get_bgp_routes', 'get_bgp_summary']) await tool(cb, name, { device_id: 'Branch-1', ...args });
}
for (const profile_type of ['service', 'transport']) for (const schema_type of ['post', 'put']) await tool(cb, 'get_bgp_feature_schema', { profile_type, schema_type });
for (const [solution, profile_type, profileScopes, vpnScopes] of bgpScopes) {
  for (const scope of [...profileScopes, ...vpnScopes]) {
    for (const one of [{}, { feature_id: FEATURE }]) await tool(cb, 'get_bgp_config', { solution, profile_type, profile: OSPF_PROFILE, ...scope, ...one });
  }
}
const bgpReached = new Set(stats.bgpPaths.map((path) => `GET ${template(path)}`));
const missingBgpReads = specBgpGets.filter((op) => !bgpReached.has(op));
check(`all ${specBgpGets.length} BGP read operations in the spec covered`, specBgpGets.length === 25 && missingBgpReads.length === 0, missingBgpReads.join(', '));
check('BGP tools only call read paths from the spec', [...bgpReached].every((op) => specBgpGets.includes(op)), [...bgpReached].filter((op) => !specBgpGets.includes(op)).join(', '));

for (const [label, name, args, pattern] of [
  ['get_bgp_neighbors requires device_id', 'get_bgp_neighbors', {}, /device_id is required/],
  ['get_bgp_feature_schema rejects unknown profile_type', 'get_bgp_feature_schema', { profile_type: '../system' }, /profile_type must be one of/],
  ['get_bgp_feature_schema rejects unknown schema_type', 'get_bgp_feature_schema', { profile_type: 'service', schema_type: 'delete' }, /schema_type must be one of/],
  ['get_bgp_config rejects non-UUID feature_id', 'get_bgp_config', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: '../x' }, /feature_id must be a feature ID/],
  ['get_bgp_config rejects global_vrf for sdwan', 'get_bgp_config', { profile_type: 'transport', profile: OSPF_PROFILE, global_vrf: true }, /global_vrf applies only/],
]) {
  stats.bgpPaths = [];
  r = await tool(cb, name, args);
  check(label, pattern.test(r.error ?? '') && stats.bgpPaths.length === 0, r.error ?? 'not rejected');
}
r = await tool(cb, 'create_bgp_feature', { profile_type: 'service', profile: OSPF_PROFILE, body: BGP_BODY, confirm: true });
check('BGP writes disabled by default', /VMANAGE_ALLOW_WRITE=true/.test(r.error ?? '') && stats.bgpWrites.length === 0, r.error ?? 'not rejected');
await cb.close();

const wb = await connect({ VMANAGE_ALLOW_WRITE: 'true' });
const lastBgpWrite = () => stats.bgpWrites.at(-1);
r = await tool(wb, 'create_bgp_feature', { profile_type: 'service', profile: 'Branch-Service', body: BGP_BODY });
check('create_bgp_feature needs confirm: true', /confirm: true/.test(r.error ?? '') && stats.bgpWrites.length === 0, r.error ?? 'not rejected');
r = await tool(wb, 'create_bgp_feature', { profile_type: 'service', profile: 'Branch-Service', body: BGP_BODY, confirm: true });
check(
  'create_bgp_feature',
  !r.error && r.value?.operationId === 'CreateRoutingBgpProfileParcelForService' && lastBgpWrite()?.path === `${bgpBase}/routing/bgp` &&
    JSON.stringify(lastBgpWrite().body) === JSON.stringify(BGP_BODY),
  JSON.stringify(r.value ?? r.error)
);
r = await tool(wb, 'update_bgp_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE, body: BGP_BODY, confirm: true });
check('update_bgp_feature', !r.error && lastBgpWrite()?.method === 'PUT' && lastBgpWrite().path === `${bgpBase}/routing/bgp/${FEATURE}`, JSON.stringify(lastBgpWrite()));
r = await tool(wb, 'delete_bgp_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, feature_id: FEATURE, confirm: true });
check('delete_bgp_feature with VPN removes only the association', lastBgpWrite()?.method === 'DELETE' && lastBgpWrite().path === `${bgpBase}/lan/vpn/${VPN}/routing/bgp/${FEATURE}`, JSON.stringify(lastBgpWrite()));
r = await tool(wb, 'associate_bgp_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, feature_id: FEATURE, confirm: true });
check('associate_bgp_feature', !r.error && lastBgpWrite()?.method === 'POST' && lastBgpWrite().path === `${bgpBase}/lan/vpn/${VPN}/routing/bgp` && lastBgpWrite().body?.parcelId === FEATURE, JSON.stringify(lastBgpWrite()));
for (const [label, name, args, pattern] of [
  ['create_bgp_feature rejects a VPN scope', 'create_bgp_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, body: BGP_BODY, confirm: true }, /associate_bgp_feature/],
  ['update_bgp_feature requires an object body', 'update_bgp_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE, body: 'x', confirm: true }, /body must be an object/],
  ['delete_bgp_feature needs confirm: true', 'delete_bgp_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE }, /confirm: true/],
  ['associate_bgp_feature requires feature_id', 'associate_bgp_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, confirm: true }, /vpn_feature_id and feature_id are required/],
]) {
  stats.bgpWrites = [];
  r = await tool(wb, name, args);
  check(label, pattern.test(r.error ?? '') && stats.bgpWrites.length === 0, r.error ?? 'not rejected');
}

const specBgpWrites = specBgp(['post', 'put', 'delete']);
stats.bgpWrites = [];
for (const [solution, profile_type, profileScopes, vpnScopes] of bgpScopes) {
  const scope = { solution, profile_type, profile: OSPF_PROFILE, confirm: true };
  for (const s of profileScopes) await tool(wb, 'create_bgp_feature', { ...scope, ...s, body: BGP_BODY });
  for (const s of vpnScopes) await tool(wb, 'associate_bgp_feature', { ...scope, ...s, feature_id: FEATURE });
  for (const s of [...profileScopes, ...vpnScopes]) {
    await tool(wb, 'update_bgp_feature', { ...scope, ...s, feature_id: FEATURE, body: BGP_BODY });
    await tool(wb, 'delete_bgp_feature', { ...scope, ...s, feature_id: FEATURE });
  }
}
const bgpWritten = new Set(stats.bgpWrites.map((x) => `${x.method} ${template(x.path)}`));
const missingBgpWrites = specBgpWrites.filter((op) => !bgpWritten.has(op));
check(`all ${specBgpWrites.length} BGP write operations in the spec covered`, specBgpWrites.length === 30 && missingBgpWrites.length === 0, missingBgpWrites.join(', '));
check('BGP write tools only call operations from the spec', [...bgpWritten].every((op) => specBgpWrites.includes(op)));
await wb.close();

// UX 1.0 feature templates for BGP, OSPF, OSPFv3 and EIGRP.
mock.templateListDelayMs = 0;
const ct = await connect();
r = await tool(ct, 'list_routing_templates');
check('list_routing_templates keeps only routing templates', r.value?.data?.map((t) => t.templateName).join() === 'BGP-Hub,OSPFv3-Branch,EIGRP-Branch,PIM-Branch', JSON.stringify(r.value ?? r.error));
r = await tool(ct, 'list_routing_templates', { protocol: 'ospfv3' });
check('list_routing_templates protocol filter', r.value?.data?.map((t) => t.templateName).join() === 'OSPFv3-Branch', JSON.stringify(r.value ?? r.error));
r = await tool(ct, 'list_routing_templates', { protocol: 'eigrp' });
check('list_routing_templates EIGRP', r.value?.data?.map((t) => t.templateName).join() === 'EIGRP-Branch', JSON.stringify(r.value ?? r.error));
r = await tool(ct, 'get_routing_template_schema', { template_type: 'eigrp' });
check('get_routing_template_schema EIGRP', r.value?.path === '/dataservice/template/feature/types/definition/eigrp/15.0.0', JSON.stringify(r.value ?? r.error));
r = await tool(ct, 'get_routing_template', { template_id: BGP_TEMPLATE });
check('get_routing_template with device templates', r.value?.templateType === 'cisco_bgp' && r.value.deviceTemplates?.[0]?.templateName === 'DT-Hub', JSON.stringify(r.value ?? r.error));
r = await tool(ct, 'get_routing_template_schema', { template_type: 'cisco_ospfv3' });
check('get_routing_template_schema', r.value?.path === '/dataservice/template/feature/types/definition/cisco_ospfv3/15.0.0', JSON.stringify(r.value ?? r.error));
for (const [label, name, args, pattern] of [
  ['get_routing_template refuses non-routing templates', 'get_routing_template', { template_id: VPN_TEMPLATE }, /cisco_vpn template, not a routing or multicast/],
  ['get_routing_template rejects non-UUID ID', 'get_routing_template', { template_id: '../device/x' }, /must be a feature template ID/],
  ['get_routing_template_schema rejects other types', 'get_routing_template_schema', { template_type: 'cisco_vpn' }, /template_type must be one of/],
  ['get_routing_template_schema rejects bad version', 'get_routing_template_schema', { template_type: 'cisco_bgp', version: '../../x' }, /version must look like/],
]) {
  r = await tool(ct, name, args);
  check(label, pattern.test(r.error ?? ''), r.error ?? 'not rejected');
}
const TEMPLATE_BODY = { templateName: 'BGP-New', templateDescription: 'test', templateType: 'cisco_bgp', deviceType: ['vedge-C8000V'], templateMinVersion: '15.0.0', templateDefinition: {}, factoryDefault: false };
r = await tool(ct, 'create_routing_template', { body: TEMPLATE_BODY, confirm: true });
check('routing template writes disabled by default', /VMANAGE_ALLOW_WRITE=true/.test(r.error ?? '') && stats.templateWrites.length === 0, r.error ?? 'not rejected');
r = await tool(ct, 'clone_routing_template', { template_id: BGP_TEMPLATE, name: 'BGP-Copy', confirm: true });
check('clone_routing_template disabled by default', /VMANAGE_ALLOW_WRITE=true/.test(r.error ?? '') && stats.templateWrites.length === 0, r.error ?? 'not rejected');
await ct.close();

const wt = await connect({ VMANAGE_ALLOW_WRITE: 'true' });
const lastTemplateWrite = () => stats.templateWrites.at(-1);
r = await tool(wt, 'create_routing_template', { body: TEMPLATE_BODY });
check('create_routing_template needs confirm: true', /confirm: true/.test(r.error ?? '') && stats.templateWrites.length === 0, r.error ?? 'not rejected');
r = await tool(wt, 'create_routing_template', { body: TEMPLATE_BODY, confirm: true });
check(
  'create_routing_template',
  r.value?.operationId === 'createFeatureTemplate' && lastTemplateWrite()?.method === 'POST' && lastTemplateWrite().path === '/dataservice/template/feature' &&
    JSON.stringify(lastTemplateWrite().body) === JSON.stringify(TEMPLATE_BODY),
  JSON.stringify(r.value ?? r.error)
);
r = await tool(wt, 'update_routing_template', { template_id: OSPFV3_TEMPLATE, body: { templateName: 'OSPFv3-Branch', templateDefinition: {} }, confirm: true });
check(
  'update_routing_template keeps the template type',
  r.value?.operationId === 'editFeatureTemplate' && lastTemplateWrite()?.method === 'PUT' && lastTemplateWrite().path === `/dataservice/template/feature/${OSPFV3_TEMPLATE}` &&
    lastTemplateWrite().body.templateType === 'cisco_ospfv3',
  JSON.stringify(lastTemplateWrite())
);
r = await tool(wt, 'delete_routing_template', { template_id: BGP_TEMPLATE, confirm: true });
check('delete_routing_template', r.value?.operationId === 'deleteGeneralTemplate' && lastTemplateWrite()?.method === 'DELETE' && lastTemplateWrite().path === `/dataservice/template/feature/${BGP_TEMPLATE}`, JSON.stringify(lastTemplateWrite()));
r = await tool(wt, 'clone_routing_template', { template_id: BGP_TEMPLATE, name: 'BGP-Hub-Copy', confirm: true });
check(
  'clone_routing_template (default description)',
  r.value?.operationId === 'cloneTemplate' && lastTemplateWrite()?.method === 'POST' && lastTemplateWrite().path === '/dataservice/template/feature/clone' &&
    JSON.stringify(lastTemplateWrite().query) === JSON.stringify({ id: BGP_TEMPLATE, name: 'BGP-Hub-Copy', desc: 'Clone of BGP-Hub' }) && r.value.result?.templateId,
  JSON.stringify(lastTemplateWrite())
);
r = await tool(wt, 'clone_routing_template', { template_id: OSPFV3_TEMPLATE, name: 'OSPFv3-Lab', description: 'Lab copy', confirm: true });
check('clone_routing_template with description', lastTemplateWrite()?.query?.desc === 'Lab copy' && lastTemplateWrite().query.id === OSPFV3_TEMPLATE, JSON.stringify(lastTemplateWrite()));
r = await tool(wt, 'create_routing_template', { body: { ...TEMPLATE_BODY, templateName: 'EIGRP-New', templateType: 'eigrp' }, confirm: true });
check('create_routing_template EIGRP', !r.error && lastTemplateWrite()?.body?.templateType === 'eigrp', JSON.stringify(r.value ?? r.error));
r = await tool(wt, 'clone_routing_template', { template_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', name: 'EIGRP-Lab', confirm: true });
check('clone_routing_template EIGRP', !r.error && lastTemplateWrite()?.query?.desc === 'Clone of EIGRP-Branch', JSON.stringify(lastTemplateWrite()));
for (const [label, name, args, pattern] of [
  ['create_routing_template refuses other template types', 'create_routing_template', { body: { ...TEMPLATE_BODY, templateType: 'cisco_vpn' }, confirm: true }, /body.templateType must be one of/],
  ['update_routing_template refuses a type change', 'update_routing_template', { template_id: BGP_TEMPLATE, body: { ...TEMPLATE_BODY, templateType: 'cisco_ospf' }, confirm: true }, /must stay cisco_bgp/],
  ['update_routing_template refuses non-routing templates', 'update_routing_template', { template_id: VPN_TEMPLATE, body: TEMPLATE_BODY, confirm: true }, /not a routing or multicast/],
  ['delete_routing_template refuses non-routing templates', 'delete_routing_template', { template_id: VPN_TEMPLATE, confirm: true }, /not a routing or multicast/],
  ['delete_routing_template needs confirm: true', 'delete_routing_template', { template_id: BGP_TEMPLATE }, /confirm: true/],
  ['clone_routing_template refuses non-routing templates', 'clone_routing_template', { template_id: VPN_TEMPLATE, name: 'VPN-Copy', confirm: true }, /not a routing or multicast/],
  ['clone_routing_template requires a name', 'clone_routing_template', { template_id: BGP_TEMPLATE, name: '  ', confirm: true }, /name is required/],
  ['clone_routing_template needs confirm: true', 'clone_routing_template', { template_id: BGP_TEMPLATE, name: 'BGP-Copy' }, /confirm: true/],
]) {
  stats.templateWrites = [];
  r = await tool(wt, name, args);
  check(label, pattern.test(r.error ?? '') && stats.templateWrites.length === 0, r.error ?? 'not rejected');
}
await wt.close();

// EIGRP: real-time monitoring and UX 2.0 service-profile features (read and write).
const specEigrp = (methods) =>
  Object.entries(spec.paths)
    .filter(([path]) => /eigrp/i.test(path))
    .flatMap(([path, ops]) => methods.filter((m) => ops[m]).map((m) => `${m.toUpperCase()} ${template(path)}`));
const EIGRP_BODY = { name: 'EIGRP-100', description: 'test', data: { asNum: { optionType: 'global', value: 100 } } };
const eigrpBase = `/dataservice/v1/feature-profile/sdwan/service/${OSPF_PROFILE}`;
const ce = await connect();
for (const [name, view] of [['get_eigrp_interfaces', 'interface'], ['get_eigrp_routes', 'route'], ['get_eigrp_topology', 'topology']]) {
  const row = (await tool(ce, name, { device_id: 'Branch-1' })).value?.data?.[0];
  check(name, row?.path === `/dataservice/device/eigrp/${view}` && row.query.deviceId === '192.0.2.11', JSON.stringify(row));
}
r = await tool(ce, 'get_eigrp_config', { profile_type: 'service', profile: 'Branch-Service' });
check('get_eigrp_config by profile name', r.value?.data?.[0]?.path === `${eigrpBase}/routing/eigrp`, JSON.stringify(r.value ?? r.error));
r = await tool(ce, 'get_eigrp_config', { solution: 'sd-routing', profile_type: 'service', profile: OSPF_PROFILE });
check(
  'get_eigrp_config sd-routing (VRF section)',
  r.value?.data?.[0]?.path === `/dataservice/v1/feature-profile/sd-routing/service/${OSPF_PROFILE}/vrf/routing/eigrp`,
  JSON.stringify(r.value ?? r.error)
);

const eigrpScopes = [
  ['sdwan', [{}], [{ vpn_feature_id: VPN }]],
  ['sd-routing', [{}], [{ vpn_feature_id: VPN }]],
];
const specEigrpGets = specEigrp(['get']);
stats.eigrpPaths = [];
for (const name of ['get_eigrp_interfaces', 'get_eigrp_routes', 'get_eigrp_topology']) await tool(ce, name, { device_id: 'Branch-1' });
for (const [solution, profileScopes, vpnScopes] of eigrpScopes) {
  for (const scope of [...profileScopes, ...vpnScopes]) {
    for (const one of [{}, { feature_id: FEATURE }]) await tool(ce, 'get_eigrp_config', { solution, profile_type: 'service', profile: OSPF_PROFILE, ...scope, ...one });
  }
}
const eigrpReached = new Set(stats.eigrpPaths.map((path) => `GET ${template(path)}`));
const missingEigrpReads = specEigrpGets.filter((op) => !eigrpReached.has(op));
check(`all ${specEigrpGets.length} EIGRP read operations in the spec covered`, specEigrpGets.length === 11 && missingEigrpReads.length === 0, missingEigrpReads.join(', '));
check('EIGRP tools only call read paths from the spec', [...eigrpReached].every((op) => specEigrpGets.includes(op)));

for (const [label, name, args, pattern] of [
  ['get_eigrp_routes requires device_id', 'get_eigrp_routes', {}, /device_id is required/],
  ['get_eigrp_config rejects transport profiles', 'get_eigrp_config', { profile_type: 'transport', profile: OSPF_PROFILE }, /profile_type must be one of: service$/],
  ['get_eigrp_config rejects global_vrf', 'get_eigrp_config', { solution: 'sd-routing', profile_type: 'service', profile: OSPF_PROFILE, global_vrf: true }, /global_vrf applies only/],
  ['get_eigrp_config rejects non-UUID vpn_feature_id', 'get_eigrp_config', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: '../x' }, /vpn_feature_id must be a feature ID/],
]) {
  stats.eigrpPaths = [];
  r = await tool(ce, name, args);
  check(label, pattern.test(r.error ?? '') && stats.eigrpPaths.length === 0, r.error ?? 'not rejected');
}
r = await tool(ce, 'create_eigrp_feature', { profile_type: 'service', profile: OSPF_PROFILE, body: EIGRP_BODY, confirm: true });
check('EIGRP writes disabled by default', /VMANAGE_ALLOW_WRITE=true/.test(r.error ?? '') && stats.eigrpWrites.length === 0, r.error ?? 'not rejected');
await ce.close();

const we = await connect({ VMANAGE_ALLOW_WRITE: 'true' });
const lastEigrpWrite = () => stats.eigrpWrites.at(-1);
r = await tool(we, 'create_eigrp_feature', { profile_type: 'service', profile: 'Branch-Service', body: EIGRP_BODY });
check('create_eigrp_feature needs confirm: true', /confirm: true/.test(r.error ?? '') && stats.eigrpWrites.length === 0, r.error ?? 'not rejected');
r = await tool(we, 'create_eigrp_feature', { profile_type: 'service', profile: 'Branch-Service', body: EIGRP_BODY, confirm: true });
check(
  'create_eigrp_feature',
  r.value?.operationId === 'CreateRoutingEigrpProfileParcelForService' && lastEigrpWrite()?.path === `${eigrpBase}/routing/eigrp` &&
    JSON.stringify(lastEigrpWrite().body) === JSON.stringify(EIGRP_BODY),
  JSON.stringify(r.value ?? r.error)
);
r = await tool(we, 'associate_eigrp_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, feature_id: FEATURE, confirm: true });
check('associate_eigrp_feature', !r.error && lastEigrpWrite()?.method === 'POST' && lastEigrpWrite().path === `${eigrpBase}/lan/vpn/${VPN}/routing/eigrp` && lastEigrpWrite().body?.parcelId === FEATURE, JSON.stringify(lastEigrpWrite()));
r = await tool(we, 'update_eigrp_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE, body: EIGRP_BODY, confirm: true });
check('update_eigrp_feature', !r.error && lastEigrpWrite()?.method === 'PUT' && lastEigrpWrite().path === `${eigrpBase}/routing/eigrp/${FEATURE}`, JSON.stringify(lastEigrpWrite()));
r = await tool(we, 'delete_eigrp_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, feature_id: FEATURE, confirm: true });
check('delete_eigrp_feature with VPN removes only the association', lastEigrpWrite()?.method === 'DELETE' && lastEigrpWrite().path === `${eigrpBase}/lan/vpn/${VPN}/routing/eigrp/${FEATURE}`, JSON.stringify(lastEigrpWrite()));
for (const [label, name, args, pattern] of [
  ['create_eigrp_feature rejects transport profiles', 'create_eigrp_feature', { profile_type: 'transport', profile: OSPF_PROFILE, body: EIGRP_BODY, confirm: true }, /profile_type must be one of: service$/],
  ['create_eigrp_feature rejects a VPN scope', 'create_eigrp_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, body: EIGRP_BODY, confirm: true }, /associate_eigrp_feature/],
  ['delete_eigrp_feature needs confirm: true', 'delete_eigrp_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE }, /confirm: true/],
  ['associate_eigrp_feature requires feature_id', 'associate_eigrp_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, confirm: true }, /vpn_feature_id and feature_id are required/],
]) {
  stats.eigrpWrites = [];
  r = await tool(we, name, args);
  check(label, pattern.test(r.error ?? '') && stats.eigrpWrites.length === 0, r.error ?? 'not rejected');
}

const specEigrpWrites = specEigrp(['post', 'put', 'delete']);
stats.eigrpWrites = [];
for (const [solution, profileScopes, vpnScopes] of eigrpScopes) {
  const scope = { solution, profile_type: 'service', profile: OSPF_PROFILE, confirm: true };
  for (const s of profileScopes) await tool(we, 'create_eigrp_feature', { ...scope, ...s, body: EIGRP_BODY });
  for (const s of vpnScopes) await tool(we, 'associate_eigrp_feature', { ...scope, ...s, feature_id: FEATURE });
  for (const s of [...profileScopes, ...vpnScopes]) {
    await tool(we, 'update_eigrp_feature', { ...scope, ...s, feature_id: FEATURE, body: EIGRP_BODY });
    await tool(we, 'delete_eigrp_feature', { ...scope, ...s, feature_id: FEATURE });
  }
}
const eigrpWritten = new Set(stats.eigrpWrites.map((x) => `${x.method} ${template(x.path)}`));
const missingEigrpWrites = specEigrpWrites.filter((op) => !eigrpWritten.has(op));
check(`all ${specEigrpWrites.length} EIGRP write operations in the spec covered`, specEigrpWrites.length === 12 && missingEigrpWrites.length === 0, missingEigrpWrites.join(', '));
check('EIGRP write tools only call operations from the spec', [...eigrpWritten].every((op) => specEigrpWrites.includes(op)));
await we.close();

// CLI add-ons: the way to manage RIP/RIPng and other configuration without a dedicated API.
const cc = await connect();
r = await tool(cc, 'list_cli_addons');
check('list_cli_addons across CLI profiles', r.value?.data?.map((f) => `${f.profile}:${f.name}`).join() === 'Branch-CLI:RIP-Addon,Hub-CLI:Banner', JSON.stringify(r.value ?? r.error));
r = await tool(cc, 'list_cli_addons', { contains: 'ROUTER RIP' });
check('list_cli_addons contains (case-insensitive)', r.value?.data?.length === 1 && r.value.data[0].config === RIP_CLI && r.value.data[0].featureId === CLI_FEATURE, JSON.stringify(r.value ?? r.error));
r = await tool(cc, 'list_cli_addons', { profile: 'Branch-CLI', solution: 'sd-routing' });
check('list_cli_addons one sd-routing profile', r.value?.data?.length === 1 && stats.cliPaths.at(-1) === `/dataservice/v1/feature-profile/sd-routing/cli/${CLI_PROFILE_ID}/config`, JSON.stringify(stats.cliPaths.at(-1)));
r = await tool(cc, 'get_cli_addon', { profile: 'Branch-CLI', feature_id: CLI_FEATURE });
check('get_cli_addon', r.value?.payload?.data?.config === RIP_CLI, JSON.stringify(r.value ?? r.error));
r = await tool(cc, 'list_cli_templates');
check('list_cli_templates keeps only cli-template', r.value?.data?.map((t) => t.templateName).join() === 'RIP-CLI,Banner-CLI', JSON.stringify(r.value ?? r.error));
r = await tool(cc, 'list_cli_templates', { contains: 'ipv6 router rip' });
check('list_cli_templates contains (no match)', r.value?.data?.length === 0, JSON.stringify(r.value ?? r.error));
r = await tool(cc, 'list_cli_templates', { contains: 'router rip' });
check('list_cli_templates contains', r.value?.data?.map((t) => t.templateName).join() === 'RIP-CLI' && r.value.data[0].config === RIP_CLI, JSON.stringify(r.value ?? r.error));
r = await tool(cc, 'get_cli_template', { template_id: CLI_TEMPLATE });
check('get_cli_template', r.value?.config === RIP_CLI && r.value.deviceTemplates?.[0]?.templateName === 'DT-Hub', JSON.stringify(r.value ?? r.error));
r = await tool(cc, 'get_cli_template', { template_id: BGP_TEMPLATE });
check('get_cli_template refuses other template types', /cisco_bgp template, not a CLI add-on/.test(r.error ?? ''), r.error ?? 'not rejected');
r = await tool(cc, 'create_cli_addon', { profile: 'Branch-CLI', name: 'RIPng', config: 'ipv6 router rip RIPNG', confirm: true });
check('CLI writes disabled by default', /VMANAGE_ALLOW_WRITE=true/.test(r.error ?? '') && stats.cliWrites.length === 0, r.error ?? 'not rejected');
await cc.close();

const wc = await connect({ VMANAGE_ALLOW_WRITE: 'true' });
const cliBase = `/dataservice/v1/feature-profile/sdwan/cli/${CLI_PROFILE_ID}/config`;
const lastCliWrite = () => stats.cliWrites.at(-1);
const RIPNG_CLI = 'ipv6 router rip RIPNG\n redistribute connected';
r = await tool(wc, 'create_cli_addon', { profile: 'Branch-CLI', name: 'RIPng', config: RIPNG_CLI });
check('create_cli_addon needs confirm: true', /confirm: true/.test(r.error ?? '') && stats.cliWrites.length === 0, r.error ?? 'not rejected');
r = await tool(wc, 'create_cli_addon', { profile: 'Branch-CLI', name: 'RIPng', description: 'RIPng LAN', config: RIPNG_CLI, confirm: true });
check(
  'create_cli_addon',
  r.value?.operationId === 'CreateSdwanConfigProfileParcelForCli' && lastCliWrite()?.path === cliBase &&
    JSON.stringify(lastCliWrite().body) === JSON.stringify({ name: 'RIPng', description: 'RIPng LAN', data: { config: RIPNG_CLI } }),
  JSON.stringify(lastCliWrite() ?? r.error)
);
r = await tool(wc, 'update_cli_addon', { profile: 'Branch-CLI', feature_id: CLI_FEATURE, config: RIPNG_CLI, confirm: true });
check(
  'update_cli_addon keeps unchanged fields',
  r.value?.operationId === 'EditConfigProfileParcelForCLI' && lastCliWrite()?.method === 'PUT' && lastCliWrite().path === `${cliBase}/${CLI_FEATURE}` &&
    lastCliWrite().body.name === 'RIP-Addon' && lastCliWrite().body.description === 'RIP for LAN' && lastCliWrite().body.data.config === RIPNG_CLI,
  JSON.stringify(lastCliWrite() ?? r.error)
);
r = await tool(wc, 'delete_cli_addon', { profile: 'Branch-CLI', feature_id: CLI_FEATURE, confirm: true });
check('delete_cli_addon', r.value?.operationId === 'DeleteConfigProfileParcelForCLI' && lastCliWrite()?.method === 'DELETE' && lastCliWrite().path === `${cliBase}/${CLI_FEATURE}`, JSON.stringify(lastCliWrite()));
r = await tool(wc, 'create_cli_addon', { profile: CLI_PROFILE_ID, solution: 'sd-routing', name: 'RIP', config: RIP_CLI, confirm: true });
check('create_cli_addon sd-routing', r.value?.operationId === 'CreateSdroutingCLIAddOnFeature', JSON.stringify(r.value ?? r.error));

r = await tool(wc, 'create_cli_template', { name: 'RIPng-CLI', config: RIPNG_CLI, device_types: ['vedge-C8000V'], confirm: true });
check(
  'create_cli_template',
  r.value?.operationId === 'createFeatureTemplate' && lastTemplateWrite()?.body?.templateType === 'cli-template' &&
    lastTemplateWrite().body.templateDefinition.config.vipValue === RIPNG_CLI && lastTemplateWrite().body.templateDescription === 'RIPng-CLI',
  JSON.stringify(lastTemplateWrite())
);
r = await tool(wc, 'update_cli_template', { template_id: CLI_TEMPLATE, config: RIPNG_CLI, confirm: true });
check(
  'update_cli_template keeps name, type and device models',
  r.value?.operationId === 'editFeatureTemplate' && lastTemplateWrite()?.path === `/dataservice/template/feature/${CLI_TEMPLATE}` &&
    lastTemplateWrite().body.templateName === 'RIP-CLI' && lastTemplateWrite().body.deviceType[0] === 'vedge-C8000V' &&
    lastTemplateWrite().body.templateDefinition.config.vipValue === RIPNG_CLI && lastTemplateWrite().body.templateType === 'cli-template',
  JSON.stringify(lastTemplateWrite())
);
r = await tool(wc, 'delete_cli_template', { template_id: CLI_TEMPLATE, confirm: true });
check('delete_cli_template', r.value?.operationId === 'deleteGeneralTemplate' && lastTemplateWrite()?.path === `/dataservice/template/feature/${CLI_TEMPLATE}`, JSON.stringify(lastTemplateWrite()));

for (const [label, name, args, pattern] of [
  ['create_cli_addon requires config', 'create_cli_addon', { profile: 'Branch-CLI', name: 'x', config: '  ', confirm: true }, /config must be non-empty/],
  ['create_cli_addon requires a name', 'create_cli_addon', { profile: 'Branch-CLI', config: RIP_CLI, confirm: true }, /name is required/],
  ['create_cli_addon rejects oversized config', 'create_cli_addon', { profile: 'Branch-CLI', name: 'x', config: 'x'.repeat(100_001), confirm: true }, /at most 100000/],
  ['update_cli_addon with nothing to change', 'update_cli_addon', { profile: 'Branch-CLI', feature_id: CLI_FEATURE, confirm: true }, /Nothing to change/],
  ['delete_cli_addon rejects non-UUID feature_id', 'delete_cli_addon', { profile: 'Branch-CLI', feature_id: '../../system', confirm: true }, /feature_id must be a feature ID/],
  ['delete_cli_addon needs confirm: true', 'delete_cli_addon', { profile: 'Branch-CLI', feature_id: CLI_FEATURE }, /confirm: true/],
  ['create_cli_template rejects bad device_types', 'create_cli_template', { name: 'x', config: RIP_CLI, device_types: ['../x'], confirm: true }, /device_types must be/],
  ['update_cli_template refuses other template types', 'update_cli_template', { template_id: BGP_TEMPLATE, config: RIP_CLI, confirm: true }, /not a CLI add-on/],
  ['delete_cli_template refuses other template types', 'delete_cli_template', { template_id: VPN_TEMPLATE, confirm: true }, /not a CLI add-on/],
]) {
  stats.cliWrites = [];
  stats.templateWrites = [];
  r = await tool(wc, name, args);
  check(label, pattern.test(r.error ?? '') && stats.cliWrites.length === 0 && stats.templateWrites.length === 0, r.error ?? 'not rejected');
}

// Every UX 2.0 CLI add-on (config) operation in the spec for SD-WAN and SD-Routing is reachable.
const specCli = Object.entries(spec.paths)
  .filter(([path]) => /^\/v1\/feature-profile\/(sdwan|sd-routing)\/cli\/\{[^}]+\}\/config(\/\{[^}]+\})?$/.test(path))
  .flatMap(([path, ops]) => ['get', 'post', 'put', 'delete'].filter((m) => ops[m]).map((m) => `${m.toUpperCase()} ${template(path)}`));
stats.cliPaths = [];
stats.cliWrites = [];
for (const solution of ['sdwan', 'sd-routing']) {
  const scope = { solution, profile: CLI_PROFILE_ID };
  await tool(wc, 'list_cli_addons', scope);
  await tool(wc, 'get_cli_addon', { ...scope, feature_id: CLI_FEATURE });
  await tool(wc, 'create_cli_addon', { ...scope, name: 'x', config: RIP_CLI, confirm: true });
  await tool(wc, 'update_cli_addon', { ...scope, feature_id: CLI_FEATURE, config: RIP_CLI, confirm: true });
  await tool(wc, 'delete_cli_addon', { ...scope, feature_id: CLI_FEATURE, confirm: true });
}
const cliReached = new Set([
  ...stats.cliPaths.filter((path) => /\/config(\/|$)/.test(path)).map((path) => `GET ${template(path)}`),
  ...stats.cliWrites.map((x) => `${x.method} ${template(x.path)}`),
]);
const missingCli = specCli.filter((op) => !cliReached.has(op));
check(`all ${specCli.length} UX 2.0 CLI add-on operations (SD-WAN and SD-Routing) covered`, specCli.length === 10 && missingCli.length === 0, missingCli.join(', '));
check('CLI add-on tools only call operations from the spec', [...cliReached].every((op) => specCli.includes(op)), [...cliReached].filter((op) => !specCli.includes(op)).join(', '));
await wc.close();

// Multicast: IGMP / PIM / overlay multicast / MFIB monitoring, UX 2.0 service features, UX 1.0 templates.
const MC_RX = /multicast|\/pim|igmp|msdp|mroute|\/mfib/i;
const specMc = (methods) =>
  Object.entries(spec.paths)
    .filter(([path]) => MC_RX.test(path))
    .flatMap(([path, ops]) => methods.filter((m) => ops[m]).map((m) => `${m.toUpperCase()} ${template(path)}`));
const MC_BODY = { name: 'Multicast-LAN', description: 'test', data: { basic: { sptOnly: { optionType: 'global', value: false } } } };
const mcBase = `/dataservice/v1/feature-profile/sdwan/service/${OSPF_PROFILE}`;
const MC_VIEWS = [
  ['get_igmp_status', { groups: 'igmp/groups', interface: 'igmp/interface', statistics: 'igmp/statistics', summary: 'igmp/summary' }],
  ['get_pim_status', { neighbor: 'pim/neighbor', interface: 'pim/interface', 'rp-mapping': 'pim/rp-mapping', statistics: 'pim/statistics' }],
  ['get_multicast_status', { topology: 'multicast/topology', rpf: 'multicast/rpf', replicator: 'multicast/replicator', tunnel: 'multicast/tunnel' }],
  ['get_mfib', { summary: 'ip/mfibsummary', oil: 'ip/mfiboil', stats: 'ip/mfibstats' }],
];
const cm = await connect();
for (const [name, views] of MC_VIEWS) {
  const [defaultView] = Object.values(views);
  const row = (await tool(cm, name, { device_id: 'Branch-1' })).value?.data?.[0];
  check(`${name} (default view)`, row?.path === `/dataservice/device/${defaultView}` && row.query.deviceId === '192.0.2.11', JSON.stringify(row));
}
r = await tool(cm, 'get_pim_status', { device_id: 'Branch-1', view: 'rp-mapping' });
check('get_pim_status rp-mapping', r.value?.data?.[0]?.path === '/dataservice/device/pim/rp-mapping', JSON.stringify(r.value ?? r.error));
r = await tool(cm, 'get_multicast_feature_schema', { schema_type: 'put' });
check('get_multicast_feature_schema', r.value?.data?.[0]?.path === '/dataservice/v1/feature-profile/sdwan/service/routing/multicast/schema' && r.value.data[0].query.schemaType === 'put', JSON.stringify(r.value ?? r.error));
r = await tool(cm, 'get_multicast_config', { profile_type: 'service', profile: 'Branch-Service' });
check('get_multicast_config by profile name', r.value?.data?.[0]?.path === `${mcBase}/routing/multicast`, JSON.stringify(r.value ?? r.error));
r = await tool(cm, 'list_routing_templates', { protocol: 'pim' });
check('list_routing_templates PIM', r.value?.data?.map((t) => t.templateName).join() === 'PIM-Branch', JSON.stringify(r.value ?? r.error));
r = await tool(cm, 'get_routing_template_schema', { template_type: 'cedge_multicast' });
check('get_routing_template_schema multicast', r.value?.path === '/dataservice/template/feature/types/definition/cedge_multicast/15.0.0', JSON.stringify(r.value ?? r.error));

const specMcGets = specMc(['get']);
stats.mcPaths = [];
for (const [name, views] of MC_VIEWS) for (const view of Object.keys(views)) await tool(cm, name, { device_id: 'Branch-1', view });
for (const schema_type of ['post', 'put']) await tool(cm, 'get_multicast_feature_schema', { schema_type });
for (const scope of [{}, { vpn_feature_id: VPN }]) {
  for (const one of [{}, { feature_id: FEATURE }]) await tool(cm, 'get_multicast_config', { profile_type: 'service', profile: OSPF_PROFILE, ...scope, ...one });
}
const mcReached = new Set(stats.mcPaths.map((path) => `GET ${template(path)}`));
const missingMcReads = specMcGets.filter((op) => !mcReached.has(op));
check(`all ${specMcGets.length} multicast read operations in the spec covered`, specMcGets.length === 20 && missingMcReads.length === 0, missingMcReads.join(', '));
check('multicast tools only call read paths from the spec', [...mcReached].every((op) => specMcGets.includes(op)), [...mcReached].filter((op) => !specMcGets.includes(op)).join(', '));

for (const [label, name, args, pattern] of [
  ['get_igmp_status rejects unknown view', 'get_igmp_status', { device_id: 'Branch-1', view: '../bgp' }, /view must be one of/],
  ['get_mfib requires device_id', 'get_mfib', {}, /device_id is required/],
  ['get_multicast_config rejects transport profiles', 'get_multicast_config', { profile_type: 'transport', profile: OSPF_PROFILE }, /profile_type must be one of: service$/],
  ['get_multicast_config rejects sd-routing', 'get_multicast_config', { solution: 'sd-routing', profile_type: 'service', profile: OSPF_PROFILE }, /solution must be one of: sdwan$/],
]) {
  stats.mcPaths = [];
  r = await tool(cm, name, args);
  check(label, pattern.test(r.error ?? '') && stats.mcPaths.length === 0, r.error ?? 'not rejected');
}
r = await tool(cm, 'create_multicast_feature', { profile_type: 'service', profile: OSPF_PROFILE, body: MC_BODY, confirm: true });
check('multicast writes disabled by default', /VMANAGE_ALLOW_WRITE=true/.test(r.error ?? '') && stats.mcWrites.length === 0, r.error ?? 'not rejected');
await cm.close();

const wm = await connect({ VMANAGE_ALLOW_WRITE: 'true' });
const lastMcWrite = () => stats.mcWrites.at(-1);
r = await tool(wm, 'create_multicast_feature', { profile_type: 'service', profile: 'Branch-Service', body: MC_BODY });
check('create_multicast_feature needs confirm: true', /confirm: true/.test(r.error ?? '') && stats.mcWrites.length === 0, r.error ?? 'not rejected');
r = await tool(wm, 'create_multicast_feature', { profile_type: 'service', profile: 'Branch-Service', body: MC_BODY, confirm: true });
check(
  'create_multicast_feature',
  r.value?.operationId === 'CreateRoutingMulticastProfileParcelForService' && lastMcWrite()?.path === `${mcBase}/routing/multicast` &&
    JSON.stringify(lastMcWrite().body) === JSON.stringify(MC_BODY),
  JSON.stringify(r.value ?? r.error)
);
r = await tool(wm, 'associate_multicast_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, feature_id: FEATURE, confirm: true });
check('associate_multicast_feature', !r.error && lastMcWrite()?.path === `${mcBase}/lan/vpn/${VPN}/routing/multicast` && lastMcWrite().body?.parcelId === FEATURE, JSON.stringify(lastMcWrite()));
r = await tool(wm, 'update_multicast_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE, body: MC_BODY, confirm: true });
check('update_multicast_feature', !r.error && lastMcWrite()?.method === 'PUT' && lastMcWrite().path === `${mcBase}/routing/multicast/${FEATURE}`, JSON.stringify(lastMcWrite()));
r = await tool(wm, 'delete_multicast_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, feature_id: FEATURE, confirm: true });
check('delete_multicast_feature with VPN removes only the association', lastMcWrite()?.method === 'DELETE' && lastMcWrite().path === `${mcBase}/lan/vpn/${VPN}/routing/multicast/${FEATURE}`, JSON.stringify(lastMcWrite()));
r = await tool(wm, 'create_routing_template', { body: { ...TEMPLATE_BODY, templateName: 'IGMP-New', templateType: 'cedge_igmp' }, confirm: true });
check('create_routing_template IGMP', !r.error && lastTemplateWrite()?.body?.templateType === 'cedge_igmp', JSON.stringify(r.value ?? r.error));
for (const [label, name, args, pattern] of [
  ['create_multicast_feature rejects a VPN scope', 'create_multicast_feature', { profile_type: 'service', profile: OSPF_PROFILE, vpn_feature_id: VPN, body: MC_BODY, confirm: true }, /associate_multicast_feature/],
  ['update_multicast_feature requires an object body', 'update_multicast_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE, body: [], confirm: true }, /body must be an object/],
  ['delete_multicast_feature needs confirm: true', 'delete_multicast_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE }, /confirm: true/],
  ['associate_multicast_feature requires vpn_feature_id', 'associate_multicast_feature', { profile_type: 'service', profile: OSPF_PROFILE, feature_id: FEATURE, confirm: true }, /vpn_feature_id and feature_id are required/],
]) {
  stats.mcWrites = [];
  r = await tool(wm, name, args);
  check(label, pattern.test(r.error ?? '') && stats.mcWrites.length === 0, r.error ?? 'not rejected');
}

const specMcWrites = specMc(['post', 'put', 'delete']);
stats.mcWrites = [];
const mcScope = { profile_type: 'service', profile: OSPF_PROFILE, confirm: true };
await tool(wm, 'create_multicast_feature', { ...mcScope, body: MC_BODY });
await tool(wm, 'associate_multicast_feature', { ...mcScope, vpn_feature_id: VPN, feature_id: FEATURE });
for (const s of [{}, { vpn_feature_id: VPN }]) {
  await tool(wm, 'update_multicast_feature', { ...mcScope, ...s, feature_id: FEATURE, body: MC_BODY });
  await tool(wm, 'delete_multicast_feature', { ...mcScope, ...s, feature_id: FEATURE });
}
const mcWritten = new Set(stats.mcWrites.map((x) => `${x.method} ${template(x.path)}`));
const missingMcWrites = specMcWrites.filter((op) => !mcWritten.has(op));
check(`all ${specMcWrites.length} multicast write operations in the spec covered`, specMcWrites.length === 6 && missingMcWrites.length === 0, missingMcWrites.join(', '));
check('multicast write tools only call operations from the spec', [...mcWritten].every((op) => specMcWrites.includes(op)));
await wm.close();

// IPv6: real-time monitoring, UX 1.0 IPv6 policy objects, UX 2.0 IPv6 trackers.
const V6_RX = /ipv6|v6|nat64|dhcpv6/i;
const specV6 = Object.entries(spec.paths).filter(([path]) => V6_RX.test(path) && !/ospf|app-registry|\/ise\//i.test(path));
const specV6Ops = (methods, previews = false) =>
  specV6.flatMap(([path, ops]) =>
    methods.filter((m) => ops[m] && (m !== 'post' || /\/preview$/.test(path) === previews)).map((m) => `${m.toUpperCase()} ${template(path)}`)
  );
const ACL6_ID = '16161616-1616-4161-8161-161616161616';
const TRACKER = '17171717-1717-4171-8171-171717171717';
const IFACE = '18181818-1818-4181-8181-181818181818';
const trackerBase = `/dataservice/v1/feature-profile/sdwan/transport/${OSPF_PROFILE}`;
const cv = await connect();
let v6 = (await tool(cv, 'get_ipv6_status', { device_id: 'Branch-1' })).value?.data?.[0];
check('get_ipv6_status (default nd)', v6?.path === '/dataservice/device/ipv6/nd6' && v6.query.deviceId === '192.0.2.11', JSON.stringify(v6));
v6 = (await tool(cv, 'get_ipv6_status', { device_id: 'Branch-1', view: 'fib', vpn_id: '10', prefix: '2001:db8::/32', color: 'mpls' })).value?.data?.[0];
check('get_ipv6_status fib with filters', v6?.path === '/dataservice/device/ip/v6fib' && v6.query['vpn-id'] === '10' && v6.query.prefix === '2001:db8::/32' && v6.query.color === 'mpls', JSON.stringify(v6));
v6 = (await tool(cv, 'get_ipv6_status', { device_id: 'Branch-1', view: 'interface-stats', if_name: 'GigabitEthernet3' })).value?.data?.[0];
check('get_ipv6_status interface-stats maps if_name to ifname', v6?.query?.ifname === 'GigabitEthernet3', JSON.stringify(v6));
r = await tool(cv, 'get_ipv6_status', { device_id: 'Branch-1', view: 'routes', vpn_id: '10' });
check(
  'get_ipv6_status routes keeps only IPv6 routes',
  r.value?.data?.map((x) => x['route-destination-prefix']).join() === '2001:db8:10::/64,2001:db8:20::/64' && r.value.data[0].query['routing-instance-name'] === '10',
  JSON.stringify(r.value ?? r.error)
);
r = await tool(cv, 'get_ipv6_status', { device_id: 'Branch-1', view: 'routes', protocol: 'OMP' });
check('get_ipv6_status routes protocol filter', r.value?.data?.map((x) => x['route-destination-prefix']).join() === '2001:db8:10::/64', JSON.stringify(r.value ?? r.error));
r = await tool(cv, 'get_ipv6_status', { device_id: 'Branch-1', view: 'routes', prefix: '2001:DB8:20::/64' });
check('get_ipv6_status routes prefix filter', r.value?.data?.length === 1 && r.value.data[0]['route-source-protocol'] === 'direct', JSON.stringify(r.value ?? r.error));
v6 = (await tool(cv, 'get_ipv6_policy_status', { device_id: 'Branch-1', view: 'sgacl-counters' })).value?.data?.[0];
check('get_ipv6_policy_status sgacl-counters', v6?.path === '/dataservice/device/roleBasedIpv6Counters', JSON.stringify(v6));
r = await tool(cv, 'get_ipv6_policy_object', { kind: 'prefix-list', info_tag: 'branch' });
check('get_ipv6_policy_object info_tag', r.value?.data?.[0]?.path === '/dataservice/template/policy/list/ipv6prefix/filtered' && r.value.data[0].query.infoTag === 'branch', JSON.stringify(r.value ?? r.error));
r = await tool(cv, 'get_ipv6_policy_object', { kind: 'acl', object_id: ACL6_ID, preview: true });
check('get_ipv6_policy_object preview saved', r.value?.data?.[0]?.path === `/dataservice/template/policy/definition/aclv6/preview/${ACL6_ID}`, JSON.stringify(r.value ?? r.error));
r = await tool(cv, 'get_ipv6_policy_object', { kind: 'acl', preview_body: { name: 'acl6', type: 'aclv6', sequences: [] } });
check('get_ipv6_policy_object preview_body works read-only', r.value?.preview === 'ipv6 access-list acl6-test' && stats.v6Previews.at(-1)?.path === '/dataservice/template/policy/definition/aclv6/preview' && stats.v6Writes.length === 0, JSON.stringify(r.value ?? r.error));
r = await tool(cv, 'get_ipv6_tracker', { profile: 'Branch-Transport', tracker_type: 'group', vpn_feature_id: VPN, interface_type: 'cellular', interface_feature_id: IFACE });
check(
  'get_ipv6_tracker on a WAN interface',
  r.value?.data?.[0]?.path === `${trackerBase}/wan/vpn/${VPN}/interface/cellular/${IFACE}/ipv6-trackergroup`,
  JSON.stringify(r.value ?? r.error)
);
r = await tool(cv, 'get_ipv6_tracker', { schema_type: 'put' });
check('get_ipv6_tracker schema (no profile needed)', r.value?.data?.[0]?.path === '/dataservice/v1/feature-profile/sdwan/transport/ipv6-tracker/schema' && r.value.data[0].query.schemaType === 'put', JSON.stringify(r.value ?? r.error));

stats.v6Paths = [];
stats.v6Previews = [];
for (const view of ['nd', 'neighbors', 'fib', 'interface-stats', 'dhcpv6', 'nat64', 'omp-received', 'omp-advertised', 'cflowd-flows']) await tool(cv, 'get_ipv6_status', { device_id: 'Branch-1', view });
for (const view of ['acl-names', 'acl-associations', 'acl-counters', 'acl-policers', 'sgacl-counters', 'sgacl-permissions']) await tool(cv, 'get_ipv6_policy_status', { device_id: 'Branch-1', view });
for (const kind of ['prefix-list', 'data-prefix-list', 'acl', 'device-access']) {
  await tool(cv, 'get_ipv6_policy_object', { kind });
  await tool(cv, 'get_ipv6_policy_object', { kind, object_id: ACL6_ID });
  await tool(cv, 'get_ipv6_policy_object', { kind, object_id: ACL6_ID, preview: true });
  await tool(cv, 'get_ipv6_policy_object', { kind, preview_body: { name: 'x' } });
  if (kind.endsWith('prefix-list')) await tool(cv, 'get_ipv6_policy_object', { kind, info_tag: 'tag' });
}
for (const tracker_type of ['tracker', 'group']) {
  for (const schema_type of ['post', 'put']) await tool(cv, 'get_ipv6_tracker', { tracker_type, schema_type });
  for (const scope of [{}, { vpn_feature_id: VPN, interface_type: 'ethernet', interface_feature_id: IFACE }, { vpn_feature_id: VPN, interface_type: 'cellular', interface_feature_id: IFACE }]) {
    for (const one of [{}, { tracker_id: TRACKER }]) await tool(cv, 'get_ipv6_tracker', { profile: OSPF_PROFILE, tracker_type, ...scope, ...one });
  }
}
const specV6Gets = specV6Ops(['get']);
const v6Reached = new Set(stats.v6Paths.filter((path) => V6_RX.test(path)).map((path) => `GET ${template(path)}`));
const missingV6Reads = specV6Gets.filter((op) => !v6Reached.has(op));
check(`all ${specV6Gets.length} IPv6 read operations in the spec covered`, specV6Gets.length === 43 && missingV6Reads.length === 0, missingV6Reads.join(', '));
check('IPv6 tools only call read paths from the spec', [...v6Reached].every((op) => specV6Gets.includes(op)), [...v6Reached].filter((op) => !specV6Gets.includes(op)).join(', '));
const specV6Previews = specV6Ops(['post'], true);
const v6Previewed = new Set(stats.v6Previews.map((x) => `POST ${template(x.path)}`));
check(`all ${specV6Previews.length} IPv6 policy preview operations covered`, specV6Previews.length === 4 && specV6Previews.every((op) => v6Previewed.has(op)));

for (const [label, name, args, pattern] of [
  ['get_ipv6_status rejects a filter the view lacks', 'get_ipv6_status', { device_id: 'Branch-1', view: 'nd', vpn_id: '10' }, /vpn_id does not apply to view nd \(no filters\)/],
  ['get_ipv6_status rejects unknown view', 'get_ipv6_status', { device_id: 'Branch-1', view: '../omp' }, /view must be one of/],
  ['get_ipv6_policy_object rejects info_tag on definitions', 'get_ipv6_policy_object', { kind: 'acl', info_tag: 'x' }, /info_tag applies only to prefix lists/],
  ['get_ipv6_policy_object rejects bad info_tag', 'get_ipv6_policy_object', { kind: 'prefix-list', info_tag: '../x' }, /info_tag must be/],
  ['get_ipv6_policy_object preview needs object_id', 'get_ipv6_policy_object', { kind: 'acl', preview: true }, /preview needs object_id/],
  ['get_ipv6_tracker needs the whole interface scope', 'get_ipv6_tracker', { profile: OSPF_PROFILE, vpn_feature_id: VPN }, /must be given together/],
  ['get_ipv6_tracker rejects non-UUID tracker_id', 'get_ipv6_tracker', { profile: OSPF_PROFILE, tracker_id: '../x' }, /tracker_id must be/],
]) {
  stats.v6Paths = [];
  r = await tool(cv, name, args);
  check(label, pattern.test(r.error ?? '') && stats.v6Paths.length === 0, r.error ?? 'not rejected');
}
r = await tool(cv, 'create_ipv6_policy_object', { kind: 'prefix-list', body: { name: 'v6' }, confirm: true });
check('IPv6 writes disabled by default', /VMANAGE_ALLOW_WRITE=true/.test(r.error ?? '') && stats.v6Writes.length === 0, r.error ?? 'not rejected');
await cv.close();

const wv = await connect({ VMANAGE_ALLOW_WRITE: 'true' });
check('tool list with writes enabled', (await wv.listTools()).tools.length === 163);
const lastV6Write = () => stats.v6Writes.at(-1);
const PREFIX_LIST = { name: 'Branch-v6', description: 'test', entries: [{ ipv6Prefix: '2001:db8:10::/48' }] };
r = await tool(wv, 'create_ipv6_policy_object', { kind: 'prefix-list', body: PREFIX_LIST });
check('create_ipv6_policy_object needs confirm: true', /confirm: true/.test(r.error ?? '') && stats.v6Writes.length === 0, r.error ?? 'not rejected');
r = await tool(wv, 'create_ipv6_policy_object', { kind: 'prefix-list', body: PREFIX_LIST, confirm: true });
check(
  'create_ipv6_policy_object',
  !r.error && lastV6Write()?.method === 'POST' && lastV6Write().path === '/dataservice/template/policy/list/ipv6prefix' && JSON.stringify(lastV6Write().body) === JSON.stringify(PREFIX_LIST),
  JSON.stringify(r.value ?? r.error)
);
r = await tool(wv, 'update_ipv6_policy_object', { kind: 'acl', object_id: ACL6_ID, mode: 'multiple', body: { name: 'acl6' }, confirm: true });
check('update_ipv6_policy_object mode multiple', !r.error && lastV6Write()?.method === 'PUT' && lastV6Write().path === `/dataservice/template/policy/definition/aclv6/multiple/${ACL6_ID}`, JSON.stringify(lastV6Write() ?? r.error));
r = await tool(wv, 'update_ipv6_policy_object', { kind: 'device-access', mode: 'bulk', body: [{ name: 'a' }, { name: 'b' }], confirm: true });
check('update_ipv6_policy_object mode bulk', !r.error && lastV6Write()?.path === '/dataservice/template/policy/definition/deviceaccesspolicyv6/bulk' && lastV6Write().body.length === 2, JSON.stringify(lastV6Write() ?? r.error));
r = await tool(wv, 'delete_ipv6_policy_object', { kind: 'data-prefix-list', info_tag: 'lab', confirm: true });
check('delete_ipv6_policy_object by info_tag', !r.error && lastV6Write()?.method === 'DELETE' && lastV6Write().path === '/dataservice/template/policy/list/dataipv6prefix' && lastV6Write().query.infoTag === 'lab', JSON.stringify(lastV6Write() ?? r.error));
const TRACKER_BODY = { name: 'v6-tracker', description: 'test', data: { endpointApiUrl: { optionType: 'global', value: 'http://[2001:db8::1]/' } } };
r = await tool(wv, 'create_ipv6_tracker', { profile: 'Branch-Transport', body: TRACKER_BODY, confirm: true });
check('create_ipv6_tracker', r.value?.operationId === 'CreateIpv6TrackerProfileParcelForTransport' && lastV6Write()?.path === `${trackerBase}/ipv6-tracker`, JSON.stringify(r.value ?? r.error));
r = await tool(wv, 'associate_ipv6_tracker', { profile: OSPF_PROFILE, vpn_feature_id: VPN, interface_type: 'ethernet', interface_feature_id: IFACE, tracker_id: TRACKER, confirm: true });
check(
  'associate_ipv6_tracker',
  r.value?.operationId === 'CreateWanVpnInterfaceEthernetAndIpv6TrackerParcelAssociationForTransport' && lastV6Write()?.body?.parcelId === TRACKER,
  JSON.stringify(r.value ?? r.error)
);
for (const [label, name, args, pattern] of [
  ['update_ipv6_policy_object bulk only for definitions', 'update_ipv6_policy_object', { kind: 'prefix-list', mode: 'bulk', body: [{}], confirm: true }, /applies only to acl and device-access/],
  ['update_ipv6_policy_object requires object_id', 'update_ipv6_policy_object', { kind: 'acl', body: { name: 'x' }, confirm: true }, /object_id is required/],
  ['delete_ipv6_policy_object needs exactly one target', 'delete_ipv6_policy_object', { kind: 'prefix-list', confirm: true }, /exactly one of object_id or info_tag/],
  ['delete_ipv6_policy_object needs confirm: true', 'delete_ipv6_policy_object', { kind: 'acl', object_id: ACL6_ID }, /confirm: true/],
  ['create_ipv6_tracker rejects an interface scope', 'create_ipv6_tracker', { profile: OSPF_PROFILE, vpn_feature_id: VPN, interface_type: 'ethernet', interface_feature_id: IFACE, body: TRACKER_BODY, confirm: true }, /associate_ipv6_tracker/],
  ['associate_ipv6_tracker needs the interface scope', 'associate_ipv6_tracker', { profile: OSPF_PROFILE, tracker_id: TRACKER, confirm: true }, /are required/],
]) {
  stats.v6Writes = [];
  r = await tool(wv, name, args);
  check(label, pattern.test(r.error ?? '') && stats.v6Writes.length === 0, r.error ?? 'not rejected');
}

stats.v6Writes = [];
for (const kind of ['prefix-list', 'data-prefix-list', 'acl', 'device-access']) {
  const isList = kind.endsWith('prefix-list');
  await tool(wv, 'create_ipv6_policy_object', { kind, body: { name: 'x' }, confirm: true });
  await tool(wv, 'update_ipv6_policy_object', { kind, object_id: ACL6_ID, body: { name: 'x' }, confirm: true });
  await tool(wv, 'delete_ipv6_policy_object', { kind, object_id: ACL6_ID, confirm: true });
  if (isList) await tool(wv, 'delete_ipv6_policy_object', { kind, info_tag: 'tag', confirm: true });
  else {
    await tool(wv, 'update_ipv6_policy_object', { kind, object_id: ACL6_ID, mode: 'multiple', body: { name: 'x' }, confirm: true });
    await tool(wv, 'update_ipv6_policy_object', { kind, mode: 'bulk', body: [{ name: 'x' }], confirm: true });
  }
}
for (const tracker_type of ['tracker', 'group']) {
  const base = { profile: OSPF_PROFILE, tracker_type, confirm: true };
  await tool(wv, 'create_ipv6_tracker', { ...base, body: TRACKER_BODY });
  for (const interface_type of ['ethernet', 'cellular']) {
    await tool(wv, 'associate_ipv6_tracker', { ...base, vpn_feature_id: VPN, interface_type, interface_feature_id: IFACE, tracker_id: TRACKER });
  }
  for (const scope of [{}, { vpn_feature_id: VPN, interface_type: 'ethernet', interface_feature_id: IFACE }, { vpn_feature_id: VPN, interface_type: 'cellular', interface_feature_id: IFACE }]) {
    await tool(wv, 'update_ipv6_tracker', { ...base, ...scope, tracker_id: TRACKER, body: TRACKER_BODY });
    await tool(wv, 'delete_ipv6_tracker', { ...base, ...scope, tracker_id: TRACKER });
  }
}
const specV6Writes = specV6Ops(['post', 'put', 'delete']);
const v6Written = new Set(stats.v6Writes.map((x) => `${x.method} ${template(x.path)}`));
const missingV6Writes = specV6Writes.filter((op) => !v6Written.has(op));
check(`all ${specV6Writes.length} IPv6 write operations in the spec covered`, specV6Writes.length === 36 && missingV6Writes.length === 0, missingV6Writes.join(', '));
check('IPv6 write tools only call operations from the spec', [...v6Written].every((op) => specV6Writes.includes(op)), [...v6Written].filter((op) => !specV6Writes.includes(op)).join(', '));
await wv.close();

// UX 2.0 configuration, policy and topology groups: reads, read-only renders and writes.
const [CG, PG, TG] = [GROUPS['config-group'][0], GROUPS['policy-group'][0], GROUPS['topology-group'][0]];
const cg = await connect();
r = await tool(cg, 'get_group_variables', { group_type: 'policy', group: 'branch-pg', device: 'Branch-1', suggestions: true });
check(
  'get_group_variables policy group, one device',
  r.value?.path === `/dataservice/v1/policy-group/${PG.id}/device/variables` && r.value.query['device-id'] === 'u-11' && r.value.query.suggestions === 'true',
  JSON.stringify(r.value ?? r.error)
);
r = await tool(cg, 'get_group_variables', { group_type: 'config', group: 'Branch-CG', schema: true });
check('get_group_variables schema', r.value?.path === `/dataservice/v1/config-group/${CG.id}/device/variables/schema`, JSON.stringify(r.value ?? r.error));
r = await tool(cg, 'get_group_variables', { group_type: 'config', group: CG.id, fetch_body: { deviceIds: ['u-11'] } });
check(
  'get_group_variables fetch_body is read-only',
  !r.error && stats.grpPosts.at(-1)?.method === 'POST' && stats.grpPosts.at(-1).path === `/dataservice/v1/config-group/${CG.id}/device/variables`,
  JSON.stringify(r.value ?? r.error)
);
r = await tool(cg, 'get_group_rules', { group_type: 'topology', group: 'Hub-Spoke' });
check('get_group_rules topology preview', r.value?.path === `/dataservice/v1/topology-group/${TG.id}/rules/preview`, JSON.stringify(r.value ?? r.error));
r = await tool(cg, 'preview_group_device_config', { group_type: 'topology', group: 'Hub-Spoke', device: 'Branch-2' });
check('preview_group_device_config works read-only', !r.error && stats.grpPosts.at(-1)?.path === `/dataservice/v1/topology-group/${TG.id}/device/u-12/preview`, JSON.stringify(r.value ?? r.error));
// Previews hold the device's secrets: none may reach the assistant, in any view of either preview tool.
mock.preview = { existingConfig: RUNNING_CONFIG, newConfig: RENDERED_CONFIG };
const SECRETS = /PK-12345|Zs-Pass-1|public-ro|\$9\$/;
for (const [name, args] of [
  ['preview_config_group_device_config', { config_group: 'Branch-CG', device: 'Branch-1' }],
  ['preview_group_device_config', { group_type: 'policy', group: 'Branch-PG', device: 'Branch-1' }],
]) {
  for (const view of ['diff', 'review', 'both']) {
    r = await tool(cg, name, { ...args, view });
    const shown = JSON.stringify(r.value ?? '');
    check(`${name} (${view}) masks secrets`, !r.error && !SECRETS.test(shown) && /partner-key \*\*\*\*/.test(shown), r.error ?? shown.slice(0, 200));
  }
}
// Only the secret hash differs on the username line: the diff must still report it.
r = await tool(cg, 'preview_config_group_device_config', { config_group: 'Branch-CG', device: 'Branch-1' });
check('preview diff still reports a changed secret', ['added', 'removed'].every((k) => r.value?.[k]?.includes('username admin privilege 15 secret 9 ****')), JSON.stringify(r.value ?? r.error).slice(0, 300));
// The review view; the SIG settings go apart when a policy group has the configuration group's name, as the
// template-to-group conversion makes it. That policy group exists only for this server process.
GROUPS['policy-group'].push({ id: '23232323-2323-4232-8232-232323232323', name: 'Branch-CG', solution: 'sdwan' });
const rvClient = await connect();
r = await tool(rvClient, 'preview_config_group_device_config', { config_group: 'Branch-CG', device: 'Branch-1', view: 'review' });
await rvClient.close();
GROUPS['policy-group'].pop();
const rv = r.value ?? {};
check(
  'preview review sorts the changes, SIG apart',
  rv.policyGroup === 'Branch-CG' &&
    JSON.stringify(rv.dropped) === JSON.stringify(['router ospf 1 vrf 1 > default-information originate']) &&
    JSON.stringify(rv.changed) === JSON.stringify(['system > console-baud-rate 115200 -> 9600']) &&
    JSON.stringify(rv.added) === JSON.stringify(['sdwan > interface GigabitEthernet1']) &&
    rv.fromPolicyGroup?.includes('secure-internet-gateway > zscaler partner-key ****') &&
    rv.fromPolicyGroup?.includes('sdwan > interface Tunnel100001') &&
    JSON.stringify(rv.defaults) === JSON.stringify(['no acc-gyro enable']) &&
    JSON.stringify(rv.secretsChanged) === JSON.stringify(['username admin privilege 15 secret 9 **** (hash; may only be re-salted)']),
  JSON.stringify(r.value ?? r.error)
);
r = await tool(cg, 'preview_config_group_device_config', { config_group: 'Branch-CG', device: 'Branch-1', view: 'review' });
check('preview review without a policy group of that name: SIG settings count as dropped', !r.value?.policyGroup && r.value?.dropped?.includes('secure-internet-gateway'), JSON.stringify(r.value ?? r.error).slice(0, 300));
mock.preview = null;

// Template-to-group migration: plan the values, find the conversion's defects (own server process and mock data).
GROUPS['policy-group'].push({ id: MIG_PG_ID, name: 'Branch-CG', solution: 'sdwan' });
mock.migration = true;
const mig = await connect();
r = await tool(mig, 'plan_config_group_variables', { template: 'Branch-CG' });
const planned = r.value?.devices?.['Branch-2'];
check(
  'plan_config_group_variables maps template values onto the groups',
  planned?.values?.host_name === 'Branch-2' && planned.values.system_ip === '192.0.2.12' && planned.values.site_id === 200 &&
    planned.values.transport1_ip_ip_address === '198.51.100.12' && planned.values.transport1_ip_subnet_mask === '255.255.255.0' &&
    JSON.stringify(planned.values.vpn0_ip_host_ip_list) === JSON.stringify(['192.0.2.50', '192.0.2.51']) &&
    planned.values.pseudo_commit_timer === 300 && planned.report.secrets.includes('admin_password') &&
    // A placeholder, never a password (and the server's response redaction applies on top).
    ['${AAA_PASSWORD}', '***redacted***'].includes(planned.values.admin_password) &&
    r.value.policyGroup === 'Branch-CG' && planned.policyGroupValues?.zscaler_vpn_trackersrcip === '192.0.2.12' &&
    planned.report.invalid.length === 0 && JSON.stringify(planned.report.unused) === JSON.stringify(['old_setting']),
  JSON.stringify(r.value ?? r.error)
);
check(
  'plan_config_group_variables masks secret variables (SNMP community)',
  planned?.values?.snmp_community === '****' && planned.report.secrets.includes('snmp_community') && !JSON.stringify(r.value ?? '').includes('Comm-Secret-1'),
  JSON.stringify(planned?.values ?? r.error)
);
r = await tool(mig, 'find_config_group_conversion_defects', { config_group: 'Branch-CG' });
const byFeature = Object.fromEntries((r.value?.findings ?? []).map((f) => [f.feature, f]));
check(
  'find_config_group_conversion_defects finds services, NAT and SIG defects',
  r.value?.defects === 2 &&
    JSON.stringify(byFeature.Branch_Transport1?.defects) === JSON.stringify(['allowed-services', 'legacy-nat']) &&
    byFeature.Branch_Transport1.changes.includes('allowService.dhcp: missing -> true') &&
    byFeature.Branch_Transport1.changes.includes('nat: false -> true') &&
    byFeature.Branch_Transport1.fix?.body?.data?.allowService?.dhcp?.value === true &&
    JSON.stringify(byFeature.Branch_SIG?.defects) === JSON.stringify(['sig-template-values']) &&
    byFeature.Branch_SIG.changes.includes('interface[0].ikeGroup: default -> 14') &&
    byFeature.Branch_SIG.changes.includes('interface[0].ipsecCiphersuite: default -> aes256-gcm'),
  JSON.stringify(r.value ?? r.error)
);
await mig.close();

// deploy_template_migration: one device, step by step, every change through the write path.
const migrationEnv = { VMANAGE_ALLOW_WRITE: 'true', VMANAGE_MIGRATION_AAA_PASSWORD: 'Aaa-Secret-9' };
const mw = await connect(migrationEnv);
const grpBefore = stats.grpPosts.length;
r = await tool(mw, 'deploy_template_migration', { step: 'prepare', device: 'Branch-2', template: 'Branch-CG' });
check('migration: prepare needs confirm, and changes nothing without it', /changes state/.test(r.error ?? '') && stats.migrationWrites.length === 0, r.error ?? 'not refused');
mock.failAssociate = true;
r = await tool(mw, 'deploy_template_migration', { step: 'prepare', device: 'Branch-2', template: 'Branch-CG', confirm: true });
mock.failAssociate = false;
check(
  'migration: a prepare that fails partway says what it already did and how to undo it',
  /prepare failed: .*Done before the failure: detached device template Branch-CG.*re-attach its template/.test(r.error ?? ''),
  r.error ?? 'not refused'
);
stats.migrationWrites.length = 0;
mock.preview = (kind) => ({ existingConfig: MIGRATION_RUNNING, newConfig: MIGRATION_BASE });
r = await tool(mw, 'deploy_template_migration', { step: 'prepare', device: 'Branch-2', template: 'Branch-CG', confirm: true });
const groupWrites = stats.grpPosts.slice(grpBefore);
const cgVariables = groupWrites.find((w) => w.path === `/dataservice/v1/config-group/${CG_ID}/device/variables`);
check(
  'migration: prepare detaches, associates both groups, sets the values and returns the review',
  r.value?.step === 'prepared' && r.value.done?.length === 3 && r.value.policyGroup === 'Branch-CG' &&
    stats.migrationWrites[0]?.body?.devices?.[0]?.deviceId === 'u-12' &&
    groupWrites.some((w) => w.method === 'PUT' && w.path === `/dataservice/v1/config-group/${CG_ID}/device/associate`) &&
    groupWrites.some((w) => w.method === 'PUT' && w.path === `/dataservice/v1/policy-group/${MIG_PG_ID}/device/variables`) &&
    r.value.review?.summary?.dropped === 0 && r.value.review.fromPolicyGroup.includes('secure-internet-gateway > zscaler partner-key ****'),
  JSON.stringify(r.value ?? r.error).slice(0, 400)
);
check(
  'migration: the AAA password comes from the server environment and never reaches the assistant',
  cgVariables?.body?.devices?.[0]?.variables?.some((v) => v.name === 'admin_password' && v.value === 'Aaa-Secret-9') &&
    !JSON.stringify(r.value ?? '').includes('Aaa-Secret-9'),
  JSON.stringify(cgVariables?.body ?? null).slice(0, 200)
);
mock.preview = () => ({ existingConfig: MIGRATION_RUNNING + 'ntp server 192.0.2.99\n', newConfig: MIGRATION_BASE });
r = await tool(mw, 'deploy_template_migration', { step: 'deploy', device: 'Branch-2', sig_ready: true, confirm: true });
check('migration: a deploy that drops settings needs accept_review', /would drop 1 and change 0 settings: ntp server 192\.0\.2\.99/.test(r.error ?? ''), r.error ?? 'not refused');
mock.preview = () => ({ existingConfig: MIGRATION_RUNNING + 'username ops password 0 OldPw\n', newConfig: MIGRATION_BASE + 'username ops password 0 NewPw\n' });
r = await tool(mw, 'deploy_template_migration', { step: 'deploy', device: 'Branch-2', sig_ready: true, confirm: true });
check('migration: a deploy that changes a password needs accept_review', /and 1 secrets: username ops password 0 \*\*\*\*/.test(r.error ?? '') && !/OldPw|NewPw/.test(r.error ?? ''), r.error ?? 'not refused');
mock.preview = () => ({ existingConfig: MIGRATION_RUNNING, newConfig: MIGRATION_BASE });
r = await tool(mw, 'deploy_template_migration', { step: 'deploy', device: 'Branch-2', confirm: true });
check('migration: a SIG device is not deployed without sig_ready', /sig_ready/.test(r.error ?? ''), r.error ?? 'not refused');
r = await tool(mw, 'deploy_template_migration', { step: 'deploy', device: 'Branch-2', sig_ready: true, confirm: true, wait_seconds: 5 });
check(
  'migration: deploy pushes the configuration group and reports health',
  r.value?.step === 'deployed' && r.value.task?.status === 'done' && r.value.health?.healthy === true &&
    stats.grpPosts.at(-1)?.path === `/dataservice/v1/config-group/${CG_ID}/device/deploy`,
  JSON.stringify(r.value ?? r.error).slice(0, 300)
);
r = await tool(mw, 'deploy_template_migration', { step: 'deploy_policy_group', device: 'Branch-2', confirm: true });
check('migration: a policy group that loses SIG settings is not deployed', /does not configure 5 SIG settings/.test(r.error ?? ''), r.error ?? 'not refused');
mock.preview = (kind) => ({ existingConfig: MIGRATION_BASE, newConfig: kind === 'policy-group' ? MIGRATION_RUNNING : MIGRATION_BASE });
r = await tool(mw, 'deploy_template_migration', { step: 'deploy_policy_group', device: 'Branch-2', confirm: true, wait_seconds: 5 });
check(
  'migration: deploy_policy_group puts SIG back',
  r.value?.step === 'policy group deployed' && r.value.notConfiguredFromBefore?.length === 0 &&
    stats.grpPosts.at(-1)?.path === `/dataservice/v1/policy-group/${MIG_PG_ID}/device/deploy`,
  JSON.stringify(r.value ?? r.error).slice(0, 300)
);
r = await tool(mw, 'deploy_template_migration', { step: 'status', device: 'Branch-2' });
check('migration: status', r.value?.health?.healthy === true && r.value.health.bfdBefore === 2, JSON.stringify(r.value ?? r.error));
await mw.close();
// The state prepare saved survives a restart, masked and readable by the user only.
const stateFile = join(certDir, 'state', 'migration-u-12.json');
const lockFile = join(certDir, 'state', 'migration-u-12.lock');
const savedState = readFileSync(stateFile, 'utf8');
const mw2 = await connect(migrationEnv);
r = await tool(mw2, 'deploy_template_migration', { step: 'status', device: 'Branch-2' });
check(
  'migration: the state survives a server restart, masked, mode 600',
  r.value?.health?.bfdBefore === 2 && /partner-key \*\*\*\*/.test(savedState) && !/\$9\$|Aaa-Secret-9/.test(savedState) && (statSync(stateFile).mode & 0o077) === 0,
  JSON.stringify(r.value ?? r.error).slice(0, 200)
);
// One step at a time per device, across server processes: a live lock refuses, a dead holder's lock is taken over.
writeFileSync(lockFile, JSON.stringify({ pid: process.pid, since: Date.now(), step: 'deploy' }));
const deploysBefore = stats.grpPosts.filter((w) => w.path.endsWith('/device/deploy')).length;
r = await tool(mw2, 'deploy_template_migration', { step: 'deploy', device: 'Branch-2', sig_ready: true, confirm: true, wait_seconds: 5 });
check(
  'migration: a step running for the device in another process refuses a second one',
  /step "deploy" since .* is still running/.test(r.error ?? '') && stats.grpPosts.filter((w) => w.path.endsWith('/device/deploy')).length === deploysBefore,
  r.error ?? 'not refused'
);
writeFileSync(lockFile, JSON.stringify({ pid: 999999, since: Date.now(), step: 'deploy' }));
r = await tool(mw2, 'deploy_template_migration', { step: 'deploy', device: 'Branch-2', sig_ready: true, confirm: true, wait_seconds: 5 });
check('migration: the lock of a crashed process is taken over and released', r.value?.step === 'deployed' && !existsSync(lockFile), JSON.stringify(r.value ?? r.error).slice(0, 200));
await mw2.close();
// Without the snapshot, the SIG settings to keep cannot be checked: deploy_policy_group asks the person to.
rmSync(stateFile);
const mw3 = await connect(migrationEnv);
r = await tool(mw3, 'deploy_template_migration', { step: 'deploy_policy_group', device: 'Branch-2', config_group: 'Branch-CG', confirm: true });
check('migration: deploy_policy_group without a saved snapshot needs accept_review', /no saved snapshot/.test(r.error ?? ''), r.error ?? 'not refused');
r = await tool(mw3, 'deploy_template_migration', { step: 'status', device: 'Branch-2' });
check('migration: status without a baseline still reports health', r.value?.health?.bfdBefore === null && r.value.health.healthy === true && /no BFD baseline/.test(r.value.health.note ?? ''), JSON.stringify(r.value ?? r.error));
await mw3.close();
mock.preview = null;
mock.migration = false;
GROUPS['policy-group'].pop();
const { maskLine } = await import(new URL('../build/services/configReview.js', import.meta.url));
for (const [line, masked] of [
  ['ip ospf authentication-key 7 ABC', 'ip ospf authentication-key 7 ****'],
  ['ip ospf message-digest-key 1 md5 SECRETX', 'ip ospf message-digest-key 1 md5 ****'],
  ['snmp-server user u g v3 auth sha AUTHP priv aes 128 PRIVP', 'snmp-server user u g v3 auth sha **** priv aes 128 ****'],
  ['shared-secret ABC', 'shared-secret ****'],
  ['wpa-psk ascii 0 MYPSK', 'wpa-psk ascii 0 ****'],
  ['password 10 XYZ', 'password 10 ****'],
  ['crypto isakmp key MyPsk address 0.0.0.0', 'crypto isakmp key **** address 0.0.0.0'],
  ['pre-shared-key address 0.0.0.0 key MyPsk', 'pre-shared-key address 0.0.0.0 key ****'],
  ['snmp-server community public-ro RO', 'snmp-server community **** RO'],
  ['crypto key generate rsa modulus 2048', 'crypto key generate rsa modulus 2048'],
  ['set community 65000:100', 'set community 65000:100'],
  ['key chain KC', 'key chain KC'],
  [' key 1', ' key 1'],
  ['service password-encryption', 'service password-encryption'],
]) check(`maskLine: ${line}`, maskLine(line) === masked, maskLine(line));
const { reviewConfig } = await import(new URL('../build/services/configReview.js', import.meta.url));
for (const [label, running, rendered, expected] of [
  ['review reports a changed plaintext password', 'username a password 0 OldPw\n', 'username a password 0 NewPw\n', { secretsChanged: ['username a password 0 ****'] }],
  ['review reports a changed pre-shared key', 'crypto keyring KR\n pre-shared-key address 0.0.0.0 key OldPsk\n', 'crypto keyring KR\n pre-shared-key address 0.0.0.0 key NewPsk\n', { secretsChanged: ['crypto keyring KR > pre-shared-key address 0.0.0.0 key ****'] }],
  ['review: a community changing access is a change, not a secret', 'snmp-server community C RO\n', 'snmp-server community C RW\n', { changed: ['snmp-server community **** RO -> RW'] }],
  ['review pairs repeated settings one to one (1 -> 2)', 'ip name-server 8.8.8.8\n', 'ip name-server 1.1.1.1\nip name-server 9.9.9.9\n', { changed: ['ip name-server 8.8.8.8 -> 1.1.1.1'], added: ['ip name-server 9.9.9.9'] }],
  ['review pairs repeated settings one to one (2 -> 1)', 'ip name-server 8.8.8.8\nip name-server 8.8.4.4\n', 'ip name-server 1.1.1.1\n', { changed: ['ip name-server 8.8.8.8 -> 1.1.1.1'], dropped: ['ip name-server 8.8.4.4'] }],
]) {
  const got = reviewConfig(running, rendered);
  const want = { dropped: [], changed: [], secretsChanged: [], added: [], defaults: [], fromPolicyGroup: [], ...expected };
  check(label, JSON.stringify(got) === JSON.stringify(want), JSON.stringify(got));
}
for (const [label, name, args, pattern] of [
  ['get_group_variables refuses topology groups', 'get_group_variables', { group_type: 'topology', group: 'Hub-Spoke' }, /group_type must be one of: config, policy/],
  ['unknown group lists the available ones', 'get_group_rules', { group_type: 'config', group: 'nope' }, /No config-group "nope"\. Available: Branch-CG/],
  ['preview_group_device_config refuses config groups', 'preview_group_device_config', { group_type: 'config', group: 'Branch-CG', device: 'Branch-1' }, /group_type must be one of: policy, topology/],
]) {
  r = await tool(cg, name, args);
  check(label, pattern.test(r.error ?? ''), r.error ?? 'not rejected');
}
const postsBefore = stats.grpPosts.length;
r = await tool(cg, 'deploy_group', { group_type: 'config', group: 'Branch-CG', devices: ['Branch-1'], confirm: true });
check('deploy_group disabled by default', /VMANAGE_ALLOW_WRITE=true/.test(r.error ?? '') && stats.grpPosts.length === postsBefore, r.error ?? 'not rejected');
await cg.close();

const wg = await connect({ VMANAGE_ALLOW_WRITE: 'true' });
const lastGroupWrite = () => stats.grpPosts.at(-1);
r = await tool(wg, 'list_config_groups');
r = await tool(wg, 'create_group', { group_type: 'config', body: { name: 'Lab-CG', description: 'test', solution: 'sdwan', profiles: [] } });
check('create_group needs confirm: true', /confirm: true/.test(r.error ?? ''), r.error ?? 'not rejected');
r = await tool(wg, 'create_group', { group_type: 'config', body: { name: 'Lab-CG', description: 'test', solution: 'sdwan', profiles: [] }, confirm: true });
check('create_group', r.value?.operationId === 'CreateConfigGroup' && lastGroupWrite()?.path === '/dataservice/v1/config-group' && lastGroupWrite().body.name === 'Lab-CG', JSON.stringify(r.value ?? r.error));
r = await tool(wg, 'get_config_group', { config_group: 'Lab-CG' });
check('a group created by a tool is found by name right away (cache invalidated)', !r.error, r.error ?? '');
r = await tool(wg, 'update_group', { group_type: 'topology', group: 'Hub-Spoke', body: { name: 'Hub-Spoke', profiles: [] }, confirm: true });
check('update_group', r.value?.operationId === 'EditTopologyGroup' && lastGroupWrite()?.method === 'PUT', JSON.stringify(r.value ?? r.error));
r = await tool(wg, 'associate_group_devices', { group_type: 'policy', group: 'Branch-PG', devices: ['Branch-1', '192.0.2.12', 'branch-1'], confirm: true });
check(
  'associate_group_devices add (resolved to UUIDs, de-duplicated)',
  r.value?.operationId === 'CreatePolicyGroupAssociation' && JSON.stringify(lastGroupWrite()?.body) === JSON.stringify({ devices: [{ id: 'u-11' }, { id: 'u-12' }] }),
  JSON.stringify(lastGroupWrite() ?? r.error)
);
r = await tool(wg, 'associate_group_devices', { group_type: 'config', group: 'Branch-CG', devices: ['Branch-2'], mode: 'remove', confirm: true });
check('associate_group_devices remove', r.value?.operationId === 'DeleteConfigGroupAssociation' && lastGroupWrite()?.method === 'DELETE', JSON.stringify(r.value ?? r.error));
r = await tool(wg, 'update_group_variables', { group_type: 'config', group: 'Branch-CG', body: { solution: 'sdwan', devices: [] }, confirm: true });
check('update_group_variables', r.value?.operationId === 'createConfigGroupDeviceVariables' && lastGroupWrite()?.method === 'PUT', JSON.stringify(r.value ?? r.error));
r = await tool(wg, 'deploy_group', { group_type: 'config', group: 'Branch-CG', devices: ['Branch-1'], confirm: true });
check(
  'deploy_group',
  r.value?.operationId === 'deployConfigGroup' && lastGroupWrite()?.path === `/dataservice/v1/config-group/${CG.id}/device/deploy` && lastGroupWrite().body.devices[0].id === 'u-11',
  JSON.stringify(r.value ?? r.error)
);
r = await tool(wg, 'delete_group', { group_type: 'policy', group: 'Branch-PG', delete_profiles: true, confirm: true });
check('delete_group with delete_profiles', r.value?.operationId === 'DeletePolicyGroup' && lastGroupWrite()?.query?.deleteProfiles === 'true', JSON.stringify(lastGroupWrite() ?? r.error));
for (const [label, name, args, pattern] of [
  ['deploy_group needs confirm: true', 'deploy_group', { group_type: 'config', group: 'Branch-CG', devices: ['Branch-1'] }, /confirm: true/],
  ['deploy_group rejects unknown devices', 'deploy_group', { group_type: 'config', group: 'Branch-CG', devices: ['no-such-edge'], confirm: true }, /Unknown device/],
  ['deploy_group requires devices', 'deploy_group', { group_type: 'topology', group: 'Hub-Spoke', devices: [], confirm: true }, /devices must be a non-empty list/],
  ['delete_group: delete_profiles not for topology groups', 'delete_group', { group_type: 'topology', group: 'Hub-Spoke', delete_profiles: true, confirm: true }, /delete_profiles applies only/],
  ['associate_group_devices refuses topology groups', 'associate_group_devices', { group_type: 'topology', group: 'Hub-Spoke', devices: ['Branch-1'], confirm: true }, /group_type must be one of: config, policy/],
  ['create_group requires an object body', 'create_group', { group_type: 'policy', body: 'x', confirm: true }, /body must be an object/],
]) {
  const before = stats.grpPosts.length;
  r = await tool(wg, name, args);
  check(label, pattern.test(r.error ?? '') && stats.grpPosts.length === before, r.error ?? 'not rejected');
}

// Every configuration, policy and topology group operation in the spec is reachable through a dedicated tool.
const specGroups = Object.entries(spec.paths)
  .filter(([path]) => /^\/v1\/(config-group|policy-group|topology-group)/.test(path))
  .flatMap(([path, ops]) => ['get', 'post', 'put', 'delete'].filter((m) => ops[m]).map((m) => `${m.toUpperCase()} ${template(path)}`));
stats.grpPaths = [];
stats.grpPosts = [];
for (const [type, group] of [['config', 'Branch-CG'], ['policy', 'Lab-CG'], ['topology', 'Hub-Spoke']]) {
  const groupName = type === 'policy' ? GROUPS['policy-group'][0].name : group;
  const scope = { group_type: type, group: groupName, confirm: true };
  await tool(wg, `list_${type}_groups`);
  if (type === 'topology') await tool(wg, 'get_topology_group', { topology_group: groupName });
  else await tool(wg, `get_${type}_group`, { [`${type}_group`]: groupName });
  await tool(wg, 'get_group_rules', scope);
  await tool(wg, 'create_group', { group_type: type, body: { name: `${type}-new` }, confirm: true });
  await tool(wg, 'update_group', { ...scope, body: { name: groupName } });
  await tool(wg, 'deploy_group', { ...scope, devices: ['Branch-1'] });
  if (type === 'config') await tool(wg, 'preview_config_group_device_config', { config_group: groupName, device: 'Branch-1' });
  else await tool(wg, 'preview_group_device_config', { group_type: type, group: groupName, device: 'Branch-1' });
  if (type !== 'topology') {
    for (const view of [{}, { schema: true }, { fetch_body: { deviceIds: [] } }]) await tool(wg, 'get_group_variables', { group_type: type, group: groupName, ...view });
    await tool(wg, 'update_group_variables', { ...scope, body: { devices: [] } });
    for (const mode of ['add', 'replace', 'remove']) await tool(wg, 'associate_group_devices', { ...scope, devices: ['Branch-1'], mode });
  }
  await tool(wg, 'delete_group', scope);
}
// The mock's device IDs (u-11) are not UUIDs, so they are normalized here.
const groupTemplate = (path) => template(path.replace(/\/device\/[^/]+\/preview$/, '/device/{id}/preview'));
const groupReached = new Set([
  ...stats.grpPaths.map((path) => `GET ${groupTemplate(path)}`),
  ...stats.grpPosts.map((x) => `${x.method} ${groupTemplate(x.path)}`),
]);
const missingGroupOps = specGroups.filter((op) => !groupReached.has(op));
check(`all ${specGroups.length} configuration/policy/topology group operations in the spec covered`, specGroups.length === 40 && missingGroupOps.length === 0, missingGroupOps.join(', '));
check('group tools only call operations from the spec', [...groupReached].every((op) => specGroups.includes(op)), [...groupReached].filter((op) => !specGroups.includes(op)).join(', '));
await wg.close();

// UX 2.0 network hierarchy: node lookup, levels, Cyber Vision network settings.
const ch = await connect();
r = await tool(ch, 'get_network_hierarchy');
const nhRows = r.value?.data ?? r.value;
check('get_network_hierarchy (whole tree)', Array.isArray(nhRows) && nhRows.length === 6, JSON.stringify(r.value ?? r.error).slice(0, 200));
r = await tool(ch, 'get_network_hierarchy', { label: 'site' });
check('get_network_hierarchy label filter', (r.value?.data ?? r.value)?.map((n) => n.name).join() === 'Paris,Lab,Lab', JSON.stringify(r.value ?? r.error).slice(0, 200));
r = await tool(ch, 'get_network_hierarchy', { node: 'france' });
check(
  'get_network_hierarchy node by name: parent and children',
  r.value?.id === NH.area && r.value.parent?.name === 'EMEA' && r.value.children?.map((c) => c.name).join() === 'Paris,Lab',
  JSON.stringify(r.value ?? r.error)
);
r = await tool(ch, 'get_network_hierarchy', { node: '105' });
check('get_network_hierarchy node by site ID', r.value?.id === NH.siteA && r.value.hierarchyPath === 'Global/EMEA/France/Paris', JSON.stringify(r.value ?? r.error));
r = await tool(ch, 'get_network_hierarchy', { node: 'Global/Lab' });
check('get_network_hierarchy node by hierarchy path', r.value?.id === NH.siteC && r.value.parent?.name === 'Global', JSON.stringify(r.value ?? r.error));
r = await tool(ch, 'get_hierarchy_cybervision', {});
check('get_hierarchy_cybervision defaults to the Global node', !r.error && stats.nhPaths.at(-1).path === `/dataservice/v1/network-hierarchy/${NH.global}/network-settings/cybervisioncenters`, JSON.stringify(r.value ?? r.error));
r = await tool(ch, 'get_hierarchy_cybervision', { node: 'Paris' });
check('get_hierarchy_cybervision', (r.value?.data ?? r.value)?.[0]?.name === 'CV-Paris' && stats.nhPaths.at(-1).path === `/dataservice/v1/network-hierarchy/${NH.siteA}/network-settings/cybervisioncenters`, JSON.stringify(r.value ?? r.error));
r = await tool(ch, 'get_hierarchy_cybervision', { node: 'Paris', center_name: 'CV-Paris' });
check('get_hierarchy_cybervision center ID by name', stats.nhPaths.at(-1).query.cvName === 'CV-Paris' && JSON.stringify(r.value).includes('cv-42'), JSON.stringify(r.value ?? r.error));
for (const [label, name, args, pattern] of [
  ['ambiguous node name lists the paths', 'get_network_hierarchy', { node: 'Lab' }, /matches several nodes: Global\/EMEA\/France\/Lab, Global\/Lab/],
  ['unknown node lists the available ones', 'get_hierarchy_cybervision', { node: 'Mars' }, /No network hierarchy node "Mars"/],
  ['get_network_hierarchy rejects unknown label', 'get_network_hierarchy', { label: 'continent' }, /label must be one of/],
]) {
  r = await tool(ch, name, args);
  check(label, pattern.test(r.error ?? ''), r.error ?? 'not rejected');
}
r = await tool(ch, 'create_hierarchy_cybervision', { node: 'Paris', body: { name: 'CV-2' }, confirm: true });
check('hierarchy writes disabled by default', /VMANAGE_ALLOW_WRITE=true/.test(r.error ?? '') && stats.nhWrites.length === 0, r.error ?? 'not rejected');
await ch.close();

const wh = await connect({ VMANAGE_ALLOW_WRITE: 'true' });
const lastNhWrite = () => stats.nhWrites.at(-1);
r = await tool(wh, 'create_hierarchy_cybervision', { node: 'Paris', body: { name: 'CV-2', address: '198.51.100.20' } });
check('create_hierarchy_cybervision needs confirm: true', /confirm: true/.test(r.error ?? '') && stats.nhWrites.length === 0, r.error ?? 'not rejected');
r = await tool(wh, 'create_hierarchy_cybervision', { node: 'Paris', body: { name: 'CV-2', address: '198.51.100.20' }, confirm: true });
check(
  'create_hierarchy_cybervision',
  r.value?.operationId === 'createCybervisionCenterForNetworkHierarchyNode' && lastNhWrite()?.path === `/dataservice/v1/network-hierarchy/${NH.siteA}/network-settings/cybervisioncenters` && lastNhWrite().body.name === 'CV-2',
  JSON.stringify(r.value ?? r.error)
);
r = await tool(wh, 'delete_hierarchy_cybervision', { node: '105', center_name: 'CV-Paris', confirm: true });
check(
  'delete_hierarchy_cybervision by name (ID looked up)',
  r.value?.operationId === 'deleteCybervisionCenterForNetworkHierarchyNode' && lastNhWrite()?.method === 'DELETE' && lastNhWrite().path.endsWith('/cybervisioncenters/cv-42'),
  JSON.stringify(lastNhWrite() ?? r.error)
);
for (const [label, name, args, pattern] of [
  ['delete_hierarchy_cybervision needs center_id or center_name', 'delete_hierarchy_cybervision', { node: 'Paris', confirm: true }, /Give center_id or center_name/],
  ['delete_hierarchy_cybervision unknown center name', 'delete_hierarchy_cybervision', { node: 'Paris', center_name: 'nope', confirm: true }, /No Cyber Vision center named "nope"/],
  ['delete_hierarchy_cybervision rejects a path-like ID', 'delete_hierarchy_cybervision', { node: 'Paris', center_id: '../../x', confirm: true }, /center_id must be/],
  ['delete_hierarchy_cybervision needs confirm: true', 'delete_hierarchy_cybervision', { node: 'Paris', center_id: 'cv-42' }, /confirm: true/],
]) {
  const before = stats.nhWrites.length;
  r = await tool(wh, name, args);
  check(label, pattern.test(r.error ?? '') && stats.nhWrites.length === before, r.error ?? 'not rejected');
}
const specNh = Object.entries(spec.paths)
  .filter(([path]) => /network-hierarchy/.test(path))
  .flatMap(([path, ops]) => ['get', 'post', 'put', 'delete'].filter((m) => ops[m]).map((m) => `${m.toUpperCase()} ${path.replace(/\{[^}]+\}/g, '{id}')}`));
const nhTemplate = (path) => path.replace(/^\/dataservice/, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '{id}').replace(/\/cybervisioncenters\/cv-\d+$/, '/cybervisioncenters/{id}');
const nhReached = new Set([...stats.nhPaths.map((x) => `GET ${nhTemplate(x.path)}`), ...stats.nhWrites.map((x) => `${x.method} ${nhTemplate(x.path)}`)]);
const missingNh = specNh.filter((op) => !nhReached.has(op));
check(`all ${specNh.length} network hierarchy operations in the spec covered`, specNh.length === 4 && missingNh.length === 0, missingNh.join(', '));
await wh.close();

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
