# hycu backlog

Item ids are `HY-<n>`. Each needs a reviewed commit to ship.

- ~~HY-1~~ done 2026-09-02 (pointer-events none on desktop only).
- **HY-1 (was)** `.hero-copy { pointer-events: none }` should apply on desktop only; on the phone the copy sits below the graph and the rule only blocks text selection. (CEO Review 4)
- ~~HY-2~~ done 2026-09-02 (browser pass fails if the brand's left edge is under 24px).
- **HY-2 (was)** Browser pass: also fail if the nav brand's left edge is under 24px, so the gutter test measures amount as well as alignment. (CEO Review 4)
- **HY-3** Test a 820px-wide viewport: between 720 and 900px the headline overlays a graph that is not shifted right. (CEO Review 4)
- **HY-4** `--edge` uses `100vw`, which includes the scrollbar on Windows; consider `100%` of a wrapper instead. (CEO Review 4)
- ~~HY-5~~ Formspree wired 2026-09-02 (maeyjowq). Calendly removed by ruling the same day.
- ~~HY-6~~ done 2026-09-02 (certificate approved, Enforce HTTPS on). Was: Enable HTTPS enforcement once GitHub issues the certificate (background poll running 2026-09-02).
- ~~HY-7~~ done 2026-09-02 (Three.js r160 vendored to `vendor/`). Was: Vendor Three.js r160 into `vendor/` instead of loading from jsdelivr: Wyatt's uBlock blanked the graph on 2026-09-02; any visitor with that list sees an empty hero. (session)
- ~~HY-8~~ done 2026-09-02 (dead aria-labelledby removed; browser validation on). Was: `contact/index.html`: remove the dead `aria-labelledby="write-title"`; drop `novalidate` or add JS validation so `required` means something. (CEO Review 7)
- ~~HY-9~~ done 2026-09-02 (Calendly mentions gone from EDITING.md and CTO-QUESTIONS.md). Was: EDITING.md:16 and `.claude/CTO-QUESTIONS.md` still mention Calendly. (CEO Review 7)
- ~~HY-10~~ done 2026-09-02 (label check also sampled after a hard drag, desktop). Was: Label-on-tile check samples only the resting view; also sample a dragged view near the 55° limit. (CEO Review 7)
- ~~HY-11~~ done 2026-09-02 (Origin/Host check, path boundary). Was: `scripts/edit-server.mjs`: require `Origin`/`Host` of 127.0.0.1:8788 on `/__save`; `fileFor` must compare against `ROOT + path.sep`. (CEO Review 8)
- ~~HY-12~~ done 2026-09-02 (`scripts/edit-test.mjs`, `npm run edit-test`, writes PASS/FAIL to TEST-REPORT.md). Was: An editor test in the repo (`scripts/edit-test.mjs`, run by `npm test` only when the editor is up), and red-proofs that leave a trace in TEST-REPORT.md rather than the terminal. (CEO Review 8)
- **HY-13** Label check: sample the other orbit side, an upward tilt, and a phone drag. (CEO Review 8)
- **HY-14** Consider vendoring Geist / Geist Mono like Three.js; today a blocked font falls back to Helvetica. (CEO Review 8)
- **HY-15** Fix the "whatever the angle" comment in `js/scene.js` (placement is safe; the margin clamp was the fault). (CEO Review 8)
- ~~HY-16~~ done 2026-09-02 (submit blocked while editing). Was: In editing mode, intercept the contact form's submit so a stray click on Send does not mail a test through Formspree. (CEO Review 8)
- ~~HY-17~~ done 2026-09-02: hero copy is unselectable/uneditable in the editor because the site passes clicks through it to the graph; the editor now overrides that. (Wyatt)
