const FILES_TO_CACHE = [
    "/",
    "/db.js",
    "/index.js",
    "styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
  ];
  
  const CACHE_NAME = "static-cache-v2";
  const DATA_CACHE_NAME = "data-cache-v1";
  
  self.addEventListener("install", function(evt) {
    evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
  
    self.skipWaiting();
  });
  
  self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
    );
  
    self.clients.claim();
  });
  
  self.addEventListener("fetch", function(evt) {
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }
  
    evt.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(evt.request).then(response => {
          return response || fetch(evt.request);
        });
      })
    );
  });
// const FILES_TO_CACHE = [
//     "/",
//     "indexedDB.js",
//     "index.js",
//     "styles.css",
//     "/icons/icon-192x192.png",
//     "/icons/icon-512x512.png",
//   ];
  
//   const PRECACHE = "static-files-v1";
//   const DATA_CACHE_NAME = "data-cache-v2";
  
//   self.addEventListener("install", event => {
//     event.waitUntil(
//       caches.open(PRECACHE)
//         .then(cache => cache.addAll(FILES_TO_CACHE))
//     );
//   });

//   self.addEventListener("activate", event => {
//     event.waitUntil(
//         caches.keys().then(keylist => {
//             return Promise.all(
//                 keyList.map(key => {
//                     if (key !== PRECACHE && Key !== DATA_CACHE_NAME) {
//                         return caches.delete(key);
//                     }
//                 })
//             )
//         })
//     );
//     self.clients.claim();
// })
  
//   self.addEventListener("fetch", event => {
//       if (event.request.url.includes("/api/")) {
//           console.log("called   " + event.request.url)
//           event.respondWith(
//               caches.open(DATA_CACHE_NAME).then(cache => {
//                   return fetch(event.request)
//                   .then(response => {
//                       if (response.status === 200) {
//                           cache.put(event.request.url, response.clone());

//                       }
//                       return response;
//                   })
//                   .catch(err => {
//                     return cache.match(event.request);
//                   });
//               }).catch(err => console.log(err))
//           );
//           return;
//       }
//       event.respondWith(
//           fetch(event.request).catch(function () {
//               return caches.match(event.request).then(function (response) {
//                   if (response) {
//                       return response;
//                   } else if (event.request.headers.get("accept").includes("text/html")) {
//                       return caches.match("/")
//                   }
//               });
//           })
//       );
// });