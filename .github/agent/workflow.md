# Default Workflow

Use this loop for most coding tasks in this repo.

## 1) Understand

- Identify the user-visible outcome and acceptance criteria.
- Locate the “source of truth” files (routes, actions, procedures, schema, UI).
- Confirm constraints (auth model, i18n/RTL expectations, UI conventions).

## 2) Plan (only if needed)

Write a plan when the task is multi-step, spans multiple areas, or has ambiguity.

A good plan:
- Is ordered and verifiable
- Names specific files/symbols likely to change
- Includes a verification step

See `planning.md`.

## 3) Execute

- Make the smallest set of changes that satisfy the requirement.
- Prefer reusing existing patterns over inventing new ones.
- Keep edits localized; avoid “drive-by” formatting and refactors.

## 4) Verify

- Run the most relevant check(s) for the touched area.
- In this repo, default verification is `npm run build`.

See `verification.md`.

## 5) Summarize

Always include:
- What changed (high level)
- Where (key files)
- How verified (commands run)
- Risks / follow-ups (if any)
