import type { AudioFeatures, PitchData, TimbreData, VisualMappingParams } from './types.js';

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function normalize(v: number, min: number, max: number): number {
  return clamp((v - min) / (max - min), 0, 1);
}

const DEFAULT_TIMBRE: TimbreData = { brightness: 0.5, roughness: 0.3, warmth: 0.5, noisiness: 0.2 };

export function mapToVisualParams(
  features: AudioFeatures,
  pitch: PitchData | null,
  timbre: TimbreData = DEFAULT_TIMBRE
): VisualMappingParams {
  // Palette hues: derived from pitch (low=warm/red ~0.0, high=cool/blue ~0.75)
  const primaryHue = pitch
    ? normalize(pitch.frequency, 80, 1200) * 0.75  // maps 80Hz->0.0, 1200Hz->0.75
    : 0.5;

  // Chroma-based secondary hues
  const chromaHues = pitch ? [
    primaryHue,
    (primaryHue + 0.33) % 1,  // analogous offset
    (primaryHue + 0.17) % 1
  ] : [0.5, 0.6, 0.4];

  const saturationBase = normalize(1 - features.spectralFlatness, 0, 1);
  const lightnessBase = normalize(features.spectralCentroid, 500, 8000);

  const palette = {
    hues: chromaHues,
    saturations: chromaHues.map(() => clamp(saturationBase * 0.8 + 0.1, 0, 1)),
    lightness: chromaHues.map((_, i) => clamp(lightnessBase * 0.6 + 0.2 + i * 0.05, 0, 1))
  };

  // Motion
  const turbulence = normalize(features.spectralFlux, 0, 1);
  const speed = normalize(features.rms * 3, 0, 1);  // RMS-proportional speed
  const rhythm: 'smooth' | 'pulsing' | 'chaotic' =
    turbulence < 0.3 ? 'smooth' : turbulence < 0.7 ? 'pulsing' : 'chaotic';

  const motion = { speed, turbulence, rhythm };

  // Form
  const form = {
    complexity: normalize(timbre.noisiness * 0.5 + features.mfcc.length / 13 * 0.5, 0, 1),
    sharpness: normalize(1 - features.spectralFlatness, 0, 1),
    scale: normalize(features.rms, 0, 1)
  };

  // Dynamics
  const dynamics = {
    energy: normalize(features.rms, 0, 1),
    envelope: [features.rms, features.energy, features.loudness / -60].map(v => clamp(v, 0, 1)),
    onsets: [] as number[]
  };

  // Composition
  const composition = {
    focalWeight: clamp(normalize(features.rms + features.spectralFlux, 0, 2), 0, 1),
    balance: clamp(0.5 + (1 - Math.abs(features.spectralCentroid / 8000 - 0.5)) * 0.3, 0, 1)
  };

  return { palette, motion, form, dynamics, composition };
}
