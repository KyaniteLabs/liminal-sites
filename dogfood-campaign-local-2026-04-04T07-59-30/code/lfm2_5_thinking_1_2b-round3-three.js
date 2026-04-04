// CODE 1: Standard Material Interpolation with Directional Light Animation
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/controls/OrbitControls.js';

function initCode1() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene.background = new THREE.Color(0x111111);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 1, 5);
    controls.update();

    // Torus Knot Geometry and Material
    const geometry = new THREE.TorusKnotGeometry(2, 0.6, 100, 16);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Animation Loop
    let startTime = Date.now();

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = (Date.now() - startTime) / 1000;

        // 1. Object Rotation
        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.01;

        // 2. Color Change (Interpolation based on time)
        const colorChange = Math.sin(elapsed * 0.5) * 0.5 + 0.5;
        const r = Math.sin(elapsed * 0.8) * 0.5 + 0.5;
        const g = colorChange * 0.6 + 0.4;
        const b = 1 - colorChange * 0.4;
        material.color.set(r, g, b);

        // 3. Animated Lighting (Oscillating position)
        light.position.x = Math.sin(elapsed * 0.7) * 10;
        light.position.y = 10 + Math.cos(elapsed * 0.4) * 3;
        light.position.z = Math.cos(elapsed * 0.7) * 10;

        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

initCode1();