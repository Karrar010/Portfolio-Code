// Service Worker for Offline Capabilities
// This script implements a service worker for caching and offline access

// Cache name and version
const CACHE_NAME = 'portfolio-cache-v1';

// Assets to cache on install
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/webgl-background.js',
  '/js/skills-visualization.js',
  '/js/voice-navigation.js',
  '/js/code-editor.js',
  '/js/ai-recommendations.js',
  '/images/profile-placeholder.jpg',
  '/images/project1-placeholder.jpg',
  '/images/project2-placeholder.jpg',
  '/images/project3-placeholder.jpg',
  // Add other assets as needed
];

// Install event - cache assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activated');
  
  // Remove old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching');
  
  event.respondWith(
    // Try the cache first
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add to cache for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(err => {
            // If both cache and network fail, show offline page
            if (event.request.url.indexOf('.html') > -1) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});
