#!/usr/bin/env node
/* cubes.mjs — measures how much the eight cubes interpenetrate over a long run of the real tour.
 *
 * A cube BEHIND another is fine; a cube INSIDE another is not (DECISIONS.md, 2026-09-12). Screen
 * boxes cannot tell those apart, so this reads worldBoxes() — each cube as a box in world space —
 * and reports, per frame, the deepest pair overlap on the CHEAPEST axis: the fraction you would
 * have to pull them apart along the axis that needs it least. 0.2 means a fifth of a cube inside
 * another from every angle.
 *
 * Usage: node scripts/cubes.mjs [seconds] [speed] [width]   (default 150s, site speed, 1440px)
 * Writes nothing to the repo; prints a report. */
import path from 'node:path';
import fs from 'node:fs';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SECONDS = Number(process.argv[2] || 150);
const SPEED = Number(process.argv[3] || 1);
const WIDTH = Number(process.argv[4] || 1440);   // phone cubes are drawn larger and close faster

const { spawn } = await import('node:child_process');
const net = await import('node:net');
const port = await new Promise((res, rej) => {
  const s = net.createServer();
  s.on('error', rej);
  s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(port)); });
});
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
const stop = () => { if (server && !server.killed) server.kill(); };
process.on('exit', stop);
process.on('SIGINT', () => { stop(); process.exit(130); });
const BASE = `http://127.0.0.1:${port}`;
for (let i = 0; i < 100; i++) {
  try { await fetch(BASE + '/style.css'); break; } catch { await new Promise((r) => setTimeout(r, 50)); }
}
// Prove we are grading THIS tree, the lesson shoot.mjs learned the hard way.
const served = await fetch(BASE + '/js/scene.js').then((r) => r.text()).catch(() => '');
if (served !== fs.readFileSync(path.join(ROOT, 'js/scene.js'), 'utf8')) {
  console.error('cubes: the server is not serving this working tree'); process.exit(1);
}

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/Users/wyattroy/Documents/Projects/wyattroy-portfolio/node_modules/playwright/index.mjs')); }

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: WIDTH <= 480 ? 844 : 900 }, deviceScaleFactor: 1 });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__graph && window.__graph.worldBoxes && window.__graph.worldBoxes().length === 8, null, { timeout: 15000 });
if (SPEED !== 1) await page.evaluate((s) => { window.__drift.speed = s; }, SPEED);
if (process.env.APPROACH) await page.evaluate((v) => { window.__drift.approach = v; }, Number(process.env.APPROACH));
if (process.env.YIELDRATE) await page.evaluate((v) => { window.__drift.yieldRate = v; }, Number(process.env.YIELDRATE));
if (process.env.YIELDEASE) await page.evaluate((v) => { window.__drift.yieldEase = v; }, Number(process.env.YIELDEASE));
// Let the settle-in finish so we measure the tour, not the reveal.
await page.waitForTimeout(4000);

page.setDefaultTimeout(0);
// SAMPLED FROM NODE, not inside one long page.evaluate: a 150-second evaluate is torn down the
// moment anything touches the execution context, and it was ("Execution context was destroyed").
// Ten reads a second over the whole run is plenty to catch an overlap that lasts a crossing.
const worst = [];
const pairs = {};
let deepest = {};
let prev = null, prevT = 0, fastest = 0, fastestWho = '';   // gentleness: nothing may lurch
const t0 = Date.now();
let reads = 0;
while (Date.now() - t0 < SECONDS * 1000) {
  const b = await page.evaluate(() => window.__graph.worldBoxes());
  reads++;
  let frameWorst = 0, who = null;
  for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
    const A = b[i], B = b[j];
    // worldBoxes() gives a centre and half-extents, so overlap is (sum of half-extents) - distance.
    const ox = (A.hw + B.hw) - Math.abs(A.x - B.x);
    const oy = (A.hh + B.hh) - Math.abs(A.y - B.y);
    const oz = (A.hd + B.hd) - Math.abs(A.z - B.z);
    if (ox <= 0 || oy <= 0 || oz <= 0) continue;      // clear of one axis is clear
    const sx = Math.min(A.hw, B.hw) * 2;
    const sy = Math.min(A.hh, B.hh) * 2;
    const sz = Math.min(A.hd, B.hd) * 2;
    const pen = Math.min(ox / sx, oy / sy, oz / sz);   // the cheapest axis to separate along
    const key = `${A.id} x ${B.id}`;
    pairs[key] = Math.max(pairs[key] || 0, pen);
    if (pen > frameWorst) { frameWorst = pen; who = key; }
  }
  // Speed, in cube widths a second. Wyatt's standing rule is that nothing on the graph may move
  // faster than the tour itself, so a fix for bumping that introduces a lurch is not a fix.
  const nowT = Date.now();
  if (prev) {
    const dt = (nowT - prevT) / 1000;
    for (const box of b) {
      const q = prev.find((x) => x.id === box.id);
      if (!q || dt <= 0) continue;
      const d = Math.hypot(box.x - q.x, box.y - q.y, box.z - q.z) / dt / (box.hw * 2);
      if (d > fastest) { fastest = d; fastestWho = box.id; }
    }
  }
  prev = b; prevT = nowT;
  worst.push(frameWorst);
  if (frameWorst > (deepest.pen || 0)) deepest = { pen: frameWorst, at: (Date.now() - t0) / 1000, who };
  await new Promise((r) => setTimeout(r, 100));
}
const samples = { worst, pairs, frames: reads, ms: Date.now() - t0 };

await browser.close(); stop();

const w = samples.worst;
const pct = (f) => (w.filter((v) => v > f).length / w.length * 100);
const max = Math.max(...w);
const sorted = Object.entries(samples.pairs).sort((a, b) => b[1] - a[1]);
console.log(`\n# Cube interpenetration — ${(samples.ms / 1000).toFixed(0)}s of tour at speed ${SPEED}, ${samples.frames} samples, ${WIDTH}px wide`);
console.log(`\nworst single frame          ${(max * 100).toFixed(0)}% of a cube inside another`);
console.log(`frames with any overlap     ${pct(0).toFixed(1)}%`);
console.log(`frames over 5% inside       ${pct(0.05).toFixed(1)}%`);
console.log(`frames over 20% inside      ${pct(0.20).toFixed(1)}%`);
console.log(`frames over 50% inside      ${pct(0.50).toFixed(1)}%`);
if (deepest.pen) console.log(`deepest moment             ${(deepest.pen * 100).toFixed(0)}% at ${deepest.at.toFixed(0)}s in (${deepest.who})`);
console.log(`fastest any cube moved     ${fastest.toFixed(2)} cube widths/s (${fastestWho}) — the yield ceiling is ${'${DRIFT}'}`.replace(' — the yield ceiling is ${DRIFT}', ''));
console.log(`\nworst pairs:`);
for (const [k, v] of sorted.slice(0, 6)) console.log(`  ${(v * 100).toFixed(0).padStart(3)}%  ${k}`);
if (!sorted.length) console.log('  none — no pair ever shared a point');
