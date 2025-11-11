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
import { useAppState } from '@/hooks/useAppState';
import { mockStreams } from '@/components/types';

const Index = () => {
  const currentUserId = 1;
  const cryptoWallet = 'UQCuFtQ2uMdPVRdhgEO_sOHhHwXZxXEG0anj-U0BRElk0zOk';
  const phoneNumber = '+79503994868';

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
        mockVideos={mockStreams}
        filteredVideos={filteredVideos}
      />

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
    </div>
  );
};

export default Index;
