// Code 1: Setup and Initialization
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function setupScene() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050515);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Store essentials for global access
    return { scene, camera, renderer, controls };
}

// Code 2: Geometry, Materials, and Lighting
function setupObjectAndLights(scene) {
    // --- 1. Torus Knot Geometry ---
    const geometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
    
    // Create a material that supports wireframing and dynamic color
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xff00ff, 
        wireframe: true,
        transparent: true 
    });

    const torusKnot = new THREE.Mesh(geometry, material);
    torusKnot.name = "TorusKnot";
    scene.add(torusKnot);

    // --- 2. Animated Lighting Setup ---
    
    // Directional Light (Main source)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 15, 10);
    scene.add(directionalLight);

    // Ambient Light (Soft fill)
    const ambientLight = new THREE.AmbientLight(0x404040, 1); 
    scene.add(ambientLight);

    // Point Light (Adds depth and animation target)
    const pointLight = new THREE.PointLight(0x00ffff, 1, 50);
    pointLight.position.set(-10, 5, -10);
    scene.add(pointLight);

    // Store references
    return { torusKnot, directionalLight, pointLight };
}

// Code 3: Animation Loop, Color Change, and Rendering
function animate(renderer, controls, torusKnot, pointLight, time) {
    requestAnimationFrame(() => animate(renderer, controls, torusKnot, pointLight, time));

    // --- 1. Object Rotation ---
    torusKnot.rotation.x += 0.005;
    torusKnot.rotation.y += 0.01;

    // --- 2. Color Change (Dynamic Material Update) ---
    // Calculate a color based on the elapsed time (e.g., cycling through hues)
    const hue = (time * 0.0001) % 1.0;
    const color = new THREE.Color().setHSL(hue, 0.8, 0.7);
    torusKnot.material.color.copy(color);

    // --- 3. Animated Lighting (Orbital movement) ---
    const timeFactor = time * 0.0005;
    pointLight.position.x = Math.sin(timeFactor) * 15;
    pointLight.position.z = Math.cos(timeFactor) * 15;

    // --- 4. Render and Controls Update ---
    controls.update(); // Required for damping
    renderer.render(scene, camera);
}

// --- Execution ---
let scene, camera, renderer, controls;
let torusKnot, directionalLight, pointLight;

// Initialize
{
    const setupResult = setupScene();
    scene = setupResult.scene;
    camera = setupResult.camera;
    renderer = setupResult.renderer;
    controls = setupResult.controls;
}

// Setup objects and lights
{
    const objectResult = setupObjectAndLights(scene);
    torusKnot = objectResult.torusKnot;
    directionalLight = objectResult.directionalLight;
    pointLight = objectResult.pointLight;
}

// Start the animation loop
animate(renderer, controls, torusKnot, pointLight, 0);

// Handle window resizing
window.addEventListener('resize', () => {
    camera.viewport.x = renderer.domElement.clientWidth;
    camera.viewport.y = renderer.domElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});