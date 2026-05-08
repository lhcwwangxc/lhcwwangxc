const CACHE_NAME = 'ludi-poetry-v1';
const APP_FILES = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

// 安装：预缓存核心文件
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_FILES);
    })
  );
});

// 请求拦截：优先从缓存拿，缓存没有才联网
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) return cachedResponse;

      // 联网请求 JSZip，成功则缓存
      return fetch(event.request).then(function(response) {
        if (response.ok
          && response.type === 'basic'
          && event.request.url.indexOf('cdnjs.cloudflare.com/ajax/libs/jszip') !== -1) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    })
  );
});