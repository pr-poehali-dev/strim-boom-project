import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { VideoCard } from '@/components/VideoCard';
import { StreamsList } from '@/components/StreamsList';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ProfilePage } from '@/components/ProfilePage';
import { AdvertisingMarketplace } from '@/components/AdvertisingMarketplace';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminPanel } from '@/components/AdminPanel';
import { AppHeader } from '@/components/home/AppHeader';
import { BuyBoombucksDialog } from '@/components/home/BuyBoombucksDialog';
import { StreamView } from '@/components/stream/StreamView';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { CreateStreamDialog } from '@/components/stream/CreateStreamDialog';
import { BroadcastView } from '@/components/stream/BroadcastView';
import { useAppState } from '@/hooks/useAppState';
import { useStreams } from '@/hooks/useStreams';
import { mockStreams, Stream } from '@/components/types';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const cryptoWallet = 'UQCuFtQ2uMdPVRdhgEO_sOHhHwXZxXEG0anj-U0BRElk0zOk';
  const phoneNumber = '+79503994868';
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [createStreamOpen, setCreateStreamOpen] = useState(false);
  const [broadcastStreamId, setBroadcastStreamId] = useState<number | null>(null);
  const { streams, refetch: refetchStreams } = useStreams();

  const handleStreamCreated = () => {
    refetchStreams();
  };

  const handleStartBroadcast = async () => {
    setCreateStreamOpen(true);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const currentUserId = user?.id || 1;

  const {
    currentVideo,
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
  } = useAppState(currentUserId);

  return (
    <div className="h-screen w-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <AppHeader
          userBoombucks={userBoombucks}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAllNotifications}
          onAdminClick={() => setShowAdminLogin(true)}
        />
        
        <BuyBoombucksDialog
          open={buyDialogOpen}
          onOpenChange={setBuyDialogOpen}
          userBoombucks={userBoombucks}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          buyAmount={buyAmount}
          setBuyAmount={setBuyAmount}
          exchangeRates={exchangeRates}
          calculateBoombucks={calculateBoombucks}
          onBuyBoombucks={handleBuyBoombucks}
          cryptoWallet={cryptoWallet}
          phoneNumber={phoneNumber}
        />
      </Dialog>

      {!user ? (
        <div className="flex items-center justify-center min-h-screen">
          {authMode === 'login' ? (
            <LoginForm 
              onSuccess={(userData) => setUser(userData)}
              onSwitchToRegister={() => setAuthMode('register')}
            />
          ) : (
            <RegisterForm 
              onSuccess={(userData) => setUser(userData)}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </div>
      ) : activeTab === 'streams' ? (
        <StreamsList 
          streams={streams.length > 0 ? streams : mockStreams} 
          onStreamClick={setSelectedStream}
        />
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

      {user && (
        <BottomNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showContentFilter={showContentFilter}
          setShowContentFilter={setShowContentFilter}
          mockVideos={mockStreams}
          filteredVideos={filteredVideos}
          onStartStream={handleStartBroadcast}
        />
      )}

      {showAdminLogin && !isAdminLoggedIn && (
        <AdminLogin 
          onLogin={() => {
            setIsAdminLoggedIn(true);
            setShowAdminLogin(false);
          }}
        />
      )}

      {isAdminLoggedIn && (
        <AdminPanel 
          onClose={() => setIsAdminLoggedIn(false)}
        />
      )}

      {selectedStream && (
        <StreamView
          stream={selectedStream}
          userBoombucks={userBoombucks}
          setUserBoombucks={setUserBoombucks}
          isStreamer={false}
          onClose={() => setSelectedStream(null)}
        />
      )}

      {broadcastStreamId && (
        <BroadcastView
          streamId={broadcastStreamId}
          onStop={() => {
            setBroadcastStreamId(null);
            refetchStreams();
          }}
        />
      )}

      {user && (
        <CreateStreamDialog
          open={createStreamOpen}
          onOpenChange={setCreateStreamOpen}
          userId={user.id}
          onSuccess={() => {
            handleStreamCreated();
            const newStreamId = streams[0]?.id || 1;
            setBroadcastStreamId(newStreamId);
          }}
        />
      )}
    </div>
  );
};

export default Index;