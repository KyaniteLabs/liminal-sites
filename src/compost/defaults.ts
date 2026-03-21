/**
 * Default configuration values for the Compost Mill.
 */

import type { CompostConfig, LLMProviderConfig } from './types.js';

/** Deep partial — makes all nested properties optional too. */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** User-facing config type that allows partial overrides at any depth. */
export type UserCompostConfig = DeepPartial<CompostConfig>;

/** Default Compost Mill configuration. */
export const DEFAULT_CONFIG: CompostConfig = {
  heapDir: 'compost/heap/',
  maxHeapSizeBytes: 50 * 1024 * 1024, // 50MB
  digestDir: 'compost/digest/',
  seedDir: 'compost/seeds/',
  digestSchedule: 'weekly',
  digestDayOfWeek: 0, // Sunday
  soupEnabled: true,
  soupPopulationSize: 20,
  soupMaxStepsPerCycle: 50,
  soupSeedPromotionThreshold: 0.7,
  soupCycleIntervalMs: 60000, // 1 minute
  llm: {
    provider: 'auto',
    localBaseUrl: 'http://localhost:1234/v1',
    localModel: 'auto',
    cloudProvider: 'anthropic',
    cloudApiKeyEnvVar: 'ANTHROPIC_API_KEY',
    cloudModel: 'claude-sonnet-4-20250514',
    localTimeoutMs: 30000,
  },
  seedPromotionThreshold: 0.7,
  maxSeedsPerDigest: 20,
  nuggetRetentionDays: 90,
};

/**
 * Deep-merge user config over defaults. Does not mutate defaults.
 */
export function mergeConfig(user?: UserCompostConfig): CompostConfig {
  if (!user) return { ...DEFAULT_CONFIG };

  return {
    ...DEFAULT_CONFIG,
    ...user,
    llm: {
      ...DEFAULT_CONFIG.llm,
      ...(user.llm as Partial<LLMProviderConfig>),
    },
  };
}
