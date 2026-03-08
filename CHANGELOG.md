# Changelog — web-app-core

Versioned deliverables tracker for the SPA template.

## Source of Truth Docs

- `docs/PRODUCT_BRIEF.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/PLATFORM_TEMPLATES.md`

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
