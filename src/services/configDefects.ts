/*
 * MIT License
 * Known defects vManage's template-to-configuration-group conversion leaves in the groups it creates (seen on 20.15
 * and 20.18). Each rule looks at one parcel and, when the defect is there, returns the fixed parcel data. Rules that
 * restore what the conversion lost also get the feature template the parcel was made from: the conversion names
 * each parcel after its feature template.
 *
 * Feature templates hold a value for every field, also for those left at their default (vipType "ignore" or
 * "notIgnore"), and the device runs those values. The conversion writes such fields as the group's default, which
 * is not always the same value, or leaves them out, which vManage renders as off.
 */

export type Data = Record<string, any>;
type Option = { optionType: string; value?: unknown };

export interface Rule {
  name: string;
  description: string;
  templateType?: string; // the rule needs the parcel's feature template, of this type
  applies: (parcelType: string, data: Data, source?: Data) => boolean;
  fix: (data: Data, source?: Data) => Data;
}

const ETHERNET = 'wan/vpn/interface/ethernet';
const NAT_DEFAULTS = {
  natType: { optionType: 'global', value: 'interface' },
  udpTimeout: { optionType: 'default', value: 1 },
  tcpTimeout: { optionType: 'default', value: 60 },
};
/** feature template allow-service name -> configuration group allowService name */
const SERVICES: Record<string, string> = {
  all: 'all', bgp: 'bgp', dhcp: 'dhcp', dns: 'dns', icmp: 'icmp', sshd: 'ssh', netconf: 'netconf', ntp: 'ntp',
  ospf: 'ospf', stun: 'stun', snmp: 'snmp', https: 'https',
};
/** [section, field] of a SIG template interface -> field of a sig parcel interface */
const SIG_FIELDS: Array<[string | null, string, string]> = [
  [null, 'mtu', 'mtu'], [null, 'tcp-mss-adjust', 'tcpMssAdjust'],
  ['dead-peer-detection', 'dpd-interval', 'dpdInterval'], ['dead-peer-detection', 'dpd-retries', 'dpdRetries'],
  ['ike', 'ike-group', 'ikeGroup'], ['ike', 'ike-ciphersuite', 'ikeCiphersuite'],
  ['ike', 'ike-rekey-interval', 'ikeRekeyInterval'], ['ipsec', 'ipsec-ciphersuite', 'ipsecCiphersuite'],
  ['ipsec', 'ipsec-rekey-interval', 'ipsecRekeyInterval'], ['ipsec', 'ipsec-replay-window', 'ipsecReplayWindow'],
  ['ipsec', 'perfect-forward-secrecy', 'perfectForwardSecrecy'],
];

/** The option a feature template field stands for: a variable, or the value the device runs (also for a field left
 *  at the template's default). Undefined when the field holds nothing. */
export function templateValue(leaf: any): Option | undefined {
  if (!leaf || typeof leaf !== 'object' || !('vipType' in leaf)) return undefined;
  if (leaf.vipType === 'variableName' && leaf.vipVariableName) {
    return { optionType: 'variable', value: `{{${leaf.vipVariableName}}}` };
  }
  const empty = leaf.vipValue === '' || leaf.vipValue === undefined || leaf.vipValue === null ||
    (Array.isArray(leaf.vipValue) && !leaf.vipValue.length);
  if (['constant', 'ignore', 'notIgnore'].includes(leaf.vipType) && !empty) {
    return { optionType: 'global', value: leaf.vipValue };
  }
  return undefined;
}

/** `value` (feature templates hold strings) with the type of the parcel's value `like`. */
function typed(value: unknown, like: unknown): unknown {
  if (typeof like === 'boolean' || (like === undefined && /^(true|false)$/i.test(String(value)))) {
    return typeof value === 'boolean' ? value : String(value).toLowerCase() === 'true';
  }
  if (typeof like === 'number') return Number(value);
  if (typeof like === 'string') return String(value);
  return value;
}

/** The option to write when the parcel has `current` and the template stands for `wanted`, or undefined to keep
 *  `current`. Options the conversion set (global or variable) are kept; defaults and missing ones are not. */
function restored(current: Option | undefined, wanted: Option | undefined): Option | undefined {
  if (!wanted || (current && ['global', 'variable'].includes(current.optionType))) return undefined;
  if (wanted.optionType === 'variable') return wanted;
  const value = typed(wanted.value, current?.value);
  if (current && current.value === value) return undefined;
  return { optionType: 'global', value };
}

function serviceFixes(data: Data, source: Data): Record<string, Option> {
  const services = source['tunnel-interface']?.['allow-service'] || {};
  const current = data.allowService || {};
  const out: Record<string, Option> = {};
  for (const [name, groupName] of Object.entries(SERVICES)) {
    const option = restored(current[groupName], templateValue(services[name]));
    if (option) out[groupName] = option;
  }
  return out;
}

function sigInterfaceFixes(iface: Data, sourceIface: Data): Record<string, Option> {
  const out: Record<string, Option> = {};
  for (const [section, name, groupName] of SIG_FIELDS) {
    const leaf = section ? sourceIface[section]?.[name] : sourceIface[name];
    const option = restored(iface[groupName], templateValue(leaf));
    if (option) out[groupName] = option;
  }
  return out;
}

/** [index, parcel interface, template interface] for the tunnels both have, matched by interface name. */
function sigPairs(data: Data, source: Data): Array<[number, Data, Data]> {
  const byName = new Map<string, Data>();
  for (const item of source.interface?.vipValue || []) {
    const option = templateValue(item['if-name']);
    if (option) byName.set(String(option.value), item);
  }
  return (data.interface || [])
    .map((iface: Data, index: number) => [index, iface, byName.get(String(iface.ifName?.value))])
    .filter((pair: unknown[]) => pair[2]) as Array<[number, Data, Data]>;
}

export const RULES: Rule[] = [
  {
    name: 'stray-tunnel',
    description:
      'Tunnel settings on a VPN 0 interface without a tunnel (20.15, 20.18). On a TLOC extension port vManage renders ' +
      "an invalid tunnel-interface and the deploy fails with CFGRP0012 'syntax error: unknown command " +
      "tunnel-interface'; on a loopback it renders a tunnel without a color.",
    applies: (type, data) => type === ETHERNET && 'tunnel' in data && data.tunnelInterface?.value !== true,
    fix: (data) => Object.fromEntries(Object.entries(data).filter(([k]) => k !== 'tunnel')),
  },
  {
    name: 'allowed-services',
    description:
      "Tunnel interface services left at the template's default (dhcp, icmp and https are allowed under templates) " +
      "are left out (20.18), and vManage renders a missing service as 'no allow-service'.",
    templateType: 'cisco_vpn_interface',
    applies: (type, data, source) =>
      type === ETHERNET && data.tunnelInterface?.value === true && Object.keys(serviceFixes(data, source || {})).length > 0,
    fix: (data, source) => ({ ...data, allowService: { ...(data.allowService || {}), ...serviceFixes(data, source || {}) } }),
  },
  {
    name: 'legacy-nat',
    description: "Interface NAT in the older feature template form ('nat' set to true, without NAT options) becomes NAT off (20.18).",
    templateType: 'cisco_vpn_interface',
    applies: (type, data, source) => {
      const nat = source?.nat;
      return type === ETHERNET && nat?.vipType === 'constant' && String(nat.vipValue).toLowerCase() === 'true' &&
        data.nat?.value !== true;
    },
    fix: (data) => ({ ...data, nat: { optionType: 'global', value: true }, natAttributesIpv4: data.natAttributesIpv4 || { ...NAT_DEFAULTS } }),
  },
  {
    name: 'sig-template-values',
    description:
      "SIG tunnel settings left at the template's default become the group's default, which differs (20.18: IKE " +
      'group 14 -> 16, IPsec cipher suite aes256-gcm -> aes256-cbc-sha512).',
    templateType: 'cisco_secure_internet_gateway',
    applies: (type, data, source) =>
      type === 'sig' && sigPairs(data, source || {}).some(([, i, s]) => Object.keys(sigInterfaceFixes(i, s)).length > 0),
    fix: (data, source) => {
      const interfaces = [...(data.interface || [])];
      for (const [index, iface, sourceIface] of sigPairs(data, source || {})) {
        interfaces[index] = { ...iface, ...sigInterfaceFixes(iface, sourceIface) };
      }
      return { ...data, interface: interfaces };
    },
  },
];

function shown(option: any): string {
  if (option && typeof option === 'object' && 'optionType' in option) {
    return option.optionType === 'default' ? 'default' : String(option.value);
  }
  return option === undefined ? 'missing' : 'set';
}

/** The options that differ between two parcel data, as 'path: old -> new'. */
export function changes(old: any, next: any, path = ''): string[] {
  if ((next && typeof next === 'object' && 'optionType' in next) || next === null || typeof next !== 'object') {
    return JSON.stringify(old) === JSON.stringify(next) ? [] : [`${path}: ${shown(old)} -> ${shown(next)}`];
  }
  if (Array.isArray(next)) {
    const before = Array.isArray(old) ? old : [];
    return next.flatMap((item, i) => changes(before[i], item, `${path}[${i}]`));
  }
  const before = old && typeof old === 'object' ? old : {};
  const join = (k: string) => (path ? `${path}.${k}` : k);
  return [
    ...Object.keys(next).flatMap((k) => changes(before[k], next[k], join(k))),
    ...Object.keys(before).filter((k) => !(k in next)).map((k) => `${join(k)}: removed`),
  ];
}
