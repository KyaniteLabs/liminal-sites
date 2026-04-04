/**
 * Routing module - Smart model selection based on A/B test results
 */

export {
  AB_TEST_RESULTS,
  DOMAIN_ROUTING_DATA,
  OVERALL_FITNESS,
  DOMAIN_KEYWORDS,
  recordRoutingOutcome,
  getRollingPerformance,
  getOptimalModelBandit,
  getBanditStats,
} from './RoutingData.js';
export type {
  DomainType,
  ModelChoice,
  DomainFitness,
  DomainRoutingConfig,
} from './RoutingData.js';

// Note: SmartRouter is deprecated. Use GeneratorRegistry.route() instead.
// Kept for backward compatibility but will be removed in a future version.

export {
  GeneratorBanditRouter,
  generatorBanditRouter,
} from './GeneratorBanditRouter.js';
export type {
  BanditArm,
  BanditState,
} from './GeneratorBanditRouter.js';

// Re-export routing types from GeneratorRegistry (where they're now defined)
export type {
  RoutingDecision,
  RoutingConfig,
} from '../generators/GeneratorRegistry.js';
