# Architecture — web-app-core

## Overview

web-app-core is a client-side single-page application template. It provides the structural plumbing for product frontends: environment validation, a typed API client, auth flow, routing, app shell, and base components. Product apps clone this template and add domain-specific features.

## Composition Root

`src/main.tsx` is the single entry point and the only file that reads `import.meta.env`. It validates environment variables through a Zod schema, then passes the parsed configuration as props to the root component. This mirrors the composition root pattern used in node-edge-core (`server.ts`).

All other modules receive their dependencies via props or constructor arguments. This makes every component and module independently testable without environment mocking.

## Environment Validation

`src/config/env.ts` defines a Zod schema (`EnvSchema`) for all required environment variables. The schema is the contract — if a required variable is missing or invalid, the app fails fast on startup rather than failing unpredictably at runtime.

Environment variables exposed to the client must use the `VITE_` prefix (Vite convention).

## Component Hierarchy (v0.4)

```
main.tsx (composition root — reads env, creates TokenStorage + Logger + ApiClient)
  └── App (props: apiClient, tokenStorage)
        └── ApiClientProvider (exposes apiClient via React context)
              └── AuthProvider (manages auth state + session bootstrap)
                    └── RouterProvider (TanStack Router with auth context)
                          └── __root.tsx (ErrorBoundary + Toaster + SplashScreen/Outlet)
                                ├── login.tsx → LoginPage (public-only, no shell)
                                ├── register.tsx → RegisterPage (public-only, no shell)
                                ├── _app.tsx → AppShell (sidebar + header + Outlet)
                                │     ├── _app/index.tsx → HomePage
                                │     └── _app/health.tsx → HealthPage
                                └── [404] → NotFoundPage
```

## Auth Flow

### Session Bootstrap

On mount, `AuthProvider` checks for an existing refresh token:

1. If refresh token exists → calls `apiClient.refresh()` then `apiClient.getMe()` → hydrates user/account/role state
2. If refresh fails → clears tokens, remains unauthenticated
3. If no refresh token → immediately unauthenticated

During bootstrap, `isLoading` is `true`. The root layout shows `SplashScreen` and route guards skip redirects, preventing a flash of the login page.

### Route Protection

Route guards use TanStack Router's `beforeLoad` hook with router context:

- **Protected routes** (`/`): redirect to `/login` when `!isLoading && !isAuthenticated`
- **Public-only routes** (`/login`, `/register`): redirect to `/` when `!isLoading && isAuthenticated`

Auth state changes trigger `router.invalidate()` to re-evaluate guards without navigation.

## File-Based Routing

Route files in `src/routes/` follow TanStack Router conventions. The `@tanstack/router-plugin` Vite plugin watches the filesystem and generates a type-safe route tree (`src/routeTree.gen.ts`, gitignored). This provides:

- Autocomplete for `Link to="/..."` and `useNavigate({ to })`
- Compile-time errors for invalid route paths
- Automatic code splitting via `.lazy.tsx` suffix (when needed)

Route files are thin — they define routing config (guards, loaders) and delegate rendering to page components in `src/pages/`.

## API Client

`src/lib/api-client.ts` provides a typed HTTP client built against the elixir-api-core OpenAPI spec. Key behaviors:

- **Envelope unwrapping** — Automatically extracts `data` from `{ data: T }` responses
- **Error parsing** — Converts `{ error: { code, message, details } }` into `ApiError` instances
- **Bearer auth** — Auto-attaches `Authorization: Bearer <token>` from TokenStorage
- **401 auto-refresh** — On unauthorized response, refreshes the access token and retries the request once
- **Refresh mutex** — A Promise-based lock deduplicates concurrent refresh attempts (if 3 requests get 401 simultaneously, only 1 refresh call is made)

All types in `src/lib/api-types.ts` map 1:1 to the elixir-api-core OpenAPI spec schemas.

## Token Strategy

- **Access token** — Stored in-memory only (never in localStorage). Lost on page refresh, but refreshed automatically via refresh token. Mitigates XSS token theft.
- **Refresh token** — Stored in localStorage for persistence across page loads. Rotated on every refresh call (elixir-api-core enforces rotation).

## Boundary Principle

This template contains zero business logic. Domain-specific pages, API hooks, state management, and routing rules belong in the product app built from this template. The template provides:

- How to validate environment configuration
- How to talk to the backend API (typed client, envelope handling, auth tokens)
- How to manage user authentication and sessions
- How to structure the app shell and routing
- How to test components and API interactions

Product apps inherit these patterns and add their own domain logic on top.
