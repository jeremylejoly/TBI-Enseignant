// Service Worker for TBI Enseignant — sw.js
const CACHE_NAME = 'tbi-enseignant-cache-v38';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './timer.js',
    './whiteboard.js',
    './aristo.js',
    './compass.js',
    './horaire.js',
    './devoirs.js',
    './roue.js',
    './fractions.js',
    './abaque.js',
    './horloge.js',
    './programme_P5_P6.html',
    './pdf.min.js',
    './pdf.worker.min.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    // External CDN script and style dependencies cached for 100% offline capability
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fredoka:wght@300..700&family=Caveat:wght@400..700&family=Architects+Daughter&display=swap'
];

// Install Event — caching files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching app shell and CDNs');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Event — cleanup old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event — cache first with network fallback
self.addEventListener('fetch', event => {
    // Ignore non-GET requests or different schemes (like chrome-extension)
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // If not in cache, fetch from network and cache dynamically if it's from fonts.gstatic.com (Google Fonts files)
                return fetch(event.request)
                    .then(response => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic' && !event.request.url.includes('gstatic.com')) {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    }).catch(() => {
                        // Return offline fallback if needed
                    });
            })
    );
});
