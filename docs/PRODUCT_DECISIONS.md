# 🧠 RestaurantOS: Architectural Decision Record & Product Strategy
**Engineering Tradeoffs & Future Enhancements (Immutable Contract)**

---

## 1. Executive Summary

This document (`PRODUCT_DECISIONS.md`) serves as the definitive log of major architectural choices, technical engineering tradeoffs, and future product enhancement pathways for **RestaurantOS**. Built during a competitive 3-day hackathon, our overarching principle is **Demo-First Optimization**: prioritizing simplicity, rock-solid execution stability, instantaneous user experience, and genuine operational problem-solving over inflated feature counts or enterprise ERP bloat.

---

## 2. Architectural Decision Records (ADRs)

### ADR-001: Single-Restaurant Operational Scope vs. Multi-Tenant ERP
- **Context**: Many SaaS platforms incorporate multi-tenant organization hierarchies (chains, multi-branch franchises, complex region hierarchies) from day one.
- **Decision**: RestaurantOS targets **ONE individual restaurant operational workspace exclusively**. Multi-tenant database foreign keys (`tenant_id`, `branch_id`) are completely omitted from Phase 1 implementation.
- **Tradeoff & Justification**: Implementing multi-tenancy introduces massive SQL query indexing overhead, complex JWT tenancy resolution middleware, and UI scaffolding that adds zero visible value to a live 5-minute hackathon evaluation. Optimizing for a single high-concurrency dine-in restaurant maximizes database speed and code readability.
- **Future Enhancement Path**: When scaling to post-hackathon commercial production, we will introduce a root `organizations` and `branches` table hierarchy, append indexed `branch_id` foreign keys to all operational tables (`orders`, `tables`, `menu_items`), and implement Supabase Row-Level Security (RLS) policies scoped to branch JWT claims.

---

### ADR-002: Next.js 15 Server Actions vs. Traditional REST API or GraphQL Engine
- **Context**: A communication protocol was required to bridge frontend interaction dashboards with backend PostgreSQL persistence.
- **Decision**: Standardize entirely on **Next.js 15 React Server Actions** paired with runtime **Zod schema validation** for all synchronous user interactions, rejecting traditional REST API routing boilerplate and GraphQL setups.
- **Tradeoff & Justification**: Developing dozens of individual `/api/v1/...` controllers consumes precious hackathon hours on manual input parsing, HTTP header parsing, and serialization boilerplate. Server Actions provide zero-overhead remote procedure calls (RPC) with end-to-end TypeScript type reflection and automatic query-key cache invalidations.
- **Exceptions**: Dedicated REST API endpoints are maintained strictly for asynchronous AI scheduled jobs (`/api/v1/ai/generate-insights`) and demo test database resets (`/api/v1/demo/reset`).

---

### ADR-003: Supabase PostgreSQL Realtime vs. Dedicated Microservices / Event Buses
- **Context**: Delivering sub-100ms synchronization between Customer QR phones, Kitchen KDS monitors, Waiter tablets, and Cashier desktops requires real-time pub/sub distribution.
- **Decision**: Utilize native **Supabase PostgreSQL WebSockets and Change Data Capture (CDC)** channels, completely rejecting external event queues (RabbitMQ / Apache Kafka), Redis pub/sub clusters, and specialized backend Node.js WebSocket microservices.
- **Tradeoff & Justification**: Managing standalone message brokers or distributed microservices inside a 3-day hackathon exponentially elevates infrastructure failure risks and latency bottlenecks. Supabase natively streams PostgreSQL table inserts/updates across active WebSocket channels directly into our frontend TanStack Query client caches with zero server overhead.

---

### ADR-004: Pragmatic AI Operational Intelligence vs. Generative Customer Chatbots
- **Context**: Integrating AI into modern hackathons frequently results in implementing gimmicky conversational chatbots for food ordering or open-ended customer support.
- **Decision**: Restrict AI capabilities strictly to **Predictive Ingredient Inventory Depletion** and **Manager Operational Demand Insights**, explicitly forbidding conversational bots.
- **Tradeoff & Justification**: Restaurant owners and operational staff do not want chat interfaces; they require proactive operational diagnostic warnings. Forecasting that *"Cheese will run out in approximately 45 minutes"* based on live ticket velocity solves an authentic back-of-house crisis and demonstrates unmatched hackathon innovation.

---

### ADR-005: Eliminating Physical Hardware Complexities (No POS Hook / Thermal Printers)
- **Context**: True restaurant operating systems interact with specialized hardware such as receipt thermal printers, physical debit card terminals, and hardware kitchen bells.
- **Decision**: Exclude real hardware drivers, simulated webhook payment gateway delays (Stripe/Square hooks), and thermal printing IP connections.
- **Tradeoff & Justification**: Reliance on external network webhooks or brittle hardware integrations introduces unpredictable latency or presentation failure during live evaluation stage demonstrations. Transactions finalize instantly inside local relational persistence, guaranteeing a 100% deterministic and flawless demo journey.

---

### ADR-006: Integer Monetary Storage vs. Floating Point Currencies
- **Context**: Handling financial transactions across menu pricing, bill split calculations, and tax aggregations requires numerical precision.
- **Decision**: Store all currency amounts as **Integers representing integer cents** (e.g., `$14.99` stored as `1499`) inside PostgreSQL and TypeScript models.
- **Tradeoff & Justification**: JavaScript and standard SQL floating-point calculations suffer from IEEE-754 rounding inaccuracies (e.g., `0.1 + 0.2 = 0.30000000000000004`). Cent-based integer tabulation ensures absolute financial computation precision across cashier checkouts and manager revenue analytics without requiring heavyweight decimal transformation libraries.
