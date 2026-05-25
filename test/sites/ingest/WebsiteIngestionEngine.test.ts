import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { WebsiteEvolutionEngine } from '../../../src/sites/WebsiteEvolutionEngine.js';

async function tempRoot(prefix: string) {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

async function createStaticSiteFixture() {
  const root = await tempRoot('liminal-sites-ingest-source-');
  await fs.mkdir(path.join(root, 'src'), { recursive: true });
  await fs.writeFile(path.join(root, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n');
  await fs.writeFile(path.join(root, 'package.json'), JSON.stringify({
    scripts: { dev: 'vite --host 127.0.0.1' },
    dependencies: { react: 'latest' },
    devDependencies: { vite: 'latest' },
  }, null, 2));
  await fs.writeFile(path.join(root, 'src/main.tsx'), "console.log('fixture');\n");
  await fs.writeFile(path.join(root, 'src/index.css'), [
    ':root { --brand: #0f766e; }',
    'body { font-family: Inter, system-ui, sans-serif; color: #f8fafc; background: #0b1120; }',
    'button { background: #f59e0b; }',
  ].join('\n'));
  await fs.writeFile(path.join(root, 'index.html'), `<!doctype html>
<html>
  <head>
    <title>Signal Works</title>
    <meta name="description" content="A measured website for operators who need proof before launch.">
    <style>main { color: #14b8a6; }</style>
  </head>
  <body>
    <main>
      <h1>Signal Works</h1>
      <h2>Receipts before polish</h2>
      <section>
        <p>We compare the current site, extract the visual language, and produce a grounded next direction.</p>
        <a href="/demo">View demo</a>
        <button>Start</button>
      </section>
    </main>
  </body>
</html>`);
  return root;
}

describe('WebsiteIngestionEngine', () => {
  it('captures a local website source as a persistent design receipt', async () => {
    const rootDir = await tempRoot('liminal-sites-ingest-state-');
    const sourcePath = await createStaticSiteFixture();
    const engine = new WebsiteEvolutionEngine({ rootDir });
    const profile = await engine.createProfile({
      name: 'Signal Works',
      sourcePath,
      brandBrief: 'Operator website that uses proof as the design material.',
      allowedModes: ['runtime-skin', 'repo-native-pr'],
    });

    const ingestion = await engine.ingestSource(profile.siteId, {
      sourcePath,
      captureVisual: false,
      viewport: { width: 1280, height: 820 },
    });
    const listed = await engine.listIngestions(profile.siteId);

    expect(ingestion.source.kind).toBe('path');
    expect(ingestion.title).toBe('Signal Works');
    expect(ingestion.description).toContain('proof before launch');
    expect(ingestion.metrics.headingCount).toBe(2);
    expect(ingestion.metrics.linkCount + ingestion.metrics.buttonCount).toBe(2);
    expect(ingestion.designSignals.colors).toEqual(expect.arrayContaining(['#14b8a6', '#0f766e', '#f59e0b']));
    expect(ingestion.designSignals.fonts.join(' ')).toContain('Inter');
    expect(ingestion.repository).toMatchObject({ framework: 'vite', packageManager: 'pnpm' });
    expect(ingestion.recommendedBrandBrief).toContain('Current visual signals');
    expect(await fs.readFile(ingestion.sourceHtmlPath ?? '', 'utf8')).toContain('Receipts before polish');
    expect(listed.map((item) => item.ingestionId)).toEqual([ingestion.ingestionId]);
  });
});
