#!/usr/bin/env node

const API_URL = 'https://functions.poehali.dev/c17a5ef7-015a-48f6-9679-2e3a240bcee7';
const USER_ID = 1;

// Цветной вывод
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function testPurchase(currency, amount, description) {
  console.log(`\n${colors.cyan}🧪 Тест: Покупка через ${currency}${colors.reset}`);
  console.log(`   Сумма: ${amount} BBS`);
  console.log(`   Описание: ${description}`);
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: USER_ID,
        type: 'buy',
        amount: amount,
        currency: currency,
        description: description
      })
    });
    
    const data = await response.json();
    const duration = Date.now() - startTime;
    
    if (response.ok) {
      console.log(`   ${colors.green}✅ Успешно${colors.reset} (${duration}ms)`);
      console.log(`   Transaction ID: ${data.transaction.id}`);
      console.log(`   Status: ${data.transaction.status}`);
      return true;
    } else {
      console.log(`   ${colors.red}❌ Ошибка${colors.reset}: ${data.error}`);
      return false;
    }
  } catch (error) {
    console.log(`   ${colors.red}❌ Ошибка сети${colors.reset}: ${error.message}`);
    return false;
  }
}

async function loadTransactionHistory() {
  console.log(`\n${colors.blue}📜 Загрузка истории транзакций...${colors.reset}`);
  
  try {
    const response = await fetch(`${API_URL}?user_id=${USER_ID}`);
    const data = await response.json();
    
    console.log(`   ${colors.green}✅ Загружено${colors.reset}: ${data.transactions.length} транзакций`);
    console.log('\n   Последние 5 транзакций:');
    
    data.transactions.slice(0, 5).forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.type} | ${t.amount} BBS | ${t.currency || 'N/A'} | ${t.description}`);
    });
    
    return data.transactions;
  } catch (error) {
    console.log(`   ${colors.red}❌ Ошибка${colors.reset}: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log(`${colors.yellow}╔═══════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.yellow}║  🧪 ТЕСТ ВСЕХ СПОСОБОВ ПОКУПКИ BBS           ║${colors.reset}`);
  console.log(`${colors.yellow}╚═══════════════════════════════════════════════╝${colors.reset}`);
  
  // Тесты покупок
  const tests = [
    {
      currency: 'RUB',
      amount: 5,
      desc: 'Покупка 5 BBS за ₽500 (Прямая оплата рублями)'
    },
    {
      currency: 'USDT',
      amount: 10,
      desc: 'Покупка 10 BBS за ~10.5 USDT через TON Network (UQCuFtQ2...)'
    },
    {
      currency: 'PHONE',
      amount: 3,
      desc: 'Покупка 3 BBS за ₽300 через СБП +79503994868 (Сбербанк/Озон)'
    },
    {
      currency: 'MEMECOIN',
      amount: 8,
      desc: 'Покупка 8 BBS за 80 мемкоинов (курс 10 MC = 1 BBS)'
    },
    {
      currency: 'RUB',
      amount: 20,
      desc: 'Покупка 20 BBS за ₽2000 (Крупная сумма в рублях)'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testPurchase(test.currency, test.amount, test.desc);
    if (result) passed++;
    else failed++;
    
    // Задержка между тестами
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Загружаем историю
  await loadTransactionHistory();

  // Итоги
  console.log(`\n${colors.yellow}╔═══════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.yellow}║  📊 ИТОГИ ТЕСТИРОВАНИЯ                        ║${colors.reset}`);
  console.log(`${colors.yellow}╚═══════════════════════════════════════════════╝${colors.reset}`);
  console.log(`   Всего тестов: ${tests.length}`);
  console.log(`   ${colors.green}✅ Успешно: ${passed}${colors.reset}`);
  console.log(`   ${colors.red}❌ Провалено: ${failed}${colors.reset}`);
  console.log(`   Процент успеха: ${Math.round(passed / tests.length * 100)}%`);
  
  if (failed === 0) {
    console.log(`\n${colors.green}🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! Все способы покупки работают корректно.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}⚠️  ЕСТЬ ПРОБЛЕМЫ. Проверьте ошибки выше.${colors.reset}`);
  }
}

main().catch(console.error);
