import { memo, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Stream, DonationMessage } from '@/components/types';
import { DonationAlert } from './DonationAlert';
import { DonationForm } from './DonationForm';
import { StreamSettings } from './StreamSettings';

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

        <div className="relative h-full flex flex-col">
          <div className="flex items-center justify-between p-4 bg-background/50 backdrop-blur-lg border-b border-primary/30">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white"
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src={stream.avatar} />
                <AvatarFallback>{stream.username[1]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-white">{stream.username}</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent text-white px-2 py-0 text-xs flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Eye" size={12} />
                    {stream.viewers.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
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

          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl aspect-video bg-background/30 backdrop-blur-sm rounded-lg border border-primary/30 flex items-center justify-center">
              <div className="text-center">
                <Icon name="Video" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-white font-bold text-xl mb-2">{stream.title}</p>
                <p className="text-muted-foreground">Видео стрим (демо)</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-background/50 backdrop-blur-lg border-t border-primary/30">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{stream.title}</h3>
                  <p className="text-sm text-muted-foreground">{stream.category}</p>
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
