// AI Project Recommendation System
// This script implements an AI-driven project recommendation system

// Global variables
let userInteractions = [];
let projectRecommendations = [];
let recommendationModel = null;

// Project data
const projectsData = [
    {
        id: 1,
        title: 'Interactive Data Visualization',
        category: 'web',
        tags: ['d3.js', 'svg', 'data visualization', 'interactive', 'frontend'],
        description: 'An interactive data visualization dashboard that transforms complex datasets into intuitive visual representations.',
        complexity: 0.8
    },
    {
        id: 2,
        title: 'AI Image Recognition App',
        category: 'ai',
        tags: ['tensorflow.js', 'machine learning', 'computer vision', 'frontend', 'api'],
        description: 'A web application that uses TensorFlow.js to recognize and classify images in real-time.',
        complexity: 0.9
    },
    {
        id: 3,
        title: 'E-commerce Platform',
        category: 'web',
        tags: ['react', 'node.js', 'mongodb', 'full-stack', 'payment integration'],
        description: 'A complete e-commerce solution with product management, cart functionality, and secure payment processing.',
        complexity: 0.7
    },
    {
        id: 4,
        title: 'Mobile Weather App',
        category: 'mobile',
        tags: ['react native', 'api integration', 'geolocation', 'mobile', 'ui design'],
        description: 'A cross-platform mobile application that provides real-time weather forecasts based on user location.',
        complexity: 0.5
    },
    {
        id: 5,
        title: 'Blockchain Explorer',
        category: 'other',
        tags: ['blockchain', 'web3', 'cryptocurrency', 'data visualization', 'api'],
        description: 'A tool for visualizing and exploring blockchain transactions and smart contracts.',
        complexity: 0.85
    },
    {
        id: 6,
        title: 'Natural Language Processing Chatbot',
        category: 'ai',
        tags: ['nlp', 'machine learning', 'chatbot', 'api', 'user interaction'],
        description: 'An intelligent chatbot that understands and responds to natural language queries.',
        complexity: 0.75
    },
    {
        id: 7,
        title: 'Portfolio Website Template',
        category: 'web',
        tags: ['html', 'css', 'javascript', 'responsive design', 'frontend'],
        description: 'A customizable portfolio website template for creative professionals.',
        complexity: 0.4
    },
    {
        id: 8,
        title: 'Augmented Reality Experience',
        category: 'other',
        tags: ['ar', 'webxr', 'three.js', 'interactive', '3d'],
        description: 'An augmented reality web experience that overlays digital content on the real world.',
        complexity: 0.95
    }
];

// Initialize the recommendation system
function initRecommendationSystem() {
    console.log('Initializing AI project recommendation system...');
    
    // Load TensorFlow.js if available
    if (window.tf) {
        console.log('TensorFlow.js is available, creating recommendation model...');
        createRecommendationModel();
    } else {
        console.log('TensorFlow.js not available, using fallback recommendation system...');
        // Use fallback recommendation system
        recommendationModel = {
            predict: predictWithFallbackSystem
        };
    }
    
    // Set up event listeners for user interactions
    setupInteractionTracking();
}

// Create a simple recommendation model using TensorFlow.js
async function createRecommendationModel() {
    try {
        // Create a simple neural network model
        const model = tf.sequential();
        
        // Input layer: user interaction features
        model.add(tf.layers.dense({
            units: 16,
            activation: 'relu',
            inputShape: [10] // 10 features representing user interactions
        }));
        
        // Hidden layer
        model.add(tf.layers.dense({
            units: 8,
            activation: 'relu'
        }));
        
        // Output layer: project scores
        model.add(tf.layers.dense({
            units: projectsData.length,
            activation: 'sigmoid'
        }));
        
        // Compile the model
        model.compile({
            optimizer: tf.train.adam(),
            loss: 'meanSquaredError'
        });
        
        // Initialize with some pre-trained weights (simulated)
        // In a real application, you would load actual pre-trained weights
        const weights = generateRandomWeights(model);
        await setModelWeights(model, weights);
        
        recommendationModel = model;
        console.log('Recommendation model created successfully');
    } catch (error) {
        console.error('Error creating recommendation model:', error);
        // Use fallback recommendation system
        recommendationModel = {
            predict: predictWithFallbackSystem
        };
    }
}

// Generate random weights for the model (for demonstration purposes)
function generateRandomWeights(model) {
    const weights = [];
    
    for (const layer of model.layers) {
        const layerWeights = layer.getWeights().map(w => {
            return tf.randomNormal(w.shape, 0, 0.1);
        });
        weights.push(layerWeights);
    }
    
    return weights;
}

// Set model weights
async function setModelWeights(model, weights) {
    for (let i = 0; i < model.layers.length; i++) {
        const layer = model.layers[i];
        const layerWeights = weights[i];
        layer.setWeights(layerWeights);
    }
}

// Set up event listeners to track user interactions
function setupInteractionTracking() {
    // Track project card views
    document.querySelectorAll('.project-card').forEach(card => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const projectId = parseInt(card.getAttribute('data-id'));
                    if (projectId) {
                        trackInteraction('view', projectId);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(card);
    });
    
    // Track project card clicks
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = parseInt(card.getAttribute('data-id'));
            if (projectId) {
                trackInteraction('click', projectId);
            }
        });
    });
    
    // Track filter button clicks
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            trackInteraction('filter', null, filter);
        });
    });
    
    // Track section views
    document.querySelectorAll('section').forEach(section => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = section.getAttribute('id');
                    trackInteraction('section', null, sectionId);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(section);
    });
}

// Track user interactions
function trackInteraction(type, projectId = null, value = null) {
    const interaction = {
        type,
        projectId,
        value,
        timestamp: Date.now()
    };
    
    userInteractions.push(interaction);
    
    // Limit the number of stored interactions
    if (userInteractions.length > 50) {
        userInteractions.shift();
    }
    
    // Update recommendations after significant interactions
    if (userInteractions.length % 5 === 0) {
        updateRecommendations();
    }
}

// Update project recommendations based on user interactions
function updateRecommendations() {
    if (!recommendationModel) {
        console.log('Recommendation model not ready');
        return;
    }
    
    // Extract features from user interactions
    const features = extractFeaturesFromInteractions();
    
    // Get recommendations
    if (window.tf && recommendationModel.predict) {
        // Use TensorFlow.js model
        const inputTensor = tf.tensor2d([features]);
        const predictions = recommendationModel.predict(inputTensor);
        const scores = predictions.dataSync();
        
        // Clean up tensors
        inputTensor.dispose();
        predictions.dispose();
        
        // Create recommendations array
        projectRecommendations = projectsData.map((project, index) => ({
            ...project,
            score: scores[index]
        }))
        .sort((a, b) => b.score - a.score);
    } else {
        // Use fallback system
        projectRecommendations = predictWithFallbackSystem(features);
    }
    
    // Update UI with recommendations
    updateRecommendationUI();
}

// Extract features from user interactions
function extractFeaturesFromInteractions() {
    // Initialize feature vector
    const features = Array(10).fill(0);
    
    // Count interaction types
    const viewCounts = {};
    const clickCounts = {};
    const filterCounts = {};
    const sectionCounts = {};
    
    // Process interactions
    userInteractions.forEach(interaction => {
        switch (interaction.type) {
            case 'view':
                viewCounts[interaction.projectId] = (viewCounts[interaction.projectId] || 0) + 1;
                break;
            case 'click':
                clickCounts[interaction.projectId] = (clickCounts[interaction.projectId] || 0) + 1;
                break;
            case 'filter':
                filterCounts[interaction.value] = (filterCounts[interaction.value] || 0) + 1;
                break;
            case 'section':
                sectionCounts[interaction.value] = (sectionCounts[interaction.value] || 0) + 1;
                break;
        }
    });
    
    // Feature 0-1: Most viewed project categories
    const viewedProjects = Object.keys(viewCounts).map(id => parseInt(id));
    const viewedCategories = viewedProjects.map(id => {
        const project = projectsData.find(p => p.id === id);
        return project ? project.category : null;
    }).filter(Boolean);
    
    const categoryCount = {};
    viewedCategories.forEach(category => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    const topCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(entry => entry[0]);
    
    if (topCategories[0]) {
        features[0] = ['web', 'ai', 'mobile', 'other'].indexOf(topCategories[0]) / 3;
    }
    
    if (topCategories[1]) {
        features[1] = ['web', 'ai', 'mobile', 'other'].indexOf(topCategories[1]) / 3;
    }
    
    // Feature 2: Click to view ratio (engagement level)
    const totalViews = Object.values(viewCounts).reduce((sum, count) => sum + count, 0);
    const totalClicks = Object.values(clickCounts).reduce((sum, count) => sum + count, 0);
    features[2] = totalViews > 0 ? Math.min(totalClicks / totalViews, 1) : 0;
    
    // Feature 3: Filter usage frequency
    const totalFilters = Object.values(filterCounts).reduce((sum, count) => sum + count, 0);
    features[3] = Math.min(totalFilters / Math.max(userInteractions.length, 1), 1);
    
    // Feature 4: Most used filter
    const topFilter = Object.entries(filterCounts)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0])[0];
    
    if (topFilter) {
        features[4] = ['all', 'web', 'mobile', 'ai', 'other'].indexOf(topFilter) / 4;
    }
    
    // Feature 5: Section interest - projects vs skills
    const projectsSectionTime = sectionCounts['projects'] || 0;
    const skillsSectionTime = sectionCounts['skills'] || 0;
    features[5] = (projectsSectionTime > skillsSectionTime) ? 1 : 0;
    
    // Feature 6: Complexity preference based on viewed projects
    const viewedProjectsData = viewedProjects
        .map(id => projectsData.find(p => p.id === id))
        .filter(Boolean);
    
    if (viewedProjectsData.length > 0) {
        const avgComplexity = viewedProjectsData.reduce((sum, project) => sum + project.complexity, 0) / viewedProjectsData.length;
        features[6] = avgComplexity;
    } else {
        features[6] = 0.5; // Default to medium complexity
    }
    
    // Feature 7-9: Tag preferences
    const tagCounts = {};
    viewedProjectsData.forEach(project => {
        project.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    
    const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
    
    // Common tag categories
    const tagCategories = [
        ['frontend', 'ui design', 'responsive design', 'css', 'html'],
        ['backend', 'api', 'node.js', 'mongodb', 'full-stack'],
        ['machine learning', 'ai', 'tensorflow.js', 'nlp', 'computer vision'],
        ['data visualization', 'd3.js', 'svg', 'interactive', '3d'],
        ['mobile', 'react native', 'cross-platform', 'geolocation']
    ];
    
    for (let i = 0; i < 3; i++) {
        if (topTags[i]) {
            // Find which category this tag belongs to
            for (let j = 0; j < tagCategories.length; j++) {
                if (tagCategories[j].includes(topTags[i])) {
                    features[7 + i] = j / (tagCategories.length - 1);
                    break;
                }
            }
        }
    }
    
    return features;
}

// Fallback recommendation system (rule-based)
function predictWithFallbackSystem(features) {
    // Extract preferences from features
    const preferredCategories = [];
    
    if (features[0] > 0) {
        const categoryIndex = Math.round(features[0] * 3);
        preferredCategories.push(['web', 'ai', 'mobile', 'other'][categoryIndex]);
    }
    
    if (features[1] > 0) {
        const categoryIndex = Math.round(features[1] * 3);
        const secondCategory = ['web', 'ai', 'mobile', 'other'][categoryIndex];
        if (!preferredCategories.includes(secondCategory)) {
            preferredCategories.push(secondCategory);
        }
    }
    
    const engagementLevel = features[2];
    const complexityPreference = features[6];
    
    // Score projects based on preferences
    return projectsData.map(project => {
        let score = 0.5; // Base score
        
        // Category match
        if (preferredCategories.includes(project.category)) {
            score += 0.2;
        }
        
        // Complexity match (higher score for closer match)
        score += (1 - Math.abs(complexityPreference - project.complexity)) * 0.2;
        
        // Engagement level factor (higher engagement users prefer more complex projects)
        if (engagementLevel > 0.5 && project.complexity > 0.7) {
            score += 0.1;
        }
        
        return {
            ...project,
            score
        };
    }).sort((a, b) => b.score - a.score);
}

// Update UI with recommendations
function updateRecommendationUI() {
    const recommendationContainer = document.querySelector('.project-recommendations');
    if (!recommendationContainer) return;
    
    // Clear existing recommendations
    recommendationContainer.innerHTML = '';
    
    // Get top 3 recommendations
    const topRecommendations = projectRecommendations.slice(0, 3);
    
    // Create recommendation elements
    topRecommendations.forEach(project => {
        const recommendationEl = document.createElement('div');
        recommendationEl.className = 'recommendation-card';
        recommendationEl.innerHTML = `
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="recommendation-tags">
                ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            <div class="recommendation-match">
                <div class="match-bar">
                    <div class="match-fill" style="width: ${Math.round(project.score * 100)}%"></div>
                </div>
                <span>${Math.round(project.score * 100)}% match</span>
            </div>
        `;
        
        recommendationContainer.appendChild(recommendationEl);
    });
    
    // Show recommendation section if hidden
    const recommendationSection = document.querySelector('.recommendations-section');
    if (recommendationSection) {
        recommendationSection.style.display = 'block';
    }
}

// Add recommendation section to projects area
function addRecommendationSection() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;
    
    const recommendationsSection = document.createElement('div');
    recommendationsSection.className = 'recommendations-section';
    recommendationsSection.style.display = 'none'; // Hidden initially
    recommendationsSection.innerHTML = `
        <h3>Recommended for You</h3>
        <p>Based on your interests, you might like these projects:</p>
        <div class="project-recommendations"></div>
    `;
    
    // Insert after the projects filter
    const projectsFilter = projectsSection.querySelector('.projects-filter');
    if (projectsFilter) {
        projectsFilter.parentNode.insertBefore(recommendationsSection, projectsFilter.nextSibling);
    } else {
        // Fallback: insert at the beginning of the section
        projectsSection.insertBefore(recommendationsSection, projectsSection.firstChild.nextSibling);
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add recommendation section to the DOM
    addRecommendationSection();
    
    // Initialize recommendation system when projects section is visible
    const projectsSection = document.getElementById('projects');
    
    if (projectsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initRecommendationSystem();
                    observer.disconnect(); // Only initialize once
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(projectsSection);
    }
});
