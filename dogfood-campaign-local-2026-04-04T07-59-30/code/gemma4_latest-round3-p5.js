let fireworks = [];
let particles = [];
const GRAVITY = 0.1;

class Firework {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.targetX = random(width * 0.1, width * 0.9);
        this.targetY = random(height * 0.1, height * 0.4);
        this.velocity = p5.Vector.random2D(0.5, 1.5);
        this.acceleration = createVector(0, 0);
        this.exploded = false;
        this.hue = random(360);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {
        if (this.exploded) return;

        let distance = dist(this.x, this.y, this.targetX, this.targetY);
        if (distance < 10 || this.y > height * 0.9) {
            this.explode();
            this.exploded = true;
            return;
        }

        // Simple homing mechanism towards target
        let dir = createVector(this.targetX - this.x, this.targetY - this.y);
        dir.setMag(0.1);
        this.applyForce(dir);
        
        this.velocity.add(this.acceleration);
        this.velocity.limit(10);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.acceleration.mult(0); // Reset acceleration
    }

    show() {
        if (this.exploded) return;
        stroke(this.hue + sin(frameCount * 0.01) * 50, 200, 255, 150);
        strokeWeight(2);
        point(this.x, this.y);
    }

    explode() {
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle(this.x, this.y, this.hue));
        }
    }
}

class Particle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.vx = random(-3, 3);
        this.vy = random(-10, 0);
        this.radius = random(1, 3);
        this.hue = hue;
        this.alive = true;
        this.lifespan = 255;
    }

    update() {
        if (!this.alive) return;

        // Apply physics
        this.vy += GRAVITY;
        this.vx *= 0.99;
        this.vy *= 0.99;

        this.x += this.vx;
        this.y += this.vy;

        // Fade over time
        this.lifespan -= 4;
        if (this.lifespan < 0) {
            this.alive = false;
        }
    }

    show() {
        if (!this.alive) return;
        
        // Use color based on initial hue, and fade based on lifespan
        let colorVal = color(this.hue, 255, 255, this.lifespan);
        stroke(colorVal);
        strokeWeight(this.radius);
        point(this.x, this.y);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 100);
    noiseSeed(random(1000));
    background(0, 0, 10, 100);
    pixelDensity(1);
}

function draw() {
    // Draw a semi-transparent background to create fading trails
    background(0, 0, 5, 10);

    // 1. Create new fireworks periodically
    if (random(1) < 0.08) {
        let startX = random(width);
        let startY = height;
        fireworks.push(new Firework(startX, startY));
    }

    // 2. Update and show fireworks (rockets)
    for (let i = fireworks.length - 1; i >= 0; i--) {
        let fw = fireworks[i];
        fw.update();
        fw.show();
        
        if (fw.exploded) {
            fireworks.splice(i, 1);
        }
    }

    // 3. Update and show particles (explosions)
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.update();
        p.show();

        if (!p.alive) {
            particles.splice(i, 1);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}