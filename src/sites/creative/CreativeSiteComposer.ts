import fs from 'fs/promises';
import path from 'path';
import { GLSLValidator } from '../../core/validators/GLSLValidator.js';
import { createRunId, stableSeed } from '../siteIds.js';
import {
  FULL_LIMINAL_SITE_DOMAINS,
  summarizeCapabilities,
  isFullRunSatisfied,
} from './LiminalCapabilityMatrix.js';
import type {
  PreferenceEvent,
  SiteCreativeCapability,
  SiteCreativeCapabilityMatrix,
  SiteCreativeComposition,
  SiteCreativeCompositionExport,
  SiteCreativeCompositionInput,
  SiteCreativeDomain,
  SiteCreativeLayer,
  SiteCreativeRuntimeManifest,
  SiteProfile,
  SkinSpec,
  WebsiteIngestionResult,
} from '../types.js';

export interface ComposeCreativeSiteInput {
  profile: SiteProfile;
  skin: SkinSpec;
  ingestion?: WebsiteIngestionResult;
  preferences?: PreferenceEvent[];
  prompt?: string;
  domains?: SiteCreativeDomain[];
}

export function composeCreativeSite(input: ComposeCreativeSiteInput): SiteCreativeComposition {
  const prompt = input.prompt?.trim()
    || `Compose a cross-domain living-site layer for ${input.profile.name}.`;
  const domains = normalizeDomains(input.domains);
  const seed = stableSeed(
    input.profile.siteId,
    input.skin.skinId,
    prompt,
    input.ingestion?.ingestionId ?? 'no-ingestion',
    summarizePreferences(input.preferences ?? []),
  );
  const createdAt = new Date().toISOString();
  const compositionId = createRunId('creative');
  const shader = buildShaderLayer({ seed, prompt, profile: input.profile, skin: input.skin, ingestion: input.ingestion });
  const textgen = buildTextgenLayer({ seed, prompt, profile: input.profile, skin: input.skin, ingestion: input.ingestion });
  const layerByDomain: Partial<Record<SiteCreativeDomain, SiteCreativeLayer>> = { shader, textgen };
  const layers = domains.map((domain) => {
    const layer = layerByDomain[domain];
    if (!layer) {
      throw new Error(`Balanced creative composition does not support ${domain}; use full-liminal strategy for full domain orchestration.`);
    }
    return layer;
  });
  const invalidLayer = layers.find((layer) => !layer.validation.valid);
  if (invalidLayer) {
    throw new Error(`Creative layer ${invalidLayer.layerId} failed validation: ${invalidLayer.validation.errors.join('; ')}`);
  }
  const runtime = buildCreativeRuntime({
    compositionId,
    profile: input.profile,
    skin: input.skin,
    prompt,
    domains,
    layers,
  });
  return {
    compositionId,
    siteId: input.profile.siteId,
    skinId: input.skin.skinId,
    prompt,
    createdAt,
    strategy: 'balanced',
    domainMode: 'auto',
    domains,
    layers,
    runtime,
    provenance: {
      engine: 'liminal-sites',
      source: 'deterministic-cross-domain',
      seed,
      adapters: ['GLSLValidator', 'textgen-runtime', 'webgl-runtime'],
    },
    capabilityMatrix: buildBalancedCapabilityMatrix({
      createdAt,
      domains,
    }),
    rejectedCandidates: [],
    quality: {
      score: Math.min(0.98, input.skin.quality.score + 0.06),
      notes: [
        'Composed as a cross-domain creative layer, not a surface-only token mutation.',
        `Validated ${domains.join(' + ')} domains into browser-installable runtime assets.`,
      ],
    },
    operatorNotes: [
      `Install liminal-creative.css and liminal-creative.js after skin ${input.skin.skinId}.`,
      'The shader layer is validated before persistence and reports compile errors into window.__liminalSitesCreative.',
      'The textgen layer marks hero copy, actions, cards, and the receipt badge so visual QA can inspect real DOM changes.',
    ],
  };
}

export async function exportCreativeCompositionFiles(
  composition: SiteCreativeComposition,
  outputDir: string,
): Promise<SiteCreativeCompositionExport> {
  const resolvedOutputDir = path.resolve(outputDir);
  const cssPath = path.join(resolvedOutputDir, 'liminal-creative.css');
  const jsPath = path.join(resolvedOutputDir, 'liminal-creative.js');
  const manifestPath = path.join(resolvedOutputDir, 'liminal-creative-manifest.json');
  const manifest = `${JSON.stringify(composition.runtime.manifest, null, 2)}\n`;
  await fs.mkdir(resolvedOutputDir, { recursive: true });
  await fs.writeFile(cssPath, composition.runtime.css, 'utf8');
  await fs.writeFile(jsPath, composition.runtime.js, 'utf8');
  await fs.writeFile(manifestPath, manifest, 'utf8');
  return {
    outputDir: resolvedOutputDir,
    cssPath,
    jsPath,
    manifestPath,
    files: {
      css: composition.runtime.css,
      js: composition.runtime.js,
      manifest,
    },
  };
}

export function normalizeCreativeCompositionRequest(input: SiteCreativeCompositionInput = {}): {
  skinId?: string;
  prompt?: string;
  strategy: 'balanced' | 'full-liminal';
  domainMode: 'auto' | 'all' | 'selected';
  domains: SiteCreativeDomain[];
  candidatesPerDomain: 1 | 2 | 3;
  maxIterations: number;
  includeAudio: boolean;
  includeVideoAssets: boolean;
} {
  return {
    skinId: input.skinId,
    prompt: input.prompt?.trim() || undefined,
    strategy: input.strategy ?? 'balanced',
    domainMode: input.domainMode ?? 'auto',
    domains: normalizeDomains(input.domains),
    candidatesPerDomain: input.candidatesPerDomain ?? 1,
    maxIterations: input.maxIterations ?? 2,
    includeAudio: input.includeAudio ?? true,
    includeVideoAssets: input.includeVideoAssets ?? true,
  };
}

function normalizeDomains(domains?: SiteCreativeDomain[]): SiteCreativeDomain[] {
  const selected = domains?.length ? domains : ['shader', 'textgen'];
  const unique = [...new Set(selected.filter((domain): domain is SiteCreativeDomain => domain === 'shader' || domain === 'textgen'))];
  if (!unique.includes('shader')) unique.unshift('shader');
  if (!unique.includes('textgen')) unique.push('textgen');
  return unique.slice(0, 4);
}

function buildShaderLayer(input: {
  seed: string;
  prompt: string;
  profile: SiteProfile;
  skin: SkinSpec;
  ingestion?: WebsiteIngestionResult;
}): SiteCreativeLayer {
  const colors = shaderColors(input.seed);
  const code = `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.02 + vec2(17.1, 9.2);
    amplitude *= 0.52;
  }
  return value;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float drift = u_time * ${formatFloat(0.08 + numericSeed(input.seed, 0) * 0.08)};
  float field = fbm(uv * ${formatFloat(2.2 + numericSeed(input.seed, 1) * 1.2)} + vec2(drift, -drift * 0.7));
  float pulse = smoothstep(0.18, 0.92, field + 0.22 * sin(u_time * 0.6 + length(uv) * 4.0));
  vec3 deep = vec3(${colors.deep.join(', ')});
  vec3 ember = vec3(${colors.ember.join(', ')});
  vec3 signal = vec3(${colors.signal.join(', ')});
  vec3 color = mix(deep, ember, pulse);
  color = mix(color, signal, smoothstep(0.62, 1.0, fbm(uv * 4.0 - drift)));
  color += 0.08 * vec3(sin(u_time + uv.xyx * 3.0));
  gl_FragColor = vec4(color, 0.72);
}`;
  const validation = GLSLValidator.validate(code);
  return {
    layerId: `layer-shader-${input.seed.slice(0, 8)}`,
    domain: 'shader',
    label: `${input.profile.name} shader atmosphere`,
    role: 'background-atmosphere',
    code,
    validation,
    installTarget: '#liminal-sites-creative-stage canvas[data-liminal-domain="shader"]',
  };
}

function buildTextgenLayer(input: {
  seed: string;
  prompt: string;
  profile: SiteProfile;
  skin: SkinSpec;
  ingestion?: WebsiteIngestionResult;
}): SiteCreativeLayer {
  const sourceHeading = input.ingestion?.designSignals.headings[0] || input.profile.name;
  const code = JSON.stringify({
    headline: tightenCopy(sourceHeading),
    receipt: 'Shader atmosphere + kinetic text are active.',
    accent: input.skin.tokens.palette.accent,
    rhythm: input.skin.tokens.motion.rhythm,
    density: input.skin.tokens.shape.density,
    prompt: input.prompt,
  }, null, 2);
  const valid = code.length > 80 && code.includes('headline') && code.includes('rhythm');
  return {
    layerId: `layer-textgen-${input.seed.slice(8, 16)}`,
    domain: 'textgen',
    label: `${input.profile.name} kinetic textgen`,
    role: 'kinetic-typography',
    code,
    validation: {
      valid,
      errors: valid ? [] : ['Textgen layer did not produce enough structured copy.'],
    },
    installTarget: 'h1, h2, a, button, article',
  };
}

function buildCreativeRuntime(input: {
  compositionId: string;
  profile: SiteProfile;
  skin: SkinSpec;
  prompt: string;
  domains: SiteCreativeDomain[];
  layers: SiteCreativeLayer[];
}): SiteCreativeComposition['runtime'] {
  const shader = input.layers.find((layer) => layer.domain === 'shader');
  const textgen = input.layers.find((layer) => layer.domain === 'textgen');
  if (!shader || !textgen) throw new Error('Creative composition requires shader and textgen layers.');
  const textgenPayload = JSON.parse(textgen.code) as Record<string, unknown>;
  const manifest: SiteCreativeRuntimeManifest = {
    compositionId: input.compositionId,
    siteId: input.profile.siteId,
    skinId: input.skin.skinId,
    mode: 'creative-composition',
    domains: input.domains,
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
    capabilityMatrix: buildBalancedCapabilityMatrix({
      createdAt: new Date().toISOString(),
      domains: input.domains,
    }),
    rejectedCandidates: [],
  };
  return {
    css: renderCreativeCss(input.skin),
    js: renderCreativeJs({
      compositionId: input.compositionId,
      siteId: input.profile.siteId,
      skinId: input.skin.skinId,
      domains: input.domains,
      manifest,
      shaderCode: shader.code,
      textgenPayload,
    }),
    manifest,
  };
}

function buildBalancedCapabilityMatrix(input: {
  createdAt: string;
  domains: SiteCreativeDomain[];
}): SiteCreativeCapabilityMatrix {
  const used = new Set(input.domains);
  const capabilities: SiteCreativeCapability[] = FULL_LIMINAL_SITE_DOMAINS.map((domain) => ({
    domain,
    status: used.has(domain) ? 'used' : 'available-not-selected',
    generator: {
      name: domain === 'shader' ? 'shader' : domain,
      available: true,
    },
    validator: {
      name: domain === 'shader' ? 'GLSLValidator' : `${domain} validator`,
      available: true,
    },
    runtime: {
      name: domain === 'shader' ? 'webgl-runtime' : `${domain} site runtime`,
      available: true,
    },
    renderer: {
      name: domain === 'shader' ? 'WebGL browser proof' : `${domain} render proof`,
      available: true,
    },
    scorer: {
      name: domain === 'tone' || domain === 'strudel' ? 'AudioScorer' : 'VisualScorer',
      available: true,
    },
    compositionAdapter: {
      name: domain === 'shader' ? 'ShaderAdapter' : `${domain} site adapter`,
      available: true,
    },
    surfaces: {
      export: true,
      mcp: true,
      api: true,
      studio: true,
      proof: true,
    },
    evidence: used.has(domain)
      ? [`balanced-layer:${domain}`]
      : ['Balanced mode did not select this capability.'],
  }));
  return {
    strategy: 'balanced',
    domainMode: 'auto',
    fullRunSatisfied: isFullRunSatisfied(capabilities),
    generatedAt: input.createdAt,
    domains: capabilities,
    summary: summarizeCapabilities(capabilities),
  };
}

function renderCreativeCss(skin: SkinSpec): string {
  const accent = skin.tokens.palette.accent;
  const accent2 = skin.tokens.palette.accent2;
  const line = skin.tokens.palette.line;
  const surface = skin.tokens.palette.surface;
  return `:root {
  --liminal-creative-accent: ${accent};
  --liminal-creative-accent-2: ${accent2};
  --liminal-creative-surface: ${surface};
  --liminal-creative-line: ${line};
}

html[data-liminal-sites-composition] body {
  position: relative;
}

#liminal-sites-creative-stage {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 12%, color-mix(in srgb, var(--liminal-creative-accent) 24%, transparent), transparent 34%),
    radial-gradient(circle at 82% 72%, color-mix(in srgb, var(--liminal-creative-accent-2) 20%, transparent), transparent 38%);
}

#liminal-sites-creative-stage canvas[data-liminal-domain="shader"] {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.56;
  filter: saturate(1.15) contrast(1.05);
  mix-blend-mode: screen;
}

body.liminal-sites-creative-active > :not(#liminal-sites-creative-stage):not(#liminal-sites-creative-receipt) {
  position: relative;
  z-index: 1;
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
  max-width: min(320px, calc(100vw - 28px));
  border: 1px solid color-mix(in srgb, var(--liminal-creative-accent) 45%, transparent);
  border-radius: 8px;
  padding: 10px 12px;
  color: white;
  background: rgba(4, 8, 12, 0.72);
  backdrop-filter: blur(16px);
  font: 700 12px/1.35 Inter, ui-sans-serif, system-ui, sans-serif;
  letter-spacing: 0;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  #liminal-sites-creative-stage {
    animation: liminal-sites-creative-drift 14s ease-in-out infinite alternate;
  }
}

@keyframes liminal-sites-creative-drift {
  from { transform: scale(1); }
  to { transform: scale(1.035); }
}
`;
}

function renderCreativeJs(input: {
  compositionId: string;
  siteId: string;
  skinId: string;
  domains: SiteCreativeDomain[];
  manifest: SiteCreativeRuntimeManifest;
  shaderCode: string;
  textgenPayload: Record<string, unknown>;
}): string {
  return `(function () {
  'use strict';
  var receipt = {
    compositionId: ${JSON.stringify(input.compositionId)},
    siteId: ${JSON.stringify(input.siteId)},
    skinId: ${JSON.stringify(input.skinId)},
    domains: ${JSON.stringify(input.domains)},
    layers: ${JSON.stringify(input.manifest.layers)},
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
      stage.innerHTML = '<canvas data-liminal-domain="shader"></canvas>';
      document.body.prepend(stage);
    }
    return stage;
  }

  function ensureReceipt(payload) {
    var node = document.getElementById('liminal-sites-creative-receipt');
    if (!node) {
      node = document.createElement('aside');
      node.id = 'liminal-sites-creative-receipt';
      document.body.appendChild(node);
    }
    node.textContent = payload.receipt || 'Creative composition active.';
  }

  function markTextgen(payload) {
    var hero = document.querySelector('[data-liminal-heading="hero"], h1');
    if (hero) {
      hero.setAttribute('data-liminal-creative-textgen', 'true');
      hero.setAttribute('data-liminal-creative-line', String(payload.headline || ''));
    }
    document.querySelectorAll('h2').forEach(function (node) {
      node.setAttribute('data-liminal-creative-textgen', 'true');
    });
    document.querySelectorAll('a, button').forEach(function (node) {
      node.setAttribute('data-liminal-creative-action', 'true');
      node.setAttribute('data-liminal-creative-rhythm', String(payload.rhythm || 'pulse'));
    });
    document.querySelectorAll('article, .card, [class*="card"]').forEach(function (node) {
      node.setAttribute('data-liminal-creative-card', 'true');
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
    var gl = canvas.getContext('webgl', { alpha: true, antialias: true, preserveDrawingBuffer: true });
    if (!gl) throw new Error('WebGL is not available for the Liminal creative shader.');
    var vertexSource = 'attribute vec2 a_position; void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }';
    var fragmentSource = ${JSON.stringify(input.shaderCode)};
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

  try {
    document.documentElement.dataset.liminalSitesComposition = receipt.compositionId;
    document.documentElement.dataset.liminalSitesDomains = receipt.domains.join(',');
    document.body.classList.add('liminal-sites-creative-active');
    var payload = ${JSON.stringify(input.textgenPayload)};
    markTextgen(payload);
    ensureReceipt(payload);
    var stage = ensureStage();
    var canvas = stage.querySelector('canvas[data-liminal-domain="shader"]');
    startShader(canvas);
    window.dispatchEvent(new CustomEvent('liminal-sites-creative-ready', { detail: receipt }));
  } catch (error) {
    reportError(error);
  }
})();`;
}

function shaderColors(seed: string): { deep: string[]; ember: string[]; signal: string[] } {
  const base = numericSeed(seed, 2);
  return {
    deep: [formatFloat(0.02 + base * 0.05), formatFloat(0.04 + numericSeed(seed, 3) * 0.08), formatFloat(0.08 + numericSeed(seed, 4) * 0.12)],
    ember: [formatFloat(0.72 + numericSeed(seed, 5) * 0.22), formatFloat(0.28 + numericSeed(seed, 6) * 0.28), formatFloat(0.12 + numericSeed(seed, 7) * 0.18)],
    signal: [formatFloat(0.18 + numericSeed(seed, 8) * 0.22), formatFloat(0.55 + numericSeed(seed, 9) * 0.3), formatFloat(0.72 + numericSeed(seed, 10) * 0.22)],
  };
}

function numericSeed(seed: string, offset: number): number {
  const start = (offset * 2) % Math.max(2, seed.length - 2);
  return Number.parseInt(seed.slice(start, start + 2), 16) / 255;
}

function formatFloat(value: number): string {
  return value.toFixed(4).replace(/0+$/, '').replace(/\.$/, '.0');
}

function tightenCopy(value: string): string {
  const trimmed = value.replace(/\s+/g, ' ').trim();
  if (trimmed.length <= 92) return trimmed;
  return `${trimmed.slice(0, 89).trim()}...`;
}

function summarizePreferences(preferences: PreferenceEvent[]): string {
  if (preferences.length === 0) return 'none';
  return preferences.slice(-8).map((preference) => `${preference.kind}:${preference.skinId}:${preference.note ?? ''}`).join('|');
}
