import fs from 'fs/promises';
import path from 'path';
import { ShittyPromptsStore } from '../../src/sites/shittyPrompts/ShittyPromptsStore.js';
import { allFrameSlots } from '../../src/sites/shittyPrompts/frameTemplates.js';

export interface ExportOptions {
  storeDir: string;
  targetDir: string;
}

interface ExportedPair {
  id: string;
  shitty: string;
  withContext: string;
  failureMode: string;
  createdAt: string;
  sourceRunId: string;
}

export async function exportToTarget(opts: ExportOptions): Promise<void> {
  const store = new ShittyPromptsStore(opts.storeDir);
  const approved = await store.listByStatus('approved');

  const exported: ExportedPair[] = approved.map((p) => ({
    id: p.id,
    shitty: p.shitty,
    withContext: p.withContext,
    failureMode: p.failureMode,
    createdAt: p.createdAt,
    sourceRunId: p.sourceRunId,
  }));

  const promptsPath = path.join(opts.targetDir, 'public/data/prompts.json');
  await fs.mkdir(path.dirname(promptsPath), { recursive: true });
  await fs.writeFile(promptsPath, JSON.stringify(exported, null, 2), 'utf8');

  const framesDir = path.join(opts.targetDir, 'public/assets/frames');
  await fs.mkdir(framesDir, { recursive: true });
  for (const slot of allFrameSlots()) {
    const frames = await store.listFramesBySlot(slot);
    for (const frame of frames) {
      await fs.writeFile(path.join(framesDir, `${frame.id}.svg`), frame.svg, 'utf8');
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const targetIdx = args.indexOf('--target');
  if (targetIdx === -1) {
    console.error('Usage: engine:export --target <path-to-site-repo>');
    process.exit(1);
  }
  const targetDir = path.resolve(args[targetIdx + 1]);
  const storeDir = path.resolve(process.env['SHITTY_PROMPTS_STORE'] ?? path.join(process.cwd(), '.liminal-sites/shitty-prompts'));
  await exportToTarget({ storeDir, targetDir });
  console.log(`Exported approved pairs + frames to ${targetDir}`);
}
