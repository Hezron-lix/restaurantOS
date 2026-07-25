# 🎨 Visual Identity & Brand System
**RestaurantOS Design Language Foundation**
*Consolidated from Sprint 2.5 DESIGN_SYSTEM.md | Authoritative Reference*

---

## Philosophy

RestaurantOS is built for a single commercial restaurant. Its visual identity must satisfy three simultaneous audiences who exist in completely different physical environments:

1. **Dining guests** on personal smartphones in ambient restaurant lighting
2. **Kitchen staff** on wall-mounted monitors in steam-filled, high-noise stations
3. **Managers** on desktop screens in office environments

The visual system resolves this by using a **deep dark foundation** (readable in all lighting), **high-saturation operational color signals** (legible even through steam), and **premium surface textures** (glassmorphism) that elevate the guest experience.

---

## Color System

### Brand Palette

| Role | HSL | Hex | Use |
| :--- | :--- | :--- | :--- |
| **Brand Primary** | `hsl(21 90% 48%)` | `#EA580C` | Buttons, active indicators, brand accents |
| **Brand Warm** | `hsl(31 95% 53%)` | `#F97316` | Hover states, gradient secondary stop |
| **Surface Base** | `hsl(222 47% 11%)` | `#0F172A` | App canvas, page backgrounds |
| **Surface Card** | `hsl(217 33% 17%)` | `#1E293B` | Cards, panels, elevated sections |
| **Surface Hover** | `hsl(215 28% 22%)` | `#263549` | Interactive hover state backgrounds |
| **Border Subtle** | `hsl(217 19% 27%)` | `#334155` | Dividers, card outlines |
| **Border Active** | `hsl(215 25% 35%)` | `#475569` | Focused inputs, active selections |
| **Text Primary** | `hsl(210 40% 98%)` | `#F8FAFC` | Headings, critical data |
| **Text Secondary** | `hsl(215 25% 75%)` | `#B0BFCC` | Body content, descriptions |
| **Text Muted** | `hsl(215 20% 55%)` | `#7A8FA6` | Captions, placeholders, timestamps |

### Operational Signal Palette

These colors are strictly reserved for operational status communication. They must never be used decoratively.

| State | Color Family | Background | Border | Text | Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AVAILABLE** | Emerald | `bg-emerald-950/40` | `border-emerald-500` | `text-emerald-400` | Table ready for seating |
| **SEATED / ACTIVE** | Blue | `bg-blue-950/40` | `border-blue-500` | `text-blue-400` | Table occupied, active session |
| **COOKING** | Amber | `bg-amber-950/50` | `border-amber-500` | `text-amber-300` | Kitchen actively preparing |
| **READY (URGENT)** | Red + Pulse | `bg-red-950/60` | `border-red-500` | `text-red-400` | Food on pass, waiter must act |
| **DIRTY / VOID** | Slate | `bg-slate-800/80` | `border-slate-600` | `text-slate-400` | Needs cleaning before reuse |
| **WARNING (AI)** | Yellow | `bg-yellow-950/40` | `border-yellow-500` | `text-yellow-300` | Inventory approaching threshold |
| **CRITICAL (AI)** | Red Glow | `bg-red-950/50` | `border-red-400` | `text-red-300` | Immediate intervention required |

---

## Surface Elevation System

RestaurantOS uses four discrete elevation levels to create depth and hierarchy without relying on shadows alone:

```
Level 0 — App Canvas:    bg-slate-950
Level 1 — Section Card:  bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm rounded-xl
Level 2 — Interactive:   bg-slate-800/90 border border-slate-700 shadow-lg shadow-amber-950/20 rounded-xl
Level 3 — Modal/Float:   bg-slate-900/95 border border-amber-500/50 shadow-2xl backdrop-blur-md rounded-2xl
```

---

## Typography

### Fonts
- **Primary UI**: `Inter` (via `next/font/google`) — clean, legible across all screen sizes
- **Monospace / Financial**: `Geist Mono` or `JetBrains Mono` — QR tokens, transaction IDs, currency tabulation

### Scale
```
Display  — 2.5rem / 800 weight — Executive KPI banners, hero stats
H1       — 1.875rem / 700     — Screen titles, section headers
H2       — 1.25rem / 600      — Card titles, dish names, table IDs
Body     — 1.0rem / 400       — Descriptions, instructions, body content
Caption  — 0.875rem / 500     — Timestamps, prep timers, badges
Micro    — 0.75rem / 600 CAPS — Status pills, category tags
```

### Financial Display Rule
All prices are stored as integer cents (`price_cents`). The UI must **never** render raw cents.

```typescript
const formatCurrency = (cents: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
```

POS screens must use `font-mono tabular-nums` for decimal alignment in invoice columns.

---

## Iconography

Strictly **Lucide Icons** only. No icon libraries may be mixed.

| Icon | Context |
| :--- | :--- |
| `Utensils` | Menu navigation, dish catalog |
| `QrCode` | Table QR session actions |
| `Flame` | KDS cooking velocity, trending items |
| `Bell` (animated) | Waiter alert hub |
| `CheckCircle2` | Completed orders, bill settlement |
| `AlertTriangle` | AI warnings, 86'd items |
| `Sparkles` | AI advisor headers |
| `RefreshCw` | Table status reset, cleaning transitions |
| `ChefHat` | Kitchen persona identity |
| `Receipt` | Billing and POS |
| `BarChart3` | Analytics dashboard |
| `MapPin` | Floor plan context |
