import { memo, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReferralSimulatorProps {
  onSimulatePurchase: (username: string, amount: number) => void;
}

export const ReferralSimulator = memo(({ onSimulatePurchase }: ReferralSimulatorProps) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSimulate = useCallback(() => {
    if (username && amount && parseFloat(amount) > 0) {
      const userId = Date.now();
      const purchaseAmount = Math.floor(parseFloat(amount) / 100);
      
      onSimulatePurchase(`@${username}`, purchaseAmount);
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
        setUsername('');
        setAmount('');
      }, 2000);
    }
  }, [username, amount, onSimulatePurchase]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
        >
          <Icon name="Zap" className="mr-2" size={16} />
          Simulate Referral
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Zap" className="text-purple-400" />
            Referral Purchase Simulator
          </DialogTitle>
          <DialogDescription>
            Simulate a new user purchasing through your referral link
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="bg-purple-500/10 border-purple-500/30">
            <Icon name="Info" className="h-4 w-4 text-purple-400" />
            <AlertDescription className="text-sm">
              <strong>Demo Tool:</strong> This simulates a new user signing up via your referral link and making a purchase. You'll earn 1 BB if they buy 3+ Boombucks.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>New User Username</Label>
            <Input 
              type="text" 
              placeholder="e.g., cooluser123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Purchase Amount (Rubles)</Label>
            <Input 
              type="number" 
              placeholder="e.g., 300"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background/50"
            />
            {amount && (
              <p className="text-xs text-muted-foreground">
                = {Math.floor(parseFloat(amount) / 100)} Boombucks
                {Math.floor(parseFloat(amount) / 100) >= 3 && (
                  <span className="text-accent ml-2">✓ Qualifies for reward!</span>
                )}
              </p>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {[100, 300, 500, 1000].map(value => (
              <Button 
                key={value}
                variant="outline" 
                size="sm"
                onClick={() => setAmount(value.toString())}
                className="flex-1"
              >
                ₽{value}
              </Button>
            ))}
          </div>

          {success && (
            <Alert className="bg-green-500/10 border-green-500/30">
              <Icon name="CheckCircle" className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-sm">
                Purchase simulated successfully! Check your notifications.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSimulate}
            disabled={!username || !amount || parseFloat(amount) <= 0}
            className="bg-purple-500 hover:bg-purple-600 flex-1"
          >
            <Icon name="Zap" className="mr-2" size={16} />
            Simulate Purchase
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ReferralSimulator.displayName = 'ReferralSimulator';
