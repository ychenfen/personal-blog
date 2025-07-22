/**
 * Service Worker for Personal Website
 * Provides offline functionality and performance optimization
 */

const CACHE_NAME = 'personal-website-v1.0.0';
const OFFLINE_PAGE = '/offline.html';

// Files to cache for offline functionality
const CACHE_FILES = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/images/avatar.jpg',
  '/assets/images/og-image.jpg',
  '/assets/fonts/Inter-Regular.woff2',
  '/assets/fonts/Inter-Bold.woff2',
  '/manifest.json',
  OFFLINE_PAGE
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching essential files');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('Service Worker: Cache complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then((cache) => {
              return cache.match(OFFLINE_PAGE);
            });
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cache valid responses
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return fallback for failed requests
            if (event.request.destination === 'image') {
              return caches.match('/assets/images/placeholder.svg');
            }
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/images/icon-192.png',
      badge: '/assets/images/badge-72.png',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: [
        {
          action: 'explore',
          title: '查看网站',
          icon: '/assets/images/checkmark.png'
        },
        {
          action: 'close',
          title: '关闭',
          icon: '/assets/images/xmark.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Helper function to sync contact form data
async function syncContactForm() {
  try {
    const cache = await caches.open('contact-form-data');
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      const data = await response.json();
      
      // Attempt to send the data
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        // Remove from cache if successful
        await cache.delete(request);
        console.log('Background sync: Contact form data sent successfully');
      } catch (error) {
        console.error('Background sync: Failed to send contact form data', error);
      }
    }
  } catch (error) {
    console.error('Background sync error:', error);
  }
}

// Utility function to update cache
function updateCache(request, response) {
  if (response.type === 'basic' && response.status === 200) {
    const responseClone = response.clone();
    caches.open(CACHE_NAME)
      .then((cache) => {
        cache.put(request, responseClone);
      });
  }
}

// Handle updates and notify users
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Preload critical resources
function preloadCriticalResources() {
  const criticalResources = [
    '/assets/css/main.css',
    '/assets/js/main.js',
    '/assets/images/avatar.jpg'
  ];

  return caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll(criticalResources);
    });
}

// Analytics for offline usage
function trackOfflineUsage(url) {
  // Store offline usage data
  if ('indexedDB' in self) {
    // Implementation for offline analytics storage
    console.log('Offline page accessed:', url);
  }
}