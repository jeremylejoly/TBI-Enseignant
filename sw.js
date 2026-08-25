// Service Worker for TBI Enseignant — sw.js
const CACHE_NAME = 'tbi-enseignant-cache-v104';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './semainier_fwb_prototype.html',
    './cartes-belgique.html',
    './cartes-europe.html',
    './europe-shaded-relief.jpg',
    './cartes-planisphere.html',
    './earth-shaded-relief.jpg',
    './world-time-zones-cropped.png',
    './timer.js',
    './whiteboard.js',
    './aristo.js',
    './compass.js',
    './devoirs.js',
    './roue.js',
    './fractions.js',
    './abaque.js',
    './abaque_conversions.html',
    './horloge.js',
    './programme_P5_P6.html',
    './pdf.min.js',
    './pdf.worker.min.js',
    './manifest.json',
    './icon-192-v2.png',
    './icon-512-v2.png',
    './logo.svg',
    './tailwind.min.js',
    './lucide.min.js',
    './globe-terrestre.html',
    './ne_110m_admin_0_countries.js',
    './earth-blue-marble.jpg',
    './classification_phylogenetique.html',
    './energie-climat.html',
    './circuit_electrique_18.html',
    './maison_gaspillage_energie_v3.jpg',
    './L_energie_et_les_rouages_du_climat.m4a',
    './paysage_energies.png',
    './paysage_non_renouvelables.png',
    './effet_de_serre.png',
    './Guide_de_l_eco-citoyen.png',
    './photos/classification_phylogenetique_detaillee.jpg',
    './formation-economique-sociale.html',
    './Où_va_l_argent_de_ton_salaire.m4a',
    './Le_voyage_de_ton_salaire.png',
    './Voyage_de_la_fiche_paie.png',
    './fiche-de-paie-belge.pdf',
    './lecon_frise_historique.html',
    './photos/doc_etiolles.png',
    './photos/doc_paladru.png',
    './photos/doc_villa_romaine.png',
    './photos/doc_voie_romaine.png',
    './photos/doc_charrue.png',
    './photos/doc_sceaux_corporations.png',
    './photos/doc_reglement_cockerill.png',
    './photos/doc_fusillade_roux.png',
    './photos/doc_biodiversite.png',
    // External CDN script and style dependencies cached for 100% offline capability
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fredoka:wght@300..700&family=Caveat:wght@400..700&family=Architects+Daughter&display=swap'
];

// Install Event — caching files
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching app shell and CDNs');
                return cache.addAll(ASSETS_TO_CACHE);
            })
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

// Fetch Event — Network-first for HTML/navigation, Cache-first for static assets
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    
    const url = new URL(event.request.url);
    const isNavigationOrHtml = event.request.mode === 'navigate' || 
                               url.pathname.endsWith('.html') || 
                               url.pathname === '/' || 
                               url.pathname.endsWith('/TBI-Enseignant/');

    if (isNavigationOrHtml) {
        // Network-First strategy for HTML & navigation
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-First strategy for heavy static assets (images, fonts, sounds)
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                return fetch(event.request)
                    .then(response => {
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
