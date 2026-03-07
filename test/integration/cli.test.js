import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const cliPath = path.join(process.cwd(), 'bin/atelier');

describe('CLI Integration Tests', () => {
  let testOutputDir;
  const TEST_TIMEOUT = 45000;

  beforeAll(() => {
    testOutputDir = path.join(process.cwd(), 'test-cli-output');
  });

  afterEach(async () => {
    try { await fs.rm(testOutputDir, { recursive: true, force: true }); } catch {}
  });

  describe('CLI Invocation and Flags', () => {
    test('should show help', async () => {
      const result = await runCLI(['--help']);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('USAGE:');
    }, 10000);

    test('should show version', async () => {
      const result = await runCLI(['--version']);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Atelier');
    }, 10000);

    test('should generate with fast LM Studio model', async () => {
      const result = await runCLI([
        '--prompt', 'simple blue circle',
        '--output', testOutputDir,
        '--max-iterations', '1'
      ]);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Atelier');
    }, TEST_TIMEOUT);
  });
});

async function runCLI(args) {
  return new Promise((resolve) => {
    const cliProcess = spawn('node', [cliPath, ...args], {
      env: {
        ...process.env,
        ATELIER_LLM_PROVIDER: 'inception',
        ATELIER_LLM_BASE_URL: 'http://100.66.225.85:1234/v1',
        ATELIER_LLM_MODEL: 'liquid/lfm2-24b-a2b'
      }
    });
    let stdout = '';
    let stderr = '';
    cliProcess.stdout.on('data', (d) => stdout += d);
    cliProcess.stderr.on('data', (d) => stderr += d);
    cliProcess.on('close', (code) => resolve({ exitCode: code, stdout, stderr }));
    setTimeout(() => { cliProcess.kill(); resolve({ exitCode: -1, stdout, stderr: 'timeout' }); }, 45000);
  });
}
