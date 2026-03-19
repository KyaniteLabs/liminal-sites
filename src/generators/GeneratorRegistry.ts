/**
 * GeneratorRegistry - Unified dispatch for code generators.
 *
 * Each generator declares what it can handle via canHandle(prompt) -> confidence (0-1).
 * The registry picks the highest-confidence generator, with LLM as fallback.
 */

export interface GeneratorEntry {
  name: string;
  canHandle: (prompt: string) => number; // 0 = can't handle, higher = more confident
  generate: (prompt: string, params?: Record<string, unknown>) => string | Promise<string>;
}

class GeneratorRegistryClass {
  private entries: GeneratorEntry[] = [];

  register(entry: GeneratorEntry): void {
    this.entries.push(entry);
  }

  /**
   * Find the best generator for a prompt. Returns { entry, confidence }.
   * Returns null if no entry has confidence > 0.
   */
  dispatch(prompt: string): { entry: GeneratorEntry; confidence: number } | null {
    let best: { entry: GeneratorEntry; confidence: number } | null = null;
    for (const entry of this.entries) {
      const confidence = entry.canHandle(prompt);
      if (confidence > 0 && (!best || confidence > best.confidence)) {
        best = { entry, confidence };
      }
    }
    return best;
  }

  getAll(): readonly GeneratorEntry[] {
    return this.entries;
  }

  /**
   * Reset the registry (useful for testing).
   */
  clear(): void {
    this.entries = [];
  }
}

// Singleton registry
export const generatorRegistry = new GeneratorRegistryClass();
