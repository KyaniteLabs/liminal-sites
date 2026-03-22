const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let particles = [];

class Particle {
  constructor() {
    this.init();
  }

  init() {
    this.x = random(width);
    this.y = random(height);
    let charIndex = floor(random(letters.length));
    this.char = letters[charIndex];
    
    // Create a blue circle around the text
    this.radius = random(10, 25);
    this.speedX = noise(this.x + frameCount * 0.01) * 2 - 1;
    this.speedY = noise(this.y + frameCount * 0.01) * 2 - 1;
    
    // Color variation based on noise for organic blue tones
    let hue = map(noise(this.x, this.y), 0, 1, 180, 240);
    this.color = color(hue, 50, 255);
  }

  update() {
    // Move particle based on noise-driven velocity
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Wrap around screen edges
    if (this.x < -50) this.x = width + 50;
    if (this.x > width + 50) this.x = -50;
    if (this.y < -50) this.y = height + 50;
    if (this.y > height + 50) this.y = -50;

    // Randomly regenerate properties to keep movement organic
    if (frameCount % 2 === 0) {
      let charIndex = floor(random(letters.length));
      this.char = letters[charIndex];
      
      let hue = map(noise(this.x, this.y), 0, 1, 180, 240);
      this.color = color(hue, 50, 255);
    }
    
    // Slight size variation
    if (frameCount % 3 === 0) {
       this.radius += random(-1, 1);
       if(this.radius < 5) this.radius = 5;
       if(this.radius > 30) this.radius = 30;
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    
    // Draw the blue circle first (background of text)
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.radius * 2);
    
    // Then draw the text on top
    textAlign(CENTER, CENTER);
    textSize(this.radius);
    fill(0);
    textStyle(BOLD);
    text(this.char, 0, 0);
    
    pop();
  }
}

function draw() {
  background(15); // Dark background to make blue pop
  
  // Create particles on a timer to control density
  if (frameCount % 2 === 0) {
    particles.push(new Particle());
  }
  
  for (let p of particles) {
    p.update();
    p.show();
  }
}