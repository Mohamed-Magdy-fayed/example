---
name: bugfix
description: Workflow scaffold for fixing a bug safely.
allowed_tools: ["Read", "Grep", "Glob", "Edit", "Bash"]
---

# Bugfix

## Goal

Fix a specific defect without introducing regressions.

## Suggested sequence

1. Reproduce (or at least locate) the failing behavior.
2. Identify the smallest root-cause fix.
3. Implement the fix with minimal collateral changes.
4. Verify: `npm run build` (and any targeted checks).
5. Summarize: root cause, fix, verification, risk.

## Notes

- If reproduction is hard, add a narrow guard (test or runtime assertion) when appropriate.
- Don’t “refactor while you fix” unless the refactor is required for correctness.
