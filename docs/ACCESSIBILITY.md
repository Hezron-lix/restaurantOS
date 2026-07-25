# Accessibility

RestaurantOS must be usable by everyone, regardless of environment or capability.

## Keyboard Navigation & Focus Management
- **Visible Focus**: We use high-contrast focus rings (`focus:ring-brand focus:ring-offset-zinc-950`) so it is always clear where focus is on the screen.
- **Modals and Dialogs**: Focus must be trapped inside modals when they are open, and returned to the triggering element when closed.
- **Custom Components**: Custom elements (like our Tilt cards) must still be fully tabbable if they contain interactive elements.

## ARIA Usage
- Use semantic HTML (`<nav>`, `<main>`, `<article>`) first.
- Use ARIA roles only when semantic HTML falls short (e.g., `role="alert"` for a new high-priority order popping up on the KDS).

## Contrast
- We aim for WCAG AA compliance (4.5:1 for normal text).
- Given our dark theme, we use `text-zinc-400` as the minimum brightness for body copy against a `bg-zinc-950` or `bg-black` background.

## Screen Readers
- Use `sr-only` classes to provide context to screen readers where visual context is implied (e.g., an icon-only button must have an `sr-only` span explaining its action).

## Reduced Motion
- We respect the user's OS-level motion preferences.
- Heavy animations (GSAP canvas, Framer Motion reveals) should be disabled or severely simplified if `prefers-reduced-motion: reduce` is active.
- CSS animations can use the Tailwind `motion-reduce:` modifier to snap to final states.
