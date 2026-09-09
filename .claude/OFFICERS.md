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
- **verdicts:** .claude/reviews/
- **backlog:** .claude/BACKLOG.md
- **backlog-id-pattern:** HY-\d+
- **ledger:** .claude/CTO-LEDGER.md
- **questions:** .claude/CTO-QUESTIONS.md
- **lock:** .claude/.cto-lock
- **memory:** .claude/memory
- **never-touch:** CNAME, robots.txt, sitemap.xml

## What an officer must know beyond the settings

**`verdicts` is a DIRECTORY, since 2026-09-08, not a file.** One verdict per file,
`.claude/reviews/NNNN-slug.md`, newest = highest number; `.claude/CEO-REVIEWS.md` is a generated
index and must never be appended to. **`ceo_brief.mjs` cannot read a directory**: it reports "NO
PREVIOUS VERDICT ON RECORD" and says plainly that it could not see the setting, which is correct
behaviour and not a silent failure. Until the engine learns to read a directory (it lives in
claude-kit, not this repo), **the session assembling a brief must paste the newest verdict in by
hand** and say that it did. The recurrence check is the whole point of handing a CEO the last
verdict; losing it silently would be the worst outcome of the split.

**`main` IS production, with no build step.** GitHub Pages serves the repo root (Wyatt's ruling,
2026-09-02: "pages from main root"). The build stamp is therefore the commit hash.

**There is no staging *(default)*.** Previews reach Wyatt as Claude artifacts published from the
working session; nothing in the shell publishes anywhere but production. A CTO on this repo has no
output channel and must park its work until one exists.

**There is no push gate, since 2026-09-09.** `scripts/hooks/pre-push` is deleted and `core.hooksPath`
is unset in every checkout. `.github/workflows/test.yml` runs `npm test` on every pull request
instead. **A CEO review is something Wyatt or a session asks for, not something a push owes** — write
the verdict to `.claude/reviews/` when one is run, and do not block anything on its absence.

*(Historical note, found when it was removed: `core.hooksPath` had been set per-worktree rather than
globally, on two worktrees only. The main checkout never had it, so pushes from there were never
gated. Any verdict before 2026-09-09 that reasons about "every push" was reasoning about two
worktrees.)*

**The trial report is no longer committed, since 2026-09-08.** `.claude/TEST-REPORT.md` is written
by every `npm test` and is now gitignored: two branches that both run the tests conflict on it every
time, which is what a generated file tracked in git always does. It is still written to the same path
and an officer should still read it — but read it as *the local file, with a timestamp*, and say when
it was produced. **Do not fault a commit for not carrying its own report, and do not treat a committed
report as proof that a commit was tested.** Review 29 praised the report sitting inside the commit it
described; that evidence is gone on purpose, and the timestamp is what replaces it.

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
