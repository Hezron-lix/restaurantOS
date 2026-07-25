# Tech Stack

This document details the technologies used to build RestaurantOS.

## Core Framework
- **Next.js 15**: The React framework we use for routing (App Router), server-side rendering, and API routes.
- **React 19**: The underlying UI library.

## Styling & Design
- **Tailwind CSS v4**: Our primary styling engine. V4 allows us to drop the config file and define themes natively in CSS.
- **Lucide React**: The icon library used throughout the application for clean, consistent SVG icons.

## Motion & Animation
- **Framer Motion**: Used for declarative, component-level animations (mount/unmount, hover, in-view reveals).
- **GSAP (GreenSock)**: Used specifically for complex, scroll-linked timeline animations on the marketing site.
- **CSS Keyframes**: Used for ambient, continuous loops to ensure zero main-thread blocking.

## Future Integrations (Planned)
- **Supabase**: Will serve as our PostgreSQL database, Auth provider, and Realtime WebSocket engine for the Kitchen Display System.
- **Prisma or Drizzle**: ORM for type-safe database queries.
- **Zod**: Schema validation for forms and API endpoints.

## Why these technologies?
See [DECISIONS.md](DECISIONS.md) for deeper architectural reasoning.
