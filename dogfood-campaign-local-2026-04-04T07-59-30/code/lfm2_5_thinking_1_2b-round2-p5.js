let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  // Create a dark, fading background effect for the trails
  background(0, 0, 0, 20);

  // 1. Launch new fireworks periodically
  if (random(1) < 0.05) {
    fireworks.push(new Firework(random(width), random(height)));
  }

  // 2. Update and draw fireworks (rockets)
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    firework.update();
    firework.show();

    if (firework.done()) {
      // Explode and create particles
      let explosionParticles = firework.explode();
      particles.push(...explosionParticles);
      fireworks.splice(i, 1);
    }
  }

  // 3. Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();

    if (p.isFinished()) {
      particles.splice(i, 1);
    }
  }
}

// --- Particle Class ---
class Particle {
  constructor(x, y, hue) {
    this.pos = createVector(x, y);
    // Random initial velocity for explosion spread
    this.vel = p5.Vector.random2D(0.5, 7);
    this.acc = createVector(0, 0.1); // Gravity
    this.lifespan = 100;
    this.hue = hue;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.mult(0.98); // Air resistance/drag
    this.lifespan -= 3;
  }

  show() {
    stroke(this.hue, 100, 100, this.lifespan);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }

  isFinished() {
    return this.lifespan < 0;
  }
}

// --- Firework Class (Rocket Phase) ---
class Firework {
  constructor(startX, startY) {
    this.pos = createVector(startX, startY);
    // Set target point high up in the sky
    this.target = createVector(random(width * 0.1, width * 0.9), random(height * 0.1, height * 0.3));
    this.vel = p5.Vector.sub(this.target, this.pos);
    this.vel = this.vel.div(60); // Normalize speed
    this.acc = createVector(0, 0);
    this.hue = random(360);
    this.exploded = false;
  }

  update() {
    if (this.exploded) return;

    this.vel.add(this.acc);
    this.pos.add(this.vel);

    // Check if the firework has reached or passed its target altitude
    let distanceToTarget = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
    if (distanceToTarget < 10 || this.pos.y > this.target.y + 10) {
      this.exploded = true;
    }
  }

  show() {
    if (this.exploded) return;
    stroke(this.hue, 100, 100);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
  }

  done() {
    return this.exploded;
  }

  explode() {
    let count = 100;
    let newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push(new Particle(this.pos.x, this.pos.y, this.hue));
    }
    return newParticles;
  }
}