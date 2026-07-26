# 03. Capabilities

## Purpose
To define the core operational domains that the RestaurantOS AI platform is capable of reasoning about. The AI is designed around these capabilities, not around isolated prompts.

## Core Capabilities

### 1. Table Intelligence
**Responsibilities:** Real-time visibility into the dining room floor.
**Required Tools:** `getTableStatus`, `getAvailableTables`
**Expected Outputs:** Lists of occupied/available/dirty tables, time seated, server assignments.
**Future Extensions:** Predicting table turn times based on historical dining duration.

### 2. Order Intelligence
**Responsibilities:** Tracking the status of active guest orders.
**Required Tools:** `getActiveOrders`, `getDelayedOrders`
**Expected Outputs:** Tickets that are currently open, identifying orders that have exceeded target prep times.
**Future Extensions:** Highlighting VIP orders or highlighting dietary restrictions proactively.

### 3. Kitchen Intelligence
**Responsibilities:** Monitoring back-of-house performance and load.
**Required Tools:** `getKitchenStatus`, `getStationLoad`
**Expected Outputs:** Average ticket times, current number of open tickets per station (Grill, Sauté, Pantry).
**Future Extensions:** Recommending 86'ing items based on ingredient depletion rates during service.

### 4. Sales Intelligence
**Responsibilities:** Financial reporting and trends for the current day/shift.
**Required Tools:** `getSalesSummary`, `getTopItems`
**Expected Outputs:** Total revenue, cover counts, best-selling items, revenue by category (Food vs. Bev).
**Future Extensions:** Comparing current sales to historical averages for the same day of the week.

### 5. Staff Intelligence
**Responsibilities:** Monitoring employee performance and shift details.
**Required Tools:** `getStaffPerformance`, `getActiveStaff`
**Expected Outputs:** Who is currently clocked in, sales per server, tip averages.
**Future Extensions:** Labor cost percentages in real-time.

### 6. Shift Intelligence
**Responsibilities:** Aggregating data across an entire operational period.
**Required Tools:** `getShiftMetrics`, `generateShiftSummary`
**Expected Outputs:** End-of-shift reports highlighting anomalies, wins, and areas for improvement.
**Future Extensions:** Automated manager logbook entries.

### 7. Operational Recommendations
**Responsibilities:** Providing actionable advice based on the data retrieved from the other capabilities.
**Required Tools:** Derived from combinations of the above.
**Expected Outputs:** "You have 3 large parties seated in the last 15 minutes; the kitchen may experience a rush soon."
**Future Extensions:** Automated alerts pushed to the manager's device without requiring a query.
