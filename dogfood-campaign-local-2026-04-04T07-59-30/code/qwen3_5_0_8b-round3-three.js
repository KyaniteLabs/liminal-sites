import * as THREE from 'three';

// 1. Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Wireframe Torus Knot Geometry
// Creating a torus knot using Math.sin and Math.cos for a custom wireframe shape
const geometry = new THREE.TorusKnotGeometry(2, 2, 100, 16, true); // enableWireframe

// 3. Wireframe Material
const wireframeMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x0000FF, 
  wireframe: true,
  roughness: 0.4 
});
const wireframe = new THREE.Mesh(geometry, wireframeMaterial);

// 4. Lighting
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);
const pointLight = new THREE.DirectionalLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
pointLight.castShadow = true;
scene.add(pointLight);

// 5. Animated Lighting (Blob)
const blobGeometry = new THREE.BlobGeometry(2, 2, 64);
const blobMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const blob = new THREE.Mesh(blobGeometry, blobMaterial);
scene.add(blob);

// 6. Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;

// 7. Animation Loop
function animate() {
  requestAnimationFrame(animate);
  // Rotate wireframe
  wireframe.rotation.x += 0.01;
  wireframe.rotation.y += 0.01;
  // Rotate blob
  blob.rotation.y += 0.005;
  // Rotate controls
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