let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  // Dim the background slightly each frame to create fading trails
  background(0, 0, 0, 15);

  // 1. Launch new fireworks occasionally
  if (random(1) < 0.05) {
    let x = random(width * 0.1, width * 0.9);
    let y = height;
    let hue = random(360);
    fireworks.push(new Firework(x, y, hue));
  }

  // 2. Update and draw fireworks (rockets ascending)
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    firework.update();
    firework.show();
    if (firework.done()) {
      let explosionParticles = firework.explode();
      particles.push(...explosionParticles);
      fireworks.splice(i, 1);
    }
  }

  // 3. Update and draw particles (explosion debris)
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p.isDone()) {
      particles.splice(i, 1);
    }
  }
}

class Firework {
  constructor(startX, startY, hue) {
    this.x = startX;
    this.y = startY;
    this.hue = hue;
    this.exploded = false;
    this.targetY = random(height * 0.1, height * 0.4); // Explode in upper third of screen
    this.velocity = createVector(0, random(-15, -10));
    this.acceleration = createVector(0, 0.1);
    this.radius = 3;
  }

  update() {
    if (this.exploded) return;

    // Apply velocity changes until target height is reached
    this.velocity.add(this.acceleration);
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Simple check to trigger explosion when it reaches the target height
    if (this.y <= this.targetY) {
        this.exploded = true;
        this.velocity.mult(0); // Stop movement immediately upon explosion trigger
    }
  }

  show() {
    if (this.exploded) return;
    stroke(this.hue, 100, 100, 100);
    strokeWeight(this.radius);
    point(this.x, this.y);
  }

  explode() {
    if (this.exploded) {
      let count = 80;
      let newParticles = [];
      for (let i = 0; i < count; i++) {
        newParticles.push(new Particle(this.x, this.y, this.hue));
      }
      return newParticles;
    }
    return [];
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
    this.lifespan = 100;
    this.alpha = 100;
    
    // Give it a random explosive velocity
    let angle = random(TWO_PI);
    let speed = random(2, 10);
    this.velocity = createVector(cos(angle) * speed, sin(angle) * speed);
    
    this.acceleration = createVector(0, 0.1); // Gravity
  }

  update() {
    // Apply physics
    this.velocity.add(this.acceleration);
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    
    // Fade out over time
    this.lifespan -= 2;
    this.alpha = map(this.lifespan, 0, 100, 0, 100);
  }

  show() {
    stroke(this.hue, 100, 100, this.alpha);
    strokeWeight(3);
    point(this.x, this.y);
  }

  isDone() {
    return this.lifespan < 0;
  }
}