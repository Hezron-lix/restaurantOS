# 09. Architectural Decisions

## Purpose
To maintain a log of significant architectural decisions (ADRs) made during the design of the RestaurantOS AI platform. This prevents future engineers from endlessly debating previously settled topics.

---

### Decision 1: The AI uses Structured Tools instead of direct Database Access
- **Context:** We need a way for the LLM to access restaurant data to answer questions.
- **Alternatives Considered:** Text-to-SQL (giving the LLM the schema and letting it write SQL queries).
- **Reasoning:** Text-to-SQL is fundamentally unsafe for a multi-tenant SaaS application. It risks data leakage across tenants, bypasses application-level RBAC, and can result in expensive/destructive queries. 
- **Trade-offs:** We have to manually write and maintain a "Tool" for every type of data the AI can access. This slows down initial feature velocity but guarantees security and correctness.

### Decision 2: The AI is Read-Only in Phase 1
- **Context:** The AI needs to be useful but safe.
- **Alternatives Considered:** Allowing the AI to make changes (e.g., comping items, closing checks) immediately.
- **Reasoning:** Trust must be established first. If the AI hallucinates a comp or closes the wrong check, trust in the system is destroyed immediately.
- **Future Implications:** When mutations are introduced in Phase 2, they must use a "Human in the Loop" confirmation UI pattern.

### Decision 3: The Restaurant Brain is a Stateless Middleware
- **Context:** Where does the AI logic live?
- **Alternatives Considered:** Building a separate Python/FastAPI microservice for the AI.
- **Reasoning:** RestaurantOS is a Next.js application. Keeping the Brain within the existing Next.js backend (API routes / Server Actions) allows it to seamlessly share the existing authentication, session management, and database client utilities.
- **Trade-offs:** We are constrained by Vercel/Next.js serverless timeout limits. If LLM responses take longer than the timeout, we may need to migrate to edge functions or WebSockets for streaming.

### Decision 4: Deterministic Outputs over Creative Persona
- **Context:** How should the AI "speak"?
- **Alternatives Considered:** Giving the AI a fun, quirky personality.
- **Reasoning:** In a high-stress restaurant environment, operators want fast, accurate data. Quirky personas become annoying after the third use.
- **Decision:** The temperature is set low. The system prompt enforces a concise, professional, data-first tone.

### Decision 5: No Heavy AI Frameworks (LangChain, LlamaIndex, etc.)
- **Context:** We need a way to orchestrate tool calls, prompt injection, and memory.
- **Alternatives Considered:** LangChain, LlamaIndex, CrewAI.
- **Reasoning:** Heavy frameworks often introduce unnecessary abstractions, steep learning curves, and opaque failure modes. For our specific use case (a stateless request/response loop with strict tool routing), standard modular TypeScript functions are more maintainable, debuggable, and performant.
- **Decision:** The Restaurant Brain will be built using clean, vanilla code (or lightweight utility libraries) rather than tying the architecture to a fast-moving, heavy AI framework.

### Decision 6: LLM Provider Agnosticism via Adapters
- **Context:** The AI landscape is shifting rapidly; the "best" model changes monthly.
- **Alternatives Considered:** Tying directly to the OpenAI SDK or Anthropic SDK.
- **Reasoning:** Hardcoding SDK-specific tool schemas and message formats into the Brain makes it extremely difficult to switch providers if a better model is released or if vendor pricing changes.
- **Decision:** The Brain will communicate with an abstract `LLM Provider Adapter`. This adapter standardizes tool schemas and message arrays, isolating vendor-specific logic to a single integration layer.
