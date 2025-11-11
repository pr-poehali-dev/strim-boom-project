import { useEffect, useRef, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import SimplePeer from 'simple-peer';

interface LiveStreamViewerProps {
  streamId: number;
  streamKey: string;
  onViewerCountChange?: (count: number) => void;
}

export const LiveStreamViewer = ({ streamId, streamKey, onViewerCountChange }: LiveStreamViewerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectToStream = useCallback(() => {
    try {
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      });

      peer.on('signal', (data) => {
        console.log('Peer signal:', data);
      });

      peer.on('stream', (stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsConnected(true);
          setIsConnecting(false);
          setError(null);
        }
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
        setError('Не удалось подключиться к стриму');
        setIsConnecting(false);
        setIsConnected(false);
      });

      peer.on('close', () => {
        setIsConnected(false);
        setIsConnecting(false);
      });

      peerRef.current = peer;
    } catch (err) {
      setError('Ошибка инициализации WebRTC');
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    connectToStream();

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [connectToStream]);

  if (error) {
    return (
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center p-6">
          <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-white font-bold mb-2">Ошибка подключения</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      
      {isConnecting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-bold">Подключение к стриму...</p>
          </div>
        </div>
      )}
      
      {isConnected && (
        <div className="absolute top-4 left-4">
          <Badge className="bg-red-600 text-white font-bold px-3 py-1">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            LIVE
          </Badge>
        </div>
      )}
    </div>
  );
};
