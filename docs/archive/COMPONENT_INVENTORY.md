# 🧩 RestaurantOS Component Inventory
**Atomic Primitives & Specialized Hospitality Component Catalog (Immutable Design Contract)**
*Reference: [UI_GUIDELINES.md](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/UI_GUIDELINES.md), [ARCHITECTURE.md](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/ARCHITECTURE.md)*

---

## 1. Architectural Component Methodology

RestaurantOS implements a strictly hierarchical component assembly strategy. Foundations are built upon atomic **Radix UI primitives** curated via **shadcn/ui** and styled with Tailwind CSS v4 using our designated class merging helper (`cn` from `lib/utils.ts`). Above these atomics, we assemble **Specialized Restaurant Domain Components** engineered specifically for real-time dining room floor coordination, KDS touchscreen kitchens, and POS transaction ledgers.

---

## 2. Base Atomic UI Primitives (`components/ui/*`)

Every atomic building block conforms to accessibility guidelines (WAI-ARIA compliance) and keyboard/touch ergonomics:

| Component Name | File Basename | Core Visual States Supported | Technical Styling & Ergonomic Governance |
| :--- | :--- | :--- | :--- |
| **Tactile Button** | `button.tsx` | Default, Hover, Active/Tap Scale, Disabled, Loading (Spinner) | Minimum 48px height on touch mobile surfaces; variants: Primary Amber (`bg-orange-600`), Secondary Slate, Danger Pulse Red. |
| **Glassmorphic Modal** | `dialog.tsx` | Closed, Animating In, Open (Backdrop Blur), Animating Out | Used for menu dish customization and reservation confirmation; renders translucent backdrop (`bg-black/80 backdrop-blur-sm`). |
| **Slide-Over Sheet Drawer**| `sheet.tsx` | Collapsed, Expanding Left/Right/Bottom, Open | Used for Waiter table detail inspectors and Mobile customer shopping bag preview; hardware accelerated slide transition. |
| **Status Badge / Pill** | `badge.tsx` | Solid Emerald, Solid Sapphire, Solid Amber, Pulse Crimson | Compact micro-typography (`text-xs font-semibold uppercase tracking-wider`) displaying operational dish and table states. |
| **Form Selector & Input** | `select.tsx`, `input.tsx` | Normal, Focus Ring (Amber glow), Validation Error (Red border), Disabled | Integrated strictly with React Hook Form and Zod validation error presentation envelopes. |
| **Shimmering Skeleton** | `skeleton.tsx` | Active Animation (Pulse/Shimmer), Hidden | Replaces spinning progress indicators during TanStack Query database hydration. |
| **Realtime Toast Notice** | `toast.tsx`, `toaster.tsx` | Enter Bottom-Right / Top-Right, Active Display, Exit Fade | Lightweight notification banners for immediate confirmation of item additions or table floor state shifts. |

---

## 3. Specialized Hospitality Domain Components (`components/restaurant/*`)

### A. `TableFloorCard` (Dining Room Management)
* **Purpose**: Represents an individual dining table tile on the Waiter floor map (`SCR-05`).
* **Props Contract**:
  ```typescript
  export interface TableFloorCardProps {
    tableId: string;
    tableNumber: number;
    capacity: number;
    status: 'AVAILABLE' | 'RESERVED' | 'SEATED' | 'DIRTY';
    currentQrToken: string | null;
    onActivateSession: (tableId: string) => void;
    onUpdateStatus: (tableId: string, status: TableStatus) => void;
    isLoading?: boolean;
  }
  ```
* **Visual States**:
  * *Available (Emerald)*: Clean dark slate card with bright emerald glowing ring around table icon; displays prominent button: **"Seat & Generate QR"**.
  * *Seated (Sapphire)*: Blue accented borders with badge indicating active session token snippet (`sess_9a82`); displays action button: **"Open Table Orders"**.
  * *Dirty / Void (Pewter)*: Greyed out surface with cleanup bucket icon; displays tactile button: **"Mark Cleaned & Available"**.
  * *Skeleton Loading*: Shimmering rounded box matching exact height of 12-grid layout.

---

### B. `MenuDishCard` (Interactive Customer Catalog)
* **Purpose**: High-aesthetic presentation tile for culinary offerings inside the guest mobile menu (`SCR-02`).
* **Props Contract**:
  ```typescript
  export interface MenuDishCardProps {
    dishId: string;
    name: string;
    description?: string;
    priceCents: number; // Mandatory Integer Cents input!
    prepTimeMinutes?: number;
    imageUrl?: string;
    isAvailable: boolean;
    onSelectDish: (dishId: string) => void;
  }
  ```
* **Visual States**:
  * *Available & High Aesthetic*: Rich card with high-definition dish imagery (generated via demonstration media tool), preparation clock badge (`15m prep`), and clearly formatted financial display (`$14.50`) derived from `priceCents / 100`.
  * *Sold Out (86 State)*: Dimmed grayscale card with strikethrough typography and prominent red badge: **"SOLD OUT - TODAY'S SPECIAL ENDED"**; tap actions disabled.
  * *Hover / Active Touch*: Subtle Framer Motion elevation scale-up (`scale: 1.02`) on mobile press or cursor hover.

---

### C. `KdsOrderTicket` (Kitchen Touch Display System)
* **Purpose**: Operational order tile displayed on wall-mounted widescreen KDS touchscreen monitors (`SCR-08`).
* **Props Contract**:
  ```typescript
  export interface KdsOrderTicketProps {
    orderId: string;
    tableNumber: number;
    placedAtIso: string;
    items: {
      itemId: string;
      name: string;
      quantity: number;
      specialInstructions?: string;
      status: 'QUEUED' | 'COOKING' | 'READY';
    }[];
    onAdvanceOrderState: (orderId: string, nextStatus: OrderItemStatus) => void;
  }
  ```
* **Visual States**:
  * *Normal Velocity (<10m elapsed)*: Dark card with emerald green header banner displaying Table Number and bold course list.
  * *Warning Velocity (10m–18m elapsed)*: Header bar transitions to bright Amber orange; timer ticks with enhanced font contrast.
  * *Critical Overdue (>18m elapsed)*: Header banner flashes with a subtle **Neon Pulse Crimson** border animation; emits optional audio chime to command kitchen chef focus.
  * *Interactive Tap Target*: Bottom half of card acts as a massive **72px high single-touch target** labeled: **"TAP TO MARK COOKING"** or **"TAP TO PASS READY"**.

---

### D. `AiInsightAlertBox` (Executive Operational AI Diagnostics)
* **Purpose**: Renders actionable predictive intelligence recommendations in the Manager dashboard (`SCR-12`).
* **Props Contract**:
  ```typescript
  export interface AiInsightAlertBoxProps {
    insightId: string;
    category: 'INVENTORY_DEPLETION' | 'DEMAND_VELOCITY' | 'PREP_BOTTLENECK';
    urgency: 'NORMAL' | 'WARNING' | 'CRITICAL';
    title: string;
    diagnosticMessage: string;
    recommendedActionText?: string;
    onExecuteRecommendation?: () => void;
    isFallbackMode?: boolean;
  }
  ```
* **Visual States**:
  * *Critical Warning (e.g., Cheddar Cheese Depletion)*: Dark card with luminous red and orange gradient borders, `<AlertTriangle />` pulsing icon, and direct execution button: **"Auto-Disable Cheeseburger Stock"**.
  * *Normal Advisory (Efficiency Report)*: Cool slate card with `<Sparkles />` purple/blue icon summarizing turnover velocity gains.
  * *Deterministic Fallback Notification*: Subtle bottom tag confirming insight accuracy computed via onboard fallback algorithm during offline conditions.

---

### E. `RealtimeNotificationPill` (Tactical Staff Alert Center)
* **Purpose**: Floating high-priority notification chip appearing in Waiter and Cashier headers (`SCR-07`).
* **Props Contract**:
  ```typescript
  export interface RealtimeNotificationPillProps {
    notificationId: string;
    type: 'ORDER_READY' | 'WAITER_CALL' | 'INVENTORY_ALERT';
    title: string;
    tableNumber?: number;
    timestampIso: string;
    onDismiss: (id: string) => void;
  }
  ```
* **Visual States**:
  * *Waiter Call Alert*: Vibrant amber pill with ringing bell animation: **"🛎️ Table 4 Requesting Waiter Assistance!"**
  * *Food Ready Kitchen Pass*: High-contrast red pill: **"🍽️ Table 2 Entrees Hot & Ready for Floor Pickup!"**
  * *Swipe-to-Dismiss Gesture*: Supports natural horizontal drag gesture on smartphones to mark notification acknowledged.
