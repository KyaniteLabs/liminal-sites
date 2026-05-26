import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const script = readFileSync('scripts/proof/live-creative-domain-execution.ts', 'utf8');
const launchDomains = ['p5', 'three', 'shader', 'hydra', 'tone', 'strudel', 'svg', 'html', 'textgen', 'kinetic', 'ascii', 'revideo', 'hyperframes'];

describe('live creative-domain execution matrix', () => {
  it('defaults the live proof to every launch-scoped creative domain', () => {
    expect(script).toContain('LAUNCH_CREATIVE_DOMAINS');
    for (const domain of launchDomains) {
      expect(script).toMatch(new RegExp(`['"]${domain}['"]`));
    }
    expect(script).toMatch(/let domains: Domain\[\] = \[\.\.\.LAUNCH_CREATIVE_DOMAINS\]/);
    expect(script).toContain('readCurrentGitCommit');
    expect(script).toMatch(/gitCommit:\s*readCurrentGitCommit\(process\.cwd\(\)\)/);
    expect(script).toContain('validateCreativeDomainArtifact');
    expect(script).toContain('artifactValidation');
  });

  it('treats HyperFrames as the HTML-backed video output and includes generic HTML in --all', () => {
    expect(script).toContain('HyperFramesGenerator');
    expect(script).toMatch(/hyperframes:\s*'create a HyperFrames/i);
    expect(script).toMatch(/hyperframes:\s*'html'/);
    expect(script).toContain("domain === 'hyperframes'");
    expect(script).toContain('useGeneratorTools: false');
    expect(script).toMatch(/html:\s*'create a compact single-file HTML landing section/i);
    expect(script).toContain("case 'html': return new HTMLWebGenerator");
  });
});
