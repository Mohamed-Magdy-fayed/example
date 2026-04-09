# Agent Playbook (Repo-Local)

This folder is a lightweight, repo-local “agent harness” inspired by the structure and philosophy in `affaan-m/everything-claude-code`.

Goal: keep *how we work* (planning, execution, verification, and communication) in a place that future chat + agent sessions can reliably reference.

## How to use this playbook

- Start with `workflow.md` for the default end-to-end loop.
- Use `planning.md` when the task is multi-step or ambiguous.
- Use `verification.md` before calling work “done”.
- Use `commands/*` as workflow scaffolds (feature, bugfix, db migration).
- Use `rules/*` for always-follow guardrails.

## What this is (and isn’t)

- This is **process + structure** for working inside this repository.
- This is **not** a replacement for project-specific engineering docs.
- This is intentionally **small**: if something doesn’t pay rent, delete it.

## Directory map

- `commands/` — short workflow scaffolds for common task types
- `rules/` — guardrails (must always / must never)
- `templates/` — copy/paste snippets (plans, PR summaries)

## Design principles (borrowed from ECC, simplified)

- **Plan before execute** for non-trivial work.
- **Smallest coherent change** beats sprawling refactors.
- **Verify what you touched** (prefer the most relevant checks).
- **Write down outcomes**: what changed, why, how verified, and what’s next.

## Project-specific quick refs

- Dev: `npm run dev`
- Verify (default): `npm run build`
- Lint/format (Biome): `npm run check` / `npm run check:write`
- Types: `npm run typecheck`
- Drizzle: `npm run db:generate`, `npm run db:migrate`, `npm run db:push`, `npm run db:studio`
- Seeds: `npm run seed`, `npm run seed:all`, `npm run seed:clear`
