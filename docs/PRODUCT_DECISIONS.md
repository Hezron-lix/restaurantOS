# 🧠 RestaurantOS: Architectural Decision Record & Product Strategy
**Engineering Tradeoffs & Future Enhancements (Immutable Contract)**

---

## 1. Executive Summary

This document (`PRODUCT_DECISIONS.md`) serves as the definitive log of major architectural choices, technical engineering tradeoffs, and future product enhancement pathways for **RestaurantOS**. Built during a competitive 3-day hackathon, our overarching principle is **Demo-First Optimization**: prioritizing simplicity, rock-solid execution stability, instantaneous user experience, and genuine operational problem-solving over inflated feature counts or enterprise ERP bloat.

---

## 2. Architectural Decision Records (ADRs)

### ADR-001: Single-Restaurant Operational Scope vs. Multi-Tenant ERP
- **Context**: Many SaaS platforms incorporate multi-tenant organization hierarchies from day one.
- **Decision**: RestaurantOS targets **ONE individual restaurant operational workspace exclusively**. Multi-tenant database foreign keys (`tenant_id`, `branch_id`) are completely omitted from Phase 1 implementation.
- **Tradeoff & Justification**: Implementing multi-tenancy introduces massive SQL query indexing overhead and complex tenancy resolution middleware that adds zero visible value to a live 5-minute hackathon evaluation. Optimizing for a single high-concurrency dine-in restaurant maximizes database speed and code readability.
- **Future Enhancement Path**: When scaling to post-hackathon commercial production, we will introduce a root `organizations` and `branches` table hierarchy and implement Supabase Row-Level Security (RLS) policies scoped to branch JWT claims.

---

### ADR-002: Next.js 15 Server Actions vs. Traditional REST API or GraphQL Engine
- **Context**: A communication protocol was required to bridge frontend interaction dashboards with backend PostgreSQL persistence.
- **Decision**: Standardize entirely on **Next.js 15 React Server Actions** paired with runtime **Zod schema validation** for all synchronous user interactions, rejecting traditional REST API routing boilerplate.
- **Tradeoff & Justification**: Developing dozens of individual `/api/v1/...` controllers consumes precious hackathon hours on manual input parsing and HTTP header parsing. Server Actions provide zero-overhead remote procedure calls with end-to-end TypeScript type reflection.
- **Exceptions**: Dedicated REST API endpoints are maintained strictly for asynchronous AI jobs (`/api/v1/ai/generate-insights`) and programmatic demo resets (`/api/v1/demo/reset`).

---

### ADR-003: Supabase PostgreSQL Realtime vs. Dedicated Microservices / Event Buses
- **Context**: Delivering sub-100ms synchronization across dining viewports requires real-time pub/sub distribution.
- **Decision**: Utilize native **Supabase PostgreSQL WebSockets and Change Data Capture (CDC)** channels, completely rejecting external event queues (RabbitMQ / Apache Kafka), Redis clusters, and standalone backend WebSocket servers.
- **Tradeoff & Justification**: Managing standalone message brokers inside a 3-day hackathon exponentially elevates infrastructure failure risks. Supabase natively streams table mutations across WebSockets directly into our frontend TanStack Query client caches.

---

### ADR-004: Pragmatic AI Operational Intelligence vs. Generative Customer Chatbots
- **Context**: Integrating AI into modern hackathons frequently results in implementing gimmicky conversational chatbots.
- **Decision**: Restrict AI capabilities strictly to **Predictive Ingredient Inventory Depletion** and **Manager Operational Demand Insights**, explicitly forbidding conversational bots.
- **Tradeoff & Justification**: Restaurant operators require proactive operational diagnostic warnings. Forecasting that *"Cheese will run out in approximately 45 minutes"* solves an authentic back-of-house crisis and demonstrates unmatched hackathon innovation.

---

### ADR-005: Eliminating Physical Hardware Complexities (No POS Hook / Thermal Printers)
- **Context**: True restaurant operating systems interact with specialized hardware such as receipt thermal printers and debit card terminals.
- **Decision**: Exclude real hardware drivers, simulated webhook payment gateway delays, and thermal printing IP connections.
- **Tradeoff & Justification**: Reliance on external network webhooks or brittle hardware integrations introduces unpredictable latency or presentation failure during live stage demonstrations. Transactions finalize instantly inside local relational persistence.

---

### ADR-006: Integer Monetary Storage vs. Floating Point Currencies
- **Context**: Handling financial transactions across menu pricing and tax aggregations requires numerical precision.
- **Decision**: Store all currency amounts as **Integers representing integer cents** (e.g., `$14.99` stored as `1499`) inside PostgreSQL and TypeScript models.
- **Tradeoff & Justification**: JavaScript floating-point calculations suffer from IEEE-754 rounding inaccuracies. Cent-based integer tabulation ensures absolute financial computation precision without heavyweight decimal transformation libraries.

---

### ADR-007: Deterministic Local AI Fallback Engine (Zero UI Downtime)
- **Context**: Hackathon evaluation stage Wi-Fi can drop, and external LLM provider APIs (Gemini/OpenAI) can experience latency spikes or rate limits during live demonstrations.
- **Decision**: Implement an automatic **Deterministic Local Statistical Fallback** inside `services/ai.ts` that calculates identical inventory runout windows and demand statistics when external cloud models fail.
- **Tradeoff & Justification**: Guaranteeing that the user interface never mutates, fails, or shows degradation warnings—whether powered by live cloud LLMs or local runtime math—ensures a 100% invincible demo presentation.

---

### ADR-008: Sprint-Based Milestone Execution Strategy
- **Context**: Managing feature dependencies across frontend and backend layers during a rapid hackathon requires structured discipline.
- **Decision**: Divide implementation into **8 rigorous sprints** (Sprint 1: Setup/Auth -> Sprint 2: Menu/Tables -> Sprint 3: Ordering -> Sprint 4: Kitchen -> Sprint 5: Waiter -> Sprint 6: Billing -> Sprint 7: Analytics -> Sprint 8: AI).
- **Tradeoff & Justification**: Demanding that every individual sprint leaves the codebase in a working, compilable state eliminates compilation breaks and guarantees that a demonstrable software version is ready for evaluation at any point in the hackathon lifecycle.
