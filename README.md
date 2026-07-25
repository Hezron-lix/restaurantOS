# 🍽️ RestaurantOS: Smart Restaurant Management System

> An innovative, AI-powered Restaurant Operating System built for the **Smart Restaurant Management System Hackathon**. Designed to eradicate traditional back-of-house bottlenecks through real-time multi-role synchronization and proactive AI operational intelligence.

---

## 🌟 Product Vision & Scope Philosophy

Unlike consumer food delivery apps or monolithic enterprise ERPs, **RestaurantOS** optimizes strictly for **Demo-First Operational Excellence** within a single restaurant operational environment. By uniting customers, waiters, kitchen chefs, cashiers, and restaurant executives onto a synchronized sub-100ms feedback loop, RestaurantOS transforms reactive restaurant management into intelligent, predictive execution.

---

## 🏛️ Immutable Architecture & Technical Specifications

This project strictly binds feature implementation to our authoritative set of immutable architectural engineering contracts documented inside the [`docs/`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs) directory:

- [`PROJECT.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/PROJECT.md) — Product vision, problem statement, single-restaurant scope, goals, role personas, and Sprint 1-8 roadmap.
- [`ARCHITECTURE.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/ARCHITECTURE.md) — Next.js 15 App Router hybrid rendering, React Server Actions, and Supabase Realtime WebSocket topology.
- [`DATABASE.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/DATABASE.md) — Strict 3NF relational schema covering the 12 essential operational tables, realistic `seed.ts` demo strategy, integer cent monetary representation, and RLS policies.
- [`API.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/API.md) — RPC over REST architecture, Server Action domain boundaries, programmatic demo reset hooks, and Zod error envelopes.
- [`WORKFLOWS.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/WORKFLOWS.md) — Complete 10-step demo journey and deterministic Finite State Machines (FSMs) for tables and order tickets.
- [`UI_GUIDELINES.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/UI_GUIDELINES.md) — Codified inviolable **UI Rule** reserving visual identity to user direction, target hardware viewports, and Framer Motion interaction standards.
- [`DEVELOPMENT.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/DEVELOPMENT.md) — Mandatory skeleton loading/empty/error states, SOLID & DRY engineering governance, strict TypeScript rules, and sprint delivery protocols.
- [`AI.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/AI.md) — High-impact operational AI focused exclusively on predictive inventory depletion and manager demand analytics, fortified by deterministic local statistical fallbacks.
- [`DEMO.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/DEMO.md) — Deterministic 5-minute live hackathon presentation timeline and `npm run demo:reset` restoration mechanics.
- [`PRESENTATION.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/PRESENTATION.md) — Concise, professional 5-minute spoken presenter script, stage choreography, and judging defense cheat sheet.
- [`PRODUCT_DECISIONS.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/PRODUCT_DECISIONS.md) — Comprehensive Architectural Decision Records (ADRs 001–008), lean tradeoff justifications, and future escalation strategies.

---

## 🏗️ Sprint-Based Milestone Roadmap

To ensure peak stability, development proceeds systematically across 8 self-contained Sprints. Each sprint guarantees a clean, compilable, and demonstrable application checkpoint:

```text
Sprint 1: Project setup, Database, Authentication, and Role permissions (Current Next Step)
Sprint 2: Live Menu queries, Table occupancy modeling, and Reservation queues
Sprint 3: Realtime Customer Ordering and collaborative table session tokens
Sprint 4: Kitchen Display System (KDS), preparation cooking timers, and stock toggles
Sprint 5: Waiter Coordination Console and automated sub-100ms alert feeds
Sprint 6: Cashier POS Checkout, cent-based taxation, and settlement clearing
Sprint 7: Executive Manager Analytics, revenue velocity charts, and turnover KPIs
Sprint 8: Operational AI Insights Engine with deterministic fallback algorithms
```

---

## 🚀 Quickstart & One-Command Demo Reset

### Prerequisites
- Node.js v20+ and npm / pnpm / bun.
- Supabase account with configured PostgreSQL project credentials.

### Initial Configuration & Installation
1. **Clone & Install Dependencies:**
   ```bash
   git clone <repository-url>
   cd restaurant-os
   npm install
   ```
2. **Configure Environment Credentials:**
   ```bash
   cp .env.example .env.local
   ```
   *Populate `.env.local` with corresponding Supabase database URLs and AI keys.*

### One-Command Demo Environment Recovery
To immediately re-initialize all 12 database tables with realistic, high-fidelity dine-in demo accounts, active menu catalogs, and inventory warning triggers in under 2 seconds, run:
```bash
npm run demo:reset
```

### Launch Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to inspect application status. Note: Per our strict UI Rule, feature page layouts remain unconstructed pending explicit visual design guidance.

---

## ⚖️ License
Proprietary engineering blueprint developed for the Smart Restaurant Management System Hackathon. All rights reserved.
