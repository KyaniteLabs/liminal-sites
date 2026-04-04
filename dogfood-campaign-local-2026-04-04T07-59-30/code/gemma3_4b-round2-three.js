// --- Code 1: Basic Sinusoidal Color Shift and Rotation ---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Wireframe Torus Knot - Code 1</title>
    <style>body { margin: 0; overflow: hidden; }</style>
</head>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128/examples/js/controls/OrbitControls.js"></script>
    <script>
        let scene, camera, renderer, controls;
        let knotMesh;
        let startTime = Date.now();

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            controls = new THREE.OrbitControls(camera, renderer.domElement);

            // 1. Torus Knot Geometry (Approximation using parametric equations)
            const knotGeometry = new THREE.BufferGeometry();
            const points = [];
            const totalPoints = 1000;

            for (let i = 0; i <= totalPoints; i++) {
                const t = i / totalPoints * Math.PI * 4;
                const theta = i / totalPoints * Math.PI * 6;
                // Torus Knot Equations: ( (r + cos(t))*cos(theta), (r + cos(t))*sin(theta), sin(t) )
                const x = (1.5 + Math.cos(t)) * Math.cos(theta);
                const y = (1.5 + Math.cos(t)) * Math.sin(theta);
                const z = Math.sin(t);
                points.push(x, y, z);
            }
            knotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

            // Wireframe Material
            const material = new THREE.MeshBasicMaterial({ 
                vertexColors: true, // Important for color change
                linewidth: 2 
            });
            knotMesh = new THREE.LineSegments(knotGeometry, material);
            scene.add(knotMesh);

            // 2. Animated Lighting (Spotlight sweeping)
            const spotLight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 4, 0.5, 1);
            spotLight.position.set(5, 5, 5);
            scene.add(spotLight);

            const ambientLight = new THREE.AmbientLight(0x333333);
            scene.add(ambientLight);

            window.addEventListener('resize', onWindowResize);
            onWindowResize();
        }

        function onWindowResize() {
            camera.viewport = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);

            const elapsed = (Date.now() - startTime) / 1000;

            // 1. Rotate Knot
            knotMesh.rotation.x = elapsed * 0.2;
            knotMesh.rotation.y = elapsed * 0.3;

            // 2. Change Colors (Based on time)
            const colorFactor = Math.sin(elapsed * 0.5) * 0.5 + 0.5; // 0 to 1
            const r = 0.5 + Math.sin(elapsed * 0.2) * 0.5;
            const g = 0.5 + Math.cos(elapsed * 0.2) * 0.5;
            const b = 0.5 + Math.sin(elapsed * 0.2 + 1) * 0.5;

            knotMesh.material.color = new THREE.Color(r, g, b);
            knotMesh.material.needsUpdate = true;

            // 3. Animated Lighting (Sweeping spotlight)
            const timeSpeed = 0.005;
            const lightPosition = new THREE.Vector3(
                5 + Math.sin(elapsed * 0.5) * 3,
                5 + Math.cos(elapsed * 0.5) * 3,
                5 + Math.sin(elapsed * 0.3) * 3
            );
            spotLight.position.copy(lightPosition);
            spotLight.target.position.set(0, 0, 0);
            spotLight.updateTarget();


            controls.update();
            renderer.render(scene, camera);
        }

        init();
        animate();
    </script>
</body>
</html>