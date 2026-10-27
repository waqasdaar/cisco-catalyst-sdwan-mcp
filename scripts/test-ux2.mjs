// UX 2.0 + robustness regression test over MCP stdio, with timings.
// Usage: npm run test:ux2 -- <edge-hostname>
import { fileURLToPath } from 'url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const [EDGE] = process.argv.slice(2);
if (!EDGE) {
  console.error('Usage: npm run test:ux2 -- <edge-hostname>');
  process.exit(1);
}
const PROJECT_DIR = fileURLToPath(new URL('..', import.meta.url));

const client = new Client({ name: 'ux2-test', version: '1.0.0' });
await client.connect(new StdioClientTransport({ command: 'node', args: ['build/index.js'], cwd: PROJECT_DIR, stderr: 'ignore' }));

let failures = 0;
async function call(name, args, { expectError = false, check } = {}) {
  const started = Date.now();
  const res = await client.callTool({ name, arguments: args }, undefined, { timeout: 180_000 });
  const ms = Date.now() - started;
  const text = res.content?.[0]?.text ?? '';
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = undefined;
  }
  let ok = expectError ? !!res.isError : !res.isError && parsed !== undefined;
  let detail = res.isError ? text.replace(/^Error:\s*/, '').slice(0, 140) : summarize(parsed);
  if (ok && check) {
    const problem = check(parsed);
    if (problem) {
      ok = false;
      detail = problem;
    }
  }
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${String(ms).padStart(6)} ms  ${name.padEnd(34)} ${JSON.stringify(args).slice(0, 60).padEnd(60)} ${detail}`);
  return parsed;
}

function summarize(v) {
  if (Array.isArray(v)) return `${v.length} items`;
  if (v && Array.isArray(v.data)) return `${v.data.length} rows`;
  if (v && typeof v === 'object') return Object.keys(v).slice(0, 6).join(',');
  return String(v).slice(0, 60);
}

const { tools } = await client.listTools();
console.log(`Server exposes ${tools.length} tools\n`);

console.log('UX 2.0:');
const overview = await call('get_ux2_overview', {}, { check: (v) => (Array.isArray(v?.configGroups) ? null : 'missing configGroups') });
const cg = overview?.configGroups?.find((g) => g.devices > 0) ?? overview?.configGroups?.[0];
const pg = overview?.policyGroups?.[0];
const tg = overview?.topologyGroups?.[0];
await call('list_config_groups', {});
if (cg) {
  const detail = await call('get_config_group', { config_group: cg.name }, { check: (v) => (v?.id === cg.id ? null : 'wrong group') });
  await call('get_config_group', { config_group: cg.id });
  await call('get_config_group_device_variables', { config_group: cg.name });
  const member = Array.isArray(detail?.associatedDevices) ? detail.associatedDevices[0] : undefined;
  if (member) {
    await call(
      'preview_config_group_device_config',
      { config_group: cg.name, device: member['host-name'] ?? member.id },
      { check: (v) => (v?.summary && typeof v.inSync === 'boolean' ? null : 'missing diff summary') }
    );
  }
}
await call('list_policy_groups', {});
if (pg) await call('get_policy_group', { policy_group: pg.name });
await call('list_topology_groups', {});
if (tg) await call('get_topology_group', { topology_group: tg.name });
const profiles = await call('list_feature_profiles', {});
await call('list_feature_profiles', { profile_type: 'system' });
for (const type of ['system', 'transport', 'service']) {
  const first = Array.isArray(profiles?.[type]) ? profiles[type][0] : undefined;
  if (first) await call('get_feature_profile', { profile_type: type, profile: first.profileName });
}
await call('get_network_hierarchy', {});

console.log('\nDevice resolution (hostname instead of system IP):');
await call('get_omp_routes', { device_id: EDGE, vpn_id: '10' }, { check: (v) => (v?.data?.length ? null : 'no routes') });
await call('get_omp_routes', { device_id: EDGE.toLowerCase(), direction: 'advertised' });
await call('get_device_details', { device_id: EDGE }, { check: (v) => (v?.['host-name'] === EDGE ? null : 'wrong device') });
await call('get_bfd_sessions', { device_id: EDGE });

console.log('\nConcurrency (6 parallel calls):');
const t0 = Date.now();
await Promise.all([
  call('get_omp_summary', { device_id: EDGE }),
  call('get_control_connections', { device_id: EDGE }),
  call('get_bfd_summary', { device_id: EDGE }),
  call('list_config_groups', {}),
  call('list_policy_groups', {}),
  call('get_omp_peers', { device_id: EDGE }),
]);
console.log(`      6 parallel calls finished in ${Date.now() - t0} ms`);

console.log('\nCached (synced) data and response shaping:');
for (const name of ['get_bfd_sessions', 'get_device_interfaces', 'get_system_status']) {
  await call(name, { device_id: EDGE, synced: true }, { check: (v) => (Array.isArray(v?.data) ? null : 'no data rows') });
}
const allDevices = await call('list_devices', {});
await call(
  'list_devices',
  { fields: ['host-name', 'system-ip'] },
  {
    check: (v) =>
      v?.data?.length === allDevices?.data?.length && v.data.every((r) => Object.keys(r).every((k) => k === 'host-name' || k === 'system-ip'))
        ? null
        : 'fields not applied',
  }
);
await call(
  'list_devices',
  { filter: { 'host-name': EDGE.toLowerCase() } },
  { check: (v) => (v?.data?.length === 1 && v.selection?.matched === 1 ? null : 'filter not applied') }
);
await call(
  'list_config_groups',
  { fields: ['name'], filter: { name: [cg?.name ?? '', 'no-such-group'] } },
  { check: (v) => (Array.isArray(v) && v.length === (cg ? 1 : 0) && (!cg || Object.keys(v[0]).join() === 'name') ? null : 'array selection failed') }
);
await call('list_api_categories', { filter: 'Monitoring' }, { check: (v) => (v && !v.selection ? null : 'catalog filter changed') });

console.log('\nValidation (expected errors):');
await call('list_devices', { fields: 'host-name' }, { expectError: true });
await call('list_devices', { filter: ['up'] }, { expectError: true });
await call('get_omp_routes', { device_id: 'no-such-device' }, { expectError: true });
await call('get_config_group', { config_group: 'no-such-group' }, { expectError: true });
await call('get_feature_profile', { profile_type: 'bogus', profile: 'x' }, { expectError: true });
await call('list_feature_profiles', { solution: 'bogus' }, { expectError: true });

await client.close();
console.log(`\n${failures === 0 ? 'All checks passed' : `${failures} check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
