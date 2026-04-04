import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- Setup Variables ---
let scene, camera, renderer, controls, knot;
let light;
let clock = new THREE.Clock();

function init() {
    // 1. SCENE SETUP
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // 2. CAMERA SETUP
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // 3. RENDERER SETUP
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 4. CONTROLS
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.update();

    // 5. OBJECT CREATION: TORUS KNOT
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
    // Use MeshBasicMaterial for a true wireframe look
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        wireframe: true 
    });
    knot = new THREE.Mesh(geometry, material);
    knot.rotation.x = Math.PI / 2; // Tilt the knot initially
    scene.add(knot);

    // 6. LIGHTING SETUP
    // Ambient light for general visibility
    scene.add(new THREE.AmbientLight(0x404040)); 

    // Directional Light (The animated light source)
    light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Event Listener for resizing
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.viewport = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // 1. ANIMATE KNOT ROTATION
    knot.rotation.y += 0.005;
    knot.rotation.x += 0.002;

    // 2. ANIMATE KNOT COLOR (Changing color over time using sine wave)
    const colorHue = (Math.sin(elapsed * 0.5) + 1) / 2; // Range 0 to 1
    const color = new THREE.Color();
    color.setHSL(colorHue, 1.0, 0.7);
    // We must update the material color property directly
    knot.material.color.copy(color); 

    // 3. ANIMATE LIGHTING (Moving the directional light)
    light.position.x = Math.sin(elapsed * 0.3) * 10;
    light.position.z = Math.cos(elapsed * 0.3) * 10;
    light.position.y = 5 + Math.sin(elapsed * 0.2) * 2;
    
    // 4. RENDER
    controls.update();
    renderer.render(scene, camera);
}

// --- Execution ---
init();
animate();