# 🎨 RestaurantOS Design System & UX Foundations
**Visual & Ergonomic Design Specification (Immutable Design Contract)**
*Reference: [UI_GUIDELINES.md](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/UI_GUIDELINES.md), [DEVELOPMENT.md](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/DEVELOPMENT.md)*

---

## 1. Executive UX Philosophy & Core Design Principles

RestaurantOS is architected to solve real, high-stress operational challenges inside single-location restaurants. In commercial kitchens, busy dining rooms, and high-volume checkout counters, ambiguous interfaces cause order mistakes, delays, and operational friction. Our UX design system is founded on **five core principles**:

1. **Ergonomic Speed Over Feature Density**: Every interface surface must optimize for rapid, intuitive execution. Waiters and chefs operate in distracting environments; touch targets must be spacious, labels unmistakable, and navigation paths instant.
2. **High-Contrast Operational Legibility**: Kitchen displays and dining room handhelds encounter variable lighting and steam/grease conditions. Status indicators rely on vibrant, color-coded high-contrast visual cues paired with clear typographic text labels—never color alone.
3. **Responsive Tactile Feedback**: Every interaction (adding a dish, transitioning a kitchen order, settling a bill) requires immediate tactile physical feedback via visual transformations and micro-animations to confirm operational execution.
4. **Zero Quiet Failures (State Integrity)**: As governed by [DEVELOPMENT.md](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/DEVELOPMENT.md), no interface screen may flash blank or fail silently. Every screen must articulate four complete UX state variants: **Idle/Content**, **Loading (Skeleton Shimmer)**, **Empty Status (Actionable Guidance)**, and **Error (Graceful Recovery)**.
5. **State-of-the-Art Demo Presentation ("The WOW Factor")**: The user-facing customer digital menu and management analytics console must evoke a premium, modern SaaS identity through curated palettes, subtle glassmorphic surface elevations, and smooth kinetic motion.

---

## 2. Curated Color Palettes & Semantic Tokens

To maintain visual consistency across Tailwind CSS v4 and standard Radix shadcn/ui variables, RestaurantOS employs a **Warm Modern Hospitality** palette paired with strict operational state semantic tokens.

### A. Core Architectural Theme Variables (`app/globals.css` mapping)
| Semantic Role | Hsl / Color Description | Hex Code Equivalent | Application & Usage |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `hsl(21 90% 48%)` (Vibrant Amber/Amber Glow) | `#EA580C` / `#F97316` | Primary action buttons, active tab indicators, brand accents. |
| **Secondary Accent** | `hsl(215 25% 27%)` (Slate Hospitality) | `#334155` | Secondary action bars, filter chips, navigation card frames. |
| **Surface Background** | `hsl(222 47% 11%)` (Deep Obsidian Dark) | `#0F172A` | Default operating system wallpaper & monitor canvas. |
| **Surface Card** | `hsl(217 33% 17%)` (Elevated Charcoal Slate) | `#1E293B` | Table tiles, menu item cards, order check drawers. |
| **Text Primary** | `hsl(210 40% 98%)` (Crisp Ivory) | `#F8FAFC` | Main headings, menu dish names, primary data values. |
| **Text Muted** | `hsl(215 20% 65%)` (Subdued Pewter) | `#94A3B8` | Ingredient descriptions, sub-labels, historical timestamps. |

### B. Kitchen Display System (KDS) & Operational Lifecycle Palettes
To prevent kitchen confusion, table occupancy and dish preparation statuses are strictly bound to dedicated color channels:

| Operational State | Tailwind Color Schema | Background Token | Border & Text Contrast | Visual Meaning & Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **Table Available** | Emerald Green | `bg-emerald-950/40` | `border-emerald-500 text-emerald-400` | Table cleaned and ready for guest seating. |
| **Table Seated / Placed**| Sapphire Blue | `bg-blue-950/40` | `border-blue-500 text-blue-400` | Guests seated; QR token active or initial orders submitted. |
| **Order Cooking** | Amber Orange | `bg-amber-950/50` | `border-amber-500 text-amber-300` | Kitchen actively prep-cooking dishes in KDS station. |
| **Order Ready** | Crimson Neon Pulse| `bg-red-950/60` | `border-red-500 text-red-400 animate-pulse` | Hot dishes ready on pass; Waiter must serve immediately! |
| **Table Dirty / Void**| Pewter Gray | `bg-slate-800/80` | `border-slate-600 text-slate-400` | Bill paid; table requires bussing staff cleanup before seating. |

---

## 3. Typography Hierarchy & Cents Currency Formatting

### A. Font Architecture
* **Primary Sans-Serif Font**: **Inter** (or optional brand font **Outfit** via `next/font/google`). Engineered for crisp read-out across low-DPI POS touchscreen terminals and smartphone displays.
* **Monospace Data Font**: **JetBrains Mono** or **Geist Mono**. Used exclusively for table session cryptographic QR tokens, system UUIDs, and transaction audit ledgers.

### B. Typographic Scale & Usage Hierarchy
```
Display Header:   2.5rem (40px), Line Height 1.1, Font Weight 800 (Executive KPI Banners)
Section H1:       1.875rem (30px), Line Height 1.2, Font Weight 700 (Screen Title Hubs)
Card Title H2:    1.25rem (20px), Line Height 1.3, Font Weight 600 (Menu Dish Name, Table ID)
Body Standard:    1.0rem (16px), Line Height 1.5, Font Weight 400 (Dish Ingredients, Instructions)
UI Caption:       0.875rem (14px), Line Height 1.4, Font Weight 500 (Timestamp badges, Prep timers)
Micro Label:      0.75rem (12px), Line Height 1.2, Font Weight 600, Uppercase (Category tags, Status pills)
```

### C. Financial Currency Typographic Mandate
All monetary values in PostgreSQL and Zod validation schemas are strictly stored in **Integer Cents** (`price_cents`, `total_cents`).
* **Frontend Rule**: Raw cents must **never** leak into UI components.
* **Formatting Utility**: All UI elements must render financial data via a designated visual formatting transform:
  ```typescript
  // Example UI transform concept for display presentation
  const formatCurrency = (cents: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
  ```
* **Tabular Numerals**: Financial figures on POS cashier billing screens must apply `font-mono tabler-nums` class tokens to ensure vertical alignment of decimals down invoice ledgers.

---

## 4. Semantic Iconography Conventions (Lucide Icons)

To maintain clean recognition, iconography is strictly limited to standard **Lucide Icons** with explicit role assignment:

| Icon Name | UI Context & Placement | Meaning & Operational Signaling |
| :--- | :--- | :--- |
| `<Utensils />` | Menu category tabs & dish catalog | Dining menu navigation & culinary item identification. |
| `<QrCode />` | Table floor card action buttons | Seating activation and QR token display generation. |
| `<Flame />` | KDS order header timers & popular items | High-velocity kitchen dish cooking or active heat station. |
| `<Bell />` (Animated)| Floating waiter alert hub & floor header| Urgent customer waiter assistance callout or food ready tone. |
| `<CheckCircle2 />`| Bill payment confirmation & checkout | Order served or financial transaction successfully settled. |
| `<AlertTriangle />`| AI Advisor box & Chef 86 menu items | Predictive inventory depletion warning or stock runout alarm. |
| `<Sparkles />` | Executive AI Diagnostic Panel headers | Autonomous operational intelligence insights generated by AI. |
| `<RefreshCw />` | Table card status transitions | Cleaning table turnaround or resetting session token state. |

---

## 5. Layout Grid, Spacing & Depth Elevation

### A. Grid System & Spacing Increments
* **4px Base Increments**: All spacing tokens follow Tailwind's geometric sequence (`p-1: 4px`, `p-2: 8px`, `p-4: 16px`, `p-6: 24px`, `p-8: 32px`).
* **Touch-Target Padding**: Mobile customer interfaces and tablet waiter controls enforce a minimum interactive button boundary of **48x48 pixels** (`h-12 w-12 minimum`) to prevent mis-taps during active service.

### B. Surface Depth & Glassmorphic Elevation
RestaurantOS achieves modern visual depth through layered surface translucency rather than flat opaque fills:
* **Level 0 (App Wall Canvas)**: Solid Obsidian background (`bg-slate-950`).
* **Level 1 (Section Surface Card)**: Slightly translucent card background with delicate border outline (`bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm rounded-xl`).
* **Level 2 (Interactive Hover & Active Card)**: Elevated surface with illuminated brand glow (`hover:bg-slate-800/90 border-slate-700 shadow-lg shadow-amber-950/20 rounded-xl transition-all`).
* **Level 3 (Modal Dialog & Floating Alert Pill)**: Highest contrast glassmorphic popup (`bg-slate-900/95 border border-amber-500/50 shadow-2xl shadow-black/80 backdrop-blur-md rounded-2xl`).

---

## 6. Mandatory Four-State UX Specification

In compliance with our engineering standards, every functional dashboard and component must explicitly document and render four distinct operational states:

1. **Active Content State**: Default functioning presentation of data (e.g., active dining table map, populated dish catalog, live KDS orders).
2. **Skeleton Loading State (Shimmering Pace-Loader)**:
   * When data is hydrating via TanStack Query or Server Actions, components must display structural grey shimmering placeholders matching the exact card dimension.
   * *Prohibition*: Spinning geometric loader wheels or layout shifts are forbidden during structural page loading.
3. **Empty Operational State (Guided Discovery)**:
   * When a query returns zero results (e.g., KDS screen when kitchen queue is empty, or zero tables currently seated), the UI must display an illustrative icon, an informative title ("No Active Kitchen Orders"), and an actionable reassuring subtitle ("All tickets cleared! Kitchen stations are standing by for next seating flow.").
4. **Graceful Error Recovery State**:
   * If a network exception or Zod validation rejection occurs, the UI must render an isolated, highlighted red warning card (`bg-red-950/40 border border-red-500/50 rounded-xl p-4`) containing the specific plain-language explanation and a clear retry action button ("Reload Floor Tables").
