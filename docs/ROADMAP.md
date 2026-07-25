# Roadmap

This document outlines the high-level milestones for RestaurantOS.

## Completed Milestones

### ✅ Sprint 1-4: The Foundation & Landing Experience
- Configured Next.js 15, Tailwind v4, and TypeScript.
- Established design tokens and typography.
- Built reusable UI primitives (`Button`, `GlassCard`, `TiltCard`).
- Implemented the GSAP ScrollTrigger canvas hero sequence (269 frames).
- Finalized cinematic micro-interactions, entrance animations, and ambient backgrounds.
- Created comprehensive documentation (this directory).

---

## Upcoming Milestones

### 1. Authentication
**Objectives**: Secure the `(staff)` route group.
**Deliverables**: 
- Login UI.
- Supabase Auth integration.
- Role-based redirection (Manager vs Kitchen).
**Dependencies**: Supabase project setup.

### 2. Dashboard Shell
**Objectives**: Create the authenticated layout skeleton.
**Deliverables**:
- Persistent sidebar navigation.
- Top-level header with user profile.
- Responsive handling for tablets (the primary target device).

### 3. Restaurant Onboarding
**Objectives**: Allow a new restaurant to set up their profile.
**Deliverables**:
- Step-by-step wizard.
- Floor plan / Table mapping tool basic setup.

### 4. Tables & Orders
**Objectives**: Core POS functionality.
**Deliverables**:
- Interactive floor plan view.
- Ability to open a table and add items.
- Order ticket generation.

### 5. Kitchen Display System (KDS)
**Objectives**: Digitizing the back-of-house.
**Deliverables**:
- Real-time order queue (Supabase WebSockets).
- Ticket statuses (Prep, Cooking, Ready).
- "Bump" functionality to clear tickets.

### 6. Menu Management
**Objectives**: Allow managers to update offerings.
**Deliverables**:
- CRUD interface for Categories, Items, and Modifiers.
- 86ing (marking items out of stock).

### 7. Payments
**Objectives**: Settle checks.
**Deliverables**:
- Split check logic.
- Stripe Terminal / generic payment gateway mockup.

### 8. Inventory
**Objectives**: Track stock levels based on sales.
**Deliverables**:
- Recipe-to-ingredient mapping.
- Low stock alerts.

### 9. Analytics
**Objectives**: Provide actionable business insights.
**Deliverables**:
- Sales over time charts.
- Top selling items.
- Peak hour predictions.

### 10. AI Assistant
**Objectives**: Integrate LLM capabilities.
**Deliverables**:
- "Predictive prep" suggestions (e.g., "Thaw 20 steaks based on tonight's reservations").
- Conversational query interface ("How many covers did we do last Tuesday?").

### 11. Production & Testing
**Objectives**: Prepare for launch.
**Deliverables**:
- E2E testing with Playwright.
- Load testing Supabase realtime connections.
- Final accessibility audits.
