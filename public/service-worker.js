const FILES_TO_CACHE = [
    "/",
    "indexedDB.js",
    "index.js",
    "styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
  ];
  
  const PRECACHE = "static-files-v1";
  const DATA_CACHE_NAME = "data-cache-v2";
  
  self.addEventListener("install", event => {
    event.waitUntil(
      caches.open(PRECACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
    );
  });
  
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
          fetch(event.request).catch(function () {
              return caches.match(event.request).then(function (response) {
                  if (response) {
                      return response;
                  } else if (event.request.headers.get("accept").includes("text/html")) {
                      return caches.match("/")
                  }
              });
          })
      );
});