// Code 1: Basic Color Cycling and Rotation
import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';

function initScene1() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Setup Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // 1. Create Torus Knot Wireframe
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    // 2. Animated Lighting (Ambient + Directional)
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Variables for color cycling
    let startTime = Date.now();

    function animate() {
        requestAnimationFrame(animate);

        // Rotation
        knot.rotation.x += 0.005;
        knot.rotation.y += 0.01;

        // 3. Color Change (Based on time)
        const elapsed = (Date.now() - startTime) / 1000;
        // Cycles through hue (0 to 1)
        const hue = (elapsed * 0.1) % 1.0;
        const color = new THREE.Color().setHSL(hue, 1.0, 0.6);
        knot.material.color = color;

        // Optional: Pulse the light intensity
        const lightFactor = 1.5 + 0.5 * Math.sin(elapsed * 2);
        directionalLight.intensity = lightFactor;

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

initScene1();