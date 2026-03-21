/**
 * SwarmBridge — bridges compost seeds into the swarm pipeline.
 */

import type { Seed } from '../types.js';
import { SeedBank } from '../SeedBank.js';

export class SwarmBridge {
  /** Get a random seed's content for swarm prompt injection. */
  async getSeedForSwarm(seedBank: SeedBank): Promise<string | undefined> {
    return seedBank.getRandomContent();
  }

  /** Get seeds filtered by source domain. */
  async getSeedsByDomain(seedBank: SeedBank, domain: string): Promise<Seed[]> {
    return seedBank.getByDomain(domain);
  }

  /** Get all available seeds sorted by score. */
  async getAllSeeds(seedBank: SeedBank): Promise<Seed[]> {
    return seedBank.getAll();
  }
}
