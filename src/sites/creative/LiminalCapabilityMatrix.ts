import { generatorRegistry } from '../../generators/GeneratorRegistry.js';
import { registerAllGenerators } from '../../generators/registerGenerators.js';
import { allAdapters } from '../../composition/adapters/registerAdapters.js';
import type {
  SiteCreativeCapability,
  SiteCreativeCapabilityMatrix,
  SiteCreativeCapabilityStatus,
  SiteCreativeDomain,
  SiteCreativeDomainMode,
  SiteCreativeStrategy,
} from '../types.js';

export const FULL_LIMINAL_SITE_DOMAINS: SiteCreativeDomain[] = [
  'p5',
  'three',
  'shader',
  'hydra',
  'tone',
  'strudel',
  'svg',
  'html',
  'textgen',
  'kinetic',
  'ascii',
  'revideo',
  'hyperframes',
];

type CapabilityOverrides = Partial<Record<SiteCreativeDomain, {
  status: SiteCreativeCapabilityStatus;
  evidence?: string[];
  reason?: string;
}>>;

const VALIDATORS: Record<SiteCreativeDomain, string> = {
  p5: 'P5Validator',
  three: 'ThreeValidator',
  shader: 'GLSLValidator',
  hydra: 'HydraValidator',
  tone: 'ToneValidator',
  strudel: 'StrudelValidator',
  svg: 'SVGValidator',
  html: 'HTMLValidator',
  textgen: 'TextGenerativeValidator',
  kinetic: 'HTMLValidator+KineticContract',
  ascii: 'ASCIIValidator',
  revideo: 'RevideoValidator',
  hyperframes: 'HyperFramesValidator',
};

const RUNTIMES: Record<SiteCreativeDomain, string> = {
  p5: 'p5 site layer runtime',
  three: 'Three.js site layer runtime',
  shader: 'WebGL shader site runtime',
  hydra: 'Hydra visual site runtime',
  tone: 'Tone.js audio-gated site runtime',
  strudel: 'Strudel pattern audio-gated site runtime',
  svg: 'SVG inline/vector site runtime',
  html: 'HTML fragment site runtime',
  textgen: 'textgen typography site runtime',
  kinetic: 'CSS kinetic site runtime',
  ascii: 'ASCII preformatted site runtime',
  revideo: 'Revideo asset package runtime',
  hyperframes: 'HyperFrames asset package runtime',
};

const RENDERERS: Record<SiteCreativeDomain, string> = {
  p5: 'HeadlessRenderer:p5',
  three: 'HeadlessRenderer:three',
  shader: 'HeadlessRenderer:glsl',
  hydra: 'HeadlessRenderer:hydra',
  tone: 'HeadlessRenderer:tone',
  strudel: 'HeadlessRenderer:strudel',
  svg: 'HeadlessRenderer:html-svg',
  html: 'HeadlessRenderer:html',
  textgen: 'HeadlessRenderer:html-text',
  kinetic: 'HeadlessRenderer:html-kinetic',
  ascii: 'HeadlessRenderer:html-ascii',
  revideo: 'RevideoRenderer',
  hyperframes: 'HyperFramesRenderer',
};

const SCORERS: Record<SiteCreativeDomain, string> = {
  p5: 'VisualScorer',
  three: 'VisualScorer',
  shader: 'VisualScorer',
  hydra: 'VisualScorer',
  tone: 'AudioScorer',
  strudel: 'AudioScorer',
  svg: 'VisualScorer',
  html: 'VisualScorer',
  textgen: 'VisualScorer',
  kinetic: 'VisualScorer',
  ascii: 'VisualScorer',
  revideo: 'Video proof receipt',
  hyperframes: 'VisualScorer',
};

const COMPOSITION_ADAPTERS: Partial<Record<SiteCreativeDomain, keyof typeof allAdapters>> = {
  p5: 'p5',
  three: 'three',
  shader: 'shader',
  hydra: 'hydra',
  tone: 'tone',
  strudel: 'strudel',
  ascii: 'asciiArt',
  html: 'html',
};

function generatorNameFor(domain: SiteCreativeDomain): string {
  if (domain === 'shader') return 'shader';
  return domain;
}

export async function buildLiminalCapabilityMatrix(input: {
  strategy?: SiteCreativeStrategy;
  domainMode?: SiteCreativeDomainMode;
  selectedDomains?: SiteCreativeDomain[];
  overrides?: CapabilityOverrides;
  generatedAt?: string;
} = {}): Promise<SiteCreativeCapabilityMatrix> {
  await registerAllGenerators();
  const registeredGenerators = new Set(generatorRegistry.getAll().map((entry) => entry.name));
  const selectedDomains = new Set(input.selectedDomains ?? []);
  const overrides = input.overrides ?? {};

  const domains = FULL_LIMINAL_SITE_DOMAINS.map((domain): SiteCreativeCapability => {
    const generatorName = generatorNameFor(domain);
    const generatorAvailable = registeredGenerators.has(generatorName);
    const adapterName = COMPOSITION_ADAPTERS[domain];
    const adapterAvailable = Boolean(adapterName && allAdapters[adapterName]);
    const override = overrides[domain];
    const status = override?.status
      ?? (selectedDomains.has(domain) ? 'used' : 'available-not-selected');
    const reason = override?.reason;

    return {
      domain,
      status,
      generator: {
        name: generatorName,
        available: generatorAvailable,
        reason: generatorAvailable ? undefined : `Generator registry has no ${generatorName} entry.`,
      },
      validator: {
        name: VALIDATORS[domain],
        available: true,
      },
      runtime: {
        name: RUNTIMES[domain],
        available: true,
        reason,
      },
      renderer: {
        name: RENDERERS[domain],
        available: true,
        reason,
      },
      scorer: {
        name: SCORERS[domain],
        available: true,
        reason,
      },
      compositionAdapter: {
        name: adapterName ?? `${domain} site compiler`,
        available: adapterAvailable || domain === 'svg' || domain === 'textgen' || domain === 'kinetic' || domain === 'revideo' || domain === 'hyperframes',
        reason: adapterAvailable ? undefined : 'Compiled through the Living Sites runtime adapter.',
      },
      surfaces: {
        export: true,
        mcp: true,
        api: true,
        studio: true,
        proof: true,
      },
      evidence: [
        `generator:${generatorName}`,
        `validator:${VALIDATORS[domain]}`,
        `runtime:${RUNTIMES[domain]}`,
        ...(override?.evidence ?? []),
      ],
    };
  });

  const summary = summarizeCapabilities(domains);
  return {
    strategy: input.strategy ?? 'balanced',
    domainMode: input.domainMode ?? 'auto',
    fullRunSatisfied: isFullRunSatisfied(domains),
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    domains,
    summary,
  };
}

export function summarizeCapabilities(domains: SiteCreativeCapability[]): SiteCreativeCapabilityMatrix['summary'] {
  return {
    total: domains.length,
    used: domains.filter((capability) => capability.status === 'used').length,
    availableNotSelected: domains.filter((capability) => capability.status === 'available-not-selected').length,
    blocked: domains.filter((capability) => capability.status === 'blocked').length,
    failed: domains.filter((capability) => capability.status === 'failed').length,
  };
}

export function isFullRunSatisfied(domains: SiteCreativeCapability[]): boolean {
  return domains.every((capability) => capability.status === 'used' || capability.status === 'blocked' || capability.status === 'failed');
}
