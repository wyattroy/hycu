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

**`scripts/hooks/pre-push` gates every push on a recorded CEO verdict** (`git config core.hooksPath scripts/hooks`, set on this machine; re-run after a fresh clone). The verdict entry must carry `reviewed-commit: <sha>`.

**`scripts/check.mjs` is this repo's proof.** It fails on any scrubbed client name, on first-person
singular voice in site copy, and on a page that is missing. A site that says "I" or names the
oral-care client has broken a ruling, not a style preference.

**GitHub Pages HTTPS, learned 2026-09-02.** The certificate would not issue for two hours after DNS
pointed at GitHub. Two causes, both needed: (1) Squarespace's default **AAAA** records still pointed
IPv6 at Squarespace, so GitHub judged the domain misconfigured; Wyatt deleted them. (2) GitHub does
not always re-verify on its own: clear the custom domain and re-enter it (`gh api -X PUT
repos/wyattroy/hycu/pages -F cname=` then `-f cname=hycudesign.com`), the same fix Pastry Pirates
needed (pastrypirates/docs/GIT-AND-DEPLOY.md). Name the full repo in any such command; the same
call on the wrong repo unsets a live domain.

**The shell's working directory is not a fact you may assume, learned 2026-09-02.** A read-only
`cd` into another project for a grep left the shell there, and the next `git commit` landed in
that repo (undone within the minute, nothing pushed). Every command that writes starts with
`cd /Users/wyattroy/Documents/Projects/hycu &&`.

**`git add -A` is banned in this repo, learned 2026-09-02.** Wyatt edits copy in his own working
tree through the inline editor while a session works. `git add -A` swept thirteen lines of his
unfinished home-page edits into a session commit, and the session's brief then said no site file
had changed. Stage by path, always; his edits are his to commit (see EDITING.md).

**Second working-directory incident, 2026-09-02, same day as the first.** A `cd` into the
portfolio repo for a read-only look at source text persisted into the next command, whose Python
rewrote the portfolio's `data/projects.json` (restored with `git checkout`, nothing committed or
pushed). The rule is now mechanical: **never `cd` out of this repo.** Read other repos with
`git -C <path>` or absolute paths; every Python heredoc opens with
`os.chdir('/Users/wyattroy/Documents/Projects/hycu')`.
