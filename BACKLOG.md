# hycu backlog

Everything the site and its tooling still need, in **one list**. A session picks an item up, does
it, and deletes it from here when it ships — git history is the record of what was done, not this
file.

Two sections: what is **waiting on a ruling from Wyatt**, and **engineering leftovers** a session
can simply do. Until 2026-09-12 the engineering half lived in a second file, `.claude/BACKLOG.md`,
under `HY-<n>` numbers; Wyatt asked for one list. Old CEO verdicts in `.claude/reviews/` still cite
those numbers — `git show 03ad0f7:.claude/BACKLOG.md` is the file they point at.

---

## Waiting on a ruling from Wyatt

**The two rails disagree about unnamed clients.** The Pour study's rail says the facility is "not
named"; the oral-care study's says "unnamed by agreement". Both are true, but a reader who opens
both sees two different house styles. Pick one form and both rails take it.

**One sentence on the Studio page.** On 2026-09-03 a session's commit swept up an edit Wyatt had
made by hand at `studio/index.html:69`, replacing a sentence about local speech models with "A team
hierarchy of agents that hold each other accountable." Nothing false shipped, but a specific
checkable claim became a vaguer one without him saying so. He decides whether the original sentence
comes back.

## Engineering leftovers

Nothing here needs Wyatt. Each one says where it is and what would close it.

**The page edge counts the scrollbar on Windows.** `--edge` in `style.css` is computed from `100vw`,
which on Windows includes the scrollbar, so the right-hand gutter is about 15px narrower than the
left there. Use `100%` of a wrapper instead. (CEO Review 4)

**The axis-label check looks at too few views.** `scripts/shoot.mjs` samples the resting view and
one dragged view. Also sample the other side of the orbit, an upward tilt, and a phone drag — and,
since 2026-09-12, the far end of the idle swivel, which is a view nobody drags to. (CEO Review 8)

**The webfonts come from Google.** EB Garamond, Hanken Grotesk and DM Mono load from
`fonts.googleapis.com`; a visitor whose blocker lists it gets fallback faces. Three.js was vendored
into `vendor/` for exactly this reason after uBlock blanked the graph. Consider the same for the
fonts. (CEO Review 8)

**A dead constant in the graph.** `js/scene.js` defines `C.bg` with a comment calling it the 2D
fallback's ground, and nothing reads it. Delete it and the comment. (CEO Review 13)

**Editor: text inside the home Work cards cannot be drag-selected.** The cards are `<a>` elements,
and browsers drag a link rather than select its text. Untested. (CEO Review 9)

**Editor test: three branches nobody exercises.** The refusal when the page and the file disagree
on a count; the meta-tag case against the substring matcher; and the trailing-nbsp strip with the
caret collapse. (CEO Review 11)

**`npm run serve` and EDITING.md disagree about the port.** The script binds 8787 from whatever
directory it is run in, and once outlived its session by eleven hours; `EDITING.md` tells Wyatt to
run `python3 -m http.server 8000` by hand. Make the script print its root, or derive the port from
the working tree so two worktrees cannot collide, and make the two agree. (session, 2026-09-08)

**Voice work has its reference now: `.claude/memory/ETHOS.md`.** On 2026-09-14 Wyatt named his book
and the Pour care manifesto as the site's ethos, replacing the forgiveness-platform proposal (which
was never readable here). When counting demonstrative openers ("That looks like…"), match the tic itself,
not just "That/This + to be": the honest site-wide count is 2, both judged worth keeping —
`work/spatial-equity/index.html:52` and `work/oral-care-research/index.html:52`. (CEO Reviews 25, 26)

### Known non-issue

**`.claude/HANDOFF-GRAPH-CUBES.md` says `npm test` fails at 820px on `main`.** It does not
reproduce — checked twice on 2026-09-09, on GitHub and on a Mac with the real webfonts. The cloud
session that wrote it had `fonts.googleapis.com` blocked and measured a fallback face. Recorded so
the claim is not inherited as fact.

---

## How to add to this file

One heading per item, in plain language, under the section it belongs to. If it needs Wyatt, say
what is wrong, where, what the options cost, and which one you would pick — enough that he can rule
without opening the code. No tracking numbers: describe the thing.
