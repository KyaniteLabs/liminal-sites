#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const tracked = spawnSync('git', ['ls-files', '-z'], { encoding: 'buffer' });
if (tracked.status !== 0) {
  process.stderr.write('secret-scan: failed to list tracked files\n');
  process.exit(tracked.status ?? 1);
}

const skipPaths = new Set([
  'pnpm-lock.yaml',
]);

const exactPatterns = [
  ['openai-project-key', /sk-proj-[A-Za-z0-9_-]{20,}/],
  ['anthropic-key', /sk-ant-[A-Za-z0-9_-]{20,}/],
  ['openrouter-key', /sk-or-v1-[A-Za-z0-9_-]{20,}/],
  ['github-fine-grained-token', /github_pat_[A-Za-z0-9_]{20,}/],
  ['github-token', /gh[pousr]_[A-Za-z0-9_]{20,}/],
  ['aws-access-key', /AKIA[0-9A-Z]{16}/],
  ['google-api-key', /AIza[0-9A-Za-z_-]{30,}/],
  ['slack-token', /xox[baprs]-[A-Za-z0-9-]{20,}/],
  ['huggingface-token', /hf_[A-Za-z0-9]{20,}/],
  ['gitlab-token', /glpat-[A-Za-z0-9_-]{20,}/],
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
];

const assignmentPatterns = [
  [
    'secret-assignment',
    /(?:api[_-]?key|apikey|auth[_-]?token|access[_-]?token|secret|password)\s*[:=]\s*["']([^"'\n]{16,})["']/gi,
  ],
  [
    'env-secret-assignment',
    /^\s*[A-Z0-9_]*(?:API_KEY|TOKEN|SECRET|PASSWORD)[A-Z0-9_]*\s*=\s*([^\s#]{16,})/gm,
  ],
];

const unsafeLogPatterns = [
  [
    'secret-log-fragment',
    /console\.(?:log|error|warn|debug)\([^)]*(?:api[_ -]?key|apikey|token|secret)[^)]*(?:slice|substring|length|prefix|suffix)/i,
  ],
  [
    'secret-fragment-expression',
    /(?:apiKey|API_KEY|token|TOKEN|secret|SECRET)\??\.(?:slice|substring)\(/,
  ],
];

const placeholderTerms = [
  'example',
  'placeholder',
  'dummy',
  'fixture',
  'test',
  'your_',
  'your-',
  'your ',
  'your',
  '${',
  '<',
  '>',
  'process.env',
  'env-',
  'proof-key',
  'fallback',
  'primary',
  'legacy',
];

function isPlaceholderValue(value) {
  const lower = value.toLowerCase();
  return placeholderTerms.some((term) => lower.includes(term));
}

function isLowRiskFixturePath(file) {
  return file.startsWith('test/') || /\/raw\//.test(file);
}

function isRawAuditPath(file) {
  return /\/raw\//.test(file);
}

function isGeneratedOrBinary(content) {
  return content.includes('\u0000');
}

const files = tracked.stdout
  .toString('utf8')
  .split('\0')
  .filter(Boolean)
  .filter((file) => !skipPaths.has(file));

const findings = [];

for (const file of files) {
  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  if (isGeneratedOrBinary(content)) continue;

  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    for (const [id, pattern] of exactPatterns) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        findings.push({ file, line: index + 1, id });
      }
    }

    for (const [id, pattern] of assignmentPatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(line)) !== null) {
        const value = match[1] ?? '';
        if (!isPlaceholderValue(value) && !isLowRiskFixturePath(file)) {
          findings.push({ file, line: index + 1, id });
        }
      }
    }

    if (!isRawAuditPath(file)) {
      for (const [id, pattern] of unsafeLogPatterns) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          findings.push({ file, line: index + 1, id });
        }
      }
    }
  }
}

if (findings.length > 0) {
  process.stderr.write('Secret scan failed. Matched values are intentionally not printed.\n');
  for (const finding of findings) {
    process.stderr.write(`${finding.file}:${finding.line} ${finding.id}\n`);
  }
  process.exit(1);
}

const hasGitleaks = spawnSync('bash', ['-lc', 'command -v gitleaks'], { encoding: 'utf8' });
if (hasGitleaks.status === 0) {
  const gitleaks = spawnSync('gitleaks', ['dir', '.', '--redact=100', '--exit-code', '1', '--no-banner'], {
    stdio: 'inherit',
  });
  if (gitleaks.status !== 0) process.exit(gitleaks.status ?? 1);
} else {
  process.stdout.write('gitleaks not installed; built-in tracked-file secret scan passed.\n');
}

process.stdout.write('Secret scan passed.\n');
