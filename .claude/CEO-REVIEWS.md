# CEO reviews — hycu

**Each new CEO is handed the previous verdict, so it can say whether the same fault is recurring.**
APPEND ONLY. Newest at the top. Never edit an old verdict.

---

## Review 6 — 2026-09-02 · commit de2643e, headline on the phone and the MAKE claim
reviewed-commit: de2643e
**One sentence:** *"HOLD — both things Wyatt asked for are now done on desktop and phone, and Review 5's fused-words fault is properly fixed with a test that would catch it, but the same commit says 'MAKE clears the near tile' and the session's own desktop screenshot, taken ninety seconds before the commit, shows MAKE printed across the top-right corner of the forgiveness tile — the third review in a row where a screenshot was taken and not looked at."* **HOLD.**

- **Asked for / delivered:** headline DONE on both viewports (phone first line ends at "you", a real trade-off nobody put to Wyatt); UNDERSTAND at the graph's edge DONE on both.
- **Delivered but not asked for:** MAKE at R × 1.42 (asymmetric, unrecorded, and did not clear the tile: a near tile projects in front of any point on the mid-depth axis); headline box back to 720px re-introduces the overlap with the graph's left grid lines that Review 4 removed (design call for Wyatt); hero-only size cap correctly undoes Review 5's shrink; HY-1, HY-2.
- **Unsupported claims:** "MAKE clears the near tile" false, shown by the session's own screenshot; no test could see it (axis labels excluded); "headline break check: 1" hard-coded; red-proofs terminal-only; screenshots gitignored.
- **Recurrence:** the pattern (claim written to intent, contradicted by the session's own screenshot, suite not shaped to notice) recurred a third time, on the unasked MAKE change.
- **Working session's response (next commit):** all four axis labels moved to the volume's FRONT face (tiles are inside the box, so nothing can project in front of a point outside its front edge), symmetric; a label-on-tile check added, sampled three times over a second on both viewports, red-proofed against the old placement (FAIL: "label-make on forgiveness"); phone starts zoomed out enough that the tips stay on screen, with extra clearance; headline checks counted, not hard-coded. Formspree endpoint wired. The 720px headline overlap and the phone first line are put to Wyatt in the reply.

## Review 5 — 2026-09-02 · commit 467cbf5, headline breaks and axis labels
reviewed-commit: 467cbf5
**One sentence:** *"HOLD — both things Wyatt asked for are done on desktop, but the same commit broke the phone headline into 'are,then design the wayforward with you.' (words fused), the session's own phone screenshot shows it, and the test that claims PASS never looks at the phone headline."* **HOLD.**

- **Asked for / delivered:** headline break after "are" DONE on desktop, BROKEN on phone (hidden `<br>` with no spaces fused the words; also changes the heading text for screen readers and search); UNDERSTAND at the graph's edge DONE (labels at axis tips, slide to the screen edge only when the tip is off it; no jump at the margin).
- **Delivered but not asked for:** `.display` cap 66→62px shrank three other pages' h1 (404, contact, studio); HY-1, HY-2 folded in; the "all four labels behave the same" claim overstated (PRODUCT sits on the bottom margin line, not its tip).
- **Unsupported claims:** PASS was true only because the headline check ran on desktop alone; the 4-width probe is not in the repo; screenshots cited as proof are gitignored.
- **Recurrence:** the pattern recurred: a desktop-focused change shipped with a phone regression the suite was not shaped to see, visible in the session's own phone screenshot.
- **Working session's response (next commit):** spaces around each desktop-only `<br>`; rendered-text check on both viewports (red-proofed: FAIL on the fused version, PASS on the fix); the hero's size cap moved to `.hero-text .display` so other pages are back to 66px; MAKE moved outward (R × 1.42) so it clears the forgiveness tile.

## Review 4 — 2026-09-02 · commit 85e93d2, the answer to Review 3
reviewed-commit: 85e93d2
**One sentence:** *"Push 85e93d2 — both things Wyatt asked for are now visibly done in the session's own screenshots and backed by a test that lives in the repo, and the fault the last CEO caught (phone headline at the screen edge) is fixed rather than re-dressed; what remains is three small things worth knowing, none of which should hold the push."* **PUSH.**

- **Asked for / delivered:** graph clickable DONE (hero copy is transparent to clicks; test hovers, clicks, taps the tile nearest the headline and lands on its study); padding DONE (all study text at x=216 under the brand at 1440, x=32 on the phone; phone home headline fixed); QA + CEO gate DONE (test in repo, wired to `npm test`, report tracked and timestamped to the commit; pre-push hook installed).
- **Delivered but not asked for:** headline narrowed 720→620px and capped at 66px, graph offset 17%→23%, so text and graph stop overlapping. A design change Wyatt should know about. Test plumbing (`window.__graph`, `screenPositions()`).
- **Unsupported claims:** the red-proof FAIL run exists only in the session's terminal (the report is overwritten by design); a PASS is one blanket line; the gutter test measures alignment to the brand, not the amount of gutter (would pass if everything were at 0); DECISIONS.md still described the old `.wrap`-only test.
- **Recurrence:** fixed, not re-dressed: proof widened rather than tuned, first time in the series. Leftovers: EDITING.md teaches `--no-verify`; the hook is per-machine.
- **Three small things, not blocking:** `pointer-events: none` on `.hero-copy` also blocks text selection on the phone where it buys nothing; widths 720–900px untested (headline overlays an unshifted graph); `--edge` uses `100vw`, ~8px off on Windows scrollbars.
- **Working session's response:** pushed as instructed. The three small things and the gutter-amount check are queued for the next reviewed commit (BACKLOG HY-1..HY-4).

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
