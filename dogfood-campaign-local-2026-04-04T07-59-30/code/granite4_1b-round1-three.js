import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createScene() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // --- Torus Knot Geometry ---
    const knot = new THREE.TorusKnotGeometry(1, 0.3, 100, 32);
    
    // --- Material Setup (Color Changing) ---
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xff0000, 
        wireframe: true, 
        transparent: true, 
        opacity: 1.0 
    });

    const torusKnot = new THREE.Mesh(knot, material);
    scene.add(torusKnot);

    // --- Animated Lighting ---
    const ambientLight = new THREE.AmbientLight(0x404040, 3); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // --- Animation Loop ---
    let startTime = Date.now();
    
    function animate() {
        requestAnimationFrame(animate);

        const elapsed = (Date.now() - startTime) / 1000;

        // 1. Rotation Animation
        torusKnot.rotation.x = elapsed * 0.2;
        torusKnot.rotation.y = elapsed * 0.5;

        // 2. Color Changing Animation (Sine wave based color shift)
        const sinVal = Math.sin(elapsed * 1.5);
        const hue = (sinVal + 1) / 2; // Range 0 to 1
        const color = new THREE.Color();
        color.setHSL(hue, 0.8, 0.7);
        
        material.color.copy(color);
        
        // 3. Advanced Lighting Animation (Subtle movement)
        directionalLight.position.x = 5 * Math.sin(elapsed * 0.3);
        directionalLight.position.z = 7.5 + 2 * Math.cos(elapsed * 0.2);

        controls.update();
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

createScene();