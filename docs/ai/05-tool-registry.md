# 05. Tool Registry

## Purpose
To define the exact specifications for the structured tools the LLM will use to fetch data. These act as the interface between the Restaurant Brain and the Application Services.

## General Requirements for All Tools
- **Encapsulation:** Tools **MUST NOT** interact with Supabase or the database directly. They must act as thin wrappers that call the existing `Application Services` (e.g., `SalesService.getSummary()`). This ensures business logic remains centralized and decoupled from the AI layer.
- **Authorization:** Every tool must accept a `context` object containing the `userId`, `role`, and `restaurantId`. The tool must throw an unauthorized error if the user lacks permissions.
- **Failures:** Tools must return structured error objects rather than throwing raw exceptions to the LLM, allowing the LLM to explain the failure to the user gracefully.

## Phase 1 Tools

### `getOccupiedTables`
- **Purpose:** Returns a list of currently occupied tables and their details.
- **Inputs:** `none`
- **Outputs:** `Array<{ tableId: string, name: string, capacity: number, timeSeated: string, serverName: string }>`
- **Authorization:** FOH, Manager, Admin.
- **Example Response:** `[{ tableId: "t1", name: "Table 12", capacity: 4, timeSeated: "2023-10-27T18:30:00Z", serverName: "Sarah" }]`

### `getSalesSummary`
- **Purpose:** Retrieves top-level financial metrics for a given time period.
- **Inputs:** `{ period: "today" | "current_shift" }`
- **Outputs:** `{ totalRevenue: number, totalOrders: number, covers: number, averageCheck: number }`
- **Authorization:** Manager, Admin.
- **Failure Modes:** Returns 0s if no sales exist. Throws AuthError if a standard Server attempts access.

### `getTopItems`
- **Purpose:** Retrieves the best-selling menu items by quantity or revenue.
- **Inputs:** `{ limit: number, sortBy: "quantity" | "revenue" }`
- **Outputs:** `Array<{ itemName: string, quantitySold: number, revenue: number }>`
- **Authorization:** Manager, Admin.

### `getDelayedOrders`
- **Purpose:** Returns orders that have exceeded the restaurant's target prep time SLA.
- **Inputs:** `none` (SLA is fetched from restaurant settings).
- **Outputs:** `Array<{ orderId: string, table: string, minutesElapsed: number, items: string[] }>`
- **Authorization:** BOH, FOH, Manager, Admin.

### `getStaffPerformance`
- **Purpose:** Retrieves sales and operational metrics for staff during the current shift.
- **Inputs:** `{ staffId?: string }` (If omitted, returns all active staff).
- **Outputs:** `Array<{ staffName: string, role: string, totalSales: number, tableTurns: number }>`
- **Authorization:** Manager, Admin.

## Adding New Tools
When adding a new tool, developers must:
1. Document it in this registry.
2. Ensure the tool calls an existing `Application Service`.
3. Ensure RBAC is applied at the tool execution level.
4. Add the tool to the Brain's tool router array.
