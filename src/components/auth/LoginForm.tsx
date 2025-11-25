import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSuccess: (user: any) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onSuccess, onSwitchToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  console.log('LoginForm rendered, loading:', loading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await authAPI.login(email, password);
      
      console.log('Login result:', result);
      
      if (result.error) {
        toast({
          title: 'Ошибка входа',
          description: result.error,
          variant: 'destructive'
        });
        return;
      }
      
      if (!result.user || !result.token) {
        toast({
          title: 'Ошибка',
          description: 'Неверный формат ответа сервера',
          variant: 'destructive'
        });
        return;
      }

      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      toast({
        title: 'Успешно!',
        description: `Добро пожаловать, ${result.user.username}!`
      });
      
      onSuccess(result.user);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось войти. Проверьте данные.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/10 backdrop-blur-xl rounded-2xl border-2 border-primary/30 shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Вход в Stream-Boom</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={loading}
            autoComplete="email"
            className="bg-white/20 border-2 border-white/40 text-white placeholder:text-white/60 h-12 focus:border-primary focus:bg-white/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-white">Пароль</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            autoComplete="current-password"
            className="bg-white/20 border-2 border-white/40 text-white placeholder:text-white/60 h-12 focus:border-primary focus:bg-white/30"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-lg shadow-lg shadow-primary/50 transition-all" 
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToRegister}
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          Нет аккаунта? Зарегистрироваться
        </button>
      </div>
    </div>
  );
};