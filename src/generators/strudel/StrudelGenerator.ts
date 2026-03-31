import { LLMClient, LLMConfig } from '../../llm/LLMClient.js';
import { PromptLibrary } from '../../prompts/index.js';
import { Logger } from '../../utils/Logger.js';

export interface StrudelGeneratorOptions {
  signal?: AbortSignal;
  bpm?: number;
}

export class StrudelGenerator {
  private llm: LLMClient;

  constructor(llmOrConfig?: LLMClient | Partial<LLMConfig>) {
    this.llm = llmOrConfig instanceof LLMClient ? llmOrConfig : new LLMClient(llmOrConfig);
  }

  async generate(prompt: string, options?: StrudelGeneratorOptions): Promise<string> {
    if (!LLMClient.isConfigured()) {
      return this.getTemplate(prompt);
    }

    try {
      const { system: systemPrompt, user: userPrompt } = PromptLibrary.render('music.strudel', {
        prompt,
        bpm: String(options?.bpm || 120),
      });
      
      const response = await this.llm.generate(systemPrompt, userPrompt, options?.signal);

      if (!response.code || response.code.trim() === '') {
        return this.getTemplate(prompt);
      }

      return this.sanitizeCode(response.code);
    } catch (error) {
      Logger.error('StrudelGenerator', `LLM call failed, using template fallback: ${error instanceof Error ? error.message : error}`);
      return this.getTemplate(prompt);
    }
  }

  private sanitizeCode(code: string): string {
    let clean = code.replace(/```(?:javascript|js)?\n/g, '').replace(/```/g, '');
    
    const lines = clean.split('\n');
    const codeStart = lines.findIndex(l => 
      l.trim().startsWith('stack') || 
      l.trim().startsWith('sound') ||
      l.trim().startsWith('s(') ||
      l.trim().startsWith('note') ||
      l.trim().startsWith('const') ||
      l.trim().startsWith('import')
    );
    
    if (codeStart > 0) {
      clean = lines.slice(codeStart).join('\n');
    }
    
    return clean.trim();
  }

  private getTemplate(prompt: string): string {
    const lower = prompt.toLowerCase();
    
    if (lower.includes('techno') || lower.includes('beat')) {
      return `// Techno beat template
stack(
  s("bd*4"),
  s("~ cp ~ cp"),
  s("hh*8"),
  note("c2 [c2 g1] g1 c2").s("sawtooth").cutoff(800)
).cpm(130)`;
    }
    
    if (lower.includes('ambient') || lower.includes('chill')) {
      return `// Ambient template
stack(
  note("c4 e4 g4 b4").slow(4).s("sine").gain(0.3),
  note("c3,g3").slow(8).s("triangle").gain(0.4)
).cpm(80)`;
    }
    
    return `// Default Strudel pattern
stack(
  s("bd*2"),
  s("~ hh ~ hh"),
  note("c4 e4 g4 c5").s("sawtooth")
).cpm(120)`;
  }
}
