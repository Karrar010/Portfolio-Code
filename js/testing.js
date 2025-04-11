// Browser and Device Testing Script
// This script helps test the website across different viewport sizes and browsers

// Define common device viewport sizes for testing
const deviceViewports = {
  mobile: {
    width: 375,
    height: 667,
    name: 'Mobile (iPhone 8/SE)'
  },
  mobileLarge: {
    width: 414,
    height: 896,
    name: 'Mobile Large (iPhone 11 Pro Max)'
  },
  tablet: {
    width: 768,
    height: 1024,
    name: 'Tablet (iPad)'
  },
  laptop: {
    width: 1366,
    height: 768,
    name: 'Laptop'
  },
  desktop: {
    width: 1920,
    height: 1080,
    name: 'Desktop'
  }
};

// Define browser features to test
const browserFeatures = [
  {
    name: 'WebGL',
    test: () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    }
  },
  {
    name: 'Web Speech API',
    test: () => {
      return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
  },
  {
    name: 'Service Workers',
    test: () => {
      return 'serviceWorker' in navigator;
    }
  },
  {
    name: 'WebP Support',
    test: () => {
      const elem = document.createElement('canvas');
      if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      return false;
    }
  },
  {
    name: 'Intersection Observer',
    test: () => {
      return 'IntersectionObserver' in window;
    }
  },
  {
    name: 'CSS Grid',
    test: () => {
      return 'grid' in document.documentElement.style;
    }
  },
  {
    name: 'CSS Flexbox',
    test: () => {
      return 'flexBasis' in document.documentElement.style;
    }
  }
];

// Test responsive design
function testResponsiveDesign() {
  console.log('=== RESPONSIVE DESIGN TESTING ===');
  
  // Get current viewport size
  const currentWidth = window.innerWidth;
  const currentHeight = window.innerHeight;
  
  console.log(`Current viewport: ${currentWidth}px × ${currentHeight}px`);
  
  // Determine current device category
  let currentDevice = 'custom';
  for (const [device, dimensions] of Object.entries(deviceViewports)) {
    if (Math.abs(dimensions.width - currentWidth) < 100) {
      currentDevice = device;
      break;
    }
  }
  
  console.log(`Detected device category: ${currentDevice}`);
  
  // Check for responsive elements
  const responsiveElements = [
    { selector: '.nav-links', property: 'display' },
    { selector: '.mobile-nav-toggle', property: 'display' },
    { selector: '.projects-grid', property: 'grid-template-columns' },
    { selector: '.about-content', property: 'flex-direction' },
    { selector: '.contact-container', property: 'flex-direction' }
  ];
  
  console.log('\nChecking responsive elements:');
  responsiveElements.forEach(element => {
    const el = document.querySelector(element.selector);
    if (el) {
      const style = window.getComputedStyle(el);
      console.log(`${element.selector} - ${element.property}: ${style[element.property]}`);
    } else {
      console.log(`${element.selector} - Not found`);
    }
  });
  
  // Check for viewport meta tag
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    console.log(`\nViewport meta tag: ${viewportMeta.getAttribute('content')}`);
  } else {
    console.log('\nViewport meta tag not found!');
  }
  
  // Check for media queries
  const styleSheets = document.styleSheets;
  let mediaQueriesCount = 0;
  
  try {
    for (let i = 0; i < styleSheets.length; i++) {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules;
      if (rules) {
        for (let j = 0; j < rules.length; j++) {
          if (rules[j].type === CSSRule.MEDIA_RULE) {
            mediaQueriesCount++;
          }
        }
      }
    }
    console.log(`\nDetected ${mediaQueriesCount} media queries`);
  } catch (e) {
    console.log('\nCould not access CSS rules due to security restrictions');
  }
}

// Test browser features
function testBrowserFeatures() {
  console.log('\n=== BROWSER FEATURE TESTING ===');
  console.log(`Browser: ${navigator.userAgent}`);
  
  browserFeatures.forEach(feature => {
    const supported = feature.test();
    console.log(`${feature.name}: ${supported ? 'Supported' : 'Not supported'}`);
  });
}

// Test interactive elements
function testInteractiveElements() {
  console.log('\n=== INTERACTIVE ELEMENTS TESTING ===');
  
  const interactiveElements = [
    { name: 'WebGL Background', selector: '#hero-canvas-container canvas' },
    { name: '3D Skills Visualization', selector: '#skills-visualization canvas' },
    { name: 'Project Filters', selector: '.filter-btn' },
    { name: 'Timeline Controls', selector: '.timeline-control' },
    { name: 'Contact Form', selector: '.contact-form' },
    { name: 'Theme Toggle', selector: '#theme-toggle-btn' },
    { name: 'Code Editor', selector: '#code-editor-area' },
    { name: 'Voice Navigation', selector: '#voice-nav-toggle' }
  ];
  
  interactiveElements.forEach(element => {
    const el = document.querySelector(element.selector);
    console.log(`${element.name}: ${el ? 'Present' : 'Missing'}`);
  });
}

// Test performance
function testPerformance() {
  console.log('\n=== PERFORMANCE TESTING ===');
  
  // Check if Performance API is available
  if (!('performance' in window)) {
    console.log('Performance API not supported');
    return;
  }
  
  // Get navigation timing metrics
  const navigationTiming = performance.getEntriesByType('navigation')[0];
  if (navigationTiming) {
    console.log(`DOM Content Loaded: ${navigationTiming.domContentLoadedEventEnd.toFixed(0)}ms`);
    console.log(`Load Event: ${navigationTiming.loadEventEnd.toFixed(0)}ms`);
  }
  
  // Get paint timing metrics
  const paintMetrics = performance.getEntriesByType('paint');
  paintMetrics.forEach(metric => {
    console.log(`${metric.name}: ${metric.startTime.toFixed(0)}ms`);
  });
  
  // Check for long tasks
  if ('PerformanceObserver' in window) {
    let longTasksCount = 0;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      longTasksCount += entries.length;
    });
    
    try {
      observer.observe({ entryTypes: ['longtask'] });
      console.log(`Long Tasks: ${longTasksCount}`);
    } catch (e) {
      console.log('Long Tasks API not supported');
    }
  }
  
  // Check resource count
  const resources = performance.getEntriesByType('resource');
  const resourceTypes = {};
  
  resources.forEach(resource => {
    const type = resource.initiatorType;
    resourceTypes[type] = (resourceTypes[type] || 0) + 1;
  });
  
  console.log('\nResource breakdown:');
  for (const [type, count] of Object.entries(resourceTypes)) {
    console.log(`${type}: ${count}`);
  }
}

// Test accessibility
function testAccessibility() {
  console.log('\n=== ACCESSIBILITY TESTING ===');
  
  // Check for basic accessibility features
  const accessibilityFeatures = [
    { name: 'Alt text on images', test: () => {
      const images = document.querySelectorAll('img');
      let missingAlt = 0;
      
      images.forEach(img => {
        if (!img.hasAttribute('alt')) {
          missingAlt++;
        }
      });
      
      return {
        pass: missingAlt === 0,
        details: `${missingAlt} images missing alt text out of ${images.length}`
      };
    }},
    { name: 'Form labels', test: () => {
      const inputs = document.querySelectorAll('input, textarea, select');
      let missingLabels = 0;
      
      inputs.forEach(input => {
        const id = input.getAttribute('id');
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          if (!label) {
            missingLabels++;
          }
        } else {
          // Check if input is wrapped in a label
          if (!input.closest('label')) {
            missingLabels++;
          }
        }
      });
      
      return {
        pass: missingLabels === 0,
        details: `${missingLabels} form elements missing labels out of ${inputs.length}`
      };
    }},
    { name: 'Heading hierarchy', test: () => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      let issues = 0;
      
      // Check if there's exactly one h1
      const h1Count = headings.filter(h => h.tagName === 'H1').length;
      if (h1Count !== 1) {
        issues++;
      }
      
      // Check for skipped levels
      const levels = headings.map(h => parseInt(h.tagName.substring(1)));
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] > levels[i-1] + 1) {
          issues++;
        }
      }
      
      return {
        pass: issues === 0,
        details: `${issues} heading hierarchy issues found`
      };
    }},
    { name: 'Color contrast', test: () => {
      // This is a simplified check - a real test would use WCAG algorithms
      const elements = document.querySelectorAll('body *');
      let potentialIssues = 0;
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const bgColor = style.backgroundColor;
        const color = style.color;
        
        // Very basic check - just looking for very light text on very light backgrounds
        // or very dark text on very dark backgrounds
        if (bgColor.includes('rgba(255, 255, 255') && color.includes('rgba(255, 255, 255')) {
          potentialIssues++;
        }
        if (bgColor.includes('rgba(0, 0, 0') && color.includes('rgba(0, 0, 0')) {
          potentialIssues++;
        }
      });
      
      return {
        pass: potentialIssues === 0,
        details: `${potentialIssues} potential color contrast issues found`
      };
    }},
    { name: 'ARIA attributes', test: () => {
      const ariaElements = document.querySelectorAll('[aria-*]');
      return {
        pass: true,
        details: `${ariaElements.length} elements with ARIA attributes found`
      };
    }}
  ];
  
  accessibilityFeatures.forEach(feature => {
    const result = feature.test();
    console.log(`${feature.name}: ${result.pass ? 'Pass' : 'Fail'} - ${result.details}`);
  });
}

// Run all tests
function runAllTests() {
  console.log('PORTFOLIO WEBSITE TESTING REPORT');
  console.log('===============================');
  console.log(`Date: ${new Date().toLocaleString()}`);
  
  testResponsiveDesign();
  testBrowserFeatures();
  testInteractiveElements();
  testPerformance();
  testAccessibility();
  
  console.log('\n=== TESTING COMPLETE ===');
}

// Run tests when the page is fully loaded
window.addEventListener('load', () => {
  // Wait a bit for all resources to load and initialize
  setTimeout(runAllTests, 2000);
});
