# 📱 RestaurantOS Responsive Strategy & Ergonomics
**Hardware-Specific Adaptive UI & Viewport Specification (Immutable Design Contract)**
*Reference: [UI_GUIDELINES.md](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/UI_GUIDELINES.md)*

---

## 1. Executive Hardware & Viewport Ergonomic Strategy

In commercial hospitality environments, software is consumed across vastly differing physical hardware geometries under chaotic operational conditions. A one-size-fits-all responsive layout fails in restaurants. A smartphone customer menu demands thumb-reach navigation, whereas a wall-mounted kitchen touchscreen requires massive typography readable through kitchen steam from ten feet away. 

RestaurantOS enforces a **strict physical device adaptation strategy** utilizing Tailwind CSS v4 breakpoint boundaries (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`) mapped directly to our five operational personas.

---

## 2. Personas & Target Device Matrix

| Operational Persona | Target Physical Hardware | Viewport Resolution Boundary | Primary Interface Orientation | Critical Ergonomic Mandates |
| :--- | :--- | :--- | :--- | :--- |
| **Customer / Guest**| Personal Smartphones (via Table QR)| Small Screen (`360px–430px`, default zero prefix) | Portrait strictly optimized | Thumb-friendly navigation, sticky bottom action bar, fast high-contrast image rendering. |
| **Waiter / Server** | Handheld Ordering Tablets & POS Phones | Medium Handheld (`md:` 768px to `lg:` 1024px) | Portrait & Landscape dynamic | Single-hand thumb reach, swipe-to-dismiss alert gestures, high readability floor plans. |
| **Kitchen Chef** | Wall-Mounted KDS Touchscreen Monitors | Widescreen Monitor (`xl:` 1280px to `2xl:` 1920px+)| Landscape strictly enforced | Large high-visibility timer fonts, minimum 72px touch targets, zero scrolling dropdown menus. |
| **Cashier & POS** | Countertop Touch Terminals & Laptops | Medium/Large Landscape (`lg:` 1024px to `xl:` 1440px)| Landscape | Split-screen billing view: left unpaid check queue, right tabular numeral calculation grid. |
| **Manager / Admin** | Laptops & Management Desktops | Desktop Full Resolution (`xl:` 1440px+)| Landscape | High data-density KPI analytical tables, multi-column AI advisory cards. |

---

## 3. Specialized Hardware Surface Rules

### A. Customer Smartphone Surface (Mobile Ergonomics)
* **The Thumb Zone Rule**: Interactive navigation elements (category switching pills, active order tracker buttons, "View Table Bag" cart summary) must stick securely to the **bottom 96 pixels** of the smartphone viewport using `fixed bottom-0 z-50` layout frames.
* **Touch Target Geometry**: All interactive buttons inside dish customization modals and bill settlement screens enforce a minimum visual boundary of **48x48 pixels** (`h-12 w-12 min`) to prevent frustration when tapping on personal screens.
* **Vertical Scrolling Preservation**: Category lists scroll horizontally with scrollbar suppression (`overflow-x-auto no-scrollbar`), preserving natural vertical scrolling for exploring course catalog items.

### B. Waiter & Server Handheld Tablets
* **Dynamic Grid Adaptation**: The 12-table floor map (`SCR-05`) gracefully reorganizes its grid geometry based on holding posture:
  * In smartphone portrait (`default` to `md:`), tables render in a **2-column grid** (`grid-cols-2 gap-4`).
  * In tablet landscape (`md:` to `lg:`), tables widen to a **4-column grid** (`grid-cols-4 gap-6`).
* **One-Handed Floor Alert Swipe**: Realtime floor assistance callout toasts (`SCR-07`) integrate touch gesture support—allowing servers holding serving trays in one hand to acknowledge alerts via a simple rightward thumb drag motion.

### C. Kitchen Display System (KDS) Touch Monitors (Widescreen Landscape)
* **10-Foot Readability Standard**: Kitchen staff operating prep grill stations view wall monitors from several paces away. KDS order cards (`SCR-08`) bypass standard body fonts in favor of enlarged, weight-enhanced typography:
  * Table ID headers: `text-2xl font-black uppercase tracking-wide`.
  * Running timer clocks: `text-xl font-mono font-extrabold`.
  * Course item names: `text-lg font-bold text-slate-100`.
* **Zero Dropdowns or Tooltips**: Grease and moisture on commercial touch monitors render hover tooltips and cascading select dropdowns non-functional. All state advancements (`QUEUED -> COOKING -> READY`) rely exclusively on massive, full-width **72px tall primary tactile push buttons** occupying the lower half of every kitchen ticket card.
* **Masonry Kanban Columns**: On widescreen monitors (`xl:` and above), kitchen tickets dynamically wrap across **3 to 4 horizontal masonry columns** (`columns-3 xl:columns-4 gap-6`) to utilize wide real estate without vertical truncation.

### D. Cashier POS Countertop Terminals
* **Split-Screen Ergonomics**: On landscape point-of-sale terminals (`lg:` and up), `SCR-10` locks into a permanent split-screen workstation view:
  * **Left Navigation Pane (33% width)**: Scrollable queue of active dining checks awaiting cashier billing.
  * **Right Action Canvas (67% width)**: Interactive bill splitter, gratuity calculator, and tabular numeral financial summary (`font-mono tabler-nums`).
* **Keyboard & Touch Hybrid**: Inputs accommodate both high-speed POS numerical keyboard entry for deposit amounts and direct touchscreen tapping for cash/card/wallet method selection.

---

## 4. Orientation & Fallback Handling

* **Portrait Lockdown Notice (Kitchen Screens)**: If a kitchen staff member inadvertently opens the KDS console on a vertically rotated smartphone or narrow portrait screen (`max-width: 767px`), the UI displays an ergonomic advisory shield:
  *"🧑‍🍳 Kitchen Display System is optimized exclusively for Widescreen Landscape Touch Monitors. Please rotate your screen or access via designated KDS kitchen terminal."*
* **Fluid Font Scaling (clamp)**: Executive KPI metric banners on `SCR-11` utilize CSS `clamp(1.75rem, 3vw, 2.5rem)` scaling utilities to ensure multi-digit revenue numbers never overflow or truncate regardless of window dimensions.
