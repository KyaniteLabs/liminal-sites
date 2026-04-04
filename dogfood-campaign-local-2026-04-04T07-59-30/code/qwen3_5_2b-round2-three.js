<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Three.js Torus Knot</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #111; }
        canvas { display: block; }
    </style>
    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
            }
        }
    </script>
</head>
<body>

<script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    // 1. Setup Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    // 2. Setup Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    // 5. Create Geometry
    const geometry = new THREE.TorusKnotGeometry(10, 2, 100, 20);

    // 6. Create Material (Wireframe + Colors)
    // Using StandardMaterial allows for lighting interaction
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0.1,
        metalness: 0.5,
        wireframe: true,
        flatShading: true
    });

    // 7. Create Mesh
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // 8. Lighting
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 2); 
    scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Point light for dynamic color shifts
    const pointLight = new THREE.PointLight(0xffaa00, 5, 20);
    scene.add(pointLight);

    // 9. Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Rotate the knot
        torusKnot.rotation.x = Math.sin(time) * 0.2;
        torusKnot.rotation.y = Math.cos(time) * 0.2;

        // Change color based on time (HSL cycle)
        const hue = (time * 0.2) % 1;
        material.color.setHSL(hue, 1.0, 0.5);

        // Move point light to follow the knot for a dynamic effect
        pointLight.position.copy(torusKnot.position);
        pointLight.position.z += Math.sin(time) * 2;

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
</script>

</body>
</html>