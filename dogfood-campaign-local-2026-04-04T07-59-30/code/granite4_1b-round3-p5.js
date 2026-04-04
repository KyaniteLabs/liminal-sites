let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0, 0, 20, 50); // Slight fade for trails
  
  // Spawn new firework occasionally
  if (random(1) < 0.08) {
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
    this.explodedTimer = 0;
    this.maxExplosionTime = 100;
    
    // Initial velocity simulating launch upwards
    this.vx = random(-2, 2);
    this.vy = random(-12, -18);
    this.gravity = 0.1;
    this.particlesToCreate = 80;
  }

  update() {
    if (!this.exploded) {
      // Rocket flight phase
      this.vy += this.gravity * 0.5; // Less gravity while flying up
      this.x += this.vx;
      this.y += this.vy;

      // Check if it's time to explode (e.g., reached a certain height or time)
      if (this.y < height * 0.3 || this.vy >= 0) {
        this.explode();
      }
    } else {
      // Explosion fading phase
      this.explodedTimer++;
    }
  }

  explode() {
    this.exploded = true;
    // Create particles upon explosion
    for (let i = 0; i < this.particlesToCreate; i++) {
      particles.push(new Particle(this.x, this.y, this.hue));
    }
  }

  show() {
    if (!this.exploded) {
      stroke(this.hue, 255, 255);
      strokeWeight(3);
      point(this.x, this.y);
    } else {
      // Optional: Draw a faint residual glow for the firework object itself
      noStroke();
      fill(this.hue, 255, 255, 50);
      ellipse(this.x, this.y, 1, 1);
    }
  }

  done() {
    return this.explodedTimer > this.maxExplosionTime;
  }
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-10, -1);
    this.gravity = 0.15;
    this.lifespan = 255;
    this.hue = hue;
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    
    // Apply slight air resistance/drag
    this.vx *= 0.98;
    this.vy *= 0.98;
    
    this.lifespan -= 5;
  }

  show() {
    colorMode(HSB, 360, 100, 100, 100);
    stroke(this.hue, 100, 100, this.lifespan);
    strokeWeight(4);
    point(this.x, this.y);
  }

  done() {
    return this.lifespan < 0;
  }
}