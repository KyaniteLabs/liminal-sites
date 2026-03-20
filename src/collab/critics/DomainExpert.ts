/**
 * DomainExpert - Provides domain-specific feedback
 *
 * Specialized critics for different creative domains:
 * - p5.js patterns and conventions
 * - GLSL shader best practices
 * - Three.js scene structure
 * - Music theory and composition
 * - ASCII art techniques
 */

export interface DomainCritique {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
  details: {
    followsConventions: boolean;
    domainSpecificScore: number;
    professionalStandards: string[];
    improvements: string[];
  };
}

/**
 * Domain expert for specialized feedback
 */
export class DomainExpert {
  /**
   * Evaluate output from a domain-specific perspective
   *
   * @param output - The creative output (code, description, etc.)
   * @param domain - The creative domain (p5, glsl, three, ascii, music, code)
   * @param userPrompt - Original user prompt for context
   * @returns Domain critique with specialized feedback
   */
  static evaluate(output: string, domain: string, userPrompt: string = ''): DomainCritique {
    const domainLower = domain.toLowerCase();

    switch (domainLower) {
      case 'p5':
      case 'p5.js':
        return this.evaluateP5(output, userPrompt);
      case 'glsl':
      case 'shader':
        return this.evaluateGLSL(output, userPrompt);
      case 'three':
      case 'three.js':
      case 'threejs':
        return this.evaluateThree(output, userPrompt);
      case 'ascii':
        return this.evaluateASCII(output, userPrompt);
      case 'music':
      case 'audio':
      case 'sound':
        return this.evaluateMusic(output, userPrompt);
      case 'code':
      default:
        return this.evaluateCode(output, userPrompt);
    }
  }

  /**
   * Evaluate p5.js sketches
   */
  private static evaluateP5(output: string, _userPrompt: string): DomainCritique {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    const professionalStandards: string[] = [];
    const improvements: string[] = [];

    // Check for proper p5.js structure
    const hasSetup = /function\s+setup\s*\(|const\s+setup\s*=/.test(output);
    const hasDraw = /function\s+draw\s*\(|const\s+draw\s*=/.test(output);

    if (hasSetup && hasDraw) {
      strengths.push('Follows p5.js setup/draw structure');
    } else {
      if (!hasSetup) weaknesses.push('Missing setup() function');
      if (!hasDraw) weaknesses.push('Missing draw() function');
    }

    // Check for canvas creation
    if (/createCanvas\s*\(/.test(output)) {
      strengths.push('Properly initializes canvas');
    } else {
      suggestions.push('Add createCanvas() in setup()');
      improvements.push('Initialize canvas with createCanvas(width, height)');
    }

    // Check for p5.js patterns
    const patterns: [RegExp, string, string][] = [
      [/push\s*\(\)|pop\s*\(\)/, 'Uses push/pop for state isolation', 'Good practice for transformations'],
      [/translate\s*\(|rotate\s*\(|scale\s*\(/, 'Uses coordinate transformations', 'Essential for advanced graphics'],
      [/fill\s*\(|stroke\s*\(/, 'Applies colors and strokes', 'Important for visual design'],
      [/rect\s*\(|ellipse\s*\(|line\s*\(/, 'Uses basic shapes', 'Fundamental p5.js primitives'],
      [/vertex\s*\(|beginShape\s*\(|endShape\s*\(/, 'Creates custom shapes', 'Advanced shape building'],
      [/noise\s*\(/, 'Uses Perlin noise', 'Great for organic effects'],
      [/map\s*\(/, 'Uses map() for value scaling', 'Essential utility function'],
    ];

    for (const [pattern, strengthMsg, standardMsg] of patterns) {
      if (pattern.test(output)) {
        strengths.push(strengthMsg);
        professionalStandards.push(standardMsg);
      }
    }

    // Check for common p5.js issues
    if (/function\s+setup\s*\([^)]*\)\s*{[^}]*}\s*function\s+draw/.test(output)) {
      suggestions.push('Ensure setup() has proper closing brace');
    }

    // Check for interactive elements
    if (/\bmouse(X|Y|IsPressed|Button)\b/.test(output)) {
      strengths.push('Incorporates mouse interaction');
    }
    if (/\bkey(IsPressed|Code|Pressed)\b/.test(output)) {
      strengths.push('Incorporates keyboard interaction');
    }

    // Check for animation
    if (/\bframeCount\b/.test(output)) {
      strengths.push('Uses frameCount for animation');
    }
    if (/\bframeRate\s*\(/.test(output)) {
      strengths.push('Controls frame rate');
    }

    // Check for instantiation mode
    if (/(instance\s+mode|p5\.|new\s+p5)/.test(output)) {
      professionalStandards.push('Uses instantiation mode (good for embedding)');
    }

    // Check for global mode issues
    if (hasSetup && !/function\s+setup\s*\(\s*\)/.test(output)) {
      suggestions.push('Setup function should have no parameters in global mode');
    }

    // Calculate score
    let score = 0.4; // Base score
    if (hasSetup && hasDraw) score += 0.2;
    if (/createCanvas\s*\(/.test(output)) score += 0.1;
    score += Math.min(0.2, strengths.length * 0.03);
    score -= Math.min(0.2, weaknesses.length * 0.05);

    return {
      strengths,
      weaknesses,
      suggestions,
      score: Math.max(0, Math.min(1, score)),
      details: {
        followsConventions: hasSetup && hasDraw,
        domainSpecificScore: Math.min(1, strengths.length * 0.15),
        professionalStandards,
        improvements,
      },
    };
  }

  /**
   * Evaluate GLSL shaders
   */
  private static evaluateGLSL(output: string, _userPrompt: string): DomainCritique {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    const professionalStandards: string[] = [];
    const improvements: string[] = [];

    // Check for shader structure
    const hasMain = /void\s+main\s*\(/.test(output);
    const hasOutput = /gl_FragColor|out\s+vec4\s+fragColor|out\s+vec4\s+fragColor/.test(output);

    if (hasMain) {
      strengths.push('Has main() function');
    } else {
      weaknesses.push('Missing main() function');
    }

    if (hasOutput) {
      strengths.push('Properly outputs fragment color');
    } else {
      suggestions.push('Add gl_FragColor or out vec4 output');
    }

    // Check for precision qualifier
    if (/precision\s+(highp|mediump|lowp)\s+float/.test(output)) {
      strengths.push('Specifies precision qualifier');
      professionalStandards.push('Precision qualifiers are important for compatibility');
    }

    // Check for common uniforms
    const uniformPatterns: [RegExp, string][] = [
      [/uniform\s+vec2\s+u_resolution/, 'Resolution uniform for responsive shaders'],
      [/uniform\s+float\s+u_time/, 'Time uniform for animation'],
      [/uniform\s+vec2\s+u_mouse/, 'Mouse uniform for interaction'],
    ];

    for (const [pattern, msg] of uniformPatterns) {
      if (pattern.test(output)) {
        strengths.push(msg);
      }
    }

    // Check for shader techniques
    const techniques: [RegExp, string][] = [
      [/sin\s*\(|cos\s*\(|tan\s*\(/, 'Trigonometric functions'],
      [/noise\s*\(|random\s*\(/, 'Noise/randomness'],
      [/mix\s*\(/, 'Color/value interpolation'],
      [/smoothstep\s*\(/, 'Smooth transitions'],
      [/fract\s*\(/, 'Fractional part for patterns'],
      [/length\s*\(|distance\s*\(/, 'Distance calculations'],
      [/normalize\s*\(/, 'Vector normalization'],
    ];

    for (const [pattern, msg] of techniques) {
      if (pattern.test(output)) {
        strengths.push(`Uses ${msg}`);
      }
    }

    // Check for ray marching
    if (/ray\s*march|sdf|sdSphere|sdBox|sdPlane/i.test(output)) {
      strengths.push('Uses ray marching/SDF techniques');
      professionalStandards.push('Advanced shader technique');
    }

    // Check for coordinate normalization
    if (/gl_FragCoord\.xy|u_resolution/.test(output)) {
      strengths.push('Normalizes coordinates');
    }

    // Check for aspect ratio handling
    if (/aspect|u_resolution\.x\s*\/\s*u_resolution\.y/i.test(output)) {
      strengths.push('Handles aspect ratio correctly');
    }

    // Calculate score
    let score = 0.3; // Base score
    if (hasMain) score += 0.2;
    if (hasOutput) score += 0.15;
    if (/precision\s+/.test(output)) score += 0.1;
    score += Math.min(0.15, strengths.filter(s => s.includes('uniform')).length * 0.05);
    score += Math.min(0.1, strengths.filter(s => s.includes('techniques') || s.includes('ray')).length * 0.05);

    return {
      strengths,
      weaknesses,
      suggestions,
      score: Math.max(0, Math.min(1, score)),
      details: {
        followsConventions: hasMain && hasOutput,
        domainSpecificScore: Math.min(1, strengths.length * 0.1),
        professionalStandards,
        improvements,
      },
    };
  }

  /**
   * Evaluate Three.js code
   */
  private static evaluateThree(output: string, _userPrompt: string): DomainCritique {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    const professionalStandards: string[] = [];
    const improvements: string[] = [];

    // Check for Three.js basics
    const hasScene = /Scene\s*\(|new\s+THREE\.Scene/.test(output);
    const hasCamera = /Camera\s*\(|new\s+THREE\.(Perspective|Orthographic)Camera/.test(output);
    const hasRenderer = /WebGLRenderer\s*\(|new\s+THREE\.WebGLRenderer/.test(output);

    if (hasScene) strengths.push('Creates a scene');
    else weaknesses.push('Missing scene creation');

    if (hasCamera) strengths.push('Sets up a camera');
    else suggestions.push('Add camera for viewing');

    if (hasRenderer) strengths.push('Initializes WebGL renderer');
    else suggestions.push('Add renderer to display scene');

    // Check for scene graph elements
    if (/Mesh\s*\(|new\s+THREE\.Mesh/.test(output)) {
      strengths.push('Creates meshes for 3D objects');
    }

    if (/Geometry\s*\(|new\s+THREE\.\w*Geometry/.test(output)) {
      strengths.push('Uses geometry for object shapes');
    }

    if (/Material\s*\(|new\s+THREE\.\w*Material/.test(output)) {
      strengths.push('Applies materials to objects');
    }

    // Check for lighting
    const lightPatterns = [
      /AmbientLight/,
      /DirectionalLight/,
      /PointLight/,
      /SpotLight/,
      /HemisphereLight/,
    ];

    for (const pattern of lightPatterns) {
      if (pattern.test(output)) {
        strengths.push(`Uses ${pattern.source.replace(/\\/g, '')} for lighting`);
        break;
      }
    }

    if (!lightPatterns.some(p => p.test(output))) {
      suggestions.push('Consider adding lighting for better visuals');
    }

    // Check for animation loop
    if (/requestAnimationFrame/.test(output)) {
      strengths.push('Uses proper animation loop');
      professionalStandards.push('requestAnimationFrame is standard for Three.js animations');
    }

    // Check for render call
    if (/renderer\.render\s*\(|\.render\s*\(/.test(output)) {
      strengths.push('Renders the scene');
    }

    // Check for responsiveness
    if (/resize|window\.resize/.test(output)) {
      strengths.push('Handles window resizing');
    }

    // Calculate score
    let score = 0.3; // Base score
    if (hasScene) score += 0.15;
    if (hasCamera) score += 0.15;
    if (hasRenderer) score += 0.15;
    score += Math.min(0.15, strengths.filter(s => s.includes('lighting') || s.includes('Light')).length * 0.1);
    score += Math.min(0.1, strengths.filter(s => s.includes('animation')).length * 0.1);

    return {
      strengths,
      weaknesses,
      suggestions,
      score: Math.max(0, Math.min(1, score)),
      details: {
        followsConventions: hasScene && hasCamera && hasRenderer,
        domainSpecificScore: Math.min(1, strengths.length * 0.1),
        professionalStandards,
        improvements,
      },
    };
  }

  /**
   * Evaluate ASCII art
   */
  private static evaluateASCII(output: string, _userPrompt: string): DomainCritique {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    const professionalStandards: string[] = [];
    const improvements: string[] = [];

    // Check for ASCII characteristics
    const lines = output.split('\n').filter(l => l.trim().length > 0);
    if (lines.length >= 3) {
      strengths.push('Multi-line structure for visual depth');
    }

    // Character variety
    const uniqueChars = new Set(output).size;
    if (uniqueChars >= 10) {
      strengths.push('Good character variety for texture');
    } else {
      suggestions.push('Use more diverse characters for detail');
    }

    // Check for ASCII art characters
    const asciiChars = /[/\\|()\-=+*<>@#%$&]/;
    const asciiCount = (output.match(asciiChars) || []).length;
    if (asciiCount >= 10) {
      strengths.push('Uses ASCII art characters effectively');
    }

    // Check for alignment/structure
    if (/^[\s]*[/\\|]/.test(output)) {
      strengths.push('Shows intentional alignment');
    }

    // Check for recognizable patterns
    if (/[0-9a-zA-Z]{3,}/.test(output)) {
      strengths.push('Includes text or recognizable elements');
    }

    // Calculate score
    let score = 0.3; // Base score
    score += Math.min(0.2, lines.length / 20);
    score += Math.min(0.2, uniqueChars / 30);
    score += Math.min(0.2, asciiCount / 50);
    score += Math.min(0.1, strengths.length * 0.05);

    return {
      strengths,
      weaknesses,
      suggestions,
      score: Math.max(0, Math.min(1, score)),
      details: {
        followsConventions: lines.length >= 3 && uniqueChars >= 5,
        domainSpecificScore: Math.min(1, (lines.length + uniqueChars) / 50),
        professionalStandards,
        improvements,
      },
    };
  }

  /**
   * Evaluate music/audio
   */
  private static evaluateMusic(output: string, _userPrompt: string): DomainCritique {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    const professionalStandards: string[] = [];
    const improvements: string[] = [];

    // Check for music notation (ABC notation)
    const abcHeaders = [/X:/, /T:/, /M:/, /K:/, /L:/, /Q:/];
    const foundHeaders = abcHeaders.filter(h => h.test(output)).length;

    if (foundHeaders >= 3) {
      strengths.push('Uses ABC notation format');
      professionalStandards.push('ABC notation is a standard for folk/traditional music');
    }

    // Check for musical elements
    if (/[A-Ga-g][:#]?\d?\//.test(output)) {
      strengths.push('Includes musical notes');
    }

    if (/\|\||:\|:\|/.test(output)) {
      strengths.push('Uses repeat markers');
    }

    if (/[/\\]/.test(output)) {
      strengths.push('Includes rhythm indicators');
    }

    // Check for common time signatures
    if (/M:\s*\d\/\d/.test(output)) {
      strengths.push('Specifies time signature');
    }

    // Check for key
    if (/K:\s*[A-G][#b]?m?/.test(output)) {
      strengths.push('Specifies musical key');
    }

    // Check for tempo
    if (/Q:\s*\d+/.test(output)) {
      strengths.push('Specifies tempo');
    }

    // Calculate score
    let score = 0.3; // Base score
    score += Math.min(0.3, foundHeaders * 0.06);
    score += Math.min(0.2, (output.match(/[A-Ga-g]/g) || []).length / 100);
    score += Math.min(0.2, strengths.length * 0.05);

    return {
      strengths,
      weaknesses,
      suggestions,
      score: Math.max(0, Math.min(1, score)),
      details: {
        followsConventions: foundHeaders >= 3,
        domainSpecificScore: Math.min(1, strengths.length * 0.15),
        professionalStandards,
        improvements,
      },
    };
  }

  /**
   * Evaluate general code
   */
  private static evaluateCode(output: string, _userPrompt: string): DomainCritique {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    const professionalStandards: string[] = [];
    const improvements: string[] = [];

    // Check for code structure
    if (/function\s+\w+|const\s+\w+\s*=|class\s+\w+/.test(output)) {
      strengths.push('Defines functions or classes');
    }

    if (/import\s+|require\s*\(/.test(output)) {
      strengths.push('Imports modules or dependencies');
    }

    if (/export\s+/.test(output)) {
      strengths.push('Exports for module usage');
    }

    // Check for error handling
    if (/try\s*{|catch\s*\(/.test(output)) {
      strengths.push('Includes error handling');
      professionalStandards.push('Error handling is a best practice');
    } else {
      suggestions.push('Consider adding error handling');
    }

    // Check for comments
    if (/\/\*[\s\S]*?\*\/|\/\//.test(output)) {
      strengths.push('Includes comments for documentation');
    }

    // Calculate score
    let score = 0.4; // Base score
    score += Math.min(0.2, strengths.length * 0.05);
    score += Math.min(0.1, (output.match(/function|const|let|var/g) || []).length / 50);

    return {
      strengths,
      weaknesses,
      suggestions,
      score: Math.max(0, Math.min(1, score)),
      details: {
        followsConventions: true,
        domainSpecificScore: Math.min(1, strengths.length * 0.15),
        professionalStandards,
        improvements,
      },
    };
  }
}
