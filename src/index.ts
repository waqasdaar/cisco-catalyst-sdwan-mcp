#!/usr/bin/env node
/**
 * Copyright 2026 Cisco Systems, Inc. and its affiliates
 * * SPDX-License-Identifier: Apache-2.0
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// quiet: dotenv 17 otherwise logs to stdout, which is reserved for MCP protocol messages.
dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true });

/*
 * MIT License
 * Cisco Catalyst SD-WAN MCP Server
 * Communicates with vManage via REST API. SD-WAN routers are queried through vManage only.
 */

import { CatalystSdwanMCPServer } from './server.js';

async function main() {
  const server = new CatalystSdwanMCPServer();
  let stopping = false;
  const stop = () => {
    if (stopping) return;
    stopping = true;
    server.shutdown().finally(() => process.exit(0));
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  // The MCP client closed stdin: the session is over.
  process.stdin.on('end', stop);
  await server.run();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
