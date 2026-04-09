---
name: feature-development
description: Workflow scaffold for implementing a new feature in this repo.
allowed_tools: ["Read", "Grep", "Glob", "Edit", "Bash"]
---

# Feature Development

## Goal

Implement a new user-visible capability with minimal, verifiable changes.

## Common files

- `src/app/**` (routes, layouts, pages)
- `src/features/**` (feature modules; auth + i18n live here)
- `server/api/routers/**` (tRPC routers, if used)
- `src/drizzle/**` (db connection + schema)

## Suggested sequence

1. Understand current behavior and identify the source of truth.
2. Plan the smallest coherent slice (UI → API → DB) if multi-step.
3. Implement changes following existing patterns.
4. Verify: default `npm run build` (and any targeted checks).
5. Summarize: what changed, where, how verified, follow-ups.

## Notes

- Treat this as a scaffold, not a rigid script.
- Prefer reusing existing primitives over inventing new abstractions.
