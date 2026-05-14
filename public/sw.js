const CACHE = 'essencia-v1'
const BASE = '/essencia-app'

self.addEventListener('install', (e) => {
  self.skipWaiting()
  // Best-effort warm-up; don't block install if the shell isn't available yet
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(BASE + '/').catch(() => {}))
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  if (url.origin !== self.location.origin) return

  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      // Cache-first for versioned assets (hashed filenames never change)
      if (url.pathname.includes('/assets/')) {
        const cached = await cache.match(e.request)
        if (cached) return cached
        const response = await fetch(e.request)
        if (response.ok) cache.put(e.request, response.clone())
        return response
      }

      // Network-first for everything else; fall back to cache then shell
      try {
        const response = await fetch(e.request)
        if (response.ok) cache.put(e.request, response.clone())
        return response
      } catch {
        const cached = await cache.match(e.request)
        if (cached) return cached
        // SPA fallback: serve the app shell for any navigation
        return cache.match(BASE + '/') ?? cache.match(BASE + '/index.html')
      }
    })
  )
})
