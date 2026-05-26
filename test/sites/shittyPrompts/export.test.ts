import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ShittyPromptsStore } from '../../../src/sites/shittyPrompts/ShittyPromptsStore.js';
import { exportToTarget } from '../../../scripts/shitty-prompts/export.js';
import type { PromptPair, ShittyFrame } from '../../../src/sites/shittyPrompts/types.js';

describe('engine:export', () => {
  let storeDir: string;
  let targetDir: string;

  beforeEach(async () => {
    storeDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sp-store-'));
    targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sp-target-'));
    const store = new ShittyPromptsStore(storeDir);

    const pair: PromptPair = {
      id: 'sp_aaaa',
      shitty: 'make it pop',
      withContext: 'sharpen contrast',
      failureMode: 'vague-aesthetic',
      createdAt: '2026-05-08T00:00:00.000Z',
      sourceRunId: 'run_abc',
      status: 'approved',
      edits: 0,
    };
    await store.writePair(pair);

    const frame: ShittyFrame = {
      id: 'frame_box_aaaa',
      slot: 'box',
      svg: '<svg/>',
      seed: 'a',
      createdAt: '2026-05-08T00:00:00.000Z',
    };
    await store.writeFrame(frame);
  });

  it('writes prompts.json containing only approved pairs', async () => {
    await exportToTarget({ storeDir, targetDir });
    const json = JSON.parse(await fs.readFile(path.join(targetDir, 'public/data/prompts.json'), 'utf8'));
    expect(json).toHaveLength(1);
    expect(json[0].id).toBe('sp_aaaa');
    expect(json[0].status).toBeUndefined();
  });

  it('writes frame SVG files into public/assets/frames/', async () => {
    await exportToTarget({ storeDir, targetDir });
    const files = await fs.readdir(path.join(targetDir, 'public/assets/frames'));
    expect(files).toContain('frame_box_aaaa.svg');
  });

  it('is idempotent (re-running produces identical output)', async () => {
    await exportToTarget({ storeDir, targetDir });
    const a = await fs.readFile(path.join(targetDir, 'public/data/prompts.json'), 'utf8');
    await exportToTarget({ storeDir, targetDir });
    const b = await fs.readFile(path.join(targetDir, 'public/data/prompts.json'), 'utf8');
    expect(a).toEqual(b);
  });
});
