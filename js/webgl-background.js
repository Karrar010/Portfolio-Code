// WebGL Background Effect for Hero Section
// This script creates an interactive particle background

// Global variables
let scene, camera, renderer;
let particles, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Initialize the WebGL background
function initWebGLBackground() {
    const container = document.getElementById('hero-canvas-container');
    
    if (!container) return;
    
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    
    // Create particles
    createParticles();
    
    // Add event listeners
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

// Create particle system
function createParticles() {
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const colorPrimary = new THREE.Color(0x64ffda); // --accent-primary
    const colorSecondary = new THREE.Color(0x7b5cff); // --accent-secondary
    const colorTertiary = new THREE.Color(0xff7eb3); // --accent-tertiary
    
    for (let i = 0; i < particleCount; i++) {
        // Position
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // Color - randomly choose between the three accent colors
        let color;
        const colorChoice = Math.floor(Math.random() * 3);
        
        if (colorChoice === 0) color = colorPrimary;
        else if (colorChoice === 1) color = colorSecondary;
        else color = colorTertiary;
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material
    const material = new THREE.PointsMaterial({
        size: 4,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true
    });
    
    // Create particle system
    particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);
}

// Handle mouse movement
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
}

// Handle window resize
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particle system based on mouse position
    particleSystem.rotation.x += 0.0005;
    particleSystem.rotation.y += 0.001;
    
    // Add subtle movement based on mouse position
    particleSystem.rotation.x += (mouseY * 0.0001 - particleSystem.rotation.x) * 0.05;
    particleSystem.rotation.y += (mouseX * 0.0001 - particleSystem.rotation.y) * 0.05;
    
    renderer.render(scene, camera);
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initWebGLBackground);
