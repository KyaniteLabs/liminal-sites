// ============================================================================
// CODE BLOCK 1: SCENE SETUP, GEOMETRY, AND INITIALIZATION
// (Requires three.js library loaded via script tag)
// ============================================================================

let scene, camera, renderer, knotMesh;
const container = document.getElementById('container');

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050515);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 1. Create the Torus Knot Geometry
    const radius = 1.5;
    const tube = 0.2;
    // Parameters for TorusKnotGeometry: (R, r, p, q)
    const geometry = new THREE.TorusKnotGeometry(radius, tube, 100, 16);

    // 2. Create the Material (Wireframe and Color)
    // We use MeshBasicMaterial combined with wireframe for the effect.
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ffaa,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });

    // 3. Create the Mesh
    knotMesh = new THREE.Mesh(geometry, material);
    scene.add(knotMesh);

    // Handle window resizing
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Call init function to start setup
init();