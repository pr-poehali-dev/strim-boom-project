import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { StreamBroadcaster } from '@/lib/webrtc';
import { streamsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface BroadcastViewProps {
  streamId: number;
  onStop: () => void;
}

export const BroadcastView = ({ streamId, onStop }: BroadcastViewProps) => {
  const [broadcaster] = useState(() => new StreamBroadcaster());
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [sourceType, setSourceType] = useState<'camera' | 'screen' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await broadcaster.startBroadcast();
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsLive(true);
      setSourceType('camera');
      
      toast({
        title: 'Трансляция началась',
        description: 'Камера активирована'
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const startScreen = async () => {
    try {
      const stream = await broadcaster.startScreenShare();
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsLive(true);
      setSourceType('screen');
      
      toast({
        title: 'Трансляция началась',
        description: 'Демонстрация экрана активирована'
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const stopStream = async () => {
    broadcaster.stopBroadcast();
    setIsLive(false);
    setSourceType(null);
    
    await streamsAPI.stop(streamId);
    
    toast({
      title: 'Трансляция завершена',
      description: 'Стрим остановлен'
    });
    
    onStop();
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isLive) {
        await streamsAPI.updateViewers(streamId, viewers);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      broadcaster.stopBroadcast();
    };
  }, [isLive, viewers, streamId]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="bg-card border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isLive && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-500">В ЭФИРЕ</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Icon name="Users" size={20} />
            <span className="text-sm">{viewers} зрителей</span>
          </div>
        </div>
        
        {isLive && (
          <Button variant="destructive" onClick={stopStream}>
            <Icon name="Square" size={16} className="mr-2" />
            Завершить стрим
          </Button>
        )}
      </div>

      <div className="flex-1 bg-black flex items-center justify-center relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="max-w-full max-h-full"
        />
        
        {!isLive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/50">
            <h2 className="text-2xl font-bold text-white mb-4">Выберите источник</h2>
            
            <div className="flex gap-4">
              <Button 
                onClick={startCamera}
                size="lg"
                className="flex flex-col items-center gap-2 h-auto py-6 px-8"
              >
                <Icon name="Video" size={32} />
                <span>Камера</span>
              </Button>
              
              <Button 
                onClick={startScreen}
                size="lg"
                className="flex flex-col items-center gap-2 h-auto py-6 px-8"
              >
                <Icon name="Monitor" size={32} />
                <span>Экран</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border-t p-4">
        <div className="text-sm text-muted-foreground text-center">
          {sourceType === 'camera' && 'Трансляция с камеры'}
          {sourceType === 'screen' && 'Демонстрация экрана'}
          {!sourceType && 'Выберите источник для начала трансляции'}
        </div>
      </div>
    </div>
  );
};
