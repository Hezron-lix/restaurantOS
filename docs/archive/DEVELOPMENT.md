# 💻 RestaurantOS: Engineering Standards & Development Protocol
**Code Quality Governance & Contribution Guide (Immutable Contract)**

---

## 1. Engineering Ethics & SOLID Governance

To guarantee that RestaurantOS feels like a production-ready software product maintained over multi-year lifecycles, all feature code must strictly adhere to foundational engineering architecture rules:

- **Single Responsibility Principle (SRP)**: Modules serve exactly one purpose. React components solely format and render interfaces; custom hooks handle interactivity; Server Actions execute transactions; and domain services encapsulate database logic.
- **Open/Closed Principle (OCP)**: Architect service layers and component parameters to be extensible without mutating existing stable abstractions.
- **Don't Repeat Yourself (DRY)**: Absolutely zero duplicated logic or hardcoded strings across files. Extract shared calculation algorithms (such as tax tabulations or order item timers) into centralized utility helpers in `lib/` and definitions in `config/`.
- **Lean Package Dependency Rule**: No unnecessary third-party npm libraries may be introduced. Validate whether built-in JavaScript/TypeScript native features or established project utilities can execute the task before installing external packages.

---

## 2. Mandatory UI State Governance (Loading, Empty & Error Surfaces)

A premium SaaS platform never displays broken blank viewports, jarring content shifts, or unhandled crash logs. Whenever UI implementation begins following explicit user design guidance, **every single dashboard, table list, menu grid, and card component MUST implement three mandatory states**:

### A. Skeleton Loading States
- Never use generic rotating spinners for structured layout loading.
- Implement responsive, pulsating **Skeleton UI layouts** (via `shadcn/ui` Skeleton component) that mirror the precise geometry of the destination content (e.g., KDS order ticket outlines, menu card image boxes, analytics chart blocks).

### B. Purposeful Empty States
- When a relational query returns zero records (e.g., all KDS tickets cleared, zero active waiter table calls, empty reservations list), the interface must render a **Polished Empty State Card**.
- Empty states must incorporate an aesthetic domain icon (via Lucide Icons), a supportive explanatory title (e.g., *"All Kitchen Tickets Caught Up!"*), and an interactive guidance action or status indicator.

### C. Graceful Error & Fallback States
- Wrap all route segments and asynchronous widget panels in robust React Error Boundaries (`error.tsx`).
- If a network request or database transaction fails, display a **Graceful Error Recovery Tile** containing a human-readable diagnosis and a one-click "Retry Action" trigger without breaking surrounding dashboard widgets.

---

## 3. Sprint-Based Delivery Rules
We reject unstructured feature grabbing in favor of rigorous **Sprint-Based Delivery** (Sprints 1 through 8).
- **Working State Mandate**: Every single Sprint must terminate in a fully functional, compilable, and demonstrable application checkpoint. Engineers are strictly forbidden from committing half-finished regressions or broken type references between Sprints.
- **One-Command Environment Recovery**: Whenever testing across Sprints or preparing for live demonstration reviews, execute our one-command demo restoration command from the terminal:
  ```bash
  npm run demo:reset
  ```
  This immediately executes `tsx supabase/seed.ts`, refreshing the relational schema with clean, realistic demo accounts, tables, and AI inventory warning threshold triggers in under 2 seconds.

---

## 4. TypeScript & Strict Type Integrity
- **No Any Exceptions**: The explicit usage of `any` or loose type casting (`@ts-ignore`, `as any`) is strictly forbidden.
- **Centralized Domain Type Definitions**: All domain structures representing database models, Server Action payloads, and component props must be explicitly modeled inside the `types/` directory or exported cleanly from corresponding Prisma/Zod schemas.
- **Null & Undefined Safety**: Rely on optional chaining (`?.`) and nullish coalescing (`??`) to guard against undefined runtime states in edge databases or missing API network fields.

---

## 5. Validation & Boundary Defense (Zod & React Hook Form)
- **Shared Validation Schemas**: Both client-side web forms (powered by `React Hook Form`) and backend mutation endpoints (Next.js `Server Actions`) must consume identical TypeScript runtime Zod schemas situated in `validations/`.
- **Form Submission Governance**: No unvalidated form data may ever cross the client-to-server boundary. Every submission wrapper must execute `@hookform/resolvers/zod` before triggering server executions.

---

## 6. Asynchronous State & Caching Architecture (TanStack Query)
- **Client Cache Decoupling**: For interactive client dashboards (such as active KDS ordering displays or Waiter notification queues), leverage **TanStack Query (v5)** to manage background caching, retry backoffs, and network state reflection.
- **Optimistic UI Updates**: High-frequency operational actions (such as a Chef clicking "Mark Dish Cooking" or a Server toggling "Acknowledge Alert") must execute optimistic UI mutations immediately to maintain zero-perceptible latency while Supabase synchronizes changes in the background.

---

## 7. Git Version Control & Commit Protocol
- **Branch Naming Standardization**: All engineering changes must originate from clean feature branches (`feat/`, `fix/`, `docs/`, `chore/`).
- **Conventional Commits**: Commit log descriptions must remain professional, concise, and structured (e.g., `feat(orders): implement Zod validation schema for table ordering submissions`).
- **Milestone Checkpoint Freeze**: Per our workflow authorization rule, execution must stop after completing every documented milestone to present full change summaries and obtain explicit user sign-off before proceeding.
