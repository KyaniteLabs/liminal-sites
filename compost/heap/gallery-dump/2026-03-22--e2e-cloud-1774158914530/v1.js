let particleCount = 200;
let particles = [];
let textStrings = ["COMPOST", "GENERATIVE", "ART", "FLOW"];
let mouseX, mouseY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(255);
  
  // Seed noise for organic flow
  noiseSeed(42);
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  noStroke();
  fill(30, 144, 255); // Simple blue
  
  // Draw a simple blue circle in the center as requested
  let centerX = width / 2;
  let centerY = height / 2;
  
  push();
  translate(centerX, centerY);
  ellipse(0, 0, 150);
  pop();

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    
    // Check collision with the central blue circle
    let dx = particles[i].pos.x - centerX;
    let dy = particles[i].pos.y - centerY;
    let dist = sqrt(dx * dx + dy * dy);
    
    if (dist < 75) {
      // Collision detected: reset particle to edge of screen with random velocity
      particles[i].reset();
      
      // Display collision text briefly near the center
      displayCollisionText(centerX, centerY, dist);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    // Start from random position on screen edge
    let side = floor(random(4));
    if (side === 0) {
      this.pos = createVector(random(width), 0);
    } else if (side === 1) {
      this.pos = createVector(random(width), height);
    } else if (side === 2) {
      this.pos = createVector(0, random(height));
    } else {
      this.pos = createVector(width, random(height));
    }
    
    // Random velocity directed towards center with some noise influence
    let angle = atan2(centerY - this.pos.y, centerX - this.pos.x);
    let speed = map(noise(millis() * 0.01 + i), 0, 1, 2, 6);
    
    // Add organic variation using noise
    angle += noise(millis() * 0.05) * 0.2;
    
    this.vel = p5.Vector.fromAngle(angle).mult(speed);
    
    this.acc = createVector(0, 0);
    this.maxSpeed = 8;
    this.color = color(random(100), random(150), random(200));
  }
  
  update() {
    // Apply slight gravity towards center for organic feel
    let gX = (centerX - this.pos.x) * 0.0005;
    let gY = (centerY - this.pos.y) * 0.0005;
    
    this.acc.add(createVector(gX, gY));
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    
    // Friction
    this.vel.mult(0.98);
  }
  
  show() {
    stroke(this.color);
    point(this.pos.x, this.pos.y);
  }
}

function displayCollisionText(cx, cy, dist) {
  // Use a simple text rendering approach without createP()
  push();
  translate(cx, cy - 30 + (dist * 0.5));
  
  let textSize = map(dist, 0, 75, 40, 12);
  textAlign(CENTER, TOP);
  textSize(textSize);
  fill(0, 150, 255);
  text("COLLISION!", 0, 0);
  
  textSize(20);
  fill(0);
  text(str(dist), 0, -30);
  
  pop();
}