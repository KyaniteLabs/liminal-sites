/**
 * Tests for CollisionEngine — cross-domain collision pairing.
 */

import { jest } from '@jest/globals';
import { CollisionEngine } from '../../src/compost/CollisionEngine.js';
import { mergeConfig } from '../../src/compost/defaults.js';
import type { CompostFragment } from '../../src/compost/types.js';

function makeFragment(overrides: Partial<CompostFragment> = {}): CompostFragment {
  return {
    id: `frag-${Math.random().toString(36).slice(2, 8)}`,
    source: '/test/file.txt',
    domain: 'ceramics',
    layer: 'semantic',
    content: 'Glaze dynamics in kiln firing.',
    metadata: {
      fileType: 'txt',
      timestamp: '2026-03-20T12:00:00Z',
      hash: 'a'.repeat(64),
      size: 100,
      extractedAt: '2026-03-20T00:00:00Z',
    },
    tags: ['ceramics'],
    ...overrides,
  };
}

describe('CollisionEngine', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockLLM: any;
  let engine: CollisionEngine;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockFn: any = jest.fn();
    mockFn.mockResolvedValue({ success: true, code: 'Merged idea' });
    mockLLM = { generate: mockFn };
    engine = new CollisionEngine(mergeConfig(), mockLLM);
  });

  describe('findTimestampCollisions()', () => {
    it('pairs files within 1 hour from different domains', () => {
      const fragments = [
        makeFragment({ domain: 'ceramics', metadata: { ...makeFragment().metadata, timestamp: '2026-03-20T12:00:00Z' } }),
        makeFragment({ domain: 'music', metadata: { ...makeFragment().metadata, timestamp: '2026-03-20T12:30:00Z' } }),
        makeFragment({ domain: 'ceramics', metadata: { ...makeFragment().metadata, timestamp: '2026-03-20T15:00:00Z' } }),
      ];
      const pairs = engine.findTimestampCollisions(fragments);
      expect(pairs.length).toBeGreaterThanOrEqual(1);
      expect(pairs[0].strategy).toBe('timestamp');
    });
  });

  describe('findSizeCollisions()', () => {
    it('pairs files of similar byte size from different types', () => {
      const fragments = [
        makeFragment({ domain: 'image', metadata: { ...makeFragment().metadata, size: 1024 } }),
        makeFragment({ domain: 'audio', metadata: { ...makeFragment().metadata, size: 1025 } }),
        makeFragment({ domain: 'text', metadata: { ...makeFragment().metadata, size: 50000 } }),
      ];
      const pairs = engine.findSizeCollisions(fragments);
      expect(pairs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('findTagCollisions()', () => {
    it('pairs fragments sharing tags from unrelated domains', () => {
      const fragments = [
        makeFragment({ domain: 'ceramics', tags: ['experimental'] }),
        makeFragment({ domain: 'music', tags: ['experimental'] }),
      ];
      const pairs = engine.findTagCollisions(fragments);
      expect(pairs.length).toBeGreaterThanOrEqual(1);
      expect(pairs[0].strategy).toBe('tag');
    });
  });

  describe('findDomainOpposites()', () => {
    it('pairs most-different domains', () => {
      const fragments = [
        makeFragment({ domain: 'ceramics' }),
        makeFragment({ domain: 'music' }),
        makeFragment({ domain: '3d' }),
      ];
      const pairs = engine.findDomainOpposites(fragments);
      expect(pairs.length).toBeGreaterThanOrEqual(1);
      expect(pairs[0].strategy).toBe('domain-opposite');
    });
  });

  describe('findRandomCollisions()', () => {
    it('returns stochastic 10% sampling', () => {
      const fragments = Array.from({ length: 20 }, (_, i) =>
        makeFragment({ id: `frag-rand-${i}`, domain: i % 2 === 0 ? 'a' : 'b' })
      );
      const pairs = engine.findRandomCollisions(fragments);
      // 20 fragments → 190 possible pairs → 10% = ~19 pairs
      expect(pairs.length).toBeLessThanOrEqual(19);
    });
  });

  describe('mergePair()', () => {
    it('calls LLM with collision prompt', async () => {
      const a = makeFragment({ domain: 'ceramics', content: 'Clay glazing technique' });
      const b = makeFragment({ domain: 'music', content: 'Rhythmic patterns' });

      const result = await engine.mergePair(a, b);
      expect(result).toBe('Merged idea');
      expect(mockLLM.generate).toHaveBeenCalled();
    });
  });

  describe('runAll()', () => {
    it('returns CollisionResult[] from all strategies', async () => {
      const fragments = [
        makeFragment({ domain: 'ceramics', tags: ['experimental'] }),
        makeFragment({ domain: 'music', tags: ['experimental'] }),
        makeFragment({ domain: '3d' }),
        makeFragment({ domain: 'code' }),
      ];
      const results = await engine.runAll(fragments);
      expect(results.length).toBeGreaterThan(0);
      const strategies = results.map(r => r.strategy);
      expect(strategies).toContain('timestamp');
    });
  });
});
