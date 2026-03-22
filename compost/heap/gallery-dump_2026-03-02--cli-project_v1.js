function setup() {
  createCanvas(800, 600);
  // Initialize particle system with blue circles
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(random(width), random(height), color(135, 206, 235)));
  }
}

function draw() {
  background(28, 42, 85); // Deep blue background
  
  // Draw each particle
  for (let p of particles) {
    p.update();
    p.display();
  }
}

class Particle {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D(0, 0, 1, 1).mult(random(1, 3));
    this.col = col;
    this.size = random(10, 20);
    this.radius = this.size / 2;
  }
  
  update() {
    this.pos.add(this.vel);
    // Wrap around canvas edges
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }
  
  display() {
    stroke(200, 220);
    strokeWeight(1);
    fill(this.col, 150); // Semi-transparent blue
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}