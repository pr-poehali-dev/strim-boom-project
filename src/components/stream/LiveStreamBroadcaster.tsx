import { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import funcUrls from '../../../backend/func2url.json';
import SimplePeer from 'simple-peer';

interface LiveStreamBroadcasterProps {
  userId: number;
  username: string;
}

export const LiveStreamBroadcaster = ({ userId, username }: LiveStreamBroadcasterProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamCategory, setStreamCategory] = useState('Игры');
  const [viewersCount, setViewersCount] = useState(0);
  const [streamId, setStreamId] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Map<string, SimplePeer.Instance>>(new Map());

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (error) {
      toast.error('Ошибка доступа к камере', {
        description: 'Разрешите доступ к камере и микрофону'
      });
      throw error;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    peersRef.current.forEach(peer => peer.destroy());
    peersRef.current.clear();
  }, []);

  const startStream = useCallback(async () => {
    if (!streamTitle.trim()) {
      toast.error('Введите название стрима');
      return;
    }
    
    try {
      await startCamera();
      
      const response = await fetch(funcUrls.streams, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          title: streamTitle,
          description: streamDescription,
          category: streamCategory
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setStreamId(data.stream.id);
        setIsStreaming(true);
        setDialogOpen(false);
        
        toast.success('Стрим запущен! 🎥', {
          description: `"${streamTitle}" теперь в эфире`
        });
      }
    } catch (error) {
      toast.error('Не удалось запустить стрим');
      stopCamera();
    }
  }, [userId, streamTitle, streamDescription, streamCategory, startCamera, stopCamera]);

  const stopStream = useCallback(async () => {
    if (streamId) {
      try {
        await fetch(funcUrls.streams, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stream_id: streamId,
            action: 'stop'
          })
        });
      } catch (error) {
        console.error('Failed to stop stream:', error);
      }
    }
    
    stopCamera();
    setIsStreaming(false);
    setStreamId(null);
    setViewersCount(0);
    
    toast.success('Стрим завершён');
  }, [streamId, stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (!isStreaming) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-red-600 hover:bg-red-700 font-bold">
            <Icon name="Video" className="mr-2" size={20} />
            Запустить стрим
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Icon name="Video" className="text-red-500" />
              Новый стрим
            </DialogTitle>
            <DialogDescription>
              Настройте параметры вашего прямого эфира
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Название стрима *</Label>
              <Input
                placeholder="Например: Играю в FIFA 24"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                placeholder="Расскажите о чём будет стрим..."
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                className="bg-background/50 resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Категория</Label>
              <div className="grid grid-cols-3 gap-2">
                {['Игры', 'Музыка', 'Разговоры', 'IRL', 'Творчество', 'Другое'].map(cat => (
                  <Button
                    key={cat}
                    variant={streamCategory === cat ? 'default' : 'outline'}
                    onClick={() => setStreamCategory(cat)}
                    className="w-full"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" className="text-blue-400 mt-0.5" size={20} />
                <div className="text-sm text-muted-foreground">
                  <p className="font-bold text-white mb-1">Перед началом:</p>
                  <ul className="space-y-1">
                    <li>• Разрешите доступ к камере и микрофону</li>
                    <li>• Проверьте интернет-соединение</li>
                    <li>• Убедитесь что освещение достаточное</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={startStream}
              disabled={!streamTitle.trim()}
              className="bg-red-600 hover:bg-red-700 flex-1"
            >
              <Icon name="Video" className="mr-2" size={16} />
              Начать трансляцию
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="bg-card/95 backdrop-blur-xl border-red-500/30 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">В ЭФИРЕ</h3>
              <p className="text-sm text-muted-foreground">{streamTitle}</p>
            </div>
          </div>
          <Badge className="bg-background/50 text-white">
            <Icon name="Eye" size={14} className="mr-1" />
            {viewersCount} зрителей
          </Badge>
        </div>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-600 text-white font-bold px-3 py-1">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              LIVE
            </Badge>
          </div>
        </div>

        <div className="bg-background/30 p-3 rounded-lg">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Video" size={16} className="text-green-400" />
              <span>Камера: вкл</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Mic" size={16} className="text-green-400" />
              <span>Микрофон: вкл</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Wifi" size={16} className="text-green-400" />
              <span>Отличное соединение</span>
            </div>
          </div>
        </div>

        <Button
          onClick={stopStream}
          className="w-full bg-red-600 hover:bg-red-700 font-bold"
          size="lg"
        >
          <Icon name="Square" className="mr-2" size={20} />
          Завершить стрим
        </Button>
      </div>
    </Card>
  );
};
