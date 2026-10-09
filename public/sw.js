const CACHE_NAME = 'fitncheap-cache-v1';

self.addEventListener('install', event => {
  const scope = self.registration.scope;
  const precacheUrls = [
    scope,
    new URL('index.html', scope).href,
    new URL('manifest.json', scope).href,
    new URL('favicon.svg', scope).href,
    new URL('wasm/vision_wasm_internal.js', scope).href,
    new URL('wasm/vision_wasm_internal.wasm', scope).href,
    new URL('models/pose_landmarker.task', scope).href,
  ];

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(precacheUrls))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('Precache partial fallback:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // If requesting the offline task model or wasm, use cache-first
  if (url.pathname.includes('/models/') || url.pathname.includes('/wasm/')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate or Network-first with cache fallback for other assets
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
