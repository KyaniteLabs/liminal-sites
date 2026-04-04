<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Three.js Torus Knot</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; }
        canvas { display: block; }
    </style>
</head>
<body>

<!-- Import Three.js and OrbitControls from CDN -->
<script type="module">
    import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
    import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 25;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // 4. Lighting Setup (Animated)
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // 5. Object Setup
    // TorusKnot Geometry
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16, Math.PI * 2);

    // Material (Standard material for lighting interaction)
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        roughness: 0.1,
        metalness: 0.8
    });

    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // 6. Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Rotate the object
        torusKnot.rotation.x = time * 0.2;
        torusKnot.rotation.y = time * 0.4;

        // Animate Lighting (Color cycle for light)
        dirLight.color.setHSL(0.5, 1, (time * 0.2) % 1);
        dirLight.intensity = 2 + Math.sin(time * 3) * 1; // Pulse intensity

        // Animate Material Color
        material.color.setHSL(0.5, 1, (time * 0.15) % 1);

        // Update Controls
        controls.update();

        renderer.render(scene, camera);
    }

    // 7. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 50;

    // 8. Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
</script>

</body>
</html>