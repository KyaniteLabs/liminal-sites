import { describe, it, expect } from 'vitest';
import {
  generateEuclideanPattern,
  rotatePattern,
  euclideanToNoteSequence,
} from '../../../src/music/EuclideanRhythm.js';

// ---------------------------------------------------------------------------
// generateEuclideanPattern
// ---------------------------------------------------------------------------

describe('generateEuclideanPattern', () => {
  // --- Classic patterns ---

  it('E(3,8) produces the classic tresillo pattern', () => {
    // The tresillo: 3 pulses distributed across 8 steps
    const pattern = generateEuclideanPattern(8, 3);
    expect(pattern).toEqual([1, 0, 1, 0, 0, 1, 0, 0]);
  });

  it('E(3,8) has length 8 and exactly 3 pulses', () => {
    const pattern = generateEuclideanPattern(8, 3);
    expect(pattern).toHaveLength(8);
    expect(pattern.reduce((sum, v) => sum + v, 0)).toBe(3);
  });

  it('E(5,8) distributes 5 pulses across 8 steps', () => {
    const pattern = generateEuclideanPattern(8, 5);
    expect(pattern).toHaveLength(8);
    expect(pattern.reduce((sum, v) => sum + v, 0)).toBe(5);
    // E(5,8) produces [1, 1, 1, 0, 1, 0, 1, 0] — 5 pulses across 8 steps
    expect(pattern).toEqual([1, 1, 1, 0, 1, 0, 1, 0]);
  });

  it('E(7,12) distributes 7 pulses across 12 steps', () => {
    const pattern = generateEuclideanPattern(12, 7);
    expect(pattern).toHaveLength(12);
    expect(pattern.reduce((sum, v) => sum + v, 0)).toBe(7);
    // Verify even distribution: max gap between pulses should be at most 2
    const gaps: number[] = [];
    let lastPulse = -1;
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === 1) {
        if (lastPulse >= 0) {
          gaps.push(i - lastPulse);
        }
        lastPulse = i;
      }
    }
    const maxGap = Math.max(...gaps);
    expect(maxGap).toBeLessThanOrEqual(2);
  });

  it('E(2,4) produces a simple alternating pattern', () => {
    const pattern = generateEuclideanPattern(4, 2);
    expect(pattern).toEqual([1, 0, 1, 0]);
  });

  it('E(1,4) produces a single pulse at the start', () => {
    const pattern = generateEuclideanPattern(4, 1);
    expect(pattern).toEqual([1, 0, 0, 0]);
  });

  it('E(3,5) distributes 3 pulses across 5 steps', () => {
    const pattern = generateEuclideanPattern(5, 3);
    expect(pattern).toHaveLength(5);
    expect(pattern.reduce((sum, v) => sum + v, 0)).toBe(3);
  });

  // --- Trivial / edge cases ---

  it('E(0,N) produces all rests', () => {
    expect(generateEuclideanPattern(4, 0)).toEqual([0, 0, 0, 0]);
    expect(generateEuclideanPattern(1, 0)).toEqual([0]);
    expect(generateEuclideanPattern(8, 0)).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('E(N,N) produces all pulses', () => {
    expect(generateEuclideanPattern(4, 4)).toEqual([1, 1, 1, 1]);
    expect(generateEuclideanPattern(1, 1)).toEqual([1]);
    expect(generateEuclideanPattern(8, 8)).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
  });

  it('E(1,1) produces a single pulse', () => {
    expect(generateEuclideanPattern(1, 1)).toEqual([1]);
  });

  it('E(0,1) produces a single rest', () => {
    expect(generateEuclideanPattern(1, 0)).toEqual([0]);
  });

  // --- Even distribution property ---

  it('distributes pulses as evenly as possible (max gap <= min gap + 1)', () => {
    const testCases: [number, number][] = [
      [8, 3], [8, 5], [12, 7], [7, 3], [16, 5], [6, 4],
    ];
    for (const [steps, pulses] of testCases) {
      const pattern = generateEuclideanPattern(steps, pulses);
      const gaps: number[] = [];
      let lastPulse = -1;
      for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === 1) {
          if (lastPulse >= 0) {
            gaps.push(i - lastPulse);
          }
          lastPulse = i;
        }
      }
      if (gaps.length > 0) {
        const minGap = Math.min(...gaps);
        const maxGap = Math.max(...gaps);
        expect(maxGap).toBeLessThanOrEqual(minGap + 1);
      }
    }
  });

  it('output contains only 0s and 1s', () => {
    const pattern = generateEuclideanPattern(13, 7);
    for (const v of pattern) {
      expect(v === 0 || v === 1).toBe(true);
    }
  });

  // --- Error cases ---

  it('throws RangeError when steps < 1', () => {
    expect(() => generateEuclideanPattern(0, 0)).toThrow(RangeError);
    expect(() => generateEuclideanPattern(-1, 1)).toThrow(RangeError);
  });

  it('throws RangeError when pulses < 0', () => {
    expect(() => generateEuclideanPattern(4, -1)).toThrow(RangeError);
  });

  it('throws RangeError when pulses > steps', () => {
    expect(() => generateEuclideanPattern(4, 5)).toThrow(RangeError);
  });

  it('RangeError messages are descriptive', () => {
    expect(() => generateEuclideanPattern(0, 1)).toThrow('steps must be a positive integer');
    expect(() => generateEuclideanPattern(4, -1)).toThrow('pulses must be a non-negative integer');
    expect(() => generateEuclideanPattern(4, 5)).toThrow('pulses (5) must not exceed steps (4)');
  });

  it('throws RangeError for non-integer inputs', () => {
    expect(() => generateEuclideanPattern(3.5, 2)).toThrow(RangeError);
    expect(() => generateEuclideanPattern(4, 2.5)).toThrow(RangeError);
  });
});

// ---------------------------------------------------------------------------
// rotatePattern
// ---------------------------------------------------------------------------

describe('rotatePattern', () => {
  it('identity rotation (0) returns a copy of the original', () => {
    const original = [1, 0, 1, 0, 1, 0, 0, 0];
    const result = rotatePattern(original, 0);
    expect(result).toEqual(original);
    expect(result).not.toBe(original); // different reference
  });

  it('positive rotation shifts elements to the right by 1', () => {
    const result = rotatePattern([1, 0, 1, 0, 1, 0, 0, 0], 1);
    expect(result).toEqual([0, 1, 0, 1, 0, 1, 0, 0]);
  });

  it('positive rotation by 2 shifts elements right by 2', () => {
    const result = rotatePattern([1, 0, 1, 0, 1, 0, 0, 0], 2);
    expect(result).toEqual([0, 0, 1, 0, 1, 0, 1, 0]);
  });

  it('negative rotation shifts elements to the left', () => {
    const result = rotatePattern([1, 0, 1, 0, 1, 0, 0, 0], -1);
    expect(result).toEqual([0, 1, 0, 1, 0, 0, 0, 1]);
  });

  it('negative rotation by -2 shifts left by 2', () => {
    const result = rotatePattern([1, 0, 1, 0, 1, 0, 0, 0], -2);
    expect(result).toEqual([1, 0, 1, 0, 0, 0, 1, 0]);
  });

  it('rotation equal to length returns a copy identical to original', () => {
    const original = [1, 0, 1, 0];
    const result = rotatePattern(original, 4);
    expect(result).toEqual(original);
    expect(result).not.toBe(original);
  });

  it('rotation greater than length wraps around (modular)', () => {
    // Rotating by 9 on an 8-element pattern = rotating by 1
    const result = rotatePattern([1, 0, 1, 0, 1, 0, 0, 0], 9);
    const expected = rotatePattern([1, 0, 1, 0, 1, 0, 0, 0], 1);
    expect(result).toEqual(expected);
  });

  it('negative rotation greater than length wraps around', () => {
    // Rotating by -9 on an 8-element pattern = rotating by -1
    const result = rotatePattern([1, 0, 1, 0, 1, 0, 0, 0], -9);
    const expected = rotatePattern([1, 0, 1, 0, 1, 0, 0, 0], -1);
    expect(result).toEqual(expected);
  });

  it('does not mutate the original array', () => {
    const original = [1, 0, 1, 0];
    const copy = [...original];
    rotatePattern(original, 2);
    expect(original).toEqual(copy);
  });

  it('returns empty array for empty input', () => {
    expect(rotatePattern([], 3)).toEqual([]);
  });

  it('handles single-element arrays', () => {
    expect(rotatePattern([1], 0)).toEqual([1]);
    expect(rotatePattern([1], 1)).toEqual([1]);
    expect(rotatePattern([1], 5)).toEqual([1]);
    expect(rotatePattern([1], -3)).toEqual([1]);
  });
});

// ---------------------------------------------------------------------------
// euclideanToNoteSequence
// ---------------------------------------------------------------------------

describe('euclideanToNoteSequence', () => {
  it('produces correct number of notes matching pulse count', () => {
    const pattern = generateEuclideanPattern(8, 3); // tresillo
    const seq = euclideanToNoteSequence(pattern);
    expect(seq.notes).toHaveLength(3);
  });

  it('computes duration as steps * stepDuration', () => {
    const pattern = generateEuclideanPattern(8, 3);
    const seq = euclideanToNoteSequence(pattern, { stepDuration: 0.5 });
    expect(seq.duration).toBeCloseTo(4.0); // 8 * 0.5
  });

  it('uses default stepDuration of 0.25', () => {
    const seq = euclideanToNoteSequence([1, 0, 1, 0]);
    expect(seq.duration).toBeCloseTo(1.0); // 4 * 0.25
  });

  it('places notes at correct time positions', () => {
    const pattern = [1, 0, 1, 0, 0, 1, 0, 0];
    const seq = euclideanToNoteSequence(pattern, { stepDuration: 0.25 });
    // Pulses at indices 0, 2, 5 → times 0, 0.5, 1.25
    expect(seq.notes[0].time).toBeCloseTo(0.0);
    expect(seq.notes[1].time).toBeCloseTo(0.5);
    expect(seq.notes[2].time).toBeCloseTo(1.25);
  });

  it('uses default pitch 60 (middle C)', () => {
    const seq = euclideanToNoteSequence([1, 0]);
    expect(seq.notes[0].pitch).toBe(60);
  });

  it('respects custom pitch', () => {
    const seq = euclideanToNoteSequence([1, 0], { pitch: 72 });
    expect(seq.notes[0].pitch).toBe(72);
  });

  it('uses default velocity 100', () => {
    const seq = euclideanToNoteSequence([1, 0]);
    expect(seq.notes[0].velocity).toBe(100);
  });

  it('respects custom velocity', () => {
    const seq = euclideanToNoteSequence([1, 0], { velocity: 80 });
    expect(seq.notes[0].velocity).toBe(80);
  });

  it('note duration defaults to stepDuration * 0.8', () => {
    const seq = euclideanToNoteSequence([1, 0], { stepDuration: 0.5 });
    expect(seq.notes[0].duration).toBeCloseTo(0.4); // 0.5 * 0.8
  });

  it('respects custom noteDuration', () => {
    const seq = euclideanToNoteSequence([1, 0], { stepDuration: 0.5, noteDuration: 0.3 });
    expect(seq.notes[0].duration).toBeCloseTo(0.3);
  });

  it('returns empty notes for all-rest pattern', () => {
    const seq = euclideanToNoteSequence([0, 0, 0, 0]);
    expect(seq.notes).toEqual([]);
    expect(seq.duration).toBeCloseTo(1.0); // 4 * 0.25
  });

  it('returns single note for single-pulse pattern', () => {
    const seq = euclideanToNoteSequence([1]);
    expect(seq.notes).toHaveLength(1);
    expect(seq.notes[0].time).toBeCloseTo(0.0);
    expect(seq.duration).toBeCloseTo(0.25);
  });

  it('all note events share the same pitch and velocity', () => {
    const pattern = generateEuclideanPattern(8, 5);
    const seq = euclideanToNoteSequence(pattern, { pitch: 64, velocity: 110 });
    for (const note of seq.notes) {
      expect(note.pitch).toBe(64);
      expect(note.velocity).toBe(110);
    }
  });

  it('handles empty pattern (0 steps)', () => {
    const seq = euclideanToNoteSequence([]);
    expect(seq.notes).toEqual([]);
    expect(seq.duration).toBeCloseTo(0.0);
  });

  it('uses all defaults when no options provided', () => {
    const seq = euclideanToNoteSequence([1]);
    expect(seq.notes[0]).toEqual({
      time: 0,
      pitch: 60,
      duration: 0.2,   // 0.25 * 0.8
      velocity: 100,
    });
  });
});
