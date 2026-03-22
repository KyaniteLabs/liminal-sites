let particles = [];
const particleCount = 200;
const friction = 0.98;
const gravity = 0.5;

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Seed noise for organic movement
  noiseSeed(42);
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(360, 80, 1, 0.05); // Very light blue transparent background
  
  let targetX = width / 2;
  let targetY = height / 2 - 50;
  
  for (let p of particles) {
    p.update(targetX, targetY);
    p.show();
    
    if (p.reachedCenter()) {
      p.reset();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.acc = createVector();
    
    // Random size and opacity for variety
    this.size = random(10, 30);
    this.opacity = random(0.5, 0.8);
    
    // Color variation within the blue spectrum
    this.hue = random(200, 240);
    this.saturation = random(60, 90);
    this.brightness = random(70, 100);
  }
  
  update(targetX, targetY) {
    // Use noise for organic drift based on position
    let xNoise = map(noise(this.pos.x * 0.005 + frameCount * 0.002), 0, 1, -0.05, 0.05);
    let yNoise = map(noise(this.pos.y * 0.005 + frameCount * 0.003), 0, 1, -0.05, 0.05);
    
    // Calculate direction to center (the "blue circle" target)
    let desired = p5.Vector.sub(targetX, this.pos.x);
    desired.y = targetY - this.pos.y;
    desired.setMag(2); // Desired speed
    
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(0.1);
    
    this.acc.add(steer);
    this.acc.add(createVector(xNoise, yNoise)); // Add organic noise to movement
    
    this.vel.add(this.acc);
    this.vel.mult(friction);
    this.pos.add(this.vel);
  }
  
  show() {
    noStroke();
    fill(this.hue, this.saturation, this.brightness, this.opacity);
    
    // Draw circle with slight glow effect using larger size but lower alpha
    ellipse(this.pos.x, this.pos.y, this.size + (frameCount % 20), this.size + (frameCount % 20));
    ellipse(this.pos.x, this.pos.y, this.size * 0.8, this.size * 0.8);
  }
  
  reachedCenter() {
    let d = dist(this.pos.x, this.pos.y, width / 2, height / 2 - 50);
    return d < 30;
  }
  
  reset() {
    // Reset position to random edge with a bit of randomness from noise
    if (random(1) > 0.5) {
      this.pos.x = random(width);
      this.pos.y = -10;
    } else {
      this.pos.x = -10;
      this.pos.y = random(height);
    }
    
    // Reset velocity with noise influence
    this.vel = p5.Vector.random2D().mult(random(1, 3));
  }
}