import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WithdrawTabProps {
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  savedMethods: Record<string, string>;
  userBoombucks: number;
  calculateWithdrawal: (boombucks: number) => number;
  handleWithdraw: () => void;
}

export const WithdrawTab = memo(({
  withdrawAmount,
  setWithdrawAmount,
  selectedMethod,
  setSelectedMethod,
  savedMethods,
  userBoombucks,
  calculateWithdrawal,
  handleWithdraw
}: WithdrawTabProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Icon name="Banknote" className="text-accent" />
        Withdraw Funds
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Amount (Boombucks)</Label>
          <Input 
            type="number" 
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            max={userBoombucks}
            className="bg-background/50"
          />
          <div className="flex gap-2 flex-wrap">
            {[10, 50, 100, 500].map(amount => (
              <Button 
                key={amount}
                variant="outline" 
                size="sm"
                onClick={() => setWithdrawAmount(amount.toString())}
                disabled={amount > userBoombucks}
              >
                {amount} BB
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Withdrawal Method</Label>
          <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card">Bank Card</TabsTrigger>
              <TabsTrigger value="yoomoney">YooMoney</TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 mt-2">
              <TabsTrigger value="qiwi">QIWI</TabsTrigger>
              <TabsTrigger value="crypto">USDT</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {!savedMethods[selectedMethod] && (
          <Alert className="bg-orange-500/10 border-orange-500/30">
            <Icon name="AlertCircle" className="h-4 w-4 text-orange-400" />
            <AlertDescription>
              Please add a {selectedMethod === 'card' ? 'bank card' : selectedMethod === 'yoomoney' ? 'YooMoney wallet' : selectedMethod === 'qiwi' ? 'QIWI wallet' : 'USDT address'} in Payment Methods tab first
            </AlertDescription>
          </Alert>
        )}

        {savedMethods[selectedMethod] && (
          <div className="bg-background/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Withdraw to:</p>
            <p className="font-mono text-sm">{savedMethods[selectedMethod]}</p>
          </div>
        )}

        {withdrawAmount && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Amount:</span>
              <span className="font-bold">{withdrawAmount} Boombucks</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Value:</span>
              <span>₽{(parseInt(withdrawAmount) * 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-orange-400">
              <span>Platform fee (30%):</span>
              <span>-₽{(parseInt(withdrawAmount) * 100 * 0.3).toLocaleString()}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-accent">You'll receive:</span>
              <span className="text-accent">₽{calculateWithdrawal(parseInt(withdrawAmount)).toLocaleString()}</span>
            </div>
          </div>
        )}

        <Button 
          onClick={handleWithdraw}
          disabled={!withdrawAmount || parseInt(withdrawAmount) > userBoombucks || parseInt(withdrawAmount) <= 0 || !savedMethods[selectedMethod]}
          className="w-full bg-accent hover:bg-accent/90"
        >
          <Icon name="Send" className="mr-2" size={16} />
          Withdraw Funds
        </Button>

        <div className="bg-background/30 p-3 rounded-lg space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={14} className="text-blue-400" />
            <span>Processing time: 1-3 business days</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="TrendingDown" size={14} className="text-orange-400" />
            <span>30% platform fee on all withdrawals</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="ShieldCheck" size={14} className="text-green-400" />
            <span>Secure and encrypted transactions</span>
          </div>
        </div>
      </div>
    </Card>
  );
});

WithdrawTab.displayName = 'WithdrawTab';
