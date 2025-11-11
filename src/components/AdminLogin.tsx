import { memo, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = memo(({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_EMAIL = 'Vladimirvvsa752@gmail.com';
  const ADMIN_PASSWORD = 'Vladimir,Tamara,Danila,Horinsk';

  const handleLogin = useCallback(() => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onLogin();
      setError('');
    } else {
      setError('Неверный email или пароль');
    }
  }, [email, password, onLogin]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }, [handleLogin]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4">
      <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6 max-w-md w-full">
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-500/20 p-4 rounded-full">
                <Icon name="Shield" size={48} className="text-purple-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Вход в админ-панель</h2>
            <p className="text-sm text-muted-foreground">Введите данные администратора</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                placeholder="admin@streamboom.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Пароль</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-background/50 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                </Button>
              </div>
            </div>

            {error && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <Icon name="AlertCircle" className="h-4 w-4 text-red-400" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleLogin}
              disabled={!email || !password}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              <Icon name="LogIn" className="mr-2" size={16} />
              Войти
            </Button>
          </div>

          <div className="bg-background/30 p-3 rounded-lg text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <Icon name="ShieldCheck" size={14} className="text-green-400" />
              <span>Доступ только для администраторов</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Lock" size={14} className="text-blue-400" />
              <span>Защищенное соединение</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});

AdminLogin.displayName = 'AdminLogin';