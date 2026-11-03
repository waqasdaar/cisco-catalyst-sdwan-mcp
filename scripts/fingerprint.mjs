// Prints the SHA-256 fingerprint of the certificate SD-WAN Manager presents, to pin it with VMANAGE_TLS_FINGERPRINT.
// Usage: npm run fingerprint [-- host[:port]]   (default: VMANAGE_HOST / VMANAGE_PORT of .env)
// Compare it with the fingerprint shown by SD-WAN Manager or your certificate records before you trust it.
import dotenv from 'dotenv';
import { isIP } from 'net';
import { connect } from 'tls';
import { fileURLToPath } from 'url';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });
const arg = process.argv[2] ?? `${process.env.VMANAGE_HOST ?? ''}:${process.env.VMANAGE_PORT ?? '443'}`;
const [host, port = '443'] = arg.replace(/^https?:\/\//, '').split('/')[0].split(':');
if (!host) {
  console.error('No host: pass host[:port] or set VMANAGE_HOST');
  process.exit(1);
}
const socket = connect({ host, port: Number(port), ...(isIP(host) ? {} : { servername: host }), rejectUnauthorized: false, timeout: 10_000 }, () => {
  const cert = socket.getPeerCertificate();
  console.log(`subject:     ${cert.subject?.CN ?? '?'}  (issuer: ${cert.issuer?.CN ?? '?'})`);
  console.log(`valid until: ${cert.valid_to}`);
  console.log(`trusted:     ${socket.authorized ? 'yes, by a CA Node knows' : `no (${socket.authorizationError})`}`);
  console.log(`VMANAGE_TLS_FINGERPRINT=${cert.fingerprint256}`);
  socket.end();
});
socket.on('timeout', () => { console.error(`No answer from ${host}:${port}`); process.exit(1); });
socket.on('error', (e) => { console.error(e.message); process.exit(1); });
