import { describe, expect, it } from 'vitest';
import {
  applyMissionGuardrails,
  createSensoriumConfigFromEvents,
  extractSiteSignalVector,
  mapSignalsToAestheticIntent,
} from '../../../src/sites/sensorium/SensoriumPipeline.js';
import type { RawSensoriumEvent } from '../../../src/sites/types.js';

const fixtureEvents: RawSensoriumEvent[] = [
  {
    event: '$pageview',
    distinctId: 'visitor-1',
    properties: { $pathname: '/', dwell_seconds: 84, $is_returning: true },
  },
  {
    event: '$scroll_depth',
    distinctId: 'visitor-1',
    properties: { $pathname: '/', scroll_depth: 82 },
  },
  {
    event: '$autocapture',
    distinctId: 'visitor-2',
    properties: { $pathname: '/', $el_text: 'Book a strategy call' },
  },
  {
    event: 'liminal_case_study_hover',
    distinctId: 'visitor-2',
    properties: { pathname: '/work' },
  },
];

describe('SensoriumPipeline', () => {
  it('normalizes PostHog-shaped events into bounded site signals', () => {
    const signal = extractSiteSignalVector(fixtureEvents);

    expect(signal.sampleSize).toBe(4);
    expect(signal.attention).toBeGreaterThan(0.2);
    expect(signal.intent).toBeGreaterThan(0);
    expect(signal.depth).toBeGreaterThan(0.4);
    expect(signal.novelty).toBeGreaterThan(0);
    expect(signal.confidence).toBeGreaterThan(0.4);
    expect(signal.notes.join(' ')).toContain('PostHog-shaped events');
  });

  it('maps signals to mission-locked aesthetic intent and guarded layer values', () => {
    const signal = extractSiteSignalVector([
      ...fixtureEvents,
      {
        event: '$dead_click',
        distinctId: 'visitor-3',
        properties: { $pathname: '/pricing' },
      },
    ]);
    const intent = mapSignalsToAestheticIntent(signal);
    const layer = applyMissionGuardrails(intent);

    expect(intent.clarity).toBeGreaterThan(0.6);
    expect(layer.motionIntensity).toBeLessThanOrEqual(0.35);
    expect(layer.visualDensity).toBeLessThanOrEqual(0.45);
    expect(layer.textureStrength).toBeLessThanOrEqual(0.3);
    expect(layer.runtimeFlags).toEqual({
      protectContent: true,
      pointerEvents: 'none',
      source: 'liminal-sites-sensorium',
    });
  });

  it('creates a config receipt that treats sparse signal fields conservatively', () => {
    const config = createSensoriumConfigFromEvents('kyanite-labs-site', {
      events: [],
      reducedMotion: true,
      notes: ['fixture covers no-traffic launch state'],
    });

    expect(config.configId).toMatch(/^sensorium-/);
    expect(config.signalVector.silence).toBe(1);
    expect(config.layerConfig.motionIntensity).toBe(0);
    expect(config.guardrails.protectedSurfaces).toContain('seo');
    expect(config.provenance.sensor).toBe('posthog');
    expect(config.provenance.mode).toBe('fixture-first');
  });
});
