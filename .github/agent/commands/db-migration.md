---
name: db-migration
description: Workflow scaffold for database schema changes + migrations.
allowed_tools: ["Read", "Grep", "Glob", "Edit", "Bash"]
---

# DB Migration

## Goal

Change database schema safely and keep application code consistent.

## Common files

- Drizzle schema: `src/drizzle/schema.ts`
- Migrations: `src/drizzle/migrations/**`
- DB connection: `src/drizzle/index.ts`
- Query code: `src/features/**`, route handlers under `src/app/api/**`

## Suggested sequence

1. Confirm the data model change (fields, constraints, indices).
2. Update schema definitions.
3. Generate and apply migration using `npm run db:generate` then `npm run db:migrate` (or `npm run db:push` when appropriate).
4. Update dependent code (queries, types, API inputs/outputs).
5. Verify: migration applied + `npm run build`.

## Notes

- Keep migrations small and reviewable.
- If the change is destructive, call it out explicitly (data loss risk).
