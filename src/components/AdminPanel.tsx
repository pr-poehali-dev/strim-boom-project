import { memo, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Transaction } from './types';

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

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel = memo(({ onClose }: AdminPanelProps) => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([
    {
      id: '1',
      userId: 1,
      username: '@username',
      amount: 15000,
      method: 'card',
      methodDetails: '1234 5678 9012 3456',
      createdAt: new Date(Date.now() - 3600000),
      status: 'pending'
    },
    {
      id: '2',
      userId: 2,
      username: '@cyber_artist',
      amount: 25000,
      method: 'phone',
      methodDetails: '+79503994868',
      createdAt: new Date(Date.now() - 7200000),
      status: 'pending'
    }
  ]);

  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [buyUserId, setBuyUserId] = useState('');
  const [sellUserId, setSellUserId] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);

  const pendingRequests = withdrawalRequests.filter(r => r.status === 'pending');
  const processingRequests = withdrawalRequests.filter(r => r.status === 'processing');
  const completedRequests = withdrawalRequests.filter(r => r.status === 'completed');

  const handleApproveWithdrawal = useCallback((requestId: string) => {
    setWithdrawalRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'processing' as const } : r
    ));
  }, []);

  const handleCompleteWithdrawal = useCallback((requestId: string) => {
    setWithdrawalRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'completed' as const } : r
    ));
    setProcessDialogOpen(false);
    setSelectedRequest(null);
  }, []);

  const handleRejectWithdrawal = useCallback((requestId: string) => {
    setWithdrawalRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    ));
  }, []);

  const handleBuyBoombucks = useCallback(() => {
    console.log(`Admin buying ${buyAmount} BB for user ${buyUserId}`);
    setBuyAmount('');
    setBuyUserId('');
  }, [buyAmount, buyUserId]);

  const handleSellBoombucks = useCallback(() => {
    console.log(`Admin selling ${sellAmount} BB from user ${sellUserId}`);
    setSellAmount('');
    setSellUserId('');
  }, [sellAmount, sellUserId]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'processing': return 'RefreshCw';
      case 'completed': return 'CheckCircle';
      case 'rejected': return 'XCircle';
      default: return 'AlertCircle';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Icon name="Shield" className="text-purple-400" />
              Панель администратора
            </h1>
            <p className="text-muted-foreground">Управление выплатами и операциями с бумчиками</p>
          </div>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <Icon name="X" className="mr-2" size={16} />
            Выйти
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-yellow-500/10 border-yellow-500/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">На рассмотрении</p>
                <p className="text-3xl font-bold text-yellow-400">{pendingRequests.length}</p>
              </div>
              <Icon name="Clock" size={40} className="text-yellow-400" />
            </div>
          </Card>
          
          <Card className="bg-blue-500/10 border-blue-500/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">В обработке</p>
                <p className="text-3xl font-bold text-blue-400">{processingRequests.length}</p>
              </div>
              <Icon name="RefreshCw" size={40} className="text-blue-400" />
            </div>
          </Card>
          
          <Card className="bg-green-500/10 border-green-500/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Завершено</p>
                <p className="text-3xl font-bold text-green-400">{completedRequests.length}</p>
              </div>
              <Icon name="CheckCircle" size={40} className="text-green-400" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="withdrawals" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="withdrawals">Заявки на вывод</TabsTrigger>
            <TabsTrigger value="buy">Купить BB</TabsTrigger>
            <TabsTrigger value="sell">Продать BB</TabsTrigger>
          </TabsList>

          <TabsContent value="withdrawals" className="space-y-4">
            {withdrawalRequests.length === 0 ? (
              <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-8">
                <div className="text-center">
                  <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Нет заявок на вывод</p>
                </div>
              </Card>
            ) : (
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
                              onClick={() => {
                                setSelectedRequest(request);
                                setProcessDialogOpen(true);
                              }}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              <Icon name="Play" size={14} className="mr-1" />
                              Обработать
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectWithdrawal(request.id)}
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
                            onClick={() => handleCompleteWithdrawal(request.id)}
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
            )}
          </TabsContent>

          <TabsContent value="buy" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="ShoppingCart" className="text-green-400" />
                Купить бумчики у пользователя
              </h3>
              
              <div className="space-y-4">
                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <Icon name="Info" className="h-4 w-4 text-blue-400" />
                  <AlertDescription>
                    Эта операция добавит бумчики пользователю после оплаты
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>ID пользователя</Label>
                  <Input 
                    type="number"
                    placeholder="Введите ID пользователя"
                    value={buyUserId}
                    onChange={(e) => setBuyUserId(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Количество бумчиков</Label>
                  <Input 
                    type="number"
                    placeholder="Введите количество BB"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="bg-background/50"
                  />
                  <div className="flex gap-2">
                    {[100, 500, 1000, 5000].map(amount => (
                      <Button 
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setBuyAmount(amount.toString())}
                        className="flex-1"
                      >
                        {amount} BB
                      </Button>
                    ))}
                  </div>
                </div>

                {buyAmount && (
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Сумма к оплате:</span>
                      <span className="font-bold text-accent">₽{(parseInt(buyAmount) * 100).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Пользователь получит {buyAmount} BB после подтверждения
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleBuyBoombucks}
                  disabled={!buyAmount || !buyUserId}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  <Icon name="ShoppingCart" className="mr-2" size={16} />
                  Купить и начислить
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="TrendingDown" className="text-orange-400" />
                Продать бумчики пользователя
              </h3>
              
              <div className="space-y-4">
                <Alert className="bg-orange-500/10 border-orange-500/30">
                  <Icon name="AlertCircle" className="h-4 w-4 text-orange-400" />
                  <AlertDescription>
                    Эта операция спишет бумчики у пользователя (для возврата или корректировки)
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>ID пользователя</Label>
                  <Input 
                    type="number"
                    placeholder="Введите ID пользователя"
                    value={sellUserId}
                    onChange={(e) => setSellUserId(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Количество бумчиков</Label>
                  <Input 
                    type="number"
                    placeholder="Введите количество BB"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    className="bg-background/50"
                  />
                  <div className="flex gap-2">
                    {[100, 500, 1000, 5000].map(amount => (
                      <Button 
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setSellAmount(amount.toString())}
                        className="flex-1"
                      >
                        {amount} BB
                      </Button>
                    ))}
                  </div>
                </div>

                {sellAmount && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Будет списано:</span>
                      <span className="font-bold text-orange-400">{sellAmount} BB</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Используйте для возврата средств или корректировки баланса
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleSellBoombucks}
                  disabled={!sellAmount || !sellUserId}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <Icon name="TrendingDown" className="mr-2" size={16} />
                  Списать бумчики
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Icon name="Smartphone" className="text-blue-400" />
                Обработка выплаты
              </DialogTitle>
              <DialogDescription>
                Подтвердите перевод средств пользователю
              </DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-4 py-4">
                <div className="bg-background/50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Пользователь:</span>
                    <span className="font-bold text-white">{selectedRequest.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Сумма BB:</span>
                    <span className="font-bold text-accent">{selectedRequest.amount.toLocaleString()} BB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">К переводу:</span>
                    <span className="font-bold text-green-400">₽{(selectedRequest.amount * 100 * 0.7).toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Реквизиты:</p>
                    <p className="font-mono text-sm text-white">{selectedRequest.methodDetails}</p>
                  </div>
                </div>

                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <Icon name="Info" className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-sm">
                    После нажатия "Обработать" переведите средства по указанным реквизитам. Затем нажмите "Завершить" в списке заявок.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setProcessDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button 
                onClick={() => {
                  if (selectedRequest) {
                    handleApproveWithdrawal(selectedRequest.id);
                    setProcessDialogOpen(false);
                    setSelectedRequest(null);
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Icon name="Play" className="mr-2" size={16} />
                Обработать
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
});

AdminPanel.displayName = 'AdminPanel';
