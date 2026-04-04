/**
 * TelemetryBridge — wires LLM events from EventBus into TelemetryAggregator
 *
 * Subscribes to LLM_RESPONSE events and converts them into GenerationTelemetry
 * records with reasoning trace metadata. This is the connection point between
 * the LLM pipeline (LLMClient → EventBus) and the analytics layer
 * (TelemetryAggregator → three-act narrative).
 *
 * Additionally integrates with ReasoningCapture to enrich telemetry with
 * quality scores and detected patterns.
 */

import { eventBus, EventTypes } from './EventBus.js';
import type { LLMResponseData } from './EventBus.js';
import { globalTelemetry, type GenerationTelemetry } from './TelemetryAggregator.js';

let bridgeActive = false;

/**
 * Start listening to LLM_RESPONSE events and recording telemetry.
 * Idempotent — calling multiple times is safe.
 */
export function startTelemetryBridge(): void {
  if (bridgeActive) return;
  bridgeActive = true;

  eventBus.onEvent((event) => {
    if (event.type !== EventTypes.LLM_RESPONSE) return;

    const d = event.data as unknown as LLMResponseData;
    const record: GenerationTelemetry = {
      id: `tel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date(event.timestamp),
      domain: d.domain ?? 'unknown',
      modelId: d.model,
      provider: d.provider,
      prompt: '', // Prompt not in LLMResponseData; populated via ThinkingAnalyzer path
      generationTimeMs: d.latencyMs,
      outputSizeBytes: 0, // Populated downstream if available
      validationPassed: d.success,
      validationErrors: d.error ? [d.error] : [],
      success: d.success,

      // Reasoning trace fields
      reasoningTraceId: d.reasoningTraceId,
      thinkingSource: d.thinkingSource,
      reasoningQuality: d.reasoningQuality,
      reasoningLength: d.reasoningLength,
      detectedPatterns: d.detectedPatterns,
      recoveredFromThinking: d.recoveredFromThinking,
    };

    globalTelemetry.record(record);
  });
}

/**
 * Record a telemetry entry directly from ThinkingAnalyzer output.
 * Used when the caller has rich reasoning data from the analysis pipeline.
 */
export function recordThinkingTelemetry(params: {
  model: string;
  provider: string;
  domain: string;
  prompt: string;
  success: boolean;
  latencyMs: number;
  outputSizeBytes: number;
  traceId: string;
  thinkingSource: string;
  reasoningQuality: number;
  reasoningLength: number;
  detectedPatterns: string[];
  recoveredFromThinking: boolean;
  validationErrors?: string[];
}): void {
  const record: GenerationTelemetry = {
    id: `tel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date(),
    domain: params.domain,
    modelId: params.model,
    provider: params.provider,
    prompt: params.prompt.slice(0, 500),
    generationTimeMs: params.latencyMs,
    outputSizeBytes: params.outputSizeBytes,
    validationPassed: params.success,
    validationErrors: params.validationErrors ?? [],
    success: params.success,

    reasoningTraceId: params.traceId,
    thinkingSource: params.thinkingSource,
    reasoningQuality: params.reasoningQuality,
    reasoningLength: params.reasoningLength,
    detectedPatterns: params.detectedPatterns,
    recoveredFromThinking: params.recoveredFromThinking,
  };

  globalTelemetry.record(record);
}

/**
 * Check if the bridge is active.
 */
export function isTelemetryBridgeActive(): boolean {
  return bridgeActive;
}
