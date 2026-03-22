let particleCount = 200;
let particles = [];
let textStrings = ["COMPOST", "GENERATIVE", "ART", "FLOW"];
let mouseX, mouseY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(255);
  
  // Seed noise for organic flow
  noiseSeed(42);
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  noStroke();
  fill(30, 144, 255); // Simple blue
  
  // Draw a simple blue circle in the center as requested
  let cx = width / 2;
  let cy = height / 2;
  let radius = min(width, height) * 0.15;
  
  ellipse(cx, cy, radius * 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(0.5);
    this.acc = createVector(0, 0);
    
    // Use noise for organic color variation around the blue base
    let n = noise(this.pos.x * 0.01, this.pos.y * 0.01) * 255;
    this.baseColor = color(30 + n/2, 144, 255);
    
    // Store original text string for later use if needed
    this.string = textStrings[Math.floor(random(textStrings.length))];
  }
  
  update() {
    // Apply noise-based forces to create flow field effect
    let angle = NOISE(this.pos.x * 0.01 + frameCount * 0.001, this.pos.y * 0.01);
    this.acc.set(cos(angle), sin(angle));
    
    this.vel.add(this.acc);
    this.vel.limit(2);
    this.pos.add(this.vel);
    
    // Bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
    }
    
    // Keep particles somewhat near center but wandering
    let cx = width / 2;
    let cy = height / 2;
    let dx = this.pos.x - cx;
    let dy = this.pos.y - cy;
    let distance = dist(this.pos.x, this.pos.y, cx, cy);
    
    if (distance > min(width, height) * 0.8) {
      let force = p5.Vector.sub(cx, cy, dx, dy).normalize();
      force.mult(0.5 / distance);
      this.vel.add(force);
    }
  }
  
  display() {
    // Use noise for subtle size variation
    let n = noise(this.pos.x * 0.01 + frameCount * 0.002, this.pos.y * 0.01) * 5;
    
    fill(this.baseColor);
    circle(this.pos.x, this.pos.y, n + 3);
  }
}