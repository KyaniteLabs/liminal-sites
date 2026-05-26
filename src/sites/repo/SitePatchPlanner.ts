import fs from 'fs/promises';
import path from 'path';
import type { SiteCreativeComposition, SkinSpec } from '../types.js';
import { buildRuntimeSkinFiles } from '../runtime/runtimeSkinTemplate.js';
import { type SiteRepoInspection, inspectSiteRepo } from './SiteRepoInspector.js';

export type SitePatchAction = 'create' | 'update';

export interface SiteFilePatch {
  action: SitePatchAction;
  path: string;
  reason: string;
  contents: string;
}

export interface SitePatchPlan {
  repoRoot: string;
  siteId: string;
  skinId: string;
  compositionId?: string;
  framework: SiteRepoInspection['framework'];
  packageManager: SiteRepoInspection['packageManager'];
  patches: SiteFilePatch[];
  warnings: string[];
  operatorSteps: string[];
}

interface PlanSitePatchOptions {
  repoRoot: string;
  spec: SkinSpec;
  composition?: SiteCreativeComposition;
}

export async function planSitePatch(options: PlanSitePatchOptions): Promise<SitePatchPlan> {
  const repoRoot = path.resolve(options.repoRoot);
  const inspection = await inspectSiteRepo(repoRoot);
  const runtime = buildRuntimeSkinFiles(options.spec);
  const target = chooseIntegrationTarget(inspection);
  const patches: SiteFilePatch[] = [
    {
      action: 'create',
      path: path.join(target.assetDir, 'liminal-skin.css'),
      reason: 'Add the generated living-site visual system as CSS variables and atmosphere styles.',
      contents: runtime.css,
    },
    {
      action: 'create',
      path: path.join(target.assetDir, 'liminal-skin.js'),
      reason: 'Add the generated living-site runtime behavior as a small browser-side enhancer.',
      contents: runtime.js,
    },
    {
      action: 'create',
      path: path.join(target.assetDir, 'liminal-site-manifest.json'),
      reason: 'Record the selected skin provenance so future evolution has a reviewable receipt.',
      contents: `${JSON.stringify(runtime.manifest, null, 2)}\n`,
    },
  ];
  if (options.composition) {
    patches.push(
      {
        action: 'create',
        path: path.join(target.assetDir, 'liminal-creative.css'),
        reason: 'Add the cross-domain creative composition styles for shader atmosphere and kinetic typography.',
        contents: options.composition.runtime.css,
      },
      {
        action: 'create',
        path: path.join(target.assetDir, 'liminal-creative.js'),
        reason: 'Add the browser-executed creative composition runtime with visible WebGL proof receipts.',
        contents: options.composition.runtime.js,
      },
      {
        action: 'create',
        path: path.join(target.assetDir, 'liminal-creative-manifest.json'),
        reason: 'Record creative composition domains, layers, and validation results for review.',
        contents: `${JSON.stringify(options.composition.runtime.manifest, null, 2)}\n`,
      },
    );
  }

  if (target.appEntry) {
    const existing = await readTextIfExists(path.join(repoRoot, target.appEntry));
    const importPaths = [
      relativeImportPath(target.appEntry, path.join(target.assetDir, 'liminal-skin.css')),
      relativeImportPath(target.appEntry, path.join(target.assetDir, 'liminal-skin.js')),
    ];
    if (options.composition) {
      importPaths.push(
        relativeImportPath(target.appEntry, path.join(target.assetDir, 'liminal-creative.css')),
        relativeImportPath(target.appEntry, path.join(target.assetDir, 'liminal-creative.js')),
      );
    }
    patches.push({
      action: 'update',
      path: target.appEntry,
      reason: 'Wire the living-site CSS and runtime into the app entry as side-effect imports.',
      contents: addSideEffectImports(existing, importPaths),
    });
  } else if (target.htmlEntry) {
    const existing = await readTextIfExists(path.join(repoRoot, target.htmlEntry));
    const assetPaths: [string, string][] = [[
      webAssetPath(target.htmlEntry, path.join(target.assetDir, 'liminal-skin.css')),
      webAssetPath(target.htmlEntry, path.join(target.assetDir, 'liminal-skin.js')),
    ]];
    if (options.composition) {
      assetPaths.push([
        webAssetPath(target.htmlEntry, path.join(target.assetDir, 'liminal-creative.css')),
        webAssetPath(target.htmlEntry, path.join(target.assetDir, 'liminal-creative.js')),
      ]);
    }
    patches.push({
      action: 'update',
      path: target.htmlEntry,
      reason: 'Wire the living-site CSS and runtime into the static HTML entry.',
      contents: addHtmlAssets(existing, assetPaths),
    });
  }

  return {
    repoRoot,
    siteId: options.spec.siteId,
    skinId: options.spec.skinId,
    compositionId: options.composition?.compositionId,
    framework: inspection.framework,
    packageManager: inspection.packageManager,
    patches,
    warnings: buildWarnings(inspection, target),
    operatorSteps: buildOperatorSteps(inspection, target),
  };
}

export async function applySitePatchPlan(plan: SitePatchPlan): Promise<string[]> {
  const written: string[] = [];
  for (const patch of plan.patches) {
    const absolutePath = resolveInside(plan.repoRoot, patch.path);
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, patch.contents, 'utf8');
    written.push(absolutePath);
  }
  return written;
}

function chooseIntegrationTarget(inspection: SiteRepoInspection): { assetDir: string; appEntry?: string; htmlEntry?: string } {
  const appEntry = inspection.appEntryCandidates[0];
  if (appEntry) {
    const appDir = path.dirname(appEntry);
    const assetDir = appDir === '.' ? 'liminal-sites' : path.join(appDir, 'liminal-sites');
    return { assetDir, appEntry };
  }
  const htmlEntry = inspection.htmlEntryCandidates[0];
  if (htmlEntry) {
    const htmlDir = path.dirname(htmlEntry);
    const assetDir = htmlDir === '.' ? 'liminal-sites' : path.join(htmlDir, 'liminal-sites');
    return { assetDir, htmlEntry };
  }
  return { assetDir: 'liminal-sites' };
}

function addSideEffectImports(contents: string, importPaths: string[]): string {
  const lines = contents.split('\n');
  const existing = new Set(lines.map((line) => line.trim()));
  const imports = importPaths
    .map((importPath) => `import '${importPath}';`)
    .filter((line) => !existing.has(line));
  if (imports.length === 0) return contents;
  const lastImportIndex = lines.reduce((last, line, index) => (line.startsWith('import ') ? index : last), -1);
  const insertionIndex = lastImportIndex >= 0 ? lastImportIndex + 1 : 0;
  lines.splice(insertionIndex, 0, ...imports);
  return normalizeTrailingNewline(lines.join('\n'));
}

function addHtmlAssets(contents: string, assetPaths: [string, string][]): string {
  let next = contents;
  for (const [cssPath, jsPath] of assetPaths) {
    const link = `<link rel="stylesheet" href="${cssPath}">`;
    const script = `<script type="module" src="${jsPath}"></script>`;
    if (!next.includes(cssPath)) {
      next = next.includes('</head>') ? next.replace('</head>', `  ${link}\n</head>`) : `${link}\n${next}`;
    }
    if (!next.includes(jsPath)) {
      next = next.includes('</body>') ? next.replace('</body>', `  ${script}\n</body>`) : `${next}\n${script}`;
    }
  }
  return normalizeTrailingNewline(next);
}

function relativeImportPath(fromFile: string, toFile: string): string {
  const relative = path.relative(path.dirname(fromFile), toFile).replaceAll(path.sep, '/');
  return relative.startsWith('.') ? relative : `./${relative}`;
}

function webAssetPath(fromHtmlFile: string, toFile: string): string {
  const htmlDir = path.dirname(fromHtmlFile);
  const relative = (htmlDir === '.' ? toFile : path.relative(htmlDir, toFile)).replaceAll(path.sep, '/');
  return relative.startsWith('.') ? relative : `./${relative}`;
}

async function readTextIfExists(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') return '';
    throw error;
  }
}

function resolveInside(root: string, relativePath: string): string {
  if (path.isAbsolute(relativePath)) throw new Error(`Site patch paths must be relative: ${relativePath}`);
  const resolved = path.resolve(root, relativePath);
  const normalizedRoot = path.resolve(root);
  if (resolved !== normalizedRoot && !resolved.startsWith(`${normalizedRoot}${path.sep}`)) {
    throw new Error(`Refusing to write outside repo root: ${relativePath}`);
  }
  return resolved;
}

function normalizeTrailingNewline(contents: string): string {
  return contents.endsWith('\n') ? contents : `${contents}\n`;
}

function buildWarnings(
  inspection: SiteRepoInspection,
  target: { assetDir: string; appEntry?: string; htmlEntry?: string },
): string[] {
  const warnings: string[] = [];
  if (!target.appEntry && !target.htmlEntry) warnings.push('No automatic entry-point integration was available; generated files need manual wiring.');
  if (inspection.framework === 'next') warnings.push('Next.js app/router projects may need a client boundary if the runtime script conflicts with server-only layout rules.');
  if (inspection.framework === 'unknown') warnings.push('Framework could not be identified; review the generated patch before applying it.');
  return warnings;
}

function buildOperatorSteps(
  inspection: SiteRepoInspection,
  target: { assetDir: string; appEntry?: string; htmlEntry?: string },
): string[] {
  const testScript = inspection.scripts.test ? `${inspection.packageManager === 'unknown' ? 'npm' : inspection.packageManager} test` : null;
  return [
    `Review generated assets under ${target.assetDir}.`,
    target.appEntry || target.htmlEntry ? `Review integration change in ${target.appEntry ?? target.htmlEntry}.` : 'Add CSS and runtime imports to the website entry point.',
    testScript ?? 'Run the website build or preview command and inspect the page visually.',
  ];
}
