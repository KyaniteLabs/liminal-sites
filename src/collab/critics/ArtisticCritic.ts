/**
 * ArtisticCritic - Evaluates creative output from an aesthetic perspective
 *
 * Assesses:
 * - Visual appeal
 * - Originality and creativity
 * - Emotional impact
 * - Composition and balance
 * - Color harmony (for visual art)
 * - Overall aesthetic quality
 */

export interface ArtisticCritique {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
  details: {
    visualAppeal: number;
    originality: number;
    emotionalImpact: number;
    composition: number;
    colorHarmony: number;
    techniqueVariety: string[];
  };
}

/**
 * Artistic critic for evaluating aesthetic quality
 */
export class ArtisticCritic {
  /**
   * Evaluate creative output from an aesthetic perspective
   *
   * @param output - The creative output (code, description, etc.)
   * @param domain - The creative domain (p5, glsl, three, ascii, music, etc.)
   * @param userPrompt - Original user prompt for context
   * @returns Artistic critique with scores and feedback
   */
  static evaluate(output: string, domain: string = 'p5', userPrompt: string = ''): ArtisticCritique {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    const techniqueVariety: string[] = [];

    // Analyze visual appeal
    const visualAppeal = this.assessVisualAppeal(output, domain);
    if (visualAppeal > 0.6) {
      strengths.push('Strong visual appeal with engaging elements');
    } else if (visualAppeal < 0.4) {
      weaknesses.push('Visual appeal could be enhanced with more varied elements');
    }

    // Analyze originality
    const originality = this.assessOriginality(output, domain, userPrompt);
    if (originality > 0.6) {
      strengths.push('Creative and original approach');
    } else if (originality < 0.4) {
      weaknesses.push('Could explore more unique or unconventional ideas');
      suggestions.push('Consider adding unexpected or surprising elements');
    }

    // Analyze emotional impact
    const emotionalImpact = this.assessEmotionalImpact(output, domain);
    if (emotionalImpact > 0.6) {
      strengths.push('Creates emotional resonance');
    } else {
      suggestions.push('Consider adding elements that evoke stronger emotions');
    }

    // Analyze composition
    const composition = this.assessComposition(output, domain);
    if (composition > 0.6) {
      strengths.push('Well-balanced and organized composition');
    } else if (composition < 0.4) {
      weaknesses.push('Composition could be more balanced');
      suggestions.push('Consider the arrangement and spacing of elements');
    }

    // Analyze color harmony (for visual domains)
    const colorHarmony = this.assessColorHarmony(output, domain);
    if (colorHarmony > 0.6) {
      strengths.push('Effective use of color');
    } else if (colorHarmony < 0.4 && (domain === 'p5' || domain === 'glsl' || domain === 'three')) {
      suggestions.push('Explore color palettes and color combinations');
    }

    // Detect techniques used
    const techniques = this.detectTechniques(output, domain);
    techniqueVariety.push(...techniques);
    if (techniques.length >= 3) {
      strengths.push(`Uses diverse techniques: ${techniques.slice(0, 3).join(', ')}`);
    }

    // Calculate overall score
    const score = (
      visualAppeal * 0.25 +
      originality * 0.25 +
      emotionalImpact * 0.2 +
      composition * 0.15 +
      colorHarmony * 0.15
    );

    // Domain-specific feedback
    const domainFeedback = this.getDomainSpecificFeedback(output, domain);
    strengths.push(...domainFeedback.strengths);
    weaknesses.push(...domainFeedback.weaknesses);
    suggestions.push(...domainFeedback.suggestions);

    return {
      strengths,
      weaknesses,
      suggestions,
      score: Math.max(0, Math.min(1, score)),
      details: {
        visualAppeal,
        originality,
        emotionalImpact,
        composition,
        colorHarmony,
        techniqueVariety,
      },
    };
  }

  /**
   * Assess visual appeal
   */
  private static assessVisualAppeal(output: string, _domain: string): number {
    let score = 0.5;

    // Check for visual variety
    const visualKeywords = [
      'color', 'fill', 'stroke', 'background', 'blendMode',
      'gradient', 'texture', 'pattern', 'shape', 'form',
      'light', 'shadow', 'depth', 'perspective'
    ];

    const foundKeywords = visualKeywords.filter(kw =>
      output.toLowerCase().includes(kw.toLowerCase())
    );
    score += Math.min(0.3, foundKeywords.length * 0.05);

    // Check for complexity indicators
    if (/for\s*\(|while\s*\(/.test(output)) {
      score += 0.1; // Likely has multiple elements
    }

    // Check for animation/movement
    if (/frameCount|animation|animate/.test(output)) {
      score += 0.1;
    }

    // Domain-specific visual appeal
    if (_domain === 'ascii') {
      // ASCII art density and character variety
      const uniqueChars = new Set(output).size;
      score += Math.min(0.2, uniqueChars / 50);
    } else if (_domain === 'glsl') {
      // Shader effects
      if (/sin|cos|noise|fract/.test(output)) score += 0.1;
      if (/mix|smoothstep/.test(output)) score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Assess originality and creativity
   */
  private static assessOriginality(output: string, _domain: string, userPrompt: string): number {
    let score = 0.5;

    // Check for creative techniques
    const creativePatterns = [
      /noise\s*\(/,
      /random\s*\(/,
      /perlin/,
      /fractal/,
      /recursive/,
      /procedural/,
      /generative/,
      /algorithmic/,
    ];

    const foundPatterns = creativePatterns.filter(p => p.test(output));
    score += Math.min(0.3, foundPatterns.length * 0.1);

    // Check for unconventional approaches
    const unconventionalIndicators = [
      /Math\.(sin|cos|tan|exp|log)/,
      /blendMode\s*\(/,
      /filter\s*\(/,
      /shader/,
      /custom\s+/,
    ];

    if (unconventionalIndicators.some(p => p.test(output))) {
      score += 0.15;
    }

    // Bonus for not being a trivial implementation
    if (output.split('\n').length > 20) {
      score += 0.1;
    }

    // Check if output goes beyond basic prompt
    if (userPrompt) {
      const promptWords = userPrompt.toLowerCase().split(/\s+/);
      const outputLower = output.toLowerCase();
      const promptWordCount = promptWords.filter(w => w.length > 4).length;
      const matchedWords = promptWords.filter(w => outputLower.includes(w) && w.length > 4).length;
      if (promptWordCount > 0 && matchedWords / promptWordCount < 0.8) {
        score += 0.15; // Goes beyond literal interpretation
      }
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Assess emotional impact
   */
  private static assessEmotionalImpact(output: string, domain: string): number {
    let score = 0.5;

    // Emotional/aesthetic keywords
    const emotionalKeywords = [
      'mood', 'atmosphere', 'feeling', 'emotion',
      'dramatic', 'subtle', 'bold', 'gentle',
      'chaotic', 'peaceful', 'energetic', 'calm',
      'warm', 'cool', 'vibrant', 'muted'
    ];

    const foundKeywords = emotionalKeywords.filter(kw =>
      output.toLowerCase().includes(kw.toLowerCase())
    );
    score += Math.min(0.2, foundKeywords.length * 0.05);

    // Check for techniques that create emotional impact
    const impactTechniques = [
      /gradient/i,
      /transition/i,
      /fade/i,
      /pulse/i,
      /flow/i,
      /wave/i,
    ];

    if (impactTechniques.some(t => t.test(output))) {
      score += 0.15;
    }

    // Domain-specific emotional indicators
    if (domain === 'music') {
      if (/tempo|rhythm|melody|harmony/i.test(output)) score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Assess composition and balance
   */
  private static assessComposition(output: string, _domain: string): number {
    let score = 0.5;

    // Check for structure/organization
    const structureIndicators = [
      /function\s+\w+/,
      /class\s+\w+/,
      /{\s*\n/,
      /\n\s*}/,
    ];

    const foundIndicators = structureIndicators.filter(i => i.test(output));
    score += Math.min(0.2, foundIndicators.length * 0.05);

    // Check for balance-related keywords
    const balanceKeywords = [
      'center', 'align', 'balance', 'symmetry',
      'distribute', 'spacing', 'margin', 'padding'
    ];

    const foundBalanceKeywords = balanceKeywords.filter(kw =>
      output.toLowerCase().includes(kw.toLowerCase())
    );
    score += Math.min(0.15, foundBalanceKeywords.length * 0.05);

    // Check for intentional positioning
    if (/translate\s*\(|position|location/.test(output)) {
      score += 0.15;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Assess color harmony (for visual domains)
   */
  private static assessColorHarmony(output: string, domain: string): number {
    if (!['p5', 'glsl', 'three', 'ascii'].includes(domain)) {
      return 0.5; // Not applicable
    }

    let score = 0.3; // Base score

    // Check for color usage
    const colorFunctions = [
      'fill\\s*\\(', 'stroke\\s*\\(', 'background\\s*\\(',
      'color\\s*\\(', 'colorMode\\s*\\(',
      'lerpColor\\s*\\(', 'blendMode\\s*\\(',
      'vec3\\s*\\(', 'vec4\\s*\\(', // GLSL color vectors
    ];

    const foundColors = colorFunctions.filter(f =>
      new RegExp(f).test(output)
    );
    score += Math.min(0.4, foundColors.length * 0.1);

    // Check for color palettes or schemes
    if (/palette|scheme|harmony/i.test(output)) {
      score += 0.15;
    }

    // Check for HSB/HSB color mode (often more harmonious)
    if (/colorMode\s*\(\s*HSB/i.test(output)) {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Detect techniques used in the output
   */
  private static detectTechniques(output: string, domain: string): string[] {
    const techniques: string[] = [];

    const techniquePatterns: Record<string, Array<[RegExp, string]>> = {
      p5: [
        [/noise\s*\(/, 'Perlin noise'],
        [/random\s*\(/, 'Randomness'],
        [/for\s*\(/, 'Iteration/loops'],
        [/translate\s*\(|rotate\s*\(|scale\s*\(/, 'Transformations'],
        [/push\s*\(\)|pop\s*\(\)/, 'State management'],
        [/class\s+/, 'Object-oriented design'],
        [/array|\[/, 'Data structures'],
      ],
      glsl: [
        [/sin\s*\(|cos\s*\(/, 'Trigonometry'],
        [/noise\s*\(/, 'Noise functions'],
        [/for\s*\(/, 'Loops/iteration'],
        [/mix\s*\(/, 'Color/value interpolation'],
        [/smoothstep\s*\(/, 'Smooth transitions'],
        [/ray\s*march|sdf/i, 'Ray marching/SDF'],
      ],
      three: [
        [/geometry/i, '3D geometry'],
        [/material/i, 'Materials/textures'],
        [/light/i, 'Lighting'],
        [/camera/i, 'Camera work'],
        [/animation|animate/i, 'Animation'],
      ],
      ascii: [
        [/[/\\|()\-=+*<>@#%]/, 'Character variety'],
        [/\n{3,}/, 'Multi-line structure'],
      ],
      music: [
        [/tempo|bpm/i, 'Rhythm/tempo'],
        [/chord|harmony/i, 'Harmony'],
        [/melody/i, 'Melody'],
      ],
    };

    const domainTechniques = techniquePatterns[domain as keyof typeof techniquePatterns] || techniquePatterns.p5;

    for (const [pattern, name] of domainTechniques) {
      if (pattern.test(output)) {
        techniques.push(name);
      }
    }

    return techniques;
  }

  /**
   * Get domain-specific feedback
   */
  private static getDomainSpecificFeedback(output: string, domain: string): {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  } {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];

    if (domain === 'p5') {
      if (/\bmouse(X|Y|IsPressed)\b/.test(output)) {
        strengths.push('Interactive elements engage the user');
      }
      if (/saveCanvas|save\s*\(/.test(output)) {
        strengths.push('Includes export functionality');
      }
      if (!/background\s*\(/.test(output)) {
        suggestions.push('Consider adding background for clearer visuals');
      }
    } else if (domain === 'glsl') {
      if (/uniform\s+float\s+u_time/.test(output)) {
        strengths.push('Time-based animation enables dynamic visuals');
      }
      if (!/precision\s+/.test(output)) {
        suggestions.push('Consider specifying precision for compatibility');
      }
    } else if (domain === 'three') {
      if (/Light/i.test(output)) {
        strengths.push('Uses lighting for depth and realism');
      }
      if (!/renderer\.render/.test(output) && !/render\s*\(/.test(output)) {
        weaknesses.push('May be missing render loop');
      }
    }

    return { strengths, weaknesses, suggestions };
  }
}
