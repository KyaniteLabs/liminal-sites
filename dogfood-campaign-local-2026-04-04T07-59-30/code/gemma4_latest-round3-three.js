// Code 1: Standard Setup and Animation Loop
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function initCode1() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // --- Torus Knot Geometry ---
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xff00ff, 
        wireframe: true,
        transparent: true,
        opacity: 0.9 
    });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x404040, 2); 
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // 1. Rotation (Knot)
        knot.rotation.x += 0.005;
        knot.rotation.y += 0.008;

        // 2. Color Change (HSL cycle)
        const time = Date.now() * 0.0001;
        const hue = (time * 0.5) % 1.0;
        const color = new THREE.Color().setHSL(hue, 1.0, 0.6);
        material.color.set(color);
        
        // 3. Lighting Animation (Subtle movement)
        directionalLight.position.x = Math.sin(time * 0.5) * 5;
        directionalLight.position.z = Math.cos(time * 0.5) * 5;

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

// initCode1();