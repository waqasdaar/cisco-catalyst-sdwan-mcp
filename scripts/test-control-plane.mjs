// End-to-end check of the OMP / control-plane / validator tools over MCP stdio.
// Usage: npm run test:control-plane -- <edge> <controller> <validator>   (hostname or system IP)
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const [edge, controller, validator] = process.argv.slice(2);
if (!edge || !controller || !validator) {
  console.error('Usage: npm run test:control-plane -- <edge> <controller> <validator>');
  process.exit(1);
}

const cases = [
  ['get_control_connections', { device_id: edge }],
  ['get_control_connections', { device_id: edge, synced: true }],
  ['get_control_connections_history', { device_id: edge }],
  ['get_control_summary', { device_id: edge }],
  ['get_control_statistics', { device_id: edge }],
  ['get_control_local_properties', { device_id: edge }],
  ['get_control_local_properties', { device_id: edge, synced: true }],
  ['get_control_wan_interfaces', { device_id: edge }],
  ['get_control_valid_devices', { device_id: controller }],
  ['get_control_valid_devices', { device_id: controller, list: 'vsmarts' }],
  ['get_control_affinity', { device_id: edge, type: 'config' }],
  ['get_control_affinity', { device_id: edge }],
  ['get_control_links', { state: 'up' }],
  ['get_control_status', {}],
  ['get_control_count', {}],
  ['get_control_count', { device_id: edge }],
  ['get_control_network_summary', { state: 'up' }],
  ['get_network_connections_summary', {}],
  ['get_omp_peers', { device_id: edge }],
  ['get_omp_peers', { device_id: controller, synced: true }],
  ['get_omp_summary', { device_id: edge }],
  ['get_omp_routes', { device_id: edge }],
  ['get_omp_routes', { device_id: edge, direction: 'advertised' }],
  ['get_omp_routes', { device_id: edge, vpn_id: '10' }],
  ['get_omp_tlocs', { device_id: edge }],
  ['get_omp_tlocs', { device_id: edge, direction: 'advertised' }],
  ['get_omp_services', { device_id: edge }],
  ['get_omp_multicast', { device_id: edge }],
  ['get_omp_multicast', { device_id: edge, type: 'autodiscover', direction: 'advertised' }],
  ['get_omp_cloudx', { device_id: edge }],
  ['get_omp_links', { state: 'up' }],
  ['get_omp_status', {}],
  ['get_validator_connections', { device_id: validator }],
  ['get_validator_connections', { device_id: validator, history: true }],
  ['get_validator_summary', { device_id: validator }],
  ['get_validator_statistics', { device_id: validator }],
  ['get_validator_local_properties', { device_id: validator }],
  ['get_validator_valid_devices', { device_id: validator }],
  ['get_validator_proxy_mapping', { device_id: validator }],
];

// These must be rejected before any vManage call.
const negativeCases = [
  ['get_omp_routes', { device_id: edge, direction: '../../admin/user' }],
  ['get_control_valid_devices', { device_id: controller, list: 'constructor' }],
  ['get_omp_peers', {}],
];

const transport = new StdioClientTransport({ command: 'node', args: ['build/index.js'], stderr: 'ignore' });
const client = new Client({ name: 'control-plane-test', version: '1.0.0' });
await client.connect(transport);

const { tools } = await client.listTools();
console.log(`Server exposes ${tools.length} tools\n`);

let failures = 0;
for (const [name, args] of cases) {
  const res = await client.callTool({ name, arguments: args });
  const text = res.content?.[0]?.text ?? '';
  let detail;
  if (res.isError) {
    detail = text.slice(0, 120);
    failures++;
  } else {
    const data = JSON.parse(text).data;
    detail = Array.isArray(data) ? `${data.length} rows` : typeof data;
  }
  console.log(`${res.isError ? 'FAIL' : 'PASS'}  ${name.padEnd(34)} ${JSON.stringify(args).padEnd(58)} ${detail}`);
}

console.log('\nInput validation (expected to be rejected):');
for (const [name, args] of negativeCases) {
  const res = await client.callTool({ name, arguments: args });
  if (!res.isError) failures++;
  console.log(`${res.isError ? 'PASS' : 'FAIL'}  ${name.padEnd(34)} ${JSON.stringify(args).padEnd(58)} ${res.content?.[0]?.text ?? ''}`);
}

await client.close();
console.log(`\n${failures === 0 ? 'All checks passed' : `${failures} check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
