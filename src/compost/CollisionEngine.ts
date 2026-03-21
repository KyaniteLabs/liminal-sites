/**
 * CollisionEngine — cross-domain collision pairing and merging.
 * Discovers emergent connections between fragments from different domains.
 */

import type { CompostConfig, CompostFragment, CollisionPair, CollisionResult } from './types.js';

export class CollisionEngine {
  private config: CompostConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private llm: any;

  constructor(config: CompostConfig, llm?: any) {
    this.config = config;
    this.llm = llm;
  }

  /** Pair files created within 1 hour from different domains. */
  findTimestampCollisions(fragments: CompostFragment[]): CollisionPair[] {
    const pairs: CollisionPair[] = [];
    const sorted = [...fragments].sort((a, b) =>
      a.metadata.timestamp.localeCompare(b.metadata.timestamp)
    );

    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const timeA = new Date(sorted[i].metadata.timestamp).getTime();
        const timeB = new Date(sorted[j].metadata.timestamp).getTime();
        const hourMs = 60 * 60 * 1000;

        if (timeB - timeA > hourMs) break; // past window
        if (sorted[i].domain === sorted[j].domain) continue;
        if (sorted[i].id === sorted[j].id) continue;

        pairs.push({ a: sorted[i], b: sorted[j], strategy: 'timestamp' });
      }
    }
    return pairs;
  }

  /** Pair files of similar byte size from different types. */
  findSizeCollisions(fragments: CompostFragment[]): CollisionPair[] {
    const pairs: CollisionPair[] = [];
    const threshold = 0.1; // 10% size difference

    for (let i = 0; i < fragments.length; i++) {
      for (let j = i + 1; j < fragments.length; j++) {
        if (fragments[i].domain === fragments[j].domain) continue;
        const sizeA = fragments[i].metadata.size;
        const sizeB = fragments[j].metadata.size;
        if (sizeA === 0 || sizeB === 0) continue;

        const ratio = Math.abs(sizeA - sizeB) / Math.max(sizeA, sizeB);
        if (ratio <= threshold) {
          pairs.push({ a: fragments[i], b: fragments[j], strategy: 'size' });
        }
      }
    }
    return pairs;
  }

  /** Pair by shared metadata values. */
  findMetadataCollisions(fragments: CompostFragment[]): CollisionPair[] {
    const pairs: CollisionPair[] = [];
    const grouped = new Map<string, CompostFragment[]>();

    for (const frag of fragments) {
      const key = `${frag.metadata.fileType}:${frag.metadata.size > 0 ? 'has-content' : 'empty'}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(frag);
    }

    for (const [, group] of grouped) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          if (group[i].domain !== group[j].domain) {
            pairs.push({ a: group[i], b: group[j], strategy: 'metadata' });
          }
        }
      }
    }
    return pairs;
  }

  /** Pair by SHA256 prefix similarity (first 4 hex chars). */
  findHashCollisions(fragments: CompostFragment[]): CollisionPair[] {
    const pairs: CollisionPair[] = [];
    const byPrefix = new Map<string, CompostFragment[]>();

    for (const frag of fragments) {
      const prefix = frag.metadata.hash.slice(0, 4);
      if (!byPrefix.has(prefix)) byPrefix.set(prefix, []);
      byPrefix.get(prefix)!.push(frag);
    }

    for (const [, group] of byPrefix) {
      if (group.length < 2) continue;
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          if (group[i].domain !== group[j].domain) {
            pairs.push({ a: group[i], b: group[j], strategy: 'hash' });
          }
        }
      }
    }
    return pairs;
  }

  /** Pair fragments sharing tags from unrelated domains. */
  findTagCollisions(fragments: CompostFragment[]): CollisionPair[] {
    const pairs: CollisionPair[] = [];
    const tagGroups = new Map<string, CompostFragment[]>();

    for (const frag of fragments) {
      for (const tag of frag.tags) {
        if (!tagGroups.has(tag)) tagGroups.set(tag, []);
        tagGroups.get(tag)!.push(frag);
      }
    }

    for (const [, group] of tagGroups) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          if (group[i].domain !== group[j].domain) {
            pairs.push({ a: group[i], b: group[j], strategy: 'tag' });
          }
        }
      }
    }
    return pairs;
  }

  /** Pair most-different domains deliberately. */
  findDomainOpposites(fragments: CompostFragment[]): CollisionPair[] {
    const pairs: CollisionPair[] = [];
    const domains = [...new Set(fragments.map(f => f.domain))];

    if (domains.length < 2) return pairs;

    // Pair each domain with the most "different" one
    for (let i = 0; i < domains.length; i++) {
      for (let j = i + 1; j < domains.length; j++) {
        const fragsA = fragments.filter(f => f.domain === domains[i]);
        const fragsB = fragments.filter(f => f.domain === domains[j]);
        if (fragsA.length > 0 && fragsB.length > 0) {
          pairs.push({ a: fragsA[0], b: fragsB[0], strategy: 'domain-opposite' });
        }
      }
    }
    return pairs;
  }

  /** Stochastic 10% sampling of all possible pairs. */
  findRandomCollisions(fragments: CompostFragment[]): CollisionPair[] {
    const pairs: CollisionPair[] = [];
    const allPairs: [CompostFragment, CompostFragment][] = [];

    for (let i = 0; i < fragments.length; i++) {
      for (let j = i + 1; j < fragments.length; j++) {
        if (fragments[i].domain !== fragments[j].domain) {
          allPairs.push([fragments[i], fragments[j]]);
        }
      }
    }

    // Sample 10%
    const sampleSize = Math.ceil(allPairs.length * 0.1);
    for (let i = 0; i < sampleSize && allPairs.length > 0; i++) {
      const idx = Math.floor(Math.random() * allPairs.length);
      const [a, b] = allPairs.splice(idx, 1)[0];
      pairs.push({ a, b, strategy: 'random' });
    }
    return pairs;
  }

  /** Merge a collision pair via LLM. */
  async mergePair(a: CompostFragment, b: CompostFragment): Promise<string> {
    if (!this.llm) return `[${a.domain} + ${b.domain}] ${a.content.slice(0, 100)} ... ${b.content.slice(0, 100)}`;

    try {
      const result = await this.llm.generate(
        'You are a creative cross-domain collision engine. Combine these two fragments from unrelated domains into a surprising new idea. Be specific and creative.',
        `[Fragment A — domain: ${a.domain}, layer: ${a.layer}]\n${a.content}\n\n[Fragment B — domain: ${b.domain}, layer: ${b.layer}]\n${b.content}\n\nWhat ideas emerge from this intersection?`
      );
      return result.success ? result.code : `[${a.domain} + ${b.domain}] collision`;
    } catch {
      return `[${a.domain} + ${b.domain}] collision`;
    }
  }

  /** Run all collision strategies and merge pairs. */
  async runAll(fragments: CompostFragment[]): Promise<CollisionResult[]> {
    const allPairs = [
      ...this.findTimestampCollisions(fragments),
      ...this.findSizeCollisions(fragments),
      ...this.findMetadataCollisions(fragments),
      ...this.findHashCollisions(fragments),
      ...this.findTagCollisions(fragments),
      ...this.findDomainOpposites(fragments),
      ...this.findRandomCollisions(fragments),
    ];

    // Deduplicate by pair IDs
    const seen = new Set<string>();
    const uniquePairs = allPairs.filter(p => {
      const key = [p.a.id, p.b.id].sort().join('-');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const results: CollisionResult[] = [];
    const maxCollisions = this.config.maxSeedsPerDigest * 5;
    const pairsToProcess = uniquePairs.slice(0, maxCollisions);

    const merged = await Promise.allSettled(
      pairsToProcess.map(p => this.mergePair(p.a, p.b))
    );

    for (let i = 0; i < merged.length; i++) {
      if (merged[i].status === 'fulfilled') {
        results.push({
          fragmentA: pairsToProcess[i].a,
          fragmentB: pairsToProcess[i].b,
          strategy: pairsToProcess[i].strategy,
          mergedContent: (merged[i] as PromiseFulfilledResult<string>).value,
        });
      }
    }

    return results;
  }
}
