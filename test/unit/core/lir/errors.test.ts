import { describe, it, expect } from 'vitest';
/**
 * Tests for LIR error hierarchy.
 */
import { LIRParseError, LIRSummaryError } from '../../../../src/core/lir/errors.js';

describe('LIR error classes', () => {
  describe('LIRParseError', () => {
    it('should construct with message and source', () => {
      const err = new LIRParseError('test error', 'test.js');
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(LIRParseError);
      expect(err.message).toBe('test error');
      expect(err.source).toBe('test.js');
      expect(err.name).toBe('LIRParseError');
      expect(err.line).toBeUndefined();
    });

    it('should construct with message, source, and line', () => {
      const err = new LIRParseError('test error', 'test.js', 42);
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(LIRParseError);
      expect(err.message).toBe('test error');
      expect(err.source).toBe('test.js');
      expect(err.line).toBe(42);
      expect(err.name).toBe('LIRParseError');
    });

    it('should have all properties accessible', () => {
      const err = new LIRParseError('parse failed', 'example.lir', 10);
      expect(err.message).toBe('parse failed');
      expect(err.source).toBe('example.lir');
      expect(err.line).toBe(10);
      expect(err.name).toBe('LIRParseError');
      expect(err instanceof Error).toBe(true);
    });
  });

  describe('LIRSummaryError', () => {
    it('should construct with message and tokenIds', () => {
      const tokenIds = [1, 2, 3, 4, 5];
      const err = new LIRSummaryError('summary failed', tokenIds);
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(LIRSummaryError);
      expect(err.message).toBe('summary failed');
      expect(err.tokenIds).toEqual(tokenIds);
      expect(err.name).toBe('LIRSummaryError');
    });

    it('should have all properties accessible', () => {
      const tokenIds = [10, 20, 30];
      const err = new LIRSummaryError('cannot summarize', tokenIds);
      expect(err.message).toBe('cannot summarize');
      expect(err.tokenIds).toEqual([10, 20, 30]);
      expect(err.name).toBe('LIRSummaryError');
      expect(err instanceof Error).toBe(true);
    });

    it('should handle empty tokenIds array', () => {
      const err = new LIRSummaryError('no tokens', []);
      expect(err.message).toBe('no tokens');
      expect(err.tokenIds).toEqual([]);
      expect(err.name).toBe('LIRSummaryError');
    });
  });
});
