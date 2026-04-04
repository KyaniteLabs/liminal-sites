// Code 1: Basic Wireframe Rotation with Simple Color Cycling
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);

    camera.position.set(0, 1, 5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 1. Torus Knot Geometry (Wireframe)
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    
    // 2. Material Setup
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xff00ff, 
        wireframe: true, 
        transparent: true 
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // 3. Animated Lighting (Simple Ambient)
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate(scene, renderer, controls, torusKnot);
}

function animate(scene, renderer, controls, torusKnot) {
    requestAnimationFrame(() => animate(scene, renderer, controls, torusKnot));

    // Object Rotation
    torusKnot.rotation.x += 0.005;
    torusKnot.rotation.y += 0.01;

    // Color Change (Simple Cycle)
    const time = Date.now() * 0.0005;
    const r = Math.sin(time) * 0.5 + 0.5;
    const g = Math.sin(time + 2) * 0.5 + 0.5;
    const b = Math.sin(time + 4) * 0.5 + 0.5;
    torusKnot.material.color.set(r, g, b);

    controls.update();
    renderer.render(scene, camera);
}

init();