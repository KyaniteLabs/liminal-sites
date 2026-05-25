import { CodeValidator } from '../../core/CodeValidator.js';
import { RenderAndScorePipeline } from '../../render/RenderAndScorePipeline.js';
import type { RenderDomain } from '../../render/HeadlessRenderer.js';
import { generatorRegistry, type GeneratorResult } from '../../generators/GeneratorRegistry.js';
import { registerAllGenerators } from '../../generators/registerGenerators.js';
import { EmergenceCritic } from '../../emergence/EmergenceCritic.js';
import { CompositionEngine } from '../../composition/CompositionEngine.js';
import { registerAllAdapters } from '../../composition/adapters/registerAdapters.js';
import { createLayer } from '../../composition/types.js';
import type { DomainType } from '../../composition/types.js';
import { createRunId, stableSeed } from '../siteIds.js';
import {
  FULL_LIMINAL_SITE_DOMAINS,
  buildLiminalCapabilityMatrix,
} from './LiminalCapabilityMatrix.js';
import type {
  NormalizedSiteCreativeCompositionInput,
  PreferenceEvent,
  SiteCreativeCapabilityStatus,
  SiteCreativeComposition,
  SiteCreativeDomain,
  SiteCreativeLayer,
  SiteCreativeRejectedCandidate,
  SiteCreativeRuntimeManifest,
  SiteProfile,
  SkinSpec,
  WebsiteIngestionResult,
} from '../types.js';

export interface LiminalGeneratedCandidate {
  code: string;
  model?: string;
  thinking?: string;
  warnings?: string[];
  generator?: string;
}

export interface LiminalSiteGeneratorBridge {
  generate(
    domain: SiteCreativeDomain,
    prompt: string,
    context: {
      attempt: number;
      profile: SiteProfile;
      skin: SkinSpec;
      ingestion?: WebsiteIngestionResult;
      preferences: PreferenceEvent[];
    },
  ): Promise<LiminalGeneratedCandidate>;
}

export type LiminalSiteRenderAndScore = (
  candidate: {
    candidateId: string;
    domain: SiteCreativeDomain;
    code: string;
  },
) => Promise<{
  success: boolean;
  score: number;
  domain: string;
  warnings?: string[];
  duration: number;
  error?: string;
}>;

export interface ComposeFullLiminalCreativeSiteInput {
  profile: SiteProfile;
  skin: SkinSpec;
  ingestion?: WebsiteIngestionResult;
  preferences?: PreferenceEvent[];
  prompt?: string;
  request: NormalizedSiteCreativeCompositionInput;
  generatorBridge?: LiminalSiteGeneratorBridge;
  renderAndScore?: LiminalSiteRenderAndScore;
}

interface CandidateFailure {
  domain: SiteCreativeDomain;
  stage: SiteCreativeRejectedCandidate['stage'];
  status: SiteCreativeRejectedCandidate['status'];
  reason: string;
  generator?: string;
  model?: string;
}

export async function composeFullLiminalCreativeSite(input: ComposeFullLiminalCreativeSiteInput): Promise<SiteCreativeComposition> {
  const prompt = input.prompt?.trim()
    || `Use every site-compatible Liminal capability to evolve ${input.profile.name}.`;
  const request = input.request;
  const selectedDomains = selectDomains(request);
  const generatorBridge = input.generatorBridge ?? createRegistryGeneratorBridge();
  const renderAndScore = input.renderAndScore ?? defaultRenderAndScore;
  const compositionId = createRunId('creative');
  const createdAt = new Date().toISOString();
  const seed = stableSeed(
    input.profile.siteId,
    input.skin.skinId,
    prompt,
    request.strategy,
    request.domainMode,
    selectedDomains.join(','),
  );
  const layers: SiteCreativeLayer[] = [];
  const rejectedCandidates: SiteCreativeRejectedCandidate[] = [];
  const capabilityOverrides: Partial<Record<SiteCreativeDomain, {
    status: SiteCreativeCapabilityStatus;
    evidence?: string[];
    reason?: string;
  }>> = {};

  for (const domain of selectedDomains) {
    if (!request.includeAudio && isAudioDomain(domain)) {
      const failure = reject({
        compositionId,
        domain,
        stage: 'generation',
        status: 'blocked',
        reason: 'Audio generation was disabled for this full-liminal run.',
      });
      rejectedCandidates.push(failure);
      capabilityOverrides[domain] = { status: 'blocked', evidence: [failure.reason], reason: failure.reason };
      continue;
    }
    if (!request.includeVideoAssets && isVideoDomain(domain)) {
      const failure = reject({
        compositionId,
        domain,
        stage: 'generation',
        status: 'blocked',
        reason: 'Video asset generation was disabled for this full-liminal run.',
      });
      rejectedCandidates.push(failure);
      capabilityOverrides[domain] = { status: 'blocked', evidence: [failure.reason], reason: failure.reason };
      continue;
    }

    const acceptedForDomain: SiteCreativeLayer[] = [];
    for (let attempt = 1; attempt <= request.candidatesPerDomain; attempt += 1) {
      const candidateId = `${compositionId}-${domain}-${attempt}`;
      let generated: LiminalGeneratedCandidate;
      try {
        generated = await generatorBridge.generate(domain, buildDomainPrompt(domain, prompt, input), {
          attempt,
          profile: input.profile,
          skin: input.skin,
          ingestion: input.ingestion,
          preferences: input.preferences ?? [],
        });
      } catch (error) {
        const failure = reject({
          compositionId,
          domain,
          stage: 'generation',
          status: 'failed',
          reason: error instanceof Error ? error.message : String(error),
        });
        rejectedCandidates.push(failure);
        capabilityOverrides[domain] = { status: 'failed', evidence: [failure.reason], reason: failure.reason };
        continue;
      }

      const validation = validateSiteCreativeCandidate(domain, generated.code);
      if (!validation.valid) {
        const failure = reject({
          compositionId,
          domain,
          stage: 'validation',
          status: 'failed',
          reason: validation.errors.join('; '),
          generator: generated.generator,
          model: generated.model,
        });
        rejectedCandidates.push(failure);
        capabilityOverrides[domain] = { status: 'failed', evidence: [failure.reason], reason: failure.reason };
        continue;
      }

      const render = await renderAndScore({ candidateId, domain, code: validation.cleanedCode });
      if (!render.success && !isAssetOnlyDomain(domain)) {
        const failure = reject({
          compositionId,
          domain,
          stage: 'render',
          status: 'failed',
          reason: render.error ?? 'Render-and-score pipeline failed without an error message.',
          generator: generated.generator,
          model: generated.model,
        });
        rejectedCandidates.push(failure);
        capabilityOverrides[domain] = { status: 'failed', evidence: [failure.reason], reason: failure.reason };
        continue;
      }

      const score = scoreCandidate(domain, render.score, generated.warnings ?? render.warnings ?? []);
      acceptedForDomain.push({
        layerId: `layer-${domain}-${seed.slice(0, 8)}-${attempt}`,
        domain,
        label: `${input.profile.name} ${domain} layer`,
        role: roleForDomain(domain),
        code: validation.cleanedCode,
        validation: {
          valid: true,
          errors: [],
        },
        generation: {
          generator: generated.generator ?? domain,
          model: generated.model,
          prompt,
          attempt,
          source: input.generatorBridge ? 'injected-generator' : 'generator-registry',
        },
        render: {
          success: render.success,
          score: render.score,
          domain: String(render.domain),
          duration: render.duration,
          warnings: render.warnings,
          error: render.error,
        },
        scoring: score,
        runtimeStatus: runtimeStatusForDomain(domain),
        installTarget: installTargetForDomain(domain),
      });
    }

    const selectedLayer = acceptedForDomain.sort((a, b) => (b.scoring?.score ?? 0) - (a.scoring?.score ?? 0))[0];
    if (selectedLayer) {
      layers.push(selectedLayer);
      capabilityOverrides[domain] = {
        status: 'used',
        evidence: [
          `selected-layer:${selectedLayer.layerId}`,
          `score:${(selectedLayer.scoring?.score ?? 0).toFixed(3)}`,
        ],
      };
    } else if (!capabilityOverrides[domain]) {
      const failure = reject({
        compositionId,
        domain,
        stage: 'selection',
        status: 'failed',
        reason: 'No candidate survived generation, validation, and render selection.',
      });
      rejectedCandidates.push(failure);
      capabilityOverrides[domain] = { status: 'failed', evidence: [failure.reason], reason: failure.reason };
    }
  }

  for (const domain of FULL_LIMINAL_SITE_DOMAINS) {
    if (!selectedDomains.includes(domain)) {
      capabilityOverrides[domain] = {
        status: 'available-not-selected',
        evidence: [`domainMode:${request.domainMode}`],
      };
    }
  }

  const capabilityMatrix = await buildLiminalCapabilityMatrix({
    strategy: request.strategy,
    domainMode: request.domainMode,
    selectedDomains: layers.map((layer) => layer.domain),
    overrides: capabilityOverrides,
    generatedAt: createdAt,
  });
  const compositionProject = buildCompositionProject({
    name: input.profile.name,
    prompt,
    layers,
  });
  const runtime = buildFullLiminalRuntime({
    compositionId,
    profile: input.profile,
    skin: input.skin,
    prompt,
    layers,
    compositionProject,
    capabilityMatrix,
    rejectedCandidates,
  });
  const averageScore = layers.length > 0
    ? layers.reduce((sum, layer) => sum + (layer.scoring?.score ?? 0), 0) / layers.length
    : 0;

  return {
    compositionId,
    siteId: input.profile.siteId,
    skinId: input.skin.skinId,
    prompt,
    createdAt,
    strategy: request.strategy,
    domainMode: request.domainMode,
    domains: layers.map((layer) => layer.domain),
    layers,
    runtime,
    provenance: {
      engine: 'liminal-sites',
      source: 'full-liminal-orchestrator',
      seed,
      adapters: [
        'GeneratorRegistry',
        'CodeValidator',
        'RenderAndScorePipeline',
        `CompositionEngine:${compositionProject.layerCount} layers`,
        'EmergenceCritic',
        'LivingSitesRuntimeCompiler',
      ],
    },
    capabilityMatrix,
    rejectedCandidates,
    quality: {
      score: Math.max(0, Math.min(0.99, averageScore)),
      notes: [
        `Full-liminal run used ${capabilityMatrix.summary.used}/${capabilityMatrix.summary.total} capabilities.`,
        `${capabilityMatrix.summary.failed} capabilities failed with receipts and ${capabilityMatrix.summary.blocked} were blocked explicitly.`,
      ],
    },
    operatorNotes: [
      'This composition is a full Liminal capability receipt, not a surface-only skin.',
      'Every failed or blocked domain is preserved in rejectedCandidates and capabilityMatrix.',
      'Audio domains are packaged behind a user-gesture gate; video domains are packaged as asset receipts when accepted.',
    ],
  };
}

function selectDomains(request: NormalizedSiteCreativeCompositionInput): SiteCreativeDomain[] {
  if (request.domainMode === 'all') return [...FULL_LIMINAL_SITE_DOMAINS];
  if (request.domainMode === 'selected' && request.domains?.length) return uniqueDomains(request.domains);
  const base: SiteCreativeDomain[] = ['shader', 'textgen', 'p5', 'three', 'svg', 'html', 'kinetic', 'ascii'];
  if (request.includeAudio) base.push('tone', 'strudel');
  if (request.includeVideoAssets) base.push('revideo', 'hyperframes');
  return uniqueDomains(request.domains?.length ? request.domains : base);
}

function uniqueDomains(domains: SiteCreativeDomain[]): SiteCreativeDomain[] {
  const allowed = new Set(FULL_LIMINAL_SITE_DOMAINS);
  return [...new Set(domains.filter((domain) => allowed.has(domain)))];
}

function buildCompositionProject(input: {
  name: string;
  prompt: string;
  layers: SiteCreativeLayer[];
}): NonNullable<SiteCreativeRuntimeManifest['compositionProject']> {
  const engine = new CompositionEngine({
    settings: {
      width: 1440,
      height: 900,
      backgroundColor: '#050816',
    },
  });
  registerAllAdapters(engine);
  const adapterBackedDomains = new Set(['p5', 'three', 'shader', 'hydra', 'tone', 'strudel', 'ascii', 'html']);
  for (const [index, layer] of input.layers.entries()) {
    engine.addLayer(createLayer(
      compositionDomainFor(layer.domain),
      layer.code,
      input.prompt,
      {
        generator: layer.generation?.generator ?? layer.domain,
        model: layer.generation?.model ?? 'unknown',
        validation: { passed: layer.validation.valid, errors: layer.validation.errors },
        aestheticScore: layer.scoring?.score,
        siteLayerId: layer.layerId,
      },
      {
        zIndex: index,
        opacity: layer.domain === 'shader' ? 0.62 : 1,
        role: layer.domain === 'shader' ? 'background' : 'overlay',
        transparentBackground: layer.domain !== 'html',
      },
    ));
  }
  const project = engine.exportProject(`${input.name} Full Liminal Site`);
  return {
    layerCount: project.composition.layers.length,
    domains: project.composition.layers.map((layer) => layer.type),
    adapterBackedDomains: input.layers
      .map((layer) => layer.domain)
      .filter((domain) => adapterBackedDomains.has(domain)),
  };
}

function compositionDomainFor(domain: SiteCreativeDomain): DomainType {
  if (domain === 'svg' || domain === 'kinetic') return 'html';
  if (domain === 'revideo' || domain === 'hyperframes') return 'video';
  return domain;
}

function buildDomainPrompt(domain: SiteCreativeDomain, prompt: string, input: ComposeFullLiminalCreativeSiteInput): string {
  const ingestionSummary = input.ingestion
    ? `Current site: ${input.ingestion.title}; density=${input.ingestion.designSignals.density}; headings=${input.ingestion.designSignals.headings.slice(0, 3).join(' | ')}.`
    : 'No ingestion receipt is available.';
  const preferenceSummary = (input.preferences ?? []).slice(-5).map((preference) => `${preference.kind}:${preference.note ?? preference.skinId}`).join(' | ') || 'No taste memory yet.';
  return [
    `Target creative domain: ${domain}`,
    `Living site: ${input.profile.name}`,
    `Brand brief: ${input.profile.brandBrief}`,
    ingestionSummary,
    `Selected skin: ${input.skin.name}; rhythm=${input.skin.tokens.motion.rhythm}; density=${input.skin.tokens.shape.density}.`,
    `Taste memory: ${preferenceSummary}`,
    prompt,
  ].join('\n');
}

function validateSiteCreativeCandidate(domain: SiteCreativeDomain, code: string): { valid: boolean; cleanedCode: string; errors: string[] } {
  if (domain === 'textgen') {
    const cleanedCode = code.trim();
    const valid = cleanedCode.length > 0 && !/<\/?(?:html|script|style|svg|canvas)\b/i.test(cleanedCode);
    return {
      valid,
      cleanedCode,
      errors: valid ? [] : ['Textgen output must be plain text art or copy, not code.'],
    };
  }
  const validatorDomain = domain === 'shader' ? 'shader' : domain;
  const result = CodeValidator.validate(code, validatorDomain);
  const errors = result.errors.filter((error) => !/\bcode is too small\b/i.test(error));
  return {
    valid: errors.length === 0,
    cleanedCode: result.cleanedCode,
    errors,
  };
}

async function defaultRenderAndScore(candidate: { domain: SiteCreativeDomain; code: string }): Promise<{
  success: boolean;
  score: number;
  domain: string;
  warnings?: string[];
  duration: number;
  error?: string;
}> {
  if (isAssetOnlyDomain(candidate.domain)) {
    return {
      success: true,
      score: 0.58,
      domain: candidate.domain,
      duration: 0,
      warnings: ['Asset-only domain preserved for package/install proof.'],
    };
  }
  const pipeline = new RenderAndScorePipeline({
    timeout: 20_000,
    render: { timeout: 12_000, stabilizationTime: 600 },
  });
  return pipeline.process(renderableCodeForDomain(candidate.domain, candidate.code), renderDomainFor(candidate.domain));
}

function renderDomainFor(domain: SiteCreativeDomain): RenderDomain {
  if (domain === 'shader') return 'glsl';
  if (domain === 'textgen') return 'html';
  if (domain === 'revideo' || domain === 'hyperframes') return 'html';
  return domain;
}

function renderableCodeForDomain(domain: SiteCreativeDomain, code: string): string {
  if (domain === 'textgen') {
    return `<!doctype html><html><body><pre>${escapeHtml(code)}</pre></body></html>`;
  }
  return code;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function scoreCandidate(domain: SiteCreativeDomain, renderScore: number, warnings: string[]): SiteCreativeLayer['scoring'] {
  const critic = new EmergenceCritic();
  const emergence = critic.evaluateQuick({
    descriptor: {
      values: [
        { axis: 'sparse-dense', value: isAudioDomain(domain) ? 0.25 : 0.72 },
        { axis: 'static-evolving', value: domain === 'kinetic' || domain === 'shader' || domain === 'three' ? 0.84 : 0.45 },
        { axis: 'order-chaos', value: 0.42 },
      ],
      source: 'living-sites-full-liminal-heuristic',
      extractedAt: new Date().toISOString(),
    },
    qualityScore: renderScore,
    archive: [],
    output: domain,
  }).composite;
  const audio = isAudioDomain(domain) ? renderScore : undefined;
  const visual = !isAudioDomain(domain) ? renderScore : undefined;
  const score = Math.max(0, Math.min(1, (renderScore * 0.72) + (emergence * 0.28)));
  return {
    score,
    visual,
    audio,
    emergence,
    taste: 0.5,
    notes: warnings.length ? warnings : [`${domain} candidate passed generation, validation, and selection.`],
  };
}

function buildFullLiminalRuntime(input: {
  compositionId: string;
  profile: SiteProfile;
  skin: SkinSpec;
  prompt: string;
  layers: SiteCreativeLayer[];
  compositionProject: NonNullable<SiteCreativeRuntimeManifest['compositionProject']>;
  capabilityMatrix: SiteCreativeComposition['capabilityMatrix'];
  rejectedCandidates: SiteCreativeRejectedCandidate[];
}): SiteCreativeComposition['runtime'] {
  const manifest: SiteCreativeRuntimeManifest = {
    compositionId: input.compositionId,
    siteId: input.profile.siteId,
    skinId: input.skin.skinId,
    mode: 'creative-composition',
    domains: input.layers.map((layer) => layer.domain),
    files: {
      css: 'liminal-creative.css',
      js: 'liminal-creative.js',
      manifest: 'liminal-creative-manifest.json',
    },
    layers: input.layers.map((layer) => ({
      layerId: layer.layerId,
      domain: layer.domain,
      label: layer.label,
      role: layer.role,
      validation: layer.validation,
      render: layer.render,
      scoring: layer.scoring,
      runtimeStatus: layer.runtimeStatus,
    })),
    compositionProject: input.compositionProject,
    capabilityMatrix: input.capabilityMatrix,
    rejectedCandidates: input.rejectedCandidates,
  };
  return {
    css: renderFullLiminalCss(input.skin),
    js: renderFullLiminalJs({
      compositionId: input.compositionId,
      siteId: input.profile.siteId,
      skinId: input.skin.skinId,
      layers: input.layers,
      manifest,
      capabilityMatrix: input.capabilityMatrix,
      rejectedCandidates: input.rejectedCandidates,
    }),
    manifest,
  };
}

function renderFullLiminalCss(skin: SkinSpec): string {
  return `:root {
  --liminal-creative-accent: ${skin.tokens.palette.accent};
  --liminal-creative-accent-2: ${skin.tokens.palette.accent2};
  --liminal-creative-surface: ${skin.tokens.palette.surface};
  --liminal-creative-line: ${skin.tokens.palette.line};
}

html[data-liminal-sites-composition] body { position: relative; }

#liminal-sites-creative-stage {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background:
    radial-gradient(circle at 16% 18%, color-mix(in srgb, var(--liminal-creative-accent) 28%, transparent), transparent 32%),
    radial-gradient(circle at 82% 70%, color-mix(in srgb, var(--liminal-creative-accent-2) 24%, transparent), transparent 40%);
}

#liminal-sites-creative-stage canvas[data-liminal-domain="shader"] {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.58;
  filter: saturate(1.16) contrast(1.08);
  mix-blend-mode: screen;
}

body.liminal-sites-creative-active > :not(#liminal-sites-creative-stage):not(#liminal-sites-creative-receipt):not(#liminal-sites-creative-layers) {
  position: relative;
  z-index: 1;
}

#liminal-sites-creative-layers {
  position: fixed;
  inset: auto 14px 72px auto;
  z-index: 2147482999;
  width: min(360px, calc(100vw - 28px));
  max-height: min(52vh, 460px);
  overflow: auto;
  display: grid;
  gap: 8px;
  pointer-events: auto;
}

.liminal-creative-layer-card {
  border: 1px solid color-mix(in srgb, var(--liminal-creative-accent) 34%, transparent);
  border-radius: 8px;
  padding: 9px 10px;
  background: rgba(4, 8, 12, 0.74);
  color: white;
  font: 600 12px/1.35 Inter, ui-sans-serif, system-ui, sans-serif;
  backdrop-filter: blur(14px);
}

.liminal-creative-layer-card pre {
  margin: 6px 0 0;
  white-space: pre-wrap;
  color: color-mix(in srgb, var(--liminal-creative-accent-2) 74%, white);
  font: 11px/1.25 ui-monospace, SFMono-Regular, Menlo, monospace;
}

[data-liminal-creative-textgen="true"] {
  display: block;
  max-width: min(9.5ch, 100%);
  overflow-wrap: normal;
  transform: none !important;
  color: transparent !important;
  background: linear-gradient(112deg, var(--liminal-creative-accent), var(--liminal-creative-accent-2) 48%, currentColor 92%);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 0 32px color-mix(in srgb, var(--liminal-creative-accent) 30%, transparent);
}

[data-liminal-creative-action="true"] {
  box-shadow: 0 12px 34px color-mix(in srgb, var(--liminal-creative-accent) 18%, transparent);
  transform: translateY(-1px);
}

[data-liminal-creative-card="true"] {
  border-color: color-mix(in srgb, var(--liminal-creative-accent-2) 42%, var(--liminal-creative-line)) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 54px rgba(0,0,0,0.22);
  transform: translateY(-2px);
}

#liminal-sites-creative-receipt {
  position: fixed;
  right: 14px;
  bottom: 14px;
  z-index: 2147483000;
  max-width: min(360px, calc(100vw - 28px));
  border: 1px solid color-mix(in srgb, var(--liminal-creative-accent) 45%, transparent);
  border-radius: 8px;
  padding: 10px 12px;
  color: white;
  background: rgba(4, 8, 12, 0.76);
  backdrop-filter: blur(16px);
  font: 700 12px/1.35 Inter, ui-sans-serif, system-ui, sans-serif;
  letter-spacing: 0;
  pointer-events: auto;
}
`;
}

function renderFullLiminalJs(input: {
  compositionId: string;
  siteId: string;
  skinId: string;
  layers: SiteCreativeLayer[];
  manifest: SiteCreativeRuntimeManifest;
  capabilityMatrix: SiteCreativeComposition['capabilityMatrix'];
  rejectedCandidates: SiteCreativeRejectedCandidate[];
}): string {
  const shaderLayer = input.layers.find((layer) => layer.domain === 'shader');
  const textLayer = input.layers.find((layer) => layer.domain === 'textgen');
  const textPayload = textLayer?.code ?? 'Full Liminal composition active.';
  return `(function () {
  'use strict';
  var receipt = {
    compositionId: ${JSON.stringify(input.compositionId)},
    siteId: ${JSON.stringify(input.siteId)},
    skinId: ${JSON.stringify(input.skinId)},
    domains: ${JSON.stringify(input.layers.map((layer) => layer.domain))},
    layers: ${JSON.stringify(input.manifest.layers)},
    capabilityMatrix: ${JSON.stringify(input.capabilityMatrix)},
    rejectedCandidates: ${JSON.stringify(input.rejectedCandidates)},
    audioGate: { required: ${JSON.stringify(input.layers.some((layer) => isAudioDomain(layer.domain)))}, unlocked: false },
    frameCount: 0,
    compileOk: false,
    errors: []
  };
  window.__liminalSitesCreative = receipt;

  function reportError(error) {
    var message = error && error.message ? error.message : String(error);
    receipt.errors.push(message);
    document.documentElement.dataset.liminalCreativeError = message;
    window.__liminalSitesCreative = receipt;
    console.error('[Liminal Sites creative runtime]', error);
    window.dispatchEvent(new CustomEvent('liminal-sites-creative-error', { detail: receipt }));
  }

  function ensureStage() {
    var stage = document.getElementById('liminal-sites-creative-stage');
    if (!stage) {
      stage = document.createElement('div');
      stage.id = 'liminal-sites-creative-stage';
      stage.setAttribute('aria-hidden', 'true');
      stage.innerHTML = ${JSON.stringify(shaderLayer ? '<canvas data-liminal-domain="shader"></canvas>' : '')};
      document.body.prepend(stage);
    }
    return stage;
  }

  function ensureLayerPanel() {
    var panel = document.getElementById('liminal-sites-creative-layers');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'liminal-sites-creative-layers';
      panel.setAttribute('aria-label', 'Liminal creative layers');
      document.body.appendChild(panel);
    }
    return panel;
  }

  function ensureReceipt() {
    var node = document.getElementById('liminal-sites-creative-receipt');
    if (!node) {
      node = document.createElement('aside');
      node.id = 'liminal-sites-creative-receipt';
      document.body.appendChild(node);
    }
    node.textContent = 'Full Liminal: ' + receipt.capabilityMatrix.summary.used + '/' + receipt.capabilityMatrix.summary.total + ' used, ' + receipt.capabilityMatrix.summary.failed + ' failed with receipts.';
  }

  function markSurface() {
    var hero = document.querySelector('[data-liminal-heading="hero"], h1');
    if (hero) {
      hero.setAttribute('data-liminal-creative-textgen', 'true');
      hero.setAttribute('data-liminal-creative-line', ${JSON.stringify(textPayload.split('\n')[0] ?? '')});
    }
    document.querySelectorAll('h2').forEach(function (node) {
      node.setAttribute('data-liminal-creative-textgen', 'true');
    });
    document.querySelectorAll('a, button').forEach(function (node) {
      node.setAttribute('data-liminal-creative-action', 'true');
    });
    document.querySelectorAll('article, .card, [class*="card"]').forEach(function (node) {
      node.setAttribute('data-liminal-creative-card', 'true');
    });
  }

  function renderLayerCards() {
    var panel = ensureLayerPanel();
    panel.innerHTML = '';
    ${JSON.stringify(input.layers.map((layer) => ({ domain: layer.domain, label: layer.label, code: previewCodeForLayer(layer), status: layer.runtimeStatus?.status ?? 'active' })))}.forEach(function (layer) {
      var card = document.createElement('article');
      card.className = 'liminal-creative-layer-card';
      card.setAttribute('data-liminal-layer-domain', layer.domain);
      var title = document.createElement('strong');
      title.textContent = layer.domain + ' - ' + layer.status;
      card.appendChild(title);
      var pre = document.createElement('pre');
      pre.textContent = layer.code;
      card.appendChild(pre);
      panel.appendChild(card);
    });
  }

  function compileShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (!shader) throw new Error('Unable to allocate shader.');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || 'Unknown shader compile failure.');
    }
    return shader;
  }

  function startShader(canvas) {
    if (!canvas) return;
    var gl = canvas.getContext('webgl', { alpha: true, antialias: true, preserveDrawingBuffer: true });
    if (!gl) throw new Error('WebGL is not available for the Liminal creative shader.');
    var vertexSource = 'attribute vec2 a_position; void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }';
    var fragmentSource = ${JSON.stringify(shaderLayer?.code ?? '')};
    var program = gl.createProgram();
    if (!program) throw new Error('Unable to allocate shader program.');
    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Unknown shader link failure.');
    }
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var position = gl.getAttribLocation(program, 'a_position');
    var time = gl.getUniformLocation(program, 'u_time');
    var resolution = gl.getUniformLocation(program, 'u_resolution');
    receipt.compileOk = true;
    function resize() {
      var ratio = window.devicePixelRatio || 1;
      var width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      var height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    function frame(now) {
      resize();
      gl.useProgram(program);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(time, now * 0.001);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      receipt.frameCount += 1;
      receipt.lastFrameAt = new Date().toISOString();
      window.__liminalSitesCreative = receipt;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function installAudioGate() {
    if (!receipt.audioGate.required) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Enable Liminal audio layers';
    button.setAttribute('data-liminal-audio-gate', 'true');
    button.addEventListener('click', function () {
      receipt.audioGate.unlocked = true;
      window.__liminalSitesCreative = receipt;
      window.dispatchEvent(new CustomEvent('liminal-sites-creative-audio-unlocked', { detail: receipt }));
    }, { once: true });
    document.getElementById('liminal-sites-creative-receipt').appendChild(document.createElement('br'));
    document.getElementById('liminal-sites-creative-receipt').appendChild(button);
  }

  try {
    document.documentElement.dataset.liminalSitesComposition = receipt.compositionId;
    document.documentElement.dataset.liminalSitesDomains = receipt.domains.join(',');
    document.body.classList.add('liminal-sites-creative-active');
    var stage = ensureStage();
    markSurface();
    renderLayerCards();
    ensureReceipt();
    installAudioGate();
    startShader(stage.querySelector('canvas[data-liminal-domain="shader"]'));
    window.dispatchEvent(new CustomEvent('liminal-sites-creative-ready', { detail: receipt }));
  } catch (error) {
    reportError(error);
  }
})();`;
}

function previewCodeForLayer(layer: SiteCreativeLayer): string {
  return layer.code.length > 260 ? `${layer.code.slice(0, 257)}...` : layer.code;
}

function reject(input: CandidateFailure & { compositionId: string }): SiteCreativeRejectedCandidate {
  return {
    candidateId: `${input.compositionId}-${input.domain}-${input.stage}-${Date.now().toString(36)}`,
    domain: input.domain,
    stage: input.stage,
    status: input.status,
    reason: input.reason,
    createdAt: new Date().toISOString(),
    generator: input.generator,
    model: input.model,
  };
}

function createRegistryGeneratorBridge(): LiminalSiteGeneratorBridge {
  return {
    async generate(domain, prompt, context) {
      await registerAllGenerators();
      const entryName = domain === 'shader' ? 'shader' : domain;
      const entry = generatorRegistry.getAll().find((candidate) => candidate.name === entryName);
      if (!entry) throw new Error(`Generator registry has no ${entryName} entry.`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 75_000);
      try {
        const result = await entry.generate(prompt, {
          signal: controller.signal,
          bypassCache: context.attempt > 1,
        });
        const normalized = normalizeGeneratedResult(result);
        return {
          ...normalized,
          generator: entry.name,
        };
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

function normalizeGeneratedResult(result: string | GeneratorResult): LiminalGeneratedCandidate {
  if (typeof result === 'string') return { code: result };
  return {
    code: result.code,
    thinking: result.thinking,
    model: result.model,
    warnings: result.recoveredFromThinking ? ['Recovered code from model thinking trace.'] : undefined,
  };
}

function roleForDomain(domain: SiteCreativeDomain): SiteCreativeLayer['role'] {
  if (domain === 'shader') return 'background-atmosphere';
  if (domain === 'textgen' || domain === 'kinetic') return 'kinetic-typography';
  if (domain === 'tone' || domain === 'strudel') return 'audio-layer';
  if (domain === 'revideo' || domain === 'hyperframes') return 'video-layer';
  if (domain === 'svg') return 'vector-layer';
  if (domain === 'html') return 'markup-layer';
  if (domain === 'ascii') return 'text-layer';
  return 'visual-layer';
}

function runtimeStatusForDomain(domain: SiteCreativeDomain): SiteCreativeLayer['runtimeStatus'] {
  if (isAudioDomain(domain)) return { status: 'audio-gated', reason: 'Browser audio must start from a user gesture.' };
  if (isAssetOnlyDomain(domain)) return { status: 'asset-only', reason: 'Packaged as a site asset/runtime receipt.' };
  return { status: 'active' };
}

function installTargetForDomain(domain: SiteCreativeDomain): string {
  if (domain === 'shader') return '#liminal-sites-creative-stage canvas[data-liminal-domain="shader"]';
  if (domain === 'textgen') return 'h1, h2, a, button, article';
  if (isAudioDomain(domain)) return '[data-liminal-audio-gate]';
  return '#liminal-sites-creative-layers';
}

function isAudioDomain(domain: SiteCreativeDomain): boolean {
  return domain === 'tone' || domain === 'strudel';
}

function isVideoDomain(domain: SiteCreativeDomain): boolean {
  return domain === 'revideo' || domain === 'hyperframes';
}

function isAssetOnlyDomain(domain: SiteCreativeDomain): boolean {
  return isVideoDomain(domain) || domain === 'hyperframes';
}
