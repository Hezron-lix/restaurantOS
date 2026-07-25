# ADR 001: Initial Architecture Foundation

**Status:** Accepted
**Date:** 2026-07-25
**Context:** RestaurantOS requires a scalable, highly-performant, real-time foundation that will support hundreds of components and heavy concurrent workloads (e.g., Kitchen Display Systems, Point of Sale terminals).

## Decisions & Rationale

### 1. React Query for Server State
**Decision:** We exclusively use TanStack React Query to manage all server state (data that lives in Supabase).
**Rationale:** In a real-time environment like a restaurant, data becomes stale instantly. React Query provides built-in mechanisms for caching, background refetching, pagination, and most importantly, optimistic updates. By separating server state from local UI state, we prevent massive monolithic stores and avoid manually re-inventing caching logic.

### 2. Zustand Limited to Client/UI State
**Decision:** Zustand is strictly used for complex, synchronous, local UI state (e.g., global Command Palette toggles, drag-and-drop active order states).
**Rationale:** Mixing server data and local UI state into a single global store (like Redux) creates tight coupling and makes cache invalidation extremely difficult. By limiting Zustand to UI state, it remains lightweight, predictable, and fully synchronous.

### 3. Isolated Feature Stores
**Decision:** Instead of one massive root Zustand store, every feature (Orders, Kitchen, Inventory) maintains its own isolated `store/` directory. The root `store/app-store.ts` contains only global application state.
**Rationale:** A single global store becomes a dumping ground, creating merge conflicts and circular dependencies as the team scales. Feature-isolated stores enforce the Feature-Sliced Design pattern, ensuring that the Kitchen module does not accidentally mutate the POS module's state.

### 4. Strongly Typed Event Bus
**Decision:** A custom, lightweight Event Bus (`lib/events.ts`) is used for isolated cross-component communication, powered by a strictly typed `AppEventMap`.
**Rationale:** Using standard React Context for momentary events (like "Print Receipt" or "Show Notification") causes unnecessary and expensive re-renders across the component tree. The pub/sub Event Bus prevents these re-renders. We enforced strong typing (via `AppEventMap`) so developers get auto-completion and payload inference, preventing runtime errors caused by generic string payloads or missing data.

### 5. Capability-Based Permissions (Over Role-Based)
**Decision:** We use a permission-driven architecture (`if (can('delete:orders'))`) rather than hardcoding role checks in the UI (`if (role === 'manager')`).
**Rationale:** Role definitions change frequently as businesses grow (e.g., adding an 'assistant manager' or 'shift lead'). Hardcoded role checks fracture the codebase and require mass refactoring. By mapping roles to capabilities centrally in `config/permissions.ts`, we decouple the UI from business-role definitions, allowing instant configuration changes without touching component logic.

### 6. Provider Splitting (Root vs. Staff Layouts)
**Decision:** Providers are strictly split between `RootProviders` (Theme, Toast, QueryClient) and `StaffProviders` (Auth, Restaurant Context, Realtime, Command Palette).
**Rationale:** RestaurantOS has a dual purpose: a public-facing marketing site (Phase 1) and an authenticated staff application. Injecting heavy WebSocket connections or Auth contexts into the root layout would penalize the marketing site's performance and SEO. Splitting providers ensures the public landing page remains hyper-fast and statically optimizable.
