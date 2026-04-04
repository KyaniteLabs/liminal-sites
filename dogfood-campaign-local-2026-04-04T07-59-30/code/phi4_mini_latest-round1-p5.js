let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0, 0, 10); // Dark blue night sky
}

function draw() {
  // Fading background effect for trails
  fill(0, 0, 10, 10); // Slight transparency for fading
  rect(0, 0, width, height);

  // 1. Firework Launching (Creating new fireworks randomly)
  if (random(1) < 0.05) {
    let x = random(width);
    let y = height;
    let hue = random(360);
    fireworks.push(new Firework(x, y, hue));
  }

  // 2. Update and Display Fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    firework.update();
    firework.show();
    if (firework.done()) {
      fireworks.splice(i, 1);
    }
  }

  // 3. Update and Display Particles (Explosions)
  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.update();
    particle.show();
    if (particle.isDone()) {
      particles.splice(i, 1);
    }
  }
}

// --- Particle Class ---
class Particle {
  constructor(x, y, hue) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(2, 6));
    this.acc = createVector(0, 0.1); // Gravity
    this.lifespan = 100;
    this.hue = hue;
  }

  applyForce(force) {
    this.vel.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 3;
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

// --- Firework Class ---
class Firework {
  constructor(startX, startY, hue) {
    this.start = createVector(startX, startY);
    this.pos = createVector(startX, startY);
    this.target = createVector(random(width * 0.1, width * 0.9), random(height * 0.1, height * 0.5));
    this.vel = p5.Vector.sub(this.target, this.start);
    this.vel.div(random(30, 60)); // Initial speed
    this.acc = createVector(0, 0);
    this.hue = hue;
    this.exploded = false;
  }

  update() {
    if (!this.exploded) {
      // Steering towards the target point
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.acc = createVector(0, 0); // Reset acceleration for next frame
    } else {
      // If exploded, the firework object is done managing itself
    }
  }

  show() {
    if (!this.exploded) {
      // Draw the rocket trail/body
      stroke(this.hue, 100, 100, 150);
      strokeWeight(4);
      line(this.start.x, this.start.y, this.pos.x, this.pos.y);
      
      // Draw a small glow at the tip
      fill(this.hue, 100, 100, 200);
      noStroke();
      ellipse(this.pos.x, this.pos.y, 10, 10);
    }
  }

  explode() {
    let count = 100;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(this.pos.x, this.pos.y, this.hue));
    }
  }

  done() {
    return this.exploded && particles.length === 0;
  }
}

// Override the draw loop to handle firework explosion logic
function draw() {
  // Fading background effect for trails
  fill(0, 0, 10, 10); // Slight transparency for fading
  rect(0, 0, width, height);

  // 1. Launching Fireworks
  if (random(1) < 0.1) {
    let x = random(width);
    let y = height;
    let hue = random(360);
    fireworks.push(new Firework(x, y, hue));
  }

  // 2. Update and Display Fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    
    if (!firework.exploded) {
      firework.update();
      firework.show();
      
      // Check if it reached the target (or close enough)
      let distance = dist(firework.pos.x, firework.pos.y, firework.target.x, firework.target.y);
      if (distance < 10) {
        firework.exploded = true;
        firework.explode();
      }
    }
    
    // Draw a small indicator that the firework has exploded (optional)
    if (firework.exploded) {
        // We rely on particles to show the explosion now
    }

    if (firework.done()) {
      fireworks.splice(i, 1);
    }
  }

  // 3. Update and Display Particles (Explosions)
  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.update();
    particle.show();
    if (particle.isDone()) {
      particles.splice(i, 1);
    }
  }
}