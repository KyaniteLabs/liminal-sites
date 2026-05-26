import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { FrameSlotSchema, type FrameSlot } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function allFrameSlots(): FrameSlot[] {
  return FrameSlotSchema.options as FrameSlot[];
}

export async function loadFrameTemplate(slot: FrameSlot): Promise<string> {
  const svgPath = path.resolve(__dirname, 'templates', `${slot}.svg`);
  return fs.readFile(svgPath, 'utf8');
}
