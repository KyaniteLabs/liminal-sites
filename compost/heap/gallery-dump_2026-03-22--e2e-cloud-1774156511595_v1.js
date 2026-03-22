let particles = [];
const particleCount = 800;
const spacing = 30; // Approximate spacing to fit on screen

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(240);
  
  noiseSeed(1967); // Fixed seed for consistent results
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  let blueCircle;
  if (mouseIsPressed) {
    background(240);
    
    // Create a new circle at mouse position
    blueCircle = new Circle(mouseX, mouseY, 150);
    
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      
      // Calculate distance to the center of the blue circle
      let dx = p.pos.x - blueCircle.pos.x;
      let dy = p.pos.y - blueCircle.pos.y;
      let dist = sqrt(dx * dx + dy * dy);
      
      // Interaction: Particles move away from the circle if close, but drift with noise otherwise
      if (dist < 200) {
        // Repulsion force based on distance
        let force = map(dist, 0, 200, 5, 0.1);
        p.vel.x -= dx * force;
        p.vel.y -= dy * force;
      } else {
        // Natural drift using Perlin noise (collision avoidance simulation)
        p.move();
        
        // Keep particles within bounds with soft bounce
        if (p.pos.x > width || p.pos.x < 0) p.vel.x *= -1;
        if (p.pos.y > height || p.pos.y < 0) p.vel.y *= -1;
      }
      
      // Update position and draw
      p.update();
      p.show();
    }
    
  } else {
    background(240);
    noStroke();
    fill(35, 89, 174); // Blue color
    
    // Draw a simple blue circle in the center when not interacting
    ellipse(width / 2, height / 2, 150);
    
    // Optional: Show noise field lines for visual interest
    drawNoiseField();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(240);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    // Initial velocity based on noise for organic flow
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.acc = createVector(0, 0);
    
    // Color varies slightly with position using noise
    let n = noise(this.pos.x * 0.01, this.pos.y * 0.01) * 50;
    this.color = color(240 - n, 240 - n, 240 - n); // Light gray/white particles
    
    this.r = random(2, 6);
  }
  
  move() {
    // Accelerate based on Perlin noise (flow field influence)
    let angle = NOISE_PERLIN(this.pos.x * 0.01 + frameCount * 0.005, this.pos.y * 0.01) * TAU;
    let speed = random(0.2, 1.5);
    
    let forceVector = p5.Vector.fromAngle(angle).mult(speed);
    this.acc.add(forceVector);
    
    // Apply acceleration and update velocity/position
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    // Reset acceleration to prevent runaway speed
    this.acc.mult(0.98);
  }
  
  show() {
    stroke(this.color);
    noFill();
    line(this.pos.x, this.pos.y, 
          this.pos.x + this.vel.x * 5, this.pos.y + this.vel.y * 5);
    
    // Draw a small dot at the particle's position
    point(this.pos.x, this.pos.y);
  }
  
  update() {
    this.move();
  }
}

class Circle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.angle = random(TWO_PI);
  }
  
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * 0.02 + this.angle);
    
    noStroke();
    fill(35, 89, 174, 255); // Solid blue
    
    ellipse(0, 0, this.r * 2);
    
    pop();
  }
}

// Helper to draw a subtle noise background when not interacting
function drawNoiseField() {
  strokeWeight(1);
  noFill();
  
  for (let i = 0; i < width * height / 5; i++) {
    let x = random(width);
    let y = random(height);
    
    // Use noise to determine length and color of lines
    let nX = noise(x * 0.01, frameCount * 0.002);
    let len = map(nX, 0, 1, 10, 60);
    
    push();
    translate(x, y);
    rotate(TWO_PI * nX);
    
    stroke(35 + nX * 80, 89 + nX * 100, 174 + nX * 50); // Tinted blue lines
    line(0, 0, len, 0);
    pop();
  }
}