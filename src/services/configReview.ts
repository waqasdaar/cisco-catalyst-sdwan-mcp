/*
 * MIT License
 * Device configurations returned to the assistant: secrets masked.
 */

/** A secret's keyword and the word after it: passwords, user secrets, keys (SIG partner and API keys, IKE
 *  pre-shared keys) and SNMP communities. Hashed secrets are masked too, as they can be cracked offline. */
const SECRET_VALUE =
  /(?<![\w-])((?:secret|password|key|key-string|pre-shared-key|partner-key|api-key|community)(?: \d)?)\s+\S+/gi;

export function maskLine(line: string): string {
  return line.replace(SECRET_VALUE, (_match, word) => `${word} ****`);
}

export function maskConfig(text: string): string {
  return text.split('\n').map(maskLine).join('\n');
}
