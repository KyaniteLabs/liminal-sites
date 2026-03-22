let particles = [];
const particleCount = 200;
const connectionDistance = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(0);
  
  // Seed noise for consistent organic patterns across reloads
  noiseSeed(42);
  
  // Initialize particles with random positions
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(15, 20, 35); // Dark blue background
  
  // Update and display all particles
  for (let p of particles) {
    p.update();
    p.display();
    
    // Draw connections between close particles
    for (let other of particles) {
      if (p !== other && dist(p.pos.x, p.pos.y, other.pos.x, other.pos.y) < connectionDistance) {
        let d = dist(p.pos.x, p.pos.y, other.pos.x, other.pos.y);
        
        // Calculate color based on distance using noise for smooth transitions
        let noiseValue = noise(d / 50.0, frameCount * 0.01 + p.id * 0.01);
        let opacity = map(noiseValue, 0, 1, 0, 0.6);
        
        stroke(30, 80, 240, opacity * 255); // Blue stroke with variable opacity
        strokeWeight(map(d, 0, connectionDistance, 1, 0));
        line(p.pos.x, p.pos.y, other.pos.x, other.pos.y);
      }
    }
  }
}

class Particle {
  constructor() {
    this.id = random(0, particleCount);
    // Random initial position within canvas bounds
    this.pos = createVector(random(width), random(height));
    
    // Velocity with slight randomness using noise for organic movement
    let vNoise = noise(this.id + frameCount * 0.01);
    this.vel = p5.Vector.random2D().mult(map(vNoise, 0, 1, -1.5, 1.5));
    
    // Size variation
    this.size = map(noise(this.id), 0, 1, 3, 6);
    
    // Color variations in blue spectrum
    let cNoise = noise(this.id + 100);
    this.r = 20;
    this.g = map(cNoise, 0, 1, 40, 180);
    this.b = 255;
    
    // Acceleration for organic flow
    this.acc = createVector(0, 0);
  }
  
  update() {
    // Apply forces using noise for smooth, organic movement patterns
    let forceX = noise(this.id + frameCount * 0.1) * 0.5;
    let forceY = noise(this.id + frameCount * 0.1 + 100) * 0.5;
    
    this.acc.x += forceX;
    this.acc.y += forceY;
    
    // Update velocity and position
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    // Reset acceleration for constant movement style
    this.acc.mult(0);
    
    // Bounce off edges with organic damping
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, 0, width);
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, 0, height);
    }
    
    // Color breathing effect using noise
    let cNoise = noise(this.id * 0.5 + frameCount * 0.02);
    this.g = map(cNoise, 0, 1, 40, 180);
  }
  
  display() {
    // Draw the particle as a circle
    fill(30, this.g, 255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reinitialize particles to fit new canvas size
  for (let p of particles) {
    p.pos = createVector(random(width), random(height));
  }
}