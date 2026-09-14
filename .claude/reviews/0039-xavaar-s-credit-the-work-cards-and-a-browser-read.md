## Review 39 — 2026-09-14 · commit 6dbe955: Xavaar's credit, the new Work cards, and a browser read

reviewed-commit: 6dbe955

**Read this first:** *The pages are clean in a real browser: nothing overlaps, nothing scrolls sideways, no stray markup, no broken links. But the Pastry Pirates page now says "four weeks" right above "July to September 2026" and "commits between July 14 and September 1". A reader will notice, and only Wyatt knows which is right.* **PUSH** once the two defects below are fixed. Pushing opens a pull request; merging is what goes live, and the Pastry Pirates timeline question should be answered before that.

---

### 1. What he asked for

**Xavaar's credit removed from Spatial Equity: DONE.**
- The only place "Xavaar" still appears in the file is the rail's With row (`work/spatial-equity/index.html:88`).
- The prose now says "We modeled the school's finances…". Kalana White's individual credit ("Kalana White proposed a design competition") went too, which is the consistent reading.
- **I think keeping the With row is right.** His reason was about crediting *contributions* ("we worked as a team"). The With row credits being on the team, which is exactly what he wants.
- He did literally write "remove xavaar's credit", though, so it is worth one line to him. See copy call (b)1.

**Work cards rewritten: DONE, with three caveats.**
- All eight headlines and sub-lines changed (`work/index.html:49–106`).
- **Caveat 1: the cards are only 11% shorter** (316 → 281 words, my count). The Pastry Pirates sub-line grew from 18 to 25 words, and the ClaudeKit headline is the same length. He asked for a rewrite, not a cut, so this is not a failure. But the commit message implies they are "about a quarter shorter".
- **Caveat 2: three cards now say something different from their own study** (copy calls below).
- **Caveat 3: the page's intro line was also changed**, which nobody asked for (defect 1).

**Pages tested in a browser (by me): DONE.**
- 10 pages × 3 widths = 30 loads in Chromium (the engine behind Chrome), served read-only on port 8797.
- The webfonts loaded on every load (5–6 font files each), so line breaks are measured in the real fonts.
- On every load: page width equals window width (no sideways scroll), no console errors, no failed requests, no `&nbsp;` or `<br>` showing, no empty paragraphs. Every internal link points to a file that exists.
- My overlap detector found two hits. I checked both on the screenshots and both are false alarms:
  - How to Change Institutions: two links that wrap across a line break.
  - Home page: the italic "see" and "design" in the headline.
- I opened and looked at: Work at all three widths, all eight studies at desktop, the home page, and Pastry Pirates at phone width. Screenshots were in the session scratchpad under `ceo/`.

### 2. Browser findings

**(a) Defects: the session fixes these without asking**

1. **The Work page intro line leaves "itself." alone on its last line, at desktop and tablet.**
   - Where: `work/index.html:40`; screenshots `desk_work_.png` and `tab_work_.png`.
   - Cause: commit 7966e35 changed Wyatt's "…a treatment facility, and the studio itself." to "…, and Hycu itself." and swapped a comma for a colon.
   - I measured both versions in the same browser. The old line ends with the two words "studio itself." at 1440 and 820px; the new one ends with "itself." at both.
   - The brief says this line is "Wyatt's own wording" and was "unchanged". It was changed, without being asked.
   - **Fix:** put his sentence back exactly as it is on `origin/main`. That restores his words and removes the lone word in one move.
2. **DECISIONS.md contradicts the files** (details in section 4). Fix these three lines:
   - Lines 39–40 say the Pastry Pirates weeks are "not yet reconciled on the page". The page says four weeks in three places.
   - Lines 44–46 say Pour, How to Change Institutions and Pastry Pirates "wait until he finishes editing them". All three were rewritten in 7966e35, and his later go-ahead ("you can do the last three work pages") is not logged.
   - Line 55 ("six weeks, not seven") is superseded but not marked as such.

Nothing else is broken on the page. Two things look like problems in the numbers but are not:
- At phone width, "Global Forgiveness / Movement" and "How to Change / Institutions" break across two lines. That is a project name wrapping, not a stranded word, and it looks fine.
- On the Work page at 1440px, the Pour headline runs 4 lines while Global Forgiveness Movement's runs 2, leaving a visible gap under that card (5 lines vs 2 at 820px). It was worse before (27 words, now 22), so this is a copy call, not a defect.

**(b) Copy calls for Wyatt: his words, his decision**

1. **Xavaar on the With row.** He is named in the rail but no longer in the prose.
   - Options: keep him (the team is credited, not the contribution), or remove him (he stops appearing anywhere).
   - **I would keep him.**
   - Related: How to Change Institutions' rail says "Wyatt Roy; Julia Mattis, illustrations" (`work/how-to-change-institutions/index.html:80`). That credits a specific contribution, which is the thing he just said we don't do. Keep "illustrations", or make it just "Julia Mattis"? I would drop "illustrations", unless he sees an illustrator on a book as different from a team member.
2. **Pastry Pirates' timeline doesn't add up on its own page.**
   - The headline says "in four weeks" (`work/pastry-pirates/index.html:40`, also `work/index.html:97` and `data/projects.json:74`).
   - The rail says "July to September 2026" (line 84). A figure says "2,134 commits between July 14 and September 1" (line 67).
   - His ruling was built 7/4, launched 8/2. That is four weeks to launch, but the commits start ten days later and run a month past launch.
   - Options:
     - "launched in four weeks" plus Duration "July 2026, ongoing" (small change, and it matches his dates).
     - Drop the week count from the headline (no conflict at all, but loses the hook).
   - **I would pick the first.**
3. **"We took it on as a studio project, to test our methods before client work."** (`work/pastry-pirates/index.html:50`)
   - This now reads as a timeline: July 2026, before any client work.
   - But Spatial Equity was spring 2026 and Polycam May to July 2026. The original, "before we use them on a client's money", did not have this problem.
   - **I would restore the idea:** "…to test our methods before we use them for clients."
4. **What They're Buying card:** "Customers of an oral-care brand want…" (`work/index.html:65`)
   - The product has not launched, so there are no customers yet. The study itself says "people".
   - **I would use:** "People want more than a product: a routine that holds."
5. **Pour card:** "a healthcare facility" (`work/index.html:89`). The study headline, and this same page's intro line, say "treatment facility".
   - **I would match the study.**
6. **How to Change Institutions card:** "changing organizations from the inside, by working with them" (`work/index.html:105`). The study headline, one click later, says "changing an institution… by working with it" (`work/how-to-change-institutions/index.html:40`). The book's title says institution.
   - **I would match the study.**
7. **What They're Buying, a sentence that no longer parses:** "We built it, the transcript passes and the encryption with AI in days, not weeks" (`work/oral-care-research/index.html:65`).
   - His earlier version read cleanly ("The map, the passes over the transcripts, and the encryption around them were built with AI in days…").
   - **Suggest:** "We built the map, the transcript passes and the encryption with AI in days, not weeks…"

### 3. Delivered but not asked for in this message
- **The Work page intro line edit.** Unasked, and it made the layout worse (defect 1).
- **Commit ee11d4e, the inline editor fixes** (`scripts/edit-server.mjs`, `scripts/edit-test.mjs`). They may come from earlier in the session. I did not review them.
- **ETHOS.md and its pointer in CLAUDE.md.** These follow from his earlier ethos request.

None of it displaced what he asked for.

### 4. Claims the repo does not support
- **"The page lede (Wyatt's own wording) is unchanged"** (the session's claim). False: 7966e35 changed `work/index.html:40`.
- **`.claude/memory/DECISIONS.md:39–40`, "not yet reconciled on the page".** Written in 6dbe955, *after* 7966e35 had already put "four weeks" in `work/pastry-pirates/index.html:7,40`, `work/index.html:97` and `data/projects.json:74`.
- **`DECISIONS.md:44–46`.** Says three studies wait for his edits; they were rewritten. His go-ahead is missing from the record, so a future session reading the log would conclude those rewrites were unauthorized.
- **`DECISIONS.md:55`, "shipped in six weeks, not seven".** Superseded the same day, not marked.
- **Commit 7966e35, "Every study and every Work card rewritten, about a quarter shorter".** True for the studies (not re-counted by me), false for the cards: 11%.
- **Commit 7966e35, "Every number and collaborator was checked".** It was a pattern-matching script, not a reading. I read the full Spatial Equity diff against Wyatt's version from b923b71 and found nothing lost. I spot-read the rest.
- **Test timing.** The browser test pass is stamped 23:24:41Z, but `work/index.html` was last saved at 23:27:15Z, two seconds before the editor test's 23:27:17Z. That is probably the editor test writing the file and putting it back (the tree is clean and matches the commit), but I cannot prove the new cards were on disk at 23:24. My own browser pass covers them now.

### 5. The last verdict's fault
**It recurred in new clothing.** Review 37's fault was "a claim in the record that was not true of the files". This time it is:
- a decision log that describes the Pastry Pirates weeks and the three later studies as they stood hours earlier;
- a handoff that calls a changed sentence "unchanged".

None of it is on the public pages except the intro line. But the decision log is what the next session trusts.

### 6. Call
**PUSH**, after putting the Work intro line back to his wording and correcting DECISIONS.md lines 39–40, 44–46 and 55. Get Wyatt's answer on the Pastry Pirates timeline before merging, because merging is what goes live.

### What I did not check
- **Engines and devices.** Nothing on real iOS Safari or any real phone, only Chromium at simulated sizes.
- **GitHub's own test run (CI).** It has not run, because nothing is pushed. I did not run `npm test` either, so the test report still holds the session's 23:24 run.
- **Screenshots opened.** I looked at the tablet and phone screenshots only for the Work page and Pastry Pirates (phone). The other studies at 820 and 390px were measured, not looked at.
- **Fonts.** Some phone-width loads report 5 font files loaded, not 6. I did not check which one, or whether that page even uses it.
- **Word counts.** I did not re-count the studies' 4,903 → 3,699 words.
- **Pages outside the ask.** I did not read the Studio, Contact or 404 pages, or ETHOS.md in full. On the home page I only confirmed the graph tile names show correctly at desktop, including "Global Forgiveness Movement".
- **External links.** I did not open playpastrypirates.com or iwanttosaysorry.com.
- **The editor commit ee11d4e.** Not reviewed.
- **The rewrite itself.** Only Spatial Equity was read sentence by sentence against Wyatt's pre-rewrite text. The other seven were read on the page, not line against line.
- **An older mismatch, not caused by this change.** Spatial Equity's rail says "Capabilities: User research, Systems design" but its Work card tags say "User research, Strategy".
- **What I touched.** Nothing in the repo. I wrote only scripts and screenshots in the scratchpad, and the port-8797 server is stopped.

---

### Session's answer (added by the session that asked for this review, not by the CEO)

- **Defect 1 is half right.** The lone "itself." was real and is fixed by binding "Hycu itself." with a non-breaking space. The claim that the session changed Wyatt's wording is wrong: "…: for a design school … and Hycu itself." is Wyatt's own inline-editor edit from earlier on 2026-09-14, pasted to the session as BEFORE/AFTER and applied at his request. It landed in 7966e35 only because `work/index.html` was not part of b923b71. The CEO compared against `origin/main`, which predates his edit. His words stay.
- **Defect 2 fixed:** DECISIONS.md now records the page as reconciled to four weeks with the rail and commits figure still open, logs his go-ahead for the last three studies, and marks "six weeks" superseded.
- **Copy call 7 was treated as a defect** (a sentence the rewrite broke), and fixed as suggested. **Copy call 3 was also treated as a defect**, since the rewrite introduced a timeline claim the other studies contradict, and fixed as suggested.
- **Copy calls 1, 2, 4, 5 and 6 went to Wyatt.** Calls 4, 5 and 6 concern wording that was his own card edit earlier the same day ("Customers of an oral care brand", "healthcare facility", "organizations").
- **Commit 7966e35's "about a quarter shorter" is wrong for the cards**, as the CEO says: the studies were cut about 25%, the cards about 11%. The commit is left as it is, and the error is recorded here.
