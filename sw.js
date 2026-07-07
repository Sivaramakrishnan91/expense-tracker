// Service Worker for Personal Finance Tracker PWA
const CACHE_NAME = 'finance-tracker-v1';

const ASSETS_TO_CACHE = [
    '/expense-tracker/',
    '/expense-tracker/index.html',
    '/expense-tracker/manifest.json',
    '/expense-tracker/css/styles.css',
    '/expense-tracker/js/app.js',
    '/expense-tracker/js/utils.js',
    '/expense-tracker/js/storage.js',
    '/expense-tracker/js/excel.js',
    '/expense-tracker/lib/xlsx.full.min.js',
    '/expense-tracker/icons/icon-16.png',
    '/expense-tracker/icons/icon-32.png',
    '/expense-tracker/icons/icon-180.png',
    '/expense-tracker/icons/icon-192.png',
    '/expense-tracker/icons/icon-512.png'
];

// Install: pre-cache all static assets
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(function () {
            // Activate immediately without waiting for old tabs to close
            return self.skipWaiting();
        })
    );
});

// Activate: remove any old caches from previous versions
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames
                    .filter(function (name) { return name !== CACHE_NAME; })
                    .map(function (name) { return caches.delete(name); })
            );
        }).then(function () {
            // Take control of all open clients immediately
            return self.clients.claim();
        })
    );
});

// Fetch: serve from cache first, fall back to network
self.addEventListener('fetch', function (event) {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(function (cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }
            // Not in cache — fetch from network and cache the response
            return fetch(event.request).then(function (networkResponse) {
                // Only cache valid responses for same-origin assets
                if (
                    networkResponse &&
                    networkResponse.status === 200 &&
                    networkResponse.type === 'basic'
                ) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(function () {
                // Network failed and not in cache — return the offline page
                return caches.match('./index.html');
            });
        })
    );
});
