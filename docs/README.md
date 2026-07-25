# RestaurantOS

Welcome to **RestaurantOS**, the definitive operating system for modern restaurants.

## Vision
Our vision is to elevate the restaurant experience by creating a quiet, intelligent platform that orchestrates everything from front-of-house reservations to back-of-house kitchen displays and predictive analytics. 

## Mission
"The restaurant is the product." 
RestaurantOS is the invisible intelligence that comes to life around the restaurant. We reject generic SaaS interfaces in favor of calm, premium, cinematic, and deeply physical software that staff enjoy using.

## Current Progress
We have completed **Sprint 4**, successfully delivering a world-class landing page that introduces the brand and establishes our foundational motion and design systems. We are now preparing to build the core application dashboard and feature set.

## Repository Structure

```text
restaurant-os/
├── app/               # Next.js App Router (Routing & Pages)
│   ├── (public)/      # Unauthenticated landing & marketing
│   ├── (staff)/       # Authenticated restaurant staff dashboard
│   └── (dev)/         # Development playgrounds and component tests
├── components/        # React Components
│   ├── ui/            # Reusable primitive blocks (buttons, cards)
│   ├── landing/       # Components specific to the marketing site
│   └── shared/        # Components shared across the application
├── lib/               # Utility functions (e.g., tailwind `cn`)
├── docs/              # You are here (Single Source of Truth)
└── design-assets/     # Inspiration, spline exports, and static assets
```

## Where to Begin
If you are a new developer joining the project, please read these documents in the following order to understand how we build RestaurantOS:

1. [Brand Guidelines](BRAND_GUIDELINES.md) - Understand our tone and philosophy.
2. [Architecture](ARCHITECTURE.md) - Understand how the codebase is structured.
3. [Design System](DESIGN_SYSTEM.md) - Learn our visual language.
4. [Motion Guidelines](MOTION_GUIDELINES.md) - Learn how we bring the UI to life.
5. [Roadmap](ROADMAP.md) - See what we are building next.
6. [Contributing](CONTRIBUTING.md) - Learn our PR and commit conventions.

## Documentation Directory

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | This document. |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System structure, routing, and state. |
| [ROADMAP.md](ROADMAP.md) | Milestones and deliverables. |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Typography, colors, and layout rules. |
| [MOTION_GUIDELINES.md](MOTION_GUIDELINES.md) | GSAP, Framer Motion, and CSS animation rules. |
| [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) | Inventory of reusable UI elements. |
| [BRAND_GUIDELINES.md](BRAND_GUIDELINES.md) | Personality, voice, and visual identity. |
| [CODING_STANDARDS.md](CODING_STANDARDS.md) | ESLint, TypeScript strictness, and naming. |
| [DECISIONS.md](DECISIONS.md) | Architectural Decision Log (ADL). |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to commit and open pull requests. |
| [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) | Detailed directory breakdown. |
| [TECH_STACK.md](TECH_STACK.md) | Core technologies and why they were chosen. |
| [PERFORMANCE.md](PERFORMANCE.md) | Core Web Vitals and 60fps targets. |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | ARIA, focus, and reduced motion. |
| [FUTURE_IDEAS.md](FUTURE_IDEAS.md) | Backlog of experimental concepts. |
