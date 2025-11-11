import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BuyBoombucksTabProps {
  buyAmount: string;
  setBuyAmount: (amount: string) => void;
  buyUserId: string;
  setBuyUserId: (userId: string) => void;
  onBuyBoombucks: () => void;
}

export const BuyBoombucksTab = memo(({
  buyAmount,
  setBuyAmount,
  buyUserId,
  setBuyUserId,
  onBuyBoombucks
}: BuyBoombucksTabProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Icon name="ShoppingCart" className="text-green-400" />
        Купить бумчики у пользователя
      </h3>
      
      <div className="space-y-4">
        <Alert className="bg-blue-500/10 border-blue-500/30">
          <Icon name="Info" className="h-4 w-4 text-blue-400" />
          <AlertDescription>
            Эта операция добавит бумчики пользователю после оплаты
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label>ID пользователя</Label>
          <Input 
            type="number"
            placeholder="Введите ID пользователя"
            value={buyUserId}
            onChange={(e) => setBuyUserId(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <Label>Количество бумчиков</Label>
          <Input 
            type="number"
            placeholder="Введите количество BBS"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
            className="bg-background/50"
          />
          <div className="flex gap-2">
            {[100, 500, 1000, 5000].map(amount => (
              <Button 
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setBuyAmount(amount.toString())}
                className="flex-1"
              >
                {amount} BBS
              </Button>
            ))}
          </div>
        </div>

        {buyAmount && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Сумма к оплате:</span>
              <span className="font-bold text-accent">₽{(parseInt(buyAmount) * 100).toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Пользователь получит {buyAmount} BBS после подтверждения
            </p>
          </div>
        )}

        <Button 
          onClick={onBuyBoombucks}
          disabled={!buyAmount || !buyUserId}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          <Icon name="ShoppingCart" className="mr-2" size={16} />
          Купить и начислить
        </Button>
      </div>
    </Card>
  );
});

BuyBoombucksTab.displayName = 'BuyBoombucksTab';