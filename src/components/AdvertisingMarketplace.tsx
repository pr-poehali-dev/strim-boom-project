import { useState, useCallback, memo, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Creator, AdCampaign, Transaction, Notification } from './types';
import { CreatorsTab } from './advertising/CreatorsTab';
import { CampaignsTab } from './advertising/CampaignsTab';
import { OrderAdDialog } from './advertising/OrderAdDialog';
import { CreatorModerationTab } from './advertising/CreatorModerationTab';

interface AdvertisingMarketplaceProps {
  userBoombucks: number;
  setUserBoombucks: (amount: number) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  currentUserId: number;
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
  setTransactions,
  notifications,
  setNotifications,
  currentUserId
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

  const handleOrderClick = useCallback((creator: Creator) => {
    setSelectedCreator(creator);
    setAdDialogOpen(true);
  }, []);

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

    const newNotification: Notification = {
      id: (Date.now() + 1).toString(),
      type: 'ad_request',
      title: 'New Ad Request',
      message: `${brandName} wants to run a ${parseInt(adDuration)}s ad for ${price} BBS`,
      campaignId: newCampaign.id,
      read: false,
      createdAt: new Date()
    };
    setNotifications([newNotification, ...notifications]);

    setAdDialogOpen(false);
    setSelectedCreator(null);
    setBrandName('');
    setAdContent('');
    setAdDuration('15');
  }, [selectedCreator, brandName, adContent, adDuration, userBoombucks, setUserBoombucks, campaigns, transactions, setTransactions, notifications, setNotifications]);

  const calculateCPM = useCallback((adPrice: number, avgViews: number) => {
    return ((adPrice * 100) / (avgViews / 1000)).toFixed(2);
  }, []);

  const handleApproveCampaign = useCallback((campaignId: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, status: 'approved' as const } : c
    ));

    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'ad_approved',
        title: 'Ad Approved!',
        message: `Your ad with ${campaign.creatorUsername} has been approved and will go live soon`,
        campaignId: campaign.id,
        read: false,
        createdAt: new Date()
      };
      setNotifications([newNotification, ...notifications]);

      setUserBoombucks(userBoombucks + campaign.price);
      
      const earnTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'payment_received' as const,
        amount: campaign.price,
        description: `Earned from ${campaign.brandName} ad campaign`,
        date: new Date(),
        status: 'completed'
      };
      setTransactions([earnTransaction, ...transactions]);
    }
  }, [campaigns, notifications, setNotifications, userBoombucks, setUserBoombucks, transactions, setTransactions]);

  const handleRejectCampaign = useCallback((campaignId: string, reason: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, status: 'rejected' as const, rejectionReason: reason } : c
    ));

    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'ad_rejected',
        title: 'Ad Rejected',
        message: `${campaign.creatorUsername} rejected your ad. Funds refunded: ${campaign.price} BBS`,
        campaignId: campaign.id,
        read: false,
        createdAt: new Date()
      };
      setNotifications([newNotification, ...notifications]);

      setUserBoombucks(userBoombucks + campaign.price);
      
      const refundTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'buy' as const,
        amount: campaign.price,
        description: `Refund from rejected ad with ${campaign.creatorUsername}`,
        date: new Date(),
        status: 'completed'
      };
      setTransactions([refundTransaction, ...transactions]);
    }
  }, [campaigns, notifications, setNotifications, userBoombucks, setUserBoombucks, transactions, setTransactions]);

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="creators">Find Creators</TabsTrigger>
            <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="creators">
            <CreatorsTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              filteredCreators={filteredCreators}
              calculateCPM={calculateCPM}
              onOrderClick={handleOrderClick}
            />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignsTab campaigns={campaigns} />
          </TabsContent>

          <TabsContent value="moderation">
            <CreatorModerationTab
              campaigns={campaigns}
              onApprove={handleApproveCampaign}
              onReject={handleRejectCampaign}
              currentUserId={currentUserId}
            />
          </TabsContent>
        </Tabs>

        <OrderAdDialog
          open={adDialogOpen}
          onOpenChange={setAdDialogOpen}
          selectedCreator={selectedCreator}
          brandName={brandName}
          setBrandName={setBrandName}
          adContent={adContent}
          setAdContent={setAdContent}
          adDuration={adDuration}
          setAdDuration={setAdDuration}
          userBoombucks={userBoombucks}
          handleOrderAd={handleOrderAd}
        />
      </div>
    </div>
  );
});

AdvertisingMarketplace.displayName = 'AdvertisingMarketplace';