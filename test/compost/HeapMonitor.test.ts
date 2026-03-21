/**
 * Tests for HeapMonitor — monitors heap size and auto-triggers digestion.
 */

import { jest } from '@jest/globals';
import { HeapMonitor } from '../../src/compost/HeapMonitor.js';

describe('HeapMonitor', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function makeMockMill(overrides: any = {}): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fn: any = jest.fn();
    return {
      shouldAutoDigest: fn.mockResolvedValue(false),
      digest: fn.mockResolvedValue({ stats: {}, seeds: [], digestPath: '' }),
      ...overrides,
    };
  }

  it('stop() is safe to call without start', () => {
    const monitor = new HeapMonitor(100);
    expect(() => monitor.stop()).not.toThrow();
  });

  it('start() begins monitoring', () => {
    const mockMill = makeMockMill();
    const monitor = new HeapMonitor(100);
    monitor.start(mockMill);
    // Just verify it starts without throwing
    monitor.stop();
  });
});
