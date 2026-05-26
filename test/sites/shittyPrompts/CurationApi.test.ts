import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ShittyPromptsStore } from '../../../src/sites/shittyPrompts/ShittyPromptsStore.js';
import { CurationApi } from '../../../src/sites/shittyPrompts/CurationApi.js';
import type { PromptPair } from '../../../src/sites/shittyPrompts/types.js';

const fixturePair = (overrides: Partial<PromptPair> = {}): PromptPair => ({
  id: 'sp_test01',
  shitty: 'make it pop',
  withContext: 'increase visual dominance',
  failureMode: 'vague-aesthetic',
  createdAt: '2026-05-08T00:00:00.000Z',
  sourceRunId: 'run_abc',
  status: 'candidate',
  edits: 0,
  ...overrides,
});

describe('CurationApi', () => {
  let tmpDir: string;
  let store: ShittyPromptsStore;
  let api: CurationApi;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sp-curate-'));
    store = new ShittyPromptsStore(tmpDir);
    api = new CurationApi(store);
    await store.writePair(fixturePair());
  });

  it('accept moves pair to approved', async () => {
    await api.accept('sp_test01');
    const pair = await store.readPair('sp_test01');
    expect(pair.status).toBe('approved');
  });

  it('reject moves pair to rejected', async () => {
    await api.reject('sp_test01');
    const pair = await store.readPair('sp_test01');
    expect(pair.status).toBe('rejected');
  });

  it('edit updates fields and bumps edits counter', async () => {
    await api.edit('sp_test01', { shitty: 'fix the thing', withContext: 'apply patch /v1/spec.md' });
    const pair = await store.readPair('sp_test01');
    expect(pair.shitty).toBe('fix the thing');
    expect(pair.withContext).toBe('apply patch /v1/spec.md');
    expect(pair.edits).toBe(1);
    expect(pair.status).toBe('candidate');
  });
});
