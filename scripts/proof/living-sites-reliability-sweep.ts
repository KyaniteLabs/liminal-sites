import fs from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { chromium, type Page } from 'playwright';
import { WebsiteEvolutionEngine } from '../../src/sites/WebsiteEvolutionEngine.js';
import { applySitePatchPlan, planSitePatch } from '../../src/sites/repo/SitePatchPlanner.js';
import {
  FULL_LIMINAL_PROOF_DOMAINS,
  createFullLiminalProofGeneratorBridge,
  createFullLiminalProofRenderAndScore,
} from './living-sites-full-liminal-fixtures.js';

interface ReliabilityScenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
  brandBrief: string;
  html: string;
  css: string;
}

interface ScenarioReceipt {
  id: string;
  title: string;
  ok: boolean;
  sourceUrl: string;
  siteId: string;
  selectedSkinId: string;
  selectedCompositionId: string;
  assertions: Array<{ label: string; passed: boolean; detail: string }>;
  visual: {
    sourceScreenshotPath: string;
    mutatedScreenshotPath: string;
    byteDelta: number;
    creativeDomains: string;
    creativeError: string;
    loadStateWarning: string;
  };
  journey: {
    ingestionId: string;
    generatedVariants: number;
    evolvedVariants: number;
    assessmentCandidates: number;
    deploymentId: string;
    rollbackId: string;
    runbookId: string;
    runbookChecks: number;
    patchCount: number;
    patchedFiles: string[];
  };
}

interface SweepReceipt {
  ok: boolean;
  generatedAt: string;
  scenarios: ScenarioReceipt[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    totalPatchCount: number;
    totalByteDelta: number;
  };
  artifacts: {
    outDir: string;
    receiptPath: string;
    galleryPath: string;
  };
}

const scenarios: ReliabilityScenario[] = [
  {
    id: 'operator-launch',
    title: 'Operator Launch Page',
    description: 'A plain product page that needs trust, visible receipts, and a reversible living-site install path.',
    prompt: 'Keep the page calm and operator-trustworthy while making the learning system visibly alive.',
    brandBrief: 'Quiet launch page for a technical product with proof-first messaging and sober confidence.',
    html: pageHtml({
      title: 'Operator Launch Page',
      eyebrow: 'Operator Proof',
      heading: 'A launch page that proves what changed.',
      body: 'The first viewport starts plain so the living-site engine must preserve trust while making learning visible.',
      cta: 'Inspect receipt',
      cards: [
        ['Capture', 'Read the current surface before changing it.'],
        ['Evolve', 'Generate directions from taste memory.'],
        ['Recover', 'Package the result with rollback notes.'],
      ],
    }),
    css: baseCss('#0d1117', '#111a22', '#e8f1ee', '#88d9b0', '#65c7e8'),
  },
  {
    id: 'b2b-control-room',
    title: 'B2B Control Room',
    description: 'A dense dashboard-shaped page where the mutation must stay scannable instead of becoming decorative.',
    prompt: 'Preserve the control-room density and make status, rhythm, and hierarchy feel more alive.',
    brandBrief: 'Dense operational SaaS control room for repeat-use operators, not a marketing splash page.',
    html: pageHtml({
      title: 'B2B Control Room',
      eyebrow: 'Fleet Status',
      heading: 'All launches visible from one quiet surface.',
      body: 'Operators need calm hierarchy, live status, and enough motion to show the page is aware of change.',
      cta: 'Review queue',
      cards: [
        ['Deployments', '14 active, 2 waiting for review.'],
        ['Signals', 'Latency, drift, and audit events stay grouped.'],
        ['Recovery', 'Every release keeps a rollback receipt.'],
      ],
    }),
    css: baseCss('#071216', '#102227', '#eef7f4', '#72e0c0', '#e1c16e'),
  },
  {
    id: 'creative-portfolio',
    title: 'Creative Portfolio',
    description: 'An expressive portfolio page where Liminal can push art direction without burying the work.',
    prompt: 'Make the page more cross-domain and artistic while keeping portfolio work readable.',
    brandBrief: 'Creative coding portfolio with expressive typography, visible motion, and clear project hierarchy.',
    html: pageHtml({
      title: 'Creative Portfolio',
      eyebrow: 'Studio Archive',
      heading: 'Generative systems with a human hand.',
      body: 'The page needs more atmosphere and motion, but the project cards still need to be inspectable.',
      cta: 'Open archive',
      cards: [
        ['Light Field', 'Shader studies for luminous environments.'],
        ['Signal Loom', 'Kinetic type driven by local memory.'],
        ['Soft Machines', 'Interface sketches for living tools.'],
      ],
    }),
    css: baseCss('#100b16', '#1d1328', '#f4edf8', '#c88cff', '#6ee7d8'),
  },
  {
    id: 'venue-menu',
    title: 'Venue / Menu Page',
    description: 'A local venue page that should gain atmosphere while keeping hours, menu, and calls to action obvious.',
    prompt: 'Create a living venue atmosphere while preserving menu clarity and practical visitor actions.',
    brandBrief: 'Neighborhood venue page with warm atmosphere, clear menu cards, and accessible calls to action.',
    html: pageHtml({
      title: 'Venue Menu Page',
      eyebrow: 'Tonight at Mesa',
      heading: 'A small room for food, sound, and late light.',
      body: 'Visitors need the mood, the menu, and the next action without fighting a decorative layout.',
      cta: 'Reserve table',
      cards: [
        ['Kitchen', 'Seasonal plates, visible sourcing, simple pacing.'],
        ['Bar', 'Low-proof drinks and bright citrus.'],
        ['Room', 'Two sets nightly with room for conversation.'],
      ],
    }),
    css: baseCss('#17100b', '#271b12', '#fff1df', '#f2b56b', '#81d6a2'),
  },
];

async function main() {
  if (process.argv.includes('--list-scenarios')) {
    console.log(JSON.stringify(scenarios.map(({ id, title, description }) => ({ id, title, description })), null, 2));
    return;
  }

  const root = process.cwd();
  const outDir = path.join(root, '.omx', 'proof', 'living-sites-reliability-sweep');
  const receiptPath = path.join(outDir, 'receipt.json');
  const galleryPath = path.join(outDir, 'gallery.html');
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const selectedIds = parseScenarioFilter();
  const selected = selectedIds.length > 0 ? scenarios.filter((scenario) => selectedIds.includes(scenario.id)) : scenarios;
  if (selected.length === 0) throw new Error(`No reliability scenarios matched: ${selectedIds.join(', ')}`);

  const results: ScenarioReceipt[] = [];
  for (const scenario of selected) {
    results.push(await runScenario(root, outDir, scenario));
  }

  const receipt: SweepReceipt = {
    ok: results.every((result) => result.ok),
    generatedAt: new Date().toISOString(),
    scenarios: results,
    summary: {
      total: results.length,
      passed: results.filter((result) => result.ok).length,
      failed: results.filter((result) => !result.ok).length,
      totalPatchCount: results.reduce((sum, result) => sum + result.journey.patchCount, 0),
      totalByteDelta: results.reduce((sum, result) => sum + result.visual.byteDelta, 0),
    },
    artifacts: { outDir, receiptPath, galleryPath },
  };
  await fs.writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
  await fs.writeFile(galleryPath, renderGallery(receipt));

  if (!receipt.ok) {
    throw new Error(`Living Sites reliability sweep failed: ${JSON.stringify(results.filter((result) => !result.ok), null, 2)}`);
  }

  console.log(JSON.stringify({
    ok: receipt.ok,
    scenarios: receipt.summary.total,
    passed: receipt.summary.passed,
    totalPatchCount: receipt.summary.totalPatchCount,
    totalByteDelta: receipt.summary.totalByteDelta,
    receiptPath,
    galleryPath,
  }, null, 2));
}

async function runScenario(root: string, outDir: string, scenario: ReliabilityScenario): Promise<ScenarioReceipt> {
  const scenarioDir = path.join(outDir, scenario.id);
  const sourceDir = path.join(scenarioDir, 'source');
  const stateDir = path.join(scenarioDir, 'state');
  const patchRepo = path.join(scenarioDir, 'patch-repo');
  const sourceScreenshotPath = path.join(scenarioDir, 'source.png');
  const mutatedScreenshotPath = path.join(scenarioDir, 'mutated.png');
  await fs.mkdir(sourceDir, { recursive: true });
  await fs.mkdir(patchRepo, { recursive: true });
  await fs.writeFile(path.join(sourceDir, 'index.html'), scenario.html);
  await fs.writeFile(path.join(sourceDir, 'styles.css'), scenario.css);
  await fs.writeFile(path.join(patchRepo, 'index.html'), scenario.html);

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
      name: scenario.title,
      sourceUrl,
      brandBrief: scenario.brandBrief,
      constraints: ['Keep changes reversible.', 'Preserve the original information hierarchy.'],
      allowedModes: ['runtime-skin', 'repo-native-pr'],
    });
    const ingestion = await engine.ingestSource(profile.siteId, {
      sourceUrl,
      captureVisual: true,
      viewport: { width: 1280, height: 820 },
    });
    const firstRun = await engine.generateVariants(profile.siteId, {
      prompt: scenario.prompt,
      count: 2,
      mode: 'runtime-skin',
    });
    const favorite = firstRun.variants[0];
    await engine.recordPreference({
      siteId: profile.siteId,
      skinId: favorite.skinId,
      kind: 'favorite',
      note: `Reliability sweep favorite for ${scenario.title}.`,
    });
    const evolvedRun = await engine.evolve(profile.siteId, {
      prompt: `${scenario.prompt} Push the selected direction one step further while staying usable.`,
      count: 2,
    });
    const assessment = await engine.compareAesthetics(profile.siteId, {
      skinIds: [...firstRun.variants, ...evolvedRun.variants].map((variant) => variant.skinId),
      recordWinnerPreference: true,
    });
    const evolvedSkinIds = new Set(evolvedRun.variants.map((variant) => variant.skinId));
    const selectedSkinId = assessment.candidates.find((candidate) => evolvedSkinIds.has(candidate.skinId))?.skinId
      ?? evolvedRun.variants[0]?.skinId
      ?? favorite.skinId;
    const composition = await engine.composeCreativeSite(profile.siteId, {
      skinId: selectedSkinId,
      prompt: `Use every Liminal site domain for this ${scenario.title} reliability scenario.`,
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
      reason: `Reliability sweep recovery target for ${scenario.title}.`,
    });
    const runbook = await engine.createOperatorRunbook(profile.siteId, { skinId: selectedSkinId });
    const selectedVariant = [...firstRun.variants, ...evolvedRun.variants].find((variant) => variant.skinId === selectedSkinId);
    if (!selectedVariant) throw new Error(`Selected variant disappeared for ${scenario.id}: ${selectedSkinId}`);
    const plan = await planSitePatch({ repoRoot: patchRepo, spec: selectedVariant, composition });
    const patchedFiles = await applySitePatchPlan(plan);
    const visual = await renderVisualProof({
      sourceUrl,
      sourceScreenshotPath,
      mutatedScreenshotPath,
      cssPath: deployment.files.cssPath,
      jsPath: deployment.files.jsPath,
      creativeCssPath: deployment.files.creativeCssPath!,
      creativeJsPath: deployment.files.creativeJsPath!,
    });
    const assertions = [
      check('ingestion captured screenshot', Boolean(ingestion.screenshotPath), ingestion.screenshotPath ?? 'missing'),
      check('generation and evolution produced variants', firstRun.variants.length === 2 && evolvedRun.variants.length === 2, `${firstRun.variants.length}+${evolvedRun.variants.length}`),
      check('assessment ranked candidates', assessment.candidates.length >= 4, `${assessment.candidates.length} candidates`),
      check('full-liminal composition used every domain', composition.capabilityMatrix.summary.used === FULL_LIMINAL_PROOF_DOMAINS.length && composition.capabilityMatrix.summary.failed === 0, JSON.stringify(composition.capabilityMatrix.summary)),
      check('browser mutation activated without creative errors', visual.creativeError === '' && visual.creativeDomains.split(',').filter(Boolean).length === FULL_LIMINAL_PROOF_DOMAINS.length, visual.creativeDomains),
      check('visual output changed materially', visual.byteDelta > 10_000, `${visual.byteDelta} bytes changed`),
      check('deployment, rollback, and runbook receipts exist', Boolean(deployment.deploymentId && rollback.rollbackId && runbook.runbookId) && runbook.checks.length >= 8, `${deployment.deploymentId}, ${rollback.rollbackId}, ${runbook.runbookId}`),
      check('repo patch plan installs runtime and creative assets', plan.patches.length >= 6 && patchedFiles.some((file) => file.endsWith('liminal-creative.js')), `${plan.patches.length} patches`),
    ];

    return {
      id: scenario.id,
      title: scenario.title,
      ok: assertions.every((assertion) => assertion.passed),
      sourceUrl,
      siteId: profile.siteId,
      selectedSkinId,
      selectedCompositionId: composition.compositionId,
      assertions,
      visual,
      journey: {
        ingestionId: ingestion.ingestionId,
        generatedVariants: firstRun.variants.length,
        evolvedVariants: evolvedRun.variants.length,
        assessmentCandidates: assessment.candidates.length,
        deploymentId: deployment.deploymentId,
        rollbackId: rollback.rollbackId,
        runbookId: runbook.runbookId,
        runbookChecks: runbook.checks.length,
        patchCount: plan.patches.length,
        patchedFiles: patchedFiles.map((file) => path.relative(root, file)),
      },
    };
  } finally {
    server.closeAllConnections?.();
    server.closeIdleConnections?.();
    await withTimeout(new Promise<void>((resolve) => server.close(() => resolve())), 3_000);
  }
}

async function renderVisualProof(input: {
  sourceUrl: string;
  sourceScreenshotPath: string;
  mutatedScreenshotPath: string;
  cssPath: string;
  jsPath: string;
  creativeCssPath: string;
  creativeJsPath: string;
}): Promise<ScenarioReceipt['visual']> {
  const [css, js, creativeCss, creativeJs] = await Promise.all([
    fs.readFile(input.cssPath, 'utf8'),
    fs.readFile(input.jsPath, 'utf8'),
    fs.readFile(input.creativeCssPath, 'utf8'),
    fs.readFile(input.creativeJsPath, 'utf8'),
  ]);
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 820 } });
    await page.goto(input.sourceUrl, { waitUntil: 'domcontentloaded' });
    const loadStateWarning = await page.waitForLoadState('networkidle', { timeout: 2_500 })
      .then(() => '')
      .catch((error: unknown) => `networkidle wait skipped: ${formatError(error)}`);
    const before = await page.screenshot({ path: input.sourceScreenshotPath, fullPage: true });
    await page.addStyleTag({ content: css });
    await page.addStyleTag({ content: creativeCss });
    await page.addScriptTag({ content: js });
    await page.addScriptTag({ content: creativeJs });
    await page.waitForFunction(() => document.body.classList.contains('liminal-sites-active'), null, { timeout: 3_000 });
    await page.waitForFunction(() => document.body.classList.contains('liminal-sites-creative-active'), null, { timeout: 3_000 });
    await page.waitForTimeout(180);
    const visual = await page.evaluate(() => ({
      creativeDomains: document.documentElement.dataset.liminalSitesDomains ?? '',
      creativeError: document.documentElement.dataset.liminalCreativeError ?? '',
    }));
    const after = await page.screenshot({ path: input.mutatedScreenshotPath, fullPage: true });
    return {
      sourceScreenshotPath: input.sourceScreenshotPath,
      mutatedScreenshotPath: input.mutatedScreenshotPath,
      byteDelta: byteDelta(before, after),
      creativeDomains: visual.creativeDomains,
      creativeError: visual.creativeError,
      loadStateWarning,
    };
  } finally {
    await browser.close();
  }
}

function renderGallery(receipt: SweepReceipt): string {
  const rows = receipt.scenarios.map((scenario) => {
    const source = path.relative(path.dirname(receipt.artifacts.galleryPath), scenario.visual.sourceScreenshotPath);
    const mutated = path.relative(path.dirname(receipt.artifacts.galleryPath), scenario.visual.mutatedScreenshotPath);
    const lines = [
      ...scenario.assertions.map((assertion) => `${assertion.passed ? 'pass' : 'fail'} ${assertion.label}: ${assertion.detail}`),
      scenario.visual.loadStateWarning
        ? `warn browser load-state: ${scenario.visual.loadStateWarning}`
        : 'pass browser load-state: networkidle reached',
    ];
    return `<article>
  <h2>${escapeHtml(scenario.title)}</h2>
  <p>${scenario.ok ? 'passed' : 'failed'} · ${scenario.visual.byteDelta} changed bytes · ${scenario.journey.patchCount} patches</p>
  <div class="shots">
    <figure><img src="${source}" alt="${escapeHtml(scenario.title)} before"><figcaption>before</figcaption></figure>
    <figure><img src="${mutated}" alt="${escapeHtml(scenario.title)} after"><figcaption>after</figcaption></figure>
  </div>
  <pre>${escapeHtml(lines.join('\n'))}</pre>
</article>`;
  }).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Liminal Sites Reliability Gallery</title>
  <style>
    :root { color-scheme: dark; --bg: #081014; --panel: #101c22; --line: rgba(238, 246, 243, .16); --text: #edf7f3; --muted: #9eb4ae; --accent: #64d6c0; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.5 Inter, ui-sans-serif, system-ui, sans-serif; }
    main { width: min(1180px, calc(100vw - 32px)); margin: 0 auto; padding: 40px 0; }
    h1 { margin: 0 0 10px; font-size: 42px; }
    article { margin-top: 22px; padding: 18px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); }
    h2 { margin: 0; }
    p { color: var(--muted); }
    .shots { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    figure { margin: 0; }
    img { display: block; width: 100%; border: 1px solid var(--line); border-radius: 6px; }
    figcaption { margin-top: 6px; color: var(--accent); font-weight: 700; }
    pre { overflow: auto; padding: 12px; border-radius: 6px; background: #071014; color: var(--muted); }
    @media (max-width: 780px) { .shots { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <h1>Liminal Sites Reliability Gallery</h1>
    <p>${receipt.summary.passed}/${receipt.summary.total} scenarios passed · ${receipt.summary.totalPatchCount} generated patch operations · ${receipt.summary.totalByteDelta} total changed screenshot bytes.</p>
    ${rows}
  </main>
</body>
</html>
`;
}

function pageHtml(input: { title: string; eyebrow: string; heading: string; body: string; cta: string; cards: Array<[string, string]> }): string {
  const cards = input.cards.map(([title, body]) => `<article><h2>${title}</h2><p>${body}</p></article>`).join('\n');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${input.title}</title>
    <meta name="description" content="${input.body}">
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <main>
      <section class="hero">
        <p class="eyebrow">${input.eyebrow}</p>
        <h1 data-liminal-heading="hero">${input.heading}</h1>
        <p>${input.body}</p>
        <div class="actions"><a href="#proof">${input.cta}</a><button type="button">Run mutation</button></div>
      </section>
      <section id="proof" class="grid" aria-label="Proof cards">${cards}</section>
    </main>
  </body>
</html>
`;
}

function baseCss(background: string, panel: string, text: string, accent: string, accentTwo: string): string {
  return `:root { color-scheme: dark; --bg: ${background}; --panel: ${panel}; --text: ${text}; --muted: color-mix(in srgb, ${text} 68%, ${background}); --accent: ${accent}; --accent-two: ${accentTwo}; --line: color-mix(in srgb, ${text} 16%, transparent); }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; color: var(--text); background: var(--bg); font: 16px/1.55 Inter, ui-sans-serif, system-ui, sans-serif; }
main { width: min(1120px, calc(100vw - 40px)); min-height: 100vh; margin: 0 auto; display: grid; align-content: center; gap: 28px; padding: 56px 0; }
.hero { max-width: 780px; }
.eyebrow { margin: 0 0 12px; color: var(--accent-two); font-size: 13px; font-weight: 800; letter-spacing: 0; text-transform: uppercase; }
h1 { margin: 0; font-size: clamp(42px, 6vw, 82px); line-height: .98; }
h2 { margin: 0 0 10px; font-size: 22px; }
p { max-width: 680px; margin: 16px 0 0; color: var(--muted); font-size: 18px; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
a, button { min-height: 44px; border: 1px solid var(--line); border-radius: 8px; padding: 0 18px; font: inherit; font-weight: 800; }
a { display: inline-grid; place-items: center; color: var(--text); text-decoration: none; background: rgba(255, 255, 255, .05); }
button { color: var(--bg); background: var(--accent); }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
article { min-height: 150px; padding: 20px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); }
article p { margin-top: 0; font-size: 16px; }
@media (max-width: 760px) { .grid { grid-template-columns: 1fr; } main { padding: 36px 0; } }
`;
}

function parseScenarioFilter(): string[] {
  const raw = process.argv.find((arg) => arg.startsWith('--scenario='))?.slice('--scenario='.length);
  return raw ? raw.split(',').map((value) => value.trim()).filter(Boolean) : [];
}

function check(label: string, passed: boolean, detail: string) {
  return { label, passed, detail };
}

function createStaticServer(root: string): http.Server {
  return http.createServer(async (req, res) => {
    try {
      const requestPath = new URL(req.url || '/', 'http://127.0.0.1').pathname;
      const relative = requestPath === '/' ? 'index.html' : requestPath.slice(1);
      const filePath = path.resolve(root, relative);
      if (filePath !== path.resolve(root) && !filePath.startsWith(`${path.resolve(root)}${path.sep}`)) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      const body = await fs.readFile(filePath);
      res.setHeader('Content-Type', filePath.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/html; charset=utf-8');
      res.end(body);
    } catch (error: unknown) {
      const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
      if (code === 'ENOENT' || code === 'EISDIR') {
        res.writeHead(404).end('Not found');
        return;
      }
      console.error(`Reliability sweep static server failed: ${formatError(error)}`);
      res.writeHead(500).end('Server error');
    }
  });
}

async function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Unable to allocate a port'));
        return;
      }
      const port = address.port;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

function byteDelta(before: Buffer, after: Buffer): number {
  const max = Math.max(before.length, after.length);
  let diff = Math.abs(before.length - after.length);
  for (let index = 0; index < Math.min(before.length, after.length); index += 1) {
    if (before[index] !== after[index]) diff += 1;
  }
  return Math.min(diff, max);
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.stack ?? error.message : String(error);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
