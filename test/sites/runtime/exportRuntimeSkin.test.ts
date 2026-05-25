import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { exportRuntimeSkin } from '../../../src/sites/runtime/exportRuntimeSkin.js';
import type { SkinSpec } from '../../../src/sites/types.js';

describe('exportRuntimeSkin', () => {
  it('refuses to write to the filesystem root', async () => {
    await expect(exportRuntimeSkin(makeSpec(), path.parse(process.cwd()).root)).rejects.toThrow(/filesystem root/);
  });

  it('writes deterministic runtime assets', async () => {
    const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'liminal-sites-export-'));
    const exported = await exportRuntimeSkin(makeSpec(), outputDir);

    expect(await fs.readFile(exported.cssPath, 'utf-8')).toContain('--liminal-sites-bg');
    expect(await fs.readFile(exported.jsPath, 'utf-8')).toContain('document.body.classList.add');
    expect(JSON.parse(await fs.readFile(exported.manifestPath, 'utf-8')).skinId).toBe('demo-site-skin-abc12345-1');
  });

  it('writes component-level mutation rules for actions, cards, and layout', async () => {
    const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'liminal-sites-export-'));
    const exported = await exportRuntimeSkin(makeSpec(), outputDir);
    const css = await fs.readFile(exported.cssPath, 'utf-8');

    expect(css).toContain('--liminal-sites-card-bg');
    expect(css).toContain('--liminal-sites-card-shadow');
    expect(css).toContain('--liminal-sites-button-bg');
    expect(css).toContain('--liminal-sites-button-shadow');
    expect(css).toContain('--liminal-sites-layout-gap');
    expect(css).toContain('body.liminal-sites-active :is(button, a, [role="button"])');
    expect(css).toContain('box-shadow: var(--liminal-sites-button-shadow)');
    expect(css).toContain('body.liminal-sites-active :is(.card, section, article, [data-liminal-card])');
    expect(css).toContain('background: var(--liminal-sites-card-bg)');
    expect(css).toContain('body.liminal-sites-active :is(main, [data-liminal-layout])');
  });
});

function makeSpec(): SkinSpec {
  return {
    skinId: 'demo-site-skin-abc12345-1',
    siteId: 'demo-site-123',
    name: 'Demo direction',
    prompt: 'make it alive',
    createdAt: new Date(0).toISOString(),
    tokens: {
      palette: {
        background: 'hsl(200 30% 8%)',
        surface: 'hsl(200 30% 12%)',
        text: 'hsl(200 20% 94%)',
        mutedText: 'hsl(200 10% 66%)',
        accent: 'hsl(180 80% 60%)',
        accent2: 'hsl(320 80% 62%)',
        line: 'hsl(200 20% 24%)',
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        headingScale: 1.12,
        bodyScale: 1,
      },
      motion: {
        intensity: 0.4,
        rhythm: 'drift',
      },
      shape: {
        radius: 10,
        density: 'balanced',
      },
    },
    runtime: {
      css: '',
      js: '',
    },
    provenance: {
      engine: 'liminal-sites',
      mode: 'runtime-skin',
      seed: 'abc12345',
      source: 'deterministic-mvp',
    },
    quality: {
      score: 0.82,
      notes: ['test fixture'],
    },
  };
}
