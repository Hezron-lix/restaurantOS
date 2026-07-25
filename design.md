# RestaurantOS Design Principles

This document outlines the core design choices and aesthetic guidelines that drive the RestaurantOS platform.

## 1. Core Philosophy
- **The Restaurant is the Product**: RestaurantOS serves as the invisible intelligence that brings the restaurant to life. The software should feel like a natural, premium extension of a high-end hospitality experience.
- **Cinematic & Story-Driven**: Every interaction and layout should follow a narrative arc. Instead of disjointed "features", we present an orchestrated flow of capabilities.
- **Premium, Calm, and Modern**: Draw inspiration from industry leaders in design such as Apple, Linear, and Stripe. Avoid generic SaaS templates or flashy gimmicks. The interface should inspire confidence through its calmness.

## 2. Visual Language
- **Generous Whitespace**: Let elements breathe. Dense, cluttered interfaces cause cognitive fatigue. We prioritize a strong visual rhythm with large, intentional spacing.
- **Large Typography & Minimal Copy**: Communicate ideas immediately. If an idea takes a paragraph to explain, the design has failed. We rely on large, striking typography (e.g., Inter or similar modern sans-serif fonts) paired with highly concise supporting text.
- **Curated Color Palette**: Avoid default or generic RGB colors (plain red, blue, green). We utilize a sophisticated, dark-mode-first aesthetic with subtle, harmonious gradients, glassmorphism (used sparingly for depth), and muted accent tones (like amber and emerald for statuses).

## 3. Motion and Interaction
- **Everything Feels Alive**: Nothing should ever feel completely static, but motion must never be overwhelming. We use subtle micro-interactions to guide the user's attention and provide tactile feedback.
- **Performance First**: All animations (via GSAP and Framer Motion) are GPU-accelerated (`transform`, `opacity`). The UI must remain at a silky-smooth 60fps, even during heavy scroll-scrubbed canvas sequences.
- **Core Motion Primitives**:
  - **InView**: Graceful fade-ups and reveals as elements enter the viewport.
  - **TextEffect**: Staggered character and word reveals for cinematic typography.
  - **TiltCard**: Subtle 3D rotational tilt effects on hover to add depth to interactive elements.
  - **Sequence Heroes**: Scrubbable, requestAnimationFrame-driven image sequences for high-impact storytelling without the overhead of heavy `<video>` tags.

## 4. Architecture
- **Token-Driven**: All spacing, typography, colors, and motion durations are strictly governed by our Tailwind CSS `@theme` tokens to ensure pixel-perfect consistency across the entire application.
- **Reusable Components**: We do not duplicate code. If an interaction pattern is needed, it is built as an abstracted, reusable primitive inside `components/ui/`.
