let words = ["CODE", "ART", "FLOW", "NOISE", "GEN"];
let fontSize = 40;
let textGapX = 75;
let currentWordIndex = 0;
let charOffsetY = -100;
let charSpeed = 2.5;

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
}

function draw() {
  background(15);
  
  // Center the text vertically and horizontally based on current state
  let startX = (width - (words.length * textGapX)) / 2;
  let centerY = height / 2 + charOffsetY;
  
  for (let i = 0; i < words.length; i++) {
    // Draw the word in white with a slight glow effect using radial gradient simulation
    fill(255);
    noStroke();
    
    // Simulate glow by drawing multiple circles behind text if we were doing full graphics,
    // but for text, we just draw it cleanly. The blue circle will be the main visual.
    
    textSize(fontSize * (1 + sin(frameCount * 0.02) * 0.05)); // Slight pulsing size
    
    push();
    translate(startX + i * textGapX, centerY);
    textAlign(CENTER);
    textStyle(BOLD);
    fill(200); // Slightly off-white for contrast against dark bg and blue circle
    text(words[i], 0, 0);
    pop();
  }
  
  // --- THE BLUE CIRCLE WITH NOISE DEFORMATION ---
  
  noStroke();
  fill(30, 144, 255); // Classic p5.js blue
  
  push();
  translate(width / 2, height / 2 + charOffsetY - fontSize/3);
  
  // Calculate a smooth radius based on noise for organic movement
  let baseRadius = 150;
  let time = frameCount * 0.05;
  
  // Create a circular gradient effect using noise sampling around the circle
  beginShape();
  for (let angle = 0; angle <= TWO_PI; angle += PI / 32) {
    let x = cos(angle);
    let y = sin(angle);
    
    // Use noise to create subtle undulations in the circle's boundary
    // We use a combination of different frequencies for complexity
    let noiseVal = noise(x * 3, y * 3, time);
    let radiusVar = map(noiseVal, 0, 1, -25, 25);
    
    let finalRadius = baseRadius + radiusVar;
    vertex(x * finalRadius, y * finalRadius);
  }
  endShape(CLOSE);
  
  // Add a second layer for depth/gradient effect using noiseSeed variation logic (simulated here with different seed values implicitly via offset)
  fill(50, 160, 255, 80); // Lighter blue, semi-transparent
  beginShape();
  for (let angle = 0; angle <= TWO_PI; angle += PI / 32) {
    let x = cos(angle);
    let y = sin(angle);
    
    let noiseVal2 = noise(x * 5, y * 5, time + PI); // Offset phase
    let radiusVar2 = map(noiseVal2, 0, 1, -30, 15);
    
    let finalRadius2 = baseRadius + radiusVar2;
    vertex(x * finalRadius2, y * finalRadius2);
  }
  endShape(CLOSE);
  
  pop();
  
  // --- COLLISION LOGIC (TEXT vs CIRCLE) ---
  
  // Calculate circle boundary based on current noise state
  let avgRadius = baseRadius;
  for (let angle = 0; angle <= TWO_PI; angle += PI / 16) {
    let x = cos(angle);
    let y = sin(angle);
    let nVal = noise(x * 3, y * 3, time);
    avgRadius += map(nVal, 0, 1, -25, 25);
  }
  avgRadius /= 64; // Average over samples
  
  // Simple AABB collision detection for text vs Circle
  let circleCenter = createVector(width/2, height/2 + charOffsetY - fontSize/3);
  
  for (let i = 0; i < words.length; i++) {
    let wordX = startX + i * textGapX;
    
    // Distance from center to the current word's bounding box
    let distToCenter = p5.Vector.dist(circleCenter, createVector(wordX, centerY));
    
    if (distToCenter < avgRadius + fontSize/2) {
      // Collision! Reverse direction of text
      charSpeed *= -1;
      
      // Visual feedback: Flash the word white briefly
      fill(255);
      noStroke();
      textSize(fontSize * 1.3);
      textStyle(BOLD);
      push();
      translate(wordX, centerY);
      textAlign(CENTER);
      text(words[i], 0, 0);
      pop();
    } else {
      // Normal state color for collision check (redundant in this loop but good for logic separation)
      fill(200);
      textSize(fontSize * (1 + sin(frameCount * 0.02) * 0.05));
      textStyle(BOLD);
    }
  }
}

function windowResized() {
  resizeCanvas(800, 600);
}