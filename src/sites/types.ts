import { z } from 'zod';

export const SiteDeliveryModeSchema = z.enum(['runtime-skin', 'repo-native-pr']);
export type SiteDeliveryMode = z.infer<typeof SiteDeliveryModeSchema>;

export const SiteProfileInputSchema = z.object({
  name: z.string().trim().min(1).max(90),
  sourceUrl: z.string().trim().url().optional(),
  sourcePath: z.string().trim().min(1).optional(),
  brandBrief: z.string().trim().min(1).max(4000),
  constraints: z.array(z.string().trim().min(1).max(320)).default([]),
  allowedModes: z.array(SiteDeliveryModeSchema).min(1).default(['runtime-skin']),
  stackHints: z.array(z.string().trim().min(1).max(80)).default([]),
}).refine((input) => Boolean(input.sourceUrl || input.sourcePath), {
  message: 'Either sourceUrl or sourcePath is required',
  path: ['sourceUrl'],
});

export type SiteProfileInput = z.input<typeof SiteProfileInputSchema>;

export const SiteProfileSchema = SiteProfileInputSchema.extend({
  siteId: z.string().regex(/^[a-z0-9][a-z0-9-]{2,80}$/),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type SiteProfile = z.infer<typeof SiteProfileSchema>;

export const SiteSkinTokensSchema = z.object({
  palette: z.object({
    background: z.string(),
    surface: z.string(),
    text: z.string(),
    mutedText: z.string(),
    accent: z.string(),
    accent2: z.string(),
    line: z.string(),
  }),
  typography: z.object({
    fontFamily: z.string(),
    headingScale: z.number().min(0.85).max(1.8),
    bodyScale: z.number().min(0.85).max(1.35),
  }),
  motion: z.object({
    intensity: z.number().min(0).max(1),
    rhythm: z.enum(['quiet', 'pulse', 'drift', 'kinetic']),
  }),
  shape: z.object({
    radius: z.number().min(0).max(48),
    density: z.enum(['spare', 'balanced', 'dense']),
  }),
});

export type SiteSkinTokens = z.infer<typeof SiteSkinTokensSchema>;

export const SkinSpecSchema = z.object({
  skinId: z.string().regex(/^[a-z0-9][a-z0-9-]{2,100}$/),
  siteId: z.string(),
  name: z.string(),
  prompt: z.string(),
  createdAt: z.string().datetime(),
  tokens: SiteSkinTokensSchema,
  runtime: z.object({
    css: z.string(),
    js: z.string(),
  }),
  provenance: z.object({
    engine: z.literal('liminal-sites'),
    mode: SiteDeliveryModeSchema,
    seed: z.string(),
    source: z.enum(['deterministic-mvp', 'llm', 'evolution']),
  }),
  quality: z.object({
    score: z.number().min(0).max(1),
    notes: z.array(z.string()),
  }),
});

export type SkinSpec = z.infer<typeof SkinSpecSchema>;

export const SiteCreativeDomainSchema = z.enum([
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
]);
export type SiteCreativeDomain = z.infer<typeof SiteCreativeDomainSchema>;

export const SiteCreativeStrategySchema = z.enum(['balanced', 'full-liminal']);
export type SiteCreativeStrategy = z.infer<typeof SiteCreativeStrategySchema>;

export const SiteCreativeDomainModeSchema = z.enum(['auto', 'all', 'selected']);
export type SiteCreativeDomainMode = z.infer<typeof SiteCreativeDomainModeSchema>;

export const SiteCreativeCompositionInputSchema = z.object({
  skinId: z.string().regex(/^[a-z0-9][a-z0-9-]{2,100}$/).optional(),
  prompt: z.string().trim().max(4000).optional(),
  strategy: SiteCreativeStrategySchema.default('balanced'),
  domainMode: SiteCreativeDomainModeSchema.default('auto'),
  domains: z.array(SiteCreativeDomainSchema).min(1).max(13).optional(),
  candidatesPerDomain: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
  maxIterations: z.number().int().min(1).max(8).default(2),
  includeAudio: z.boolean().default(true),
  includeVideoAssets: z.boolean().default(true),
});

export type SiteCreativeCompositionInput = z.input<typeof SiteCreativeCompositionInputSchema>;
export type NormalizedSiteCreativeCompositionInput = z.output<typeof SiteCreativeCompositionInputSchema>;

export type SiteCreativeCapabilityStatus = 'used' | 'available-not-selected' | 'blocked' | 'failed';

export interface SiteCreativeCapability {
  domain: SiteCreativeDomain;
  status: SiteCreativeCapabilityStatus;
  generator: {
    name: string;
    available: boolean;
    reason?: string;
  };
  validator: {
    name: string;
    available: boolean;
    reason?: string;
  };
  runtime: {
    name: string;
    available: boolean;
    reason?: string;
  };
  renderer: {
    name: string;
    available: boolean;
    reason?: string;
  };
  scorer: {
    name: string;
    available: boolean;
    reason?: string;
  };
  compositionAdapter: {
    name: string;
    available: boolean;
    reason?: string;
  };
  surfaces: {
    export: boolean;
    mcp: boolean;
    api: boolean;
    studio: boolean;
    proof: boolean;
  };
  evidence: string[];
}

export interface SiteCreativeCapabilityMatrix {
  strategy: SiteCreativeStrategy;
  domainMode: SiteCreativeDomainMode;
  fullRunSatisfied: boolean;
  generatedAt: string;
  domains: SiteCreativeCapability[];
  summary: {
    total: number;
    used: number;
    availableNotSelected: number;
    blocked: number;
    failed: number;
  };
}

export interface SiteCreativeRejectedCandidate {
  candidateId: string;
  domain: SiteCreativeDomain;
  stage: 'generation' | 'validation' | 'render' | 'selection' | 'runtime';
  status: 'blocked' | 'failed';
  reason: string;
  createdAt: string;
  generator?: string;
  model?: string;
}

export interface SiteCreativeLayer {
  layerId: string;
  domain: SiteCreativeDomain;
  label: string;
  role:
    | 'background-atmosphere'
    | 'kinetic-typography'
    | 'visual-layer'
    | 'audio-layer'
    | 'video-layer'
    | 'vector-layer'
    | 'markup-layer'
    | 'text-layer'
    | 'composition-layer';
  code: string;
  validation: {
    valid: boolean;
    errors: string[];
  };
  generation?: {
    generator: string;
    model?: string;
    prompt: string;
    attempt: number;
    source: 'generator-registry' | 'injected-generator' | 'deterministic-cross-domain';
  };
  render?: {
    success: boolean;
    score: number;
    domain: string;
    duration: number;
    warnings?: string[];
    error?: string;
  };
  scoring?: {
    score: number;
    visual?: number;
    audio?: number;
    emergence?: number;
    taste?: number;
    notes: string[];
  };
  runtimeStatus?: {
    status: 'active' | 'audio-gated' | 'asset-only' | 'blocked' | 'failed';
    reason?: string;
  };
  failure?: {
    stage: 'generation' | 'validation' | 'render' | 'selection' | 'runtime';
    message: string;
  };
  installTarget: string;
}

export interface SiteCreativeRuntimeManifest {
  compositionId: string;
  siteId: string;
  skinId: string;
  mode: 'creative-composition';
  domains: SiteCreativeDomain[];
  files: {
    css: 'liminal-creative.css';
    js: 'liminal-creative.js';
    manifest: 'liminal-creative-manifest.json';
  };
  layers: Array<{
    layerId: string;
    domain: SiteCreativeDomain;
    label: string;
    role: SiteCreativeLayer['role'];
    validation: SiteCreativeLayer['validation'];
    render?: SiteCreativeLayer['render'];
    scoring?: SiteCreativeLayer['scoring'];
    runtimeStatus?: SiteCreativeLayer['runtimeStatus'];
  }>;
  compositionProject?: {
    layerCount: number;
    domains: string[];
    adapterBackedDomains: string[];
  };
  capabilityMatrix?: SiteCreativeCapabilityMatrix;
  rejectedCandidates?: SiteCreativeRejectedCandidate[];
}

export interface SiteCreativeComposition {
  compositionId: string;
  siteId: string;
  skinId: string;
  prompt: string;
  createdAt: string;
  strategy: SiteCreativeStrategy;
  domainMode: SiteCreativeDomainMode;
  domains: SiteCreativeDomain[];
  layers: SiteCreativeLayer[];
  runtime: {
    css: string;
    js: string;
    manifest: SiteCreativeRuntimeManifest;
  };
  provenance: {
    engine: 'liminal-sites';
    source: 'deterministic-cross-domain' | 'full-liminal-orchestrator';
    seed: string;
    adapters: string[];
  };
  capabilityMatrix: SiteCreativeCapabilityMatrix;
  rejectedCandidates: SiteCreativeRejectedCandidate[];
  quality: {
    score: number;
    notes: string[];
  };
  operatorNotes: string[];
}

export interface SiteCreativeCompositionExport {
  outputDir: string;
  cssPath: string;
  jsPath: string;
  manifestPath: string;
  files: {
    css: string;
    js: string;
    manifest: string;
  };
}

export const PreferenceEventSchema = z.object({
  eventId: z.string(),
  siteId: z.string(),
  skinId: z.string(),
  kind: z.enum(['favorite', 'reject', 'more-like-this', 'less-like-this', 'publish']),
  note: z.string().max(1000).optional(),
  createdAt: z.string().datetime(),
});

export type PreferenceEvent = z.infer<typeof PreferenceEventSchema>;

export const WebsiteIngestionInputSchema = z.object({
  sourceUrl: z.string().trim().url().optional(),
  sourcePath: z.string().trim().min(1).optional(),
  captureVisual: z.boolean().default(true),
  viewport: z.object({
    width: z.number().int().min(320).max(3840).default(1440),
    height: z.number().int().min(240).max(2400).default(960),
  }).default({ width: 1440, height: 960 }),
}).refine((input) => Boolean(input.sourceUrl || input.sourcePath), {
  message: 'Either sourceUrl or sourcePath is required',
  path: ['sourceUrl'],
});

export type WebsiteIngestionInput = z.input<typeof WebsiteIngestionInputSchema>;

export interface WebsiteIngestionResult {
  ingestionId: string;
  siteId: string;
  createdAt: string;
  source: {
    kind: 'url' | 'path';
    value: string;
  };
  title: string;
  description: string;
  screenshotPath?: string;
  sourceHtmlPath?: string;
  metrics: {
    viewport: { width: number; height: number };
    bodyTextLength: number;
    headingCount: number;
    linkCount: number;
    buttonCount: number;
    imageCount: number;
    formCount: number;
    sectionCount: number;
    largestElementAreaRatio: number;
  };
  designSignals: {
    colors: string[];
    fonts: string[];
    headings: string[];
    density: 'spare' | 'balanced' | 'dense';
    motionPreference: 'quiet' | 'pulse' | 'kinetic';
    notes: string[];
  };
  repository?: {
    framework: string;
    packageManager: string;
    appEntryCandidates: string[];
    styleEntryCandidates: string[];
  };
  recommendedBrandBrief: string;
  operatorNotes: string[];
}

export const SiteAestheticAssessmentInputSchema = z.object({
  skinIds: z.array(z.string().regex(/^[a-z0-9][a-z0-9-]{2,100}$/)).min(1).max(12).optional(),
  recordWinnerPreference: z.boolean().default(false),
});

export type SiteAestheticAssessmentInput = z.input<typeof SiteAestheticAssessmentInputSchema>;

export interface SiteAestheticAssessmentCandidate {
  skinId: string;
  name: string;
  rank: number;
  score: number;
  breakdown: {
    quality: number;
    continuity: number;
    novelty: number;
    taste: number;
    operatorConfidence: number;
  };
  signals: {
    motion: string;
    density: string;
    palette: string[];
  };
  rationale: string[];
  risks: string[];
  nextPrompt: string;
}

export interface SiteAestheticAssessment {
  assessmentId: string;
  siteId: string;
  createdAt: string;
  ingestionId?: string;
  winnerSkinId?: string;
  preferenceSummary: string;
  operatorSummary: string;
  nextEvolutionPrompt: string;
  candidates: SiteAestheticAssessmentCandidate[];
}

export const SiteDeploymentPackageInputSchema = z.object({
  skinId: z.string().regex(/^[a-z0-9][a-z0-9-]{2,100}$/),
  compositionId: z.string().regex(/^[a-z0-9][a-z0-9-]{2,100}$/).optional(),
  publicBaseUrl: z.string().trim().url().optional(),
});

export type SiteDeploymentPackageInput = z.input<typeof SiteDeploymentPackageInputSchema>;

export interface SiteDeploymentPackage {
  deploymentId: string;
  siteId: string;
  skinId: string;
  creativeCompositionId?: string;
  createdAt: string;
  mode: 'runtime-snippet';
  assetBaseUrl: string;
  outputDir: string;
  files: {
    cssPath: string;
    jsPath: string;
    manifestPath: string;
    creativeCssPath?: string;
    creativeJsPath?: string;
    creativeManifestPath?: string;
    installHtmlPath: string;
    readmePath: string;
  };
  installSnippets: {
    head: string;
    bodyEnd: string;
    creativeHead?: string;
    creativeBodyEnd?: string;
    combined: string;
  };
  manifest: {
    deploymentId: string;
    siteId: string;
    skinId: string;
    mode: 'runtime-snippet';
    assets: {
      css: string;
      js: string;
      creativeCss?: string;
      creativeJs?: string;
      creativeManifest?: string;
      installHtml: string;
    };
  };
  verificationChecklist: string[];
  operatorNotes: string[];
}

export const SiteRollbackReceiptInputSchema = z.object({
  skinId: z.string().regex(/^[a-z0-9][a-z0-9-]{2,100}$/),
  reason: z.string().trim().max(1000).optional(),
});

export type SiteRollbackReceiptInput = z.input<typeof SiteRollbackReceiptInputSchema>;

export interface SiteRollbackReceipt {
  rollbackId: string;
  siteId: string;
  skinId: string;
  createdAt: string;
  reason?: string;
  previousPublishedSkinId?: string;
  preferenceEventId: string;
  selectedSkin: {
    skinId: string;
    name: string;
    createdAt: string;
    qualityScore: number;
  };
  operatorSteps: string[];
  verificationChecklist: string[];
}

export const SiteOperatorRunbookInputSchema = z.object({
  skinId: z.string().regex(/^[a-z0-9][a-z0-9-]{2,100}$/).optional(),
});

export type SiteOperatorRunbookInput = z.input<typeof SiteOperatorRunbookInputSchema>;

export type SiteOperatorCheckStatus = 'ready' | 'warning' | 'blocked';

export interface SiteOperatorRunbookCheck {
  id: string;
  label: string;
  status: SiteOperatorCheckStatus;
  detail: string;
  action?: string;
}

export interface SiteOperatorRunbook {
  runbookId: string;
  siteId: string;
  skinId?: string;
  createdAt: string;
  status: 'ready' | 'needs-action' | 'blocked';
  summary: string;
  checks: SiteOperatorRunbookCheck[];
  operatorJourney: string[];
  recoveryPaths: string[];
  receipts: SiteReceiptSummary[];
}

export interface SiteReceiptSummary {
  kind: 'ingestion' | 'aesthetic-assessment' | 'creative-composition' | 'deployment' | 'rollback' | 'operator-runbook';
  id: string;
  label: string;
  createdAt: string;
  skinId?: string;
}

export interface SiteProjectSummary {
  profile: {
    siteId: string;
    name: string;
    sourceUrl?: string;
    sourcePath?: string;
    brandBrief: string;
    createdAt: string;
    updatedAt: string;
  };
  counts: {
    variants: number;
    ingestions: number;
    preferences: number;
    aestheticAssessments: number;
    creativeCompositions: number;
    deployments: number;
    rollbacks: number;
    operatorRunbooks: number;
  };
  latest: {
    variant?: {
      skinId: string;
      name: string;
      createdAt: string;
      qualityScore: number;
    };
    ingestion?: {
      ingestionId: string;
      title: string;
      createdAt: string;
    };
    aestheticAssessment?: {
      assessmentId: string;
      winnerSkinId?: string;
      createdAt: string;
      operatorSummary: string;
    };
    creativeComposition?: {
      compositionId: string;
      skinId: string;
      createdAt: string;
      domains: SiteCreativeDomain[];
      qualityScore: number;
    };
    deployment?: {
      deploymentId: string;
      skinId: string;
      createdAt: string;
    };
    preference?: {
      eventId: string;
      skinId: string;
      kind: PreferenceEvent['kind'];
      createdAt: string;
    };
    rollback?: {
      rollbackId: string;
      skinId: string;
      createdAt: string;
    };
    operatorRunbook?: {
      runbookId: string;
      skinId?: string;
      status: SiteOperatorRunbook['status'];
      createdAt: string;
    };
  };
  publishedSkinId?: string;
  nextOperatorAction: string;
  receipts: SiteReceiptSummary[];
}

export interface VariantRun {
  runId: string;
  siteId: string;
  prompt: string;
  createdAt: string;
  variants: SkinSpec[];
}

export interface RuntimeSkinExport {
  outputDir: string;
  cssPath: string;
  jsPath: string;
  manifestPath: string;
  files: {
    css: string;
    js: string;
    manifest: string;
  };
}

export type RuntimeCreativeExport = SiteCreativeCompositionExport;

export interface WebsiteEvolutionEngineOptions {
  rootDir?: string;
  creativeGeneratorBridge?: {
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
    ): Promise<{
      code: string;
      model?: string;
      thinking?: string;
      warnings?: string[];
      generator?: string;
    }>;
  };
  creativeRenderAndScore?: (candidate: {
    candidateId: string;
    domain: SiteCreativeDomain;
    code: string;
  }) => Promise<{
    success: boolean;
    score: number;
    domain: string;
    warnings?: string[];
    duration: number;
    error?: string;
  }>;
}
