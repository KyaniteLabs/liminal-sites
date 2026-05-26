import { describe, it, expect } from 'vitest';
import { FrameGenerator } from '../../../src/sites/shittyPrompts/FrameGenerator.js';

describe('FrameGenerator', () => {
  it('produces one frame per slot with deterministic seeds', async () => {
    const gen = new FrameGenerator();
    const frames = await gen.generateOnePerSlot({ runId: 'run_test', seed: 'fixedseed' });
    expect(frames).toHaveLength(6);
    const slots = new Set(frames.map((f) => f.slot));
    expect(slots.size).toBe(6);
  });

  it('embeds a {{PROMPT_TEXT}} placeholder in every output', async () => {
    const gen = new FrameGenerator();
    const frames = await gen.generateOnePerSlot({ runId: 'run_test', seed: 'a' });
    for (const frame of frames) {
      expect(frame.svg).toContain('{{PROMPT_TEXT}}');
    }
  });
});
