# Technical Guidelines, Critical Boundaries & Roadmap

## 1. Critical System Boundaries (Do Not Violate)
- **Database Schema Isolation**: All Prisma schema edits **MUST** take place in `packages/database/prisma/schema.prisma`. Never add a local `prisma/` folder in `apps/api` or `apps/bot`.
- **No Direct Heavy Tasks in API**: Never execute long-running loops, LLM calls, or mass Telegram broadcasts inside synchronous HTTP controllers in `apps/api`. Always dispatch them to `apps/worker` queues.
- **Bot Decoupling**: `apps/bot` must remain a lightweight UI layer. All business logic validations (stock availability, pricing, discounts) must be executed by API services.
- **Mandatory Completion Verification (No Errors Rule)**: Agent MUST NOT present final output or consider a task done until all console, build, runtime, and TypeScript errors (`npx pnpm check-types`) are 100% fixed and the functionality is fully verified to work.

## 2. Technical Standards
- **Language**: 100% Strict TypeScript (`strict: true`).
- **Package Management**: `pnpm` workspaces + `turbo` for build orchestration.
- **Data Validation**: Strict input validation using `class-validator` DTOs on all API boundaries.
- **Environment Configuration**: Multi-environment secrets managed via `.env` files (never commit `.env` or sensitive API tokens to git).

## 3. Future Architecture Roadmap
1. **Multi-Tenancy Layer**: Introduce `Store` / `Organization` model in `@shop-ai/database` to support multi-tenant SaaS separation.
2. **Shared API Client Package (`packages/api-client`)**: Provide auto-generated typed SDK for `apps/admin` and `apps/bot`.
3. **Payments & Shipping Adapters**: Modular integration adapters for Stripe, Monobank, and delivery services.
