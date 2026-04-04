let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  // Dim the background slightly to create fading trails effect
  background(0, 0, 0, 20);

  // Create new fireworks randomly
  if (random(1) < 0.05) {
    fireworks.push(new Firework(random(width), random(height)));
  }

  // Update and draw fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    firework.update();
    firework.draw();
    if (firework.done()) {
      fireworks.splice(i, 1);
    }
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.update();
    particle.draw();
    if (particle.done()) {
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
    this.particles = [];
    // Initial 'rocket' trajectory (simple upward movement)
    this.velocity = createVector(random(-2, 2), random(-10, -15));
    this.acceleration = createVector(0, 0.1);
    this.radius = 5;
  }

  update() {
    if (!this.exploded) {
      // Rocket phase: Apply acceleration and move
      this.velocity.add(this.acceleration);
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      // Check for explosion trigger (e.g., reaching a certain height)
      if (this.y < height * 0.3 || this.velocity.y > 0) {
        this.explode();
      }
    } else {
      // Explosion phase: Update particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].update();
        if (this.particles[i].done()) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  draw() {
    if (!this.exploded) {
      // Draw the rocket trail
      stroke(this.hue, 255, 255, 150);
      strokeWeight(2);
      point(this.x, this.y);
    } else {
      // Draw all explosion particles
      for (let particle of this.particles) {
        particle.show();
      }
    }
  }

  explode() {
    this.exploded = true;
    // Create many particles upon explosion
    let numParticles = 80;
    for (let i = 0; i < numParticles; i++) {
      this.particles.push(new Particle(this.x, this.y, this.hue));
    }
  }

  done() {
    // A firework is done when it has exploded and all its particles have faded
    return this.exploded && this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.lifespan = 255;
    this.radius = random(2, 5);
    // Initial velocity for explosion spread
    let angle = random(TWO_PI);
    let speed = random(2, 10);
    this.velocity = p5.Vector.fromAngle(angle).mult(speed);
    // Gravity for realistic fall
    this.acceleration = createVector(0, 0.15);
  }

  update() {
    // Apply physics
    this.velocity.add(this.acceleration);
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Fade over time
    this.lifespan -= 5;
  }

  draw() {
    // Use HSB color mode for vibrant fireworks
    colorMode(HSB, 360, 100, 100, 100);
    stroke(this.hue, 100, 100, this.lifespan);
    strokeWeight(this.radius);
    point(this.x, this.y);
  }

  done() {
    return this.lifespan < 0;
  }
}