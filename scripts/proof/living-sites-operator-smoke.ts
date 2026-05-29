import fs from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { chromium, type Page } from 'playwright';
import { createServer as createViteServer, type ViteDevServer } from 'vite';

interface SmokeStarted {
  backend: http.Server;
  fixture: http.Server;
  vite: ViteDevServer;
  apiPort: number;
  fixtureUrl: string;
  guiPort: number;
  tempDir: string;
}

interface SmokeDebugEvent {
  type: string;
  detail: Record<string, unknown>;
}

async function main() {
  const root = process.cwd();
  const outDir = path.join(root, '.omx', 'proof', 'living-sites-operator-smoke');
  await fs.mkdir(outDir, { recursive: true });
  const started = await startStudio(root);
  const browser = await chromium.launch({ headless: true });
  const debugEvents: SmokeDebugEvent[] = [];
  const startedAt = Date.now();
  let page: Page | undefined;
  try {
    page = await browser.newPage({ viewport: { width: 1440, height: 980 } });
    page.on('pageerror', (error) => {
      debugEvents.push({
        type: 'pageerror',
        detail: { message: error.message, stack: error.stack, elapsedMs: Date.now() - startedAt },
      });
      throw error;
    });
    await page.goto(`http://127.0.0.1:${started.guiPort}`, { waitUntil: 'domcontentloaded' });
    await page.getByLabel('More tools').click();
    await page.getByRole('button', { name: 'Living Site' }).waitFor({ state: 'visible', timeout: 12_000 });
    await page.getByRole('button', { name: 'Living Site' }).click();
    await page.getByLabel('Source URL').fill(started.fixtureUrl);
    await page.locator('.living-site-panel--profile').getByRole('button', { name: 'Ingest' }).click();
    await page.locator('.living-site-ingestion').waitFor({ state: 'visible', timeout: 16_000 });
    await page.locator('.living-site-ingestion__screenshot').waitFor({ state: 'visible', timeout: 12_000 });
    const screenshotLoaded = await page.locator('.living-site-ingestion__screenshot').evaluate((image) => (
      image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0
    ));
    if (!screenshotLoaded) throw new Error('Ingestion screenshot did not load in the operator receipt.');
    await page.locator('.living-site-panel--profile').getByRole('button', { name: 'Generate' }).click();
    await page.locator('.living-site-variant').first().waitFor({ state: 'visible', timeout: 12_000 });
    const selectedSkinPanel = page.locator('section.living-site-panel').filter({ hasText: 'Selected Skin' });
    await selectedSkinPanel.getByRole('button', { name: 'Favorite' }).click();
    await page.getByText('taste memory updated').waitFor({ state: 'visible', timeout: 12_000 });
    await page.locator('.living-site-panel--profile').getByRole('button', { name: 'Evolve' }).click();
    await page.locator('.living-site-variant').first().waitFor({ state: 'visible', timeout: 12_000 });
    await page.locator('.living-site-panel--profile').getByRole('button', { name: 'Compare' }).click();
    await page.locator('.living-site-assessment').waitFor({ state: 'visible', timeout: 12_000 });
    await waitForStatus(page, 'aesthetic loop ranked');
    const creativeMode = page.getByLabel('Creative mode');
    await creativeMode.selectOption('balanced');
    await waitForLabeledSelectValue(page, 'Creative mode', 'balanced');
    const composeButton = selectedSkinPanel.getByRole('button', { name: 'Compose creative' });
    await waitForEnabledButton(page, 'Compose creative');
    await composeButton.click();
    await page.locator('.living-site-creative-receipt').waitFor({ state: 'visible', timeout: 45_000 });
    await selectedSkinPanel.getByRole('button', { name: 'Preview' }).click();
    const iframe = page.locator('iframe[title="Live preview"][src*="living-site-preview"]').first();
    await iframe.waitFor({ state: 'visible', timeout: 12_000 });
    const iframeSrc = await iframe.getAttribute('src');
    if (!iframeSrc) throw new Error('Living site preview iframe did not expose a src.');
    const previewUrl = new URL(iframeSrc, `http://127.0.0.1:${started.guiPort}`).toString();
    const previewResponse = await fetchWithTimeout(previewUrl, 12_000, 'living site preview');
    const frameText = await previewResponse.text();
    if (!previewResponse.ok || !frameText.includes('Website that keeps learning.')) {
      throw new Error(`Living site preview HTML did not verify: ${previewResponse.status}`);
    }
    await selectedSkinPanel.getByRole('button', { name: 'Deploy package' }).click();
    await page.locator('.living-site-deployment').waitFor({ state: 'visible', timeout: 12_000 });
    const installPreviewUrl = await page.locator('.living-site-deployment__link').getAttribute('href');
    if (!installPreviewUrl) throw new Error('Deployment install preview link was not visible.');
    const installPreview = await fetchWithTimeout(
      new URL(installPreviewUrl, `http://127.0.0.1:${started.guiPort}`).toString(),
      12_000,
      'deployment install preview',
    );
    const installPreviewText = await installPreview.text();
    if (!installPreview.ok || !installPreviewText.includes('data-liminal-sites')) {
      throw new Error(`Deployment install preview did not verify: ${installPreview.status}`);
    }
    await selectedSkinPanel.getByRole('button', { name: 'Prepare sensorium' }).click();
    await page.locator('.living-site-sensorium__metrics').waitFor({ state: 'visible', timeout: 12_000 });
    await waitForStatusContains(page, 'sensorium config');
    await selectedSkinPanel.getByRole('button', { name: 'Package sensorium' }).click();
    await page.locator('.living-site-sensorium__package').waitFor({ state: 'visible', timeout: 12_000 });
    const sensoriumPreviewUrl = await page.locator('.living-site-sensorium__package .living-site-deployment__link').getAttribute('href');
    if (!sensoriumPreviewUrl) throw new Error('Sensorium install preview link was not visible.');
    const resolvedSensoriumPreviewUrl = new URL(sensoriumPreviewUrl, `http://127.0.0.1:${started.guiPort}`).toString();
    const sensoriumPreview = await fetchWithTimeout(resolvedSensoriumPreviewUrl, 12_000, 'sensorium install preview');
    const sensoriumPreviewText = await sensoriumPreview.text();
    if (!sensoriumPreview.ok || !sensoriumPreviewText.includes('data-liminal-sites-sensorium')) {
      throw new Error(`Sensorium install preview did not verify: ${sensoriumPreview.status}`);
    }
    const sensoriumPage = await browser.newPage({ viewport: { width: 1280, height: 820 } });
    let sensoriumRuntimeReceipt: Record<string, unknown> = {};
    try {
      await sensoriumPage.goto(resolvedSensoriumPreviewUrl, { waitUntil: 'domcontentloaded' });
      await sensoriumPage.waitForFunction(() => (window as any).__liminalSitesSensorium?.ready === true, undefined, { timeout: 12_000 });
      sensoriumRuntimeReceipt = await sensoriumPage.evaluate(() => ({
        ready: (window as any).__liminalSitesSensorium?.ready === true,
        layerExists: Boolean(document.querySelector('#liminal-sites-sensorium-layer')),
        pointerEvents: window.getComputedStyle(document.querySelector('#liminal-sites-sensorium-layer') as Element).pointerEvents,
        protectedSurfaces: (window as any).__liminalSitesSensorium?.protectedSurfaces,
      }));
    } finally {
      await sensoriumPage.close();
    }
    await selectedSkinPanel.getByRole('button', { name: 'Rollback receipt' }).click();
    await page.locator('.living-site-rollback').waitFor({ state: 'visible', timeout: 12_000 });
    await page.locator('.living-site-panel--profile').getByRole('button', { name: 'Project dashboard' }).click();
    await page.locator('.living-site-dashboard').waitFor({ state: 'visible', timeout: 12_000 });
    await selectedSkinPanel.getByRole('button', { name: 'Operator runbook' }).click();
    await page.locator('.living-site-runbook').waitFor({ state: 'visible', timeout: 12_000 });
    await page.waitForTimeout(700);

    const screenshotPath = path.join(outDir, 'studio-living-site.png');
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      const style = document.createElement('style');
      style.textContent = '.liminal-skip-link { display: none !important; }';
      document.head.append(style);
    });
    const screenshot = await page.screenshot({ path: screenshotPath, fullPage: true });
    const metrics = await page.evaluate(() => ({
      livingTabVisible: Boolean(document.querySelector('.living-site-studio')),
      ingestionVisible: Boolean(document.querySelector('.living-site-ingestion')),
      ingestionTitle: document.querySelector('.living-site-ingestion strong')?.textContent ?? '',
      ingestionImageCount: document.querySelectorAll('.living-site-ingestion__screenshot').length,
      assessmentVisible: Boolean(document.querySelector('.living-site-assessment')),
      assessmentRankCount: document.querySelectorAll('.living-site-assessment-card').length,
      assessmentText: document.querySelector('.living-site-assessment')?.textContent ?? '',
      deploymentVisible: Boolean(document.querySelector('.living-site-deployment')),
      deploymentText: document.querySelector('.living-site-deployment')?.textContent ?? '',
      sensoriumVisible: Boolean(document.querySelector('.living-site-sensorium')),
      sensoriumText: document.querySelector('.living-site-sensorium')?.textContent ?? '',
      sensoriumPackageVisible: Boolean(document.querySelector('.living-site-sensorium__package')),
      creativeVisible: Boolean(document.querySelector('.living-site-creative-receipt')),
      creativeText: document.querySelector('.living-site-creative-receipt')?.textContent ?? '',
      creativeCapabilityCount: document.querySelectorAll('.living-site-capability').length,
      fullLiminalModeVisible: Array.from(document.querySelectorAll('option')).some((option) => option.textContent === 'Full Liminal'),
      rollbackVisible: Boolean(document.querySelector('.living-site-rollback')),
      rollbackText: document.querySelector('.living-site-rollback')?.textContent ?? '',
      dashboardVisible: Boolean(document.querySelector('.living-site-dashboard')),
      dashboardText: document.querySelector('.living-site-dashboard')?.textContent ?? '',
      runbookVisible: Boolean(document.querySelector('.living-site-runbook')),
      runbookText: document.querySelector('.living-site-runbook')?.textContent ?? '',
      runbookCheckCount: document.querySelectorAll('.living-site-runbook__check').length,
      variantCount: document.querySelectorAll('.living-site-variant').length,
      selectedSkinText: Array.from(document.querySelectorAll('.living-site-panel'))
        .find((panel) => panel.textContent?.includes('Selected Skin'))
        ?.querySelector('strong')
        ?.textContent ?? '',
      iframeCount: document.querySelectorAll('iframe[title="Live preview"]').length,
      screenshotTextLength: document.body.innerText.length,
    }));
    const proof = {
      ok: metrics.livingTabVisible
        && metrics.ingestionVisible
        && metrics.ingestionImageCount === 1
        && metrics.assessmentVisible
        && metrics.assessmentRankCount > 0
        && metrics.assessmentText.includes('Taste memory:')
        && metrics.creativeVisible
        && metrics.creativeCapabilityCount >= 13
        && metrics.fullLiminalModeVisible
        && metrics.deploymentVisible
        && metrics.deploymentText.includes('data-liminal-sites')
        && metrics.sensoriumVisible
        && metrics.sensoriumText.includes('PostHog Sensorium')
        && metrics.sensoriumPackageVisible
        && metrics.rollbackVisible
        && metrics.rollbackText.includes('Rollback Receipt')
        && metrics.dashboardVisible
        && metrics.dashboardText.includes('Project Dashboard')
        && metrics.runbookVisible
        && metrics.runbookText.includes('Operator Runbook')
        && metrics.runbookCheckCount >= 6
        && metrics.variantCount > 0
        && metrics.iframeCount === 1
        && frameText.includes('Website that keeps learning.')
        && sensoriumPreviewText.includes('data-liminal-sites-sensorium')
        && sensoriumRuntimeReceipt.ready === true
        && sensoriumRuntimeReceipt.layerExists === true
        && sensoriumRuntimeReceipt.pointerEvents === 'none',
      metrics,
      sensoriumRuntimeReceipt,
      frameTextLength: frameText.length,
      installPreviewTextLength: installPreviewText.length,
      sensoriumPreviewTextLength: sensoriumPreviewText.length,
      screenshotPath,
      screenshotBytes: screenshot.length,
      apiPort: started.apiPort,
      fixtureUrl: started.fixtureUrl,
      guiPort: started.guiPort,
    };
    await fs.writeFile(path.join(outDir, 'metrics.json'), `${JSON.stringify(proof, null, 2)}\n`);
    if (!proof.ok || screenshot.length < 25_000) {
      throw new Error(`Living Sites operator smoke failed: ${JSON.stringify(proof, null, 2)}`);
    }
    console.log(JSON.stringify(proof, null, 2));
  } catch (error) {
    await writeFailureReceipt(outDir, error, debugEvents, started, page);
    throw error;
  } finally {
    await browser.close();
    await stopStudio(started);
  }
}

async function writeFailureReceipt(
  outDir: string,
  error: unknown,
  debugEvents: SmokeDebugEvent[],
  started: SmokeStarted,
  page?: Page,
) {
  let pageState: Record<string, unknown> = {};
  if (page) {
    const failureScreenshotPath = path.join(outDir, 'failure.png');
    const failureHtmlPath = path.join(outDir, 'failure.html');
    await page.screenshot({ path: failureScreenshotPath, fullPage: true }).catch(() => undefined);
    const html = await page.content().catch(() => '');
    if (html) await fs.writeFile(failureHtmlPath, html);
    pageState = await page.evaluate(() => ({
      bodyText: document.body.innerText.slice(0, 8_000),
      statusText: document.querySelector('[role="status"]')?.textContent ?? '',
      errorText: document.querySelector('.living-site-error')?.textContent ?? '',
      creativeReceiptVisible: Boolean(document.querySelector('.living-site-creative-receipt')),
      creativeMode: (() => {
        const label = Array.from(document.querySelectorAll('label')).find((candidate) => (
          candidate.textContent?.includes('Creative mode')
        ));
        return label?.querySelector('select')?.value ?? '';
      })(),
      busyButtons: Array.from(document.querySelectorAll('button[disabled]')).map((button) => button.textContent ?? ''),
    })).catch((pageError: unknown) => ({ error: pageError instanceof Error ? pageError.message : String(pageError) }));
    pageState = { ...pageState, failureScreenshotPath, failureHtmlPath };
  }
  const failure = {
    ok: false,
    error: error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) },
    events: debugEvents,
    pageState,
    apiPort: started.apiPort,
    fixtureUrl: started.fixtureUrl,
    guiPort: started.guiPort,
  };
  await fs.writeFile(path.join(outDir, 'failure.json'), `${JSON.stringify(failure, null, 2)}\n`);
}

async function waitForStatus(page: Page, expected: string) {
  await page.waitForFunction((status) => (
    document.querySelector('.living-site-panel--profile small')?.textContent === status
  ), expected, { timeout: 12_000 });
}

async function waitForStatusContains(page: Page, expected: string) {
  await page.waitForFunction((status) => (
    document.querySelector('.living-site-panel--profile small')?.textContent?.includes(status)
  ), expected, { timeout: 12_000 });
}

async function waitForLabeledSelectValue(page: Page, labelText: string, expected: string) {
  await page.waitForFunction(({ labelText: text, expected: value }) => (
    Array.from(document.querySelectorAll('label'))
      .find((candidate) => candidate.textContent?.includes(text))
      ?.querySelector('select')
      ?.value === value
  ), { labelText, expected }, { timeout: 4_000 });
}

async function waitForEnabledButton(page: Page, name: string) {
  await page.waitForFunction((buttonName) => (
    Array.from(document.querySelectorAll('button')).some((button) => (
      button.textContent?.trim() === buttonName && !button.disabled
    ))
  ), name, { timeout: 12_000 });
}

async function startStudio(root: string): Promise<SmokeStarted> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'liminal-sites-operator-smoke-'));
  const [apiPort, fixturePort, guiPort] = await Promise.all([freePort(), freePort(), freePort()]);
  process.env.LIMINAL_CONFIG_PATH = path.join(tempDir, 'config.json');
  process.env.LIMINAL_SITES_ROOT = path.join(tempDir, 'sites-state');
  process.env.VITE_API_TARGET = `http://127.0.0.1:${apiPort}`;
  process.env.LIMINAL_STUDIO_FRAME_ANCESTORS = `http://127.0.0.1:${guiPort}`;
  await fs.writeFile(process.env.LIMINAL_CONFIG_PATH, JSON.stringify({ defaultProvider: 'lmstudio', providers: {} }, null, 2));

  const fixture = createFixtureSite();
  await new Promise<void>((resolve) => fixture.listen(fixturePort, '127.0.0.1', () => resolve()));
  await ensureCurrentBuild(root);
  const { createApp } = await import(`${pathToFileURL(path.join(root, 'gui', 'server.js')).href}?t=${Date.now()}`);
  const backend = http.createServer(createApp(process.env.LIMINAL_CONFIG_PATH, apiPort));
  await new Promise<void>((resolve) => backend.listen(apiPort, '127.0.0.1', () => resolve()));
  const vite = await createViteServer({
    root: path.join(root, 'gui'),
    cacheDir: path.join(tempDir, 'vite-cache'),
    server: { host: '127.0.0.1', port: guiPort, strictPort: true },
    logLevel: 'error',
  });
  await vite.listen();
  return { backend, fixture, vite, apiPort, fixtureUrl: `http://127.0.0.1:${fixturePort}`, guiPort, tempDir };
}

async function ensureCurrentBuild(root: string) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn('pnpm', ['build'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
    const stderr: Buffer[] = [];
    child.stderr.on('data', (chunk: Buffer) => stderr.push(chunk));
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`pnpm build failed before operator smoke server start: ${signal ?? code}\n${Buffer.concat(stderr).toString('utf8')}`));
    });
  });
}

async function stopStudio(started: SmokeStarted) {
  await withTimeout(started.vite.close(), 3_000);
  started.backend.closeAllConnections?.();
  started.backend.closeIdleConnections?.();
  started.fixture.closeAllConnections?.();
  started.fixture.closeIdleConnections?.();
  await withTimeout(new Promise<void>((resolve) => started.backend.close(() => resolve())), 3_000);
  await withTimeout(new Promise<void>((resolve) => started.fixture.close(() => resolve())), 3_000);
  await fs.rm(started.tempDir, { recursive: true, force: true }).catch(() => {});
  delete process.env.LIMINAL_CONFIG_PATH;
  delete process.env.LIMINAL_SITES_ROOT;
  delete process.env.VITE_API_TARGET;
  delete process.env.LIMINAL_STUDIO_FRAME_ANCESTORS;
}

function createFixtureSite(): http.Server {
  return http.createServer((_req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bounded Loop Studio</title>
    <meta name="description" content="A real source site for proving living-site ingestion before evolution.">
    <style>
      :root { color-scheme: dark; --ink: #f7f3e8; --cyan: #54d7ff; --green: #71e0a4; --ember: #ffb457; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        color: var(--ink);
        background: #081016;
      }
      main {
        min-height: 100vh;
        display: grid;
        grid-template-columns: minmax(0, 0.9fr) minmax(280px, 0.55fr);
        align-items: center;
        gap: 42px;
        padding: 72px;
      }
      h1 { margin: 0; max-width: 720px; font-size: clamp(48px, 6vw, 88px); line-height: 0.95; }
      p { max-width: 620px; color: #b8cad5; font-size: 20px; line-height: 1.55; }
      a, button { min-height: 44px; border: 1px solid rgba(84, 215, 255, 0.55); border-radius: 8px; }
      a { display: inline-grid; place-items: center; padding: 0 18px; color: var(--cyan); text-decoration: none; }
      button { padding: 0 18px; color: #071018; background: var(--green); font-weight: 800; }
      aside { display: grid; gap: 12px; }
      section { padding: 18px; border: 1px solid rgba(255,255,255,0.13); border-radius: 8px; background: rgba(255,255,255,0.045); }
    </style>
  </head>
  <body>
    <main>
      <div>
        <h1>Bounded Loop Studio</h1>
        <p>Every operator path is grounded in a captured source, visible receipts, and reviewable evolution before a website changes.</p>
        <a href="/receipt">Inspect receipt</a>
        <button>Start loop</button>
      </div>
      <aside>
        <section><h2>Ingest</h2><p>Capture the real page, colors, typography, and structural density.</p></section>
        <section><h2>Evolve</h2><p>Generate only after the current site has been seen.</p></section>
      </aside>
    </main>
  </body>
</html>`);
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

async function fetchWithTimeout(url: string, timeoutMs: number, label: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
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

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.stack ?? error.message : String(error));
    process.exit(1);
  });
