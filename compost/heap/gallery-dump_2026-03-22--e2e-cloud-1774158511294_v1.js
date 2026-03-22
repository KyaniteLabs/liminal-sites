const particleCount = 300;
let particles = [];

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.friction = 0.96;
    this.colorHue = map(this.pos.x + this.pos.y, 0, width * 2, 180, 360) % 360;
    this.size = random(5, 15);
  }

  update() {
    if (this.vel.mag() > 4) {
      this.vel.setMag(4);
    }
    
    // Perlin noise for organic movement based on position
    let noiseVal = noise(this.pos.x * 0.002, this.pos.y * 0.002, frameCount * 0.01);
    let forceX = (noiseVal - 0.5) * 0.2;
    
    // Simple blue circle collision logic
    if (this.pos.dist(width / 2, height / 2) < width / 2) {
      this.vel.mult(-1);
      this.pos.x += this.vel.x * 2;
      this.pos.y += this.vel.y * 2;
    } else {
        // Noise-based attraction to the center when outside
        let distToCenter = this.pos.dist(width/2, height/2);
        if (distToCenter > width / 2 - 50 && distToCenter < width / 2 + 100) {
            let angle = atan2(this.pos.y - height/2, this.pos.x - width/2);
            forceX += cos(angle) * noiseVal * 0.5;
        }
    }

    // Apply forces
    this.acc.x += forceX;
    
    // Update velocity and position
    this.vel.add(this.acc);
    this.vel.mult(this.friction);
    this.pos.add(this.vel);
    
    this.acc.mult(0);
  }

  display() {
    noStroke();
    let x = this.pos.x;
    let y = this.pos.y;
    let c = color(this.colorHue, 100, 255); // Blue-ish
    
    fill(c);
    ellipse(x, y, this.size);
    
    // Simple blue circle core effect
    noFill();
    stroke(30, 80, 220);
    strokeWeight(1);
    ellipse(x, y, this.size * 0.5);
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  noiseSeed(42);
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(15); // Very dark blue
  
  for (let p of particles) {
    p.update();
    p.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  noiseSeed(frameCount * 42);
}