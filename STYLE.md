# Style Guide — Web App Core

Coding conventions observed in this codebase. Follow these when contributing.

---

## Project Structure

- `src/` for source, `test/` for tests — test files mirror `src/` layout
- `src/main.tsx` is the composition root — the only place `import.meta.env` is read
- Components live alongside their concerns (e.g. `src/config/`, `src/lib/`)

## Imports

**Use `type` imports for type-only imports:**

```typescript
import type { ReactNode } from "react";
```

**Do NOT use `.js` extensions in import paths** (Bundler module resolution):

```typescript
import { App } from "./App";
import { EnvSchema } from "./config/env";
```

**Order:** React → third-party → local, separated by blank lines:

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { EnvSchema } from "./config/env";
import { App } from "./App";
```

## TypeScript

- **Strict mode** is on — `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`
- **Prefer `unknown` over `any`** — the codebase has zero `any` usage
- **Use `interface`** for component props and object shapes that may be extended, **`type`** for unions and utility types:
  ```typescript
  interface AppProps {
    apiBaseUrl: string;
  }
  ```
- **Prefix unused parameters with `_`:**
  ```typescript
  function Component({ _unused, name }: Props) { ... }
  ```

## React

- **Function components only** — no class components (exception: `ErrorBoundary` requires class component per React API)
- **Named exports** — no default exports:
  ```typescript
  export function App({ apiBaseUrl }: AppProps) { ... }
  ```
- **Props via interface** — defined above the component in the same file:

  ```typescript
  interface ButtonProps {
    label: string;
    onClick: () => void;
  }

  export function Button({ label, onClick }: ButtonProps) { ... }
  ```

- **Composition root** — `main.tsx` reads env, parses through Zod, passes config as props:
  ```typescript
  const env = EnvSchema.parse({
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL
  });
  ```

## Styling

- **Tailwind CSS v4** utility classes for all styling
- **CSS-first config** — no `tailwind.config.js`, just `@import "tailwindcss"` in `index.css`
- **No inline styles, CSS modules, or styled-components**
- Prefer semantic class grouping: layout → spacing → typography → color

## API Client

- **`ApiClient` is a plain class** with constructor injection (`baseUrl`, `tokenStorage`, `logger`) — not a hook or singleton
- **Never call `fetch` directly** for backend requests — use `ApiClient`
- **Envelope unwrapping** is automatic — methods return the `data` payload, not the envelope
- **`ApiError`** is thrown for error responses — check `.code`, `.statusCode`, `.details`

## Configuration

- **Zod schemas** for environment validation (`src/config/env.ts`)
- **Required values have no defaults** — fail fast on startup
- **Constructor injection** everywhere except `main.tsx`:
  ```typescript
  const client = new ApiClient(env.VITE_API_BASE_URL, tokenStorage, logger);
  ```

## Tests

**Framework:** Vitest with explicit imports (no globals):

```typescript
import { describe, expect, it } from "vitest";
```

**Test structure:**

- `describe` blocks group by feature or component
- `it` descriptions read as sentences: `"renders the heading and API URL"`, `"rejects missing VITE_API_BASE_URL"`
- No nesting of `describe` blocks

**Component tests use React Testing Library:**

```typescript
import { render, screen } from "@testing-library/react";

render(<App apiBaseUrl="http://localhost:4000" />);
expect(screen.getByText("web-app-core")).toBeInTheDocument();
```

**Env validation tests call the schema directly:**

```typescript
const result = EnvSchema.parse({ VITE_API_BASE_URL: "http://localhost:4000" });
expect(result.VITE_API_BASE_URL).toBe("http://localhost:4000");
```

**API client tests use MSW for network mocking:**

```typescript
import { server } from "../mocks/server";
server.use(
  http.get(`${BASE_URL}/api/v1/me`, () => {
    return HttpResponse.json({ data: { ... } });
  })
);
```

## Formatting

- **Prettier** handles all formatting — do not override with manual style choices
- **Double quotes** for strings (Prettier default)
- **Semicolons** always
- **No trailing commas** (`"trailingComma": "none"` in `.prettierrc`)
- Run `npm run format` before committing
