/**
 * SelfReflection - Proactive quality trend monitoring and improvement suggestions
 *
 * Monitors quality scores across iterations to detect:
 * - Plateaus (no improvement over N iterations)
 * - Declines (negative slope in quality)
 * - Domain gaps (underrepresented or low-quality domains)
 * - Quality ceilings (high scores that won't improve further)
 *
 * Generates natural language prompt enhancements for targeted improvement.
 */

export interface QualityTrend {
  iteration: number;
  timestamp: number;
  overallScore: number;
  technicalScore: number;
  aestheticScore: number;
  noveltyScore: number;
  domain: string;
}

export interface ImprovementSuggestion {
  type: 'plateau' | 'decline' | 'domain_gap' | 'quality_ceiling';
  confidence: number;
  description: string;
  suggestedAction: string;
}

const DEFAULT_WINDOW_SIZE = 10;
const PLATEAU_VARIANCE_THRESHOLD = 0.05;
const DECLINE_SLOPE_THRESHOLD = -0.02;
const DOMAIN_MIN_ENTRIES = 3;
const DOMAIN_MIN_AVG_QUALITY = 0.5;
const QUALITY_CEILING_THRESHOLD = 0.8;
const QUALITY_CEILING_IMPROVEMENT_RATE = 0.01;

/**
 * SelfReflectionEngine tracks quality trends and generates improvement suggestions.
 */
export class SelfReflectionEngine {
  private trends: QualityTrend[] = [];

  /**
   * Record a quality score from an iteration.
   * @param scores - Quality metrics for this iteration
   */
  recordScore(scores: QualityTrend): void {
    this.trends.push(scores);
  }

  /**
   * Analyze trends and detect all issues.
   * @returns Array of improvement suggestions (empty if no issues detected)
   */
  analyze(): ImprovementSuggestion[] {
    const suggestions: ImprovementSuggestion[] = [];

    const plateau = this.detectPlateau();
    if (plateau) suggestions.push(plateau);

    const decline = this.detectDecline();
    if (decline) suggestions.push(decline);

    const domainGaps = this.detectDomainGaps();
    suggestions.push(...domainGaps);

    const ceiling = this.detectQualityCeiling();
    if (ceiling) suggestions.push(ceiling);

    return suggestions;
  }

  /**
   * Detect if quality has plateaued (no improvement over N iterations).
   * @param windowSize - Number of recent iterations to analyze (default: 10)
   * @returns ImprovementSuggestion if plateau detected, null otherwise
   */
  detectPlateau(windowSize: number = DEFAULT_WINDOW_SIZE): ImprovementSuggestion | null {
    if (this.trends.length < windowSize) {
      return null;
    }

    const recent = this.trends.slice(-windowSize);
    const scores = recent.map(t => t.overallScore);

    // Calculate variance
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;

    if (variance < PLATEAU_VARIANCE_THRESHOLD) {
      const avgScore = mean;
      return {
        type: 'plateau',
        confidence: 0.9,
        description: `Quality has plateaued at ${avgScore.toFixed(2)} over ${windowSize} iterations (variance: ${variance.toFixed(3)})`,
        suggestedAction: `Focus on exploring novel techniques and creative approaches to break the plateau. Current average score is ${avgScore.toFixed(2)}. Try new algorithms, visual effects, or interactivity patterns to increase variety.`,
      };
    }

    return null;
  }

  /**
   * Detect if quality is declining.
   * @param windowSize - Number of recent iterations to analyze (default: 10)
   * @returns ImprovementSuggestion if decline detected, null otherwise
   */
  detectDecline(windowSize: number = DEFAULT_WINDOW_SIZE): ImprovementSuggestion | null {
    if (this.trends.length < windowSize) {
      return null;
    }

    const recent = this.trends.slice(-windowSize);
    const scores = recent.map(t => t.overallScore);

    // Calculate linear regression slope
    const n = scores.length;
    const xSum = (n * (n - 1)) / 2;
    const ySum = scores.reduce((a, b) => a + b, 0);
    const xySum = scores.reduce((sum, score, i) => sum + i * score, 0);
    const x2Sum = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);

    if (slope < DECLINE_SLOPE_THRESHOLD) {
      const startScore = scores[0];
      const endScore = scores[scores.length - 1];
      const decline = startScore - endScore;

      return {
        type: 'decline',
        confidence: Math.min(1, Math.abs(slope) * 10),
        description: `Quality is declining: ${startScore.toFixed(2)} → ${endScore.toFixed(2)} (slope: ${slope.toFixed(3)})`,
        suggestedAction: `Quality has dropped by ${decline.toFixed(2)} points over ${windowSize} iterations. Review recent changes, return to proven techniques, and simplify complexity. Focus on core functionality before adding features.`,
      };
    }

    return null;
  }

  /**
   * Detect domains with low representation or quality.
   * @returns Array of improvement suggestions for each domain gap
   */
  detectDomainGaps(): ImprovementSuggestion[] {
    const suggestions: ImprovementSuggestion[] = [];

    if (this.trends.length === 0) {
      return suggestions;
    }

    // Group by domain
    const domainMap = new Map<string, QualityTrend[]>();
    for (const trend of this.trends) {
      const entries = domainMap.get(trend.domain) ?? [];
      entries.push(trend);
      domainMap.set(trend.domain, entries);
    }

    // Check each domain for gaps
    domainMap.forEach((entries, domain) => {
      const avgQuality = entries.reduce((sum, t) => sum + t.overallScore, 0) / entries.length;

      if (entries.length < DOMAIN_MIN_ENTRIES) {
        suggestions.push({
          type: 'domain_gap',
          confidence: 0.8,
          description: `Domain '${domain}' has only ${entries.length} entries (need ${DOMAIN_MIN_ENTRIES})`,
          suggestedAction: `Generate more examples in the '${domain}' domain to build a robust quality baseline. Focus on fundamental techniques and best practices specific to ${domain}.`,
        });
      } else if (avgQuality < DOMAIN_MIN_AVG_QUALITY) {
        suggestions.push({
          type: 'domain_gap',
          confidence: 0.7,
          description: `Domain '${domain}' has low average quality: ${avgQuality.toFixed(2)} (threshold: ${DOMAIN_MIN_AVG_QUALITY})`,
          suggestedAction: `Improve quality in '${domain}' by studying successful patterns, using established libraries/frameworks, and focusing on core principles. Current average is ${avgQuality.toFixed(2)}; target is ${DOMAIN_MIN_AVG_QUALITY}.`,
        });
      }
    });

    return suggestions;
  }

  /**
   * Detect if we've hit a quality ceiling (high but not improving).
   * @returns ImprovementSuggestion if quality ceiling detected, null otherwise
   */
  detectQualityCeiling(): ImprovementSuggestion | null {
    if (this.trends.length < DEFAULT_WINDOW_SIZE) {
      return null;
    }

    const recent = this.trends.slice(-DEFAULT_WINDOW_SIZE);
    const scores = recent.map(t => t.overallScore);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    if (avgScore < QUALITY_CEILING_THRESHOLD) {
      return null;
    }

    // Calculate improvement rate (slope)
    const n = scores.length;
    const xSum = (n * (n - 1)) / 2;
    const ySum = scores.reduce((a, b) => a + b, 0);
    const xySum = scores.reduce((sum, score, i) => sum + i * score, 0);
    const x2Sum = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);

    if (slope < QUALITY_CEILING_IMPROVEMENT_RATE) {
      return {
        type: 'quality_ceiling',
        confidence: 0.85,
        description: `Hit quality ceiling at ${avgScore.toFixed(2)} with minimal improvement (slope: ${slope.toFixed(3)})`,
        suggestedAction: `Quality has plateaued at ${avgScore.toFixed(2)}; consider exploring fundamentally different approaches, cross-domain techniques, or breaking conventions. Push creative boundaries even at risk of temporary quality dips.`,
      };
    }

    return null;
  }

  /**
   * Design an improvement spec before calling LLM.
   * Generates a prompt enhancement that tells the LLM what to focus on.
   * @param suggestion - The improvement suggestion to act on
   * @returns Natural language prompt enhancement
   */
  designImprovementSpec(suggestion: ImprovementSuggestion): string {
    const base = `[SELF-REFLECTION: ${suggestion.type.toUpperCase()}]\n`;
    const confidence = `(confidence: ${(suggestion.confidence * 100).toFixed(0)}%)\n`;
    const description = `ISSUE: ${suggestion.description}\n`;
    const action = `ACTION REQUIRED: ${suggestion.suggestedAction}\n`;

    return base + confidence + description + action;
  }

  /**
   * Get overall quality trajectory.
   * @returns 'improving', 'stable', or 'declining'
   */
  getTrajectory(): 'improving' | 'stable' | 'declining' {
    if (this.trends.length < 3) {
      return 'stable';
    }

    const recent = this.trends.slice(-10);
    const scores = recent.map(t => t.overallScore);

    // Simple linear regression
    const n = scores.length;
    const xSum = (n * (n - 1)) / 2;
    const ySum = scores.reduce((a, b) => a + b, 0);
    const xySum = scores.reduce((sum, score, i) => sum + i * score, 0);
    const x2Sum = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);

    if (slope > 0.01) return 'improving';
    if (slope < -0.01) return 'declining';
    return 'stable';
  }

  /**
   * Get summary statistics.
   * @returns Object with avgScore, trend, bestScore, iterations
   */
  getStats(): { avgScore: number; trend: string; bestScore: number; iterations: number } {
    if (this.trends.length === 0) {
      return { avgScore: 0, trend: 'no data', bestScore: 0, iterations: 0 };
    }

    const scores = this.trends.map(t => t.overallScore);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const bestScore = Math.max(...scores);
    const trend = this.getTrajectory();

    return {
      avgScore,
      trend,
      bestScore,
      iterations: this.trends.length,
    };
  }

  /**
   * Clear all recorded trends.
   */
  clear(): void {
    this.trends = [];
  }

  /**
   * Get all recorded trends.
   * @returns Copy of trends array
   */
  getTrends(): QualityTrend[] {
    return [...this.trends];
  }

  /**
   * Get trends filtered by domain.
   * @param domain - Domain to filter by
   * @returns Filtered trends
   */
  getTrendsByDomain(domain: string): QualityTrend[] {
    return this.trends.filter(t => t.domain === domain);
  }

  /**
   * Get the number of recorded trends.
   * @returns Number of trends
   */
  size(): number {
    return this.trends.length;
  }
}
