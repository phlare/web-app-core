# Plan: Phase 2 — Web App Core Template + Tiny Inbox Web

## Context

Phase 0 (templates) and Phase 0.5 (domain modeling) are complete. Phase 1 (`tiny-inbox-api`) is built and functional with full CRUD, auth, suggestions, and views. It's time for Phase 2: the web frontend.

Following the same pattern as the other repos, this is split into:

- **Phase 2a** — `web-app-core`: a reusable SPA template with zero business logic
- **Phase 2b** — `tiny-inbox-web`: the product app derived from the template

## Tech Stack

| Concern      | Choice                                       | Notes                                         |
| ------------ | -------------------------------------------- | --------------------------------------------- |
| Build        | **Vite 6**                                   | Fast HMR, native ESM                          |
| UI           | **React 19 + TypeScript**                    | User preference, strict TS config             |
| Routing      | **TanStack Router**                          | Fully type-safe routes                        |
| Server state | **TanStack Query**                           | Caching, refetching, optimistic updates       |
| Styling      | **Tailwind CSS v4**                          | CSS-first config (no tailwind.config.js)      |
| Components   | **shadcn/ui** (on Radix primitives)          | Copy-paste owned components, not a dependency |
| Testing      | **Vitest + React Testing Library + MSW**     | Network-level API mocking                     |
| Linting      | **ESLint 9 flat config + typescript-eslint** | Aligned with node-edge-core                   |
| Formatting   | **Prettier**                                 | Same config as node-edge-core                 |
| Node         | **24+** (via `.nvmrc`)                       | Matches node-edge-core                        |

Shared dependencies with node-edge-core: TypeScript, Vitest, ESLint, Prettier, Zod (for env validation). Same versions where possible.

## Phase 2a — `web-app-core` (Reusable Template)

### What the template ships

- **Project scaffolding** — Vite + React + TS + Tailwind, strict tsconfig
- **Environment validation** — Zod schema, composition root pattern (only `main.tsx` reads `import.meta.env`)
- **Typed API client** — Envelope-aware (`{ data }` / `{ error }`), auto-attaches Bearer token, 401 auto-refresh with retry, mutex to deduplicate concurrent refreshes
- **Auth flow** — Login, register, logout, token management (access in-memory, refresh in localStorage), account switching, protected routes, session bootstrap on load
- **App shell** — Sidebar + header + content area, responsive
- **Base shadcn/ui components** — Button, input, toast, dialog, dropdown-menu, card
- **Error handling** — Error boundary, toast notifications for API errors
- **Health check page** — Shows API connectivity status
- **Testing infrastructure** — Vitest, RTL, MSW handlers for all auth endpoints, `renderWithProviders` helper
- **CI** — GitHub Actions (format, lint, typecheck, test, build)
- **Docs** — CLAUDE.md, README.md, STYLE.md, CONTRIBUTING.md, AGENTS.md, CHANGELOG.md, docs/ARCHITECTURE.md, docs/DECISIONS.md, docs/PRODUCT_BRIEF.md

### Auth contract (matches elixir-api-core)

The API client and auth flow are built against these exact endpoints:

| Endpoint                           | Key response fields                                                        |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `POST /api/v1/auth/register`       | `user`, `account`, `access_token`, `refresh_token`                         |
| `POST /api/v1/auth/login`          | `user`, `access_token`, `refresh_token`, `active_account_id`, `accounts[]` |
| `POST /api/v1/auth/refresh`        | `access_token`, `refresh_token`                                            |
| `POST /api/v1/auth/logout`         | `status: "ok"`                                                             |
| `POST /api/v1/auth/switch_account` | `access_token`, `account_id`, `role`                                       |
| `GET /api/v1/me`                   | `user`, `account_id`, `role`, `membership_id`                              |

### Build phases

**v0.1 — Skeleton + Environment**: Vite scaffold, strict TS, Tailwind, Zod env validation, composition root, ESLint/Prettier, CI, precommit, docs. ~5 tests.

**v0.2 — API Client + Error Handling**: Typed ApiClient with envelope unwrapping and 401 refresh, TokenStorage, logger, error boundary, toast system, MSW test setup. ~15 tests cumulative.

**v0.3 — Auth + Routing**: AuthContext/provider, login/register pages, protected/public-only routes, TanStack Router config, app wired up. ~25 tests cumulative.

**v0.4 — Layout + Polish**: App shell (sidebar, header), shadcn/ui base set, health page, 404 page, final docs pass. ~30-35 tests cumulative.

### Key architecture decisions

1. `main.tsx` is the only file that reads `import.meta.env` (composition root)
2. Access tokens in-memory, refresh tokens in localStorage (security/UX balance)
3. `moduleResolution: "Bundler"` (not NodeNext — Vite convention, no `.js` extensions)
4. No global state library — auth via React context, server state via TanStack Query
5. shadcn/ui components are owned files, not a package dependency
6. Hand-written TypeScript types for API contracts (no OpenAPI codegen — keeps template portable, revisit if drift becomes a problem)

### Type mapping rules

**web-app-core types must map completely to the elixir-api-core OpenAPI spec** (`elixir-api-core/priv/openapi/v1.yaml`). Every request/response schema in that spec gets a corresponding TypeScript type. The spec is the source of truth — if a field exists in the spec, it exists in the types.

**tiny-inbox-web types must map completely to the tiny-inbox-api OpenAPI spec** (`tiny-inbox-api/priv/openapi/v1.yaml`). This extends the base types with domain-specific schemas (Item, Suggestion, capture request, filter params, etc.). Again, the spec is the source of truth.

---

## Phase 2b — `tiny-inbox-web` (Product App)

Built from `web-app-core`, adds all Tiny Inbox domain features.

### Pages / features to add

- **Capture page** — Quick paste box, zero-friction input (POST /api/v1/capture)
- **Inbox triage** — Keyboard-driven review of inbox items, fast tagging/status changes
- **Today view** — Active items + due items for today
- **Item detail** — View/edit item, manage lifecycle status
- **Suggestion review** — See AI suggestions for an item, apply or dismiss
- **Waiting view** — Items in waiting status
- **Search** — Text search with tag/status filters

### TanStack Query hooks to build

- `useItems(filters)` — GET /api/v1/items with view/status/tag/search params
- `useItem(id)` — GET /api/v1/items/:id
- `useCapture()` — POST /api/v1/capture mutation
- `useUpdateItem()` — PATCH /api/v1/items/:id mutation
- `useDeleteItem()` — DELETE /api/v1/items/:id mutation
- `useSuggestions(itemId)` — GET /api/v1/items/:id/suggestions
- `useGenerateSuggestions()` — POST /api/v1/items/:id/suggestions/generate
- `useApplySuggestion()` / `useDismissSuggestion()` — PATCH mutations

### Product-specific additions

- Sidebar nav: Inbox, Today, Waiting, Search
- Keyboard shortcuts for triage (j/k navigate, e edit, d done, w waiting, etc.)
- Badge counts on nav items
- Additional shadcn/ui components as needed (table, badge, command palette, etc.)

---

## Verification

### web-app-core

1. `npm run dev` starts and shows login page
2. `npm run build` succeeds with no errors
3. `npm test` passes all ~30-35 tests
4. `npm run precommit` passes (format, lint, typecheck, test)
5. Can register, login, see health page, logout against a running elixir-api-core instance
6. CI passes on GitHub

### tiny-inbox-web

1. All of the above, plus:
2. Can capture an item via the quick paste box
3. Inbox view shows captured items
4. Can triage items (change status, add tags)
5. Today view filters correctly
6. Suggestion review flow works end-to-end
