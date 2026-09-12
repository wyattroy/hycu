# Wyatt's standing decisions — hycu

**What has been chosen, why, and when — so nobody asks twice.** Newest at the top.

---

## 2026-09-12 — A covered cube is meant to be untappable

**Cubes hiding one another is not a fault. The reader swivels the graph.** Wyatt, 2026-09-12:
*"a covered cube SHOULD be untappable"* and *"the user is able to swivel the graph to uncover it."*
This is the same ruling he made about the axis labels on 2026-09-08, applied to the cubes: what is
in front of what is information about depth, not damage to be engineered away.

**What this struck down.** A pass had measured how often one cube covered another — 81% of frames
on desktop, 88% on a phone — treated it as a defect, and rewrote `separate()` to push cubes apart
**on the screen**, so that no cube was ever hidden from the current angle. It worked (0% obscured
on a phone) and it was wrong: it moved cubes off the positions their capabilities earned them for a
reason that lasts only as long as the reader holds still. **It is unwound.** `separate()` pushes
apart only pairs genuinely close in space — where no angle would separate them, which is the
2026-09-09 rule — and deliberately skips pairs that merely stack up under perspective.

**The browser pass now holds the cubes still for its click/tap check.** That check reads a tile's
position and taps a beat later, and it caught the movement honestly: a tap meant for Cited by AI
opened Spatial Equity. Freezing is the right fix rather than a cover-up, precisely because of the
ruling above — the check exists to prove a tile routes to its study and that nothing invisible
covers the canvas, not that a moving target can be hit blind, which no visitor attempts.

## 2026-09-12 — The cubes move, and a cube may leave its own quadrant

**A cube tours the quadrants of every capability its project used, and it is allowed to cross the
midline into them.** Wyatt, 2026-09-12: *"make the cubes on the 3d graph gently move between the
areas of the graph that describe the components of the project -- eg. pastry pirates is both
systems design and product design; cited by ai is both strategy and user research."*

`data/projects.json` has always recorded that a project is more than one capability — `capabilities`
is an ordered list — and the graph only ever drew the first entry, because a point can only be in
one place. Now the cube visits the rest.

**A stop is a DESTINATION, not a lean.** Wyatt, 2026-09-12: *"The intention behind this whole
movement piece is to show that each project uses techniques from multiple quadrants. It's to move
each project from its home quadrant INTO the other quadrants where it also used those
techniques."* A first attempt aimed each stop at the quadrant's caption and leashed the distance;
measured, **four of its eleven stops never left the home quadrant at all** — Pastry Pirates never
reached systems design, ClaudeKit never reached product design — and every stop that did arrive
crossed by a hair before turning round. It also dragged all eight cubes toward four midpoints.

**The rule that replaced it: a visit is the project's own position REFLECTED into the quadrant
being visited.** On the axis the two quadrants agree about, nothing moves — Pastry Pirates is far
into Make and both its capabilities are Make-side, so it keeps its own far-right x. On the axis
they differ about, the sign flips and the magnitude is kept, so a cube is as deep into the
capability it is visiting as it is into the one it lives in. Arrival is guaranteed by construction:
the destination IS a point in that quadrant, and all nine visits land. One dial, `visitDepth`,
slides the landing point between just inside the far quadrant's edge and the full reflection.
`secondaryPull`, `maxExcursion` and `crossMidline` are retired — they all existed to limit a
journey that is now defined by where it ends.
**A cube out visiting is a project being read as two things at once. Do not clamp it back to
protect the colour rule** — the rule that `capabilities[0]` names the quadrant, colours the cube and
is the word every page prints (2026-09-09, above) is a rule about **the data**, and
`scripts/check.mjs` still asserts it against `data/projects.json`. Motion is a reading of that data
at runtime, never a second source of it.

**The twenty numbers in `DRIFT` at the top of `js/scene.js` are his, dialled in a tuner page on
2026-09-12, not defaults anyone guessed.** The ones that carry a judgement: a 12.5s glide over a
5.2s rest, so a cube is travelling more often than it is parked; `secondaryPull` 0.64, which is far
enough to read as an arrival rather than a lean; and `separation` 1.6 with `separationPush` 0.05 —
a wide net and a feather touch, so a pair eases out of each other's way instead of bouncing. Change
one and say which, rather than re-dialling the set.

**Every one of those numbers is a ratio or a duration, never a length.** Wyatt, same day:
*"separation (in fact all these numbers) should be ratios, not absolute values, right? that way
they apply across scales."* Three of them were lengths. The reason it mattered is not the obvious
one — the box is `R = 5.5` at every screen width, so a world length is already a fixed share of it.
What differs is `spread()`, 0.88 on desktop and 1.15 on a phone, **and the clamp was applied after
it**: `maxExcursion: 2.35` let a desktop cube stray 0.49 of a half-axis and a phone cube only 0.37.
The same dial said two different things about the same project. `maxExcursion` and `sway` are
fractions of a half-axis now, applied before spread, and `reachAmpl` is a fraction of half the
reach span. **The desktop values he approved are unchanged** — 2.35 became 0.486, 0.09 became
0.0186, 0.42 became 0.07 — and a phone simply stops holding its cubes 31% tighter than his ruling.

**`separation` was already a ratio**, and so was everything else: it is a multiple of the two
cubes' own half-widths with `tileScale()` inside it, so it already grew with the phone's larger
cubes. Durations are durations at every width. If a new dial is ever added, it is a ratio or it
is a duration — there is no third kind.

**What is not negotiable underneath it:** cubes land exactly on their data point and only then ease
out (`settleInMs`), a hovered cube freezes where it stands rather than snapping home, and
`prefers-reduced-motion` parks all of it. Overlapping pairs are pushed apart in the x/y plane only
— reach is data.

## 2026-09-09 — One capability word, and it lives in the data

**`data/projects.json` `capabilities` is the only place a capability is written. Every page prints
it verbatim.** Wyatt, 2026-09-09: *"Make the page use the data's word verbatim … color each cube
according to its primary quadrant. make the rule."*

The rule, in one line: **`capabilities[0]` is the project's primary capability. It names the
quadrant, it colours the cube, and it is the word the page prints — the same string in all four
places, never a paraphrase.**

- **The cube's colour** comes from `capabilities[0]` via `CAP_COLORS` in `js/scene.js`. The four
  quadrant captions on the back wall carry the same four hues, so a colour always names a quadrant.
- **The study page eyebrow** and **the Work card** print `capabilities[0]`, character for character.
- **The study rail's Capabilities row** prints the whole `capabilities` list, verbatim.

**What this replaced.** The pages carried hand-written phrases that drifted from the data: "Design
research" where the data said User research, "Content strategy" where it said Strategy, "Strategy &
platform", "Game & systems design". The rail had drifted separately into sentence case — "User
research, strategy" — and Polycam's rail said "research" where the data said User research. Four of
the eight disagreed with their own colour.

**Two rulings inside the same instruction:** *"spatial equity should count as user research and
system design"* — its `capabilities` are now `["User research", "Systems design"]`, replacing
Strategy as the second. *"polycam should count as strategy and be called strategy"* — its data
already led with Strategy; it was the page that said "Content strategy", and now says Strategy.
**No cube changed colour**, because both projects' first capability was already right.

**Position, colour and word all agree, two projects per quadrant** (Wyatt, 2026-09-09): *"I want
cubes in each quadrant. strategy: how to change institutions, polycam / user research: spatial
equity, [the oral-care study] / systems design: claude kit, pour / product design: pastry pirates,
forgiveness."* Also: *"forgiveness is product design -- i'm designing a web platform for them.
pastry pirates is systems design"* — its primary is Product design, with Systems design second.

Three projects moved across the Product/Idea midline to sit where he put them: Polycam idea 0.3 →
0.62, Pour 0.46 → 0.58, Spatial Equity 0.7 → 0.2. Spatial Equity also moved on `make`, 0.22 → 0.34:
at 0.22 it landed 0.08 from the oral-care study and the browser pass caught the consequence — on a
phone, tapping one tile opened the other. Two projects can share a quadrant; they cannot share a
point. `reach` is untouched on all three.
Three capability lists were re-ordered so the first entry is the quadrant.

**`scripts/check.mjs` now asserts all of it** — that each project's quadrant, read off its axes the
way `js/scene.js` reads it, equals `capabilities[0]`, and that the study eyebrow, the study rail and
the Work card print the data's words. Red-proofed by putting "Content strategy" back on the Polycam
page: it fails. This is written as a check rather than a paragraph on purpose: prose gets re-read and
re-interpreted, a failing test does not.

**And the three self-initiated projects say "Studio · Hycu" in the rail**, matching their cards and
`projects.json`, rather than "Studio project".

## 2026-09-09 — Cube size, the ground's depth, and one contact line

**The graph tiles are cubes, drawn at 1.5× on desktop and tablet and 2× on a phone.** Wyatt saw them
at 1× and asked for larger; shown at 1.5× he said **"approved"**. `TILE` is `1.20`, the old flat
plate's height, and what is drawn is that times `tileScale()`. The comment above `TILE` in
`js/scene.js` carries the measurements — do not change `tileScale()` without reading it.

**The ground is a white bloom over a silver base, and the silver is half as deep as it was.** Wyatt,
2026-09-09: *"the background is now TOO grey … I want the background silver 50% closer to white than
it currently is."* Every stop moved exactly halfway to `#ffffff`, so the shape of the gradient is
unchanged and only its depth moved — darkest stop 39 points off white to 19, lightest 9 to 5.

**The bloom is untouched and still reaches pure white at its centre.** He asked whether it was really
pure white behind the headline: yes, at one point. `#ffffff` at the centre stop, 82% opacity at 34%,
transparent at 72%. The lightness comes from behind the words, which was the point of the earlier
ruling: *"i don't want the top of the page to be the lightest area, because that reads as white."*

**The Studio contact block now reads the same as the homepage's** — "We reply within two working
days." His earlier removal of "One sentence is enough to start" was homepage-only by his own
instruction; on 2026-09-09 he extended it: *"fix /studio this to copy the homepage."*

## 2026-09-08 — Axis labels sit on their axes; they do not dodge the tiles

**The four axis labels stay pinned to their axes. They are not moved, and the tiles are not shrunk,
to stop a label overlapping a tile.** Wyatt, 2026-09-08: *"the axis labels must sit on their axes …
the tiles are shiftable by the user"*, and again on 2026-09-09 when it was misread: *"the axis
labels don't NEED to clear the cubes -- the user moves the cubes so the axis labels are within their
control to see around"* … *"i already ruled this in the past"*.

**What IS required:** all four labels visible and on screen, UNDERSTAND left of MAKE, PRODUCT below
IDEA — at rest and after a hard drag. `scripts/shoot.mjs` asserts that and nothing more. The check is
deliberately coarse: it catches a label crossing to the wrong side, not a small sidestep, because a
flaky test here is worse than a blunt one.

**Why this is written down rather than left in the test file.** It lived only as a quotation inside
`shoot.mjs`, and a session read it as exempting phones only. Acting on that misreading, another
session spent most of an afternoon shrinking his cubes and walking every label outward to satisfy a
constraint he had already struck down. **A ruling that lives only in a comment gets re-litigated by
whoever reads the comment differently.** If you find yourself sizing the work to protect a label,
this is the entry that says stop.

## 2026-09-09 — The gate comes out, CI goes in, the CEO becomes opt-in

**`scripts/hooks/pre-push` is deleted and `core.hooksPath` is unset.** Nothing blocks a push any
more. This reverses the 2026-09-02 ruling "Nothing ships without a CEO verdict", which was made the
day two layout bugs reached the live site and there was no test suite to catch them. There is one
now, and it is the thing that actually catches them.

Wyatt, 2026-09-09: *"I wish that we just could make simple changes to the site and update it without
all this strange hooks/CI/gates/checks infrastructure, which feels like it has bloated bigger than it
needs to be for this simple 6-page website."* He was right about the size. The process and its
records had reached **1,524 lines against 1,766 lines of site** — near one-to-one for a 13-page
static brochure with one author.

**What replaced it: `.github/workflows/test.yml`.** GitHub runs `npm test` on every pull request and
every push to `main`, from a fresh clone. This is strictly stronger than the hook was — it cannot be
skipped with `--no-verify`, it cannot read a stale copy of anything out of somebody's working tree,
and it never asks Wyatt for anything.

**The CEO is now invoked, never required.** `/ceo` is a good second opinion and it earned its keep —
across Reviews 28-37 it found eight pages downloading a font they never drew, three separate comments
asserting things the repo contradicted, and a hook bug that let `main` through unexamined. **Ask for
it when a change is risky or you want a blindspot check. It is not a gate and it does not block a
push.** The 37 verdicts in `.claude/reviews/` stay as history; nothing is required to add to them.

**Found while removing it, and worth recording because it means the gate never worked as believed:**
`core.hooksPath` was set **per worktree**, in `.git/worktrees/<name>/config.worktree`, on exactly
two of them. **The main checkout never had it**, so Wyatt's own pushes were never gated at all, and
neither were the cubes worktree's. The `--no-verify` carve-out in `EDITING.md` was therefore
protecting against a hook that was not running.

**What stays, because it is cheap and it works:** `scripts/check.mjs` (the scrub list, the no-"I"
rule) and `scripts/shoot.mjs` (every page in a real browser at three widths). Those found the
six-line headline and the eight pages loading an unused font. `DECISIONS.md` and `BACKLOG.md` stay —
they are memory, not approval.

## 2026-09-08 — One PR, not five, and the gate gates what ships

**A session pushes a branch when the work is coherent, opens one PR, and takes one CEO review at
it.** Wyatt: "how do we disable these CEO reviews? they're getting annoying." They were annoying
because a session used `git push` as a save button — five pushes on one branch in one afternoon,
five reviews — not because reviews are wrong. Rebase and commit as often as you like. Push when
there is something to look at.

**`scripts/hooks/pre-push` now gates only pushes to `main`.** The 2026-09-02 ruling says "every push
to `main`"; the hook was refusing every push to anything, which is stricter than the decision it
implements. `main` is production (Pages serves it from root), so a merge is the deploy and this is
the last gate before one. A feature branch is not production.

**Exempt from the gate: officer records (`.claude/`), the hook itself, top-level `*.md`, and
`.gitignore`. Not exempt: `scripts/check.mjs` and `scripts/shoot.mjs`.** OFFICERS.md calls check.mjs
"this repo's proof"; a session that can weaken the tests and ship without anyone reading the change
defeats the one thing a gate is for.

**A rebase requires a fresh verdict, and that is deliberate.** A verdict names a sha, a rebase
replaces it, so everything since reads as unreviewed. Matching by patch-id or tree would paper over
exactly the case where a re-review is most warranted — the phone-hero session's rebase on this day
pulled in a whole merged PR of another session's site changes, and its old verdict had genuinely not
seen that tree. Gating `main` only is what makes this cheap.

## 2026-09-08 — Parallel sessions in this repo

**Shared state is read from `origin`, never from the working tree.** A worktree carries a photograph
of every file taken when the branch was cut. On this day a session read its own copy of the CEO
ledger, saw a newest verdict from before its branch existed, and told Wyatt the push gate was
enforcing a command that was not installed — while another session had recorded that verdict and
pushed it hours earlier. Nothing was wrong with git. **A file in your branch cannot tell you what
another branch did**, and this repo had a gate that asked one to.

**Verdicts are one file per review** (`.claude/reviews/NNNN-slug.md`) because separate files merge
cleanly and a single append-at-top file does not. **`.claude/TEST-REPORT.md` is gitignored** because
`npm test` rewrites it every run and a generated file tracked in git is a merge conflict you re-solve
forever.

**`core.hooksPath` is an absolute path into the main checkout**, so every worktree runs that one hook
file, never its own branch's copy. A hook change goes live for every session at once, when someone
pulls in the main checkout — not when it merges. Do not edit it on a branch without saying so. Found
2026-09-08 by checksumming the three worktrees.

**When two sessions are live, scope them by file, not by topic**, and say the boundary out loud. Both
sessions on this day were told to work on "separate things" and both landed in `.claude/` and
`style.css`. Separate things is not separate files.

## 2026-09-08 — One authorized push, and what it says about the gate

**Wyatt authorized a single `--no-verify` push of `claude/study-head-semantics` at `f5bc2db`.** He
was shown the entire delta since CEO Review 37's PUSH verdict on `f50891a` and chose to ship it:

- two comment blocks — a stale `Needs a local server on :8787` line, and a caveat Review 37 asked for
- `renderedLines: lines.length` deleted, having become a duplicate of `lines`
- `JSON.stringify(h.lines ? h : h)` → `JSON.stringify(h)`, a ternary with identical branches

**No behavioural change. `npm test` passes identically before and after.** Every one of those edits
is a remedy Review 37 named itself.

**The rule stands: a working session never bypasses.** This is Wyatt bypassing, on the record, having
seen the diff — the carve-out `scripts/hooks/pre-push` has always documented.

**The reason it was needed is a real limit worth fixing.** The gate compares file PATHS, so a comment
in `style.css` costs exactly what a rewrite of it costs. Four commits today were post-verdict fixes
that the reviewing officer had itself demanded, and each one re-blocked the push and asked for
another review — Wyatt's "how do we disable these CEO reviews? they're getting annoying" is this
loop. A gate that could tell a comment from a declaration would have let all four through. Logged as
HY-41.

## 2026-09-08 — The headline is sized from its column, and the browser pass serves its own tree

**`.hero-text .display` is `clamp(30px, 8.4cqw, 53px)` against `.hero-text` as a container**, not
`clamp(34px, 3.9vw, 54px)` against the viewport. Wyatt: "audit all of the different screen sizes and
re-logic the header so that these awkward line breaks never happen." The type used to grow with the
window while the column stopped at 720px, so at 1050px the longest line and the box were both 475px
and rounding decided whether you saw three lines or an orphaned "are,". `cqw` is a percentage of the
column, so the line stays at ~97% of it at every width. **The forced break is now gated on the column
being wide enough to hold the line, not on a 721px viewport** — at a 721px viewport the column is
311px and that break produced six rendered lines. Below that width `text-wrap: balance` divides the
words evenly instead of orphaning two.

Measured across sixteen widths before and after. What was live: six lines at 721, five at 768, four
at 820, all with orphans. Now: three lines everywhere from 480 up, four evenly balanced below, no
orphan at any width. **Wyatt's 2026-09-02 ruling that "are" ends the first line is preserved.**

**`scripts/shoot.mjs` starts its own server rooted at its own working tree, and refuses to run if
whatever it is pointed at serves different bytes.** It used to default to `127.0.0.1:8787` and trust
it. A `npm run serve` left running in the **main checkout** since 11:32 answered that port all day,
so **every browser pass run from a worktree on 2026-09-08 tested main's files and reported them as
the branch's.** Three "identical" failures across three trees were three reads of one tree. The
browser pass also runs at **820px** now, the width HY-3 asked for on 2026-09-02 and never got.

## 2026-09-08 — The wordmark goes back to the grotesk

**`.brand` is Geist again**, byte-for-byte the rule from before Shrikhand. Wyatt: "change the logo
font from shrikhand back to whatever it was before — i liked that better." Every page still requests
the display face and still draws with it — `.display` on the five top-level pages, `.proj` on the
eight studies — so nothing strands a font request.

## 2026-09-08 — A study head is h1 → h2 → body

**The project name is the page's `<h1>`, in the display face. The sentence under it is an `<h2>`.
The paragraph under that is body text with no type role of its own.** Wyatt: "restructure the page
css, so that the h1 IS the title... the h2 is the byline... and remove whatever styling this uses to
just make that second-byline use body."

Before this the name was a `<p>` set at 50px and the long sentence was the `<h1>`, so the biggest
thing on the page was not its heading and a screen reader announced the sentence as the page's
title. CEO Review 32 named it: "the one place where 'it looks right' and 'it is right' have come
apart." The visual order does not change; the document now agrees with it.

The third paragraph was a `.lede` — a third display size, greyed. It is now plain body at the
`--measure` width, carrying only margin and a max-width (`.study-intro`). **`.lede` is untouched
everywhere else**: the home hero, `/work/`, `/studio/`, `/contact/` and `404.html` still use it.

## 2026-09-08 — One name and one byline per project

**Every project carries the same name in all four places it is named** — the graph tile
(`data/projects.json` `name`), the page `<title>`, the Work card, and the study head — **and the same
byline on the card and the study head**, client and capability. `projects.json`'s `client` agrees with
both. Wyatt: "every project should have ONE name and ONE byline, consistent." The next-study links at
the foot of each study use the name too.

**Two places the byline still varies, and neither is settled** (CEO Review 32). The eyebrow's capability
is one descriptor and `projects.json` `capabilities` is a list whose first entry colours the graph tile;
they read differently for four projects — Spatial Equity says "Design research" on the page and is
coloured "User research" on the graph. That is HY-37. And the study rail is a fifth place a byline
appears, deliberately longer ("A consumer oral-care brand, unnamed by agreement"), and two pages label
that field **For** where six say **Client**. That is HY-38. Both are copy calls, left for Wyatt.

The eight names: Spatial Equity, What They're Buying, Cited by AI, Teaching Forgiveness, Pastry
Pirates, ClaudeKit, How to Change Institutions, Pour.

**Where a project has a real name, the real name wins over a short invention.** The field guide is
published as *How to Change Institutions* and its own lede at `work/how-to-change-institutions/index.html:36`
says so; "Changing Institutions" was a two-word title this session made up two hours earlier, and
renaming his book to fit a slot would have been the wrong way round. Same principle as Pour,
ClaudeKit and Pastry Pirates, which were never shortened.

**Two bylines were wrong and are fixed:** the Work cards for ClaudeKit and Pastry Pirates read
"CLAUDEKIT · Hycu" and "PASTRY PIRATES · Hycu" while their own study pages and `projects.json` both
said "Studio · Hycu". The client field is the client, not the project.

## 2026-09-08 — The font ships unmeasured

**Shrikhand ships as it is.** Wyatt: "font looks good, ship it." Four CEO reviews asked for a transfer
size, a FOUT and a layout-shift number and none exists, because an officer here is forbidden a
browser. Accepted knowingly, not overlooked. HY-34 closed.

## 2026-09-08 — No CTO on this repo

**The CTO officer is not used here.** Wyatt: "don't use CTO, it's unnecessary." `.claude/CTO-LEDGER.md`
already recorded that no CTO had ever driven this repo and `.claude/OFFICERS.md` that one here has no
output channel; this makes that permanent rather than pending. The CEO stays: it gates every push.
HY-33, the "two officers" line on the Studio page, is closed on his ruling with no change made.

## 2026-09-08 — The wordmark, and short titles on Work

**The `hycu` wordmark is set in Shrikhand.** It sits in the nav, which is on all thirteen pages, so
all thirteen request the display face again — the eight study pages had it removed hours earlier on
CEO Review 28's finding that they downloaded a font they never drew. That finding is not reversed;
its premise is. They draw with it now.

**Each card on the Work page carries a two-or-three-word project title in the display face, above
the sentence-long headline it already had.** Wyatt: "write a 2-3 word project title for each title,
above the current title." Spatial Equity, ClaudeKit, What They're Buying, Cited by AI, Teaching Forgiveness, Pour, Pastry
Pirates, Changing Institutions. Two are one word because they are the project's name. The long
headline stays exactly as it was and still does the explaining.

**Correction, CEO Review 30:** these were written believing they matched the graph tile names in
`data/projects.json`, and five of the eight do not — Spatial Equity / What They're Buying / Cited by
AI / Teaching Forgiveness / Changing Institutions all differ from their tile, and Polycam differs
from its `<title>` too, so that study carries three names in three places. The titles are good and
are staying; the claim that they track the graph was false and is withdrawn. Whether the three
layers should be reconciled is HY-36, unruled.

**The same title sits above the headline on each study page too** (Wyatt, same day, second pass), so
the Work card and the study head name a project identically; the graph tile and the `<title>` do not
always agree with them (HY-36). There it sets larger than the headline it introduces — the short title carries the page and the long
line reads as the deck under it. Neither `<h1>` changed and `.study-head .h-lg` is still Geist.

## 2026-09-08 — A display face for the big headers

**Shrikhand (Google Fonts, OFL — verified: `google/fonts` ships it under `ofl/shrikhand`, `METADATA.pb` says `license: "OFL"`, designer Jonny Pinhorn) carries `.display` and `.h-lg`. Geist keeps everything else.**
Amends the 2026-09-02 "Restraint" direction, which said one grotesk at a few sizes. Wyatt brought a
Ventura specimen (Damn Type Co.) and asked for headers "more in this direction — gen-z warm";
Shrikhand was chosen over Bagel Fat One, Fraunces (SOFT 100 / WONK 1), Titan One, Zodiak, and Boska
as the closest free face to that reference.

The face is display-only and it does not scale down: **the case-study headlines (`.study-head
.h-lg`, twenty to thirty words each) stay in Geist.** Shrikhand carries the short things — the home
hero, the page titles, the section heads. It has one weight, so the header roles set at 400, not
500, and at zero tracking rather than the grotesk's negative; the display sizes step down (66→58px,
44→39px) and the leading opens up, because it sets wider and taller than Geist.

## 2026-09-03 — Graph shows only the eight studies

**The Taxonomy tile is removed from the graph.** Wyatt: "remove the Taxonomy tile from the
graph." Every tile now opens a study. The home page's first band sits close under the graph
(same ruling: "remove the tall pause"). The three copy items the session flagged on the Work
cards (full stop, "discrete", trailing spaces) were fixed on his instruction.

## 2026-09-03 — Case studies leave the home page

**The home page no longer lists the studies; they live on `/work/`.** Wyatt: "remove the case
studies from the homepage -- people can see them under Work." Home is now graph → capabilities →
hypercube → contact. Nav "Work" points at the new page; a small graph tile (no page of its own)
goes there too. His six card edits moved with the cards into `work/index.html`.

## 2026-09-02 — No Index section on the home page

**The "Index / Further work" list (How to Change Institutions, Pour, Taxonomy) is removed from the
home page.** Wyatt: "remove this section from the homepage." The three stay in the graph as small
tiles (the session's call, pending his word), and clicking one scrolls to Selected work.

## 2026-09-02 — Wyatt's copy edits are his

**A session never commits Wyatt's in-progress copy edits, and never uses `git add -A`.** Found by
CEO Review 9: `git add -A` had swept his editor edits into two session commits. Sessions stage by
path. His edits reach `main` when he says so (`git push --no-verify` per EDITING.md, or "I edited
copy" in a session, which then reviews and tests them).

## 2026-09-02 — No Calendly

**No booking widget. Contact is the form (Formspree `maeyjowq`) and nothing else.** Wyatt: "i don't
trust calendly -- so please remove that option from the website." Every "Book a call" became "Get in
touch" / "Write to us". Reverses the 2026-09-02 site-map ruling's "Calendly embed + Formspree form".

## 2026-09-02 — Nothing ships without a CEO verdict *(SUPERSEDED 2026-09-09 — see "The gate comes out" at the top)*

**Every push to `main` is preceded by a fresh CEO review of that commit, recorded with
`reviewed-commit:` in CEO-REVIEWS.md; `scripts/hooks/pre-push` refuses the push otherwise.**
Wyatt, after two layout bugs reached the live site: "do better QA and pass it by CEO every single
time, per CEO's instructions, before shipping." Hand copy edits may push with `--no-verify`; a
working session never does. The browser pass (`scripts/shoot.mjs`, `npm test`) checks every visible text element
against the nav brand's left edge on every page at both widths, and hovers/clicks/taps a real
graph tile, the two faults that got through.

## 2026-09-02 — Thesis line, final

**"We see where you are, then design the way forward with you."** Chosen (option 1 of 7) over his
original "We discover where you are, then design where you'll go." after CEO Review 1 and his
own objection that rewrite "build where you're going" sounded like building to order. *See*
carries the hypercube's clarity, *with you* the collaboration, *the way forward* a destination
that is theirs. It does not say "build"; the six cards beneath it do.

## 2026-09-02 — Names on the site

**Collaborators are named; people who were merely present are not.** Wyatt struck Dean Sarah
Whiting, Lee Cott and Martin Bechthold from the Spatial Equity page and kept Kalana White, Xavaar
Quaranto and Irys Kornbluth: "they were collaborators." The Dean is still referred to by title.

## 2026-09-02 — Thesis line, second pass

**Rewrite 1 ("We see where you are, then build where you're going") rejected: "it sounds like
we're just building what they tell us to."** The line must carry that Hycu designs the way forward
*collaboratively, with the client*. His own closest-to-true version: "we see where you are, then
design a way to get you where you want to be going," which he calls convoluted. New options
requested.

## 2026-09-02 — Graph interaction and theme (session defaults, not asked of Wyatt)

**The wheel is not captured over the graph; zoom is the +/− buttons and pinch.** Chosen over
wyattroy.com's scroll-driven zoom because the graph sits above content people need to scroll to.
**Single light theme, no dark mode.** Direction 1 commits to a white ground. Both are defaults the
session took and named; either can be reversed by a ruling.

## 2026-09-02 — Thesis line

**"We discover where you are, then design where you'll go."** Wyatt's own rewrite of the proposed
"We find out where you are, then design where to go." Sent to a CEO for blindspots before it
becomes the headline; verdict in `../CEO-REVIEWS.md`.

## 2026-09-02 — Site map

**Four pages: Home, Work/‹study› ×6, Studio, Contact. No Services page.** Capabilities live as tags
on every study and as a strip on Home; "with six studies the work is the services page." Studio page
carries the hypercube story, how we engage, capabilities, and **what we don't do**. Contact =
Calendly embed + Formspree form. Approved verbatim.

## 2026-09-02 — Study grammar

**Starting point · What we found · Where we went · What changed (or What's next).** Replaces the
personal portfolio's what/how/why/who, which Wyatt ruled off the table for the studio site.
Metadata rail: Client · Capabilities · Engagement type · Duration · Collaborators.

## 2026-09-02 — 3D graph axes

**x: Understand ↔ Make. y: Product ↔ Idea, with the axis itself labelled "System". z: Reach (one
person → a public).** Chosen from four options (A, modified). Wyatt: "it's not a 2x2 if there are
3 options in it — remove 'system' and just do product vs idea; system becomes the label of the
whole axis." Time is not an axis: a one-year-old firm should not chart its own age.

## 2026-09-02 — Visual direction

**Direction 1, "Restraint": white, near-black, Geist + Geist Mono, huge margins, no cards, no
borders, one system-blue accent for interaction only.** Must be visually distinct from wyattroy.com
(warm white / Source Serif / DM Sans) and must not read as default-AI design (no Inter, no indigo
gradients, no rounded cards, no emoji). "Ideally it looks a little like Apple." Show this one first;
Blueprint / Broadsheet / Swiss / Lab were the alternatives.

## 2026-09-02 — The mark

**A tesseract's 2D projection (cube within a cube, hairlines) beside a lowercase `hycu` wordmark.**
Prose may write "Hycu" — Wyatt: "I don't want to be annoyingly militant about that."

## 2026-09-02 — What goes on the site

**Six selected studies:** Harvard GSD spatial equity · a consumer oral-care brand (unnamed) ·
Polycam · Harvard Human Flourishing Program / Global Forgiveness Movement · Pastry Pirates
(Studio · hycu) · ClaudeKit (Studio · hycu). Self-initiated work sits in the same grid with the
eyebrow "Studio · hycu" (the Nava Labs convention), not in a separate lane.

**Index (further work, text only):** How to Change Institutions, Pour, Taxonomy of Narrative
Conventions — and nothing else from wyattroy.com. *(Superseded 2026-09-02: the Index section was
removed; Pour and How to Change Institutions became full studies; Taxonomy stays a small graph tile.)* Wyatt struck unstudio, GRE Admissions, MDes NPS,
Storytelling Affordances, Harvard Memorial, Haaaard, Mediums Proseminar, Arena, Tonos, Digital
Typewriter, and Sorry (Sorry may be mentioned in the forgiveness study's background only). All
pre-Harvard film work stays off: "I don't wanna be doing videos anymore."

## 2026-09-02 — Founder line

**"Founded in 2026 by Wyatt Roy."** No Harvard, no MDes — "MDes doesn't mean anything to anyone;
I'm cooler than Harvard." One line, no photo, no team page. Chosen over no-names (SuperFriendly
model) and over a bio paragraph.

## 2026-09-02 — Voice and imagery

**"We", never "I".** The site must read as a full international design agency; it is a solo practice
with collaborators, and the site hides that. Collaborators may be named on study pages.
**No images at first.** Forgiveness is pre-launch, the oral-care work is under NDA; "make a little
look like a lot by making text look really good even when it's sparse."

## 2026-09-02 — The unnamed client

**Sector descriptor in place of the name, stated plainly, never blurred:** "a consumer oral-care
brand · new product launch." Do not say US, floss picks, or the interview count (n=3, midpoint). Do
not show the takeaways or the research map — proprietary. Process and deliverable shape may be
described. The brand name is scrubbed from the repo and the site.

## 2026-09-02 — Work Hycu turns down

**No video production, no VR experiences, no pure architecture, no making-things-prettier
industrial design.** "What I'm curious about is the systems behind an object, a space, people,
culture." Goes on the Studio page as "What we don't do."

## 2026-09-02 — Build and launch

**Vanilla HTML/CSS/JS, no build step, one `projects.json`, GitHub Pages from `main` root, `CNAME`
= hycudesign.com (Squarespace DNS).** Same shape as wyattroy.com so Wyatt can edit it. The 3D graph
ports from wyattroy.com's `three-scene.js` (Three.js r160 via jsdelivr) with the new axes. Rates
(~$300–400/hr) are never published.
