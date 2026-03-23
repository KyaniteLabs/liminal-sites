let angle;
let maxDepth = 10;
let noiseOffset = 0;

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
  angleMode(RADIANS);
  noiseSeed(random(10000));
  angle = PI / 4;
}

function draw() {
  background(20, 25, 35);
  
  // Animate noise
  noiseOffset += 0.005;
  
  translate(width / 2, height);
  
  // Draw the tree recursively
  drawBranch(height * 0.35, 0);
  
  noLoop();
}

function drawBranch(len, depth) {
  // Color based on depth
  let hueVal = map(depth, 0, maxDepth, 120, 30);
  let satVal = map(depth, 0, maxDepth, 60, 90);
  let brightVal = map(depth, 0, maxDepth, 40, 70);
  let alphaVal = map(depth, 0, maxDepth, 255, 180);
  
  // Add noise variation
  let noiseVal = noise(depth * 0.3, noiseOffset) * 0.3 - 0.15;
  
  // Stroke weight based on depth
  let sw = map(depth, 0, maxDepth, 12, 1);
  
  strokeWeight(sw);
  colorMode(HSB, 360, 100, 100, 255);
  stroke(hueVal, satVal, brightVal, alphaVal);
  
  // Draw the branch line
  line(0, 0, 0, -len);
  
  // Translate to end of branch
  translate(0, -len);
  
  // Base branching angle with noise
  let branchAngle = angle + noiseVal;
  
  // Only continue recursing if we haven't reached max depth
  if (depth < maxDepth && len > 4) {
    // Random variation in length
    let lenVariation = 0.7 + noise(depth * 0.5, noiseOffset * 2) * 0.3;
    let newLen = len * lenVariation;
    
    // Draw branches at angles
    push();
    rotate(branchAngle);
    drawBranch(newLen, depth + 1);
    pop();
    
    push();
    rotate(-branchAngle);
    drawBranch(newLen, depth + 1);
    pop();
    
    // Sometimes add a middle branch at deeper levels
    if (depth > 3 && random() > 0.6) {
      push();
      rotate(0);
      drawBranch(newLen * 0.8, depth + 1);
      pop();
    }
  } else {
    // Draw leaves at the tips
    drawLeaf();
  }
}

function drawLeaf() {
  let leafSize = random(3, 8);
  let leafHue = random(80, 150);
  let leafBright = random(50, 90);
  
  fill(leafHue, 70, leafBright, 200);
  noStroke();
  
  push();
  translate(random(-5, 5), random(-5, 5));
  ellipse(0, 0, leafSize, leafSize * 0.6);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}