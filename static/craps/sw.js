const CACHE_NAME = 'craps-v1';

const PRECACHE = [
  '/craps/',
  '/craps/App.svelte',
  'https://cdn.jsdelivr.net/npm/svelte@3.59.2/index.mjs',
  'https://cdn.jsdelivr.net/npm/svelte@3.59.2/internal/index.mjs',
  'https://cdn.jsdelivr.net/npm/svelte@3.59.2/compiler.mjs',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        }
        return response;
      });
    })
  );
});
