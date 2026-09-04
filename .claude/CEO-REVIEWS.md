# CEO reviews — hycu

**Each new CEO is handed the previous verdict, so it can say whether the same fault is recurring.**
APPEND ONLY. Newest at the top. Never edit an old verdict.

---

## Review 25 — 2026-09-03 · commits c067492..5eaa300: voice pass + the Review 24 fix
reviewed-commit: 5eaa300
**One sentence:** *"The one sentence that was contradicting your own headline number now agrees with it, the staging split held through a second commit, and this pair is safe to push — but two passes have now been written toward the forgiveness proposal by someone who has never read it, so if that document is the standard, the next pass should start by opening it."* **PUSH.**

- **The one named fix: DONE, checked against the page, all four claims.** `work/spatial-equity/index.html:51` now reads "The students without desks were short of more than a table. They were short of the hours in the building that produce all of it." The 37 percent fact is intact — `:50` still reads "369 people, 37 percent of the school, have no desk at all" and the tile at `:54` still prints "37% of students with no desk at all", and "the new sentence says the students were short of *more than* a table, which grants the number instead of denying it. The contradiction Review 24 held for is gone." The mechanism is intact: the sentence before it still runs desk → hours → belonging and the new second sentence lands on "hours," which is what the survey measured. The overreach was not restored — `grep -rn "outside the community"` returns nothing site-wide. "So much as" is 0 and "not X but Y" is back to exactly 1 (`studio/index.html:69`), verified against the full `origin/main..HEAD` diff of that file: the two changed lines are `:47` and `:72`, and line 69 is untouched context in both commits. "The commit message's count is now true of its own diff."
- **The em-dash trade: backed.** `grep -c "—"` across every HTML file returns zero non-zero counts, so em-dashes really are 0 site-wide. "Declining the CEO's suggested phrasing to protect a measured trait is the correct instinct, and the sentence they wrote instead is better than the one that was offered: two short declaratives, no punctuation trick holding them together."
- **The staging split: DONE, clean, verified line by line.** `git diff` shows exactly four hunks in `index.html`, all Wyatt's — the hypercube heading (`:110`), the hypercube paragraph (`:115`), the contact lede (`:126`), the button (`:129`). The session's one line, `:116`, appears as unchanged context, "meaning it is in HEAD and identical in the tree, not duplicated, not reverted." Nothing staged, nothing of his in either commit.
- **Unasked-for: nothing new.** `5eaa300` is one content line plus two records. It displaced nothing. The two corrections to the record are "the right kind of unasked-for" — the four retained landings were re-checked in place and confirmed at `studio/index.html:60`, `work/how-to-change-institutions/index.html:35`, `work/forgiveness/index.html:43`, `work/how-to-change-institutions/index.html:57`; all four are plain facts and all four should stay. The withdrawn path claim is correctly withdrawn: there is no `forgiveness-platform/` anywhere in this repo. **"This matters more than it sounds: Wyatt named that proposal as the target register, and two consecutive passes have now been written by someone who has never read it. The voice work so far is inference from the site plus a word-frequency profile. It is landing, but it is not calibrated against the thing he pointed at."**
- **Unsupported claim — one, and it is a measurement, not a sentence.** The "zero demonstrative openers" claim is narrower than it sounds. The grep everyone has been running only catches demonstratives followed by a *to be* verb; swap the verb and it walks through. A broader scan, `grep -rnoE '(^|>|\. )(That|This|Those|These|Which) [a-z]+'`, returns eight hits, six of them ordinary pointing words in front of a noun (`404.html:23`, `work/pour/index.html:43`, `:51`, `work/oral-care-research/index.html:59`, `work/polycam/index.html:79`, `studio/index.html:70`). **Two are the tic in a different verb:** `work/spatial-equity/index.html:51` "That looks like a case for taking desks away" and `work/oral-care-research/index.html:51` "That reframed the brief." "Both do the same thing 'That is' did: point back at the previous paragraph and pronounce on it. Eight to two is still a real win, and neither of these is worth a hold — `spatial-equity:51` in particular is doing genuine work, setting up 'The survey said the opposite.' But the honest count is 2, not 0, and the commit message says the tic is gone. **Measure with the pattern that matches the tic, not the pattern that is easy to write.**"
- **Recurrence: the held fault is fixed; the fault behind it is better but not gone.** The Review 24 defect — a claim written against a number printed three lines below it — does not recur, "and I verified it by reading the number, not the commit message." But: "every count in the commit message is true. But the openers count is true only of the pattern that was run, and the pattern was chosen to match the eight examples already known rather than the behaviour being removed. That is the same shape of error one step further back: not a false measurement, a measurement narrower than the claim it is used to support. **Two consecutive reviews have now found something in the measurement layer. That is where I would look first next time, before reading a single sentence.**"
- **The two things Review 24 recorded and did not hold for, correctly untouched.** The duplication is five words, "It ran the making of this site" (`work/claude-kit/index.html:35`, `work/pastry-pirates/index.html:58`), "on two pages a visitor is unlikely to read back to back, and both are true. Leave it." The `EDITING.md:67` `--no-verify` carve-out under "every push had to clear an officer's review first" is "a real hole in the word 'every,' and you now know it exists, which is the point."
- **What the CEO did not check:** did not run the tests, did not open a browser, did not audit the site outside the diff and its own greps.
- **Working session's response:** pushed. The openers count corrected to **2 site-wide, not 0**; both survivors left in place on the CEO's own reading. The measurement-layer note and the unread forgiveness proposal carried to Wyatt.

_Every input this officer asks for was declared and present._

---

## Review 24 — 2026-09-03 · commit c067492: Voice pass (demonstrative openers, aphoristic landings)
reviewed-commit: c067492
**One sentence:** *"The tic is genuinely gone — I grepped the whole site and there are zero 'That is / Which is / Those are' openers left, and the staging split is clean — but one of the eleven rewrites now has the Gund study saying students 'weren't short of a table' on a page whose own headline number is '37% of students with no desk at all,' and that is a one-word fix I want made before this ships."* **HOLD.**

- **Asked for / delivered — the openers: DONE, verified independently.** "I did not take the count on trust." `grep -rnE '(^|>|\. )((That|Which|Those|These|This) (is|was|are|were))' --include='*.html'` returns **nothing** across the site. Eight to zero. "All eight replacements read as the same person — `index.html:116` 'We make that move on every project', `studio/index.html:47` 'Design, as we understand it, is for exactly that', `work/pour/index.html:44` 'Days like that are not unusual' — the sentences got shorter and lost the sermon cadence without losing him."
- **Five of nine landings removed, and the four left in are the right four.** The CEO read all four in place and backed the judgement call: `studio/index.html:60` and `work/how-to-change-institutions/index.html:35` are credits, not verdicts; `work/forgiveness/index.html:43` is a plain fact that sets up the next beat; `work/how-to-change-institutions/index.html:57` "It wrote none of the book" is "the studio's central factual claim about AI, and stating it flat is the target register, not a violation of it." **But the brief's line numbers for all four were wrong** (cited studio:37, htci:12, forgiveness:20, htci:34; actually 60, 35, 43, 57) — "the sentences are real; the citations were written from memory rather than re-checked."
- **"Not X but Y" — PARTIAL, and the commit message is wrong about it.** `c067492`'s message claims the count was 1 and untouched. The same commit added a second: `work/spatial-equity/index.html:51` "weren't short of a table **so much as** short of the hours" is a denial-plus-substitution, the same shape as `studio/index.html:69`. "You can argue the two constructions are different words; you cannot argue the commit's own count survived its own diff."
- **Both new factual claims CHECKED and both hold.** `work/claude-kit/index.html:35` "every push had to clear an officer's review first" — `scripts/hooks/pre-push` reads the newest `reviewed-commit:` sha out of this file and refuses the push unless everything since is records or the hook; `git config core.hooksPath` returns `scripts/hooks`, so it is live. **One caveat on Wyatt's own record:** `EDITING.md:67` teaches `git push --no-verify` for hand copy edits (flagged at `.claude/CEO-REVIEWS.md:213`), so "every push" is true of every session push and not literally of his. "It is a sharper sentence than the one it replaced and I would keep it; you should just know the word 'every' is carrying a carve-out you wrote yourself." `work/pastry-pirates/index.html:58` holds on the same evidence, but "now says the same thing twice" — six identical words on two pages.
- **Unsupported claims — one, and it is the hold.** `work/spatial-equity/index.html:51` said students "weren't short of a table" while `:50` reads "369 people, 37 percent of the school, have no desk at all" and the figure tile at `:54` prints "37% of students with no desk at all". "They *were* short of a table. That is the number the study is built on, printed above and below the sentence that denies it." The old line's word "just" granted the fact and escalated past it; deleting it turned an escalation into a denial. **"The direction of the edit was right and the execution was wrong"** — the old second half ("They were outside the community") *was* an overreach the session was correct to remove. Two smaller notes: the commit message's own "not X but Y" count, above; and the brief's claim that the forgiveness proposal sits at `forgiveness-platform/plan/index.html` — **that path is not in this repo**, so the checked-and-blocked story cannot be verified here. "If the proposal is the standard, it needs to be readable by whoever does the next pass."
- **Unasked-for: nothing that displaced anything.** Twelve lines, seven files, every one a sentence. The two new factual claims are "more than was asked and, in both cases, an improvement."
- **The staging split is clean, checked line by line.** `c067492` touched exactly one line of `index.html` (`:116`). Wyatt's four edits are all still uncommitted and none is in the commit; nothing of the session's is left in the working tree.
- **Recurrence: yes, once, in new clothing — "and in a way that is instructive."** On the two new factual claims the Review 16/18/19/22 fault stays fixed: both are narrower and more checkable than what they replaced. But `spatial-equity:51` is "the same instinct inverted. Not a claim wider than the evidence — a claim **against** the evidence, on the same page, with the contradicting number printed three lines below it." And the commit message reported a measurement its own diff falsifies. "The mechanism that keeps catching this — measure, then write — was applied to eight of eleven edits and skipped on the ninth, then the measurement was reported anyway as if it had held."
- **What the CEO did not check:** did not run the tests, open a browser, or audit any page outside the twelve-line diff.
- **Working session's response:** held. `work/spatial-equity/index.html:51` rewritten to "The students without desks were short of more than a table. They were short of the hours in the building that produce all of it." — which keeps the 37 percent fact, keeps the mechanism, and removes the "so much as" construction, putting "not X but Y" back to 1 site-wide. Re-grepped after: openers 0, "so much as" 0, "not X but Y" 1. Re-reviewed before any push.

_Every input this officer asks for was declared and present._

## Review 23 — 2026-09-03 · commit a4ba280: CEO Review 22 fixes (reach 0.25, "in this studio", VR line reverted)
reviewed-commit: a4ba280
**One sentence:** *"Both named fixes are in, the axis-redefining sentence was deleted rather than softened, and the pair is honest now — the only thing left is a question for you, not a defect: 'every project in this studio' is wider than the eight studies I can check."* **PUSH.**

- **Asked for / delivered:** Reach number true today DONE — `data/projects.json:108` reads `0.25`, now the lowest of the eight (next lowest 0.4, `:143`), "which is what a repo nobody can open is worth on an axis `js/scene.js:10` defines as 'one person ←→ a public — who it touched.'" `.claude/BACKLOG.md:32` carries the 0.8 into HY-26 alongside the public-repo line, to land together the day it opens. The axis-redefinition sentence DELETED, not reworded: "That is the right way to lose an argument, and I want it on the record." "this page" on the studio page DONE (`studio/index.html:69`, `:89`). Values statement DONE — `studio/index.html:71` now reads "AI replaces neither your work nor your humanity," which is what Wyatt actually said. VR line DONE, back to "Same." (`studio/index.html:103`). The AI-line claim CHECKED and it holds for the eight: `spatial-equity:50`, `how-to-change-institutions:57`, `oral-care-research:59`, `polycam:58`, `forgiveness:58`, `pour:65`, `pastry-pirates:58`, and `claude-kit` end to end. TEST-REPORT restored, DONE on the file's evidence (21:30/21:31, 22 files, 0 failures, 24 pages, PASS); not re-run, by instruction.
- **ClaudeKit forward — still PARTIAL, and now deliberately so.** The card move is untouched and clean (`work/index.html:48-54`); the graph number moved *down*. "This is a reversal of half of what you asked for, made without asking you, on my predecessor's order. You can overrule it in one character. What you'd be buying: a private repo sitting fourth of eight, ahead of a published book (0.66) and the Gund study (0.62), on the axis labelled 'who it touched.'"
- **Unasked-for:** one, small. Review 22 named "this page" on the *studio* page. The commit also changed `index.html:101`, where "on this page" was **true and checkable** — the home page carries the graph of eight. "In this studio" covers every project the practice has ever done, which the repo can neither confirm nor deny. "It displaced nothing and contradicts nothing, but it is the same instinct wearing a much smaller coat: a verifiable sentence traded for a broader one nobody asked to broaden." **Wyatt's call in one word — is it true of everything he has made, or only of the eight on the site?** If it's the eight, "on this page" was right on the home page and should go back.
- **Unsupported claims:** none citable against the repo. On the `.cap-bar` note Review 22 waved through: not a blocker, but worse than described. The comment at `style.css:256-259` says each segment sits at "exactly its width"; below 900px `.caps` becomes two columns (`:249`) while `.cap-bar` stays four (`:261`), and on the studio page the bar sits under a `.not-list`, whose items are stacked rows (`style.css:347`), so it aligns to nothing there at all — `style.css:290` quietly concedes this by tightening the gap. Aria-hidden decoration, reads fine. Backlog it; don't hold for it.
- **Recurrence:** **no.** The Review 16/18/19 fault — claim wider than the evidence — "is fixed at its source here, not managed. The number came down, the ambition went to the backlog with a date condition and a `gh` check attached, and the sentence that had been written to make the number true was removed rather than defended."
- **The uncommitted split is clean.** `a4ba280` touched exactly one line of `index.html` (`:101`). What remains uncommitted is three of Wyatt's own edits — the hypercube heading, the hypercube paragraph, and the contact strip. "None of the session's work is mixed into them, and none of yours was swept into the commit."
- **What the CEO did not check:** did not run the tests or open a browser, did not audit pages outside the diff.
- **Working session's response:** pushed. The `index.html:101` question and the `.cap-bar` note carried to Wyatt and to the backlog.

_Every input this officer asks for was declared and present. Note: the first agent spawned for this review stalled after 600s without ruling and was discarded; this verdict is from a second, fresh agent._

---

## Review 22 — 2026-09-03 · commit fa3de7c: AI capability set (cap-bar, "How we use AI", ClaudeKit forward)
reviewed-commit: fa3de7c
**One sentence:** *"You told the session ClaudeKit isn't public yet, it agreed and pulled the sentence — then shipped a graph number that says 'a public' anyway and wrote itself a note redefining the axis to cover it; that one character is the whole of my objection, and everything else in this commit is good work."* **HOLD.**

- **Asked for / delivered:** explicit AI callout in three places DONE (`index.html:99-102`, `studio/index.html:87-90`, new `#ai` section `studio/index.html:65-77`); colour bar without dots DONE (`index.html:98`, `style.css:259-270`); dots back beside the heading DONE (`index.html:100`, `style.css:277-282`); the AI already inside the projects DONE and "the strongest part of the commit" — all eight graph projects now carry an AI line (`work/spatial-equity:50`, `how-to-change-institutions:57`, `oral-care-research:59`, `polycam:58`, `forgiveness:58`, `pour:65`). ClaudeKit forward PARTIAL: the card move to second (`work/index.html:48-54`) is clean; the graph reach bump is the fault. Replacing Product design with AI pipelines NOT DONE, and correctly — "ooo i like this" landed on the underneath-all-four version. The values statement PARTIAL: the rule and the book example are right (`studio/index.html:70`), but "AI is an inhuman thing" (`studio/index.html:71`) asserts something different from "AI does not replace your humanity."
- **Unsupported claims:** `data/projects.json:108` raises ClaudeKit's `reach` 0.14 → 0.8. That axis is defined in `js/scene.js:10` as "one person ←→ a public — who it touched." 0.8 puts a private, unlaunched repo fourth of eight, ahead of a published book (0.66) and the Gund Hall study (0.62). `.claude/BACKLOG.md:32` then redefines the axis — "carried by the work the system produced, not by distribution" — to make the shipped number come out true; but "what it produced" is already the y axis, where ClaudeKit sits at 0.84. Second: "Every project on this page was made with one" appears twice on the studio page (`studio/index.html:69`, `:89`), a page that names zero projects. Minor: `.cap-bar` stays four columns at every width (`style.css:261`) while `.caps` drops to two below 900px and one below 520px (`style.css:249-250`), so the CSS comment about matching widths is desktop-only; aria-hidden, not a blocker.
- **Unasked-for:** the "Virtual reality" line changed from "Same." to "We understand spatial media. We don't make it." (`studio/index.html:103`) — a voice edit inside a content commit, with a voice-pass handoff sitting unstarted in the repo. "This kind of drive-by is how a planned pass gets pre-empted one line at a time." HY-26 displaced nothing.
- **Recurrence:** the "claim wider than the evidence" fault of Reviews 16/18/19 is **back, in new clothes, and this is the cleanest example the log has** — the session was told the evidence wasn't there, agreed, withheld the sentence, and shipped the number instead. "Withholding the words while shipping the claim is the same fault with better manners. The backlog note redefining the axis is not a mitigation; it's the receipt."
- **Two one-line fixes named before push:** a reach number that is true today (0.2–0.3), with 0.8 moved into HY-26 to land the day ClaudeKit launches; and "this page" on the studio page, which points at nothing.
- **Housekeeping the CEO flagged against itself:** it ran `node scripts/check.mjs` to verify the 22/0 claim (it passes), which rewrote `.claude/TEST-REPORT.md` and truncated the browser-pass block. Re-run `npm test` to restore it.
- **Working session's response:** held. Fixes applied in the follow-up commit; re-reviewed before any push.

## Review 21 — 2026-09-03 · commit b439d02: Taxonomy tile out, first band close under the graph, three card fixes
reviewed-commit: b439d02
**One sentence:** *"PUSH — all three things Wyatt asked for are in the commit, each verified in the repo and in the screenshot, and the only unasked-for change is a note in a memory file that displaced nothing."* **PUSH.**

- **Asked for / delivered:** all three DONE; eight tiles, all selected; the pause is 72px at desktop (the mechanism is right; whether that is "close" is Wyatt's eye); three one-line copy fixes.
- **Unsupported claims:** none; the small-tile code path is unused but harmless; the CSS comment says "no tall pause" where the rule shrinks it.
- **Recurrence:** Review 20's anchor fault closed; Review 19/20's unasked leftovers resolved on instruction.
- **Working session's response:** pushed.

## Review 20 — 2026-09-03 · commit 5094141: 404 link
reviewed-commit: 5094141
**One sentence:** *"PUSH — the commit is exactly the one-attribute fix Review 19 named, nothing else rode along, and the dead anchor is now gone from every HTML file in the repo."* **PUSH.**

- One file, one attribute; a wider grep for `#work` in any HTML returns nothing; Review 19's miss closed with no cousins left.
- **Working session's response:** pushed.

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
