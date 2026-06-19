import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = `${dir}/${entry}`;
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

function listTrackedFiles(dir: string): string[] {
  return execFileSync('git', ['ls-files', dir], { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);
}

describe('public Liminal Sites metadata', () => {
  it('publishes Forgejo as the source of truth and Sinter as the related creative studio', () => {
    const readme = read('README.md');
    const llms = read('llms.txt');
    const pkg = read('package.json');

    expect(readme).toContain('https://git.kyanitelabs.tech/KyaniteLabs/liminal-sites.git');
    expect(readme).toContain('https://s1ntr.com/');
    expect(llms).toContain('Source repository: https://git.kyanitelabs.tech/KyaniteLabs/liminal-sites');
    expect(llms).toContain('Related creative studio: Sinter, https://s1ntr.com/');
    expect(pkg).toContain('git+https://git.kyanitelabs.tech/KyaniteLabs/liminal-sites.git');
  });

  it('serves AI and search discovery files from the GitHub Pages docs root', () => {
    const docsIndex = read('docs/index.html');
    const docsLlms = read('docs/llms.txt');
    const robots = read('docs/robots.txt');
    const sitemap = read('docs/sitemap.xml');
    const manifest = read('docs/manifest.json');

    expect(docsIndex).toContain('href="https://kyanitelabs.github.io/liminal-sites/sitemap.xml"');
    expect(docsIndex).toContain('href="https://kyanitelabs.github.io/liminal-sites/llms.txt"');
    expect(docsIndex).toContain('codeRepository": "https://git.kyanitelabs.tech/KyaniteLabs/liminal-sites"');
    expect(docsIndex).toContain('https://s1ntr.com/');
    expect(docsLlms).toContain('Related creative studio: Sinter, https://s1ntr.com/');
    expect(robots).toContain('Sitemap: https://kyanitelabs.github.io/liminal-sites/sitemap.xml');
    expect(sitemap).toContain('<loc>https://kyanitelabs.github.io/liminal-sites/</loc>');
    expect(manifest).toContain('"name": "Liminal Sites"');
  });

  it('keeps the legacy landing-live path as a website boundary bridge, not a copied creative gallery', () => {
    const files = listFiles('landing-live').map((path) => path.replace(/^landing-live\//, ''));
    const html = read('landing-live/index.html');

    expect(files).toEqual(['index.html']);
    expect(html).toContain('Website demos live here now.');
    expect(html).toContain('pnpm proof:living-sites-reliability');
    expect(html).toContain('https://s1ntr.com/');
    expect(html).not.toContain('Dogfood Gallery');
    expect(html).not.toContain('<iframe');
    expect(html).not.toContain('gallery-data.js');
    expect(html).not.toMatch(/\b(p5|glsl|hydra|strudel|tone|revideo)\b/i);
  });

  it('keeps inherited creative-product pages out of the active docs root', () => {
    const rootDocs = readdirSync('docs', { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name);
    const docsReadme = read('docs/README.md');

    for (const archivedPublicPage of [
      'architecture.html',
      'cli-reference.html',
      'features.html',
      'io-catalog.html',
      'soul-system.html',
      'CREATIVE_DOMAIN_TYPES.md',
      'FINISH_LINE.md',
      'GENERATOR_ARCHITECTURE_V2.md',
    ]) {
      expect(rootDocs).not.toContain(archivedPublicPage);
    }

    expect(docsReadme).toContain('website-design product');
    expect(docsReadme).toContain('docs/archive/');
    expect(docsReadme).not.toContain('marketing/launch-thread-ready.md');
    expect(docsReadme).not.toContain('GENERATOR_ARCHITECTURE_V2.md');
  });

  it('keeps inherited generator plugin stubs and generated examples out of the active repo surface', () => {
    const examples = listTrackedFiles('examples').map((path) => path.replace(/^examples\//, '')).sort();

    expect(existsSync('plugins')).toBe(false);
    expect(existsSync('docs/dynamic-domain-registration.md')).toBe(false);
    expect(examples).toEqual([
      'composition-basic.ts',
      'composition-programmatic.ts',
    ]);
  });

  it('does not expose inherited creative-code dogfood gallery tooling as website scripts', () => {
    const pkg = JSON.parse(read('package.json')) as {
      keywords?: string[];
      scripts?: Record<string, string>;
    };
    const scriptSources = listFiles('scripts')
      .filter((path) => /\.(?:cjs|js|mjs|sh|ts|tsx)$/.test(path))
      .map((path) => ({ path, source: read(path) }));

    expect(pkg.scripts).not.toHaveProperty('dogfood:report');
    expect(pkg.keywords).not.toContain('creative-coding');
    expect(pkg.keywords).toContain('website-design');
    expect(scriptSources.filter(({ source }) => source.includes('landing-live')).map(({ path }) => path)).toEqual([]);
    expect(scriptSources.filter(({ source }) => source.includes('Dogfood Gallery')).map(({ path }) => path)).toEqual([]);
    expect(scriptSources.filter(({ source }) => source.includes('gallery-data.js')).map(({ path }) => path)).toEqual([]);
  });
});
