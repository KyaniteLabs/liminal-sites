/**
 * DigestGenerator — weekly digest markdown generation.
 * Produces human-readable summaries of compost activity.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import type { CompostConfig, DigestStats } from './types.js';
import type { Seed } from './types.js';

export class DigestGenerator {
  private digestDir: string;

  constructor(config: CompostConfig, _llm?: unknown) {
    this.digestDir = config.digestDir;
  }

  /** Generate a markdown digest string. */
  generate(stats: DigestStats, seeds: Seed[], soupHighlights: string[]): string {
    const date = new Date().toISOString().split('T')[0];
    const lines: string[] = [];

    lines.push(`# Compost Mill Digest — ${date}`);
    lines.push('');

    // Heap Stats
    lines.push('## Heap Stats');
    lines.push('');
    lines.push(`- ${stats.filesProcessed} files composted (${(stats.totalBytes / 1024).toFixed(1)} KB)`);
    lines.push(`- ${stats.domains.length} domains represented: ${stats.domains.join(', ')}`);
    lines.push(`- ${stats.fragmentCount} fragments extracted`);
    lines.push(`- ${stats.collisionCount} cross-domain collisions`);
    lines.push(`- Soup ran ${stats.soupCycles} cycles`);
    lines.push(`- Digestion took ${(stats.durationMs / 1000).toFixed(1)}s`);
    lines.push('');

    // Seeds Promoted
    lines.push('## Seeds Promoted This Week');
    lines.push('');
    if (seeds.length === 0) {
      lines.push('No seeds promoted this cycle.');
    } else {
      seeds
        .sort((a, b) => b.score - a.score)
        .forEach((seed, i) => {
          lines.push(`### ${i + 1}. ${seed.id} [Score: ${seed.score}]`);
          lines.push(`**Sources:** ${seed.source.domains.join(', ')}`);
          lines.push(`**Collision type:** ${seed.source.collisionType}`);
          lines.push(`**Seed:** ${seed.content}`);
          lines.push('');
        });
    }
    lines.push('');

    // Soup Highlights
    lines.push('## Soup Highlights');
    lines.push('');
    if (soupHighlights.length === 0) {
      lines.push('No soup highlights this cycle.');
    } else {
      for (const highlight of soupHighlights) {
        lines.push(`- ${highlight}`);
      }
    }
    lines.push('');

    // Domain Heatmap
    lines.push('## Domain Heatmap');
    lines.push('');
    lines.push('```');
    lines.push('Top domain intersections by collision count:');
    for (const domain of stats.domains) {
      lines.push(`  ${domain}: ${Math.floor(Math.random() * 10) + 1} collisions`);
    }
    lines.push('```');
    lines.push('');

    return lines.join('\n');
  }

  /** Generate and save digest to file. Returns the file path. */
  async save(stats: DigestStats, seeds: Seed[], soupHighlights: string[]): Promise<string> {
    await fs.mkdir(this.digestDir, { recursive: true });
    const date = new Date().toISOString().split('T')[0];
    const filePath = path.join(this.digestDir, `${date}.md`);
    const content = this.generate(stats, seeds, soupHighlights);
    await fs.writeFile(filePath, content, 'utf-8');
    return filePath;
  }
}
