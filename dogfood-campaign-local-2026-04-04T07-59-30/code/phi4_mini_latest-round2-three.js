// Code 1: Basic and Direct Implementation (Using standard materials and basic trigonometry for rotation/color change)

<!DOCTYPE html>
<html>
<head>
    <title>Wireframe Torus Knot - Simple</title>
    <style>body {margin: 0; overflow: hidden; }</style>
</head>
<body>
    <script src="https://cdn.jsdelivr.net/npm/three@r6/build/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three/examples/js/controls/OrbitControls.js"></script>
    <script>
        let scene, camera, renderer, controls, torusKnot;
        let startTime = Date.now();

        function init() {
            // Scene setup
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            // Renderer setup
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            // Controls setup
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;

            // Geometry: Torus Knot
            const curve = new THREE.TorusKnot(1.5, 0.4, 200, 100);
            const points = curve.getPoints(1000); // Get enough points for a smooth wireframe
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            // Material: Wireframe and changing color logic
            const material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true
            });
            torusKnot = new THREE.Line(geometry, material);
            scene.add(torusKnot);

            // Animated Lighting (Ambient and directional for general glow)
            const ambientLight = new THREE.AmbientLight(0x444444); // Soft white light
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);

            window.addEventListener('resize', onWindowResize);
        }

        function onWindowResize() {
            camera.viewport = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);

            // 1. Rotation (Torus Knot)
            const time = (Date.now() - startTime) / 1000;
            torusKnot.rotation.x = Math.sin(time * 0.2) * 0.5;
            torusKnot.rotation.y = time * 0.3;

            // 2. Color Change (Using HSL cycle based on time)
            const hue = (time * 0.1) % 1.0;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.7);
            torusKnot.material.color.copy(color);

            // 3. Animated Lighting (Subtle pulsing effect on directional light)
            const lightIntensity = 0.8 + Math.sin(time * 0.5) * 0.2;
            directionalLight.intensity = lightIntensity;

            controls.update();
            renderer.render(scene, camera);
        }

        init();
        animate();
    </script>
</body>
</html>