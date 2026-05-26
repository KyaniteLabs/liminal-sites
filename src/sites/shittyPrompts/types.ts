import { z } from 'zod';

export const FailureModeSchema = z.enum([
  'vague-aesthetic',
  'underspecified-task',
  'missing-context',
  'wrong-format',
  'ambiguous-tone',
  'lazy-shorthand',
]);
export type FailureMode = z.infer<typeof FailureModeSchema>;

export const PromptStatusSchema = z.enum(['candidate', 'approved', 'rejected']);
export type PromptStatus = z.infer<typeof PromptStatusSchema>;

export const PromptPairSchema = z.object({
  id: z.string().regex(/^sp_[a-z0-9]{4,}$/),
  shitty: z.string().trim().min(1).max(280),
  withContext: z.string().trim().min(1).max(2000),
  failureMode: FailureModeSchema,
  createdAt: z.string().datetime(),
  sourceRunId: z.string().min(1),
  status: PromptStatusSchema,
  edits: z.number().int().min(0).default(0),
});
export type PromptPair = z.infer<typeof PromptPairSchema>;

export const FrameSlotSchema = z.enum(['box', 'corners', 'halftone', 'glitch', 'rule', 'crosshatch']);
export type FrameSlot = z.infer<typeof FrameSlotSchema>;

export const ShittyFrameSchema = z.object({
  id: z.string().regex(/^frame_[a-z0-9_]{4,}$/),
  slot: FrameSlotSchema,
  svg: z.string().min(1),
  seed: z.string().min(1),
  createdAt: z.string().datetime(),
});
export type ShittyFrame = z.infer<typeof ShittyFrameSchema>;

export const ShittyPromptsRunSchema = z.object({
  runId: z.string().regex(/^run_[a-z0-9]{4,}$/),
  provider: z.enum(['ollama', 'lmstudio', 'cloud']),
  model: z.string().min(1),
  pairCount: z.number().int().min(0),
  frameCount: z.number().int().min(0),
  createdAt: z.string().datetime(),
});
export type ShittyPromptsRun = z.infer<typeof ShittyPromptsRunSchema>;
