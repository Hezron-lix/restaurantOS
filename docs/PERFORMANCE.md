# Performance

Performance is a feature. In a restaurant environment, the software must be instantly responsive.

## Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: < 2.5s (Targeting < 1.0s on the landing page).
- **First Input Delay (FID)**: < 100ms.
- **Cumulative Layout Shift (CLS)**: 0.1 or less (Targeting 0 through strict layout containment).

## Animation Performance
- **GPU Acceleration**: We exclusively animate `transform` and `opacity` properties. We never animate `top`, `left`, `width`, or `height` unless absolutely necessary (and typically only via layout transitions in Framer Motion).
- **Will-Change**: Used sparingly on complex animated elements to hint the browser to composite them on a separate layer.

## Image Optimization
- **Canvas Sequence**: The hero uses 269 distinct frames. These must be heavily compressed as `.webp` files.
- **Preloading Strategy**: We preload the first 10-20 frames so the initial render is immediate, and iteratively fetch the rest in the background without blocking the main thread.
- **Next/Image**: All standard images utilize the `<Image>` component from Next.js for automatic srcset generation and WebP conversion.

## Bundle Optimization
- **Code Splitting**: Next.js automatically splits code by route.
- **Lazy Loading**: Heavy components (e.g., the 3D map of a restaurant floor plan) should be dynamically imported (`next/dynamic`) so they do not block the initial page load.

## Caching Strategy (Planned)
As we implement the backend:
- Stale-While-Revalidate (SWR) patterns will be used for menu items and inventory.
- WebSockets will be used for time-critical data (KDS orders), bypassing standard HTTP caching entirely.
