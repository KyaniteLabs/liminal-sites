// Implementation 1: Function-Based, Smooth Color Interpolation
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function initScene1() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // 1. Torus Knot Geometry (Wireframe)
    const knotGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const knotMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        wireframe: true 
    });
    const knot = new THREE.Mesh(knotGeometry, knotMaterial);
    scene.add(knot);

    // 2. Animated Lighting (PointLight sweeping)
    const light = new THREE.PointLight(0xffffff, 2, 50);
    light.position.set(5, 5, 5);
    scene.add(light);

    window.addEventListener('resize', () => {
        camera.viewport = new THREE.Vector2(window.innerWidth, window.innerHeight);
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);

        // Rotation
        knot.rotation.x += 0.005;
        knot.rotation.y += 0.008;

        // Color Change (Hue shift using sine wave)
        const time = Date.now() * 0.001;
        const hue = (Math.sin(time * 0.5) * 0.5 + 0.5);
        const color = new THREE.Color().setHSL(hue, 1, 0.7);
        knotMaterial.color.copy(color);

        // Light Animation (Sweeping light)
        light.position.x = Math.sin(time * 0.8) * 5;
        light.position.z = Math.cos(time * 0.8) * 5;

        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}
initScene1();