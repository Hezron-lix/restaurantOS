# 🔌 RestaurantOS: API & Server Actions Architecture
**Data Communication & Mutation Contract (Immutable Contract)**

---

## 1. RPC Over REST Strategy (Next.js 15 Server Actions)

In alignment with modern Next.js 15 production standards and our **Lean Architecture** principles, RestaurantOS bypasses traditional verbose REST API route creation (`/api/...`) for synchronous UI interactions. All user mutations—including order placement, kitchen ticket status updates, waiter alert clearing, and bill finalization—are executed natively via **React Server Actions**.

### Advantages for Hackathon Demo Velocity:
- **Zero API Boilerplate**: Eliminates repetitive HTTP fetch parsing, manual header authorization checks, and external URL routing.
- **End-to-End Type Safety**: Server Actions directly share TypeScript domain contracts and Zod runtime schema boundaries between frontend forms and backend queries.
- **Automated Cache Revalidation**: Directly invokes `revalidatePath` and TanStack Query invalidation triggers within the exact transaction execution context.

---

## 2. Standardized Error Handling Envelope

To prevent application crashes or unhandled promise exceptions during live evaluation, all Server Actions and supplementary REST routes must return a consistent, type-safe JSON envelope:

```typescript
export type ActionResponse<T = void> = 
  | { 
      success: true; 
      data: T; 
      message?: string;
      timestamp: string;
    }
  | { 
      success: false; 
      error: { 
        code: 'VALIDATION_ERROR' | 'AUTHENTICATION_ERROR' | 'AUTHORIZATION_ERROR' | 'NOT_FOUND' | 'INTERNAL_ERROR'; 
        message: string; 
        fieldErrors?: Record<string, string[]>; 
      }; 
      timestamp: string;
    };
```

---

## 3. Core Server Action Directory Map

All Server Actions are encapsulated inside the top-level `actions/` domain directory, separated strictly by operational persona:

### A. Customer & Menu Actions (`actions/orders.ts`)
- `submitOrder(payload: CreateOrderInput): Promise<ActionResponse<OrderDTO>>`  
  *Validates table QR session token, checks live menu availability, inserts order header and items in a single transaction, and triggers realtime kitchen alerts.*
- `requestWaiterAssistance(tableId: string, reason: string): Promise<ActionResponse<void>>`  
  *Generates an immediate high-priority notification directed to the floor server assigned to the table.*

### B. Kitchen Display System Actions (`actions/kitchen.ts`)
- `updateOrderItemStatus(itemId: string, status: 'QUEUED' | 'COOKING' | 'READY'): Promise<ActionResponse<void>>`  
  *Updates preparation status. When all order items reach `READY`, an automated waiter notification is dispatched.*
- `toggleMenuItemAvailability(menuItemId: string, isAvailable: boolean): Promise<ActionResponse<void>>`  
  *Toggles dish stock status, instantly broadcasting menu updates across customer QR screens.*

### C. Waiter Coordination Actions (`actions/waiter.ts`)
- `markOrderServed(orderId: string): Promise<ActionResponse<void>>`  
  *Transitions order header to `SERVED` and updates table dining phase.*
- `acknowledgeNotification(notificationId: string): Promise<ActionResponse<void>>`  
  *Sets alert `is_read = true`, removing it from the active server console.*
- `updateTableStatus(tableId: string, status: TableStatus): Promise<ActionResponse<void>>`  
  *Updates physical floor plan states (`AVAILABLE`, `RESERVED`, `SEATED`, `DIRTY`).*

### D. Cashier & Financial Actions (`actions/billing.ts`)
- `generateTableBill(tableId: string): Promise<ActionResponse<BillSummaryDTO>>`  
  *Aggregates unbilled table order items and calculates subtotal and applicable taxes in integer cents.*
- `processPaymentSettlement(payload: PaymentInput): Promise<ActionResponse<PaymentReceiptDTO>>`  
  *Records transaction ledger inside `payments`, sets orders to `BILLED`, and transitions table to `DIRTY` for cleaning.*

---

## 4. Supplementary REST Endpoints (`/api/v1/...`)

While UI interactions utilize Server Actions, dedicated REST HTTP routes are maintained exclusively for asynchronous system jobs and hackathon evaluation resets:

| HTTP Method | Route Endpoint | Description & Authorization |
| :--- | :--- | :--- |
| `POST` | `/api/v1/ai/generate-insights` | Triggered periodically or on order threshold milestones to execute operational predictive models. Protected by `SUPABASE_SERVICE_ROLE_KEY`. |
| `POST` | `/api/v1/demo/reset` | Cleans up transient testing orders/alerts and repopulates clean seed tables (`menu_items`, `tables`, `inventory`) for consecutive demo runs. Protected by Admin Token. |
| `GET` | `/api/v1/health` | Diagnostic status check reporting real-time Supabase PostgreSQL connection viability and system uptime. Publicly accessible. |

---

## 5. Security & Validation Rules
- **No Direct SQL Queries in Actions**: Server Actions must invoke encapsulated database helpers inside `services/`.
- **Strict Zod Boundary Enforcement**: Every action parameter must be verified by calling `Schema.safeParse(input)`. If parsing fails, the action immediately aborts and returns an `'VALIDATION_ERROR'` envelope detailing field-specific discrepancies.
