# Changelog — web-app-core

Versioned deliverables tracker for the SPA template.

## Source of Truth Docs

- `docs/PRODUCT_BRIEF.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/PLATFORM_TEMPLATES.md`

---

## v0.3 — Auth + Routing

- [x] `@tanstack/react-router` with file-based routing (Vite plugin codegen)
- [x] Route files in `src/routes/` — `__root.tsx`, `index.tsx`, `login.tsx`, `register.tsx`
- [x] Auto-generated type-safe route tree (`routeTree.gen.ts`, gitignored)
- [x] `AuthContext` + `AuthProvider` + `useAuth` — thin React wrapper around ApiClient
- [x] Session bootstrap from refresh token on mount
- [x] `beforeLoad` route guards — protected routes redirect to `/login`, public-only routes redirect to `/`
- [x] `SplashScreen` shown during session bootstrap (prevents flash of wrong content)
- [x] `LoginPage` — email/password form with inline error display
- [x] `RegisterPage` — email/password/display_name/account_name form
- [x] `HomePage` — authenticated landing with user info + sign out
- [x] Router invalidation on auth state change (ensures guards re-evaluate)
- [x] `@testing-library/user-event` for realistic interaction tests
- [x] Explicit `cleanup()` in test setup (vitest without globals)

### v0.3 Summary

- 25 tests passing across 12 files (+8 new tests)
- File-based routing with type-safe navigation
- Full auth flow: bootstrap, login, register, logout
- Route protection via `beforeLoad` guards
- Page components separated from route definitions

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
