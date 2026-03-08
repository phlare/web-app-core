# Product Brief — web-app-core

## Purpose

Reusable SPA template for building product frontends. Provides the foundational plumbing — project scaffold, typed API client, auth flow, app shell, base components, testing infrastructure, and CI — so product apps can start with domain features immediately.

## Goals

- Accelerate new frontend projects with a proven, opinionated starting point
- Standardize SPA patterns across product frontends (env validation, API client, auth, routing)
- Provide a typed API client that understands the shared response envelope
- Include auth flow built against the elixir-api-core auth contract
- Ship a responsive app shell (sidebar + header + content area) with base shadcn/ui components
- Establish testing infrastructure (Vitest + React Testing Library + MSW) from day one

## Non-Goals

- Domain-specific pages, routes, or business logic (that belongs in product apps)
- Server-side rendering or static site generation (this is a client-side SPA)
- Product-specific state management beyond auth context
- Mobile app or native platform support
- Design system or component library beyond the base shadcn/ui set

## Intended Usage

1. Clone or fork this template to create a new product frontend
2. Replace template branding with product branding
3. Add domain-specific routes, pages, and API hooks
4. The template and product app are allowed to diverge freely

## Tech Stack

| Concern      | Choice                                   |
| ------------ | ---------------------------------------- |
| Build        | Vite 6                                   |
| UI           | React 19 + TypeScript (strict)           |
| Routing      | TanStack Router (v0.3+)                  |
| Server state | TanStack Query (v0.3+)                   |
| Styling      | Tailwind CSS v4                          |
| Components   | shadcn/ui on Radix primitives (v0.4+)    |
| Testing      | Vitest + React Testing Library + MSW     |
| Linting      | ESLint 9 flat config + typescript-eslint |
| Formatting   | Prettier                                 |

## Success Criteria

- `npm run dev` starts and shows the app
- `npm run build` produces a production bundle with no errors
- `npm run precommit` passes (format, lint, typecheck, tests)
- Auth flow works end-to-end against a running elixir-api-core instance
- A new product app can be bootstrapped from this template in under 30 minutes
