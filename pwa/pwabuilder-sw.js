// This is the "Offline copy of pages" service worker

const CACHE = "pwabuilder-offline";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

// Select files for caching.
let urlsToCache = [
  "/",
  "/index.html",
  "/logo/favicon.svg",
  "/font",
  "/logo",
  "/pwa",
  "/pwa/android",
  "/pwa/ios",
  "/pwa/windows11", 
  "/pwa/pwa-handler.js",
];

// Cache all the selected items once application is installed.
self.addEventListener("install", (event) => {
  event.waitUntil(
      caches.open(CACHE).then((cache) => {
          console.log("Caching started.");
          return cache.addAll(urlsToCache);
      })
  );
});

// Whenever a resource is requested, return if its cached else fetch the resourcefrom server.
self.addEventListener("fetch", (event) => {
  event.respondWith(
      caches.match(event.request).then((response) => {
          if (response) {
              return response;
          }
          return fetch(event.request);
      })
  );
});