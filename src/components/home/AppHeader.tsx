import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DialogTrigger } from '@/components/ui/dialog';
import { NotificationCenter } from '@/components/NotificationCenter';
import { Notification } from '@/components/types';

interface AppHeaderProps {
  userBoombucks: number;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onAdminClick: () => void;
}

export const AppHeader = memo(({
  userBoombucks,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onAdminClick
}: AppHeaderProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
      <img 
        src="https://cdn.poehali.dev/files/0ccaf940-5099-4e11-af1b-7d010a0505f3.jpg" 
        alt="STREAM-BOOM" 
        className="h-12 w-auto animate-pulse-glow"
      />
      <div className="flex items-center gap-2">
        <NotificationCenter 
          notifications={notifications}
          onMarkAsRead={onMarkAsRead}
          onMarkAllAsRead={onMarkAllAsRead}
          onClearAll={onClearAll}
        />
        <DialogTrigger asChild>
          <Badge className="bg-accent/90 text-white font-bold px-3 py-1.5 flex items-center gap-1.5 cursor-pointer hover:bg-accent/80 transition-colors">
            <Icon name="Coins" size={16} />
            {userBoombucks} BBS
            <Icon name="Plus" size={14} className="ml-1" />
          </Badge>
        </DialogTrigger>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white"
          onClick={onAdminClick}
          title="Админ-панель"
        >
          <Icon name="Shield" size={24} />
        </Button>
      </div>
    </div>
  );
});

AppHeader.displayName = 'AppHeader';