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

## 2. TypeScript & Strict Type Integrity
- **No Any Exceptions**: The explicit usage of `any` or loose type casting (`@ts-ignore`, `as any`) is strictly forbidden.
- **Centralized Domain Type Definitions**: All domain structures representing database models, Server Action payloads, and component props must be explicitly modeled inside the `types/` directory or exported cleanly from corresponding Prisma/Zod schemas.
- **Null & Undefined Safety**: Rely on optional chaining (`?.`) and nullish coalescing (`??`) to guard against undefined runtime states in edge databases or missing API network fields.

---

## 3. Validation & Boundary Defense (Zod & React Hook Form)
- **Shared Validation Schemas**: Both client-side web forms (powered by `React Hook Form`) and backend mutation endpoints (Next.js `Server Actions`) must consume identical TypeScript runtime Zod schemas situated in `validations/`.
- **Form Submission Governance**: No unvalidated form data may ever cross the client-to-server boundary. Every submission wrapper must execute `@hookform/resolvers/zod` before triggering server executions.

---

## 4. Asynchronous State & Caching Architecture (TanStack Query)
- **Client Cache Decoupling**: For interactive client dashboards (such as active KDS ordering displays or Waiter notification queues), leverage **TanStack Query (v5)** to manage background caching, retry backoffs, and network state reflection.
- **Optimistic UI Updates**: High-frequency operational actions (such as a Chef clicking "Mark Dish Cooking" or a Server toggling "Acknowledge Alert") must execute optimistic UI mutations immediately to maintain zero-perceptible latency while Supabase synchronizes changes in the background.

---

## 5. Git Version Control & Commit Protocol
- **Branch Naming Standardization**: All engineering changes must originate from clean feature branches:
  - `feat/<short-domain-description>` (e.g., `feat/kds-timer-sync`)
  - `fix/<issue-name>` (e.g., `fix/bill-tax-calculation-overflow`)
  - `docs/<document-name>` (e.g., `docs/update-architecture-adr`)
  - `chore/<tooling-task>` (e.g., `chore/setup-prettier-rules`)
- **Conventional Commits**: Commit log descriptions must remain professional, concise, and structured (e.g., `feat(orders): implement Zod validation schema for table ordering submissions`).
- **Milestone Checkpoint Freeze**: Per our workflow authorization rule, execution must stop after completing every documented milestone to present full change summaries and obtain explicit user sign-off before proceeding.
