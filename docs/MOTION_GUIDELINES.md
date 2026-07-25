# Motion Guidelines

"Imagine the page is breathing. Not dancing."

Premium software feels alive through subtlety, not spectacle. If an animation draws attention to itself, it is too strong.

## Animation Philosophy
- **Physicality**: Elements should feel like they have mass. Hover interactions lift objects (e.g., cards tilting) and press them down (e.g., buttons scaling to 95%).
- **Ambient Life**: The UI should never feel entirely static. We use extremely slow CSS keyframes (10-40 seconds) to shift background glows, slowly float cards (`±3px`), and gently pulse indicator lights.
- **Cinematic Pacing**: Animations take their time. A standard reveal is 900ms to 1200ms. We do not rush.

## Easing Curves
We avoid default linear or standard ease-in-out curves for UI elements.
Our primary premium easing curve for Framer Motion is:
```typescript
ease: [0.16, 1, 0.3, 1] // A strong, smooth Apple-style ease-out
```

## Hover Interactions
- **Cards**: `hover:-translate-y-2` (soft lift), combined with enhanced ambient shadow glows (`hover:shadow-[...]`) and a slow, internal glass reflection sweeping across (`opacity-100` transition).
- **Buttons**: `hover:-translate-y-1`, `active:scale-95`. We avoid aggressive scaling up.
- **Duration**: Hover interactions typically use `duration-500` or `duration-700` with `ease-out`.

## What NOT to Animate
- **Typography Reading Blocks**: Paragraphs of text must remain stable. We can reveal them sequentially when they first enter the viewport, but we do NOT use character-by-character reveals, and they must never animate continuously.
- **Layout Flow**: Avoid animating properties that trigger browser layout recalculations (`width`, `height`, `margin`, `padding`).

## Animation Technologies
1. **CSS Keyframes (`globals.css`)**: Used for all infinite/ambient animations (`animate-breathe`, `animate-ambient-shift`). Guaranteed 60fps GPU acceleration.
2. **Framer Motion**: Used for scroll-triggered entrance reveals (`<InView>`) and component mounting/unmounting transitions.
3. **GSAP + ScrollTrigger**: Used EXCLUSIVELY for complex, pinned sequence storytelling (e.g., the landing page `<SequenceHero>`).

## Accessibility
All motion must respect system preferences. Where possible, heavily animated components must wrap animations in a `prefers-reduced-motion` check or rely on Tailwind's built-in reduced motion modifiers.
