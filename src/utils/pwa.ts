export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (confirm('Доступна новая версия приложения! Обновить сейчас?')) {
                window.location.reload();
              }
            }
          });
        }
      });

      window.addEventListener('online', () => {
        console.log('Онлайн режим восстановлен');
      });

      window.addEventListener('offline', () => {
        console.log('Офлайн режим активирован');
      });

      console.log('Service Worker зарегистрирован');
    } catch (error) {
      console.error('Ошибка регистрации Service Worker:', error);
    }
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  }
};