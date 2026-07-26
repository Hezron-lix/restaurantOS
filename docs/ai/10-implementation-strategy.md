# 10. Implementation Strategy

## Purpose
To define the methodology for rolling out the AI architecture described in these documents, ensuring risk is minimized during initial implementation.

## Sprint 1: The "Tracer Bullet" Approach

Instead of building the entire Tool Registry and complex intent detection simultaneously, Sprint 1 must focus exclusively on a **Tracer Bullet** implementation.

A tracer bullet is a single, end-to-end vertical slice of the architecture that validates the entire pipeline from UI to Database and back, without breadth.

### The Objective
Implement exactly **one** tool for Sprint 1. The recommended tool is: `getSalesSummary`.

### The Pipeline Validation
This single tool must validate the full stack:
1. **The UI:** Chat interface, metadata injection, and streaming text rendering.
2. **The Brain:** Authentication, basic rate limiting, observability logging, and prompt construction.
3. **The LLM Adapter:** Successfully translating our internal tool schema to the LLM provider's format.
4. **The Tool Layer:** Parsing the LLM request, validating arguments, and enforcing RBAC.
5. **The Application Service:** Fetching the actual data from Supabase without the Tool knowing about SQL.
6. **The Response:** Streaming the final synthesized answer back to the user seamlessly.

### Why This Matters
By proving the entire architecture works for one simple read-only tool, we mitigate systemic risks (like serverless timeouts, streaming complexities, and provider latency) early. We validate our abstractions (like the `LLM Provider Adapter` and `Application Services`). 

Once the tracer bullet is successful, scaling the platform by rapidly adding the remaining tools (Table Intelligence, Kitchen Intelligence) becomes a predictable, repeatable process.

### Note on Tool Routing (Intent Detection)
The current implementation strategy leverages the LLM provider's native `tool_choice: "auto"` capability. This allows the LLM to implicitly determine intent based on the Tool Registry's schemas. If the tool registry grows significantly and context window limitations or latency issues arise, this should be replaced by an explicit heuristic or small-model semantic routing layer (Intent Detection) in the Restaurant Brain.
