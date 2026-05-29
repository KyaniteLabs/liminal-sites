import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs/promises';
import http from 'http';
import os from 'os';
import path from 'path';

const TEST_DIR = path.join(os.tmpdir(), `liminal-sites-shitty-prompts-${Date.now()}`);
const CONFIG_PATH = path.join(TEST_DIR, 'config.json');
const SITES_ROOT = path.join(TEST_DIR, 'sites-state');

describe('GUI Shitty Prompts API', () => {
  /** @type {import('http').Server} */
  let server;
  /** @type {number} */
  let port;

  beforeAll(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
    process.env.LIMINAL_CONFIG_PATH = CONFIG_PATH;
    process.env.LIMINAL_SITES_ROOT = SITES_ROOT;
    const { createApp } = await import('../../gui/server.js');
    server = http.createServer(createApp(CONFIG_PATH));
    await new Promise((resolve) => server.listen(0, resolve));
    const address = server.address();
    port = typeof address === 'object' && address ? address.port : 0;
  }, 30000);

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    delete process.env.LIMINAL_CONFIG_PATH;
    delete process.env.LIMINAL_SITES_ROOT;
    await fs.rm(TEST_DIR, { recursive: true, force: true }).catch(() => {});
  });

  beforeEach(async () => {
    await fs.rm(SITES_ROOT, { recursive: true, force: true }).catch(() => {});
  });

  async function get(pathname) {
    const response = await fetch(`http://127.0.0.1:${port}${pathname}`);
    return { status: response.status, body: await response.json() };
  }

  async function post(pathname, body = {}) {
    const response = await fetch(`http://127.0.0.1:${port}${pathname}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
  }

  it('lists pairs without requiring provider credentials', async () => {
    const { status, body } = await get('/api/shitty-prompts/pairs?status=candidate');

    expect(status).toBe(200);
    expect(body).toEqual({ pairs: [] });
  });

  it('supports local curation actions against the store', async () => {
    const pair = {
      id: 'sp_demo1234',
      shitty: 'fix it',
      withContext: 'Fix the landing page hero so the offer, audience, and next action are explicit.',
      failureMode: 'missing-context',
      createdAt: new Date().toISOString(),
      sourceRunId: 'run_demo1234',
      status: 'candidate',
      edits: 0,
    };
    const pairPath = path.join(SITES_ROOT, 'shitty-prompts', 'pairs', `${pair.id}.json`);
    await fs.mkdir(path.dirname(pairPath), { recursive: true });
    await fs.writeFile(pairPath, JSON.stringify(pair), 'utf8');

    expect((await get('/api/shitty-prompts/pairs?status=candidate')).body.pairs).toHaveLength(1);
    expect((await post(`/api/shitty-prompts/pairs/${pair.id}/accept`)).status).toBe(200);

    const approved = await get('/api/shitty-prompts/pairs?status=approved');
    expect(approved.status).toBe(200);
    expect(approved.body.pairs).toMatchObject([{ id: pair.id, status: 'approved' }]);
  });
});
