# Web App Core

[![CI](https://github.com/phlare/web-app-core/actions/workflows/ci.yml/badge.svg)](https://github.com/phlare/web-app-core/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/Node-24+-339933)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Reusable SPA template for product frontends. This is a generic foundation — it contains no product logic, only app plumbing (auth, API client, routing, shell, components).

Built with Vite 6, React 19, TypeScript, Tailwind CSS v4, TanStack Router, and shadcn/ui.

## Requirements

- Node 24+ (pinned in `.nvmrc`)

## Local Setup

```bash
# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env

# Run the dev server (hot reload)
npm run dev
```

The app is available at `http://localhost:5173`.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Pre-commit Checks

```bash
# Format, lint, typecheck, and test
npm run precommit
```

## Architecture

- **Composition root**: `main.tsx` is the only file that reads `import.meta.env`
- **Typed API client**: Envelope-aware, auto-attaches Bearer token, 401 auto-refresh with mutex
- **Auth flow**: Login, register, logout, session bootstrap from refresh token, protected routes
- **App shell**: Responsive sidebar (desktop fixed, mobile overlay) + header, via pathless layout route
- **shadcn/ui components**: Button, Input, Card, Dialog, DropdownMenu, Toaster (owned files, not a dependency)
- **File-based routing**: TanStack Router with Vite plugin codegen, type-safe navigation

See `docs/ARCHITECTURE.md` for detailed design and `docs/DECISIONS.md` for the decision log.

## Configuration

Copy `.env.example` to `.env`. Dev requires:

| Variable            | Default | Description                |
| ------------------- | ------- | -------------------------- |
| `VITE_API_BASE_URL` | —       | Backend API URL (required) |

## Related Templates

This is one of three reusable service templates. They share API conventions and response envelopes but are otherwise independent.

| Template                                                         | Purpose                   | Stack                             |
| ---------------------------------------------------------------- | ------------------------- | --------------------------------- |
| [**elixir-api-core**](https://github.com/phlare/elixir-api-core) | Core backend APIs         | Elixir, Phoenix, PostgreSQL       |
| [**node-edge-core**](https://github.com/phlare/node-edge-core)   | Edge/integration services | TypeScript, Fastify, Zod          |
| **web-app-core** (this repo)                                     | Frontend SPA              | TypeScript, React, Vite, Tailwind |

Product apps are created _from_ these templates and then diverge freely with domain logic. They're designed to work together — a frontend built from web-app-core calls a backend API built from elixir-api-core, while edge services built from node-edge-core handle integrations.

## Project Status

See `CHANGELOG.md` for the versioned task tracker.
