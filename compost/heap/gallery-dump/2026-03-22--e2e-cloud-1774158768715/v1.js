let particles = [];
const particleCount = 300;
const radius = 5;
const speed = 2;

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  
  // Seed the noise function for organic movement patterns
  noiseSeed(42);
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(15, 30, 60); // Deep dark blue background
  
  // Draw the main "simple blue circle" at the center with noise-based subtle pulsing
  let pulse = map(noise(frameCount * 0.01), 0, 1, -10, 10);
  let cX = width / 2 + pulse;
  let cY = height / 2 + pulse * 0.5;
  
  noStroke();
  fill(64, 180, 255); // Bright blue
  
  circle(cX, cY, 100 + map(noise(frameCount * 0.05), 0, 1, -10, 10));

  // Update and display particles
  for (let i = 0; i < particleCount; i++) {
    let p = particles[i];
    
    // Move the particle using noise for organic flow
    p.update();
    
    // Draw the particle as a blue circle
    fill(70, 160, 230);
    noStroke();
    ellipse(p.pos.x, p.pos.y, radius + map(noise(p.id * 0.01), 0, 1, -1, 1));
    
    // Check for collision with the central circle
    let dx = p.pos.x - cX;
    let dy = p.pos.y - cY;
    let distance = sqrt(dx*dx + dy*dy);
    let minDist = 50; // Collision threshold
    
    if (distance < minDist) {
      // Bounce away from the center using reflection vector
      let normalX = dx / distance;
      let normalY = dy / distance;
      
      p.vel.x -= normalX * speed * 2;
      p.vel.y -= normalY * speed * 2;
    }
    
    // Keep particles within bounds
    if (p.pos.x < -10) { p.pos.x = width + 10; p.reset(); }
    if (p.pos.x > width + 10) { p.pos.x = -10; p.reset(); }
    if (p.pos.y < -10) { p.pos.y = height + 10; p.reset(); }
    if (p.pos.y > height + 10) { p.pos.y = -10; p.reset(); }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.id = Math.floor(random(particleCount));
    this.reset();
    
    // Initial random positions away from center to avoid immediate collision spikes
    let angle = random(TWO_PI) + random(PI); 
    let dist = random(width * 0.4, width * 0.6);
    this.pos.x = width/2 + cos(angle) * dist;
    this.pos.y = height/2 + sin(angle) * dist;
  }

  reset() {
    this.pos.x = random(width);
    this.pos.y = random(height);
    this.vel.x = random(-speed, speed);
    this.vel.y = random(-speed, speed);
    
    // Use noise to vary acceleration slightly for organic feel
    let accX = noise(this.id + frameCount * 0.01) * 0.5;
    let accY = noise(this.id + frameCount * 0.02) * 0.5;
    this.acc.x += accX;
    this.acc.y += accY;
  }

  update() {
    // Apply forces from Perlin noise based on position and time for organic drift
    let n = noise(this.pos.x * 0.01 + frameCount * 0.005, this.pos.y * 0.01);
    
    // Add gentle directional flow
    this.vel.x += (n - 0.5) * 0.2;
    this.vel.y += n * 0.2;

    // Friction to keep movement controlled
    this.vel.mult(0.96);
    
    // Update position
    this.pos.add(this.vel);
  }
}