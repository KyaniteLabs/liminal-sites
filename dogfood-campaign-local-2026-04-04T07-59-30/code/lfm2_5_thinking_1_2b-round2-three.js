// CODE 1: Basic Rotation and Color Pulse
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/controls/OrbitControls.js';

function initCode1() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 1. Torus Knot Wireframe
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.LineBasicMaterial({ color: 0x00ffaa, linewidth: 2 });
    const knot = new THREE.LineSegments(geometry, material);
    scene.add(knot);

    // 2. Animated Lighting (Directional Light moving)
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Handle resizing
    window.addEventListener('resize', () => {
        camera.viewport = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Rotation
        knot.rotation.x += 0.002;
        knot.rotation.y += 0.004;

        // Color Change (Pulsing Green/Cyan)
        const time = Date.now() * 0.001;
        const hue = Math.sin(time * 0.5) * 0.5 + 0.5;
        const color = new THREE.Color().setHSL(hue, 1, 0.7);
        material.color.copy(color);
        
        // Animated Lighting (Swinging the light source)
        light.position.x = Math.sin(time * 0.8) * 8;
        light.position.z = Math.cos(time * 0.8) * 8;

        controls.update();
        renderer.render(scene, camera);
    };

    animate();
}
initCode1();