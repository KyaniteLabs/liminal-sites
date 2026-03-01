/**
 * Placeholder test for Atelier
 * TDD: This file ensures the test infrastructure is working
 */

import { Atelier, ATELIER_VERSION, defaultConfig } from '../../src/index.js';

describe('Atelier', () => {
  describe('initialization', () => {
    it('should create an Atelier instance with default config', () => {
      const atelier = new Atelier();
      expect(atelier).toBeInstanceOf(Atelier);
    });

    it('should return the config', () => {
      const atelier = new Atelier();
      const config = atelier.getConfig();
      expect(config.name).toBe('atelier');
      expect(config.version).toBe(ATELIER_VERSION);
    });

    it('should merge custom config with defaults', () => {
      const atelier = new Atelier({
        loop: { ...defaultConfig.loop, maxIterations: 50 },
      });
      const config = atelier.getConfig();
      expect(config.loop.maxIterations).toBe(50);
    });
  });
});
