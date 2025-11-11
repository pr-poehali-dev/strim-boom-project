import { useState, useMemo, useCallback } from 'react';
import { mockVideos, Transaction, Notification, Referral } from '@/components/types';

export const useAppState = (currentUserId: number) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'trends' | 'streams' | 'upload' | 'profile' | 'ads'>('home');
  const [userBoombucks, setUserBoombucks] = useState(1250);
  const [showContentFilter, setShowContentFilter] = useState(true);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'KZT' | 'RUB' | 'USDT' | 'PHONE' | 'MEMECOIN'>('RUB');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

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

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const handleClearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

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
  }, [referrals, currentUserId]);

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

  return {
    currentVideo,
    setCurrentVideo,
    liked,
    setLiked,
    activeTab,
    setActiveTab,
    userBoombucks,
    setUserBoombucks,
    showContentFilter,
    setShowContentFilter,
    buyDialogOpen,
    setBuyDialogOpen,
    buyAmount,
    setBuyAmount,
    selectedCurrency,
    setSelectedCurrency,
    showAdminLogin,
    setShowAdminLogin,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    transactions,
    setTransactions,
    notifications,
    setNotifications,
    referrals,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleClearAllNotifications,
    handleReferralPurchase,
    filteredVideos,
    video,
    handleSwipe,
    exchangeRates,
    calculateBoombucks,
    handleBuyBoombucks
  };
};
