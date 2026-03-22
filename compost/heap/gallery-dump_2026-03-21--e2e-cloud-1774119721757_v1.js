let particles = [];
let width, height;

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
  noStroke();
  
  // Seed the noise function for consistent organic patterns
  noiseSeed(4291);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.r = random(30, 60);
    this.pos = createVector(random(width), random(height));
    // Give it a slight organic velocity based on noise
    let velX = noise(this.pos.x * 0.01 + frameCount * 0.005) * 2;
    let velY = noise(this.pos.y * 0.01 + frameCount * 0.005) * 2;
    this.vel = createVector(velX, velY);
    
    // Base color is blue
    this.baseHue = hue(200); 
    this.baseSat = sat(60);
    this.baseVal = val(40 + random(10));
  }

  update() {
    // Move based on velocity and a gentle repulsion from center (collision avoidance)
    let c = createVector(width / 2, height / 2);
    let d = dist(this.pos.x, this.pos.y, c.x, c.y);
    
    if (d < width * 0.3 && frameCount % 5 === 0) {
      // If too close to center and on a random interval, push away gently
      this.vel.add(p5.Vector.sub(c, this.pos).normalize().mult(0.2));
    }

    this.pos.add(this.vel);
    
    // Wrap around edges (infinite canvas feel)
    if (this.pos.x > width + 100) this.pos.x = -100;
    if (this.pos.x < -100) this.pos.x = width + 100;
    if (this.pos.y > height + 100) this.pos.y = -100;
    if (this.pos.y < -100) this.pos.y = height + 100;

    // Slow down over time to prevent flying off too fast
    this.vel.mult(0.98);
  }

  display() {
    fill(this.baseHue, this.baseSat, this.baseVal);
    
    // Use noise for subtle color variation and size jitter
    let noiseVal = noise(this.pos.x * 0.01 + frameCount * 0.02, this.pos.y * 0.01 + frameCount * 0.02);
    let currentSize = map(noiseVal, 0, 1, this.r - 5, this.r + 5);
    
    // Draw the circle with a slight glow effect via fill alpha
    noStroke();
    ellipse(this.pos.x, this.pos.y, currentSize);
  }
}

function draw() {
  background(20); // Dark blue-grey background
  
  // Create particles if none exist or array is empty (simple initialization)
  if (particles.length === 0) {
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }
  }

  for (let p of particles) {
    p.update();
    p.display();
  }
}