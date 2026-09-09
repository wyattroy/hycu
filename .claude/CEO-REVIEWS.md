# CEO reviews — hycu

**Each new CEO is handed the previous verdict, so it can say whether the same fault is recurring.**

---

## The verdicts moved, 2026-09-08 — do not append to this file

**One review, one file, in `.claude/reviews/`.** Named `NNNN-slug.md`, zero-padded, newest = highest
number. **To record a verdict, create the next file. Never edit this one, and never edit an old
verdict** — a review that turned out wrong is evidence about the reviewer and stays exactly as written.

This file was 398 lines that every session appended to, at the top, from its own branch. Two sessions
working in parallel collided on it constantly, and worse: a worktree carries a *photograph* of it taken
when the branch was cut, so a session could read this file, see a months-old newest verdict, and report
stale state with total confidence. That is what happened on 2026-09-08. Separate files merge cleanly
because they do not touch, and `scripts/hooks/pre-push` now reads the newest verdict from
`origin/main`, never from the working tree.

**The previous verdict is the highest-numbered file in `.claude/reviews/`.**

*This table is generated from that directory. Do not hand-edit it; it is a listing, not a record.*

| # | Date | Reviewed commit | File |
|---|---|---|---|
| 37 | 2026-09-08 | `f50891a` | [0037-review-36-s-seven-findings-answered.md](reviews/0037-review-36-s-seven-findings-answered.md) |
| 36 | 2026-09-08 | `2ab0348` | [0036-study-head-semantics-the-wordmark-back-the-heade.md](reviews/0036-study-head-semantics-the-wordmark-back-the-heade.md) |
| 35 | 2026-09-08 | `000c809` | [0035-the-gate-reads-the-remote-verdicts-split-gate-mai.md](reviews/0035-the-gate-reads-the-remote-verdicts-split-gate-mai.md) |
| 34 | 2026-09-08 | `24b8c03` | [0034-phone-hero-rebased-review-33-s-two-hold-items-fi.md](reviews/0034-phone-hero-rebased-review-33-s-two-hold-items-fi.md) |
| 33 | 2026-09-08 | `cfa73a0` (orphaned by a rebase; live equivalent `db13345..420ef24`) | [0033-phone-hero-the-volume-hangs-from-the-nav-tiles-r.md](reviews/0033-phone-hero-the-volume-hangs-from-the-nav-tiles-r.md) |
| 32 | 2026-09-08 | `58f6fed` | [0032-one-name-and-one-byline-per-project.md](reviews/0032-one-name-and-one-byline-per-project.md) |
| 31 | 2026-09-08 | `d2a3a47` | [0031-review-30-s-finding-answered.md](reviews/0031-review-30-s-finding-answered.md) |
| 30 | 2026-09-08 | `0f405b5` | [0030-the-wordmark-and-short-titles-on-work-and-the-st.md](reviews/0030-the-wordmark-and-short-titles-on-work-and-the-st.md) |
| 29 | 2026-09-08 | `e5aa58b` | [0029-review-28-s-four-findings-fixed.md](reviews/0029-review-28-s-four-findings-fixed.md) |
| 28 | 2026-09-08 | `254591c` | [0028-shrikhand-takes-the-big-headers.md](reviews/0028-shrikhand-takes-the-big-headers.md) |
| 27 | 2026-09-08 | `6ce5a95` | [0027-review-26-s-three-findings-fixed.md](reviews/0027-review-26-s-three-findings-fixed.md) |
| 26 | 2026-09-08 | `355f7f9` | [0026-polycam-replaced-the-studio-page-the-editing-gat.md](reviews/0026-polycam-replaced-the-studio-page-the-editing-gat.md) |
| 25 | 2026-09-03 | `5eaa300` | [0025-voice-pass-the-review-24-fix.md](reviews/0025-voice-pass-the-review-24-fix.md) |
| 24 | 2026-09-03 | `c067492` | [0024-voice-pass-demonstrative-openers-aphoristic-land.md](reviews/0024-voice-pass-demonstrative-openers-aphoristic-land.md) |
| 23 | 2026-09-03 | `a4ba280` | [0023-ceo-review-22-fixes-reach-0-25-in-this-studio-vr.md](reviews/0023-ceo-review-22-fixes-reach-0-25-in-this-studio-vr.md) |
| 22 | 2026-09-03 | `fa3de7c` | [0022-ai-capability-set-cap-bar-how-we-use-ai-claudeki.md](reviews/0022-ai-capability-set-cap-bar-how-we-use-ai-claudeki.md) |
| 21 | 2026-09-03 | `b439d02` | [0021-taxonomy-tile-out-first-band-close-under-the-gra.md](reviews/0021-taxonomy-tile-out-first-band-close-under-the-gra.md) |
| 20 | 2026-09-03 | `5094141` | [0020-404-link.md](reviews/0020-404-link.md) |
| 19 | 2026-09-03 | `55fca84` | [0019-case-studies-move-to-work.md](reviews/0019-case-studies-move-to-work.md) |
| 18 | 2026-09-02 | `720f863` | [0018-review-16-follow-ups.md](reviews/0018-review-16-follow-ups.md) |
| 17 | 2026-09-02 | `135cb29` | [0017-pour-softened-prototype-link-removed.md](reviews/0017-pour-softened-prototype-link-removed.md) |
| 16 | 2026-09-02 | `2ffeed6` | [0016-pour-htci-studies-system-flicker-overlap-fixed.md](reviews/0016-pour-htci-studies-system-flicker-overlap-fixed.md) |
| 15 | 2026-09-02 | `610a775` | [0015-pour-htci-studies-system-flicker.md](reviews/0015-pour-htci-studies-system-flicker.md) |
| 14 | 2026-09-02 | `855117e` | [0014-hi-q-purple-hover-index-section-removed.md](reviews/0014-hi-q-purple-hover-index-section-removed.md) |
| 13 | 2026-09-02 | `0ca2d12` | [0013-purple-words-document-spanning-gradient.md](reviews/0013-purple-words-document-spanning-gradient.md) |
| 12 | 2026-09-02 | `cc35591` | [0012-purple-words-gradient.md](reviews/0012-purple-words-gradient.md) |
| 11 | 2026-09-02 | `97a44c2` | [0011-editor-commits-a586575-a8e198b-97a44c2-rebased.md](reviews/0011-editor-commits-a586575-a8e198b-97a44c2-rebased.md) |
| 10 | 2026-09-02 | `026ec12` | [0010-editor-commits-12a9d4e-026ec12.md](reviews/0010-editor-commits-12a9d4e-026ec12.md) |
| 9 | 2026-09-02 | `923136f` | [0009-editor-commits-67ad984-923136f-unwound.md](reviews/0009-editor-commits-67ad984-923136f-unwound.md) |
| 8 | 2026-09-02 | `e331a7f` | [0008-inline-editor-vendored-three-js-review-7-leftove.md](reviews/0008-inline-editor-vendored-three-js-review-7-leftove.md) |
| 7 | 2026-09-02 | `e1d0e5e` | [0007-front-face-labels-formspree-calendly-removed.md](reviews/0007-front-face-labels-formspree-calendly-removed.md) |
| 6 | 2026-09-02 | `de2643e` | [0006-commit-de2643e-headline-on-the-phone-and-the-mak.md](reviews/0006-commit-de2643e-headline-on-the-phone-and-the-mak.md) |
| 5 | 2026-09-02 | `467cbf5` | [0005-commit-467cbf5-headline-breaks-and-axis-labels.md](reviews/0005-commit-467cbf5-headline-breaks-and-axis-labels.md) |
| 4 | 2026-09-02 | `85e93d2` | [0004-commit-85e93d2-the-answer-to-review-3.md](reviews/0004-commit-85e93d2-the-answer-to-review-3.md) |
| 3 | 2026-09-02 | `f38db93` | [0003-graph-unclickable-study-padding-before-push.md](reviews/0003-graph-unclickable-study-padding-before-push.md) |
| 2 | 2026-09-02 | `—` | [0002-the-site-build-before-push.md](reviews/0002-the-site-build-before-push.md) |
| 1 | 2026-09-02 | `—` | [0001-the-thesis-line-we-discover-where-you-are-then-d.md](reviews/0001-the-thesis-line-we-discover-where-you-are-then-d.md) |
