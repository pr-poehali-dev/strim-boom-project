import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoCard } from '@/components/VideoCard';
import { StreamsList } from '@/components/StreamsList';
import { BottomNavigation } from '@/components/BottomNavigation';
import { mockVideos, mockStreams } from '@/components/types';

const Index = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'trends' | 'streams' | 'upload' | 'profile'>('home');
  const [userBoombucks, setUserBoombucks] = useState(1250);
  const [showContentFilter, setShowContentFilter] = useState(true);

  const filteredVideos = showContentFilter 
    ? mockVideos.filter(v => !v.isBlocked) 
    : mockVideos;

  const video = filteredVideos[currentVideo] || mockVideos[0];

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentVideo < filteredVideos.length - 1) {
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
        <div className="flex items-center gap-2">
          <Badge className="bg-accent/90 text-white font-bold px-3 py-1.5 flex items-center gap-1.5">
            <Icon name="Coins" size={16} />
            {userBoombucks} Boombucks
          </Badge>
          <Button variant="ghost" size="icon" className="text-white">
            <Icon name="Search" size={24} />
          </Button>
        </div>
      </div>

      {activeTab === 'streams' ? (
        <StreamsList streams={mockStreams} />
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
        mockVideos={mockVideos}
        filteredVideos={filteredVideos}
      />
    </div>
  );
};

export default Index;
