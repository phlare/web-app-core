# Changelog — web-app-core

Versioned deliverables tracker for the SPA template.

## Source of Truth Docs

- `docs/PRODUCT_BRIEF.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/PLATFORM_TEMPLATES.md`

---

## v0.2 — API Client + Error Handling

- [x] TypeScript types mapped 1:1 from elixir-api-core OpenAPI spec (`api-types.ts`)
- [x] `ApiError` class with code, statusCode, details
- [x] `TokenStorage` — access token in-memory, refresh token in localStorage
- [x] `Logger` — structured console wrapper with level filtering
- [x] `ApiClient` — typed HTTP client with envelope unwrapping, Bearer auth, 401 auto-refresh with mutex
- [x] `ErrorBoundary` — React error boundary with fallback UI and retry
- [x] `ToastProvider` + `useToast` — auto-dismissing toast notifications
- [x] MSW test infrastructure — handlers for all auth endpoints, server lifecycle in setup
- [x] `renderWithProviders` test helper
- [x] App wired with ErrorBoundary + ToastProvider

### v0.2 Summary

- 17 tests passing across 8 files
- Full typed API client with 401 refresh deduplication
- Error boundary + toast notification system
- MSW for network-level test mocking

---

## v0.1 — Skeleton + Environment

- [x] Vite 6 + React 19 + TypeScript (strict mode, Bundler resolution)
- [x] Tailwind CSS v4 (CSS-first config, `@tailwindcss/vite` plugin)
- [x] Composition root — only `main.tsx` reads `import.meta.env`
- [x] Zod environment validation (`EnvSchema`) with fail-fast on load
- [x] Placeholder App component receiving config as props
- [x] Vitest + React Testing Library + jsdom — 4 tests across 2 files
- [x] ESLint 9 flat config with react-hooks + react-refresh plugins
- [x] Prettier formatting (no trailing commas)
- [x] GitHub Actions CI (format, lint, typecheck, test, build)
- [x] Precommit script (format → lint → typecheck → test)
- [x] Node 24+ (pinned in `.nvmrc`)

### v0.1 Summary

- 4 tests passing
- Vite + React + Tailwind stack verified
- Props injection via composition root (env → main.tsx → App)
- MIT licensed
