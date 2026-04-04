// Code 1: Standard Class-Based Structure (The robust approach)

import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js';

// --- Setup Function ---
function init() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // --- Torus Knot Geometry ---
    // Parameters for the torus knot (r=1, R=2, p=3, q=2)
    const knot = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const torusKnot = new THREE.Mesh(knot, material);
    scene.add(torusKnot);

    // --- Animated Lighting (Pulsing spotlight) ---
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1.5, 50, Math.PI / 6, 10, 1);
    spotLight.position.set(5, 5, 5);
    scene.add(spotLight);

    // Add a simple directional light for general fill
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);


    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        // 1. Rotate the knot
        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.01;

        // 2. Change Knot Color (Sine wave based on time)
        const time = clock.getElapsedTime();
        const colorChange = Math.sin(time * 0.5) * 0.5 + 0.5;
        const newColor = new THREE.Color(colorChange, 0.1 + Math.cos(time * 0.2) * 0.5, 0.8);
        material.color.copy(newColor);

        // 3. Animate Lighting (Oscillating intensity)
        const lightIntensity = 1.5 + Math.sin(time * 1.5) * 0.5;
        spotLight.intensity = lightIntensity;

        // Update controls and render
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}


// --- Event Listeners ---
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.viewport.setSize(width, height);
    renderer.setSize(width, height);
});

init();