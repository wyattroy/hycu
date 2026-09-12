# hycu website backlog

Changes the **website** needs, in plain language. Newest and most urgent at top. A session picks
an item up, does it, and deletes it from here when it ships.

This is not the same list as `.claude/BACKLOG.md`. That one holds numbered engineering leftovers
from CEO reviews (test coverage, editor internals, code comments) and is written for sessions.
This file is written for Wyatt: what the site should become, and what is waiting on his ruling.

---

## Restyle the site as Limestone & Cypress

**Status: planned, nothing started.** Wyatt chose this on 2026-09-12 from the direction mixer
(https://claude.ai/code/artifact/560a95d2-2596-41cf-ab42-b9e382d8292f — load "Wyatt's pick", then
switch the palette to Limestone & Cypress). The mixer is the reference for how it should look.

The change is styling only. No block moves, no copy rewrites, no layout changes.

| Layer | Today | Becomes |
|---|---|---|
| Ground | white `#ffffff` over a silver gradient | limestone `#e9e5d8`, tufa stone, about ten points darker than the cream everyone else uses |
| Ink | `#111112` near-black | `#1a1e18`, a green-black |
| Accent (hover, focus, highlight) | systems purple `#7a4fd6` | cypress green `#3e5d3a` |
| Big headings | Shrikhand | EB Garamond, italic, 18% larger than the current scale |
| Body and small headings | Geist | Hanken Grotesk, small heads at weight 600 |
| Eyebrows, tags, footer | Geist Mono | DM Mono |
| Wordmark | Geist | Arsenica — **licence blocker, see below** |
| Background treatment | a white bloom over silver | "Aura": four soft fields of the capability colours |
| Buttons | filled pill | square, with a keyline inset a few pixels inside the edge |
| Dividers | hairlines | hairlines, unchanged |

### Two decisions before this can finish

**1. The Arsenica wordmark cannot ship as it stands.** The file Wyatt has is Arsenica *Trial* from
Zetafonts. A trial licence does not cover a live public website, and the trial cut also ships
placeholder shapes instead of numerals. Three ways out:

- Buy the Zetafonts licence, then set the wordmark in Arsenica. Cost unchecked.
- Ship the wordmark in EB Garamond italic, the same face as the headings.
- Leave the wordmark in Geist, which is what Wyatt already chose once — DECISIONS.md, 2026-09-08:
  "change the logo font from shrikhand back to whatever it was before — i liked that better."

**Recommended: buy the licence.** Wyatt has now named the Arsenica wordmark twice — in the type
proof he sent, and again in the choices he gave another session on 2026-09-12 ("keep the logo font
in arsenica"). It is the one element he has asked for by name, so substituting it is the wrong
default. If he would rather not wait on a purchase, ship the wordmark in EB Garamond italic and swap
it the day the licence lands: it is a single CSS rule, and nothing else in this restyle waits on it.

**2. The Aura background puts colour on the ground, which two of Wyatt's own rulings argue about.**
The Restraint direction (DECISIONS.md, 2026-09-02) said the ground carries no colour; the capability
colours are "the only colour on the site". Then on 2026-09-09 he ruled the light should come from
behind the headline: "i don't want the top of the page to be the lightest area… i want the lightness
to come from behind the words to draw your eye."

**This also removes a freedom.** The Aura is painted from the four capability colours — systems at
88%/4%, research 6%/22%, product 74%/46%, strategy 20%/82% — so with this ground those four *are*
the background. They can no longer be picked as four dots that merely read apart from each other;
they have to work as four washes that sit together. Both Mediterranean palettes in the mixer were
built that way. Retuning any one capability colour after this ships changes the ground.

**Recommended: keep the Aura, but only across the first screen, and let it fade to flat limestone
below the fold.** That is the version that satisfies the 2026-09-09 ruling — colour and light
gathered behind the words — instead of tinting all thirteen pages top to bottom. If he wants the
mixer's version exactly, it is a one-line change to span the document instead. If he wants neither,
flat limestone is one line less.

### The work, in order

**1. Log the ruling first.** Append to `.claude/memory/DECISIONS.md`. This overturns three entries
that are still current: the "Restraint" direction at `DECISIONS.md:427-431` (2026-09-02 — "white,
near-black, Geist + Geist Mono… one system-blue accent for interaction only"), the
white-bloom-over-silver ground (2026-09-09), and Shrikhand as the display face (2026-09-08, "font
looks good, ship it"). A session that reads DECISIONS.md after this lands must not see the old
rulings as live.

Quote one clause of Restraint in the new entry, because it argues *for* the change rather than
against it: the direction also required that the site "must not read as default-AI design". In
September 2026 the default-AI look is warm off-white — Anthropic, Cursor, Perplexity, Mistral and
Granola all sit within a few points of `#FAF9F5`. Limestone is about ten points below that band, and
its accent is green rather than clay-orange. Restraint's ground and faces are being overturned; that
clause is being kept.

**2. Fonts, on all thirteen pages.** Every page carries the same `<link>`. Replace:

```
family=Geist:wght@400;500&family=Geist+Mono:wght@400;500&family=Shrikhand
```

with:

```
family=EB+Garamond:ital,wght@1,400..600&family=Hanken+Grotesk:wght@400;500;600&family=DM+Mono:wght@400;500
```

Then in `style.css`: `--sans` becomes Hanken Grotesk, `--mono` becomes DM Mono, `--display-face`
becomes EB Garamond with a real serif fallback. Two Geist-specific lines have to go with it —
`font-feature-settings: "ss01", "cv11"` on `body` (those are Geist's own alternates and mean nothing
to Hanken), and `strong { font-weight: 500 }`, which should become 600 because Hanken has a real
semibold where Geist was faking emphasis.

**3. Palette tokens** in `style.css` `:root`:

```
--bg: #e9e5d8;   --ink: #1a1e18;   --ink-2: #55584e;   --ink-3: #837f71;
--rule: #d4cdb9; --rule-mid: #bcb49f;
--accent: #3e5d3a;  --accent-ink: #f2efe5;
--c-research: #b3862f;  --c-strategy: #33607f;
--c-product:  #4f7245;  --c-systems:  #7a4258;
```

Ochre, slate, cypress and wine replace orange, blue, teal and purple. The four keep their meanings
and their order.

**4. The ground, and the three surfaces that sit on it.** `style.css:66-68` carries the two-layer
gradient; that becomes limestone plus the Aura fields. Three more places hardcode translucent white
and will read as visible seams against limestone if they are missed — the nav at `style.css:183`,
the graph's axis labels at `:230`, and the zoom buttons at `:292`. This is the CEO Review 12 lesson
in a new palette: size the ground to the document, not the window, or there is a seam at the fold.

**5. Buttons.** Square corners, and a keyline of the ground set about 4px inside the rectangle,
drawn with two stacked inset shadows. The working rule is in Wyatt's own type proof
(`~/Downloads/hycu-type-proof.html`, the "Buttons" block) and in the mixer under `data-button="keyline"`.
Hover swaps the face to cypress.

**6. Type sizing, and one real collision.** EB Garamond italic sets larger than Shrikhand: the
display scale goes up about 18%, and the small heads (capability names, Work-card headlines) stay in
Hanken at 600 rather than going italic. The collision: `.pronounce` — "Pronounced: Hi-Q" on the home
and studio pages — is styled italic today, and it now sits directly under an italic heading. It
needs to stop being italic, or the distinction it was drawing disappears.

The existing exemption at `style.css:422` still does its job and should stay: the study-page
headlines are twenty to thirty words, too long for a display face, and they are set in `--sans`,
which is now Hanken.

**7. The graph.** `js/scene.js` keeps its own copy of the colours, near the top: a `C` block
(`ink`, `ink2`, `ink3`, `rule`, `ruleMid`, `face`, `faceSmall`, `accent`) and a `CAP` map of the four
capability colours. These must be changed by hand to match the tokens above, because nothing reads
them from the CSS. Also in that file: the 2D fallback's white ground, and two lights set to
`#FFFFFF`. And the client names now sit on cube faces, so check that dark text still reads on the
ochre face — ochre is the lightest of the four.

**Coordination: do this step last, or hand the values to the session that owns the file.** As of
2026-09-12 another session is actively rewriting `js/scene.js` on `claude/drifting-cubes` (cube
drift, reach, quadrants). Two sessions editing that file will collide.

**8. Favicon.** `assets/favicon.svg` is a white square with `#111112` strokes. It becomes limestone
with ink strokes. Wyatt's type proof also carried a favicon that answered dark mode; worth copying
that idea, but it is not required for this to ship.

**9. Verify.** `npm run check` for the copy rules, then `npm test` for the browser pass at desktop
and phone widths — run it plain, never piped, or a red run reads as green. Read
`.claude/TEST-REPORT.md` afterwards and cite its timestamp. Then look at the real thing: the fold on
a long study page (the seam), the nav over limestone, hover on a Work card, and the focus ring,
which is now cypress on limestone.

**10. Ship as one pull request.** `main` is production: the merge is the deploy. Let GitHub's
`npm test` go green before merging.

### Contrast, already measured against limestone `#e9e5d8`

| Role | Ratio | Verdict |
|---|---|---|
| ink `#1a1e18` | 13.41 | fine everywhere |
| muted body `#55584e` | 5.76 | fine for body text |
| mono labels `#837f71` | 3.18 | labels and UI only — **better than today's 2.73 on white, so not a regression** |
| cypress accent `#3e5d3a` | 5.88 | fine for link hover at body size |
| button label `#f2efe5` on cypress | 6.45 | fine |
| research ochre `#b3862f` | 2.62 | decoration only (dots, bar, cube faces) — never set text in it |
| strategy slate `#33607f` | 5.34 | fine |
| product cypress `#4f7245` | 4.36 | large text and UI only |
| systems wine `#7a4258` | 6.06 | fine |

The hero's highlighted words ("see", "design") are systems purple today. On limestone they should
take the cypress accent, not the wine, because wine against ochre and slate in the same viewport
reads as a fourth data colour rather than emphasis.

### What does not change

The blocks, the copy, the spacing, the margins, the hairline-and-no-cards discipline, the graph's
geometry and its three axes, what the four capabilities mean, the oral-care client staying unnamed,
"we" never "I", and `CNAME` / `robots.txt` / `sitemap.xml`.

### Files this touches

`style.css` · all thirteen `*.html` heads · `js/scene.js` · `assets/favicon.svg` ·
`.claude/memory/DECISIONS.md`

---

## Waiting on a ruling from Wyatt

**Limestone & Cypress, or Whitewash & Aegean?** Wyatt told this session to plan the restyle with
Limestone & Cypress, so that is what the plan above is built on. Reported second-hand the same day
and not confirmed live: he told another session his pick was Ivory & Clay but that the swatch looked
"too close to anthropic colors… it can still be earthy mediterrean tones but just like different
ones", and that session's recommendation was Whitewash & Aegean — a limewashed grey-white ground
with a deep Aegean blue accent, on the argument that moving the accent from warm to cool is what
actually breaks the resemblance, whichever way the ground is tuned.

Both are in the mixer. The real difference: Limestone commits to a warm stone ground with a green
accent; Whitewash keeps a near-white ground and spends its whole distinction on the blue. **One line
from him settles it, and the answer only changes the token values — every step of the plan above is
identical either way.**

**The two rails disagree about unnamed clients.** The Pour study's rail says the facility is "not
named"; the oral-care study's says "unnamed by agreement". Both are true, but a reader who opens
both sees two different house styles. Pick one form and both rails take it.

**Polycam's position on the graph.** Its `reach` is 0.7 in `data/projects.json`. A CEO review argued
for 0.5, which is the number Wyatt's own brief used: at 0.7, six scripts on a client's YouTube
channel sit above a published book (0.66) and a shipped public game (0.48). His call.

**One sentence on the Studio page.** On 2026-09-03 a session's commit swept up an edit Wyatt had
made by hand at `studio/index.html:69`, replacing a sentence about local speech models with "A team
hierarchy of agents that hold each other accountable." Nothing false shipped, but a specific
checkable claim became a vaguer one without him saying so. He decides whether the original sentence
comes back.

---

## How to add to this file

One heading per change, in plain language, with enough context that Wyatt can rule on it without
opening the code. Say what is wrong, where, what the options cost, and which one you would pick. No
`HY-` numbers here — those live in the engineering ledger.
