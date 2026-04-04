let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  // Dark blue/black background simulates night sky with slight fading trail effect
  background(0, 0, 0, 15); 

  // Launch new firework occasionally
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

  // Update and draw explosion particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p.isFinished()) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y, hue) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(2, 10));
    this.acc = createVector(0, 0.1); // Gravity
    this.lifespan = 100;
    this.hue = hue;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.add(0, 0.02); // Slight constant gravity pull
    this.lifespan -= 3;
  }

  show() {
    stroke(this.hue, 100, 100, this.lifespan / 100);
    strokeWeight(3);
    point(this.pos.x, this.pos.y);
  }

  isFinished() {
    return this.lifespan < 0;
  }
}

class Firework {
  constructor(startX, startY) {
    this.origin = createVector(startX, startY);
    this.target = createVector(random(width), random(height) * 0.6); // Target in upper half
    this.hue = random(360);
    this.exploded = false;
    
    // Rocket body particle
    this.rocket = new Particle(startX, startY, this.hue);
    this.rocket.vel = p5.Vector.sub(this.target, this.origin);
    this.rocket.vel.div(60); // Adjust initial velocity for controlled ascent
    this.exploded = false;
  }

  update() {
    if (!this.exploded) {
      this.rocket.update();
      if (dist(this.rocket.pos.x, this.rocket.pos.y, this.target.x, this.target.y) < 15 || this.rocket.vel.y > 0) {
        this.explode();
        this.exploded = true;
      }
    }
  }

  explode() {
    let explosionCount = 100;
    for (let i = 0; i < explosionCount; i++) {
      particles.push(new Particle(this.rocket.pos.x, this.rocket.pos.y, this.hue));
    }
  }

  show() {
    if (!this.exploded) {
      this.rocket.show();
    }
    // If exploded, the particles handle the drawing
  }

  done() {
    return this.exploded && particles.length === 0;
  }
}