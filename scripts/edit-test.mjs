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
  await para.dblclick(); await p.keyboard.press('End'); await p.keyboard.type(' EDIT-TEST-ONE'); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  const eyebrow = p.locator('.study-head .eyebrow');
  await eyebrow.dblclick(); await p.keyboard.press('End'); await p.keyboard.type(' EDIT-TEST-TWO'); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  await p.locator('.nav-links a[href="/studio/"]').click(); await p.waitForTimeout(300);
  check(p.url().endsWith('/work/polycam/'), `link click navigated to ${p.url()}`);
  const now = fs.readFileSync(FILE, 'utf8');
  check(now.includes('EDIT-TEST-ONE'), 'paragraph edit did not reach the source');
  check(now.includes('Polycam &middot; Marketing strategy &middot; 2026 EDIT-TEST-TWO'), 'eyebrow edit did not keep the file\'s entity spelling');

  await p.goto(BASE + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  const r = await p.locator('.hero-text h1').boundingBox();
  await p.mouse.move(r.x + 5, r.y + r.height / 2); await p.mouse.down(); await p.mouse.move(r.x + 200, r.y + r.height / 2, { steps: 8 }); await p.mouse.up();
  check((await p.evaluate(() => window.getSelection().toString())).length > 0, 'home headline cannot be drag-selected in the editor');
  check((await p.evaluate(([x, y]) => document.elementFromPoint(x, y)?.tagName, [r.x + 20, r.y + 20])) === 'H1', 'home headline is not under the pointer in the editor');

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

const report = [`## Editor pass — ${new Date().toISOString()}`, errors.length ? errors.map((e) => `- FAIL ${e}`).join('\n') : '- PASS edits reach the source with entity spelling kept, links do not navigate, hero headline selectable, Send blocked while editing, foreign/wrong-port Origin refused', ''].join('\n');
fs.appendFileSync(path.join(ROOT, '.claude/TEST-REPORT.md'), '\n' + report);
console.log(report);
process.exit(errors.length ? 1 : 0);
