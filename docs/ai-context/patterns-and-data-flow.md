# Architectural Patterns & Data Flow Guidelines

## 1. Core Architectural Patterns

### A. Modular Monolith
- Every business domain is encapsulated in an isolated NestJS module.
- Cross-module communication occurs strictly through exported Services or Domain Events, avoiding tight database coupling.

### B. Shared Workspace Database Package (`@shop-ai/database`)
- Encapsulates `schema.prisma`, migrations, and client generation.
- Prevents database access fragmentation across monorepo apps (`apps/api`, `apps/bot`, `apps/worker`).

### C. Adapter & Strategy Pattern for External Services
- **AI Providers**: Abstracted behind an `AiService` interface allowing seamless switching between OpenAI, Anthropic, and Gemini models.
- **Telegram Bot / Channel Publisher**: Separates interaction logic (grammY handlers) from core business logic (Order Service, Product Service).

### D. Producer-Consumer Queue Pattern (BullMQ + Redis)
- Time-consuming or rate-limited operations (Telegram rate limits: 30 msgs/sec, LLM latency: 3-10s) must be produced as background jobs by `apps/api` and consumed by `apps/worker`.

### E. Audit & Compliance Logging
- Crucial state changes (order status changes, manual price/stock overrides, settings updates) are recorded in an `AuditLog` table for security compliance.

---

## 2. End-to-End Data Flow Examples

### Flow A: Product Creation & AI Channel Publishing
1. **Admin Panel (`apps/admin`)**: User submits a new product via Next.js dashboard.
2. **API (`apps/api`)**: `ProductsController` validates DTO and calls `ProductsService.create()`.
3. **Database**: `@shop-ai/database` persists product record.
4. **Queue Dispatch**: `ProductsService` enqueues a `GENERATE_AI_POST` job to Redis.
5. **Worker Processing (`apps/worker`)**:
   - Fetches product details.
   - Calls AI Adapter to generate promotional text.
   - Formats media and posts to Telegram Channel via Telegram Bot API adhering to rate limits.

### Flow B: Telegram Shopping Bot Order
1. **Telegram User (`apps/bot`)**: Interacts with grammY bot, selects product variant, and presses "Checkout".
2. **Bot Handler**: Delegates order creation request to `apps/api` (or shared domain service).
3. **API Processing**: `OrdersService` checks inventory stock, creates `PENDING` order, and reserves stock.
4. **Notification**: Dispatches order confirmation to buyer via Telegram and notifies store managers via Admin panel / Worker.
