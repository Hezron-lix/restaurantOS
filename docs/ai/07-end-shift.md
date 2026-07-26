# 07. End Shift Workflow

## Purpose
To outline the conceptual architecture for the automated "End Shift" AI workflow. This is a foundational feature that demonstrates the value of Operations Intelligence without requiring the user to type a prompt.

## Business Value
Restaurant managers currently spend 30-60 minutes at the end of a shift compiling numbers, reviewing staff performance, and writing a shift log for the next manager. The AI can synthesize this data instantly, saving time and ensuring consistency.

## Expected Workflow

1. **Trigger:** A manager clicks "End Shift" in the RestaurantOS dashboard.
2. **Data Aggregation:** The Restaurant Brain programmatically executes a suite of read-only tools:
   - `getSalesSummary({ period: "current_shift" })`
   - `getStaffPerformance()`
   - `get86dItems()`
   - `getDelayedOrders()`
3. **AI Synthesis:** The LLM receives this block of JSON data with a specific system prompt instructing it to generate a professional Manager's Logbook entry.
4. **Draft Generation:** The AI generates a structured markdown report.
5. **Human Review:** The manager reviews the generated report, adds manual notes if necessary (e.g., "Guest complained about AC in section 2"), and hits "Save".
6. **Storage:** The finalized report is saved to the database.

## Generated Outputs
The generated summary should include:
- **Financial Recap:** Total sales, variance from expected (future).
- **Service Highlights:** Fastest ticket times, highest-selling server.
- **Service Lowlights:** Significant kitchen delays, voided items.
- **Inventory Alerts:** Items that were 86'd or are running low.

## Relationship with the AI
This workflow proves that the AI is not just a chat box. The same `Tool Registry` used for answering natural language questions is reused programmatically to generate background reports. 

## Future Enhancements
- Emailing or SMSing the shift summary to the GM or Owner automatically.
- Comparing the shift's performance against the same shift from the previous week to highlight trends.
