import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AdCampaign } from '../types';

interface CampaignsTabProps {
  campaigns: AdCampaign[];
}

export const CampaignsTab = memo(({ campaigns }: CampaignsTabProps) => {
  const getStatusColor = (status: AdCampaign['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'live': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: AdCampaign['status']) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'approved': return 'CheckCircle';
      case 'live': return 'Radio';
      case 'rejected': return 'XCircle';
      default: return 'AlertCircle';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {campaigns.length === 0 ? (
        <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-8">
          <div className="text-center">
            <Icon name="Megaphone" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by ordering your first ad from the "Find Creators" tab
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <Card key={campaign.id} className="bg-card/50 backdrop-blur-lg border-primary/30 p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarFallback>{campaign.creatorUsername[1]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white">{campaign.brandName}</h3>
                      <p className="text-sm text-muted-foreground">with {campaign.creatorUsername}</p>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      <Icon name={getStatusIcon(campaign.status)} size={12} className="mr-1" />
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </div>

                  <p className="text-sm text-white bg-background/30 p-3 rounded">
                    {campaign.adContent}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      {campaign.duration}s duration
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Coins" size={12} />
                      {campaign.price} BBS
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={12} />
                      {formatDate(campaign.createdAt)}
                    </span>
                  </div>

                  {campaign.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                      >
                        <Icon name="MessageCircle" size={14} className="mr-1" />
                        Contact Creator
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-400 hover:text-red-300"
                      >
                        <Icon name="Trash2" size={14} className="mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}

                  {campaign.status === 'live' && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded p-2 text-xs text-green-400 flex items-center gap-2">
                      <Icon name="Radio" size={14} />
                      <span>Your ad is now live and being shown to viewers!</span>
                    </div>
                  )}

                  {campaign.status === 'rejected' && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-xs text-red-400 flex items-center gap-2">
                      <Icon name="XCircle" size={14} />
                      <span>Ad rejected. Funds have been refunded to your account.</span>
                    </div>
                  )}

                  {campaign.status === 'approved' && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 text-xs text-blue-400 flex items-center gap-2">
                      <Icon name="CheckCircle" size={14} />
                      <span>Ad approved! Will go live soon.</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-4">
        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
          <Icon name="Info" className="text-blue-400" />
          Campaign Status Guide
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <Icon name="Clock" size={10} className="mr-1" />
              Pending
            </Badge>
            <span className="text-muted-foreground">Awaiting creator review</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Icon name="CheckCircle" size={10} className="mr-1" />
              Approved
            </Badge>
            <span className="text-muted-foreground">Creator approved, preparing to launch</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Icon name="Radio" size={10} className="mr-1" />
              Live
            </Badge>
            <span className="text-muted-foreground">Ad is actively showing to viewers</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <Icon name="XCircle" size={10} className="mr-1" />
              Rejected
            </Badge>
            <span className="text-muted-foreground">Ad rejected, funds refunded</span>
          </div>
        </div>
      </Card>
    </div>
  );
});

CampaignsTab.displayName = 'CampaignsTab';