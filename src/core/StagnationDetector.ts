/**
 * StagnationDetector - Stagnation detection with self-reflection improvement
 *
 * Tracks iteration scores and detects when the loop is stagnating.
 * Uses SelfReflectionEngine to suggest improvements before breaking.
 *
 * Extracted from RalphLoop.ts (lines 604-650).
 */

import { SelfReflectionEngine } from '../improvement/SelfReflection.js';
import { ContextAccumulation } from './ContextAccumulation.js';

export interface StagnationCheckResult {
  shouldBreak: boolean;
  reason: string;
}

/**
 * Detects stagnation and attempts recovery via self-reflection.
 */
export class StagnationDetector {
  private bestScore = 0;
  private iterationsSinceLastImprovement = 0;
  private readonly selfReflection = new SelfReflectionEngine();

  constructor(
    private stagnationThreshold: number
  ) {}

  /**
   * Check for stagnation after each iteration.
   * Returns whether the loop should break and the reason.
   *
   * High novelty resets stagnation — the system is exploring
   * even if quality plateaus.
   */
  check(
    iteration: number,
    evaluationScore: number,
    noveltyScore: number,
    prompt: string
  ): StagnationCheckResult {
    // High novelty resets stagnation
    if (noveltyScore > 0.5) {
      this.iterationsSinceLastImprovement = Math.max(0, this.iterationsSinceLastImprovement - 1);
    }

    if (evaluationScore > this.bestScore) {
      this.bestScore = evaluationScore;
      this.iterationsSinceLastImprovement = 0;
      return { shouldBreak: false, reason: '' };
    }

    this.iterationsSinceLastImprovement++;

    if (
      this.stagnationThreshold != null &&
      this.stagnationThreshold > 0 &&
      this.iterationsSinceLastImprovement >= this.stagnationThreshold
    ) {
      // Use self-reflection to check if improvement is possible
      const suggestions = this.selfReflection.analyze();
      const improvementSpec = suggestions.length > 0
        ? this.selfReflection.designImprovementSpec(suggestions[0])
        : null;

      if (improvementSpec) {
        // Give the loop one more chance via improvement suggestion
        if (this.iterationsSinceLastImprovement === this.stagnationThreshold) {
          ContextAccumulation.save({
            iteration: iteration + 0.5,
            prompt,
            usedPrompt: improvementSpec,
            code: '',
            evaluation: { score: 0, issues: [suggestions[0].description] },
            timestamp: new Date().toISOString(),
            maxIterations: undefined,
          });
          // Reset counter to give improvement a chance
          this.iterationsSinceLastImprovement = 0;
          return { shouldBreak: false, reason: '' };
        } else {
          return {
            shouldBreak: true,
            reason: `stagnation detected (${this.iterationsSinceLastImprovement} iterations without improvement)`
          };
        }
      } else {
        return {
          shouldBreak: true,
          reason: `stagnation detected (${this.iterationsSinceLastImprovement} iterations without improvement)`
        };
      }
    }

    return { shouldBreak: false, reason: '' };
  }
}
