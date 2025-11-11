import { useState, useMemo, useCallback, useEffect } from 'react';
import { mockVideos, Transaction, Notification, Referral } from '@/components/types';
import funcUrls from '../../backend/func2url.json';
import { toast } from 'sonner';

export const useAppState = (currentUserId: number) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'trends' | 'streams' | 'upload' | 'profile' | 'ads'>('home');
  const [userBoombucks, setUserBoombucks] = useState(0);
  const [showContentFilter, setShowContentFilter] = useState(true);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'KZT' | 'RUB' | 'USDT' | 'PHONE' | 'MEMECOIN'>('RUB');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

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

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCode, setReferralCode] = useState<string>('');

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const handleClearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await fetch(`${funcUrls.transactions}?user_id=${currentUserId}`);
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions.map((t: any) => ({
            ...t,
            date: new Date(t.date)
          })));
        }
      } catch (error) {
        console.error('Failed to load transactions:', error);
      }
    };
    
    const loadReferrals = async () => {
      try {
        const response = await fetch(`${funcUrls.referrals}?user_id=${currentUserId}`);
        if (response.ok) {
          const data = await response.json();
          setReferrals(data.referrals.map((r: any) => ({
            ...r,
            createdAt: new Date(r.createdAt)
          })));
          setReferralCode(data.referralCode || '');
        }
      } catch (error) {
        console.error('Failed to load referrals:', error);
      }
    };
    
    if (currentUserId) {
      loadTransactions();
      loadReferrals();
    }
  }, [currentUserId]);

  const handleReferralPurchase = useCallback(async (referredUserId: number, referredUsername: string, purchaseAmount: number) => {
    try {
      const response = await fetch(funcUrls.referrals, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrer_id: currentUserId,
          referred_user_id: referredUserId,
          purchase_amount: purchaseAmount
        })
      });
      
      if (response.ok) {
        const referralsResponse = await fetch(`${funcUrls.referrals}?user_id=${currentUserId}`);
        if (referralsResponse.ok) {
          const data = await referralsResponse.json();
          setReferrals(data.referrals.map((r: any) => ({
            ...r,
            createdAt: new Date(r.createdAt)
          })));
        }
      }
    } catch (error) {
      console.error('Failed to process referral:', error);
    }
  }, [currentUserId]);

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
    MEMECOIN: 10
  }), []);

  const calculateBoombucks = useCallback((amount: string, currency: 'USD' | 'EUR' | 'KZT' | 'RUB' | 'USDT' | 'PHONE' | 'MEMECOIN') => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return 0;
    
    if (currency === 'MEMECOIN') {
      return Math.floor(value / exchangeRates.MEMECOIN);
    }
    
    const rubAmount = value * exchangeRates[currency];
    return Math.floor(rubAmount / 100);
  }, [exchangeRates]);

  const handleBuyBoombucks = useCallback(async () => {
    const boombucksToAdd = calculateBoombucks(buyAmount, selectedCurrency);
    if (boombucksToAdd > 0) {
      try {
        const response = await fetch(funcUrls.transactions, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: currentUserId,
            type: 'buy',
            amount: boombucksToAdd,
            currency: selectedCurrency,
            description: `Покупка ${boombucksToAdd} BBS через ${selectedCurrency}`
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserBoombucks(userBoombucks + boombucksToAdd);
          
          const newTransaction: Transaction = {
            id: data.transaction.id,
            type: 'buy',
            amount: boombucksToAdd,
            currency: selectedCurrency,
            description: data.transaction.description,
            date: new Date(data.transaction.date),
            status: 'completed'
          };
          setTransactions(prev => [newTransaction, ...prev]);
          
          setBuyDialogOpen(false);
          setBuyAmount('');
          
          const currencyLabels = {
            RUB: '₽',
            USDT: 'USDT',
            PHONE: 'СБП',
            MEMECOIN: 'мемкоинов',
            USD: '$',
            EUR: '€',
            KZT: '₸'
          };
          
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PWqzn7q5aGAg+ldb0xHMpBSh+zPLaizsIGGS56+mgUBELTKXh8bllHAU2jtHz0YAyBx1rvu7mnkwOD1ms5/CtWhgIPpXW88NxKAUof8zx2Io8BxhmuevsokAQC06k4PG8aR4EO5HS89SCNAYYZ7zv56JPDg5Yreb0rl0bCECV1/PGdSsFKoHO8tmLPQcYZbvs7aVTEgxOpN/yv2weBTuR0vTWhDQGGmW76+mfUBELT6Pe88JvJAU5kdPz1oU1BhpmvO3qn1ARDVGD4O/Ediwp');
          audio.volume = 0.3;
          audio.play().catch(() => {});
          
          toast.success(`Покупка успешна! 🎉`, {
            description: `Вы получили ${boombucksToAdd} BBS через ${currencyLabels[selectedCurrency]}. Новый баланс: ${userBoombucks + boombucksToAdd} BBS`,
            duration: 4000,
          });
        } else {
          toast.error('Ошибка покупки', {
            description: 'Не удалось завершить покупку. Попробуйте снова.',
          });
        }
      } catch (error) {
        console.error('Failed to buy boombucks:', error);
      }
    }
  }, [buyAmount, selectedCurrency, calculateBoombucks, userBoombucks, currentUserId]);

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
    referralCode,
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