/**
 * TechnicalCritic - Evaluates code from a technical perspective
 *
 * Assesses:
 * - Syntax correctness
 * - Code structure and organization
 * - Performance considerations
 * - Best practices adherence
 * - Error handling
 * - Maintainability
 */

export interface TechnicalCritique {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
  details: {
    syntaxCorrect: boolean;
    hasStructure: boolean;
    performanceIssues: string[];
    bestPracticeViolations: string[];
    maintainabilityScore: number;
  };
}

/**
 * Technical critic for evaluating code quality
 */
export class TechnicalCritic {
  /**
   * Evaluate code from a technical perspective
   *
   * @param code - The code to evaluate
   * @param domain - The domain (p5, glsl, three, etc.)
   * @returns Technical critique with scores and feedback
   */
  static evaluate(code: string, domain: string = 'p5'): TechnicalCritique {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    const performanceIssues: string[] = [];
    const bestPracticeViolations: string[] = [];

    // Check syntax correctness
    const syntaxCorrect = this.checkSyntax(code);
    if (syntaxCorrect) {
      strengths.push('Code has balanced braces and parentheses');
    } else {
      weaknesses.push('Syntax errors detected - unbalanced braces or parentheses');
    }

    // Check structure
    const hasStructure = this.checkStructure(code, domain);
    if (hasStructure.hasSetup && hasStructure.hasDraw) {
      strengths.push('Proper setup() and draw() structure');
    } else {
      if (!hasStructure.hasSetup) weaknesses.push('Missing setup() function');
      if (!hasStructure.hasDraw) weaknesses.push('Missing draw() function');
    }

    // Check for common issues
    const issues = this.detectCommonIssues(code, domain);
    weaknesses.push(...issues.weaknesses);
    suggestions.push(...issues.suggestions);
    performanceIssues.push(...issues.performanceIssues);
    bestPracticeViolations.push(...issues.bestPracticeViolations);

    // Calculate scores
    const syntaxScore = syntaxCorrect ? 0.25 : 0;
    const structureScore = (hasStructure.hasSetup ? 0.15 : 0) + (hasStructure.hasDraw ? 0.15 : 0);
    const complexityScore = Math.min(0.2, code.split('\n').length / 100);
    const performancePenalty = Math.min(0.2, performanceIssues.length * 0.05);
    const bestPracticePenalty = Math.min(0.15, bestPracticeViolations.length * 0.05);

    let score = syntaxScore + structureScore + complexityScore - performancePenalty - bestPracticePenalty;

    // Add strength bonuses
    if (code.includes('class ')) {
      strengths.push('Uses object-oriented patterns');
      score += 0.1;
    }
    if (code.includes('//') || code.includes('/*')) {
      strengths.push('Includes comments for clarity');
      score += 0.05;
    }
    if (/function\s+\w+|const\s+\w+\s*=/.test(code)) {
      strengths.push('Defines reusable functions/variables');
      score += 0.1;
    }

    // Domain-specific checks
    const domainChecks = this.domainSpecificChecks(code, domain);
    strengths.push(...domainChecks.strengths);
    weaknesses.push(...domainChecks.weaknesses);
    suggestions.push(...domainChecks.suggestions);
    score += domainChecks.scoreAdjustment;

    const maintainabilityScore = this.calculateMaintainability(code);

    return {
      strengths,
      weaknesses,
      suggestions,
      score: Math.max(0, Math.min(1, score)),
      details: {
        syntaxCorrect,
        hasStructure: hasStructure.hasSetup && hasStructure.hasDraw,
        performanceIssues,
        bestPracticeViolations,
        maintainabilityScore,
      },
    };
  }

  /**
   * Check basic syntax correctness
   */
  private static checkSyntax(code: string): boolean {
    const stripped = code
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/'(?:[^'\\]|\\.)*'/g, '""')
      .replace(/"(?:[^"\\]|\\.)*"/g, '""')
      .replace(/`(?:[^`\\]|\\.)*`/g, '""');

    const openBraces = (stripped.match(/\{/g) || []).length;
    const closeBraces = (stripped.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) return false;

    const openParens = (stripped.match(/\(/g) || []).length;
    const closeParens = (stripped.match(/\)/g) || []).length;
    if (openParens !== closeParens) return false;

    const openBrackets = (stripped.match(/\[/g) || []).length;
    const closeBrackets = (stripped.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) return false;

    return true;
  }

  /**
   * Check code structure
   */
  private static checkStructure(code: string, domain: string): { hasSetup: boolean; hasDraw: boolean } {
    if (domain === 'glsl') {
      return {
        hasSetup: /void\s+main\s*\(/.test(code),
        hasDraw: /gl_FragColor|out\s+vec4/.test(code),
      };
    }

    return {
      hasSetup: /function\s+setup\s*\(|const\s+setup\s*=/.test(code),
      hasDraw: /function\s+draw\s*\(|const\s+draw\s*=/.test(code),
    };
  }

  /**
   * Detect common code issues
   */
  private static detectCommonIssues(code: string, domain: string): {
    weaknesses: string[];
    suggestions: string[];
    performanceIssues: string[];
    bestPracticeViolations: string[];
  } {
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    const performanceIssues: string[] = [];
    const bestPracticeViolations: string[] = [];

    // Check for magic numbers
    if (/\b(width|height)\s*\/\s*\d+\b/.test(code)) {
      suggestions.push('Consider named constants for magic numbers');
    }

    // Check for hardcoded values
    if (/\b(createCanvas)\s*\(\s*\d+\s*,\s*\d+\s*\)/.test(code)) {
      suggestions.push('Use windowWidth/windowHeight for responsive canvas');
    }

    // Performance issues
    if (domain === 'p5') {
      if (/for\s*\(.*\s+\w+\s*=\s*create/.test(code)) {
        performanceIssues.push('Creating objects in draw() loop may cause performance issues');
      }
      if (/background\s*\(/.test(code) && !/noLoop\s*\(/.test(code)) {
        // This is usually fine, but could be optimized
      }
      if (code.includes('loadImage') && /function\s+draw/.test(code)) {
        performanceIssues.push('Loading images in draw() is inefficient - load in setup()');
      }
    }

    // Best practices
    if (/^var\s+\w+/.test(code)) {
      bestPracticeViolations.push('Consider using const/let instead of var');
    }

    if (code.includes('eval(')) {
      bestPracticeViolations.push('Avoid eval() for security and performance');
    }

    // Code length
    if (code.split('\n').length < 5) {
      weaknesses.push('Code is very short - may lack substance');
    }

    return { weaknesses, suggestions, performanceIssues, bestPracticeViolations };
  }

  /**
   * Domain-specific checks
   */
  private static domainSpecificChecks(code: string, domain: string): {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    scoreAdjustment: number;
  } {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    let scoreAdjustment = 0;

    if (domain === 'p5') {
      // Check for p5.js features
      if (/push\s*\(\)|pop\s*\(\)/.test(code)) {
        strengths.push('Uses push/pop for state isolation');
        scoreAdjustment += 0.05;
      }
      if (/translate\s*\(|rotate\s*\(|scale\s*\(/.test(code)) {
        strengths.push('Uses transformations for creative effects');
        scoreAdjustment += 0.05;
      }
      if (/noise\s*\(|random\s*\(/.test(code)) {
        strengths.push('Incorporates randomness/noise for generative effects');
        scoreAdjustment += 0.05;
      }
      if (/color\s*\(|fill\s*\(|stroke\s*\(/.test(code)) {
        strengths.push('Uses color effectively');
        scoreAdjustment += 0.05;
      }
    } else if (domain === 'glsl') {
      if (/uniform\s+float\s+u_time/.test(code)) {
        strengths.push('Includes time uniform for animation');
        scoreAdjustment += 0.1;
      }
      if (/uniform\s+vec2\s+u_resolution/.test(code)) {
        strengths.push('Includes resolution uniform for responsiveness');
        scoreAdjustment += 0.05;
      }
      if (/sin\s*\(|cos\s*\(/.test(code)) {
        strengths.push('Uses trigonometric functions for effects');
        scoreAdjustment += 0.05;
      }
    } else if (domain === 'three') {
      if (/Scene|PerspectiveCamera|WebGLRenderer/.test(code)) {
        strengths.push('Proper Three.js scene setup');
        scoreAdjustment += 0.1;
      }
      if (/requestAnimationFrame/.test(code)) {
        strengths.push('Uses proper animation loop');
        scoreAdjustment += 0.05;
      }
      if (/geometry|material|mesh/i.test(code)) {
        strengths.push('Creates 3D objects with geometry and materials');
        scoreAdjustment += 0.05;
      }
    }

    return { strengths, weaknesses, suggestions, scoreAdjustment };
  }

  /**
   * Calculate maintainability score
   */
  private static calculateMaintainability(code: string): number {
    let score = 0.5;

    const lines = code.split('\n');

    // Comment ratio
    const commentLines = lines.filter(line => /^\s*\/\//.test(line)).length;
    const commentRatio = commentLines / lines.length;
    if (commentRatio > 0.1) score += 0.1;
    if (commentRatio > 0.2) score += 0.1;

    // Function length (average)
    const functionBlocks = code.split(/function\s+\w+/);
    if (functionBlocks.length > 1) {
      const avgFuncLength = lines.length / functionBlocks.length;
      if (avgFuncLength < 50) score += 0.1;
    }

    // Indentation consistency
    const indentedLines = lines.filter(line => /^\s{2,}/.test(line)).length;
    if (indentedLines > lines.length * 0.3) score += 0.1;

    return Math.max(0, Math.min(1, score));
  }
}
