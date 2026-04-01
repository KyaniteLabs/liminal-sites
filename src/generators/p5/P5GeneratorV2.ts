/**
 * P5GeneratorV2 - Tier-based generation
 * 
 * Uses ModelTier detection to adapt prompt style based on capability:
 * - Flagship: Concise, structured prompts
 * - Medium: Detailed instructions  
 * - Local: Explicit, few-shot
 * - Tiny: Minimal, direct
 */

import { LLMClient, LLMConfig } from '../../llm/LLMClient.js';
import { PromptBuilder } from '../../llm/PromptBuilder.js';
import { detectModelTier, trimContext, type ModelTier } from '../../llm/ModelTier.js';
import { harnessMemory } from '../../harness/HarnessMemory.js';

export interface P5GeneratorV2Options {
  signal?: AbortSignal;
  bypassCache?: boolean;
  contextBudget?: number;  // Override token budget
}

export class P5GeneratorV2 {
  private llm: LLMClient;
  private promptBuilder: PromptBuilder;
  private tier: ModelTier;

  constructor(llmOrConfig?: LLMClient | Partial<LLMConfig>) {
    this.llm = llmOrConfig instanceof LLMClient 
      ? llmOrConfig 
      : new LLMClient(llmOrConfig);
    
    this.tier = detectModelTier(this.llm.getConfig());
    this.promptBuilder = new PromptBuilder(this.llm.getConfig());
  }

  async generate(prompt: string, options?: P5GeneratorV2Options): Promise<string> {
    if (!LLMClient.isConfigured()) {
      throw new Error('P5GeneratorV2: No LLM configured');
    }

    // 1. Load context from markdown files and memory
    const context = await PromptBuilder.loadContext('p5', prompt, {
      recentAdaptations: this.getRecentAdaptations(),
      userPreferences: this.getUserPreferences(),
    });

    // 2. Apply token budget (trim if needed)
    const budget = options?.contextBudget || this.getDefaultBudget();
    if (context.domainDocs) {
      context.domainDocs = trimContext(context.domainDocs, Math.floor(budget * 0.3));
    }

    // 3. Build tier-appropriate prompt
    const builtPrompt = this.promptBuilder.build(context);

    console.log(`[P5GeneratorV2] Using ${this.tier} tier (${budget} token budget)`);

    // 4. Generate based on tier capabilities
    let response;
    if (this.tier === 'tiny') {
      // Tiny models often don't support system prompts well
      response = await this.llm.generate(
        '',  // No system prompt
        builtPrompt.combined || builtPrompt.user,
        options?.signal,
        options?.bypassCache
      );
    } else {
      response = await this.llm.generate(
        builtPrompt.system,
        builtPrompt.user,
        options?.signal,
        options?.bypassCache
      );
    }

    if (!response.code || response.code.trim() === '') {
      throw new Error('P5GeneratorV2: LLM returned empty code');
    }

    // 5. Record to memory
    harnessMemory.recordEpisode({
      type: 'generation',
      domain: 'p5',
      prompt,
      code: response.code,
    });

    return response.code;
  }

  /**
   * Get default token budget based on tier
   */
  private getDefaultBudget(): number {
    switch (this.tier) {
      case 'flagship':
        return 8000;   // Can handle lots of context
      case 'medium':
        return 4000;
      case 'local':
        return 2000;   // Keep it tight
      case 'tiny':
        return 1000;   // Minimal
    }
  }

  /**
   * Get recent successful adaptations from memory
   */
  private getRecentAdaptations(): string[] {
    const adaptations = harnessMemory.getSuccessfulAdaptations()
      .slice(-3)
      .map(a => a.description);
    return adaptations;
  }

  /**
   * Get user preferences from memory
   */
  private getUserPreferences(): string | undefined {
    const recent = harnessMemory.getRecentEpisodes(5);
    if (recent.length === 0) return undefined;
    
    // Simple preference extraction: look for patterns in recent generations
    const domains = recent.map(e => e.domain).filter(Boolean);
    const uniqueDomains = [...new Set(domains)];
    
    if (uniqueDomains.length > 0) {
      return `User frequently works with: ${uniqueDomains.join(', ')}`;
    }
    return undefined;
  }

  /**
   * Get current tier info (for debugging)
   */
  getTierInfo(): { tier: ModelTier; budget: number } {
    return {
      tier: this.tier,
      budget: this.getDefaultBudget(),
    };
  }
}
