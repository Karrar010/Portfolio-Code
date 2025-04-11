// Performance optimization script
// This script adds responsive image loading and performance improvements

// Update image elements to use optimized images with srcset for responsive loading
function updateImagesForResponsiveness() {
  // Get all image elements
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (!src) return;
    
    // Skip images that are already optimized
    if (src.includes('optimized')) return;
    
    // Get the base filename without extension
    const baseName = src.split('/').pop().split('.')[0];
    
    // Only process our placeholder images
    if (!baseName.includes('placeholder')) return;
    
    // Create srcset for responsive images
    const srcset = `
      images/optimized/${baseName}-400.webp 400w,
      images/optimized/${baseName}-800.webp 800w,
      images/optimized/${baseName}-1200.webp 1200w
    `;
    
    // Create fallback srcset for browsers that don't support webp
    const fallbackSrcset = `
      images/optimized/${baseName}-400.jpg 400w,
      images/optimized/${baseName}-800.jpg 800w,
      images/optimized/${baseName}-1200.jpg 1200w
    `;
    
    // Set sizes attribute based on image's parent width
    const sizes = '(max-width: 768px) 100vw, 50vw';
    
    // Update image attributes
    img.setAttribute('srcset', srcset);
    img.setAttribute('sizes', sizes);
    
    // Add fallback source with picture element
    const picture = document.createElement('picture');
    const sourceWebp = document.createElement('source');
    sourceWebp.setAttribute('srcset', srcset);
    sourceWebp.setAttribute('sizes', sizes);
    sourceWebp.setAttribute('type', 'image/webp');
    
    const sourceJpg = document.createElement('source');
    sourceJpg.setAttribute('srcset', fallbackSrcset);
    sourceJpg.setAttribute('sizes', sizes);
    sourceJpg.setAttribute('type', 'image/jpeg');
    
    // Replace the image with picture element
    const parent = img.parentNode;
    img.setAttribute('src', `images/optimized/${baseName}.jpg`); // Fallback src
    img.setAttribute('loading', 'lazy'); // Add lazy loading
    
    picture.appendChild(sourceWebp);
    picture.appendChild(sourceJpg);
    picture.appendChild(img.cloneNode(true));
    
    if (parent) {
      parent.replaceChild(picture, img);
    }
  });
}

// Implement lazy loading for images and sections
function implementLazyLoading() {
  // Lazy load images that are not in picture elements
  const images = document.querySelectorAll('img:not(picture img)');
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
  
  // Lazy load sections with IntersectionObserver
  const sections = document.querySelectorAll('section:not(#hero)');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    section.classList.add('section-hidden');
    sectionObserver.observe(section);
  });
}

// Optimize font loading
function optimizeFontLoading() {
  // Add font-display: swap to ensure text is visible while fonts are loading
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Poppins';
      font-display: swap;
    }
    
    @font-face {
      font-family: 'Space Mono';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}

// Implement resource hints for faster loading
function addResourceHints() {
  // Preconnect to external resources
  const preconnectLinks = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com'
  ];
  
  preconnectLinks.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
  
  // Preload critical resources
  const preloadResources = [
    { href: 'css/styles.css', as: 'style' },
    { href: 'js/main.js', as: 'script' },
    { href: 'images/optimized/profile-placeholder.webp', as: 'image' }
  ];
  
  preloadResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    document.head.appendChild(link);
  });
}

// Register service worker for offline capabilities
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/js/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
}

// Implement performance monitoring
function setupPerformanceMonitoring() {
  // Report performance metrics
  if ('performance' in window && 'PerformanceObserver' in window) {
    // Create performance observer
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        // Log performance metrics
        console.log(`[Performance] ${entry.name}: ${entry.startTime.toFixed(0)}ms`);
      });
    });
    
    // Observe different performance metrics
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
    
    // Report Core Web Vitals
    window.addEventListener('load', () => {
      setTimeout(() => {
        const lcpEntry = performance.getEntriesByType('largest-contentful-paint').pop();
        const fidEntry = performance.getEntriesByType('first-input').pop();
        const clsEntries = performance.getEntriesByType('layout-shift');
        
        let cumulativeLayoutShift = 0;
        clsEntries.forEach(entry => {
          if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value;
          }
        });
        
        console.log('[Core Web Vitals]', {
          LCP: lcpEntry ? lcpEntry.startTime.toFixed(0) + 'ms' : 'Not available',
          FID: fidEntry ? fidEntry.processingStart - fidEntry.startTime + 'ms' : 'Not available',
          CLS: cumulativeLayoutShift.toFixed(3)
        });
      }, 3000);
    });
  }
}

// Initialize performance optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Update images for responsive loading
  updateImagesForResponsiveness();
  
  // Implement lazy loading
  implementLazyLoading();
  
  // Optimize font loading
  optimizeFontLoading();
  
  // Add resource hints
  addResourceHints();
  
  // Register service worker
  registerServiceWorker();
  
  // Setup performance monitoring
  setupPerformanceMonitoring();
  
  console.log('Performance optimizations applied');
});
