import { memo, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WithdrawalRequestsList } from '@/components/admin/WithdrawalRequestsList';
import { BuyBoombucksTab } from '@/components/admin/BuyBoombucksTab';
import { SellBoombucksTab } from '@/components/admin/SellBoombucksTab';
import { ProcessWithdrawalDialog } from '@/components/admin/ProcessWithdrawalDialog';

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

  const handleProcessRequest = useCallback((request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setProcessDialogOpen(true);
  }, []);

  const handleApproveAndClose = useCallback((requestId: string) => {
    handleApproveWithdrawal(requestId);
    setSelectedRequest(null);
  }, [handleApproveWithdrawal]);

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
            <TabsTrigger value="buy">Купить BBS</TabsTrigger>
            <TabsTrigger value="sell">Продать BBS</TabsTrigger>
          </TabsList>

          <TabsContent value="withdrawals" className="space-y-4">
            <WithdrawalRequestsList
              withdrawalRequests={withdrawalRequests}
              onProcess={handleProcessRequest}
              onReject={handleRejectWithdrawal}
              onComplete={handleCompleteWithdrawal}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          </TabsContent>

          <TabsContent value="buy" className="space-y-4">
            <BuyBoombucksTab
              buyAmount={buyAmount}
              setBuyAmount={setBuyAmount}
              buyUserId={buyUserId}
              setBuyUserId={setBuyUserId}
              onBuyBoombucks={handleBuyBoombucks}
            />
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <SellBoombucksTab
              sellAmount={sellAmount}
              setSellAmount={setSellAmount}
              sellUserId={sellUserId}
              setSellUserId={setSellUserId}
              onSellBoombucks={handleSellBoombucks}
            />
          </TabsContent>
        </Tabs>

        <ProcessWithdrawalDialog
          open={processDialogOpen}
          onOpenChange={setProcessDialogOpen}
          selectedRequest={selectedRequest}
          onApprove={handleApproveAndClose}
        />
      </div>
    </div>
  );
});

AdminPanel.displayName = 'AdminPanel';