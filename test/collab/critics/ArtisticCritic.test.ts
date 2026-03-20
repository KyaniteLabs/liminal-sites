/**
 * ArtisticCritic tests
 */

import { ArtisticCritic } from '../../../src/collab/critics/ArtisticCritic.js';

describe('ArtisticCritic', () => {
  describe('evaluate', () => {
    it('should evaluate basic p5.js code', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  ellipse(200, 200, 50);
}`;

      const result = ArtisticCritic.evaluate(code, 'p5');

      expect(result).toBeDefined();
      expect(result.strengths).toBeInstanceOf(Array);
      expect(result.weaknesses).toBeInstanceOf(Array);
      expect(result.suggestions).toBeInstanceOf(Array);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
      expect(result.details).toBeDefined();
    });

    it('should assess visual appeal', () => {
      const code = `function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
}

function draw() {
  background(frameCount % 360, 50, 50);
  fill(255, 100, 100);
  ellipse(200, 200, 50);
}`;

      const result = ArtisticCritic.evaluate(code, 'p5');

      expect(result.details.visualAppeal).toBeGreaterThanOrEqual(0);
      expect(result.details.visualAppeal).toBeLessThanOrEqual(1);
    });

    it('should assess originality', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  for (let i = 0; i < 100; i++) {
    let x = noise(i * 0.1) * width;
    let y = noise(i * 0.1 + 100) * height;
    ellipse(x, y, 10);
  }
}`;

      const result = ArtisticCritic.evaluate(code, 'p5');

      expect(result.details.originality).toBeGreaterThanOrEqual(0);
      expect(result.details.originality).toBeLessThanOrEqual(1);
    });

    it('should assess emotional impact', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(20);
  for (let i = 0; i < 50; i++) {
    let alpha = map(sin(frameCount * 0.02 + i * 0.1), -1, 1, 0, 255);
    stroke(255, alpha);
    line(0, i * 8, width, i * 8);
  }
}`;

      const result = ArtisticCritic.evaluate(code, 'p5');

      expect(result.details.emotionalImpact).toBeGreaterThanOrEqual(0);
      expect(result.details.emotionalImpact).toBeLessThanOrEqual(1);
    });

    it('should assess composition', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  translate(width/2, height/2);
  for (let i = 0; i < 10; i++) {
    rotate(TWO_PI / 10);
    ellipse(50, 0, 30, 30);
  }
}`;

      const result = ArtisticCritic.evaluate(code, 'p5');

      expect(result.details.composition).toBeGreaterThanOrEqual(0);
      expect(result.details.composition).toBeLessThanOrEqual(1);
    });

    it('should assess color harmony', () => {
      const code = `function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  background(220, 30, 20);
  for (let i = 0; i < 10; i++) {
    fill((frameCount + i * 36) % 360, 70, 80);
    ellipse(i * 40 + 20, 200, 30);
  }
}`;

      const result = ArtisticCritic.evaluate(code, 'p5');

      expect(result.details.colorHarmony).toBeGreaterThanOrEqual(0);
      expect(result.details.colorHarmony).toBeLessThanOrEqual(1);
    });

    it('should detect techniques used', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  push();
  translate(width/2, height/2);
  rotate(frameCount * 0.01);
  scale(sin(frameCount * 0.02) * 2);
  fill(255);
  ellipse(0, 0, 50);
  pop();
}`;

      const result = ArtisticCritic.evaluate(code, 'p5');

      expect(result.details.techniqueVariety).toBeInstanceOf(Array);
      expect(result.details.techniqueVariety.length).toBeGreaterThan(0);
    });

    it('should evaluate GLSL shaders', () => {
      const code = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0, 2, 4));
  gl_FragColor = vec4(col, 1.0);
}`;

      const result = ArtisticCritic.evaluate(code, 'glsl');

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('should evaluate Three.js code', () => {
      const code = `import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

const light = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  renderer.render(scene, camera);
}

animate();`;

      const result = ArtisticCritic.evaluate(code, 'three');

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('should evaluate ASCII art', () => {
      const ascii = `
    /\\___/\\
   ( o . o )
   (  ^  0 )
    (___)
`;

      const result = ArtisticCritic.evaluate(ascii, 'ascii');

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('should evaluate music/ABC notation', () => {
      const music = `X:1
T:Demo
M:4/4
K:C
C D E F | G A B c |`;

      const result = ArtisticCritic.evaluate(music, 'music');

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('should provide domain-specific feedback for p5', () => {
      const code = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  if (mouseIsPressed) {
    fill(255, 0, 0);
  } else {
    fill(0, 0, 255);
  }
  ellipse(mouseX, mouseY, 50);
}`;

      const result = ArtisticCritic.evaluate(code, 'p5');

      // Check for either "Interactive elements" or any strength mentioning mouse/interaction
      const hasInteractiveFeedback = result.strengths.some(s =>
        s.toLowerCase().includes('interactive') || s.toLowerCase().includes('mouse')
      );
      expect(hasInteractiveFeedback).toBe(true);
    });

    it('should provide domain-specific feedback for GLSL', () => {
      const code = `precision highp float;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / 500.0;
  gl_FragColor = vec4(0.5 + 0.5 * sin(u_time + uv.xyx), 1.0);
}`;

      const result = ArtisticCritic.evaluate(code, 'glsl');

      expect(result.strengths.length).toBeGreaterThan(0);
    });

    it('should provide domain-specific feedback for Three.js', () => {
      const code = `import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const light = new THREE.AmbientLight(0x404040);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();`;

      const result = ArtisticCritic.evaluate(code, 'three');

      expect(result.strengths.length).toBeGreaterThan(0);
    });

    it('should give higher scores for creative techniques', () => {
      const basicCode = `function setup() {
  createCanvas(400, 400);
}
function draw() {
  background(220);
}`;

      const creativeCode = `function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
}
function draw() {
  for (let i = 0; i < 100; i++) {
    let n = noise(i * 0.01, frameCount * 0.001);
    fill(n * 360, 80, 80);
    ellipse(random(width), random(height), n * 20);
  }
}`;

      const basicResult = ArtisticCritic.evaluate(basicCode, 'p5');
      const creativeResult = ArtisticCritic.evaluate(creativeCode, 'p5');

      expect(creativeResult.score).toBeGreaterThan(basicResult.score);
    });
  });
});
