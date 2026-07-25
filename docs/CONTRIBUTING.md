# Contributing

We welcome contributions to RestaurantOS. Please follow these guidelines to ensure a smooth code review process.

## Branch Naming
Use the following prefixes for your branches:
- `feat/`: A new feature (e.g., `feat/kitchen-display`)
- `fix/`: A bug fix (e.g., `fix/login-redirect`)
- `chore/`: Maintenance, dependency updates, or documentation (e.g., `chore/update-readme`)
- `refactor/`: Code structure changes that do not alter behavior.

## Commit Message Conventions
We follow conventional commits:
```text
<type>(<scope>): <subject>

<body>
```
**Example**:
`feat(auth): integrate Supabase login modal`

## Pull Request Expectations
- **Self-Review**: Always review your own diff before requesting a review.
- **Visuals**: If your PR alters the UI, include a screenshot or a short screen recording in the PR description.
- **Scope**: Keep PRs small and focused. Do not mix refactoring with feature work.

## Testing Expectations
- Run `npm run lint` and `npx tsc --noEmit` before submitting a PR.
- As the project matures and Playwright E2E tests are introduced, ensure all tests pass in CI.

## Documentation Requirements
- If you add a new reusable component to `components/ui/`, you must update `docs/COMPONENT_LIBRARY.md`.
- If you introduce a new dependency or architectural pattern, log it in `docs/DECISIONS.md`.
