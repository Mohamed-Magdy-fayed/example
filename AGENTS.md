# Project Agent Instructions

This file is the universal “how to work in this repo” entrypoint (inspired by ECC’s root `AGENTS.md`).

Primary workflow docs live in `.github/agent/`:
- `.github/agent/README.md`
- `.github/agent/workflow.md`
- `.github/agent/planning.md`
- `.github/agent/verification.md`

## Core principles

1. **Plan before execute** for multi-step or risky work.
2. **Smallest coherent change** that satisfies the requirement.
3. **Respect boundaries**: cookie/redirect/session flows stay in server actions; API/data flows stay in tRPC (don’t split a single flow).
4. **Verify before done**: default is `npm run build`.
5. **Prefer existing patterns** over inventing new ones.

## Repo map (current structure)

- App Router UI: `src/app/**`
- Feature modules (auth/i18n included): `src/features/**`
- Database (Drizzle):
  - Connection: `src/drizzle/index.ts`
  - Schema entry: `src/drizzle/schema.ts`
  - Migrations: `src/drizzle/migrations/**`
- Environment validation: `src/env/server.ts`
- tRPC routers (if used): feature routers like `src/features/**/router.ts` and shared routers under `server/api/routers/**`

## Verification commands

- Default: `npm run build`
- Types: `npm run typecheck`
- Lint/format (Biome): `npm run check` / `npm run check:write`
- DB: `npm run db:generate`, `npm run db:migrate`, `npm run db:push`, `npm run db:studio`

## When in doubt

- Follow `.github/agent/workflow.md`.
- If paths or conventions seem inconsistent, locate the nearest working example and mirror it.
