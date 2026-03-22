let circle;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
}

function draw() {
  background(340, 20, 5); // Very dark blue
  
  noiseSeed(12345);
  
  let x = width / 2;
  let y = height / 2;
  
  circle = ellipse(x, y, map(noise(frameCount * 0.003), 0, 1) * 300 + 100, map(noise(frameCount * 0.003 + 100), 0, 1) * 250 + 80);
  
  stroke(240, 90, 60);
  strokeWeight(map(sin(frameCount * 0.05), -1, 1) * 4 + 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}