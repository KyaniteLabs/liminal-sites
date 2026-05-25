import { describe, it, expect } from 'vitest';
import { PromptPairSchema, ShittyFrameSchema, ShittyPromptsRunSchema, FailureModeSchema } from '../../../src/sites/shittyPrompts/types.js';

describe('shittyPrompts types', () => {
  it('validates a well-formed PromptPair', () => {
    const result = PromptPairSchema.safeParse({
      id: 'sp_0001',
      shitty: 'make it pop',
      withContext: 'increase the CTA card visual dominance: stronger button contrast, larger headline, tighter copy.',
      failureMode: 'vague-aesthetic',
      createdAt: '2026-05-08T00:00:00.000Z',
      sourceRunId: 'run_abc',
      status: 'candidate',
    });
    expect(result.success).toBe(true);
  });

  it('rejects PromptPair with empty shitty field', () => {
    const result = PromptPairSchema.safeParse({
      id: 'sp_0001',
      shitty: '',
      withContext: 'x',
      failureMode: 'vague-aesthetic',
      createdAt: '2026-05-08T00:00:00.000Z',
      sourceRunId: 'run_abc',
      status: 'candidate',
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown failureMode', () => {
    expect(FailureModeSchema.safeParse('not-a-real-mode').success).toBe(false);
  });

  it('validates a ShittyFrame', () => {
    const result = ShittyFrameSchema.safeParse({
      id: 'frame_box_001a',
      slot: 'box',
      svg: '<svg></svg>',
      seed: 'abc',
      createdAt: '2026-05-08T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('validates a ShittyPromptsRun envelope', () => {
    const result = ShittyPromptsRunSchema.safeParse({
      runId: 'run_abc1',
      provider: 'ollama',
      model: 'gemma3:4b',
      pairCount: 12,
      frameCount: 4,
      createdAt: '2026-05-08T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });
});
