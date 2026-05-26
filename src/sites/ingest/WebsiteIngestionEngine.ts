import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import { createRunId } from '../siteIds.js';
import { inspectSiteRepo } from '../repo/SiteRepoInspector.js';
import { WebsiteIngestionInputSchema, type WebsiteIngestionInput, type WebsiteIngestionResult } from '../types.js';

interface IngestWebsiteSourceOptions extends WebsiteIngestionInput {
  siteId: string;
  artifactPath: (ingestionId: string, fileName: string) => string;
}

interface PageCapture {
  title: string;
  description: string;
  html: string;
  metrics: WebsiteIngestionResult['metrics'];
  designSignals: WebsiteIngestionResult['designSignals'];
  screenshotPath?: string;
}

const HTML_CANDIDATES = ['index.html', 'public/index.html', 'app/index.html'];
const CSS_CANDIDATES = ['src/index.css', 'src/main.css', 'src/App.css', 'app/globals.css', 'src/app/globals.css', 'styles/globals.css'];

export async function ingestWebsiteSource(options: IngestWebsiteSourceOptions): Promise<WebsiteIngestionResult> {
  const parsed = WebsiteIngestionInputSchema.parse(options);
  const ingestionId = createRunId('ingest');
  const createdAt = new Date().toISOString();
  const sourceValue = parsed.sourceUrl ?? path.resolve(parsed.sourcePath ?? '');
  const sourceKind = parsed.sourceUrl ? 'url' : 'path';
  const capture = parsed.sourceUrl
    ? await captureUrl(parsed.sourceUrl, parsed.viewport, parsed.captureVisual, (fileName) => options.artifactPath(ingestionId, fileName))
    : await capturePath(path.resolve(parsed.sourcePath ?? ''), parsed.viewport, parsed.captureVisual, (fileName) => options.artifactPath(ingestionId, fileName));
  const sourceHtmlPath = options.artifactPath(ingestionId, 'source.html');
  await fs.mkdir(path.dirname(sourceHtmlPath), { recursive: true });
  await fs.writeFile(sourceHtmlPath, capture.html, 'utf8');
  const repository = sourceKind === 'path' ? await summarizeRepository(sourceValue) : undefined;
  return {
    ingestionId,
    siteId: options.siteId,
    createdAt,
    source: { kind: sourceKind, value: sourceValue },
    title: capture.title,
    description: capture.description,
    screenshotPath: capture.screenshotPath,
    sourceHtmlPath,
    metrics: capture.metrics,
    designSignals: capture.designSignals,
    repository,
    recommendedBrandBrief: buildRecommendedBrief(capture, repository),
    operatorNotes: buildOperatorNotes(capture, repository),
  };
}

async function captureUrl(
  sourceUrl: string,
  viewport: { width: number; height: number },
  captureVisual: boolean,
  artifactPath: (fileName: string) => string,
): Promise<PageCapture> {
  if (captureVisual) {
    const capture = await captureWithPlaywright(sourceUrl, viewport, artifactPath).catch(() => null);
    if (capture) return capture;
  }
  const html = await fetchText(sourceUrl);
  return captureStaticHtml(html, viewport);
}

async function capturePath(
  sourcePath: string,
  viewport: { width: number; height: number },
  captureVisual: boolean,
  artifactPath: (fileName: string) => string,
): Promise<PageCapture> {
  const htmlPath = await findFirstExisting(sourcePath, HTML_CANDIDATES);
  const html = htmlPath ? await fs.readFile(htmlPath, 'utf8') : '<!doctype html><html><head><title>Website source</title></head><body></body></html>';
  const cssText = await readCssCandidates(sourcePath);
  if (captureVisual && htmlPath) {
    const capture = await captureWithPlaywright(pathToFileURL(htmlPath).href, viewport, artifactPath).catch(() => null);
    if (capture) {
      return {
        ...capture,
        designSignals: mergeStaticSignals(capture.designSignals, cssText),
      };
    }
  }
  const staticCapture = captureStaticHtml(html, viewport);
  return {
    ...staticCapture,
    designSignals: mergeStaticSignals(staticCapture.designSignals, cssText),
  };
}

async function captureWithPlaywright(
  target: string,
  viewport: { width: number; height: number },
  artifactPath: (fileName: string) => string,
): Promise<PageCapture> {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport });
    await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 15_000 });
    await page.waitForLoadState('networkidle', { timeout: 2_500 }).catch(() => undefined);
    const screenshotPath = artifactPath('screenshot.png');
    await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
    await page.screenshot({ path: screenshotPath, fullPage: false });
    const data = await page.evaluate(() => {
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
      const visibleElements = Array.from(document.body.querySelectorAll<HTMLElement>('body, main, section, article, header, nav, footer, h1, h2, h3, p, a, button, img, form'));
      const colors = new Set<string>();
      const fonts = new Set<string>();
      let largestArea = 0;
      for (const element of visibleElements) {
        const style = window.getComputedStyle(element);
        for (const color of [style.color, style.backgroundColor, style.borderColor]) {
          if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') colors.add(color);
        }
        if (style.fontFamily) fonts.add(style.fontFamily);
        const rect = element.getBoundingClientRect();
        largestArea = Math.max(largestArea, Math.max(0, rect.width) * Math.max(0, rect.height));
      }
      const viewportArea = Math.max(1, window.innerWidth * window.innerHeight);
      const headings = Array.from(document.querySelectorAll('h1,h2,h3'))
        .map((element) => element.textContent?.trim() ?? '')
        .filter(Boolean)
        .slice(0, 8);
      return {
        title: document.title || headings[0] || 'Untitled website',
        description: metaDescription,
        bodyTextLength: document.body.innerText.length,
        headingCount: document.querySelectorAll('h1,h2,h3').length,
        linkCount: document.links.length,
        buttonCount: document.querySelectorAll('button,[role="button"]').length,
        imageCount: document.images.length,
        formCount: document.forms.length,
        sectionCount: document.querySelectorAll('main,section,article').length,
        largestElementAreaRatio: Math.min(1, largestArea / viewportArea),
        colors: Array.from(colors).slice(0, 12),
        fonts: Array.from(fonts).slice(0, 8),
        headings,
      };
    });
    return {
      title: data.title,
      description: data.description,
      html: await page.content(),
      screenshotPath,
      metrics: {
        viewport,
        bodyTextLength: data.bodyTextLength,
        headingCount: data.headingCount,
        linkCount: data.linkCount,
        buttonCount: data.buttonCount,
        imageCount: data.imageCount,
        formCount: data.formCount,
        sectionCount: data.sectionCount,
        largestElementAreaRatio: data.largestElementAreaRatio,
      },
      designSignals: {
        colors: data.colors,
        fonts: data.fonts,
        headings: data.headings,
        density: inferDensity(data.bodyTextLength, data.linkCount + data.buttonCount, data.sectionCount),
        motionPreference: inferMotion(data.bodyTextLength, data.buttonCount),
        notes: ['Captured through a real browser viewport.'],
      },
    };
  } finally {
    await browser.close();
  }
}

function captureStaticHtml(html: string, viewport: { width: number; height: number }): PageCapture {
  const title = firstMatch(html, /<title[^>]*>([^<]*)<\/title>/i) || firstHeading(html) || 'Untitled website';
  const description = firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || '';
  const bodyText = stripHtml(html);
  const headings = Array.from(html.matchAll(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi)).map((match) => stripHtml(match[1]).trim()).filter(Boolean).slice(0, 8);
  const linkCount = countMatches(html, /<a\b/gi);
  const buttonCount = countMatches(html, /<button\b|role=["']button["']/gi);
  const sectionCount = countMatches(html, /<(main|section|article)\b/gi);
  return {
    title,
    description,
    html,
    metrics: {
      viewport,
      bodyTextLength: bodyText.length,
      headingCount: headings.length,
      linkCount,
      buttonCount,
      imageCount: countMatches(html, /<img\b/gi),
      formCount: countMatches(html, /<form\b/gi),
      sectionCount,
      largestElementAreaRatio: 0,
    },
    designSignals: {
      colors: Array.from(extractCssColors(html)).slice(0, 12),
      fonts: Array.from(extractFonts(html)).slice(0, 8),
      headings,
      density: inferDensity(bodyText.length, linkCount + buttonCount, sectionCount),
      motionPreference: inferMotion(bodyText.length, buttonCount),
      notes: ['Captured from static HTML because browser capture was unavailable or disabled.'],
    },
  };
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(`Failed to ingest URL ${url}: ${response.status}`);
  return response.text();
}

async function summarizeRepository(sourcePath: string): Promise<WebsiteIngestionResult['repository']> {
  const inspection = await inspectSiteRepo(sourcePath).catch(() => null);
  if (!inspection) return undefined;
  return {
    framework: inspection.framework,
    packageManager: inspection.packageManager,
    appEntryCandidates: inspection.appEntryCandidates,
    styleEntryCandidates: inspection.styleEntryCandidates,
  };
}

async function findFirstExisting(root: string, candidates: string[]): Promise<string | null> {
  for (const candidate of candidates) {
    const filePath = path.join(root, candidate);
    const stat = await fs.stat(filePath).catch(() => null);
    if (stat?.isFile()) return filePath;
  }
  return null;
}

async function readCssCandidates(root: string): Promise<string> {
  const chunks: string[] = [];
  for (const candidate of CSS_CANDIDATES) {
    const text = await fs.readFile(path.join(root, candidate), 'utf8').catch(() => '');
    if (text) chunks.push(text);
  }
  return chunks.join('\n');
}

function mergeStaticSignals(signals: WebsiteIngestionResult['designSignals'], cssText: string): WebsiteIngestionResult['designSignals'] {
  const colors = [...new Set([...signals.colors, ...Array.from(extractCssColors(cssText))])].slice(0, 12);
  const fonts = [...new Set([...signals.fonts, ...Array.from(extractFonts(cssText))])].slice(0, 8);
  return { ...signals, colors, fonts };
}

function buildRecommendedBrief(capture: PageCapture, repository: WebsiteIngestionResult['repository']): string {
  const title = capture.title || 'The website';
  const description = capture.description ? ` ${capture.description}` : '';
  const colors = capture.designSignals.colors.slice(0, 4).join(', ') || 'no strong color signals';
  const fonts = capture.designSignals.fonts.slice(0, 2).join(', ') || 'default system typography';
  const framework = repository?.framework && repository.framework !== 'unknown' ? ` It appears to be a ${repository.framework} site.` : '';
  return `${title}.${description} Current visual signals: ${capture.designSignals.density} density, ${capture.designSignals.motionPreference} motion, colors ${colors}, fonts ${fonts}.${framework}`.trim();
}

function buildOperatorNotes(capture: PageCapture, repository: WebsiteIngestionResult['repository']): string[] {
  const notes = [
    `Captured ${capture.metrics.bodyTextLength} visible text characters and ${capture.metrics.headingCount} headings.`,
    `Detected ${capture.designSignals.colors.length} color signals and ${capture.designSignals.fonts.length} font signals.`,
  ];
  if (capture.screenshotPath) notes.push(`Screenshot saved to ${capture.screenshotPath}.`);
  if (repository) notes.push(`Repository shape: ${repository.framework} / ${repository.packageManager}.`);
  return notes;
}

function inferDensity(textLength: number, actionCount: number, sectionCount: number): 'spare' | 'balanced' | 'dense' {
  const score = textLength / 900 + actionCount / 10 + sectionCount / 8;
  if (score > 2.2) return 'dense';
  if (score < 0.8) return 'spare';
  return 'balanced';
}

function inferMotion(textLength: number, buttonCount: number): 'quiet' | 'pulse' | 'kinetic' {
  if (buttonCount >= 5) return 'kinetic';
  if (textLength < 500) return 'quiet';
  return 'pulse';
}

function firstMatch(value: string, pattern: RegExp): string {
  return stripHtml(pattern.exec(value)?.[1] ?? '').trim();
}

function firstHeading(html: string): string {
  return stripHtml(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i.exec(html)?.[1] ?? '').trim();
}

function stripHtml(value: string): string {
  return value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countMatches(value: string, pattern: RegExp): number {
  return Array.from(value.matchAll(pattern)).length;
}

function extractCssColors(value: string): Set<string> {
  const colors = new Set<string>();
  for (const match of value.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)/gi)) colors.add(match[0]);
  return colors;
}

function extractFonts(value: string): Set<string> {
  const fonts = new Set<string>();
  for (const match of value.matchAll(/font-family\s*:\s*([^;}{]+)/gi)) fonts.add(match[1].trim().replaceAll('"', '').replaceAll("'", ''));
  return fonts;
}
