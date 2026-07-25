# 🍽️ RestaurantOS: Smart Restaurant Management System

> An innovative, AI-powered Restaurant Operating System built for the **Smart Restaurant Management System Hackathon**. Designed to eradicate traditional back-of-house bottlenecks through real-time multi-role synchronization and proactive AI operational intelligence.

---

## 🌟 Product Vision & Scope Philosophy

Unlike consumer food delivery apps or monolithic enterprise ERPs, **RestaurantOS** optimizes strictly for **Demo-First Operational Excellence** within a single restaurant operational environment. By uniting customers, waiters, kitchen chefs, cashiers, and restaurant executives onto a synchronized sub-100ms feedback loop, RestaurantOS transforms reactive restaurant management into intelligent, predictive execution.

---

## 🏛️ Immutable Architecture & Technical Specifications

This project strictly binds feature implementation to our authoritative set of immutable architectural engineering contracts documented inside the [`docs/`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs) directory:

- [`PROJECT.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/PROJECT.md) — Product vision, problem statement, single-restaurant scope, goals, and user roles.
- [`ARCHITECTURE.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/ARCHITECTURE.md) — Next.js 15 App Router hybrid rendering, React Server Actions, and Supabase Realtime WebSocket topology.
- [`DATABASE.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/DATABASE.md) — Strict 3NF relational schema covering the 12 essential operational tables, cent-based integer currency pricing, and Row-Level Security (RLS) enforcement.
- [`API.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/API.md) — RPC over REST architecture, Server Action domain boundaries, and unified Zod runtime error validation envelopes.
- [`WORKFLOWS.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/WORKFLOWS.md) — Complete 10-step demo journey and deterministic Finite State Machines (FSMs) for tables and order tickets.
- [`UI_GUIDELINES.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/UI_GUIDELINES.md) — Codified inviolable **UI Rule** reserving visual identity to user direction, target hardware viewports, and Framer Motion interaction standards.
- [`DEVELOPMENT.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/DEVELOPMENT.md) — SOLID & DRY engineering governance, strict TypeScript rules, TanStack Query optimistic updates, and Git conventional commit rules.
- [`AI.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/AI.md) — High-impact operational AI focused exclusively on predictive inventory depletion and manager demand analytics (no generic conversational chatbots).
- [`DEMO.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/DEMO.md) — Deterministic 5-minute live hackathon presentation script evaluating all five dining roles without fake delays or mocked data.
- [`PRODUCT_DECISIONS.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/PRODUCT_DECISIONS.md) — Comprehensive Architectural Decision Records (ADRs), lean tradeoff justifications, and future multi-tenant escalation strategies.

---

## 🏗️ Modern SaaS Directory Architecture

The repository enforces clean domain decoupling across production standard directories:

```text
├── .github/          # CI/CD workflows, automation scripts, and issue templates
├── actions/          # Domain-isolated Next.js 15 React Server Actions (Orders, KDS, Billing)
├── app/              # Next.js App Router layout layouts, root viewports, and API webhooks
├── components/       # Domain interface component assemblies and atomic shadcn/ui elements
│   └── ui/           # Generic baseline shadcn/ui design primitives
├── config/           # Centralized system configurations, FSM enums, and operational constants
├── docs/             # Immutable engineering contracts and system specification blueprints
├── hooks/            # Reusable declarative client hooks for TanStack Query & real-time sockets
├── lib/              # Client utilities, class merging (`cn`), and stateless calculation helpers
├── public/           # Static media assets, branding icons, and web app manifest files
├── services/         # Encapsulated Supabase PostgreSQL query builders and AI wrappers
├── supabase/         # Database migrations, seed scripts, edge helpers, and auth policies
├── types/            # Strict TypeScript interfaces reflecting relational database entities
├── validations/      # Runtime Zod validation boundaries shared across forms and server actions
├── .env.example      # Sample production credentials and AI key configuration template
└── README.md         # Primary engineering overview reference (this document)
```

---

## 🚀 Quickstart & Development Workflow

### Prerequisites
- Node.js v20+ and npm / pnpm / bun.
- Supabase account with configured PostgreSQL project credentials.

### Installation
1. **Clone & Install Dependencies:**
   ```bash
   git clone <repository-url>
   cd restaurant-os
   npm install
   ```
2. **Configure Environment Secrets:**
   ```bash
   cp .env.example .env.local
   ```
   *Populate `.env.local` with corresponding Supabase database URLs and AI keys.*

3. **Verify Linter & Start Development Server:**
   ```bash
   npm run lint
   npm run dev
   ```
   Open `http://localhost:3000` to inspect application status. Note: Feature page layouts remain unconstructed pending authoritative visual design instructions.

---

## ⚖️ License
Proprietary engineering blueprint developed for the Smart Restaurant Management System Hackathon. All rights reserved.
