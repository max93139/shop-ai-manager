# Frontend Architecture & Next.js Admin Panel

## 1. Architectural Overview
The frontend architecture is built around **Next.js 14 (App Router)** in `apps/admin` and a shared component design system in `packages/ui` (`@shop-ai/ui`).

- **App Location**: [`apps/admin`](file:///Users/mac/Desktop/projects/shop-ai-manager/apps/admin)
- **Shared UI Package**: [`packages/ui`](file:///Users/mac/Desktop/projects/shop-ai-manager/packages/ui) (`@shop-ai/ui`)
- **Shared Types**: [`packages/types`](file:///Users/mac/Desktop/projects/shop-ai-manager/packages/types) (`@shop-ai/types`)

---

## 2. Directory Structure (`apps/admin/src`)

```
apps/admin/src/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── (auth)/           # Authentication routes (login, register)
│   ├── (dashboard)/      # Protected Admin Dashboard routes
│   │   ├── products/     # Product Catalog management
│   │   ├── orders/       # Order management & CRM
│   │   ├── channels/     # Telegram Channel Publisher & Post Scheduler
│   │   ├── ai-assistant/ # AI Content Generator & Settings
│   │   └── settings/     # Store & Payment settings
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing / Redirect page
├── components/           # Admin-specific page widgets and layouts
│   ├── layout/           # Sidebar, Header, User Menu
│   ├── products/         # Product tables, SKU forms, Image uploaders
│   ├── orders/           # Order status Kanban board & details modal
│   └── ai/               # AI Prompt generator modal & Channel preview
├── services/             # Type-safe API client & HTTP fetchers to apps/api
├── hooks/                # Custom React hooks (data fetching, state, UI)
├── store/                # Client state management (React Context / Zustand / Redux)
└── lib/                  # Shared utilities, formatters, and constants
```

---

## 3. Core Frontend Patterns

### A. Server Components vs Client Components
- **React Server Components (RSC)**: Used by default for initial page loads, layout composition, and SEO/performance.
- **Client Components (`'use client'`)**: Used for interactive forms, modals, tables with filtering, and real-time updates.

### B. Shared Component Design System (`packages/ui`)
- Generic reusable UI primitives (Buttons, Inputs, Modals, Badges, Data Tables) live in `packages/ui`.
- Business-logic components live in `apps/admin/src/components/`.

### C. Type Safety & API Communication
- All API requests to NestJS (`apps/api`) consume shared DTO interfaces from `@shop-ai/types`.
- Environment variable `NEXT_PUBLIC_API_URL` configures the backend base URL (Port `4000`).

### D. Form Validation & Data Handling
- Form handling via `react-hook-form` and schema validation using `zod`.
- Data fetching and caching via TanStack Query (React Query) or SWR for automatic revalidation.

---

## 4. Key UI Modules & Workflows

1. **Catalog & Product Management**:
   - Data tables with pagination, sorting, and multi-select actions.
   - Variant manager (sizes, colors, prices, stock levels).
   - "Generate AI Description" button calling backend AI service.

2. **Order Management & CRM**:
   - Order pipeline (`PENDING` -> `PAID` -> `SHIPPED` -> `DELIVERED`).
   - Customer profile drawer linking Telegram accounts and purchase history.

3. **Telegram Channel Publisher**:
   - Post scheduler interface with live Telegram message preview.
   - Auto-generate channel posts using store product data and AI prompts.
