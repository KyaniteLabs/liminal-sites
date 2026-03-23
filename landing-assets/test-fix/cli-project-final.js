<think>
The user wants a p5.js sketch with colorful circles. I need to create an engaging, visually appealing sketch that:
1. Uses Perlin noise for organic movement
2. Has colorful circles with varying sizes
3. Is self-contained and immediately runnable
4. Includes windowResized() for responsiveness

Let me create a beautiful animated sketch with colorful circles that move organically using noise.
</think>

let circles = [];
let numCircles = 80;
let noiseScale = 0.005;
let timeOffset = 0;

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
  colorMode(HSB, 360, 100, 100, 100);
  noiseSeed(random(10000));
  
  for (let i = 0; i < numCircles; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      baseX: random(width),
      baseY: random(height),
      size: random(20, 80),
      noiseOffsetX: random(1000),
      noiseOffsetY: random(2000, 3000),
      hue: random(360),
      alpha: random(40, 80)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  for (let circle of circles) {
    let nx = noise(circle.noiseOffsetX + timeOffset) * 200 - 100;
    let ny = noise(circle.noiseOffsetY + timeOffset) * 200 - 100;
    
    circle.x = circle.baseX + nx;
    circle.y = circle.baseY + ny;
    
    let distFromCenter = dist(circle.x, circle.y, width/2, height/2) / 300;
    let hueShift = (noise(circle.noiseOffsetX * 0.5) * 60 + timeOffset * 30) % 360;
    let currentHue = (circle.hue + hueShift) % 360;
    let saturation = map(distFromCenter, 0, 1, 90, 50);
    let brightness = map(distFromCenter, 0, 1, 100, 70);
    
    noStroke();
    fill(currentHue, saturation, brightness, circle.alpha);
    
    let sizeVariation = noise(circle.noiseOffsetX * 2 + timeOffset) * 20;
    ellipse(circle.x, circle.y, circle.size + sizeVariation);
    
    fill(currentHue, saturation - 20, brightness + 20, circle.alpha * 0.5);
    ellipse(circle.x, circle.y, (circle.size + sizeVariation) * 0.6);
  }
  
  timeOffset += 0.003;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (let circle of circles) {
    circle.baseX = random(width);
    circle.baseY = random(height);
  }
}

function mousePressed() {
  noiseSeed(random(10000));
  for (let circle of circles) {
    circle.noiseOffsetX = random(1000);
    circle.noiseOffsetY = random(2000, 3000);
    circle.hue = random(360);
    circle.baseX = random(width);
    circle.baseY = random(height);
  }
}