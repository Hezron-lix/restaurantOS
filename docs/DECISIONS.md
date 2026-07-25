# Architectural Decision Log (ADL)

This document records the major architectural decisions made during the development of RestaurantOS.

## 1. GSAP + Canvas for the Hero Sequence
**Date**: Sprint 4
**Context**: We needed a cinematic, Apple-style product reveal as the user scrolled on the landing page.
**Decision**: We chose an image sequence rendered onto a `<canvas>` controlled by GSAP `ScrollTrigger` rather than a standard `<video>` element.
**Reasoning**: Video elements do not scrub smoothly backward and forward tied to the scroll wheel due to keyframe decoding issues. A pre-rendered image sequence allows frame-perfect, bidirectional scroll scrubbing.
**Consequences**: The asset size is large (269 frames), requiring careful preload logic in `components/landing/sequence-hero.tsx` to prevent blank screens on initial load.

## 2. Framer Motion for Micro-Interactions
**Context**: We need smooth entrance animations and layout transitions across the app.
**Decision**: We use Framer Motion alongside GSAP.
**Reasoning**: While GSAP is powerful for complex master-timeline scrolling, Framer Motion is much more ergonomic for standard React component lifecycle animations (mounting, unmounting, simple `whileHover`).
**Consequences**: We accept a slight increase in bundle size to maintain developer ergonomics for standard UI elements.

## 3. Tailwind CSS v4
**Context**: We needed a styling solution that supported rapid iteration and strict design tokens.
**Decision**: We opted for the bleeding-edge Tailwind v4.
**Reasoning**: v4 allows us to define all our CSS variables and theme configuration directly inside `globals.css` using standard CSS syntax (`@theme`), dropping the heavy `tailwind.config.js`. This creates a cleaner, more native CSS experience.

## 4. Single Narrative Scroll Architecture
**Context**: The landing page originally featured multiple pinned sections and nested parallax effects.
**Decision**: We rolled back to a single master GSAP canvas hero, and standard linear scrolling for the rest of the page.
**Reasoning**: Multiple overlapping pinned sections caused layout instability, jumpy scrolling, and broke the user's mental model of the page.
**Consequences**: Entrance animations for sections below the hero now rely strictly on simple Framer Motion `InView` reveals rather than scroll hijacking.
