import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ShittyPromptsTab } from './ShittyPromptsTab.js';

interface LivingSiteStudioProps {
  apiBase: string;
  prompt: string;
  runSignal: number;
  onPreview: (url: string | null, error?: string | null) => void;
}

interface LivingSiteProfile {
  siteId: string;
  name: string;
  sourceUrl?: string;
  sourcePath?: string;
  brandBrief: string;
}

interface LivingSiteVariant {
  skinId: string;
  name: string;
  prompt: string;
  tokens: {
    motion: { rhythm: string; intensity: number };
    shape: { density: string; radius: number };
    palette: { background: string; accent: string; accent2: string; text: string };
  };
  provenance: { source: string; mode: string; seed: string };
  quality: { score: number; notes: string[] };
}

interface LivingSiteIngestion {
  ingestionId: string;
  title: string;
  description: string;
  screenshotPath?: string;
  source: { kind: string; value: string };
  metrics: {
    bodyTextLength: number;
    headingCount: number;
    linkCount: number;
    buttonCount: number;
    imageCount: number;
    sectionCount: number;
    largestElementAreaRatio: number;
  };
  designSignals: {
    colors: string[];
    fonts: string[];
    headings: string[];
    density: string;
    motionPreference: string;
    notes: string[];
  };
  recommendedBrandBrief: string;
  operatorNotes: string[];
}

interface LivingSiteAssessment {
  assessmentId: string;
  winnerSkinId?: string;
  preferenceSummary: string;
  operatorSummary: string;
  nextEvolutionPrompt: string;
  candidates: Array<{
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
    rationale: string[];
    risks: string[];
    signals: {
      motion: string;
      density: string;
      palette: string[];
    };
  }>;
}

interface LivingSiteDeployment {
  deploymentId: string;
  skinId: string;
  assetBaseUrl: string;
  installSnippets: {
    head: string;
    bodyEnd: string;
    combined: string;
  };
  manifest: {
    assets: {
      css: string;
      js: string;
      installHtml: string;
    };
  };
  verificationChecklist: string[];
  operatorNotes: string[];
}

interface LivingSiteCapabilityMatrix {
  fullRunSatisfied: boolean;
  summary: {
    total: number;
    used: number;
    availableNotSelected: number;
    blocked: number;
    failed: number;
  };
  domains: Array<{
    domain: string;
    status: 'used' | 'available-not-selected' | 'blocked' | 'failed';
    evidence: string[];
  }>;
}

interface LivingSiteCreativeComposition {
  compositionId: string;
  skinId: string;
  strategy: 'balanced' | 'full-liminal';
  domainMode: 'auto' | 'all' | 'selected';
  domains: string[];
  layers: Array<{
    layerId: string;
    domain: string;
    label: string;
    runtimeStatus?: { status: string; reason?: string };
    validation: { valid: boolean; errors: string[] };
  }>;
  capabilityMatrix: LivingSiteCapabilityMatrix;
  rejectedCandidates: Array<{
    candidateId: string;
    domain: string;
    stage: string;
    status: 'blocked' | 'failed';
    reason: string;
  }>;
  quality: { score: number; notes: string[] };
}

interface LivingSiteProjectSummary {
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
    variant?: { skinId: string; name: string; createdAt: string; qualityScore: number };
    ingestion?: { ingestionId: string; title: string; createdAt: string };
    deployment?: { deploymentId: string; skinId: string; createdAt: string };
    creativeComposition?: { compositionId: string; skinId: string; createdAt: string; domains: string[]; qualityScore: number };
    rollback?: { rollbackId: string; skinId: string; createdAt: string };
    operatorRunbook?: { runbookId: string; skinId?: string; status: string; createdAt: string };
  };
  publishedSkinId?: string;
  nextOperatorAction: string;
  receipts: Array<{
    kind: string;
    id: string;
    label: string;
    createdAt: string;
    skinId?: string;
  }>;
}

interface LivingSiteRollback {
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
    qualityScore: number;
  };
  operatorSteps: string[];
  verificationChecklist: string[];
}

interface LivingSiteRunbook {
  runbookId: string;
  siteId: string;
  skinId?: string;
  createdAt: string;
  status: 'ready' | 'needs-action' | 'blocked';
  summary: string;
  checks: Array<{
    id: string;
    label: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
    action?: string;
  }>;
  operatorJourney: string[];
  recoveryPaths: string[];
  receipts: Array<{ kind: string; id: string; label: string; createdAt: string; skinId?: string }>;
}

interface SitePatchPlan {
  framework: string;
  packageManager: string;
  patches: Array<{ action: string; path: string; reason: string }>;
  warnings: string[];
  operatorSteps: string[];
}

type LivingAction = 'ingest' | 'generate' | 'compare' | 'evolve' | 'preview' | 'preference' | 'export' | 'creative' | 'deploy' | 'rollback' | 'runbook' | 'dashboard' | 'patch' | null;

export function LivingSiteStudio({ apiBase, prompt, runSignal, onPreview }: LivingSiteStudioProps) {
  const [siteName, setSiteName] = useState('Liminal Sites Demo');
  const [sourceUrl, setSourceUrl] = useState('https://example.com');
  const [sourcePath, setSourcePath] = useState('');
  const [brandBrief, setBrandBrief] = useState('A credible, operator-focused website that feels alive, self-improving, and visually calm.');
  const [localPrompt, setLocalPrompt] = useState('Evolve the first viewport into a living aesthetic with visible taste memory.');
  const [variantCount, setVariantCount] = useState(3);
  const [repoRoot, setRepoRoot] = useState('');
  const [creativeStrategy, setCreativeStrategy] = useState<'balanced' | 'full-liminal'>('full-liminal');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [includeVideoAssets, setIncludeVideoAssets] = useState(true);
  const [profile, setProfile] = useState<LivingSiteProfile | null>(null);
  const [variants, setVariants] = useState<LivingSiteVariant[]>([]);
  const [ingestion, setIngestion] = useState<LivingSiteIngestion | null>(null);
  const [assessment, setAssessment] = useState<LivingSiteAssessment | null>(null);
  const [selectedSkinId, setSelectedSkinId] = useState('');
  const [patchPlan, setPatchPlan] = useState<SitePatchPlan | null>(null);
  const [composition, setComposition] = useState<LivingSiteCreativeComposition | null>(null);
  const [exportPath, setExportPath] = useState('');
  const [deployment, setDeployment] = useState<LivingSiteDeployment | null>(null);
  const [dashboard, setDashboard] = useState<LivingSiteProjectSummary[]>([]);
  const [rollback, setRollback] = useState<LivingSiteRollback | null>(null);
  const [runbook, setRunbook] = useState<LivingSiteRunbook | null>(null);
  const [busy, setBusy] = useState<LivingAction>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('idle');
  const handledRunSignal = useRef(runSignal);

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.skinId === selectedSkinId) ?? variants[0] ?? null,
    [selectedSkinId, variants],
  );

  const currentProject = useMemo(
    () => dashboard.find((project) => project.profile.siteId === profile?.siteId) ?? null,
    [dashboard, profile?.siteId],
  );

  const selectedCompositionId = composition && selectedVariant && composition.skinId === selectedVariant.skinId
    ? composition.compositionId
    : undefined;

  useEffect(() => {
    if (runSignal === handledRunSignal.current) return;
    handledRunSignal.current = runSignal;
    void generateVariants(prompt || localPrompt);
  }, [runSignal]);

  async function ensureProfile(): Promise<LivingSiteProfile> {
    if (profile) return profile;
    const body: Record<string, unknown> = {
      name: siteName,
      brandBrief,
      constraints: ['Keep generated changes reviewable.', 'Prefer runtime skin first, repo patch second.'],
      allowedModes: ['runtime-skin', 'repo-native-pr'],
    };
    if (sourceUrl.trim()) body.sourceUrl = sourceUrl.trim();
    if (sourcePath.trim()) body.sourcePath = sourcePath.trim();
    const data = await postJson(`${apiBase}/living-sites/profile`, body);
    setProfile(data.profile);
    return data.profile;
  }

  async function loadDashboard(): Promise<LivingSiteProjectSummary[]> {
    const data = await getJson(`${apiBase}/living-sites/projects`);
    const projects = data.projects || [];
    setDashboard(projects);
    return projects;
  }

  async function refreshDashboard() {
    setBusy('dashboard');
    setError(null);
    try {
      const projects = await loadDashboard();
      setStatus(`${projects.length} saved site${projects.length === 1 ? '' : 's'}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    } finally {
      setBusy(null);
    }
  }

  async function refreshDashboardAfterMutation(successStatus: string) {
    try {
      await loadDashboard();
      setStatus(successStatus);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Dashboard refresh failed after update: ${message}`);
      setStatus(`${successStatus}; dashboard refresh failed`);
    }
  }

  async function generateVariants(overridePrompt?: string) {
    const runPrompt = (overridePrompt || prompt || localPrompt).trim();
    if (!runPrompt) return;
    setBusy('generate');
    setError(null);
    setStatus('profiling');
    try {
      const livingProfile = await ensureProfile();
      setStatus('generating');
      const data = await postJson(`${apiBase}/living-sites/${encodeURIComponent(livingProfile.siteId)}/variants`, {
        prompt: runPrompt,
        count: variantCount,
        mode: 'runtime-skin',
      });
      setVariants(data.run.variants || []);
      setSelectedSkinId(data.run.variants?.[0]?.skinId || '');
      setPatchPlan(null);
      setAssessment(null);
      setComposition(null);
      setDeployment(null);
      setRollback(null);
      setRunbook(null);
      await refreshDashboardAfterMutation(`generated ${data.run.variants?.length || 0} variants`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    } finally {
      setBusy(null);
    }
  }

  async function ingestSource() {
    setBusy('ingest');
    setError(null);
    setStatus('ingesting');
    try {
      const livingProfile = await ensureProfile();
      const data = await postJson(`${apiBase}/living-sites/${encodeURIComponent(livingProfile.siteId)}/ingest`, {
        sourceUrl: sourceUrl.trim() || undefined,
        sourcePath: sourcePath.trim() || undefined,
        captureVisual: true,
      });
      setIngestion(data.ingestion);
      setAssessment(null);
      setComposition(null);
      setRollback(null);
      setRunbook(null);
      if (data.ingestion?.recommendedBrandBrief) setBrandBrief(data.ingestion.recommendedBrandBrief);
      await refreshDashboardAfterMutation('site ingested');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    } finally {
      setBusy(null);
    }
  }

  async function recordPreference(kind: 'favorite' | 'reject' | 'more-like-this' | 'less-like-this' | 'publish') {
    if (!profile || !selectedVariant) return;
    setBusy('preference');
    setError(null);
    try {
      await postJson(`${apiBase}/living-sites/${encodeURIComponent(profile.siteId)}/preferences`, {
        skinId: selectedVariant.skinId,
        kind,
        note: kind === 'publish' ? 'Operator selected this direction for the website.' : undefined,
      });
      setAssessment(null);
      setRunbook(null);
      await refreshDashboardAfterMutation(kind === 'reject' ? 'preference recorded' : 'taste memory updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    } finally {
      setBusy(null);
    }
  }

  async function evolveSite() {
    if (!profile) return;
    setBusy('evolve');
    setError(null);
    try {
      const data = await postJson(`${apiBase}/living-sites/${encodeURIComponent(profile.siteId)}/evolve`, {
        prompt: prompt || localPrompt,
        count: variantCount,
      });
      setVariants(data.run.variants || []);
      setSelectedSkinId(data.run.variants?.[0]?.skinId || '');
      setPatchPlan(null);
      setAssessment(null);
      setComposition(null);
      setDeployment(null);
      setRollback(null);
      setRunbook(null);
      await refreshDashboardAfterMutation('evolved from memory');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    } finally {
      setBusy(null);
    }
  }

  async function previewVariant() {
    if (!profile || !selectedVariant) return;
    setBusy('preview');
    setError(null);
    try {
      const data = await postJson(`${apiBase}/living-sites/${encodeURIComponent(profile.siteId)}/preview`, {
        skinId: selectedVariant.skinId,
        compositionId: selectedCompositionId,
      });
      onPreview(data.url, null);
      setStatus('preview mounted');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      onPreview(null, message);
    } finally {
      setBusy(null);
    }
  }

  async function composeCreativeLayer() {
    if (!profile || !selectedVariant) return;
    setBusy('creative');
    setError(null);
    setStatus(creativeStrategy === 'full-liminal' ? 'composing full liminal' : 'composing creative');
    try {
      const data = await postJson(`${apiBase}/living-sites/${encodeURIComponent(profile.siteId)}/creative-composition`, {
        skinId: selectedVariant.skinId,
        prompt: prompt || localPrompt,
        strategy: creativeStrategy,
        domainMode: creativeStrategy === 'full-liminal' ? 'all' : 'auto',
        candidatesPerDomain: 1,
        maxIterations: 2,
        includeAudio,
        includeVideoAssets,
      });
      setComposition(data.composition);
      setDeployment(null);
      setRunbook(null);
      setPatchPlan(null);
      await refreshDashboardAfterMutation(`${data.composition?.strategy || 'creative'} composition ready`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    } finally {
      setBusy(null);
    }
  }

  async function compareAesthetics() {
    if (!profile || variants.length === 0) return;
    setBusy('compare');
    setError(null);
    setStatus('comparing');
    try {
      const data = await postJson(`${apiBase}/living-sites/${encodeURIComponent(profile.siteId)}/aesthetic-assessment`, {
        skinIds: variants.map((variant) => variant.skinId),
        recordWinnerPreference: false,
      });
      setAssessment(data.assessment);
      setRunbook(null);
      if (data.assessment?.winnerSkinId) setSelectedSkinId(data.assessment.winnerSkinId);
      await refreshDashboardAfterMutation('aesthetic loop ranked');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    } finally {
      setBusy(null);
    }
  }

  async function exportVariant() {
    if (!profile || !selectedVariant) return;
    setBusy('export');
    setError(null);
    try {
      const data = await postJson(`${apiBase}/living-sites/${encodeURIComponent(profile.siteId)}/export`, {
        skinId: selectedVariant.skinId,
      });
      setExportPath(data.export?.outputDir || '');
      setStatus('runtime exported');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  async function createDeploymentPackage() {
    if (!profile || !selectedVariant) return;
    setBusy('deploy');
    setError(null);
    try {
      const data = await postJson(`${apiBase}/living-sites/${encodeURIComponent(profile.siteId)}/deployment-package`, {
        skinId: selectedVariant.skinId,
        compositionId: selectedCompositionId,
      });
      setDeployment(data.deployment);
      setRunbook(null);
      await refreshDashboardAfterMutation('deployment package ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    } finally {
      setBusy(null);
    }
  }

  async function createRollbackReceipt() {
    if (!profile || !selectedVariant) return;
    setBusy('rollback');
    setError(null);
    try {
      const data = await postJson(`${apiBase}/living-sites/${encodeURIComponent(profile.siteId)}/rollback`, {
        skinId: selectedVariant.skinId,
        reason: 'Operator requested a reversible return to this saved skin.',
      });
      setRollback(data.rollback);
      setRunbook(null);
      await refreshDashboardAfterMutation('rollback receipt recorded');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    } finally {
      setBusy(null);
    }
  }

  async function createOperatorRunbook() {
    if (!profile || !selectedVariant) return;
    setBusy('runbook');
    setError(null);
    try {
      const data = await postJson(`${apiBase}/living-sites/${encodeURIComponent(profile.siteId)}/operator-runbook`, {
        skinId: selectedVariant.skinId,
      });
      setRunbook(data.runbook);
      await refreshDashboardAfterMutation(`runbook ${data.runbook?.status || 'ready'}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    } finally {
      setBusy(null);
    }
  }

  async function planRepoPatch() {
    if (!profile || !selectedVariant || !repoRoot.trim()) return;
    setBusy('patch');
    setError(null);
    try {
      const data = await postJson(`${apiBase}/living-sites/${encodeURIComponent(profile.siteId)}/plan-patch`, {
        skinId: selectedVariant.skinId,
        compositionId: selectedCompositionId,
        repoRoot: repoRoot.trim(),
      });
      setPatchPlan(data.plan);
      setStatus('patch planned');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="living-site-studio">
      <section className="living-site-panel living-site-panel--profile">
        <div className="living-site-panel__header">
          <div>
            <span>Living Site</span>
            <strong>{profile?.siteId || 'new profile'}</strong>
          </div>
          <small>{status}</small>
        </div>
        {error && <div className="atelier-alert atelier-alert--error">{error}</div>}
        <div className="living-site-form-grid">
          <label>
            <span className="atelier-label">Name</span>
            <input className="atelier-input" value={siteName} onChange={(event) => setSiteName(event.target.value)} />
          </label>
          <label>
            <span className="atelier-label">Source URL</span>
            <input className="atelier-input" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} />
          </label>
          <label>
            <span className="atelier-label">Source path</span>
            <input className="atelier-input" value={sourcePath} onChange={(event) => setSourcePath(event.target.value)} placeholder="/path/to/site" />
          </label>
          <label>
            <span className="atelier-label">Variants</span>
            <input className="atelier-input" type="number" min={1} max={6} value={variantCount} onChange={(event) => setVariantCount(Number(event.target.value))} />
          </label>
        </div>
        <label>
          <span className="atelier-label">Brand brief</span>
          <textarea className="atelier-input living-site-textarea" value={brandBrief} onChange={(event) => setBrandBrief(event.target.value)} />
        </label>
        <label>
          <span className="atelier-label">Evolution prompt</span>
          <textarea className="atelier-input living-site-textarea" value={localPrompt} onChange={(event) => setLocalPrompt(event.target.value)} placeholder={prompt || undefined} />
        </label>
        {ingestion && (
          <div className="living-site-ingestion">
            <div>
              <span>Ingestion Receipt</span>
              <strong>{ingestion.title}</strong>
              <small>{ingestion.source.kind}: {ingestion.source.value}</small>
            </div>
            <p>{ingestion.description || ingestion.recommendedBrandBrief}</p>
            <div className="living-site-ingestion__metrics">
              <span><b>{ingestion.metrics.headingCount}</b> headings</span>
              <span><b>{ingestion.metrics.linkCount + ingestion.metrics.buttonCount}</b> actions</span>
              <span><b>{ingestion.designSignals.density}</b> density</span>
              <span><b>{ingestion.designSignals.motionPreference}</b> motion</span>
            </div>
            <div className="living-site-swatch-row" aria-label="Ingested color signals">
              {ingestion.designSignals.colors.slice(0, 4).map((color) => <i key={color} style={{ background: color }} />)}
            </div>
            {ingestion.screenshotPath && profile && (
              <img
                className="living-site-ingestion__screenshot"
                src={`${apiBase}/living-sites/${encodeURIComponent(profile.siteId)}/ingestions/${encodeURIComponent(ingestion.ingestionId)}/screenshot`}
                alt={`Captured screenshot for ${ingestion.title}`}
              />
            )}
            {ingestion.screenshotPath && <code>{ingestion.screenshotPath}</code>}
          </div>
        )}
        <div className="living-site-actions">
          <button type="button" className="atelier-btn atelier-btn--secondary" onClick={() => void ingestSource()} disabled={Boolean(busy)}>
            {busy === 'ingest' ? 'Ingesting' : 'Ingest'}
          </button>
          <button type="button" className="atelier-btn atelier-btn--primary" onClick={() => void generateVariants()} disabled={Boolean(busy)}>
            {busy === 'generate' ? 'Generating' : 'Generate'}
          </button>
          <button type="button" className="atelier-btn atelier-btn--secondary" onClick={() => void compareAesthetics()} disabled={Boolean(busy) || !profile || variants.length === 0}>
            {busy === 'compare' ? 'Comparing' : 'Compare'}
          </button>
          <button type="button" className="atelier-btn atelier-btn--secondary" onClick={() => void evolveSite()} disabled={Boolean(busy) || !profile}>
            {busy === 'evolve' ? 'Evolving' : 'Evolve'}
          </button>
          <button type="button" className="atelier-btn" onClick={() => void refreshDashboard()} disabled={Boolean(busy)}>
            {busy === 'dashboard' ? 'Refreshing' : 'Project dashboard'}
          </button>
        </div>
      </section>

      {dashboard.length > 0 && (
        <section className="living-site-dashboard" aria-label="Project dashboard">
          <div className="living-site-panel__header">
            <div>
              <span>Project Dashboard</span>
              <strong>{currentProject?.profile.name || `${dashboard.length} saved site${dashboard.length === 1 ? '' : 's'}`}</strong>
            </div>
            <small>{currentProject?.publishedSkinId ? `published: ${currentProject.publishedSkinId}` : 'saved history'}</small>
          </div>
          <div className="living-site-dashboard__stats">
            <span><b>{currentProject?.counts.variants ?? 0}</b> variants</span>
            <span><b>{currentProject?.counts.ingestions ?? 0}</b> ingestions</span>
            <span><b>{currentProject?.counts.aestheticAssessments ?? 0}</b> comparisons</span>
            <span><b>{currentProject?.counts.creativeCompositions ?? 0}</b> creative</span>
            <span><b>{currentProject?.counts.deployments ?? 0}</b> packages</span>
            <span><b>{currentProject?.counts.rollbacks ?? 0}</b> rollbacks</span>
            <span><b>{currentProject?.counts.operatorRunbooks ?? 0}</b> runbooks</span>
          </div>
          <p>{currentProject?.nextOperatorAction || 'Create or open a living-site profile to inspect its operator history.'}</p>
          <div className="living-site-dashboard__projects">
            {dashboard.slice(0, 4).map((project) => (
              <article className={project.profile.siteId === profile?.siteId ? 'living-site-dashboard-card living-site-dashboard-card--current' : 'living-site-dashboard-card'} key={project.profile.siteId}>
                <div>
                  <span>{project.profile.siteId}</span>
                  <strong>{project.profile.name}</strong>
                  <small>{project.latest.variant?.name || project.latest.ingestion?.title || 'no receipts yet'}</small>
                </div>
                <div className="living-site-dashboard-card__receipts">
                  {project.receipts.slice(0, 3).map((receipt) => (
                    <code key={`${receipt.kind}:${receipt.id}`}>{receipt.kind}: {receipt.label}</code>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {assessment && (
        <section className="living-site-assessment" aria-label="Aesthetic intelligence assessment">
          <div className="living-site-panel__header">
            <div>
              <span>Aesthetic Intelligence</span>
              <strong>{assessment.operatorSummary}</strong>
            </div>
            <small>{assessment.preferenceSummary}</small>
          </div>
          <div className="living-site-assessment__rankings">
            {assessment.candidates.slice(0, 4).map((candidate) => (
              <article className={candidate.skinId === assessment.winnerSkinId ? 'living-site-assessment-card living-site-assessment-card--winner' : 'living-site-assessment-card'} key={candidate.skinId}>
                <div>
                  <span>Rank {candidate.rank}</span>
                  <strong>{candidate.name}</strong>
                  <small>{candidate.skinId}</small>
                </div>
                <div className="living-site-assessment-card__score">{candidate.score.toFixed(2)}</div>
                <div className="living-site-assessment-card__breakdown">
                  <span><b>{candidate.breakdown.continuity.toFixed(2)}</b> fit</span>
                  <span><b>{candidate.breakdown.taste.toFixed(2)}</b> taste</span>
                  <span><b>{candidate.breakdown.novelty.toFixed(2)}</b> new</span>
                  <span><b>{candidate.breakdown.operatorConfidence.toFixed(2)}</b> confidence</span>
                </div>
                <p>{candidate.rationale[0]}</p>
              </article>
            ))}
          </div>
          <pre className="atelier-code living-site-output">{assessment.nextEvolutionPrompt}</pre>
        </section>
      )}

      <section className="living-site-variants" aria-label="Living site variants">
        {variants.map((variant) => (
          <article
            className={variant.skinId === selectedVariant?.skinId ? 'living-site-variant living-site-variant--selected' : 'living-site-variant'}
            key={variant.skinId}
          >
            <button type="button" className="living-site-variant__select" onClick={() => setSelectedSkinId(variant.skinId)}>
              <span>{variant.provenance.source}</span>
              <strong>{variant.name}</strong>
              <small>{variant.skinId}</small>
            </button>
            <div className="living-site-swatch-row">
              <i style={{ background: variant.tokens.palette.background }} />
              <i style={{ background: variant.tokens.palette.accent }} />
              <i style={{ background: variant.tokens.palette.accent2 }} />
              <i style={{ background: variant.tokens.palette.text }} />
            </div>
            <div className="living-site-variant__metrics">
              <span>{variant.quality.score.toFixed(2)}</span>
              <span>{variant.tokens.motion.rhythm}</span>
              <span>{variant.tokens.shape.density}</span>
            </div>
          </article>
        ))}
        {variants.length === 0 && (
          <div className="living-site-empty">
            <span>Direction</span>
            <strong>No variants yet</strong>
            <small>Create the first profile and generation run.</small>
          </div>
        )}
      </section>

      <section className="living-site-panel">
        <div className="living-site-panel__header">
          <div>
            <span>Selected Skin</span>
            <strong>{selectedVariant?.skinId || 'none'}</strong>
          </div>
          <small>{selectedVariant ? `${selectedVariant.quality.score.toFixed(2)} quality` : 'waiting'}</small>
        </div>
        <div className="living-site-creative-controls">
          <label>
            <span className="atelier-label">Creative mode</span>
            <select className="atelier-input" value={creativeStrategy} onChange={(event) => setCreativeStrategy(event.target.value as 'balanced' | 'full-liminal')}>
              <option value="full-liminal">Full Liminal</option>
              <option value="balanced">Balanced</option>
            </select>
          </label>
          <label className="living-site-toggle">
            <input type="checkbox" checked={includeAudio} onChange={(event) => setIncludeAudio(event.target.checked)} />
            <span>Audio gate</span>
          </label>
          <label className="living-site-toggle">
            <input type="checkbox" checked={includeVideoAssets} onChange={(event) => setIncludeVideoAssets(event.target.checked)} />
            <span>Video assets</span>
          </label>
          <button type="button" className="atelier-btn atelier-btn--primary" onClick={() => void composeCreativeLayer()} disabled={Boolean(busy) || !selectedVariant}>
            {busy === 'creative' ? 'Composing' : 'Compose creative'}
          </button>
        </div>
        {composition && (
          <div className="living-site-creative-receipt">
            <div className="living-site-creative-receipt__summary">
              <span>{composition.strategy}</span>
              <strong>{composition.compositionId}</strong>
              <small>{composition.capabilityMatrix.summary.used}/{composition.capabilityMatrix.summary.total} used - {composition.rejectedCandidates.length} rejected</small>
            </div>
            <div className="living-site-creative-receipt__domains">
              {composition.capabilityMatrix.domains.map((capability) => (
                <code className={`living-site-capability living-site-capability--${capability.status}`} key={capability.domain}>
                  {capability.domain}: {capability.status}
                </code>
              ))}
            </div>
            {composition.rejectedCandidates.length > 0 && (
              <div className="living-site-creative-receipt__failures">
                {composition.rejectedCandidates.slice(0, 5).map((candidate) => (
                  <small key={candidate.candidateId}>{candidate.domain} {candidate.stage}: {candidate.reason}</small>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="living-site-actions">
          <button type="button" className="atelier-btn atelier-btn--primary" onClick={() => void previewVariant()} disabled={Boolean(busy) || !selectedVariant}>
            {busy === 'preview' ? 'Mounting' : 'Preview'}
          </button>
          <button type="button" className="atelier-btn atelier-btn--secondary" onClick={() => void recordPreference('favorite')} disabled={Boolean(busy) || !selectedVariant}>
            Favorite
          </button>
          <button type="button" className="atelier-btn atelier-btn--secondary" onClick={() => void recordPreference('reject')} disabled={Boolean(busy) || !selectedVariant}>
            Reject
          </button>
          <button type="button" className="atelier-btn atelier-btn--secondary" onClick={() => void recordPreference('publish')} disabled={Boolean(busy) || !selectedVariant}>
            Publish
          </button>
          <button type="button" className="atelier-btn" onClick={() => void exportVariant()} disabled={Boolean(busy) || !selectedVariant}>
            Export
          </button>
          <button type="button" className="atelier-btn" onClick={() => void createDeploymentPackage()} disabled={Boolean(busy) || !selectedVariant}>
            {busy === 'deploy' ? 'Packaging' : 'Deploy package'}
          </button>
          <button type="button" className="atelier-btn" onClick={() => void createRollbackReceipt()} disabled={Boolean(busy) || !selectedVariant}>
            {busy === 'rollback' ? 'Recording' : 'Rollback receipt'}
          </button>
          <button type="button" className="atelier-btn" onClick={() => void createOperatorRunbook()} disabled={Boolean(busy) || !selectedVariant}>
            {busy === 'runbook' ? 'Checking' : 'Operator runbook'}
          </button>
        </div>
        {exportPath && <pre className="atelier-code living-site-output">{exportPath}</pre>}
        {deployment && (
          <div className="living-site-deployment">
            <div>
              <span>Runtime Deployment</span>
              <strong>{deployment.deploymentId}</strong>
              <small>{deployment.assetBaseUrl}</small>
            </div>
            <pre className="atelier-code living-site-output">{deployment.installSnippets.combined}</pre>
            <a className="living-site-deployment__link" href={deployment.manifest.assets.installHtml} target="_blank" rel="noreferrer">
              Open install preview
            </a>
            <div className="living-site-deployment__checks">
              {deployment.verificationChecklist.slice(0, 4).map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        )}
        {rollback && (
          <div className="living-site-rollback">
            <div>
              <span>Rollback Receipt</span>
              <strong>{rollback.rollbackId}</strong>
              <small>{rollback.previousPublishedSkinId ? `from ${rollback.previousPublishedSkinId}` : 'first recorded rollback'}</small>
            </div>
            <p>{rollback.selectedSkin.name} is now the published recovery target.</p>
            <div className="living-site-rollback__steps">
              {rollback.operatorSteps.slice(0, 4).map((step) => <span key={step}>{step}</span>)}
            </div>
            <pre className="atelier-code living-site-output">{rollback.verificationChecklist.join('\n')}</pre>
          </div>
        )}
        {runbook && (
          <div className={`living-site-runbook living-site-runbook--${runbook.status}`}>
            <div>
              <span>Operator Runbook</span>
              <strong>{runbook.summary}</strong>
              <small>{runbook.runbookId}</small>
            </div>
            <div className="living-site-runbook__checks">
              {runbook.checks.map((check) => (
                <span className={`living-site-runbook__check living-site-runbook__check--${check.status}`} key={check.id}>
                  <b>{check.label}</b>
                  <small>{check.detail}</small>
                  {check.action && <em>{check.action}</em>}
                </span>
              ))}
            </div>
            <div className="living-site-runbook__paths">
              {runbook.recoveryPaths.map((item) => <code key={item}>{item}</code>)}
            </div>
            <pre className="atelier-code living-site-output">{runbook.operatorJourney.join('\n')}</pre>
          </div>
        )}
        <div className="living-site-patch-row">
          <input className="atelier-input" value={repoRoot} onChange={(event) => setRepoRoot(event.target.value)} placeholder="/path/to/website/repo" />
          <button type="button" className="atelier-btn atelier-btn--secondary" onClick={() => void planRepoPatch()} disabled={Boolean(busy) || !selectedVariant || !repoRoot.trim()}>
            {busy === 'patch' ? 'Planning' : 'Plan patch'}
          </button>
        </div>
        {patchPlan && (
          <div className="living-site-plan">
            <div>
              <span>{patchPlan.framework}</span>
              <strong>{patchPlan.patches.length} file changes</strong>
              <small>{patchPlan.packageManager}</small>
            </div>
            {patchPlan.patches.map((patch) => (
              <code key={`${patch.action}:${patch.path}`}>{patch.action} {patch.path}</code>
            ))}
            {patchPlan.warnings.map((warning) => <small key={warning}>{warning}</small>)}
          </div>
        )}
      </section>
      <section className="living-site-panel" aria-label="Shitty Prompts curation">
        <div className="living-site-panel__header">
          <div>
            <span>Shitty Prompts</span>
            <strong>generate + curate</strong>
          </div>
        </div>
        <ShittyPromptsTab api={{
          run: (req) => postJson(`${apiBase}/shitty-prompts/run`, req),
          listByStatus: (status) => getJson(`${apiBase}/shitty-prompts/pairs?status=${status}`).then((d: any) => d.pairs ?? []),
          accept: (id) => postJson(`${apiBase}/shitty-prompts/pairs/${id}/accept`, {}),
          reject: (id) => postJson(`${apiBase}/shitty-prompts/pairs/${id}/reject`, {}),
          edit: (id, patch) => postJson(`${apiBase}/shitty-prompts/pairs/${id}/edit`, patch),
        }} />
      </section>
    </div>
  );
}

async function postJson(url: string, body: Record<string, unknown>): Promise<any> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || response.statusText);
  return data;
}

async function getJson(url: string): Promise<any> {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || response.statusText);
  return data;
}
