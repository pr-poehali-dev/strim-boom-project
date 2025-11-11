import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SellBoombucksTabProps {
  sellAmount: string;
  setSellAmount: (amount: string) => void;
  sellUserId: string;
  setSellUserId: (userId: string) => void;
  onSellBoombucks: () => void;
}

export const SellBoombucksTab = memo(({
  sellAmount,
  setSellAmount,
  sellUserId,
  setSellUserId,
  onSellBoombucks
}: SellBoombucksTabProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Icon name="TrendingDown" className="text-orange-400" />
        Продать бумчики пользователя
      </h3>
      
      <div className="space-y-4">
        <Alert className="bg-orange-500/10 border-orange-500/30">
          <Icon name="AlertCircle" className="h-4 w-4 text-orange-400" />
          <AlertDescription>
            Эта операция спишет бумчики у пользователя (для возврата или корректировки)
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label>ID пользователя</Label>
          <Input 
            type="number"
            placeholder="Введите ID пользователя"
            value={sellUserId}
            onChange={(e) => setSellUserId(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <Label>Количество бумчиков</Label>
          <Input 
            type="number"
            placeholder="Введите количество BBS"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
            className="bg-background/50"
          />
          <div className="flex gap-2">
            {[100, 500, 1000, 5000].map(amount => (
              <Button 
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setSellAmount(amount.toString())}
                className="flex-1"
              >
                {amount} BBS
              </Button>
            ))}
          </div>
        </div>

        {sellAmount && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Будет списано:</span>
              <span className="font-bold text-orange-400">{sellAmount} BBS</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Используйте для возврата средств или корректировки баланса
            </p>
          </div>
        )}

        <Button 
          onClick={onSellBoombucks}
          disabled={!sellAmount || !sellUserId}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          <Icon name="TrendingDown" className="mr-2" size={16} />
          Списать бумчики
        </Button>
      </div>
    </Card>
  );
});

SellBoombucksTab.displayName = 'SellBoombucksTab';