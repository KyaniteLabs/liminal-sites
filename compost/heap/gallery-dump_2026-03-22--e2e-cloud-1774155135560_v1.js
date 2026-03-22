let particleCount = 200;
let particles = [];

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(240);
  
  // Use noise to create a subtle color shift over time
  let hueOffset = map(noise(frameCount * 0.01), 0, 1, 0, 360);
  
  for (let p of particles) {
    p.update();
    p.show(hueOffset);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(noise(0, frameCount * 0.01) - 0.5, noise(1, frameCount * 0.01) - 0.5);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.maxForce = 0.1;
    
    // Use a fixed seed based on particle index for consistent behavior if needed
    noiseSeed(this.pos.x + this.pos.y * 100);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    
    // Limit speed
    let speed = mag(this.vel);
    if (speed > this.maxSpeed) {
      this.vel.setMag(this.maxSpeed);
    }
    
    this.vel.mult(0.96); // Air resistance
    
    this.pos.add(this.vel);
    this.acc.mult(0); // Reset acceleration
    
    // Wrap around edges
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
    
    noiseSeed(this.pos.x + this.pos.y * 100); // Reset seed for next frame's update
  }

  show(hueOffset) {
    let size = map(noise(frameCount * 0.05, this.pos.x), 0, 1, 2, 8);
    
    stroke(240 - hueOffset, 80, 100);
    strokeWeight(size / 2);
    fill(hueOffset, 80, 100, 50);
    
    ellipse(this.pos.x, this.pos.y, size);
    
    // Add a glow effect using multiple smaller circles
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        if (i === 0 && j === 0) continue;
        
        let offsetX = random(-1, 1);
        let offsetY = random(-1, 1);
        let offsetSize = map(noise(frameCount * 0.1 + this.pos.x + i), 0, 1, -size/3, size/3);
        
        ellipse(this.pos.x + offsetX, this.pos.y + offsetY, offsetSize * 2 + abs(i) * 0.5);
      }
    }
  }
}