import { useState, useMemo, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoCard } from '@/components/VideoCard';
import { StreamsList } from '@/components/StreamsList';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ProfilePage } from '@/components/ProfilePage';
import { AdvertisingMarketplace } from '@/components/AdvertisingMarketplace';
import { NotificationCenter } from '@/components/NotificationCenter';
import { mockVideos, mockStreams, Transaction, Notification, Referral } from '@/components/types';

const Index = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'trends' | 'streams' | 'upload' | 'profile' | 'ads'>('home');
  const [userBoombucks, setUserBoombucks] = useState(1250);
  const [showContentFilter, setShowContentFilter] = useState(true);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'KZT' | 'RUB' | 'USDT' | 'PHONE' | 'MEMECOIN'>('RUB');
  const currentUserId = 1;

  const cryptoWallet = 'UQCuFtQ2uMdPVRdhgEO_sOHhHwXZxXEG0anj-U0BRElk0zOk';
  const phoneNumber = '+79503994868';
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'buy',
      amount: 500,
      currency: 'RUB',
      description: 'Purchased 5 Boombucks',
      date: new Date(Date.now() - 86400000 * 2),
      status: 'completed'
    },
    {
      id: '2',
      type: 'donation_sent',
      amount: 50,
      description: 'Donation to @cyber_artist',
      date: new Date(Date.now() - 86400000),
      status: 'completed'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'ad_request',
      title: 'New Ad Request',
      message: 'TechCorp wants to run a 30s ad on your content for 500 BB',
      campaignId: '1',
      read: false,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      type: 'payment_received',
      title: 'Payment Received',
      message: 'You received 250 BB from GameStudio ad campaign',
      read: false,
      createdAt: new Date(Date.now() - 7200000)
    }
  ]);

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const handleClearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: '1',
      referrerId: currentUserId,
      referredUserId: 101,
      referredUsername: '@newuser1',
      purchaseAmount: 5,
      rewardEarned: 1,
      createdAt: new Date(Date.now() - 86400000 * 2),
      status: 'rewarded'
    },
    {
      id: '2',
      referrerId: currentUserId,
      referredUserId: 102,
      referredUsername: '@newuser2',
      purchaseAmount: 1,
      rewardEarned: 0,
      createdAt: new Date(Date.now() - 3600000),
      status: 'pending'
    }
  ]);

  const handleReferralPurchase = useCallback((referredUserId: number, referredUsername: string, purchaseAmount: number) => {
    const existingReferral = referrals.find(r => r.referredUserId === referredUserId);
    
    if (existingReferral) {
      const totalPurchase = existingReferral.purchaseAmount + purchaseAmount;
      
      if (existingReferral.status === 'pending' && totalPurchase >= 3) {
        setReferrals(prev => prev.map(r => 
          r.referredUserId === referredUserId 
            ? { ...r, purchaseAmount: totalPurchase, status: 'rewarded' as const, rewardEarned: 1 }
            : r
        ));
        
        setUserBoombucks(prev => prev + 1);
        
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'referral_reward',
          title: 'Referral Reward!',
          message: `${referredUsername} qualified! You earned 1 Boombuck`,
          read: false,
          createdAt: new Date()
        };
        setNotifications(prev => [newNotification, ...prev]);
        
        const rewardTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'buy',
          amount: 1,
          description: `Referral reward from ${referredUsername}`,
          date: new Date(),
          status: 'completed'
        };
        setTransactions(prev => [rewardTransaction, ...prev]);
      } else {
        setReferrals(prev => prev.map(r => 
          r.referredUserId === referredUserId 
            ? { ...r, purchaseAmount: totalPurchase }
            : r
        ));
      }
    } else {
      const newReferral: Referral = {
        id: Date.now().toString(),
        referrerId: currentUserId,
        referredUserId,
        referredUsername,
        purchaseAmount,
        rewardEarned: purchaseAmount >= 3 ? 1 : 0,
        createdAt: new Date(),
        status: purchaseAmount >= 3 ? 'rewarded' : 'pending'
      };
      
      setReferrals(prev => [newReferral, ...prev]);
      
      if (purchaseAmount >= 3) {
        setUserBoombucks(prev => prev + 1);
        
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'referral_reward',
          title: 'Referral Reward!',
          message: `${referredUsername} qualified! You earned 1 Boombuck`,
          read: false,
          createdAt: new Date()
        };
        setNotifications(prev => [newNotification, ...prev]);
        
        const rewardTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'buy',
          amount: 1,
          description: `Referral reward from ${referredUsername}`,
          date: new Date(),
          status: 'completed'
        };
        setTransactions(prev => [rewardTransaction, ...prev]);
      }
    }
  }, [referrals, currentUserId, setUserBoombucks, setNotifications, setTransactions]);

  const filteredVideos = useMemo(() => {
    return showContentFilter 
      ? mockVideos.filter(v => !v.isBlocked) 
      : mockVideos;
  }, [showContentFilter]);

  const video = useMemo(() => {
    return filteredVideos[currentVideo] || mockVideos[0];
  }, [filteredVideos, currentVideo]);

  const handleSwipe = useCallback((direction: 'up' | 'down') => {
    if (direction === 'up' && currentVideo < filteredVideos.length - 1) {
      setCurrentVideo(currentVideo + 1);
      setLiked(false);
    } else if (direction === 'down' && currentVideo > 0) {
      setCurrentVideo(currentVideo - 1);
      setLiked(false);
    }
  }, [currentVideo, filteredVideos.length]);

  const exchangeRates = useMemo(() => ({
    USD: 95,
    EUR: 105,
    KZT: 0.20,
    RUB: 1,
    USDT: 95,
    PHONE: 1,
    MEMECOIN: 100
  }), []);

  const calculateBoombucks = useCallback((amount: string, currency: 'USD' | 'EUR' | 'KZT' | 'RUB' | 'USDT' | 'PHONE' | 'MEMECOIN') => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return 0;
    
    if (currency === 'MEMECOIN') {
      return Math.floor(value);
    }
    
    const rubAmount = value * exchangeRates[currency];
    return Math.floor(rubAmount / 100);
  }, [exchangeRates]);

  const handleBuyBoombucks = useCallback(() => {
    const boombucksToAdd = calculateBoombucks(buyAmount, selectedCurrency);
    if (boombucksToAdd > 0) {
      setUserBoombucks(userBoombucks + boombucksToAdd);
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'buy',
        amount: boombucksToAdd,
        currency: selectedCurrency,
        description: `Purchased ${boombucksToAdd} Boombucks with ${selectedCurrency}`,
        date: new Date(),
        status: 'completed'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      setBuyDialogOpen(false);
      setBuyAmount('');
    }
  }, [buyAmount, selectedCurrency, calculateBoombucks, userBoombucks]);

  return (
    <div className="h-screen w-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
        <img 
          src="https://cdn.poehali.dev/files/0ccaf940-5099-4e11-af1b-7d010a0505f3.jpg" 
          alt="STREAM-BOOM" 
          className="h-12 w-auto animate-pulse-glow"
        />
        <div className="flex items-center gap-2">
          <NotificationCenter 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAllNotifications}
          />
          <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
            <DialogTrigger asChild>
              <Badge className="bg-accent/90 text-white font-bold px-3 py-1.5 flex items-center gap-1.5 cursor-pointer hover:bg-accent/80 transition-colors">
                <Icon name="Coins" size={16} />
                {userBoombucks} BB
                <Icon name="Plus" size={14} className="ml-1" />
              </Badge>
            </DialogTrigger>
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
                  onClick={() => setBuyDialogOpen(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button 
                  onClick={handleBuyBoombucks}
                  disabled={!buyAmount || parseFloat(buyAmount) <= 0}
                  className="bg-accent hover:bg-accent/90 flex-1"
                >
                  <Icon name="ShoppingCart" className="mr-2" size={16} />
                  {selectedCurrency === 'USDT' || selectedCurrency === 'PHONE' ? 'Подтвердить' : 'Купить'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" className="text-white">
            <Icon name="Search" size={24} />
          </Button>
        </div>
      </div>

      {activeTab === 'streams' ? (
        <StreamsList streams={mockStreams} />
      ) : activeTab === 'profile' ? (
        <ProfilePage 
          userBoombucks={userBoombucks}
          setUserBoombucks={setUserBoombucks}
          transactions={transactions}
          setTransactions={setTransactions}
          referrals={referrals}
          userId={currentUserId}
          onSimulateReferralPurchase={handleReferralPurchase}
        />
      ) : activeTab === 'ads' ? (
        <AdvertisingMarketplace 
          userBoombucks={userBoombucks}
          setUserBoombucks={setUserBoombucks}
          transactions={transactions}
          setTransactions={setTransactions}
          notifications={notifications}
          setNotifications={setNotifications}
          currentUserId={1}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center pt-20 pb-24">
          <VideoCard 
            video={video}
            liked={liked}
            setLiked={setLiked}
            handleSwipe={handleSwipe}
            userBoombucks={userBoombucks}
            setUserBoombucks={setUserBoombucks}
          />
        </div>
      )}

      <BottomNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showContentFilter={showContentFilter}
        setShowContentFilter={setShowContentFilter}
        mockVideos={mockVideos}
        filteredVideos={filteredVideos}
      />
    </div>
  );
};

export default Index;