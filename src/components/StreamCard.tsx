import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Stream } from './types';
import { LiveStreamViewer } from './stream/LiveStreamViewer';

interface StreamCardProps {
  stream: Stream;
  style?: React.CSSProperties;
  onClick?: (stream: Stream) => void;
}

export const StreamCard = memo(({ stream, style, onClick }: StreamCardProps) => {
  return (
    <div style={style} className="px-2 pb-2">
      <Card 
        className="bg-card/50 backdrop-blur-lg border-primary/30 overflow-hidden cursor-pointer active:scale-95 transition-all duration-200 touch-manipulation"
        onClick={() => onClick?.(stream)}
      >
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={stream.thumbnail} 
            alt={stream.title}
            className="w-full h-full object-cover transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
          
          {stream.isLive && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-red-600 text-white font-bold px-2.5 py-0.5 flex items-center gap-1.5 text-xs shadow-lg">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                LIVE
              </Badge>
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/60 backdrop-blur-sm text-white font-semibold px-2 py-0.5 text-xs shadow-lg">
              <Icon name="Eye" size={12} className="inline mr-1" />
              {stream.viewers.toLocaleString()}
            </Badge>
          </div>
        </div>
        
        <div className="p-3">
          <div className="flex items-start gap-2.5">
            <Avatar className="h-9 w-9 border-2 border-primary/60 flex-shrink-0">
              <AvatarImage src={stream.avatar} />
              <AvatarFallback>{stream.username[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm mb-0.5 line-clamp-2 leading-tight">
                {stream.title}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{stream.username}</p>
              <Badge variant="outline" className="mt-1.5 border-primary/50 text-primary text-[10px] px-2 py-0">
                {stream.category}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});

StreamCard.displayName = 'StreamCard';