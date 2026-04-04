// CODE 1: Standard Setup with GSAP for Smooth Animation
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

function initCode1() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 2, 5);
    controls.update();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 10, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Torus Knot Geometry
    const tubeRadius = 0.5;
    const radialRadius = 1.5;
    const segments = 100;
    
    // Create a custom geometry for the torus knot path
    const geometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2, 0, 2),
            new THREE.Vector3(2, 0, -2)
        ]), 
        segments, 
        tubeRadius, 
        8, 
        false
    );

    // Material setup with color change capability
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x00ffaa, 
        specular: 0xcccccc, 
        shininess: 100 
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let startTime = Date.now();

    function animate() {
        requestAnimationFrame(animate);

        const time = (Date.now() - startTime) / 1000;

        // 1. Rotation
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;

        // 2. Color Change (Using GSAP for smooth transition)
        const hue = (time / 2) % 1.0;
        const color = new THREE.Color().setHSL(hue, 1.0, 0.6);
        mesh.material.color.copy(color);
        
        // 3. Animated Lighting (Simple pulsing)
        pointLight.intensity = 10 + Math.sin(time * 0.5) * 5;

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

initCode1();