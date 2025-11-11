import { memo, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Notification } from './types';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationCenter = memo(({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll
}: NotificationCenterProps) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ad_request': return 'Megaphone';
      case 'ad_approved': return 'CheckCircle';
      case 'ad_rejected': return 'XCircle';
      case 'ad_live': return 'Radio';
      case 'payment_received': return 'Coins';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'ad_request': return 'text-blue-400';
      case 'ad_approved': return 'text-green-400';
      case 'ad_rejected': return 'text-red-400';
      case 'ad_live': return 'text-green-400';
      case 'payment_received': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const handleNotificationClick = useCallback((notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  }, [onMarkAsRead]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white">
          <Icon name="Bell" size={24} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30 max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Bell" className="text-accent" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-500/20 text-red-400 ml-auto">
                {unreadCount} new
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Stay updated with your ad campaigns and earnings
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 py-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onMarkAllAsRead}
              className="flex-1"
            >
              <Icon name="CheckCheck" size={14} className="mr-1" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClearAll}
              className="flex-1"
            >
              <Icon name="Trash2" size={14} className="mr-1" />
              Clear all
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map(notification => (
              <Card 
                key={notification.id}
                className={`p-3 cursor-pointer transition-all hover:border-accent/50 ${
                  notification.read 
                    ? 'bg-card/30 opacity-60' 
                    : 'bg-card/50 border-accent/30'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                    <Icon name={getNotificationIcon(notification.type)} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-white text-sm">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Clock" size={10} />
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

NotificationCenter.displayName = 'NotificationCenter';
