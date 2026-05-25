import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ShittyPromptsEngine } from '../../../src/sites/shittyPrompts/ShittyPromptsEngine.js';
import { ShittyPromptsStore } from '../../../src/sites/shittyPrompts/ShittyPromptsStore.js';
import { PromptPairGenerator, type LLMClient } from '../../../src/sites/shittyPrompts/PromptPairGenerator.js';
import { FrameGenerator } from '../../../src/sites/shittyPrompts/FrameGenerator.js';

const fixtureLLM: LLMClient = {
  complete: async () => JSON.stringify([
    { shitty: 'make it pop', withContext: 'sharpen the CTA contrast', failureMode: 'vague-aesthetic' },
    { shitty: 'do the thing', withContext: 'run the onboarding script', failureMode: 'underspecified-task' },
  ]),
};

describe('ShittyPromptsEngine', () => {
  let tmpDir: string;
  let engine: ShittyPromptsEngine;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sp-engine-'));
    const store = new ShittyPromptsStore(tmpDir);
    engine = new ShittyPromptsEngine({
      store,
      pairGen: new PromptPairGenerator(fixtureLLM),
      frameGen: new FrameGenerator(),
    });
  });

  it('runs end-to-end and persists candidates + frames', async () => {
    const run = await engine.run({ pairCount: 2, provider: 'ollama', model: 'gemma3:4b' });
    expect(run.pairCount).toBe(2);
    expect(run.frameCount).toBe(6);
    expect(run.runId).toMatch(/^run_/);
    const store = new ShittyPromptsStore(tmpDir);
    const candidates = await store.listByStatus('candidate');
    expect(candidates).toHaveLength(2);
  });
});
