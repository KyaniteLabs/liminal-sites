import { createRunId } from '../siteIds.js';
import type {
  PreferenceEvent,
  SiteAestheticAssessment,
  SiteAestheticAssessmentCandidate,
  SkinSpec,
  WebsiteIngestionResult,
} from '../types.js';

export interface CompareSiteAestheticsInput {
  siteId: string;
  variants: SkinSpec[];
  ingestion?: WebsiteIngestionResult;
  preferences: PreferenceEvent[];
}

interface VariantMemory {
  liked: SkinSpec[];
  rejected: SkinSpec[];
  direct: Map<string, number>;
  summary: string;
}

const DENSITY_ORDER = ['spare', 'balanced', 'dense'];
const MOTION_ORDER = ['quiet', 'drift', 'pulse', 'kinetic'];

export function compareSiteAesthetics(input: CompareSiteAestheticsInput): SiteAestheticAssessment {
  const memory = buildVariantMemory(input.variants, input.preferences);
  const candidates = input.variants
    .map((variant) => scoreVariant(variant, input.ingestion, memory))
    .sort((a, b) => b.score - a.score)
    .map((candidate, index) => ({ ...candidate, rank: index + 1 }));
  const winner = candidates[0];
  const assessmentId = createRunId('aesthetic');
  const operatorSummary = winner
    ? `${winner.name} is the strongest current direction at ${formatScore(winner.score)} because ${winner.rationale[0]?.toLowerCase() ?? 'it best balances fit and novelty'}.`
    : 'No generated variants are available to compare yet.';
  return {
    assessmentId,
    siteId: input.siteId,
    createdAt: new Date().toISOString(),
    ingestionId: input.ingestion?.ingestionId,
    winnerSkinId: winner?.skinId,
    preferenceSummary: memory.summary,
    operatorSummary,
    nextEvolutionPrompt: winner?.nextPrompt ?? 'Generate variants before asking the aesthetic loop to compare them.',
    candidates,
  };
}

function scoreVariant(
  variant: SkinSpec,
  ingestion: WebsiteIngestionResult | undefined,
  memory: VariantMemory,
): SiteAestheticAssessmentCandidate {
  const quality = clamp01(variant.quality.score);
  const continuity = ingestion ? scoreContinuity(variant, ingestion) : 0.58;
  const novelty = scoreNovelty(variant, ingestion);
  const taste = scoreTaste(variant, memory);
  const operatorConfidence = clamp01((continuity * 0.36) + (taste * 0.28) + (quality * 0.24) + (novelty * 0.12));
  const score = clamp01((quality * 0.3) + (continuity * 0.28) + (taste * 0.27) + (novelty * 0.15));
  const rationale = buildRationale({ variant, ingestion, continuity, novelty, taste, quality });
  return {
    skinId: variant.skinId,
    name: variant.name,
    rank: 0,
    score: round(score),
    breakdown: {
      quality: round(quality),
      continuity: round(continuity),
      novelty: round(novelty),
      taste: round(taste),
      operatorConfidence: round(operatorConfidence),
    },
    signals: {
      motion: variant.tokens.motion.rhythm,
      density: variant.tokens.shape.density,
      palette: [
        variant.tokens.palette.background,
        variant.tokens.palette.accent,
        variant.tokens.palette.accent2,
        variant.tokens.palette.text,
      ],
    },
    rationale,
    risks: buildRisks({ variant, ingestion, continuity, novelty, taste }),
    nextPrompt: buildNextPrompt(variant, ingestion, memory),
  };
}

function buildVariantMemory(variants: SkinSpec[], preferences: PreferenceEvent[]): VariantMemory {
  const variantsById = new Map(variants.map((variant) => [variant.skinId, variant]));
  const direct = new Map<string, number>();
  const liked: SkinSpec[] = [];
  const rejected: SkinSpec[] = [];
  for (const event of preferences) {
    const delta = preferenceDelta(event.kind);
    direct.set(event.skinId, (direct.get(event.skinId) ?? 0) + delta);
    const variant = variantsById.get(event.skinId);
    if (!variant) continue;
    if (delta > 0) liked.push(variant);
    if (delta < 0) rejected.push(variant);
  }
  const positive = preferences.filter((event) => preferenceDelta(event.kind) > 0).length;
  const negative = preferences.filter((event) => preferenceDelta(event.kind) < 0).length;
  const summary = preferences.length === 0
    ? 'Taste memory: no operator preferences recorded yet.'
    : `Taste memory: ${positive} positive, ${negative} negative, ${preferences.length} total operator signals.`;
  return { liked, rejected, direct, summary };
}

function preferenceDelta(kind: PreferenceEvent['kind']): number {
  if (kind === 'publish') return 0.28;
  if (kind === 'favorite') return 0.22;
  if (kind === 'more-like-this') return 0.18;
  if (kind === 'reject') return -0.22;
  if (kind === 'less-like-this') return -0.18;
  return 0;
}

function scoreTaste(variant: SkinSpec, memory: VariantMemory): number {
  const directSignal = memory.direct.get(variant.skinId) ?? 0;
  const likedAffinity = memory.liked.length > 0 ? average(memory.liked.map((liked) => tokenAffinity(variant, liked))) : 0.54;
  const rejectedAffinity = memory.rejected.length > 0 ? average(memory.rejected.map((rejected) => tokenAffinity(variant, rejected))) : 0.18;
  return clamp01(0.5 + directSignal + (likedAffinity - 0.54) * 0.42 - rejectedAffinity * 0.22);
}

function tokenAffinity(a: SkinSpec, b: SkinSpec): number {
  const density = a.tokens.shape.density === b.tokens.shape.density ? 1 : 0.45;
  const motion = a.tokens.motion.rhythm === b.tokens.motion.rhythm ? 1 : 0.45;
  const radius = 1 - Math.min(1, Math.abs(a.tokens.shape.radius - b.tokens.shape.radius) / 48);
  const accent = hueCloseness(colorHue(a.tokens.palette.accent), colorHue(b.tokens.palette.accent));
  return average([density, motion, radius, accent]);
}

function scoreContinuity(variant: SkinSpec, ingestion: WebsiteIngestionResult): number {
  const density = orderedMatch(variant.tokens.shape.density, ingestion.designSignals.density, DENSITY_ORDER);
  const motion = orderedMatch(variant.tokens.motion.rhythm, normalizeIngestionMotion(ingestion.designSignals.motionPreference), MOTION_ORDER);
  const color = bestPaletteContinuity(variant, ingestion);
  const typography = scoreTypographyContinuity(variant, ingestion);
  return clamp01((density * 0.24) + (motion * 0.22) + (color * 0.34) + (typography * 0.2));
}

function scoreNovelty(variant: SkinSpec, ingestion: WebsiteIngestionResult | undefined): number {
  const motionNovelty = variant.tokens.motion.intensity;
  const shapeNovelty = Math.min(1, variant.tokens.shape.radius / 24);
  if (!ingestion) return clamp01(0.45 + motionNovelty * 0.22 + shapeNovelty * 0.16);
  const continuity = scoreContinuity(variant, ingestion);
  return clamp01(0.42 + (1 - continuity) * 0.34 + motionNovelty * 0.16 + shapeNovelty * 0.08);
}

function bestPaletteContinuity(variant: SkinSpec, ingestion: WebsiteIngestionResult): number {
  const sourceHues = ingestion.designSignals.colors.map(colorHue).filter((hue): hue is number => typeof hue === 'number');
  if (sourceHues.length === 0) return 0.55;
  const variantHues = [
    variant.tokens.palette.background,
    variant.tokens.palette.surface,
    variant.tokens.palette.accent,
    variant.tokens.palette.accent2,
    variant.tokens.palette.text,
  ].map(colorHue).filter((hue): hue is number => typeof hue === 'number');
  if (variantHues.length === 0) return 0.55;
  return average(variantHues.map((hue) => Math.max(...sourceHues.map((sourceHue) => hueCloseness(hue, sourceHue)))));
}

function scoreTypographyContinuity(variant: SkinSpec, ingestion: WebsiteIngestionResult): number {
  const fonts = ingestion.designSignals.fonts.join(' ').toLowerCase();
  const variantFont = variant.tokens.typography.fontFamily.toLowerCase();
  if (!fonts) return 0.56;
  if (fonts.includes('inter') && variantFont.includes('inter')) return 0.92;
  if ((fonts.includes('serif') || fonts.includes('georgia')) && variantFont.includes('serif')) return 0.9;
  if ((fonts.includes('sans') || fonts.includes('system')) && variantFont.includes('sans')) return 0.82;
  return 0.48;
}

function orderedMatch(value: string, target: string, order: string[]): number {
  const valueIndex = order.indexOf(value);
  const targetIndex = order.indexOf(target);
  if (valueIndex < 0 || targetIndex < 0) return 0.55;
  return 1 - Math.min(1, Math.abs(valueIndex - targetIndex) / Math.max(1, order.length - 1));
}

function normalizeIngestionMotion(motion: WebsiteIngestionResult['designSignals']['motionPreference']): string {
  if (motion === 'quiet') return 'drift';
  return motion;
}

function buildRationale(input: {
  variant: SkinSpec;
  ingestion?: WebsiteIngestionResult;
  continuity: number;
  novelty: number;
  taste: number;
  quality: number;
}): string[] {
  const rationale = [
    `Quality ${formatScore(input.quality)} with ${input.variant.tokens.motion.rhythm} motion and ${input.variant.tokens.shape.density} density.`,
  ];
  if (input.ingestion) {
    rationale.push(`Continuity ${formatScore(input.continuity)} against ${input.ingestion.title}'s captured color, density, motion, and typography signals.`);
  }
  rationale.push(input.taste >= 0.58
    ? `Taste score ${formatScore(input.taste)} aligns with recorded operator preference memory.`
    : `Taste score ${formatScore(input.taste)} leaves room for another operator signal.`);
  rationale.push(`Novelty ${formatScore(input.novelty)} keeps the direction from freezing into the current page.`);
  return rationale;
}

function buildRisks(input: {
  variant: SkinSpec;
  ingestion?: WebsiteIngestionResult;
  continuity: number;
  novelty: number;
  taste: number;
}): string[] {
  const risks: string[] = [];
  if (input.continuity < 0.45) risks.push('May drift too far from the captured source site.');
  if (input.novelty < 0.42) risks.push('May feel too close to the current page to justify an evolution.');
  if (input.taste < 0.44) risks.push('Needs more operator preference data before trusting this direction.');
  if (input.variant.tokens.motion.intensity > 0.72) risks.push('High motion may need a reduced-motion fallback before shipping.');
  if (risks.length === 0) risks.push('No major operator-path risks detected for a reviewable preview.');
  return risks;
}

function buildNextPrompt(
  variant: SkinSpec,
  ingestion: WebsiteIngestionResult | undefined,
  memory: VariantMemory,
): string {
  const source = ingestion ? `Keep continuity with ${ingestion.title}'s ${ingestion.designSignals.density} density and visible color system.` : 'Keep continuity with the current profile.';
  const memoryLine = memory.summary.replace('Taste memory: ', 'Taste memory says ');
  return [
    `Evolve toward ${variant.name}.`,
    source,
    `Preserve ${variant.tokens.motion.rhythm} motion, ${variant.tokens.shape.density} density, and the strongest accent relationship.`,
    memoryLine,
  ].join(' ');
}

function colorHue(color: string): number | undefined {
  const hsl = /hsla?\(\s*([+-]?\d+(?:\.\d+)?)/i.exec(color);
  if (hsl) return normalizeHue(Number(hsl[1]));
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color);
  if (hex) {
    const full = hex[1].length === 3
      ? hex[1].split('').map((digit) => `${digit}${digit}`).join('')
      : hex[1];
    return rgbToHue(Number.parseInt(full.slice(0, 2), 16), Number.parseInt(full.slice(2, 4), 16), Number.parseInt(full.slice(4, 6), 16));
  }
  const rgb = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i.exec(color);
  if (rgb) return rgbToHue(Number(rgb[1]), Number(rgb[2]), Number(rgb[3]));
  return undefined;
}

function rgbToHue(red: number, green: number, blue: number): number {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  if (max === r) return normalizeHue(60 * (((g - b) / delta) % 6));
  if (max === g) return normalizeHue(60 * ((b - r) / delta + 2));
  return normalizeHue(60 * ((r - g) / delta + 4));
}

function hueCloseness(a: number | undefined, b: number | undefined): number {
  if (typeof a !== 'number' || typeof b !== 'number') return 0.55;
  const distance = Math.abs(a - b);
  return 1 - Math.min(distance, 360 - distance) / 180;
}

function normalizeHue(value: number): number {
  return ((value % 360) + 360) % 360;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function formatScore(value: number): string {
  return round(value).toFixed(2);
}
