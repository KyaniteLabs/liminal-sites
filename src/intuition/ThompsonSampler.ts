/**
 * * ThompsonSampler — Generic parameterized Thompson Sampling.
 *
 * Reuses `sampleBeta()` from ModelRouter for Beta distribution sampling.
 * Parameterized over arm key type K — works for model selection,
 * strategy choice, template selection, temperature, or any discrete decision.
 *
 * Each arm maintains a Beta(alpha, beta) distribution updated by outcomes:
 *   - score >= successThreshold → alpha += 1 (success)
 *   - score < successThreshold → beta += 1 (failure)
 *
 * @module intuition/ThompsonSampler
 */

import { sampleBeta } from '../compost/ModelRouter.js';
import { Logger } from '../utils/Logger.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Configuration for a Thompson sampler instance. */
export interface ThompsonConfig {
  /** Minimum pulls before trusting the bandit (exploration phase). Default: 5 */
  minPulls: number;
  /** Score threshold for considering an outcome successful. Default: 0.7 */
  successThreshold: number;
  /** Maximum number of arms before eviction. Default: 100 */
  maxArms: number;
}

/** State for a single arm. */
export interface ArmState {
  alpha: number;
  beta: number;
  pulls: number;
  totalReward: number;
}

/** Serializable sampler state for persistence. */
export interface SamplerState {
  version: number;
  arms: Array<{ key: string } & ArmState>;
  updatedAt: string;
}

const DEFAULT_CONFIG: ThompsonConfig = {
  minPulls: 5,
  successThreshold: 0.7,
  maxArms: 100,
};

// ---------------------------------------------------------------------------
// ThompsonSampler
// ---------------------------------------------------------------------------

/**
 * Generic Thompson Sampling with parameterized arm keys.
 *
 * @typeParam K - The arm identifier type (e.g., 'local' | 'cloud' | 'hybrid', or 'p5:local', or domain strings)
 */
export class ThompsonSampler<K extends string = string> {
  private arms = new Map<K, ArmState>();
  private readonly config: ThompsonConfig;

  constructor(config?: Partial<ThompsonConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Select the best arm using Thompson Sampling.
   * Returns null if no arm has enough pulls yet exploration phase).
   */
  select(): K | null {
    const candidates: Array<{ key: K; arm: ArmState }> = [];

    for (const [key, arm] of this.arms) {
      if (arm.pulls >= this.config.minPulls) {
        candidates.push({ key, arm });
      }
    }

    if (candidates.length === 0) return null;

    let bestKey: K = candidates[0].key;
    let bestSample = -Infinity;

    for (const { key, arm } of candidates) {
      const sample = sampleBeta(arm.alpha, arm.beta);
      if (sample > bestSample) {
        bestSample = sample;
        bestKey = key;
      }
    }

    return bestKey;
  }

  /**
   * Force-select the best arm by mean reward (for reporting).
   */
  bestByMean(): K | null {
    let bestKey: K | null = null;
    let bestMean = -Infinity;

    for (const [key, arm] of this.arms) {
      if (arm.pulls === 0) continue;
      const mean = arm.totalReward / arm.pulls;
      if (mean > bestMean) {
        bestMean = mean;
        bestKey = key;
      }
    }

    return bestKey;
  }

  /**
   * Record an outcome for online learning.
   */
  update(key: K, score: number): void {
    const arm = this.getOrCreateArm(key);
    arm.pulls++;
    arm.totalReward += score;

    if (score >= this.config.successThreshold) {
      arm.alpha += 1;
    } else {
      arm.beta += 1;
    }
  }

  /**
   * Get the confidence level for a key (0-1).
   * Higher alpha relative to beta = higher confidence.
   */
  getConfidence(key: K): number {
    const arm = this.arms.get(key);
    if (!arm || arm.pulls === 0) return 0;
    return arm.alpha / (arm.alpha + arm.beta);
  }

  /**
   * Get the Thompson sample value for a key (without selecting).
   */
  getSample(key: K): number {
    const arm = this.arms.get(key);
    if (!arm) return 0.5;
    return sampleBeta(arm.alpha, arm.beta);
  }

  /** Get all arm states (for reporting). */
  getArms(): Map<K, ArmState> {
    return new Map(this.arms);
  }

  /** Get stats for a specific arm. */
  getArmStats(key: K): ArmState | null {
    const arm = this.arms.get(key);
    return arm ? { ...arm } : null;
  }

  /** Check if any arm has enough data for decisions. */
  isReady(): boolean {
    for (const arm of this.arms.values()) {
      if (arm.pulls >= this.config.minPulls) return true;
    }
    return false;
  }

  /** Total pulls across all arms. */
  get totalPulls(): number {
    let total = 0;
    for (const arm of this.arms.values()) total += arm.pulls;
    return total;
  }

  /** Serialize for persistence. */
  serialize(): SamplerState {
    return {
      version: 1,
      arms: Array.from(this.arms.entries()).map(([key, arm]) => ({
        key: key as string,
        ...arm,
      })),
      updatedAt: new Date().toISOString(),
    };
  }

  /** Load from persisted state. */
  deserialize(state: SamplerState): void {
    this.arms.clear();
    for (const arm of state.arms) {
      this.arms.set(arm.key as K, {
        alpha: arm.alpha,
        beta: arm.beta,
        pulls: arm.pulls,
        totalReward: arm.totalReward,
      });
    }
    Logger.info('ThompsonSampler', `Loaded ${this.arms.size} arms from persisted state`);
  }

  /** Reset all state (for testing). */
  reset(): void {
    this.arms.clear();
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private getOrCreateArm(key: K): ArmState {
    let arm = this.arms.get(key);
    if (!arm) {
      if (this.arms.size >= this.config.maxArms) {
        // Evict least-pulled arm
        let minPulls = Infinity;
        let minKey: K | null = null;
        for (const [k, a] of this.arms) {
          if (a.pulls < minPulls) {
            minPulls = a.pulls;
            minKey = k;
          }
        }
        if (minKey) this.arms.delete(minKey);
      }
      arm = { alpha: 1, beta: 1, pulls: 0, totalReward: 0 };
      this.arms.set(key, arm);
    }
    return arm;
  }
}
