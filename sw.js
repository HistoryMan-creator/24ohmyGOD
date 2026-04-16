const CACHE_NAME = 'plan-master-v2';

// Список файлов, которые нужно сохранить для работы без интернета
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './ege_plans_db.js',
  './manifest.json',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './android-chrome-192x192.png',
  './android-chrome-512x512.jpg',
  './apple-touch-icon.png'
];

// Установка Service Worker и кэширование файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэширование файлов для оффлайн работы...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Активация и удаление старых кэшей (если вы обновите версию)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов (Стратегия: сначала кэш, потом сеть)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Если файл есть в кэше — отдаем его (Оффлайн режим)
        if (cachedResponse) {
          return cachedResponse;
        }
        // Иначе качаем из интернета
        return fetch(event.request);
      })
  );
});