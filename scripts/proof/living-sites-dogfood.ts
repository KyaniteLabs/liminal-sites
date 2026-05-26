import fs from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { chromium, type Page } from 'playwright';
import { WebsiteEvolutionEngine } from '../../src/sites/WebsiteEvolutionEngine.js';
import {
  FULL_LIMINAL_PROOF_DOMAINS,
  createFullLiminalProofGeneratorBridge,
  createFullLiminalProofRenderAndScore,
} from './living-sites-full-liminal-fixtures.js';

interface DogfoodAssertion {
  label: string;
  passed: boolean;
  detail: string;
}

const REQUIRED_VISUAL_MUTATION_CATEGORIES = ['body', 'hero', 'button', 'link', 'card', 'layout'] as const;

type ComponentStyleSamples = Record<string, Record<string, string> | null>;

interface DogfoodReceipt {
  ok: boolean;
  generatedAt: string;
  sourceUrl: string;
  siteId: string;
  selectedSkinId: string;
  selectedCompositionId: string;
  selectedMutation: {
    source: 'assessment-winner-evolved' | 'ranked-evolved-fallback' | 'non-evolved-fallback';
    assessmentWinnerWasEvolved: boolean;
    requiredSource: 'evolution';
  };
  assertions: DogfoodAssertion[];
  journey: {
    profile: { siteId: string; name: string };
    ingestion: { ingestionId: string; title: string; screenshotPath?: string; density: string; motionPreference: string };
    firstRun: { runId: string; variantCount: number; skinIds: string[] };
    evolvedRun: { runId: string; variantCount: number; skinIds: string[] };
    assessment: { assessmentId: string; winnerSkinId?: string; candidateCount: number; operatorSummary: string };
    creativeComposition: {
      compositionId: string;
      strategy: string;
      domainMode: string;
      domains: string[];
      layerCount: number;
      qualityScore: number;
      capabilitySummary: {
        total: number;
        used: number;
        availableNotSelected: number;
        blocked: number;
        failed: number;
      };
      rejectedCandidateCount: number;
    };
    deployment: { deploymentId: string; cssPath: string; jsPath: string; installHtmlPath: string };
    rollback: { rollbackId: string; previousPublishedSkinId?: string };
    runbook: { runbookId: string; status: string; checkCount: number };
    export: { cssPath: string; jsPath: string; manifestPath: string };
    creativeExport: { cssPath: string; jsPath: string; manifestPath: string };
  };
  visualProof: {
    originalScreenshotPath: string;
    mutatedScreenshotPath: string;
    originalScreenshotBytes: number;
    mutatedScreenshotBytes: number;
    byteDelta: number;
    dom: {
      active: boolean;
      skinId: string | null;
      atmosphere: boolean;
      backgroundVar: string;
      accentVar: string;
      headingScale: string;
      creativeActive: boolean;
      compositionId: string | null;
      creativeDomains: string;
      creativeError: string;
    };
    runtimeReceipt: unknown;
    shader: {
      canvasPresent: boolean;
      compileOk: boolean;
      frameCount: number;
      width: number;
      height: number;
      nonZeroPixels: number;
    };
    componentDelta: {
      requiredCategories: string[];
      changedCategories: string[];
      changesByCategory: Record<string, string[]>;
      before: ComponentStyleSamples;
      after: ComponentStyleSamples;
    };
  };
  artifacts: {
    outDir: string;
    sourceDir: string;
    stateDir: string;
    receiptPath: string;
    capabilityMatrixPath: string;
    compositionManifestPath: string;
    browserRuntimeReceiptPath: string;
    renderScoreSummaryPath: string;
    rejectedCandidatesPath: string;
  };
}

async function main() {
  const root = process.cwd();
  const outDir = path.join(root, '.omx', 'proof', 'living-sites-dogfood');
  const sourceDir = path.join(outDir, 'source-site');
  const stateDir = path.join(outDir, 'state');
  const exportDir = path.join(outDir, 'exported-skin');
  const creativeExportDir = path.join(outDir, 'exported-creative');
  const receiptPath = path.join(outDir, 'receipt.json');
  const capabilityMatrixPath = path.join(outDir, 'capability-matrix.json');
  const compositionManifestPath = path.join(outDir, 'composition-manifest.json');
  const browserRuntimeReceiptPath = path.join(outDir, 'browser-runtime-receipt.json');
  const renderScoreSummaryPath = path.join(outDir, 'render-score-summary.json');
  const rejectedCandidatesPath = path.join(outDir, 'rejected-candidates.json');
  const originalScreenshotPath = path.join(outDir, 'source-site.png');
  const mutatedScreenshotPath = path.join(outDir, 'mutated-site.png');

  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(sourceDir, { recursive: true });
  await writeSimpleWebsite(sourceDir);

  const port = await freePort();
  const server = createStaticServer(sourceDir);
  await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', () => resolve()));
  const sourceUrl = `http://127.0.0.1:${port}/`;

  try {
    const engine = new WebsiteEvolutionEngine({
      rootDir: stateDir,
      creativeGeneratorBridge: createFullLiminalProofGeneratorBridge(),
      creativeRenderAndScore: createFullLiminalProofRenderAndScore(),
    });
    const profile = await engine.createProfile({
      name: 'Dogfood Living Website',
      sourceUrl,
      brandBrief: 'A practical proof website for Liminal Sites: calm, visible, operator-trustworthy, and able to mutate without losing the original signal.',
      constraints: [
        'Keep the site inspectable and reversible.',
        'Prefer runtime skins over direct source mutation for this proof.',
      ],
      allowedModes: ['runtime-skin', 'repo-native-pr'],
      stackHints: ['static-html'],
    });

    const ingestion = await engine.ingestSource(profile.siteId, {
      sourceUrl,
      captureVisual: true,
      viewport: { width: 1360, height: 860 },
    });
    const firstRun = await engine.generateVariants(profile.siteId, {
      prompt: 'Make this tiny website feel alive, more precise, and more visibly self-improving without making it flashy.',
      count: 3,
      mode: 'runtime-skin',
    });
    const favorite = firstRun.variants[1] ?? firstRun.variants[0];
    await engine.recordPreference({
      siteId: profile.siteId,
      skinId: favorite.skinId,
      kind: 'favorite',
      note: 'Keep the grounded source structure, but make the surface feel like it is learning between operator runs.',
    });
    const evolvedRun = await engine.evolve(profile.siteId, {
      prompt: 'Evolve from the favorite direction and make the learning atmosphere more obvious while keeping the site usable.',
      count: 2,
    });
    const assessment = await engine.compareAesthetics(profile.siteId, {
      skinIds: [...firstRun.variants, ...evolvedRun.variants].map((variant) => variant.skinId),
      recordWinnerPreference: true,
    });
    const evolvedSkinIds = new Set(evolvedRun.variants.map((variant) => variant.skinId));
    const assessmentWinnerWasEvolved = Boolean(assessment.winnerSkinId && evolvedSkinIds.has(assessment.winnerSkinId));
    const rankedEvolvedCandidate = assessment.candidates.find((candidate) => evolvedSkinIds.has(candidate.skinId));
    const selectedSkinId = assessmentWinnerWasEvolved
      ? assessment.winnerSkinId!
      : rankedEvolvedCandidate?.skinId ?? favorite.skinId;
    const selectedMutationSource = assessmentWinnerWasEvolved
      ? 'assessment-winner-evolved'
      : rankedEvolvedCandidate ? 'ranked-evolved-fallback' : 'non-evolved-fallback';
    const composition = await engine.composeCreativeSite(profile.siteId, {
      skinId: selectedSkinId,
      prompt: 'Use every site-compatible Liminal creative domain to evolve this living website with visible cross-domain receipts.',
      strategy: 'full-liminal',
      domainMode: 'all',
      candidatesPerDomain: 1,
      maxIterations: 2,
      includeAudio: true,
      includeVideoAssets: true,
    });
    const deployment = await engine.createDeploymentPackage(profile.siteId, {
      skinId: selectedSkinId,
      compositionId: composition.compositionId,
      publicBaseUrl: sourceUrl.replace(/\/$/, ''),
    });
    const rollback = await engine.createRollbackReceipt(profile.siteId, {
      skinId: selectedSkinId,
      reason: 'Dogfood proof selected this mutation as the reversible recovery target.',
    });
    const runbook = await engine.createOperatorRunbook(profile.siteId, { skinId: selectedSkinId });
    const exported = await engine.exportRuntimeSkin(profile.siteId, selectedSkinId, exportDir);
    const creativeExport = await engine.exportCreativeComposition(profile.siteId, composition.compositionId, creativeExportDir);
    const projects = await engine.listProjectSummaries();
    const visualProof = await renderMutationProof({
      sourceUrl,
      cssPath: deployment.files.cssPath,
      jsPath: deployment.files.jsPath,
      creativeCssPath: deployment.files.creativeCssPath!,
      creativeJsPath: deployment.files.creativeJsPath!,
      originalScreenshotPath,
      mutatedScreenshotPath,
    });

    const deploymentCss = await fs.readFile(deployment.files.cssPath, 'utf8');
    const deploymentJs = await fs.readFile(deployment.files.jsPath, 'utf8');
    const deploymentCreativeCss = await fs.readFile(deployment.files.creativeCssPath!, 'utf8');
    const deploymentCreativeJs = await fs.readFile(deployment.files.creativeJsPath!, 'utf8');
    const exportedManifest = await fs.readFile(exported.manifestPath, 'utf8');
    const creativeManifest = await fs.readFile(creativeExport.manifestPath, 'utf8');
    const selectedVariant = [...firstRun.variants, ...evolvedRun.variants].find((variant) => variant.skinId === selectedSkinId);
    const strictVisualCategoriesChanged = REQUIRED_VISUAL_MUTATION_CATEGORIES.every((category) => visualProof.componentDelta.changedCategories.includes(category));
    const renderScoreSummary = composition.layers.map((layer) => ({
      layerId: layer.layerId,
      domain: layer.domain,
      render: layer.render,
      scoring: layer.scoring,
      runtimeStatus: layer.runtimeStatus,
    }));
    await Promise.all([
      fs.writeFile(capabilityMatrixPath, `${JSON.stringify(composition.capabilityMatrix, null, 2)}\n`, 'utf8'),
      fs.writeFile(compositionManifestPath, `${JSON.stringify(composition.runtime.manifest, null, 2)}\n`, 'utf8'),
      fs.writeFile(browserRuntimeReceiptPath, `${JSON.stringify(visualProof.runtimeReceipt, null, 2)}\n`, 'utf8'),
      fs.writeFile(renderScoreSummaryPath, `${JSON.stringify(renderScoreSummary, null, 2)}\n`, 'utf8'),
      fs.writeFile(rejectedCandidatesPath, `${JSON.stringify(composition.rejectedCandidates, null, 2)}\n`, 'utf8'),
    ]);
    const assertions: DogfoodAssertion[] = [
      check('simple website was created and served', (await fileSize(path.join(sourceDir, 'index.html'))) > 500, sourceUrl),
      check('source ingestion captured a real visual receipt', Boolean(ingestion.screenshotPath) && (await fileSize(ingestion.screenshotPath)) > 10_000, ingestion.screenshotPath ?? 'missing screenshot'),
      check('initial generation produced multiple runtime skins', firstRun.variants.length === 3 && firstRun.variants.every((variant) => variant.provenance.source === 'deterministic-mvp'), firstRun.variants.map((variant) => variant.skinId).join(', ')),
      check('evolution used preference memory', evolvedRun.variants.length === 2 && evolvedRun.variants.every((variant) => variant.provenance.source === 'evolution' && variant.quality.notes.join(' ').includes('preference memory')), evolvedRun.variants.map((variant) => `${variant.skinId}:${variant.quality.score.toFixed(2)}`).join(', ')),
      check('selected mutation came from the evolved run', Boolean(selectedVariant) && selectedVariant?.provenance.source === 'evolution' && evolvedSkinIds.has(selectedSkinId), `${selectedMutationSource}, selected ${selectedSkinId}`),
      check('aesthetic intelligence ranked the combined mutation set', assessment.candidates.length >= 5 && Boolean(assessment.winnerSkinId), `${assessment.candidates.length} candidates, winner ${assessment.winnerSkinId ?? 'none'}`),
      check('creative composition runs in full-liminal all-domain mode', composition.strategy === 'full-liminal' && composition.domainMode === 'all', `${composition.compositionId}: ${composition.strategy}/${composition.domainMode}`),
      check('creative composition uses every site-compatible Liminal domain', FULL_LIMINAL_PROOF_DOMAINS.every((domain) => composition.domains.includes(domain)) && composition.layers.length === FULL_LIMINAL_PROOF_DOMAINS.length && composition.layers.every((layer) => layer.validation.valid), `${composition.compositionId}: ${composition.domains.join(', ')}`),
      check('capability matrix reports full usage without silent fallback', composition.capabilityMatrix.fullRunSatisfied && composition.capabilityMatrix.summary.used === FULL_LIMINAL_PROOF_DOMAINS.length && composition.capabilityMatrix.summary.failed === 0 && composition.capabilityMatrix.summary.blocked === 0, JSON.stringify(composition.capabilityMatrix.summary)),
      check('audio domains are packaged behind user gesture gate', composition.layers.filter((layer) => ['tone', 'strudel'].includes(layer.domain)).every((layer) => layer.runtimeStatus?.status === 'audio-gated'), composition.layers.filter((layer) => ['tone', 'strudel'].includes(layer.domain)).map((layer) => `${layer.domain}:${layer.runtimeStatus?.status}`).join(', ')),
      check('proof artifacts preserve capability and rejection receipts', (await fileSize(capabilityMatrixPath)) > 500 && (await fileSize(compositionManifestPath)) > 500 && (await fileSize(browserRuntimeReceiptPath)) > 500 && (await fileSize(renderScoreSummaryPath)) > 500 && (await fileSize(rejectedCandidatesPath)) >= 2, outDir),
      check('creative deployment assets are installable', deployment.installSnippets.combined.includes('data-liminal-sites-creative') && deploymentCreativeCss.includes('liminal-sites-creative-stage') && deploymentCreativeJs.includes('__liminalSitesCreative'), deployment.deploymentId),
      check('deployment package is installable', deployment.installSnippets.combined.includes('data-liminal-sites') && deploymentCss.includes('--liminal-sites-bg') && deploymentJs.includes('liminal-sites-active'), deployment.deploymentId),
      check('rollback receipt and runbook are ready', rollback.skinId === selectedSkinId && runbook.status === 'ready' && runbook.checks.length >= 8, `${rollback.rollbackId}, ${runbook.runbookId}, ${runbook.status}`),
      check('runtime export matches selected skin', exportedManifest.includes(selectedSkinId) && (await fileSize(exported.cssPath)) > 500 && (await fileSize(exported.jsPath)) > 200, exported.manifestPath),
      check('creative export matches selected composition', creativeManifest.includes(composition.compositionId) && (await fileSize(creativeExport.cssPath)) > 500 && (await fileSize(creativeExport.jsPath)) > 1000, creativeExport.manifestPath),
      check('project dashboard history contains every operator receipt', projects[0]?.counts.ingestions === 1 && projects[0]?.counts.creativeCompositions === 1 && projects[0]?.counts.deployments === 1 && projects[0]?.counts.rollbacks === 1 && projects[0]?.counts.operatorRunbooks === 1, JSON.stringify(projects[0]?.counts ?? {})),
      check('visual dogfood mutation is active in browser', visualProof.dom.active && visualProof.dom.atmosphere && visualProof.dom.skinId === selectedSkinId && visualProof.byteDelta > 50_000, `${visualProof.byteDelta} screenshot bytes changed`),
      check('creative runtime is active in browser without silent errors', visualProof.dom.creativeActive && visualProof.dom.compositionId === composition.compositionId && visualProof.dom.creativeError === '' && visualProof.dom.creativeDomains.split(',').filter(Boolean).length === FULL_LIMINAL_PROOF_DOMAINS.length, `${visualProof.dom.compositionId ?? 'missing'} domains=${visualProof.dom.creativeDomains}`),
      check('creative shader rendered animated nonblank pixels', visualProof.shader.canvasPresent && visualProof.shader.compileOk && visualProof.shader.frameCount >= 2 && visualProof.shader.nonZeroPixels > 64, `${visualProof.shader.nonZeroPixels} nonzero pixels, ${visualProof.shader.frameCount} frames`),
      check('visual dogfood mutation changes body, hero, actions, cards, and layout', strictVisualCategoriesChanged, `changed: ${visualProof.componentDelta.changedCategories.join(', ') || 'none'}`),
      check('selected mutation carries living-site runtime tokens', Boolean(selectedVariant) && selectedVariant.runtime.css.includes('--liminal-sites-accent') && selectedVariant.runtime.js.includes(selectedSkinId), selectedSkinId),
    ];
    const ok = assertions.every((assertion) => assertion.passed);
    const receipt: DogfoodReceipt = {
      ok,
      generatedAt: new Date().toISOString(),
      sourceUrl,
      siteId: profile.siteId,
      selectedSkinId,
      selectedCompositionId: composition.compositionId,
      selectedMutation: {
        source: selectedMutationSource,
        assessmentWinnerWasEvolved,
        requiredSource: 'evolution',
      },
      assertions,
      journey: {
        profile: { siteId: profile.siteId, name: profile.name },
        ingestion: {
          ingestionId: ingestion.ingestionId,
          title: ingestion.title,
          screenshotPath: ingestion.screenshotPath,
          density: ingestion.designSignals.density,
          motionPreference: ingestion.designSignals.motionPreference,
        },
        firstRun: {
          runId: firstRun.runId,
          variantCount: firstRun.variants.length,
          skinIds: firstRun.variants.map((variant) => variant.skinId),
        },
        evolvedRun: {
          runId: evolvedRun.runId,
          variantCount: evolvedRun.variants.length,
          skinIds: evolvedRun.variants.map((variant) => variant.skinId),
        },
        assessment: {
          assessmentId: assessment.assessmentId,
          winnerSkinId: assessment.winnerSkinId,
          candidateCount: assessment.candidates.length,
          operatorSummary: assessment.operatorSummary,
        },
        creativeComposition: {
          compositionId: composition.compositionId,
          strategy: composition.strategy,
          domainMode: composition.domainMode,
          domains: composition.domains,
          layerCount: composition.layers.length,
          qualityScore: composition.quality.score,
          capabilitySummary: composition.capabilityMatrix.summary,
          rejectedCandidateCount: composition.rejectedCandidates.length,
        },
        deployment: {
          deploymentId: deployment.deploymentId,
          cssPath: deployment.files.cssPath,
          jsPath: deployment.files.jsPath,
          installHtmlPath: deployment.files.installHtmlPath,
        },
        rollback: {
          rollbackId: rollback.rollbackId,
          previousPublishedSkinId: rollback.previousPublishedSkinId,
        },
        runbook: {
          runbookId: runbook.runbookId,
          status: runbook.status,
          checkCount: runbook.checks.length,
        },
        export: {
          cssPath: exported.cssPath,
          jsPath: exported.jsPath,
          manifestPath: exported.manifestPath,
        },
        creativeExport: {
          cssPath: creativeExport.cssPath,
          jsPath: creativeExport.jsPath,
          manifestPath: creativeExport.manifestPath,
        },
      },
      visualProof,
      artifacts: {
        outDir,
        sourceDir,
        stateDir,
        receiptPath,
        capabilityMatrixPath,
        compositionManifestPath,
        browserRuntimeReceiptPath,
        renderScoreSummaryPath,
        rejectedCandidatesPath,
      },
    };
    await fs.writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);

    if (!ok) {
      throw new Error(`Living Sites dogfood failed: ${JSON.stringify(assertions.filter((assertion) => !assertion.passed), null, 2)}`);
    }

    console.log(JSON.stringify({
      ok,
      siteId: profile.siteId,
      sourceUrl,
      selectedSkinId,
      selectedCompositionId: composition.compositionId,
      assertions: assertions.length,
      byteDelta: visualProof.byteDelta,
      changedVisualCategories: visualProof.componentDelta.changedCategories,
      receiptPath,
      originalScreenshotPath,
      mutatedScreenshotPath,
    }, null, 2));
  } finally {
    server.closeAllConnections?.();
    server.closeIdleConnections?.();
    await withTimeout(new Promise<void>((resolve) => server.close(() => resolve())), 3_000);
  }
}

async function writeSimpleWebsite(sourceDir: string): Promise<void> {
  await fs.writeFile(path.join(sourceDir, 'index.html'), `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dogfood Living Website</title>
    <meta name="description" content="A simple website created so Liminal can ingest it, mutate it, and prove the operator path end to end.">
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <main>
      <section class="intro">
        <p class="eyebrow">Liminal Sites Dogfood</p>
        <h1 data-liminal-heading="hero">A tiny website that should learn in public.</h1>
        <p>The source starts intentionally plain: one hero, three proof cells, and enough real design signal for the living-site engine to capture.</p>
        <div class="actions">
          <a href="#proof">View proof</a>
          <button type="button">Run mutation</button>
        </div>
      </section>
      <section id="proof" class="grid" aria-label="Proof cells">
        <article>
          <h2>Ingest</h2>
          <p>Capture the current page before generating any direction.</p>
        </article>
        <article>
          <h2>Mutate</h2>
          <p>Generate runtime skins, choose a favorite, and evolve from memory.</p>
        </article>
        <article>
          <h2>Recover</h2>
          <p>Package the selected skin with rollback and runbook receipts.</p>
        </article>
      </section>
    </main>
  </body>
</html>
`, 'utf8');
  await fs.writeFile(path.join(sourceDir, 'styles.css'), `:root {
  color-scheme: dark;
  --bg: #0b1115;
  --panel: #111d23;
  --text: #eef5ef;
  --muted: #b4c3be;
  --line: rgba(238, 245, 239, 0.14);
  --accent: #72d399;
  --accent-two: #63cdda;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  color: var(--text);
  background: var(--bg);
  font: 16px/1.55 Inter, ui-sans-serif, system-ui, sans-serif;
}

main {
  width: min(1120px, calc(100vw - 40px));
  min-height: 100vh;
  margin: 0 auto;
  display: grid;
  align-content: center;
  gap: 26px;
  padding: 56px 0;
}

.intro {
  max-width: 760px;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--accent-two);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(44px, 6vw, 84px);
  line-height: 0.96;
}

h2 {
  margin: 0 0 10px;
  font-size: 22px;
}

p {
  max-width: 640px;
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 19px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

a,
button {
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0 18px;
  font: inherit;
  font-weight: 800;
}

a {
  display: inline-grid;
  place-items: center;
  color: var(--text);
  text-decoration: none;
  background: rgba(255, 255, 255, 0.05);
}

button {
  color: #06100a;
  background: var(--accent);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

article {
  min-height: 154px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
}

article p {
  margin-top: 0;
  font-size: 16px;
}

@media (max-width: 760px) {
  .grid { grid-template-columns: 1fr; }
  main { padding: 36px 0; }
}
`, 'utf8');
}

async function renderMutationProof(input: {
  sourceUrl: string;
  cssPath: string;
  jsPath: string;
  creativeCssPath: string;
  creativeJsPath: string;
  originalScreenshotPath: string;
  mutatedScreenshotPath: string;
}): Promise<DogfoodReceipt['visualProof']> {
  const [css, js, creativeCss, creativeJs] = await Promise.all([
    fs.readFile(input.cssPath, 'utf8'),
    fs.readFile(input.jsPath, 'utf8'),
    fs.readFile(input.creativeCssPath, 'utf8'),
    fs.readFile(input.creativeJsPath, 'utf8'),
  ]);
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1360, height: 860 } });
    await page.goto(input.sourceUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 2_500 }).catch(() => undefined);
    const before = await captureComponentStyles(page);
    const original = await page.screenshot({ path: input.originalScreenshotPath, fullPage: true });
    await page.addStyleTag({ content: css });
    await page.addStyleTag({ content: creativeCss });
    await page.addScriptTag({ content: js });
    await page.addScriptTag({ content: creativeJs });
    await page.waitForFunction(() => document.body.classList.contains('liminal-sites-active'), null, { timeout: 3_000 });
    await page.waitForFunction(() => {
      const receipt = (window as any).__liminalSitesCreative;
      return Boolean(receipt?.compileOk && receipt.frameCount >= 2);
    }, null, { timeout: 3_000 });
    await page.waitForTimeout(180);
    const after = await captureComponentStyles(page);
    const dom = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      const receipt = (window as any).__liminalSitesCreative;
      return {
        active: document.body.classList.contains('liminal-sites-active'),
        skinId: document.documentElement.dataset.liminalSitesSkin ?? null,
        atmosphere: Boolean(document.querySelector('#liminal-sites-atmosphere span:nth-child(3)')),
        backgroundVar: style.getPropertyValue('--liminal-sites-bg').trim(),
        accentVar: style.getPropertyValue('--liminal-sites-accent').trim(),
        headingScale: style.getPropertyValue('--liminal-sites-heading-scale').trim(),
        creativeActive: document.body.classList.contains('liminal-sites-creative-active'),
        compositionId: document.documentElement.dataset.liminalSitesComposition ?? null,
        creativeDomains: document.documentElement.dataset.liminalSitesDomains ?? '',
        creativeError: document.documentElement.dataset.liminalCreativeError ?? (receipt?.errors?.join('; ') ?? ''),
      };
    });
    const runtimeReceipt = await page.evaluate(() => (window as any).__liminalSitesCreative ?? null);
    const shader = await captureShaderProof(page);
    const mutated = await page.screenshot({ path: input.mutatedScreenshotPath, fullPage: true });
    return {
      originalScreenshotPath: input.originalScreenshotPath,
      mutatedScreenshotPath: input.mutatedScreenshotPath,
      originalScreenshotBytes: original.length,
      mutatedScreenshotBytes: mutated.length,
      byteDelta: byteDelta(original, mutated),
      dom,
      runtimeReceipt,
      shader,
      componentDelta: buildComponentDelta(before, after),
    };
  } finally {
    await browser.close();
  }
}

async function captureShaderProof(page: Page): Promise<DogfoodReceipt['visualProof']['shader']> {
  return page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('#liminal-sites-creative-stage canvas[data-liminal-domain="shader"]');
    const receipt = (window as any).__liminalSitesCreative;
    if (!canvas) {
      return {
        canvasPresent: false,
        compileOk: Boolean(receipt?.compileOk),
        frameCount: Number(receipt?.frameCount ?? 0),
        width: 0,
        height: 0,
        nonZeroPixels: 0,
      };
    }
    const gl = canvas.getContext('webgl');
    let nonZeroPixels = 0;
    if (gl && canvas.width > 0 && canvas.height > 0) {
      const sampleWidth = Math.min(64, canvas.width);
      const sampleHeight = Math.min(64, canvas.height);
      const pixels = new Uint8Array(sampleWidth * sampleHeight * 4);
      gl.readPixels(0, 0, sampleWidth, sampleHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index] !== 0 || pixels[index + 1] !== 0 || pixels[index + 2] !== 0 || pixels[index + 3] !== 0) {
          nonZeroPixels += 1;
        }
      }
    }
    return {
      canvasPresent: true,
      compileOk: Boolean(receipt?.compileOk),
      frameCount: Number(receipt?.frameCount ?? 0),
      width: canvas.width,
      height: canvas.height,
      nonZeroPixels,
    };
  });
}

async function captureComponentStyles(page: Page): Promise<ComponentStyleSamples> {
  return page.evaluate(() => {
    const commonActionProperties = [
      'background-color',
      'background-image',
      'border-color',
      'border-radius',
      'box-shadow',
      'color',
      'padding-left',
      'padding-top',
      'transform',
    ];
    const targets: Record<string, { selector: string; properties: string[] }> = {
      body: {
        selector: 'body',
        properties: ['background-color', 'background-image', 'color', 'font-size'],
      },
      hero: {
        selector: '[data-liminal-heading="hero"]',
        properties: ['color', 'font-family', 'font-size', 'line-height', 'text-shadow', 'transform'],
      },
      button: {
        selector: 'button',
        properties: commonActionProperties,
      },
      link: {
        selector: 'a',
        properties: commonActionProperties,
      },
      card: {
        selector: 'article',
        properties: ['background-color', 'background-image', 'border-color', 'border-radius', 'box-shadow', 'color', 'padding-top', 'transform'],
      },
      layout: {
        selector: 'main',
        properties: ['gap', 'padding-top', 'width'],
      },
    };

    const samples: Record<string, Record<string, string> | null> = {};
    for (const [category, target] of Object.entries(targets)) {
      const element = document.querySelector(target.selector);
      if (!element) {
        samples[category] = null;
        continue;
      }
      const style = getComputedStyle(element);
      samples[category] = Object.fromEntries(target.properties.map((property) => [
        property,
        style.getPropertyValue(property).trim(),
      ]));
    }
    return samples;
  });
}

function buildComponentDelta(before: ComponentStyleSamples, after: ComponentStyleSamples): DogfoodReceipt['visualProof']['componentDelta'] {
  const changesByCategory: Record<string, string[]> = {};
  for (const category of REQUIRED_VISUAL_MUTATION_CATEGORIES) {
    const beforeSample = before[category];
    const afterSample = after[category];
    if (!beforeSample || !afterSample) {
      changesByCategory[category] = [];
      continue;
    }
    const properties = new Set([...Object.keys(beforeSample), ...Object.keys(afterSample)]);
    changesByCategory[category] = [...properties].filter((property) => beforeSample[property] !== afterSample[property]);
  }
  return {
    requiredCategories: [...REQUIRED_VISUAL_MUTATION_CATEGORIES],
    changedCategories: REQUIRED_VISUAL_MUTATION_CATEGORIES.filter((category) => changesByCategory[category].length > 0),
    changesByCategory,
    before,
    after,
  };
}

function check(label: string, passed: boolean, detail: string): DogfoodAssertion {
  return { label, passed, detail };
}

function byteDelta(left: Buffer, right: Buffer): number {
  const sharedLength = Math.min(left.length, right.length);
  let delta = Math.abs(left.length - right.length);
  for (let index = 0; index < sharedLength; index += 1) {
    if (left[index] !== right[index]) delta += 1;
  }
  return delta;
}

async function fileSize(filePath: string | undefined): Promise<number> {
  if (!filePath) return 0;
  const stat = await fs.stat(filePath).catch(() => null);
  return stat?.size ?? 0;
}

function createStaticServer(rootDir: string): http.Server {
  const normalizedRoot = path.resolve(rootDir);
  return http.createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    const requestPath = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
    const filePath = path.resolve(normalizedRoot, `.${requestPath}`);
    if (filePath !== normalizedRoot && !filePath.startsWith(`${normalizedRoot}${path.sep}`)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const body = await fs.readFile(filePath).catch(() => null);
    if (!body) {
      res.writeHead(404).end('Not found');
      return;
    }
    res.setHeader('Content-Type', contentType(filePath));
    res.end(body);
  });
}

function contentType(filePath: string): string {
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.png')) return 'image/png';
  return 'application/octet-stream';
}

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | undefined> {
  let timeout: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<undefined>((resolve) => {
        timeout = setTimeout(() => resolve(undefined), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
