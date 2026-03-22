let particles;

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
  noiseSeed(42); // Seed for organic flow
  
  particles = [];
  let cols = floor(width / 10) + 1;
  
  for (let i = 0; i < cols * 50; i++) {
    particles.push(new Particle());
  }
}

class Particle {
  constructor() {
    this.pos = createVector(noise((i = random(width)), random(height)) * width, noise((j = random(width)), random(height)) * height);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.friction = 0.96;
    this.noiseX = i;
    this.noiseY = j;
  }
  
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    
    // Flow field influence based on noise
    let n = noise(this.noiseX * 0.01, this.noiseY * 0.01);
    let angle = map(n, 0, 1, 0, TWO_PI);
    
    let flowForce = p5.Vector.fromAngle(angle);
    this.acc.add(flowForce.mult(0.1));
    
    this.vel.add(this.acc);
    this.vel.mult(this.friction);
    this.pos.add(this.vel);
    
    // Wrap around edges
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.noiseX = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = width;
      this.noiseX = width;
    }
    
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.noiseY = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = height;
      this.noiseY = height;
    }
    
    // Update noise coordinates for smooth movement
    this.noiseX += 0.01;
    this.noiseY += 0.01;
  }
  
  display() {
    noStroke();
    fill(30, 144, 255); // Blue circle
    ellipse(this.pos.x, this.pos.y, 6);
  }
}

function draw() {
  background(10);
  
  for (let p of particles) {
    p.update();
    p.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}