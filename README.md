# Shop AI Manager

Система для інтернет-магазину одягу, що продає через Telegram. Покупець вибирає товар і оформлює замовлення в боті з доставкою Новою Поштою та оплатою через Monobank. Менеджер веде склад, замовлення й ТТН в адмін-панелі.

**Стадія:** pre-production, готовність 78% (7 з 9 пунктів Roadmap). Функціонал реалізовано й покрито e2e-тестами API. Ще не зроблено реліз на сервері й перевірку на живих ключах Нової Пошти та Monobank.

## Можливості

- **Telegram-бот** (grammY): каталог, диплінки з каналу (`?start=prod_<id>`), кошик, що зберігається в PostgreSQL, покроковий візард оформлення (ПІБ → телефон → місто й відділення Нової Пошти → підтвердження), посилання на оплату Monobank.
- **Склад і замовлення:** залишки списуються атомарно (`prisma.$transaction`), без продажу понад наявність. Переходи статусів контролюються, а при скасуванні залишки повертаються. Позиції замовлення зберігають знімок товару.
- **Нова Пошта:** пошук міст і відділень, створення ТТН (накладений платіж для неоплачених замовлень), трекінг.
- **Monobank:** рахунок на оплату, підтвердження через підписаний вебхук, повторна перевірка з адмінки.
- **Сповіщення:** нове замовлення надходить у чат менеджерів і в стрічку адмінки, покупець отримує повідомлення про зміну статусу.
- **Адмінка** (Next.js): дашборд, каталог і склад (варіанти колір/розмір, SKU), замовлення, аналітика, сповіщення, налаштування магазину в БД, зміна пароля зі скиданням сесій.

## Структура

```text
apps/
  api/      NestJS REST API: auth, products, inventory, orders, payments, nova-poshta, notifications, settings, telegram
  admin/    Next.js 14 (App Router), порт 3001
  bot/      Telegram-бот на grammY
  worker/   заготовка під фонові задачі, поки не використовується
packages/
  database/ Prisma-схема та клієнт (@shop-ai/database)
  types/    спільні типи
  ui/       спільні React-компоненти
  config/   спільні tsconfig
docker/     Dockerfile для api, admin, bot
```

Turborepo + pnpm workspaces. Моделі БД: `User`, `Category`, `Product`, `ProductVariant`, `Order`, `OrderItem`, `Notification`, `StoreSettings`, `Session`. Статуси замовлення: `PENDING → PAID → PROCESSING → SHIPPED → DELIVERED`, а також `CANCELLED`.

Докладніше про архітектуру: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Запуск локально

Потрібні Node.js 18+, pnpm 9 і Docker.

```bash
pnpm install
cp .env.example .env        # заповніть змінні
docker compose up -d postgres
pnpm db:generate && pnpm db:push
pnpm dev                    # api :4000, admin :3001, bot
```

`pnpm dev` збирає `@shop-ai/database` і `@shop-ai/types` та перезбирає їх при змінах. Якщо запускаєте один застосунок через `pnpm --filter`, спершу виконайте `pnpm --filter "./packages/*" build`.

### Змінні середовища

| Змінна | Призначення |
|---|---|
| `DATABASE_URL` | PostgreSQL |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_ID`, `TELEGRAM_CHANNEL_ID` | бот і канал |
| `TELEGRAM_MANAGER_CHAT_ID` | чат для сповіщень про нові замовлення (можна задати й у налаштуваннях) |
| `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | вхід в адмінку |
| `NEXT_PUBLIC_API_URL` | адреса API для адмінки (вбудовується під час збірки) |
| `NOVA_POSHTA_API_KEY`, `NOVA_POSHTA_SENDER_WAREHOUSE_REF`, `NOVA_POSHTA_DEFAULT_WEIGHT` | Нова Пошта |
| `MONOBANK_TOKEN`, `API_PUBLIC_URL` | оплата. Без них доступний лише накладений платіж |

Повний список є в [.env.example](.env.example).

## Перевірки

```bash
pnpm check-types
pnpm lint
pnpm build
TEST_DATABASE_URL=postgresql://user:password@localhost:5433/shop_ai_test pnpm test:e2e
```

E2E-тести піднімають справжній Nest-застосунок і працюють з окремою базою, яку очищають, тому в її назві має бути `test`. Telegram, Нова Пошта й Monobank у тестах замінено заглушками. CI (`.github/workflows/ci.yml`) запускає ці самі перевірки.

## Розгортання

```bash
docker compose up -d postgres
docker compose run --rm api pnpm db:push
docker compose up -d --build
```

Секрети беруться з `.env`. Адреса API для адмінки задається під час збірки:
`NEXT_PUBLIC_API_URL=https://api.example.com docker compose build admin`.

## Що залишилось

- Розгорнути на сервері та перевірити на живих ключах: одна тестова ТТН і одна тестова оплата Monobank.
- `apps/worker` поки лише заготовка, а публікацію в канал і AI-асистента ще не доведено до кінця.
- Роль `MANAGER` описана в схемі, але ніде не використовується.
