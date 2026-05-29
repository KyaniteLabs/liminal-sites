import { describe, it, expect } from 'vitest';
import { shittyPrompts } from '../../../src/sites/index.js';

describe('shittyPrompts barrel', () => {
  it('exports all public symbols', () => {
    expect(typeof shittyPrompts.ShittyPromptsEngine).toBe('function');
    expect(typeof shittyPrompts.ShittyPromptsStore).toBe('function');
    expect(typeof shittyPrompts.PromptPairGenerator).toBe('function');
    expect(typeof shittyPrompts.FrameGenerator).toBe('function');
    expect(typeof shittyPrompts.CurationApi).toBe('function');
    expect(shittyPrompts.PromptPairSchema.safeParse).toEqual(expect.any(Function));
  });
});
