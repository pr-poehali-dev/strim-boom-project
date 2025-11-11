import { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface WebRTCStreamProps {
  isStreamer: boolean;
  streamId: number;
  onStreamStart?: () => void;
  onStreamStop?: () => void;
}

export const WebRTCStream = ({ isStreamer, streamId, onStreamStart, onStreamStop }: WebRTCStreamProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);

  const startStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setIsLive(true);
      setError(null);
      onStreamStart?.();
    } catch (err) {
      setError('Не удалось получить доступ к камере');
      console.error('Error accessing media devices:', err);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsLive(false);
    onStreamStop?.();
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always'
        },
        audio: false
      });

      if (stream) {
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerRef.current?.streams[0]?.getVideoTracks()[0];
        
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }

        videoTrack.onended = () => {
          if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
          }
        };
      }
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [stream]);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isStreamer}
        className="w-full h-full object-cover"
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center p-6">
            <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-destructive" />
            <p className="text-white">{error}</p>
          </div>
        </div>
      )}

      {isStreamer && !isLive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm">
          <div className="text-center">
            <Button onClick={startStream} size="lg" className="gap-2">
              <Icon name="Video" size={24} />
              Начать трансляцию
            </Button>
          </div>
        </div>
      )}

      {isStreamer && isLive && (
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
          <Button onClick={shareScreen} variant="secondary" size="sm" className="gap-2">
            <Icon name="MonitorUp" size={16} />
            Демонстрация экрана
          </Button>
          
          <Button onClick={stopStream} variant="destructive" size="sm" className="gap-2">
            <Icon name="Square" size={16} />
            Остановить стрим
          </Button>
        </div>
      )}

      {isLive && (
        <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-sm font-semibold">LIVE</span>
        </div>
      )}
    </div>
  );
};
