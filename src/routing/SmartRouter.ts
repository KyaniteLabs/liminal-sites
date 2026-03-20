/**
 * Smart model router based on A/B test results.
 *
 * Routes requests to the optimal model (local/cloud) based on domain and task type.
 * Uses keyword detection and confidence scoring for intelligent routing decisions.
 *
 * Based on A/B test results from March 2026:
 * - Music → Local (Qwen 3.5-4B dominates by +121%)
 * - Code → Local (wins on quality/technical metrics by +9%)
 * - ASCII → Cloud (Minimax superior by +46%)
 * - Visual → Cloud (better rendering capabilities)
 *
 * @example
 * ```ts
 * const router = new SmartRouter();
 * const decision = router.routeByPrompt('Create a melody in C major');
 * console.log(decision.model); // 'local'
 * console.log(decision.reason); // 'Music domain - Local Qwen 3.5-4B dominates...'
 * ```
 *
 * @module routing/SmartRouter
 */

import type {
  DomainType,
  ModelChoice,
  DomainRoutingConfig,
} from './RoutingData.js';
import {
  AB_TEST_RESULTS,
  DOMAIN_ROUTING_DATA,
  DOMAIN_KEYWORDS,
  OVERALL_FITNESS,
} from './RoutingData.js';

/**
 * Result of a routing decision.
 */
export interface RoutingDecision {
  /** Chosen model (local, cloud, or hybrid) */
  model: ModelChoice;
  /** Human-readable explanation for the routing choice */
  reason: string;
  /** Confidence score (0-1), how certain we are in this choice */
  confidence: number;
  /** Local model fitness score for this domain */
  localFitness: number;
  /** Cloud model fitness score for this domain */
  cloudFitness: number;
  /** Detected domain (if applicable) */
  domain?: DomainType;
}

/**
 * Configuration options for the SmartRouter.
 */
export interface RoutingConfig {
  /** If true, prefer local when fitness is within 5% (default: true) */
  preferLocal?: boolean;
  /** Use hybrid model for edge cases (default: false) */
  fallbackToHybrid?: boolean;
  /** Minimum confidence threshold (default: 0.5) */
  minConfidence?: number;
}

/**
 * Smart model router that uses A/B test data to select optimal models.
 *
 * Routes prompts to local (LM Studio/Qwen) or cloud (Minimax) models
 * based on domain detection and performance metrics.
 */
export class SmartRouter {
  private readonly preferLocal: boolean;
  private readonly fallbackToHybrid: boolean;
  private readonly minConfidence: number;
  /** Additional domain keywords from dynamic registration */
  private dynamicKeywords: Record<string, string[]> = {};

  /**
   * Create a new SmartRouter.
   *
   * @param config - Optional routing configuration
   */
  constructor(config?: RoutingConfig) {
    this.preferLocal = config?.preferLocal ?? true;
    this.fallbackToHybrid = config?.fallbackToHybrid ?? false;
    this.minConfidence = config?.minConfidence ?? 0.5;
  }

  /**
   * Register a new domain for routing awareness.
   *
   * This allows the SmartRouter to recognize and route to dynamically
   * registered domains from the GeneratorRegistry.
   *
   * @param domainName - Name of the domain (must match GeneratorRegistry entry)
   * @param keywords - Keywords that trigger this domain
   * @param _optimalModel - Which model to use for this domain (default: 'local')
   * @param _confidence - Confidence in model choice (default: 0.7)
   */
  registerDynamicDomain(
    domainName: string,
    keywords: string[],
    _optimalModel: ModelChoice = 'local',
    _confidence: number = 0.7,
  ): void {
    this.dynamicKeywords[domainName] = keywords;
  }

  /**
   * Unregister a dynamically registered domain.
   *
   * @param domainName - Name of the domain to unregister
   * @returns true if domain was found and removed
   */
  unregisterDynamicDomain(domainName: string): boolean {
    if (domainName in this.dynamicKeywords) {
      delete this.dynamicKeywords[domainName];
      return true;
    }
    return false;
  }

  /**
   * Get all registered domain keywords (built-in + dynamic).
   *
   * @returns Map of domain to keywords
   */
  getAllDomainKeywords(): Record<string, string[]> {
    return {
      ...DOMAIN_KEYWORDS,
      ...this.dynamicKeywords,
    };
  }

  /**
   * Route a request to the optimal model based on domain.
   *
   * @param domain - Target domain (ascii, music, code, visual, or dynamic)
   * @param complexity - Optional complexity hint (simple, medium, complex)
   * @param style - Optional style hint
   * @returns RoutingDecision with model choice and reasoning
   */
  route(
    domain: DomainType,
    complexity?: 'simple' | 'medium' | 'complex',
    _style?: string,
  ): RoutingDecision {
    const routingConfig = DOMAIN_ROUTING_DATA[domain];
    const abResults = AB_TEST_RESULTS[domain];

    // Handle dynamic domains (not in built-in routing data)
    if (!routingConfig || !abResults) {
      // Default routing for dynamic domains: prefer local with medium confidence
      return {
        model: this.preferLocal ? 'local' : 'cloud',
        reason: `Dynamic domain '${domain}' - using ${this.preferLocal ? 'local' : 'cloud'} model (no A/B test data)`,
        confidence: 0.6,
        localFitness: OVERALL_FITNESS.local,
        cloudFitness: OVERALL_FITNESS.cloud,
        domain,
      };
    }

    const localFitness = abResults.local;
    const cloudFitness = abResults.cloud;

    // Calculate fitness difference
    const diff = localFitness - cloudFitness;
    const maxFitness = Math.max(localFitness, cloudFitness);
    const pctDiff = maxFitness > 0 ? Math.abs(diff) / maxFitness : 0;

    // Apply prefer_local bias if configured
    let optimalModel = routingConfig.optimalModel;
    let confidence = routingConfig.confidence;

    if (this.preferLocal && pctDiff < 0.05 && optimalModel === 'cloud') {
      optimalModel = 'local';
      confidence = Math.max(0.6, confidence - 0.15); // Reduce confidence due to override
    }

    // Apply fallback to hybrid for edge cases
    if (this.fallbackToHybrid && complexity === 'complex' && confidence < this.minConfidence) {
      optimalModel = 'hybrid';
      confidence = 0.65;
    }

    // Generate reason based on domain and model choice
    const reason = this.generateReason(domain, optimalModel, localFitness, cloudFitness, routingConfig.advantage);

    return {
      model: optimalModel,
      reason,
      confidence,
      localFitness,
      cloudFitness,
      domain,
    };
  }

  /**
   * Route a request based on prompt content analysis.
   *
   * Detects domain from prompt keywords and routes accordingly.
   *
   * @param prompt - User prompt text
   * @returns RoutingDecision for the prompt
   */
  routeByPrompt(prompt: string): RoutingDecision {
    const detectedDomain = this.detectDomain(prompt);

    if (detectedDomain) {
      return this.route(detectedDomain);
    }

    // Default routing for unknown domain
    return {
      model: this.preferLocal ? 'local' : 'cloud',
      reason: `Unknown domain - defaulting to ${this.preferLocal ? 'local' : 'cloud'} (preferLocal=${this.preferLocal})`,
      confidence: 0.3,
      localFitness: OVERALL_FITNESS.local,
      cloudFitness: OVERALL_FITNESS.cloud,
      domain: undefined,
    };
  }

  /**
   * Detect domain from prompt content using keyword matching.
   *
   * Checks both built-in domains and dynamically registered domains.
   *
   * @param prompt - User prompt text
   * @returns Detected domain or undefined if no match
   */
  private detectDomain(prompt: string): DomainType | undefined {
    const promptLower = prompt.toLowerCase();

    // Check built-in domains first
    for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
      for (const keyword of keywords) {
        if (promptLower.includes(keyword)) {
          return domain as DomainType;
        }
      }
    }

    // Check dynamically registered domains
    for (const [domain, keywords] of Object.entries(this.dynamicKeywords)) {
      for (const keyword of keywords) {
        if (promptLower.includes(keyword)) {
          return domain as DomainType;
        }
      }
    }

    return undefined;
  }

  /**
   * Generate human-readable reason for routing decision.
   *
   * @param domain - Detected domain
   * @param model - Chosen model
   * @param localFitness - Local fitness score
   * @param cloudFitness - Cloud fitness score
   * @param advantage - Advantage percentage string
   * @returns Human-readable explanation
   */
  private generateReason(
    domain: DomainType,
    model: ModelChoice,
    localFitness: number,
    cloudFitness: number,
    advantage: string,
  ): string {
    const domainNames: Record<DomainType, string> = {
      music: 'Music domain',
      code: 'Code domain',
      ascii: 'ASCII art',
      visual: 'Visual domain',
    };

    const modelNames: Record<ModelChoice, string> = {
      local: 'Local Qwen 3.5-4B',
      cloud: 'Cloud Minimax',
      hybrid: 'Hybrid (Local + Cloud)',
    };

    // Handle dynamic domains
    const domainName = domainNames[domain] || `${domain} domain`;
    const baseReason = `${domainName} - `;

    if (model === 'local') {
      return `${baseReason}${modelNames.local} wins (${localFitness.toFixed(3)} vs ${cloudFitness.toFixed(3)}, ${advantage})`;
    } else if (model === 'cloud') {
      return `${baseReason}${modelNames.cloud} superior (${cloudFitness.toFixed(3)} vs ${localFitness.toFixed(3)}, ${advantage})`;
    } else {
      return `${baseReason}${modelNames.hybrid} for complex task`;
    }
  }

  /**
   * Get routing statistics based on A/B test results.
   *
   * @returns Object containing A/B test results and domain winners
   */
  getStats(): {
    abTestResults: typeof AB_TEST_RESULTS;
    overallLocalFitness: number;
    overallCloudFitness: number;
    domains: Record<
      DomainType,
      {
        winner: ModelChoice;
        advantage: string;
        confidence: number;
      }
    >;
  } {
    return {
      abTestResults: AB_TEST_RESULTS,
      overallLocalFitness: OVERALL_FITNESS.local,
      overallCloudFitness: OVERALL_FITNESS.cloud,
      domains: Object.fromEntries(
        Object.entries(DOMAIN_ROUTING_DATA).map(([domain, config]) => [
          domain,
          {
            winner: config.optimalModel,
            advantage: config.advantage,
            confidence: config.confidence,
          },
        ]),
      ) as Record<DomainType, { winner: ModelChoice; advantage: string; confidence: number }>,
    };
  }

  /**
   * Get domain routing configuration.
   *
   * For built-in domains, returns the full A/B test configuration.
   * For dynamic domains, returns a default configuration.
   *
   * @param domain - Domain to get config for
   * @returns Domain routing configuration
   */
  getDomainConfig(domain: DomainType): DomainRoutingConfig {
    // Check if it's a built-in domain
    if (domain in DOMAIN_ROUTING_DATA) {
      return DOMAIN_ROUTING_DATA[domain];
    }

    // Return default configuration for dynamic domains
    return {
      optimalModel: this.preferLocal ? 'local' : 'cloud',
      confidence: 0.6,
      advantage: 'N/A (dynamic domain)',
      localFitness: OVERALL_FITNESS.local,
      cloudFitness: OVERALL_FITNESS.cloud,
    };
  }

  /**
   * Check if a domain is supported (built-in or dynamic).
   *
   * For built-in domains, this acts as a type guard.
   *
   * @param domain - Domain to check
   * @returns True if domain is supported
   */
  isDomainSupported(domain: string): domain is DomainType {
    return domain in DOMAIN_ROUTING_DATA || domain in this.dynamicKeywords;
  }
}

/**
 * Default global router instance.
 */
export const defaultRouter = new SmartRouter();

/**
 * Convenience function using default router.
 *
 * @param domain - Target domain
 * @param complexity - Optional complexity hint
 * @param style - Optional style hint
 * @returns RoutingDecision for the domain
 */
export function route(
  domain: DomainType,
  complexity?: 'simple' | 'medium' | 'complex',
  style?: string,
): RoutingDecision {
  return defaultRouter.route(domain, complexity, style);
}

/**
 * Convenience function to route by prompt using default router.
 *
 * @param prompt - User prompt text
 * @returns RoutingDecision for the prompt
 */
export function routeByPrompt(prompt: string): RoutingDecision {
  return defaultRouter.routeByPrompt(prompt);
}
