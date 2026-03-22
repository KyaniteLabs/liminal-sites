let particles = [];
const particleCount = 300;
let noiseOffsetX = 0;
let noiseOffsetY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Seed the noise function for organic behavior
  noiseSeed(429876);
  
  noStroke();
  
  // Initialize particles with random positions and velocities
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(15, 23, 42); // Dark blue background
  
  noiseOffsetX += 0.005;
  noiseOffsetY += 0.008;
  
  // Draw particles using Perlin noise for organic movement
  for (let p of particles) {
    p.update();
    p.show();
    
    // Create a subtle blue circle effect based on noise
    let pos = p.pos;
    let vel = p.vel;
    
    // Map noise to color variation within the blue spectrum
    let r = map(noise(pos.x * 0.1, pos.y * 0.1), 0, 1, 5, 30);
    let g = map(noise(pos.x * 0.1 + 100, pos.y * 0.1 + 100), 0, 1, 80, 200);
    let b = map(noise(pos.x * 0.1 + 200, pos.y * 0.1 + 200), 0, 1, 150, 240);
    
    fill(r, g, b);
    
    // Draw a soft circle at particle position with variable size
    let size = map(vel.mag(), 0, 2, 10, 25);
    circle(pos.x, pos.y, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    // Velocity influenced by noise for organic flow
    this.vel = p5.Vector.random2D().mult(random(0.5, 1.5));
    
    // Use noise to set initial position offset slightly
    let n = noise(this.pos.x * 0.01 + frameCount * 0.001);
    this.pos.x += n * width / 4;
    this.pos.y += n * height / 4;
    
    // Friction for smooth deceleration if needed, keeping it gentle
    this.acc = createVector(0, 0);
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    // Wrap around screen edges
    if (this.pos.x > width) this.pos.x = 0;
    else if (this.pos.x < 0) this.pos.x = width;
    
    if (this.pos.y > height) this.pos.y = 0;
    else if (this.pos.y < 0) this.pos.y = height;
    
    // Add a tiny bit of friction to slow down over time for organic feel
    this.vel.mult(0.98);
    
    // Reset velocity occasionally to keep them moving
    if (frameCount % 10 === 0 && this.vel.mag() < 0.2) {
      this.vel = p5.Vector.random2D().mult(random(0.5, 1.5));
    }
  }
  
  show() {
    // Position is updated in draw loop via noise influence logic if needed here
  }
}