import { memo, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Stream, DonationMessage } from '@/components/types';
import { DonationAlert } from './DonationAlert';
import { DonationForm } from './DonationForm';
import { StreamSettings } from './StreamSettings';
import { LiveStreamViewer } from './LiveStreamViewer';

interface StreamViewProps {
  stream: Stream;
  userBoombucks: number;
  setUserBoombucks: (amount: number | ((prev: number) => number)) => void;
  isStreamer: boolean;
  onClose: () => void;
}

export const StreamView = memo(({
  stream,
  userBoombucks,
  setUserBoombucks,
  isStreamer,
  onClose
}: StreamViewProps) => {
  const [currentDonation, setCurrentDonation] = useState<DonationMessage | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(stream.ttsEnabled ?? true);
  const [ttsVoice, setTtsVoice] = useState<'male1' | 'male2' | 'female'>(stream.ttsVoice ?? 'male1');
  const [recentDonations, setRecentDonations] = useState<DonationMessage[]>([]);

  const handleDonate = useCallback((amount: number, message: string) => {
    setUserBoombucks(prev => prev - amount);
    
    const donation: DonationMessage = {
      id: Date.now().toString(),
      username: '@you',
      amount,
      message,
      timestamp: new Date()
    };
    
    setCurrentDonation(donation);
    setRecentDonations(prev => [donation, ...prev].slice(0, 10));
  }, [setUserBoombucks]);

  const handleDonationComplete = useCallback(() => {
    setCurrentDonation(null);
  }, []);

  return (
    <div className="fixed inset-0 z-40 bg-background">
      <div className="relative h-full w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
          <img 
            src={stream.thumbnail}
            alt={stream.title}
            className="w-full h-full object-cover opacity-20 blur-2xl"
          />
        </div>

        <div className="relative h-full flex flex-col safe-area-top safe-area-bottom">
          <div className="flex items-center justify-between p-3 md:p-4 bg-background/50 backdrop-blur-lg border-b border-primary/30">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white active:scale-95 transition-transform"
            >
              <Icon name="ArrowLeft" size={22} />
            </Button>

            <div className="flex items-center gap-2 md:gap-3">
              <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-primary">
                <AvatarImage src={stream.avatar} />
                <AvatarFallback>{stream.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-white text-sm md:text-base">{stream.username}</p>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Badge className="bg-red-600 text-white px-1.5 py-0 text-[10px] md:text-xs flex items-center gap-1">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </Badge>
                  <span className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-0.5">
                    <Icon name="Eye" size={10} className="md:hidden" />
                    <Icon name="Eye" size={12} className="hidden md:inline" />
                    {stream.viewers.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if ('serviceWorker' in navigator && 'caches' in window) {
                    caches.open('stream-cache-v1').then(cache => {
                      cache.add(stream.thumbnail);
                      if (stream.streamKey) {
                        cache.add(`/streams/${stream.id}`);
                      }
                    });
                    alert('Стрим сохранён для офлайн-просмотра!');
                  }
                }}
                className="text-white active:scale-95 transition-transform"
              >
                <Icon name="Download" size={20} />
              </Button>
              {isStreamer && (
                <StreamSettings
                  ttsEnabled={ttsEnabled}
                  setTtsEnabled={setTtsEnabled}
                  ttsVoice={ttsVoice}
                  setTtsVoice={setTtsVoice}
                />
              )}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-2 md:p-4">
            <div className="w-full h-full md:max-w-4xl">
              {stream.isLive && stream.streamKey ? (
                <div className="w-full h-full md:aspect-video">
                  <LiveStreamViewer 
                    streamId={stream.id}
                    streamKey={stream.streamKey}
                  />
                </div>
              ) : (
                <div className="w-full h-full md:aspect-video bg-background/30 backdrop-blur-sm rounded-lg border border-primary/30 flex items-center justify-center">
                  <div className="text-center px-4">
                    <Icon name="Video" size={48} className="md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-muted-foreground" />
                    <p className="text-white font-bold text-lg md:text-xl mb-2">{stream.title}</p>
                    <p className="text-muted-foreground text-sm md:text-base">Стрим завершён</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 md:p-4 bg-background/50 backdrop-blur-lg border-t border-primary/30">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3 md:mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base md:text-lg line-clamp-2">{stream.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{stream.category}</p>
                </div>
                
                {!isStreamer && (
                  <DonationForm
                    streamUsername={stream.username}
                    userBoombucks={userBoombucks}
                    onDonate={handleDonate}
                  />
                )}
              </div>

              {recentDonations.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground font-bold mb-2">
                    Последние донаты:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {recentDonations.slice(0, 6).map(donation => (
                      <div 
                        key={donation.id}
                        className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-3 flex items-center gap-2"
                      >
                        <Icon name="Gift" size={16} className="text-accent" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm">{donation.username}</p>
                          <p className="text-xs text-muted-foreground truncate">{donation.message}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Coins" size={14} className="text-yellow-400" />
                          <span className="text-yellow-400 font-bold text-sm">{donation.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isStreamer && (
                <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-blue-400">
                    <Icon name="Info" size={16} />
                    <span>
                      Озвучка донатов: {ttsEnabled ? `включена (${ttsVoice === 'male1' ? 'Мужской 1' : ttsVoice === 'male2' ? 'Мужской 2' : 'Женский'})` : 'выключена'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {currentDonation && (
          <DonationAlert
            donation={currentDonation}
            onComplete={handleDonationComplete}
            voice={ttsVoice}
            ttsEnabled={ttsEnabled}
          />
        )}
      </div>
    </div>
  );
});

StreamView.displayName = 'StreamView';