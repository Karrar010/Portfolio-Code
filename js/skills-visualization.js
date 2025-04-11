// 3D Skills Visualization
// This script creates an interactive 3D visualization of skills

// Global variables
let skillsScene, skillsCamera, skillsRenderer;
let skillsGraph, raycaster, mouse;
let skillsNodes = [];
let skillsLinks = [];
let skillsTooltip;
let skillsAnimationFrame;

// Skill data structure
const skillsData = [
    // Frontend skills
    { id: 'html', name: 'HTML5', group: 'frontend', level: 90, x: 0, y: 0, z: 0 },
    { id: 'css', name: 'CSS3', group: 'frontend', level: 85, x: 0, y: 0, z: 0 },
    { id: 'javascript', name: 'JavaScript', group: 'frontend', level: 90, x: 0, y: 0, z: 0 },
    { id: 'react', name: 'React.js', group: 'frontend', level: 85, x: 0, y: 0, z: 0 },
    { id: 'threejs', name: 'Three.js', group: 'frontend', level: 75, x: 0, y: 0, z: 0 },
    { id: 'gsap', name: 'GSAP', group: 'frontend', level: 70, x: 0, y: 0, z: 0 },
    
    // Backend skills
    { id: 'nodejs', name: 'Node.js', group: 'backend', level: 80, x: 0, y: 0, z: 0 },
    { id: 'express', name: 'Express', group: 'backend', level: 75, x: 0, y: 0, z: 0 },
    { id: 'mongodb', name: 'MongoDB', group: 'backend', level: 70, x: 0, y: 0, z: 0 },
    { id: 'rest', name: 'RESTful APIs', group: 'backend', level: 85, x: 0, y: 0, z: 0 },
    { id: 'graphql', name: 'GraphQL', group: 'backend', level: 65, x: 0, y: 0, z: 0 },
    
    // Tools & Others
    { id: 'git', name: 'Git & GitHub', group: 'tools', level: 85, x: 0, y: 0, z: 0 },
    { id: 'webpack', name: 'Webpack', group: 'tools', level: 70, x: 0, y: 0, z: 0 },
    { id: 'docker', name: 'Docker', group: 'tools', level: 65, x: 0, y: 0, z: 0 },
    { id: 'cicd', name: 'CI/CD', group: 'tools', level: 60, x: 0, y: 0, z: 0 },
    { id: 'tensorflow', name: 'TensorFlow.js', group: 'tools', level: 55, x: 0, y: 0, z: 0 }
];

// Connections between skills
const skillsConnections = [
    { source: 'html', target: 'css' },
    { source: 'css', target: 'javascript' },
    { source: 'javascript', target: 'react' },
    { source: 'javascript', target: 'threejs' },
    { source: 'javascript', target: 'gsap' },
    { source: 'javascript', target: 'nodejs' },
    { source: 'nodejs', target: 'express' },
    { source: 'express', target: 'rest' },
    { source: 'express', target: 'mongodb' },
    { source: 'nodejs', target: 'graphql' },
    { source: 'javascript', target: 'webpack' },
    { source: 'react', target: 'webpack' },
    { source: 'git', target: 'cicd' },
    { source: 'docker', target: 'cicd' },
    { source: 'javascript', target: 'tensorflow' }
];

// Initialize the 3D skills visualization
function initSkillsVisualization() {
    const container = document.getElementById('skills-visualization');
    
    if (!container) return;
    
    // Create tooltip element
    skillsTooltip = document.createElement('div');
    skillsTooltip.className = 'skills-tooltip';
    skillsTooltip.style.position = 'absolute';
    skillsTooltip.style.padding = '10px';
    skillsTooltip.style.background = 'rgba(0, 0, 0, 0.8)';
    skillsTooltip.style.color = '#fff';
    skillsTooltip.style.borderRadius = '4px';
    skillsTooltip.style.pointerEvents = 'none';
    skillsTooltip.style.opacity = '0';
    skillsTooltip.style.transition = 'opacity 0.3s';
    skillsTooltip.style.zIndex = '1000';
    document.body.appendChild(skillsTooltip);
    
    // Create scene
    skillsScene = new THREE.Scene();
    
    // Create camera
    skillsCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    skillsCamera.position.z = 300;
    
    // Create renderer
    skillsRenderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
    });
    skillsRenderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = '';
    container.appendChild(skillsRenderer.domElement);
    
    // Initialize raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Create skills graph
    createSkillsGraph();
    
    // Add event listeners
    container.addEventListener('mousemove', onSkillsMouseMove);
    container.addEventListener('click', onSkillsClick);
    window.addEventListener('resize', onSkillsWindowResize);
    
    // Start animation loop
    animateSkills();
    
    // Remove loading message
    const loadingElement = container.querySelector('.skills-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Create the 3D skills graph
function createSkillsGraph() {
    skillsGraph = new THREE.Group();
    skillsScene.add(skillsGraph);
    
    // Position nodes in 3D space
    positionNodes();
    
    // Create nodes
    createNodes();
    
    // Create links between nodes
    createLinks();
}

// Position nodes in 3D space using a force-directed layout algorithm
function positionNodes() {
    // Simple force-directed layout simulation
    // In a real application, you might use a more sophisticated algorithm
    
    // Initialize random positions
    skillsData.forEach(skill => {
        skill.x = (Math.random() - 0.5) * 200;
        skill.y = (Math.random() - 0.5) * 200;
        skill.z = (Math.random() - 0.5) * 200;
    });
    
    // Run simulation steps
    for (let i = 0; i < 100; i++) {
        // Apply repulsive forces between all nodes
        for (let j = 0; j < skillsData.length; j++) {
            for (let k = j + 1; k < skillsData.length; k++) {
                const nodeA = skillsData[j];
                const nodeB = skillsData[k];
                
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const dz = nodeB.z - nodeA.z;
                
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance > 0) {
                    // Repulsive force
                    const repulsiveForce = 500 / (distance * distance);
                    
                    const fx = dx / distance * repulsiveForce;
                    const fy = dy / distance * repulsiveForce;
                    const fz = dz / distance * repulsiveForce;
                    
                    nodeA.x -= fx;
                    nodeA.y -= fy;
                    nodeA.z -= fz;
                    
                    nodeB.x += fx;
                    nodeB.y += fy;
                    nodeB.z += fz;
                }
            }
        }
        
        // Apply attractive forces along links
        skillsConnections.forEach(connection => {
            const sourceNode = skillsData.find(node => node.id === connection.source);
            const targetNode = skillsData.find(node => node.id === connection.target);
            
            if (sourceNode && targetNode) {
                const dx = targetNode.x - sourceNode.x;
                const dy = targetNode.y - sourceNode.y;
                const dz = targetNode.z - sourceNode.z;
                
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance > 0) {
                    // Attractive force
                    const attractiveForce = 0.05 * distance;
                    
                    const fx = dx / distance * attractiveForce;
                    const fy = dy / distance * attractiveForce;
                    const fz = dz / distance * attractiveForce;
                    
                    sourceNode.x += fx;
                    sourceNode.y += fy;
                    sourceNode.z += fz;
                    
                    targetNode.x -= fx;
                    targetNode.y -= fy;
                    targetNode.z -= fz;
                }
            }
        });
    }
    
    // Center the graph
    let centerX = 0, centerY = 0, centerZ = 0;
    
    skillsData.forEach(skill => {
        centerX += skill.x;
        centerY += skill.y;
        centerZ += skill.z;
    });
    
    centerX /= skillsData.length;
    centerY /= skillsData.length;
    centerZ /= skillsData.length;
    
    skillsData.forEach(skill => {
        skill.x -= centerX;
        skill.y -= centerY;
        skill.z -= centerZ;
    });
}

// Create visual nodes for each skill
function createNodes() {
    skillsNodes = [];
    
    skillsData.forEach(skill => {
        // Determine color based on group
        let color;
        
        switch (skill.group) {
            case 'frontend':
                color = 0x64ffda; // --accent-primary
                break;
            case 'backend':
                color = 0x7b5cff; // --accent-secondary
                break;
            case 'tools':
                color = 0xff7eb3; // --accent-tertiary
                break;
            default:
                color = 0xffffff;
        }
        
        // Create sphere geometry with size based on skill level
        const radius = 3 + (skill.level / 20);
        const geometry = new THREE.SphereGeometry(radius, 16, 16);
        
        // Create material with glow effect
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        
        // Create mesh
        const node = new THREE.Mesh(geometry, material);
        node.position.set(skill.x, skill.y, skill.z);
        node.userData = { 
            id: skill.id,
            name: skill.name,
            group: skill.group,
            level: skill.level
        };
        
        // Add to scene and store reference
        skillsGraph.add(node);
        skillsNodes.push(node);
        
        // Add glow effect
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3
        });
        
        const glowSphere = new THREE.Mesh(
            new THREE.SphereGeometry(radius * 1.5, 16, 16),
            glowMaterial
        );
        
        node.add(glowSphere);
    });
}

// Create links between connected nodes
function createLinks() {
    skillsLinks = [];
    
    skillsConnections.forEach(connection => {
        const sourceNode = skillsNodes.find(node => node.userData.id === connection.source);
        const targetNode = skillsNodes.find(node => node.userData.id === connection.target);
        
        if (sourceNode && targetNode) {
            // Create line geometry
            const geometry = new THREE.BufferGeometry();
            
            // Set positions
            const positions = new Float32Array([
                sourceNode.position.x, sourceNode.position.y, sourceNode.position.z,
                targetNode.position.x, targetNode.position.y, targetNode.position.z
            ]);
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            // Create material
            const material = new THREE.LineBasicMaterial({
                color: 0x555555,
                transparent: true,
                opacity: 0.5
            });
            
            // Create line
            const line = new THREE.Line(geometry, material);
            
            // Add to scene and store reference
            skillsGraph.add(line);
            skillsLinks.push({
                line: line,
                source: sourceNode,
                target: targetNode
            });
        }
    });
}

// Update link positions when nodes move
function updateLinks() {
    skillsLinks.forEach(link => {
        const positions = link.line.geometry.attributes.position.array;
        
        positions[0] = link.source.position.x;
        positions[1] = link.source.position.y;
        positions[2] = link.source.position.z;
        
        positions[3] = link.target.position.x;
        positions[4] = link.target.position.y;
        positions[5] = link.target.position.z;
        
        link.line.geometry.attributes.position.needsUpdate = true;
    });
}

// Handle mouse movement for interaction
function onSkillsMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    const rect = skillsRenderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(mouse, skillsCamera);
    
    // Check for intersections
    const intersects = raycaster.intersectObjects(skillsNodes);
    
    if (intersects.length > 0) {
        // Show tooltip
        const skill = intersects[0].object.userData;
        
        skillsTooltip.innerHTML = `
            <strong>${skill.name}</strong><br>
            Group: ${skill.group.charAt(0).toUpperCase() + skill.group.slice(1)}<br>
            Level: ${skill.level}%
        `;
        
        skillsTooltip.style.left = `${event.clientX + 10}px`;
        skillsTooltip.style.top = `${event.clientY + 10}px`;
        skillsTooltip.style.opacity = '1';
        
        document.body.style.cursor = 'pointer';
    } else {
        // Hide tooltip
        skillsTooltip.style.opacity = '0';
        document.body.style.cursor = 'default';
    }
}

// Handle click on skills
function onSkillsClick(event) {
    // Calculate mouse position in normalized device coordinates
    const rect = skillsRenderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(mouse, skillsCamera);
    
    // Check for intersections
    const intersects = raycaster.intersectObjects(skillsNodes);
    
    if (intersects.length > 0) {
        const skill = intersects[0].object.userData;
        
        // Highlight connected nodes
        highlightConnections(skill.id);
    }
}

// Highlight connections for a selected skill
function highlightConnections(skillId) {
    // Reset all nodes and links
    skillsNodes.forEach(node => {
        node.material.opacity = 0.3;
        node.children[0].material.opacity = 0.1;
    });
    
    skillsLinks.forEach(link => {
        link.line.material.opacity = 0.1;
    });
    
    // Highlight selected node
    const selectedNode = skillsNodes.find(node => node.userData.id === skillId);
    if (selectedNode) {
        selectedNode.material.opacity = 1;
        selectedNode.children[0].material.opacity = 0.5;
        
        // Find connected skills
        const connections = skillsConnections.filter(
            conn => conn.source === skillId || conn.target === skillId
        );
        
        // Highlight connected nodes and links
        connections.forEach(conn => {
            const connectedId = conn.source === skillId ? conn.target : conn.source;
            const connectedNode = skillsNodes.find(node => node.userData.id === connectedId);
            
            if (connectedNode) {
                connectedNode.material.opacity = 0.8;
                connectedNode.children[0].material.opacity = 0.3;
            }
            
            const link = skillsLinks.find(
                link => 
                    (link.source.userData.id === conn.source && link.target.userData.id === conn.target) ||
                    (link.source.userData.id === conn.target && link.target.userData.id === conn.source)
            );
            
            if (link) {
                link.line.material.opacity = 0.8;
            }
        });
    }
    
    // Reset after a delay
    setTimeout(() => {
        skillsNodes.forEach(node => {
            node.material.opacity = 0.8;
            node.children[0].material.opacity = 0.3;
        });
        
        skillsLinks.forEach(link => {
            link.line.material.opacity = 0.5;
        });
    }, 2000);
}

// Handle window resize
function onSkillsWindowResize() {
    const container = document.getElementById('skills-visualization');
    
    if (!container) return;
    
    skillsCamera.aspect = container.clientWidth / container.clientHeight;
    skillsCamera.updateProjectionMatrix();
    
    skillsRenderer.setSize(container.clientWidth, container.clientHeight);
}

// Animation loop
function animateSkills() {
    skillsAnimationFrame = requestAnimationFrame(animateSkills);
    
    // Rotate the entire graph
    skillsGraph.rotation.y += 0.002;
    
    // Update link positions
    updateLinks();
    
    // Render scene
    skillsRenderer.render(skillsScene, skillsCamera);
}

// Initialize when the DOM is loaded and when scrolled into view
document.addEventListener('DOMContentLoaded', () => {
    // Use Intersection Observer to initialize when scrolled into view
    const skillsSection = document.getElementById('skills');
    
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initSkillsVisualization();
                    observer.disconnect(); // Only initialize once
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(skillsSection);
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (skillsAnimationFrame) {
        cancelAnimationFrame(skillsAnimationFrame);
    }
    
    if (skillsTooltip && skillsTooltip.parentNode) {
        skillsTooltip.parentNode.removeChild(skillsTooltip);
    }
});
