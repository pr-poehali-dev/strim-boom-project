import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Video {
  id: number;
  username: string;
  avatar: string;
  description: string;
  videoUrl: string;
  likes: number;
  comments: number;
  shares: number;
  isAI: boolean;
  trend?: string;
}

const mockVideos: Video[] = [
  {
    id: 1,
    username: '@cosmic_creator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic',
    description: 'Создал эту галактику в AI! 🌌 #streamboom #ai',
    videoUrl: 'https://cdn.poehali.dev/files/0ccaf940-5099-4e11-af1b-7d010a0505f3.jpg',
    likes: 15234,
    comments: 842,
    shares: 1203,
    isAI: true,
    trend: 'Космические визуализации'
  },
  {
    id: 2,
    username: '@fire_artist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fire',
    description: 'Огненный танец под звездами 🔥✨',
    videoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    likes: 23451,
    comments: 1234,
    shares: 2341,
    isAI: false,
    trend: 'Танцевальные челленджи'
  },
  {
    id: 3,
    username: '@ai_dreams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dreams',
    description: 'AI сгенерировал этот сюр 🤖💭 #streamboom',
    videoUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a',
    likes: 18756,
    comments: 967,
    shares: 1532,
    isAI: true
  }
];

const Index = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'trends' | 'streams' | 'upload' | 'profile'>('home');

  const video = mockVideos[currentVideo];

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentVideo < mockVideos.length - 1) {
      setCurrentVideo(currentVideo + 1);
      setLiked(false);
    } else if (direction === 'down' && currentVideo > 0) {
      setCurrentVideo(currentVideo - 1);
      setLiked(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
        <img 
          src="https://cdn.poehali.dev/files/0ccaf940-5099-4e11-af1b-7d010a0505f3.jpg" 
          alt="STREAM-BOOM" 
          className="h-12 w-auto animate-pulse-glow"
        />
        <Button variant="ghost" size="icon" className="text-white">
          <Icon name="Search" size={24} />
        </Button>
      </div>

      <div className="h-full w-full flex items-center justify-center pt-20 pb-24">
        <Card className="relative w-full max-w-md h-[calc(100vh-180px)] bg-card/50 backdrop-blur-lg border-primary/30 overflow-hidden rounded-3xl">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url(${video.videoUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
          </div>

          {video.isAI && (
            <div className="absolute top-4 left-4 z-10 animate-fade-in">
              <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm text-base px-3 py-1 font-bold">
                И И
              </Badge>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src={video.avatar} />
                    <AvatarFallback>{video.username[1]}</AvatarFallback>
                  </Avatar>
                  <span className="text-white font-semibold text-lg">{video.username}</span>
                </div>
                
                <p className="text-white/90 mb-2">{video.description}</p>
                
                {video.trend && (
                  <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 backdrop-blur-sm">
                    🔥 {video.trend}
                  </Badge>
                )}
              </div>

              <div className="flex flex-col gap-4 items-center">
                <button 
                  onClick={() => setLiked(!liked)}
                  className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
                >
                  <div className={`p-3 rounded-full bg-card/50 backdrop-blur-sm ${liked ? 'text-accent' : 'text-white'}`}>
                    <Icon name="Heart" size={28} className={liked ? 'fill-current' : ''} />
                  </div>
                  <span className="text-white text-sm font-semibold">{(video.likes + (liked ? 1 : 0)).toLocaleString()}</span>
                </button>

                <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
                  <div className="p-3 rounded-full bg-card/50 backdrop-blur-sm text-white">
                    <Icon name="MessageCircle" size={28} />
                  </div>
                  <span className="text-white text-sm font-semibold">{video.comments.toLocaleString()}</span>
                </button>

                <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
                  <div className="p-3 rounded-full bg-card/50 backdrop-blur-sm text-white">
                    <Icon name="Share2" size={28} />
                  </div>
                  <span className="text-white text-sm font-semibold">{video.shares.toLocaleString()}</span>
                </button>

                <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
                  <div className="p-3 rounded-full bg-accent/90 backdrop-blur-sm text-white">
                    <Icon name="Coins" size={28} />
                  </div>
                  <span className="text-white text-xs">Донат</span>
                </button>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-20 pointer-events-none">
            <Icon name="ChevronUp" size={48} className="text-white" />
            <Icon name="ChevronDown" size={48} className="text-white" />
          </div>

          <button 
            onClick={() => handleSwipe('down')}
            className="absolute top-0 left-0 right-0 h-1/3 z-10"
            aria-label="Previous video"
          />
          <button 
            onClick={() => handleSwipe('up')}
            className="absolute bottom-24 left-0 right-0 h-1/3 z-10"
            aria-label="Next video"
          />
        </Card>
      </div>

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

          <button 
            onClick={() => setActiveTab('trends')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'trends' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon name="Users" size={24} />
            <span className="text-xs">Коллабы</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon name="User" size={24} />
            <span className="text-xs">Профиль</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;