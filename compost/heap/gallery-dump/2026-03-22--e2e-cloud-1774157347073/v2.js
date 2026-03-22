let letters = [];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const colors = [0, 100, 255];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  noiseSeed(42);
  
  // Create initial burst of letters
  for (let i = 0; i < 300; i++) {
    let x = random(width);
    let y = random(height);
    
    letters.push({
      char: alphabet.charAt(floor(random(alphabet.length))),
      x: x,
      y: y,
      vx: noise(i + frameCount * 0.1) * 2 - 1,
      vy: noise(i * 3 + frameCount * 0.1) * 2 - 1,
      size: map(noise(i), 0, 1, 5, 25),
      alpha: map(noise(i * 2), 0, 1, 0, 100),
      life: random(300)
    });
  }
}

function draw() {
  background(8); // Dark blue background
  
  // Spawn new letters periodically based on noise
  if (noise(frameCount * 0.015) > 0.95) {
    let x = random(width);
    let y = random(height);
    
    letters.push({
      char: alphabet.charAt(floor(random(alphabet.length))),
      x: x,
      y: y,
      vx: noise(x * 1234 + frameCount * 0.1) * 0.8 - 0.4,
      vy: noise(y * 5678 + frameCount * 0.1) * 0.8 - 0.4,
      size: map(noise(x), 0, 1, 3, 18),
      alpha: map(noise(y), 0, 1, 0, 255),
      life: random(400) + 300
    });
  }
  
  // Update and draw all letters with collision simulation
  for (let i = 0; i < letters.length; i++) {
    let p1 = letters[i];
    
    // Move particle based on noise-driven velocity
    p1.x += p1.vx * map(noise(p1.life * 0.05), 0, 1, 0.8, 2);
    p1.y += p1.vy * map(noise(p1.life * 0.07), 0, 1, 0.8, 2);
    
    // Update life and alpha
    p1.life--;
    p1.alpha = lerp(p1.alpha, map(p1.life / 400, 0, 1, 0, 255), 0.05);
    p1.size *= 0.99;
    
    // Simple collision detection and interaction
    for (let j = i + 1; j < letters.length; j++) {
      let p2 = letters[j];
      
      let dx = p1.x - p2.x;
      let dy = p1.y - p2.y;
      let dist = sqrt(sq(dx) + sq(dy));
      
      // Collision response if close enough
      if (dist < 50 && p1.size > 3 && p2.size > 3) {
        let angle = atan2(dy, dx);
        
        // Push apart based on noise influence for organic movement
        let force = map(noise(p1.life + p2.life), 0, 1, -0.5, 0.5);
        let separation = (p1.size + p2.size) / 2 + 5;
        
        if (dist < separation) {
          let overlap = separation - dist;
          let ax = (dx / dist) * force * overlap;
          let ay = (dy / dist) * force * overlap;
          
          // Apply subtle repulsion and noise influence to velocities
          p1.vx -= ax * 0.05 + noise(p1.x + p2.x, frameCount * 0.01) * 0.3;
          p1.vy -= ay * 0.05 + noise(p1.y + p2.y, frameCount * 0.01) * 0.3;
          
          p2.vx += ax * 0.05 - noise(p1.x + p2.x, frameCount * 0.01) * 0.3;
          p2.vy += ay * 0.05 - noise(p1.y + p2.y, frameCount * 0.01) * 0.3;
          
          // Increase size slightly on collision for visual feedback
          if (frameCount % 60 === 0 && dist < separation - 2) {
            p1.size += 2;
            p2.size += 2;
          }
        }
      }
    }
    
    // Draw the blue circle letter
    push();
    translate(p1.x, p1.y);
    noStroke();
    fill(0, 80 + (p1.life % 30), 255, p1.alpha);
    ellipse(0, 0, p1.size);
    
    // Draw the letter in white for contrast
    push();
    translate(p1.x, p1.y);
    fill(255);
    textSize(p1.size / 3);
    textAlign(CENTER, CENTER);
    text(p1.char, 0, 0);
    pop();
    
    // Remove dead particles
    if (p1.life <= 0 || p1.x < -100 || p1.x > width + 100 || 
        p1.y < -100 || p1.y > height + 100) {
      letters.splice(i, 1);
      i--;
    } else {
      i++;
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}