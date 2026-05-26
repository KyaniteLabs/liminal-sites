import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

interface SweepAssertion {
  label: string;
  passed: boolean;
  detail: string;
}

interface OperatorSmokeProof {
  ok: boolean;
  metrics: {
    livingTabVisible: boolean;
    ingestionVisible: boolean;
    ingestionImageCount: number;
    assessmentVisible: boolean;
    assessmentRankCount: number;
    assessmentText: string;
    creativeVisible: boolean;
    creativeText: string;
    creativeCapabilityCount: number;
    fullLiminalModeVisible: boolean;
    deploymentVisible: boolean;
    deploymentText: string;
    rollbackVisible: boolean;
    rollbackText: string;
    dashboardVisible: boolean;
    dashboardText: string;
    runbookVisible: boolean;
    runbookText: string;
    runbookCheckCount: number;
    variantCount: number;
    iframeCount: number;
  };
  frameTextLength: number;
  installPreviewTextLength: number;
  screenshotPath: string;
  screenshotBytes: number;
}

interface VerticalSliceReceipt {
  id: string;
  name: string;
  operatorValue: string;
  proof: string[];
}

interface SweepReceipt {
  ok: boolean;
  generatedAt: string;
  git: {
    branch: string;
    commit: string;
  };
  slices: VerticalSliceReceipt[];
  assertions: SweepAssertion[];
  visualProof: {
    screenshotPath: string;
    screenshotBytes: number;
    runbookCheckCount: number;
    frameTextLength: number;
    installPreviewTextLength: number;
  };
  mcp: {
    toolCount: number;
    tools: string[];
  };
  artifacts: {
    smokeMetricsPath: string;
    receiptPath: string;
    handoffPath: string;
  };
}

const REQUIRED_MCP_TOOLS = [
  'liminal_site_compare_aesthetics',
  'liminal_site_create_deployment_package',
  'liminal_site_create_operator_runbook',
  'liminal_site_evolve',
  'liminal_site_compose_creative',
  'liminal_site_export_creative_composition',
  'liminal_site_export_runtime_skin',
  'liminal_site_generate_variants',
  'liminal_site_ingest_source',
  'liminal_site_plan_repo_patch',
  'liminal_site_profile_create',
  'liminal_site_record_preference',
  'liminal_site_rollback_to_skin',
] as const;

const SLICES: VerticalSliceReceipt[] = [
  {
    id: 'slice-1',
    name: 'Executable living-site MVP',
    operatorValue: 'Create a site profile, generate runtime skins, preview them, export assets, and plan repo-native patches.',
    proof: ['Studio Living Site tab', 'liminal-sites MCP tools', 'runtime skin export and preview'],
  },
  {
    id: 'slice-2',
    name: 'Real website ingestion',
    operatorValue: 'Ground evolution in the current website through URL or path ingestion and screenshot-backed source receipts.',
    proof: ['ingestion receipt', 'loaded screenshot image', 'captured density, color, typography, and structure signals'],
  },
  {
    id: 'slice-3',
    name: 'Aesthetic intelligence and taste memory',
    operatorValue: 'Compare generated directions, record preferences, evolve from memory, and keep an explainable winner.',
    proof: ['aesthetic ranking cards', 'Taste memory summary', 'evolution prompt derived from the winner'],
  },
  {
    id: 'slice-4',
    name: 'Installable deployment path',
    operatorValue: 'Package a selected skin as CSS and JS snippets with an install preview before changing a live site.',
    proof: ['deployment manifest', 'data-liminal-sites install snippets', 'install preview fetch'],
  },
  {
    id: 'slice-5',
    name: 'Project history and rollback',
    operatorValue: 'Inspect saved project history, publish a recovery target, and keep rollback receipts in the dashboard.',
    proof: ['Project dashboard', 'Rollback Receipt panel', 'published skin id and receipt history'],
  },
  {
    id: 'slice-6',
    name: 'Operator runbook and resilience',
    operatorValue: 'Derive readiness checks, recovery paths, and exact next operator actions from persisted receipts.',
    proof: ['Operator Runbook panel', 'seven readiness checks', 'rollback and deployment recovery paths'],
  },
  {
    id: 'slice-7',
    name: 'Full Liminal creative composition',
    operatorValue: 'Compose a selected skin through every site-compatible Liminal domain and inspect used, blocked, and failed capability receipts.',
    proof: ['Full Liminal mode', 'capability matrix', 'audio gate', 'creative manifest'],
  },
  {
    id: 'slice-8',
    name: 'Full journey sweep and handoff',
    operatorValue: 'Run one command that proves the Studio journey, MCP surface, docs, and handoff receipt agree.',
    proof: ['pnpm proof:living-sites-sweep', 'receipt.json', 'handoff.md'],
  },
];

async function main() {
  const root = process.cwd();
  const outDir = path.join(root, '.omx', 'proof', 'living-sites-operator-sweep');
  const smokeMetricsPath = path.join(root, '.omx', 'proof', 'living-sites-operator-smoke', 'metrics.json');
  const receiptPath = path.join(outDir, 'receipt.json');
  const handoffPath = path.join(outDir, 'handoff.md');
  await fs.mkdir(outDir, { recursive: true });

  await run('pnpm', ['proof:living-sites-operator'], root);

  const proof = JSON.parse(await fs.readFile(smokeMetricsPath, 'utf8')) as OperatorSmokeProof;
  const mcpTools = await smokeMcpTools();
  const [branch, commit, readme, docs, packageJson] = await Promise.all([
    capture('git', ['rev-parse', '--abbrev-ref', 'HEAD'], root),
    capture('git', ['rev-parse', '--short=12', 'HEAD'], root),
    fs.readFile(path.join(root, 'README.md'), 'utf8'),
    fs.readFile(path.join(root, 'docs', 'LIVING_SITES_VERTICAL_SLICES.md'), 'utf8'),
    fs.readFile(path.join(root, 'package.json'), 'utf8'),
  ]);
  const parsedPackage = JSON.parse(packageJson) as { scripts?: Record<string, string> };

  const assertions: SweepAssertion[] = [
    check('visual Studio proof passed', proof.ok, `screenshot ${proof.screenshotBytes} bytes`),
    check('source ingestion visible', proof.metrics.ingestionVisible && proof.metrics.ingestionImageCount === 1, `${proof.metrics.ingestionImageCount} screenshot image(s)`),
    check('aesthetic comparison visible', proof.metrics.assessmentVisible && proof.metrics.assessmentRankCount >= 3 && proof.metrics.assessmentText.includes('Taste memory:'), `${proof.metrics.assessmentRankCount} ranked cards`),
    check('Studio exposes creative composition controls', proof.metrics.creativeVisible && proof.metrics.creativeCapabilityCount >= 13 && proof.metrics.fullLiminalModeVisible, `${proof.metrics.creativeCapabilityCount} capability rows`),
    check('preview iframe verified', proof.metrics.iframeCount === 1 && proof.frameTextLength > 500, `${proof.metrics.iframeCount} iframe(s), ${proof.frameTextLength} chars`),
    check('deployment install path verified', proof.metrics.deploymentVisible && proof.metrics.deploymentText.includes('data-liminal-sites') && proof.installPreviewTextLength > 500, `${proof.installPreviewTextLength} install preview chars`),
    check('rollback path visible', proof.metrics.rollbackVisible && proof.metrics.rollbackText.includes('Rollback Receipt'), 'rollback receipt rendered in Studio'),
    check('dashboard surfaces runbook receipt first', proof.metrics.dashboardVisible && proof.metrics.dashboardText.includes('operator-runbook:'), 'dashboard includes operator-runbook receipt'),
    check('runbook readiness is complete', proof.metrics.runbookVisible && proof.metrics.runbookCheckCount >= 7, `${proof.metrics.runbookCheckCount} runbook checks`),
    check('MCP exposes full operator toolchain', REQUIRED_MCP_TOOLS.every((tool) => mcpTools.includes(tool)), `${mcpTools.length} tool(s)`),
    check('handoff docs are linked from README', readme.includes('docs/LIVING_SITES_VERTICAL_SLICES.md'), 'README points to the slice handoff'),
    check('handoff docs name every slice', SLICES.every((slice) => docs.includes(slice.id) && docs.includes(slice.name)), `${SLICES.length} slice labels checked`),
    check('full-liminal proof command is package-addressable', parsedPackage.scripts?.['proof:living-sites-full-liminal'] === 'tsx scripts/proof/living-sites-dogfood.ts', 'full-liminal package script is present'),
    check('sweep command is package-addressable', parsedPackage.scripts?.['proof:living-sites-sweep'] === 'tsx scripts/proof/living-sites-operator-sweep.ts', 'package script is present'),
  ];
  const ok = assertions.every((assertion) => assertion.passed);
  const receipt: SweepReceipt = {
    ok,
    generatedAt: new Date().toISOString(),
    git: {
      branch: branch.trim(),
      commit: commit.trim(),
    },
    slices: SLICES,
    assertions,
    visualProof: {
      screenshotPath: proof.screenshotPath,
      screenshotBytes: proof.screenshotBytes,
      runbookCheckCount: proof.metrics.runbookCheckCount,
      frameTextLength: proof.frameTextLength,
      installPreviewTextLength: proof.installPreviewTextLength,
    },
    mcp: {
      toolCount: mcpTools.length,
      tools: mcpTools,
    },
    artifacts: {
      smokeMetricsPath,
      receiptPath,
      handoffPath,
    },
  };
  await fs.writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
  await fs.writeFile(handoffPath, renderHandoff(receipt));

  if (!ok) {
    throw new Error(`Living Sites sweep failed: ${JSON.stringify(assertions.filter((assertion) => !assertion.passed), null, 2)}`);
  }
  console.log(JSON.stringify({
    ok,
    branch: receipt.git.branch,
    commit: receipt.git.commit,
    slices: receipt.slices.length,
    assertions: receipt.assertions.length,
    mcpTools: receipt.mcp.toolCount,
    receiptPath,
    handoffPath,
    screenshotPath: proof.screenshotPath,
  }, null, 2));
}

function check(label: string, passed: boolean, detail: string): SweepAssertion {
  return { label, passed, detail };
}

function renderHandoff(receipt: SweepReceipt): string {
  const assertionRows = receipt.assertions
    .map((assertion) => `| ${assertion.passed ? 'pass' : 'fail'} | ${assertion.label} | ${assertion.detail.replaceAll('\n', ' ')} |`)
    .join('\n');
  const sliceRows = receipt.slices
    .map((slice) => `| ${slice.id} | ${slice.name} | ${slice.operatorValue} | ${slice.proof.join(', ')} |`)
    .join('\n');
  return `# Liminal Sites Operator Sweep

Generated: ${receipt.generatedAt}

Branch: ${receipt.git.branch}
Commit: ${receipt.git.commit}
Result: ${receipt.ok ? 'pass' : 'fail'}

## Vertical Slices

| Slice | Name | Operator value | Proof |
| --- | --- | --- | --- |
${sliceRows}

## Assertions

| Status | Assertion | Detail |
| --- | --- | --- |
${assertionRows}

## Artifacts

- Visual screenshot: ${receipt.visualProof.screenshotPath}
- Smoke metrics: ${receipt.artifacts.smokeMetricsPath}
- Sweep receipt: ${receipt.artifacts.receiptPath}
- MCP tools: ${receipt.mcp.tools.join(', ')}
`;
}

async function smokeMcpTools(): Promise<string[]> {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'liminal-sites-sweep-mcp-'));
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['bin/liminal-sites-mcp'],
    env: { ...process.env, LIMINAL_SITES_ROOT: rootDir },
  });
  const client = new Client({ name: 'liminal-sites-operator-sweep', version: '0.0.0' });
  try {
    await client.connect(transport);
    const tools = await client.listTools();
    return tools.tools.map((tool) => tool.name).sort();
  } finally {
    await client.close().catch(() => {});
    await fs.rm(rootDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function run(command: string, args: string[], cwd: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} failed with ${signal ?? code}`));
    });
  });
}

async function capture(command: string, args: string[], cwd: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    child.stdout.on('data', (chunk: Buffer) => stdout.push(chunk));
    child.stderr.on('data', (chunk: Buffer) => stderr.push(chunk));
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) resolve(Buffer.concat(stdout).toString('utf8'));
      else reject(new Error(`${command} ${args.join(' ')} failed with ${signal ?? code}: ${Buffer.concat(stderr).toString('utf8')}`));
    });
  });
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.stack ?? error.message : String(error));
    process.exit(1);
  });
