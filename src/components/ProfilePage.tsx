import { useState, useCallback, memo } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Transaction, Referral } from './types';
import { WithdrawTab } from './profile/WithdrawTab';
import { PaymentMethodsTab } from './profile/PaymentMethodsTab';
import { AdvertisingTab } from './profile/AdvertisingTab';
import { TransactionHistoryTab } from './profile/TransactionHistoryTab';
import { ReferralTab } from './profile/ReferralTab';
import { ReferralSimulator } from './ReferralSimulator';
import { PaymentInstructions } from './PaymentInstructions';
import { LiveStreamBroadcaster } from './stream/LiveStreamBroadcaster';

interface ProfilePageProps {
  userBoombucks: number;
  setUserBoombucks: (amount: number) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  referrals: Referral[];
  userId: number;
  onSimulateReferralPurchase: (username: string, amount: number) => void;
  referralCode: string;
}

interface PaymentMethod {
  type: 'card' | 'yoomoney' | 'qiwi' | 'crypto';
  value: string;
  label: string;
}

export const ProfilePage = memo(({ userBoombucks, setUserBoombucks, transactions, setTransactions, referrals, userId, onSimulateReferralPurchase, referralCode }: ProfilePageProps) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.username || 'username';
  const avatar = user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user';
  
  const totalReferralEarnings = referrals.filter(r => r.status === 'rewarded').reduce((sum, r) => sum + r.rewardEarned, 0);
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
    if (amount >= 10000 && amount <= userBoombucks && savedMethods[selectedMethod]) {
      setUserBoombucks(userBoombucks - amount);
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdraw',
        amount: amount,
        description: `Заявка на вывод ${amount} BBS на ${selectedMethod}: ${savedMethods[selectedMethod].substring(0, 10)}...`,
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
            <AvatarImage src={avatar} />
            <AvatarFallback>{username[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white">@{username}</h1>
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
                  {userBoombucks} BBS
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ≈ ₽{(userBoombucks * 100).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge className="bg-accent/20 text-accent text-lg px-4 py-2">
                  Active
                </Badge>
                <div className="flex gap-2">
                  <LiveStreamBroadcaster userId={userId} username={username} />
                  <ReferralSimulator onSimulatePurchase={onSimulateReferralPurchase} />
                  <PaymentInstructions />
                </div>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="mt-2 px-4 py-2 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30 transition-colors flex items-center gap-2"
                >
                  <Icon name="LogOut" size={16} />
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="withdraw" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="advertising">Ad Sales</TabsTrigger>
            <TabsTrigger value="referral">Referrals</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="withdraw" className="space-y-4">
            <WithdrawTab
              withdrawAmount={withdrawAmount}
              setWithdrawAmount={setWithdrawAmount}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              savedMethods={savedMethods}
              userBoombucks={userBoombucks}
              calculateWithdrawal={calculateWithdrawal}
              handleWithdraw={handleWithdraw}
            />
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <PaymentMethodsTab
              savedMethods={savedMethods}
              handleSavePaymentMethod={handleSavePaymentMethod}
            />
          </TabsContent>

          <TabsContent value="advertising" className="space-y-4">
            <AdvertisingTab
              adPrice={adPrice}
              setAdPrice={setAdPrice}
              handleSetAdPrice={handleSetAdPrice}
            />
          </TabsContent>

          <TabsContent value="referral" className="space-y-4">
            <ReferralTab
              referrals={referrals}
              userId={userId}
              totalReferralEarnings={totalReferralEarnings}
              referralCode={referralCode}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <TransactionHistoryTab
              transactions={transactions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
});

ProfilePage.displayName = 'ProfilePage';