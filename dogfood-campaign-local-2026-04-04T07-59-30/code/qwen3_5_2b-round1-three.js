<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Three.js Torus Knot</title>
    <style>body { margin: 0; overflow: hidden; } canvas { display: block; }</style>
</head>
<body>
<script type="module">
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Create the Torus Knot
const geometry = new THREE.TorusKnotGeometry(2, 0.6, 128, 16);

// Create a standard material that reacts to light
const material = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    roughness: 0.1,
    metalness: 0.9,
    wireframe: true
});

const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Create Lights
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xff00ff, 1, 50);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Animation
function animate() {
    requestAnimationFrame(animate);

    // Rotate the knot
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;

    // Change color in HSL space
    const hue = (Math.sin(Date.now() * 0.002) * 0.5 + 0.5) * 0.3;
    material.color.setHSL(hue, 1.0, 0.5);

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
</script>
</body>
</html>