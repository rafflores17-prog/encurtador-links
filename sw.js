// === SEU CÓDIGO DO PWA (Cache e Instalação) ===
const CACHE_NAME = 'bgdv-links-v1';
const assets = ['/', '/index.html', '/style.css', '/script.js'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// === CÓDIGO DA MONETAG (Adicionado no final) ===
self.options = {
    "domain": "5gvci.com",
    "zoneId": 10868948
};
self.lary = "";
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw');
