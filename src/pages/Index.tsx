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
  allowCollab: boolean;
  allowRemix: boolean;
  originalAuthor?: string;
  collabWith?: string[];
}

interface Stream {
  id: number;
  username: string;
  avatar: string;
  title: string;
  thumbnail: string;
  viewers: number;
  category: string;
  isLive: boolean;
}

const mockStreams: Stream[] = [
  {
    id: 1,
    username: '@neon_gamer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neon',
    title: 'Космический турнир по AI-играм 🎮',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc',
    viewers: 12453,
    category: 'Игры',
    isLive: true
  },
  {
    id: 2,
    username: '@music_ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=music',
    title: 'Создаём хиты с AI в реальном времени 🎵',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    viewers: 8921,
    category: 'Музыка',
    isLive: true
  },
  {
    id: 3,
    username: '@tech_wizard',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    title: 'Собираю робота с нейросетью 🤖',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    viewers: 15234,
    category: 'Технологии',
    isLive: true
  },
  {
    id: 4,
    username: '@art_creator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=art',
    title: 'Рисую мир мечты в Midjourney ✨',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    viewers: 6782,
    category: 'Творчество',
    isLive: true
  }
];

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
    trend: 'Космические визуализации',
    allowCollab: true,
    allowRemix: false
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
    trend: 'Танцевальные челленджи',
    allowCollab: false,
    allowRemix: false
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
    isAI: true,
    allowCollab: true,
    allowRemix: true
  },
  {
    id: 4,
    username: '@remix_master',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=remix',
    description: 'Ремикс от @ai_dreams - добавил визуал! 🎨🎵 #Collab',
    videoUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
    likes: 9876,
    comments: 432,
    shares: 789,
    isAI: true,
    originalAuthor: '@ai_dreams',
    allowCollab: true,
    allowRemix: false
  },
  {
    id: 5,
    username: '@collab_duo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=duo',
    description: 'Коллаб с @cosmic_creator 🤝✨ Вместе мы сила!',
    videoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
    likes: 14567,
    comments: 654,
    shares: 1234,
    isAI: true,
    collabWith: ['@cosmic_creator', '@collab_duo'],
    allowCollab: true,
    allowRemix: true
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

      {activeTab === 'streams' ? (
        <div className="h-full w-full pt-20 pb-24 px-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse-glow" />
              Прямые эфиры
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockStreams.map((stream) => (
                <Card key={stream.id} className="bg-card/50 backdrop-blur-lg border-primary/30 overflow-hidden cursor-pointer hover:border-primary/60 transition-all hover:scale-[1.02] group">
                  <div className="relative aspect-video">
                    <img 
                      src={stream.thumbnail} 
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
                    
                    {stream.isLive && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-accent text-white font-bold px-3 py-1 flex items-center gap-2 animate-fade-in">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse-glow" />
                          LIVE
                        </Badge>
                      </div>
                    )}
                    
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-background/80 backdrop-blur-sm text-white font-semibold px-2 py-1">
                        <Icon name="Eye" size={14} className="inline mr-1" />
                        {stream.viewers.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary">
                        <AvatarImage src={stream.avatar} />
                        <AvatarFallback>{stream.username[1]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold mb-1 group-hover:text-primary transition-colors">
                          {stream.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{stream.username}</p>
                        <Badge variant="outline" className="mt-2 border-primary/50 text-primary text-xs">
                          {stream.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
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
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {video.trend && (
                    <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 backdrop-blur-sm">
                      🔥 {video.trend}
                    </Badge>
                  )}
                  
                  {video.originalAuthor && (
                    <Badge variant="outline" className="border-accent/50 text-accent bg-accent/10 backdrop-blur-sm">
                      <Icon name="Shuffle" size={12} className="mr-1" />
                      Ремикс {video.originalAuthor}
                    </Badge>
                  )}
                  
                  {video.collabWith && (
                    <Badge variant="outline" className="border-secondary/50 text-secondary bg-secondary/10 backdrop-blur-sm">
                      <Icon name="Users" size={12} className="mr-1" />
                      Коллаб
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2 text-xs text-white/60">
                  {video.allowCollab && (
                    <span className="flex items-center gap-1">
                      <Icon name="Handshake" size={12} />
                      Коллаб разрешён
                    </span>
                  )}
                  {video.allowRemix && (
                    <span className="flex items-center gap-1">
                      <Icon name="Sparkles" size={12} />
                      Ремикс разрешён
                    </span>
                  )}
                  {!video.allowCollab && !video.allowRemix && (
                    <span className="flex items-center gap-1">
                      <Icon name="Lock" size={12} />
                      Только просмотр
                    </span>
                  )}
                </div>
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

                <button 
                  disabled={!video.allowRemix}
                  className={`flex flex-col items-center gap-1 transition-transform ${video.allowRemix ? 'hover:scale-110' : 'opacity-50 cursor-not-allowed'}`}
                  title={video.allowRemix ? 'Создать ремикс' : 'Ремиксы запрещены автором'}
                >
                  <div className={`p-3 rounded-full backdrop-blur-sm ${video.allowRemix ? 'bg-secondary/90 text-white' : 'bg-card/50 text-white/50'}`}>
                    <Icon name="Shuffle" size={28} />
                  </div>
                  <span className="text-white text-xs">Ремикс</span>
                </button>

                <button 
                  disabled={!video.allowCollab}
                  className={`flex flex-col items-center gap-1 transition-transform ${video.allowCollab ? 'hover:scale-110' : 'opacity-50 cursor-not-allowed'}`}
                  title={video.allowCollab ? 'Предложить коллаб' : 'Коллабы запрещены автором'}
                >
                  <div className={`p-3 rounded-full backdrop-blur-sm ${video.allowCollab ? 'bg-primary/90 text-white' : 'bg-card/50 text-white/50'}`}>
                    <Icon name="Handshake" size={28} />
                  </div>
                  <span className="text-white text-xs">Коллаб</span>
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
      )}

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