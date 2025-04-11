// Image optimization script
// This script creates optimized versions of placeholder images

// Import required modules
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directories
const sourceDir = path.join(__dirname, 'images');
const targetDir = path.join(__dirname, 'images/optimized');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Image optimization options
const optimizationOptions = {
  jpeg: {
    quality: 80,
    progressive: true,
  },
  webp: {
    quality: 75,
  },
  png: {
    compressionLevel: 8,
    quality: 80,
  },
  avif: {
    quality: 65,
  }
};

// Process images
async function optimizeImages() {
  try {
    // Get all files in the source directory
    const files = fs.readdirSync(sourceDir);
    
    // Filter image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext) && !file.includes('optimized');
    });
    
    console.log(`Found ${imageFiles.length} images to optimize`);
    
    // Process each image
    for (const file of imageFiles) {
      const sourcePath = path.join(sourceDir, file);
      const fileBaseName = path.basename(file, path.extname(file));
      
      // Skip if file is in a subdirectory
      if (!fs.statSync(sourcePath).isFile()) continue;
      
      console.log(`Optimizing: ${file}`);
      
      // Create optimized JPEG
      await sharp(sourcePath)
        .resize(800) // Resize to reasonable dimensions
        .jpeg(optimizationOptions.jpeg)
        .toFile(path.join(targetDir, `${fileBaseName}.jpg`));
      
      // Create WebP version
      await sharp(sourcePath)
        .resize(800)
        .webp(optimizationOptions.webp)
        .toFile(path.join(targetDir, `${fileBaseName}.webp`));
      
      // Create responsive versions
      const sizes = [400, 800, 1200];
      
      for (const size of sizes) {
        // JPEG responsive
        await sharp(sourcePath)
          .resize(size)
          .jpeg(optimizationOptions.jpeg)
          .toFile(path.join(targetDir, `${fileBaseName}-${size}.jpg`));
        
        // WebP responsive
        await sharp(sourcePath)
          .resize(size)
          .webp(optimizationOptions.webp)
          .toFile(path.join(targetDir, `${fileBaseName}-${size}.webp`));
      }
    }
    
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

// Run the optimization
optimizeImages();
