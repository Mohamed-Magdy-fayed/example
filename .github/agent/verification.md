# Verification Guide

## Default requirement

For this repository, prefer `npm run build` as the primary verification step.

## Choose the smallest relevant verification

- UI-only changes: `npm run build` (catch server/client boundary + imports)
- Type-level refactors: `npm run typecheck` (and still `npm run build` before done)
- Formatting / lint: `npm run check` (read-only) or `npm run check:write`
- DB schema work: use `npm run db:generate` + `npm run db:migrate` (or `npm run db:push` when appropriate), then `npm run build`

## Reporting verification

In your summary, include:
- Commands run (exact)
- Any known gaps (e.g. “no tests exist for X yet”)

## Guardrails

- Don’t claim verification you didn’t run.
- Don’t broaden scope: if verification fails for unrelated reasons, note it and stop unless asked to fix.
