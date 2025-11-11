import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { streamsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CreateStreamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  onSuccess?: () => void;
}

export const CreateStreamDialog = ({ open, onOpenChange, userId, onSuccess }: CreateStreamDialogProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Другое');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const categories = ['Игры', 'Музыка', 'Технологии', 'Творчество', 'Разработка', 'Спорт', 'Кулинария', 'Наука', 'Образование', 'Другое'];

  const handleCreate = async () => {
    if (!title) {
      toast({
        title: 'Ошибка',
        description: 'Введите название стрима',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await streamsAPI.create(userId, title, category, description);
      
      if (result.error) {
        toast({
          title: 'Ошибка',
          description: result.error,
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Стрим создан!',
        description: 'Ваш стрим начался'
      });

      setTitle('');
      setCategory('Другое');
      setDescription('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать стрим',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Создать стрим</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Название стрима</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Мой крутой стрим..."
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Категория</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-background border rounded-md"
              disabled={loading}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Описание (необязательно)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Расскажите о вашем стриме..."
              className="w-full px-3 py-2 bg-background border rounded-md min-h-[100px]"
              disabled={loading}
            />
          </div>

          <Button onClick={handleCreate} className="w-full" disabled={loading}>
            {loading ? 'Создание...' : 'Начать стрим'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
