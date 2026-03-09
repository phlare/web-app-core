# Decisions — web-app-core

Architectural decisions and their rationale.

---

**001 — Vite over CRA/Next.js**
Vite provides fast HMR, native ESM, and a minimal config surface. No SSR complexity — this is a client-side SPA. CRA is deprecated; Next.js adds server-side concerns we don't need.

**002 — Bundler module resolution (no .js extensions)**
Vite handles module resolution at build time. Using `moduleResolution: "Bundler"` in tsconfig avoids the `.js` extension noise required by NodeNext. This is the standard Vite/React convention.

**003 — Tailwind CSS v4 with CSS-first config**
Tailwind v4 uses `@import "tailwindcss"` in CSS and the `@tailwindcss/vite` plugin — no `tailwind.config.js` needed. Simpler pipeline, fewer config files, auto-detects content sources.

**004 — Composition root in main.tsx**
Only `main.tsx` reads `import.meta.env`. All other modules receive config via props or arguments. Same pattern as node-edge-core's `server.ts`. Makes every module testable without env mocking.

**005 — shadcn/ui as owned files (not a package dependency)**
Components from shadcn/ui are copied into the project, not installed as a package. This gives full control over the code, avoids version lock-in, and allows customization without fighting upstream changes. Planned for v0.4.

**006 — Zod for environment validation**
Matches the validation library used in node-edge-core and elixir-api-core (via Ecto). Single validation library across the stack. Runtime schema validation with TypeScript type inference.

**007 — Separate vitest.config.ts**
Test configuration is isolated from the Vite build config. Tests use jsdom environment and a setup file for DOM matchers. Keeps concerns separated and avoids test config leaking into production builds.

**008 — In-memory access token, localStorage refresh token**
Access tokens are stored in-memory only (never localStorage) to mitigate XSS token theft. Refresh tokens use localStorage for persistence across page loads. Trade-off: access token is lost on refresh, but auto-refreshed transparently.

**009 — Promise-based refresh mutex**
A single `refreshPromise` field deduplicates concurrent token refresh attempts. If multiple requests get 401 simultaneously, they share one refresh call. Simple and sufficient — no external semaphore library needed.

**010 — MSW for API test mocking**
Mock Service Worker intercepts at the network level, providing more realistic tests than manual fetch mocking. Handlers are reusable across tests and can be overridden per-test with `server.use()`.

**011 — Class component for ErrorBoundary**
React does not support error boundary hooks (`getDerivedStateFromError`/`componentDidCatch` require class components). This is the sole exception to the "function components only" rule.

**012 — Minimal toast system**
The ToastProvider + useToast implementation is intentionally minimal — just enough to demonstrate error surfacing. Will be replaced by shadcn/ui Toast component in v0.4.
