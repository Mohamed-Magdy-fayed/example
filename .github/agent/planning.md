# Planning Guide

## When to write a plan

Write a plan when:
- The change spans multiple files/modules
- There are unknowns (missing requirements, unclear source of truth)
- There is risk (auth, payments, permissions, data migrations)
- You expect more than ~15 minutes of work

Skip a plan when:
- It’s a 1–2 line fix
- It’s a trivial rename

## Plan structure

Use 3–8 steps. Each step should be independently checkable.

Suggested headings inside a plan:
- **Goal** (what “done” means)
- **Constraints** (must/ must not)
- **Steps** (ordered)
- **Verification** (commands / routes / tests)

## Decomposition heuristics (ECC-style, simplified)

- Separate: *discovery* → *implementation* → *verification*.
- If a step is not verifiable, it’s probably not well-defined.
- Prefer “thin vertical slices” (UI + API + data) over building large abstractions first.

## Risk checklist

Before you start coding, quickly answer:
- What can break? (auth/session, permissions, i18n/RTL, DB schema)
- What should be verified? (build, typecheck, targeted tests)
- What’s the rollback? (revert commit / migration plan)

## Templates

- Plan template: `templates/plan.md`
- PR / change summary template: `templates/pr-summary.md`
