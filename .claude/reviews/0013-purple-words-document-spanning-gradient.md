## Review 13 — 2026-09-02 · commits cc35591 + 5cee3a0 + 0ca2d12: purple words, document-spanning gradient
reviewed-commit: 0ca2d12
**One sentence:** *"PUSH — the seam Review 12 held on is genuinely gone (I measured the ground pixel-by-pixel down six full-page screenshots at both widths and found the five grey stops landing at the right fractions of every document, with no hard line anywhere), the purple is exact, Wyatt's own card edits are untouched, and the only faults left are a false code comment and a grey so faint he should look at it and decide for himself."* **PUSH.**

- **Asked for / delivered:** purple DONE (#7a4fd6, the site's systems hue; test asserts the two words); gradient DONE (root element, min-height, five stops measured at 28/52/78% on six full-page shots; structural check on all 18 page-loads).
- **Delivered but not asked for:** transparent canvas and hero (required); gradient check and headline-count fix in the pass; housekeeping. Nothing displaced; Wyatt's card edits untouched.
- **Unsupported claims:** the comment on `C.bg` invents a use ("kept for the 2D fallback") that does not exist; rubber-band overscroll on a Mac shows plain white under the `#f8f8fa` foot (noted, not a seam).
- **Recurrence:** Review 12's fault fixed for real; the proof-to-happy-path habit did not recur; the lesser habit of answering a review point with words (the `C.bg` comment) did.
- **For Wyatt:** the gradient is very quiet (darkest stop 5% off white, stretched over the whole page); if "a bit of depth" means braver, the five numbers at the gradient line in style.css are the only thing to touch.
- **Working session's response:** pushed; `C.bg` comment corrected in the records commit? No: code stays as reviewed; HY-23 filed to remove the dead constant.
