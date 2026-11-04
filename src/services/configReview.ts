/*
 * MIT License
 * Device configurations returned to the assistant: secrets masked, and a review of what deploying a group would
 * change.
 *
 * The review compares the running config with the config the group renders, line by line, each line with its
 * section path (the lines above it with less indentation), its spacing normalized, and settings that device
 * templates and configuration groups write differently in one form. Lines only in the running config are sorted
 * into:
 *   defaults         settings rendered under device templates but not under groups, at their default value
 *   changed          the same setting with another value (console speed 115200 -> 9600)
 *   secretsChanged   a password, key or secret hash with another value, masked
 *   dropped          settings the group does not configure (OSPF default-information originate, BGP update-source)
 *   fromPolicyGroup  dropped or changed settings the device's policy group configures: the template-to-group
 *                    conversion (20.18) puts a template's SIG feature in a policy group of the template's name, and
 *                    vManage deploys it only after the configuration group
 * and lines only in the rendered config are "added". Dropped and changed settings are what to review.
 */

/** A secret's keyword, its optional encryption type, and the value after it. Hashed secrets are masked
 *  too, as they can be cracked offline. */
const SECRET_KEYWORDS = [
  'message-digest-key\\s+\\d+\\s+md5', // before the generic -key form, which would stop at the key ID
  '[\\w-]*(?:password|secret)', // password, enable-password, shared-secret, auth-password...
  '[\\w-]*-key(?!\\s+(?:address|hostname)\\b)', // authentication-key, pre-shared-key, partner-key, api-key
  'key-string',
  '[\\w-]*psk(?:\\s+(?:ascii|hex))?',
  'key(?!\\s+(?:chain|generate|zeroize|import|export|storage|pubkey-chain)\\b|\\s+\\d+\\s*$)',
  '(?<!(?:set|match)\\s)community', // SNMP communities, not BGP route-map communities
  'auth\\s+(?:md5|sha\\S*)', // SNMPv3 user auth and priv passwords
  'priv\\s+(?:des|3des|aes(?:\\s+\\d+)?)',
];
const SECRET_VALUE = new RegExp(`(?<![\\w-])((?:${SECRET_KEYWORDS.join('|')})(?:\\s+\\d{1,2})?)\\s+\\S+`, 'gi');
const DEFAULT_LINES = [
  /^no (border|last-resort-circuit|low-bandwidth-link|vbond-as-stun-server)$/,
  /^vmanage-connection-preference 5$/, /^port-hop$/, /^carrier default$/, /^nat-refresh-interval 5$/,
  /^hello-interval 1000$/, /^hello-tolerance 12$/, /^config-template-name /, /^no transport-gateway enable$/,
  /^no logging monitor$/,
];
/** Lines groups render that IOS-XE does not keep in the running config: features off by default (20.18, 17.15). */
const NOT_KEPT_LINES = [/^no network-clock revertive$/, /^no acc-gyro enable$/, /^no ignition (sense|enable)$/];
/** What a policy group's SIG feature configures (20.18): the Zscaler/Umbrella settings, the SIG tunnels
 *  (Tunnel100001 and up) with their IKEv2/IPsec profiles, and the tracker source loopback. */
export const SIG_LINES =
  /^(secure-internet-gateway\b|sdwan > service sig\b|(sdwan > )?interface Tunnel1\d{5}\b|crypto (ikev2|ipsec) |vrf definition 65530\b|interface Loopback65530\b)/;
/** The data plane IPsec integrity setting under its older name (device templates) and its newer one (groups). */
const INTEGRITY_TYPES: Record<string, string> = {
  'sha1-hmac': 'esp', 'ah-sha1-hmac': 'ip-udp-esp', 'ah-no-id': 'ip-udp-esp-no-id', none: 'none',
};

export interface ConfigReview {
  dropped: string[];
  changed: string[];
  secretsChanged: string[];
  added: string[];
  defaults: string[];
  fromPolicyGroup: string[];
}

export function maskLine(line: string): string {
  return line.replace(SECRET_VALUE, (_match, word) => `${word} ****`);
}

export function maskConfig(text: string): string {
  return text.split('\n').map(maskLine).join('\n');
}

/** A setting in one form where device templates and configuration groups write the same setting differently. */
function canonical(line: string): string {
  const words = line.trim().split(/\s+/);
  const sorted = (items: string[]) => [...new Set(items)].sort().join(' ');
  if (words[0] === 'authentication-type' || words[0] === 'integrity-type') {
    return `integrity-type ${sorted(words.slice(1).map((w) => INTEGRITY_TYPES[w] ?? w))}`;
  }
  if (words[0] === 'ip' && words[1] === 'host' && words.length > 3) {
    return `ip host ${words[2]} ${sorted(words.slice(3).filter((w) => w !== 'ip-list'))}`;
  }
  if (words[0] === 'key-hash' && words.length === 3) return `key-hash ${words[1]} ${words[2].toLowerCase()}`;
  return words.join(' ');
}

function sectioned(text: string): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  const stack: Array<[number, string]> = [];
  for (const raw of text.split('\n')) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed === '!') continue;
    const indent = raw.length - raw.trimStart().length;
    while (stack.length && stack[stack.length - 1][0] >= indent) stack.pop();
    const line = canonical(trimmed);
    out.push([stack.map((s) => s[1]).join(' > '), line]);
    stack.push([indent, line]);
  }
  return out;
}

const where = (path: string, line: string) => (path ? `${path} > ${line}` : line);
const keyOf = (path: string, line: string) => (line.includes(' ') ? `${path}\u0000${line.slice(0, line.lastIndexOf(' '))}` : null);
const lastWord = (line: string) => line.slice(line.lastIndexOf(' ') + 1);
// Type 5/8/9 hashes and $n$ hashes get a new salt on every render, so a change may not be a new secret.
const HASHED = /(?:\s[589]\s+\S+|\s\$\d+\$\S*)$/;

/** Sorts what deploying would change. With `fromPolicyGroup`, the dropped and changed settings matching it are
 *  listed apart: the device's policy group configures them. Secrets are masked. */
export function reviewConfig(running: string, rendered: string, fromPolicyGroup?: RegExp): ConfigReview {
  const oldLines = sectioned(running);
  const newLines = sectioned(rendered);
  const id = ([p, l]: [string, string]) => `${p}\u0000${l}`;
  const oldSet = new Set(oldLines.map(id));
  const newSet = new Set(newLines.map(id));
  // Section headers ("interface X") are never a setting whose value changes.
  const headers = new Set([...oldLines, ...newLines].map(([path]) => path));
  const added = newLines.filter((e) => !oldSet.has(id(e)));
  // Each added line can pair with one running line only, so repeated settings (name servers) stay distinct.
  const addedByKey = new Map<string, number[]>();
  added.forEach(([path, line], i) => {
    const key = keyOf(path, line);
    if (key && !headers.has(where(path, line))) addedByKey.set(key, [...(addedByKey.get(key) ?? []), i]);
  });
  const result: ConfigReview = { dropped: [], changed: [], secretsChanged: [], added: [], defaults: [], fromPolicyGroup: [] };
  const paired = new Set<number>();
  for (const [path, line] of oldLines.filter((e) => !newSet.has(id(e)))) {
    const key = headers.has(where(path, line)) ? null : keyOf(path, line);
    if (DEFAULT_LINES.some((p) => p.test(line))) {
      result.defaults.push(maskLine(where(path, line)));
      continue;
    }
    const match = key ? addedByKey.get(key)?.shift() : undefined;
    if (match !== undefined) {
      paired.add(match);
      const masked = maskLine(where(path, line));
      if (masked.endsWith(' ****')) {
        result.secretsChanged.push(HASHED.test(line) ? `${masked} (hash; may only be re-salted)` : masked);
      } else {
        result.changed.push(maskLine(`${where(path, line)} -> ${lastWord(added[match][1])}`));
      }
    } else {
      result.dropped.push(maskLine(where(path, line)));
    }
  }
  added.forEach(([path, line], i) => {
    if (paired.has(i)) return;
    if (!path && NOT_KEPT_LINES.some((p) => p.test(line))) result.defaults.push(line);
    else result.added.push(maskLine(where(path, line)));
  });
  if (fromPolicyGroup) {
    for (const name of ['dropped', 'changed', 'secretsChanged'] as const) {
      result.fromPolicyGroup.push(...result[name].filter((i) => fromPolicyGroup.test(i)));
      result[name] = result[name].filter((i) => !fromPolicyGroup.test(i));
    }
  }
  return result;
}
