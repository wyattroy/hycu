# Editing hycudesign.com

Everything on the site is plain HTML you can open in VS Code. There is no build step: what is on
`main` is what is live, a minute after you push.

## Where the words live

| What you want to change | File |
|---|---|
| Home headline, the six work cards, capabilities, Index, hypercube paragraph, contact strip | `index.html` |
| A case study | `work/<name>/index.html` (spatial-equity, oral-care-research, polycam, forgiveness, pastry-pirates, claude-kit) |
| Studio page (hypercube story, how we work, what we do and don't, founder line) | `studio/index.html` |
| Contact page copy and form labels | `contact/index.html` |
| The names on the graph tiles, and where each tile sits | `data/projects.json` (`client`, `name`, `headline`, `axes` from 0 to 1) |
| The footer line | at the bottom of every page (search for "a design studio for products") |
| Formspree and Calendly | the two constants at the top of `js/site.js` |
| Colours, type sizes, spacing | `style.css` (tokens at the top) |

Each study page has the same five parts, in order: the eyebrow (client · capability · year), the
headline, the lede, four "beats" (Starting point / What we found / Where we went / What changed or
What's next), and the rail on the right (`<ul class="rail">`).

## See it while you edit

```bash
cd ~/Documents/Projects/hycu && python3 -m http.server 8000
```

Then open http://localhost:8000 and refresh after each save. (VS Code's Live Server extension
does the same thing with auto-refresh.)

## Two rules the site enforces

Before publishing, run:

```bash
node scripts/check.mjs
```

It fails, and says why, if any page contains the oral-care client's name or the word "floss", or
if site copy uses "I", "I'm", "my". Fix the line it points at and run it again.

## Publish

```bash
git add -A && git commit -m "Copy edits" && git push
```

GitHub Pages rebuilds in about a minute. `www.hycudesign.com` and `hycudesign.com` both serve it.
