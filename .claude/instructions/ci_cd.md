# CI/CD

## CI

`.github/workflows/ci.yml` runs on every PR and on push to `main`. Single `test` job:

- Node via `.nvmrc` (`actions/setup-node@v6`, `cache: npm`)
- `npm ci` (lockfile-faithful install — required because this repo commits a lockfile)
- `npm run format:check` (Prettier)
- `npm run lint` (ESLint 9 flat config + typescript-eslint + react-hooks + react-refresh)
- `npm run typecheck` (`tsc --noEmit`)
- `npm test` (Vitest)
- `npm run build` (Vite build — catches issues that typecheck alone misses)

## CD

No deploy job. This is a template — downstream product repos wire up their own CD.

## When forking this template into a product frontend

SPAs built from this template typically deploy to a static host. Two patterns we use in the Tiny Inbox ecosystem:

**Cloudflare Pages (recommended for SPAs):** Do NOT add a workflow to the repo. Wire it up in the Cloudflare Pages dashboard — connect the GitHub repo, pick the branch, let Pages auto-detect Vite and run `npm run build`. Document the branch-to-environment mapping and env-var names (`VITE_*`) in the repo's own `AGENTS.md` or a dedicated file linked from it so future contributors don't look for a workflow that isn't there.

**Any other static host (Vercel, Netlify, S3/CloudFront):** Append a `deploy` job to `ci.yml` gated on `needs: [test]`, run `npm run build`, then `rsync`/`aws s3 sync`/`vercel deploy` the `dist/` output. Example shape:

```yaml
deploy:
  needs: [test]
  if: github.event_name == 'push' && github.ref == 'refs/heads/develop'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v6
    - uses: actions/setup-node@v6
      with:
        node-version-file: ".nvmrc"
        cache: "npm"
    - run: npm ci
    - run: npm run build
    - name: Deploy
      run: # provider-specific command here
      env:
        # provider-specific secrets
```

Always have tests gate the deploy. `npm run build` in `test` already gives you a build guarantee, but re-running it in the deploy step keeps the deploy artifact pristine and scoped to that job.
