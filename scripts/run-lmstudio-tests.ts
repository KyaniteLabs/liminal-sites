#!/usr/bin/env tsx
/**
 * LM Studio Model Test Runner
 * 
 * Runs all E2E tests through all models currently loaded in LM Studio.
 * Provides maximum observability with detailed logging, timing, and metrics.
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// CONFIGURATION
// ============================================================================

const LMSTUDIO_BASE_URL = 'http://localhost:1234/v1';
const TEST_TIMEOUT_MS = 300000; // 5 minutes per model
const OUTPUT_DIR = './test-results/lmstudio-run';
const LOG_FILE = `${OUTPUT_DIR}/test-run-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;

// Models to test (will be fetched from LM Studio)
interface Model {
  id: string;
  name: string;
  timeout: number;
  description: string;
}

// ============================================================================
// OBSERVABILITY / LOGGING
// ============================================================================

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'DEBUG';
  phase: string;
  model?: string;
  test?: string;
  message: string;
  data?: unknown;
  durationMs?: number;
}

const logs: LogEntry[] = [];

function log(
  level: LogEntry['level'],
  phase: string,
  message: string,
  data?: unknown,
  model?: string,
  test?: string,
  durationMs?: number
): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    phase,
    model,
    test,
    message,
    data,
    durationMs,
  };
  logs.push(entry);

  // Console output with colors
  const colors = {
    INFO: '\x1b[36m',    // Cyan
    WARN: '\x1b[33m',    // Yellow
    ERROR: '\x1b[31m',   // Red
    SUCCESS: '\x1b[32m', // Green
    DEBUG: '\x1b[90m',   // Gray
    RESET: '\x1b[0m',
  };

  const prefix = model ? `[${model}]` : '';
  const testSuffix = test ? ` (${test})` : '';
  const durationSuffix = durationMs ? ` (${durationMs}ms)` : '';
  
  console.log(
    `${colors[level]}[${level}]${colors.RESET} [${phase}] ${prefix}${testSuffix} ${message}${durationSuffix}`
  );

  if (data && level !== 'DEBUG') {
    console.log('  → Data:', JSON.stringify(data, null, 2).split('\n').join('\n     '));
  }
}

// ============================================================================
// MODEL DISCOVERY
// ============================================================================

async function discoverModels(): Promise<Model[]> {
  log('INFO', 'DISCOVERY', 'Fetching models from LM Studio...');

  try {
    const response = await fetch(`${LMSTUDIO_BASE_URL}/models`);
    if (!response.ok) {
      throw new Error(`LM Studio returned ${response.status}`);
    }

    const data = await response.json() as { data: Array<{ id: string }> };
    
    log('INFO', 'DISCOVERY', `Found ${data.data.length} models`, data.data);

    return data.data.map(m => {
      // Determine timeout based on model size (larger = slower)
      let timeout = 120000; // default 2 min
      let description = 'Standard model';

      if (m.id.includes('40b')) {
        timeout = 300000; // 5 min for 40B
        description = 'Large model (40B params)';
      } else if (m.id.includes('9b')) {
        timeout = 180000; // 3 min for 9B
        description = 'Medium model (9B params)';
      } else if (m.id.includes('1.2b') || m.id.includes('1b')) {
        timeout = 60000; // 1 min for 1.2B
        description = 'Small model (1.2B params)';
      }

      return {
        id: m.id,
        name: m.id.split('-').slice(0, 3).join('-'), // Short name
        timeout,
        description,
      };
    });
  } catch (error) {
    log('ERROR', 'DISCOVERY', 'Failed to fetch models', { error: String(error) });
    throw error;
  }
}

// ============================================================================
// TEST EXECUTION
// ============================================================================

interface TestResult {
  model: string;
  testFile: string;
  passed: boolean;
  durationMs: number;
  output?: string;
  error?: string;
}

async function runModelTests(model: Model): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  log('INFO', 'SETUP', 'Starting test run', undefined, model.id);

  // Set environment for this model
  const env = {
    ...process.env,
    LIMINAL_LLM_BASE_URL: LMSTUDIO_BASE_URL,
    LIMINAL_LLM_MODEL: model.id,
    LIMINAL_LLM_PROVIDER: 'lmstudio',
  };

  // Test files to run for this model
  const testFiles = [
    'test/e2e/models/qwen3-5-9b.test.ts',
    'test/e2e/models/qwen3-coder-40b.test.ts',
    'test/e2e/models/lfm-2-5-1-2b.test.ts',
  ];

  for (const testFile of testFiles) {
    const startTime = Date.now();
    const shortName = path.basename(testFile, '.test.ts');

    log('INFO', 'TEST', `Running ${shortName}...`, undefined, model.id, shortName);

    try {
      // Run the test with vitest
      const output = execSync(
        `npx vitest run ${testFile} --reporter=verbose`,
        {
          env,
          timeout: model.timeout,
          encoding: 'utf-8',
          stdio: 'pipe',
        }
      );

      const durationMs = Date.now() - startTime;
      
      log('SUCCESS', 'TEST', `Passed`, { output: output.slice(0, 500) }, model.id, shortName, durationMs);

      results.push({
        model: model.id,
        testFile: shortName,
        passed: true,
        durationMs,
        output: output.slice(0, 2000), // First 2000 chars
      });
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const errorOutput = error instanceof Error ? error.message : String(error);
      
      log('ERROR', 'TEST', `Failed`, { error: errorOutput.slice(0, 500) }, model.id, shortName, durationMs);

      results.push({
        model: model.id,
        testFile: shortName,
        passed: false,
        durationMs,
        error: errorOutput.slice(0, 2000),
      });
    }
  }

  return results;
}

// ============================================================================
// REPORTING
// ============================================================================

async function generateReport(allResults: TestResult[]): Promise<void> {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Save detailed logs
  await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2));
  log('INFO', 'REPORT', `Detailed logs saved to ${LOG_FILE}`);

  // Generate summary report
  const summary = {
    timestamp: new Date().toISOString(),
    totalTests: allResults.length,
    passed: allResults.filter(r => r.passed).length,
    failed: allResults.filter(r => !r.passed).length,
    totalDurationMs: allResults.reduce((sum, r) => sum + r.durationMs, 0),
    models: {} as Record<string, { passed: number; failed: number; tests: TestResult[] }>,
  };

  for (const result of allResults) {
    if (!summary.models[result.model]) {
      summary.models[result.model] = { passed: 0, failed: 0, tests: [] };
    }
    summary.models[result.model].tests.push(result);
    if (result.passed) {
      summary.models[result.model].passed++;
    } else {
      summary.models[result.model].failed++;
    }
  }

  const reportPath = `${OUTPUT_DIR}/summary-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  await fs.writeFile(reportPath, JSON.stringify(summary, null, 2));

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('TEST RUN SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${summary.totalTests}`);
  console.log(`Passed: ${summary.passed} ✅`);
  console.log(`Failed: ${summary.failed} ❌`);
  console.log(`Total Duration: ${(summary.totalDurationMs / 1000).toFixed(2)}s`);
  console.log('\nPer-Model Results:');
  
  for (const [model, stats] of Object.entries(summary.models)) {
    const status = stats.failed === 0 ? '✅' : '❌';
    console.log(`  ${status} ${model}: ${stats.passed}/${stats.passed + stats.failed} passed`);
    
    for (const test of stats.tests) {
      const testStatus = test.passed ? '✅' : '❌';
      console.log(`    ${testStatus} ${test.testFile} (${test.durationMs}ms)`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`Full report saved to: ${reportPath}`);
  console.log('='.repeat(80) + '\n');
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('LM STUDIO MODEL TEST RUNNER');
  console.log('Maximum Observability Mode');
  console.log('='.repeat(80) + '\n');

  const startTime = Date.now();
  const allResults: TestResult[] = [];

  try {
    // Phase 1: Discovery
    log('INFO', 'INIT', 'Starting test runner');
    const models = await discoverModels();

    if (models.length === 0) {
      log('ERROR', 'INIT', 'No models found in LM Studio');
      process.exit(1);
    }

    // Phase 2: Test Execution (one model at a time)
    for (const model of models) {
      console.log('\n' + '-'.repeat(80));
      log('INFO', 'RUN', `Testing model: ${model.id}`, model, model.id);
      console.log('-'.repeat(80));

      const results = await runModelTests(model);
      allResults.push(...results);

      // Small delay between models to let system cool down
      log('DEBUG', 'COOLDOWN', 'Waiting 2s before next model...', undefined, model.id);
      await new Promise(r => setTimeout(r, 2000));
    }

    // Phase 3: Reporting
    const totalDuration = Date.now() - startTime;
    log('INFO', 'COMPLETE', `All tests completed in ${totalDuration}ms`);
    await generateReport(allResults);

    // Exit with appropriate code
    const hasFailures = allResults.some(r => !r.passed);
    process.exit(hasFailures ? 1 : 0);

  } catch (error) {
    log('ERROR', 'FATAL', 'Test runner crashed', { error: String(error) });
    await generateReport(allResults);
    process.exit(1);
  }
}

main();
