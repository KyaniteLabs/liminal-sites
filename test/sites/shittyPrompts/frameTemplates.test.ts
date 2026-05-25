import { describe, it, expect } from 'vitest';
import { loadFrameTemplate, allFrameSlots } from '../../../src/sites/shittyPrompts/frameTemplates.js';

describe('frameTemplates', () => {
  it('exposes all 6 slot templates', () => {
    expect(allFrameSlots()).toEqual(['box', 'corners', 'halftone', 'glitch', 'rule', 'crosshatch']);
  });

  it('loads each slot template as an SVG string', async () => {
    for (const slot of allFrameSlots()) {
      const svg = await loadFrameTemplate(slot);
      expect(svg).toMatch(/^<svg/);
      expect(svg).toContain('</svg>');
    }
  });
});
