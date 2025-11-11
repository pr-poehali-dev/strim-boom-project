import { useState, useCallback, memo, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Creator, AdCampaign, Transaction } from './types';

interface AdvertisingMarketplaceProps {
  userBoombucks: number;
  setUserBoombucks: (amount: number) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

const mockCreators: Creator[] = [
  {
    id: 1,
    username: '@cyber_artist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cyber',
    followers: 1250000,
    avgViews: 850000,
    category: 'AI Art',
    adPrice: 500,
    acceptsAds: true
  },
  {
    id: 2,
    username: '@tech_guru',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    followers: 890000,
    avgViews: 620000,
    category: 'Technology',
    adPrice: 350,
    acceptsAds: true
  },
  {
    id: 3,
    username: '@music_ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=music',
    followers: 2100000,
    avgViews: 1400000,
    category: 'Music',
    adPrice: 750,
    acceptsAds: true
  },
  {
    id: 4,
    username: '@gaming_pro',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gaming',
    followers: 650000,
    avgViews: 420000,
    category: 'Gaming',
    adPrice: 250,
    acceptsAds: true
  },
  {
    id: 5,
    username: '@neon_dancer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dance',
    followers: 1800000,
    avgViews: 1200000,
    category: 'Dance',
    adPrice: 600,
    acceptsAds: true
  },
  {
    id: 6,
    username: '@food_explorer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=food',
    followers: 450000,
    avgViews: 320000,
    category: 'Food',
    adPrice: 200,
    acceptsAds: true
  }
];

export const AdvertisingMarketplace = memo(({ 
  userBoombucks, 
  setUserBoombucks, 
  transactions, 
  setTransactions 
}: AdvertisingMarketplaceProps) => {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [adDialogOpen, setAdDialogOpen] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [adContent, setAdContent] = useState('');
  const [adDuration, setAdDuration] = useState('15');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    {
      id: '1',
      brandName: 'TechCorp',
      creatorId: 1,
      creatorUsername: '@cyber_artist',
      adContent: 'New AI smartphone with neural chip',
      duration: 30,
      price: 500,
      status: 'live',
      createdAt: new Date(Date.now() - 86400000 * 3)
    },
    {
      id: '2',
      brandName: 'GameStudio',
      creatorId: 4,
      creatorUsername: '@gaming_pro',
      adContent: 'Epic new RPG game release',
      duration: 15,
      price: 250,
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000)
    }
  ]);

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(mockCreators.map(c => c.category))];
    return cats;
  }, []);

  const filteredCreators = useMemo(() => {
    return mockCreators.filter(creator => {
      const matchesSearch = creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           creator.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || creator.category === selectedCategory;
      return matchesSearch && matchesCategory && creator.acceptsAds;
    });
  }, [searchQuery, selectedCategory]);

  const handleOrderAd = useCallback(() => {
    if (!selectedCreator || !brandName || !adContent) return;

    const price = selectedCreator.adPrice;
    
    if (price > userBoombucks) {
      return;
    }

    setUserBoombucks(userBoombucks - price);

    const newCampaign: AdCampaign = {
      id: Date.now().toString(),
      brandName,
      creatorId: selectedCreator.id,
      creatorUsername: selectedCreator.username,
      adContent,
      duration: parseInt(adDuration),
      price,
      status: 'pending',
      createdAt: new Date()
    };
    setCampaigns([newCampaign, ...campaigns]);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'ad_purchase',
      amount: price,
      description: `Ad order for ${selectedCreator.username}: "${adContent.substring(0, 30)}..."`,
      date: new Date(),
      status: 'completed'
    };
    setTransactions([newTransaction, ...transactions]);

    setAdDialogOpen(false);
    setSelectedCreator(null);
    setBrandName('');
    setAdContent('');
    setAdDuration('15');
  }, [selectedCreator, brandName, adContent, adDuration, userBoombucks, setUserBoombucks, campaigns, transactions, setTransactions]);

  const calculateCPM = useCallback((adPrice: number, avgViews: number) => {
    return ((adPrice * 100) / (avgViews / 1000)).toFixed(2);
  }, []);

  return (
    <div className="h-full w-full pt-20 pb-24 px-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Icon name="Megaphone" className="text-accent" />
              Advertising Marketplace
            </h1>
            <p className="text-muted-foreground">Order ads from top creators, pay only in Boombucks</p>
          </div>
          <Badge className="bg-accent/90 text-white font-bold px-4 py-2 text-lg">
            <Icon name="Wallet" size={18} className="mr-2" />
            {userBoombucks} BB
          </Badge>
        </div>

        <Alert className="bg-orange-500/10 border-orange-500/30">
          <Icon name="ShieldAlert" className="h-4 w-4 text-orange-400" />
          <AlertDescription>
            <strong>Important:</strong> All advertising must be paid in Boombucks ONLY. Unpaid ads will be automatically blocked by the system.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="creators" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="creators">Find Creators</TabsTrigger>
            <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
          </TabsList>

          <TabsContent value="creators" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background/50"
                    icon={<Icon name="Search" size={18} />}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCreators.map(creator => (
                <Card key={creator.id} className="bg-card/50 backdrop-blur-lg border-primary/30 p-4 hover:border-primary/60 transition-all">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary">
                          <AvatarImage src={creator.avatar} />
                          <AvatarFallback>{creator.username[1]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-white">{creator.username}</p>
                          <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                            {creator.category}
                          </Badge>
                        </div>
                      </div>
                      {creator.acceptsAds && (
                        <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                          <Icon name="CheckCircle" size={12} className="mr-1" />
                          Open
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-background/30 p-2 rounded">
                        <p className="text-xs text-muted-foreground">Followers</p>
                        <p className="font-bold text-white flex items-center gap-1">
                          <Icon name="Users" size={14} />
                          {(creator.followers / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="bg-background/30 p-2 rounded">
                        <p className="text-xs text-muted-foreground">Avg Views</p>
                        <p className="font-bold text-white flex items-center gap-1">
                          <Icon name="Eye" size={14} />
                          {(creator.avgViews / 1000).toFixed(0)}K
                        </p>
                      </div>
                    </div>

                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Ad Price</span>
                        <span className="text-2xl font-bold text-accent flex items-center gap-1">
                          <Icon name="Coins" size={20} />
                          {creator.adPrice} BB
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>CPM:</span>
                        <span>₽{calculateCPM(creator.adPrice, creator.avgViews)}</span>
                      </div>
                    </div>

                    <Dialog open={adDialogOpen && selectedCreator?.id === creator.id} onOpenChange={(open) => {
                      setAdDialogOpen(open);
                      if (!open) setSelectedCreator(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-accent hover:bg-accent/90"
                          onClick={() => setSelectedCreator(creator)}
                        >
                          <Icon name="ShoppingCart" className="mr-2" size={16} />
                          Order Ad
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Icon name="Megaphone" className="text-accent" />
                            Order Advertisement
                          </DialogTitle>
                          <DialogDescription>
                            Place an ad order with {creator.username}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <div className="bg-background/50 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 border-2 border-primary">
                                <AvatarImage src={creator.avatar} />
                                <AvatarFallback>{creator.username[1]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-white">{creator.username}</p>
                                <p className="text-xs text-muted-foreground">{creator.followers.toLocaleString()} followers</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Price</p>
                              <p className="text-xl font-bold text-accent flex items-center gap-1">
                                <Icon name="Coins" size={18} />
                                {creator.adPrice} BB
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Brand Name *</Label>
                            <Input
                              placeholder="Your brand or company name"
                              value={brandName}
                              onChange={(e) => setBrandName(e.target.value)}
                              className="bg-background/50"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Ad Content *</Label>
                            <Textarea
                              placeholder="Describe your product or service..."
                              value={adContent}
                              onChange={(e) => setAdContent(e.target.value)}
                              className="bg-background/50 min-h-[100px]"
                              maxLength={300}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                              {adContent.length}/300 characters
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label>Ad Duration (seconds)</Label>
                            <div className="flex gap-2">
                              {[10, 15, 30, 60].map(dur => (
                                <Button
                                  key={dur}
                                  variant={adDuration === dur.toString() ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setAdDuration(dur.toString())}
                                >
                                  {dur}s
                                </Button>
                              ))}
                            </div>
                          </div>

                          <Alert className="bg-primary/10 border-primary/30">
                            <Icon name="Info" className="h-4 w-4" />
                            <AlertDescription>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Ad Price:</span>
                                  <span className="font-bold">{creator.adPrice} BB</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Your Balance:</span>
                                  <span className={userBoombucks >= creator.adPrice ? 'text-green-400' : 'text-red-400'}>
                                    {userBoombucks} BB
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>After Purchase:</span>
                                  <span className="font-bold text-accent">
                                    {Math.max(0, userBoombucks - creator.adPrice)} BB
                                  </span>
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>

                          {userBoombucks < creator.adPrice && (
                            <Alert className="bg-red-500/10 border-red-500/30">
                              <Icon name="AlertCircle" className="h-4 w-4 text-red-400" />
                              <AlertDescription className="text-red-400">
                                Insufficient Boombucks. You need {creator.adPrice - userBoombucks} more BB.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setAdDialogOpen(false);
                              setSelectedCreator(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleOrderAd}
                            disabled={!brandName || !adContent || userBoombucks < creator.adPrice}
                            className="bg-accent hover:bg-accent/90"
                          >
                            <Icon name="CheckCircle" className="mr-2" size={16} />
                            Confirm & Pay
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))}
            </div>

            {filteredCreators.length === 0 && (
              <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-12 text-center">
                <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No creators found matching your criteria</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="BarChart3" className="text-accent" />
                Your Ad Campaigns
              </h3>

              <div className="space-y-3">
                {campaigns.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No campaigns yet. Start by ordering an ad!</p>
                  </div>
                ) : (
                  campaigns.map(campaign => (
                    <div
                      key={campaign.id}
                      className="bg-background/50 p-4 rounded-lg border border-primary/20 hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-white">{campaign.brandName}</p>
                            <Badge
                              className={
                                campaign.status === 'live' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                campaign.status === 'pending' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                campaign.status === 'approved' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                'bg-red-500/20 text-red-400 border-red-500/30'
                              }
                            >
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Creator: <span className="text-primary">{campaign.creatorUsername}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-accent flex items-center gap-1">
                            <Icon name="Coins" size={16} />
                            {campaign.price} BB
                          </p>
                          <p className="text-xs text-muted-foreground">{campaign.duration}s ad</p>
                        </div>
                      </div>

                      <p className="text-sm text-white mb-3 bg-background/30 p-3 rounded">
                        "{campaign.adContent}"
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={12} />
                          {campaign.createdAt.toLocaleDateString()}
                        </span>
                        {campaign.status === 'live' && (
                          <span className="flex items-center gap-1 text-green-400">
                            <Icon name="Tv" size={12} />
                            Broadcasting
                          </span>
                        )}
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

AdvertisingMarketplace.displayName = 'AdvertisingMarketplace';
