# Folder Structure

This document outlines the purpose of every major directory in the RestaurantOS repository.

## `/app`
The Next.js App Router root.
- **`(public)`**: Route group for the marketing and landing pages. Unauthenticated.
- **`(staff)`**: Route group for the core application (Dashboard, POS, KDS). Requires authentication.
- **`(dev)`**: Route group for isolated component testing and development sandboxes.
- **`globals.css`**: The core Tailwind v4 configuration, custom CSS keyframes, and global styles.

## `/components`
All React components.
- **`ui/`**: "Dumb" presentation components (Buttons, Inputs, Cards). No business logic.
- **`landing/`**: Components specific to the marketing site (Hero, Nav, Footer).
- **`shared/`**: Layouts and complex components used across the app (Sidebar, TopNav).
- **`restaurant/`**: Feature-specific components for the app (OrderTicket, TableMap).

## `/docs`
The single source of truth for project documentation. 
- **`archive/`**: Deprecated documentation from early sprints.

## `/lib`
Utility functions and shared logic.
- **`utils.ts`**: Contains the `cn()` utility for merging Tailwind classes.

## `/design-assets`
Inspiration, reference material, and raw assets.
- **`hero-sequence/`**: The raw 269 frames used for the GSAP canvas animation.
- *Note: Assets in this folder are for reference and are not imported directly into the production bundle.*

## `/public`
Static assets served directly by Next.js.
- Contains the optimized, compressed `.webp` frames for the canvas sequence.
- Fonts and favicons.
