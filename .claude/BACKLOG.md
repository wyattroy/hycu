# hycu backlog

Item ids are `HY-<n>`. Each needs a reviewed commit to ship.

- ~~HY-1~~ done 2026-09-02 (pointer-events none on desktop only).
- **HY-1 (was)** `.hero-copy { pointer-events: none }` should apply on desktop only; on the phone the copy sits below the graph and the rule only blocks text selection. (CEO Review 4)
- ~~HY-2~~ done 2026-09-02 (browser pass fails if the brand's left edge is under 24px).
- **HY-2 (was)** Browser pass: also fail if the nav brand's left edge is under 24px, so the gutter test measures amount as well as alignment. (CEO Review 4)
- **HY-3** Test a 820px-wide viewport: between 720 and 900px the headline overlays a graph that is not shifted right. (CEO Review 4)
- **HY-4** `--edge` uses `100vw`, which includes the scrollbar on Windows; consider `100%` of a wrapper instead. (CEO Review 4)
- ~~HY-5~~ Formspree wired 2026-09-02 (maeyjowq). Calendly removed by ruling the same day.
- **HY-6** Enable HTTPS enforcement once GitHub issues the certificate (background poll running 2026-09-02).
- **HY-7** Vendor Three.js r160 into `vendor/` instead of loading from jsdelivr: Wyatt's uBlock blanked the graph on 2026-09-02; any visitor with that list sees an empty hero. (session)
- **HY-8** `contact/index.html`: remove the dead `aria-labelledby="write-title"`; drop `novalidate` or add JS validation so `required` means something. (CEO Review 7)
- **HY-9** EDITING.md:16 and `.claude/CTO-QUESTIONS.md` still mention Calendly. (CEO Review 7)
- **HY-10** Label-on-tile check samples only the resting view; also sample a dragged view near the 55° limit. (CEO Review 7)
