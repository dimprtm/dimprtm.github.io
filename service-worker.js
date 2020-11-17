importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

const baseUrl = "https://api.football-data.org/v2";

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/css/global.css', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  { url: '/js/nav.js', revision: '1' },
  { url: '/js/api.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/assets/icon-512.png', revision: '1' },
  { url: '/assets/icon-192.png', revision: '1' },
  { url: '/assets/favicon-16x16.png', revision: '1' },
  { url: '/assets/favicon-32x32.png', revision: '1' },
  { url: '/assets/apple-icon.png', revision: '1' },
  { url: '/assets/favicon.ico', revision: '1' },
  { url: '/js/sw-register.js', revision: '1' },
  { url: 'https://fonts.googleapis.com/icon?family=Material+Icons', revision: '1' },
  { url: 'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2', revision: '1' }
]);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst()
);
workbox.routing.registerRoute(
  new RegExp(baseUrl),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'ligaan-fromAPI'
  })
);

self.addEventListener("push", (event) => {
  var body;

  console.log(event);

  if (event.data) {
    body = event.data.text();
  } else {
    body = "This is push message";
  }

  var options = {
    body: body,
    icon: "assets/apple-icon.png",
    vibrate: [500, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
