/*
 * MIT License
 * Device configurations returned to the assistant: secrets masked.
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

export function maskLine(line: string): string {
  return line.replace(SECRET_VALUE, (_match, word) => `${word} ****`);
}

export function maskConfig(text: string): string {
  return text.split('\n').map(maskLine).join('\n');
}
