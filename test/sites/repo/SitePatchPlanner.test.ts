import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { WebsiteEvolutionEngine } from '../../../src/sites/WebsiteEvolutionEngine.js';
import { applySitePatchPlan, planSitePatch } from '../../../src/sites/repo/SitePatchPlanner.js';
import { inspectSiteRepo } from '../../../src/sites/repo/SiteRepoInspector.js';

describe('site repo patch planning', () => {
  it('detects a Vite repo and applies an idempotent living-site patch', async () => {
    const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'liminal-sites-repo-'));
    await fs.mkdir(path.join(repoRoot, 'src'), { recursive: true });
    await fs.writeFile(
      path.join(repoRoot, 'package.json'),
      JSON.stringify({
        scripts: { dev: 'vite', test: 'vitest' },
        dependencies: { '@vitejs/plugin-react': 'latest', react: 'latest' },
        devDependencies: { vite: 'latest' },
      }),
      'utf8',
    );
    await fs.writeFile(path.join(repoRoot, 'pnpm-lock.yaml'), '', 'utf8');
    await fs.writeFile(path.join(repoRoot, 'src/main.tsx'), "import React from 'react';\n\nconsole.log(React);\n", 'utf8');

    const engine = new WebsiteEvolutionEngine({ rootDir: path.join(repoRoot, '.state') });
    const profile = await engine.createProfile({
      name: 'Liminal Sites Demo',
      brandBrief: 'quiet living website for operators',
      sourceUrl: 'https://example.com',
    });
    const run = await engine.generateVariants(profile.siteId, { prompt: 'make it feel alive but credible', count: 1 });
    const inspection = await inspectSiteRepo(repoRoot);
    const plan = await planSitePatch({ repoRoot, spec: run.variants[0] });
    const written = await applySitePatchPlan(plan);
    const planAgain = await planSitePatch({ repoRoot, spec: run.variants[0] });

    expect(inspection.framework).toBe('vite');
    expect(inspection.packageManager).toBe('pnpm');
    expect(plan.patches.map((patch) => patch.path)).toContain('src/liminal-sites/liminal-skin.css');
    expect(written.some((filePath) => filePath.endsWith('src/main.tsx'))).toBe(true);
    await applySitePatchPlan(planAgain);
    const entry = await fs.readFile(path.join(repoRoot, 'src/main.tsx'), 'utf8');
    expect(entry.match(/liminal-sites\/liminal-skin\.css/g)).toHaveLength(1);
    expect(entry.match(/liminal-sites\/liminal-skin\.js/g)).toHaveLength(1);
  });

  it('injects static HTML assets when there is no app entry', async () => {
    const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'liminal-sites-static-'));
    await fs.writeFile(path.join(repoRoot, 'index.html'), '<html><head></head><body><main>Hello</main></body></html>\n', 'utf8');

    const engine = new WebsiteEvolutionEngine({ rootDir: path.join(repoRoot, '.state') });
    const profile = await engine.createProfile({
      name: 'Static Site',
      brandBrief: 'warm static public page',
      sourceUrl: 'https://example.com',
    });
    const run = await engine.generateVariants(profile.siteId, { prompt: 'make it more living', count: 1 });
    const plan = await planSitePatch({ repoRoot, spec: run.variants[0] });
    await applySitePatchPlan(plan);
    const html = await fs.readFile(path.join(repoRoot, 'index.html'), 'utf8');

    expect(plan.framework).toBe('static');
    expect(html).toContain('<link rel="stylesheet" href="./liminal-sites/liminal-skin.css">');
    expect(html).toContain('<script type="module" src="./liminal-sites/liminal-skin.js"></script>');
  });

  it('plans installable creative-composition assets alongside the runtime skin', async () => {
    const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'liminal-sites-creative-repo-'));
    await fs.mkdir(path.join(repoRoot, 'src'), { recursive: true });
    await fs.writeFile(path.join(repoRoot, 'package.json'), JSON.stringify({ scripts: { dev: 'vite' }, devDependencies: { vite: 'latest' } }), 'utf8');
    await fs.writeFile(path.join(repoRoot, 'src/main.tsx'), "console.log('creative site');\n", 'utf8');

    const engine = new WebsiteEvolutionEngine({ rootDir: path.join(repoRoot, '.state') });
    const profile = await engine.createProfile({
      name: 'Creative Patch Site',
      brandBrief: 'creative living website with a shader layer',
      sourceUrl: 'https://example.com',
    });
    const run = await engine.generateVariants(profile.siteId, { prompt: 'make it creative', count: 1 });
    const composition = await engine.composeCreativeSite(profile.siteId, {
      skinId: run.variants[0].skinId,
      prompt: 'Install a shader and kinetic text composition.',
    });

    const plan = await planSitePatch({ repoRoot, spec: run.variants[0], composition });
    await applySitePatchPlan(plan);
    const entry = await fs.readFile(path.join(repoRoot, 'src/main.tsx'), 'utf8');

    expect(plan.patches.map((patch) => patch.path)).toEqual(expect.arrayContaining([
      'src/liminal-sites/liminal-creative.css',
      'src/liminal-sites/liminal-creative.js',
      'src/liminal-sites/liminal-creative-manifest.json',
    ]));
    expect(entry).toContain("import './liminal-sites/liminal-creative.css';");
    expect(entry).toContain("import './liminal-sites/liminal-creative.js';");
    await expect(fs.readFile(path.join(repoRoot, 'src/liminal-sites/liminal-creative.js'), 'utf8')).resolves.toContain('__liminalSitesCreative');
  });
});
