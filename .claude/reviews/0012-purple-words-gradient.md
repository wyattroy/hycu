## Review 12 — 2026-09-02 · commit cc35591: purple words + gradient
reviewed-commit: cc35591
**One sentence:** *"HOLD cc35591 — the purple is exactly right, but the 'gradient behind the page' is only behind the first screen: it ends in a hard grey-to-white line at pixel 900 on every page (mid-content on Studio, Contact and every case study), and the one screenshot the author checked was the one shot that could not show it."* **HOLD.**

- **Asked for / delivered:** purple DONE and exact (#7a4fd6 sampled; test asserts the two words); gradient PARTIAL: sized to one window by `html { height: 100% }` + `background-size: 100% 100%`, seam at the fold on all nine pages.
- **Delivered but not asked for:** transparent canvas and hero (needed); dead `C.bg`; stale stylesheet header. Nothing displaced; Wyatt's card edits untouched.
- **Unsupported claims:** "spans the document" false; judged from the fold screenshot while the full-page shot showing the seam sat beside it; no background check in the pass; headline count under-reported.
- **Recurrence:** proof to the happy path, again.
- **Working session's response (next commit):** gradient moved to the root element with `min-height: 100%` (its box grows with the document), body transparent; a structural check on every page that the root carries the gradient, its box equals the scroll height, and the body is clear; the full-page Studio screenshot read and seam-free; headline count fixed; header and dead-constant comments corrected.
