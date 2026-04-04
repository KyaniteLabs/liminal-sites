let fireworks = [];
let gravity;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gravity = createVector(0, 0.1);
}

function draw() {
  background(0, 0, 20, 50); // Dark night sky with slight fading effect

  // Create new fireworks randomly
  if (random(1) < 0.05) {
    fireworks.push(new Firework(random(width), random(height * 0.3, height * 0.7)));
  }

  // Update and display fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    firework.update();
    firework.show();
    if (firework.done()) {
      fireworks.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D().mult(random(2, 8));
    this.acceleration = createVector(0, 0);
    this.lifespan = 255;
    this.color = color;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // Reset acceleration
    this.lifespan -= random(3, 8);
  }

  show() {
    stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
    strokeWeight(3);
    point(this.position.x, this.position.y);
  }

  isDead() {
    return this.lifespan < 0;
  }
}

class Firework {
  constructor(startX, startY) {
    this.origin = createVector(startX, startY);
    this.target = createVector(random(width), random(height * 0.2, height * 0.5));
    this.exploded = false;
    this.particles = [];
    this.hue = random(360);
    
    // Initial rocket trail properties
    this.rocket = {
      position: createVector(startX, startY),
      velocity: p5.Vector.random2D().mult(random(3, 6)),
      acceleration: createVector(0, 0),
      trail: [],
      maxTrailLength: 10
    };
    this.rocket.trail.push(createVector(startX, startY));
  }

  update() {
    if (!this.exploded) {
      this.rocket.update();
      if (this.rocket.position.y < this.target.y || this.rocket.position.x < 0 || this.rocket.x > width) {
        this.explode();
      }
    } else {
      // Update particles after explosion
      for (let i = this.particles.length - 1; i >= 0; i--) {
        let p = this.particles[i];
        p.applyForce(gravity);
        p.update();
        if (p.isDead()) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  rocketUpdate() {
    this.rocket.applyForce(gravity);
    this.rocket.velocity.add(this.rocket.acceleration);
    this.rocket.position.add(this.rocket.velocity);
    
    // Update trail
    this.rocket.trail.push(createVector(this.rocket.position.x, this.rocket.position.y));
    if (this.rocket.trail.length > this.rocket.maxTrailLength) {
      this.rocket.trail.shift();
    }
  }

  explode() {
    this.exploded = true;
    let particleCount = random(80, 150);
    let baseColor = color(this.hue, 255, 255, 255);
    
    for (let i = 0; i < particleCount; i++) {
      let p = new Particle(this.rocket.position.x, this.rocket.position.y, baseColor);
      // Give particles a random initial outward velocity
      let angle = random(TWO_PI);
      let speed = random(1, 8);
      p.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed);
      this.particles.push(p);
    }
    
    // Clear the rocket trail immediately upon explosion
    this.rocket.trail = [];
  }

  show() {
    if (!this.exploded) {
      this.rocketUpdate();
      
      // Draw rocket trail
      stroke(255, 255, 255, 150);
      strokeWeight(2);
      for (let i = 0; i < this.rocket.trail.length; i++) {
        let p = this.rocket.trail[i];
        let alpha = map(i, 0, this.rocket.trail.length - 1, 0, 150);
        stroke(255, 255, 255, alpha);
        point(p.x, p.y);
      }
      
      // Draw current rocket position
      fill(255, 255, 255);
      noStroke();
      ellipse(this.rocket.position.x, this.rocket.position.y, 5, 5);
    } else {
      // Draw particles
      for (let p of this.particles) {
        p.show();
      }
    }
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }
}