# Component Library

RestaurantOS utilizes a bespoke component library combining shadcn/ui foundations with heavily customized premium components.

## Core UI Primitives (`components/ui/`)

### `<Button>`
- **Purpose**: Standard interactive triggers.
- **Variants**: Default, Secondary, Ghost, Link. 
- **States**: Includes custom `.glow-brand` and hover/active states (`active:scale-95`).
- **Source**: `components/ui/button.tsx`

### `<GlassCard>`
- **Purpose**: Premium surface for containing content.
- **Usage**: Automatically applies deep background blurs and subtle border opacities. Designed to be wrapped by `<Tilt>` or floated using ambient CSS classes.
- **Source**: `components/ui/glass-card.tsx`

### `<Tilt>`
- **Purpose**: Wraps any element to give it physical 3D tilt tracking the user's cursor.
- **Props**: `rotationFactor` (default `5` degrees), `isReverse`.
- **Source**: `components/ui/tilt-card.tsx`

### `<InView>`
- **Purpose**: Wrapper for cinematic scroll-entrance animations.
- **Usage**: Automatically applies our standard `[0.16, 1, 0.3, 1]` ease. Includes default `blur(4px)` to sharp reveals.
- **Source**: `components/ui/in-view.tsx`

### `<TextEffect>`
- **Purpose**: Word-by-word or line-by-line staggered text reveals.
- **Usage**: Use sparingly for headings. Avoid using on dense body copy.
- **Source**: `components/ui/text-effect.tsx`

## Domain Specific Components

### `<SequenceHero>`
- **Purpose**: The pinned GSAP image sequence canvas player.
- **Location**: `components/landing/sequence-hero.tsx`
- **Usage**: Marketing site only. Requires a pre-rendered image sequence payload.

### `<Navbar>` & `<Footer>`
- **Purpose**: Standard layout wrappers for the `(public)` route group.
- **Location**: `components/landing/`

## Guidelines for New Components
1. **Do not duplicate implementation**: If a component needs a new variant, extend its `cva` definitions rather than duplicating the file.
2. **Strict File Naming**: `kebab-case.tsx`
3. **No Business Logic**: `components/ui/` components must remain pure UI primitives.
