<think>
The user wants a minimal black and white circles sketch in p5.js. Let me create something elegant and generative using Perlin noise for organic variation.

I'll create:
- Black background with white circles
- Use noise() for organic movement/positioning
- Minimal, clean aesthetic
- Perhaps some circles moving or pulsing

Let me design this thoughtfully:

1. Use noise for circle positions that shift smoothly
2. Maybe varying circle sizes
3. Clean black and white only
4. Smooth, calming movement

I'll create a responsive canvas with circles that move organically using Perlin noise.
</think>

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
  noiseSeed(random(10000));
  noStroke();
}

function draw() {
  background(0);
  
  let time = frameCount * 0.005;
  let circleCount = 40;
  
  for (let i = 0; i < circleCount; i++) {
    let noiseVal = noise(i * 0.15, time);
    let noiseVal2 = noise(i * 0.15 + 100, time * 0.7);
    let noiseVal3 = noise(i * 0.1, time * 1.2);
    
    let x = map(noiseVal, 0, 1, 50, width - 50);
    let y = map(noiseVal2, 0, 1, 50, height - 50);
    let size = map(noiseVal3, 0, 1, 20, 120);
    
    let alpha = map(sin(time * 2 + i * 0.3), -1, 1, 80, 255);
    
    fill(255, alpha);
    ellipse(x, y, size, size);
  }
  
  for (let i = 0; i < 15; i++) {
    let x = width/2 + noise(i * 0.3 + time * 0.5, 0) * 200 - 100;
    let y = height/2 + noise(i * 0.3 + time * 0.5, 50) * 200 - 100;
    let size = 8 + noise(i * 0.5 + time) * 12;
    
    fill(255, 200);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  noiseSeed(random(10000));
}