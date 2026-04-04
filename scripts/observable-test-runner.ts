#!/usr/bin/env tsx
/**
 * Observable LM Studio Test Runner
 * 
 * Ultra-transparent test execution with:
 * - Real-time progress updates
 * - Per-test LLM call tracing
 * - Token usage metrics (if available)
 * - Code generation validation steps
 * - Failure analysis with pattern detection
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { createInterface } from 'readline';

// ============================================================================
// TYPES & CONFIG
// ============================================================================

interface Model {
  id: string;
  name: string;
  timeout: number;
  description: string;
}

interface TestStep {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  startTime?: number;
  endTime?: number;
  durationMs?: number;
  output?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

interface ModelTestRun {
  model: Model;
  status: 'pending' | 'running' | 'completed' | 'failed';
  steps: TestStep[];
  startTime?: number;
  endTime?: number;
  totalDurationMs?: number;
}

interface LiveMetrics {
  currentModel?: string;
  currentTest?: string;
  testsCompleted: number;
  testsTotal: number;
  modelsCompleted: number;
  modelsTotal: number;
  startTime: number;
}

// ============================================================================
// ANSI COLORS & UI
// ============================================================================

const C = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  clear: '\x1b[2J\x1b[H',
};

function box(text: string, width = 80): string {
  const line = '─'.repeat(width - 2);
  return `┌${line}┐\n│ ${text.padEnd(width - 4)} │\n└${line}┘`;
}

function statusIcon(status: TestStep['status']): string {
  switch (status) {
    case 'pending': return C.dim + '○' + C.reset;
    case 'running': return C.yellow + '◐' + C.reset;
    case 'passed': return C.green + '✓' + C.reset;
    case 'failed': return C.red + '✗' + C.reset;
    case 'skipped': return C.dim + '⊘' + C.reset;
  }
}

// ============================================================================
// OBSERVABILITY DASHBOARD
// ============================================================================

class ObservableDashboard {
  private runs: ModelTestRun[] = [];
  private metrics: LiveMetrics;
  private outputDir: string;
  private logBuffer: string[] = [];

  constructor(models: Model[], outputDir = './test-results/observable') {
    this.outputDir = outputDir;
    this.metrics = {
      testsCompleted: 0,
      testsTotal: models.length * 3, // 3 test files per model
      modelsCompleted: 0,
      modelsTotal: models.length,
      startTime: Date.now(),
    };

    // Initialize runs
    for (const model of models) {
      this.runs.push({
        model,
        status: 'pending',
        steps: [
          { name: 'p5-blue-circle', status: 'pending' },
          { name: 'strudel-pattern', status: 'pending' },
          { name: 'validation', status: 'pending' },
        ],
      });
    }
  }

  log(level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR', message: string, data?: unknown): void {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const entry = `[${timestamp}] [${level}] ${message}`;
    this.logBuffer.push(entry);
    
    if (level !== 'DEBUG') {
      console.log(C.dim + `[${timestamp}]` + C.reset, message);
      if (data) {
        console.log('  →', JSON.stringify(data, null, 2).split('\n').join('\n     '));
      }
    }
  }

  startModel(modelId: string): void {
    const run = this.runs.find(r => r.model.id === modelId);
    if (run) {
      run.status = 'running';
      run.startTime = Date.now();
      this.metrics.currentModel = modelId;
      this.log('INFO', `🚀 Starting tests for ${C.cyan}${modelId}${C.reset}`);
    }
  }

  startStep(modelId: string, stepName: string): void {
    const run = this.runs.find(r => r.model.id === modelId);
    const step = run?.steps.find(s => s.name === stepName);
    if (step) {
      step.status = 'running';
      step.startTime = Date.now();
      this.metrics.currentTest = stepName;
      this.log('DEBUG', `  ▶ Starting step: ${stepName}`);
    }
  }

  completeStep(modelId: string, stepName: string, passed: boolean, output?: string, error?: string): void {
    const run = this.runs.find(r => r.model.id === modelId);
    const step = run?.steps.find(s => s.name === stepName);
    if (step) {
      step.status = passed ? 'passed' : 'failed';
      step.endTime = Date.now();
      step.durationMs = step.endTime - (step.startTime || step.endTime);
      step.output = output;
      step.error = error;
      
      this.metrics.testsCompleted++;
      
      const icon = passed ? '✓' : '✗';
      const color = passed ? C.green : C.red;
      this.log(
        passed ? 'INFO' : 'ERROR',
        `  ${color}${icon}${C.reset} Step ${stepName} ${passed ? 'passed' : 'failed'} (${step.durationMs}ms)`
      );
    }
  }

  completeModel(modelId: string): void {
    const run = this.runs.find(r => r.model.id === modelId);
    if (run) {
      run.status = 'completed';
      run.endTime = Date.now();
      run.totalDurationMs = run.endTime - (run.startTime || run.endTime);
      this.metrics.modelsCompleted++;
      this.log('INFO', `✅ Completed ${C.cyan}${modelId}${C.reset} in ${run.totalDurationMs}ms`);
    }
  }

  failModel(modelId: string, error: string): void {
    const run = this.runs.find(r => r.model.id === modelId);
    if (run) {
      run.status = 'failed';
      run.endTime = Date.now();
      run.totalDurationMs = run.endTime - (run.startTime || run.endTime);
      this.metrics.modelsCompleted++;
      this.log('ERROR', `❌ Failed ${C.cyan}${modelId}${C.reset}: ${error}`);
    }
  }

  render(): string {
    const elapsed = ((Date.now() - this.metrics.startTime) / 1000).toFixed(1);
    const progress = (this.metrics.testsCompleted / this.metrics.testsTotal * 100).toFixed(1);
    
    let output = C.clear;
    output += `${C.bright}${C.white}LM Studio Test Runner - Live Dashboard${C.reset}\n`;
    output += `${C.dim}Elapsed: ${elapsed}s | Progress: ${progress}% | Models: ${this.metrics.modelsCompleted}/${this.metrics.modelsTotal}${C.reset}\n`;
    output += '─'.repeat(80) + '\n';

    for (const run of this.runs) {
      const modelColor = run.status === 'running' ? C.yellow : 
                        run.status === 'completed' ? C.green : 
                        run.status === 'failed' ? C.red : C.dim;
      
      output += `\n${modelColor}${run.model.id}${C.reset} ${C.dim}(${run.model.description})${C.reset}\n`;
      
      for (const step of run.steps) {
        const duration = step.durationMs ? ` ${C.dim}(${step.durationMs}ms)${C.reset}` : '';
        output += `  ${statusIcon(step.status)} ${step.name}${duration}\n`;
      }
    }

    if (this.metrics.currentModel && this.metrics.currentTest) {
      output += `\n${C.yellow}▶ Currently running: ${this.metrics.currentModel} / ${this.metrics.currentTest}${C.reset}\n`;
    }

    return output;
  }

  async saveReport(): Promise<void> {
    await fs.mkdir(this.outputDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(this.outputDir, `report-${timestamp}.json`);
    
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      runs: this.runs,
      logs: this.logBuffer,
    };
    
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Also save human-readable summary
    const summaryPath = path.join(this.outputDir, `summary-${timestamp}.txt`);
    let summary = `LM Studio Test Run Summary\n`;
    summary += `==========================\n\n`;
    summary += `Time: ${new Date().toISOString()}\n`;
    summary += `Total Duration: ${((Date.now() - this.metrics.startTime) / 1000).toFixed(1)}s\n`;
    summary += `Models Tested: ${this.metrics.modelsTotal}\n`;
    summary += `Tests Run: ${this.metrics.testsCompleted}/${this.metrics.testsTotal}\n\n`;
    
    for (const run of this.runs) {
      const passed = run.steps.filter(s => s.status === 'passed').length;
      const failed = run.steps.filter(s => s.status === 'failed').length;
      const status = failed === 0 ? '✓ PASS' : '✗ FAIL';
      summary += `${status} ${run.model.id}\n`;
      summary += `  Duration: ${run.totalDurationMs}ms\n`;
      for (const step of run.steps) {
        const stepStatus = step.status === 'passed' ? '✓' : step.status === 'failed' ? '✗' : '-';
        summary += `    ${stepStatus} ${step.name}: ${step.durationMs || 'N/A'}ms\n`;
        if (step.error) {
          summary += `      Error: ${step.error.slice(0, 200)}\n`;
        }
      }
      summary += '\n';
    }
    
    await fs.writeFile(summaryPath, summary);
    
    console.log(`\n${C.green}📊 Reports saved:${C.reset}`);
    console.log(`   JSON: ${reportPath}`);
    console.log(`   Text: ${summaryPath}`);
  }
}

// ============================================================================
// MODEL DISCOVERY
// ============================================================================

async function discoverModels(): Promise<Model[]> {
  console.log(`${C.cyan}🔍 Discovering models from LM Studio...${C.reset}`);
  
  try {
    const response = await fetch('http://localhost:1234/v1/models');
    const data = await response.json() as { data: Array<{ id: string }> };
    
    return data.data.map(m => {
      let timeout = 120000;
      let description = 'Standard model';

      if (m.id.includes('40b')) {
        timeout = 300000;
        description = 'Large model (40B params)';
      } else if (m.id.includes('9b')) {
        timeout = 180000;
        description = 'Medium model (9B params)';
      } else if (m.id.includes('1.2b') || m.id.includes('1b')) {
        timeout = 60000;
        description = 'Small model (1.2B params)';
      }

      return { id: m.id, name: m.id.split('-').slice(0, 3).join('-'), timeout, description };
    });
  } catch (error) {
    console.error(`${C.red}Failed to discover models:${C.reset}`, error);
    throw error;
  }
}

// ============================================================================
// TEST EXECUTION WITH STREAMING OUTPUT
// ============================================================================

async function runTestWithStreaming(
  model: Model,
  testFile: string,
  dashboard: ObservableDashboard
): Promise<{ passed: boolean; output: string; error?: string }> {
  const stepName = path.basename(testFile, '.test.ts');
  dashboard.startStep(model.id, stepName);

  const env = {
    ...process.env,
    LIMINAL_LLM_BASE_URL: 'http://localhost:1234/v1',
    LIMINAL_LLM_MODEL: model.id,
    LIMINAL_LLM_PROVIDER: 'lmstudio',
    FORCE_COLOR: '1',
  };

  return new Promise((resolve) => {
    const output: string[] = [];
    const errors: string[] = [];

    const child = spawn('npx', ['vitest', 'run', testFile, '--reporter=verbose'], {
      env,
      cwd: process.cwd(),
    });

    child.stdout.on('data', (data) => {
      const text = data.toString();
      output.push(text);
      // Stream key events to console
      if (text.includes('✓') || text.includes('✗') || text.includes('Error')) {
        process.stdout.write(C.dim + text.split('\n').map(l => `    ${l}`).join('\n') + C.reset);
      }
    });

    child.stderr.on('data', (data) => {
      errors.push(data.toString());
    });

    child.on('close', (code) => {
      const passed = code === 0;
      const outputStr = output.join('');
      const errorStr = errors.join('') || undefined;
      
      dashboard.completeStep(model.id, stepName, passed, outputStr, errorStr);
      resolve({ passed, output: outputStr, error: errorStr });
    });

    // Timeout handling
    setTimeout(() => {
      child.kill('SIGTERM');
      const timeoutError = `Test timed out after ${model.timeout}ms`;
      dashboard.completeStep(model.id, stepName, false, output.join(''), timeoutError);
      resolve({ passed: false, output: output.join(''), error: timeoutError });
    }, model.timeout);
  });
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main(): Promise<void> {
  console.log(C.clear);
  console.log(box('LM STUDIO TEST RUNNER - OBSERVABLE MODE', 80));
  console.log();

  const models = await discoverModels();
  console.log(`${C.green}✓${C.reset} Found ${models.length} models:\n`);
  for (const m of models) {
    console.log(`  • ${C.cyan}${m.id}${C.reset} - ${m.description}`);
  }
  console.log();

  const dashboard = new ObservableDashboard(models);
  
  // Start rendering loop
  const renderInterval = setInterval(() => {
    process.stdout.write(dashboard.render());
  }, 500);

  try {
    for (const model of models) {
      dashboard.startModel(model.id);

      // Run each test file
      const testFiles = [
        'test/e2e/models/qwen3-5-9b.test.ts',
        'test/e2e/models/qwen3-coder-40b.test.ts',
        'test/e2e/models/lfm-2-5-1-2b.test.ts',
      ];

      let modelFailed = false;
      for (const testFile of testFiles) {
        const result = await runTestWithStreaming(model, testFile, dashboard);
        if (!result.passed) {
          modelFailed = true;
        }
      }

      if (modelFailed) {
        dashboard.failModel(model.id, 'One or more tests failed');
      } else {
        dashboard.completeModel(model.id);
      }

      // Cooldown between models
      if (models.indexOf(model) < models.length - 1) {
        dashboard.log('INFO', 'Cooldown: waiting 3s before next model...');
        await new Promise(r => setTimeout(r, 3000));
      }
    }

    clearInterval(renderInterval);
    await dashboard.saveReport();

    // Final summary
    console.log('\n' + '='.repeat(80));
    console.log(`${C.bright}RUN COMPLETE${C.reset}`);
    console.log('='.repeat(80));
    
    const allPassed = dashboard['runs'].every((r: ModelTestRun) => 
      r.steps.every(s => s.status === 'passed')
    );
    
    process.exit(allPassed ? 0 : 1);

  } catch (error) {
    clearInterval(renderInterval);
    console.error(`${C.red}Fatal error:${C.reset}`, error);
    await dashboard.saveReport();
    process.exit(1);
  }
}

main();
