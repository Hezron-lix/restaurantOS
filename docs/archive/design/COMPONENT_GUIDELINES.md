# 🧩 Component Guidelines
**Behavioral Specifications for RestaurantOS UI Components**

---

## Architecture Rules

1. All components live under `components/` and are organized by domain:
   - `components/ui/` — shadcn/ui primitives (never modified directly)
   - `components/restaurant/` — domain-specific restaurant components
   - `components/layout/` — page shells, navigation, header bars
   - `components/shared/` — cross-domain utility components (StatusBadge, CurrencyDisplay, SkeletonCard)

2. Every component receives only typed props — no `any`, no untyped event handlers.

3. Components must not fetch their own data. Data is fetched at the page/layout level and passed as props. Exception: realtime subscription hooks may live at the layout level.

4. The `cn()` utility from `lib/utils.ts` is mandatory for all conditional class merging.

---

## Mandatory Four-State Pattern

Every data-driven component must implement all four states:

```typescript
interface DataComponentProps<T> {
  data: T[] | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

// Usage pattern:
if (isLoading) return <SkeletonList count={6} />;
if (error)     return <ErrorCard message={error} onRetry={onRetry} />;
if (!data || data.length === 0) return <EmptyState icon={icon} title={title} subtitle={subtitle} />;
return <ContentView data={data} />;
```

---

## Shared Utility Components

### `<CurrencyDisplay cents={number} />`
Converts integer cents to formatted currency. Never let raw cents appear in JSX.
```tsx
// components/shared/CurrencyDisplay.tsx
export function CurrencyDisplay({ cents, className }: { cents: number; className?: string }) {
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
  return <span className={cn('tabular-nums', className)}>{formatted}</span>;
}
```

### `<StatusBadge status={TableStatus | OrderStatus | ReservationStatus} />`
Single source of truth for all status chip rendering. Maps status strings to color tokens.

### `<SkeletonCard height={string} className={string} />`
Standard shimmer placeholder. Uses CSS animation, not JavaScript.

### `<EmptyState icon={LucideIcon} title={string} subtitle={string} action? />`
Standardized empty state with icon, copy, and optional CTA button.

### `<ErrorCard message={string} onRetry? />`
Red-bordered error display with retry action.

---

## Domain Component Contracts

### `<TableFloorCard />`

```typescript
interface TableFloorCardProps {
  tableId: string;
  tableNumber: number;
  capacity: number;
  status: TableStatus;             // 'AVAILABLE' | 'RESERVED' | 'SEATED' | 'DIRTY'
  currentQrToken: string | null;
  onActivateSession: (tableId: string) => void;
  onUpdateStatus: (tableId: string, status: TableStatus) => void;
  isLoading?: boolean;
}
```

**Behavioral rules:**
- Status color must match the operational palette exactly (AVAILABLE=emerald, SEATED=blue, DIRTY=slate).
- Clicking the card when `status === 'DIRTY'` must trigger transition to `AVAILABLE` — not open an inspector.
- The QR token, when shown, must be in monospace font and truncated: `...sess_9a82`.
- `isLoading` renders the skeleton variant inline (not a separate component).

---

### `<MenuDishCard />`

```typescript
interface MenuDishCardProps {
  dishId: string;
  name: string;
  description?: string;
  priceCents: number;              // Integer cents — render via CurrencyDisplay
  prepTimeMinutes?: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  onSelect: (dishId: string) => void;
}
```

**Behavioral rules:**
- When `isAvailable === false`, the card is visually dimmed (`opacity-50 grayscale pointer-events-none`) and displays a "SOLD OUT" badge.
- Price is always rendered via `<CurrencyDisplay cents={priceCents} />`.
- Framer Motion `whileTap: { scale: 0.96 }` is applied on mobile only (detected via viewport hook, not UA string).

---

### `<KdsOrderTicket />`

```typescript
interface KdsOrderTicketProps {
  orderId: string;
  tableNumber: number;
  placedAtIso: string;
  items: Array<{
    itemId: string;
    name: string;
    quantity: number;
    specialInstructions?: string;
    status: 'QUEUED' | 'COOKING' | 'READY';
  }>;
  onAdvanceStatus: (orderId: string) => void;
}
```

**Behavioral rules:**
- Header color shifts by elapsed time: green (<10m), amber (10-18m), pulsing red (>18m).
- The advance-status button occupies the full card bottom half at minimum 72px height.
- `layout` and `layoutId={orderId}` props are required for smooth kanban repositioning.
- `whileHover` is **disabled** on this component — KDS monitors are touch-only.

---

### `<AiInsightCard />`

```typescript
interface AiInsightCardProps {
  category: 'INVENTORY_DEPLETION' | 'DEMAND_VELOCITY' | 'PREP_BOTTLENECK';
  urgency: 'NORMAL' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  isFallbackMode?: boolean;       // Shows "Computed locally" badge when true
}
```

**Behavioral rules:**
- CRITICAL urgency applies the `shadow-ai-critical` glow token and pulsing border animation.
- `isFallbackMode` renders a subtle badge: "🔌 Offline — Local Analysis" — same visual quality, no error state.

---

### `<RealtimeNotificationPill />`

```typescript
interface RealtimeNotificationPillProps {
  notificationId: string;
  type: 'ORDER_READY' | 'WAITER_CALL' | 'INVENTORY_ALERT';
  title: string;
  tableNumber?: number;
  timestampIso: string;
  onDismiss: (id: string) => void;
}
```

**Behavioral rules:**
- `ORDER_READY` uses red color scheme with `Flame` icon.
- `WAITER_CALL` uses amber with animated `Bell` icon.
- `INVENTORY_ALERT` uses yellow with `AlertTriangle` icon.
- Dismiss is a swipe gesture on mobile and a button on desktop.

---

## Navigation Components

### `<StaffHeader />`
Top navigation bar for all staff consoles. Contains:
- Restaurant name / logo
- Current user avatar + role badge
- Notification bell with unread count badge
- Sign out action

### `<MobileBottomNav />`
Fixed bottom navigation for guest and waiter mobile views. Contains labeled tabs with Lucide icons. Active tab uses brand amber color.
