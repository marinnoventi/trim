// Gjør at appen virker uten nett: hent nyeste versjon når det er dekning, ellers bruk lagret kopi.
const CACHE = 'min-helse-cache-v1';
const FILES = ['./', 'index.html', 'manifest.json', 'icon-180.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    // no-cache: spør alltid serveren om det finnes en nyere versjon, så oppdateringer kommer med en gang.
    fetch(e.request, { cache: 'no-cache' })
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
