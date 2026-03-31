import { LLMClient, LLMConfig } from '../../llm/LLMClient.js';
import { PromptLibrary } from '../../prompts/index.js';
import { Logger } from '../../utils/Logger.js';

export interface HydraGeneratorOptions {
  signal?: AbortSignal;
}

export class HydraGenerator {
  private llm: LLMClient;

  constructor(llmOrConfig?: LLMClient | Partial<LLMConfig>) {
    this.llm = llmOrConfig instanceof LLMClient ? llmOrConfig : new LLMClient(llmOrConfig);
  }

  async generate(prompt: string, options?: HydraGeneratorOptions): Promise<string> {
    if (!LLMClient.isConfigured()) {
      return this.getTemplate(prompt);
    }

    try {
      // Hydra uses the glsl.generate prompt as a reasonable approximation
      // or we can use a custom system prompt
      const systemPrompt = `You are an expert in Hydra video synthesizer (hydra-synth).

Generate Hydra JavaScript code for live coding visual patterns.

CONSTRAINTS:
- Output ONLY valid Hydra JavaScript code
- Use Hydra's chainable API: osc(), shape(), noise(), voronoi(), etc.
- Connect to output with .out(o0) or similar
- Use .kaleid(), .color(), .rotate(), .scale() for effects
- NO markdown, NO explanation, NO code blocks

OUTPUT FORMAT:
- Single line or multi-line chain of Hydra methods
- Must end with .out(o0)`;

      const userPrompt = `Create Hydra video synth: ${prompt}`;
      
      const response = await this.llm.generate(systemPrompt, userPrompt, options?.signal);

      if (!response.code || response.code.trim() === '') {
        return this.getTemplate(prompt);
      }

      return this.sanitizeCode(response.code);
    } catch (error) {
      Logger.error('HydraGenerator', `LLM call failed, using template fallback: ${error instanceof Error ? error.message : error}`);
      return this.getTemplate(prompt);
    }
  }

  private sanitizeCode(code: string): string {
    // Strip markdown fences
    let clean = code.replace(/```(?:javascript|js)?\n/g, '').replace(/```/g, '');
    
    // Ensure it ends with .out()
    if (!clean.includes('.out(')) {
      clean += '\n.out(o0)';
    }
    
    return clean.trim();
  }

  private getTemplate(prompt: string): string {
    const lower = prompt.toLowerCase();
    
    if (lower.includes('feedback') || lower.includes('recursive')) {
      return `// Feedback template
src(o0)
  .scale(1.01)
  .color(1.01, 1.0, 1.0)
  .layer(osc(20, 0.1).color(1, 0, 0).mask(shape(4)))
  .out(o0)`;
    }
    
    if (lower.includes('geometric') || lower.includes('shape')) {
      return `// Geometric template
shape(4)
  .scale(() => Math.sin(time) * 0.5 + 1)
  .rotate(() => time * 0.1)
  .kaleid(6)
  .color(0.5, 0.8, 1)
  .out(o0)`;
    }
    
    return `// Default Hydra pattern
osc(20, 0.1)
  .kaleid(4)
  .color(1, 0.5, 0)
  .rotate(() => time * 0.05)
  .out(o0)`;
  }
}
