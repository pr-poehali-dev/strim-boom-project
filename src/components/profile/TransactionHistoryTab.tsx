import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '../types';

interface TransactionHistoryTabProps {
  transactions: Transaction[];
}

export const TransactionHistoryTab = memo(({
  transactions
}: TransactionHistoryTabProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Icon name="History" className="text-accent" />
        Transaction History
      </h3>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
            <p>No transactions yet</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="bg-background/50 p-4 rounded-lg flex items-center justify-between hover:bg-background/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                  transaction.type === 'withdraw' ? 'bg-orange-500/20 text-orange-400' :
                  transaction.type === 'donation_sent' ? 'bg-red-500/20 text-red-400' :
                  transaction.type === 'donation_received' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  <Icon 
                    name={
                      transaction.type === 'buy' ? 'ShoppingCart' :
                      transaction.type === 'withdraw' ? 'Banknote' :
                      transaction.type === 'donation_sent' ? 'ArrowUpRight' :
                      transaction.type === 'donation_received' ? 'ArrowDownLeft' :
                      'Megaphone'
                    } 
                    size={20} 
                  />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {transaction.type === 'buy' && 'Purchase'}
                    {transaction.type === 'withdraw' && 'Withdrawal'}
                    {transaction.type === 'donation_sent' && 'Donation Sent'}
                    {transaction.type === 'donation_received' && 'Donation Received'}
                    {transaction.type === 'ad_purchase' && 'Ad Payment'}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.date.toLocaleDateString()} {transaction.date.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold flex items-center gap-1 ${
                  transaction.type === 'buy' || transaction.type === 'donation_received' 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {(transaction.type === 'buy' || transaction.type === 'donation_received') && '+'}
                  {(transaction.type === 'withdraw' || transaction.type === 'donation_sent' || transaction.type === 'ad_purchase') && '-'}
                  <Icon name="Coins" size={16} />
                  {transaction.amount} BBS
                </p>
                <Badge 
                  variant="outline" 
                  className={
                    transaction.status === 'completed' 
                      ? 'border-green-500/50 text-green-400 text-xs' 
                      : transaction.status === 'pending'
                      ? 'border-orange-500/50 text-orange-400 text-xs'
                      : 'border-red-500/50 text-red-400 text-xs'
                  }
                >
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
});

TransactionHistoryTab.displayName = 'TransactionHistoryTab';