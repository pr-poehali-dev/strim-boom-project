import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black px-4 py-2 text-center z-50 flex items-center justify-center gap-2">
      <Icon name="WifiOff" size={20} />
      <span className="font-medium">Офлайн режим • Показываются сохраненные стримы</span>
    </div>
  );
};
