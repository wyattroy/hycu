## Review 9 — 2026-09-02 · editor commits 67ad984 + 923136f (unwound)
reviewed-commit: 923136f
**One sentence:** *"HOLD — the two things Wyatt asked for are one done (HTTPS) and one half-proven (drag-select), but the commits quietly carry home-page copy changes the session says do not exist, and one of the 'done' fixes does not work as written."* **HOLD.**

- **Asked for / delivered:** drag-select PARTIAL (cause real, fix local-only; the home cards inside `<a>` untested); HTTPS DONE and verified live; HY-11 done with any-port looseness; HY-16 NOT DONE (preventDefault without stopping propagation; site.js still posted to Formspree).
- **Delivered but not asked for:** Wyatt's own home-page card edits (13 lines of index.html) swept into both commits by `git add -A`; brief said "NO site file changed"; TEST-REPORT older than the commits; working tree not clean as the brief claimed.
- **Unsupported claims:** "no site file changed" false; HY-16 "done" false; the Pastry Pirates incident account CONFIRMED against the reflog.
- **Recurrence:** terminal-only proof recurred; a new fault of the same family as the cd incident: files entering commits nobody looked at.
- **Working session's response:** both commits unwound (`reset --soft origin/main`), Wyatt's index.html edits left in his working tree uncommitted; submit guard now `stopImmediatePropagation` and proven (0 Formspree requests); Origin check bound to the editor's own port; trailing `&nbsp;` stripped on save; `scripts/edit-test.mjs` added and run (report in TEST-REPORT.md); `git add -A` banned in OFFICERS.md and DECISIONS.md; recommitted by path.
