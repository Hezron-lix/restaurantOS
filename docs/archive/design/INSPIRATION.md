# 🌐 Design Inspiration & Reference
**Visual References That Informed the RestaurantOS Design Language**

---

## Context

The `UIUX designs/` folder that was exported from Google AI Studio contained an **empty project scaffold** with no actual design content. The app session it referenced (`https://ai.studio/apps/c8a2c882-262a-4ce6-8c00-06e7866393ba`) had not been populated with any designs prior to export.

The RestaurantOS design language was therefore developed **from first principles** during Sprint 2.5, informed by:

---

## 1. Domain Expertise: Real Restaurant Operations

The most important design input was operational reality:

- **Kitchen monitors** are viewed from 10 feet away through steam
- **Waiter tablets** are operated one-handed while carrying plates
- **Guest smartphones** are used in ambient restaurant lighting with varying contrast
- **Cashier terminals** require rapid numerical input across billing tabulation

These constraints — not aesthetic preferences — define the design system's core decisions: high-contrast operational colors, oversized touch targets, no hover-dependent interactions on KDS, and monospace financial display.

---

## 2. Design Patterns Referenced

| Pattern | Application in RestaurantOS |
| :--- | :--- |
| **Glassmorphism (dark mode)** | Card elevation system (4 levels of translucent dark surfaces) |
| **Kanban board UX** | Kitchen Display System ticket columns (QUEUED → COOKING → READY) |
| **Mobile-first bottom sheet** | Customer order bag and waiter table inspector |
| **POS terminal split-screen** | Cashier billing hub (33% queue / 67% calculator) |
| **Real-time ticker display** | Notification alert hub, order status live updates |
| **Data-dense analytics dashboards** | Manager KPI banners and AI advisory panels |

---

## 3. Technical Stack Confirmation (from Scaffold Inspection)

The AI Studio scaffold's `package.json` confirmed alignment with our chosen technology decisions:

| Library | Version Found | Our Version | Status |
| :--- | :--- | :--- | :--- |
| `tailwindcss` | `^4.1.14` | `^4` | ✅ Aligned |
| `motion` (Framer) | `^12.23.24` | `^12` | ✅ Aligned |
| `lucide-react` | `^0.546.0` | Latest | ✅ Aligned |
| `@google/genai` | `^2.4.0` | `^2` | ✅ Aligned |

---

## 4. Future Inspiration Integration

If inspiration materials become available in the future (screenshots, design files, reference UI exports), they should be:

1. Placed in `public/inspiration/` (images, screenshots)
2. Documented in this file with notes on what was extracted
3. Analyzed for color tokens, spacing patterns, and component behaviors
4. Integrated into `VISUAL_IDENTITY.md` and `DESIGN_TOKENS.md` with explicit attribution

No direct copying of third-party design assets into application code.
