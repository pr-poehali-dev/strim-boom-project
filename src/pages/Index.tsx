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
import { mockVideos, mockStreams, Transaction } from '@/components/types';

const Index = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'trends' | 'streams' | 'upload' | 'profile' | 'ads'>('home');
  const [userBoombucks, setUserBoombucks] = useState(1250);
  const [showContentFilter, setShowContentFilter] = useState(true);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'KZT' | 'RUB'>('RUB');
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
    RUB: 1
  }), []);

  const calculateBoombucks = useCallback((amount: string, currency: 'USD' | 'EUR' | 'KZT' | 'RUB') => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return 0;
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

                <Tabs value={selectedCurrency} onValueChange={(v) => setSelectedCurrency(v as 'USD' | 'EUR' | 'KZT' | 'RUB')} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="RUB">RUB</TabsTrigger>
                    <TabsTrigger value="USD">USD</TabsTrigger>
                    <TabsTrigger value="EUR">EUR</TabsTrigger>
                    <TabsTrigger value="KZT">KZT</TabsTrigger>
                  </TabsList>
                  <TabsContent value="RUB" className="space-y-2">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Icon name="Banknote" size={16} />
                      Direct purchase: ₽100 = 1 Boombuck
                    </div>
                  </TabsContent>
                  <TabsContent value="USD" className="space-y-2">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Icon name="DollarSign" size={16} />
                      Exchange rate: $1 = ₽{exchangeRates.USD}
                    </div>
                  </TabsContent>
                  <TabsContent value="EUR" className="space-y-2">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Icon name="Euro" size={16} />
                      Exchange rate: €1 = ₽{exchangeRates.EUR}
                    </div>
                  </TabsContent>
                  <TabsContent value="KZT" className="space-y-2">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Icon name="Banknote" size={16} />
                      Exchange rate: ₸1 = ₽{exchangeRates.KZT}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-2">
                  <Label>Amount ({selectedCurrency})</Label>
                  <Input 
                    type="number" 
                    placeholder={`Enter amount in ${selectedCurrency}`}
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="bg-background/50"
                  />
                  <div className="flex gap-2">
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
                    {selectedCurrency === 'USD' && [10, 50, 100, 500].map(amount => (
                      <Button 
                        key={amount}
                        variant="outline" 
                        size="sm"
                        onClick={() => setBuyAmount(amount.toString())}
                        className="flex-1"
                      >
                        ${amount}
                      </Button>
                    ))}
                    {selectedCurrency === 'EUR' && [10, 50, 100, 500].map(amount => (
                      <Button 
                        key={amount}
                        variant="outline" 
                        size="sm"
                        onClick={() => setBuyAmount(amount.toString())}
                        className="flex-1"
                      >
                        €{amount}
                      </Button>
                    ))}
                    {selectedCurrency === 'KZT' && [5000, 20000, 50000, 100000].map(amount => (
                      <Button 
                        key={amount}
                        variant="outline" 
                        size="sm"
                        onClick={() => setBuyAmount(amount.toString())}
                        className="flex-1"
                      >
                        ₸{(amount/1000)}k
                      </Button>
                    ))}
                  </div>
                </div>

                {buyAmount && (
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Amount:</span>
                      <span className="font-bold">
                        {selectedCurrency === 'RUB' && `₽${buyAmount}`}
                        {selectedCurrency === 'USD' && `$${buyAmount}`}
                        {selectedCurrency === 'EUR' && `€${buyAmount}`}
                        {selectedCurrency === 'KZT' && `₸${buyAmount}`}
                      </span>
                    </div>
                    {selectedCurrency !== 'RUB' && (
                      <div className="flex justify-between text-sm">
                        <span>In Rubles:</span>
                        <span>₽{(parseFloat(buyAmount) * exchangeRates[selectedCurrency]).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-accent">You'll receive:</span>
                      <span className="text-accent flex items-center gap-1">
                        <Icon name="Coins" size={18} />
                        {calculateBoombucks(buyAmount, selectedCurrency)} Boombucks
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-background/30 p-3 rounded-lg space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Icon name="Coins" size={14} className="text-accent" />
                    <span>1 Boombuck = ₽100</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="RefreshCw" size={14} className="text-blue-400" />
                    <span>Rates updated in real-time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Zap" size={14} className="text-green-400" />
                    <span>Instant delivery</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setBuyDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleBuyBoombucks}
                  disabled={!buyAmount || parseFloat(buyAmount) <= 0}
                  className="bg-accent hover:bg-accent/90 flex-1"
                >
                  <Icon name="ShoppingCart" className="mr-2" size={16} />
                  Buy Now
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
        />
      ) : activeTab === 'ads' ? (
        <AdvertisingMarketplace 
          userBoombucks={userBoombucks}
          setUserBoombucks={setUserBoombucks}
          transactions={transactions}
          setTransactions={setTransactions}
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