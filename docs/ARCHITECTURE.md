# Architecture — web-app-core

## Overview

web-app-core is a client-side single-page application template. It provides the structural plumbing for product frontends: environment validation, a typed API client, auth flow, routing, app shell, and base components. Product apps clone this template and add domain-specific features.

## Composition Root

`src/main.tsx` is the single entry point and the only file that reads `import.meta.env`. It validates environment variables through a Zod schema, then passes the parsed configuration as props to the root component. This mirrors the composition root pattern used in node-edge-core (`server.ts`).

All other modules receive their dependencies via props or constructor arguments. This makes every component and module independently testable without environment mocking.

## Environment Validation

`src/config/env.ts` defines a Zod schema (`EnvSchema`) for all required environment variables. The schema is the contract — if a required variable is missing or invalid, the app fails fast on startup rather than failing unpredictably at runtime.

Environment variables exposed to the client must use the `VITE_` prefix (Vite convention).

## Component Hierarchy (v0.1)

```
main.tsx (composition root — reads env, renders root)
  └── App (receives apiBaseUrl as prop)
```

This hierarchy grows in later versions to include auth providers, router, query client, and app shell.

## Boundary Principle

This template contains zero business logic. Domain-specific pages, API hooks, state management, and routing rules belong in the product app built from this template. The template provides:

- How to validate environment configuration
- How to talk to the backend API (typed client, envelope handling, auth tokens)
- How to manage user authentication and sessions
- How to structure the app shell and routing
- How to test components and API interactions

Product apps inherit these patterns and add their own domain logic on top.
