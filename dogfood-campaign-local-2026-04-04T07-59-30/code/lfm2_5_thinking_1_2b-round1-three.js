// Code 1: Class-based, Modern ES Module Structure
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class TorusKnotScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.setup();
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    setup() {
        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        document.body.appendChild(this.renderer.domElement);

        // Camera setup
        this.camera.position.set(0, 5, 15);
        this.controls.update();

        // 1. Geometry: Torus Knot
        const radius = 5;
        const tube = 1;
        const geometry = new THREE.TorusKnotGeometry(radius, tube, 100, 20);

        // 2. Material & Wireframe
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF, 
            wireframe: true 
        });
        this.knot = new THREE.Mesh(geometry, material);
        this.scene.add(this.knot);

        // 3. Animated Lighting (Point Light that oscillates)
        this.ambientLight = new THREE.AmbientLight(0x404040, 2); 
        this.scene.add(this.ambientLight);

        this.pointLight = new THREE.PointLight(0xffffff, 10, 50);
        this.pointLight.position.set(10, 10, 10);
        this.scene.add(this.pointLight);

        // Initial rotation
        this.rotationSpeed = 0.005;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        const time = performance.now() * 0.001;

        // Rotation (Knot)
        this.knot.rotation.x += this.rotationSpeed;
        this.knot.rotation.y += this.rotationSpeed * 0.5;

        // Color Change (Material color based on time)
        const colorChange = Math.sin(time * 0.5) * 0.5 + 0.5; // Range 0 to 1
        const r = Math.floor(Math.sin(time * 0.5) * 127 + 128);
        const g = Math.floor(Math.sin(time * 0.5 + 2) * 127 + 128);
        const b = Math.floor(Math.sin(time * 0.5 + 4) * 127 + 128);
        this.knot.material.color.setRGB(r / 255, g / 255, b / 255);


        // Animated Lighting (Oscillating light color/intensity)
        this.pointLight.intensity = 10 + Math.sin(time * 1.5) * 5;
        this.pointLight.position.y = 10 + Math.sin(time * 0.8) * 5;
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.animate();
    }
}

// Initialization Call (Assuming environment supports imports/classes)
// const scene = new TorusKnotScene();
// scene.start();