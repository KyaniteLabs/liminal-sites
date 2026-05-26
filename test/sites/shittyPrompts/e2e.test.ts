import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ShittyPromptsStore } from '../../../src/sites/shittyPrompts/ShittyPromptsStore.js';
import { ShittyPromptsEngine } from '../../../src/sites/shittyPrompts/ShittyPromptsEngine.js';
import { PromptPairGenerator, type LLMClient } from '../../../src/sites/shittyPrompts/PromptPairGenerator.js';
import { FrameGenerator } from '../../../src/sites/shittyPrompts/FrameGenerator.js';
import { CurationApi } from '../../../src/sites/shittyPrompts/CurationApi.js';
import { exportToTarget } from '../../../scripts/shitty-prompts/export.js';

const llm: LLMClient = {
  complete: async () => JSON.stringify([
    { shitty: 'make it pop', withContext: 'sharpen the CTA contrast', failureMode: 'vague-aesthetic' },
    { shitty: 'do the thing', withContext: 'execute step 3 of onboarding', failureMode: 'underspecified-task' },
  ]),
};

describe('shitty-prompts e2e', () => {
  let storeDir: string;
  let targetDir: string;

  beforeEach(async () => {
    storeDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sp-e2e-store-'));
    targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sp-e2e-target-'));
  });

  it('runs generate -> accept -> export and produces a valid prompts.json', async () => {
    const store = new ShittyPromptsStore(storeDir);
    const engine = new ShittyPromptsEngine({
      store,
      pairGen: new PromptPairGenerator(llm),
      frameGen: new FrameGenerator(),
    });
    const curate = new CurationApi(store);

    const run = await engine.run({ pairCount: 2, provider: 'ollama', model: 'gemma3:4b' });
    expect(run.pairCount).toBe(2);

    const candidates = await store.listByStatus('candidate');
    for (const c of candidates) {
      await curate.accept(c.id);
    }

    await exportToTarget({ storeDir, targetDir });

    const exported = JSON.parse(
      await fs.readFile(path.join(targetDir, 'public/data/prompts.json'), 'utf8'),
    );
    expect(exported).toHaveLength(2);
    expect(exported[0]).toHaveProperty('shitty');
    expect(exported[0]).toHaveProperty('withContext');
    expect(exported[0]).toHaveProperty('failureMode');
    expect(exported[0].status).toBeUndefined();

    const frames = await fs.readdir(path.join(targetDir, 'public/assets/frames'));
    expect(frames.length).toBeGreaterThanOrEqual(6);
  });
});
