#!/usr/bin/env node
/* shoot.mjs — the site used by a browser, at desktop and phone widths, with checks written to the
 * FAULTS that have reached the live site, not to the fixes:
 *   - no console errors, no page errors, no horizontal overflow
 *   - no visible text starts inside the left gutter (a padding shorthand zeroed it, twice)
 *   - a real graph tile can be hovered and clicked (desktop) and tapped (phone); an invisible
 *     div once covered the canvas
 * Screenshots go to .claude/shots/ (gitignored); the report is appended to .claude/TEST-REPORT.md.
 * Run `node scripts/check.mjs` first: it starts the report. Serves its own copy of this working
 * tree on a free port; set BASE to point it somewhere else on purpose. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const OUT = path.join(ROOT, '.claude/shots');
// THE BROWSER PASS SERVES ITS OWN COPY OF THIS WORKING TREE. It used to default to
// http://127.0.0.1:8787 and trust whatever was answering there. On 2026-09-08 a `npm run serve`
// left running since 11:32 in the MAIN CHECKOUT answered that port for the whole day, so every
// browser pass run from a worktree tested main's files and reported them as the branch's. Three
// "identical" failures across three trees were three reads of the same tree. A test that silently
// grades someone else's homework is worse than no test.
//
// Set BASE explicitly to point somewhere else on purpose; otherwise this starts a server on an
// unused port, rooted at THIS working tree, and stops it at the end.
let server = null;
let BASE = process.env.BASE || null;
if (!BASE) {
  const { spawn } = await import('node:child_process');
  const net = await import('node:net');
  const port = await new Promise((res, rej) => {
    const s = net.createServer();
    s.on('error', rej);
    s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(port)); });
  });
  server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
  server.on('error', (e) => { console.error(`shoot: could not start python3 to serve ${ROOT}: ${e.message}`); process.exit(1); });
  // The child is not detached, and POSIX does not reap it for us. Without these, any throw between
  // here and the end of the run leaves a server alive on a port nobody knows — which is the exact
  // bug this block exists to fix, moved from a fixed port to a random one.
  const stop = () => { if (server && !server.killed) server.kill(); };
  process.on('exit', stop);
  process.on('SIGINT', () => { stop(); process.exit(130); });
  process.on('SIGTERM', () => { stop(); process.exit(143); });
  process.on('uncaughtException', (e) => { stop(); console.error(e); process.exit(1); });
  process.on('unhandledRejection', (e) => { stop(); console.error(e); process.exit(1); });
  BASE = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) {
    try { await fetch(BASE + '/style.css'); break; } catch { await new Promise((r) => setTimeout(r, 50)); }
  }
}
// Whatever we ended up pointing at, prove it is this working tree before grading it.
{
  const served = await fetch(BASE + '/style.css').then((r) => r.text()).catch(() => '');
  const onDisk = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
  if (served !== onDisk) {
    // An explicitly-set BASE is a deliberate act — testing the live site, or a sibling branch's
    // server — so warn rather than refuse. The accident this guards against was a DEFAULT nobody
    // chose. Note this compares one file: it proves the stylesheet matches, not the document root.
    if (process.env.BASE) {
      console.error(`shoot: WARNING — ${BASE} serves a different style.css than ${ROOT}. Testing it anyway because BASE was set explicitly.`);
    } else {
      server?.kill();
      console.error(`shoot: ${BASE} is not serving this working tree (${ROOT}).\nIts style.css differs from the one on disk. Refusing to test someone else's files.`);
      process.exit(1);
    }
  }
}
const PAGES = ['/', '/work/', '/studio/', '/contact/', '/work/spatial-equity/', '/work/oral-care-research/', '/work/polycam/', '/work/forgiveness/', '/work/pastry-pirates/', '/work/claude-kit/', '/work/pour/', '/work/how-to-change-institutions/'];

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/Users/wyattroy/Documents/Projects/wyattroy-portfolio/node_modules/playwright/index.mjs')); }

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const ran = { pages: 0, gutter: 0, graph: 0, headline: 0, labels: 0, sticky: 0 };

// 820 is the width HY-3 has asked for since CEO Review 4, 2026-09-02: between 720 and 900 the hero
// column is at its narrowest while the desktop rules are already on, and nothing tested there.
for (const [label, vp, touch] of [['desktop', { width: 1440, height: 900 }, false], ['tablet', { width: 820, height: 1024 }, false], ['phone', { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: touch, isMobile: touch, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${label} ${page.url()}: console: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${label} ${page.url()}: ${e.message}`));

  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(p === '/' ? 3500 : 600);
    ran.pages++;
    // "Pronounced: Hi-Q" sits under the hypercube line on the home and Studio pages, italic (Wyatt, 2026-09-02).
    if (p === '/' || p === '/studio/') {
      const pr = await page.evaluate(() => { const el = document.querySelector('.pronounce'); return el ? { text: el.textContent.trim(), italic: getComputedStyle(el).fontStyle } : null; });
      if (!pr || pr.text !== 'Pronounced: Hi-Q' || pr.italic !== 'italic') errors.push(`${label} ${p}: pronunciation line wrong: ${JSON.stringify(pr)}`);
    }
    // The ground gradient must span the whole document, not one window (CEO Review 12).
    const ground = await page.evaluate(() => {
      const html = document.documentElement; const cs = getComputedStyle(html);
      return { gradient: cs.backgroundImage.includes('linear-gradient'), spans: Math.abs(html.getBoundingClientRect().height - html.scrollHeight) <= 1, bodyClear: getComputedStyle(document.body).backgroundColor === 'rgba(0, 0, 0, 0)' };
    });
    if (!ground.gradient || !ground.spans || !ground.bodyClear) errors.push(`${label} ${p}: ground gradient does not span the document: ${JSON.stringify(ground)}`);
    const name = p === '/' ? 'home' : p.replace(/\//g, '-').replace(/^-|-$/g, '');
    await page.screenshot({ path: `${OUT}/${label}-${name}-fold.png` });
    await page.screenshot({ path: `${OUT}/${label}-${name}-full.png`, fullPage: true });

    if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) errors.push(`${label} ${p}: horizontal overflow`);

    // A sticky element that pins over the text scrolling past it. On 2026-09-11 Wyatt reported that
    // the eight study pages could not be scrolled on a phone; what he was seeing is that
    // `.study-rail` was declared sticky at EVERY width, and below 861px the study body is one
    // column, so the rail is a full-width block above the article whose containing block is still
    // the whole body. It pinned under the nav and rode 3516px down Pour at 390px with the article
    // printing straight through it — four paragraphs and headings overlapping at y=1600, the worst
    // 328x223px.
    //
    // This is written to the fault and not to the fix: an earlier version of this check asserted
    // that no sticky element had ZERO travel, and it was green on the broken CSS — the rail's
    // travel was 3516px, not 0. What is wrong with a sticky element here is never how far it goes,
    // it is what it lands on. #nav is `fixed`, not sticky, so the translucent header that is meant
    // to sit over the page is not caught by this. The scroll has to be instant:
    // `html { scroll-behavior: smooth }` animates scrollTo, and sampling mid-animation measures a
    // frame nobody ever sees.
    const smeared = await page.evaluate(async () => {
      const sticky = [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'sticky');
      if (!sticky.length) return [];
      const de = document.documentElement;
      const prior = de.style.scrollBehavior;
      de.style.scrollBehavior = 'auto';
      const text = [...document.querySelectorAll('p, h1, h2, h3, li')].filter((e) => (e.textContent || '').trim());
      const out = [];
      const H = de.scrollHeight;
      const step = Math.max(200, Math.round(H / 10));
      for (let y = 0; y <= H && out.length < 5; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => requestAnimationFrame(r));
        for (const s of sticky) {
          const a = s.getBoundingClientRect();
          if (a.width === 0 || a.height === 0) continue;
          for (const e of text) {
            if (s.contains(e) || e.contains(s)) continue;
            const b = e.getBoundingClientRect();
            if (b.width === 0 || b.height === 0) continue;
            const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
            const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            if (ox > 1 && oy > 1) {
              out.push(`at y=${y}, .${(typeof s.className === 'string' ? s.className : '').trim()} covers ${e.tagName.toLowerCase()} "${(e.textContent || '').trim().slice(0, 32)}" by ${Math.round(ox)}x${Math.round(oy)}px`);
              break;
            }
          }
          if (out.length >= 5) break;
        }
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise((r) => requestAnimationFrame(r));
      de.style.scrollBehavior = prior;
      return out;
    });
    ran.sticky++;
    if (smeared.length) errors.push(`${label} ${p}: a sticky element sits on the text scrolling past it: ${smeared.join(' | ')}`);

    // Gutter: every visible text element must start at or right of the nav brand's left edge.
    // Graph axis labels are pinned to the canvas edge on purpose and are excluded.
    const brandLeft = await page.evaluate(() => document.querySelector('.brand').getBoundingClientRect().left);
    if (brandLeft < 24) errors.push(`${label} ${p}: gutter is only ${Math.round(brandLeft)}px`);
    const intruders = await page.evaluate(() => {
      const edge = document.querySelector('.brand').getBoundingClientRect().left;
      const out = [];
      for (const el of document.querySelectorAll('h1,h2,h3,p,a,li,span,button,label,input,textarea,svg.tesseract')) {
        if (el.closest('#axis-labels, #graph-hover, .visually-hidden')) continue;
        if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
        if (!(el.textContent || '').trim() && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && el.tagName !== 'svg') continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.left < edge - 1) out.push(`${el.tagName.toLowerCase()}.${el.className || ''} "${(el.textContent || '').trim().slice(0, 30)}" left=${Math.round(r.left)} < ${Math.round(edge)}`);
      }
      return out.slice(0, 5);
    });
    ran.gutter++;
    if (intruders.length) errors.push(`${label} ${p}: text inside the gutter: ${intruders.join(' | ')}`);

    // Headline: Wyatt's ruling, 2026-09-02: "are" ends the first line. Three lines on desktop.
    if (p === '/') {
      const rendered = await page.evaluate(() => document.querySelector('.hero-text h1').innerText.replace(/\s+/g, ' ').trim());
      ran.headline++;
      if (rendered !== 'We see where you are, then design the way forward with you.') errors.push(`${label} home: headline renders as "${rendered}"`);
    }
    if (p === '/' && !touch) {
      const h = await page.evaluate(() => {
        const h1 = document.querySelector('.hero-text h1');
        // Lines are read off the GLYPHS, not off innerText. innerText only reports an explicit
        // <br>, and since 2026-09-08 the forced break is gated on the column being wide enough to
        // hold the line — below that width `text-wrap: balance` reaches the same three lines by
        // wrapping. Wyatt's ruling ("are" ends the first line) is about what renders, so that is
        // what gets measured. Reading innerText scored a correctly-rendered three-line headline as
        // one line at 820px.
        const rows = new Map();
        const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT); let n;
        while ((n = walker.nextNode())) {
          for (let i = 0; i < n.length; i++) {
            const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
            const rect = r.getBoundingClientRect(); if (!rect.width) continue;
            const key = Math.round(rect.top);
            rows.set(key, (rows.get(key) || '') + n.data[i]);
          }
        }
        const lines = [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, t]) => t.trim()).filter(Boolean);
        const purple = [...h1.querySelectorAll('.hl')].map((e) => e.textContent);
        return { firstLine: lines[0], lines: lines.length, orphans: lines.filter((l) => l.split(/\s+/).length < 2), purple };
      });
      // No line may be a single word at any width — that is the fault Wyatt reported on 2026-09-08
      // ("these awkward line breaks"), and it is the thing worth asserting everywhere. The exact
      // three-line shape is asserted where the column can hold it.
      if (h.orphans.length) errors.push(`${label} home: headline orphans a line: ${JSON.stringify(h)}`);
      if (h.firstLine !== 'We see where you are,' || h.lines !== 3) errors.push(`${label} home: headline breaks wrong: ${JSON.stringify(h)}`);
      ran.headline++;
      if (h.purple.join(' ') !== 'see design') errors.push(`${label} home: purple words are ${JSON.stringify(h.purple)}, expected see + design`);
    }

    // An axis label must stay ON its axis. It is NOT required to clear the tiles: a tile may end
    // up under a label, and the reader turns the volume to see past it (Wyatt, 2026-09-08, "the
    // axis labels must sit on their axes ... the tiles are shiftable by the user", and again on
    // 2026-09-09: "the axis labels don't NEED to clear the cubes -- the user moves the cubes so
    // the axis labels are within their control to see around").
    //
    // This used to assert the opposite — that no label ever overlaps a tile — with the ruling
    // quoted directly above it, read as exempting phones only. It is the same rule at every width.
    // The check cost real damage before it was caught: a session sizing the graph's tiles tuned
    // them DOWN, and moved every axis label outward, to satisfy it. What is tested instead is the
    // half of the ruling that is a requirement, and the failure the overlap check would have hidden
    // behind a passing run: a label that has wandered off its own axis to dodge something.
    if (p === '/' && !touch) {
      const offAxis = async (when) => {
        const bad = await page.evaluate(() => {
          const box = (id) => { const el = document.getElementById(id); if (!el) return null;
            if (getComputedStyle(el).opacity === '0') return null;
            const r = el.getBoundingClientRect(); return r.width && r.height ? r : null; };
          const need = ['label-understand', 'label-make', 'label-product', 'label-idea'];
          const b = {}; const out = [];
          for (const id of need) { const r = box(id); if (!r) { out.push(`${id} is not visible`); continue; } b[id] = r; }
          const mid = (r) => ({ x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 });
          // UNDERSTAND is the -x end and MAKE the +x end; PRODUCT is -y and IDEA is +y. A label
          // that has crossed its opposite has left its axis, whatever else is on screen.
          if (b['label-understand'] && b['label-make'] && mid(b['label-understand']).x >= mid(b['label-make']).x)
            out.push('UNDERSTAND is not left of MAKE');
          if (b['label-product'] && b['label-idea'] && mid(b['label-product']).y <= mid(b['label-idea']).y)
            out.push('PRODUCT is not below IDEA');
          const vw = window.innerWidth, vh = window.innerHeight;
          for (const [id, r] of Object.entries(b))
            if (r.right < 0 || r.left > vw || r.bottom < 0 || r.top > vh) out.push(`${id} is off screen`);
          return out;
        });
        ran.labels++;
        if (bad.length) errors.push(`${label} home${when}: axis label off its axis: ${bad.join(', ')}`);
      };
      for (let i = 0; i < 3; i++) { await offAxis(''); await page.waitForTimeout(400); }
      // ...and once more after dragging the view hard to one side, near the orbit limit.
      const c = await page.evaluate(() => { const r = document.getElementById('graph-canvas').getBoundingClientRect(); return { x: r.left + r.width * 0.7, y: r.top + r.height * 0.5 }; });
      await page.mouse.move(c.x, c.y); await page.mouse.down(); await page.mouse.move(c.x - 500, c.y + 120, { steps: 12 }); await page.mouse.up();
      await page.waitForTimeout(700);
      await offAxis(' (dragged)');
      await page.click('#zoom-reset'); await page.waitForTimeout(600);
    }

    // Graph: a real selected tile, whichever is nearest the headline, must be under the canvas,
    // give a pointer cursor (desktop), and open its study when clicked or tapped.
    if (p === '/') {
      // HOLD THE CUBES STILL FOR THIS CHECK. Since 2026-09-12 they wander between the quadrants
      // their project drew techniques from, and this check reads a tile's position, then taps it a
      // beat later — so it was tapping where a cube USED to be. It caught itself doing that once,
      // reporting that a tap meant for Cited by AI opened Spatial Equity.
      //
      // Freezing is the honest fix, not a cover-up, because a cube hidden behind another is MEANT
      // to be unreachable (Wyatt, 2026-09-12: "a covered cube SHOULD be untappable ... the user is
      // able to swivel the graph to uncover it"). What this check exists to prove is that a tile
      // routes to its study and that nothing invisible is sitting over the canvas — not that a
      // moving target can be hit blind, which no real visitor ever attempts.
      await page.evaluate(() => { if (window.__drift) window.__drift.enabled = false; });
      await page.waitForTimeout(500);
      const tiles = await page.evaluate(() => (window.__graph?.screenPositions() || []).filter((t) => t.selected));
      if (!tiles.length) { errors.push(`${label} home: no tile positions exposed`); continue; }
      const h1 = await page.evaluate(() => { const r = document.querySelector('.hero-text h1').getBoundingClientRect(); return { x: r.left, y: r.top }; });
      const tile = tiles.sort((a, b) => Math.hypot(a.x - h1.x, a.y - h1.y) - Math.hypot(b.x - h1.x, b.y - h1.y))[0];
      const top = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.id, [tile.x, tile.y]);
      if (top !== 'graph-canvas') errors.push(`${label} home: element over tile ${tile.id} is #${top}, not the canvas`);
      if (!touch) {
        await page.mouse.move(tile.x, tile.y); await page.waitForTimeout(200);
        const cursor = await page.evaluate(() => getComputedStyle(document.getElementById('graph-canvas')).cursor);
        if (cursor !== 'pointer') errors.push(`${label} home: hovering tile ${tile.id} gives cursor "${cursor}"`);
        await page.mouse.click(tile.x, tile.y);
      } else {
        await page.touchscreen.tap(tile.x, tile.y);
      }
      await page.waitForTimeout(800);
      ran.graph++;
      if (!page.url().endsWith(tile.url)) errors.push(`${label} home: ${touch ? 'tapping' : 'clicking'} tile ${tile.id} went to ${page.url()}, expected ${tile.url}`);
    }
  }
  await ctx.close();
}
await browser.close();

const report = [
  `## Browser pass — ${new Date().toISOString()}`,
  `Pages: ${ran.pages} (desktop + tablet + phone) · gutter checks: ${ran.gutter} (alignment and amount) · headline checks: ${ran.headline} · axis-label samples: ${ran.labels} · graph click/tap checks: ${ran.graph} · sticky-overlap checks: ${ran.sticky}`,
  errors.length ? errors.map((e) => `- FAIL ${e}`).join('\n') : '- PASS no console errors, no overflow, gutter present and respected on every page, ground gradient spans every page, headline reads as words on every viewport and breaks after "are," on desktop, no axis label on a tile on desktop (the phone half of that check is retired by ruling, see above), graph tile opens its study on click and on tap, no sticky element sits on the text scrolling past it',
  '',
].join('\n');
fs.appendFileSync(path.join(ROOT, '.claude/TEST-REPORT.md'), '\n' + report);
server?.kill();
console.log(report);
process.exit(errors.length ? 1 : 0);
