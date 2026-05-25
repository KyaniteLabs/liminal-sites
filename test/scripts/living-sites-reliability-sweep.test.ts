import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(import.meta.dirname, '../..');

describe('living-sites reliability sweep script', () => {
  it('is package-addressable and exposes the collaborator demo scenarios', () => {
    const pkg = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8')) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts['proof:living-sites-reliability']).toBe('tsx scripts/proof/living-sites-reliability-sweep.ts');

    const output = execFileSync('pnpm', ['exec', 'tsx', 'scripts/proof/living-sites-reliability-sweep.ts', '--list-scenarios'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    const scenarios = JSON.parse(output) as Array<{ id: string; title: string }>;

    expect(scenarios.map((scenario) => scenario.id)).toEqual([
      'operator-launch',
      'b2b-control-room',
      'creative-portfolio',
      'venue-menu',
    ]);
    expect(scenarios.every((scenario) => scenario.title.length > 8)).toBe(true);
  });
});
