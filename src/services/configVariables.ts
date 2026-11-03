/*
 * MIT License
 * Device variable values for configuration groups converted from device templates.
 *
 * vManage's template-to-configuration-group conversion turns template variables into group variables but leaves
 * their values behind. These functions map a device's template values onto the variables of its group's schema
 * (GET /dataservice/v1/config-group/{id}/device/variables/schema). Each group variable gets, in this order:
 *   - the value of the template variable of the same name
 *   - for <template variable>_ip_address / _subnet_mask, the address and dotted mask of its a.b.c.d/len value
 *   - for host_name, system_ip and site_id, the template's system host name, system IP and site ID
 *   - for pseudo_commit_timer and ipv6_strict_control, DEFAULTS
 *   - for an AAA user password, AAA_PASSWORD_PLACEHOLDER (never a real password)
 * Values are cast to the schema's type and checked against it. The same mapping applies to the policy group of the
 * group's name, where the 20.18 conversion puts the SIG feature (its tracker source is a variable).
 */

export interface VariableSpec {
  value: JsonSchema;
  description: string;
  encrypted: boolean;
  required: boolean;
  paths: Array<Record<string, unknown>>;
}

export type JsonSchema = Record<string, any>;
export type Value = string | number | boolean | null | Value[];

export interface MappingReport {
  defaults: string[];
  secrets: string[];
  missing: string[];
  invalid: string[];
  unused: string[];
}

export interface TemplateRow {
  template: string;
  deviceId: string;
  values: Record<string, string>;
  system: Record<string, string>;
}

export const SYSTEM_PATHS: Record<string, string> = {
  host_name: '//system/host-name',
  system_ip: '//system/system-ip',
  site_id: '//system/site-id',
};
export const DEFAULTS: Record<string, Value> = { pseudo_commit_timer: 300, ipv6_strict_control: false };
export const AAA_PASSWORD_PLACEHOLDER = '${AAA_PASSWORD}';
const NO_VALUE = new Set(['', 'TEMPLATE_IGNORE']);
const IPV4 = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.){3}(25[0-5]|(2[0-4]|1\d|[1-9]|)\d)$/;

/** Variable name -> its spec, from a variables schema response. Entries without a value are skipped (20.18 also
 *  lists field dependencies there, under "metadata"). */
export function parseSchema(body: unknown): Record<string, VariableSpec> {
  const out: Record<string, VariableSpec> = {};
  for (const block of (body as any[]) || []) {
    for (const entry of block.variables || []) {
      const schema = entry.schema || {};
      for (const [name, prop] of Object.entries<any>(schema.properties || {})) {
        if (!prop?.properties?.value || name in out) continue;
        const metadata = prop.properties.metadata || {};
        out[name] = {
          value: prop.properties.value,
          description: metadata.description || '',
          encrypted: Boolean(metadata.encrypted),
          required: (schema.required || []).includes(name),
          paths: metadata.paths || [],
        };
      }
    }
  }
  return out;
}

/** device name -> its template values, from a POST /dataservice/template/device/config/input response. */
export function rowsFromInput(template: string, response: any): Record<string, TemplateRow> {
  const systemByPath = Object.fromEntries(Object.entries(SYSTEM_PATHS).map(([k, v]) => [v, k]));
  const columns: Record<string, string | undefined> = {};
  for (const column of response?.header?.columns || []) {
    const match = /\(([^()]+)\)\s*$/.exec(column.title || '');
    columns[column.property] = column.variable || (match ? match[1] : undefined);
  }
  const out: Record<string, TemplateRow> = {};
  for (const row of response?.data || []) {
    const values: Record<string, string> = {};
    const system: Record<string, string> = {};
    for (const [property, value] of Object.entries<any>(row)) {
      if (property in systemByPath) system[systemByPath[property]] = String(value);
      else if (columns[property] && !property.startsWith('csv-')) values[columns[property] as string] = String(value);
    }
    out[row['csv-host-name']] = { template, deviceId: row['csv-deviceId'], values, system };
  }
  return out;
}

function kinds(schema: JsonSchema): Set<string> {
  return new Set([schema, ...(schema.oneOf || []), ...(schema.anyOf || [])].map((s) => s.type).filter(Boolean));
}

export function cast(raw: unknown, schema: JsonSchema): Value {
  const types = kinds(schema);
  // Templates hold a list as "a,b"; groups want ["a", "b"] (20.18: vpn0_ip_host_ip_list).
  if (types.has('array') && typeof raw === 'string') {
    return raw.split(',').filter((item) => item.trim()).map((item) => cast(item, schema.items || {}));
  }
  if (Array.isArray(raw)) return raw.map((item) => cast(item, schema.items || {}));
  const text = String(raw).trim();
  if (types.has('integer') && /^-?\d+$/.test(text)) return parseInt(text, 10);
  if (types.has('boolean') && /^(true|false)$/i.test(text)) return text.toLowerCase() === 'true';
  if (typeof raw === 'boolean') return raw ? 'true' : 'false';
  return text;
}

/** Why `value` does not satisfy `schema`, for the keywords vManage's variable schemas use; null when it does. */
export function problem(value: Value, schema: JsonSchema): string | null {
  if (schema.oneOf || schema.anyOf) {
    const branches = (schema.oneOf || schema.anyOf) as JsonSchema[];
    const own = { ...schema };
    delete own.oneOf;
    delete own.anyOf;
    const ownProblem = Object.keys(own).length ? problem(value, own) : null;
    if (ownProblem) return ownProblem;
    return branches.some((b) => problem(value, b) === null) ? null : `${JSON.stringify(value)} matches none of the allowed forms`;
  }
  const type = schema.type;
  if (type === 'array') {
    if (!Array.isArray(value)) return `${JSON.stringify(value)} is not a list`;
    if (schema.minItems !== undefined && value.length < schema.minItems) return `${JSON.stringify(value)} has too few items`;
    if (schema.maxItems !== undefined && value.length > schema.maxItems) return `${JSON.stringify(value)} has too many items`;
    const itemSchema = schema.items || {};
    if (itemSchema.uniqueItems && new Set(value.map((v) => JSON.stringify(v))).size !== value.length) {
      return `${JSON.stringify(value)} repeats an item`;
    }
    for (const item of value) {
      const issue = problem(item, itemSchema);
      if (issue) return issue;
    }
    return null;
  }
  if (Array.isArray(value)) return `${JSON.stringify(value)} is a list`;
  if (type === 'string' && typeof value !== 'string') return `${JSON.stringify(value)} is not a string`;
  if (type === 'integer' && !Number.isInteger(value)) return `${JSON.stringify(value)} is not an integer`;
  if (type === 'number' && typeof value !== 'number') return `${JSON.stringify(value)} is not a number`;
  if (type === 'boolean' && typeof value !== 'boolean') return `${JSON.stringify(value)} is not a boolean`;
  if (schema.enum && !schema.enum.includes(value)) return `${JSON.stringify(value)} is not one of ${schema.enum.join(', ')}`;
  if (typeof value === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) return `'${value}' does not match ${schema.pattern}`;
    if (schema.format === 'ipv4' && !IPV4.test(value)) return `'${value}' is not an IPv4 address`;
    if (schema.format === 'ipv6' && !/^[0-9a-fA-F:]+$/.test(value)) return `'${value}' is not an IPv6 address`;
    if (schema.minLength !== undefined && value.length < schema.minLength) return `'${value}' is too short`;
    if (schema.maxLength !== undefined && value.length > schema.maxLength) return `'${value}' is too long`;
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) return `${value} is less than ${schema.minimum}`;
    if (schema.maximum !== undefined && value > schema.maximum) return `${value} is more than ${schema.maximum}`;
  }
  return null;
}

function interfaceParts(value: string): { ip: string; mask: string } | null {
  const match = /^(\d+\.\d+\.\d+\.\d+)\/(\d{1,2})$/.exec(value.trim());
  if (!match || !IPV4.test(match[1]) || Number(match[2]) > 32) return null;
  const bits = Number(match[2]);
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return { ip: match[1], mask: [24, 16, 8, 0].map((shift) => (mask >>> shift) & 255).join('.') };
}

function isAaaPassword(spec: VariableSpec): boolean {
  return spec.paths.some((p) => p.parcel_type === 'aaa' && p.path === 'user.password');
}

/** The group variable values for one device, and a report of how they were found. */
export function mapValues(spec: Record<string, VariableSpec>, row: TemplateRow): { values: Record<string, Value>; report: MappingReport } {
  const values: Record<string, Value> = {};
  const report: MappingReport = { defaults: [], secrets: [], missing: [], invalid: [], unused: [] };
  const used = new Set<string>();
  const has = (v: string | undefined) => v !== undefined && !NO_VALUE.has(v);
  for (const [name, variable] of Object.entries(spec)) {
    let found: unknown = undefined;
    if (name in row.values) used.add(name);
    if (variable.encrypted) {
      if (isAaaPassword(variable)) {
        found = AAA_PASSWORD_PLACEHOLDER;
        report.secrets.push(name);
      }
    } else if (has(row.values[name])) {
      found = row.values[name];
    } else if (has(row.system[name])) {
      found = row.system[name];
    } else {
      for (const [suffix, part] of [['_ip_address', 'ip'], ['_subnet_mask', 'mask']] as const) {
        const base = name.slice(0, -suffix.length);
        if (name.endsWith(suffix) && has(row.values[base])) {
          const parts = interfaceParts(row.values[base]);
          if (parts) found = parts[part];
          else report.invalid.push(`${name}: ${base}='${row.values[base]}' is not an address/length`);
          used.add(base);
          break;
        }
      }
      if (found === undefined && name in DEFAULTS) {
        found = DEFAULTS[name];
        report.defaults.push(name);
      }
    }
    if (found === undefined) {
      if (variable.required || variable.encrypted) {
        values[name] = null;
        report.missing.push(name);
      }
      continue;
    }
    if (found === AAA_PASSWORD_PLACEHOLDER) {
      values[name] = found;
      continue;
    }
    values[name] = cast(found, variable.value);
    let issue = problem(values[name], variable.value);
    // Templates write some addresses as a.b.c.d/len where groups want a.b.c.d (the SIG tracker source).
    const parts = typeof values[name] === 'string' ? interfaceParts(values[name] as string) : null;
    if (issue && parts && !problem(parts.ip, variable.value)) {
      values[name] = parts.ip;
      issue = null;
    }
    if (issue) report.invalid.push(`${name}=${JSON.stringify(values[name])}: ${issue}`);
  }
  report.unused = Object.keys(row.values).filter((name) => !used.has(name)).sort();
  return { values, report };
}
