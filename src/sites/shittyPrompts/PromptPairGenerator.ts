import { randomBytes } from 'crypto';
import { z } from 'zod';
import { FailureModeSchema, type PromptPair } from './types.js';

export interface LLMClient {
  complete(prompt: string): Promise<string>;
}

const RawPairSchema = z.object({
  shitty: z.string().trim().min(1).max(280),
  withContext: z.string().trim().min(1).max(2000),
  failureMode: FailureModeSchema,
});

const SYSTEM_PROMPT = `You are generating training pairs for an educational microsite about prompting.
Each pair has TWO parts:
1. "shitty": a deliberately bad/lazy/vague work-context prompt a human might type to an LLM (e.g. "make it pop", "u know what i mean", "fix it", "do the thing").
2. "withContext": the same intent rewritten WITH good context - concrete, specific, references the relevant brand/file/spec.
3. "failureMode": one of: vague-aesthetic, underspecified-task, missing-context, wrong-format, ambiguous-tone, lazy-shorthand.

Output ONLY a JSON array of {shitty, withContext, failureMode} objects. No prose. Tone is dry and observational, not snarky.`;

export class PromptPairGenerator {
  constructor(private readonly llm: LLMClient) {}

  async generate(opts: { count: number; runId: string }): Promise<PromptPair[]> {
    const prompt = `${SYSTEM_PROMPT}\n\nGenerate ${opts.count} pairs.`;
    const raw = await this.llm.complete(prompt);
    const json = extractJsonArray(raw);
    const parsed = z.array(RawPairSchema).parse(json);
    const now = new Date().toISOString();
    return parsed.map<PromptPair>((p) => ({
      id: `sp_${randomBytes(4).toString('hex')}`,
      shitty: p.shitty,
      withContext: p.withContext,
      failureMode: p.failureMode,
      createdAt: now,
      sourceRunId: opts.runId,
      status: 'candidate',
      edits: 0,
    }));
  }
}

function extractJsonArray(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('LLM output contains no JSON array');
    return JSON.parse(match[0]);
  }
}
