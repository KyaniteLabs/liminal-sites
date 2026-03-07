/**
 * RalphLoop tests - Loop start + context (seed, no-placeholder fallback)
 * Uses ContextAccumulation.getHistory() to assert on usedPrompt (no jest mocks).
 */
import { RalphLoop } from '../../dist/core/RalphLoop.js';
import { ContextAccumulation } from '../../dist/core/ContextAccumulation.js';
import path from 'path';
import os from 'os';

const TEST_GALLERY_DIR = path.join(os.tmpdir(), 'atelier-ralph-loop-test');

describe('RalphLoop', () => {
  beforeEach(() => {
    RalphLoop.reset();
    delete process.env.INCEPTION_API_KEY;
    delete process.env.ATELIER_LLM_API_KEY;
  });

  describe('seed and context', () => {
    it('run with seedCode produces iteration 1 context that includes the seed text', async () => {
      const seedCode = 'function setup() { createCanvas(400, 400); }';
      await RalphLoop.run('make it colorful', {
        maxIterations: 1,
        galleryDir: TEST_GALLERY_DIR,
        project: 'seed-test',
        seedCode
      });

      const history = ContextAccumulation.getHistory() as { usedPrompt: string }[];
      expect(history).toHaveLength(1);
      const usedPrompt = history[0].usedPrompt;
      expect(usedPrompt).toContain("Here is the seed/template; improve it toward the user's goal.");
      expect(usedPrompt).toContain('Seed:\n');
      expect(usedPrompt).toContain(seedCode);
    });

    it('run with seedTemplate produces iteration 1 context that includes the template', async () => {
      const seedTemplate = 'template: minimal p5 sketch';
      await RalphLoop.run('add particles', {
        maxIterations: 1,
        galleryDir: TEST_GALLERY_DIR,
        project: 'template-test',
        seedTemplate
      });

      const history = ContextAccumulation.getHistory() as { usedPrompt: string }[];
      expect(history).toHaveLength(1);
      const usedPrompt = history[0].usedPrompt;
      expect(usedPrompt).toContain("Here is the seed/template; improve it toward the user's goal.");
      expect(usedPrompt).toContain(seedTemplate);
    });
  });

  describe('no {{context}} placeholder fallback', () => {
    it('prompt with NO {{context}} placeholder still results in usedPrompt containing "Context from previous iterations"', async () => {
      const promptWithNoPlaceholder = 'Just draw a circle.';
      await RalphLoop.run(promptWithNoPlaceholder, {
        maxIterations: 1,
        galleryDir: TEST_GALLERY_DIR,
        project: 'no-context-placeholder-test'
      });

      const history = ContextAccumulation.getHistory() as { usedPrompt: string }[];
      expect(history).toHaveLength(1);
      const usedPrompt = history[0].usedPrompt;
      expect(usedPrompt).toContain('Context from previous iterations');
      expect(usedPrompt).toContain(promptWithNoPlaceholder);
    });
  });
});
