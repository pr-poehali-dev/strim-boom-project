import { memo, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DonationFormProps {
  streamUsername: string;
  userBoombucks: number;
  onDonate: (amount: number, message: string) => void;
}

export const DonationForm = memo(({
  streamUsername,
  userBoombucks,
  onDonate
}: DonationFormProps) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleDonate = useCallback(() => {
    const donationAmount = parseInt(amount);
    if (donationAmount > 0 && donationAmount <= userBoombucks) {
      onDonate(donationAmount, message);
      setAmount('');
      setMessage('');
      setOpen(false);
    }
  }, [amount, message, userBoombucks, onDonate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-accent hover:bg-accent/90 font-bold"
          size="lg"
        >
          <Icon name="Gift" className="mr-2" size={20} />
          Задонатить
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Gift" className="text-accent" />
            Донат для {streamUsername}
          </DialogTitle>
          <DialogDescription>
            Поддержите стример бумчиками. Ваш комментарий будет озвучен!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-background/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Ваш баланс:</p>
            <div className="flex items-center gap-2">
              <Icon name="Wallet" className="text-accent" />
              <span className="font-bold text-xl text-white">{userBoombucks} BB</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Сумма доната (BB)</Label>
            <Input 
              type="number"
              placeholder="Введите сумму"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={userBoombucks}
              min={1}
              className="bg-background/50"
            />
            <div className="flex gap-2 flex-wrap">
              {[10, 50, 100, 500].map(preset => (
                <Button 
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset.toString())}
                  disabled={preset > userBoombucks}
                  className="flex-1"
                >
                  {preset} BB
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ваш комментарий (озвучивается)</Label>
            <Textarea 
              placeholder="Привет! Отличный стрим!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              rows={3}
              className="bg-background/50 resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/200 символов
            </p>
          </div>

          {amount && parseInt(amount) > userBoombucks && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <Icon name="AlertCircle" className="h-4 w-4 text-red-400" />
              <AlertDescription>
                Недостаточно бумчиков. У вас: {userBoombucks} BB
              </AlertDescription>
            </Alert>
          )}

          {amount && parseInt(amount) > 0 && parseInt(amount) <= userBoombucks && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Volume2" size={20} className="text-accent" />
                <span className="font-bold text-white">Будет озвучено:</span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Вы задонатили {amount} бумчиков. {message || '(без комментария)'}"
              </p>
            </div>
          )}

          <div className="bg-background/30 p-3 rounded-lg space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="Eye" size={14} className="text-green-400" />
              <span>Ваш донат увидят все зрители</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Volume2" size={14} className="text-accent" />
              <span>Комментарий будет озвучен голосом (если включено)</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Heart" size={14} className="text-red-400" />
              <span>Вы поддерживаете любимого стримера!</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDonate}
            disabled={!amount || parseInt(amount) <= 0 || parseInt(amount) > userBoombucks}
            className="bg-accent hover:bg-accent/90 flex-1"
          >
            <Icon name="Gift" className="mr-2" size={16} />
            Задонатить {amount} BB
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

DonationForm.displayName = 'DonationForm';
