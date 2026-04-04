let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(0, 0, 10, 10); // Dark blue night sky with slight fade effect

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
    let p = particles[i];
    p.update();
    p.show();
    if (p.isDone()) {
      particles.splice(i, 1);
    }
  }
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = random(width * 0.2, width * 0.8);
    this.targetY = random(height * 0.2, height * 0.6);
    this.angle = atan2(this.targetY - this.y, this.targetX - this.x);
    this.speed = random(8, 15);
    this.vx = cos(this.angle) * this.speed;
    this.vy = sin(this.angle) * this.speed;
    this.hue = random(360);
    this.exploded = false;
    this.trail = [];
    this.maxTrailLength = 10;
  }

  update() {
    if (!this.exploded) {
      let distance = dist(this.x, this.y, this.targetX, this.targetY);
      if (distance < 15) {
        this.explode();
      } else {
        this.x += this.vx;
        this.y += this.vy;
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
        }
      }
    } else {
      // Firework is exploding, its particles are handled separately
    }
  }

  explode() {
    this.exploded = true;
    let particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(this.x, this.y, this.hue));
    }
  }

  show() {
    if (!this.exploded) {
      // Draw tail trail
      stroke(this.hue, 100, 100, 150);
      strokeWeight(2);
      beginShape();
      for (let i = 0; i < this.trail.length; i++) {
        let p = this.trail[i];
        let alpha = map(i, 0, this.trail.length - 1, 0, 100);
        stroke(this.hue, 100, 100, alpha * (i / this.trail.length));
        point(p.x, p.y);
      }
      endShape();
      
      // Draw current position (bright dot)
      fill(this.hue, 100, 100);
      noStroke();
      ellipse(this.x, this.y, 8, 8);
    }
  }

  done() {
    return this.exploded && this.trail.length === 0; // Simple check, relies on particles being removed
  }
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.lifespan = 100;
    this.alpha = 100;
    
    // Random initial velocity for explosion effect
    let angle = random(TWO_PI);
    let speed = random(1, 8);
    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;
  }

  update() {
    // Apply gravity
    this.vy += 0.1;
    
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    
    // Apply friction/drag (slow down slightly)
    this.vx *= 0.98;
    this.vy *= 0.98;
    
    // Fade over time
    this.alpha -= 1.5;
    this.lifespan -= 1;
  }

  show() {
    stroke(this.hue, 100, 100, this.alpha);
    strokeWeight(3);
    point(this.x, this.y);
  }

  isDone() {
    return this.alpha < 0 || this.y > height * 1.1;
  }
}