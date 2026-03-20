/**
 * EvaluationFramework - Unified evaluation interface
 *
 * Provides a facade for different evaluation strategies:
 * - 'detailed': Full LLM-based evaluation (CreativeEvaluator)
 * - 'fast': Heuristic quick scoring (from collab/Scoring)
 * - 'heuristic': Swarm heuristic scoring (HeuristicScorer)
 * - 'fitness': Multi-dimensional fitness calculation (FitnessCalculator)
 */

import { CreativeEvaluator } from './CreativeEvaluator.js';
import { FitnessCalculator, type DimensionScores } from './FitnessCalculator.js';
import { HeuristicScorer } from '../swarm/HeuristicScorer.js';
import { quickScore } from '../collab/Scoring.js';
import type { DomainType } from '../collab/types.js';
import type { SwarmPersona } from '../swarm/types.js';

/**
 * Result from any evaluation strategy
 */
export interface EvaluationResult {
  /** Overall score (0-1) */
  score: number;
  /** Dimension-specific scores (when available) */
  details?: Record<string, number>;
  /** Human-readable reasoning or feedback (when available) */
  reasoning?: string;
  /** The strategy used for evaluation */
  strategy: EvaluationStrategy;
}

/**
 * Contextual information for evaluation
 */
export interface EvaluationContext {
  /** Original prompt or constraint (for heuristic scoring) */
  prompt?: string;
  /** Creative domain hint (for fast scoring) */
  domain?: DomainType;
  /** Evaluation criteria dimensions (for detailed scoring) */
  criteria?: string[];
  /** Previous outputs for novelty calculation (for heuristic scoring) */
  previousOutputs?: string[];
  /** Persona for swarm heuristic scoring (for heuristic strategy) */
  persona?: SwarmPersona;
  /** Pre-computed dimension scores (for fitness strategy) */
  dimensionScores?: DimensionScores;
  /** Fitness weights (for fitness strategy) */
  weights?: { technical?: number; aesthetic?: number; novelty?: number; default?: number };
}

/**
 * Available evaluation strategies
 */
export type EvaluationStrategy = 'detailed' | 'fast' | 'heuristic' | 'fitness';

/**
 * Unified evaluation framework providing multiple evaluation strategies
 *
 * This class acts as a facade over different evaluation approaches:
 * - detailed: Uses CreativeEvaluator for comprehensive LLM-based evaluation
 * - fast: Uses quickScore for lightweight heuristic scoring
 * - heuristic: Uses HeuristicScorer for swarm-style multi-dimensional scoring
 * - fitness: Uses FitnessCalculator for weighted aggregation of dimension scores
 */
export class EvaluationFramework {
  /**
   * Evaluate input using the specified strategy.
   *
   * @param input - The creative output to evaluate
   * @param strategy - The evaluation strategy to use (default: 'fast')
   * @param context - Optional context for evaluation
   * @returns Promise resolving to evaluation result
   *
   * @example
   * // Fast heuristic scoring
   * const result = await EvaluationFramework.evaluate(code, 'fast', { domain: 'p5' });
   *
   * @example
   * // Detailed evaluation with custom criteria
   * const result = await EvaluationFramework.evaluate(code, 'detailed', {
   *   criteria: ['technical', 'aesthetic', 'novelty']
   * });
   *
   * @example
   * // Fitness calculation from dimension scores
   * const result = await EvaluationFramework.evaluate('', 'fitness', {
   *   dimensionScores: { technical: 0.8, aesthetic: 0.7, novelty: 0.9 }
   * });
   */
  static async evaluate(
    input: string,
    strategy: EvaluationStrategy = 'fast',
    context: EvaluationContext = {}
  ): Promise<EvaluationResult> {
    switch (strategy) {
      case 'detailed': {
        // CreativeEvaluator.assess() returns AssessmentResult with score, technicalScore, creativeScore, etc.
        const result = CreativeEvaluator.assess(input, {
          evaluationCriteria: context.criteria,
          domain: context.domain,
        });

        // Build details from available dimension scores
        const details: Record<string, number> = {
          technical: result.technicalScore,
          creative: result.creativeScore,
        };
        if (result.noveltyScore !== undefined) details.novelty = result.noveltyScore;
        if (result.aestheticScore !== undefined) details.aesthetic = result.aestheticScore;
        if (result.emergenceScore !== undefined) details.emergence = result.emergenceScore;
        if (result.interestingnessScore !== undefined) details.interestingness = result.interestingnessScore;

        return {
          score: result.score,
          details,
          reasoning: result.issues.length > 0 ? result.issues.join('; ') : undefined,
          strategy: 'detailed',
        };
      }

      case 'fast': {
        // quickScore is a simple function returning a number
        const score = quickScore(input, context.domain || '');
        return {
          score,
          strategy: 'fast',
        };
      }

      case 'heuristic': {
        // HeuristicScorer.scoreOutput() is static and requires persona and constraint
        // If not provided, use sensible defaults
        const defaultPersona: SwarmPersona = {
          id: 'default',
          name: 'Default Persona',
          displayName: 'Default',
          model: 'default',
          temperature: 0.7,
          maxTokens: 2000,
          systemPrompt: 'You are an expert evaluator of creative code. Assess technical execution, aesthetic quality, and creative originality. Score 1-10 with brief justification. Consider correctness, code quality, visual appeal, and novelty.',
          voice: 'neutral',
          thinkingStyle: 'balanced',
          votingBias: 'neutral',
          constraints: [],
          votingPower: 2,
        };

        const persona = context.persona || defaultPersona;
        const constraint = context.prompt || '';
        const previousOutputs = context.previousOutputs || [];

        const dims = HeuristicScorer.scoreOutput(input, persona, constraint, previousOutputs);

        // Calculate weighted total using the same weights as HeuristicScorer
        const weights = { constraint: 0.25, novelty: 0.20, length: 0.20, vocabulary: 0.20, codeStructure: 0.15 };
        const score = weights.constraint * dims.constraint
          + weights.novelty * dims.novelty
          + weights.length * dims.length
          + weights.vocabulary * dims.vocabulary
          + weights.codeStructure * dims.codeStructure;

        return {
          score,
          details: {
            constraint: dims.constraint,
            novelty: dims.novelty,
            length: dims.length,
            vocabulary: dims.vocabulary,
            codeStructure: dims.codeStructure,
          },
          reasoning: `Heuristic scoring across 5 dimensions`,
          strategy: 'heuristic',
        };
      }

      case 'fitness': {
        // FitnessCalculator.calculate() takes DimensionScores and returns weighted average
        const calc = new FitnessCalculator(context.weights);
        const scores = context.dimensionScores || {};
        const score = calc.calculate(scores);

        // Filter out undefined values for details
        const details: Record<string, number> = {};
        for (const [key, value] of Object.entries(scores)) {
          if (value !== undefined) {
            details[key] = value;
          }
        }

        return {
          score,
          details,
          strategy: 'fitness',
        };
      }

      default:
        throw new Error(`Unknown evaluation strategy: ${strategy}`);
    }
  }

  /**
   * Evaluate using multiple strategies and return all results.
   *
   * @param input - The creative output to evaluate
   * @param strategies - Array of strategies to use
   * @param context - Optional context for evaluation
   * @returns Promise resolving to map of strategy -> result
   */
  static async evaluateMulti(
    input: string,
    strategies: EvaluationStrategy[] = ['fast', 'detailed'],
    context: EvaluationContext = {}
  ): Promise<Map<EvaluationStrategy, EvaluationResult>> {
    const results = new Map<EvaluationStrategy, EvaluationResult>();

    for (const strategy of strategies) {
      try {
        const result = await this.evaluate(input, strategy, context);
        results.set(strategy, result);
      } catch (error) {
        // Log but don't fail entire operation
        console.warn(`Failed to evaluate with strategy '${strategy}':`, error);
      }
    }

    return results;
  }

  /**
   * Get the best score across multiple evaluation strategies.
   *
   * @param input - The creative output to evaluate
   * @param strategies - Array of strategies to use
   * @param context - Optional context for evaluation
   * @returns Promise resolving to the best result
   */
  static async evaluateBest(
    input: string,
    strategies: EvaluationStrategy[] = ['fast', 'detailed'],
    context: EvaluationContext = {}
  ): Promise<EvaluationResult> {
    const results = await this.evaluateMulti(input, strategies, context);

    if (results.size === 0) {
      throw new Error('All evaluation strategies failed');
    }

    // Find result with highest score
    let bestResult: EvaluationResult | null = null;
    for (const result of Array.from(results.values())) {
      if (!bestResult || result.score > bestResult.score) {
        bestResult = result;
      }
    }

    return bestResult!;
  }
}
