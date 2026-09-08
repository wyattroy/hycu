# hycu — how we work

Static HTML, CSS and one JS file. **No build step.** GitHub Pages serves the repo root, so
**`main` IS production** — a merge is the deploy and hycudesign.com is live a minute later. There is
no staging. `npm run edit` opens an inline editor Wyatt uses to change copy in his own browser.

## Working with Wyatt

He is a designer, not a full-time engineer, and he is fast. **Explain in plain language.** If you use
a word like "runner", "patch-id" or "headless", say what it means in the same sentence. He has said
so directly: "you're using too much jargon."

**His copy edits are his.** He edits text in his own working tree while sessions work. Never commit
his in-progress edits unless he says so, and then alone, in their own commit. **`git add -A` is
banned in this repo** — stage by path, always. It has swept his unfinished work into session commits
three times (CEO Reviews 9, 26, 32).

**Give him the decision, not the survey.** When something is genuinely his call — copy, naming,
whether a claim can stand — put it to him in a line and carry on with everything else.

**Tell him what you did not check.** Every CEO verdict in this repo ends with that section, and it is
the most useful part of them.

## Where getting it wrong costs real damage

**`main` is production.** There is no CI and no branch protection, so the only thing between a bad
commit and the live site is the pre-push gate and your own care. A merge ships instantly.

**The oral-care client is never named**, nor its product category. Sector descriptor only: "a
consumer oral-care brand." `npm run check` fails on the scrub list in `scripts/scrub.json`.

**"We", never "I".** The site reads as a studio. `check.mjs` fails on first-person singular in site
copy. Collaborators may be named on study pages.

**Never touch:** `CNAME`, `robots.txt`, `sitemap.xml`. Getting the custom domain wrong took two hours
to recover once.

**Never `cd` out of this repo.** Two incidents on 2026-09-02 — a read-only `cd` persisted and the
next write landed in another project. Use `git -C <path>` or absolute paths.

## Working alongside another session

Assume there is one. `git worktree list` tells you.

**Branch from `origin/main`, never local `main`.** Another session may have unpushed commits sitting
there. `git fetch && git checkout -b <branch> origin/main`.

**You own files, not topics.** Two sessions told to work on "separate things" both landed in
`style.css` and `.claude/` on 2026-09-08. If you need a file you were not given, ask Wyatt.

**Never read shared state from your own working tree.** A worktree carries a photograph of every file
taken when its branch was cut. To learn what another branch did, read the remote:
`git show origin/main:<path>`. A session that read its own copy of the CEO ledger told Wyatt the push
gate was broken. It was not — its copy was hours stale.

**Ask before you push while another session is live.** One message, and it prevents the whole class.
It is what actually worked on 2026-09-08.

## The workflow

**Push once, when the work is coherent — not per fix.** `git push` is not a save button; five pushes
meant five CEO reviews in one afternoon and Wyatt told us that was annoying. Commit and rebase freely.

**A push to `main` needs a fresh CEO verdict.** A push to a feature branch needs nothing.
`scripts/hooks/pre-push` reads the newest verdict from `origin/main` — not your working tree — and
fails closed if it cannot fetch.

- Verdicts: one file per review, `.claude/reviews/NNNN-slug.md`, newest = highest number.
  **Create the next file. Never edit an old verdict, or the generated `CEO-REVIEWS.md` index.**
- Exempt from the gate: `.claude/`, `scripts/hooks/`, top-level `*.md`, `.gitignore`.
  **Not exempt: `scripts/check.mjs`, `scripts/shoot.mjs`** — those are the proof.
- **A rebase orphans the reviewed commit and re-blocks the push.** Deliberate. Take a fresh verdict.
- `--no-verify` bypasses it. **A working session never does.** Only Wyatt, and only when he says so.
- `core.hooksPath` is an **absolute path into the main checkout**, so every worktree runs that one
  file. A hook change goes live when someone pulls there, not when it merges. Say so if you touch it.

**Testing:**

```bash
npm run check   # copy rules only, fast
npm test        # check + a real browser at desktop and phone widths
```

`npm test` rewrites `.claude/TEST-REPORT.md`, which is gitignored. Read it, cite its timestamp, do
not commit it and do not hand-merge it.

## Read the record before you re-open anything

| File | What it is |
|---|---|
| `.claude/memory/DECISIONS.md` | **What Wyatt has already ruled.** Newest at top; append the moment he rules. Read it before proposing anything he has settled. |
| `.claude/OFFICERS.md` | The officer adapter: settings, and the repo facts an officer needs. |
| `.claude/reviews/` | Every CEO verdict, one per file. |
| `.claude/BACKLOG.md` | Open items, `HY-<n>`. |
| `EDITING.md` | How Wyatt edits copy himself. |

## The project

Eight case studies, a Studio page, a Contact page, and a 3D graph on the home page that is the only
thing on the site that moves. Axes: Understand ↔ Make, Product ↔ Idea, and Reach.

**A project is named identically in four places** — the graph tile (`data/projects.json` `name`), the
page `<title>`, the Work card, and the study head. Change one, change all four.

Type is Shrikhand for the two big header roles and Geist for everything else. The visual direction is
"Restraint" (see DECISIONS.md): near-white, near-black, hairlines, no cards, generous margins.
