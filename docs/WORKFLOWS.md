# 🔄 RestaurantOS: Operational Workflows & Lifecycle Modeling
**End-to-End Demo Synchronization Contract (Immutable Contract)**

---

## 1. The 10-Step Demo Operational Journey

To demonstrate maximum product innovation during live evaluation, every implementation feature revolves around a single, unbroken, deterministic 10-step operational workflow:

```mermaid
sequenceDiagram
    autonumber
    actor C as Customer (QR Menu)
    actor H as Host / Reservation Queue
    actor K as Kitchen Staff (KDS)
    actor W as Waiter / Server Console
    actor P as Cashier Billing POS
    actor M as Manager Dashboard
    actor AI as AI Insights Engine

    C->>C: 1. Scans Table QR Code on Mobile
    C->>C: 2. Views Live Digital Menu (Filtered by Stock)
    C->>H: 3. Books Table / Joins Dining Queue (Table SEATED)
    C->>K: 4. Places Interactive Dine-in Order (Instant Sync <100ms)
    K->>K: 5. Kitchen Marks Ticket Cooking (Timer Initiated)
    K->>W: 6. Marks Dish Ready -> Automated Alert Sent to Waiter
    W->>C: 7. Waiter Serves Food & Acknowledges Console Alert
    P->>P: 8. Cashier Retrieves Order, Generates Bill & Settles Check
    P->>M: 9. Manager Dashboard Updates Live Revenue & Turnover Metrics
    M->>AI: 10. AI Evaluates Throughput -> Emits Inventory & Demand Alert
```

---

## 2. Finite State Machine (FSM) Specifications

To maintain database integrity and prevent erratic UI transitions, all core entities are bound by deterministic Finite State Machines:

### A. Table Status Lifecycle
```mermaid
stateDiagram-v2
    [*] --> AVAILABLE
    AVAILABLE --> RESERVED : Guest Reserves Ahead
    AVAILABLE --> SEATED : Walk-in Guest Seated
    RESERVED --> SEATED : Reserved Party Arrives
    RESERVED --> AVAILABLE : Reservation Cancelled / Timeout
    SEATED --> DIRTY : Cashier Finalizes Bill Settlement
    DIRTY --> AVAILABLE : Busser / Waiter Marks Cleared
```

1. `AVAILABLE`: Table is fully vacant and ready for new guest allocation.
2. `RESERVED`: Table assigned to an upcoming guest party booking in `reservations`.
3. `SEATED`: Active dining session underway; table QR code validated for dine-in ordering.
4. `DIRTY`: Meal settled; awaiting physical cleanup before re-opening for reservation allocation.

---

### B. Order & Cooking Ticket Lifecycle
```mermaid
stateDiagram-v2
    [*] --> PLACED
    PLACED --> PREPARING : Chef Clicks 'Start Cooking'
    PREPARING --> READY : Kitchen Marks All Items Finished
    READY --> SERVED : Waiter Delivers Food & Clears Alert
    SERVED --> BILLED : Cashier Completes Payment Settlement
    PLACED --> CANCELLED : Voided by Waiter / Manager
    PREPARING --> CANCELLED : Kitchen Void (Out of Stock Alert)
```

1. `PLACED`: Order committed to PostgreSQL via Server Action; appears instantaneously on Kitchen KDS terminal.
2. `PREPARING`: Cooking prep timers activate; items assigned to kitchen preparation crew.
3. `READY`: Food ready for presentation; automatic high-priority real-time alert fires to the assigned Server Console.
4. `SERVED`: Waiter delivers meal to table; order marked complete from operational perspective.
5. `BILLED`: Cashier settles financial check in `payments`; transaction archived to daily revenue analytics.
6. `CANCELLED`: Order nullified due to guest preference or kitchen stock depletion.

---

## 3. Realtime Cross-Role Coordination Guarantees
- **Zero Polling Principle**: Frontend clients must never invoke repetitive polling intervals (e.g., `setInterval`) to check order statuses. All state transitions must propagate via Supabase WebSockets (`orders:live` and `notifications:alerts`).
- **Idempotent Transitions**: Action mutations attempting an invalid state hop (e.g., jumping from `PLACED` directly to `BILLED` without kitchen or server processing) must be intercepted and rejected by Zod service boundary validation.
