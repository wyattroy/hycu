#!/usr/bin/env node
/* shoot.mjs — the site used by a browser, at desktop and phone widths, with checks written to the
 * FAULTS that have reached the live site, not to the fixes:
 *   - no console errors, no page errors, no horizontal overflow
 *   - no visible text starts inside the left gutter (a padding shorthand zeroed it, twice)
 *   - a real graph tile can be hovered and clicked (desktop) and tapped (phone); an invisible
 *     div once covered the canvas
 * Screenshots go to .claude/shots/ (gitignored); the report is appended to .claude/TEST-REPORT.md.
 * Run `node scripts/check.mjs` first: it starts the report. Needs a local server on :8787
 * (`python3 -m http.server 8787`). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const OUT = path.join(ROOT, '.claude/shots');
const BASE = process.env.BASE || 'http://127.0.0.1:8787';
const PAGES = ['/', '/studio/', '/contact/', '/work/spatial-equity/', '/work/oral-care-research/', '/work/polycam/', '/work/forgiveness/', '/work/pastry-pirates/', '/work/claude-kit/'];

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/Users/wyattroy/Documents/Projects/wyattroy-portfolio/node_modules/playwright/index.mjs')); }

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const ran = { pages: 0, gutter: 0, graph: 0, headline: 0, labels: 0 };

for (const [label, vp, touch] of [['desktop', { width: 1440, height: 900 }, false], ['phone', { width: 390, height: 844 }, true]]) {
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
        const lines = h1.innerText.split('\n').map((l) => l.trim()).filter(Boolean);
        const tops = new Set(); const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT); let n;
        while ((n = walker.nextNode())) { const r = document.createRange(); r.selectNodeContents(n); for (const rect of r.getClientRects()) if (rect.width) tops.add(Math.round(rect.top)); }
        const purple = [...h1.querySelectorAll('.hl')].map((e) => e.textContent);
        return { firstLine: lines[0], lines: lines.length, renderedLines: tops.size, purple };
      });
      if (h.firstLine !== 'We see where you are,' || h.lines !== 3 || h.renderedLines !== 3) errors.push(`${label} home: headline breaks wrong: ${JSON.stringify(h)}`);
      ran.headline++;
      if (h.purple.join(' ') !== 'see design') errors.push(`${label} home: purple words are ${JSON.stringify(h.purple)}, expected see + design`);
    }

    // Axis labels must not sit on a tile. Sampled three times over a second, because the graph
    // drifts on its own; any overlap at any sample fails. (MAKE once sat on the forgiveness tile.)
    if (p === '/') {
      for (let i = 0; i < 3; i++) {
        const hits = await page.evaluate(() => {
          const rects = window.__graph?.screenRects() || [];
          const out = [];
          for (const id of ['label-understand', 'label-make', 'label-product', 'label-idea']) {
            const el = document.getElementById(id); if (!el || getComputedStyle(el).opacity === '0') continue;
            const l = el.getBoundingClientRect();
            for (const t of rects) if (l.left < t.right && l.right > t.left && l.top < t.bottom && l.bottom > t.top) out.push(`${id} on ${t.id}`);
          }
          return out;
        });
        ran.labels++;
        if (hits.length) { errors.push(`${label} home: axis label on a tile: ${hits.join(', ')}`); break; }
        await page.waitForTimeout(400);
      }
      // ...and once more after dragging the view hard to one side, near the orbit limit.
      if (!touch) {
        const c = await page.evaluate(() => { const r = document.getElementById('graph-canvas').getBoundingClientRect(); return { x: r.left + r.width * 0.7, y: r.top + r.height * 0.5 }; });
        await page.mouse.move(c.x, c.y); await page.mouse.down(); await page.mouse.move(c.x - 500, c.y + 120, { steps: 12 }); await page.mouse.up();
        await page.waitForTimeout(700);
        const hits = await page.evaluate(() => {
          const rects = window.__graph?.screenRects() || []; const out = [];
          for (const id of ['label-understand', 'label-make', 'label-product', 'label-idea']) {
            const el = document.getElementById(id); if (!el || getComputedStyle(el).opacity === '0') continue;
            const l = el.getBoundingClientRect();
            for (const t of rects) if (l.left < t.right && l.right > t.left && l.top < t.bottom && l.bottom > t.top) out.push(`${id} on ${t.id}`);
          }
          return out;
        });
        ran.labels++;
        if (hits.length) errors.push(`${label} home (dragged): axis label on a tile: ${hits.join(', ')}`);
        await page.click('#zoom-reset'); await page.waitForTimeout(600);
      }
    }

    // Graph: a real selected tile, whichever is nearest the headline, must be under the canvas,
    // give a pointer cursor (desktop), and open its study when clicked or tapped.
    if (p === '/') {
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
  `Pages: ${ran.pages} (desktop + phone) · gutter checks: ${ran.gutter} (alignment and amount) · headline checks: ${ran.headline} · label-on-tile samples: ${ran.labels} · graph click/tap checks: ${ran.graph}`,
  errors.length ? errors.map((e) => `- FAIL ${e}`).join('\n') : '- PASS no console errors, no overflow, gutter present and respected on every page, ground gradient spans every page, headline reads as words on both viewports and breaks after "are," on desktop, no axis label on a tile, graph tile opens its study on click and on tap',
  '',
].join('\n');
fs.appendFileSync(path.join(ROOT, '.claude/TEST-REPORT.md'), '\n' + report);
console.log(report);
process.exit(errors.length ? 1 : 0);
