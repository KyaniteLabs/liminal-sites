const textList = [
  {text: "P", pos: createVector(20, 50)},
  {text: "E", pos: createVector(60, 50)},
  {text: "R", pos: createVector(100, 50)},
  {text: "L", pos: createVector(140, 50)},
  {text: "I", pos: createVector(180, 50)},
  {text: "A", pos: createVector(220, 50)},
  {text: "N", pos: createVector(260, 50)},
  {text: "S", pos: createVector(300, 50)},
  {text: "E", pos: createVector(340, 50)}
];

let particles = [];
let textIndex = 0;
let targetX = 0;
let targetY = 0;

function setup() {
  let cnv = createCanvas(800, 600);
  pixelDensity(1);
  background(255);
  
  // Seed noise for organic flow later
  noiseSeed(1337);
}

function draw() {
  noStroke();
  translate(width / 2, height / 2 + 50);
  
  // Calculate target position based on text index to create a "collision" effect with the text list
  let t = textList[textIndex];
  targetX = t.pos.x - width/2;
  targetY = t.pos.y - height/2;
  
  // Spawn particles that flow into the circle
  for (let i = 0; i < 5; i++) {
    let angle = random(TWO_PI);
    let r = 15 + random(40); // Start outside radius
    
    particles.push({
      x: width/2 + cos(angle) * r,
      y: height/2 + sin(angle) * r,
      vx: (targetX - width/2) / 30,
      vy: (targetY - height/2) / 30,
      life: 1.0,
      maxLife: 1.0,
      color: color(59, 130, 246), // blue-500
      size: random(5, 12)
    });
  }
  
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Move particle towards target circle position with some noise influence
    let dx = targetX - p.x;
    let dy = targetY - p.y;
    
    // Use noise for organic slight deviation in movement path
    let n = noise(p.life * 0.1, frameCount * 0.05);
    p.x += dx * 0.1 + noise(n) * 2;
    p.y += dy * 0.1 + noise(n) * 2;
    
    // Draw particle
    fill(p.color, map(p.life, 0, 1, 0, 255));
    noStroke();
    ellipse(p.x, p.y, p.size);
    
    if (p.life <= 0.01) {
      particles.splice(i, 1);
    } else {
      p.life -= 0.01;
      
      // If particle is inside the target circle radius, it "collides" and triggers next text
      let dist = dist(p.x, p.y, targetX, targetY);
      if (dist < 25 && i === 0) { // First particle to cross threshold
        textIndex = (textIndex + 1) % textList.length;
      }
    }
  }
  
  // Draw the main blue circle that acts as the attractor/collision zone
  fill(37, 99, 235); // blue-600
  noStroke();
  ellipse(targetX, targetY, 100 + sin(frameCount * 0.1) * 10);
  
  // Draw text label below circle for context
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(48);
  textStyle(BOLD);
  let currentChar = textList[textIndex].text;
  text(currentChar, targetX, targetY + 35);
}

function windowResized() {
  resizeCanvas(800, 600);
}