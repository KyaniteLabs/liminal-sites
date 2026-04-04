<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Three.js Torus Knot</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script type="module">
        import * as THREE from 'three';

        // 1. Scene Setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);

        // 2. Camera
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 3.5;

        // 3. Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // 4. Lighting (Animated)
        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
        scene.add(ambientLight);

        // Point Light 1 (Sun-like)
        const light1 = new THREE.PointLight(0xffffff, 2, 10);
        light1.position.set(-1, 0, 5);
        scene.add(light1);

        // Point Light 2 (Moon-like)
        const light2 = new THREE.PointLight(0xffffff, 2, 10);
        light2.position.set(-1, 0, 1);
        scene.add(light2);

        // 5. Torus Geometry
        const geometry = new THREE.TorusGeometry(2, 1, 16, 100);
        geometry.computeVertexNormals();

        // 6. Material (Wireframe)
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff, // Cyan wireframe
            wireframe: true
        });

        // Create the torus mesh
        const torus = new THREE.Mesh(geometry, material);
        scene.add(torus);

        // 7. Controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // 8. Animation Loop
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);

            // Rotate the torus
            torus.rotation.y += 0.002;

            // Rotate the lights
            light1.position.x = Math.sin(time) * 5;
            light1.position.y = Math.cos(time) * 2;
            light1.position.z = Math.sin(time) * 5;

            light2.position.x = Math.sin(time + Math.PI) * 5;
            light2.position.y = Math.cos(time + Math.PI) * 2;
            light2.position.z = Math.sin(time + Math.PI) * 5;

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