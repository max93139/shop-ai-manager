# Shop AI Manager 🛍️🤖

Монорепозиторій системи управління автоматизованим магазином одягу з підтримкою Telegram-бота, NestJS REST API бекенду та Next.js панелі адміністрування.

## 🏗️ Архітектура монорепозиторію

Використовується **Turborepo** + **pnpm workspaces**.

```text
shop-ai-manager/
├── apps/
│   ├── admin/       # Next.js 14 App Router (Панель адміністрування)
│   ├── api/         # NestJS REST API (Бекенд та сервіси)
│   └── bot/         # Telegram Bot на грамві (grammY)
├── packages/
│   ├── config/      # Спільні TSConfig конфігурації
│   ├── types/       # Спільні TypeScript типи та інтерфейси
│   └── ui/          # Спільна бібліотека UI компонентів (React)
├── prisma/          # Схема бази даних Prisma ORM
└── docker/          # Dockerfile для кожного сервісу
```

## 🚀 Швидкий старт

### Вимоги:
- Node.js >= 18.x
- pnpm >= 9.x
- Docker & Docker Compose

### Кроки для локального запуску:

1. **Встановлення залежностей**:
   ```bash
   pnpm install
   ```

2. **Генерація та накатування схеми бази даних Prisma**:
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

3. **Запуск у режимі розробки (усі сервіси паралельно)**:
   ```bash
   pnpm dev
   ```

4. **Збірка усіх додатків**:
   ```bash
   pnpm build
   ```

5. **Запуск через Docker Compose**:
   ```bash
   docker-compose up --build
   ```

## 🛠️ Стек технологій
- **Пакетний менеджер & Монорепозиторій**: pnpm 9, Turborepo
- **База даних**: PostgreSQL, Prisma ORM
- **Backend API**: NestJS, TypeScript
- **Telegram Bot**: grammY
- **Frontend Admin**: Next.js 14 (App Router), React, TailwindCSS
# shop-ai-manager
