let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(0, 0, 10, 10);

  if (random(1) < 0.1) {
    fireworks.push(new Firework(random(width), random(height)));
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    firework.update();
    firework.show();
    if (firework.done()) {
      fireworks.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.update();
    particle.show();
    if (particle.isFinished()) {
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
    this.explosionRadius = random(100, 200);
    this.speed = random(10, 15);
    this.angle = random(TWO_PI);
    this.particlesToCreate = 100;
    this.rocket = new Particle(this.x, this.y, this.hue, false, 0, 0);
    this.rocket.setTarget(this.x + cos(this.angle) * 300, this.y - sin(this.angle) * 300);
  }

  update() {
    if (!this.exploded) {
      this.rocket.update();
      if (this.rocket.y < height * 0.3 || random(1) < 0.05) {
        this.explode();
      }
    } else {
      // Keep the firework object alive briefly to manage particle decay if needed,
      // but the primary updates are handled by the particle system.
    }
  }

  show() {
    if (!this.exploded) {
      this.rocket.show();
    }
    // Particles are shown in the main draw loop
  }

  explode() {
    this.exploded = true;
    for (let i = 0; i < this.particlesToCreate; i++) {
      particles.push(new Particle(this.rocket.x, this.rocket.y, this.hue, true));
    }
  }

  done() {
    return this.exploded && particles.length === 0;
  }
}

class Particle {
  constructor(x, y, hue, isExplosion, vx = 0, vy = 0) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.isExplosion = isExplosion;
    this.lifespan = 255;
    this.radius = random(2, 4);
    this.gravity = 0.1;
    this.alphaDecay = random(3, 7);

    if (isExplosion) {
      let angle = random(TWO_PI);
      let speed = random(2, 10);
      this.vx = cos(angle) * speed;
      this.vy = sin(angle) * speed;
    } else {
      // Rocket particle (simple upward movement)
      this.vx = vx;
      this.vy = vy;
    }
  }

  setTarget(tx, ty) {
    this.targetX = tx;
    this.targetY = ty;
    this.angle = atan2(ty - this.y, tx - this.x);
    this.speed = 8;
  }

  update() {
    if (!this.isExplosion) {
      // Rocket movement towards target
      let dx = cos(this.angle) * this.speed;
      let dy = sin(this.angle) * this.speed;
      this.x += dx;
      this.y += dy;
      this.lifespan -= 1.5;
    } else {
      // Explosion particle physics
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.lifespan -= this.alphaDecay;
      this.vx *= 0.98; // Air resistance
      this.vy *= 0.98;
    }
  }

  show() {
    stroke(this.hue, 100, 100, this.lifespan);
    strokeWeight(this.radius);
    point(this.x, this.y);
  }

  isFinished() {
    return this.lifespan < 0;
  }
}