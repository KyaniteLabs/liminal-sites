import { describe, it, expect } from 'vitest';
import {
  NOTES,
  SCALE_INTERVALS,
  CHORD_INTERVALS,
  CHORD_PROGRESSIONS,
  noteToIndex,
  noteToMidi,
  midiToNote,
  getScaleNotes,
  quantizeToScale,
  getChordNotes,
  generateProgression,
} from '../../../src/music/TheoryEngine.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('TheoryEngine constants', () => {
  it('NOTES has exactly 12 chromatic pitch classes', () => {
    expect(NOTES).toHaveLength(12);
  });

  it('NOTES starts at C and ends at B', () => {
    expect(NOTES[0]).toBe('C');
    expect(NOTES[11]).toBe('B');
  });

  it('SCALE_INTERVALS defines all 14 scale types (aeolian is separate from minor)', () => {
    const scaleNames = Object.keys(SCALE_INTERVALS);
    expect(scaleNames).toHaveLength(14);
    expect(scaleNames).toEqual(
      expect.arrayContaining([
        'major', 'minor', 'dorian', 'phrygian', 'lydian',
        'mixolydian', 'aeolian', 'locrian', 'harmonicMinor',
        'melodicMinor', 'pentatonicMajor', 'pentatonicMinor',
        'blues', 'chromatic',
      ]),
    );
  });

  it('CHORD_INTERVALS defines all 7 chord types', () => {
    const chordNames = Object.keys(CHORD_INTERVALS);
    expect(chordNames).toHaveLength(7);
    expect(chordNames).toEqual(
      expect.arrayContaining([
        'major', 'minor', 'diminished', 'augmented',
        'major7', 'minor7', 'dominant7',
      ]),
    );
  });

  it('CHORD_PROGRESSIONS has exactly 5 entries', () => {
    expect(CHORD_PROGRESSIONS).toHaveLength(5);
  });

  it('every scale interval array starts with 0 (root)', () => {
    for (const [name, intervals] of Object.entries(SCALE_INTERVALS)) {
      expect(intervals[0]).toBe(0);
    }
  });

  it('chromatic scale has all 12 semitones', () => {
    expect(SCALE_INTERVALS.chromatic).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });
});

// ---------------------------------------------------------------------------
// noteToIndex
// ---------------------------------------------------------------------------

describe('noteToIndex', () => {
  it('maps all 12 natural/sharp notes to correct indices', () => {
    expect(noteToIndex('C')).toBe(0);
    expect(noteToIndex('C#')).toBe(1);
    expect(noteToIndex('D')).toBe(2);
    expect(noteToIndex('D#')).toBe(3);
    expect(noteToIndex('E')).toBe(4);
    expect(noteToIndex('F')).toBe(5);
    expect(noteToIndex('F#')).toBe(6);
    expect(noteToIndex('G')).toBe(7);
    expect(noteToIndex('G#')).toBe(8);
    expect(noteToIndex('A')).toBe(9);
    expect(noteToIndex('A#')).toBe(10);
    expect(noteToIndex('B')).toBe(11);
  });

  it('resolves all flat spellings to the correct sharp index', () => {
    expect(noteToIndex('Db')).toBe(1);   // = C#
    expect(noteToIndex('Eb')).toBe(3);   // = D#
    expect(noteToIndex('Gb')).toBe(6);   // = F#
    expect(noteToIndex('Ab')).toBe(8);   // = G#
    expect(noteToIndex('Bb')).toBe(10);  // = A#
  });

  it('resolves Cb to B (index 11)', () => {
    expect(noteToIndex('Cb')).toBe(11);
  });

  it('resolves Fb to E (index 4)', () => {
    expect(noteToIndex('Fb')).toBe(4);
  });

  it('throws on unknown note name', () => {
    expect(() => noteToIndex('H')).toThrow('Unknown note name: "H"');
    expect(() => noteToIndex('')).toThrow('Unknown note name: ""');
    expect(() => noteToIndex('X#')).toThrow('Unknown note name: "X#"');
  });
});

// ---------------------------------------------------------------------------
// noteToMidi / midiToNote roundtrips
// ---------------------------------------------------------------------------

describe('noteToMidi', () => {
  it('computes MIDI 69 for A4 (concert pitch reference)', () => {
    expect(noteToMidi('A', 4)).toBe(69);
  });

  it('computes MIDI 60 for C4 (middle C)', () => {
    expect(noteToMidi('C', 4)).toBe(60);
  });

  it('computes MIDI 0 for C-1 (lowest MIDI note)', () => {
    expect(noteToMidi('C', -1)).toBe(0);
  });

  it('computes MIDI 127 for G9 (highest standard MIDI note)', () => {
    expect(noteToMidi('G', 9)).toBe(127);
  });

  it('resolves flat notes correctly via noteToMidi', () => {
    expect(noteToMidi('Bb', 4)).toBe(70);  // A#4 = 70
    expect(noteToMidi('Eb', 4)).toBe(63);  // D#4 = 63
    expect(noteToMidi('Db', 4)).toBe(61);  // C#4 = 61
  });
});

describe('midiToNote', () => {
  it('returns { note: "A", octave: 4 } for MIDI 69', () => {
    expect(midiToNote(69)).toEqual({ note: 'A', octave: 4 });
  });

  it('returns { note: "C", octave: 4 } for MIDI 60', () => {
    expect(midiToNote(60)).toEqual({ note: 'C', octave: 4 });
  });

  it('returns { note: "C", octave: -1 } for MIDI 0', () => {
    expect(midiToNote(0)).toEqual({ note: 'C', octave: -1 });
  });

  it('returns { note: "G", octave: 9 } for MIDI 127', () => {
    expect(midiToNote(127)).toEqual({ note: 'G', octave: 9 });
  });

  it('handles MIDI values in octave 0 correctly', () => {
    expect(midiToNote(12)).toEqual({ note: 'C', octave: 0 });
    expect(midiToNote(23)).toEqual({ note: 'B', octave: 0 });
  });
});

describe('noteToMidi / midiToNote roundtrip', () => {
  it('roundtrips every natural note in octave 4', () => {
    const naturalNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    for (const note of naturalNotes) {
      const midi = noteToMidi(note, 4);
      const result = midiToNote(midi);
      expect(result).toEqual({ note, octave: 4 });
    }
  });

  it('roundtrips sharp notes across multiple octaves', () => {
    const testCases: [string, number][] = [
      ['C#', 2], ['F#', 5], ['A#', 3], ['G#', 6],
    ];
    for (const [note, octave] of testCases) {
      const midi = noteToMidi(note, octave);
      const result = midiToNote(midi);
      expect(result).toEqual({ note, octave });
    }
  });

  it('flat note names resolve to same MIDI as their sharp equivalents', () => {
    const equivalents: [string, string][] = [
      ['Bb', 'A#'], ['Db', 'C#'], ['Eb', 'D#'], ['Gb', 'F#'], ['Ab', 'G#'],
    ];
    for (const [flat, sharp] of equivalents) {
      expect(noteToMidi(flat, 4)).toBe(noteToMidi(sharp, 4));
    }
  });
});

// ---------------------------------------------------------------------------
// getScaleNotes — all 13 scales
// ---------------------------------------------------------------------------

describe('getScaleNotes', () => {
  it('returns correct C major across octaves 4-5', () => {
    // C major: C D E F G A B in each octave
    const notes = getScaleNotes('C', 'major', 4, 5);
    // Octave 4: 60, 62, 64, 65, 67, 69, 71
    // Octave 5: 72, 74, 76, 77, 79, 81, 83
    expect(notes).toEqual([60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83]);
  });

  it('returns 14 notes for a 7-note scale over 2 octaves', () => {
    const notes = getScaleNotes('D', 'major', 4, 5);
    expect(notes).toHaveLength(14);
  });

  it('minor scale has flat 3rd, 6th, 7th compared to major', () => {
    const major = getScaleNotes('C', 'major', 4, 4);
    const minor = getScaleNotes('C', 'minor', 4, 4);
    // C major in octave 4: [60, 62, 64, 65, 67, 69, 71]
    // C minor in octave 4: [60, 62, 63, 65, 67, 68, 70]
    expect(minor).toEqual([60, 62, 63, 65, 67, 68, 70]);
    expect(major).toEqual([60, 62, 64, 65, 67, 69, 71]);
  });

  it('dorian has flat 3 and flat 7 relative to major', () => {
    const dorian = getScaleNotes('C', 'dorian', 4, 4);
    expect(dorian).toEqual([60, 62, 63, 65, 67, 69, 70]);
  });

  it('phrygian has flat 2, flat 3, flat 6, flat 7', () => {
    const phrygian = getScaleNotes('C', 'phrygian', 4, 4);
    expect(phrygian).toEqual([60, 61, 63, 65, 67, 68, 70]);
  });

  it('lydian has raised 4th', () => {
    const lydian = getScaleNotes('C', 'lydian', 4, 4);
    // Lydian: C D E F# G A B
    expect(lydian).toEqual([60, 62, 64, 66, 67, 69, 71]);
  });

  it('mixolydian has flat 7', () => {
    const mixolydian = getScaleNotes('C', 'mixolydian', 4, 4);
    expect(mixolydian).toEqual([60, 62, 64, 65, 67, 69, 70]);
  });

  it('aeolian is identical to minor', () => {
    const aeolian = getScaleNotes('C', 'aeolian', 4, 4);
    const minor = getScaleNotes('C', 'minor', 4, 4);
    expect(aeolian).toEqual(minor);
  });

  it('locrian has flat 2, flat 3, flat 5, flat 6, flat 7', () => {
    const locrian = getScaleNotes('C', 'locrian', 4, 4);
    expect(locrian).toEqual([60, 61, 63, 65, 66, 68, 70]);
  });

  it('harmonic minor has raised 7th compared to natural minor', () => {
    const hMinor = getScaleNotes('C', 'harmonicMinor', 4, 4);
    const nMinor = getScaleNotes('C', 'minor', 4, 4);
    // Natural minor:  [60, 62, 63, 65, 67, 68, 70]
    // Harmonic minor: [60, 62, 63, 65, 67, 68, 71]  (B natural instead of Bb)
    expect(hMinor[6]).toBe(71);
    expect(nMinor[6]).toBe(70);
  });

  it('melodic minor has raised 6th and 7th compared to natural minor', () => {
    const mMinor = getScaleNotes('C', 'melodicMinor', 4, 4);
    // Melodic minor: C D Eb F G A B = [60, 62, 63, 65, 67, 69, 71]
    expect(mMinor).toEqual([60, 62, 63, 65, 67, 69, 71]);
  });

  it('pentatonic major has 5 notes per octave', () => {
    const penta = getScaleNotes('C', 'pentatonicMajor', 4, 4);
    expect(penta).toHaveLength(5);
    expect(penta).toEqual([60, 62, 64, 67, 69]);
  });

  it('pentatonic minor has 5 notes per octave', () => {
    const penta = getScaleNotes('C', 'pentatonicMinor', 4, 4);
    expect(penta).toHaveLength(5);
    expect(penta).toEqual([60, 63, 65, 67, 70]);
  });

  it('blues scale has 6 notes per octave', () => {
    const blues = getScaleNotes('C', 'blues', 4, 4);
    expect(blues).toHaveLength(6);
    expect(blues).toEqual([60, 63, 65, 66, 67, 70]);
  });

  it('chromatic scale has all 12 notes per octave', () => {
    const chromatic = getScaleNotes('C', 'chromatic', 4, 4);
    expect(chromatic).toHaveLength(12);
    expect(chromatic).toEqual([60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71]);
  });

  it('works with sharp root notes', () => {
    const fSharp = getScaleNotes('F#', 'major', 4, 4);
    // F# major: F# G# A# B C# D# E#(F)
    // MIDI:     66 68 70 71 73 75 77
    expect(fSharp).toEqual([66, 68, 70, 71, 73, 75, 77]);
  });

  it('works with flat root notes', () => {
    // Bb major should be same as A# major
    const bbMajor = getScaleNotes('Bb', 'major', 4, 4);
    const aSharpMajor = getScaleNotes('A#', 'major', 4, 4);
    expect(bbMajor).toEqual(aSharpMajor);
  });

  it('returns sorted results', () => {
    const notes = getScaleNotes('E', 'major', 3, 5);
    for (let i = 1; i < notes.length; i++) {
      expect(notes[i]).toBeGreaterThan(notes[i - 1]);
    }
  });

  it('chromatic scale at octave -1 produces all 12 notes 0-11', () => {
    const low = getScaleNotes('C', 'chromatic', -1, -1);
    expect(low).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it('throws on unknown scale type', () => {
    expect(() => getScaleNotes('C', 'hyperphygian', 4, 5))
      .toThrow('Unknown scale type: "hyperphygian"');
  });
});

// ---------------------------------------------------------------------------
// getChordNotes — all 7 chord types
// ---------------------------------------------------------------------------

describe('getChordNotes', () => {
  it('C major triad: [60, 64, 67]', () => {
    expect(getChordNotes('C', 'major', 4)).toEqual([60, 64, 67]);
  });

  it('C minor triad: [60, 63, 67]', () => {
    expect(getChordNotes('C', 'minor', 4)).toEqual([60, 63, 67]);
  });

  it('C diminished triad: [60, 63, 66]', () => {
    expect(getChordNotes('C', 'diminished', 4)).toEqual([60, 63, 66]);
  });

  it('C augmented triad: [60, 64, 68]', () => {
    expect(getChordNotes('C', 'augmented', 4)).toEqual([60, 64, 68]);
  });

  it('C major7: [60, 64, 67, 71]', () => {
    expect(getChordNotes('C', 'major7', 4)).toEqual([60, 64, 67, 71]);
  });

  it('C minor7: [60, 63, 67, 70]', () => {
    expect(getChordNotes('C', 'minor7', 4)).toEqual([60, 63, 67, 70]);
  });

  it('C dominant7: [60, 64, 67, 70]', () => {
    expect(getChordNotes('C', 'dominant7', 4)).toEqual([60, 64, 67, 70]);
  });

  it('uses octave 4 by default', () => {
    expect(getChordNotes('C', 'major')).toEqual([60, 64, 67]);
  });

  it('works in different octaves', () => {
    expect(getChordNotes('C', 'major', 3)).toEqual([48, 52, 55]);
    expect(getChordNotes('C', 'major', 5)).toEqual([72, 76, 79]);
  });

  it('works with flat root notes', () => {
    // Bb major = A# major
    const bbChord = getChordNotes('Bb', 'major', 4);
    const asChord = getChordNotes('A#', 'major', 4);
    expect(bbChord).toEqual(asChord);
    expect(bbChord).toEqual([70, 74, 77]);
  });

  it('throws on unknown chord type', () => {
    expect(() => getChordNotes('C', 'sus4', 4))
      .toThrow('Unknown chord type: "sus4"');
  });

  it('major7 differs from dominant7 by the 7th degree', () => {
    const maj7 = getChordNotes('C', 'major7', 4);
    const dom7 = getChordNotes('C', 'dominant7', 4);
    // First three notes identical
    expect(maj7.slice(0, 3)).toEqual(dom7.slice(0, 3));
    // major7 has natural 7th (11 semitones), dominant7 has flat 7th (10 semitones)
    expect(maj7[3]).toBe(71);
    expect(dom7[3]).toBe(70);
  });
});

// ---------------------------------------------------------------------------
// quantizeToScale
// ---------------------------------------------------------------------------

describe('quantizeToScale', () => {
  it('returns note unchanged when already in scale', () => {
    // C (60) and E (64) are both in C major
    expect(quantizeToScale(60, 'C', 'major')).toBe(60);
    expect(quantizeToScale(64, 'C', 'major')).toBe(64);
    expect(quantizeToScale(67, 'C', 'major')).toBe(67);
  });

  it('chromatic scale fast-path returns any MIDI unchanged', () => {
    expect(quantizeToScale(61, 'C', 'chromatic')).toBe(61);
    expect(quantizeToScale(0, 'C', 'chromatic')).toBe(0);
    expect(quantizeToScale(127, 'C', 'chromatic')).toBe(127);
  });

  it('quantizes out-of-scale note to nearest in-scale note', () => {
    // C# (61) is not in C major. Nearest in-scale: C(60) or D(62).
    // Tie-break goes to lower note, so 60.
    const result = quantizeToScale(61, 'C', 'major');
    expect(result).toBe(60);
  });

  it('quantizes to nearer note when not equidistant', () => {
    // Eb (63) in C major: nearest is D(62) or E(64). Distance 1 each way.
    // Tie-break goes to lower: 62.
    expect(quantizeToScale(63, 'C', 'major')).toBe(62);
  });

  it('quantizes to clearly nearer note', () => {
    // Bb (70) in C major: nearest in-scale are A(69) or B(71). Both distance 1.
    // Tie-break goes to lower: 69.
    expect(quantizeToScale(70, 'C', 'major')).toBe(69);
  });

  it('accepts pre-computed scaleNotes to avoid recomputation', () => {
    const scaleNotes = [60, 62, 64, 65, 67, 69, 71];
    // Without pre-computed notes
    const a = quantizeToScale(61, 'C', 'major');
    // With pre-computed notes
    const b = quantizeToScale(61, 'C', 'major', scaleNotes);
    expect(a).toBe(b);
  });

  it('quantizes across full MIDI range', () => {
    // MIDI 1 in C major: C#-1, not in scale. Nearest: C-1(0) or D-1(2).
    // Tie-break lower: 0.
    expect(quantizeToScale(1, 'C', 'major')).toBe(0);
    // MIDI 126 in C major: F#9, not in scale. Nearest: F9(125) or G9(127).
    // Distance to 125 = 1, distance to 127 = 1. Tie-break lower: 125.
    expect(quantizeToScale(126, 'C', 'major')).toBe(125);
  });

  it('pentatonic scale has more out-of-scale notes to quantize', () => {
    // C pentatonic major in octave 4: [60, 62, 64, 67, 69]
    // C#(61) → C(60), D#(63) → D(62) or E(64) tie → 62, F(65) → E(64) or G(67), distance 2 vs 2 → 64
    expect(quantizeToScale(61, 'C', 'pentatonicMajor')).toBe(60);
    expect(quantizeToScale(65, 'C', 'pentatonicMajor')).toBe(64);
  });
});

// ---------------------------------------------------------------------------
// generateProgression — all 5 progressions
// ---------------------------------------------------------------------------

describe('generateProgression', () => {
  it('I-IV-V-I in C produces correct chords with default duration', () => {
    const prog = generateProgression('C', 'I-IV-V-I');
    expect(prog).toEqual([
      { root: 'C', type: 'major', duration: 4 },
      { root: 'F', type: 'major', duration: 4 },
      { root: 'G', type: 'major', duration: 4 },
      { root: 'C', type: 'major', duration: 4 },
    ]);
  });

  it('I-V-vi-IV in C produces correct chord qualities', () => {
    const prog = generateProgression('C', 'I-V-vi-IV');
    expect(prog).toEqual([
      { root: 'C', type: 'major', duration: 4 },
      { root: 'G', type: 'major', duration: 4 },
      { root: 'A', type: 'minor', duration: 4 },
      { root: 'F', type: 'major', duration: 4 },
    ]);
  });

  it('ii-V-I in C uses minor ii, dominant-quality V', () => {
    const prog = generateProgression('C', 'ii-V-I');
    expect(prog).toEqual([
      { root: 'D', type: 'minor', duration: 4 },
      { root: 'G', type: 'major', duration: 4 },
      { root: 'C', type: 'major', duration: 4 },
    ]);
  });

  it('I-vi-IV-V in C produces the 50s progression', () => {
    const prog = generateProgression('C', 'I-vi-IV-V');
    expect(prog).toEqual([
      { root: 'C', type: 'major', duration: 4 },
      { root: 'A', type: 'minor', duration: 4 },
      { root: 'F', type: 'major', duration: 4 },
      { root: 'G', type: 'major', duration: 4 },
    ]);
  });

  it('I-IV-I-V in C produces correct alternation', () => {
    const prog = generateProgression('C', 'I-IV-I-V');
    expect(prog).toEqual([
      { root: 'C', type: 'major', duration: 4 },
      { root: 'F', type: 'major', duration: 4 },
      { root: 'C', type: 'major', duration: 4 },
      { root: 'G', type: 'major', duration: 4 },
    ]);
  });

  it('respects custom beatsPerChord', () => {
    const prog = generateProgression('C', 'ii-V-I', 2);
    expect(prog).toEqual([
      { root: 'D', type: 'minor', duration: 2 },
      { root: 'G', type: 'major', duration: 2 },
      { root: 'C', type: 'major', duration: 2 },
    ]);
  });

  it('works in key of G', () => {
    // G major: G Am Bm C D Em F#dim
    const prog = generateProgression('G', 'I-V-vi-IV');
    expect(prog).toEqual([
      { root: 'G', type: 'major', duration: 4 },
      { root: 'D', type: 'major', duration: 4 },
      { root: 'E', type: 'minor', duration: 4 },
      { root: 'C', type: 'major', duration: 4 },
    ]);
  });

  it('works in key of D with diminished vii chord', () => {
    // D major: D Em F#m G A Bm C#dim
    // ii-V-I = Em - A - D
    const prog = generateProgression('D', 'ii-V-I');
    expect(prog).toEqual([
      { root: 'E', type: 'minor', duration: 4 },
      { root: 'A', type: 'major', duration: 4 },
      { root: 'D', type: 'major', duration: 4 },
    ]);
  });

  it('throws on unknown progression name', () => {
    expect(() => generateProgression('C', 'I-ii-iii'))
      .toThrow('Unknown progression: "I-ii-iii"');
  });

  it('all 5 progressions produce at least 3 chords', () => {
    const progressionNames = [
      'I-IV-V-I', 'I-V-vi-IV', 'ii-V-I', 'I-vi-IV-V', 'I-IV-I-V',
    ];
    for (const name of progressionNames) {
      const prog = generateProgression('C', name);
      expect(prog.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('each chord has duration equal to beatsPerChord', () => {
    const prog = generateProgression('C', 'I-IV-V-I', 8);
    for (const chord of prog) {
      expect(chord.duration).toBe(8);
    }
  });
});
