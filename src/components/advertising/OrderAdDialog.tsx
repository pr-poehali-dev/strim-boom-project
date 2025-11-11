import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Creator } from '../types';

interface OrderAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCreator: Creator | null;
  brandName: string;
  setBrandName: (name: string) => void;
  adContent: string;
  setAdContent: (content: string) => void;
  adDuration: string;
  setAdDuration: (duration: string) => void;
  userBoombucks: number;
  handleOrderAd: () => void;
}

export const OrderAdDialog = memo(({
  open,
  onOpenChange,
  selectedCreator,
  brandName,
  setBrandName,
  adContent,
  setAdContent,
  adDuration,
  setAdDuration,
  userBoombucks,
  handleOrderAd
}: OrderAdDialogProps) => {
  if (!selectedCreator) return null;

  const hasEnoughFunds = selectedCreator.adPrice <= userBoombucks;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Megaphone" className="text-accent" />
            Order Advertisement
          </DialogTitle>
          <DialogDescription>
            Create an ad campaign with {selectedCreator.username}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src={selectedCreator.avatar} />
              <AvatarFallback>{selectedCreator.username[1]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-bold text-white">{selectedCreator.username}</h3>
              <p className="text-sm text-muted-foreground">{selectedCreator.category}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon name="Users" size={12} />
                  {(selectedCreator.followers / 1000000).toFixed(1)}M
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Eye" size={12} />
                  {(selectedCreator.avgViews / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
            <Badge className="bg-accent/20 text-accent text-lg px-3 py-1">
              <Icon name="Coins" size={16} className="mr-1" />
              {selectedCreator.adPrice} BBS
            </Badge>
          </div>

          <div className="space-y-2">
            <Label>Brand/Product Name</Label>
            <Input 
              type="text" 
              placeholder="Enter your brand name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Advertisement Content</Label>
            <Textarea 
              placeholder="Describe what you want to advertise..."
              value={adContent}
              onChange={(e) => setAdContent(e.target.value)}
              className="bg-background/50 min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              {adContent.length}/500 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label>Ad Duration (seconds)</Label>
            <Input 
              type="number" 
              placeholder="15"
              value={adDuration}
              onChange={(e) => setAdDuration(e.target.value)}
              className="bg-background/50"
              min="5"
              max="60"
            />
            <div className="flex gap-2">
              {[15, 30, 45, 60].map(duration => (
                <Button 
                  key={duration}
                  variant="outline" 
                  size="sm"
                  onClick={() => setAdDuration(duration.toString())}
                  className="flex-1"
                >
                  {duration}s
                </Button>
              ))}
            </div>
          </div>

          {!hasEnoughFunds && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <Icon name="AlertCircle" className="h-4 w-4 text-red-400" />
              <AlertDescription>
                Insufficient funds. You need {selectedCreator.adPrice} BBS but have {userBoombucks} BBS.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Your Balance</span>
              <span className="font-bold flex items-center gap-1">
                <Icon name="Wallet" size={16} />
                {userBoombucks} BBS
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Ad Cost</span>
              <span className="font-bold text-orange-400">-{selectedCreator.adPrice} BBS</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-accent">After Purchase</span>
              <span className="text-lg font-bold text-accent flex items-center gap-1">
                <Icon name="Coins" size={18} />
                {userBoombucks - selectedCreator.adPrice} BBS
              </span>
            </div>
          </div>

          <div className="bg-background/30 p-3 rounded-lg space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={14} className="text-blue-400" />
              <span>Creator will review within 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="ShieldCheck" size={14} className="text-green-400" />
              <span>Payment only in Boombucks - secure and instant</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" size={14} className="text-orange-400" />
              <span>Video blocked if ad is unpaid</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleOrderAd}
            disabled={!brandName || !adContent || !hasEnoughFunds}
            className="bg-accent hover:bg-accent/90"
          >
            <Icon name="ShoppingCart" className="mr-2" size={16} />
            Order for {selectedCreator.adPrice} BBS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

OrderAdDialog.displayName = 'OrderAdDialog';