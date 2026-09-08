## Review 15 — 2026-09-02 · commit 610a775: Pour + HTCI studies, SYSTEM flicker
reviewed-commit: 610a775
**One sentence:** *"HOLD, narrowly. Both pages exist and say what he asked (Pour's facility unnamed, HTCI as Studio · Hycu), and the flicker fix is sound, but the new How to Change Institutions tile now sits underneath the very SYSTEM label he complained about in the opening view of the home page, and the test that reports 'no axis label on a tile' never looks at that label."* **HOLD.**

- **Asked for / delivered:** pages DONE; anonymity DONE on the site (the prototype link was the one unverifiable item; the session then fetched it: it names no facility); HTCI as Studio DONE; flicker DONE in code, proven by reading only.
- **Delivered but not asked for:** the HTCI tile under the SYSTEM label (new fault); ClaudeKit mostly hidden behind Polycam (pre-existing); REACH hysteresis; projects.json reformatted; Next chain reordered; Review 14 housekeeping done.
- **Unsupported claims:** "no axis label on a tile" true only of the four endpoint labels.
- **Recurrence:** Review 14's fault did not recur; a PASS narrower than it sounds recurred.
- **For Wyatt:** the graphic paragraph on the Pour page is his call.
- **Working session's response (amended into the same commit):** HTCI moved left of the y axis (make 0.28), ClaudeKit out from behind Polycam (make 0.92, idea 0.76); SYSTEM added to the label-on-tile check; red-proofed by putting HTCI back under the label (FAIL) then restoring (PASS).
