const FILES_TO_CACHE = [
    "/",
    "indexedDB.js",
    "index.js",
    "styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
  ];
  
  const PRECACHE = "static-cache-v2";
  const DATA_CACHE_NAME = "data-cache-v1";
  
  self.addEventListener("install", event => {
    event.waitUntil(
      caches.open(PRECACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
  });
  
  self.addEventListener("activate", event => {
      event.waitUntil(
          caches.keys().then(keylist => {
              return Promise.all(
                  keyList.map(key => {
                      if (key !== PRECACHE && Key !== DATA_CACHE_NAME) {
                          return caches.delete(key);
                      }
                  })
              )
          })
      );
      self.clients.claim();
  })
  self.addEventListener("fetch", event => {
      if (event.request.url.includes("/api/")) {
          console.log("called   " + event.request.url)
          event.respondWith(
              caches.open(DATA_CACHE_NAME).then(cache => {
                  return fetch(event.request)
                  .then(response => {
                      if (response.status === 200) {
                          cache.put(event.request.url, response.clone());

                      }
                      return response;
                  })
                  .catch(err => {
                    return cache.match(event.request);
                  });
              }).catch(err => console.log(err))
          );
          return;
      }
      event.respondWith(
          caches.open(PRECACHE).then(cache => {
              return cache.match(event.request).then(response => {
                  return response || fetch(event.request);
              });
          })
      );
});