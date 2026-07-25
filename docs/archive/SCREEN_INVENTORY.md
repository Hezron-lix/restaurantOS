# 📺 RestaurantOS Complete Screen Inventory
**Exhaustive Application Screen Blueprint & Four-State UX Catalog (Immutable Design Contract)**
*Reference: [WORKFLOWS.md](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/WORKFLOWS.md), [DEVELOPMENT.md](file:///c:/Users/admin/Desktop/trash/restaurant-os/docs/DEVELOPMENT.md)*

---

## 1. Executive Summary & Architecture Scope

This inventory defines the **twelve fundamental screens** constituting the complete RestaurantOS SaaS application. Every screen is strictly mapped to its designated operational persona, target hardware viewport, core user goals, underlying backend server action contract, and mandatory four-state UX compliance specifications.

---

## 2. Screen Inventory Catalog (12 Universal Surfaces)

### A. Public & Customer Surfaces (Smartphones & Tablets)

#### `SCR-01` — Guest Reservation & Availability Hub
* **Target Personas**: Customers / VIP Judges booking dining tables; Hostess staff reviewing queue.
* **Primary Viewport**: Smartphone Portrait (360px–430px) & Desktop Landscape.
* **Route Path**: `/reservations`
* **Core User Goals**: Check table availability for a specific dining time and party size without risking double bookings; immediately reserve a confirmed table.
* **Key Components**: Party Size Picker (`Select`), ISO Date/Time Calendar Picker, Available Table Size Cards, Confirmation Modal with instant reservation summary.
* **Backend Integration**: `checkTableAvailabilityAction()`, `createReservationAction()`.
* **Four-State Compliance**:
  * *Idle/Content*: Render clean scheduling form with real-time slot availability indicators.
  * *Skeleton Loading*: Shimmering card outlines over availability slots during date shifts.
  * *Empty State*: *"No Tables Available at this hour for Party of [X]. Here are next closest dining windows (+/- 2 hours)."*
  * *Error State*: Red highlighted warning box if requested table encounters simultaneous double-booking conflict (`STATE_CONFLICT`).

#### `SCR-02` — Interactive Mobile QR Menu Catalog
* **Target Personas**: Dining Customers seated at Tables 1 through 12.
* **Primary Viewport**: Smartphone Portrait (360px–430px).
* **Route Path**: `/menu/[table_id]/[token]`
* **Core User Goals**: Scan physical table QR code, verify table session authenticity, browse artisan menu dishes, inspect ingredient descriptions, and stage items into table dining bag.
* **Key Components**: Table Header Bar (Table # and active token badge), Horizontal Category Scroll Pills, High-Contrast Dish Cards (with formatted price in dollars from integer cents), Dish Detail Modal, Floating "View Bag" bottom bar.
* **Backend Integration**: `validateTableQrSessionAction()`, `fetchMenuCatalogAction()`.
* **Four-State Compliance**:
  * *Idle/Content*: High-aesthetic dining catalog grouped by appetizer, entree, and beverage courses.
  * *Skeleton Loading*: Shimmering rectangular image skeletons and text line placeholders for dishes.
  * *Empty State*: *"The Kitchen Menu is currently undergoing seasonal transitions. Please ask your waiter for today's physical specials."*
  * *Error State*: Explicit unauthorized session screen if QR token expired or invalid: *"Invalid Table Session. Please re-scan the live QR code on your dining table."*

#### `SCR-03` — Guest Active Order Bag & Status Tracker
* **Target Personas**: Seated Dining Customers.
* **Primary Viewport**: Smartphone Portrait (360px–430px).
* **Route Path**: `/menu/[table_id]/[token]/tracker` (or Slide-Over Drawer from `SCR-02`).
* **Core User Goals**: Submit selected menu dishes to the Kitchen KDS; monitor real-time cooking progress from table; request instant waiter table assistance via single tactile touch.
* **Key Components**: Order Summary Ledger (itemized prices in formatted currency), Visual FSM Tracker Bar (`PLACED -> PREPARING -> READY -> SERVED`), Urgent "Call Waiter for Assistance" tactile button, Add More Courses button.
* **Backend Integration**: `createOrderAction()` (from `actions/orders.ts`), real-time subscription to `orders:live`.
* **Four-State Compliance**:
  * *Idle/Content*: Real-time chronological order tickets with live status color chips and estimated prep clocks.
  * *Skeleton Loading*: Shimmering order summary table rows.
  * *Empty State*: *"Your dining bag is currently empty. Explore our chef specialties to place your first course!"*
  * *Error State*: Inline error card if an item sold out just before submission: *"We apologize, [Dish Name] just sold out in the kitchen. Please adjust your bag."*

#### `SCR-04` — Guest Digital Checkout & Bill Request View
* **Target Personas**: Seated Customers concluding dining session.
* **Primary Viewport**: Smartphone Portrait (360px–430px).
* **Route Path**: `/menu/[table_id]/[token]/bill`
* **Core User Goals**: Review complete table check itemized by course, calculate gratuity tips, notify Cashier POS terminal for immediate settlement.
* **Key Components**: Itemized Check Invoice, Tax & Tip Tabulator, "Request Bill / Notify Cashier" large primary CTA button, Table Session Closed thank-you banner.
* **Backend Integration**: `fetchTableBillAction()`, `requestBillCheckoutAction()`.
* **Four-State Compliance**:
  * *Idle/Content*: Clean financial breakdown aligned vertically with tabular figures.
  * *Skeleton Loading*: Shimmering ledger lines during receipt tabulation.
  * *Empty State*: *"No unpaid orders recorded for this table session."*
  * *Error State*: Rejection alert if calculation faults or session prematurely expired.

---

### B. Waiter & Floor Staff Consoles (Tablets & Smartphones)

#### `SCR-05` — Dining Floor Table Map & Session Manager
* **Target Personas**: Waiters, Servers, Hosts, Floor Managers.
* **Primary Viewport**: Handheld Tablet Portrait & Landscape (768px–1024px).
* **Route Path**: `/waiter`
* **Core User Goals**: Oversee real-time occupancy state of Tables 1 through 12; seat newly arrived guest reservation parties; instantly generate and project secure table QR session tokens; trigger cleaning bussing transitions.
* **Key Components**: 12-Table Grid Tiles (color-coded: Emerald Green=`AVAILABLE`, Sapphire Blue=`SEATED`, Pewter Gray=`DIRTY`), Quick Seat CTA, Table Action Slide-In Drawer, Active Token Display Code Box.
* **Backend Integration**: `fetchFloorTablesAction()`, `generateTableSessionAction()`, `updateTableStatusAction()`.
* **Four-State Compliance**:
  * *Idle/Content*: Vibrant interactive floor map reflecting accurate PostgreSQL status across all 12 tables.
  * *Skeleton Loading*: Shimmering grid of 12 table cards upon console login.
  * *Empty State*: *"All 12 dining room floor tables are currently available and awaiting evening dinner service."*
  * *Error State*: Dismissible warning toast if an illegal state transition is attempted without manager override.

#### `SCR-06` — Active Order & Table Detail Drawer
* **Target Personas**: Waiter floor staff.
* **Primary Viewport**: Tablet Slide-Over Sheet (500px drawer width).
* **Route Path**: Accessed via clicking a table card on `SCR-05`.
* **Core User Goals**: View detailed courses currently cooking for Table X; manually add drinks or side dishes on behalf of guests; mark hot food trays as `SERVED` on floor.
* **Key Components**: Table Metadata Header, Active Course Order Cards, KDS Status Badges, Manual Add-Item Quick Bar, "Mark Courses Served" checkmark button.
* **Backend Integration**: `updateOrderStatusAction()`, `validateTableQrSessionAction()`.
* **Four-State Compliance**:
  * *Idle/Content*: Itemized order courses grouped by preparation state.
  * *Skeleton Loading*: Shimmering line blocks inside drawer body.
  * *Empty State*: *"Table [X] is currently seated but has not placed any food orders yet."*
  * *Error State*: Inline warning if marking served before kitchen signals ready status.

#### `SCR-07` — Real-Time Floor Alert & Assistance Notification Hub
* **Target Personas**: Waiters, Bussers, Cashiers.
* **Primary Viewport**: Mobile Handheld Portrait (360px–768px).
* **Route Path**: `/waiter/alerts` (and persistent Notification Bell dropdown).
* **Core User Goals**: Receive instant audio/visual notices when Table 4 presses "Call Waiter" or Kitchen marks an order as `READY`; acknowledge and clear handled alerts.
* **Key Components**: Chronological Notification Alert Cards, Pulsing High-Priority Red Border Rings (for hot kitchen food waiting), One-Touch "Acknowledge & Dismiss" swipe buttons.
* **Backend Integration**: Realtime WebSocket listener on `notifications:alerts`, `dismissNotificationAction()`.
* **Four-State Compliance**:
  * *Idle/Content*: Prioritized vertical list of active assistance alerts with time elapsed counters ("Table 4 Call - 2m ago").
  * *Skeleton Loading*: Shimmering notification card structures.
  * *Empty State*: *"✨ Floor is calm! Zero active table assistance requests or pending food pickups."*
  * *Error State*: Alert banner if WebSocket real-time connection drops, prompting manual refresh CTA.

---

### C. Kitchen Display System (KDS) Touch Consoles (Widescreen Monitors)

#### `SCR-08` — Widescreen Kitchen Cooking Touch Monitor (KDS)
* **Target Personas**: Kitchen Head Chefs, Line Cooks, Grill Stations.
* **Primary Viewport**: Large Wall-Mounted Touch Widescreen (1920px+ Landscape).
* **Route Path**: `/kitchen`
* **Core User Goals**: Provide unambiguous, high-contrast visual display of cooking tickets; track item prep velocity via real-time ticking timers; enable single-touch progression from `QUEUED -> COOKING -> READY`.
* **Key Components**: Top KPI Strip (Active Orders count, Average Prep Time clock), Masonry KDS Ticket Cards (with bold item counts and special instruction callout boxes), Large Full-Width Station Stage Toggle Touch Buttons.
* **Backend Integration**: `fetchActiveKitchenOrdersAction()`, `updateOrderItemStatusAction()`, real-time subscription to `orders:live`.
* **Four-State Compliance**:
  * *Idle/Content*: High-visibility kanban cooking lanes with green (<10m), yellow (10-18m), and critical pulsing red (>18m) duration headers.
  * *Skeleton Loading*: Widescreen grey shimmering KDS card shells upon cold boot.
  * *Empty State*: *"🧑‍🍳 Kitchen Queue Clear! All table order courses have been cooked and served. Stations standing by."*
  * *Error State*: Large high-contrast network offline banner: *"⚠️ KDS Connection Interrupted. Attempting reconnection... [Force Reconnect button]"*

#### `SCR-09` — Chef Stock Control & Quick 86 Menu Switchboard
* **Target Personas**: Head Chefs, Kitchen Managers.
* **Primary Viewport**: Tablet & Large Touch Monitor (1024px+ Landscape).
* **Route Path**: `/kitchen/inventory` or Toggle Drawer from `SCR-08`.
* **Core User Goals**: Immediately toggle availability switch on sold-out dishes during high-speed dining rush to prevent waiters from taking orders for unavailable stock; inspect live ingredient runout flags (e.g. Cheddar Cheese warning).
* **Key Components**: Search & Category Filter Bar, Dish Stock Cards with large tactile ON/OFF toggle switches (`is_available`), Ingredient Threshold Warning Badges.
* **Backend Integration**: `toggleMenuItemAvailabilityAction()` (Guarded strictly for `kitchen` and `manager`), `fetchInventoryAlertsAction()`.
* **Four-State Compliance**:
  * *Idle/Content*: Interactive catalog switchboard displaying active stock counts and dish status switches.
  * *Skeleton Loading*: Shimmering toggle row items.
  * *Empty State*: *"All menu items are actively stocked and operational."*
  * *Error State*: Rejection error box if non-kitchen staff attempts to override dish availability.

---

### D. Cashier POS & Transaction Terminals (Countertop Screens)

#### `SCR-10` — Cashier POS Checkout & Bill Settlement Hub
* **Target Personas**: Cashiers, Hosts, Counter POS Staff.
* **Primary Viewport**: Medium/Large Landscape Desktop Terminal (1024px–1440px).
* **Route Path**: `/cashier`
* **Core User Goals**: Manage unpaid dining checks; split table bills among multiple guest payment methods (`CASH`, `CARD`, `DIGITAL_WALLET`); settle transactions cleanly; trigger automatic table status transition to `DIRTY` after checkout.
* **Key Components**: Split-Screen Workflow: Left Pane unpaid bill queue, Right Pane interactive split-bill calculation grid, Large Tabular Numeral Financial Summary ($ price_cents / 100), Instant Receipt Generate CTA.
* **Backend Integration**: `processPaymentAction()`, `updateTableStatusAction(table_id, 'DIRTY')`.
* **Four-State Compliance**:
  * *Idle/Content*: Organized billing ledger displaying tables awaiting cashier checkout and completed payment ledgers.
  * *Skeleton Loading*: Shimmering invoice summary grids.
  * *Empty State*: *"No unpaid table checks awaiting cashier billing at this time."*
  * *Error State*: High-contrast payment failure alert if transaction calculation encounters validation variance.

---

### E. Executive Management & AI Diagnostic Hub (Laptops & Desktops)

#### `SCR-11` — Executive Management Daily Analytics Console
* **Target Personas**: General Managers, Restaurant Owners, Hackathon Evaluation Judges.
* **Primary Viewport**: Full Desktop Laptops & Monitors (1440px+ Resolution).
* **Route Path**: `/manager`
* **Core User Goals**: Analyze executive business KPI metrics (Total Daily Revenue, Order Volume, Average Kitchen Prep Times, Table Turnover Velocity); monitor top-selling menu dishes.
* **Key Components**: Top Metric Banners (with formatted dollars and delta percentages), Graphical Turnover Trends Chart, Top Ordered Items Leaderboard Table, System Reset & Demo Verification Trigger Panel.
* **Backend Integration**: `fetchDailyAnalyticsAction()`, `enforceOperationalRoleGuard(['manager'])`.
* **Four-State Compliance**:
  * *Idle/Content*: Professional executive intelligence dashboard with high data density and polished visual aesthetic.
  * *Skeleton Loading*: Shimmering chart canvas shapes and KPI card loaders.
  * *Empty State*: *"Zero revenue transactions recorded for today's current date. Execute demo seeding to simulate service!"*
  * *Error State*: Permission rejection card if unauthorized role navigates to `/manager`: *"Access Denied. Executive Management RBAC privileges required."*

#### `SCR-12` — Operational AI Advisor & Predictive Inventory Hub
* **Target Personas**: Executive Managers, Kitchen Head Chefs.
* **Primary Viewport**: Desktop Laptops & Management Screens (1440px+ Resolution).
* **Route Path**: `/manager/ai-insights`
* **Core User Goals**: Deliver measurable operational problem-solving via AI diagnostic insights; analyze real-time consumption velocity; receive high-priority runout warnings (e.g. Cheddar Cheese dropping below 15 units); review deterministic recommendations.
* **Key Components**: AI Insight Advisory Cards (grouped by urgency: `NORMAL`, `WARNING`, `CRITICAL`), Predictive Depletion Timeline Horizon, Single-Click Mitigation Action buttons ("Auto-86 Cheeseburger Dish").
* **Backend Integration**: `generateAiOperationalInsightsAction()` (with built-in local deterministic fallback), `toggleMenuItemAvailabilityAction()`.
* **Four-State Compliance**:
  * *Idle/Content*: Vibrant glowing AI advisory panel reporting precise depletion countdowns and operational efficiencies.
  * *Skeleton Loading*: Glowing pulse shimmering cards while AI synthesizes diagnostic data.
  * *Empty State*: *"🤖 Operational System Optimal: Inventory stock velocities are balanced with zero predictive depletion warnings detected."*
  * *Error State*: Transparent fallback banner confirming local deterministic calculation mode if external LLM connectivity encounters latency.
