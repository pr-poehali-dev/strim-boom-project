# Настройка платёжных систем StreamBoom

## Текущие способы оплаты

### ✅ Реализовано

1. **Рубли (RUB)** - Прямая покупка, ₽100 = 1 BB
2. **USDT (TON)** - Криптовалюта через TON Network
   - Кошелёк: `UQCuFtQ2uMdPVRdhgEO_sOHhHwXZxXEG0anj-U0BRElk0zOk`
3. **Оплата по номеру телефона** - СБП (Сбербанк, Озон Банк)
   - Номер: `+79503994868`
4. **Мемкоин** - Обмен мемкоина на Boombucks
   - Курс: 100 мемкоинов = 1 BB

### 🚧 Требуется настройка

5. **ЮMoney (YooMoney)** - Российский платёжный сервис

---

## Как подключить ЮMoney

### Шаг 1: Регистрация и получение API ключей

1. Зарегистрируйтесь на [yoomoney.ru](https://yoomoney.ru)
2. Пройдите идентификацию (нужен паспорт)
3. Перейдите в "Настройки" → "Приложения"
4. Создайте приложение типа "Веб-сервис"
5. Сохраните:
   - `Client ID`
   - `Client Secret`
   - `Wallet ID` (номер кошелька)

### Шаг 2: Добавление секретов в проект

В интерфейсе poehali.dev:
1. Откройте проект
2. Перейдите в "Секреты"
3. Добавьте:
   ```
   YOOMONEY_CLIENT_ID = ваш_client_id
   YOOMONEY_CLIENT_SECRET = ваш_client_secret
   YOOMONEY_WALLET = ваш_номер_кошелька
   ```

### Шаг 3: Создание backend функции

Создайте файл `/backend/yoomoney-payment/index.ts`:

```typescript
import axios from 'axios';

export const handler = async (event: any, context: any) => {
  const { httpMethod, body } = event;
  
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }
  
  if (httpMethod === 'POST') {
    const { amount, userId } = JSON.parse(body);
    
    // Создание платежа в ЮMoney
    const payment = await axios.post('https://yoomoney.ru/api/request-payment', {
      pattern_id: 'p2p',
      to: process.env.YOOMONEY_WALLET,
      amount: amount,
      message: `Покупка Boombucks для пользователя ${userId}`,
      label: `user_${userId}_${Date.now()}`
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.YOOMONEY_CLIENT_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        paymentUrl: payment.data.request_id,
        paymentId: payment.data.request_id
      })
    };
  }
  
  return { statusCode: 405, body: 'Method not allowed' };
};
```

Создайте `/backend/yoomoney-payment/package.json`:

```json
{
  "name": "yoomoney-payment",
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

Создайте `/backend/yoomoney-payment/tests.json`:

```json
{
  "tests": [
    {
      "name": "Create payment",
      "method": "POST",
      "body": {
        "amount": 100,
        "userId": 1
      },
      "expectedStatus": 200
    }
  ]
}
```

### Шаг 4: Webhook для проверки оплаты

Создайте `/backend/yoomoney-webhook/index.ts`:

```typescript
export const handler = async (event: any, context: any) => {
  const { body } = event;
  const notification = JSON.parse(body);
  
  // Проверка подписи
  const { sha1_hash, notification_type, operation_id, amount, currency, datetime, sender, codepro, label } = notification;
  
  // Здесь добавьте логику проверки подписи и начисления Boombucks
  
  if (notification_type === 'p2p-incoming' && codepro === 'false') {
    // Извлекаем userId из label
    const userId = label.split('_')[1];
    const boombucks = Math.floor(parseFloat(amount) / 100);
    
    // Здесь нужно начислить BB пользователю через базу данных
    // await addBoombucksToUser(userId, boombucks);
    
    return {
      statusCode: 200,
      body: 'OK'
    };
  }
  
  return { statusCode: 400, body: 'Invalid notification' };
};
```

### Шаг 5: Обновление фронтенда

В `src/pages/Index.tsx` добавьте обработчик для ЮMoney:

```typescript
const handleYooMoneyPayment = async () => {
  const response = await fetch('YOUR_BACKEND_URL/yoomoney-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: parseFloat(buyAmount) * 100,
      userId: currentUserId
    })
  });
  
  const data = await response.json();
  window.open(data.paymentUrl, '_blank');
};
```

### Шаг 6: Настройка уведомлений в ЮMoney

1. Войдите в настройки приложения ЮMoney
2. Найдите "HTTP-уведомления"
3. Укажите URL: `https://ваш-домен.com/api/yoomoney-webhook`
4. Сохраните настройки

---

## Тестирование

### Тестовый режим ЮMoney

1. Используйте тестовый токен из документации
2. Тестовые платежи не списывают реальные деньги
3. Проверьте работу webhook на тестовых данных

### Важно

- 🔒 Никогда не храните API ключи в коде
- ✅ Всегда проверяйте подпись webhook
- 📝 Логируйте все транзакции
- 💰 Комиссия ЮMoney: 2-5% от суммы

---

## Полезные ссылки

- [Документация ЮMoney API](https://yoomoney.ru/docs/wallet/using-api/forms)
- [Тарифы ЮMoney](https://yoomoney.ru/page?id=536884)
- [Примеры интеграции](https://github.com/yoomoney)

---

## Поддержка

Если возникли вопросы:
1. Проверьте логи в poehali.dev → Логи → backend/yoomoney-payment
2. Убедитесь что секреты добавлены корректно
3. Проверьте настройки webhook в ЮMoney
