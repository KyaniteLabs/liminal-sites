import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import http from 'http';

const realFetch = globalThis.__liminalNativeFetch || globalThis.fetch.bind(globalThis);

const TEST_DIR = path.join(os.tmpdir(), `liminal-sites-api-${Date.now()}`);
const TEST_CONFIG_PATH = path.join(TEST_DIR, 'config.json');
const TEST_STATE = path.join(TEST_DIR, 'state');

describe('Living Sites API', () => {
  let server;
  let port;

  beforeAll(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
    await fs.writeFile(TEST_CONFIG_PATH, JSON.stringify({ defaultProvider: 'lmstudio', providers: {} }, null, 2));
    process.env.LIMINAL_CONFIG_PATH = TEST_CONFIG_PATH;
    process.env.LIMINAL_SITES_ROOT = TEST_STATE;
    const { createApp } = await import('../../gui/server.js');
    const app = createApp(TEST_CONFIG_PATH, 0);
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, () => resolve()));
    const address = server.address();
    port = typeof address === 'object' && address && 'port' in address ? address.port : 0;
    expect(port).toBeGreaterThan(0);
  }, 30000);

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    delete process.env.LIMINAL_CONFIG_PATH;
    delete process.env.LIMINAL_SITES_ROOT;
    await fs.rm(TEST_DIR, { recursive: true, force: true }).catch(() => {});
  });

  async function post(pathname, data) {
    const res = await realFetch(`http://127.0.0.1:${port}${pathname}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(8000),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || res.statusText);
    return body;
  }

  async function get(pathname) {
    const res = await realFetch(`http://127.0.0.1:${port}${pathname}`, {
      signal: AbortSignal.timeout(8000),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || res.statusText);
    return body;
  }

  it('generates, previews, exports, and plans a repo patch', async () => {
    const sourcePath = path.join(TEST_DIR, 'captured-site');
    await fs.mkdir(path.join(sourcePath, 'src'), { recursive: true });
    await fs.writeFile(path.join(sourcePath, 'index.html'), `<!doctype html>
<html>
  <head>
    <title>Studio Living Site Source</title>
    <meta name="description" content="A source website that needs grounded evolution.">
    <style>body { color: #fafafa; background: #101828; }</style>
  </head>
  <body>
    <main><h1>Studio Living Site Source</h1><section><button>Act</button></section></main>
  </body>
</html>`);
    await fs.writeFile(path.join(sourcePath, 'src/index.css'), 'body { font-family: Inter, sans-serif; color: #f97316; }\n');
    const profileResponse = await post('/api/living-sites/profile', {
      name: 'Studio Living Site',
      sourceUrl: 'https://example.com',
      brandBrief: 'quiet operator website with living motion',
    });
    const siteId = profileResponse.profile.siteId;
    const ingestionResponse = await post(`/api/living-sites/${siteId}/ingest`, {
      sourcePath,
      captureVisual: false,
    });
    const ingestionsResponse = await get(`/api/living-sites/${siteId}/ingestions`);
    const variantResponse = await post(`/api/living-sites/${siteId}/variants`, {
      prompt: 'create a credible living-site direction',
      count: 2,
    });
    const skinId = variantResponse.run.variants[0].skinId;
    await post(`/api/living-sites/${siteId}/preferences`, {
      skinId,
      kind: 'favorite',
      note: 'This is the direction to learn from.',
    });
    const assessmentResponse = await post(`/api/living-sites/${siteId}/aesthetic-assessment`, {
      skinIds: variantResponse.run.variants.map((variant) => variant.skinId),
    });
    const assessmentsResponse = await get(`/api/living-sites/${siteId}/aesthetic-assessments`);
    const creativeResponse = await post(`/api/living-sites/${siteId}/creative-composition`, {
      skinId,
      prompt: 'Add shader atmosphere and kinetic text while keeping the source usable.',
    });
    const fullCreativeResponse = await post(`/api/living-sites/${siteId}/creative-composition`, {
      skinId,
      prompt: 'Route through the full-liminal API schema and record any generator failures.',
      strategy: 'full-liminal',
      domainMode: 'selected',
      domains: ['p5'],
      candidatesPerDomain: 1,
      maxIterations: 1,
      includeAudio: false,
      includeVideoAssets: false,
    });
    const capabilitiesResponse = await get(`/api/living-sites/${siteId}/capabilities`);
    const compositionsResponse = await get(`/api/living-sites/${siteId}/creative-compositions`);
    const deploymentResponse = await post(`/api/living-sites/${siteId}/deployment-package`, {
      skinId,
      compositionId: creativeResponse.composition.compositionId,
    });
    const deploymentsResponse = await get(`/api/living-sites/${siteId}/deployments`);
    const sensoriumConfigResponse = await post(`/api/living-sites/${siteId}/sensorium-config`, {
      source: 'posthog-fixture',
      events: [
        {
          event: '$pageview',
          distinctId: 'visitor-1',
          properties: { $pathname: '/', dwell_seconds: 80, $is_returning: true },
        },
        {
          event: '$scroll_depth',
          distinctId: 'visitor-1',
          properties: { $pathname: '/', scroll_depth: 74 },
        },
        {
          event: '$autocapture',
          distinctId: 'visitor-2',
          properties: { $pathname: '/', $el_text: 'Act' },
        },
      ],
    });
    const sensoriumConfigsResponse = await get(`/api/living-sites/${siteId}/sensorium-configs`);
    const sensoriumDeploymentResponse = await post(`/api/living-sites/${siteId}/sensorium-deployment`, {
      configId: sensoriumConfigResponse.config.configId,
    });
    const sensoriumDeploymentsResponse = await get(`/api/living-sites/${siteId}/sensorium-deployments`);
    const rollbackResponse = await post(`/api/living-sites/${siteId}/rollback`, {
      skinId,
      reason: 'Operator wants a verified recovery point.',
    });
    const rollbacksResponse = await get(`/api/living-sites/${siteId}/rollbacks`);
    const runbookResponse = await post(`/api/living-sites/${siteId}/operator-runbook`, { skinId });
    const runbooksResponse = await get(`/api/living-sites/${siteId}/operator-runbooks`);
    const projectsResponse = await get('/api/living-sites/projects');
    const deploymentCssPath = new URL(deploymentResponse.deployment.manifest.assets.css).pathname;
    const deploymentInstallPath = new URL(deploymentResponse.deployment.manifest.assets.installHtml).pathname;
    const deploymentCss = await realFetch(`http://127.0.0.1:${port}${deploymentCssPath}`, { signal: AbortSignal.timeout(8000) });
    const deploymentInstall = await realFetch(`http://127.0.0.1:${port}${deploymentInstallPath}`, { signal: AbortSignal.timeout(8000) });
    const deploymentCssText = await deploymentCss.text();
    const deploymentInstallText = await deploymentInstall.text();
    const sensoriumCssPath = new URL(sensoriumDeploymentResponse.deployment.manifest.assets.css).pathname;
    const sensoriumJsPath = new URL(sensoriumDeploymentResponse.deployment.manifest.assets.js).pathname;
    const sensoriumConfigPath = new URL(sensoriumDeploymentResponse.deployment.manifest.assets.config).pathname;
    const sensoriumCss = await realFetch(`http://127.0.0.1:${port}${sensoriumCssPath}`, { signal: AbortSignal.timeout(8000) });
    const sensoriumJs = await realFetch(`http://127.0.0.1:${port}${sensoriumJsPath}`, { signal: AbortSignal.timeout(8000) });
    const sensoriumConfig = await realFetch(`http://127.0.0.1:${port}${sensoriumConfigPath}`, { signal: AbortSignal.timeout(8000) });
    const sensoriumCssText = await sensoriumCss.text();
    const sensoriumJsText = await sensoriumJs.text();
    const sensoriumConfigText = await sensoriumConfig.text();
    const creativeJsAsset = await realFetch(`http://127.0.0.1:${port}/api/living-sites/${siteId}/creative-compositions/${creativeResponse.composition.compositionId}/assets/liminal-creative.js`, { signal: AbortSignal.timeout(8000) });
    const creativeManifestAsset = await realFetch(`http://127.0.0.1:${port}/api/living-sites/${siteId}/creative-compositions/${creativeResponse.composition.compositionId}/assets/manifest.json`, { signal: AbortSignal.timeout(8000) });
    const creativeJsText = await creativeJsAsset.text();
    const creativeManifestText = await creativeManifestAsset.text();
    const previewResponse = await post(`/api/living-sites/${siteId}/preview`, {
      skinId,
      compositionId: creativeResponse.composition.compositionId,
    });
    const previewPath = new URL(previewResponse.url).pathname + new URL(previewResponse.url).search;
    const preview = await realFetch(`http://127.0.0.1:${port}${previewPath}`, { signal: AbortSignal.timeout(8000) });
    const previewHtml = await preview.text();
    const exportResponse = await post(`/api/living-sites/${siteId}/export`, { skinId });
    const creativeExportResponse = await post(`/api/living-sites/${siteId}/export-creative`, {
      compositionId: creativeResponse.composition.compositionId,
    });

    const repoRoot = path.join(TEST_DIR, 'site-fixture');
    await fs.mkdir(path.join(repoRoot, 'src'), { recursive: true });
    await fs.writeFile(path.join(repoRoot, 'package.json'), JSON.stringify({ scripts: { dev: 'vite' }, dependencies: { react: 'latest' }, devDependencies: { vite: 'latest' } }));
    await fs.writeFile(path.join(repoRoot, 'src/main.tsx'), "console.log('site');\n");
    const patchResponse = await post(`/api/living-sites/${siteId}/plan-patch`, {
      skinId,
      compositionId: creativeResponse.composition.compositionId,
      repoRoot,
    });

    expect(ingestionResponse.ingestion.title).toBe('Studio Living Site Source');
    expect(ingestionsResponse.ingestions).toHaveLength(1);
    expect(variantResponse.run.variants[0].prompt).toContain('Current website ingestion: Studio Living Site Source');
    expect(assessmentResponse.assessment.preferenceSummary).toContain('1 positive');
    expect(assessmentResponse.assessment.candidates).toHaveLength(2);
    expect(assessmentsResponse.assessments).toHaveLength(1);
    expect(deploymentResponse.deployment.installSnippets.combined).toContain('data-liminal-sites');
    expect(deploymentResponse.deployment.installSnippets.combined).toContain('data-liminal-sites-creative');
    expect(sensoriumConfigResponse.config.signalVector.sampleSize).toBe(3);
    expect(sensoriumConfigResponse.config.guardrails.protectedSurfaces).toContain('analytics');
    expect(sensoriumConfigsResponse.configs).toHaveLength(1);
    expect(sensoriumDeploymentResponse.deployment.installSnippets.combined).toContain('data-liminal-sites-sensorium');
    expect(sensoriumDeploymentsResponse.deployments).toHaveLength(1);
    expect(creativeResponse.composition.domains).toEqual(expect.arrayContaining(['shader', 'textgen']));
    expect(creativeResponse.composition.layers.every((layer) => layer.validation.valid)).toBe(true);
    expect(creativeResponse.composition.capabilityMatrix.summary.used).toBe(2);
    expect(fullCreativeResponse.composition.strategy).toBe('full-liminal');
    expect(fullCreativeResponse.composition.domainMode).toBe('selected');
    expect(fullCreativeResponse.composition.capabilityMatrix.summary.total).toBeGreaterThanOrEqual(13);
    expect(fullCreativeResponse.composition.capabilityMatrix.domains.find((capability) => capability.domain === 'p5')?.status).toMatch(/used|failed/);
    expect(capabilitiesResponse.capabilities.latestComposition.compositionId).toBe(fullCreativeResponse.composition.compositionId);
    expect(capabilitiesResponse.capabilities.inventory.summary.total).toBeGreaterThanOrEqual(13);
    expect(compositionsResponse.compositions).toHaveLength(2);
    expect(deploymentsResponse.deployments).toHaveLength(1);
    expect(rollbackResponse.rollback.selectedSkin.skinId).toBe(skinId);
    expect(rollbackResponse.rollback.verificationChecklist.join(' ')).toContain('Preview');
    expect(rollbacksResponse.rollbacks).toHaveLength(1);
    expect(runbookResponse.runbook.checks.map((check) => check.id)).toContain('deployment-package');
    expect(runbookResponse.runbook.recoveryPaths.join(' ')).toContain('Deployment package');
    expect(runbooksResponse.runbooks).toHaveLength(1);
    expect(projectsResponse.projects[0]).toMatchObject({
      profile: { siteId },
      counts: { creativeCompositions: 2, deployments: 1, sensoriumConfigs: 1, sensoriumDeployments: 1, rollbacks: 1, operatorRunbooks: 1 },
      latest: { operatorRunbook: { runbookId: runbookResponse.runbook.runbookId } },
    });
    expect(projectsResponse.projects[0].receipts[0]).toMatchObject({
      kind: 'operator-runbook',
      id: runbookResponse.runbook.runbookId,
    });
    expect(projectsResponse.projects[0]).toMatchObject({
      latest: { rollback: { skinId } },
      publishedSkinId: skinId,
    });
    expect(deploymentCssText).toContain('--liminal-sites-bg');
    expect(deploymentInstallText).toContain('data-liminal-sites');
    expect(sensoriumCssText).toContain('liminal-sites-sensorium-layer');
    expect(sensoriumJsText).toContain('__liminalSitesSensorium');
    expect(sensoriumConfigText).toContain(sensoriumConfigResponse.config.configId);
    expect(creativeJsText).toContain('__liminalSitesCreative');
    expect(creativeManifestText).toContain('"domains"');
    expect(creativeManifestText).toContain('"capabilityMatrix"');
    expect(previewHtml).toContain('Website that keeps learning.');
    expect(previewHtml).toContain('liminal-sites-active');
    expect(previewHtml).toContain('liminal-sites-creative-stage');
    expect(exportResponse.export.cssPath).toMatch(/liminal-skin\.css$/);
    expect(exportResponse.export.files.css).toContain('--liminal-sites-bg');
    expect(creativeExportResponse.export.jsPath).toMatch(/liminal-creative\.js$/);
    expect(patchResponse.plan.framework).toBe('vite');
    expect(patchResponse.plan.patches.map((patch) => patch.path)).toContain('src/liminal-sites/liminal-skin.css');
    expect(patchResponse.plan.patches.map((patch) => patch.path)).toContain('src/liminal-sites/liminal-creative.js');
  });
});
