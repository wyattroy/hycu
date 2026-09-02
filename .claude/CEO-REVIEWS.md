# CEO reviews — hycu

**Each new CEO is handed the previous verdict, so it can say whether the same fault is recurring.**
APPEND ONLY. Newest at the top. Never edit an old verdict.

---

## Review 3 — 2026-09-02 · graph unclickable + study padding, before push
reviewed-commit: f38db93
**One sentence:** *"Don't push f38db93 yet — the work pages are fixed and the graph clicks again, but the session's own phone screenshot shows the home-page headline jammed against the left edge of the screen (the same padding fault, one rule over, at style.css:211), and its new test could not see that because it only checks boxes named `.wrap` — and the test itself lives in a temp folder, not the repo."*

- **Asked for / delivered:** graph clickable DONE (desktop; cause `#graph-2d` with `display:block` beating `hidden`); work-page padding DONE; "do better QA, CEO every time" PARTIAL: phone home headline flush to the screen edge (style.css:211, same shorthand fault), test written to the fix not the fault, test not in the repo, screenshot taken and not looked at.
- **Delivered but not asked for:** `window.__graph` test hook; pre-push CEO gate (uncommitted at review time; only works where core.hooksPath is set; EDITING.md teaches `--no-verify`).
- **Unsupported claims:** "Both now tested" in the commit title while the test lived in the scratchpad and its report was gitignored and overwritten; "thesis copy was not the cause" too blanket, `.hero-text` swallows clicks where it overlaps a tile (style.css:192); "Uncommitted: (clean)" in the brief was false. Observation for Wyatt: two left edges on desktop (nav 116px, sections 216px).
- **Recurrence:** yes, in new clothing: proof tuned to pass, third time.
- **Working session's response (same day, next commit):** phone gutter fixed; hero text no longer intercepts pointer events (links and controls only); nav and hero copy now share the `.wrap` column's left edge (`--edge`); browser test moved to `scripts/shoot.mjs`, checks every visible text element against the nav brand's left edge on every page at both widths, hovers/clicks the tile nearest the headline on desktop and taps it on the phone, writes named PASS/FAIL lines to `.claude/TEST-REPORT.md`; red-proofed by reintroducing the phone fault (FAIL) then restoring (PASS). `npm test` runs check + browser pass. Push held for Review 4 on the new commit.

## Review 2 — 2026-09-02 · the site build, before push
**One sentence:** *"Before you push this anywhere, delete 'floss pick' from studio/index.html:47 and the three findings from work/oral-care-research/index.html:51, then decide the Formspree and Calendly ids, because right now the site is a good-looking brochure that names the client you scrubbed and cannot receive a lead."*

- **Asked for / delivered:** DONE — site designed and built (9 pages, screenshots at 1440/390), new graph axes honouring the Product↔Idea ruling, strategic study grammar, "we" throughout, no images, struck projects excluded, founder line without Harvard/MDes. NOT DONE — push, Pages, DNS. PARTIAL — floss scrub ("floss pick" on the Studio page; three category-revealing findings on the oral-care page); contact form and Calendly are placeholders and no email exists, so the site cannot receive a lead.
- **Delivered but not asked for:** 404, sitemap, robots, favicon, the rotating tesseract, the officers apparatus, button/pinch zoom instead of scroll-zoom (unrecorded). Nothing displaced an ask; time went to plumbing before the contact channel.
- **Unsupported claims:** "0 failures proves the scrub" — scrub.json held only the brand name (scripts/scrub.json:1); "no console errors, no overflow" — never saved to disk; "Founded in 2026" (studio/index.html:59) vs "worked with Polycam for years" (work/polycam/index.html:43) and a 2020 project; Spatial Equity rail says both "Client: GSD" and "Independent research" (work/spatial-equity/index.html:76,78); OFFICERS.md points at a ledger not on disk.
- **Recurrence:** Review 1's fault recurred in new clothing — a verification reported complete where the artefact could not test the thing claimed.
- **Working session's response (same day):** fixed the leak, the findings, the founding-date contradictions, the rail; scrub list now includes "floss"; screenshot pass now appends to TEST-REPORT.md; ledger stub created; zoom and theme defaults recorded in DECISIONS.md. Formspree/Calendly/email remain with Wyatt (CTO-QUESTIONS.md).

## Review 1 — 2026-09-02 · the thesis line "We discover where you are, then design where you'll go."
**One sentence:** *"The sentence sells the half of hycu that any consultancy could sell — it promises to diagnose and to plan, and says nothing about the two things that are actually yours: seeing from one dimension up, and building the thing at the end."*

- **Asked for / delivered:** DONE — blindspots on the line, each pinned to a word. "design" omits building (4 of 6 studies end in a built thing); "you'll" makes the destination the studio's prediction; "discover" is horizontal where the brand (HyperCube) is vertical; "discover … then design" is the Double Diamond's steps 1 and 3; "then" bounds an engagement whose story is expansion; "where you are" can read as "we'll rediscover what you told us." Rhythm and "We" praised.
- **Delivered but not asked for:** nothing.
- **Unsupported claims:** "4 of 6 deliverables are built things" — taken from the session's brief, not from disk (no study content exists yet). `.claude/memory/README.md` pointed at `CTO-QUESTIONS.md`, which did not exist (created 2026-09-02 after this review).
- **Recurrence:** cannot run — first verdict on this repo.
- **Working session's response:** agrees on "design" (the real gap) and "you'll"; weights the Double Diamond point lower. Offered Wyatt three rewrites keeping his rhythm; the choice is his and goes in DECISIONS.md when made.
