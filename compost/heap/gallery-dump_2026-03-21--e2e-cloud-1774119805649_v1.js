let particles = [];
let textElement;
const fontSize = 48;
const padding = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Optimize for particle systems
  
  // Seed noise for organic movement later
  noiseSeed(12345);
  
  textElement = createElement('div', 'COLLISION');
  textElement.position(width / 2 - padding / 2, height / 2 - padding / 2);
  textElement.size(padding * 2, fontSize * 2.5);
  textElement.style('fontFamily', 'monospace');
  textElement.style('textAlign', 'center');
  textElement.style('textColor', '#00ffff');
}

function draw() {
  background(10); // Dark blue-grey background
  
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    checkCollision(p);
    p.update();
    p.show();
    
    if (p.edges()) {
      particles.splice(i, 1);
    }
  }
  
  // Add new particle occasionally
  if (frameCount % 10 === 0) {
    let x = random(width);
    let y = random(height);
    particles.push(new Particle(x, y));
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // Use Perlin noise for smooth velocity variations instead of pure random
    let speed = map(noise(frameCount * 0.01 + x), 0, 1, -2, 2);
    let angle = noise(frameCount * 0.01 + y) * TWO_PI;
    
    this.vel = p5.Vector.fromAngle(angle).mult(speed);
    this.acc = createVector(0, 0);
    this.r = random(5, 15);
    this.colorHue = map(noise(frameCount * 0.05), 0, 1, 180, 240); // Cyan to Blue range
  }
  
  update() {
    // Subtle noise-based acceleration for organic drift
    let nX = noise(this.pos.x * 0.01 + frameCount * 0.005) - 0.5;
    let nY = noise(this.pos.y * 0.01 + frameCount * 0.005) - 0.5;
    
    this.acc.add(nX, nY).mult(0.02); // Light influence
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0); // Reset accel
  }
  
  show() {
    strokeWeight(1);
    noFill();
    
    // Calculate color based on noise for smooth gradients
    let hueVal = map(noise(frameCount * 0.02 + this.pos.y), 0, 1, 190, 230);
    stroke(hueVal, 80, 255);
    
    circle(this.pos.x, this.pos.y, this.r);
  }
  
  edges() {
    return (this.pos.x < -this.r || this.pos.x > width + this.r || 
            this.pos.y < -this.r || this.pos.y > height + this.r);
  }
}

function checkCollision(p) {
  // Simple distance-based collision with the text element
  let tx = textElement.position().x;
  let ty = textElement.position().y;
  
  let dx = p.pos.x - tx;
  let dy = p.pos.y - ty;
  let dist = sqrt(dx*dx + dy*dy);
  
  // Text padding radius
  let tRadius = width / 2.5; 
  
  if (dist < tRadius) {
    // Repel logic: push particle away from text center
    let forceDirection = p5.Vector.sub(p.pos, createVector(tx, ty));
    forceDirection.setMag(0.5);
    
    p.vel.add(forceDirection.mult(2));
    
    // Change color on collision for visual feedback
    p.colorHue = map(sin(frameCount * 0.1), -1, 1, 180, 240);
  }
}

function windowResized() {
  resizeWindow();
}

function resizeWindow() {
  createCanvas(windowWidth, windowHeight);
  
  // Re-center text element
  let padding = 50;
  textElement.position(width / 2 - padding / 2, height / 2 - padding / 2);
}