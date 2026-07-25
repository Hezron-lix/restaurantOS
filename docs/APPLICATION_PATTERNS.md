# RestaurantOS Application Patterns

This document serves as the engineering handbook for RestaurantOS. It outlines the standard patterns, architecture, and coding conventions that must be adhered to when building features.

---

## 1. State Management

RestaurantOS strictly separates state management by responsibility to avoid massive monolithic stores and prop-drilling.

- **Server Components (RSC):** Use for secure, initial data fetching. Examples include verifying authentication sessions and fetching the initial user profile. Do not use for highly interactive state.
- **React Query:** The primary tool for asynchronous server state. If the data lives in the database (Supabase), it lives in React Query on the client. It handles caching, refetching, and background synchronization.
- **Zustand:** Use for complex, synchronous global UI state. Examples include the global Command Palette state, or isolated feature state like a POS active ticket.
- **React Context:** Use exclusively for dependency injection of singleton providers that rarely change, such as the `ThemeProvider` or `SessionProvider`.

---

## 2. Component Organization

We enforce a strict domain boundary between components to maximize reusability.

- **`components/ui/`**: "Dumb" UI primitives (Buttons, Inputs, Dialogs). They contain no business logic and rely entirely on props.
- **`components/shared/`**: Layout and structural components used across different routing contexts (e.g., `ErrorBoundary`, `PermissionGuard`).
- **`features/[module]/components/`**: Feature-specific UI. These components contain domain business logic, consume feature-specific Zustand stores, and invoke feature-specific React Query hooks.

---

## 3. Feature Structure

To prevent massive root directories, we use a Feature-Sliced Design pattern. Every distinct business domain (Orders, Kitchen, Inventory, etc.) is isolated.

A standard feature module requires the following layout:

```text
features/[module-name]/
├── api/           # React Query hooks and Server Actions
├── components/    # Feature-specific UI components
├── store/         # Zustand store slice isolated to this feature
├── types/         # Zod schemas and TS interfaces
├── hooks/         # Custom hooks specific to this module
├── validations/   # Validation logic
├── tests/         # Unit and integration tests for this feature
└── README.md      # Documentation explaining the feature
```

---

## 4. Data Flow

The standard lifecycle for reading and writing data:

1. **Server (`layout.tsx` / `page.tsx`)**: Fetch initial context (e.g., Session).
2. **React Query (`api/`)**: Fetches data on the client (or hydrates from Server Components).
3. **Mutation (`api/`)**: User action triggers a React Query mutation (wrapping a Server Action or Supabase call).
4. **Optimistic Update**: The mutation immediately updates the local React Query cache for zero-latency UI feedback.
5. **Realtime**: A Supabase Realtime subscription listens for DB changes and calls `queryClient.setQueryData()` to sync all connected clients (e.g., updating KDS screens when a waiter sends an order).
6. **Cache Update**: On success, the cache is either validated or implicitly updated by the realtime subscription.

---

## 5. Events

RestaurantOS utilizes a lightweight, strongly-typed pub/sub event bus (`lib/events.ts`).

- **When to emit events:** Use for isolated, cross-component communication that shouldn't trigger full React render cycles. Examples include triggering a receipt print (`ORDER_COMPLETED`), or showing a global notification toast from deep within a component tree.
- **When NOT to emit events:** Do not use the Event Bus for standard state synchronization. If you need data to flow down a component tree, use props or Zustand.

---

## 6. Permissions

We use a permission-driven architecture.

- **Never hardcode role checks** in the UI (e.g., `if (role === 'manager')`). Roles change, and logic fractures.
- **Always use permissions** (e.g., `if (can('delete:orders'))`).
- Define the role-to-permission mapping centrally in `config/permissions.ts`.
- Wrap protected UI elements in the `<PermissionGuard>` component.

---

## 7. Error Handling

We embrace a resilient UI architecture where one failure does not crash the app.

- **Feature Error Boundary (`components/shared/ErrorBoundary.tsx`):** Wrap individual complex components (like a POS ticket grid) in a class-based error boundary to isolate React rendering crashes.
- **Route Error Boundary (`app/error.tsx`):** Catches errors that occur during page navigation and Server Component rendering.
- **Global Error Boundary (`app/global-error.tsx`):** The last line of defense for critical system failures, replacing the entire root layout to offer a recovery button.
- **Suspense:** Use `React.Suspense` to handle loading states gracefully.
- **Toast Errors:** Use the global toast system for non-fatal mutation errors (e.g., "Failed to update order").

---

## 8. Testing

- **Unit Tests (Vitest):** Required for all isolated utility functions, validation schemas (Zod), and complex Zustand store logic.
- **Integration Tests (Vitest/RTL):** Required for critical custom hooks (e.g., verifying optimistic updates in a custom React Query hook).
- **End-to-End Tests (Playwright):** Required for critical user flows, such as logging in, placing an order, and bumping a ticket on the KDS.

---

## 9. Documentation

Every new feature module created in `features/` MUST include a `README.md` detailing:
- The feature's purpose.
- Key data structures (Types/Zod schemas).
- Important state mechanisms (Zustand stores).
- Realtime events the feature emits or listens to.
