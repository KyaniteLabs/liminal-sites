let particles = [];
let words = ["COMPOST", "CREATIVE", "TECHNOLOGY", "GENERATIVE", "ART"];

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
  background(255);
  
  // Seed noise for organic variation
  noiseSeed(42);
  
  // Initialize particles with text data
  for (let i = 0; i < 300; i++) {
    let w = random(words.length);
    let charIndex = random(int(w.length));
    let c = words[w][charIndex];
    
    particles.push({
      x: width / 2 + random(-width/2, width/2),
      y: height / 2 + random(-height/2, height/2),
      vx: noise(i * 0.1) * 2 - 1,
      vy: (noise(i * 0.15) * 2 - 1) * 0.5, // More vertical gravity feel
      size: random(4, 12),
      char: c,
      speed: noise(i * 0.3 + date()) * 2 + 1
    });
  }
}

function draw() {
  background(255);
  
  // Draw the simple blue circle in center
  noStroke();
  fill(68, 114, 196);
  ellipse(width/2, height/2, 300, 300);
  
  // Draw text particles colliding with circle
  let cx = width / 2;
  let cy = height / 2;
  let radius = 150;
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position with noise-based velocity
    p.x += p.vx * p.speed + noise(i, frameCount * 0.02) * 2;
    p.y += p.vy * p.speed;
    
    // Friction to slow down slightly
    p.vx *= 0.96;
    p.vy *= 0.96;
    
    // Bounce off edges
    if (p.x < 0 || p.x > width) {
      p.vx = -p.vx * 0.8;
      p.x = constrain(p.x, 0, width);
    }
    if (p.y < 0 || p.y > height) {
      p.vy = -p.vy * 0.8;
      p.y = constrain(p.y, 0, height);
    }
    
    // Calculate distance to center circle
    let dx = p.x - cx;
    let dy = p.y - cy;
    let dist = sqrt(dx*dx + dy*dy);
    
    // Collision detection with blue circle
    if (dist < radius) {
      // Repel from center
      let angle = atan2(dy, dx);
      let force = map(dist, 0, radius, 10, 3);
      
      p.vx -= cos(angle) * force;
      p.vy -= sin(angle) * force;
      
      // Add some noise to the repulsion for organic feel
      p.vx += noise(i + frameCount * 0.05) * 2;
      p.vy += noise(i + frameCount * 0.07) * 2;
    }
    
    // Draw text
    push();
    translate(p.x, p.y);
    rotate(frameCount * 0.001 + i * 0.05); // Slow rotation
    
    // Color based on distance from center (gradient effect)
    let hueVal = map(dist, radius, width/2, 240, 360); // Blue to Purple
    fill(hueVal, 80, 100);
    
    textAlign(CENTER, CENTER);
    textSize(p.size * map(frameCount % 50, 0, 50, 0.7, 1.3));
    text(p.char, 0, 0);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}