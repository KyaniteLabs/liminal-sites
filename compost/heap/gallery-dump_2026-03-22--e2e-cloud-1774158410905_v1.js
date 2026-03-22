let particles = [];
const particleCount = 200;
let targetX, targetY;

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
  
  // Seed the noise function for consistent organic patterns
  noiseSeed(42);
}

function draw() {
  background(35, 50, 70);

  targetX = width / 2;
  targetY = height / 2;

  for (let i = 0; i < particleCount; i++) {
    particles[i].update();
    particles[i].show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    
    // Perlin noise driven velocity for smooth, organic movement
    // Using time as input to create a flowing field effect
    let xNoise = noise(this.pos.x * 0.01 + frameCount * 0.002);
    let yNoise = noise(this.pos.y * 0.01 + frameCount * 0.002);
    
    this.vel = p5.Vector.fromAngle((xNoise - 0.5) * PI * 2).mult(0.5);
    this.acc = createVector(xNoise - 0.5, yNoise - 0.5);
    
    // Target point in the center with slight random offset for variety
    let tx = targetX + (noise(i * 0.1) - 0.5) * 100;
    let ty = targetY + (noise(i * 0.1 + frameCount * 0.05) - 0.5) * 100;
    
    this.target = createVector(tx, ty);
  }

  update() {
    // Add noise-based acceleration for organic drift
    let xNoise = noise(this.pos.x * 0.02 + frameCount * 0.003);
    let yNoise = noise(this.pos.y * 0.02 + frameCount * 0.003);
    
    this.acc.x += (xNoise - 0.5) * 0.1;
    this.acc.y += (yNoise - 0.5) * 0.1;

    // Seek target
    let dir = p5.Vector.sub(this.target, this.pos);
    dir.setMag(1);
    
    // Smoothly interpolate velocity towards desired direction
    this.vel.add(dir.mult(0.02));
    
    // Limit speed for a gentle floaty feel
    let maxSpeed = 3;
    if (this.vel.mag() > maxSpeed) {
      this.vel.setMag(maxSpeed);
    }

    this.pos.add(this.vel);
    
    // Bounce off edges gently
    if (this.pos.x < 0 || this.pos.x > width) {
      this.acc.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.acc.y *= -1;
    }

    // Apply friction to dampen movement over time
    this.vel.mult(0.98);
    
    // Reset acceleration to keep noise influence subtle
    this.acc.mult(0.5);
  }

  show() {
    let opacity = map(this.pos.dist(this.target), 0, 100, 1, 0);
    
    noStroke();
    fill(45, 78, 239, opacity * 200); // Blue color
    
    let size = map(noise(this.pos.x * 0.01 + this.pos.y * 0.01), 0, 1, 6, 20);
    
    ellipse(this.pos.x, this.pos.y, size);
  }
}