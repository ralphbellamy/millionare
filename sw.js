// Stores the whole app on the phone so it opens with no internet.
// Change VERSION whenever any file changes, so phones pick up the update.
const VERSION = "millionaire-v2";
const FILES = [
  "./", "index.html", "manifest.webmanifest",
  "icon-192.png", "icon-512.png", "icon-maskable.png", "apple-touch-icon.png",
  "cinzel-latin-600-normal.woff2", "cinzel-latin-800-normal.woff2",
  "figtree-latin-400-normal.woff2", "figtree-latin-500-normal.woff2",
  "figtree-latin-600-normal.woff2", "figtree-latin-700-normal.woff2"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => {
      const net = fetch(e.request).then(res => {
        if (res && res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit || caches.match("index.html"));
      return hit || net;
    })
  );
});
