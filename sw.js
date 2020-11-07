const staticCacheName = "site-static-v2";
const dynamicCacheName = "site-dynamic-v1";
const assets = [
  "/",
  "index.html",
  "/pages/fallback.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/materialize.min.css",
  "/css/styles.css",
  "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
];
// install EVENT
self.addEventListener("install", evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      // cache.addAll(assets);
      console.log("assets", assets);
      cache.addAll(assets);
    })
  );
});
//
// activate EVENT
// delete all the old cache
self.addEventListener("activate", evt => {
  // console.log("activated", evt);
  evt.waitUntil(
    caches.keys().then(keys => {
      console.log(keys);
      return Promise.all(
        keys.filter(key => key !== staticCacheName && key !== dynamicCacheName).map(key => caches.delete(key))
      );
    })
  );
});

// fetch EVENT
//
self.addEventListener("fetch", evt => {
  // console.log("fetched", evt);
  evt.respondWith(
    caches
      .match(evt.request)
      .then(cacheres => {
        console.log(cacheres);
        return (
          cacheres ||
          fetch(evt.request).then(fetchres => {
            return caches.open(dynamicCacheName).then(cache => {
              cache.put(evt.request.url, fetchres.clone());
              console.log(cache);
              return fetchres;
            });
          })
        );
      })
      .catch(() => {
        if (evt.request.url.indexOf(".html") > -1) {
          return caches.match("/pages/fallback.html");
        }
      })
  );
});