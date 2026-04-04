let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 20); // Dark night sky
}

function draw() {
  // Semi-transparent background to create fading trails
  background(0, 0, 20, 50);

  // 1. Launch new fireworks randomly
  if (random(1) < 0.05) {
    fireworks.push(new Firework(random(width), height));
  }

  // 2. Update and draw fireworks (rockets going up)
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    firework.update();
    firework.show();
    if (firework.exploded) {
      // Create explosion particles upon explosion
      let count = 100;
      for (let j = 0; j < count; j++) {
        particles.push(new Particle(firework.x, firework.y, firework.hue));
      }
      fireworks.splice(i, 1); // Remove the exploded firework
    } else {
      firework.edges();
    }
  }

  // 3. Update and draw explosion particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p.done()) {
      particles.splice(i, 1);
    }
  }
}

// --- Particle System Class ---
class Particle {
  constructor(x, y, hue) {
    this.position = createVector(x, y);
    // Random velocity components for explosion effect
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(2, 8));
    this.acceleration = createVector(0, 0.1); // Gravity
    this.lifespan = 255;
    this.hue = hue;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.velocity.mult(0.98); // Air resistance/drag
    this.lifespan -= 4;
  }

  show() {
    colorMode(HSB, 360, 100, 100, 100);
    stroke(this.hue, 100, 100, this.lifespan);
    strokeWeight(3);
    point(this.position.x, this.position.y);
  }

  done() {
    return this.lifespan < 0;
  }
}

// --- Firework Rocket Class ---
class Firework {
  constructor(startX, startY) {
    this.position = createVector(startX, startY);
    this.target = createVector(random(width), random(height) * 0.4); // Target in the upper half
    this.velocity = p5.Vector.sub(this.target, this.position);
    this.velocity.div(random(30, 100)); // Initial boost velocity
    this.acceleration = createVector(0, 0.1); // Gravity affects the ascent slightly
    this.hue = random(360);
    this.exploded = false;
    this.trail = []; // For drawing the rocket's path
  }

  update() {
    if (this.exploded) return;

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.trail.push(createVector(this.position.x, this.position.y));

    // Keep trail length manageable
    if (this.trail.length > 50) {
      this.trail.shift();
    }

    // Check if it reached its target altitude (or passed it)
    let distance = p5.Vector.dist(this.position, this.target);
    if (distance < 10 || this.position.y < this.target.y) {
      this.exploded = true;
    }
  }

  show() {
    if (this.exploded) return;

    // Draw trail
    stroke(this.hue, 100, 100);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      let p = this.trail[i];
      let alpha = map(i, 0, this.trail.length - 1, 0, 100);
      stroke(this.hue, 100, 100, alpha);
      point(p.x, p.y);
    }
    endShape();

    // Draw current position (head of the rocket)
    stroke(this.hue, 100, 100);
    strokeWeight(4);
    point(this.position.x, this.position.y);
  }

  edges() {
    // Simple boundary check (mostly handled by gravity and target logic)
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0, 0, 20);
}