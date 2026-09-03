# CEO reviews — hycu

**Each new CEO is handed the previous verdict, so it can say whether the same fault is recurring.**
APPEND ONLY. Newest at the top. Never edit an old verdict.

---

## Review 19 — 2026-09-03 · commit 55fca84: case studies move to /work/
reviewed-commit: 55fca84
**One sentence:** *"PUSH — the case studies are off the home page and live at `/work/` exactly as asked, every nav link follows them, and the one thing the sweep missed is a single stale 'go to the work' link on the 404 page that now lands on the top of the home page instead of the work."* **PUSH.**

- **Asked for / delivered:** DONE; all twelve nav links follow; Wyatt's six card edits travel intact (six cards differ from the old committed text, two identical).
- **Delivered but not asked for:** the Taxonomy tile now leaves for `/work/`, which does not list it (Wyatt's call whether the tile stays); a tall blank stretch between hero and "What we do" (design judgment for Wyatt).
- **Unsupported claims:** "no remaining #work link anywhere" false by one: `404.html` body link; DECISIONS entry dated 09-02 for a 09-03 commit; three things in Wyatt's own card text (missing full stop, "discreet", two trailing nbsp) now public.
- **Recurrence:** Review 18's overclaim did not recur; a sweep that stopped at the nav is its milder relative.
- **Working session's response:** pushed; 404 link fixed in the next commit (Review 20); DECISIONS date corrected; Wyatt's card text left as his.

## Review 18 — 2026-09-02 · commit 720f863: Review 16 follow-ups
reviewed-commit: 720f863
**One sentence:** *"PUSH — the three follow-ups from Review 16 are done exactly as described (Pour's rail says 'not named,' every 'counsellor' is now 'counselor,' and the SYSTEM label reads upward on every load, which the screenshot confirms), but 'ClaudeKit clear of Polycam' is once again a claim slightly wider than the picture, and the screenshot itself is not in the commit."* **PUSH.**

- **Asked for / delivered:** all three DONE; REACH unaffected by the first-frame default (verified at its call site).
- **Delivered but not asked for:** ClaudeKit moved; Review 16 recorded; browser pass back in the report.
- **Unsupported claims:** "clear of Polycam" overstated (bottom fifth still tucked under); screenshots are gitignored so not in the commit; the oral-care rail still says "unnamed by agreement" while Pour says "not named" (a ruling exists for oral care; Wyatt to choose one form).
- **Recurrence:** Review 17's fault fixed; "claim wider than the evidence" recurred on the same tile, second time.
- **Working session's response:** pushed. HY-24 (ClaudeKit bottom edge) and HY-25 (one form of "not named" across rails; Wyatt's choice) filed.

## Review 17 — 2026-09-02 · commit 135cb29: Pour softened, prototype link removed
reviewed-commit: 135cb29
**One sentence:** *"PUSH — both things Wyatt asked for are done in `work/pour/index.html`, the paragraph now reads like a case study instead of an incident report, and the only unasked change is that the test report shrank."* **PUSH.**

- **Asked for / delivered:** soften DONE (no graphic terms remain; the case still lands); link removed DONE (no external href on the page; run.app nowhere in the repo).
- **Delivered but not asked for:** the test report at that commit held only the copy check (the browser pass was not re-run for prose); bookkeeping, not product.
- **Unsupported claims:** none.
- **Working session's response:** the next commit re-ran the full pass; its report block is in the commit.

## Review 16 — 2026-09-02 · commit 2ffeed6 (amended): Pour + HTCI studies, SYSTEM flicker, overlap fixed
reviewed-commit: 2ffeed6
**One sentence:** *"PUSH — both pages exist and say what Wyatt asked, the SYSTEM label can no longer flicker, Review 15's overlap is gone in the screenshot the pass actually took, and what remains is one wording choice for Wyatt, one half-fixed thing nobody asked for, and a small coin-toss the flicker fix left behind."* **PUSH.**

- **Asked for / delivered:** Pour page DONE and anonymous (prototype title fetched: no facility); HTCI page DONE as Studio; flicker DONE (hysteresis; proven by reading).
- **Delivered but not asked for:** REACH hysteresis; projects.json reformatted; Taxonomy tooltip "Further work"; Next chain reordered; ClaudeKit moved but still about half behind Polycam (claim overstated); Review 14 housekeeping.
- **Unsupported claims:** "ClaudeKit out from behind Polycam" overstated; the red-proof is terminal-only; the first-frame flip decision is a coin toss on rounding noise, so SYSTEM reads upward on some loads and downward on others (no flicker, but inconsistent).
- **Recurrence:** Review 15's fault fixed for real; a claim wider than the evidence recurred once, mildly.
- **For Wyatt:** "unnamed by agreement" asserts an agreement not on record; British "counsellor" next to American spellings.
- **Working session's response (follow-up commit):** "by agreement" cut; "counsellor" → "counselor" throughout the Pour page and card; SYSTEM's first-frame decision defaults to reading upward inside the dead band; ClaudeKit moved further (idea .84) so it clears Polycam. Pushed once Reviews 17 and 18 clear the two follow-up commits.

## Review 15 — 2026-09-02 · commit 610a775: Pour + HTCI studies, SYSTEM flicker
reviewed-commit: 610a775
**One sentence:** *"HOLD, narrowly. Both pages exist and say what he asked (Pour's facility unnamed, HTCI as Studio · Hycu), and the flicker fix is sound, but the new How to Change Institutions tile now sits underneath the very SYSTEM label he complained about in the opening view of the home page, and the test that reports 'no axis label on a tile' never looks at that label."* **HOLD.**

- **Asked for / delivered:** pages DONE; anonymity DONE on the site (the prototype link was the one unverifiable item; the session then fetched it: it names no facility); HTCI as Studio DONE; flicker DONE in code, proven by reading only.
- **Delivered but not asked for:** the HTCI tile under the SYSTEM label (new fault); ClaudeKit mostly hidden behind Polycam (pre-existing); REACH hysteresis; projects.json reformatted; Next chain reordered; Review 14 housekeeping done.
- **Unsupported claims:** "no axis label on a tile" true only of the four endpoint labels.
- **Recurrence:** Review 14's fault did not recur; a PASS narrower than it sounds recurred.
- **For Wyatt:** the graphic paragraph on the Pour page is his call.
- **Working session's response (amended into the same commit):** HTCI moved left of the y axis (make 0.28), ClaudeKit out from behind Polycam (make 0.92, idea 0.76); SYSTEM added to the label-on-tile check; red-proofed by putting HTCI back under the label (FAIL) then restoring (PASS).

## Review 14 — 2026-09-02 · commit 855117e: "Pronounced: Hi-Q", purple hover, Index section removed
reviewed-commit: 855117e
**One sentence:** *"PUSH — all four things Wyatt asked for are in the commit and visible in the screenshots, his own card edits are untouched, and the only things to flag are three leftover graph tiles that now lead nowhere in particular and some dead CSS the removal left behind."* **PUSH.**

- **Asked for / delivered:** pronunciation line DONE on home; on Studio under the hero lede (interpretation, agreed); hover purple DONE via `--accent`; Index section removed DONE.
- **Delivered but not asked for:** the three Index projects stay as graph tiles whose click lands on a list they are not in and whose tooltip says "Index"; disclosed; Wyatt's decision. (Superseded the same hour: Wyatt asked for Pour and How to Change Institutions to become full studies.)
- **Unsupported claims:** none false; dead `.index` CSS, a stale DECISIONS line, and an untrue screen-reader sentence left behind.
- **Recurrence:** Review 13's invented-comment fault did not recur; leaving dead things in place did (housekeeping).
- **Working session's response:** pushed. Dead `.index` CSS, stale DECISIONS line and the screen-reader sentence handled in the next commit alongside the Pour/HTCI pages.

## Review 13 — 2026-09-02 · commits cc35591 + 5cee3a0 + 0ca2d12: purple words, document-spanning gradient
reviewed-commit: 0ca2d12
**One sentence:** *"PUSH — the seam Review 12 held on is genuinely gone (I measured the ground pixel-by-pixel down six full-page screenshots at both widths and found the five grey stops landing at the right fractions of every document, with no hard line anywhere), the purple is exact, Wyatt's own card edits are untouched, and the only faults left are a false code comment and a grey so faint he should look at it and decide for himself."* **PUSH.**

- **Asked for / delivered:** purple DONE (#7a4fd6, the site's systems hue; test asserts the two words); gradient DONE (root element, min-height, five stops measured at 28/52/78% on six full-page shots; structural check on all 18 page-loads).
- **Delivered but not asked for:** transparent canvas and hero (required); gradient check and headline-count fix in the pass; housekeeping. Nothing displaced; Wyatt's card edits untouched.
- **Unsupported claims:** the comment on `C.bg` invents a use ("kept for the 2D fallback") that does not exist; rubber-band overscroll on a Mac shows plain white under the `#f8f8fa` foot (noted, not a seam).
- **Recurrence:** Review 12's fault fixed for real; the proof-to-happy-path habit did not recur; the lesser habit of answering a review point with words (the `C.bg` comment) did.
- **For Wyatt:** the gradient is very quiet (darkest stop 5% off white, stretched over the whole page); if "a bit of depth" means braver, the five numbers at the gradient line in style.css are the only thing to touch.
- **Working session's response:** pushed; `C.bg` comment corrected in the records commit? No: code stays as reviewed; HY-23 filed to remove the dead constant.

## Review 12 — 2026-09-02 · commit cc35591: purple words + gradient
reviewed-commit: cc35591
**One sentence:** *"HOLD cc35591 — the purple is exactly right, but the 'gradient behind the page' is only behind the first screen: it ends in a hard grey-to-white line at pixel 900 on every page (mid-content on Studio, Contact and every case study), and the one screenshot the author checked was the one shot that could not show it."* **HOLD.**

- **Asked for / delivered:** purple DONE and exact (#7a4fd6 sampled; test asserts the two words); gradient PARTIAL: sized to one window by `html { height: 100% }` + `background-size: 100% 100%`, seam at the fold on all nine pages.
- **Delivered but not asked for:** transparent canvas and hero (needed); dead `C.bg`; stale stylesheet header. Nothing displaced; Wyatt's card edits untouched.
- **Unsupported claims:** "spans the document" false; judged from the fold screenshot while the full-page shot showing the seam sat beside it; no background check in the pass; headline count under-reported.
- **Recurrence:** proof to the happy path, again.
- **Working session's response (next commit):** gradient moved to the root element with `min-height: 100%` (its box grows with the document), body transparent; a structural check on every page that the root carries the gradient, its box equals the scroll height, and the body is clear; the full-page Studio screenshot read and seam-free; headline count fixed; header and dead-constant comments corrected.

## Review 11 — 2026-09-02 · editor commits a586575 + a8e198b + 97a44c2 (rebased)
reviewed-commit: 97a44c2
**One sentence:** *"PUSH 97a44c2 — Review 10's fault is fixed for real (the editor now matches whole elements and refuses when the page and file disagree on how many there are, with a test in the repo whose PASS is stamped the same second the commit was finalised), Wyatt's own copy edits are untouched by every commit, and what remains is the un-fixed half of his drag-select complaint plus four proof gaps, none of which can corrupt his site or his edits."* **PUSH.**

- **Asked for / delivered:** drag-select PARTIAL (headline proven; the cards, where his edits actually are, still HY-18); HTTPS DONE and recorded; "are you seeing my edits" answered, with a discrepancy for Wyatt: his 13 lines on disk are home-page card copy, nothing on the spatial-equity page itself.
- **Delivered but not asked for:** element-level matching with the agreement rule (the right direction: refusal replaces a guess); caret collapse after double-click; records. Nothing swept in.
- **Unsupported claims:** the refusal branch is untested; the Review 10 fault was never shown failing against the old code; the caret collapse is bypassed by the test; "no commit while failing" overstated (a commit was made during failure, then amended before push); a8e198b's message "proven on a real duplicate" stays in history without proof; test depends on another project's Playwright; `data-failed` is never removed (fails safe: refuses); trailing-nbsp strip untested; two `&nbsp;` remain in Wyatt's own diff.
- **Recurrence:** Review 10's fault fixed, not re-dressed; stale-report habit fixed; proof written to the happy path recurred (milder).
- **Working session's response:** pushed. Backlog HY-19..22 filed (refusal test and red-proof, data-failed removal, nbsp test, Playwright in this repo).

## Review 10 — 2026-09-02 · editor commits 12a9d4e + 026ec12
reviewed-commit: 026ec12
**One sentence:** *"HOLD — the sweeping-in-Wyatt's-edits fault is genuinely fixed and the Send/Origin fixes are real and tested, but the second commit (026ec12) swaps the editor's 'refuse when the text is ambiguous' rule for a guess that is provably wrong on the home page's own tagline, and that commit carries a test report that ran before its code existed."* **HOLD.**

- **Asked for / delivered:** drag-select PARTIAL (hero proven in repo; cards still HY-18); HTTPS DONE (recorded); "are you seeing my edits" answered consistently with the tree. HY-16 DONE and tested; HY-11 DONE and tested; nbsp strip untested.
- **Delivered but not asked for:** nth-occurrence saving, which introduced the fault: the client counts identical elements, the server counts substrings, so the tagline (also inside the meta description) would rewrite the meta tag and report "Saved". GitHub itself committed a CNAME delete/create to origin/main when the domain was re-entered; branches diverged; a rebase is needed before any push.
- **Unsupported claims:** "proven on a real duplicate" true for one case, hiding the general one; the test report in 026ec12 predates its code; the in-repo test depends on another project's node_modules.
- **Recurrence:** the add -A sweep is fixed; the stale-report / terminal-proof habit recurred.
- **Working session's response (next commit):** matching is now element-level (outerHTML, tag and attributes included) and refuses unless the page's count of identical elements equals the file's; `scripts/edit-test.mjs` now edits the tagline and asserts the meta tag is untouched, and edits the last of two identical tags and asserts one landing on the last tag; rebased onto origin/main.

## Review 9 — 2026-09-02 · editor commits 67ad984 + 923136f (unwound)
reviewed-commit: 923136f
**One sentence:** *"HOLD — the two things Wyatt asked for are one done (HTTPS) and one half-proven (drag-select), but the commits quietly carry home-page copy changes the session says do not exist, and one of the 'done' fixes does not work as written."* **HOLD.**

- **Asked for / delivered:** drag-select PARTIAL (cause real, fix local-only; the home cards inside `<a>` untested); HTTPS DONE and verified live; HY-11 done with any-port looseness; HY-16 NOT DONE (preventDefault without stopping propagation; site.js still posted to Formspree).
- **Delivered but not asked for:** Wyatt's own home-page card edits (13 lines of index.html) swept into both commits by `git add -A`; brief said "NO site file changed"; TEST-REPORT older than the commits; working tree not clean as the brief claimed.
- **Unsupported claims:** "no site file changed" false; HY-16 "done" false; the Pastry Pirates incident account CONFIRMED against the reflog.
- **Recurrence:** terminal-only proof recurred; a new fault of the same family as the cd incident: files entering commits nobody looked at.
- **Working session's response:** both commits unwound (`reset --soft origin/main`), Wyatt's index.html edits left in his working tree uncommitted; submit guard now `stopImmediatePropagation` and proven (0 Formspree requests); Origin check bound to the editor's own port; trailing `&nbsp;` stripped on save; `scripts/edit-test.mjs` added and run (report in TEST-REPORT.md); `git add -A` banned in OFFICERS.md and DECISIONS.md; recommitted by path.

## Review 8 — 2026-09-02 · commit e331a7f: inline editor, vendored Three.js, Review 7 leftovers
reviewed-commit: e331a7f
**One sentence:** *"PUSH e331a7f — the editor Wyatt asked for exists, runs only on his machine, writes his double-click edits straight into the source files (the right hand-back choice, with the 'Copy all changes' button as a fallback), all four Review 7 leftovers and the uBlock fix are done and checked, and what remains is one small hole in the editor's front door and the same terminal-only proof habit, neither of which touches what he asked for."* **PUSH.**

- **Asked for / delivered:** editor DONE (local only, cannot reach the live site; misses the one placeholder, graph tile names, axis labels, titles); hand-back DONE (write to source, copy list as fallback); aria-labelledby, novalidate, stale Calendly DONE; dragged-angle check PARTIAL (one corner of the orbit, desktop only, labelled as such); Three.js vendored DONE (r160 header, revision string, byte count).
- **Delivered but not asked for:** desktop label bottom margin 30% → 120px, which is what made the dragged check pass; PRODUCT now at its tip, confirmed in the screenshot.
- **Unsupported or risky:** red-proof and the editor's Playwright proof exist only in the session's terminal (fifth review running); the save endpoint has no Origin/Host check (a page open in the browser could post to 127.0.0.1:8788 while the editor runs; bounded by unique-match, .html-only, repo-only and git); `fileFor` uses `startsWith(ROOT)` without a trailing slash; a click on Send while editing still submits the real form; the wrong "whatever the angle" comment left in scene.js; Google Fonts still third-party (fallback stack exists; backlog, not blocking).
- **Recurrence:** Review 7's leftovers fixed, not re-dressed; screenshot looked at and agreeing with the claim. Terminal-only proof recurred in two forms.
- **Working session's response:** pushed. Backlog HY-11..16 filed for the next reviewed commit.

## Review 7 — 2026-09-02 · commit e1d0e5e: front-face labels, Formspree, Calendly removed
reviewed-commit: e1d0e5e
**One sentence:** *"PUSH e1d0e5e — all three things Wyatt asked for are done on the site as it stands, the four screenshots agree with the claims for the first time in this series (no axis label touches a tile, the contact form sits under the brand at reading width, Calendly is gone from every page), and what remains is one honest trade-off already put to him (the phone headline), one thing only a live push can prove (a real Formspree submission), and three small leftovers that do not touch his asks."* **PUSH.**

- **Asked for / delivered:** headline DONE desktop, PARTIAL phone (first line ends at "you", disclosed); UNDERSTAND at the graph's edge DONE both viewports (phone label still margin-pinned but lies on the box edge); Formspree DONE as code, unproven as a channel until a real submission; Calendly removed DONE, nothing left on any page, ruling recorded.
- **Delivered but not asked for:** phone graph ~23% smaller (tile text illegible at phone size; for Wyatt to judge); two new lines of copy in his voice ("Three lines is enough to start…"); 720px headline over faint grid lines at 1440 (disclosed); test plumbing.
- **Unsupported claims:** red-proof terminal-only, fourth time; "whatever the angle" comment holds for the data at rest, but the test samples only the resting view; EDITING.md:16 and CTO-QUESTIONS.md still mention Calendly.
- **Leftovers, not blocking:** contact form section's `aria-labelledby` points at a deleted heading; `novalidate` with no JS validation means `required` does nothing and a blank form can be sent.
- **Recurrence:** Review 6's fault fixed, not re-dressed; the terminal-only proof habit recurred.
- **Working session's response:** pushed. Queued for the next reviewed commit: HY-7 vendor Three.js (Wyatt's uBlock blanked the graph from the CDN), HY-8 dead `aria-labelledby` + form validation, HY-9 EDITING.md/CTO-QUESTIONS Calendly mentions, HY-10 sample the label check at dragged angles. Wyatt to send one real message from the live form.

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
