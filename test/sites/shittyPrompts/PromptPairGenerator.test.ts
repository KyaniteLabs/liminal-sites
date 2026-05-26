import { describe, it, expect } from 'vitest';
import { PromptPairGenerator, type LLMClient } from '../../../src/sites/shittyPrompts/PromptPairGenerator.js';

const mockLLM = (response: string): LLMClient => ({
  complete: async () => response,
});

describe('PromptPairGenerator', () => {
  it('parses a JSON array of pairs from LLM output', async () => {
    const llm = mockLLM(JSON.stringify([
      { shitty: 'make it pop', withContext: 'sharpen the CTA contrast and copy', failureMode: 'vague-aesthetic' },
      { shitty: 'do the thing', withContext: 'execute step 3 of the onboarding spec', failureMode: 'underspecified-task' },
    ]));
    const gen = new PromptPairGenerator(llm);
    const pairs = await gen.generate({ count: 2, runId: 'run_test' });
    expect(pairs).toHaveLength(2);
    expect(pairs[0].shitty).toBe('make it pop');
    expect(pairs[0].sourceRunId).toBe('run_test');
    expect(pairs[0].status).toBe('candidate');
    expect(pairs[0].id).toMatch(/^sp_[a-z0-9]+/);
  });

  it('rejects invalid LLM output (missing failureMode)', async () => {
    const llm = mockLLM(JSON.stringify([{ shitty: 'x', withContext: 'y' }]));
    const gen = new PromptPairGenerator(llm);
    await expect(gen.generate({ count: 1, runId: 'run_test' })).rejects.toThrow();
  });

  it('falls back to extracting JSON from prose-wrapped LLM output', async () => {
    const llm = mockLLM('Here you go:\n```json\n[{"shitty":"x","withContext":"y","failureMode":"vague-aesthetic"}]\n```');
    const gen = new PromptPairGenerator(llm);
    const pairs = await gen.generate({ count: 1, runId: 'run_test' });
    expect(pairs).toHaveLength(1);
  });
});
