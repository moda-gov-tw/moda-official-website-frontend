self.addEventListener('install', function(event){
  console.log('[SW] 安裝(Install) Service Worker!',event);
});

self.addEventListener('activate', function(event){
  console.log('[SW] 觸發(Activate) Service Worker!',event);
  return self.clients.claim();
});

self.addEventListener('fetch', function(event){
  console.log('[SW] 抓資料(Fetch)!',event);
  event.respondWith(fetch(event.request));
});

//refer1==========================================
// self.addEventListener('install', (e) => {
//   e.waitUntil(
//     caches.open('fox-store').then((cache) => cache.addAll([
//       '/pwa-examples/a2hs/',
//       '/pwa-examples/a2hs/index.html',
//       '/pwa-examples/a2hs/index.js',
//       '/pwa-examples/a2hs/style.css',
//       '/pwa-examples/a2hs/images/fox1.jpg',
//       '/pwa-examples/a2hs/images/fox2.jpg',
//       '/pwa-examples/a2hs/images/fox3.jpg',
//       '/pwa-examples/a2hs/images/fox4.jpg',
//     ])),
//   );
// });

// self.addEventListener('fetch', (e) => {
//   console.log(e.request.url);
//   e.respondWith(
//     caches.match(e.request).then((response) => response || fetch(e.request)),
//   );
// });

//refer2==========================================
// self.addEventListener('install', event => {
//   console.log('V1 installing…');

//   // cache a cat SVG
//   event.waitUntil(
//     caches.open('static-v1').then(cache => cache.add('assets/img/icon_idxBusiness2-1.png'))
//   );
// });

// self.addEventListener('activate', event => {
//   console.log('V1 now ready to handle fetches!');
// });

// self.addEventListener('fetch', event => {
//   const url = new URL(event.request.url);

//   // serve the horse SVG from the cache if the request is
//   // same-origin and the path is '/dog.svg'
//   if (url.origin == location.origin && url.pathname == 'assets/img/icon_idxBusiness2-2.png') {
//     event.respondWith(caches.match('assets/img/icon_idxBusiness2-1.png'));
//   }
// });