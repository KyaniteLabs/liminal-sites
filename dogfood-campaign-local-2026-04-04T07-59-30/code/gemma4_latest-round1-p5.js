let fireworks = [];
let particles = [];
let gravity;

function setup() {
  createCanvas(800, 600);
  noiseSeed(random(1000));
  gravity = createVector(0, 0.1);
  background(0);
}

function draw() {
  // Fade the background slightly each frame to create motion trails
  background(0, 0, 0, 20);

  // 1. Launch new fireworks occasionally
  if (random(1) < 0.05) {
    fireworks.push(new Firework(random(width), height));
  }

  // 2. Update and draw fireworks (the ascending rocket)
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    firework.update();
    firework.show();
    if (firework.done()) {
      fireworks.splice(i, 1);
    }
  }

  // 3. Update and draw particles (the explosion)
  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.update();
    particle.show();
    if (particle.isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function mousePressed() {
  // Allow manual fireworks launch on click
  fireworks.push(new Firework(mouseX, height));
}

// --- Classes ---

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = random(width * 0.1, width * 0.9);
    this.targetY = random(height * 0.1, height * 0.4);
    this.hue = random(360);
    this.exploded = false;
    this.explosionRadius = 0;
    this.speed = random(3, 6);
    this.angle = atan2(this.targetY - this.y, this.targetX - this.x);
    this.vx = cos(this.angle) * this.speed;
    this.vy = sin(this.angle) * this.speed;
    this.trail = [];
    this.maxTrailLength = 10;
  }

  update() {
    if (this.exploded) return;

    // Store current position for trail
    this.trail.push(createVector(this.x, this.y));
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // Move towards target
    this.x += this.vx;
    this.y += this.vy;

    // Check if target reached (or passed)
    let distance = dist(this.x, this.y, this.targetX, this.targetY);
    if (distance < 10) {
      this.explode();
    }
  }

  explode() {
    this.exploded = true;
    let count = 100;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(this.x, this.y, this.hue));
    }
  }

  show() {
    // Draw the rocket trail
    strokeWeight(2);
    stroke(this.hue, 255, 255, 150);
    for (let i = 0; i < this.trail.length; i++) {
      let p = this.trail[i];
      let alpha = map(i, 0, this.trail.length - 1, 0, 150);
      stroke(this.hue, 255, 255, alpha);
      point(p.x, p.y);
    }

    // Draw the rocket head
    fill(this.hue, 255, 255, 200);
    noStroke();
    ellipse(this.x, this.y, 8, 8);
  }

  done() {
    return this.exploded;
  }
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.radius = random(2, 5);
    
    // Initial randomized velocity for explosion spread
    let angle = random(TWO_PI);
    let speed = random(1, 10);
    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;
    
    this.life = 255;
    this.decayRate = random(3, 7);
  }

  update() {
    // Apply physics
    this.vx *= 0.98; // Air resistance
    this.vy *= 0.98;
    this.vy += gravity.y; // Gravity pull

    this.x += this.vx;
    this.y += this.vy;

    // Decay life
    this.life -= this.decayRate;
  }

  show() {
    // Use HSB for vibrant, color-shifting fireworks
    colorMode(HSB, 360, 100, 100, 100);
    
    // The alpha fades based on remaining life
    let alpha = map(this.life, 0, 255, 0, 1);
    fill(this.hue, 100, 100, alpha * 0.8);
    stroke(this.hue, 100, 100, alpha * 0.8);
    strokeWeight(1);
    
    ellipse(this.x, this.y, this.radius, this.radius);
  }

  isFinished() {
    return this.life < 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}