import { createRunId } from '../siteIds.js';
import {
  SiteSensoriumConfigInputSchema,
  type AestheticIntent,
  type AestheticLayerConfig,
  type RawSensoriumEvent,
  type SiteSensoriumConfig,
  type SiteSensoriumConfigInput,
  type SiteSignalVector,
} from '../types.js';

const STANDARD_EVENTS = new Set([
  '$pageview',
  '$pageleave',
  '$autocapture',
  '$web_vitals',
  '$scroll_depth',
  'pageview',
  'click',
  'scroll',
]);

export const SENSORIUM_LAYER_CLAMPS = {
  paletteTemperature: { min: 0.25, max: 0.75 },
  motionIntensity: { min: 0, max: 0.35 },
  visualDensity: { min: 0.1, max: 0.45 },
  textureStrength: { min: 0, max: 0.3 },
  contrastSupport: { min: 0.6, max: 1 },
  experimentalBias: { min: 0, max: 0.4 },
} as const;

export function createSensoriumConfigFromEvents(siteId: string, input: SiteSensoriumConfigInput = {}): SiteSensoriumConfig {
  const parsed = SiteSensoriumConfigInputSchema.parse(input);
  const signalVector = extractSiteSignalVector(parsed.events);
  const intent = mapSignalsToAestheticIntent(signalVector);
  const layerConfig = applyMissionGuardrails(intent, parsed.reducedMotion);
  return {
    configId: createRunId('sensorium'),
    siteId,
    createdAt: new Date().toISOString(),
    source: parsed.source,
    eventWindow: parsed.window,
    signalVector,
    intent,
    layerConfig,
    guardrails: {
      missionLocked: true,
      protectedSurfaces: ['copy', 'layout', 'navigation', 'forms', 'seo', 'cta-targets', 'analytics'],
      clamps: { ...SENSORIUM_LAYER_CLAMPS },
      notes: [
        'Sensorium may only tune reversible atmospheric assets.',
        'PostHog signals cannot rewrite content, conversion flow, metadata, navigation, or analytics capture.',
        'The runtime layer must be pointer-events:none and fail closed when config loading fails.',
      ],
    },
    provenance: {
      engine: 'liminal-sites',
      sensor: 'posthog',
      mode: 'fixture-first',
      eventCount: parsed.events.length,
      notes: parsed.notes,
    },
  };
}

export function extractSiteSignalVector(events: RawSensoriumEvent[]): SiteSignalVector {
  const sampleSize = events.length;
  const pageviewCount = events.filter((event) => isPageview(event.event)).length;
  const intentCount = events.filter(isIntentEvent).length;
  const frictionCount = events.filter(isFrictionEvent).length;
  const noveltyCount = events.filter(isNovelEvent).length;
  const distinctIds = new Set(events.map((event) => event.distinctId).filter(Boolean));
  const returningIds = new Set(events.filter(isReturningEvent).map((event) => event.distinctId).filter(Boolean));
  const paths = new Set(events.map(eventPath).filter(Boolean));
  const scrollScores = events.map(scrollScore).filter((score): score is number => score !== undefined);
  const dwellScores = events.map(dwellScore).filter((score): score is number => score !== undefined);
  const maxScroll = scrollScores.length ? Math.max(...scrollScores) : 0;
  const attention = clamp01((mean(dwellScores) * 0.45) + (mean(scrollScores) * 0.35) + (clamp01(pageviewCount / Math.max(1, paths.size * 3)) * 0.2));
  const intent = clamp01((intentCount / Math.max(1, sampleSize)) * 3);
  const depth = clamp01((maxScroll * 0.65) + (clamp01(paths.size / 5) * 0.35));
  const friction = clamp01((frictionCount / Math.max(1, sampleSize)) * 3);
  const returnWarmth = clamp01((returningIds.size / Math.max(1, distinctIds.size)) * 0.75 + (events.filter(isReturnVisitEvent).length / Math.max(1, sampleSize)) * 1.5);
  const novelty = clamp01((noveltyCount / Math.max(1, sampleSize)) * 2 + (clamp01(paths.size / 8) * 0.2));
  const silence = sampleSize === 0
    ? 1
    : clamp01(1 - clamp01(sampleSize / 80) * 0.72 - attention * 0.18 - intent * 0.1);
  const confidence = clamp01(0.22 + clamp01(sampleSize / 120) * 0.45 + (scrollScores.length ? 0.12 : 0) + (dwellScores.length ? 0.12 : 0) + (distinctIds.size ? 0.09 : 0));
  return {
    sampleSize,
    attention,
    intent,
    depth,
    friction,
    returnWarmth,
    novelty,
    silence,
    confidence,
    notes: signalNotes({ sampleSize, attention, intent, friction, silence, confidence }),
  };
}

export function mapSignalsToAestheticIntent(signal: SiteSignalVector): AestheticIntent {
  return {
    calmness: clamp01(0.55 + signal.friction * 0.25 + signal.silence * 0.12 - signal.novelty * 0.15),
    clarity: clamp01(0.58 + signal.intent * 0.18 + signal.friction * 0.22 - signal.novelty * 0.08),
    warmth: clamp01(0.46 + signal.returnWarmth * 0.32 + signal.attention * 0.14),
    motion: clamp01(0.14 + signal.attention * 0.22 + signal.novelty * 0.18 - signal.friction * 0.28 - signal.silence * 0.12),
    complexity: clamp01(0.18 + signal.depth * 0.22 + signal.novelty * 0.26 - signal.friction * 0.18),
    contrast: clamp01(0.62 + signal.friction * 0.24 + signal.intent * 0.1),
    experimentalism: clamp01(0.1 + signal.novelty * 0.3 + signal.attention * 0.12 - signal.intent * 0.12 - signal.friction * 0.22),
    notes: intentNotes(signal),
  };
}

export function applyMissionGuardrails(intent: AestheticIntent, reducedMotion = false): AestheticLayerConfig {
  const layer = {
    paletteTemperature: clamp(intent.warmth, SENSORIUM_LAYER_CLAMPS.paletteTemperature),
    motionIntensity: reducedMotion ? 0 : clamp(intent.motion * 0.72, SENSORIUM_LAYER_CLAMPS.motionIntensity),
    visualDensity: clamp(0.14 + intent.complexity * 0.36 - intent.clarity * 0.08, SENSORIUM_LAYER_CLAMPS.visualDensity),
    textureStrength: clamp(intent.experimentalism * 0.65, SENSORIUM_LAYER_CLAMPS.textureStrength),
    contrastSupport: clamp(intent.contrast, SENSORIUM_LAYER_CLAMPS.contrastSupport),
    experimentalBias: clamp(intent.experimentalism, SENSORIUM_LAYER_CLAMPS.experimentalBias),
  };
  const guardedLayer = {
    ...layer,
    reducedMotion,
    cssVariables: buildCssVariables(layer, reducedMotion),
    runtimeFlags: {
      protectContent: true,
      pointerEvents: 'none',
      source: 'liminal-sites-sensorium',
    },
  } satisfies AestheticLayerConfig;
  return guardedLayer;
}

function isPageview(name: string): boolean {
  const normalized = name.toLowerCase();
  return normalized === '$pageview' || normalized === 'pageview';
}

function isIntentEvent(event: RawSensoriumEvent): boolean {
  const name = event.event.toLowerCase();
  const target = stringProperty(event.properties, ['$el_text', 'text', 'label', 'target', 'name']).toLowerCase();
  return /click|submit|signup|contact|lead|demo|checkout|cta|subscribe/.test(name)
    || /contact|demo|start|buy|join|book|subscribe|get in touch/.test(target);
}

function isFrictionEvent(event: RawSensoriumEvent): boolean {
  const name = event.event.toLowerCase();
  if (/dead_click|rage|error|exception|bounce|form_abandon/.test(name)) return true;
  if (name === '$web_vitals') {
    const lcp = numberProperty(event.properties, ['$lcp', 'lcp']);
    const cls = numberProperty(event.properties, ['$cls', 'cls']);
    const inp = numberProperty(event.properties, ['$inp', 'inp']);
    return (lcp !== undefined && lcp > 4000) || (cls !== undefined && cls > 0.25) || (inp !== undefined && inp > 500);
  }
  return false;
}

function isNovelEvent(event: RawSensoriumEvent): boolean {
  const name = event.event.toLowerCase();
  return !STANDARD_EVENTS.has(name) && !isIntentEvent(event) && !isFrictionEvent(event);
}

function isReturningEvent(event: RawSensoriumEvent): boolean {
  return Boolean(booleanProperty(event.properties, ['$is_returning', 'is_returning', 'returning']));
}

function isReturnVisitEvent(event: RawSensoriumEvent): boolean {
  const name = event.event.toLowerCase();
  return /return|revisit/.test(name) || isReturningEvent(event);
}

function eventPath(event: RawSensoriumEvent): string {
  return stringProperty(event.properties, ['$pathname', 'pathname', 'path', '$current_url', 'url']);
}

function scrollScore(event: RawSensoriumEvent): number | undefined {
  const value = numberProperty(event.properties, ['$scroll_depth', 'scroll_depth', 'scroll_percent', '$scroll_percentage', 'max_scroll']);
  if (value === undefined) return undefined;
  return clamp01(value > 1 ? value / 100 : value);
}

function dwellScore(event: RawSensoriumEvent): number | undefined {
  const seconds = secondsProperty(event.properties, ['dwell_seconds', 'time_on_page', '$session_duration', 'duration_seconds']);
  const milliseconds = secondsProperty(event.properties, ['dwell_ms', 'duration_ms'], 1000);
  const value = seconds ?? milliseconds;
  if (value === undefined) return undefined;
  return clamp01(value / 120);
}

function signalNotes(input: {
  sampleSize: number;
  attention: number;
  intent: number;
  friction: number;
  silence: number;
  confidence: number;
}): string[] {
  const notes = [`Normalized ${input.sampleSize} PostHog-shaped events into bounded site signals.`];
  if (input.confidence < 0.45) notes.push('Low sample confidence: keep changes subtle and fixture-gated.');
  if (input.friction > 0.35) notes.push('Friction is elevated: increase clarity and suppress ornamental motion.');
  if (input.intent > 0.35) notes.push('Intent signals exist: protect CTA surfaces and avoid layout changes.');
  if (input.attention > 0.45) notes.push('Attention signals can support a slightly richer ambient layer.');
  if (input.silence > 0.65) notes.push('Sparse signal field: treat silence as a request for calm defaults.');
  return notes;
}

function intentNotes(signal: SiteSignalVector): string[] {
  const notes = ['Aesthetic intent is advisory and mission-locked to atmosphere only.'];
  if (signal.friction > 0.3) notes.push('Favor calmer motion and stronger contrast because friction is visible.');
  if (signal.intent > 0.3) notes.push('Keep interaction zones untouched because intent is present.');
  if (signal.novelty > 0.25) notes.push('Allow limited texture/novelty without changing information architecture.');
  return notes;
}

function buildCssVariables(layer: Omit<AestheticLayerConfig, 'cssVariables' | 'runtimeFlags' | 'reducedMotion'>, reducedMotion: boolean): Record<string, string> {
  const warmHue = Math.round(18 + layer.paletteTemperature * 34);
  const coolHue = Math.round(198 + layer.experimentalBias * 36);
  const alpha = (0.04 + layer.textureStrength * 0.22 + layer.visualDensity * 0.1).toFixed(3);
  const duration = reducedMotion ? '0s' : `${Math.round(28 - layer.motionIntensity * 48)}s`;
  return {
    '--liminal-sensorium-warm': `hsla(${warmHue}, 92%, 60%, ${alpha})`,
    '--liminal-sensorium-cool': `hsla(${coolHue}, 88%, 62%, ${Math.max(0.035, Number(alpha) * 0.8).toFixed(3)})`,
    '--liminal-sensorium-contrast': layer.contrastSupport.toFixed(3),
    '--liminal-sensorium-density': layer.visualDensity.toFixed(3),
    '--liminal-sensorium-texture': layer.textureStrength.toFixed(3),
    '--liminal-sensorium-motion': layer.motionIntensity.toFixed(3),
    '--liminal-sensorium-duration': duration,
  };
}

function numberProperty(properties: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = properties[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

function secondsProperty(properties: Record<string, unknown>, keys: string[], divisor = 1): number | undefined {
  const value = numberProperty(properties, keys);
  return value === undefined ? undefined : value / divisor;
}

function stringProperty(properties: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = properties[key];
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
  }
  return '';
}

function booleanProperty(properties: Record<string, unknown>, keys: string[]): boolean | undefined {
  for (const key of keys) {
    const value = properties[key];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
    }
  }
  return undefined;
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, bounds: { min: number; max: number }): number {
  return Math.min(bounds.max, Math.max(bounds.min, value));
}

function clamp01(value: number): number {
  return clamp(value, { min: 0, max: 1 });
}
