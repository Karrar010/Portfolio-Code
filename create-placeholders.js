// Create placeholder images for the portfolio
// This script creates basic placeholder images for testing

// Import required modules
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Directories
const targetDir = path.join(__dirname, 'images');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Create placeholder images
async function createPlaceholderImages() {
  try {
    console.log('Creating placeholder images...');
    
    // Profile image
    createPlaceholder('profile-placeholder.jpg', 300, 300, '#3a3a3a', 'Profile');
    
    // Project images
    createPlaceholder('project1-placeholder.jpg', 800, 500, '#2a4d69', 'Project 1');
    createPlaceholder('project2-placeholder.jpg', 800, 500, '#4b86b4', 'Project 2');
    createPlaceholder('project3-placeholder.jpg', 800, 500, '#adcbe3', 'Project 3');
    
    console.log('Placeholder images created successfully!');
  } catch (error) {
    console.error('Error creating placeholder images:', error);
  }
}

// Helper function to create a placeholder image
function createPlaceholder(filename, width, height, bgColor, text) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.floor(width / 10)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  // Save to file
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(targetDir, filename), buffer);
  
  console.log(`Created: ${filename}`);
}

// Run the function
createPlaceholderImages();
