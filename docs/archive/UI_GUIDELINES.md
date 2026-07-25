# 🎨 RestaurantOS: Frontend UI Guidelines & Aesthetic Standards
**Design Governance & Visual Authority Contract (Immutable Contract)**

---

## 1. 🚨 The Inviolable UI Rule

This instruction represents an unconditional, absolute engineering rule: **The visual frontend identity belongs exclusively to the User.**

### Strict Behavioral Mandate:
Before building or styling ANY frontend visual interface, dashboard, or interactive surface, development **MUST STOP** to formally request and obtain design direction and layout inspiration from the user.

### Specifically Prohibited Autonomous Creations:
No frontend code may be designed or implemented independently for:
- Landing Page & Onboarding Surfaces
- Authentication & Login Screens
- Interactive Customer Digital Menu UI
- Guest Reservation & Queue Flow Screens
- Kitchen Display System (KDS) Touchscreen Monitor Tiles
- Waiter Coordination Console & Floor Alert Cards
- Cashier Billing & POS Checkout Terminals
- Executive Manager Analytics Dashboard
- Operational AI Assistant Diagnostic Panels
- Settings & Employee Profile UI

**Prohibitions**: Engineers are strictly forbidden from inventing layout structures, visual branding, color palettes, custom navigation behaviors, or spacing layouts without prior explicit user approval. All backend architecture, schemas, server actions, database queries, real-time webhooks, and utility calculations may proceed without interruption.

---

## 2. Component & Styling Tooling Baseline

When visual design approval is explicitly granted, implementations will strictly leverage our production-grade design system foundational tools:
- **Styling Core**: Tailwind CSS (v4) paired with custom CSS variables in `app/globals.css` for clean theme token management.
- **UI Primitive Assembly**: Built upon accessible atomic components from `shadcn/ui` (Radix UI primitives) and standard Lucide Icons.
- **Class Merging Utility**: All conditional tailwind formatting must utilize the `cn()` helper (combining `clsx` and `tailwind-merge`) situated in `lib/utils.ts`.

---

## 3. Target Viewports & Responsive Ergonomics

Although specific layout structures await your direction, UI implementations must be technically engineered to support the distinct hardware viewports typical of real restaurant environments:

| Operational Persona | Target Hardware Environment | Primary Viewport Focus | Ergonomic Requirements |
| :--- | :--- | :--- | :--- |
| **Customer / Guest** | Mobile Smartphones (via Table QR) | Small Screen Portrait (360px–430px) | Thumb-friendly buttons, high contrast menu imagery, fast mobile rendering. |
| **Waiter / Server** | Handheld Ordering Tablets / Phones | Medium Portrait & Landscape (768px–1024px) | Instant tactile notification clearing, high readability floor plans. |
| **Kitchen Chef** | Wall-Mounted KDS Touchscreen Monitors | Large Widescreen Landscape (1920px+) | Large typography, high contrast order timer cards, single-touch status updates. |
| **Cashier & POS** | Desktop Terminals & Tablet Checkouts | Medium/Large Landscape (1024px–1440px) | Rapid billing tabulation, streamlined item splitting grids. |
| **Manager & Executive** | Laptops & Management Desktop Screens | Desktop Full Resolution (1440px+) | High-data density analytics charts, clear real-time AI advisory callout boxes. |

---

## 4. Micro-Interactions & Animation Standards
When UI construction commences, interface fluidity must feel responsive and state-of-the-art:
- **Animation Framework**: Standardize on **Framer Motion** for performant, hardware-accelerated interface transformations.
- **Application Scope**: Smooth sliding card transitions when KDS tickets shift between cooking stations, gentle pulsing indicators on high-priority waiter assistance alerts, and clean accordion animations inside multi-course menu lists.
