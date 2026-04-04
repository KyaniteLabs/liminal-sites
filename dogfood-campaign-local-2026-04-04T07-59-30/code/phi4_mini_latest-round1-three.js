// Code 1: Standard Setup with Time-Based Color Cycling

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Setup Camera and Controls
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);
const controls = new OrbitControls(camera, document.body);
controls.update();

// 1. Torus Knot Geometry and Wireframe Material
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const material = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    wireframe: true
});
const knot = new THREE.Mesh(geometry, material);
scene.add(knot);

// 2. Animated Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotation
    knot.rotation.x += 0.005;
    knot.rotation.y += 0.01;

    // Color Change (Cycle between colors based on time)
    const time = Date.now() / 1000;
    const r = Math.sin(time * 0.5) * 0.5 + 0.5;
    const g = Math.sin(time * 0.7) * 0.5 + 0.5;
    const b = Math.sin(time * 0.9) * 0.5 + 0.5;
    material.color.setRGB(r, g, b);

    // Animated Lighting (Subtle oscillation)
    directionalLight.intensity = 1 + Math.sin(time * 0.3) * 0.2;

    controls.update();
    renderer.render(scene, camera);
}

// Renderer Initialization
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();