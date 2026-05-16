const CACHE_NAME = 'essencia-1778898659983'

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add('/').catch(() => {}))
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  if (url.origin !== self.location.origin) return

  e.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache-first apenas para assets com hash no nome (imutáveis)
      if (url.pathname.match(/\/assets\/.+\.[a-f0-9]{8}\./)) {
        const cached = await cache.match(e.request)
        if (cached) return cached
        const response = await fetch(e.request)
        if (response.ok) cache.put(e.request, response.clone())
        return response
      }

      // Network-first para JS, CSS, HTML e tudo mais
      try {
        const response = await fetch(e.request)
        if (response.ok) cache.put(e.request, response.clone())
        return response
      } catch {
        const cached = await cache.match(e.request)
        if (cached) return cached
        return cache.match('/') ?? cache.match('/index.html')
      }
    })
  )
})
