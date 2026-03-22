let particles = [];
let textStrings = ["COLLISION", "IMPACT", "CRASH", "BOOM", "SMASH"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(255);
  
  // Seed the noise function for consistent organic patterns
  noiseSeed(1337);
  
  // Initialize particles at random positions with different velocities
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.acc = createVector();
    this.size = random(4, 8);
    
    // Assign a text string to each particle for the collision effect
    this.text = textStrings[Math.floor(random(textStrings.length))];
    this.alpha = 255;
    this.fadeRate = random(0.5, 1.5);
  }
  
  update() {
    // Apply noise-based forces to create organic movement
    let noiseVal = noise(this.pos.x * 0.003, this.pos.y * 0.003, frameCount * 0.01);
    
    // Create a subtle attraction/repulsion field based on Perlin noise
    let forceX = map(noiseVal, 0, 1, -0.5, 0.5);
    let forceY = map(noise(this.pos.x * 0.003 + 1), 0, 1, -0.5, 0.5); // Offset noise for variation
    
    this.acc.add(p5.Vector.set(forceX * 0.1, forceY * 0.1));
    
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    // Check boundaries and bounce
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
    }
    
    // Fade out slowly to simulate collision aftermath
    if (this.alpha > 0) {
      this.alpha -= this.fadeRate;
    } else {
      // Reset particle after fading completely for continuous animation
      this.pos = createVector(random(width), random(height));
      this.vel = p5.Vector.random2D().mult(random(1, 3));
      this.acc = createVector();
      this.alpha = 255;
    }
  }
  
  draw() {
    noStroke();
    
    // Draw the blue circle (the core request)
    fill(0, 100, 255, this.alpha);
    ellipse(this.pos.x, this.pos.y, this.size);
    
    // Draw the text around it to create the "collision" visual effect
    if (this.text) {
      push();
      translate(this.pos.x, this.pos.y - this.size/2);
      rotate(frameCount * 0.05 + random(PI)); // Spin slightly
      
      fill(0, 100, 255, this.alpha / 3);
      textSize(this.size * 1.5);
      textAlign(CENTER, TOP);
      text(this.text, 0, 0);
      
      // Add a simple outline effect for the text to make it stand out more during "collision"
      noFill();
      stroke(255, 255, 255, this.alpha / 3);
      textSize(this.size * 1.2);
      textAlign(CENTER, TOP);
      text(this.text, 0, 0);
      
      pop();
    }
  }
}

function draw() {
  // Clear with a slight trail effect for motion blur feel
  fill(245, 245, 250, 180); 
  noStroke();
  rect(0, 0, width, height);
  
  for (let p of particles) {
    p.update();
    p.draw();
  }
}