# Stack Rules (Next.js + Drizzle + Server Actions / tRPC)

These are stack-specific guardrails for this repo and match the current folder layout.

## Boundaries

- **Cookie/redirect/session flows**: prefer a single **server action** end-to-end.
- **API/data flows** without cookie/redirect concerns: prefer **tRPC** end-to-end.
- **Database access**: keep it through the Drizzle `db` layer (avoid ad-hoc clients).

## Current structure (source of truth)

- DB connection: `src/drizzle/index.ts`
- DB schema entry: `src/drizzle/schema.ts`
- Auth: `src/features/core/auth/**`
- i18n: `src/features/core/i18n/**`
- Providers: `src/app/_providers/index.tsx`

## App Router

- Prefer server components by default; use client components only when needed.
- Be explicit about server/client boundaries (avoid importing server-only modules into client).

## UI + i18n

- Use existing UI primitives under `src/components/ui` and `cn` helper for class merging.
- Respect RTL/LTR and locale cookie behavior; don’t hardcode direction.

## Auth + permissions

- Use the repo’s permission helper for authorization decisions.
- Avoid NextAuth assumptions; sessions are custom.
