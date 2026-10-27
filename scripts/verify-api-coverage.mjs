// Verifies vManage API coverage of this MCP server against the connected vManage
// and writes API_COVERAGE.md + api_coverage.csv.
// Usage: npm run verify:api -- <edge> <controller> <validator>   (hostname or system IP)
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { VManageApiService } from '../build/services/vmanageApi.js';
import { ApiCatalog } from '../build/services/apiCatalog.js';
import { loadConfig } from '../build/utils/config.js';

process.loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url)));
const PROJECT_DIR = fileURLToPath(new URL('..', import.meta.url));

const [EDGE, CONTROLLER, VALIDATOR] = process.argv.slice(2);
if (!EDGE || !CONTROLLER || !VALIDATOR) {
  console.error('Usage: npm run verify:api -- <edge> <controller> <validator>');
  process.exit(1);
}
const CONCURRENCY = 6;
const CALL_TIMEOUT_MS = 90_000;
// Common vManage statistics query: documents from the last hour.
const DOCCOUNT_BODY = {
  query: { condition: 'AND', rules: [{ value: ['1'], field: 'entry_time', type: 'date', operator: 'last_n_hours' }] },
};

const catalog = new ApiCatalog(new VManageApiService(loadConfig()), false);
await catalog.load();
const operations = catalog.allOperations();

const client = new Client({ name: 'api-coverage', version: '1.0.0' });
await client.connect(new StdioClientTransport({ command: 'node', args: ['build/index.js'], cwd: PROJECT_DIR, stderr: 'ignore' }));
const { tools } = await client.listTools();

async function callTool(name, args) {
  try {
    const res = await client.callTool({ name, arguments: args }, undefined, { timeout: CALL_TIMEOUT_MS });
    const text = res.content?.[0]?.text ?? '';
    if (res.isError) {
      const status = text.match(/vManage API error (\d+)/)?.[1];
      const message = text.replace(/^Error:\s*/, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      return { ok: false, status: status ? `HTTP ${status}` : 'rejected', detail: message.slice(0, 140) };
    }
    let rows = '';
    try {
      const body = JSON.parse(text);
      const data = body?.data ?? body;
      rows = Array.isArray(data) ? `${body?.truncated?.total ?? data.length} rows` : typeof data === 'object' ? 'object' : String(data).slice(0, 20);
    } catch {
      rows = 'text';
    }
    return { ok: true, status: 'OK', detail: rows };
  } catch (err) {
    return { ok: false, status: /timed out/i.test(String(err)) ? 'timeout' : 'error', detail: String(err.message ?? err).slice(0, 140) };
  }
}

function deviceFor(path) {
  if (path.startsWith('/device/orchestrator')) return [VALIDATOR];
  if (/^\/device\/control\/valid|vsmart/i.test(path)) return [CONTROLLER, EDGE];
  return [EDGE, CONTROLLER];
}

/** Builds a live test call for an operation, or returns why it is not live-tested. */
function plan(op) {
  if (op.access === 'blocked') return { skip: 'Blocked', note: op.accessReason };
  if (op.access === 'write') return { skip: 'Write (not executed)', note: 'Enabled with VMANAGE_ALLOW_WRITE=true + confirm' };
  const params = op.spec.parameters ?? [];
  if (params.some((p) => p.in === 'path')) return { skip: 'Read (needs IDs)', note: `path: ${params.filter((p) => p.in === 'path').map((p) => p.name).join(', ')}` };
  if (/\/csv$/.test(op.path)) return { skip: 'Read (needs input)', note: 'bulk CSV export' };

  const query = {};
  let devices = [undefined];
  for (const p of params.filter((x) => x.in === 'query' && x.required)) {
    if (p.name === 'deviceId') devices = deviceFor(op.path);
    else if (p.schema?.enum?.length) query[p.name] = p.schema.enum.includes('all') ? 'all' : p.schema.enum[0];
    else if (p.schema?.default !== undefined) query[p.name] = p.schema.default;
    else return { skip: 'Read (needs input)', note: `query: ${p.name}` };
  }

  let body;
  if (op.method === 'POST') {
    if (!/\/doccount$/.test(op.path)) return { skip: 'Read (needs input)', note: 'query body' };
    body = DOCCOUNT_BODY;
  } else if (op.spec.requestBody?.required) {
    return { skip: 'Read (needs input)', note: 'request body' };
  }
  return { devices, query, body };
}

const results = new Map();
const queue = [];
for (const op of operations) {
  const p = plan(op);
  if (p.skip) results.set(op.operationId, { result: p.skip, detail: p.note });
  else queue.push([op, p]);
}

let done = 0;
async function worker() {
  while (queue.length) {
    const [op, p] = queue.shift();
    let outcome;
    for (const device of p.devices) {
      const query = device ? { ...p.query, deviceId: device } : p.query;
      outcome = await callTool('call_api_operation', { operation_id: op.operationId, query, body: p.body, max_items: 5 });
      outcome.device = device;
      if (outcome.ok) break;
    }
    results.set(op.operationId, {
      result: outcome.ok ? 'Verified live' : `Live error (${outcome.status})`,
      detail: `${outcome.device ? `deviceId=${outcome.device}: ` : ''}${outcome.detail}`,
    });
    if (++done % 50 === 0) console.error(`  ${done} live calls done, ${queue.length} queued`);
  }
}
console.error(`Live-testing ${queue.length} read operations (concurrency ${CONCURRENCY})...`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// Dedicated tools: endpoint(s) used, presence in the published spec, and a live call.
const source = await readFile(new URL('../src/server.ts', import.meta.url), 'utf8');
const handlerSource = source.slice(source.indexOf('private async handleToolCall'));
const endpointsByTool = new Map();
for (const block of handlerSource.split(/\n\s*case '/).slice(1)) {
  const name = block.slice(0, block.indexOf("'"));
  const paths = [...block.matchAll(/[`']\/dataservice(\/[^`'?$]*)(\$\{)?/g)].map((m) => (m[2] ? `${m[1]}{…}` : m[1]));
  if (paths.length) endpointsByTool.set(name, [...new Set(paths)]);
}
const specMatchers = operations
  .filter((o) => o.method === 'GET')
  .map((o) => new RegExp(`^${o.path.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{[^}]+\}/g, '[^/]+')}$`));
const inSpec = (path) => {
  const probe = path.replace(/\{…\}/g, 'x');
  return specMatchers.some((rx) => rx.test(probe)) || operations.some((o) => o.method === 'GET' && o.path.startsWith(path.split('{…}')[0]) && path.includes('{…}'));
};

const toolSamples = {
  get_device_details: { device_id: EDGE },
  get_control_valid_devices: { device_id: CONTROLLER },
  get_control_links: { state: 'up' },
  get_omp_links: { state: 'up' },
  list_policy_definitions: { definition_type: 'control' },
  list_api_categories: {},
  search_api_operations: { query: 'omp routes' },
  describe_api_operation: { operation_id: 'createReceivedRoutesList' },
  call_api_operation: { operation_id: 'createOMPSummary', query: { deviceId: EDGE } },
};
// UX 2.0 tools need object names that exist on this Manager; look them up live.
try {
  const res = await client.callTool({ name: 'get_ux2_overview', arguments: {} }, undefined, { timeout: CALL_TIMEOUT_MS });
  const overview = JSON.parse(res.content[0].text);
  const cg = overview.configGroups?.find((g) => g.devices > 0) ?? overview.configGroups?.[0];
  if (cg) {
    toolSamples.get_config_group = { config_group: cg.name };
    toolSamples.get_config_group_device_variables = { config_group: cg.name };
    const detail = JSON.parse((await client.callTool({ name: 'get_config_group', arguments: { config_group: cg.name } }, undefined, { timeout: CALL_TIMEOUT_MS })).content[0].text);
    const member = detail.associatedDevices?.[0];
    if (member) toolSamples.preview_config_group_device_config = { config_group: cg.name, device: member['host-name'] ?? member.id };
  }
  if (overview.policyGroups?.[0]) toolSamples.get_policy_group = { policy_group: overview.policyGroups[0].name };
  if (overview.topologyGroups?.[0]) toolSamples.get_topology_group = { topology_group: overview.topologyGroups[0].name };
  const profiles = JSON.parse((await client.callTool({ name: 'list_feature_profiles', arguments: { profile_type: 'system' } }, undefined, { timeout: CALL_TIMEOUT_MS })).content[0].text);
  if (profiles.system?.[0]) toolSamples.get_feature_profile = { profile_type: 'system', profile: profiles.system[0].profileName };
} catch (err) {
  console.error(`UX 2.0 sample lookup failed: ${err.message}`);
}
// Templates need a real template ID.
try {
  const templates = JSON.parse((await client.callTool({ name: 'list_device_templates', arguments: {} }, undefined, { timeout: CALL_TIMEOUT_MS })).content[0].text);
  const id = templates.data?.[0]?.templateId;
  if (id) {
    toolSamples.get_attached_devices = { template_id: id };
    toolSamples.get_template_definition = { template_id: id, template_type: 'device' };
  }
} catch (err) {
  console.error(`Template sample lookup failed: ${err.message}`);
}
const toolRows = [];
for (const tool of tools) {
  const required = tool.inputSchema?.required ?? [];
  let args = toolSamples[tool.name];
  if (!args) {
    if (required.some((r) => !['device_id'].includes(r))) {
      toolRows.push({ tool, result: 'Needs IDs (not live-tested)', detail: `requires ${required.join(', ')}` });
      continue;
    }
    args = required.includes('device_id') ? { device_id: tool.name.startsWith('get_validator') ? VALIDATOR : EDGE } : {};
  }
  const outcome = await callTool(tool.name, args);
  toolRows.push({ tool, result: outcome.ok ? 'Verified live' : `Live error (${outcome.status})`, detail: `${JSON.stringify(args)} → ${outcome.detail}` });
}
await client.close();

// ---------- Reports ----------
// Lab identifiers are replaced with placeholders so the reports can be published.
const redactions = new Map([[EDGE, '<edge>'], [CONTROLLER, '<controller>'], [VALIDATOR, '<validator>']]);
for (const [value, label] of [
  [toolSamples.get_config_group?.config_group, '<config-group>'],
  [toolSamples.preview_config_group_device_config?.device, '<device>'],
  [toolSamples.get_policy_group?.policy_group, '<policy-group>'],
  [toolSamples.get_topology_group?.topology_group, '<topology-group>'],
  [toolSamples.get_feature_profile?.profile, '<feature-profile>'],
  [toolSamples.get_attached_devices?.template_id, '<template-id>'],
]) {
  if (value) redactions.set(value, label);
}
const redact = (text) =>
  [...redactions].reduce(
    (t, [value, label]) => t.replace(new RegExp(`(?<![\\w.-])${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-]|\\.\\d)`, 'g'), label),
    text,
  );
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const csvEsc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
const count = (pred) => operations.filter(pred).length;
const resultOf = (op) => results.get(op.operationId);
const verified = (op) => resultOf(op).result === 'Verified live';

const resultKinds = [...new Set(operations.map((o) => resultOf(o).result.replace(/ \(.*\)$/, '')))];
const byCategory = new Map();
for (const op of operations) {
  const c = byCategory.get(op.tag) ?? { total: 0, read: 0, write: 0, blocked: 0, live: 0, verified: 0 };
  c.total++;
  c[op.access]++;
  if (resultOf(op).result.startsWith('Verified') || resultOf(op).result.startsWith('Live error')) c.live++;
  if (verified(op)) c.verified++;
  byCategory.set(op.tag, c);
}

const lines = [];
lines.push(`# Catalyst SD-WAN MCP server: vManage API coverage`, '');
lines.push(`Generated ${new Date().toISOString()} against vManage spec version ${catalog.version ?? 'unknown'} ` +
  `(test devices: edge ${EDGE}, controller ${CONTROLLER}, validator ${VALIDATOR}). Regenerate with \`npm run verify:api\`.`, '');
lines.push('## Summary', '', '| Item | Count |', '|---|---|');
lines.push(`| Operations in the vManage OpenAPI spec | ${operations.length} |`);
lines.push(`| Callable via \`call_api_operation\` (read) | ${count((o) => o.access === 'read')} |`);
lines.push(`| Callable via \`call_api_operation\` when writes are enabled | ${count((o) => o.access === 'write')} |`);
lines.push(`| Blocked (secrets / file upload / event stream) | ${count((o) => o.access === 'blocked')} |`);
for (const kind of resultKinds) lines.push(`| Result: ${kind} | ${count((o) => resultOf(o).result.replace(/ \(.*\)$/, '') === kind)} |`);
lines.push(`| Dedicated MCP tools | ${tools.length} |`, '');

lines.push('## Dedicated MCP tools', '', '| Tool | vManage endpoint(s) | In 26.x spec | Live result | Detail |', '|---|---|---|---|---|');
for (const row of toolRows) {
  const eps = endpointsByTool.get(row.tool.name) ?? [];
  const spec = eps.length ? (eps.every(inSpec) ? 'Yes' : `No: ${eps.filter((e) => !inSpec(e)).join(', ')}`) : 'n/a (spec-driven)';
  lines.push(`| \`${row.tool.name}\` | ${esc(eps.map((e) => `/dataservice${e}`).join('<br>')) || 'any (validated against spec)'} | ${esc(spec)} | ${row.result} | ${esc(row.detail)} |`);
}
lines.push('');

lines.push('## Coverage by API category', '', '| Category | Ops | Read | Write | Blocked | Live-tested | Verified live |', '|---|---|---|---|---|---|---|');
for (const [tag, c] of [...byCategory.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  lines.push(`| ${esc(tag)} | ${c.total} | ${c.read} | ${c.write} | ${c.blocked} | ${c.live} | ${c.verified} |`);
}
lines.push('');

lines.push('## All operations', '', '| Method | Path | operationId | Category | Access | Result | Detail |', '|---|---|---|---|---|---|---|');
const sorted = [...operations].sort((a, b) => a.tag.localeCompare(b.tag) || a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
for (const op of sorted) {
  const r = resultOf(op);
  lines.push(`| ${op.method} | \`/dataservice${esc(op.path)}\` | ${esc(op.operationId)} | ${esc(op.tag)} | ${op.access}${op.deprecated ? ' (deprecated)' : ''} | ${r.result} | ${esc(r.detail)} |`);
}
await writeFile(new URL('../API_COVERAGE.md', import.meta.url), redact(`${lines.join('\n')}\n`));

const csv = ['method,path,operationId,category,access,deprecated,result,detail'];
for (const op of sorted) {
  const r = resultOf(op);
  csv.push([op.method, `/dataservice${op.path}`, op.operationId, op.tag, op.access, op.deprecated, r.result, r.detail].map(csvEsc).join(','));
}
await writeFile(new URL('../api_coverage.csv', import.meta.url), redact(`${csv.join('\n')}\n`));

console.log(redact(lines.slice(0, lines.indexOf('## Coverage by API category')).join('\n')));
console.log('\nWrote API_COVERAGE.md and api_coverage.csv');
