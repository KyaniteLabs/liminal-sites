import { describe, it, expect } from 'vitest';
import {
  generateArpeggio,
  type ArpParams,
  type ArpNote,
} from '../../../src/music/Arpeggiator.js';

const BASE_NOTES = [60, 64, 67]; // C major triad
const NOTE_DURATION = 0.25; // sixteenth note

describe('generateArpeggio', () => {
  describe('mode: up', () => {
    const params: ArpParams = {
      mode: 'up',
      octaveRange: 1,
      notesPerBeat: 4,
      baseNotes: BASE_NOTES,
    };

    it('cycles pitches ascending: 60,64,67,60,64,67,...', () => {
      const notes = generateArpeggio(params, 9, NOTE_DURATION);
      const pitches = notes.map((n) => n.pitch);
      expect(pitches).toEqual([
        60, 64, 67, // first cycle
        60, 64, 67, // second cycle
        60, 64, 67, // third cycle
      ]);
    });
  });

  describe('mode: down', () => {
    const params: ArpParams = {
      mode: 'down',
      octaveRange: 1,
      notesPerBeat: 4,
      baseNotes: BASE_NOTES,
    };

    it('cycles pitches descending: 67,64,60,67,64,60,...', () => {
      const notes = generateArpeggio(params, 9, NOTE_DURATION);
      const pitches = notes.map((n) => n.pitch);
      expect(pitches).toEqual([
        67, 64, 60, // first cycle
        67, 64, 60, // second cycle
        67, 64, 60, // third cycle
      ]);
    });
  });

  describe('mode: upDown', () => {
    const params: ArpParams = {
      mode: 'upDown',
      octaveRange: 1,
      notesPerBeat: 4,
      baseNotes: BASE_NOTES,
    };

    it('produces ping-pong pattern: 60,64,67,64,60,64,67,64,...', () => {
      const notes = generateArpeggio(params, 8, NOTE_DURATION);
      const pitches = notes.map((n) => n.pitch);
      // Cycle is [60, 64, 67, 64] — up through all, then back skipping endpoints
      expect(pitches).toEqual([
        60, 64, 67, 64, // first cycle
        60, 64, 67, 64, // second cycle
      ]);
    });
  });

  describe('mode: downUp', () => {
    const params: ArpParams = {
      mode: 'downUp',
      octaveRange: 1,
      notesPerBeat: 4,
      baseNotes: BASE_NOTES,
    };

    it('produces reverse ping-pong: 67,64,60,64,67,64,60,64,...', () => {
      const notes = generateArpeggio(params, 8, NOTE_DURATION);
      const pitches = notes.map((n) => n.pitch);
      // Cycle is [67, 64, 60, 64] — down through all, then up skipping endpoints
      expect(pitches).toEqual([
        67, 64, 60, 64, // first cycle
        67, 64, 60, 64, // second cycle
      ]);
    });
  });

  describe('mode: random', () => {
    const params: ArpParams = {
      mode: 'random',
      octaveRange: 1,
      notesPerBeat: 4,
      baseNotes: BASE_NOTES,
    };

    it('produces pitches only from baseNotes', () => {
      const notes = generateArpeggio(params, 50, NOTE_DURATION);
      const pitches = notes.map((n) => n.pitch);
      for (const p of pitches) {
        expect(BASE_NOTES).toContain(p);
      }
    });

    it('produces the requested number of notes', () => {
      const notes = generateArpeggio(params, 20, NOTE_DURATION);
      expect(notes).toHaveLength(20);
    });
  });

  describe('edge cases', () => {
    it('returns empty array when totalNotes is 0', () => {
      const params: ArpParams = {
        mode: 'up',
        octaveRange: 1,
        notesPerBeat: 4,
        baseNotes: BASE_NOTES,
      };
      const notes = generateArpeggio(params, 0, NOTE_DURATION);
      expect(notes).toEqual([]);
    });

    it('throws Error when baseNotes is empty', () => {
      const params: ArpParams = {
        mode: 'up',
        octaveRange: 1,
        notesPerBeat: 4,
        baseNotes: [],
      };
      expect(() => generateArpeggio(params, 8, NOTE_DURATION)).toThrow(
        'Arpeggiator requires at least one base note',
      );
    });
  });

  describe('timing and duration', () => {
    const params: ArpParams = {
      mode: 'up',
      octaveRange: 1,
      notesPerBeat: 4,
      baseNotes: [60],
    };

    it('sets each note time to index * noteDuration', () => {
      const duration = 0.5;
      const notes = generateArpeggio(params, 5, duration);
      const times = notes.map((n) => n.time);
      expect(times).toEqual([0, 0.5, 1.0, 1.5, 2.0]);
    });

    it('sets note duration to 80% of noteDuration', () => {
      const duration = 0.5;
      const notes = generateArpeggio(params, 5, duration);
      for (const note of notes) {
        expect(note.duration).toBeCloseTo(0.4, 10); // 0.5 * 0.8
      }
    });

    it('sets velocity to 0.7', () => {
      const notes = generateArpeggio(params, 5, NOTE_DURATION);
      for (const note of notes) {
        expect(note.velocity).toBe(0.7);
      }
    });
  });
});
