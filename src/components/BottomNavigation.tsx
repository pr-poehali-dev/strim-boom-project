import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Video } from './types';

interface BottomNavigationProps {
  activeTab: 'home' | 'trends' | 'streams' | 'upload' | 'profile';
  setActiveTab: (tab: 'home' | 'trends' | 'streams' | 'upload' | 'profile') => void;
  showContentFilter: boolean;
  setShowContentFilter: (show: boolean) => void;
  mockVideos: Video[];
  filteredVideos: Video[];
}

export const BottomNavigation = ({ 
  activeTab, 
  setActiveTab, 
  showContentFilter, 
  setShowContentFilter,
  mockVideos,
  filteredVideos
}: BottomNavigationProps) => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-20 bg-card/80 backdrop-blur-lg border-t border-primary/20">
      <div className="flex items-center justify-around py-3">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Icon name="Home" size={24} />
          <span className="text-xs">Главная</span>
        </button>

        <button 
          onClick={() => setActiveTab('trends')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'trends' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Icon name="TrendingUp" size={24} />
          <span className="text-xs">Тренды</span>
        </button>

        <button 
          onClick={() => setActiveTab('streams')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'streams' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Icon name="Radio" size={24} />
          <span className="text-xs">Стримы</span>
        </button>

        <button 
          onClick={() => setActiveTab('upload')}
          className="relative -mt-4"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent shadow-lg shadow-primary/50">
            <Icon name="Plus" size={28} className="text-white" />
          </div>
        </button>

        <Dialog>
          <DialogTrigger asChild>
            <button className="flex flex-col items-center gap-1 transition-colors text-muted-foreground">
              <Icon name="ShieldCheck" size={24} />
              <span className="text-xs">Фильтр</span>
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
                  onClick={() => setShowContentFilter(!showContentFilter)}
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
                    <span className="font-bold text-red-400">{mockVideos.filter(v => v.isBlocked).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Voice-Swapped:</span>
                    <span className="font-bold text-purple-400">{mockVideos.filter(v => v.voiceSwapped).length}</span>
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
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Icon name="User" size={24} />
          <span className="text-xs">Профиль</span>
        </button>
      </div>
    </nav>
  );
};
