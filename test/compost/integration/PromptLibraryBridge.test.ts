/**
 * Tests for PromptLibraryBridge — registers compost prompts.
 */

import { PromptLibraryBridge } from '../../../src/compost/integration/PromptLibraryBridge.js';

describe('PromptLibraryBridge', () => {
  describe('getPrompts()', () => {
    it('returns compost-specific prompt templates', () => {
      const bridge = new PromptLibraryBridge();
      const prompts = bridge.getPrompts();
      expect(prompts.length).toBeGreaterThan(0);

      const names = prompts.map(p => p.name);
      expect(names).toContain('collision-merge');
      expect(names).toContain('offspring-scoring');
      expect(names).toContain('digest-narrative');
    });
  });

  describe('renderPrompt()', () => {
    it('renders with variable interpolation', () => {
      const bridge = new PromptLibraryBridge();
      const rendered = bridge.renderPrompt('collision-merge', {
        domainA: 'ceramics',
        domainB: 'music',
        contentA: 'Glaze dynamics',
        contentB: 'Rhythmic patterns',
      });
      expect(rendered).toContain('ceramics');
      expect(rendered).toContain('music');
      expect(rendered).toContain('Glaze dynamics');
    });
  });
});
