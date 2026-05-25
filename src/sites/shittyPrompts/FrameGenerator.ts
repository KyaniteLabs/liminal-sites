import { createHash } from 'crypto';
import { allFrameSlots, loadFrameTemplate } from './frameTemplates.js';
import type { ShittyFrame } from './types.js';

export class FrameGenerator {
  async generateOnePerSlot(opts: { runId: string; seed: string }): Promise<ShittyFrame[]> {
    const slots = allFrameSlots();
    const now = new Date().toISOString();
    return Promise.all(
      slots.map(async (slot) => {
        const template = await loadFrameTemplate(slot);
        const seed = createHash('sha256').update(`${opts.seed}:${slot}`).digest('hex').slice(0, 8);
        return {
          id: `frame_${slot}_${seed}`,
          slot,
          svg: template,
          seed,
          createdAt: now,
        };
      }),
    );
  }
}
