self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'ESSÊNCIA', {
      body: data.body ?? 'Você tem uma nova mensagem',
      icon: '/icons/logo-essencia.png',
      badge: '/icons/logo-essencia.png',
      data: { url: data.url ?? '/' },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const target = event.notification.data?.url ?? '/'
      for (const client of windowClients) {
        if (client.url === target && 'focus' in client) return client.focus()
      }
      return clients.openWindow(target)
    })
  )
})
