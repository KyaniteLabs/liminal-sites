import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { WebsiteEvolutionEngine } from '../../src/sites/WebsiteEvolutionEngine.js';

async function tempRoot() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'liminal-sites-engine-'));
}

async function sourceFixture() {
  const root = await tempRoot();
  await fs.writeFile(path.join(root, 'index.html'), `<!doctype html>
<html>
  <head>
    <title>Ingested Studio</title>
    <meta name="description" content="A compact studio site with strict proof habits.">
    <style>body { color: #f8fafc; background: #111827; font-family: Inter, sans-serif; }</style>
  </head>
  <body>
    <main>
      <h1>Ingested Studio</h1>
      <section><button>Begin</button></section>
    </main>
  </body>
</html>`);
  return root;
}

describe('WebsiteEvolutionEngine', () => {
  it('creates a profile and generates persistent runtime-skin variants', async () => {
    const rootDir = await tempRoot();
    const engine = new WebsiteEvolutionEngine({ rootDir });
    const profile = await engine.createProfile({
      name: 'Achiote Living Site',
      sourceUrl: 'https://example.com',
      brandBrief: 'Warm editorial website for a founder-led memory product.',
      constraints: ['No production deploy without review.'],
      allowedModes: ['runtime-skin', 'repo-native-pr'],
      stackHints: ['vite', 'react'],
    });

    const run = await engine.generateVariants(profile.siteId, {
      prompt: 'Make it feel alive, warm, and quietly premium.',
      count: 2,
    });

    expect(run.variants).toHaveLength(2);
    expect(run.variants[0].runtime.css).toContain('--liminal-sites-accent');
    expect(run.variants[0].runtime.js).toContain('liminal-sites-active');

    const listed = await engine.listVariants(profile.siteId);
    expect(listed.map((variant) => variant.skinId)).toEqual(run.variants.map((variant) => variant.skinId));
  });

  it('records curation and evolves from preference memory', async () => {
    const rootDir = await tempRoot();
    const engine = new WebsiteEvolutionEngine({ rootDir });
    const profile = await engine.createProfile({
      name: 'Living Portfolio',
      sourcePath: '/tmp/site',
      brandBrief: 'Kinetic visual identity for an independent creative technologist.',
    });
    const run = await engine.generateVariants(profile.siteId, { prompt: 'Electric but not generic.', count: 1 });
    const preference = await engine.recordPreference({
      siteId: profile.siteId,
      skinId: run.variants[0].skinId,
      kind: 'more-like-this',
      note: 'Keep the motion, make it more editorial.',
    });
    const evolved = await engine.evolve(profile.siteId, { count: 1 });

    expect(preference.kind).toBe('more-like-this');
    expect(evolved.variants[0].provenance.source).toBe('evolution');
    expect(evolved.variants[0].quality.notes.join(' ')).toContain('preference memory');
  });

  it('grounds generated variants in the latest website ingestion receipt', async () => {
    const rootDir = await tempRoot();
    const sourcePath = await sourceFixture();
    const engine = new WebsiteEvolutionEngine({ rootDir });
    const profile = await engine.createProfile({
      name: 'Ingested Studio',
      sourcePath,
      brandBrief: 'A living website for a studio that wants proof-visible polish.',
    });

    const ingestion = await engine.ingestSource(profile.siteId, { captureVisual: false });
    const run = await engine.generateVariants(profile.siteId, {
      prompt: 'Respect the current website, then evolve the first viewport.',
      count: 1,
    });

    expect(ingestion.title).toBe('Ingested Studio');
    expect(run.variants[0].prompt).toContain('Current website ingestion: Ingested Studio');
    expect(run.variants[0].prompt).toContain('density=');
    expect(run.variants[0].quality.notes.join(' ')).toContain('reviewable living-site direction');
  });

  it('compares variants with ingestion signals and taste memory', async () => {
    const rootDir = await tempRoot();
    const sourcePath = await sourceFixture();
    const engine = new WebsiteEvolutionEngine({ rootDir });
    const profile = await engine.createProfile({
      name: 'Aesthetic Loop Studio',
      sourcePath,
      brandBrief: 'A calm operator website with visible proof and evolving taste.',
    });
    await engine.ingestSource(profile.siteId, { captureVisual: false });
    const run = await engine.generateVariants(profile.siteId, {
      prompt: 'Create three directions that balance continuity and tasteful novelty.',
      count: 3,
    });
    await engine.recordPreference({
      siteId: profile.siteId,
      skinId: run.variants[1].skinId,
      kind: 'favorite',
      note: 'This feels closest to the operator taste.',
    });

    const assessment = await engine.compareAesthetics(profile.siteId, {
      skinIds: run.variants.map((variant) => variant.skinId),
    });
    const listed = await engine.listAestheticAssessments(profile.siteId);

    expect(assessment.candidates).toHaveLength(3);
    expect(assessment.candidates.map((candidate) => candidate.rank)).toEqual([1, 2, 3]);
    expect(assessment.preferenceSummary).toContain('1 positive');
    expect(assessment.operatorSummary).toContain('strongest current direction');
    expect(assessment.nextEvolutionPrompt).toContain('Taste memory');
    expect(assessment.candidates[0].breakdown).toMatchObject({
      quality: expect.any(Number),
      continuity: expect.any(Number),
      novelty: expect.any(Number),
      taste: expect.any(Number),
    });
    expect(listed.map((item) => item.assessmentId)).toEqual([assessment.assessmentId]);
  });

  it('exports the selected runtime skin as CSS, JS, and manifest files', async () => {
    const rootDir = await tempRoot();
    const outputDir = await tempRoot();
    const engine = new WebsiteEvolutionEngine({ rootDir });
    const profile = await engine.createProfile({
      name: 'Runtime Skin Demo',
      sourceUrl: 'https://example.com',
      brandBrief: 'Calm launch site with luminous atmosphere.',
    });
    const run = await engine.generateVariants(profile.siteId, { prompt: 'Soft luminous direction.', count: 1 });
    const exported = await engine.exportRuntimeSkin(profile.siteId, run.variants[0].skinId, outputDir);

    await expect(fs.readFile(exported.cssPath, 'utf-8')).resolves.toContain('liminal-sites-atmosphere');
    await expect(fs.readFile(exported.jsPath, 'utf-8')).resolves.toContain(run.variants[0].skinId);
    await expect(fs.readFile(exported.manifestPath, 'utf-8')).resolves.toContain('"files"');
  });

  it('creates an installable runtime deployment package for a selected skin', async () => {
    const rootDir = await tempRoot();
    const engine = new WebsiteEvolutionEngine({ rootDir });
    const profile = await engine.createProfile({
      name: 'Deployable Runtime Skin',
      sourceUrl: 'https://example.com',
      brandBrief: 'A calm site that needs a reversible install snippet.',
    });
    const run = await engine.generateVariants(profile.siteId, { prompt: 'Make a deployable runtime direction.', count: 1 });
    const deployment = await engine.createDeploymentPackage(profile.siteId, {
      skinId: run.variants[0].skinId,
      publicBaseUrl: 'http://127.0.0.1:7777',
    });
    const listed = await engine.listDeploymentPackages(profile.siteId);

    expect(deployment.installSnippets.combined).toContain('data-liminal-sites');
    expect(deployment.manifest.assets.css).toContain('/api/living-sites/');
    expect(deployment.verificationChecklist.join(' ')).toContain('document.body');
    await expect(fs.readFile(deployment.files.cssPath, 'utf8')).resolves.toContain('--liminal-sites-bg');
    await expect(fs.readFile(deployment.files.jsPath, 'utf8')).resolves.toContain('liminal-sites-active');
    await expect(fs.readFile(deployment.files.installHtmlPath, 'utf8')).resolves.toContain(deployment.installSnippets.head);
    expect(listed.map((item) => item.deploymentId)).toEqual([deployment.deploymentId]);
  });

  it('summarizes saved project history and records rollback receipts', async () => {
    const rootDir = await tempRoot();
    const engine = new WebsiteEvolutionEngine({ rootDir });
    const profile = await engine.createProfile({
      name: 'Recoverable Living Site',
      sourceUrl: 'https://example.com',
      brandBrief: 'A living site that needs reversible operator history.',
    });
    const run = await engine.generateVariants(profile.siteId, { prompt: 'Create recoverable directions.', count: 2 });
    await engine.recordPreference({
      siteId: profile.siteId,
      skinId: run.variants[0].skinId,
      kind: 'publish',
      note: 'Initial published direction.',
    });
    const rollback = await engine.createRollbackReceipt(profile.siteId, {
      skinId: run.variants[1].skinId,
      reason: 'Return to the calmer tested direction.',
    });
    const rollbacks = await engine.listRollbackReceipts(profile.siteId);
    const projects = await engine.listProjectSummaries();

    expect(rollback.previousPublishedSkinId).toBe(run.variants[0].skinId);
    expect(rollback.preferenceEventId).toMatch(/^pref-/);
    expect(rollback.operatorSteps.join(' ')).toContain('saved variant history');
    expect(rollbacks.map((item) => item.rollbackId)).toEqual([rollback.rollbackId]);
    expect(projects).toHaveLength(1);
    expect(projects[0]).toMatchObject({
      profile: { siteId: profile.siteId, name: 'Recoverable Living Site' },
      counts: { variants: 2, preferences: 2, rollbacks: 1 },
      publishedSkinId: run.variants[1].skinId,
      latest: {
        rollback: { rollbackId: rollback.rollbackId, skinId: run.variants[1].skinId },
      },
    });
    expect(projects[0].receipts[0]).toMatchObject({
      kind: 'rollback',
      id: rollback.rollbackId,
      skinId: run.variants[1].skinId,
    });
    expect(projects[0].nextOperatorAction).toContain('Ingest');
  });

  it('creates operator runbooks with readiness checks and recovery paths', async () => {
    const rootDir = await tempRoot();
    const sourcePath = await sourceFixture();
    const engine = new WebsiteEvolutionEngine({ rootDir });
    const profile = await engine.createProfile({
      name: 'Runbook Living Site',
      sourcePath,
      brandBrief: 'A living site that needs an operator-safe install runbook.',
    });
    await engine.ingestSource(profile.siteId, { captureVisual: false });
    const run = await engine.generateVariants(profile.siteId, { prompt: 'Create a runbook-ready direction.', count: 2 });
    const skinId = run.variants[0].skinId;
    await engine.recordPreference({
      siteId: profile.siteId,
      skinId,
      kind: 'favorite',
      note: 'Use this as the install candidate.',
    });
    await engine.compareAesthetics(profile.siteId, { skinIds: run.variants.map((variant) => variant.skinId) });
    await engine.createDeploymentPackage(profile.siteId, {
      skinId,
      publicBaseUrl: 'http://127.0.0.1:7777',
    });
    await engine.createRollbackReceipt(profile.siteId, { skinId, reason: 'Need a known recovery target.' });

    const runbook = await engine.createOperatorRunbook(profile.siteId, { skinId });
    const runbooks = await engine.listOperatorRunbooks(profile.siteId);
    const projects = await engine.listProjectSummaries();

    expect(runbook.status).toBe('needs-action');
    expect(runbook.summary).toContain('needs one more operator check');
    expect(runbook.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'source-ingested', status: 'ready' }),
      expect.objectContaining({ id: 'visual-receipt', status: 'warning' }),
      expect.objectContaining({ id: 'deployment-package', status: 'ready' }),
      expect.objectContaining({ id: 'rollback-receipt', status: 'ready' }),
    ]));
    expect(runbook.recoveryPaths.join(' ')).toContain('Rollback receipt');
    expect(runbooks.map((item) => item.runbookId)).toEqual([runbook.runbookId]);
    expect(projects[0].counts.operatorRunbooks).toBe(1);
    expect(projects[0].receipts[0]).toMatchObject({
      kind: 'operator-runbook',
      id: runbook.runbookId,
    });
  });

  it('composes a selected skin into a persisted cross-domain creative site receipt', async () => {
    const rootDir = await tempRoot();
    const engine = new WebsiteEvolutionEngine({ rootDir });
    const profile = await engine.createProfile({
      name: 'Creative Runtime Site',
      sourceUrl: 'https://example.com',
      brandBrief: 'A living site that should gain generative shader atmosphere and kinetic copy.',
    });
    const run = await engine.generateVariants(profile.siteId, {
      prompt: 'Make the site feel alive and artistic.',
      count: 1,
    });

    const composition = await engine.composeCreativeSite(profile.siteId, {
      skinId: run.variants[0].skinId,
      prompt: 'Use Liminal creative domains to make the site visibly generative.',
    });
    const listed = await engine.listCreativeCompositions(profile.siteId);
    const exported = await engine.exportCreativeComposition(profile.siteId, composition.compositionId, path.join(rootDir, 'creative-export'));
    const projects = await engine.listProjectSummaries();

    expect(composition.domains).toEqual(expect.arrayContaining(['shader', 'textgen']));
    expect(composition.layers.every((layer) => layer.validation.valid)).toBe(true);
    expect(composition.runtime.js).toContain('window.__liminalSitesCreative');
    expect(listed.map((item) => item.compositionId)).toEqual([composition.compositionId]);
    await expect(fs.readFile(exported.cssPath, 'utf8')).resolves.toContain('liminal-sites-creative-stage');
    await expect(fs.readFile(exported.jsPath, 'utf8')).resolves.toContain(composition.compositionId);
    await expect(fs.readFile(exported.manifestPath, 'utf8')).resolves.toContain('"domains"');
    expect(projects[0].counts.creativeCompositions).toBe(1);
    expect(projects[0].receipts[0]).toMatchObject({
      kind: 'creative-composition',
      id: composition.compositionId,
      skinId: run.variants[0].skinId,
    });
  });
});
