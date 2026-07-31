# Backend Architecture & NestJS Module Design

## 1. Modular Monolith Pattern
The NestJS backend (`apps/api`) strictly follows a **Modular Monolith** pattern. All features are encapsulated within domain-specific NestJS modules under `apps/api/src/modules/`:

- **Auth Module (`auth/`)**: JWT authentication, Refresh token rotation, password hashing, and RBAC Guards.
- **Users Module (`users/`)**: Store managers, staff accounts, role management.
- **Products Module (`products/`)**: Product catalog, variants (SKUs, sizes, colors), categories, and media.
- **Inventory Module (`inventory/`)**: Stock management, warehouse reservations, low-stock alerts.
- **Orders Module (`orders/`)**: Checkout state machine (`PENDING` -> `PAID` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED` -> `CANCELLED`).
- **Telegram Module (`telegram/`)**: Bot webhook handlers, deep linking, Telegram auth verification.
- **AI Module (`ai/`)**: AI prompt orchestration, product description generation, automated customer response generation.
- **Notifications Module (`notifications/`)**: Push notifications, Telegram alerts, email dispatching.
- **Settings Module (`settings/`)**: Store configuration, payment gateway keys, currency settings.

## 2. Request & Execution Lifecycle
Every HTTP request follows a deterministic processing pipeline:
1. **Guards**: Authentication (`JwtAuthGuard`) and Throttling (`ThrottlerGuard`).
2. **Pipes**: Data validation and transformation using `ValidationPipe` (`class-validator` & `class-transformer`).
3. **Controller**: Endpoint handler routing the request to the corresponding domain service.
4. **Service**: Executes business rules, interacts with `@shop-ai/database`, or dispatches heavy tasks to Redis queue.
5. **Exception Filters**: Standardized JSON error response formatting (`HttpExceptionFilter`).

## 3. Database Layer (`@shop-ai/database`)
- Database interactions use **Prisma ORM** encapsulated inside `packages/database`.
- Neither `apps/api` nor `apps/bot` defines raw Prisma schemas — both import `@shop-ai/database`.
- Centralized migrations ensure schema consistency across environments.

## 4. Asynchronous Queue Processing (`apps/worker`)
To prevent HTTP request blocking:
- Long-running operations (AI LLM generation, Telegram channel publishing, media processing) are enqueued to **Redis / BullMQ**.
- `apps/worker` consumes queue events independently from the API server.
