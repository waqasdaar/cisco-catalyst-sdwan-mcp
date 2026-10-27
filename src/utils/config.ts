/*
 * MIT License
 * Configuration utilities for Catalyst SD-WAN MCP Server
 */

export interface VManageConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  useJwt: boolean;
  allowWrite: boolean;
  timeoutMs: number;
  maxConcurrency: number;
}

function positiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer (got "${raw}")`);
  }
  return value;
}

export function loadConfig(): VManageConfig {
  const host = process.env.VMANAGE_HOST;
  const username = process.env.VMANAGE_USERNAME;
  const password = process.env.VMANAGE_PASSWORD;

  if (!host) {
    throw new Error('VMANAGE_HOST environment variable is required');
  }
  if (!username) {
    throw new Error('VMANAGE_USERNAME environment variable is required');
  }
  if (!password) {
    throw new Error('VMANAGE_PASSWORD environment variable is required');
  }

  const port = positiveInt('VMANAGE_PORT', 443);
  const useJwt = process.env.VMANAGE_USE_JWT !== 'false';
  const allowWrite = process.env.VMANAGE_ALLOW_WRITE === 'true';
  // Real-time device queries are proxied through vManage to the device and can take tens of seconds.
  const timeoutMs = positiveInt('VMANAGE_TIMEOUT_MS', 120_000);
  const maxConcurrency = positiveInt('VMANAGE_MAX_CONCURRENCY', 8);

  return {
    host,
    port,
    username,
    password,
    useJwt,
    allowWrite,
    timeoutMs,
    maxConcurrency,
  };
}
