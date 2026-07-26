# 04. Supported Questions

## Purpose
To define the explicit contract of natural language questions the RestaurantOS AI must reliably answer in Phase 1. If a question is not covered by this contract, the AI should gracefully degrade and state its limitations.

## The Contract

### Table Intelligence
- Which tables are currently occupied?
- Which tables are available for a party of [X]?
- Which tables need cleaning?
- How long has table [X] been seated?
- Who is serving table [X]?

### Order & Kitchen Intelligence
- Which orders are delayed?
- What is the average ticket time right now?
- How many open tickets are in the kitchen?
- Are any specific stations overwhelmed?
- What are the open items for table [X]?

### Sales Intelligence
- What are our total sales today?
- What is our best-selling item today?
- Which category (e.g., alcohol, appetizers) generated the most revenue?
- How many covers have we done so far?
- What is the current check average?

### Staff Intelligence
- Who handled the most orders today?
- Who is currently clocked in?
- What are [Server Name]'s total sales today?

### Operational Synthesis
- Summarize today's service so far.
- What should I focus on right now? (Should trigger a synthesis of delayed orders, dirty tables, and kitchen load).

## Out of Scope for Phase 1
The AI must politely decline to answer:
- "Can you forecast our sales for tomorrow?" (Requires ML forecasting models).
- "Can you update the price of the burger to $15?" (Data mutation).
- "Can you assign Table 4 to John?" (Data mutation).
- "How much inventory do we have left for tomatoes?" (Inventory module not yet integrated).
