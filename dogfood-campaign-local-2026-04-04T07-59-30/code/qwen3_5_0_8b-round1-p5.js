const canvas = document.getElementById("fireworksCanvas");
if (canvas) {
    const width = canvas.width;
    const height = canvas.height;
    canvas.width = width;
    canvas.height = height;
    
    const pixelDensity = 1;
    const gravity = 0.5;
    const explosionForce = 15;
    const particleCount = 200;
    const explosionRadius = 600;
    const particleRadius = 2;
    const fadeDuration = 1000;
    
    // Create particles
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: (Math.random() - 0.5) * 800,
            y: (Math.random() - 0.5) * 800,
            vx: (Math.random() - 0.5) * 800,
            vy: (Math.random() - 0.5) * 800,
            vxSpeed: (Math.random() - 0.5) * 50,
            vySpeed: (Math.random() - 0.5) * 50,
            life: 1, // Lives until explosion
            alpha: 1,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
    
    // Draw background noise
    const noise = noise();
    canvas.width = width;
    canvas.height = height;
    canvas.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M0 0h100v100H0V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");`
    
    // Setup
    setup();
    loop();
}

function setup() {
    createCanvas(width, height);
    noise();
}

function draw() {
    background(255);
    drawParticles();
}

function drawParticles() {
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.vx += (Math.random() - 0.5) * explosionForce;
        p.vy += (Math.random() - 0.5) * explosionForce;
        
        // Decay
        p.life--;
        
        // Trail fading
        p.alpha -= fadeDuration * pixelDensity;
        
        // Explosion phase (High velocity, high alpha)
        if (p.life <= 0 || p.alpha < 0.1) {
            p.vx = (Math.random() - 0.5) * 1000;
            p.vy = (Math.random() - 0.5) * 1000;
            p.alpha = 1;
        } else {
            p.vx *= 0.98;
            p.vy *= 0.98;
        }
        
        // Remove particles if they reach the center
        if (p.x < -800 && p.x > 800 && p.y < -800 && p.y > 800) {
            particles.splice(i, 1);
            i--;
        }
        
        // Draw
        drawParticle(p);
    }
    
    // Clear trail with new particles
    for (let i = 0; i < particleCount; i++) {
        particles[i].life = 1;
        particles[i].alpha = 1;
    }
}

function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, particleRadius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.closePath();
}