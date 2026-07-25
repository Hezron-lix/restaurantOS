# 🍽️ Smart Restaurant Management System (Restaurant OS)

> A production-grade SaaS operating system designed to solve real operational bottlenecks inside restaurants through synchronized workflows, real-time coordination, and AI-powered operational insights. Built for the **Smart Restaurant Management System Hackathon**.

---

## 🌟 Product Vision & Architecture

Unlike traditional customer-facing food delivery applications, **Restaurant OS** targets the core operational complexities of modern dine-in and hybrid restaurant operations. By bridging communication between floor staff, kitchen teams, managers, and customers, the platform delivers instantaneous synchronization across all stakeholders.

### Core Modules Supported
- 📱 **QR Menu & Live Menu Availability**: Instantaneous digital menu rendering with real-time dish out-of-stock updates driven by kitchen workflows.
- 📅 **Reservation Management & Table Allocation**: Intelligent guest seating and turnaround predictability.
- ⚡ **Real-time Order Synchronization**: Immediate routing of orders from guest tables and servers directly to specialized kitchen stations.
- 🍳 **Kitchen Display System (KDS)**: Optimized cooking ticket management, preparation timers, and dietary restriction flagging.
- 🧑‍🍳 **Waiter Coordination Console**: Automated alerting for ready-to-serve orders, table assistance calls, and dynamic task routing.
- 💳 **Cashier Billing & POS Terminal**: Rapid checkout, bill split calculations, and integrated receipt generation.
- 📊 **Manager Executive Analytics**: Granular performance tracking of table turnover, peak hours, menu engineering metrics, and revenue velocity.
- 🤖 **AI-Powered Operational Assistant**: Data-driven managerial insights predicting inventory replenishment, staffing requirements, and bottleneck identification.

---

## 🏗️ Technical Stack

This project follows enterprise SaaS engineering standards, structured around modern performance, maintainability, and developer experience best practices:

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Actions, React React Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) in strict mode
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS Design System
- **UI Architecture**: [shadcn/ui](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- **Animation & Transitions**: [Framer Motion](https://www.framer.com/motion/) for responsive micro-interactions
- **State & Data Fetching**: [TanStack Query (v5)](https://tanstack.com/query/latest) for declarative asynchronous state & cache management
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) integrated with [Zod](https://zod.dev/) schemas
- **Backend & Realtime Engine**: [Supabase](https://supabase.com/) (PostgreSQL, Realtime WebSockets, Authentication, Storage, Edge Functions)
- **Code Quality & Linting**: [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

---

## 📁 Repository Directory Structure

The project strictly embraces modular separation of concerns and maintainability across scalable multi-tenant architecture:

```text
├── .github/          # CI/CD pipelines, issue templates, and workflow automations
├── app/              # Next.js App Router root layouts, pages, API routes, and error boundaries
├── components/       # Domain and atomic UI components (modular, accessible, reusable)
│   └── ui/           # shadcn/ui generic primitive design components
├── docs/             # Technical architectural specifications and onboarding documentation
├── hooks/            # Reusable custom React hooks and local state logic
├── lib/              # Client utilities, stateless helpers, formatting, and design system tokens
├── public/           # Static media assets, icons, logos, and manifest files
├── services/         # Encapsulated backend integration layers, queries, and external APIs
├── supabase/         # Database migration schemas, seed data, edge functions, and local DB configs
├── types/            # Centralized TypeScript interface contracts and robust Zod schema models
├── .env.example      # Sample production-safe environment variable mapping
└── README.md         # Primary project architecture reference (this document)
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
Ensure your development environment is provisioned with:
- **Node.js** v20+ or newer
- **npm**, **pnpm**, or **bun** package manager
- Git configuration and SSH/HTTPS repository access

### 2. Initial Setup
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd restaurant-os
   ```
2. **Install project dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Credentials:**
   Copy the provided example variable document to establish local config:
   ```bash
   cp .env.example .env.local
   ```
   *Modify `.env.local` to incorporate your corresponding Supabase instance secrets and API endpoints.*

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   Access the system via `http://localhost:3000`.

---

## 📚 Technical Documentation & Specifications

Comprehensive architectural specifications are actively developed in Phase 0.5 within the [`docs/`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs) directory:
- [`PROJECT.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/PROJECT.md): Executive summary, scope, goals, and role definitions.
- [`ARCHITECTURE.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/ARCHITECTURE.md): Multi-layer system design, boundary decoupling, and real-time topology.
- [`DATABASE.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/DATABASE.md): PostgreSQL relational schemas, row-level security (RLS), and indexing strategies.
- [`API.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/API.md): Endpoint routing, payload formats, error hierarchies, and real-time channels.
- [`WORKFLOWS.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/WORKFLOWS.md): Cross-role sequence transitions and transactional lifecycle modeling.
- [`UI_GUIDELINES.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/UI_GUIDELINES.md): Component styling architecture, aesthetic mandates, and interaction principles.
- [`DEVELOPMENT.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/DEVELOPMENT.md): Contribution protocols, git workflows, testing standards, and review checklists.
- [`AI.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/AI.md): Generative AI integrations, prompt engineering models, and predictive operational insights.
- [`DEMO.md`](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/DEMO.md): Hackathon evaluation walkthrough and deterministic presentation scripting.

---

## ⚖️ License
This project is proprietary and built specifically for the Smart Restaurant Management System Hackathon. All rights reserved.
