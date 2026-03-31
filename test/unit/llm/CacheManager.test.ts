import { describe, it, expect, beforeEach } from 'vitest';
/**
 * Tests for CacheManager - LLM response caching
 * 
 * The CacheManager provides LRU caching for LLM responses to avoid
 * redundant API calls. Key features:
 * - TTL-based expiration (default 1 hour)
 * - LRU eviction when max entries reached
 * - Disabled mode for testing
 */

import { CacheManager } from '../../../src/llm/CacheManager.js';

describe('CacheManager', () => {
  describe('basic operations', () => {
    it('stores and retrieves values', () => {
      const cache = new CacheManager();
      
      cache.set('system prompt', 'user prompt', 'generated code');
      const result = cache.get('system prompt', 'user prompt');
      
      expect(result).toBe('generated code');
    });

    it('returns null for missing keys', () => {
      const cache = new CacheManager();
      
      const result = cache.get('unknown system', 'unknown user');
      
      expect(result).toBeNull();
    });

    it('returns null when disabled', () => {
      const cache = new CacheManager({ enabled: false });
      
      cache.set('system', 'user', 'value');
      const result = cache.get('system', 'user');
      
      expect(result).toBeNull();
    });
  });

  describe('TTL expiration', () => {
    it('returns expired entries as null', async () => {
      const cache = new CacheManager({ ttlMs: 50 }); // 50ms TTL
      
      cache.set('system', 'user', 'value');
      expect(cache.get('system', 'user')).toBe('value');
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 60));
      
      expect(cache.get('system', 'user')).toBeNull();
    });

    it('deletes expired entries on access', async () => {
      const cache = new CacheManager({ ttlMs: 50 });
      
      cache.set('system', 'user', 'value');
      await new Promise(resolve => setTimeout(resolve, 60));
      
      // First access returns null and deletes
      cache.get('system', 'user');
      
      // Size should be 0
      expect(cache.size).toBe(0);
    });
  });

  describe('LRU eviction', () => {
    it('evicts oldest entries when max reached', () => {
      const cache = new CacheManager({ maxEntries: 3 });
      
      cache.set('s1', 'u1', 'v1');
      cache.set('s2', 'u2', 'v2');
      cache.set('s3', 'u3', 'v3');
      
      // Access v1 to make it recently used
      cache.get('s1', 'u1');
      
      // Add 4th entry - should evict v2 (oldest unused)
      cache.set('s4', 'u4', 'v4');
      
      expect(cache.get('s1', 'u1')).toBe('v1'); // Still there
      expect(cache.get('s2', 'u2')).toBeNull(); // Evicted
      expect(cache.get('s3', 'u3')).toBe('v3'); // Still there
      expect(cache.get('s4', 'u4')).toBe('v4'); // New entry
    });

    it('updates LRU order on access', () => {
      const cache = new CacheManager({ maxEntries: 2 });
      
      cache.set('s1', 'u1', 'v1');
      cache.set('s2', 'u2', 'v2');
      
      // Access v1 - now v2 is oldest
      cache.get('s1', 'u1');
      
      // Add new entry - should evict v2
      cache.set('s3', 'u3', 'v3');
      
      expect(cache.get('s1', 'u1')).toBe('v1'); // Still there
      expect(cache.get('s2', 'u2')).toBeNull(); // Evicted
    });
  });

  describe('key hashing', () => {
    it('treats different prompts as different keys', () => {
      const cache = new CacheManager();
      
      cache.set('system1', 'user1', 'value1');
      cache.set('system2', 'user2', 'value2');
      
      expect(cache.get('system1', 'user1')).toBe('value1');
      expect(cache.get('system2', 'user2')).toBe('value2');
    });

    it('handles empty prompts', () => {
      const cache = new CacheManager();
      
      cache.set('', '', 'empty value');
      
      expect(cache.get('', '')).toBe('empty value');
    });

    it('handles unicode prompts', () => {
      const cache = new CacheManager();
      
      cache.set('日本語', '🎨艺术', 'unicode value');
      
      expect(cache.get('日本語', '🎨艺术')).toBe('unicode value');
    });
  });

  describe('clear and size', () => {
    it('clears all entries', () => {
      const cache = new CacheManager();
      
      cache.set('s1', 'u1', 'v1');
      cache.set('s2', 'u2', 'v2');
      
      expect(cache.size).toBe(2);
      
      cache.clear();
      
      expect(cache.size).toBe(0);
      expect(cache.get('s1', 'u1')).toBeNull();
    });

    it('tracks size correctly', () => {
      const cache = new CacheManager();
      
      expect(cache.size).toBe(0);
      
      cache.set('s1', 'u1', 'v1');
      expect(cache.size).toBe(1);
      
      cache.set('s1', 'u1', 'updated'); // Same key
      expect(cache.size).toBe(1);
      
      cache.set('s2', 'u2', 'v2');
      expect(cache.size).toBe(2);
    });
  });

  describe('configuration options', () => {
    it('uses custom TTL', async () => {
      const cache = new CacheManager({ ttlMs: 100 });
      
      cache.set('s', 'u', 'v');
      expect(cache.get('s', 'u')).toBe('v');
      
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(cache.get('s', 'u')).toBe('v'); // Still valid
      
      await new Promise(resolve => setTimeout(resolve, 60));
      expect(cache.get('s', 'u')).toBeNull(); // Expired
    });

    it('uses custom max entries', () => {
      const cache = new CacheManager({ maxEntries: 5 });
      
      for (let i = 0; i < 10; i++) {
        cache.set(`s${i}`, `u${i}`, `v${i}`);
      }
      
      expect(cache.size).toBe(5);
    });
  });
});
