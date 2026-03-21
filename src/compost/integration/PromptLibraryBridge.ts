/**
 * PromptLibraryBridge — registers compost-specific prompts.
 */

export interface PromptTemplate {
  name: string;
  system: string;
  user: string;
}

export class PromptLibraryBridge {
  private prompts: PromptTemplate[];

  constructor() {
    this.prompts = [
      {
        name: 'collision-merge',
        system: 'You are a creative cross-domain collision engine. Combine fragments from unrelated domains into surprising new ideas.',
        user: '[Fragment A — domain: ${domainA}]\n${contentA}\n\n[Fragment B — domain: ${domainB}]\n${contentB}\n\nWhat ideas emerge from this intersection? Be specific and surprising.',
      },
      {
        name: 'offspring-scoring',
        system: 'You are a creative quality evaluator. Rate this fragment 0-10 based on novelty, creative potential, and cross-domain value.',
        user: 'Domain: ${domain}\nLayer: ${layer}\nTags: ${tags}\n\nContent:\n${content}\n\nRespond with JSON: {"score": N, "reasoning": "..."}',
      },
      {
        name: 'digest-narrative',
        system: 'You are a creative digest writer. Synthesize the week\'s compost activity into an engaging narrative.',
        user: 'Stats: ${stats}\nTop Seeds: ${seeds}\nHighlights: ${highlights}\n\nWrite a narrative synthesis of this week\'s creative compost activity.',
      },
      {
        name: 'seed-extraction',
        system: 'You are a seed extractor. Identify the most valuable creative ideas in this content.',
        user: 'Content:\n${content}\n\nExtract the top creative seed ideas. Format as JSON array: [{"content": "...", "score": N}]',
      },
    ];
  }

  /** Get all compost prompt templates. */
  getPrompts(): PromptTemplate[] {
    return [...this.prompts];
  }

  /** Render a prompt with variable interpolation. */
  renderPrompt(name: string, vars: Record<string, string>): string {
    const template = this.prompts.find(p => p.name === name);
    if (!template) return '';

    const interpolate = (str: string): string => {
      let result = str;
      for (const [key, value] of Object.entries(vars)) {
        result = result.replaceAll(`\${${key}}`, value);
      }
      return result;
    };

    return `System: ${interpolate(template.system)}\n\nUser: ${interpolate(template.user)}`;
  }
}
