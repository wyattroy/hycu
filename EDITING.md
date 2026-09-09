# Editing hycudesign.com

Everything on the site is plain HTML you can open in VS Code. There is no build step: what is on
`main` is what is live, a minute after you push.

## Where the words live

| What you want to change | File |
|---|---|
| Home headline, capabilities, hypercube paragraph, contact strip | `index.html` |
| The work cards (one per study) | `work/index.html` |
| A case study | `work/<name>/index.html` (spatial-equity, oral-care-research, polycam, forgiveness, pastry-pirates, claude-kit) |
| Studio page (hypercube story, how we work, what we do and don't, founder line) | `studio/index.html` |
| Contact page copy and form labels | `contact/index.html` |
| The names on the graph tiles, and where each tile sits | `data/projects.json` (`client`, `name`, `headline`, `axes` from 0 to 1) |
| The footer line | at the bottom of every page (search for "a design studio for products") |
| The Formspree endpoint | the constant at the top of `js/site.js` |
| Colours, type sizes, spacing | `style.css` (tokens at the top) |

Each study page has the same five parts, in order: the eyebrow (client · capability · year), the
headline, the lede, four "beats" (Starting point / What we found / Where we went / What changed or
What's next), and the rail on the right (`<ul class="rail">`).

## Edit the words in the browser

```bash
cd ~/Documents/Projects/hycu && npm run edit
```

Then open http://127.0.0.1:8788. Double-click any piece of text, change it, press Enter (or click
away). It is written straight into the source file, and the bar at the top says which one. Esc
cancels. Links don't navigate while editing; ⌘-click one to follow it. If an edit can't be
located uniquely in the file, it goes in a list and a "Copy all changes" button appears; paste
that to Claude.

When you're done, `git diff` shows every change, or just say "I edited copy" in a Claude session
and it will review, test, and push.

## See it while you edit

```bash
cd ~/Documents/Projects/hycu && python3 -m http.server 8000
```

Then open http://localhost:8000 and refresh after each save. (VS Code's Live Server extension
does the same thing with auto-refresh.)

## Two rules the site enforces

Before publishing, run:

```bash
npm run check
```

It fails, and says why, if any file contains the oral-care client's brand name or its product
category (the list is `scripts/scrub.json`), or if site copy slips into first-person singular.
Fix the line it points at and run it again.

(`npm test` also opens the site in a headless browser at desktop and phone widths and checks
layout and the graph; it needs `npm run serve` running in another terminal and Playwright
installed. Copy edits don't need it.)

## Publish

Your edits go through the same gate as everything else. Wyatt, 2026-09-03: *"i want my edits to be
verified first; i may have typos/errors in them."* Two reasons. `npm run check` catches the scrub
list and first-person singular but it cannot catch a typo, and the site now says in its own words
that every push clears an officer's review first — so it has to be true of your pushes too.

Leave the edits uncommitted and hand them to a session:

> Review my copy edits in the working tree and push them.

The session reads the diff, runs `npm run check`, commits your edits on their own, and takes them
through the review gate. Nothing of yours gets swept into a session's commit; nothing of theirs
into yours.

There is no push gate any more — it was deleted on 2026-09-09 and replaced by GitHub running
`npm test` on every pull request. `git push` from this checkout has never been blocked and still is
not. What checks your edits is the same as what checks everyone's: run `npm run check` before you
push, or open a pull request and let the robot run it for you.

GitHub Pages rebuilds in about a minute. `www.hycudesign.com` and `hycudesign.com` both serve it.
