import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentMethodsTabProps {
  savedMethods: Record<string, string>;
  handleSavePaymentMethod: (type: string, value: string) => void;
}

export const PaymentMethodsTab = memo(({
  savedMethods,
  handleSavePaymentMethod
}: PaymentMethodsTabProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Icon name="CreditCard" className="text-accent" />
        Payment Methods
      </h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Icon name="CreditCard" size={16} />
            Bank Card (RU)
          </Label>
          <Input 
            type="text"
            placeholder="1234 5678 9012 3456"
            value={savedMethods['card'] || ''}
            onChange={(e) => handleSavePaymentMethod('card', e.target.value)}
            className="bg-background/50 font-mono"
            maxLength={19}
          />
          <p className="text-xs text-muted-foreground">Russian bank cards only (Visa, Mastercard, Mir)</p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Icon name="Wallet" size={16} />
            YooMoney Wallet
          </Label>
          <Input 
            type="text"
            placeholder="410011234567890"
            value={savedMethods['yoomoney'] || ''}
            onChange={(e) => handleSavePaymentMethod('yoomoney', e.target.value)}
            className="bg-background/50 font-mono"
          />
          <p className="text-xs text-muted-foreground">Your YooMoney wallet number</p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Icon name="Smartphone" size={16} />
            QIWI Wallet
          </Label>
          <Input 
            type="text"
            placeholder="+7 (900) 123-45-67"
            value={savedMethods['qiwi'] || ''}
            onChange={(e) => handleSavePaymentMethod('qiwi', e.target.value)}
            className="bg-background/50 font-mono"
          />
          <p className="text-xs text-muted-foreground">Phone number linked to QIWI</p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Icon name="Bitcoin" size={16} />
            USDT Address (TRC20)
          </Label>
          <Input 
            type="text"
            placeholder="TXa1b2c3d4e5f6g7h8i9j0..."
            value={savedMethods['crypto'] || ''}
            onChange={(e) => handleSavePaymentMethod('crypto', e.target.value)}
            className="bg-background/50 font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">USDT wallet address (Tron network only)</p>
        </div>

        <Alert className="bg-blue-500/10 border-blue-500/30">
          <Icon name="Info" className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-sm">
            <strong>Security:</strong> Your payment information is encrypted and stored securely. You can update it anytime.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">Saved Methods:</p>
          <div className="space-y-2">
            {Object.entries(savedMethods).map(([type, value]) => (
              value && (
                <div key={type} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon 
                      name={
                        type === 'card' ? 'CreditCard' : 
                        type === 'yoomoney' ? 'Wallet' : 
                        type === 'qiwi' ? 'Smartphone' : 
                        'Bitcoin'
                      } 
                      className="text-accent" 
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {type === 'card' ? 'Bank Card' : 
                         type === 'yoomoney' ? 'YooMoney' : 
                         type === 'qiwi' ? 'QIWI' : 
                         'USDT'}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {value.substring(0, 20)}...
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    <Icon name="CheckCircle" size={12} className="mr-1" />
                    Active
                  </Badge>
                </div>
              )
            ))}
            {Object.values(savedMethods).every(v => !v) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No payment methods added yet
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
});

PaymentMethodsTab.displayName = 'PaymentMethodsTab';
