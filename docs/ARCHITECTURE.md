# Architecture

This document describes the high-level architecture of RestaurantOS.

## Frontend Architecture

RestaurantOS is built on **Next.js 15** utilizing the **App Router**.

### Routing Strategy
We use Next.js route groups to separate contexts cleanly without polluting the URL structure:

- **`app/(public)/`**: The marketing site and landing pages. These are statically generated or server-rendered pages designed for SEO and rapid loading.
- **`app/(staff)/`**: The authenticated application. Contains the Dashboard, KDS (Kitchen Display System), and POS modules. Heavily utilizes Client Components where interactivity is required.
- **`app/(dev)/`**: Protected development routes (e.g., component sandboxes, design system viewers) that are conditionally omitted from production builds.

### Component Hierarchy
We strictly separate our components by domain:
- **`components/ui/`**: Dumb, reusable primitives (e.g., `Button`, `GlassCard`). They carry no business logic and rely entirely on props.
- **`components/landing/`**: Feature-specific components used only on the public-facing site (e.g., `SequenceHero`).
- **`components/shared/`**: Layout and structural components used across different routing contexts.

### State Management
State management is strictly divided to prevent overlapping responsibilities:
- **React Server Components**: Secure initial data fetching (session, basic profiles).
- **React Query**: All asynchronous server state on the client. Handles caching, background refetching, and pagination.
- **Zustand**: Complex, synchronous global UI state (e.g., Command Palette state, POS active tickets).
- **React Context**: Dependency injection for singleton providers that rarely change (Theme, Session).

### Provider Hierarchy
We split providers to keep the marketing site lightweight:
- **Root Layout**: `ThemeProvider`, `QueryClientProvider`, `ToastProvider`
- **Staff Layout**: `AuthProvider`, `RestaurantProvider`, `RealtimeProvider`, `CommandPaletteProvider`

### Application Infrastructure
- **Permission Model**: Fine-grained permissions (e.g., `view:orders`) mapped to roles in `config/permissions.ts`. Enforced via `usePermissions` and `PermissionGuard`.
- **Feature Flags**: Local flags (e.g., `enable_ai_assistant`) defined in `config/flags.ts` to toggle modules without code changes.
- **Event System**: A lightweight pub/sub event bus (`lib/events.ts`) for isolated cross-component communication (e.g., `TICKET_BUMPED`) without triggering full React renders.
- **Error Strategy**: Isolated `ErrorBoundary` components for modules, complemented by Next.js `error.tsx` (route boundaries) and `global-error.tsx` (critical app crashes).

### Animation Architecture
Animations in RestaurantOS are tiered based on complexity and required performance:

1. **CSS / Tailwind Keyframes (`globals.css`)**: Used for all ambient, idle animations (breathing, slow floating, pulsing glows). These run entirely on the GPU and do not block the main thread.
2. **Framer Motion**: Used for micro-interactions, layout transitions, and simple scroll-triggered entrance animations (e.g., our `InView` component).
3. **GSAP & ScrollTrigger**: Reserved strictly for complex, master-timeline narrative scrolling (such as the landing page hero sequence). We isolate GSAP logic into specific wrapper components to prevent conflicts with React's render cycle.

## Future Backend Integration

As we move past the UI/UX foundation, the application will integrate with **Supabase** for:
- **Authentication**: Role-based access control (Manager, Kitchen Staff, Waitstaff).
- **Database**: PostgreSQL for relational data mapping of tables, orders, and inventory.
- **Real-time**: Supabase Realtime subscriptions to push updates directly to the KDS and POS in milliseconds.

```mermaid
graph TD
    Client[Client Browser / Tablet] -->|Next.js App Router| AuthMiddleware{Auth Middleware}
    AuthMiddleware -->|Unauthenticated| PublicRoute[app/\(public\)]
    AuthMiddleware -->|Authenticated| StaffRoute[app/\(staff\)]
    StaffRoute -->|Server Actions| SupabaseDB[(Supabase PostgreSQL)]
    SupabaseDB -.->|Real-time WebSockets| StaffRoute
```

## Scalability Considerations
- **Edge Deployment**: Next.js allows us to push marketing pages to the Edge, ensuring instant loads globally.
- **Database Indexing**: Orders and transactional tables will be heavily indexed.
- **Asset Optimization**: The massive 269-frame GSAP canvas is heavily optimized, loading frames iteratively so the user is not blocked.
