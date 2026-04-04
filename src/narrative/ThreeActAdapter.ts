/**
 * ThreeActAdapter — bridges TelemetryAggregator data into the three-act narrative format
 *
 * Maps era-based telemetry data into the structure defined in THREE-ACT-PLAYBOOK.md:
 *   Act 1: Simon Has Ideas (personal, vision-driven)
 *   Act 2: Coding Agents Build Liminal (analytical, pattern-obsessed)
 *   Act 3: Liminal Starts Finishing Itself (self-aware, observational)
 *
 * Each content piece follows the four-part template:
 *   [ACT MARKER] / [VOICE] / [CONTENT] / [EVIDENCE]
 */

import { globalTelemetry, type TrendBucket } from '../core/TelemetryAggregator.js';

// ── Era definitions (from archaeology analysis) ──

export interface EraDefinition {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  act: 1 | 2 | 3;
  description: string;
}

export const DEFAULT_ERAS: EraDefinition[] = [
  { id: 'era-01', name: 'Origins', startDate: '2025-06-01', endDate: '2025-07-15', act: 1, description: 'First experiments and scaffolding' },
  { id: 'era-02', name: 'Foundation', startDate: '2025-07-16', endDate: '2025-09-01', act: 1, description: 'Core architecture and patterns emerge' },
  { id: 'era-03', name: 'Expansion', startDate: '2025-09-02', endDate: '2025-10-15', act: 1, description: 'New domains and features' },
  { id: 'era-04', name: 'Agent Dawn', startDate: '2025-10-16', endDate: '2025-11-30', act: 2, description: 'Agents begin contributing meaningfully' },
  { id: 'era-05', name: 'Swarm Intelligence', startDate: '2025-12-01', endDate: '2026-01-15', act: 2, description: 'Multi-agent orchestration and harnessing' },
  { id: 'era-06', name: 'The Dogfooding', startDate: '2026-01-16', endDate: '2026-02-28', act: 2, description: 'Self-testing and quality campaigns' },
  { id: 'era-07', name: 'Reasoning Awakening', startDate: '2026-03-01', endDate: '2026-03-15', act: 2, description: 'Thinking traces and reasoning analysis' },
  { id: 'era-08', name: 'The Hardening', startDate: '2026-03-16', endDate: '2026-03-31', act: 3, description: 'Test recovery and stability push' },
  { id: 'era-09', name: 'Self-Narration', startDate: '2026-04-01', endDate: '2026-04-15', act: 3, description: 'Liminal generates its own narrative' },
  { id: 'era-10', name: 'Three-Act Content', startDate: '2026-04-16', endDate: '2026-05-01', act: 3, description: 'Marketing pipeline and content generation' },
  { id: 'era-11', name: 'The Flywheel', startDate: '2026-05-02', endDate: '2026-06-01', act: 3, description: 'Self-reinforcing improvement loops' },
];

// ── Voice characteristics per act ──

export interface VoiceProfile {
  act: 1 | 2 | 3;
  narrator: string;
  openingPatterns: string[];
  sentenceStyle: string;
  evidenceType: string;
  tone: string;
}

export const VOICE_PROFILES: VoiceProfile[] = [
  {
    act: 1,
    narrator: 'The Developer',
    openingPatterns: ['I wanted', 'I was thinking', 'What if', 'I noticed'],
    sentenceStyle: 'Personal, metaphor-rich, first person',
    evidenceType: 'Commit messages, session logs, YouTube watch history',
    tone: 'Visionary, personal, grounded in self-directed learning',
  },
  {
    act: 2,
    narrator: 'The Agents',
    openingPatterns: ['Round', 'Attempt', 'Score:', 'Pattern detected:'],
    sentenceStyle: 'Analytical, numbered, non-human perspective',
    evidenceType: 'Swarm outputs, MetaHarness logs, generation telemetry, dogfood JSONL',
    tone: 'Pattern-obsessed, forensic, detached but thorough',
  },
  {
    act: 3,
    narrator: 'Liminal',
    openingPatterns: ['Analysis:', 'Self-report:', 'Observation:', 'Status:'],
    sentenceStyle: 'Self-aware but not sentient, observational',
    evidenceType: 'Architecture state diffs, test results, auto-adaptation logs',
    tone: 'Calm, measured, almost clinical self-awareness',
  },
];

// ── Content piece structure ──

export interface ThreeActContent {
  actMarker: string;
  voice: VoiceProfile;
  content: string;
  evidence: string;
  era: EraDefinition;
  telemetry: {
    totalGenerations: number;
    successRate: number;
    avgReasoningQuality?: number;
    topPatterns?: Record<string, number>;
  };
}

// ── Adapter class ──

export class ThreeActAdapter {
  private eras: EraDefinition[];

  constructor(eras?: EraDefinition[]) {
    this.eras = eras ?? DEFAULT_ERAS;
  }

  /**
   * Get the act number for a given date.
   */
  getActForDate(date: Date): 1 | 2 | 3 {
    const iso = date.toISOString().slice(0, 10);
    for (const era of this.eras) {
      if (iso >= era.startDate && iso <= era.endDate) {
        return era.act;
      }
    }
    // Default to act 3 for dates beyond defined eras
    return 3;
  }

  /**
   * Get the era for a given date.
   */
  getEraForDate(date: Date): EraDefinition | undefined {
    const iso = date.toISOString().slice(0, 10);
    return this.eras.find(e => iso >= e.startDate && iso <= e.endDate);
  }

  /**
   * Get the voice profile for an act.
   */
  getVoiceForAct(act: 1 | 2 | 3): VoiceProfile {
    return VOICE_PROFILES.find(v => v.act === act)!;
  }

  /**
   * Build three-act content from telemetry for a given era.
   */
  buildEraContent(era: EraDefinition): ThreeActContent | null {
    const trends = globalTelemetry.getTrends({
      startDate: era.startDate,
      endDate: era.endDate,
    });

    if (trends.buckets.length === 0) return null;

    const totalGenerations = trends.buckets.reduce((sum, b) => sum + b.total, 0);
    const totalSuccessful = trends.buckets.reduce((sum, b) => sum + b.successful, 0);
    const successRate = totalGenerations > 0 ? totalSuccessful / totalGenerations : 0;

    // Aggregate reasoning trends if available
    let avgReasoningQuality: number | undefined;
    let topPatterns: Record<string, number> | undefined;

    if (trends.reasoning && trends.reasoning.length > 0) {
      const rTotal = trends.reasoning.reduce((sum, b) => sum + b.total, 0);
      const rQualitySum = trends.reasoning.reduce((sum, b) => sum + b.avgQuality * b.total, 0);
      avgReasoningQuality = rTotal > 0 ? Math.round((rQualitySum / rTotal) * 100) / 100 : undefined;

      const allPatterns: Record<string, number> = {};
      for (const bucket of trends.reasoning) {
        for (const [pattern, count] of Object.entries(bucket.patternCounts)) {
          allPatterns[pattern] = (allPatterns[pattern] || 0) + count;
        }
      }
      if (Object.keys(allPatterns).length > 0) {
        topPatterns = Object.fromEntries(
          Object.entries(allPatterns).sort((a, b) => b[1] - a[1]).slice(0, 5)
        );
      }
    }

    const voice = this.getVoiceForAct(era.act);

    return {
      actMarker: `ACT ${era.act}`,
      voice,
      content: this.generateContent(era, totalGenerations, successRate, avgReasoningQuality, topPatterns),
      evidence: this.generateEvidence(era, totalGenerations, successRate, trends.buckets),
      era,
      telemetry: {
        totalGenerations,
        successRate: Math.round(successRate * 100) / 100,
        avgReasoningQuality,
        topPatterns,
      },
    };
  }

  /**
   * Build content for all eras that have telemetry data.
   */
  buildAllEras(): ThreeActContent[] {
    return this.eras
      .map(era => this.buildEraContent(era))
      .filter((c): c is ThreeActContent => c !== null);
  }

  /**
   * Export all content in the playbook's four-part template format.
   */
  exportPlaybookFormat(): string {
    const contents = this.buildAllEras();
    if (contents.length === 0) return '# No telemetry data available for any era\n';

    const sections = contents.map(c => [
      `## [${c.actMarker}] ${c.era.name} (${c.era.startDate} — ${c.era.endDate})`,
      '',
      `**Voice:** ${c.voice.narrator}`,
      `**Tone:** ${c.voice.tone}`,
      '',
      '### Content',
      c.content,
      '',
      '### Evidence',
      c.evidence,
      '',
      '### Telemetry Summary',
      `- Generations: ${c.telemetry.totalGenerations}`,
      `- Success Rate: ${(c.telemetry.successRate * 100).toFixed(1)}%`,
      c.telemetry.avgReasoningQuality !== undefined
        ? `- Reasoning Quality: ${c.telemetry.avgReasoningQuality.toFixed(2)}`
        : null,
      c.telemetry.topPatterns
        ? `- Top Patterns: ${Object.entries(c.telemetry.topPatterns).map(([k, v]) => `${k} (${v})`).join(', ')}`
        : null,
      '',
      '---',
    ].filter(Boolean).join('\n'));

    return `# Three-Act Narrative — Generated from Telemetry\n\n${sections.join('\n')}`;
  }

  // ── Private helpers ──

  private generateContent(
    era: EraDefinition,
    total: number,
    successRate: number,
    reasoningQuality?: number,
    topPatterns?: Record<string, number>,
  ): string {
    const pct = (successRate * 100).toFixed(1);

    if (era.act === 1) {
      return `During ${era.name}, ${total} generations were attempted across all domains. ` +
        `The success rate of ${pct}% reflects the exploratory nature of this period — ` +
        `each generation was a learning moment, building intuition for what the tool could become.`;
    }

    if (era.act === 2) {
      const patternLine = topPatterns
        ? ` Dominant patterns: ${Object.entries(topPatterns).map(([k, v]) => `${k}×${v}`).join(', ')}.`
        : '';
      const qualityLine = reasoningQuality !== undefined
        ? ` Average reasoning quality: ${reasoningQuality.toFixed(2)}/1.0.`
        : '';
      return `Round ${era.id}: ${total} generations completed. Success rate: ${pct}%.${qualityLine}${patternLine} ` +
        `Each generation left forensic traces — the agents were building, but they were also learning.`;
    }

    // Act 3
    const qualityLine = reasoningQuality !== undefined
      ? ` Self-assessment quality: ${reasoningQuality.toFixed(2)}.`
      : '';
    return `Observation: ${total} generations processed during ${era.name}.${qualityLine} ` +
      `Success rate: ${pct}%. The system is approaching equilibrium — each run refines the model for the next.`;
  }

  private generateEvidence(
    era: EraDefinition,
    total: number,
    successRate: number,
    buckets: TrendBucket[],
  ): string {
    const peak = buckets.reduce((best, b) => b.total > best.total ? b : best, buckets[0]);
    return [
      `Era: ${era.name} (${era.startDate} — ${era.endDate})`,
      `Total generations: ${total}`,
      `Overall success rate: ${(successRate * 100).toFixed(1)}%`,
      `Peak activity: ${peak?.date ?? 'N/A'} (${peak?.total ?? 0} generations)`,
    ].join('\n');
  }
}

/** Singleton adapter with default eras */
export const threeActAdapter = new ThreeActAdapter();
