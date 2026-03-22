let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noStroke();
  
  // Seed the noise function for a consistent organic pattern
  noiseSeed(42);
}

function draw() {
  background(10); // Dark background to make blue pop
  
  // Spawn particles occasionally based on noise variation
  if (noise(frameCount * 0.01) > 0.98) {
    let x = random(width);
    let y = random(height);
    
    // Create a simple blue circle particle
    particles.push(new Particle(x, y));
  }
  
  // Update and display all particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    
    // Remove particles that have faded out or moved too far
    if (particles[i].opacity < 0.05 || particles[i].x < 0 || particles[i].x > width || particles[i].y < 0 || particles[i].y > height) {
      particles.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    
    // Velocity influenced by noise for organic movement
    let speed = random(1, 3);
    let angle = TWO_PI * noise(frameCount + x * 0.05);
    this.vel = p5.Vector.fromAngle(angle).mult(speed);
    
    // Color: varying shades of blue
    let hue = map(noise(x, y), 0, 1, 200, 240);
    this.color = color(hue, 80, 200);
    
    this.size = random(5, 15);
    this.opacity = 1;
  }
  
  update() {
    // Move particle
    this.pos.add(this.vel);
    
    // Slowly fade out
    this.opacity -= 0.005;
    
    // Add a little noise to position for jittery organic feel
    this.pos.x += random(-1, 1);
    this.pos.y += random(-1, 1);
  }
  
  display() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size * this.opacity);
  }
}