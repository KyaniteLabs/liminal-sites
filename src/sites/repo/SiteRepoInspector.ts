import fs from 'fs/promises';
import path from 'path';

export type SiteRepoFramework = 'vite' | 'next' | 'astro' | 'remix' | 'react' | 'static' | 'unknown';
export type SiteRepoPackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun' | 'unknown';

export interface SiteRepoInspection {
  repoRoot: string;
  framework: SiteRepoFramework;
  packageManager: SiteRepoPackageManager;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  appEntryCandidates: string[];
  htmlEntryCandidates: string[];
  styleEntryCandidates: string[];
  notes: string[];
}

interface PackageJsonShape {
  scripts?: Record<string, unknown>;
  dependencies?: Record<string, unknown>;
  devDependencies?: Record<string, unknown>;
}

const APP_ENTRY_CANDIDATES = [
  'src/main.tsx',
  'src/main.ts',
  'src/index.tsx',
  'src/index.ts',
  'app/layout.tsx',
  'src/app/layout.tsx',
  'pages/_app.tsx',
  'src/pages/_app.tsx',
  'client/main.tsx',
  'frontend/src/main.tsx',
];

const HTML_ENTRY_CANDIDATES = ['index.html', 'public/index.html', 'app/index.html'];

const STYLE_ENTRY_CANDIDATES = [
  'src/index.css',
  'src/main.css',
  'src/App.css',
  'app/globals.css',
  'src/app/globals.css',
  'styles/globals.css',
];

export async function inspectSiteRepo(repoRoot: string): Promise<SiteRepoInspection> {
  const root = path.resolve(repoRoot);
  const packageJson = await readPackageJson(root);
  const scripts = normalizeRecord(packageJson?.scripts);
  const dependencies = normalizeRecord(packageJson?.dependencies);
  const devDependencies = normalizeRecord(packageJson?.devDependencies);
  const packageManager = await detectPackageManager(root);
  const appEntryCandidates = await existingFiles(root, APP_ENTRY_CANDIDATES);
  const htmlEntryCandidates = await existingFiles(root, HTML_ENTRY_CANDIDATES);
  const styleEntryCandidates = await existingFiles(root, STYLE_ENTRY_CANDIDATES);
  const framework = detectFramework({ dependencies, devDependencies, appEntryCandidates, htmlEntryCandidates, scripts });
  const notes = buildInspectionNotes({ framework, packageManager, appEntryCandidates, htmlEntryCandidates, styleEntryCandidates });

  return {
    repoRoot: root,
    framework,
    packageManager,
    scripts,
    dependencies,
    devDependencies,
    appEntryCandidates,
    htmlEntryCandidates,
    styleEntryCandidates,
    notes,
  };
}

function detectFramework(input: {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  appEntryCandidates: string[];
  htmlEntryCandidates: string[];
  scripts: Record<string, string>;
}): SiteRepoFramework {
  const packages = { ...input.dependencies, ...input.devDependencies };
  if (packages.next || input.appEntryCandidates.some((candidate) => candidate.includes('app/layout') || candidate.includes('pages/_app'))) {
    return 'next';
  }
  if (packages['@remix-run/react'] || packages['@remix-run/node']) return 'remix';
  if (packages.astro) return 'astro';
  if (packages.vite || /vite/.test(Object.values(input.scripts).join(' '))) return 'vite';
  if (packages.react || packages['react-dom']) return 'react';
  if (input.htmlEntryCandidates.length > 0) return 'static';
  return 'unknown';
}

async function readPackageJson(root: string): Promise<PackageJsonShape | null> {
  try {
    const raw = await fs.readFile(path.join(root, 'package.json'), 'utf8');
    return JSON.parse(raw) as PackageJsonShape;
  } catch (error) {
    if (isMissingFile(error)) return null;
    throw error;
  }
}

async function detectPackageManager(root: string): Promise<SiteRepoPackageManager> {
  if (await fileExists(path.join(root, 'pnpm-lock.yaml'))) return 'pnpm';
  if (await fileExists(path.join(root, 'package-lock.json'))) return 'npm';
  if (await fileExists(path.join(root, 'yarn.lock'))) return 'yarn';
  if (await fileExists(path.join(root, 'bun.lockb')) || await fileExists(path.join(root, 'bun.lock'))) return 'bun';
  return 'unknown';
}

async function existingFiles(root: string, candidates: string[]): Promise<string[]> {
  const found: string[] = [];
  for (const candidate of candidates) {
    if (await fileExists(path.join(root, candidate))) found.push(candidate);
  }
  return found;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch (error) {
    if (isMissingFile(error)) return false;
    throw error;
  }
}

function normalizeRecord(record: Record<string, unknown> | undefined): Record<string, string> {
  if (!record) return {};
  return Object.fromEntries(Object.entries(record).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
}

function buildInspectionNotes(input: {
  framework: SiteRepoFramework;
  packageManager: SiteRepoPackageManager;
  appEntryCandidates: string[];
  htmlEntryCandidates: string[];
  styleEntryCandidates: string[];
}): string[] {
  const notes = [`Detected ${input.framework} website shape.`];
  if (input.packageManager !== 'unknown') notes.push(`Detected ${input.packageManager} package manager.`);
  if (input.appEntryCandidates.length > 0) notes.push(`Found app entry: ${input.appEntryCandidates[0]}.`);
  if (input.htmlEntryCandidates.length > 0) notes.push(`Found HTML entry: ${input.htmlEntryCandidates[0]}.`);
  if (input.styleEntryCandidates.length > 0) notes.push(`Found style entry: ${input.styleEntryCandidates[0]}.`);
  if (input.appEntryCandidates.length === 0 && input.htmlEntryCandidates.length === 0) {
    notes.push('No obvious entry file was found; generated files can still be exported for manual integration.');
  }
  return notes;
}

function isMissingFile(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}
