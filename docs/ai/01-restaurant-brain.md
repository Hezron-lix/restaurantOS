# 01. The Restaurant Brain

## Purpose
To define the responsibilities and design of the "Restaurant Brain," the core orchestrator module of the AI platform.

## Scope
The Restaurant Brain acts as the central middleware between the User Interface, the Application Services, and the LLM. It is completely independent of any specific LLM provider or orchestration framework (e.g., LangChain). It handles all conversational context, routing, security, and observability.

## Core Responsibilities

1. **Authentication & Authorization:** 
   Validates the user session and applies Role-Based Access Control (RBAC). Ensures that front-of-house staff cannot access management-tier tools.
   
2. **Intent Detection & Tool Routing:**
   Analyzes the user's query to determine their goal before invoking complex reasoning. Maps the detected intent to a strict subset of tools from the Tool Registry to minimize context window bloat and reduce latency.

3. **Context Injection & Conversation State:**
   Manages the short-term memory of the conversation. Automatically injects necessary implicit context (current time, user role, restaurant ID, shift ID) into the system prompt so the LLM has situational awareness.

4. **LLM Provider Adapter:**
   The Brain communicates with external LLMs through an abstract `LLM Provider Adapter`. It does not rely on specific vendor SDK implementations at the orchestration layer, ensuring we can swap providers seamlessly.

5. **Streaming & Response Formatting:**
   Handles the real-time streaming of text chunks back to the client. Can intercept structured JSON if the LLM requests a specific UI component to be rendered.

6. **Logging & Observability:**
   Records every prompt, tool call, latency metric, and token count. Integrates with observability platforms to monitor AI performance, costs, and hallucination rates in production.

7. **Error Handling, Retries & Fallbacks:**
   Gracefully handles timeouts, rate limits, or LLM parsing errors. If a tool fails, the Brain catches the error and instructs the LLM to explain the failure to the user, rather than crashing. Includes logic for automatic retries on transient network failures.

8. **Rate Limiting:**
   Protects the system from abuse or runaway token costs by rate-limiting requests per user, per restaurant, and per shift.

## Architecture & Extensibility

The Brain sits exclusively on the server (e.g., Next.js API Routes or Server Actions). It is designed as a set of modular, framework-agnostic functions.

**Data Flow:**
1. Client sends `query` + `metadata`.
2. Brain validates session, applies Rate Limiting.
3. Brain detects Intent and selects relevant Tools.
4. Brain constructs prompt and passes to `LLM Provider Adapter`.
5. Adapter calls the actual LLM Provider.
6. LLM requests a Tool.
7. Brain executes the Tool, which delegates to `Application Services`.
8. Tool result returns to Brain, Brain returns it to LLM via Adapter.
9. Final response streams back to Client.

By keeping the Brain stateless and modular, future capabilities (like proactive alerts or cron-triggered summaries) can reuse the same pipeline without redesign.
