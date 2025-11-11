import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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

interface ProcessWithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: WithdrawalRequest | null;
  onApprove: (requestId: string) => void;
}

export const ProcessWithdrawalDialog = memo(({
  open,
  onOpenChange,
  selectedRequest,
  onApprove
}: ProcessWithdrawalDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <span className="text-sm text-muted-foreground">Сумма BBS:</span>
                <span className="font-bold text-accent">{selectedRequest.amount.toLocaleString()} BBS</span>
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
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button 
            onClick={() => {
              if (selectedRequest) {
                onApprove(selectedRequest.id);
                onOpenChange(false);
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
  );
});

ProcessWithdrawalDialog.displayName = 'ProcessWithdrawalDialog';