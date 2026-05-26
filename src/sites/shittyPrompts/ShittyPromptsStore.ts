import fs from 'fs/promises';
import path from 'path';
import {
  PromptPairSchema,
  ShittyFrameSchema,
  type PromptPair,
  type PromptStatus,
  type ShittyFrame,
  type FrameSlot,
} from './types.js';

export class ShittyPromptsStore {
  readonly rootDir: string;

  constructor(rootDir = path.join(process.cwd(), '.liminal-sites', 'shitty-prompts')) {
    this.rootDir = path.resolve(rootDir);
  }

  private pairPath(id: string): string {
    return path.join(this.rootDir, 'pairs', `${id}.json`);
  }

  private framePath(id: string): string {
    return path.join(this.rootDir, 'frames', `${id}.json`);
  }

  async writePair(pair: PromptPair): Promise<void> {
    PromptPairSchema.parse(pair);
    await this.writeJson(this.pairPath(pair.id), pair);
  }

  async readPair(id: string): Promise<PromptPair> {
    const raw = await this.readJson<unknown>(this.pairPath(id));
    return PromptPairSchema.parse(raw);
  }

  async listByStatus(status: PromptStatus): Promise<PromptPair[]> {
    const dir = path.join(this.rootDir, 'pairs');
    const entries = await fs.readdir(dir).catch(() => []);
    const all = await Promise.all(
      entries
        .filter((f) => f.endsWith('.json'))
        .map(async (f) => {
          try {
            return PromptPairSchema.parse(await this.readJson<unknown>(path.join(dir, f)));
          } catch {
            return null;
          }
        }),
    );
    return all
      .filter((p): p is PromptPair => p !== null && p.status === status)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async updatePairStatus(id: string, status: PromptStatus): Promise<void> {
    const pair = await this.readPair(id);
    await this.writePair({ ...pair, status });
  }

  async writeFrame(frame: ShittyFrame): Promise<void> {
    ShittyFrameSchema.parse(frame);
    await this.writeJson(this.framePath(frame.id), frame);
  }

  async listFramesBySlot(slot: FrameSlot): Promise<ShittyFrame[]> {
    const dir = path.join(this.rootDir, 'frames');
    const entries = await fs.readdir(dir).catch(() => []);
    const all = await Promise.all(
      entries
        .filter((f) => f.endsWith('.json'))
        .map(async (f) => {
          try {
            return ShittyFrameSchema.parse(await this.readJson<unknown>(path.join(dir, f)));
          } catch {
            return null;
          }
        }),
    );
    return all
      .filter((f): f is ShittyFrame => f !== null && f.slot === slot)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  private async writeJson(filePath: string, data: unknown): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  private async readJson<T>(filePath: string): Promise<T> {
    const text = await fs.readFile(filePath, 'utf8');
    return JSON.parse(text) as T;
  }
}
