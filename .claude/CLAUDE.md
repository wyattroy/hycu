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

**Never hand him a tracking number and expect it to mean something.** Wyatt, 2026-09-09: *"never tell
me bug names ('HY-37') -- what am i supposed to do with that? describe what needs my decision with
enough context for me to make that decision."* `HY-<n>` is an index for sessions, not a way to talk
to him.

When something needs his ruling, give him, in this order: **what is wrong, where you saw it, what the
options are and what each costs, and which one you would pick.** Numbers he can check beat adjectives.
If the answer is obvious, do not ask at all — do it and say what you did. If it is genuinely his
call, one short paragraph is usually enough; a list of four unexplained ids is never enough.

## Where getting it wrong costs real damage

**`main` is production.** A merge ships to hycudesign.com instantly, with no build step and no
staging. GitHub runs `npm test` on every pull request, so open one and let it go green rather than
pushing straight to `main`.

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

## Keeping the checkouts current — you do this, not Wyatt

**Wyatt does not manage git.** He said so on 2026-09-08: "i don't want to manage git." Any pulling,
fetching or rebasing that needs doing is a session's job, done without being asked and reported in a
line.

**Start every session with `git fetch origin`.** Nothing you read from your own tree tells you what
the remote has.

**After anything merges to `main`, update the MAIN CHECKOUT** at
`/Users/wyattroy/Documents/Projects/hycu` — not just your worktree:

```bash
git -C /Users/wyattroy/Documents/Projects/hycu status --porcelain   # check FIRST
git -C /Users/wyattroy/Documents/Projects/hycu pull --ff-only
```

The reason it has to be that checkout: the officer records, the backlog and the decision log a
session reads out of it are stale until it has pulled, and that is where Wyatt looks. (Until
2026-09-09 there was a second reason — `core.hooksPath` pointed into it — but the gate is gone.)

**Check `status --porcelain` first, every time.** Wyatt edits copy in that checkout's working tree
while sessions run. **If it is dirty, do not pull** — tell him what is uncommitted and let him decide.
Pulling over his unfinished edits is the Review 9 fault with a different command.

**Never `git pull` inside a worktree on a feature branch.** That merges `main` into your work and
leaves a merge commit nobody asked for. Use `git fetch origin && git rebase origin/main`, and expect
the rebase to orphan the reviewed commit and re-block the push — that is deliberate, take a fresh
verdict.

## The workflow

**Push once, when the work is coherent — not per fix.** `git push` is not a save button; five pushes
meant five CEO reviews in one afternoon and Wyatt told us that was annoying. Commit and rebase freely.

**Nothing gates a push.** The pre-push hook was deleted on 2026-09-09 and `core.hooksPath` unset.
Push whenever the work is coherent.

**GitHub runs `npm test` on every pull request** (`.github/workflows/test.yml`), from a fresh clone.
That is the check that matters and it cannot be skipped. If it is red, fix it before merging — `main`
is production, so a merge is the deploy.

**A CEO review is invoked, never required.** `/ceo` gives a fresh agent the change and asks whether
what Wyatt asked for actually happened. It is worth asking for when a change is risky, when it
touches copy that makes a claim, or when you want a blindspot check before he sees it — **and it is
not a gate.** Do not run one on every push; that cost him five reviews in one afternoon and he said
so. The 37 verdicts in `.claude/reviews/` are history; adding to them is optional.

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
| `BACKLOG.md` | **Changes the website needs**, in plain language, Wyatt-facing. Read it before starting site work, and add to it when you find something the site needs and are not doing now. |
| `.claude/BACKLOG.md` | Engineering leftovers from CEO reviews, `HY-<n>`. Session-facing. Not the same list as `BACKLOG.md`. |
| `EDITING.md` | How Wyatt edits copy himself. |

## The project

Eight case studies, a Studio page, a Contact page, and a 3D graph on the home page that is the only
thing on the site that moves. Axes: Understand ↔ Make, Product ↔ Idea, and Reach.

**A project is named identically in four places** — the graph tile (`data/projects.json` `name`), the
page `<title>`, the Work card, and the study head. Change one, change all four.

Type is Shrikhand for the two big header roles and Geist for everything else. The visual direction is
"Restraint" (see DECISIONS.md): near-white, near-black, hairlines, no cards, generous margins.
