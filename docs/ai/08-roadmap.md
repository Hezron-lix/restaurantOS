# 08. Roadmap

## Purpose
To clearly delineate what is in scope for Phase 1 vs. what belongs to future development phases. This ensures the current architecture remains focused while being extensible enough to support future modules.

## Phase 1 (Current Focus)
- Read-only queries via natural language.
- Real-time operational intelligence (Tables, Orders, Kitchen, Sales, Staff).
- The Restaurant Brain and Tool Router architecture.

## Phase 2: Actionable AI (Mutations)
Once the read-only foundation is stable, the AI will be permitted to execute actions *with human-in-the-loop confirmation*.
- **Examples:** 
  - "Comp the drinks on Table 4." -> AI stages the comp, UI prompts Manager to click "Confirm".
  - "Assign John to the patio." -> AI stages the assignment, UI prompts for confirmation.

## Phase 3: Inventory & Supply Chain
Integrating the AI with backend inventory management.
- **Features:** 
  - "How many cases of tomatoes do we need to order for the weekend?"
  - Automated waste tracking analysis.
  - Predictive ordering based on upcoming reservations.

## Phase 4: Advanced Forecasting (Machine Learning)
Moving beyond LLMs to integrate actual ML models for time-series forecasting.
- **Features:**
  - Predicting labor requirements based on weather, local events, and historical data.
  - Granular sales forecasting.
  - *Note: LLMs are not good at statistical forecasting. This phase will require separate ML infrastructure, with the LLM acting only as the natural language interface to the ML model's outputs.*

## Phase 5: Voice Interfaces
- Hands-free operation for BOH staff ("86 the salmon") and FOH staff via wearables or localized tablets.
