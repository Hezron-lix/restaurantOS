# Features Directory

RestaurantOS uses a Feature-Sliced Design pattern to prevent the `components/` and `services/` folders from becoming monolithic.

## Structure

Each distinct business domain should have its own folder inside `features/` containing its isolated logic.

A standard feature module looks like this:

```text
features/[module-name]/
├── api/           # React Query hooks and Server Actions
├── components/    # Feature-specific UI
├── store/         # Zustand store slice isolated to this feature
├── types/         # Zod schemas and TS interfaces
├── hooks/         # Feature-specific custom hooks
└── validations/   # Validation logic
```

## Rules

1. **Isolation**: Features may import from `components/ui` or `lib/`, but they **must not** import directly from other feature slices to prevent circular dependencies. If two features need to communicate, use the global Event Bus (`lib/events.ts`), or lift the shared logic to a shared global location.
2. **State Management**: The root `store/app-store.ts` is ONLY for global UI state (like the Command Palette). If a feature needs complex synchronous state (e.g., POS active order ticket, Kitchen filtering), it MUST create its own Zustand store inside `features/[module-name]/store/`.
