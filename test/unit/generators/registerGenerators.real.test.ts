import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generatorRegistry } from '../../../src/generators/GeneratorRegistry.js';
import { registerAllGenerators } from '../../../src/generators/registerGenerators.js';
import {
  buildLiminalCapabilityMatrix,
  FULL_LIMINAL_SITE_DOMAINS,
} from '../../../src/sites/creative/LiminalCapabilityMatrix.js';

describe('registerAllGenerators real registry integration', () => {
  beforeEach(() => {
    generatorRegistry.clear();
  });

  afterEach(() => {
    generatorRegistry.clear();
  });

  it('keeps every full-liminal site domain backed by a real generator registry entry', async () => {
    await registerAllGenerators();

    const registeredNames = new Set(generatorRegistry.getAll().map((entry) => entry.name));
    const missingDomains = FULL_LIMINAL_SITE_DOMAINS.filter((domain) => !registeredNames.has(domain));

    expect(missingDomains).toEqual([]);
  });

  it('reports every full-liminal generator as available in the product capability matrix', async () => {
    const matrix = await buildLiminalCapabilityMatrix({
      strategy: 'full-liminal',
      domainMode: 'all',
      selectedDomains: FULL_LIMINAL_SITE_DOMAINS,
    });

    const unavailable = matrix.domains
      .filter((capability) => !capability.generator.available)
      .map((capability) => capability.domain);

    expect(unavailable).toEqual([]);
  });
});
