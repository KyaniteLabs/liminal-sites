/**
 * Unit tests for LIR configuration defaults.
 */

import { describe, it, expect } from 'vitest';
import { buildDefaults, mergeConfig } from '../../../src/compost/defaults.js';
import type { UserCompostConfig } from '../../../src/compost/defaults.js';

describe('LIR Config Defaults', () => {
  describe('buildDefaults()', () => {
    it('returns config with lirEnabled: false (opt-in)', () => {
      const config = buildDefaults();
      expect(config.lirEnabled).toBe(false);
    });

    it('returns lirSummaryBudget: 500', () => {
      const config = buildDefaults();
      expect(config.lirSummaryBudget).toBe(500);
    });

    it('returns lirBatchSize: 10', () => {
      const config = buildDefaults();
      expect(config.lirBatchSize).toBe(10);
    });

    it('returns lirMaxSymbolsPerFile: 200', () => {
      const config = buildDefaults();
      expect(config.lirMaxSymbolsPerFile).toBe(200);
    });
  });

  describe('mergeConfig()', () => {
    it('overrides default lirEnabled when user provides it', () => {
      const userConfig: UserCompostConfig = {
        lirEnabled: true,
      };
      const merged = mergeConfig(userConfig);
      expect(merged.lirEnabled).toBe(true);
    });

    it('overrides default lirSummaryBudget when user provides it', () => {
      const userConfig: UserCompostConfig = {
        lirSummaryBudget: 1000,
      };
      const merged = mergeConfig(userConfig);
      expect(merged.lirSummaryBudget).toBe(1000);
    });

    it('overrides default lirBatchSize when user provides it', () => {
      const userConfig: UserCompostConfig = {
        lirBatchSize: 20,
      };
      const merged = mergeConfig(userConfig);
      expect(merged.lirBatchSize).toBe(20);
    });

    it('overrides default lirMaxSymbolsPerFile when user provides it', () => {
      const userConfig: UserCompostConfig = {
        lirMaxSymbolsPerFile: 500,
      };
      const merged = mergeConfig(userConfig);
      expect(merged.lirMaxSymbolsPerFile).toBe(500);
    });

    it('merges multiple LIR fields together', () => {
      const userConfig: UserCompostConfig = {
        lirEnabled: true,
        lirBatchSize: 15,
      };
      const merged = mergeConfig(userConfig);
      expect(merged.lirEnabled).toBe(true);
      expect(merged.lirBatchSize).toBe(15);
      expect(merged.lirSummaryBudget).toBe(500); // default preserved
      expect(merged.lirMaxSymbolsPerFile).toBe(200); // default preserved
    });
  });

  describe('Backward Compatibility', () => {
    it('existing configs without LIR fields still work', () => {
      const oldConfig: UserCompostConfig = {
        heapDir: 'custom/heap/',
        soupEnabled: false,
      };
      const merged = mergeConfig(oldConfig);
      expect(merged.heapDir).toBe('custom/heap/');
      expect(merged.soupEnabled).toBe(false);
      expect(merged.lirEnabled).toBe(false);
      expect(merged.lirSummaryBudget).toBe(500);
      expect(merged.lirBatchSize).toBe(10);
      expect(merged.lirMaxSymbolsPerFile).toBe(200);
    });

    it('empty user config returns all LIR defaults', () => {
      const merged = mergeConfig({});
      expect(merged.lirEnabled).toBe(false);
      expect(merged.lirSummaryBudget).toBe(500);
      expect(merged.lirBatchSize).toBe(10);
      expect(merged.lirMaxSymbolsPerFile).toBe(200);
    });

    it('no user config returns all LIR defaults', () => {
      const merged = mergeConfig();
      expect(merged.lirEnabled).toBe(false);
      expect(merged.lirSummaryBudget).toBe(500);
      expect(merged.lirBatchSize).toBe(10);
      expect(merged.lirMaxSymbolsPerFile).toBe(200);
    });
  });
});
