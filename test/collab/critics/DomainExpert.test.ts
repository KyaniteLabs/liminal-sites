/**
 * DomainExpert tests
 */

import { DomainExpert } from '../../../src/collab/critics/DomainExpert.js';

describe('DomainExpert', () => {
  describe('evaluate', () => {
    it('should route to p5 evaluator for p5 domain', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  ellipse(200, 200, 50);
}`;

      const result = DomainExpert.evaluate(code, 'p5');

      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('should route to glsl evaluator for glsl domain', () => {
      const code = `precision highp float;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / 500.0;
  gl_FragColor = vec4(uv, 0.0, 1.0);
}`;

      const result = DomainExpert.evaluate(code, 'glsl');

      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('should route to three evaluator for three domain', () => {
      const code = `import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.render(scene, camera);`;

      const result = DomainExpert.evaluate(code, 'three');

      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('should route to ascii evaluator for ascii domain', () => {
      const ascii = `
   /\\___/\\
  ( o   o )
   (  ^  )
    (___)
`;

      const result = DomainExpert.evaluate(ascii, 'ascii');

      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('should route to music evaluator for music domain', () => {
      const music = `X:1
T:Test Tune
M:4/4
K:C
C D E F | G2 G2 |`;

      const result = DomainExpert.evaluate(music, 'music');

      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('should route to code evaluator for code domain', () => {
      const code = `function calculate(x) {
  return x * 2;
}`;

      const result = DomainExpert.evaluate(code, 'code');

      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });
  });

  describe('p5 evaluation', () => {
    it('should check for proper p5.js structure', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}`;

      const result = DomainExpert.evaluate(code, 'p5');

      expect(result.details.followsConventions).toBe(true);
    });

    it('should detect missing setup function', () => {
      const code = `function draw() {
  background(220);
}`;

      const result = DomainExpert.evaluate(code, 'p5');

      expect(result.weaknesses.some(w => w.includes('setup'))).toBe(true);
    });

    it('should detect missing draw function', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}`;

      const result = DomainExpert.evaluate(code, 'p5');

      expect(result.weaknesses.some(w => w.includes('draw'))).toBe(true);
    });

    it('should recognize canvas creation', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}`;

      const result = DomainExpert.evaluate(code, 'p5');

      expect(result.strengths.some(s => s.includes('canvas'))).toBe(true);
    });

    it('should recognize p5.js patterns', () => {
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

      const result = DomainExpert.evaluate(code, 'p5');

      expect(result.strengths.length).toBeGreaterThan(2);
    });

    it('should recognize interactive elements', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  if (mouseIsPressed) {
    fill(255, 0, 0);
  }
  ellipse(mouseX, mouseY, 50);
}`;

      const result = DomainExpert.evaluate(code, 'p5');

      expect(result.strengths.some(s => s.includes('mouse'))).toBe(true);
    });

    it('should recognize animation', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  ellipse(frameCount % width, 200, 50);
}`;

      const result = DomainExpert.evaluate(code, 'p5');

      expect(result.strengths.some(s => s.includes('frameCount'))).toBe(true);
    });
  });

  describe('GLSL evaluation', () => {
    it('should check for main function', () => {
      const code = `precision highp float;
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

      const result = DomainExpert.evaluate(code, 'glsl');

      expect(result.details.followsConventions).toBe(true);
    });

    it('should detect missing main function', () => {
      const code = `precision highp float;
uniform float u_time;`;

      const result = DomainExpert.evaluate(code, 'glsl');

      expect(result.weaknesses.some(w => w.includes('main'))).toBe(true);
    });

    it('should recognize precision qualifiers', () => {
      const code = `precision highp float;
uniform float u_time;

void main() {
  gl_FragColor = vec4(1.0);
}`;

      const result = DomainExpert.evaluate(code, 'glsl');

      expect(result.strengths.some(s => s.includes('precision'))).toBe(true);
    });

    it('should recognize common uniforms', () => {
      const code = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  gl_FragColor = vec4(uv, u_time, 1.0);
}`;

      const result = DomainExpert.evaluate(code, 'glsl');

      expect(result.strengths.some(s => s.includes('uniform'))).toBe(true);
    });

    it('should recognize shader techniques', () => {
      const code = `precision highp float;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / 500.0;
  float d = sin(u_time) * 0.5 + 0.5;
  vec3 col = mix(vec3(0.0), vec3(1.0), smoothstep(0.4, 0.6, d));
  gl_FragColor = vec4(col, 1.0);
}`;

      const result = DomainExpert.evaluate(code, 'glsl');

      expect(result.strengths.length).toBeGreaterThan(2);
    });
  });

  describe('Three.js evaluation', () => {
    it('should check for basic Three.js setup', () => {
      const code = `import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.render(scene, camera);`;

      const result = DomainExpert.evaluate(code, 'three');

      expect(result.details.followsConventions).toBe(true);
    });

    it('should detect missing scene', () => {
      const code = `import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();`;

      const result = DomainExpert.evaluate(code, 'three');

      expect(result.weaknesses.some(w => w.includes('scene'))).toBe(true);
    });

    it('should recognize lighting', () => {
      const code = `import * as THREE from 'three';

const scene = new THREE.Scene();
const light = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light);`;

      const result = DomainExpert.evaluate(code, 'three');

      expect(result.strengths.some(s => s.includes('lighting') || s.includes('Light'))).toBe(true);
    });

    it('should recognize animation loop', () => {
      const code = `import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();`;

      const result = DomainExpert.evaluate(code, 'three');

      expect(result.strengths.some(s => s.includes('animation'))).toBe(true);
    });
  });

  describe('ASCII art evaluation', () => {
    it('should evaluate ASCII art structure', () => {
      const ascii = `
   /\\___/\\
  ( o   o )
   (  ^  )
    (___)
`;

      const result = DomainExpert.evaluate(ascii, 'ascii');

      expect(result.details.followsConventions).toBe(true);
    });

    it('should recognize character variety', () => {
      const ascii = `
   ^.^
  (o_o)
   /|\\
`;

      const result = DomainExpert.evaluate(ascii, 'ascii');

      expect(result.strengths.length).toBeGreaterThan(0);
    });
  });

  describe('Music evaluation', () => {
    it('should recognize ABC notation', () => {
      const music = `X:1
T:Test
M:4/4
K:C
C D E F | G2 |`;

      const result = DomainExpert.evaluate(music, 'music');

      expect(result.details.followsConventions).toBe(true);
    });

    it('should recognize musical elements', () => {
      const music = `X:1
T:Test
M:4/4
L:1/8
K:C
C D E F | G A B c |`;

      const result = DomainExpert.evaluate(music, 'music');

      expect(result.strengths.length).toBeGreaterThan(0);
    });
  });

  describe('Code evaluation', () => {
    it('should evaluate general code', () => {
      const code = `function process(data) {
  try {
    return data.map(x => x * 2);
  } catch (error) {
    console.error(error);
    return [];
  }
}`;

      const result = DomainExpert.evaluate(code, 'code');

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.strengths.some(s => s.includes('error handling'))).toBe(true);
    });

    it('should recognize function definitions', () => {
      const code = `function calculate(x) {
  return x * x;
}`;

      const result = DomainExpert.evaluate(code, 'code');

      expect(result.strengths.some(s => s.includes('function'))).toBe(true);
    });

    it('should recognize imports', () => {
      const code = `import { Something } from './module.js';

function process() {
  const value = new Something();
  return value;
}

export { process };`;

      const result = DomainExpert.evaluate(code, 'code');

      // Check that the code gets a decent score for having imports and exports
      expect(result.score).toBeGreaterThan(0.4);
    });
  });

  describe('professional standards', () => {
    it('should include professional standards in feedback', () => {
      const code = `function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
}

function draw() {
  push();
  translate(width/2, height/2);
  rotate(frameCount * 0.01);
  ellipse(0, 0, 50);
  pop();
}`;

      const result = DomainExpert.evaluate(code, 'p5');

      expect(result.details.professionalStandards).toBeInstanceOf(Array);
    });
  });
});
