let particles = [];
const particleCount = 400;
const textString = "TEXT + CODE";

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    
    // Map noise to a range that creates organic flow field movement
    this.noiseOffset = i; 
    this.textSize = map(noise(this.pos.x * 0.01 + this.noiseOffset), 0, 1, 10, 30);
    this.charIndex = int(map(this.noiseOffset, 0, particleCount, 0, textString.length));
    if (this.charIndex >= textString.length) {
      this.charIndex = (textString.length - 1) % textString.length;
    }
    
    // Color based on noise for a subtle gradient
    let hue = map(noise(this.pos.y * 0.02 + this.noiseOffset), 0, 1, 0, 360);
    this.hue = lerpColor(color(185, 180, 50), color(hue, 50, 100), noise(this.noiseOffset));
    this.strokeWeight = map(noise(this.pos.x * 0.02 + this.noiseOffset), 0, 1, 2, 6);
  }
  
  update() {
    // Flow field logic using noise for organic movement
    let angle = noise(this.pos.x * 0.005 + this.noiseOffset, this.pos.y * 0.005) * TWO_PI;
    if (angle < 0) {
      angle += TWO_PI;
    }
    
    // Add some randomness to the flow field for variety
    let noiseFactor = random(-0.2, 0.2);
    this.vel.setAngle(angle + noiseFactor);
    this.vel.limit(1.5);
    
    this.acc.add(this.vel);
    this.pos.add(this.acc);
    this.acc.mult(0); // Reset acceleration
    
    // Wrap around edges
    if (this.pos.x > width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = height;
    }
    
    // Simple collision with the center circle
    let centerCircle = createVector(width / 2, height / 2);
    let dist = p5.Vector.dist(this.pos, centerCircle);
    if (dist < 100) {
      this.vel.mult(-1); // Bounce off center
      this.acc.mult(0.9); // Dampen slightly
    }
  }
  
  display() {
    let char = textString.charAt(this.charIndex);
    
    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * 0.01 + this.noiseOffset);
    
    stroke(this.hue);
    strokeWeight(this.strokeWeight);
    fill(255);
    textSize(this.textSize);
    textAlign(CENTER, CENTER);
    text(char, 0, 0);
    
    // Draw a small circle behind the character
    noStroke();
    fill(this.hue, 100);
    ellipse(0, 0, this.textSize * 2.5, this.textSize * 2.5);
    
    pop();
  }
}

function draw() {
  background(30);
  
  // Draw the simple blue circle in the center as requested
  let x = width / 2;
  let y = height / 2;
  let r = 150;
  
  noStroke();
  fill(60, 180, 240);
  ellipse(x, y, r * 2, r * 2);
  
  // Add a subtle glow to the circle using noise for variation
  let noiseVal = noise(frameCount * 0.005);
  fill(60 + lerp(100, 40, noiseVal), 180 - lerp(50, 20, noiseVal), 240);
  ellipse(x + sin(noiseVal) * 5, y + cos(noiseVal) * 5, r * 2.1, r * 2.1);
  
  // Draw particles
  for (let p of particles) {
    p.update();
    p.display();
  }
}

function windowResized() {
  resize(windowWidth, windowHeight);
}