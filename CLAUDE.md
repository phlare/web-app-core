# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React SPA template for building product frontends. This is a reusable foundation — it contains no product logic, only app plumbing (auth, API client, shell, components). Vite 6 + React 19 + TypeScript + Tailwind CSS v4. Node 24+ (pinned in `.nvmrc`).

## Commands

```bash
# Install dependencies
npm install

# Development server (hot reload)
npm run dev

# Production build (typecheck + vite build)
npm run build

# Preview production build
npm run preview

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run typecheck

# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check   # used in CI

# Pre-commit checks (format, lint, typecheck, tests)
npm run precommit
```

## Architecture

### Composition Root

`src/main.tsx` is the only file that reads `import.meta.env`. Everything else receives configuration via props or constructor arguments, making all modules independently testable.

### Core Components

- **`src/config/env.ts`** — Zod schema for environment validation. Exports `EnvSchema` (for testing) and `Env` type. Validates `VITE_API_BASE_URL`.
- **`src/App.tsx`** — Root component. Receives parsed env config and ApiClient as props. Wraps children in ErrorBoundary and ToastProvider.
- **`src/index.css`** — Tailwind CSS v4 entry point (`@import "tailwindcss"`).

### Library Modules (`src/lib/`)

- **`api-types.ts`** — All TypeScript types mapped 1:1 from elixir-api-core OpenAPI spec. Request/response interfaces, envelope types, shared types (UserSummary, AccountSummary, Role, etc.).
- **`api-error.ts`** — `ApiError` class extending `Error` with `code`, `statusCode`, `details`. Thrown by ApiClient on error responses.
- **`api-client.ts`** — Typed HTTP client. Constructor injection (`baseUrl`, `tokenStorage`, `logger`). Unwraps `{ data }` envelope, parses `{ error }` envelope, auto-refreshes on 401 with mutex to deduplicate concurrent refreshes. Methods for all auth endpoints.
- **`token-storage.ts`** — Access token in-memory (XSS mitigation), refresh token in localStorage (persistence). Methods: get/set/clear.
- **`logger.ts`** — Simple structured logger wrapping console. Level-based filtering (debug/info/warn/error/silent).

### UI Components (`src/components/`)

- **`ErrorBoundary.tsx`** — React error boundary (class component — React limitation). Catches render errors, shows fallback with retry button.
- **`ToastContext.ts`** — React context + `ToastContextValue` interface. Separated from component to satisfy `react-refresh` ESLint rule.
- **`Toast.tsx`** — `ToastProvider` component. Auto-dismissing toast notifications. Minimal implementation (replaced by shadcn/ui in v0.4).
- **`useToast.ts`** — `useToast()` hook. Consumes `ToastContext`, throws if used outside `ToastProvider`.

### Response Envelope

The API client uses the standard envelope shared across all Tiny Inbox services:

```json
{ "data": { ... } }
{ "error": { "code": "...", "message": "...", "details": {} } }
```

## Testing

- 17 tests across 8 test files
- Uses Vitest with explicit imports (no globals) + jsdom environment
- React Testing Library for component tests
- MSW (Mock Service Worker) for network-level API mocking
- `test/setup.ts` imports jest-dom matchers and starts/stops MSW server
- `test/mocks/handlers.ts` — MSW handlers for all auth endpoints with realistic fixtures
- `test/helpers.tsx` — `renderWithProviders` utility wrapping ToastProvider
- Test file structure mirrors `src/` layout

## Configuration

Dev requires a `.env` file (see `.env.example`):

| Variable            | Default | Description                |
| ------------------- | ------- | -------------------------- |
| `VITE_API_BASE_URL` | —       | Backend API URL (required) |

## Current Status

v0.2 complete. See `CHANGELOG.md` for the versioned task tracker.
