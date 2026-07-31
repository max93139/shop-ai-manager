# System Architecture Documentation

Welcome to the **Shop AI Manager** architectural documentation.

For detailed AI and developer context, refer to the following guides:

- 📐 [Overview & System Topology](file:///Users/mac/Desktop/projects/shop-ai-manager/docs/ai-context/overview.md)
- ⚙️ [Backend NestJS Architecture](file:///Users/mac/Desktop/projects/shop-ai-manager/docs/ai-context/backend.md)
- 🧩 [Architectural Patterns & Data Flows](file:///Users/mac/Desktop/projects/shop-ai-manager/docs/ai-context/patterns-and-data-flow.md)
- 🛡️ [Technical Guidelines & Boundaries](file:///Users/mac/Desktop/projects/shop-ai-manager/docs/ai-context/technical-guidelines.md)

---

## High-Level System Overview

```mermaid
graph TD
    subgraph Frontend Applications
        AdminPanel["Admin Dashboard (apps/admin - Next.js)"]
        TgBot["Telegram Shopping Bot (apps/bot - grammY)"]
    end

    subgraph Backend Microservices
        ApiServer["API Service (apps/api - NestJS)"]
        AsyncWorker["Background Worker (apps/worker - BullMQ)"]
    end

    subgraph Shared Monorepo Packages
        DBPackage["@shop-ai/database (Prisma ORM)"]
        TypesPackage["@shop-ai/types"]
        UIPackage["@shop-ai/ui"]
        ConfigPackage["@shop-ai/config"]
    end

    subgraph Infrastructure
        Postgres[(PostgreSQL 16)]
        Redis[(Redis 7)]
    end

    AdminPanel --> ApiServer
    TgBot --> ApiServer
    ApiServer --> Redis
    Redis --> AsyncWorker

    ApiServer --> DBPackage
    AsyncWorker --> DBPackage
    DBPackage --> Postgres
```
