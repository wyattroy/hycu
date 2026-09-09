# Handoff: the graph cubes branch

Written 9 September 2026 by a session running in **Claude Code on the web** — a container in
Anthropic's cloud with no access to Wyatt's Mac. That limit is the reason this file exists.
Everything described here is pushed to GitHub. **Nothing is on his laptop unless he pulled it**,
and every "reload and look" in that session cost him a manual `git` command. You are running
locally, so that stops being his job — see section 6.

Process rules are not repeated here. Read `.claude/CLAUDE.md` and `.claude/memory/DECISIONS.md`
first. The short version that bit hardest this session: **stage by path, never `git add -A`**, and
**read shared state from `origin`, not from your own working tree**.

---

## 1. Where the work is

**Branch: `claude/graph-tiles-cubes-10q9fn`**, cut from `origin/main` at `d522178`, six commits,
all pushed. No pull request. Files touched: `js/scene.js`, `scripts/shoot.mjs`, `style.css`,
`index.html`.

Wyatt playtests it from a second checkout of that branch, served on port 8788:

```bash
git -C ~/Documents/Projects/hycu-cubes fetch origin
git -C ~/Documents/Projects/hycu-cubes merge --ff-only origin/claude/graph-tiles-cubes-10q9fn
# server already running in its own terminal tab, rooted at that folder:
#   python3 -m http.server 8788 --bind 127.0.0.1
```

**Use `127.0.0.1:8788`, not `localhost:8788`.** The server binds IPv4 only and macOS resolves
`localhost` to the IPv6 address first, which nothing is listening on. He lost time to this.

He also caches hard — tell him `Cmd+Option+R`, not a plain reload.

---

## 2. What shipped

Oldest first.

| Commit | What |
|---|---|
| `33fa0c8` | Graph tiles become cubes. Same colours: four sides in the capability hue, printed face front, near-white back, hairline round the face. |
| `0c23cb1` | Cubes drawn half again as big on desktop and tablet; the axis-label compensation unwound; `shoot.mjs`'s label check replaced. **Read section 3.** |
| `efd7402` | Graph scaffold lines 20% darker; ground gradient 20% deeper (this second part was invisible — see below). |
| `50e3a31` | Ground gradient three times deeper, so it actually reads silver. |
| `a08e20d` | Copy: home contact block drops "One sentence is enough to start". |
| `3ddba2b` | Ground becomes two layers — a radial white bloom behind the hero headline over a silver base whose top stop is now the darkest of the run. |

Two of those are worth understanding rather than just knowing.

**The cube size is not a free choice.** `TILE` is `1.20` — the old flat plate's height — and what is
drawn is that times `tileScale()`, now `1.5` on desktop and tablet and `2` on a phone. The comment
above `TILE` in `js/scene.js` carries the measurements behind it. Do not change `tileScale()`
without reading it.

**"20% deeper" on the gradient did nothing, and that is a lesson worth keeping.** The stops started
3 to 13 points off white out of 255, so a fifth of that is at most 3 points — arithmetically
correct, invisible on screen. Wyatt: "the background still gives white, not silver." **When he gives
a percentage for a colour that is already near the end of its range, render it before you believe
it.**

---

## 3. The ruling this branch changed, and the test that changed with it

**This is the part to read before touching anything.**

`scripts/shoot.mjs` used to assert that no axis label ever overlaps a tile. Directly above that
check, in the same comment, it quoted Wyatt's own ruling of 8 September 2026:

> "the axis labels must sit on their axes ... the tiles are shiftable by the user"

An earlier session read that as exempting phones only. It is the same rule at every width, and
`js/scene.js` already implemented it correctly, quote and all. Wyatt restated it on 9 September:

> "the axis labels don't NEED to clear the cubes -- the user moves the cubes so the axis labels are
> within their control to see around" ... "i already ruled this in the past"

Before that came out, this session spent most of an afternoon shrinking his cubes and walking every
axis label outward to satisfy a constraint he had already struck down. **If you find yourself
sizing the work to protect a label, stop and re-read this.**

The check now asserts the half of the ruling that *is* a requirement — UNDERSTAND left of MAKE,
PRODUCT below IDEA, all four visible and on screen, at rest and after a hard drag. It was
red-proofed by moving UNDERSTAND to the `+x` end: it fails at both widths.

Two consequences for you:

- `scripts/shoot.mjs` is a changed file on this branch, and `.claude/CLAUDE.md` calls it "the
  proof". If a reviewer objects, `0c23cb1` is the commit to argue about.
- The new check is deliberately coarse. It catches a label crossing to the wrong side, not a small
  sidestep. That was a choice: a flaky test here is worse than a blunt one.

**This ruling is not recorded in `DECISIONS.md`.** It lives only as a quotation inside a test file,
which is exactly how it came to be misread. Writing it into `.claude/memory/DECISIONS.md` is
probably the single most useful thing you could do with ten minutes.

---

## 4. What is open

- **Rebase onto `main` once PR #4 merges.** As of writing, `origin/main` is still `d522178`. PR #4
  (`claude/retire-the-gate`, another session) deletes the push gate and adds
  `.github/workflows/test.yml`, running `npm test` on every pull request and every push to `main`.
  It does **not** touch any file this branch touches.
- **No pull request opened.** Wyatt has not asked for one.
- **`studio/index.html` still says "One sentence is enough to start."** He asked for the homepage
  only. Ask before changing it.
- **The bloom is unverified on his display, on tablet and on phone.** It is centred at `30% 62vh`.
  Both numbers are guesses that looked right in a rendered PNG.
- **Whether the cubes at 1.5× are final.** He asked for that size having seen 1×; he has not said
  it is settled.

---

## 5. Two faults that predate this branch

Neither is caused by this work. Both were found while checking it, and neither is fixed.

**`npm test` fails on `origin/main`, at 820px wide.** The hero headline breaks into four lines
starting "We see where" instead of three starting "We see where you are,". Verified against a clean
checkout of `origin/main` with the real webfonts loaded. It is asserted at desktop and tablet only —
phone is exempt. **Once PR #4 lands, this makes CI red on every pull request, including its own.**
Worth telling Wyatt before he is surprised by it.

**Four of the eight tile eyebrows overflow their face.** The client name is drawn across the top of
each tile with no wrapping and no clipping, so it runs off the edge. Measured in a browser with the
real Geist Mono, against 912px of available width:

| Client | Width |
|---|---|
| A residential eating-disorder facility | 1650px |
| Human Flourishing Program, Harvard | 1474px |
| Harvard Graduate School of Design | 1430px |
| A consumer oral-care brand | 1122px |

Identical before and after this branch — the cubes only make it easier to notice. Both deserve
`HY-` numbers in `.claude/BACKLOG.md`; this session did not add them because `.claude/` was another
session's file at the time.

---

## 6. What you can do that the web session could not

This is the whole reason Wyatt asked for this file.

- **Pull for him.** `.claude/CLAUDE.md` says he does not manage git and that any fetching or
  rebasing is a session's job. From the cloud that was impossible; from his laptop it is one
  command. Do it after every push, without being asked, and tell him in a line.
- **Restart his 8788 server** when it dies, instead of describing how.
- **Take your own screenshots of what he is actually looking at**, at his real window size.
- **Trust `npm test`'s font-dependent checks.** In the cloud container the proxy blocked
  `fonts.googleapis.com`, so Geist, Geist Mono and Shrikhand never loaded and every page logged a
  console error — 36 of them, one per page. Worse, **every text measurement silently used Helvetica
  instead of Geist**, which is about 18% narrower, and a set of numbers went into a commit message
  before that was caught. On his Mac the fonts load and none of this applies. If you ever see 36
  identical connection errors and a headline breaking oddly, that is this, not a real fault.

One more, on how he wants to be talked to: **plain language, no jargon.** He said "you're using too
much jargon", and in this session he had to ask what "running the full suite" meant. It means
`npm test`. Say that instead. And **give him the link every time you ask him to go and look** — he
asked for that in capitals.
