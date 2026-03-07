/**
 * RalphLoop - Self-recursive iteration engine for Atelier
 *
 * Implements the Ralph-Wiggum Loop pattern:
 * - Same prompt every iteration
 * - Context changes each iteration (previous work, history)
 * - Self-evaluation and improvement
 * - Terminates on promise detection or max-iterations
 *
 * Safety mechanisms:
 * - Max-iterations hard limit
 * - Timeout protection per iteration
 * - Quality gates via CreativeEvaluator
 * - Error tolerance
 *
 * Integration:
 * - Uses PromptStore for consistent prompts
 * - Uses ContextAccumulation for state management
 * - Uses P5Generator for code generation
 * - Uses CreativeEvaluator for quality assessment
 * - Uses PromiseDetector for termination detection
 * - Uses Gallery for iteration persistence
 */

import { PromptStore } from './PromptStore.js';
import { ContextAccumulation } from './ContextAccumulation.js';
import { CreativeEvaluator } from './CreativeEvaluator.js';
import { PromiseDetector } from './PromiseDetector.js';
import { P5GeneratorLLM } from '../generators/p5/P5GeneratorLLM.js';
import { Gallery } from '../gallery/Gallery.js';

interface LoopOptions {
  maxIterations?: number;
  timeoutMinutes?: number;
  galleryDir?: string;
  project?: string;
  tolerateErrors?: boolean;
  minQualityScore?: number;
  /** Optional seed code for iteration 1: "improve this toward [prompt]" */
  seedCode?: string;
  /** Optional seed template name or content for iteration 1 */
  seedTemplate?: string;
  /** Max characters of context to inject (truncation). PRD: Context bloat. */
  maxContextLength?: number;
  /** Include only last K iterations in context (default: all in history up to maxContextLength) */
  lastKIterations?: number;
}

interface LoopResult {
  code: string;
  iterations: number;
  completed: boolean;
  reason: string;
  timestamp: string;
  duration: number;
  finalScore: number;
  project?: string;
}

interface IterationContext {
  iteration: number;
  prompt: string;
  usedPrompt: string;
  code: string;
  evaluation: any;
  timestamp: string;
  maxIterations?: number;
}

export class RalphLoop {
  private static readonly DEFAULT_MAX_ITERATIONS = 20;
  private static readonly DEFAULT_TIMEOUT_MINUTES = 30;
  private static readonly DEFAULT_MIN_QUALITY_SCORE = 0.7;

  /**
   * Run the Ralph-Wiggum Loop
   *
   * @param prompt - The prompt to use for all iterations
   * @param options - Optional configuration
   * @returns Loop result with code, iterations, and metadata
   */
  static async run(prompt: string, options: LoopOptions | null = {}): Promise<LoopResult> {
    const startTime = Date.now();

    // Normalize options
    const normalizedOptions = this.normalizeOptions(options);

    // Initialize gallery
    const gallery = new Gallery(normalizedOptions.galleryDir);

    let iteration = 0;
    let completed = false;
    let reason = '';
    let currentCode = '';
    let finalScore = 0;

    // Main loop
    while (iteration < normalizedOptions.maxIterations) {
      iteration++;

      try {
        // Load prompt (same every time)
        const loadedPrompt = PromptStore.load(prompt);

        // Build context for injection (includes seed on iteration 1 when provided)
        const contextForInjection = this.buildContextForInjection(iteration, normalizedOptions, prompt, loadedPrompt);

        // Inject context into prompt if it has placeholders; then always append if no placeholder was used
        let usedPrompt = PromptStore.injectContext(loadedPrompt, contextForInjection);
        if (usedPrompt === loadedPrompt) {
          usedPrompt = loadedPrompt + '\n\n---\nContext from previous iterations:\n' + contextForInjection;
        }

        // Generate code
        const generator = new P5GeneratorLLM();
        currentCode = await generator.generate(usedPrompt);

        // Evaluate quality
        const evaluation = CreativeEvaluator.assess(currentCode);

        // Save iteration context
        const iterationContext: IterationContext = {
          iteration,
          prompt: loadedPrompt,
          usedPrompt,
          code: currentCode,
          evaluation,
          timestamp: new Date().toISOString(),
          maxIterations: normalizedOptions.maxIterations
        };

        ContextAccumulation.save(iterationContext);

        // Save to gallery if project specified
        if (normalizedOptions.project) {
          try {
            await gallery.saveIteration(normalizedOptions.project, iteration, currentCode);
          } catch (error) {
            // Log but don't fail if gallery save fails
            if (!normalizedOptions.tolerateErrors) {
              throw error;
            }
          }
        }

        // Update final score
        finalScore = evaluation.score;

        // Quality gate: break if below threshold
        if (evaluation.score < normalizedOptions.minQualityScore) {
          completed = false;
          reason = 'quality threshold not met';
          break;
        }

        // Check for promise detection (termination condition)
        if (PromiseDetector.detect(currentCode)) {
          completed = true;
          reason = 'promise detected in generated code';
          break;
        }

        // Check timeout (single iteration protection)
        const elapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        if (elapsed > normalizedOptions.timeoutMinutes) {
          reason = `Timeout exceeded (${normalizedOptions.timeoutMinutes} minutes)`;
          break;
        }

      } catch (error) {
        if (!normalizedOptions.tolerateErrors) {
          throw error;
        }
        // Continue on error if tolerateErrors is true
      }
    }

    // Set completion reason if not already set
    if (!reason) {
      if (iteration >= normalizedOptions.maxIterations) {
        reason = `max iterations reached (${normalizedOptions.maxIterations})`;
      } else {
        reason = 'Loop terminated';
      }
    }

    const duration = Date.now() - startTime;

    return {
      code: currentCode,
      iterations: iteration,
      completed,
      reason,
      timestamp: new Date().toISOString(),
      duration,
      finalScore,
      project: normalizedOptions.project
    };
  }

  /**
   * Normalize options with defaults
   */
  private static normalizeOptions(options: LoopOptions | null): Required<Omit<LoopOptions, 'seedCode' | 'seedTemplate' | 'maxContextLength' | 'lastKIterations'>> & Pick<LoopOptions, 'seedCode' | 'seedTemplate' | 'maxContextLength' | 'lastKIterations'> {
    return {
      maxIterations: options?.maxIterations || RalphLoop.DEFAULT_MAX_ITERATIONS,
      timeoutMinutes: options?.timeoutMinutes || RalphLoop.DEFAULT_TIMEOUT_MINUTES,
      galleryDir: options?.galleryDir || 'gallery',
      project: options?.project || `project-${Date.now()}`,
      tolerateErrors: options?.tolerateErrors ?? false,
      minQualityScore: options?.minQualityScore ?? RalphLoop.DEFAULT_MIN_QUALITY_SCORE,
      seedCode: options?.seedCode,
      seedTemplate: options?.seedTemplate,
      maxContextLength: options?.maxContextLength,
      lastKIterations: options?.lastKIterations
    };
  }

  /**
   * Build context for injection into prompt
   *
   * This context changes each iteration, providing the "world that changes"
   * while the prompt stays the same.
   */
  private static buildContextForInjection(
    iteration: number,
    options: { seedCode?: string; seedTemplate?: string; maxContextLength?: number; lastKIterations?: number },
    _prompt?: string,
    _loadedPrompt?: string
  ): string {
    let history = ContextAccumulation.getHistory();

    if (options.lastKIterations != null && options.lastKIterations > 0 && history.length > options.lastKIterations) {
      history = history.slice(-options.lastKIterations);
    }

    let base: string;
    if (history.length === 0) {
      base = `Iteration: ${iteration}\nNo previous context available.`;
    } else {
      const contextParts: string[] = [`Current iteration: ${iteration}`];
      contextParts.push(`\nPrevious iterations: ${history.length}`);

      const mostRecent = history[history.length - 1];
      contextParts.push(`\nLast iteration (${mostRecent.iteration}):`);
      contextParts.push(`- Quality score: ${mostRecent.evaluation.score.toFixed(2)}`);
      contextParts.push(`- Code length: ${mostRecent.code.length} characters`);

      if (mostRecent.evaluation.issues && mostRecent.evaluation.issues.length > 0) {
        contextParts.push(`- Issues to address: ${mostRecent.evaluation.issues.join(', ')}`);
      }

      const codeSnippet = mostRecent.code.substring(0, 500);
      if (codeSnippet.length > 0) {
        contextParts.push(`\nPrevious code (first 500 chars):\n${codeSnippet}`);
      }

      if (history.length > 1) {
        const scores = history.map((h: any) => h.evaluation.score);
        const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
        const improving = scores[scores.length - 1] > scores[0];
        contextParts.push(`\nQuality trend:`);
        contextParts.push(`- Average score: ${avgScore.toFixed(2)}`);
        contextParts.push(`- Trend: ${improving ? 'Improving' : 'Declining'}`);
      }

      base = contextParts.join('\n');
    }

    let context = base;
    if (iteration === 1 && (options.seedCode != null || options.seedTemplate != null)) {
      const seed = options.seedCode ?? options.seedTemplate ?? '';
      context = 'Here is the seed/template; improve it toward the user\'s goal.\nSeed:\n' + seed + '\n\n' + context;
    }

    if (options.maxContextLength != null && options.maxContextLength > 0 && context.length > options.maxContextLength) {
      context = context.slice(-options.maxContextLength);
    }

    return context;
  }

  /**
   * Get the current loop state
   *
   * @returns Current iteration count and history
   */
  static getState(): { iteration: number; history: any[] } {
    const history = ContextAccumulation.getHistory();
    return {
      iteration: history.length,
      history
    };
  }

  /**
   * Reset the loop state
   *
   * Clears context accumulation for a fresh run.
   */
  static reset(): void {
    ContextAccumulation.clear();
  }

  /**
   * Check if loop is currently running
   *
   * @returns true if there is active context state
   */
  static isRunning(): boolean {
    const history = ContextAccumulation.getHistory();
    return history.length > 0;
  }

  /**
   * Get progress information for current loop
   *
   * @returns Progress details or null if no loop running
   */
  static getProgress(): { iteration: number; maxIterations?: number; progress: number } | null {
    const history = ContextAccumulation.getHistory();
    if (history.length === 0) {
      return null;
    }

    const iteration = history.length;
    // Use maxIterations from context if available, otherwise use default
    const mostRecentContext = history[history.length - 1] as IterationContext;
    const maxIterations = mostRecentContext?.maxIterations || RalphLoop.DEFAULT_MAX_ITERATIONS;

    return {
      iteration,
      maxIterations,
      progress: iteration / maxIterations
    };
  }
}