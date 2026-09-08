# hycudesign.com — read this before you touch anything

Static HTML, CSS and one JS file. **No build step.** GitHub Pages serves the repo root, so
**`main` IS production** — a merge is the deploy, and `https://hycudesign.com` is live a minute
later. There is no staging.

Wyatt is a designer, not a full-time engineer. Explain in plain language; if you use a term like
"runner" or "patch-id", say what it means in the same sentence.

---

## Before you start

**Branch from `origin/main`, never from local `main`.** Another session may have commits sitting on
local `main` unpushed. `git fetch && git checkout -b <branch> origin/main`.

**Another session is probably working in this repo right now.** Check: `git worktree list`. If one
is live, you own only the files you were told to own — **file ownership, not topic ownership.** Two
sessions told to work on "separate things" both landed in `style.css` and `.claude/` on 2026-09-08
and spent an hour untangling it. If you need a file you weren't given, ask Wyatt.

**Never read shared state from your own working tree.** A worktree carries a photograph of every
file taken when the branch was cut. To know what another branch did, read `origin`:
`git show origin/main:<path>`. A session that read its own copy of the CEO ledger on 2026-09-08 told
Wyatt the push gate was broken; it wasn't, its copy was hours stale.

## Before you push

**Ask Wyatt first if another session is live.** This costs one message and prevents the whole class
of collision. It is what actually worked on 2026-09-08.

**Push once, when the work is coherent — not per fix.** `git push` is not a save button. Five
pushes on one branch means five CEO reviews, and Wyatt has told us that is annoying. Commit and
rebase as often as you like.

**A push to `main` needs a fresh CEO verdict** (see the gate, below). A push to a feature branch
needs nothing.

## Staging

**`git add -A` is banned in this repo.** Stage by path, always. Wyatt edits copy in his own working
tree while sessions work, and `git add -A` has swept his unfinished edits into session commits more
than once (CEO Reviews 9, 26, 32). **His edits are his** — commit them only when he says so, alone,
in their own commit.

**Never `cd` out of this repo.** Two incidents on 2026-09-02: a read-only `cd` into another project
persisted, and the next write landed in the wrong repo. Use `git -C <path>` or absolute paths.

## The gate

`scripts/hooks/pre-push` refuses a push to `main` unless the newest CEO verdict names a commit HEAD
can reach, with nothing site-facing changed since. It reads the verdict from **`origin/main`**, not
your working tree, and fails closed if it cannot fetch.

- Verdicts: one file per review, `.claude/reviews/NNNN-slug.md`, newest = highest number.
  **Append a new file; never edit an old verdict or the `CEO-REVIEWS.md` index.**
- Exempt from the gate: `.claude/`, `scripts/hooks/`, top-level `*.md`, `.gitignore`.
  **Not exempt: `scripts/check.mjs` and `scripts/shoot.mjs`** — those are the proof.
- **A rebase orphans the reviewed commit and re-blocks the push.** That is deliberate; take a fresh
  verdict rather than a bypass.
- `git push --no-verify` bypasses it. **A working session never does.** Only Wyatt, and only when he
  says so explicitly.
- `core.hooksPath` is an **absolute path into the main checkout**, so every worktree runs that one
  hook file. Editing it on a branch changes nothing until someone pulls in the main checkout — and
  then it changes for every session at once. Say so if you touch it.

## Testing

```bash
npm run check   # copy rules only, fast
npm test        # check + a real browser at desktop and phone widths
```

`npm test` rewrites `.claude/TEST-REPORT.md`, which is **gitignored** — read it and cite its
timestamp; don't commit it, and don't hand-merge it.

**`scripts/check.mjs` is this repo's proof.** It fails on the scrubbed client's brand name or product
category (`scripts/scrub.json`), and on first-person singular in site copy.

## Two rules the site itself enforces

**"We", never "I".** The site reads as a studio. Collaborators may be named on study pages.

**The oral-care client is never named**, nor its product category. Sector descriptor only:
"a consumer oral-care brand."

**Never touch:** `CNAME`, `robots.txt`, `sitemap.xml`.

## Where the records live

| File | What it is |
|---|---|
| `.claude/memory/DECISIONS.md` | **What Wyatt has already ruled. Read it before re-opening anything.** Newest at top; append the moment he rules. |
| `.claude/OFFICERS.md` | The officer adapter: settings, and the repo facts an officer needs. |
| `.claude/reviews/` | Every CEO verdict, one per file. |
| `.claude/BACKLOG.md` | Open items, `HY-<n>`. |
| `EDITING.md` | How Wyatt edits copy himself. |

A project is named identically in four places — the graph tile (`data/projects.json`), the page
`<title>`, the Work card, and the study head. Change one, change all four.
