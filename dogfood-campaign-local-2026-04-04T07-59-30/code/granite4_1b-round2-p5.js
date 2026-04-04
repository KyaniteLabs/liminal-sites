let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0, 0, 0, 100); // Initial dark background
}

function draw() {
  // Create a semi-transparent overlay to create the fading trail effect
  background(0, 0, 0, 15);

  // 1. Launch new fireworks randomly
  if (random(1) < 0.05) {
    fireworks.push(new Firework(random(width), random(height)));
  }

  // 2. Update and draw fireworks rockets
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    firework.update();
    firework.show();

    if (firework.exploded) {
      // When exploded, create many particles
      for (let j = 0; j < 100; j++) {
        particles.push(new Particle(firework.x, firework.y, firework.hue));
      }
      // Remove the original firework after explosion
      fireworks.splice(i, 1);
    }
  }

  // 3. Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();

    // Remove dead particles
    if (p.isDone()) {
      particles.splice(i, 1);
    }
  }
}

// --- Classes ---

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = random(width * 0.1, width * 0.9);
    this.targetY = random(height * 0.1, height * 0.4);
    this.hue = random(360);
    this.velocity = createVector(
      (this.targetX - this.x) * 0.01,
      (this.targetY - this.y) * 0.01
    );
    this.radius = 5;
    this.exploded = false;
  }

  update() {
    if (!this.exploded) {
      // Move towards the target
      this.x += this.velocity.x * 5;
      this.y += this.velocity.y * 5;

      // Check if the rocket is close enough to explode
      let distance = dist(this.x, this.y, this.targetX, this.targetY);
      if (distance < 20) {
        this.exploded = true;
      }
    }
  }

  show() {
    stroke(this.hue, 100, 100, 100);
    strokeWeight(3);
    point(this.x, this.y);
  }
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.lifespan = 100;
    
    // Give random initial velocity for explosion effect
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(2, 10));
    
    // Gravity effect
    this.acc = createVector(0, 0.1);
  }

  update() {
    this.vel.add(this.acc);
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.lifespan -= 3;
  }

  show() {
    // Color fades with lifespan
    stroke(this.hue, 100, 100, this.lifespan);
    strokeWeight(4);
    point(this.x, this.y);
  }

  isDone() {
    return this.lifespan < 0;
  }
}