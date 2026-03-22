function setup() {
  createCanvas(800, 600); // Set up the canvas with size 800x600
  // Define initial color and speed for animation
  backgroundColor(255, 255, 255);
  circleRadius = 50;      // Radius of the blue circle
  rotationSpeed = 0;     // Speed of rotation
}

function draw() {
  background(220); // Light gray background for contrast
  
  // Draw a glowing blue circle with animated speed
  let angle = rotateAngle();
  circle(dir(angle), circleRadius, 100, color(255, 0, 0)); // Greenish-blue glow effect
  
  // Animate the rotation smoothly
  noInteraction(); // Disable mouse interaction for smooth animation
}