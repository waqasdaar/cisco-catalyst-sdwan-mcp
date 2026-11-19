// Live check of the monitoring and troubleshooting tools against a real SD-WAN Manager (read operations only).
// Calls every view of the read monitoring tools and every query_statistics operation through the real MCP server.
// Result per call: ok (data returned), manager (the Manager or device answered with an error: the endpoint was reached),
// input (needs a value this test cannot guess), fail (refused or broken in the server), timeout.
// Usage: npm run build && npm run test:monitoring -- <edge> [<controller>]
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { MONITORING_VIEWS, STATISTICS_DATASETS, STATISTICS_OPERATIONS } from '../build/services/monitoringCatalog.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const [EDGE, CONTROLLER] = process.argv.slice(2);
if (!EDGE) {
  console.error('Usage: npm run test:monitoring -- <edge> [<controller>]');
  process.exit(2);
}
const spec = JSON.parse(readFileSync(join(ROOT, 'resources/vmanageapi-26.2.1.json'), 'utf8')).paths;
const specOp = (method, path) => spec[path]?.[method.toLowerCase()];
const DEVICE = new Set(['deviceId', 'deviceIp', 'deviceIP', 'deviceUUID', 'uuid']);
const LAST_HOUR = { condition: 'AND', rules: [{ value: ['1'], field: 'entry_time', type: 'date', operator: 'last_n_hours' }] };
const AGGREGATION = { field: [{ property: 'vdevice_name', sequence: 1, size: 10 }] };
const stamp = (d) => d.toISOString().slice(0, 19);
// Values for required parameters that are safe to send on any fabric.
const KNOWN = {
  query: JSON.stringify({ query: LAST_HOUR }), state: 'up', vpnId: '0', 'vpn-id': '0', vpn: '0', dns: 'cisco.com',
  'severity-level': 'critical', personality: 'vedge', limit: '10', q: 'edge', last_n_hours: '1',
  startDate: stamp(new Date(Date.now() - 3_600_000)), endDate: stamp(new Date()),
};
// Request bodies that are not a statistics query.
const BODIES = { '/event/byuuids': [], '/device/tools/admintechlist': { deviceIP: 'EDGE_IP' } };
// Rerun only the calls that were not ok in an earlier report.
const RETRY = process.env.MONITORING_LIVE_RETRY
  ? new Set(JSON.parse(readFileSync(process.env.MONITORING_LIVE_RETRY, 'utf8')).results.filter((r) => r.outcome !== 'ok').map((r) => `${r.tool} ${r.label}`))
  : null;

const client = new Client({ name: 'monitoring-live', version: '1.3.0' });
await client.connect(new StdioClientTransport({ command: 'node', args: ['build/index.js'], cwd: ROOT, stderr: 'ignore' }));
const call = async (name, args) => {
  const t0 = performance.now();
  try {
    const res = await client.callTool({ name, arguments: args }, undefined, { timeout: 180_000 });
    const text = res.content?.[0]?.text ?? '';
    return { ms: performance.now() - t0, error: res.isError ? text : null, size: text.length };
  } catch (err) {
    return { ms: performance.now() - t0, error: `client: ${err.message}`, size: 0 };
  }
};
const classify = (error) => {
  if (!error) return 'ok';
  if (/did not respond within|timed out|timeout/i.test(error)) return 'timeout';
  if (/vManage API error|HTTP \d{3}|status \d{3}|\b(4|5)\d\d\b/.test(error)) return 'manager';
  return 'fail';
};

// Arguments for a view: device_id for device parameters, safe values for other required ones, or null when unknown.
function argsFor(method, path, device) {
  const op = specOp(method, path);
  const args = { query: {}, path_params: {} };
  for (const p of op.parameters ?? []) {
    if (DEVICE.has(p.name)) {
      // Optional device parameters too: device-scoped data is what these views are for.
      if (p.in === 'path' || p.required || p.name === 'deviceId') args.device_id = device;
      continue;
    }
    if (p.in !== 'path' && !p.required) continue;
    const value = p.schema?.enum?.[0] ?? p.schema?.items?.enum?.[0] ?? KNOWN[p.name];
    if (value === undefined) return { missing: `${p.in}:${p.name}` };
    (p.in === 'path' ? args.path_params : args.query)[p.name] = String(value);
  }
  if (method === 'POST' && op.requestBody) {
    const aggregation = /aggregation|\/(tloc|common|dmvpn|total|energymix|device)$|\/interface\/type$/.test(path) ? { aggregation: AGGREGATION } : {};
    args.body = BODIES[path] ? JSON.parse(JSON.stringify(BODIES[path]).replace('EDGE_IP', EDGE_IP)) : { query: LAST_HOUR, size: 10, ...aggregation };
  }
  return { args };
}

const jobs = [];
for (const [tool, table] of Object.entries(MONITORING_VIEWS)) {
  if (tool === 'run_device_diagnostic') continue;
  for (const [view, raw] of Object.entries(table)) {
    const v = typeof raw === 'string' ? { path: raw } : raw;
    for (const synced of v.synced ? [false, true] : [false]) {
      jobs.push({ tool, label: `${view}${synced ? ' (synced)' : ''}`, method: v.method ?? 'GET', path: synced ? v.synced : v.path, extra: { view, ...(synced ? { synced: true } : {}) } });
    }
  }
}
for (const [dataset, base] of Object.entries(STATISTICS_DATASETS)) {
  for (const [operation, o] of Object.entries(STATISTICS_OPERATIONS)) {
    const path = `/statistics${base ? `/${base}` : ''}${o.path}`;
    const post = specOp('POST', path);
    if (!post && !specOp('GET', path)) continue;
    jobs.push({ tool: 'query_statistics', label: `${dataset} / ${operation}`, method: post ? 'POST' : 'GET', path, extra: { dataset, operation }, statistics: true });
  }
}

const results = [];
let next = 0;
if (RETRY) jobs.splice(0, jobs.length, ...jobs.filter((j) => RETRY.has(`${j.tool} ${j.label}`)));
const devices = await client.callTool({ name: 'list_devices', arguments: { fields: ['host-name', 'system-ip'] } });
const EDGE_IP = JSON.parse(devices.content[0].text).data.find((d) => d['host-name'] === EDGE || d['system-ip'] === EDGE)?.['system-ip'] ?? EDGE;
const worker = async () => {
  while (next < jobs.length) {
    const job = jobs[next++];
    let args;
    if (job.statistics) {
      const post = specOp('POST', job.path);
      args = { ...job.extra, ...(post?.requestBody ? { body: { query: LAST_HOUR, size: 10, ...(/aggregation/.test(job.path) ? { aggregation: AGGREGATION } : {}) } } : {}) };
      const q = argsFor(job.method, job.path, EDGE);
      if (q.missing) {
        results.push({ ...job, outcome: 'input', detail: q.missing });
        continue;
      }
      if (Object.keys(q.args.query).length) args.query = q.args.query;
      if (job.label.endsWith('/ page')) args.query = { ...args.query, count: 10 };
      if (job.label.endsWith('/ page') || job.label.endsWith('/ raw')) args.limit = 10;
    } else {
      const built = argsFor(job.method, job.path, EDGE);
      if (built.missing) {
        results.push({ ...job, outcome: 'input', detail: built.missing });
        continue;
      }
      args = { ...job.extra, ...built.args, limit: 20 };
    }
    let r = await call(job.tool, args);
    let target = args.device_id;
    // Controller-only operations answer with an error on an edge: try them on a Controller.
    if (r.error && args.device_id && CONTROLLER && classify(r.error) === 'manager') {
      const again = await call(job.tool, { ...args, device_id: CONTROLLER });
      if (!again.error) {
        r = again;
        target = CONTROLLER;
      }
    }
    results.push({ ...job, outcome: classify(r.error), ms: Math.round(r.ms), size: r.size, device: target, detail: r.error?.slice(0, 220) });
    process.stdout.write(classify(r.error) === 'ok' ? '.' : classify(r.error)[0]);
  }
};
const t0 = performance.now();
await Promise.all(Array.from({ length: 4 }, worker));
const totalS = (performance.now() - t0) / 1000;
await client.close();

const by = (key) => results.reduce((m, r) => ({ ...m, [r[key]]: (m[r[key]] ?? 0) + 1 }), {});
const timed = results.filter((r) => r.ms !== undefined).map((r) => r.ms).sort((a, b) => a - b);
const pct = (p) => timed[Math.min(timed.length - 1, Math.floor(timed.length * p))];
const summary = {
  calls: results.length,
  outcomes: by('outcome'),
  perTool: Object.fromEntries(
    Object.keys(by('tool')).map((t) => [t, results.filter((r) => r.tool === t).reduce((m, r) => ({ ...m, [r.outcome]: (m[r.outcome] ?? 0) + 1 }), {})])
  ),
  timingMs: { avg: Math.round(timed.reduce((a, b) => a + b, 0) / timed.length), p50: pct(0.5), p95: pct(0.95), max: timed.at(-1) },
  wallClockS: Math.round(totalS),
  concurrency: 4,
};
console.log(`\n${JSON.stringify(summary, null, 2)}`);
for (const r of results.filter((x) => x.outcome === 'fail' || x.outcome === 'timeout')) console.log(`${r.outcome.toUpperCase()}  ${r.tool} ${r.label}: ${r.detail}`);
const out = process.env.MONITORING_LIVE_REPORT ?? join(ROOT, 'monitoring_live.json');
writeFileSync(out, JSON.stringify({ edge: EDGE, controller: CONTROLLER, summary, results }, null, 1));
console.log(`\nDetails: ${out}`);
process.exit(results.some((r) => r.outcome === 'fail') ? 1 : 0);
