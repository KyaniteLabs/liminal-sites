import type { ShittyPromptsStore } from './ShittyPromptsStore.js';
import { PromptPairSchema } from './types.js';

export interface PromptEdit {
  shitty?: string;
  withContext?: string;
}

export class CurationApi {
  constructor(private readonly store: ShittyPromptsStore) {}

  async accept(id: string): Promise<void> {
    await this.store.updatePairStatus(id, 'approved');
  }

  async reject(id: string): Promise<void> {
    await this.store.updatePairStatus(id, 'rejected');
  }

  async edit(id: string, patch: PromptEdit): Promise<void> {
    const pair = await this.store.readPair(id);
    const next = PromptPairSchema.parse({
      ...pair,
      shitty: patch.shitty ?? pair.shitty,
      withContext: patch.withContext ?? pair.withContext,
      edits: pair.edits + 1,
    });
    await this.store.writePair(next);
  }
}
