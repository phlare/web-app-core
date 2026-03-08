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
- **`src/App.tsx`** — Root component. Receives parsed env config as props.
- **`src/index.css`** — Tailwind CSS v4 entry point (`@import "tailwindcss"`).

### Response Envelope

The API client (v0.2+) will use the standard envelope shared across all Tiny Inbox services:

```json
{ "data": { ... } }
{ "error": { "code": "...", "message": "...", "details": {} } }
```

## Testing

- 4 tests across 2 test files
- Uses Vitest with explicit imports (no globals) + jsdom environment
- React Testing Library for component tests
- `test/setup.ts` imports `@testing-library/jest-dom/vitest` for DOM matchers
- Test file structure mirrors `src/` layout

## Configuration

Dev requires a `.env` file (see `.env.example`):

| Variable            | Default | Description                |
| ------------------- | ------- | -------------------------- |
| `VITE_API_BASE_URL` | —       | Backend API URL (required) |

## Current Status

v0.1 complete. See `CHANGELOG.md` for the versioned task tracker.
