let fireworks = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  // Fading background for trail effect
  background(0, 0, 0, 50);

  // 1. Launch new fireworks randomly
  if (random(1) < 0.1) {
    let x = random(width * 0.1, width * 0.9);
    let y = height;
    let targetY = random(height * 0.1, height * 0.4);
    fireworks.push(new Firework(x, y, x, targetY));
  }

  // 2. Update and Draw Fireworks (Rockets ascending)
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let f = fireworks[i];
    f.update();
    f.show();
    if (f.done) {
      // When done, create explosion particles
      let explosionParticles = f.explode();
      particles.push(...explosionParticles);
      fireworks.splice(i, 1);
    }
  }

  // 3. Update and Draw Particles (Sparks falling)
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
  constructor(startX, startY, targetX, targetY) {
    this.start = createVector(startX, startY);
    this.target = createVector(targetX, targetY);
    this.pos = this.start.copy();
    
    // Calculate initial velocity to reach the target
    let dist = p5.Vector.sub(this.target, this.start);
    let distance = dist.mag();
    let speed = random(5, 10); // Base speed
    
    this.vel = dist.div(distance)
    this.vel.mult(speed);
    
    this.exploded = false;
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    if (this.exploded) return;
    
    // Simple physics: Apply velocity until target is reached or passed
    this.pos.add(this.vel);
    
    // Check if we are close enough to the target altitude (y-axis check is sufficient for simplicity)
    if (this.pos.y <= this.target.y + 5) {
      this.exploded = true;
    }
  }

  show() {
    if (!this.exploded) {
      stroke(this.color);
      strokeWeight(3);
      point(this.pos.x, this.pos.y);
    }
  }

  explode() {
    if (this.exploded) {
      let numParticles = 80;
      let explosion = [];
      for (let i = 0; i < numParticles; i++) {
        explosion.push(new Particle(this.pos.x, this.pos.y, this.color));
      }
      return explosion;
    }
    return [];
  }

  get done() {
    return this.exploded;
  }
}

class Particle {
  constructor(x, y, color) {
    this.pos = createVector(x, y);
    this.lifespan = 255;
    this.color = color;
    
    // Give it a random initial velocity radiating outwards
    let angle = random(TWO_PI);
    let speed = random(1, 8);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(speed);
    
    this.acc = createVector(0, 0.15); // Gravity
  }

  update() {
    // Apply velocity and acceleration (gravity)
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    // Fade over time
    this.lifespan -= 5; 
  }

  show() {
    stroke(this.color, this.lifespan);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
  }

  isDone() {
    return this.lifespan < 0;
  }
}