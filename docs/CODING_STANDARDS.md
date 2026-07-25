# Coding Standards

We maintain a strict, clean codebase to ensure long-term maintainability.

## TypeScript Conventions
- **Strict Mode**: Enabled. No implicit `any`.
- **Interfaces over Types**: Prefer `interface` for component props and object shapes.
- **Explicit Returns**: Exported utility functions should have explicit return types where inference is non-trivial.

## Component Organization
- **One Component Per File**: Never define multiple exported React components in a single file unless they are sub-components strictly isolated to that file (e.g., `Select` and `SelectItem`).
- **File Naming**: Always use `kebab-case.tsx` (e.g., `glass-card.tsx`, never `GlassCard.tsx`).
- **Directory Structure**: 
  - Group components by domain (`ui`, `landing`, `shared`, `restaurant`).

## React Hooks
- Custom hooks go in `hooks/`.
- Ensure all hooks are prefixed with `use`.
- Carefully manage dependency arrays in `useEffect` and `useCallback` to prevent infinite renders or stale closures.

## Styling Conventions
- We use **Tailwind CSS v4**.
- Use the `cn()` utility (clsx + tailwind-merge) for all conditional class joining:
  ```tsx
  className={cn("base-class", isActive && "active-class", className)}
  ```
- **Utility Ordering**: While we do not currently enforce an automated sorting plugin, attempt to logically group Tailwind classes: Layout -> Box Model -> Typography -> Visuals -> Transitions.

## Error Handling
- Use React Error Boundaries for catching UI crashes.
- Server Actions should return standardized error objects `({ error: string, data: null })` rather than throwing raw HTTP exceptions to the client.

## Documentation Expectations
- Complex business logic in `lib/` or `services/` should include JSDoc blocks.
- `docs/` is the single source of truth. If you introduce a major architectural pattern, update the appropriate markdown file.
