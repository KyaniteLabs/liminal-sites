import { randomBytes } from 'crypto';
import type { FrameGenerator } from './FrameGenerator.js';
import type { PromptPairGenerator } from './PromptPairGenerator.js';
import type { ShittyPromptsStore } from './ShittyPromptsStore.js';
import { ShittyPromptsRunSchema, type ShittyPromptsRun } from './types.js';

export interface ShittyPromptsEngineDeps {
  store: ShittyPromptsStore;
  pairGen: PromptPairGenerator;
  frameGen: FrameGenerator;
}

export interface ShittyPromptsRunRequest {
  pairCount: number;
  provider: 'ollama' | 'lmstudio' | 'cloud';
  model: string;
  seed?: string;
}

export class ShittyPromptsEngine {
  constructor(private readonly deps: ShittyPromptsEngineDeps) {}

  async run(req: ShittyPromptsRunRequest): Promise<ShittyPromptsRun> {
    const runId = `run_${randomBytes(4).toString('hex')}`;
    const seed = req.seed ?? randomBytes(8).toString('hex');

    const pairs = await this.deps.pairGen.generate({ count: req.pairCount, runId });
    for (const pair of pairs) {
      await this.deps.store.writePair(pair);
    }

    const frames = await this.deps.frameGen.generateOnePerSlot({ runId, seed });
    for (const frame of frames) {
      await this.deps.store.writeFrame(frame);
    }

    return ShittyPromptsRunSchema.parse({
      runId,
      provider: req.provider,
      model: req.model,
      pairCount: pairs.length,
      frameCount: frames.length,
      createdAt: new Date().toISOString(),
    });
  }
}
