// Service Worker pour Makya — shell PWA uniquement (pas de cache API implicite).
// Le mode hors-ligne « Préférences » utilise localStorage dédié, pas ce cache.
const CACHE_NAME = 'makya-v2';
const SHELL_URLS = ['/', '/index.html'];

function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

function isCacheableStaticAsset(url, request) {
  if (request.method !== 'GET') return false;
  if (url.origin !== self.location.origin) return false;
  if (isApiRequest(url)) return false;
  return /\.(js|css|woff2?|png|jpe?g|webp|svg|ico)$/i.test(url.pathname);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_URLS))
      .catch((error) => {
        console.error('Service Worker: erreur mise en cache shell', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: suppression cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ne jamais intercepter l’API : pas de données utilisateur servies hors-ligne par le SW.
  if (isApiRequest(url)) {
    return;
  }

  // Navigation SPA : réseau, puis index.html en cache si hors-ligne.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/index.html').then(
          (cached) => cached || new Response('Hors ligne', { status: 503 })
        )
      )
    );
    return;
  }

  if (!isCacheableStaticAsset(url, event.request)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(
          (cached) => cached || new Response('', { status: 504 })
        )
      )
  );
});
