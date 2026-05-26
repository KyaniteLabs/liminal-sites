import path from 'path';
import { pathToFileURL } from 'url';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import * as z from 'zod/v4';
import { WebsiteEvolutionEngine } from '../sites/WebsiteEvolutionEngine.js';
import { planSitePatch } from '../sites/repo/SitePatchPlanner.js';
import {
  SiteCreativeDomainModeSchema,
  SiteCreativeDomainSchema,
  SiteCreativeStrategySchema,
} from '../sites/types.js';

export interface LiminalSitesMcpOptions {
  rootDir?: string;
  name?: string;
  version?: string;
}

const PreferenceKindSchema = z.enum(['favorite', 'reject', 'more-like-this', 'less-like-this', 'publish']);
const DeliveryModeSchema = z.enum(['runtime-skin', 'repo-native-pr']);

export function createLiminalSitesMcpServer(options: LiminalSitesMcpOptions = {}): McpServer {
  const rootDir = options.rootDir ?? process.env.LIMINAL_SITES_ROOT ?? path.join(process.cwd(), '.liminal-sites');
  const engine = new WebsiteEvolutionEngine({ rootDir });
  const server = new McpServer({
    name: options.name ?? 'liminal-sites-mcp',
    version: options.version ?? '0.1.0',
  });

  server.registerTool(
    'liminal_site_profile_create',
    {
      title: 'Create Living Site Profile',
      description: 'Create a source-of-truth profile for a living website that Liminal can evolve.',
      inputSchema: {
        name: z.string().min(1).max(90),
        sourceUrl: z.string().url().optional(),
        sourcePath: z.string().min(1).optional(),
        brandBrief: z.string().min(1).max(4000),
        constraints: z.array(z.string().min(1).max(320)).optional(),
        allowedModes: z.array(DeliveryModeSchema).optional(),
        stackHints: z.array(z.string().min(1).max(80)).optional(),
      },
    },
    async (input) => jsonToolResult({ profile: await engine.createProfile(input) }),
  );

  server.registerTool(
    'liminal_site_generate_variants',
    {
      title: 'Generate Living Site Variants',
      description: 'Generate reviewable aesthetic/runtime directions for an existing living-site profile.',
      inputSchema: {
        siteId: z.string().min(1),
        prompt: z.string().min(1).max(4000),
        count: z.number().int().min(1).max(6).optional(),
        mode: DeliveryModeSchema.optional(),
      },
    },
    async (input) => jsonToolResult({ run: await engine.generateVariants(input.siteId, input) }),
  );

  server.registerTool(
    'liminal_site_ingest_source',
    {
      title: 'Ingest Website Source',
      description: 'Capture a real website URL or local source path into a visual/design receipt for grounded evolution.',
      inputSchema: {
        siteId: z.string().min(1),
        sourceUrl: z.string().url().optional(),
        sourcePath: z.string().min(1).optional(),
        captureVisual: z.boolean().optional(),
        viewport: z.object({
          width: z.number().int().min(320).max(3840).optional(),
          height: z.number().int().min(240).max(2400).optional(),
        }).optional(),
      },
    },
    async (input) => jsonToolResult({ ingestion: await engine.ingestSource(input.siteId, input) }),
  );

  server.registerTool(
    'liminal_site_record_preference',
    {
      title: 'Record Living Site Preference',
      description: 'Record an operator preference so the next generated direction can evolve from taste memory.',
      inputSchema: {
        siteId: z.string().min(1),
        skinId: z.string().min(1),
        kind: PreferenceKindSchema,
        note: z.string().max(1000).optional(),
      },
    },
    async (input) => jsonToolResult({ preference: await engine.recordPreference(input) }),
  );

  server.registerTool(
    'liminal_site_compare_aesthetics',
    {
      title: 'Compare Living Site Aesthetics',
      description: 'Rank current living-site variants against ingestion signals and operator taste memory.',
      inputSchema: {
        siteId: z.string().min(1),
        skinIds: z.array(z.string().min(1)).min(1).max(12).optional(),
        recordWinnerPreference: z.boolean().optional(),
      },
    },
    async (input) => jsonToolResult({ assessment: await engine.compareAesthetics(input.siteId, input) }),
  );

  server.registerTool(
    'liminal_site_evolve',
    {
      title: 'Evolve Living Site',
      description: 'Generate the next living-site variants from recorded preference memory.',
      inputSchema: {
        siteId: z.string().min(1),
        prompt: z.string().max(4000).optional(),
        count: z.number().int().min(1).max(6).optional(),
      },
    },
    async (input) => jsonToolResult({ run: await engine.evolve(input.siteId, input) }),
  );

  server.registerTool(
    'liminal_site_export_runtime_skin',
    {
      title: 'Export Runtime Skin',
      description: 'Export a selected living-site skin into CSS, JS, and manifest files.',
      inputSchema: {
        siteId: z.string().min(1),
        skinId: z.string().min(1),
        outputDir: z.string().min(1).optional(),
      },
    },
    async (input) => jsonToolResult({ export: await engine.exportRuntimeSkin(input.siteId, input.skinId, input.outputDir) }),
  );

  server.registerTool(
    'liminal_site_compose_creative',
    {
      title: 'Compose Living Site Creative Layer',
      description: 'Compose a selected living-site skin into balanced or full-liminal cross-domain runtime assets with validation and capability receipts.',
      inputSchema: {
        siteId: z.string().min(1),
        skinId: z.string().min(1).optional(),
        prompt: z.string().max(4000).optional(),
        strategy: SiteCreativeStrategySchema.optional(),
        domainMode: SiteCreativeDomainModeSchema.optional(),
        domains: z.array(SiteCreativeDomainSchema).min(1).max(13).optional(),
        candidatesPerDomain: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
        maxIterations: z.number().int().min(1).max(8).optional(),
        includeAudio: z.boolean().optional(),
        includeVideoAssets: z.boolean().optional(),
      },
    },
    async (input) => jsonToolResult({ composition: await engine.composeCreativeSite(input.siteId, input) }),
  );

  server.registerTool(
    'liminal_site_export_creative_composition',
    {
      title: 'Export Creative Composition',
      description: 'Export a living-site creative composition into CSS, JS, and manifest files.',
      inputSchema: {
        siteId: z.string().min(1),
        compositionId: z.string().min(1),
        outputDir: z.string().min(1).optional(),
      },
    },
    async (input) => jsonToolResult({ export: await engine.exportCreativeComposition(input.siteId, input.compositionId, input.outputDir) }),
  );

  server.registerTool(
    'liminal_site_create_deployment_package',
    {
      title: 'Create Runtime Deployment Package',
      description: 'Create installable CSS/JS snippets and hosted runtime assets for a selected living-site skin.',
      inputSchema: {
        siteId: z.string().min(1),
        skinId: z.string().min(1),
        compositionId: z.string().min(1).optional(),
        publicBaseUrl: z.string().url().optional(),
      },
    },
    async (input) => jsonToolResult({ deployment: await engine.createDeploymentPackage(input.siteId, input) }),
  );

  server.registerTool(
    'liminal_site_rollback_to_skin',
    {
      title: 'Create Living Site Rollback Receipt',
      description: 'Record a reversible rollback receipt and mark a saved skin as the current published direction.',
      inputSchema: {
        siteId: z.string().min(1),
        skinId: z.string().min(1),
        reason: z.string().max(1000).optional(),
      },
    },
    async (input) => jsonToolResult({ rollback: await engine.createRollbackReceipt(input.siteId, input) }),
  );

  server.registerTool(
    'liminal_site_create_operator_runbook',
    {
      title: 'Create Living Site Operator Runbook',
      description: 'Generate readiness checks, operator journey steps, and recovery paths for a living-site skin.',
      inputSchema: {
        siteId: z.string().min(1),
        skinId: z.string().min(1).optional(),
      },
    },
    async (input) => jsonToolResult({ runbook: await engine.createOperatorRunbook(input.siteId, input) }),
  );

  server.registerTool(
    'liminal_site_plan_repo_patch',
    {
      title: 'Plan Repo-Native Patch',
      description: 'Inspect a website repo and produce a reviewable patch plan for installing a selected living-site skin.',
      inputSchema: {
        siteId: z.string().min(1),
        skinId: z.string().min(1),
        compositionId: z.string().min(1).optional(),
        repoRoot: z.string().min(1),
      },
    },
    async (input) => {
      const spec = (await engine.listVariants(input.siteId)).find((variant) => variant.skinId === input.skinId);
      if (!spec) throw new Error(`Skin ${input.skinId} was not found for site ${input.siteId}`);
      const composition = input.compositionId
        ? await engine.getCreativeComposition(input.siteId, input.compositionId)
        : undefined;
      return jsonToolResult({ plan: await planSitePatch({ repoRoot: input.repoRoot, spec, composition }) });
    },
  );

  server.registerResource(
    'living-site-profile',
    new ResourceTemplate('liminal://sites/{siteId}/profile', { list: undefined }),
    {
      title: 'Living Site Profile',
      description: 'A living-site profile by site id.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const profile = await engine.getProfile(String(variables.siteId));
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(profile, null, 2),
        }],
      };
    },
  );

  server.registerResource(
    'living-site-projects',
    new ResourceTemplate('liminal://sites/projects', { list: undefined }),
    {
      title: 'Living Site Project Dashboard',
      description: 'Saved living-site projects with counts, latest receipts, and next operator actions.',
      mimeType: 'application/json',
    },
    async (uri) => {
      const projects = await engine.listProjectSummaries();
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ projects }, null, 2),
        }],
      };
    },
  );

  server.registerResource(
    'living-site-variants',
    new ResourceTemplate('liminal://sites/{siteId}/variants', { list: undefined }),
    {
      title: 'Living Site Variants',
      description: 'Generated living-site skins for a site id.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const variants = await engine.listVariants(String(variables.siteId));
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ variants }, null, 2),
        }],
      };
    },
  );

  server.registerResource(
    'living-site-ingestions',
    new ResourceTemplate('liminal://sites/{siteId}/ingestions', { list: undefined }),
    {
      title: 'Living Site Ingestions',
      description: 'Captured website ingestion receipts for a site id.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const ingestions = await engine.listIngestions(String(variables.siteId));
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ ingestions }, null, 2),
        }],
      };
    },
  );

  server.registerResource(
    'living-site-aesthetic-assessments',
    new ResourceTemplate('liminal://sites/{siteId}/aesthetic-assessments', { list: undefined }),
    {
      title: 'Living Site Aesthetic Assessments',
      description: 'Stored aesthetic comparison runs for a site id.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const assessments = await engine.listAestheticAssessments(String(variables.siteId));
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ assessments }, null, 2),
        }],
      };
    },
  );

  server.registerResource(
    'living-site-deployments',
    new ResourceTemplate('liminal://sites/{siteId}/deployments', { list: undefined }),
    {
      title: 'Living Site Deployments',
      description: 'Runtime-snippet deployment packages for a site id.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const deployments = await engine.listDeploymentPackages(String(variables.siteId));
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ deployments }, null, 2),
        }],
      };
    },
  );

  server.registerResource(
    'living-site-creative-compositions',
    new ResourceTemplate('liminal://sites/{siteId}/creative-compositions', { list: undefined }),
    {
      title: 'Living Site Creative Compositions',
      description: 'Balanced and full-liminal cross-domain creative compositions for a site id.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const compositions = await engine.listCreativeCompositions(String(variables.siteId));
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ compositions }, null, 2),
        }],
      };
    },
  );

  server.registerResource(
    'living-site-capabilities',
    new ResourceTemplate('liminal://sites/{siteId}/capabilities', { list: undefined }),
    {
      title: 'Living Site Capability Matrix',
      description: 'Inventory of site-compatible Liminal domains and the latest creative capability receipt.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const capabilities = await engine.inspectCreativeCapabilities(String(variables.siteId));
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(capabilities, null, 2),
        }],
      };
    },
  );

  server.registerResource(
    'living-site-rollbacks',
    new ResourceTemplate('liminal://sites/{siteId}/rollbacks', { list: undefined }),
    {
      title: 'Living Site Rollbacks',
      description: 'Rollback receipts for a site id.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const rollbacks = await engine.listRollbackReceipts(String(variables.siteId));
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ rollbacks }, null, 2),
        }],
      };
    },
  );

  server.registerResource(
    'living-site-operator-runbooks',
    new ResourceTemplate('liminal://sites/{siteId}/operator-runbooks', { list: undefined }),
    {
      title: 'Living Site Operator Runbooks',
      description: 'Readiness and recovery runbooks for a site id.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const runbooks = await engine.listOperatorRunbooks(String(variables.siteId));
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ runbooks }, null, 2),
        }],
      };
    },
  );

  server.registerPrompt(
    'living_site_brief',
    {
      title: 'Living Site Brief',
      description: 'Shape a concise operator brief for creating or evolving a living website.',
      argsSchema: {
        siteName: z.string().optional(),
        currentAesthetic: z.string().optional(),
        desiredShift: z.string().optional(),
      },
    },
    (input) => ({
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: [
            `Create a living-site evolution brief${input.siteName ? ` for ${input.siteName}` : ''}.`,
            input.currentAesthetic ? `Current aesthetic: ${input.currentAesthetic}.` : 'Identify the current aesthetic from the site profile or source URL.',
            input.desiredShift ? `Desired shift: ${input.desiredShift}.` : 'Recommend a credible next aesthetic direction.',
            'Return constraints, taste memory assumptions, and 3 reviewable runtime-skin directions.',
          ].join('\n'),
        },
      }],
    }),
  );

  return server;
}

export async function runStdioServer(options: LiminalSitesMcpOptions = {}): Promise<void> {
  const server = createLiminalSitesMcpServer(options);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

function jsonToolResult(data: Record<string, unknown>): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runStdioServer().catch((error: unknown) => {
    const message = error instanceof Error ? error.stack ?? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
