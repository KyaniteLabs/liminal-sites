import { describe, it, expect } from 'vitest';
import { shittyPrompts } from '../../../src/sites/index.js';

describe('shittyPrompts barrel', () => {
  it('exports all public symbols', () => {
    expect(shittyPrompts.ShittyPromptsEngine).toBeDefined();
    expect(shittyPrompts.ShittyPromptsStore).toBeDefined();
    expect(shittyPrompts.PromptPairGenerator).toBeDefined();
    expect(shittyPrompts.FrameGenerator).toBeDefined();
    expect(shittyPrompts.CurationApi).toBeDefined();
    expect(shittyPrompts.PromptPairSchema).toBeDefined();
  });
});
