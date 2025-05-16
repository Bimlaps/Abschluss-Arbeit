const CACHE_NAME = '247vitrine-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Service Worker Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache geöffnet');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Service Worker Aktivierung
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Fetch Event Handling
self.addEventListener('fetch', (event) => {
  // API-Anfragen nicht cachen
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache-Hit - return response
        if (response) {
          return response;
        }

        // Cache-Miss - fetch and cache
        return fetch(event.request)
          .then((response) => {
            // Prüfen ob gültige Response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Response klonen und cachen
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Push Notification Handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/logo192.png',
    badge: '/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Öffnen',
        icon: '/check.png'
      },
      {
        action: 'close',
        title: 'Schließen',
        icon: '/cross.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('247Vitrine', options)
  );
});

// Notification Click Handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

// Analytics Sync Funktion
async function syncAnalytics() {
  try {
    const analytics = await getStoredAnalytics();
    if (analytics.length === 0) return;

    const response = await fetch('/api/analytics/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(analytics)
    });

    if (response.ok) {
      await clearStoredAnalytics();
    }
  } catch (error) {
    console.error('Fehler beim Analytics Sync:', error);
  }
}

// Helper Funktionen
async function getStoredAnalytics() {
  const db = await openDB();
  return db.getAll('analytics');
}

async function clearStoredAnalytics() {
  const db = await openDB();
  return db.clear('analytics');
}

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('247vitrine', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('analytics')) {
        db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
} 