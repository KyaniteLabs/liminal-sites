// CODE 1: Basic Setup with Rotation and Color Interpolation
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/controls/OrbitControls.js';

function initCode1() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 1, 5);
    controls.update();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, -5);
    scene.add(directionalLight);

    // Torus Knot Geometry
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.3, 100, 16);
    
    // Use LineSegments for wireframe
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        wireframe: true,
        vertexColors: true // Although we won't use per-vertex colors, it's good practice
    });
    const knot = new THREE.LineSegments(geometry, material);
    scene.add(knot);

    // Animation Loop
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        
        // Rotation
        knot.rotation.x += 0.005 * delta;
        knot.rotation.y += 0.01 * delta;

        // Color Change (Simple HSL cycle on the material)
        const time = clock.elapsedTime;
        const color = new THREE.Color();
        // Cycle through red, green, blue
        color.setHSL(time * 0.1, 1, 0.5); 
        knot.material.color.copy(color);

        controls.update();
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.viewport = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    });

    animate();
}
initCode1();