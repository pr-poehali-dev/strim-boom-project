import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { authAPI, uploadAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername: string;
  currentAvatar: string;
  userEmail: string;
}

export const EditProfileDialog = ({ open, onOpenChange, currentUsername, currentAvatar, userEmail }: EditProfileDialogProps) => {
  const [username, setUsername] = useState(currentUsername);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!username.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Имя пользователя не может быть пустым',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await authAPI.updateProfile(userEmail, username, avatarUrl);
      
      if (result.error) {
        toast({
          title: 'Ошибка',
          description: result.error,
          variant: 'destructive'
        });
        return;
      }

      localStorage.setItem('user', JSON.stringify(result.user));
      
      toast({
        title: 'Успешно!',
        description: 'Профиль обновлен'
      });
      
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, выберите изображение',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Ошибка',
        description: 'Файл слишком большой. Максимум 5 МБ',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    try {
      const result = await uploadAPI.uploadImage(file);
      setAvatarUrl(result.url);
      toast({
        title: 'Успешно!',
        description: 'Изображение загружено'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить изображение',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-lg border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="UserCog" size={24} />
            Редактировать профиль
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{username[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || loading}
                className="gap-2"
              >
                {uploading ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Icon name="Upload" size={16} />
                    Загрузить фото
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={generateRandomAvatar}
                disabled={uploading || loading}
                className="gap-2"
              >
                <Icon name="Shuffle" size={16} />
                Случайный
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Имя пользователя</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@username"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL аватара (необязательно)</label>
            <Input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Icon name="Save" size={16} />
                Сохранить
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};