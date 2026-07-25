# 🪙 Design Tokens
**CSS Custom Property Definitions for RestaurantOS**
*This file defines the exact CSS variables to be implemented in `app/globals.css`*

---

## Core CSS Variables

These are the precise token definitions to be written into `app/globals.css` under `:root` and `.dark`. All Tailwind CSS v4 utility classes will reference these.

```css
/* app/globals.css */
@import "tailwindcss";

@layer base {
  :root {
    /* Brand */
    --brand-primary:        21 90% 48%;   /* #EA580C — primary CTA, active tabs */
    --brand-warm:           31 95% 53%;   /* #F97316 — hover, gradient stop */

    /* Surfaces */
    --surface-base:         222 47% 11%;  /* #0F172A — app background */
    --surface-card:         217 33% 17%;  /* #1E293B — card, panel */
    --surface-hover:        215 28% 22%;  /* #263549 — hover state */

    /* Borders */
    --border-subtle:        217 19% 27%;  /* #334155 — dividers, outlines */
    --border-active:        215 25% 35%;  /* #475569 — focused, selected */

    /* Text */
    --text-primary:         210 40% 98%;  /* #F8FAFC — headings, critical data */
    --text-secondary:       215 25% 75%;  /* #B0BFCC — body content */
    --text-muted:           215 20% 55%;  /* #7A8FA6 — captions, placeholders */

    /* Operational Status Signals */
    --status-available:     160 84% 39%;  /* emerald-500 */
    --status-seated:        217 91% 60%;  /* blue-500 */
    --status-cooking:        43 96% 56%;  /* amber-400 */
    --status-ready:           0 72% 51%;  /* red-500 */
    --status-dirty:         215 19% 35%;  /* slate-500 */

    /* Semantic aliases for shadcn/ui compatibility */
    --background:           var(--surface-base);
    --foreground:           var(--text-primary);
    --card:                 var(--surface-card);
    --card-foreground:      var(--text-primary);
    --primary:              var(--brand-primary);
    --primary-foreground:   210 40% 98%;
    --secondary:            var(--surface-hover);
    --secondary-foreground: var(--text-secondary);
    --muted:                var(--surface-card);
    --muted-foreground:     var(--text-muted);
    --border:               var(--border-subtle);
    --input:                var(--border-subtle);
    --ring:                 var(--brand-primary);
    --radius:               0.75rem;
  }
}
```

---

## Spacing Scale

All spacing follows Tailwind's 4px base with these semantic semantic aliases:

| Token Name | Value | Tailwind Class | Use |
| :--- | :--- | :--- | :--- |
| `space-touch` | 48px | `h-12` / `min-h-12` | Minimum touch target height |
| `space-xs` | 4px | `p-1` | Tight badges, icon gaps |
| `space-sm` | 8px | `p-2` | Compact card internals |
| `space-md` | 16px | `p-4` | Standard component padding |
| `space-lg` | 24px | `p-6` | Section internal spacing |
| `space-xl` | 32px | `p-8` | Screen-level padding |
| `space-2xl` | 48px | `p-12` | Large section separators |

---

## Border Radius Scale

| Token | Value | Class | Use |
| :--- | :--- | :--- | :--- |
| `radius-sm` | 6px | `rounded-md` | Badges, pills, small chips |
| `radius-md` | 12px | `rounded-xl` | Cards, panels, inputs |
| `radius-lg` | 16px | `rounded-2xl` | Modals, drawers, floats |
| `radius-full` | 9999px | `rounded-full` | Avatar circles, status dots |

---

## Shadow & Glow Definitions

```css
/* Brand glow used on interactive hover states */
.shadow-brand-glow {
  box-shadow: 0 0 0 1px hsl(21 90% 48% / 0.3),
              0 8px 32px hsl(21 90% 48% / 0.15);
}

/* Urgent urgency pulse glow for READY state tickets */
.shadow-urgent-glow {
  box-shadow: 0 0 0 2px hsl(0 72% 51% / 0.5),
              0 0 24px hsl(0 72% 51% / 0.25);
}

/* AI advisor critical card glow */
.shadow-ai-critical {
  box-shadow: 0 0 0 1px hsl(0 72% 51% / 0.4),
              0 16px 48px hsl(0 72% 51% / 0.2);
}
```

---

## Breakpoint Tokens

| Token | px Value | Tailwind Prefix | Persona Target |
| :--- | :--- | :--- | :--- |
| Default | < 640px | (none) | Guest smartphone |
| `sm` | ≥ 640px | `sm:` | Small tablet |
| `md` | ≥ 768px | `md:` | Waiter handheld tablet |
| `lg` | ≥ 1024px | `lg:` | Cashier POS terminal |
| `xl` | ≥ 1280px | `xl:` | Manager desktop |
| `2xl` | ≥ 1536px | `2xl:` | KDS widescreen monitor |

---

## Animation Duration Tokens

| Token | Duration | Use |
| :--- | :--- | :--- |
| `duration-instant` | 80ms | Micro-feedback (button press) |
| `duration-fast` | 150ms | Hover transitions |
| `duration-normal` | 250ms | Slide-overs, sheet entries |
| `duration-slow` | 400ms | Modal openings, page transitions |
| `duration-gentle` | 600ms | Skeleton fade-ins |

---

## Z-Index Layer Stack

| Layer | z-index | Use |
| :--- | :--- | :--- |
| `base` | 0 | Static content |
| `raised` | 10 | Elevated cards |
| `overlay` | 30 | Sheet drawers, side panels |
| `modal` | 50 | Dialog overlays |
| `toast` | 70 | Notification toasts |
| `cursor` | 100 | Tooltips, popovers |
