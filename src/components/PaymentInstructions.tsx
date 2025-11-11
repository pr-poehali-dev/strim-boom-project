import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const PaymentInstructions = memo(() => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
        >
          <Icon name="HelpCircle" className="mr-2" size={16} />
          Как подключить ЮMoney?
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Wallet" className="text-yellow-400" />
            Инструкция по подключению ЮMoney
          </DialogTitle>
          <DialogDescription>
            Пошаговое руководство для интеграции ЮMoney в приложение
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Alert className="bg-blue-500/10 border-blue-500/30">
            <Icon name="Info" className="h-4 w-4 text-blue-400" />
            <AlertDescription>
              <strong>Что такое ЮMoney?</strong> Российский сервис электронных платежей. Позволяет принимать оплату картами, через кошелёк ЮMoney, СБП и другие способы.
            </AlertDescription>
          </Alert>

          <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="FileText" className="text-accent" />
              Шаг 1: Регистрация в ЮMoney
            </h3>
            <ol className="space-y-3 list-decimal list-inside text-sm text-muted-foreground">
              <li>Перейдите на <a href="https://yoomoney.ru" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">yoomoney.ru</a></li>
              <li>Нажмите "Регистрация" и заполните форму</li>
              <li>Подтвердите email и номер телефона</li>
              <li>Пройдите идентификацию (потребуется паспорт)</li>
            </ol>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="Settings" className="text-accent" />
              Шаг 2: Получение API ключей
            </h3>
            <ol className="space-y-3 list-decimal list-inside text-sm text-muted-foreground">
              <li>Войдите в личный кабинет ЮMoney</li>
              <li>Перейдите в раздел "Настройки" → "Приложения"</li>
              <li>Нажмите "Создать приложение"</li>
              <li>Выберите тип "Веб-сервис"</li>
              <li>Укажите:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Название: "StreamBoom"</li>
                  <li>Redirect URI: ваш домен + /payment/callback</li>
                  <li>Права доступа: payment-shop, account-info</li>
                </ul>
              </li>
              <li>Сохраните Client ID и Client Secret</li>
            </ol>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="Code" className="text-accent" />
              Шаг 3: Интеграция в код
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-2">1. Создайте backend функцию для обработки платежей:</p>
                <div className="bg-background/50 p-3 rounded font-mono text-xs">
                  <span className="text-purple-400">/backend/</span>
                  <span className="text-green-400">yoomoney-payment</span>
                  <span className="text-purple-400">/index.ts</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">2. Установите SDK:</p>
                <div className="bg-background/50 p-3 rounded font-mono text-xs text-white">
                  npm install yoomoney-sdk
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">3. Добавьте секреты в проект:</p>
                <ul className="list-disc list-inside text-xs text-muted-foreground ml-4 space-y-1">
                  <li>YOOMONEY_CLIENT_ID - ваш Client ID</li>
                  <li>YOOMONEY_CLIENT_SECRET - ваш Client Secret</li>
                  <li>YOOMONEY_WALLET - номер вашего кошелька</li>
                </ul>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">4. Пример кода:</p>
                <div className="bg-background/50 p-3 rounded font-mono text-xs overflow-x-auto">
                  <pre className="text-white">{`import { YooMoney } from 'yoomoney-sdk';

const ym = new YooMoney({
  clientId: process.env.YOOMONEY_CLIENT_ID,
  clientSecret: process.env.YOOMONEY_CLIENT_SECRET
});

// Создание платежа
const payment = await ym.createPayment({
  amount: 100.00,
  currency: 'RUB',
  description: '1 Boombuck',
  returnUrl: 'https://your-site.com/success'
});

return payment.confirmation.confirmationUrl;`}</pre>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="Webhook" className="text-accent" />
              Шаг 4: Настройка уведомлений (webhooks)
            </h3>
            <ol className="space-y-3 list-decimal list-inside text-sm text-muted-foreground">
              <li>В настройках приложения ЮMoney найдите "HTTP-уведомления"</li>
              <li>Укажите URL: https://ваш-домен.com/api/yoomoney/webhook</li>
              <li>Создайте backend функцию для обработки webhook</li>
              <li>При успешной оплате начисляйте Boombucks пользователю</li>
            </ol>
          </Card>

          <Alert className="bg-green-500/10 border-green-500/30">
            <Icon name="CheckCircle" className="h-4 w-4 text-green-400" />
            <AlertDescription>
              <strong>Готово!</strong> После настройки пользователи смогут оплачивать через ЮMoney. Комиссия сервиса: 2-5% от суммы платежа.
            </AlertDescription>
          </Alert>

          <Card className="bg-orange-500/10 border-orange-500/30 p-4">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <Icon name="AlertCircle" className="text-orange-400" />
              Важные моменты
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                <span>Храните API ключи в секретах проекта, никогда в коде</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                <span>Проверяйте подпись webhook для безопасности</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                <span>Тестируйте платежи в тестовом режиме ЮMoney</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                <span>Логируйте все транзакции для отладки</span>
              </li>
            </ul>
          </Card>

          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Icon name="Link" className="text-blue-400" />
              Полезные ссылки
            </h4>
            <div className="space-y-1 text-sm">
              <a 
                href="https://yoomoney.ru/docs/payment-buttons/getting-started" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline block"
              >
                → Официальная документация ЮMoney
              </a>
              <a 
                href="https://yoomoney.ru/docs/wallet/using-api/forms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline block"
              >
                → Формы приёма платежей
              </a>
              <a 
                href="https://yoomoney.ru/page?id=536884" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline block"
              >
                → Тарифы и комиссии
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

PaymentInstructions.displayName = 'PaymentInstructions';
