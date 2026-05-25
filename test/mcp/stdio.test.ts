import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { describe, expect, it } from 'vitest';
import { createLiminalSitesMcpServer } from '../../src/mcp/stdio.js';

describe('Liminal Sites MCP stdio server', () => {
  it('lists tools and executes the profile/variant/resource flow over MCP transport', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'liminal-sites-mcp-'));
    const sourcePath = await fs.mkdtemp(path.join(os.tmpdir(), 'liminal-sites-mcp-source-'));
    await fs.writeFile(path.join(sourcePath, 'index.html'), `<!doctype html>
<html>
  <head>
    <title>MCP Source Site</title>
    <meta name="description" content="A source site captured through MCP.">
  </head>
  <body><main><h1>MCP Source Site</h1><button>Capture</button></main></body>
</html>`);
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const server = createLiminalSitesMcpServer({ rootDir });
    const client = new Client({ name: 'liminal-sites-test-client', version: '0.0.0' });

    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
    try {
      const tools = await client.listTools();
      expect(tools.tools.map((tool) => tool.name)).toEqual(expect.arrayContaining([
        'liminal_site_profile_create',
        'liminal_site_generate_variants',
        'liminal_site_ingest_source',
        'liminal_site_compare_aesthetics',
        'liminal_site_create_deployment_package',
        'liminal_site_rollback_to_skin',
        'liminal_site_create_operator_runbook',
        'liminal_site_record_preference',
        'liminal_site_evolve',
        'liminal_site_export_runtime_skin',
        'liminal_site_compose_creative',
        'liminal_site_export_creative_composition',
        'liminal_site_plan_repo_patch',
      ]));

      const profileResult = await client.callTool({
        name: 'liminal_site_profile_create',
        arguments: {
          name: 'MCP Living Site',
          sourceUrl: 'https://example.com',
          brandBrief: 'operator-focused living website with calm kinetic motion',
        },
      });
      const profile = (profileResult.structuredContent?.profile as { siteId: string }) ?? null;
      expect(profile.siteId).toMatch(/^mcp-living-site-/);

      const ingestionResult = await client.callTool({
        name: 'liminal_site_ingest_source',
        arguments: {
          siteId: profile.siteId,
          sourcePath,
          captureVisual: false,
        },
      });
      const ingestion = ingestionResult.structuredContent?.ingestion as { title: string; metrics: { headingCount: number } };
      expect(ingestion.title).toBe('MCP Source Site');
      expect(ingestion.metrics.headingCount).toBe(1);

      const variantResult = await client.callTool({
        name: 'liminal_site_generate_variants',
        arguments: {
          siteId: profile.siteId,
          prompt: 'Generate a credible living-site direction.',
          count: 1,
        },
      });
      const run = variantResult.structuredContent?.run as { variants: Array<{ skinId: string }> };
      expect(run.variants).toHaveLength(1);

      const assessmentResult = await client.callTool({
        name: 'liminal_site_compare_aesthetics',
        arguments: {
          siteId: profile.siteId,
          skinIds: run.variants.map((variant) => variant.skinId),
        },
      });
      const assessment = assessmentResult.structuredContent?.assessment as { candidates: Array<{ skinId: string }>; preferenceSummary: string };
      expect(assessment.candidates).toEqual([{ skinId: run.variants[0].skinId, name: expect.any(String), rank: 1, score: expect.any(Number), breakdown: expect.any(Object), signals: expect.any(Object), rationale: expect.any(Array), risks: expect.any(Array), nextPrompt: expect.any(String) }]);
      expect(assessment.preferenceSummary).toContain('Taste memory');

      const creativeResult = await client.callTool({
        name: 'liminal_site_compose_creative',
        arguments: {
          siteId: profile.siteId,
          skinId: run.variants[0].skinId,
          prompt: 'Exercise the MCP full-liminal schema with an explicitly selected p5 site layer.',
          strategy: 'full-liminal',
          domainMode: 'selected',
          domains: ['p5'],
          candidatesPerDomain: 1,
          includeAudio: false,
          includeVideoAssets: false,
        },
      });
      const composition = creativeResult.structuredContent?.composition as {
        compositionId: string;
        strategy: string;
        domainMode: string;
        capabilityMatrix: { domains: Array<{ domain: string; status: string }>; summary: { total: number } };
        rejectedCandidates: Array<{ domain: string; status: string }>;
      };
      expect(composition.strategy).toBe('full-liminal');
      expect(composition.domainMode).toBe('selected');
      expect(composition.capabilityMatrix.summary.total).toBeGreaterThanOrEqual(13);
      expect(composition.capabilityMatrix.domains.find((capability) => capability.domain === 'p5')?.status).toMatch(/used|failed/);

      const creativeExportResult = await client.callTool({
        name: 'liminal_site_export_creative_composition',
        arguments: {
          siteId: profile.siteId,
          compositionId: composition.compositionId,
        },
      });
      const creativeExport = creativeExportResult.structuredContent?.export as { files: { manifest: string; js: string } };
      expect(creativeExport.files.manifest).toContain('"capabilityMatrix"');
      expect(creativeExport.files.js).toContain('__liminalSitesCreative');

      const deploymentResult = await client.callTool({
        name: 'liminal_site_create_deployment_package',
        arguments: {
          siteId: profile.siteId,
          skinId: run.variants[0].skinId,
          compositionId: composition.compositionId,
          publicBaseUrl: 'http://127.0.0.1:9999',
        },
      });
      const deployment = deploymentResult.structuredContent?.deployment as { installSnippets: { combined: string }; manifest: { assets: { css: string } } };
      expect(deployment.installSnippets.combined).toContain('data-liminal-sites');
      expect(deployment.manifest.assets.css).toContain('/deployments/');

      const rollbackResult = await client.callTool({
        name: 'liminal_site_rollback_to_skin',
        arguments: {
          siteId: profile.siteId,
          skinId: run.variants[0].skinId,
          reason: 'MCP client needs a recoverable install point.',
        },
      });
      const rollback = rollbackResult.structuredContent?.rollback as { skinId: string; verificationChecklist: string[] };
      expect(rollback.skinId).toBe(run.variants[0].skinId);
      expect(rollback.verificationChecklist.join(' ')).toContain('Preview');

      const runbookResult = await client.callTool({
        name: 'liminal_site_create_operator_runbook',
        arguments: {
          siteId: profile.siteId,
          skinId: run.variants[0].skinId,
        },
      });
      const runbook = runbookResult.structuredContent?.runbook as { skinId: string; checks: Array<{ id: string }>; recoveryPaths: string[] };
      expect(runbook.skinId).toBe(run.variants[0].skinId);
      expect(runbook.checks.map((check) => check.id)).toContain('rollback-receipt');
      expect(runbook.recoveryPaths.join(' ')).toContain('Rollback receipt');

      const resource = await client.readResource({ uri: `liminal://sites/${profile.siteId}/variants` });
      expect(resource.contents[0]).toMatchObject({ mimeType: 'application/json' });
      expect(JSON.parse(resource.contents[0]?.text ?? '{}')).toMatchObject({
        variants: [{ skinId: run.variants[0].skinId }],
      });
      const ingestionsResource = await client.readResource({ uri: `liminal://sites/${profile.siteId}/ingestions` });
      expect(JSON.parse(ingestionsResource.contents[0]?.text ?? '{}')).toMatchObject({
        ingestions: [{ title: 'MCP Source Site' }],
      });
      const assessmentsResource = await client.readResource({ uri: `liminal://sites/${profile.siteId}/aesthetic-assessments` });
      expect(JSON.parse(assessmentsResource.contents[0]?.text ?? '{}')).toMatchObject({
        assessments: [{ candidates: [{ skinId: run.variants[0].skinId }] }],
      });
      const compositionsResource = await client.readResource({ uri: `liminal://sites/${profile.siteId}/creative-compositions` });
      expect(JSON.parse(compositionsResource.contents[0]?.text ?? '{}')).toMatchObject({
        compositions: [{ compositionId: composition.compositionId, strategy: 'full-liminal' }],
      });
      const capabilitiesResource = await client.readResource({ uri: `liminal://sites/${profile.siteId}/capabilities` });
      expect(JSON.parse(capabilitiesResource.contents[0]?.text ?? '{}')).toMatchObject({
        siteId: profile.siteId,
        latestComposition: { compositionId: composition.compositionId },
        inventory: { summary: { total: expect.any(Number) } },
      });
      const deploymentsResource = await client.readResource({ uri: `liminal://sites/${profile.siteId}/deployments` });
      expect(JSON.parse(deploymentsResource.contents[0]?.text ?? '{}')).toMatchObject({
        deployments: [{ skinId: run.variants[0].skinId }],
      });
      const rollbacksResource = await client.readResource({ uri: `liminal://sites/${profile.siteId}/rollbacks` });
      expect(JSON.parse(rollbacksResource.contents[0]?.text ?? '{}')).toMatchObject({
        rollbacks: [{ skinId: run.variants[0].skinId }],
      });
      const runbooksResource = await client.readResource({ uri: `liminal://sites/${profile.siteId}/operator-runbooks` });
      expect(JSON.parse(runbooksResource.contents[0]?.text ?? '{}')).toMatchObject({
        runbooks: [{ skinId: run.variants[0].skinId }],
      });
      const projectsResource = await client.readResource({ uri: 'liminal://sites/projects' });
      expect(JSON.parse(projectsResource.contents[0]?.text ?? '{}')).toMatchObject({
        projects: [{ profile: { siteId: profile.siteId }, counts: { creativeCompositions: 1, rollbacks: 1, operatorRunbooks: 1 } }],
      });
    } finally {
      await client.close();
      await server.close();
    }
  });
});
