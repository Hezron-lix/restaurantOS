# 🚀 Sprint 3 Implementation Plan
**Frontend Implementation: Foundation, Auth, Layout & Design System**
*Status: Awaiting Approval | Author: Lead Engineer*

---

## Frontend Readiness Evaluation

### ✅ Sprint 1 Backend — Complete & Verified
- 12 PostgreSQL tables with RLS policies
- All 5 user roles seeded and validated
- Supabase SSR client configured
- TypeScript types fully generated

### ✅ Sprint 2 Backend — Complete & Verified
- Menu server actions (CRUD, toggle availability)
- Table floor actions (QR session generation, FSM transitions)
- Reservation actions (double-booking prevention, auto-assignment)
- Unit tests: 12/12 passing
- TypeScript: clean compile, lint: 0 errors

### ✅ Sprint 2.5 UX Documentation — Complete
- DESIGN_SYSTEM.md, INFORMATION_ARCHITECTURE.md, SCREEN_INVENTORY.md
- COMPONENT_INVENTORY.md, USER_FLOWS.md, RESPONSIVE_STRATEGY.md, MOTION_GUIDELINES.md

### ✅ Design Language System (`docs/design/`) — Complete
- VISUAL_IDENTITY.md — color palette, typography, iconography
- DESIGN_TOKENS.md — CSS variable definitions ready for `globals.css`
- MOTION_SYSTEM.md — Framer Motion variant library
- COMPONENT_GUIDELINES.md — behavioral contracts with TypeScript interfaces
- DESIGN_AUDIT.md — UIUX folder inspection: empty AI Studio scaffold, no design artifacts

> **Frontend Readiness: CONFIRMED.** All backend contracts, design tokens, component specs, and screen blueprints are complete and internally consistent. No design decisions remain open.

---

## Sprint 3 Scope

Sprint 3 delivers the **complete application shell** — the foundation every subsequent sprint builds on. If this is wrong, everything built afterward requires rework.

### Definition of Done
- [ ] `app/globals.css` implements all design tokens from `DESIGN_TOKENS.md`
- [ ] Fonts (Inter, Geist Mono) configured via `next/font/google`
- [ ] `lib/motion.ts` — Framer Motion variant library
- [ ] `lib/format.ts` — currency, time, duration formatters
- [ ] `cn()` utility confirmed at `lib/utils.ts`
- [ ] 5 shared utility components built and rendering correctly
- [ ] All layout shells render with correct navigation
- [ ] Auth flow (`/login`) functional with all 5 demo role logins
- [ ] Role-based middleware redirects working
- [ ] Public home page (`/`) renders correctly
- [ ] TypeScript compiles clean | Lint passes | Build succeeds

---

## Proposed Changes

### Section 1: Design System Foundation

#### [MODIFY] `app/globals.css`
- Implement all CSS custom properties from `DESIGN_TOKENS.md` under `:root`
- Configure Tailwind CSS v4 `@theme` for brand colors as utility classes
- Font variable injection for Inter and Geist Mono

#### [NEW] `lib/motion.ts`
```typescript
export const fadeIn, slideInRight, slideInBottom, scaleIn
export const staggerContainer, staggerItem
export const buttonMotion = { whileHover: { scale: 1.02 }, whileTap: { scale: 0.96 } }
```

#### [NEW] `lib/format.ts`
```typescript
formatCurrency(cents: number): string   // 1450 → "$14.50"
formatRelativeTime(iso: string): string // "2m ago"
formatDuration(minutes: number): string // "1h 20m"
```

#### [MODIFY] `lib/utils.ts`
Confirm `cn()` from `clsx` + `tailwind-merge` is present.

---

### Section 2: Shared Utility Components (`components/shared/`)

#### [NEW] `CurrencyDisplay.tsx`
Converts integer cents to formatted currency. Zero raw cents permitted in JSX.

#### [NEW] `StatusBadge.tsx`
Maps `TableStatus | OrderStatus | ReservationStatus` to the operational signal color palette.

#### [NEW] `SkeletonCard.tsx`
CSS shimmer placeholder. Props: `height`, `className`, `count`.

#### [NEW] `EmptyState.tsx`
Icon + title + subtitle + optional CTA. Standard for all 12 screens.

#### [NEW] `ErrorCard.tsx`
Red-bordered error display. Props: `message: string`, `onRetry?: () => void`.

---

### Section 3: Layout Infrastructure

#### [NEW] `app/layout.tsx` — Root Layout
- Font injection (Inter, Geist Mono CSS variables)
- `<Toaster />` + TanStack Query `QueryClientProvider`
- Supabase auth session provider

#### [NEW] `app/(public)/layout.tsx` — Public Layout
Minimal shell for `/`, `/reservations`, `/menu/[table_id]/[token]`.

#### [NEW] `app/(staff)/layout.tsx` — Staff Layout
- `<StaffHeader />` + auth guard → redirect to `/login` if unauthenticated
- Wraps all `/waiter`, `/kitchen`, `/cashier`, `/manager` routes

#### [NEW] `components/layout/StaffHeader.tsx`
Restaurant logo | user name + role badge | notification bell | sign out

---

### Section 4: Authentication Flow

#### [NEW] `app/login/page.tsx`
- Dark login form: email + password via React Hook Form + Zod
- Supabase `signInWithPassword`
- Role-based redirect: `waiter→/waiter`, `kitchen→/kitchen`, `cashier→/cashier`, `manager→/manager`, `guest→/`
- Loading state + error message on failure

#### [NEW] `app/login/actions.ts`
`signInAction(email, password)` — thin server action wrapping Supabase auth.

#### [NEW] `middleware.ts`
- Protects `/waiter`, `/kitchen`, `/cashier`, `/manager` routes
- Unauthenticated → `/login`
- Wrong role → redirect to own console

---

### Section 5: Page Shells (Skeleton Placeholders Only)

No data fetching. Pages render structural layouts with `SkeletonCard` placeholders. Data is wired in Sprints 4–8.

| Route | Shell Contents |
| :--- | :--- |
| `app/(public)/page.tsx` | Restaurant hero + "Reserve a Table" + "Staff Login" CTAs |
| `app/(staff)/waiter/page.tsx` | "Floor Map" / "Alerts" tabs + 12-cell skeleton grid |
| `app/(staff)/kitchen/page.tsx` | Widescreen 3-column kanban skeleton |
| `app/(staff)/cashier/page.tsx` | 33% / 67% split-screen skeletons |
| `app/(staff)/manager/page.tsx` | 4 KPI banners + chart + AI advisory skeletons |

---

## Verification Plan

### Automated
```bash
npm run build   # TypeScript + Next.js compilation
npm run lint    # ESLint
```

### Manual
1. `npm run dev` — server starts without errors
2. `/` — public home renders with dark theme and amber CTAs
3. `/login` — all 5 demo users sign in successfully
4. `manager@demo.com` → lands on `/manager`
5. `kitchen@demo.com` → lands on `/kitchen`
6. Navigate to `/manager` logged out → redirects to `/login`
7. All staff shells show skeleton placeholders on correct viewport
8. Design tokens confirmed: obsidian background, amber accents, Inter font

---

## Sprint 3 Constraints

| Rule | Detail |
| :--- | :--- |
| No data fetching | Pages use skeleton states only |
| No new Server Actions | Only auth actions |
| No business logic | Layout and foundation only |
| `CurrencyDisplay` mandatory | No raw cents in JSX anywhere |
| `cn()` mandatory | All conditional Tailwind merging |
| Four-state from Day 1 | Every data component has all 4 states ready |
