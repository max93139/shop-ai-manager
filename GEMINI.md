# Gemini & Agent CLI Instructions

This project follows a modular monorepo architecture with a clear separation of apps (`apps/`), shared packages (`packages/`), NestJS domain modules, and an async queue worker (`apps/worker`).

Before introducing major code or architectural changes, refer to the `ai-context` documentation:

- 📌 [Overview & Architecture Graph](file:///Users/mac/Desktop/projects/shop-ai-manager/docs/ai-context/overview.md)
- ⚙️ [Backend & NestJS Modules](file:///Users/mac/Desktop/projects/shop-ai-manager/docs/ai-context/backend.md)
- 🧩 [Patterns & Data Flow](file:///Users/mac/Desktop/projects/shop-ai-manager/docs/ai-context/patterns-and-data-flow.md)
- 🛡️ [Technical Guidelines & Boundaries](file:///Users/mac/Desktop/projects/shop-ai-manager/docs/ai-context/technical-guidelines.md)

## Core Architectural Rules
1. **Database Schema**: All Prisma models reside in `@shop-ai/database` (`packages/database/prisma/schema.prisma`). Never create local Prisma schemas in apps.
2. **Backend Structure**: All API endpoints belong to NestJS domain modules in `apps/api/src/modules/`.
3. **Background Tasks**: Heavy tasks (AI generation, Telegram channel broadcasts, notifications) must be enqueued via Redis/BullMQ to `apps/worker`.
4. **Type Safety**: Use TypeScript (`strict: true`) and shared packages (`@shop-ai/types`, `@shop-ai/database`).
