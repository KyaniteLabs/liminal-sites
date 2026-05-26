import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ShittyPromptsStore } from '../../../src/sites/shittyPrompts/ShittyPromptsStore.js';
import type { PromptPair, ShittyFrame } from '../../../src/sites/shittyPrompts/types.js';

const fixturePair = (overrides: Partial<PromptPair> = {}): PromptPair => ({
  id: 'sp_0001',
  shitty: 'make it pop',
  withContext: 'increase visual dominance of the CTA card.',
  failureMode: 'vague-aesthetic',
  createdAt: '2026-05-08T00:00:00.000Z',
  sourceRunId: 'run_abc',
  status: 'candidate',
  edits: 0,
  ...overrides,
});

describe('ShittyPromptsStore', () => {
  let store: ShittyPromptsStore;
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sp-store-'));
    store = new ShittyPromptsStore(tmpDir);
  });

  it('writes and reads a pair round-trip', async () => {
    const pair = fixturePair();
    await store.writePair(pair);
    const got = await store.readPair(pair.id);
    expect(got).toEqual(pair);
  });

  it('lists candidates separately from approved', async () => {
    await store.writePair(fixturePair({ id: 'sp_0001', status: 'candidate' }));
    await store.writePair(fixturePair({ id: 'sp_0002', status: 'approved' }));
    const cands = await store.listByStatus('candidate');
    const apps = await store.listByStatus('approved');
    expect(cands.map((p) => p.id)).toEqual(['sp_0001']);
    expect(apps.map((p) => p.id)).toEqual(['sp_0002']);
  });

  it('updates a pair status (candidate -> approved) preserving edits counter', async () => {
    const pair = fixturePair({ status: 'candidate', edits: 2 });
    await store.writePair(pair);
    await store.updatePairStatus(pair.id, 'approved');
    const got = await store.readPair(pair.id);
    expect(got.status).toBe('approved');
    expect(got.edits).toBe(2);
  });

  it('writes and reads frames by slot', async () => {
    const frame: ShittyFrame = {
      id: 'frame_box_001a',
      slot: 'box',
      svg: '<svg/>',
      seed: 'a',
      createdAt: '2026-05-08T00:00:00.000Z',
    };
    await store.writeFrame(frame);
    const frames = await store.listFramesBySlot('box');
    expect(frames).toHaveLength(1);
    expect(frames[0].id).toBe('frame_box_001a');
  });
});
