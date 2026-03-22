const particles = [];
let textStrings = ["A", "B", "C", "D", "E"];
let fontSize = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(15, 23, 42); // Dark blue background
  
  noiseSeed(12345);
  
  for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  noStroke();
  
  // Use Perlin noise to create a slow, organic flow field background
  let xoff = frameCount * 0.002;
  for (let i = 0; i < width; i += 5) {
    for (let j = 0; j < height; j += 5) {
      let n = noise(xoff + i * 0.01, j * 0.01);
      if (n > 0.8) {
        fill(23, 40, 76, 50); // Darker blue dots for flow effect
        ellipse(i, j, 1 + n * 2, 1 + n * 2);
      }
    }
  }

  // Draw the simple blue circle in the center with a slight noise-based pulse
  let centerX = width / 2;
  let centerY = height / 2;
  
  // Use noise to create a subtle, organic pulsing effect on the circle's radius and color
  let pulse = map(noise(frameCount * 0.01) + ioff * 0.5, 0, 1, 10, -10);
  let currentRadius = 80 + pulse;
  
  fill(64, 224, 208, 200); // Light blue/cyan circle
  noStroke();
  ellipse(centerX, centerY, currentRadius * 2);
  
  strokeWeight(1);
  stroke(15, 23, 42, 255);
  ellipse(centerX, centerY, currentRadius * 2.01); // Slightly larger outline for definition

  // Add floating text elements that interact with the flow field concept
  drawTextElements();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(15, 23, 42);
}

class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(0.5);
    this.acc = createVector(0, 0);
    
    // Assign a text string to the particle
    this.text = textStrings[floor(random(textStrings.length))];
    
    // Random size and color variation based on noise
    let n = random();
    this.size = map(n, 0, 1, 5, 20);
    this.alpha = map(noise(this.pos.x * 0.01 + this.pos.y * 0.01), 0, 1, 30, 200);
    
    // Color based on noise seed
    let hueVal = map(noise(this.pos.x * 0.05), 0, 1, 180, 240); // Blue to Cyan range
    this.color = color(hueVal, 60, 90, this.alpha);
    
    // Collision boundary check setup
    this.boundHit = false;
    this.hitTimer = 0;
  }
  
  applyForce(force) {
    this.acc.add(p5.Vector.sub(createVector(width/2 + random(-100, 100), height/2 + random(-100, 100)), this.pos).setMag(0.05));
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0); // Reset acceleration
    
    // Bounce off edges with some randomness
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
      this.hitTimer = 10;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
      this.hitTimer = 10;
    }
    
    // Friction to slow down particles over time
    this.vel.mult(0.98);
    
    // If hit boundary recently, reduce movement
    if (this.hitTimer > 0) {
      this.hitTimer--;
      this.vel.mult(0.5);
    } else if (this.pos.x < 10 || this.pos.x > width - 10 || 
               this.pos.y < 10 || this.pos.y > height - 10) {
        // Gentle attraction to center of screen
        let desired = p5.Vector.sub(createVector(width/2, height/2), this.pos);
        desired.setMag(0.5);
        let steer = p5.Vector.sub(desired, this.vel).limit(0.4);
        this.applyForce(steer);
    }
  }
  
  display() {
    // Use noise to create organic variation in position slightly
    let nX = this.pos.x + noise(this.hitTimer * 0.1) * 5;
    let nY = this.pos.y + noise(this.hitTimer * 0.1) * 5;
    
    fill(this.color);
    noStroke();
    ellipse(nX, nY, this.size);
    
    // Draw text occasionally based on noise value to make it "appear" organically
    if (noise(frameCount + this.pos.x * 0.01) > 0.7) {
      push();
      translate(nX, nY);
      textSize(fontSize / 4);
      textAlign(CENTER, CENTER);
      fill(255, 255, 255, this.alpha);
      text(this.text, 0, 0);
      pop();
    }
    
    // Reset particle if it goes too far or hits something (simulated collision)
    if (this.hitTimer === 0 && abs(this.vel.x) < 0.1 && abs(this.vel.y) < 0.1) {
      if (random() > 0.995) {
        this.reset();
      }
    }
  }
}

function drawTextElements() {
  let textX = width / 2 + random(-50, 50);
  let textY = height / 2 + random(-50, 50);
  
  // Use noise to determine if we should draw the main title or subtitle
  if (noise(frameCount * 0.02) > 0.95) {
    push();
    translate(textX, textY);
    
    textSize(48);
    textAlign(CENTER, CENTER);
    fill(100, 200, 230, 100); // Light blue with low opacity
    noStroke();
    text("COLLISION", 0, 0);
    
    textSize(16);
    fill(255, 255, 255, 80);
    text("Simple Blue Circle", 0, 30);
    
    pop();
  }
}