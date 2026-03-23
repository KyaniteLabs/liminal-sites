// Organic patterns with Perlin noise - soft colors
let particles = [];
let numParticles = 1500;
let flowField = [];
let cols, rows;
let resolution = 20;
let t = 0;
let zoff = 0;

// Soft pastel palette
let colors = [];

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
  colorMode(RGB, 255, 255, 255, 100);
  
  // Define soft color palette
  colors = [
    [255, 182, 193], // soft pink
    [230, 230, 250], // lavender
    [176, 224, 230], // powder blue
    [255, 218, 185], // peach
    [152, 251, 152], // pale green
    [255, 250, 205], // lemon chiffon
    [221, 160, 221], // plum
    [175, 238, 238], // pale turquoise
  ];
  
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      colorIndex: floor(random(colors.length)),
      size: random(2, 5),
      life: random(100, 255)
    });
  }
}