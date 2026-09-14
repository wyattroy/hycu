#!/usr/bin/env node
/* edit-test.mjs — proves the inline editor (scripts/edit-server.mjs) against a running instance
 * on 127.0.0.1:8788, and restores every file it touches. Appends to .claude/TEST-REPORT.md.
 *   npm run edit   (in one terminal)      node scripts/edit-test.mjs   (in another)
 * Checks: a paragraph edit and an entity-bearing eyebrow edit land in the source with the file's
 * own entity spelling; a link click does not navigate; the home headline (which the site makes
 * click-through) is selectable and editable; Send never reaches Formspree while editing; a save
 * request with a foreign or wrong-port Origin is refused. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const BASE = process.env.EDIT_BASE || 'http://127.0.0.1:8788';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/Users/wyattroy/Documents/Projects/wyattroy-portfolio/node_modules/playwright/index.mjs')); }

const errors = [];
const check = (ok, msg) => { if (!ok) errors.push(msg); };
// Double-click selects a word and End only reaches the end of a visual line: place the caret at
// the very end of the element before typing.
async function typeAtEnd(page, locator, text) {
  await locator.dblclick();
  await locator.evaluate((el) => { const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); });
  await page.keyboard.type(text); await page.keyboard.press('Enter'); await page.waitForTimeout(400);
}
const FILE = path.join(ROOT, 'work/polycam/index.html');
const original = fs.readFileSync(FILE, 'utf8');

const b = await chromium.launch();
try {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  let formspree = 0;
  await p.route('**/formspree.io/**', (route) => { formspree++; route.fulfill({ status: 200, body: '{}' }); });

  await p.goto(BASE + '/work/polycam/', { waitUntil: 'networkidle' });
  check((await p.locator('.edit-bar').count()) === 1, 'editor bar not injected');
  const para = p.locator('.beat p:not(.eyebrow)').first();
  await typeAtEnd(p, para, ' EDIT-TEST-ONE');
  // Edit it again while the green saved flash is still on it: the flash is not in the file, so it
  // must not be part of what the editor looks for there (every re-edit used to fail this way).
  await typeAtEnd(p, para, ' EDIT-TEST-AGAIN');
  const eyebrow = p.locator('.study-head .eyebrow');
  const eyebrowSource = original.match(/<p class="eyebrow">(Polycam [^<]*)<\/p>/)[1];
  await typeAtEnd(p, eyebrow, ' EDIT-TEST-TWO');
  await p.locator('.nav-links a[href="/studio/"]').click(); await p.waitForTimeout(300);
  check(p.url().endsWith('/work/polycam/'), `link click navigated to ${p.url()}`);
  const now = fs.readFileSync(FILE, 'utf8');
  check(now.includes('EDIT-TEST-ONE EDIT-TEST-AGAIN'), 'a second edit to the same paragraph did not reach the source');
  check(now.includes(eyebrowSource + ' EDIT-TEST-TWO') && eyebrowSource.includes('&middot;'), 'eyebrow edit did not keep the file\'s entity spelling');

  // Double-click keeps the word it selected, and a drag that starts on selected text makes a new
  // selection instead of picking the text up to move it (Wyatt, 2026-09-14: "drag-to-select within
  // the box is buggy").
  await p.goto(BASE + '/work/polycam/', { waitUntil: 'networkidle' });
  const para2 = p.locator('.beat p:not(.eyebrow)').nth(1);
  await para2.scrollIntoViewIfNeeded();
  const text2 = await para2.textContent();
  // Points taken from the text itself (the middle of its first line, and the middle of a word), so
  // padding, line height and scrolling cannot put the pointer between lines.
  const line = await para2.evaluate((el) => { const r = document.createRange(); r.selectNodeContents(el); const q = r.getClientRects()[0]; return { x: q.x, y: q.y + q.height / 2, w: q.width }; });
  const wordAt = await para2.evaluate((el) => { const w = el.firstChild; const i = w.textContent.indexOf(' ', 20) + 1; const r = document.createRange(); r.setStart(w, i); r.setEnd(w, i + 2); const q = r.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; });
  await p.mouse.dblclick(wordAt.x, wordAt.y);
  const word = (await p.evaluate(() => getSelection().toString())).trim();
  check(word.length > 0 && !/\s/.test(word), `double-click selected "${word}", expected one word`);
  const y2 = line.y, xa = line.x + line.w * 0.2, xb = line.x + line.w * 0.6;
  await p.waitForTimeout(600); // past the double-click interval, so the next press is a fresh one
  await p.mouse.move(xa, y2); await p.mouse.down(); await p.mouse.move(xb, y2, { steps: 12 }); await p.mouse.up();
  const first = await p.evaluate(() => getSelection().toString());
  await p.waitForTimeout(600);
  await p.mouse.move((xa + xb) / 2, y2); await p.mouse.down(); await p.mouse.move(line.x + line.w * 0.9, y2, { steps: 12 }); await p.mouse.up();
  const second = await p.evaluate(() => getSelection().toString());
  check(first.length > 3 && second.length > 3 && second !== first, `a drag starting on selected text did not make a new selection ("${first}", then "${second}")`);
  check((await para2.textContent()) === text2, 'dragging inside the edited paragraph changed its text');
  await p.keyboard.press('Escape');

  // Shift+Enter splits a paragraph into two <p>s in the file, the new one on its own line.
  const para3 = p.locator('.beat p:not(.eyebrow)').nth(1);
  await para3.dblclick();
  await para3.evaluate((el) => { const w = el.firstChild; const r = document.createRange(); r.setStart(w, w.textContent.indexOf('. ') + 2); r.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
  await p.keyboard.press('Shift+Enter'); await p.keyboard.type('SPLIT-TEST '); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  check(/\.<\/p>\n {8}<p>SPLIT-TEST /.test(fs.readFileSync(FILE, 'utf8')), 'Shift+Enter did not split the paragraph into two in the source');
  check((await p.locator('.beat p', { hasText: 'SPLIT-TEST' }).count()) === 1, 'the page does not show the split paragraph as its own element');

  // Pasting styled text keeps the words and drops the styling.
  const para4 = p.locator('.beat h2.h-md').nth(1);
  await para4.dblclick();
  await para4.evaluate((el) => {
    const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    const dt = new DataTransfer(); dt.setData('text/html', '<span style="font-size: 18px; font-weight: 400;"> PASTE-TEST</span>'); dt.setData('text/plain', ' PASTE-TEST');
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  });
  await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  const pasted = fs.readFileSync(FILE, 'utf8');
  check(/<h2 class="h-md">[^<]*PASTE-TEST<\/h2>/.test(pasted), 'a paste did not land as plain text in the headline');
  check(!pasted.includes('font-size: 18px'), 'a paste carried its inline styling into the source');

  await p.goto(BASE + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  const r = await p.locator('.hero-text h1').boundingBox();
  await p.mouse.move(r.x + 5, r.y + r.height / 2); await p.mouse.down(); await p.mouse.move(r.x + 200, r.y + r.height / 2, { steps: 8 }); await p.mouse.up();
  check((await p.evaluate(() => window.getSelection().toString())).length > 0, 'home headline cannot be drag-selected in the editor');
  check((await p.evaluate(([x, y]) => document.elementFromPoint(x, y)?.tagName, [r.x + 20, r.y + 20])) === 'H1', 'home headline is not under the pointer in the editor');

  // The tagline's text also lives inside the page's meta description (index.html): an edit must
  // change the visible tagline, never the meta tag. And a tag that appears twice must land on the
  // one that was edited. (CEO Review 10 found the substring version rewriting the meta tag.)
  const HOME = path.join(ROOT, 'index.html'); const homeOriginal = fs.readFileSync(HOME, 'utf8');
  try {
    await p.goto(BASE + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
    await typeAtEnd(p, p.locator('.hero-text .lede'), ' TAGLINE-EDIT');
    let home = fs.readFileSync(HOME, 'utf8');
    check(/<p class="lede">[^<]*TAGLINE-EDIT<\/p>/.test(home), 'tagline edit did not land on the visible tagline');
    check(!/<meta[^>]*TAGLINE-EDIT/.test(home), 'tagline edit rewrote the meta description');
  } finally { fs.writeFileSync(HOME, homeOriginal); }

  // A tag that appears several times must land on the one that was edited. The study list, and its
  // repeated capability tags, live on /work/ since 2026-09-02.
  const WORK = path.join(ROOT, 'work/index.html'); const workOriginal = fs.readFileSync(WORK, 'utf8');
  try {
    await p.goto(BASE + '/work/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
    // Locate without touching the element: adding an id would change its markup and its twin count.
    const dupTags = p.locator('.tags span', { hasText: 'User research' });
    const dup = await dupTags.count();
    check(dup >= 2, `expected a duplicated "User research" tag, found ${dup}`);
    await typeAtEnd(p, dupTags.last(), ' DUP-EDIT');
    const work = fs.readFileSync(WORK, 'utf8');
    const hits = work.split('DUP-EDIT').length - 1;
    check(hits === 1, `duplicate edit landed ${hits} time(s), expected 1`);
    check(work.lastIndexOf('<span data-cap="research">User research</span>') < work.indexOf('DUP-EDIT'), 'duplicate edit did not land on the last tag');
  } finally { fs.writeFileSync(WORK, workOriginal); }

  await p.goto(BASE + '/contact/', { waitUntil: 'networkidle' });
  await p.fill('#f-name', 'Test'); await p.fill('#f-email', 'test@example.com'); await p.fill('#f-now', 'testing');
  await p.click('button[type="submit"]'); await p.waitForTimeout(800);
  check(formspree === 0, `${formspree} request(s) reached Formspree while editing`);
} finally {
  fs.writeFileSync(FILE, original);
  await b.close();
}
check(fs.readFileSync(FILE, 'utf8') === original, 'work/polycam/index.html not restored');

for (const origin of ['https://evil.example', 'http://127.0.0.1:8787']) {
  const res = await fetch(BASE + '/__save', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify({ page: '/', before: 'Hycu is a design studio', after: 'x' }) });
  check(res.status === 403, `save with Origin ${origin} answered ${res.status}, expected 403`);
}

const report = [`## Editor pass — ${new Date().toISOString()}`, errors.length ? errors.map((e) => `- FAIL ${e}`).join('\n') : '- PASS edits reach the source with entity spelling kept, a second edit to the same paragraph lands too, double-click keeps its word, a drag on selected text reselects without moving text, Shift+Enter splits a paragraph in the source, links do not navigate, hero headline selectable, tagline edit never touches the meta tag, duplicate tag edit lands once on the edited one, Send blocked while editing, foreign/wrong-port Origin refused', ''].join('\n');
fs.appendFileSync(path.join(ROOT, '.claude/TEST-REPORT.md'), '\n' + report);
console.log(report);
process.exit(errors.length ? 1 : 0);
