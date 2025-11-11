import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdvertisingTabProps {
  adPrice: string;
  setAdPrice: (price: string) => void;
  handleSetAdPrice: () => void;
}

export const AdvertisingTab = memo(({
  adPrice,
  setAdPrice,
  handleSetAdPrice
}: AdvertisingTabProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Icon name="Megaphone" className="text-accent" />
        Advertising Settings
      </h3>

      <Alert className="bg-orange-500/10 border-orange-500/30 mb-6">
        <Icon name="ShieldAlert" className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-sm">
          <strong>Important:</strong> All advertising MUST be paid in Boombucks only. Videos with unpaid ads will be automatically blocked by the system.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <div className="bg-background/50 p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Accept Advertising</p>
              <p className="text-xs text-muted-foreground">Allow brands to purchase ad slots in your videos</p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              <Icon name="CheckCircle" size={12} className="mr-1" />
              Enabled
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Your Ad Price (Boombucks per video)</Label>
          <div className="flex gap-2">
            <Input 
              type="number"
              placeholder="Enter price"
              value={adPrice}
              onChange={(e) => setAdPrice(e.target.value)}
              className="bg-background/50"
            />
            <Button 
              onClick={handleSetAdPrice}
              disabled={!adPrice || parseInt(adPrice) <= 0}
              className="bg-accent hover:bg-accent/90"
            >
              Set Price
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[50, 100, 250, 500, 1000].map(amount => (
              <Button 
                key={amount}
                variant="outline" 
                size="sm"
                onClick={() => setAdPrice(amount.toString())}
              >
                {amount} BB
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Current price: <span className="font-bold text-accent">500 BB</span> (~₽50,000 before fee)
          </p>
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <p className="font-semibold text-white mb-3">How it works:</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-400 mt-0.5" />
              <span>Brands purchase ad slots using Boombucks ONLY</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-400 mt-0.5" />
              <span>You receive 70% after 30% platform fee</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-400 mt-0.5" />
              <span>Payment processed instantly via smart contract</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="ShieldAlert" size={16} className="text-red-400 mt-0.5" />
              <span className="font-bold">Videos with unpaid ads are auto-blocked</span>
            </div>
          </div>
        </div>

        <div className="bg-background/30 p-4 rounded-lg">
          <p className="text-sm font-semibold text-white mb-2">Ad Revenue Stats</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Earned</p>
              <p className="text-xl font-bold text-accent flex items-center gap-1">
                <Icon name="Coins" size={18} />
                1,250 BB
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Ads</p>
              <p className="text-xl font-bold text-white">3</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

AdvertisingTab.displayName = 'AdvertisingTab';
