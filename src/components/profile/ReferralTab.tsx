import { memo, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Referral } from '../types';

interface ReferralTabProps {
  referrals: Referral[];
  userId: number;
  totalReferralEarnings: number;
  referralCode: string;
}

export const ReferralTab = memo(({ referrals, userId, totalReferralEarnings, referralCode }: ReferralTabProps) => {
  const [copied, setCopied] = useState(false);

  const referralLink = `https://streamboom.app/ref/${referralCode || userId}`;

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [referralLink]);

  const qualifiedReferrals = referrals.filter(r => r.status === 'rewarded').length;
  const pendingReferrals = referrals.filter(r => r.status === 'pending' || r.status === 'qualified').length;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: Referral['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'qualified': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'rewarded': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: Referral['status']) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'qualified': return 'CheckCircle';
      case 'rewarded': return 'Coins';
      default: return 'AlertCircle';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Icon name="Users" className="text-accent" />
                Referral Program
              </h3>
              <p className="text-sm text-muted-foreground">Invite friends and earn Boombucks</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-2xl font-bold text-accent flex items-center gap-1 justify-end">
                <Icon name="Coins" size={24} />
                {totalReferralEarnings} BBS
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="UserCheck" size={16} className="text-green-400" />
                <span className="text-sm text-muted-foreground">Qualified</span>
              </div>
              <p className="text-2xl font-bold text-white">{qualifiedReferrals}</p>
            </div>
            <div className="bg-background/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Clock" size={16} className="text-yellow-400" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <p className="text-2xl font-bold text-white">{pendingReferrals}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-lg border-accent/30 p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-accent/20 p-2 rounded-lg">
              <Icon name="Gift" size={24} className="text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">How it works</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                  <span>Share your unique referral link</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                  <span>Friend registers and buys 3+ Boombucks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                  <span>You get 1 Boombuck reward instantly!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
          <Icon name="Link" className="text-accent" />
          Your Referral Link
        </h4>
        <div className="flex gap-2">
          <Input 
            value={referralLink}
            readOnly
            className="bg-background/50 font-mono text-sm"
          />
          <Button 
            onClick={handleCopyLink}
            className="bg-accent hover:bg-accent/90 flex-shrink-0"
          >
            {copied ? (
              <>
                <Icon name="Check" className="mr-2" size={16} />
                Copied!
              </>
            ) : (
              <>
                <Icon name="Copy" className="mr-2" size={16} />
                Copy
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Share this link on social media, with friends, or anywhere!
        </p>
      </Card>

      <Alert className="bg-blue-500/10 border-blue-500/30">
        <Icon name="Info" className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-sm">
          <strong>Reward Conditions:</strong> Your friend must purchase at least 3 Boombucks for you to receive the 1 BB reward. Pending referrals will automatically convert to rewards once they qualify.
        </AlertDescription>
      </Alert>

      {referrals.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
          <h4 className="font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="History" className="text-accent" />
            Referral History
          </h4>
          <div className="space-y-3">
            {referrals.map(referral => (
              <div 
                key={referral.id}
                className="bg-background/50 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <Icon name="User" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{referral.referredUsername}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={10} />
                        {formatDate(referral.createdAt)}
                      </span>
                      {referral.status === 'rewarded' && (
                        <span className="flex items-center gap-1 text-accent">
                          <Icon name="Coins" size={10} />
                          +{referral.rewardEarned} BBS
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(referral.status)}>
                  <Icon name={getStatusIcon(referral.status)} size={12} className="mr-1" />
                  {referral.status === 'pending' && `${referral.purchaseAmount}/3 BBS`}
                  {referral.status === 'qualified' && 'Qualified'}
                  {referral.status === 'rewarded' && 'Rewarded'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {referrals.length === 0 && (
        <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-8">
          <div className="text-center">
            <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No referrals yet</h3>
            <p className="text-muted-foreground mb-4">
              Start inviting friends and earn Boombucks!
            </p>
            <Button 
              onClick={handleCopyLink}
              className="bg-accent hover:bg-accent/90"
            >
              <Icon name="Share2" className="mr-2" size={16} />
              Share Referral Link
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
});

ReferralTab.displayName = 'ReferralTab';