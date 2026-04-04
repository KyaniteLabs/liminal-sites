<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Three.js Torus Knot</title>
    <style>
        body {
            margin: 0;
            overflow: hidden; /* Prevent scrollbars */
            background-color: #000;
        }
        #canvas-container {
            width: 100vw;
            height: 100vh;
            display: block;
        }
    </style>
</head>
<body>

<!-- Import Three.js from CDN -->
<script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js"
    }
  }
</script>

<script type="module">
    import * as THREE from 'three';

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows
    document.body.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2); // Strong directional light
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0x00ff00, 1); // Blue spot light
    spotLight.position.set(0, 5, 0);
    scene.add(spotLight);

    // --- CREATE THE KNOT ---
    const geometry = new THREE.TorusKnotGeometry(1, 1, 500, 16);
    
    // --- MATERIALS ---
    const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.1,
        metalness: 0.8,
        emissive: 0x000000,
        emissiveIntensity: 0.2
    });

    const knotMesh = new THREE.Mesh(geometry, material);
    knotMesh.rotation.x = Math.PI / 2; // Rotate so it looks like a torus
    scene.add(knotMesh);

    // --- POST PROCESSING FOR ANIMATED LIGHTING ---
    const postProcess = new THREE.PostProcessing();
    postProcess.renderOrder = 0; // Higher = after other effects
    scene.add(postProcess);
    
    // Configure post-process to handle color shifting
    postProcess.customProperties = {
        color: {
            source: { type: 'wireframe' },
            opacity: 1,
            color: 0xff0000
        }
    };

    // --- ORBIT CONTROLS ---
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent going below the floor
    controls.minDistance = 5;
    controls.maxDistance = 30;

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the knot slowly
        knotMesh.rotation.y += 0.002;

        // Smoothly transition colors (animation loop)
        postProcess.update();

        controls.update();
        renderer.render(scene, camera);
    }

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
</script>

</body>
</html>