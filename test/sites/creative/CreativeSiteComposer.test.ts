import { describe, expect, it } from 'vitest';
import { composeCreativeSite } from '../../../src/sites/creative/CreativeSiteComposer.js';
import { GLSLValidator } from '../../../src/core/validators/GLSLValidator.js';
import type { SiteProfile, SkinSpec, WebsiteIngestionResult } from '../../../src/sites/types.js';

const profile: SiteProfile = {
  siteId: 'creative-site',
  name: 'Creative Site',
  sourceUrl: 'https://example.com',
  brandBrief: 'A cross-domain website that should feel generative, artistic, and operator trustworthy.',
  constraints: ['No network dependency in the runtime proof.'],
  allowedModes: ['runtime-skin'],
  stackHints: ['static-html'],
  createdAt: '2026-05-07T00:00:00.000Z',
  updatedAt: '2026-05-07T00:00:00.000Z',
};

const skin: SkinSpec = {
  siteId: profile.siteId,
  skinId: 'creative-site-skin-abc12345-1',
  name: 'Creative Site direction 1',
  prompt: 'Build an artistic living site.',
  createdAt: '2026-05-07T00:00:00.000Z',
  tokens: {
    palette: {
      background: 'hsl(210 30% 8%)',
      surface: 'hsl(210 26% 13%)',
      text: 'hsl(210 22% 94%)',
      mutedText: 'hsl(210 13% 67%)',
      accent: 'hsl(33 86% 62%)',
      accent2: 'hsl(178 76% 58%)',
      line: 'hsl(210 22% 24%)',
    },
    typography: {
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      headingScale: 1.2,
      bodyScale: 1,
    },
    motion: {
      intensity: 0.76,
      rhythm: 'kinetic',
    },
    shape: {
      radius: 12,
      density: 'balanced',
    },
  },
  runtime: {
    css: ':root { --liminal-sites-accent: hsl(33 86% 62%); }',
    js: "document.body.classList.add('liminal-sites-active');",
  },
  provenance: {
    engine: 'liminal-sites',
    mode: 'runtime-skin',
    seed: 'abc12345seed',
    source: 'evolution',
  },
  quality: {
    score: 0.86,
    notes: ['Evolved from preference memory.'],
  },
};

const ingestion: WebsiteIngestionResult = {
  siteId: profile.siteId,
  ingestionId: 'ingest-creative',
  createdAt: '2026-05-07T00:00:00.000Z',
  source: { kind: 'url', value: 'https://example.com' },
  title: 'Creative Source',
  description: 'Plain source site with cards and hero copy.',
  metrics: {
    viewport: { width: 1360, height: 860 },
    bodyTextLength: 840,
    headingCount: 4,
    linkCount: 2,
    buttonCount: 1,
    imageCount: 0,
    formCount: 0,
    sectionCount: 3,
    largestElementAreaRatio: 0.42,
  },
  designSignals: {
    colors: ['#0b1115', '#72d399', '#63cdda'],
    fonts: ['Inter'],
    headings: ['A tiny website that should learn in public.', 'Ingest', 'Mutate'],
    density: 'balanced',
    motionPreference: 'kinetic',
    notes: ['Hero and proof cells are visible in the first viewport.'],
  },
  recommendedBrandBrief: 'Generative living website with visible proof.',
  operatorNotes: ['Use browser-visible proof before claiming quality.'],
};

describe('CreativeSiteComposer', () => {
  it('assembles a validated cross-domain creative composition with installable runtime assets', () => {
    const composition = composeCreativeSite({
      profile,
      skin,
      ingestion,
      preferences: [],
      prompt: 'Use shader atmosphere and kinetic text so the website feels like it is making itself.',
    });

    expect(composition.siteId).toBe(profile.siteId);
    expect(composition.skinId).toBe(skin.skinId);
    expect(composition.domains).toEqual(expect.arrayContaining(['shader', 'textgen']));
    expect(new Set(composition.domains).size).toBeGreaterThanOrEqual(2);
    expect(composition.layers).toHaveLength(2);
    expect(composition.layers.map((layer) => layer.domain)).toEqual(expect.arrayContaining(['shader', 'textgen']));
    expect(composition.layers.every((layer) => layer.validation.valid)).toBe(true);

    const shaderLayer = composition.layers.find((layer) => layer.domain === 'shader');
    expect(shaderLayer?.domain).toBe('shader');
    expect(GLSLValidator.validate(shaderLayer?.code ?? '')).toEqual({ valid: true, errors: [] });

    expect(composition.runtime.css).toContain('#liminal-sites-creative-stage');
    expect(composition.runtime.js).toContain('window.__liminalSitesCreative');
    expect(composition.runtime.js).toContain('data-liminal-domain="shader"');
    expect(composition.runtime.manifest.domains).toEqual(expect.arrayContaining(['shader', 'textgen']));
    expect(composition.operatorNotes.join(' ')).toContain('shader');
  });
});
