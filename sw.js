// Офлайн: сначала сеть (без HTTP-кэша), при отсутствии сети — сохранённая копия.
const CACHE = 'iq-balls-v36';
const CORE = ['./', './index.html', './new.html', './new_v1.html', './new_v2.html', './new_v3.html', './new_v5.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-192.png', './icon-512.png', './favicon.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, {cache: 'reload'})))).catch(() => {})); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const req = e.request.mode === 'navigate' ? new Request(e.request.url, {cache: 'no-cache'}) : e.request;
  e.respondWith(
    fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
