import { useState, useCallback, memo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Transaction } from './types';

interface ProfilePageProps {
  userBoombucks: number;
  setUserBoombucks: (amount: number) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

interface PaymentMethod {
  type: 'card' | 'yoomoney' | 'qiwi' | 'crypto';
  value: string;
  label: string;
}

export const ProfilePage = memo(({ userBoombucks, setUserBoombucks, transactions, setTransactions }: ProfilePageProps) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { type: 'card', value: '', label: 'Bank Card (RU)' },
    { type: 'yoomoney', value: '', label: 'YooMoney' },
    { type: 'qiwi', value: '', label: 'QIWI Wallet' },
    { type: 'crypto', value: '', label: 'USDT (TRC20)' }
  ]);
  
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [savedMethods, setSavedMethods] = useState<Record<string, string>>({});

  const handleSavePaymentMethod = useCallback((type: string, value: string) => {
    setSavedMethods(prev => ({ ...prev, [type]: value }));
  }, []);

  const calculateWithdrawal = useCallback((boombucks: number) => {
    const rubAmount = boombucks * 100;
    const afterFee = rubAmount * 0.7;
    return afterFee;
  }, []);

  const handleWithdraw = useCallback(() => {
    const amount = parseInt(withdrawAmount);
    if (amount > 0 && amount <= userBoombucks && savedMethods[selectedMethod]) {
      setUserBoombucks(userBoombucks - amount);
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdraw',
        amount: amount,
        description: `Withdrawal to ${selectedMethod}: ${savedMethods[selectedMethod].substring(0, 10)}...`,
        date: new Date(),
        status: 'pending'
      };
      setTransactions([newTransaction, ...transactions]);
      
      setWithdrawAmount('');
    }
  }, [withdrawAmount, userBoombucks, selectedMethod, savedMethods, setUserBoombucks, transactions, setTransactions]);

  const [adDialogOpen, setAdDialogOpen] = useState(false);
  const [adPrice, setAdPrice] = useState('');

  const handleSetAdPrice = useCallback(() => {
    const price = parseInt(adPrice);
    if (price > 0) {
      setAdDialogOpen(false);
      setAdPrice('');
    }
  }, [adPrice]);

  return (
    <div className="h-full w-full pt-20 pb-24 px-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20 border-4 border-primary">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white">@username</h1>
            <p className="text-muted-foreground">Content Creator</p>
          </div>
        </div>

        <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <p className="text-3xl font-bold text-white flex items-center gap-2">
                  <Icon name="Coins" className="text-accent" size={32} />
                  {userBoombucks} BB
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ≈ ₽{(userBoombucks * 100).toLocaleString()}
                </p>
              </div>
              <Badge className="bg-accent/20 text-accent text-lg px-4 py-2">
                Active
              </Badge>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="withdraw" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="advertising">Ad Sales</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="withdraw" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="advertising" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="History" className="text-accent" />
                Transaction History
              </h3>

              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div 
                      key={transaction.id}
                      className="bg-background/50 p-4 rounded-lg flex items-center justify-between hover:bg-background/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                          transaction.type === 'withdraw' ? 'bg-orange-500/20 text-orange-400' :
                          transaction.type === 'donation_sent' ? 'bg-red-500/20 text-red-400' :
                          transaction.type === 'donation_received' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          <Icon 
                            name={
                              transaction.type === 'buy' ? 'ShoppingCart' :
                              transaction.type === 'withdraw' ? 'Banknote' :
                              transaction.type === 'donation_sent' ? 'ArrowUpRight' :
                              transaction.type === 'donation_received' ? 'ArrowDownLeft' :
                              'Megaphone'
                            } 
                            size={20} 
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {transaction.type === 'buy' && 'Purchase'}
                            {transaction.type === 'withdraw' && 'Withdrawal'}
                            {transaction.type === 'donation_sent' && 'Donation Sent'}
                            {transaction.type === 'donation_received' && 'Donation Received'}
                            {transaction.type === 'ad_purchase' && 'Ad Payment'}
                          </p>
                          <p className="text-xs text-muted-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.date.toLocaleDateString()} {transaction.date.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold flex items-center gap-1 ${
                          transaction.type === 'buy' || transaction.type === 'donation_received' 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {(transaction.type === 'buy' || transaction.type === 'donation_received') && '+'}
                          {(transaction.type === 'withdraw' || transaction.type === 'donation_sent' || transaction.type === 'ad_purchase') && '-'}
                          <Icon name="Coins" size={16} />
                          {transaction.amount} BB
                        </p>
                        <Badge 
                          variant="outline" 
                          className={
                            transaction.status === 'completed' 
                              ? 'border-green-500/50 text-green-400 text-xs' 
                              : transaction.status === 'pending'
                              ? 'border-orange-500/50 text-orange-400 text-xs'
                              : 'border-red-500/50 text-red-400 text-xs'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
});

ProfilePage.displayName = 'ProfilePage';