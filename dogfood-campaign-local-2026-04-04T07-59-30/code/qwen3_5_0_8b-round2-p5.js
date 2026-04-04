const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const width = 800;
const height = 600;
let particles = [];

function setup() {
  createCanvas(width, height);
  pixelDensity(1);
  
  // Initialize particle array
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      color: createFireColor(),
      life: 100,
      speed: 1.5
    });
  }
}

function createFireColor() {
  // Generate noise-based random color
  const hue = noise(0, 360);
  const saturation = 100 + noise(0, 100) * 20;
  const lightness = 100 + noise(0, 100) * 30;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function update() {
  // Calculate total velocity
  const totalVx = particles.reduce((sum, p) => sum + p.vx, 0);
  const totalVy = particles.reduce((sum, p) => sum + p.vy, 0);

  // Update positions
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    
    // Gravity
    p.vy += 0.1;
    
    // Friction
    p.vx *= 0.95;
    p.vy *= 0.95;
    
    // Check for collisions with ground
    if (p.y > height - 10) {
      p.y = height - 10;
      p.vy *= -0.5;
      p.life = 0;
      p.color = createFireColor(); // Reset color if off ground
    }

    // Check for explosions (change color)
    if (p.life <= 0) {
      p.color = createFireColor();
      p.life = 100;
    }

    // Update array
    particles[i] = p;
  }
  
  // Update particles array (remove dead ones)
  for (let i = 0; i < particles.length; i++) {
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }
}

function draw() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  // Draw trails
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    
    // Fade out
    p.life -= 0.1;
    p.y += p.vy;
  }

  // Draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    // Draw circle for the particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    
    // Draw a little flame
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(p.x - 2, p.y - 5, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(p.x - 3, p.y - 3, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}