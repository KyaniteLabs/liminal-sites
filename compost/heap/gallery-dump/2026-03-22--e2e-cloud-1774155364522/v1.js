let particles = [];

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  
  // Seed the noise function to ensure consistent organic patterns across runs
  noiseSeed(1337);
  
  for (let i = 0; i < 200; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(15, 24, 46); // Dark blue-grey background
  
  let x = width / 2;
  let y = height / 2;
  
  // Use noise to create a subtle pulsing effect for the circle center
  let pulse = map(noise(frameCount * 0.005), 0, 1, -10, 10);
  x += pulse;
  y += pulse;

  noFill();
  stroke(46, 127, 223); // Light blue
  
  beginShape();
  for (let i = 0; i < 50; i++) {
    let angle = map(i, 0, 50, 0, TWO_PI);
    let r = map(noise(i * 0.1 + frameCount * 0.02), 0, 1, 40, 80) + pulse;
    let px = x + cos(angle) * r;
    let py = y + sin(angle) * r;
    vertex(px, py);
    
    // Draw a particle at this point using noise for position variation
    particles[i].update();
    particles[i].show(x, y);
  }
  endShape(CLOSE);
}

class Particle {
  constructor() {
    this.pos = createVector(0, 0);
    this.vel = p5.Vector.random2D().mult(random(0.1, 0.3));
    this.acc = createVector(0, 0);
    
    // Use noise to give each particle a unique starting offset and behavior
    this.noiseOffset = random(1000);
    this.targetDistance = map(noise(this.noiseOffset), 0, 1, -5, 5);
  }
  
  update(centerX, centerY) {
    // Attract towards the center with noise-based variation
    let target = createVector(centerX + this.targetDistance, centerY + this.targetDistance * 0.8);
    
    let dir = p5.Vector.sub(target, this.pos);
    dir.setMag(random(0.1, 0.2)); // Random force magnitude
    
    if (dir.dist(this.pos) < 5) {
      dir.mult(-1); // Bounce slightly
    }
    
    this.acc.add(dir);
    this.vel.add(this.acc);
    this.vel.limit(1);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  show(centerX, centerY) {
    strokeWeight(random(1));
    fill(83, 195, 246); // Lighter blue for particles
    noStroke();
    
    let r = map(noise(this.noiseOffset + frameCount * 0.05), 0, 1, 2, 4);
    
    if (this.pos.x > centerX - 10 && this.pos.x < centerX + 10 && 
        this.pos.y > centerY - 10 && this.pos.y < centerY + 10) {
      ellipse(this.pos.x, this.pos.y, r * 2);
    } else {
      // Use noise for subtle position jitter if far from center
      let jitterX = map(noise(this.noiseOffset + frameCount * 0.05), 0, 1, -1, 1) * 2;
      let jitterY = map(noise(this.noiseOffset + frameCount * 0.06), 0, 1, -1, 1) * 2;
      
      ellipse(centerX + jitterX, centerY + jitterY, r);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  particles = [];
  for (let i = 0; i < 200; i++) {
    particles.push(new Particle());
  }
}