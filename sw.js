// TESTO — Service Worker para Push Notifications
const CACHE = 'testo-v1';

// Instala e ativa imediatamente
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Recebe push do servidor e exibe notificação
self.addEventListener('push', event => {
  let data = { title: '⚡ TESTO', body: 'Hora do seu lembrete!', tag: 'testo' };
  try { if (event.data) data = { ...data, ...event.data.json() }; } catch(e) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    '/icon.png',
      badge:   '/icon.png',
      tag:     data.tag,
      renotify: true,
      vibrate: [200, 100, 200],
      data:    { url: self.location.origin },
    })
  );
});

// Clique na notificação → abre o app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes(self.location.origin) && 'focus' in c);
      if (existing) return existing.focus();
      return clients.openWindow(event.notification.data?.url || '/');
    })
  );
});
