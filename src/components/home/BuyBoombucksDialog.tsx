import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BuyBoombucksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userBoombucks: number;
  selectedCurrency: 'USD' | 'EUR' | 'KZT' | 'RUB' | 'USDT' | 'PHONE' | 'MEMECOIN';
  setSelectedCurrency: (currency: 'USD' | 'EUR' | 'KZT' | 'RUB' | 'USDT' | 'PHONE' | 'MEMECOIN') => void;
  buyAmount: string;
  setBuyAmount: (amount: string) => void;
  exchangeRates: Record<string, number>;
  calculateBoombucks: (amount: string, currency: 'USD' | 'EUR' | 'KZT' | 'RUB' | 'USDT' | 'PHONE' | 'MEMECOIN') => number;
  onBuyBoombucks: () => void;
  cryptoWallet: string;
  phoneNumber: string;
}

export const BuyBoombucksDialog = memo(({
  open,
  onOpenChange,
  userBoombucks,
  selectedCurrency,
  setSelectedCurrency,
  buyAmount,
  setBuyAmount,
  exchangeRates,
  calculateBoombucks,
  onBuyBoombucks,
  cryptoWallet,
  phoneNumber
}: BuyBoombucksDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="ShoppingCart" className="text-accent" />
            Buy Boombucks
          </DialogTitle>
          <DialogDescription>
            Purchase Boombucks with your preferred currency
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Your Balance</Label>
            <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
              <Icon name="Wallet" className="text-accent" />
              <span className="font-bold text-lg">{userBoombucks} Boombucks</span>
              <span className="text-muted-foreground text-sm ml-auto">
                ≈ ₽{(userBoombucks * 100).toLocaleString()}
              </span>
            </div>
          </div>

          <Tabs value={selectedCurrency} onValueChange={(v) => setSelectedCurrency(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="RUB">Рубли</TabsTrigger>
              <TabsTrigger value="USDT">USDT</TabsTrigger>
              <TabsTrigger value="PHONE">Телефон</TabsTrigger>
              <TabsTrigger value="MEMECOIN">Мемкоин</TabsTrigger>
            </TabsList>
            <TabsContent value="RUB" className="space-y-3">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon name="Banknote" size={16} />
                Прямая покупка: ₽100 = 1 Boombuck
              </div>
            </TabsContent>

            <TabsContent value="USDT" className="space-y-3">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Icon name="Wallet" size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">USDT (TON Network)</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Курс: 1 USDT = ₽{exchangeRates.USDT}
                    </p>
                    <div className="bg-background/50 p-2 rounded">
                      <p className="text-xs text-muted-foreground mb-1">Кошелёк для оплаты:</p>
                      <p className="font-mono text-xs text-white break-all">{cryptoWallet}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 text-xs text-yellow-400 flex items-start gap-2">
                  <Icon name="AlertCircle" size={14} className="mt-0.5 flex-shrink-0" />
                  <span>После отправки USDT укажите сумму ниже и нажмите "Купить". Мы проверим транзакцию.</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="PHONE" className="space-y-3">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Icon name="Smartphone" size={20} className="text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-2">Перевод по номеру телефона</h4>
                    <div className="space-y-2">
                      <div className="bg-background/50 p-3 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Номер телефона:</p>
                        <p className="font-mono text-lg font-bold text-white">{phoneNumber}</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-background/50 p-2 rounded text-center">
                          <Icon name="Building2" size={16} className="mx-auto mb-1 text-blue-400" />
                          <p className="text-xs font-bold text-white">Сбербанк</p>
                        </div>
                        <div className="flex-1 bg-background/50 p-2 rounded text-center">
                          <Icon name="Zap" size={16} className="mx-auto mb-1 text-purple-400" />
                          <p className="text-xs font-bold text-white">Озон Банк</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 text-xs text-blue-400 flex items-start gap-2">
                  <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
                  <span>Переведите ₽ по номеру телефона через СБП. Курс: ₽100 = 1 Boombuck</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="MEMECOIN" className="space-y-3">
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-accent/20 p-2 rounded-lg">
                    <Icon name="Coins" size={20} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">Обмен мемкоина</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Обменяйте ваши мемкоины на Boombucks
                    </p>
                    <div className="bg-background/50 p-3 rounded">
                      <p className="text-lg font-bold text-accent">
                        Курс: {exchangeRates.MEMECOIN} мемкоинов = 1 Boombuck
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-accent/10 border border-accent/30 rounded p-2 text-xs text-accent flex items-start gap-2">
                  <Icon name="TrendingUp" size={14} className="mt-0.5 flex-shrink-0" />
                  <span>Введите количество мемкоинов ниже для обмена на Boombucks</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label>
              {selectedCurrency === 'MEMECOIN' ? 'Количество мемкоинов' : 
               selectedCurrency === 'USDT' ? 'Сумма USDT' :
               selectedCurrency === 'PHONE' ? 'Сумма в рублях' : 
               `Сумма (${selectedCurrency})`}
            </Label>
            <Input 
              type="number" 
              placeholder={
                selectedCurrency === 'MEMECOIN' ? 'Введите количество мемкоинов' :
                selectedCurrency === 'USDT' ? 'Введите сумму USDT' :
                selectedCurrency === 'PHONE' ? 'Введите сумму в рублях' :
                `Введите сумму в ${selectedCurrency}`
              }
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="bg-background/50"
            />
            <div className="flex gap-2 flex-wrap">
              {selectedCurrency === 'RUB' && [100, 500, 1000, 5000].map(amount => (
                <Button 
                  key={amount}
                  variant="outline" 
                  size="sm"
                  onClick={() => setBuyAmount(amount.toString())}
                  className="flex-1"
                >
                  ₽{amount}
                </Button>
              ))}
              {selectedCurrency === 'PHONE' && [100, 300, 500, 1000].map(amount => (
                <Button 
                  key={amount}
                  variant="outline" 
                  size="sm"
                  onClick={() => setBuyAmount(amount.toString())}
                  className="flex-1"
                >
                  ₽{amount}
                </Button>
              ))}
              {selectedCurrency === 'USDT' && [1, 5, 10, 50].map(amount => (
                <Button 
                  key={amount}
                  variant="outline" 
                  size="sm"
                  onClick={() => setBuyAmount(amount.toString())}
                  className="flex-1"
                >
                  {amount} USDT
                </Button>
              ))}
              {selectedCurrency === 'MEMECOIN' && [100, 300, 500, 1000].map(amount => (
                <Button 
                  key={amount}
                  variant="outline" 
                  size="sm"
                  onClick={() => setBuyAmount(amount.toString())}
                  className="flex-1"
                >
                  {amount} MC
                </Button>
              ))}
            </div>
          </div>

          {buyAmount && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Сумма:</span>
                <span className="font-bold">
                  {selectedCurrency === 'RUB' && `₽${buyAmount}`}
                  {selectedCurrency === 'PHONE' && `₽${buyAmount}`}
                  {selectedCurrency === 'USDT' && `${buyAmount} USDT`}
                  {selectedCurrency === 'MEMECOIN' && `${buyAmount} мемкоинов`}
                </span>
              </div>
              {(selectedCurrency === 'USDT' || selectedCurrency === 'MEMECOIN') && (
                <div className="flex justify-between text-sm">
                  <span>
                    {selectedCurrency === 'USDT' ? 'В рублях:' : 'Курс обмена:'}
                  </span>
                  <span>
                    {selectedCurrency === 'USDT' && `₽${(parseFloat(buyAmount) * exchangeRates.USDT).toFixed(2)}`}
                    {selectedCurrency === 'MEMECOIN' && `${exchangeRates.MEMECOIN} MC = 1 BB`}
                  </span>
                </div>
              )}
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-accent">Вы получите:</span>
                <span className="text-accent flex items-center gap-1">
                  <Icon name="Coins" size={18} />
                  {calculateBoombucks(buyAmount, selectedCurrency)} BB
                </span>
              </div>
            </div>
          )}

          <div className="bg-background/30 p-3 rounded-lg space-y-1 text-xs text-muted-foreground">
            {selectedCurrency === 'USDT' && (
              <>
                <div className="flex items-center gap-2">
                  <Icon name="Wallet" size={14} className="text-blue-400" />
                  <span>Отправьте USDT на кошелёк выше</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={14} className="text-yellow-400" />
                  <span>Проверка транзакции: 5-10 минут</span>
                </div>
              </>
            )}
            {selectedCurrency === 'PHONE' && (
              <>
                <div className="flex items-center gap-2">
                  <Icon name="Smartphone" size={14} className="text-green-400" />
                  <span>Переведите на номер через СБП</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Zap" size={14} className="text-green-400" />
                  <span>Мгновенное зачисление после проверки</span>
                </div>
              </>
            )}
            {selectedCurrency === 'MEMECOIN' && (
              <>
                <div className="flex items-center gap-2">
                  <Icon name="Coins" size={14} className="text-accent" />
                  <span>Курс: {exchangeRates.MEMECOIN} мемкоинов = 1 Boombuck</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Zap" size={14} className="text-green-400" />
                  <span>Мгновенный обмен</span>
                </div>
              </>
            )}
            {selectedCurrency === 'RUB' && (
              <>
                <div className="flex items-center gap-2">
                  <Icon name="Coins" size={14} className="text-accent" />
                  <span>1 Boombuck = ₽100</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Zap" size={14} className="text-green-400" />
                  <span>Мгновенная доставка</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button 
            onClick={onBuyBoombucks}
            disabled={!buyAmount || parseFloat(buyAmount) <= 0}
            className="bg-accent hover:bg-accent/90 flex-1"
          >
            <Icon name="ShoppingCart" className="mr-2" size={16} />
            {selectedCurrency === 'USDT' || selectedCurrency === 'PHONE' ? 'Подтвердить' : 'Купить'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

BuyBoombucksDialog.displayName = 'BuyBoombucksDialog';
