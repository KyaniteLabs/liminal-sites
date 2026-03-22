let particles;
let cellCount = 0;
let targetCellCount = 150;
let time = 0;

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
  background(255);
  
  particles = [];
  
  // Create initial population of blue cells
  for (let i = 0; i < targetCellCount; i++) {
    addParticle();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  
  // Slowly rotate the view for organic movement feel
  time += 0.001;
  let angle = noise(time * 0.2) * PI;
  
  push();
  translate(width / 2, height / 2);
  rotate(angle);
  pop();
  
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Move particle using noise for smooth organic drift
    let xMove = noise(p.x * 0.01 + time) * 2 - 1;
    let yMove = noise(p.y * 0.01 + time * 1.5) * 2 - 1;
    
    p.x += xMove;
    p.y += yMove;
    
    // Keep particles within bounds with soft edges
    if (p.x < -width/2 || p.x > width/2 || p.y < -height/2 || p.y > height/2) {
      particles.splice(i, 1);
      addParticle();
    }
    
    drawCell(p);
  }
  
  // Draw central hub effect
  fill(0, 50);
  noStroke();
  circle(0, 0, 80);
}

function addParticle() {
  let x = random(-width / 2 - 100, width / 2 + 100);
  let y = random(-height / 2 - 100, height / 2 + 100);
  
  particles.push({
    x: x,
    y: y,
    size: noise(x * 0.05) * 4 + 3
  });
}

function drawCell(p) {
  let baseHue = 200; // Blue hue
  
  // Add organic variation to color using noise
  let saturation = map(noise(p.x, p.y), 0, 1, 60, 100);
  let lightness = map(noise(time + p.x * 0.05), 0, 1, 40, 70);
  
  // Make size pulse slightly
  let size = p.size;
  size *= (noise(p.y) + 1);
  
  fill(baseHue, saturation, lightness);
  noStroke();
  
  ellipse(p.x, p.y, size, size);
}