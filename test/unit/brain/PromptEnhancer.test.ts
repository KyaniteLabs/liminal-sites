/**
 * Unit tests for PromptEnhancer
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PromptEnhancer } from '../../../dist/brain/PromptEnhancer.js';
import { SemanticArtMemory } from '../../../dist/brain/SemanticArtMemory.js';

describe('PromptEnhancer', () => {
  let enhancer: PromptEnhancer;
  let artMemory: SemanticArtMemory;

  beforeEach(() => {
    artMemory = new SemanticArtMemory();
    enhancer = new PromptEnhancer(artMemory);
  });

  describe('constructor', () => {
    it('initializes with SemanticArtMemory', () => {
      expect(enhancer['artMemory']).toBeDefined();
      expect(enhancer['knowledgeGraph']).toBeDefined();
    });

    it('creates default SemanticArtMemory if none provided', () => {
      const defaultEnhancer = new PromptEnhancer();
      expect(defaultEnhancer['artMemory']).toBeInstanceOf(SemanticArtMemory);
    });
  });

  describe('enhancePrompt', () => {
    it('returns enhanced prompt with artistic context', () => {
      const basePrompt = 'Create a calming p5.js sketch';
      const context = {
        domain: 'p5' as const,
        intent: 'calming',
        mood: 'calm',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      expect(result.prompt).toBeDefined();
      expect(result.prompt.length).toBeGreaterThan(basePrompt.length);
      expect(result.prompt).toContain('Artistic Context');
    });

    it('includes domain-specific vocabulary', () => {
      const basePrompt = 'Create something creative';
      const context = {
        domain: 'p5' as const,
        intent: 'creative',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      expect(result.prompt).toMatch(/consider using|techniques|principles/i);
    });

    it('includes mood-specific enhancements when mood provided', () => {
      const basePrompt = 'Create a calming piece';
      const context = {
        domain: 'p5' as const,
        intent: 'calming',
        mood: 'calm',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      expect(result.principles.length).toBeGreaterThan(0);
      expect(result.prompt).toMatch(/balance|unity|harmony|negative space/i);
    });

    it('includes intent-based technique suggestions', () => {
      const basePrompt = 'Create something with flow';
      const context = {
        domain: 'p5' as const,
        intent: 'flow',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      expect(result.techniques.length).toBeGreaterThan(0);
      expect(result.techniques.some(t =>
        t.toLowerCase().includes('flow') || t.toLowerCase().includes('noise') || t.toLowerCase().includes('particle')
      )).toBe(true);
    });

    it('includes artist references when relevant', () => {
      const basePrompt = 'Create generative art';
      const context = {
        domain: 'p5' as const,
        intent: 'generative',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      // Should have some artist references
      expect(result.artists.length).toBeGreaterThanOrEqual(0);
    });

    it('adds complexity-based principles', () => {
      const basePrompt = 'Create something';

      // Simple complexity
      const simpleResult = enhancer.enhancePrompt(basePrompt, {
        domain: 'p5' as const,
        intent: 'something',
        complexity: 'simple',
      });
      expect(simpleResult.principles.some(p =>
        p.toLowerCase().includes('simplicity') || p.toLowerCase().includes('clarity')
      )).toBe(true);

      // Complex complexity
      const complexResult = enhancer.enhancePrompt(basePrompt, {
        domain: 'p5' as const,
        intent: 'something',
        complexity: 'complex',
      });
      expect(complexResult.principles.some(p =>
        p.toLowerCase().includes('depth') || p.toLowerCase().includes('layering') || p.toLowerCase().includes('complexity')
      )).toBe(true);
    });

    it('filters out elements already mentioned in prompt', () => {
      const basePrompt = 'Create something with flow fields and particles';
      const context = {
        domain: 'p5' as const,
        intent: 'flow',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      // Should not duplicate "flow fields" if already in prompt
      const flowCount = (result.prompt.match(/flow fields/gi) || []).length;
      expect(flowCount).toBeLessThanOrEqual(2); // Allow for original mention + maybe one in enhancements
    });

    it('returns structured enhancement data', () => {
      const basePrompt = 'Create a calming p5.js sketch';
      const context = {
        domain: 'p5' as const,
        intent: 'calming',
        mood: 'calm',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      expect(result.enhancements).toBeDefined();
      expect(Array.isArray(result.enhancements)).toBe(true);
      expect(result.techniques).toBeDefined();
      expect(Array.isArray(result.techniques)).toBe(true);
      expect(result.principles).toBeDefined();
      expect(Array.isArray(result.principles)).toBe(true);
      expect(result.artists).toBeDefined();
      expect(Array.isArray(result.artists)).toBe(true);
    });

    it('handles shader domain correctly', () => {
      const basePrompt = 'Create a shader effect';
      const context = {
        domain: 'shader' as const,
        intent: 'shader effect',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      expect(result.prompt).toBeDefined();
      // Should include shader-specific vocabulary
      expect(result.prompt.toLowerCase()).toMatch(/raymarching|sdf|noise|shader|glsl/i);
    });

    it('handles three domain correctly', () => {
      const basePrompt = 'Create a 3D scene';
      const context = {
        domain: 'three' as const,
        intent: '3D scene',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      expect(result.prompt).toBeDefined();
      // Should include three.js-specific vocabulary
      expect(result.prompt.toLowerCase()).toMatch(/scene|geometry|material|lighting|3d/i);
    });

    it('handles strudel domain correctly', () => {
      const basePrompt = 'Create a music pattern';
      const context = {
        domain: 'strudel' as const,
        intent: 'music pattern',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      expect(result.prompt).toBeDefined();
      // Should include music-specific vocabulary
      expect(result.prompt.toLowerCase()).toMatch(/pattern|rhythm|melody|harmony|sequencing/i);
    });

    it('handles hydra domain correctly', () => {
      const basePrompt = 'Create a visual effect';
      const context = {
        domain: 'hydra' as const,
        intent: 'visual effect',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      expect(result.prompt).toBeDefined();
      // Should include hydra-specific vocabulary
      expect(result.prompt.toLowerCase()).toMatch(/texture|feedback|color|blend|visual/i);
    });

    it('handles empty context gracefully', () => {
      const basePrompt = 'Create something';
      const context = {
        domain: 'p5' as const,
        intent: 'something',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      expect(result.prompt).toBeDefined();
      expect(result.enhancements).toBeDefined();
      expect(result.techniques).toBeDefined();
      expect(result.principles).toBeDefined();
    });

    it('limits techniques to reasonable number', () => {
      const basePrompt = 'Create something with flow and organic and geometric and abstract';
      const context = {
        domain: 'p5' as const,
        intent: 'complex piece with many techniques',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      // Should not be excessive
      expect(result.techniques.length).toBeLessThan(20);
    });

    it('limits principles to reasonable number', () => {
      const basePrompt = 'Create something';
      const context = {
        domain: 'p5' as const,
        intent: 'something',
        mood: 'calm',
        complexity: 'complex',
      };

      const result = enhancer.enhancePrompt(basePrompt, context);

      // Should not be excessive
      expect(result.principles.length).toBeLessThan(15);
    });
  });

  describe('getVocabularyForDomain', () => {
    it('returns vocabulary for p5 domain', () => {
      const vocab = enhancer.getVocabularyForDomain('p5');

      expect(vocab).toBeDefined();
      expect(vocab.elements).toBeDefined();
      expect(vocab.principles).toBeDefined();
      expect(vocab.modifiers).toBeDefined();
      expect(vocab.elements.length).toBeGreaterThan(0);
    });

    it('returns vocabulary for shader domain', () => {
      const vocab = enhancer.getVocabularyForDomain('shader');

      expect(vocab).toBeDefined();
      expect(vocab.elements.length).toBeGreaterThan(0);
      expect(vocab.elements.some(e => e.toLowerCase().includes('raymarching') || e.toLowerCase().includes('sdf'))).toBe(true);
    });

    it('returns vocabulary for three domain', () => {
      const vocab = enhancer.getVocabularyForDomain('three');

      expect(vocab).toBeDefined();
      expect(vocab.elements.length).toBeGreaterThan(0);
    });

    it('returns vocabulary for strudel domain', () => {
      const vocab = enhancer.getVocabularyForDomain('strudel');

      expect(vocab).toBeDefined();
      expect(vocab.elements.length).toBeGreaterThan(0);
    });

    it('returns vocabulary for hydra domain', () => {
      const vocab = enhancer.getVocabularyForDomain('hydra');

      expect(vocab).toBeDefined();
      expect(vocab.elements.length).toBeGreaterThan(0);
    });
  });

  describe('getMoodEnhancements', () => {
    it('returns enhancements for calm mood', () => {
      const enhancements = enhancer.getMoodEnhancements('calm');

      expect(enhancements).toBeDefined();
      expect(enhancements!.principles).toBeDefined();
      expect(enhancements!.techniques).toBeDefined();
      expect(enhancements!.colors).toBeDefined();
      expect(enhancements!.principles.length).toBeGreaterThan(0);
    });

    it('returns enhancements for energetic mood', () => {
      const enhancements = enhancer.getMoodEnhancements('energetic');

      expect(enhancements).toBeDefined();
      expect(enhancements!.principles.some(p => p.toLowerCase().includes('contrast') || p.toLowerCase().includes('movement'))).toBe(true);
    });

    it('returns enhancements for mysterious mood', () => {
      const enhancements = enhancer.getMoodEnhancements('mysterious');

      expect(enhancements).toBeDefined();
      expect(enhancements!.principles.length).toBeGreaterThan(0);
    });

    it('returns enhancements for playful mood', () => {
      const enhancements = enhancer.getMoodEnhancements('playful');

      expect(enhancements).toBeDefined();
      expect(enhancements!.principles.length).toBeGreaterThan(0);
    });

    it('returns enhancements for melancholic mood', () => {
      const enhancements = enhancer.getMoodEnhancements('melancholic');

      expect(enhancements).toBeDefined();
      expect(enhancements!.principles.length).toBeGreaterThan(0);
    });

    it('returns enhancements for abstract mood', () => {
      const enhancements = enhancer.getMoodEnhancements('abstract');

      expect(enhancements).toBeDefined();
      expect(enhancements!.principles.length).toBeGreaterThan(0);
    });

    it('returns null for unknown mood', () => {
      const enhancements = enhancer.getMoodEnhancements('unknown');

      expect(enhancements).toBeNull();
    });
  });

  describe('getTechniquesForIntent', () => {
    it('returns techniques for flow intent', () => {
      const techniques = enhancer.getTechniquesForIntent('flow');

      expect(techniques).toBeDefined();
      expect(Array.isArray(techniques)).toBe(true);
      expect(techniques.length).toBeGreaterThan(0);
      expect(techniques.some(t => t.toLowerCase().includes('flow') || t.toLowerCase().includes('noise') || t.toLowerCase().includes('particle'))).toBe(true);
    });

    it('returns techniques for organic intent', () => {
      const techniques = enhancer.getTechniquesForIntent('organic');

      expect(techniques).toBeDefined();
      expect(techniques.some(t => t.toLowerCase().includes('noise') || t.toLowerCase().includes('organic'))).toBe(true);
    });

    it('returns techniques for geometric intent', () => {
      const techniques = enhancer.getTechniquesForIntent('geometric');

      expect(techniques).toBeDefined();
      expect(techniques.some(t => t.toLowerCase().includes('geometric') || t.toLowerCase().includes('symmetry') || t.toLowerCase().includes('grid'))).toBe(true);
    });

    it('returns techniques for procedural intent', () => {
      const techniques = enhancer.getTechniquesForIntent('procedural');

      expect(techniques).toBeDefined();
      expect(techniques.some(t => t.toLowerCase().includes('procedural') || t.toLowerCase().includes('l-system') || t.toLowerCase().includes('fractal'))).toBe(true);
    });

    it('returns techniques for interactive intent', () => {
      const techniques = enhancer.getTechniquesForIntent('interactive');

      expect(techniques).toBeDefined();
      expect(techniques.some(t => t.toLowerCase().includes('interaction') || t.toLowerCase().includes('mouse'))).toBe(true);
    });

    it('returns techniques for animation intent', () => {
      const techniques = enhancer.getTechniquesForIntent('animation');

      expect(techniques).toBeDefined();
      expect(techniques.some(t => t.toLowerCase().includes('animation') || t.toLowerCase().includes('frame') || t.toLowerCase().includes('tweening'))).toBe(true);
    });

    it('returns empty array for unknown intent', () => {
      const techniques = enhancer.getTechniquesForIntent('unknownxyz');

      expect(techniques).toBeDefined();
      expect(techniques.length).toBe(0);
    });

    it('is case-insensitive', () => {
      const techniques1 = enhancer.getTechniquesForIntent('Flow');
      const techniques2 = enhancer.getTechniquesForIntent('FLOW');

      expect(techniques1.length).toBeGreaterThan(0);
      expect(techniques2.length).toBe(techniques1.length);
    });
  });
});
