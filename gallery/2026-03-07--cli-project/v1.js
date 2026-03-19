function setup() {
  createCanvas(800, 600); // Set up the canvas with large dimensions
  // Initialize colors for creative effect
  background(135, 206, 235); // Light blue background
}

function draw() {
  // Draw a glowing blue circle that pulses
  noStroke();
  fill(255, 0, 0); // Bright red color for contrast against blue background
  ellipse(400, 300, 200, 200); // Circle with dynamic radius effect
  
  // Create animated glow effect using gradient and animation
  circle(width/2, height/2, 100);
  animateGlow();
}

function animateGlow() {
  // Simple pulsing animation for visual appeal
  backgroundColor(255, 255, 0); // Change to green when pulsing
  noLoop();
  delay(50);
}