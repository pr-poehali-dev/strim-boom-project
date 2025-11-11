import { memo, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Creator } from '../types';

interface CreatorCardProps {
  creator: Creator;
  calculateCPM: (adPrice: number, avgViews: number) => string;
  onOrderClick: (creator: Creator) => void;
}

export const CreatorCard = memo(({ creator, calculateCPM, onOrderClick }: CreatorCardProps) => {
  const handleOrderClick = useCallback(() => {
    onOrderClick(creator);
  }, [creator, onOrderClick]);

  return (
    <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-4 hover:border-accent/50 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src={creator.avatar} />
          <AvatarFallback>{creator.username[1]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-bold text-white">{creator.username}</h3>
          <p className="text-xs text-muted-foreground">{creator.category}</p>
        </div>
        <Badge className="bg-accent/20 text-accent text-xs">
          <Icon name="Coins" size={12} className="mr-1" />
          {creator.adPrice} BBS
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Icon name="Users" size={14} />
            Followers
          </span>
          <span className="font-semibold text-white">
            {(creator.followers / 1000000).toFixed(1)}M
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Icon name="Eye" size={14} />
            Avg Views
          </span>
          <span className="font-semibold text-white">
            {(creator.avgViews / 1000).toFixed(0)}K
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Icon name="TrendingUp" size={14} />
            CPM
          </span>
          <span className="font-semibold text-accent">
            ₽{calculateCPM(creator.adPrice, creator.avgViews)}
          </span>
        </div>
      </div>

      <Button 
        onClick={handleOrderClick}
        className="w-full bg-accent hover:bg-accent/90"
      >
        <Icon name="ShoppingCart" className="mr-2" size={16} />
        Order Ad
      </Button>
    </Card>
  );
});

CreatorCard.displayName = 'CreatorCard';