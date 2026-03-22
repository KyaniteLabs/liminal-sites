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
    this.maxSpeed = map(this.pos.x, 0, width, 1, 4);
    this.friction = 0.96;
    this.size = random(2, 8);
    this.baseX = this.pos.x;
    this.baseY = this.pos.y;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.mult(this.friction);
    
    // Simple attraction to center with noise modulation
    let targetX = width / 2 + noise(frameCount * 0.01, this.baseX) * 50;
    let targetY = height / 2 + noise(frameCount * 0.01, this.baseY) * 50;
    
    let dir = p5.Vector.sub(createVector(targetX, targetY), this.pos);
    dir.setMag(0.5);
    this.acc.add(dir);
    
    this.pos.add(this.vel);
    this.acc.mult(0); // Reset acceleration
    
    // Bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) { this.vel.x *= -1; }
    if (this.pos.y < 0 || this.pos.y > height) { this.vel.y *= -1; }
  }

  display() {
    noStroke();
    fill(25, 64, 198); // Simple blue circle color
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function draw() {
  background(0);
  
  for (let p of particles) {
    p.update();
    p.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}