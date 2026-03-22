const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let particles = [];
let targetLetter;
let collisionThreshold = 80; // Distance to trigger collision effect

function setup() {
  createCanvas(800, 600);
  pixelDensity(1); // Optimize for performance with many particles
  background(255);
  
  // Seed noise for organic movement later if we expand this
  noiseSeed(1337);
}

function draw() {
  // Slowly fade the background to create trails (optional stylistic choice)
  // Or clear it completely for crisp text collision. Let's go with clear for clarity.
  noStroke();
  fill(255);
  rect(0, 0, width, height);

  // Randomly generate a target letter to collide with
  if (frameCount % 10 === 0) {
    let randomIndex = floor(random(letters.length));
    targetLetter = letters[randomIndex];
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Move particle
    p.update();
    
    // Check collision with the target letter
    if (targetLetter !== null) {
      let dx = p.pos.x - textX;
      let dy = p.pos.y - textY;
      let dist = sqrt(dx * dx + dy * dy);
      
      if (dist < collisionThreshold) {
        // Collision happened! Explode particle or remove it
        particles.splice(i, 1);
        
        // Create a small explosion of new particles for fun effect
        createExplosion(textX, textY);
        
        targetLetter = null; // Reset target after collision
      }
    }
    
    // Check bounds - if particle goes off screen, remove it
    if (p.pos.x < 0 || p.pos.x > width || p.pos.y < 0 || p.pos.y > height) {
      particles.splice(i, 1);
    }
  }

  // Draw the target letter with a glowing effect
  if (targetLetter !== null) {
    textAlign(CENTER, CENTER);
    textSize(80);
    fill(255);
    
    // Glow effect using multiple circles
    for (let j = 0; j < 3; j++) {
      let glowSize = map(j, 0, 3, 10, 40);
      noStroke();
      fill(0, 255 - (j * 80)); // Blue to white gradient
      ellipse(textX, textY, glowSize * 2);
    }
    
    // Draw the actual letter
    fill(0);
    text(targetLetter, textX, textY);
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.radius = random(2, 6);
    this.colorHue = colorMode(HSB);
    // Random hue between blue and cyan range (180 to 280)
    this.hue = random(180, 280); 
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0); // Reset acceleration
    
    // Use noise for subtle organic wobble in movement
    let noiseVal = noise(frameCount * 0.01, this.pos.x * 0.01);
    let wobbleX = map(noiseVal, 0, 1, -this.radius/2, this.radius/2);
    this.vel.x += random(-0.05, 0.05) + wobbleX;
    
    // Keep velocity somewhat constrained by noise influence for organic feel
    if (abs(this.vel.y) < 0.1) {
       this.vel.y = random(-0.2, 0.2);
    }
  }

  display() {
    noStroke();
    fill(255, this.hue); // HSB mode
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}

function createExplosion(x, y) {
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle());
  }
}