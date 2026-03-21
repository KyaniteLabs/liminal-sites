/**
 * Tests for DigestScheduler — schedules periodic digestion.
 */

import { jest } from '@jest/globals';
import { DigestScheduler } from '../../src/compost/DigestScheduler.js';

describe('DigestScheduler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('schedule with manual mode does nothing', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockMill: any = { digest: jest.fn() };
    const scheduler = new DigestScheduler();
    scheduler.schedule(mockMill, 'manual');
    jest.advanceTimersByTime(100000);
    expect(mockMill.digest).not.toHaveBeenCalled();
  });

  it('cancel removes scheduled trigger', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockMill: any = { digest: jest.fn() };
    const scheduler = new DigestScheduler();
    scheduler.schedule(mockMill, 'daily');
    scheduler.cancel();
    jest.advanceTimersByTime(100000);
    expect(mockMill.digest).not.toHaveBeenCalled();
  });
});
