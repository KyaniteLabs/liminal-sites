/**
 * ARCHIVED: Provider-specific routing code from LLMClient
 * Date: 2026-03-30
 * Reason: Moving to model-agnostic architecture
 * 
 * This code handled routing between multiple providers:
 * - ollama (local)
 * - openai (cloud)
 * - minimax (cloud)  
 * - lmstudio (local)
 * - hybrid (fallback chain)
 * 
 * Lesson: Provider routing added complexity without value.
 * Better approach: Universal endpoint + universal sanitizer.
 */

// Old provider-specific methods:
// private async callOpenAI(system: string, user: string, signal?: AbortSignal): Promise<LLMResponse>
// private async callMinimax(system: string, user: string, signal?: AbortSignal): Promise<LLMResponse>
// private async callLMStudio(system: string, user: string, signal?: AbortSignal): Promise<LLMResponse>
// private async callHybrid(system: string, user: string, signal?: AbortSignal): Promise<LLMResponse>
// private async callOllama(system: string, user: string, signal?: AbortSignal): Promise<LLMResponse>

// Old provider cost tracking:
// private static readonly COST_ESTIMATES: Record<string, { input: number; output: number }> = {
//   openai: { input: 0.00001, output: 0.00003 },
//   ollama: { input: 0, output: 0 },
//   minimax: { input: 0.000001, output: 0.000002 },
//   lmstudio: { input: 0, output: 0 },
// };

// Old provider enum:
// export interface LLMConfig {
//   provider: 'ollama' | 'openai' | 'minimax' | 'lmstudio' | 'hybrid';
//   ...
// }
