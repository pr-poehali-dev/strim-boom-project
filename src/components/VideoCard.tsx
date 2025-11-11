import { useState, useMemo, useCallback, memo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Video } from './types';

interface VideoCardProps {
  video: Video;
  liked: boolean;
  setLiked: (liked: boolean) => void;
  handleSwipe: (direction: 'up' | 'down') => void;
  userBoombucks: number;
  setUserBoombucks: (amount: number) => void;
}

export const VideoCard = memo(({ video, liked, setLiked, handleSwipe, userBoombucks, setUserBoombucks }: VideoCardProps) => {
  const [donateOpen, setDonateOpen] = useState(false);
  const [donateAmount, setDonateAmount] = useState('');

  const handleDonate = useCallback(() => {
    const amount = parseInt(donateAmount);
    if (amount > 0 && amount <= userBoombucks) {
      setUserBoombucks(userBoombucks - amount);
      setDonateOpen(false);
      setDonateAmount('');
    }
  }, [donateAmount, userBoombucks, setUserBoombucks]);

  const convertToRub = useCallback((boombucks: number) => {
    const rubles = boombucks * 100;
    const afterFee = rubles * 0.7;
    return afterFee.toFixed(2);
  }, []);

  const likesCount = useMemo(() => video.likes + (liked ? 1 : 0), [video.likes, liked]);

  const handleLikeClick = useCallback(() => {
    setLiked(!liked);
  }, [liked, setLiked]);

  const handleSwipeUp = useCallback(() => {
    handleSwipe('up');
  }, [handleSwipe]);

  const handleSwipeDown = useCallback(() => {
    handleSwipe('down');
  }, [handleSwipe]);

  return (
    <Card className="relative w-full max-w-md h-[calc(100vh-180px)] bg-card/50 backdrop-blur-lg border-primary/30 overflow-hidden rounded-3xl">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${video.videoUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
      </div>

      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 animate-fade-in">
        {video.isAI && (
          <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm text-base px-3 py-1 font-bold">
            И И
          </Badge>
        )}
        
        {video.isBlocked && (
          <Badge className="bg-red-500/90 text-white backdrop-blur-sm px-3 py-1 font-bold flex items-center gap-1">
            <Icon name="ShieldAlert" size={14} />
            BLOCKED
          </Badge>
        )}
      </div>
      
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end animate-fade-in">
        {video.boombucks && video.boombucks > 0 && (
          <Badge className="bg-accent/90 text-white backdrop-blur-sm px-3 py-1.5 font-bold flex items-center gap-1.5">
            <Icon name="Coins" size={14} />
            {video.boombucks} BB
          </Badge>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src={video.avatar} />
                <AvatarFallback>{video.username[1]}</AvatarFallback>
              </Avatar>
              <span className="text-white font-semibold text-lg">{video.username}</span>
            </div>
            
            <p className="text-white/90 mb-2">{video.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {video.trend && (
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 backdrop-blur-sm">
                  🔥 {video.trend}
                </Badge>
              )}
              
              {video.originalAuthor && (
                <Badge variant="outline" className="border-accent/50 text-accent bg-accent/10 backdrop-blur-sm">
                  <Icon name="Shuffle" size={12} className="mr-1" />
                  Ремикс {video.originalAuthor}
                </Badge>
              )}
              
              {video.collabWith && (
                <Badge variant="outline" className="border-secondary/50 text-secondary bg-secondary/10 backdrop-blur-sm">
                  <Icon name="Users" size={12} className="mr-1" />
                  Коллаб
                </Badge>
              )}
              
              {video.voiceSwapped && (
                <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10 backdrop-blur-sm">
                  <Icon name="Music" size={12} className="mr-1" />
                  Voice Swapped
                </Badge>
              )}
              
              {video.isBlocked && (
                <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10 backdrop-blur-sm">
                  <Icon name="ShieldAlert" size={12} className="mr-1" />
                  Blocked
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs text-white/60 mt-2">
              {video.allowCollab && (
                <span className="flex items-center gap-1">
                  <Icon name="Handshake" size={12} />
                  Коллаб разрешён
                </span>
              )}
              {video.allowRemix && (
                <span className="flex items-center gap-1">
                  <Icon name="Sparkles" size={12} />
                  Ремикс разрешён
                </span>
              )}
              {!video.allowCollab && !video.allowRemix && (
                <span className="flex items-center gap-1">
                  <Icon name="Lock" size={12} />
                  Только просмотр
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <button 
              onClick={handleLikeClick}
              className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
            >
              <div className={`p-3 rounded-full bg-card/50 backdrop-blur-sm ${liked ? 'text-accent' : 'text-white'}`}>
                <Icon name="Heart" size={28} className={liked ? 'fill-current' : ''} />
              </div>
              <span className="text-white text-sm font-semibold">{likesCount.toLocaleString()}</span>
            </button>

            <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
              <div className="p-3 rounded-full bg-card/50 backdrop-blur-sm text-white">
                <Icon name="MessageCircle" size={28} />
              </div>
              <span className="text-white text-sm font-semibold">{video.comments.toLocaleString()}</span>
            </button>

            <button 
              disabled={!video.allowRemix}
              className={`flex flex-col items-center gap-1 transition-transform ${video.allowRemix ? 'hover:scale-110' : 'opacity-50 cursor-not-allowed'}`}
              title={video.allowRemix ? 'Создать ремикс' : 'Ремиксы запрещены автором'}
            >
              <div className={`p-3 rounded-full backdrop-blur-sm ${video.allowRemix ? 'bg-secondary/90 text-white' : 'bg-card/50 text-white/50'}`}>
                <Icon name="Shuffle" size={28} />
              </div>
              <span className="text-white text-xs">Ремикс</span>
            </button>

            <button 
              disabled={!video.allowCollab}
              className={`flex flex-col items-center gap-1 transition-transform ${video.allowCollab ? 'hover:scale-110' : 'opacity-50 cursor-not-allowed'}`}
              title={video.allowCollab ? 'Предложить коллаб' : 'Коллабы запрещены автором'}
            >
              <div className={`p-3 rounded-full backdrop-blur-sm ${video.allowCollab ? 'bg-primary/90 text-white' : 'bg-card/50 text-white/50'}`}>
                <Icon name="Handshake" size={28} />
              </div>
              <span className="text-white text-xs">Коллаб</span>
            </button>

            <Dialog open={donateOpen} onOpenChange={setDonateOpen}>
              <DialogTrigger asChild>
                <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
                  <div className="p-3 rounded-full bg-accent/90 backdrop-blur-sm text-white">
                    <Icon name="Coins" size={28} />
                  </div>
                  <span className="text-white text-xs">Донат</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Icon name="Coins" className="text-accent" />
                    Donate Boombucks
                  </DialogTitle>
                  <DialogDescription>
                    Send Boombucks to {video.username}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Your Balance</Label>
                    <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                      <Icon name="Wallet" className="text-accent" />
                      <span className="font-bold text-lg">{userBoombucks} Boombucks</span>
                      <span className="text-muted-foreground text-sm ml-auto">
                        ≈ ${(userBoombucks * 100 / 100).toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Amount (Boombucks)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter amount"
                      value={donateAmount}
                      onChange={(e) => setDonateAmount(e.target.value)}
                      max={userBoombucks}
                      className="bg-background/50"
                    />
                    <div className="flex gap-2">
                      {[10, 50, 100, 500].map(amount => (
                        <Button 
                          key={amount}
                          variant="outline" 
                          size="sm"
                          onClick={() => setDonateAmount(amount.toString())}
                          className="flex-1"
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {donateAmount && (
                    <Alert className="bg-primary/10 border-primary/30">
                      <Icon name="Info" className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Amount:</span>
                            <span className="font-bold">{donateAmount} Boombucks</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Value:</span>
                            <span>₽{(parseInt(donateAmount) * 100).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Creator receives (after 30% fee):</span>
                            <span className="font-bold text-accent">₽{convertToRub(parseInt(donateAmount))}</span>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="bg-background/30 p-3 rounded-lg space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Icon name="Coins" size={14} className="text-accent" />
                      <span>1 Boombuck = ₽100</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="TrendingDown" size={14} className="text-orange-400" />
                      <span>30% platform fee on withdrawals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Zap" size={14} className="text-green-400" />
                      <span>Instant delivery</span>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setDonateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDonate}
                    disabled={!donateAmount || parseInt(donateAmount) > userBoombucks || parseInt(donateAmount) <= 0}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Icon name="Send" className="mr-2" size={16} />
                    Send Donation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-20 pointer-events-none">
        <Icon name="ChevronUp" size={48} className="text-white" />
        <Icon name="ChevronDown" size={48} className="text-white" />
      </div>

      <button 
        onClick={handleSwipeDown}
        className="absolute top-0 left-0 right-0 h-1/3 z-10"
        aria-label="Previous video"
      />
      <button 
        onClick={handleSwipeUp}
        className="absolute bottom-24 left-0 right-0 h-1/3 z-10"
        aria-label="Next video"
      />
    </Card>
  );
});

VideoCard.displayName = 'VideoCard';