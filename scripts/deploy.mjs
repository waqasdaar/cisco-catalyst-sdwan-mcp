// Copies the built server, its .env and production dependencies to a folder outside
// cloud-synced storage, which is where MCP clients should start it from.
// Usage: npm run deploy  (target: $CATALYST_SDWAN_MCP_HOME or ~/mcp-servers/catalyst-sdwan-mcp)
import { execFileSync } from 'child_process';
import { chmodSync, copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { fileURLToPath } from 'url';

const source = fileURLToPath(new URL('..', import.meta.url));
const target = process.env.CATALYST_SDWAN_MCP_HOME || join(homedir(), 'mcp-servers', 'catalyst-sdwan-mcp');

if (!existsSync(join(source, '.env'))) {
  throw new Error('Missing .env in the project; copy .env.example to .env and set the vManage details first.');
}

mkdirSync(target, { recursive: true });
rmSync(join(target, 'build'), { recursive: true, force: true });
cpSync(join(source, 'build'), join(target, 'build'), { recursive: true });

const lockChanged =
  !existsSync(join(target, 'package-lock.json')) ||
  readFileSync(join(source, 'package-lock.json'), 'utf8') !== readFileSync(join(target, 'package-lock.json'), 'utf8');
for (const file of ['package.json', 'package-lock.json']) copyFileSync(join(source, file), join(target, file));
copyFileSync(join(source, '.env'), join(target, '.env'));
chmodSync(join(target, '.env'), 0o600);

if (lockChanged || !existsSync(join(target, 'node_modules'))) {
  execFileSync('npm', ['ci', '--omit=dev', '--no-audit', '--no-fund', '--ignore-scripts'], {
    cwd: target,
    stdio: 'inherit',
    // npm is npm.cmd on Windows, which needs a shell to run.
    shell: process.platform === 'win32',
  });
}

console.log(`Deployed to ${target}`);
console.log(`MCP command: node ${join(target, 'build', 'index.js')}`);
