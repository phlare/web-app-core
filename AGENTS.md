This is a React SPA template built with Vite, React 19, TypeScript, and Tailwind CSS v4. There are no server-side components, APIs, or backend logic.

## Project guidelines

- Only `src/main.tsx` reads `import.meta.env` — all other modules receive config via props or function arguments
- All success responses from the backend use: `{ "data": { ... } }`
- All error responses use: `{ "error": { "code": "...", "message": "...", "details": {} } }`
- Use Tailwind CSS utility classes for styling — no inline styles, CSS modules, or styled-components
- Use function components with named exports — no default exports, no class components

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
- DOM matchers from `@testing-library/jest-dom` are available via `test/setup.ts`

## Formatting and linting

- Use `npm run precommit` when you are done with all changes and fix any pending issues
- Prettier handles formatting (run `npm run format`)
- ESLint 9 flat config with `typescript-eslint`, `react-hooks`, and `react-refresh` (run `npm run lint`)
- CI checks `format:check` and `lint`
