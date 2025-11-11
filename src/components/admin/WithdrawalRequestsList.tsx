import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WithdrawalRequest {
  id: string;
  userId: number;
  username: string;
  amount: number;
  method: string;
  methodDetails: string;
  createdAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
}

interface WithdrawalRequestsListProps {
  withdrawalRequests: WithdrawalRequest[];
  onProcess: (request: WithdrawalRequest) => void;
  onReject: (requestId: string) => void;
  onComplete: (requestId: string) => void;
  formatDate: (date: Date) => string;
  getStatusColor: (status: WithdrawalRequest['status']) => string;
  getStatusIcon: (status: WithdrawalRequest['status']) => string;
}

export const WithdrawalRequestsList = memo(({
  withdrawalRequests,
  onProcess,
  onReject,
  onComplete,
  formatDate,
  getStatusColor,
  getStatusIcon
}: WithdrawalRequestsListProps) => {
  if (withdrawalRequests.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-8">
        <div className="text-center">
          <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Нет заявок на вывод</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {withdrawalRequests.map(request => (
        <Card key={request.id} className="bg-card/50 backdrop-blur-lg border-primary/30 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">{request.username}</h4>
                  <p className="text-xs text-muted-foreground">ID: {request.userId}</p>
                </div>
                <Badge className={getStatusColor(request.status)}>
                  <Icon name={getStatusIcon(request.status)} size={12} className="mr-1" />
                  {request.status === 'pending' && 'Ожидает'}
                  {request.status === 'processing' && 'Обрабатывается'}
                  {request.status === 'completed' && 'Завершено'}
                  {request.status === 'rejected' && 'Отклонено'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-background/50 p-3 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Сумма</p>
                  <p className="font-bold text-white flex items-center gap-1">
                    <Icon name="Coins" size={14} className="text-accent" />
                    {request.amount.toLocaleString()} BB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ≈ ₽{(request.amount * 100 * 0.7).toLocaleString()}
                  </p>
                </div>

                <div className="bg-background/50 p-3 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Метод вывода</p>
                  <p className="font-bold text-white">
                    {request.method === 'card' && 'Банковская карта'}
                    {request.method === 'phone' && 'Номер телефона'}
                    {request.method === 'crypto' && 'USDT'}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {request.methodDetails}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="Calendar" size={12} />
                {formatDate(request.createdAt)}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {request.status === 'pending' && (
                <>
                  <Button 
                    size="sm"
                    onClick={() => onProcess(request)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Icon name="Play" size={14} className="mr-1" />
                    Обработать
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => onReject(request.id)}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Icon name="X" size={14} className="mr-1" />
                    Отклонить
                  </Button>
                </>
              )}
              {request.status === 'processing' && (
                <Button 
                  size="sm"
                  onClick={() => onComplete(request.id)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Icon name="CheckCircle" size={14} className="mr-1" />
                  Завершить
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
});

WithdrawalRequestsList.displayName = 'WithdrawalRequestsList';
