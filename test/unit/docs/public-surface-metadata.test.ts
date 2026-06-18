import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

describe('public Liminal Sites metadata', () => {
  it('publishes Forgejo as the source of truth and Sinter as the inherited creative studio', () => {
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
});
