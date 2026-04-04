let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0, 0, 0);
}

function draw() {
  // Create a slight fade effect for the trails by drawing a semi-transparent black rectangle over the whole canvas
  fill(0, 0, 0, 15);
  rect(0, 0, width, height);

  // 1. Handle Fireworks (Rockets ascending)
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    firework.update();
    firework.show();
    if (firework.done()) {
      fireworks.splice(i, 1);
      // When a firework explodes, create many particles
      let explosionParticles = createExplosion(firework.x, firework.y, firework.hue);
      particles.push(...explosionParticles);
    }
  }

  // 2. Handle Particles (Explosion debris falling)
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p.isDone()) {
      particles.splice(i, 1);
    }
  }

  // 3. Spawn new fireworks randomly
  if (random(1) < 0.1) {
    fireworks.push(new Firework(random(width), random(height * 0.7), random(360)));
  }
}

// --- Particle Class ---
class Particle {
  constructor(x, y, hue) {
    this.pos = createVector(x, y);
    // Random initial velocity for explosion spread
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(1, 5));
    this.acc = createVector(0, 0.1); // Slight gravity effect
    this.lifespan = 100;
    this.hue = hue;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.mult(0.98); // Air resistance/drag
    this.lifespan -= 2;
  }

  show() {
    stroke(this.hue, 100, 100, this.lifespan);
    strokeWeight(3);
    point(this.pos.x, this.pos.y);
  }

  isDone() {
    return this.lifespan < 0;
  }
}

// --- Firework Class (Rocket) ---
class Firework {
  constructor(startX, startY, hue) {
    this.pos = createVector(startX, startY);
    this.vel = createVector(0, -random(4, 8)); // Shoots upwards
    this.acc = createVector(0, 0.1); // Slight gravity pull
    this.hue = hue;
    this.exploded = false;
  }

  update() {
    if (this.exploded) return;

    this.vel.add(this.acc);
    this.pos.add(this.vel);

    // Check if it has reached apex (or near the top quarter of the screen)
    if (this.pos.y < height * 0.3) {
      this.exploded = true;
    }
  }

  show() {
    if (this.exploded) return;
    
    // Draw the ascending rocket trail
    stroke(this.hue, 100, 100, 100);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
  }

  done() {
    return this.exploded;
  }
}

// --- Helper Functions ---

function createExplosion(x, y, hue) {
  let count = 100;
  let explosion = [];
  for (let i = 0; i < count; i++) {
    explosion.push(new Particle(x, y, hue));
  }
  return explosion;
}