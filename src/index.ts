/**
 * Atelier - Creative Coding Agent
 *
 * A single-purpose agent with internal Ralph-Wiggum Loop
 * for generating emergent generative art.
 */

export const ATELIER_VERSION = '1.0.0';

export interface AtelierConfig {
  name: string;
  version: string;
  loop: {
    maxIterations: number;
    timeoutMinutes: number;
    completionPromise: string;
  };
  creative: {
    defaultFramework: 'p5.js';
    evaluationCriteria: string[];
    minQualityScore: number;
  };
  gallery: {
    autoSave: boolean;
    maxHistoryPerProject: number;
  };
  renderer: {
    port: number;
    screenshotOnIteration: boolean;
  };
}

export const defaultConfig: AtelierConfig = {
  name: 'atelier',
  version: ATELIER_VERSION,
  loop: {
    maxIterations: 20,
    timeoutMinutes: 30,
    completionPromise: 'COMPLETE',
  },
  creative: {
    defaultFramework: 'p5.js',
    evaluationCriteria: ['aesthetic', 'technical', 'novelty'],
    minQualityScore: 0.7,
  },
  gallery: {
    autoSave: true,
    maxHistoryPerProject: 50,
  },
  renderer: {
    port: 3456,
    screenshotOnIteration: true,
  },
};

/**
 * Main Atelier class - entry point for the creative coding agent
 */
export class Atelier {
  private config: AtelierConfig;

  constructor(config: Partial<AtelierConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  getConfig(): AtelierConfig {
    return this.config;
  }
}

export default Atelier;
