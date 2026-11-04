/*
 * MIT License
 * deploy_template_migration state that outlives the server process, and a per-device lock shared by every server
 * process on this machine (VS Code and other MCP clients each start their own). One file per device under
 * VMANAGE_STATE_DIR (default ~/.local/state/cisco-catalyst-sdwan-mcp), readable by the user only. The saved running
 * config is masked before it is written: no secret reaches the disk.
 */

import { mkdir, open, readFile, rename, stat, unlink, writeFile } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';

export interface SavedMigration {
  configGroup: { id: string; name: string };
  policyGroup?: { id: string; name: string };
  before: string; // masked running config from before the migration
  bfdBefore: number | null; // null: no baseline (state rebuilt without one)
  savedAt: string;
}

// Longer than the longest step: a 900 s deploy wait plus its reads.
const LOCK_STALE_MS = 20 * 60_000;
// A lock file younger than this may still be being written by its owner.
const LOCK_WRITE_GRACE_MS = 5_000;

function alive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM';
  }
}

export class MigrationStore {
  private ready?: Promise<string>;

  constructor(private readonly dir = process.env.VMANAGE_STATE_DIR || join(homedir(), '.local', 'state', 'cisco-catalyst-sdwan-mcp')) {}

  private async path(uuid: string, ext: 'json' | 'lock'): Promise<string> {
    this.ready ??= mkdir(this.dir, { recursive: true, mode: 0o700 })
      .then(() => this.dir)
      .catch((error: Error) => {
        this.ready = undefined;
        throw new Error(`Migration state directory ${this.dir} is not writable (${error.message}); set VMANAGE_STATE_DIR to a writable directory`);
      });
    return join(await this.ready, `migration-${uuid.replace(/[^\w-]/g, '_')}.${ext}`);
  }

  async load(uuid: string): Promise<SavedMigration | undefined> {
    try {
      return JSON.parse(await readFile(await this.path(uuid, 'json'), 'utf8')) as SavedMigration;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT' || error instanceof SyntaxError) return undefined;
      throw error;
    }
  }

  /** Written to a temporary file and renamed, so a reader never sees half a state. */
  async save(uuid: string, state: SavedMigration): Promise<void> {
    const file = await this.path(uuid, 'json');
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(state), { mode: 0o600 });
    await rename(tmp, file);
  }

  /** Runs `fn` holding the device's lock; refuses while another step for the device runs in any server process. */
  async withLock<T>(uuid: string, label: string, step: string, fn: () => Promise<T>): Promise<T> {
    const file = await this.path(uuid, 'lock');
    await this.acquire(file, label, step);
    try {
      return await fn();
    } finally {
      await unlink(file).catch(() => undefined);
    }
  }

  private async acquire(file: string, label: string, step: string): Promise<void> {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const handle = await open(file, 'wx', 0o600);
        await handle.writeFile(JSON.stringify({ pid: process.pid, since: Date.now(), step }));
        await handle.close();
        return;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      }
      const holder = await readFile(file, 'utf8').then((t) => JSON.parse(t) as { pid: number; since: number; step: string }).catch(() => undefined);
      const fresh = holder
        ? alive(holder.pid) && Date.now() - holder.since < LOCK_STALE_MS
        : Date.now() - ((await stat(file).catch(() => undefined))?.mtimeMs ?? 0) < LOCK_WRITE_GRACE_MS;
      if (fresh) {
        const who = holder ? `step "${holder.step}" since ${new Date(holder.since).toISOString()}` : 'another step';
        throw new Error(`${label}: ${who} of this device's migration is still running; wait for it to finish, then call again. Nothing was changed.`);
      }
      // The holder crashed or outlived the longest step: the lock is stale.
      await unlink(file).catch(() => undefined);
    }
    throw new Error(`${label}: could not lock the device's migration; call again`);
  }
}
