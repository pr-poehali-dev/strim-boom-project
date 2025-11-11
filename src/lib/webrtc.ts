import SimplePeer from 'simple-peer';

export class StreamBroadcaster {
  private peer: SimplePeer.Instance | null = null;
  private stream: MediaStream | null = null;

  async startBroadcast(): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      return this.stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw new Error('Не удалось получить доступ к камере/микрофону');
    }
  }

  async startScreenShare(): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always'
        },
        audio: false
      });

      return this.stream;
    } catch (error) {
      console.error('Error accessing screen share:', error);
      throw new Error('Не удалось получить доступ к экрану');
    }
  }

  stopBroadcast() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }

  getStream(): MediaStream | null {
    return this.stream;
  }
}

export class StreamViewer {
  private peer: SimplePeer.Instance | null = null;

  initViewer(onStream: (stream: MediaStream) => void) {
    this.peer = new SimplePeer({
      initiator: false,
      trickle: false
    });

    this.peer.on('stream', (stream) => {
      onStream(stream);
    });

    this.peer.on('error', (err) => {
      console.error('Peer error:', err);
    });

    return this.peer;
  }

  destroy() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}

export const checkMediaDevices = async (): Promise<boolean> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideo = devices.some(device => device.kind === 'videoinput');
    const hasAudio = devices.some(device => device.kind === 'audioinput');
    return hasVideo || hasAudio;
  } catch (error) {
    console.error('Error checking media devices:', error);
    return false;
  }
};
