import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Stream } from './types';

interface StreamsListProps {
  streams: Stream[];
}

export const StreamsList = memo(({ streams }: StreamsListProps) => {
  return (
    <div className="h-full w-full pt-20 pb-24 px-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse-glow" />
          Прямые эфиры
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {streams.map((stream) => (
            <Card key={stream.id} className="bg-card/50 backdrop-blur-lg border-primary/30 overflow-hidden group cursor-pointer hover:border-primary/60 transition-all duration-300 hover:scale-[1.02]">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={stream.thumbnail} 
                  alt={stream.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
  );
});

StreamsList.displayName = 'StreamsList';