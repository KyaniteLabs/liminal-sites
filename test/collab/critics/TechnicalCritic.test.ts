/**
 * TechnicalCritic tests
 */

import { TechnicalCritic } from '../../../src/collab/critics/TechnicalCritic.js';

describe('TechnicalCritic', () => {
  describe('evaluate', () => {
    it('should evaluate basic p5.js code', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  ellipse(200, 200, 50);
}`;

      const result = TechnicalCritic.evaluate(code, 'p5');

      expect(result).toBeDefined();
      expect(result.strengths).toBeInstanceOf(Array);
      expect(result.weaknesses).toBeInstanceOf(Array);
      expect(result.suggestions).toBeInstanceOf(Array);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
      expect(result.details).toBeDefined();
    });

    it('should detect proper setup/draw structure', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}`;

      const result = TechnicalCritic.evaluate(code, 'p5');

      expect(result.details.syntaxCorrect).toBe(true);
      expect(result.details.hasStructure).toBe(true);
    });

    it('should detect missing setup function', () => {
      const code = `function draw() {
  background(220);
}`;

      const result = TechnicalCritic.evaluate(code, 'p5');

      expect(result.weaknesses.some(w => w.includes('setup'))).toBe(true);
      expect(result.details.hasStructure).toBe(false);
    });

    it('should detect missing draw function', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}`;

      const result = TechnicalCritic.evaluate(code, 'p5');

      expect(result.weaknesses.some(w => w.includes('draw'))).toBe(true);
      expect(result.details.hasStructure).toBe(false);
    });

    it('should detect syntax errors', () => {
      const code = `function setup() {
  createCanvas(400, 400;
}`;

      const result = TechnicalCritic.evaluate(code, 'p5');

      expect(result.details.syntaxCorrect).toBe(false);
    });

    it('should identify object-oriented patterns', () => {
      const code = `class Particle {
  constructor() {
    this.x = random(width);
  }
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}`;

      const result = TechnicalCritic.evaluate(code, 'p5');

      expect(result.strengths.some(s => s.includes('object-oriented'))).toBe(true);
    });

    it('should identify comments', () => {
      const code = `// Set up the canvas
function setup() {
  createCanvas(400, 400); // Create 400x400 canvas
}

function draw() {
  background(220);
}`;

      const result = TechnicalCritic.evaluate(code, 'p5');

      expect(result.strengths.some(s => s.includes('comments'))).toBe(true);
    });

    it('should identify reusable functions', () => {
      const code = `function drawCircle(x, y) {
  ellipse(x, y, 50);
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  drawCircle(200, 200);
}`;

      const result = TechnicalCritic.evaluate(code, 'p5');

      expect(result.strengths.some(s => s.includes('reusable'))).toBe(true);
    });

    it('should detect performance issues', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  // Creating objects in draw loop
  let img = loadImage('test.png');
  background(220);
}`;

      const result = TechnicalCritic.evaluate(code, 'p5');

      expect(result.details.performanceIssues.length).toBeGreaterThan(0);
    });

    it('should detect best practice violations', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  eval('some code');
  var x = 10;
}`;

      const result = TechnicalCritic.evaluate(code, 'p5');

      expect(result.details.bestPracticeViolations.length).toBeGreaterThan(0);
    });

    it('should evaluate GLSL code', () => {
      const code = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 col = vec3(uv, 0.0);
  gl_FragColor = vec4(col, 1.0);
}`;

      const result = TechnicalCritic.evaluate(code, 'glsl');

      expect(result.details.syntaxCorrect).toBe(true);
      expect(result.details.hasStructure).toBe(true);
    });

    it('should evaluate Three.js code', () => {
      const code = `import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();`;

      const result = TechnicalCritic.evaluate(code, 'three');

      expect(result.details.syntaxCorrect).toBe(true);
    });

    it('should calculate maintainability score', () => {
      const code = `// This is a well-commented function
// It does something useful
function setup() {
  // Create canvas with specific size
  createCanvas(400, 400);
}

function draw() {
  // Clear background
  background(220);
}`;

      const result = TechnicalCritic.evaluate(code, 'p5');

      expect(result.details.maintainabilityScore).toBeGreaterThanOrEqual(0);
      expect(result.details.maintainabilityScore).toBeLessThanOrEqual(1);
    });

    it('should provide domain-specific feedback for p5', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  push();
  translate(200, 200);
  rotate(frameCount * 0.01);
  fill(255, 0, 0);
  ellipse(0, 0, 50);
  pop();
}`;

      const result = TechnicalCritic.evaluate(code, 'p5');

      expect(result.strengths.length).toBeGreaterThan(0);
    });

    it('should provide domain-specific feedback for GLSL', () => {
      const code = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float d = sin(u_time) * 0.5 + 0.5;
  vec3 col = vec3(d);
  gl_FragColor = vec4(col, 1.0);
}`;

      const result = TechnicalCritic.evaluate(code, 'glsl');

      expect(result.strengths.length).toBeGreaterThan(0);
    });

    it('should provide domain-specific feedback for Three.js', () => {
      const code = `import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const light = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();`;

      const result = TechnicalCritic.evaluate(code, 'three');

      expect(result.strengths.length).toBeGreaterThan(0);
    });
  });
});
