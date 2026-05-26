import { randomUUID } from 'crypto';
import path from 'path';
import { SiteStore } from './SiteStore.js';
import {
  PreferenceEventSchema,
  SiteAestheticAssessmentInputSchema,
  SiteCreativeCompositionInputSchema,
  SiteDeploymentPackageInputSchema,
  SiteOperatorRunbookInputSchema,
  SiteProfileInputSchema,
  SiteRollbackReceiptInputSchema,
  type PreferenceEvent,
  type RuntimeCreativeExport,
  type RuntimeSkinExport,
  type SiteAestheticAssessment,
  type SiteAestheticAssessmentInput,
  type SiteCreativeCapabilityMatrix,
  type SiteCreativeComposition,
  type SiteCreativeCompositionInput,
  type SiteDeploymentPackage,
  type SiteDeploymentPackageInput,
  type SiteOperatorRunbook,
  type SiteOperatorRunbookCheck,
  type SiteOperatorRunbookInput,
  type SiteProfile,
  type SiteProfileInput,
  type SiteProjectSummary,
  type SiteReceiptSummary,
  type SiteRollbackReceipt,
  type SiteRollbackReceiptInput,
  type SiteSkinTokens,
  type SkinSpec,
  type VariantRun,
  type WebsiteIngestionInput,
  type WebsiteIngestionResult,
  type WebsiteEvolutionEngineOptions,
} from './types.js';
import { createRunId, createSiteId, stableSeed } from './siteIds.js';
import { exportRuntimeSkin as writeRuntimeSkin } from './runtime/exportRuntimeSkin.js';
import { buildRuntimeSkinFiles } from './runtime/runtimeSkinTemplate.js';
import { ingestWebsiteSource } from './ingest/WebsiteIngestionEngine.js';
import { compareSiteAesthetics } from './aesthetic/AestheticIntelligence.js';
import { createRuntimeDeploymentPackage } from './deploy/RuntimeDeploymentPackage.js';
import { composeCreativeSite as buildCreativeSiteComposition, exportCreativeCompositionFiles } from './creative/CreativeSiteComposer.js';
import { composeFullLiminalCreativeSite } from './creative/LiminalSiteCreativeOrchestrator.js';
import { buildLiminalCapabilityMatrix } from './creative/LiminalCapabilityMatrix.js';

export class WebsiteEvolutionEngine {
  private readonly store: SiteStore;
  private readonly options: WebsiteEvolutionEngineOptions;

  constructor(options: WebsiteEvolutionEngineOptions = {}) {
    this.options = options;
    this.store = new SiteStore(options.rootDir);
  }

  async createProfile(input: SiteProfileInput): Promise<SiteProfile> {
    const parsed = SiteProfileInputSchema.parse(input);
    const now = new Date().toISOString();
    const profile: SiteProfile = {
      ...parsed,
      siteId: createSiteId(parsed.name),
      createdAt: now,
      updatedAt: now,
    };
    await this.store.writeProfile(profile);
    return profile;
  }

  async getProfile(siteId: string): Promise<SiteProfile> {
    return this.store.readProfile(siteId);
  }

  async listProjectSummaries(): Promise<SiteProjectSummary[]> {
    const profiles = await this.store.listProfiles();
    const summaries = await Promise.all(profiles.map((profile) => this.summarizeProject(profile)));
    return summaries.sort((a, b) => projectSummaryTimestamp(b).localeCompare(projectSummaryTimestamp(a)));
  }

  async listVariants(siteId: string): Promise<SkinSpec[]> {
    return this.store.listVariants(siteId);
  }

  async ingestSource(siteId: string, input: Partial<WebsiteIngestionInput> = {}): Promise<WebsiteIngestionResult> {
    const profile = await this.store.readProfile(siteId);
    const explicitSourceUrl = input.sourceUrl?.trim();
    const explicitSourcePath = input.sourcePath?.trim();
    const result = await ingestWebsiteSource({
      siteId,
      sourceUrl: explicitSourceUrl ?? (explicitSourcePath ? undefined : profile.sourceUrl),
      sourcePath: explicitSourcePath ?? (explicitSourceUrl ? undefined : profile.sourcePath),
      captureVisual: input.captureVisual ?? true,
      viewport: input.viewport,
      artifactPath: (ingestionId, fileName) => this.store.ingestionArtifactPath(siteId, ingestionId, fileName),
    });
    await this.store.writeIngestion(result);
    return result;
  }

  async listIngestions(siteId: string): Promise<WebsiteIngestionResult[]> {
    return this.store.listIngestions(siteId);
  }

  async getIngestion(siteId: string, ingestionId: string): Promise<WebsiteIngestionResult> {
    return this.store.readIngestion(siteId, ingestionId);
  }

  async generateVariants(siteId: string, request: { prompt: string; count?: number; mode?: 'runtime-skin' | 'repo-native-pr' }): Promise<VariantRun> {
    const profile = await this.store.readProfile(siteId);
    const ingestion = (await this.store.listIngestions(siteId)).at(-1);
    const effectivePrompt = ingestion ? `${request.prompt}\nCurrent website ingestion: ${summarizeIngestion(ingestion)}` : request.prompt;
    const count = clampInteger(request.count ?? 3, 1, 6);
    const runId = createRunId('site-run');
    const createdAt = new Date().toISOString();
    const variants: SkinSpec[] = [];
    for (let index = 0; index < count; index += 1) {
      const seed = stableSeed(profile.siteId, effectivePrompt, runId, String(index));
      const variant = buildSkinSpec({
        profile,
        prompt: effectivePrompt,
        mode: request.mode ?? 'runtime-skin',
        seed,
        source: 'deterministic-mvp',
        ordinal: index + 1,
      });
      await this.store.writeVariant(variant);
      variants.push(variant);
    }
    return { runId, siteId, prompt: request.prompt, createdAt, variants };
  }

  async recordPreference(input: Omit<PreferenceEvent, 'eventId' | 'createdAt'> & { eventId?: string; createdAt?: string }): Promise<PreferenceEvent> {
    await this.store.readVariant(input.siteId, input.skinId);
    const event = PreferenceEventSchema.parse({
      ...input,
      eventId: input.eventId ?? `pref-${randomUUID().slice(0, 12)}`,
      createdAt: input.createdAt ?? new Date().toISOString(),
    });
    await this.store.appendPreference(event);
    return event;
  }

  async listPreferences(siteId: string): Promise<PreferenceEvent[]> {
    return this.store.listPreferences(siteId);
  }

  async compareAesthetics(siteId: string, input: SiteAestheticAssessmentInput = {}): Promise<SiteAestheticAssessment> {
    const parsed = SiteAestheticAssessmentInputSchema.parse(input);
    const variants = await this.store.listVariants(siteId);
    const selectedVariants = parsed.skinIds?.length
      ? variants.filter((variant) => parsed.skinIds?.includes(variant.skinId))
      : variants.slice(-6);
    if (selectedVariants.length === 0) throw new Error(`No living-site variants were found for ${siteId}`);
    const ingestions = await this.store.listIngestions(siteId);
    const preferences = await this.store.listPreferences(siteId);
    const assessment = compareSiteAesthetics({
      siteId,
      variants: selectedVariants,
      ingestion: ingestions.at(-1),
      preferences,
    });
    await this.store.writeAestheticAssessment(assessment);
    if (parsed.recordWinnerPreference && assessment.winnerSkinId) {
      await this.recordPreference({
        siteId,
        skinId: assessment.winnerSkinId,
        kind: 'more-like-this',
        note: `Aesthetic loop winner: ${assessment.operatorSummary}`,
      });
    }
    return assessment;
  }

  async listAestheticAssessments(siteId: string): Promise<SiteAestheticAssessment[]> {
    return this.store.listAestheticAssessments(siteId);
  }

  async composeCreativeSite(siteId: string, input: SiteCreativeCompositionInput = {}): Promise<SiteCreativeComposition> {
    const parsed = SiteCreativeCompositionInputSchema.parse(input);
    const [
      profile,
      variants,
      ingestions,
      preferences,
    ] = await Promise.all([
      this.store.readProfile(siteId),
      this.store.listVariants(siteId),
      this.store.listIngestions(siteId),
      this.store.listPreferences(siteId),
    ]);
    const skinId = parsed.skinId ?? variants.at(-1)?.skinId;
    if (!skinId) throw new Error(`No living-site skin is available for creative composition on ${siteId}`);
    const skin = variants.find((variant) => variant.skinId === skinId) ?? await this.store.readVariant(siteId, skinId);
    const composition = parsed.strategy === 'full-liminal'
      ? await composeFullLiminalCreativeSite({
        profile,
        skin,
        ingestion: ingestions.at(-1),
        preferences,
        prompt: parsed.prompt,
        request: parsed,
        generatorBridge: this.options.creativeGeneratorBridge,
        renderAndScore: this.options.creativeRenderAndScore,
      })
      : buildCreativeSiteComposition({
        profile,
        skin,
        ingestion: ingestions.at(-1),
        preferences,
        prompt: parsed.prompt,
        domains: parsed.domains,
      });
    await this.store.writeCreativeComposition(composition);
    return composition;
  }

  async getCreativeComposition(siteId: string, compositionId: string): Promise<SiteCreativeComposition> {
    return this.store.readCreativeComposition(siteId, compositionId);
  }

  async listCreativeCompositions(siteId: string): Promise<SiteCreativeComposition[]> {
    return this.store.listCreativeCompositions(siteId);
  }

  async inspectCreativeCapabilities(siteId?: string): Promise<{
    siteId?: string;
    profileName?: string;
    inventory: SiteCreativeCapabilityMatrix;
    latestComposition?: {
      compositionId: string;
      skinId: string;
      strategy: SiteCreativeComposition['strategy'];
      domainMode: SiteCreativeComposition['domainMode'];
      domains: SiteCreativeComposition['domains'];
      capabilityMatrix: SiteCreativeCapabilityMatrix;
    };
  }> {
    const [profile, compositions] = siteId
      ? await Promise.all([
        this.store.readProfile(siteId),
        this.store.listCreativeCompositions(siteId),
      ])
      : [undefined, []] as const;
    const latest = compositions.at(-1);
    return {
      siteId,
      profileName: profile?.name,
      inventory: await buildLiminalCapabilityMatrix({
        strategy: 'full-liminal',
        domainMode: 'all',
      }),
      latestComposition: latest ? {
        compositionId: latest.compositionId,
        skinId: latest.skinId,
        strategy: latest.strategy,
        domainMode: latest.domainMode,
        domains: latest.domains,
        capabilityMatrix: latest.capabilityMatrix,
      } : undefined,
    };
  }

  async createDeploymentPackage(siteId: string, input: SiteDeploymentPackageInput): Promise<SiteDeploymentPackage> {
    const parsed = SiteDeploymentPackageInputSchema.parse(input);
    const profile = await this.store.readProfile(siteId);
    const spec = await this.store.readVariant(siteId, parsed.skinId);
    const composition = parsed.compositionId
      ? await this.store.readCreativeComposition(siteId, parsed.compositionId)
      : undefined;
    const deployment = await createRuntimeDeploymentPackage({
      profile,
      spec,
      composition,
      publicBaseUrl: parsed.publicBaseUrl,
      artifactPath: (deploymentId, fileName) => this.store.deploymentArtifactPath(siteId, deploymentId, fileName),
    });
    await this.store.writeDeploymentPackage(deployment);
    return deployment;
  }

  async getDeploymentPackage(siteId: string, deploymentId: string): Promise<SiteDeploymentPackage> {
    return this.store.readDeploymentPackage(siteId, deploymentId);
  }

  async listDeploymentPackages(siteId: string): Promise<SiteDeploymentPackage[]> {
    return this.store.listDeploymentPackages(siteId);
  }

  async createRollbackReceipt(siteId: string, input: SiteRollbackReceiptInput): Promise<SiteRollbackReceipt> {
    const parsed = SiteRollbackReceiptInputSchema.parse(input);
    const selected = await this.store.readVariant(siteId, parsed.skinId);
    const preferences = await this.store.listPreferences(siteId);
    const previousPublishedSkinId = preferences.filter((event) => event.kind === 'publish').at(-1)?.skinId;
    const preference = await this.recordPreference({
      siteId,
      skinId: selected.skinId,
      kind: 'publish',
      note: parsed.reason?.trim() ? `Rollback: ${parsed.reason.trim()}` : `Rollback to ${selected.name}.`,
    });
    const receipt: SiteRollbackReceipt = {
      rollbackId: createRunId('rollback'),
      siteId,
      skinId: selected.skinId,
      createdAt: new Date().toISOString(),
      reason: parsed.reason?.trim() || undefined,
      previousPublishedSkinId,
      preferenceEventId: preference.eventId,
      selectedSkin: {
        skinId: selected.skinId,
        name: selected.name,
        createdAt: selected.createdAt,
        qualityScore: selected.quality.score,
      },
      operatorSteps: [
        `Confirmed ${selected.skinId} exists in saved variant history.`,
        previousPublishedSkinId
          ? `Previous published skin was ${previousPublishedSkinId}.`
          : 'No previous published skin was recorded before this rollback.',
        `Recorded ${selected.skinId} as the current published skin in taste memory.`,
        'Use the deployment package or repo patch planner to reinstall this exact skin.',
      ],
      verificationChecklist: [
        'Open the selected skin in Preview before applying it to production.',
        'Create or reuse a deployment package for this skin id.',
        'Confirm the website loads the expected data-liminal-sites skin id after install.',
        'Keep this rollback receipt with the operator history for auditability.',
      ],
    };
    await this.store.writeRollbackReceipt(receipt);
    return receipt;
  }

  async listRollbackReceipts(siteId: string): Promise<SiteRollbackReceipt[]> {
    return this.store.listRollbackReceipts(siteId);
  }

  async createOperatorRunbook(siteId: string, input: SiteOperatorRunbookInput = {}): Promise<SiteOperatorRunbook> {
    const parsed = SiteOperatorRunbookInputSchema.parse(input);
    const [
      profile,
      variants,
      ingestions,
      preferences,
      assessments,
      creativeCompositions,
      deployments,
      rollbacks,
    ] = await Promise.all([
      this.store.readProfile(siteId),
      this.store.listVariants(siteId),
      this.store.listIngestions(siteId),
      this.store.listPreferences(siteId),
      this.store.listAestheticAssessments(siteId),
      this.store.listCreativeCompositions(siteId),
      this.store.listDeploymentPackages(siteId),
      this.store.listRollbackReceipts(siteId),
    ]);
    const publishedSkinId = preferences.filter((event) => event.kind === 'publish').at(-1)?.skinId;
    const selectedSkinId = parsed.skinId ?? publishedSkinId ?? variants.at(-1)?.skinId;
    const selectedVariant = selectedSkinId ? variants.find((variant) => variant.skinId === selectedSkinId) : undefined;
    if (parsed.skinId && !selectedVariant) {
      await this.store.readVariant(siteId, parsed.skinId);
    }
    const latestIngestion = ingestions.at(-1);
    const latestAssessment = assessments.at(-1);
    const latestComposition = selectedSkinId
      ? creativeCompositions.filter((composition) => composition.skinId === selectedSkinId).at(-1) ?? creativeCompositions.at(-1)
      : creativeCompositions.at(-1);
    const latestDeployment = selectedSkinId
      ? deployments.filter((deployment) => deployment.skinId === selectedSkinId).at(-1) ?? deployments.at(-1)
      : deployments.at(-1);
    const latestRollback = selectedSkinId
      ? rollbacks.filter((rollback) => rollback.skinId === selectedSkinId).at(-1) ?? rollbacks.at(-1)
      : rollbacks.at(-1);
    const checks: SiteOperatorRunbookCheck[] = [
      {
        id: 'source-ingested',
        label: 'Current site captured',
        status: latestIngestion ? 'ready' : 'blocked',
        detail: latestIngestion ? `Latest ingestion: ${latestIngestion.title}.` : 'No ingestion receipt exists for this living site.',
        action: latestIngestion ? undefined : 'Run Ingest against the live URL or local source path.',
      },
      {
        id: 'visual-receipt',
        label: 'Visual receipt available',
        status: latestIngestion?.screenshotPath ? 'ready' : latestIngestion ? 'warning' : 'blocked',
        detail: latestIngestion?.screenshotPath
          ? 'The ingestion includes a screenshot-backed visual receipt.'
          : latestIngestion
            ? 'The source was ingested without a screenshot.'
            : 'A screenshot cannot exist before ingestion.',
        action: latestIngestion?.screenshotPath ? undefined : 'Re-ingest with visual capture enabled before making visual claims.',
      },
      {
        id: 'selected-skin',
        label: 'Recovery target selected',
        status: selectedVariant ? 'ready' : 'blocked',
        detail: selectedVariant ? `${selectedVariant.name} is selected at ${selectedVariant.quality.score.toFixed(2)} quality.` : 'No saved skin is available.',
        action: selectedVariant ? undefined : 'Generate variants and select a skin before deployment.',
      },
      {
        id: 'aesthetic-ranking',
        label: 'Aesthetic comparison recorded',
        status: latestAssessment ? 'ready' : selectedVariant ? 'warning' : 'blocked',
        detail: latestAssessment ? latestAssessment.operatorSummary : 'No aesthetic assessment has ranked the current options yet.',
        action: latestAssessment ? undefined : 'Run Compare so the selected skin has an explainable ranking.',
      },
      {
        id: 'taste-memory',
        label: 'Taste memory present',
        status: preferences.length > 0 ? 'ready' : selectedVariant ? 'warning' : 'blocked',
        detail: preferences.length > 0 ? summarizePreferences(preferences) : 'No operator preferences have been recorded.',
        action: preferences.length > 0 ? undefined : 'Record Favorite, Publish, or Reject before evolving again.',
      },
      {
        id: 'creative-composition',
        label: 'Creative composition installed',
        status: latestComposition && selectedSkinId && latestComposition.skinId === selectedSkinId ? 'ready' : selectedVariant ? 'warning' : 'blocked',
        detail: latestComposition
          ? `Latest creative composition ${latestComposition.compositionId} combines ${latestComposition.domains.join(' + ')}.`
          : 'No cross-domain creative composition exists yet.',
        action: latestComposition && selectedSkinId && latestComposition.skinId === selectedSkinId ? undefined : 'Compose the selected skin into a full creative layer with receipts.',
      },
      {
        id: 'deployment-package',
        label: 'Install package ready',
        status: latestDeployment && selectedSkinId && latestDeployment.skinId === selectedSkinId ? 'ready' : selectedVariant ? 'warning' : 'blocked',
        detail: latestDeployment
          ? `Latest package ${latestDeployment.deploymentId} targets ${latestDeployment.skinId}.`
          : 'No deployment package has been created.',
        action: latestDeployment && selectedSkinId && latestDeployment.skinId === selectedSkinId ? undefined : 'Create a deployment package for the selected skin.',
      },
      {
        id: 'rollback-receipt',
        label: 'Rollback receipt ready',
        status: latestRollback && selectedSkinId && latestRollback.skinId === selectedSkinId ? 'ready' : selectedVariant ? 'warning' : 'blocked',
        detail: latestRollback
          ? `Latest rollback ${latestRollback.rollbackId} returns to ${latestRollback.skinId}.`
          : 'No rollback receipt exists yet.',
        action: latestRollback && selectedSkinId && latestRollback.skinId === selectedSkinId ? undefined : 'Record a rollback receipt before production install.',
      },
    ];
    const status = checks.some((check) => check.status === 'blocked')
      ? 'blocked'
      : checks.some((check) => check.status === 'warning')
        ? 'needs-action'
        : 'ready';
    const runbook: SiteOperatorRunbook = {
      runbookId: createRunId('runbook'),
      siteId,
      skinId: selectedSkinId,
      createdAt: new Date().toISOString(),
      status,
      summary: operatorRunbookSummary(profile.name, status, selectedVariant?.name),
      checks,
      operatorJourney: operatorJourney(checks),
      recoveryPaths: recoveryPaths({ selectedSkinId, latestComposition, latestDeployment, latestRollback, publishedSkinId }),
      receipts: runbookReceipts({ latestIngestion, latestAssessment, latestComposition, latestDeployment, latestRollback }),
    };
    await this.store.writeOperatorRunbook(runbook);
    return runbook;
  }

  async listOperatorRunbooks(siteId: string): Promise<SiteOperatorRunbook[]> {
    return this.store.listOperatorRunbooks(siteId);
  }

  async evolve(siteId: string, request: { prompt?: string; count?: number } = {}): Promise<VariantRun> {
    const profile = await this.store.readProfile(siteId);
    const preferences = await this.store.listPreferences(siteId);
    const liked = preferences.filter((event) => event.kind === 'favorite' || event.kind === 'more-like-this' || event.kind === 'publish');
    const lastLiked = liked.at(-1);
    const basePrompt = request.prompt?.trim() || lastLiked?.note || `Evolve ${profile.name} toward the selected living website direction.`;
    const run = await this.generateVariants(siteId, {
      prompt: `${basePrompt}\nPreference memory: ${summarizePreferences(preferences)}`,
      count: request.count ?? 3,
      mode: 'runtime-skin',
    });
    const evolvedVariants = run.variants.map((variant) => ({
      ...variant,
      provenance: { ...variant.provenance, source: 'evolution' as const },
      quality: {
        score: Math.min(0.98, variant.quality.score + Math.min(0.12, liked.length * 0.02)),
        notes: [...variant.quality.notes, 'Evolved from curated site preference memory.'],
      },
    }));
    await Promise.all(evolvedVariants.map((variant) => this.store.writeVariant(variant)));
    return {
      ...run,
      variants: evolvedVariants,
    };
  }

  async exportRuntimeSkin(siteId: string, skinId: string, outputDir = path.join(process.cwd(), 'output', 'liminal-sites', siteId, skinId)): Promise<RuntimeSkinExport> {
    const spec = await this.store.readVariant(siteId, skinId);
    return writeRuntimeSkin(spec, outputDir);
  }

  async exportCreativeComposition(
    siteId: string,
    compositionId: string,
    outputDir = path.join(process.cwd(), 'output', 'liminal-sites', siteId, compositionId),
  ): Promise<RuntimeCreativeExport> {
    const composition = await this.store.readCreativeComposition(siteId, compositionId);
    return exportCreativeCompositionFiles(composition, outputDir);
  }

  private async summarizeProject(profile: SiteProfile): Promise<SiteProjectSummary> {
    const [
      variants,
      ingestions,
      preferences,
      aestheticAssessments,
      creativeCompositions,
      deployments,
      rollbacks,
      operatorRunbooks,
    ] = await Promise.all([
      this.store.listVariants(profile.siteId),
      this.store.listIngestions(profile.siteId),
      this.store.listPreferences(profile.siteId),
      this.store.listAestheticAssessments(profile.siteId),
      this.store.listCreativeCompositions(profile.siteId),
      this.store.listDeploymentPackages(profile.siteId),
      this.store.listRollbackReceipts(profile.siteId),
      this.store.listOperatorRunbooks(profile.siteId),
    ]);
    const latestVariant = variants.at(-1);
    const latestIngestion = ingestions.at(-1);
    const latestPreference = preferences.at(-1);
    const latestAssessment = aestheticAssessments.at(-1);
    const latestComposition = creativeCompositions.at(-1);
    const latestDeployment = deployments.at(-1);
    const latestRollback = rollbacks.at(-1);
    const latestRunbook = operatorRunbooks.at(-1);
    const publishedSkinId = preferences.filter((event) => event.kind === 'publish').at(-1)?.skinId;
    const receipts: SiteReceiptSummary[] = [
      ...ingestions.map((item) => ({
        kind: 'ingestion' as const,
        id: item.ingestionId,
        label: item.title || item.source.value,
        createdAt: item.createdAt,
      })),
      ...aestheticAssessments.map((item) => ({
        kind: 'aesthetic-assessment' as const,
        id: item.assessmentId,
        label: item.operatorSummary,
        createdAt: item.createdAt,
        skinId: item.winnerSkinId,
      })),
      ...creativeCompositions.map((item) => ({
        kind: 'creative-composition' as const,
        id: item.compositionId,
        label: `Creative composition: ${item.domains.join(' + ')}`,
        createdAt: item.createdAt,
        skinId: item.skinId,
      })),
      ...deployments.map((item) => ({
        kind: 'deployment' as const,
        id: item.deploymentId,
        label: `Deployment package for ${item.skinId}`,
        createdAt: item.createdAt,
        skinId: item.skinId,
      })),
      ...rollbacks.map((item) => ({
        kind: 'rollback' as const,
        id: item.rollbackId,
        label: `Rollback to ${item.selectedSkin.name}`,
        createdAt: item.createdAt,
        skinId: item.skinId,
      })),
      ...operatorRunbooks.map((item) => ({
        kind: 'operator-runbook' as const,
        id: item.runbookId,
        label: item.summary,
        createdAt: item.createdAt,
        skinId: item.skinId,
      })),
    ].sort(compareReceiptRecency).slice(0, 8);
    return {
      profile: {
        siteId: profile.siteId,
        name: profile.name,
        sourceUrl: profile.sourceUrl,
        sourcePath: profile.sourcePath,
        brandBrief: profile.brandBrief,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
      counts: {
        variants: variants.length,
        ingestions: ingestions.length,
        preferences: preferences.length,
        aestheticAssessments: aestheticAssessments.length,
        creativeCompositions: creativeCompositions.length,
        deployments: deployments.length,
        rollbacks: rollbacks.length,
        operatorRunbooks: operatorRunbooks.length,
      },
      latest: {
        variant: latestVariant ? {
          skinId: latestVariant.skinId,
          name: latestVariant.name,
          createdAt: latestVariant.createdAt,
          qualityScore: latestVariant.quality.score,
        } : undefined,
        ingestion: latestIngestion ? {
          ingestionId: latestIngestion.ingestionId,
          title: latestIngestion.title,
          createdAt: latestIngestion.createdAt,
        } : undefined,
        aestheticAssessment: latestAssessment ? {
          assessmentId: latestAssessment.assessmentId,
          winnerSkinId: latestAssessment.winnerSkinId,
          createdAt: latestAssessment.createdAt,
          operatorSummary: latestAssessment.operatorSummary,
        } : undefined,
        creativeComposition: latestComposition ? {
          compositionId: latestComposition.compositionId,
          skinId: latestComposition.skinId,
          createdAt: latestComposition.createdAt,
          domains: latestComposition.domains,
          qualityScore: latestComposition.quality.score,
        } : undefined,
        deployment: latestDeployment ? {
          deploymentId: latestDeployment.deploymentId,
          skinId: latestDeployment.skinId,
          createdAt: latestDeployment.createdAt,
        } : undefined,
        preference: latestPreference ? {
          eventId: latestPreference.eventId,
          skinId: latestPreference.skinId,
          kind: latestPreference.kind,
          createdAt: latestPreference.createdAt,
        } : undefined,
        rollback: latestRollback ? {
          rollbackId: latestRollback.rollbackId,
          skinId: latestRollback.skinId,
          createdAt: latestRollback.createdAt,
        } : undefined,
        operatorRunbook: latestRunbook ? {
          runbookId: latestRunbook.runbookId,
          skinId: latestRunbook.skinId,
          status: latestRunbook.status,
          createdAt: latestRunbook.createdAt,
        } : undefined,
      },
      publishedSkinId,
      nextOperatorAction: nextOperatorAction({
        variants: variants.length,
        ingestions: ingestions.length,
        aestheticAssessments: aestheticAssessments.length,
        creativeCompositions: creativeCompositions.length,
        deployments: deployments.length,
        rollbacks: rollbacks.length,
        operatorRunbooks: operatorRunbooks.length,
      }),
      receipts,
    };
  }
}

function buildSkinSpec(input: {
  profile: SiteProfile;
  prompt: string;
  mode: 'runtime-skin' | 'repo-native-pr';
  seed: string;
  source: 'deterministic-mvp' | 'llm' | 'evolution';
  ordinal: number;
}): SkinSpec {
  const tokens = deriveTokens(`${input.profile.brandBrief}\n${input.prompt}`, input.seed, input.ordinal);
  const createdAt = new Date().toISOString();
  const skinId = `${input.profile.siteId}-skin-${input.seed.slice(0, 8)}-${input.ordinal}`;
  const shell: SkinSpec = {
    skinId,
    siteId: input.profile.siteId,
    name: `${input.profile.name} direction ${input.ordinal}`,
    prompt: input.prompt,
    createdAt,
    tokens,
    runtime: { css: '', js: '' },
    provenance: {
      engine: 'liminal-sites',
      mode: input.mode,
      seed: input.seed,
      source: input.source,
    },
    quality: {
      score: 0.72 + (Number.parseInt(input.seed.slice(0, 2), 16) / 255) * 0.18,
      notes: [
        'Generated as a reviewable living-site direction.',
        `Optimized for ${tokens.motion.rhythm} motion and ${tokens.shape.density} information density.`,
      ],
    },
  };
  const runtime = buildRuntimeSkinFiles(shell);
  return { ...shell, runtime: { css: runtime.css, js: runtime.js } };
}

function nextOperatorAction(counts: {
  variants: number;
  ingestions: number;
  aestheticAssessments: number;
  creativeCompositions: number;
  deployments: number;
  rollbacks: number;
  operatorRunbooks: number;
}): string {
  if (counts.ingestions === 0) return 'Ingest the current website so future evolution is grounded in the real surface.';
  if (counts.variants === 0) return 'Generate the first runtime-skin directions from the captured website.';
  if (counts.aestheticAssessments === 0) return 'Run the aesthetic comparison loop to rank the current directions.';
  if (counts.creativeCompositions === 0) return 'Compose the selected skin into a full creative composition layer.';
  if (counts.deployments === 0) return 'Create a deployment package for the selected direction.';
  if (counts.rollbacks === 0) return 'Record a rollback receipt before treating the install path as reversible.';
  if (counts.operatorRunbooks === 0) return 'Generate an operator runbook to see readiness checks and recovery paths.';
  return 'Continue evolving from taste memory, then publish or roll back with receipts.';
}

function projectSummaryTimestamp(summary: SiteProjectSummary): string {
  return summary.receipts[0]?.createdAt
    ?? summary.latest.preference?.createdAt
    ?? summary.latest.variant?.createdAt
    ?? summary.profile.updatedAt;
}

const receiptKindRecencyRank: Record<SiteReceiptSummary['kind'], number> = {
  ingestion: 10,
  'aesthetic-assessment': 20,
  'creative-composition': 30,
  deployment: 40,
  rollback: 50,
  'operator-runbook': 60,
};

function compareReceiptRecency(a: SiteReceiptSummary, b: SiteReceiptSummary): number {
  const timestampOrder = b.createdAt.localeCompare(a.createdAt);
  if (timestampOrder !== 0) return timestampOrder;
  return receiptKindRecencyRank[b.kind] - receiptKindRecencyRank[a.kind]
    || b.id.localeCompare(a.id);
}

function operatorRunbookSummary(siteName: string, status: SiteOperatorRunbook['status'], skinName?: string): string {
  if (status === 'ready') return `${siteName} is ready for a reversible install of ${skinName ?? 'the selected skin'}.`;
  if (status === 'needs-action') return `${siteName} has a recovery path but needs one more operator check before install.`;
  return `${siteName} is blocked until the missing operator prerequisites are resolved.`;
}

function operatorJourney(checks: SiteOperatorRunbookCheck[]): string[] {
  const blockedOrWarning = checks.filter((check) => check.status !== 'ready');
  if (blockedOrWarning.length > 0) {
    return blockedOrWarning.map((check) => check.action ?? `Resolve ${check.label}.`);
  }
  return [
    'Open Preview and confirm the selected skin is the intended recovery target.',
    'Open the deployment package install preview and copy the CSS and JS snippets.',
    'Install the snippets in the target site, then confirm document.body has liminal-sites-active.',
    'Keep the rollback receipt and this runbook with the project dashboard history.',
  ];
}

function recoveryPaths(input: {
  selectedSkinId?: string;
  latestComposition?: SiteCreativeComposition;
  latestDeployment?: SiteDeploymentPackage;
  latestRollback?: SiteRollbackReceipt;
  publishedSkinId?: string;
}): string[] {
  const paths: string[] = [];
  if (input.latestRollback) {
    paths.push(`Rollback receipt ${input.latestRollback.rollbackId} restores ${input.latestRollback.skinId}.`);
  }
  if (input.latestDeployment) {
    paths.push(`Deployment package ${input.latestDeployment.deploymentId} can reinstall ${input.latestDeployment.skinId}.`);
  }
  if (input.latestComposition) {
    paths.push(`Creative composition ${input.latestComposition.compositionId} can reinstall ${input.latestComposition.domains.join(' + ')} layers.`);
  }
  if (input.publishedSkinId) {
    paths.push(`Taste memory marks ${input.publishedSkinId} as the current published skin.`);
  }
  if (input.selectedSkinId && paths.length === 0) {
    paths.push(`Selected skin ${input.selectedSkinId} has no deployment or rollback receipt yet.`);
  }
  return paths.length > 0 ? paths : ['No recovery path exists yet; create a skin, deployment package, and rollback receipt first.'];
}

function runbookReceipts(input: {
  latestIngestion?: WebsiteIngestionResult;
  latestAssessment?: SiteAestheticAssessment;
  latestComposition?: SiteCreativeComposition;
  latestDeployment?: SiteDeploymentPackage;
  latestRollback?: SiteRollbackReceipt;
}): SiteReceiptSummary[] {
  const receipts: SiteReceiptSummary[] = [];
  if (input.latestIngestion) {
    receipts.push({
      kind: 'ingestion',
      id: input.latestIngestion.ingestionId,
      label: input.latestIngestion.title,
      createdAt: input.latestIngestion.createdAt,
    });
  }
  if (input.latestAssessment) {
    receipts.push({
      kind: 'aesthetic-assessment',
      id: input.latestAssessment.assessmentId,
      label: input.latestAssessment.operatorSummary,
      createdAt: input.latestAssessment.createdAt,
      skinId: input.latestAssessment.winnerSkinId,
    });
  }
  if (input.latestComposition) {
    receipts.push({
      kind: 'creative-composition',
      id: input.latestComposition.compositionId,
      label: `Creative composition: ${input.latestComposition.domains.join(' + ')}`,
      createdAt: input.latestComposition.createdAt,
      skinId: input.latestComposition.skinId,
    });
  }
  if (input.latestDeployment) {
    receipts.push({
      kind: 'deployment',
      id: input.latestDeployment.deploymentId,
      label: `Deployment package for ${input.latestDeployment.skinId}`,
      createdAt: input.latestDeployment.createdAt,
      skinId: input.latestDeployment.skinId,
    });
  }
  if (input.latestRollback) {
    receipts.push({
      kind: 'rollback',
      id: input.latestRollback.rollbackId,
      label: `Rollback to ${input.latestRollback.selectedSkin.name}`,
      createdAt: input.latestRollback.createdAt,
      skinId: input.latestRollback.skinId,
    });
  }
  return receipts.sort(compareReceiptRecency);
}

function deriveTokens(text: string, seed: string, ordinal: number): SiteSkinTokens {
  const lower = text.toLowerCase();
  const hue = (Number.parseInt(seed.slice(0, 4), 16) + ordinal * 41) % 360;
  const quiet = /quiet|minimal|calm|soft|editorial|serene/.test(lower);
  const kinetic = /kinetic|motion|alive|electric|neon|glitch|active/.test(lower);
  const warm = /warm|human|sun|gold|clay|organic/.test(lower);
  const dark = !/light|bright|white|paper/.test(lower);
  const density = /dense|dashboard|data|tool|operator/.test(lower) ? 'dense' : quiet ? 'spare' : 'balanced';
  const rhythm = quiet ? 'drift' : kinetic ? 'kinetic' : 'pulse';
  return {
    palette: {
      background: dark ? hsl(hue, warm ? 24 : 30, 8) : hsl(hue, 28, 96),
      surface: dark ? hsl(hue, 26, 13) : hsl(hue, 24, 99),
      text: dark ? hsl(hue, 22, 94) : hsl(hue, 22, 12),
      mutedText: dark ? hsl(hue, 13, 67) : hsl(hue, 12, 38),
      accent: hsl(warm ? 34 : hue + 18, 86, dark ? 62 : 42),
      accent2: hsl(hue + 132, 76, dark ? 58 : 36),
      line: dark ? hsl(hue, 22, 24) : hsl(hue, 18, 82),
    },
    typography: {
      fontFamily: quiet
        ? 'ui-serif, Georgia, Cambria, "Times New Roman", serif'
        : 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      headingScale: quiet ? 1.08 : kinetic ? 1.24 : 1.16,
      bodyScale: density === 'dense' ? 0.96 : 1,
    },
    motion: {
      intensity: quiet ? 0.24 : kinetic ? 0.78 : 0.46,
      rhythm,
    },
    shape: {
      radius: quiet ? 6 : kinetic ? 18 : 10,
      density,
    },
  };
}

function hsl(hue: number, saturation: number, lightness: number): string {
  return `hsl(${((hue % 360) + 360) % 360} ${saturation}% ${lightness}%)`;
}

function clampInteger(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function summarizePreferences(preferences: PreferenceEvent[]): string {
  if (preferences.length === 0) return 'none yet';
  return preferences.slice(-8).map((event) => `${event.kind}:${event.skinId}${event.note ? `:${event.note}` : ''}`).join(' | ');
}

function summarizeIngestion(ingestion: WebsiteIngestionResult): string {
  const colors = ingestion.designSignals.colors.slice(0, 4).join(', ') || 'no colors';
  const fonts = ingestion.designSignals.fonts.slice(0, 2).join(', ') || 'no fonts';
  return [
    ingestion.title,
    ingestion.description,
    `density=${ingestion.designSignals.density}`,
    `motion=${ingestion.designSignals.motionPreference}`,
    `colors=${colors}`,
    `fonts=${fonts}`,
    `headings=${ingestion.designSignals.headings.slice(0, 3).join(' / ')}`,
  ].filter(Boolean).join(' | ');
}
