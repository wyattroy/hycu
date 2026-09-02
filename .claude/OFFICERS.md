# Officers — hycu adapter

**The officers hold the judgment; this file holds the facts.** Written 2026-09-02 on an empty repo
(one commit, `.gitattributes` only), filled from Wyatt's rulings that day rather than from a
verified build. Lines marked *(default)* were not asked of him — correct them and say so.

## The settings

- **production-ref:** main
- **production-url:** https://hycudesign.com
- **staging-command:** none
- **build-stamp-command:** git log -1 --format=%h
- **test-command:** node scripts/check.mjs
- **trial-report:** .claude/TEST-REPORT.md
- **verdicts:** .claude/CEO-REVIEWS.md
- **backlog:** .claude/BACKLOG.md
- **backlog-id-pattern:** HY-\d+
- **ledger:** .claude/CTO-LEDGER.md
- **questions:** .claude/CTO-QUESTIONS.md
- **lock:** .claude/.cto-lock
- **memory:** .claude/memory
- **never-touch:** CNAME, robots.txt, sitemap.xml

## What an officer must know beyond the settings

**`main` IS production, with no build step.** GitHub Pages serves the repo root (Wyatt's ruling,
2026-09-02: "pages from main root"). The build stamp is therefore the commit hash.

**There is no staging *(default)*.** Previews reach Wyatt as Claude artifacts published from the
working session; nothing in the shell publishes anywhere but production. A CTO on this repo has no
output channel and must park its work until one exists.

**`scripts/check.mjs` is this repo's proof.** It fails on any scrubbed client name, on first-person
singular voice in site copy, and on a page that is missing. A site that says "I" or names the
oral-care client has broken a ruling, not a style preference.
