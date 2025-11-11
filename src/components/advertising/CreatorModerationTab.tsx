import { memo, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AdCampaign } from '../types';

interface CreatorModerationTabProps {
  campaigns: AdCampaign[];
  onApprove: (campaignId: string) => void;
  onReject: (campaignId: string, reason: string) => void;
  currentUserId: number;
}

export const CreatorModerationTab = memo(({
  campaigns,
  onApprove,
  onReject,
  currentUserId
}: CreatorModerationTabProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const myCampaigns = campaigns.filter(c => c.creatorId === currentUserId);
  const pendingCampaigns = myCampaigns.filter(c => c.status === 'pending');
  const approvedCampaigns = myCampaigns.filter(c => c.status === 'approved' || c.status === 'live');
  const rejectedCampaigns = myCampaigns.filter(c => c.status === 'rejected');

  const handleApprove = useCallback((campaign: AdCampaign) => {
    onApprove(campaign.id);
  }, [onApprove]);

  const handleRejectClick = useCallback((campaign: AdCampaign) => {
    setSelectedCampaign(campaign);
    setRejectDialogOpen(true);
  }, []);

  const handleRejectConfirm = useCallback(() => {
    if (selectedCampaign && rejectionReason) {
      onReject(selectedCampaign.id, rejectionReason);
      setRejectDialogOpen(false);
      setSelectedCampaign(null);
      setRejectionReason('');
    }
  }, [selectedCampaign, rejectionReason, onReject]);

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

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Icon name="ShieldCheck" className="text-accent" />
              Ad Moderation
            </h3>
            <p className="text-sm text-muted-foreground">Review and approve ad requests</p>
          </div>
          <div className="flex gap-3">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              {pendingCampaigns.length} Pending
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {approvedCampaigns.length} Active
            </Badge>
          </div>
        </div>
      </Card>

      {pendingCampaigns.length === 0 && approvedCampaigns.length === 0 && rejectedCampaigns.length === 0 ? (
        <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-8">
          <div className="text-center">
            <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No ad requests yet</h3>
            <p className="text-muted-foreground">
              Brands will see your ad pricing and can order ads from you
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingCampaigns.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Icon name="Clock" className="text-yellow-400" />
                Pending Review ({pendingCampaigns.length})
              </h4>
              {pendingCampaigns.map(campaign => (
                <Card key={campaign.id} className="bg-card/50 backdrop-blur-lg border-yellow-500/30 p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary">
                          <AvatarFallback>{campaign.brandName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-white">{campaign.brandName}</h4>
                          <p className="text-xs text-muted-foreground">{formatDate(campaign.createdAt)}</p>
                        </div>
                      </div>
                      <Badge className="bg-accent/20 text-accent text-lg px-3 py-1">
                        <Icon name="Coins" size={16} className="mr-1" />
                        {campaign.price} BBS
                      </Badge>
                    </div>

                    <div className="bg-background/50 p-3 rounded-lg">
                      <p className="text-sm text-white">{campaign.adContent}</p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={12} />
                        {campaign.duration}s ad
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApprove(campaign)}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        <Icon name="CheckCircle" className="mr-2" size={16} />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleRejectClick(campaign)}
                        variant="outline"
                        className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Icon name="XCircle" className="mr-2" size={16} />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {approvedCampaigns.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Icon name="CheckCircle" className="text-green-400" />
                Active Campaigns ({approvedCampaigns.length})
              </h4>
              {approvedCampaigns.map(campaign => (
                <Card key={campaign.id} className="bg-card/50 backdrop-blur-lg border-green-500/30 p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary">
                          <AvatarFallback>{campaign.brandName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{campaign.brandName}</h4>
                          <p className="text-xs text-muted-foreground">{formatDate(campaign.createdAt)}</p>
                        </div>
                      </div>
                      <Badge className={campaign.status === 'live' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}>
                        <Icon name={campaign.status === 'live' ? 'Radio' : 'Clock'} size={12} className="mr-1" />
                        {campaign.status === 'live' ? 'Live' : 'Approved'}
                      </Badge>
                    </div>

                    <div className="bg-background/50 p-3 rounded-lg">
                      <p className="text-sm text-white">{campaign.adContent}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Icon name="Clock" size={12} />
                        {campaign.duration}s duration
                      </span>
                      <span className="text-accent font-bold flex items-center gap-1">
                        <Icon name="Coins" size={12} />
                        Earned {campaign.price} BB
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {rejectedCampaigns.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Icon name="XCircle" className="text-red-400" />
                Rejected ({rejectedCampaigns.length})
              </h4>
              {rejectedCampaigns.map(campaign => (
                <Card key={campaign.id} className="bg-card/50 backdrop-blur-lg border-red-500/30 p-4 opacity-60">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary">
                          <AvatarFallback>{campaign.brandName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-white">{campaign.brandName}</h4>
                          <p className="text-xs text-muted-foreground">{formatDate(campaign.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                    {campaign.rejectionReason && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-xs text-red-400">
                        <strong>Reason:</strong> {campaign.rejectionReason}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Icon name="XCircle" className="text-red-400" />
              Reject Ad Request
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this ad
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedCampaign && (
              <div className="bg-background/50 p-3 rounded-lg">
                <p className="text-sm font-bold text-white mb-1">{selectedCampaign.brandName}</p>
                <p className="text-xs text-muted-foreground">{selectedCampaign.adContent}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea 
                placeholder="Explain why this ad doesn't fit your content..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-background/50 min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Brand will receive this explanation along with refund
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRejectConfirm}
              disabled={!rejectionReason}
              className="bg-red-500 hover:bg-red-600"
            >
              <Icon name="XCircle" className="mr-2" size={16} />
              Reject & Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

CreatorModerationTab.displayName = 'CreatorModerationTab';