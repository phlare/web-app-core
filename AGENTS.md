This is a React SPA template built with Vite, React 19, TypeScript, and Tailwind CSS v4. There are no server-side components, APIs, or backend logic.

## Project guidelines

- Reusable SPA template for product frontends with auth, API client, routing, shell, and shared UI primitives
- This template must remain usable as a standalone repo. Do not rely on sibling repos, workspace-level skills, or cross-repo local documentation for required setup or usage guidance
- Node 24 is pinned in `.nvmrc`; run `nvm use` from the repo root if the shell is on the wrong version
- Commit workflow: `.claude/instructions/commit_workflow.md`
- Dependabot PR merging: `.claude/instructions/dependabot_workflow.md`
- CI/CD setup: `.claude/instructions/ci_cd.md`
- Only `src/main.tsx` reads `import.meta.env` — all other modules receive config via props or function arguments
- All success responses from the backend use: `{ "data": { ... } }`
- All error responses use: `{ "error": { "code": "...", "message": "...", "details": {} } }`
- Use Tailwind CSS utility classes for styling — no inline styles, CSS modules, or styled-components
- Use function components with named exports — no default exports, no class components (exception: `ErrorBoundary` is a class component, required by React)
- Use `ApiClient` via constructor injection — never call `fetch` directly for backend requests
- Use `ApiError` from `src/lib/api-error.ts` for typed API errors — check `error.code` and `error.statusCode`
- If referencing companion templates such as `elixir-api-core` or `node-edge-core`, use GitHub links in docs rather than local filesystem assumptions

## TypeScript guidelines

- Strict mode is enabled (`strict: true` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`)
- Use `type` imports for type-only imports: `import type { ReactNode } from "react"`
- Do NOT use `.js` extensions in import paths (Bundler module resolution, not NodeNext)
- Prefix unused parameters with `_` (configured in ESLint)
- Prefer `unknown` over `any`
- Use `interface` for component props and object shapes, `type` for unions/intersections/utility types

## Testing guidelines

- Use Vitest with explicit imports (`import { describe, it, expect } from "vitest"`) — no globals
- Test files mirror the `src/` directory structure under `test/`
- Use `render` and `screen` from `@testing-library/react` for component tests
- Use `renderWithProviders` from `test/helpers.tsx` when testing components that need ToastProvider
- DOM matchers from `@testing-library/jest-dom` are available via `test/setup.ts`
- MSW handlers in `test/mocks/handlers.ts` provide realistic API fixtures — use `server.use()` for per-test overrides

## Formatting and linting

- Use `npm run precommit` when you are done with all changes and fix any pending issues
- Prettier handles formatting (run `npm run format`)
- ESLint 9 flat config with `typescript-eslint`, `react-hooks`, and `react-refresh` (run `npm run lint`)
- CI checks `format:check` and `lint`

## Commands

- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Test suite: `npm test`
- Typecheck: `npm run typecheck`
- Pre-commit: `npm run precommit`

## Current Status

- `v0.4` complete
- See `CHANGELOG.md` for the final template task tracker
