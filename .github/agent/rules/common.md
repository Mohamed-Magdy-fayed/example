# Common Rules (Must Always / Must Never)

## Must always

- Prefer the **smallest coherent change** that meets the requirement.
- Follow the repo’s established patterns (auth, i18n, UI primitives, server actions vs tRPC).
- Verify changes before considering the task complete (default: `npm run build`).
- Keep code modular: high cohesion, low coupling.
- Keep user-facing flows consistent (redirects, cookies, sessions).

## Must never

- Hardcode secrets/tokens/credentials.
- Mix a single cookie/redirect flow across server actions and tRPC (pick one).
- Ship changes without verifying at least the relevant build/check.
- Introduce new global conventions when a local pattern already exists.
