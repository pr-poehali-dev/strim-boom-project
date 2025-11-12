import { memo, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Video } from './types';

interface BottomNavigationProps {
  activeTab: 'home' | 'trends' | 'streams' | 'upload' | 'profile' | 'ads';
  setActiveTab: (tab: 'home' | 'trends' | 'streams' | 'upload' | 'profile' | 'ads') => void;
  showContentFilter: boolean;
  setShowContentFilter: (show: boolean) => void;
  mockVideos: Video[];
  filteredVideos: Video[];
  onStartStream?: () => void;
}

export const BottomNavigation = memo(({ 
  activeTab, 
  setActiveTab, 
  showContentFilter, 
  setShowContentFilter,
  mockVideos,
  filteredVideos,
  onStartStream
}: BottomNavigationProps) => {
  const blockedCount = useMemo(() => mockVideos.filter(v => v.isBlocked).length, [mockVideos]);
  const voiceSwappedCount = useMemo(() => mockVideos.filter(v => v.voiceSwapped).length, [mockVideos]);

  const handleToggleFilter = useCallback(() => {
    setShowContentFilter(!showContentFilter);
  }, [showContentFilter, setShowContentFilter]);

  const handleTabClick = useCallback((tab: 'home' | 'trends' | 'streams' | 'upload' | 'profile' | 'ads') => {
    setActiveTab(tab);
  }, [setActiveTab]);
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-primary/30 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2 max-w-screen-xl mx-auto">
        <button 
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center gap-0.5 transition-all active:scale-95 p-2 rounded-lg ${activeTab === 'home' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
        >
          <Icon name="Home" size={22} />
          <span className="text-[10px] font-medium">Главная</span>
        </button>

        <button 
          onClick={() => handleTabClick('trends')}
          className={`flex flex-col items-center gap-0.5 transition-all active:scale-95 p-2 rounded-lg ${activeTab === 'trends' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
        >
          <Icon name="TrendingUp" size={22} />
          <span className="text-[10px] font-medium">Тренды</span>
        </button>

        <button 
          onClick={() => handleTabClick('streams')}
          className={`flex flex-col items-center gap-0.5 transition-all active:scale-95 p-2 rounded-lg ${activeTab === 'streams' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
        >
          <Icon name="Radio" size={22} />
          <span className="text-[10px] font-medium">Стримы</span>
        </button>

        <button 
          onClick={() => handleTabClick('ads')}
          className={`flex flex-col items-center gap-0.5 transition-all active:scale-95 p-2 rounded-lg ${activeTab === 'ads' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
        >
          <Icon name="Megaphone" size={22} />
          <span className="text-[10px] font-medium">Реклама</span>
        </button>

        <button 
          onClick={onStartStream}
          className="relative -mt-6 transition-all active:scale-95"
        >
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-xl shadow-red-500/60 animate-pulse-glow">
            <Icon name="Video" size={26} className="text-white" />
          </div>
        </button>

        <Dialog>
          <DialogTrigger asChild>
            <button className="flex flex-col items-center gap-0.5 transition-all active:scale-95 p-2 rounded-lg text-muted-foreground">
              <Icon name="ShieldCheck" size={22} />
              <span className="text-[10px] font-medium">Фильтр</span>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Icon name="ShieldCheck" className="text-primary" />
                Content Filter
              </DialogTitle>
              <DialogDescription>
                Control what content you see
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <div className="space-y-1">
                  <div className="font-semibold flex items-center gap-2">
                    <Icon name="ShieldAlert" className="text-red-400" size={18} />
                    Block Illegal Content
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hide videos blocked by government regulations
                  </p>
                </div>
                <Button
                  variant={showContentFilter ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleFilter}
                >
                  {showContentFilter ? 'ON' : 'OFF'}
                </Button>
              </div>

              <Alert className="bg-orange-500/10 border-orange-500/30">
                <Icon name="Info" className="h-4 w-4 text-orange-400" />
                <AlertDescription className="text-sm">
                  <strong>Copyright Protection:</strong> All videos with copyrighted music are automatically processed with voice-swapping technology (female ↔ male) to avoid copyright strikes.
                </AlertDescription>
              </Alert>

              <div className="space-y-2 p-4 bg-background/30 rounded-lg">
                <div className="font-semibold text-sm mb-2">Filter Statistics</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Videos:</span>
                    <span className="font-bold">{mockVideos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blocked Content:</span>
                    <span className="font-bold text-red-400">{blockedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Voice-Swapped:</span>
                    <span className="font-bold text-purple-400">{voiceSwappedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-bold text-green-400">{filteredVideos.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <button 
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center gap-0.5 transition-all active:scale-95 p-2 rounded-lg ${activeTab === 'profile' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
        >
          <Icon name="User" size={22} />
          <span className="text-[10px] font-medium">Профиль</span>
        </button>
      </div>
    </nav>
  );
});

BottomNavigation.displayName = 'BottomNavigation';