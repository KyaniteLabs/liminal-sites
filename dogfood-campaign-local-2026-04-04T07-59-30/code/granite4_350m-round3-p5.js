let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(0, 0, 0, 15); // Semi-transparent background for fading trails

  // Create new fireworks randomly
  if (random(1) < 0.05) {
    fireworks.push(new Firework(random(width), random(height)));
  }

  // Update and draw fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    firework.update();
    firework.show();
    if (firework.done()) {
      fireworks.splice(i, 1);
    }
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.update();
    particle.show();
    if (particle.isDone()) {
      particles.splice(i, 1);
    }
  }
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.exploded = false;
    this.hue = random(360);
    this.explodedTimer = 0;
    this.gravity = 0.1;
    this.particlesToEmit = 50 + floor(random(50));
    this.targetY = random(height * 0.2, height * 0.5);
    this.speed = random(5, 10);
    this.angle = atan2(this.targetY - this.y, this.x - this.x);
  }

  update() {
    if (!this.exploded) {
      // Ascending phase
      let currentY = this.y;
      let currentX = this.x;

      this.y += this.speed * sin(this.angle) * 0.5;
      this.x += this.speed * cos(this.angle) * 0.5;

      if (this.y <= this.targetY) {
        this.explode();
      } else {
        this.showTrail();
        this.speed *= 0.98; // Slow down slightly during ascent
      }
    } else {
      // After explosion, the firework object itself is mostly done,
      // it just needs to manage the particle emission trigger if we were doing delayed effects.
      this.explodedTimer++;
    }
  }

  explode() {
    this.exploded = true;
    for (let i = 0; i < this.particlesToEmit; i++) {
      particles.push(new Particle(this.x, this.y, this.hue));
    }
  }

  show() {
    if (!this.exploded) {
      stroke(this.hue, 100, 100, 100);
      strokeWeight(2);
      point(this.x, this.y);
    }
    // If exploded, the particles handle the drawing
  }

  showTrail() {
    stroke(this.hue, 100, 100, 80);
    strokeWeight(1.5);
    line(this.x - 5, this.y + 5, this.x + 5, this.y + 5);
  }

  done() {
    return this.explodedTimer > 100; // Keep it around briefly after explosion
  }
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
    this.gravity = 0.1;
    this.lifespan = 255;
    this.hue = hue;
    this.radius = random(2, 4);
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.98; // Air resistance
    this.vy *= 0.98;
    this.lifespan -= 4; // Fade faster
  }

  show() {
    stroke(this.hue, 100, 100, this.lifespan);
    strokeWeight(this.radius);
    point(this.x, this.y);
  }

  isDone() {
    return this.lifespan < 0;
  }
}