// Builds assets/og.png, the picture a link to hycudesign.com shows in iMessage, Slack and the rest.
// Wyatt, 2026-09-12: "create a new preview image ... using this image plus the wordmark and the
// color aura". The image is the Studio page's tesseract, drawn by the same maths as js/site.js and
// frozen at one moment; the wordmark is assets/wordmark.svg; the aura is the four capability washes
// from style.css, pulled up so all four fit in a 630px-tall card.
//
//   node scripts/og-image.mjs          → assets/og.png
//   node scripts/og-image.mjs 900 out.png   (a different frozen moment, or a different file)
import { readFileSync } from 'node:fs';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/Users/wyattroy/Documents/Projects/wyattroy-portfolio/node_modules/playwright/index.mjs')); }

const T = Number(process.argv[2] ?? 480);   // the moment matched, by contact sheet, to the frame Wyatt sent
const OUT = process.argv[3] ?? new URL('../assets/og.png', import.meta.url).pathname;

// Same as setupTesseracts() in js/site.js. Change one, change both.
const verts = [];
for (let i = 0; i < 16; i++) verts.push([(i & 1) ? 1 : -1, (i & 2) ? 1 : -1, (i & 4) ? 1 : -1, (i & 8) ? 1 : -1]);
const edges = [];
for (let a = 0; a < 16; a++) for (let b = a + 1; b < 16; b++) { const d = a ^ b; if (d && !(d & (d - 1))) edges.push([a, b]); }
const rot = (p, i, j, t) => { const c = Math.cos(t), s = Math.sin(t); const q = p.slice(); q[i] = p[i] * c - p[j] * s; q[j] = p[i] * s + p[j] * c; return q; };
const pts = verts.map((v) => {
  let p = rot(v, 0, 3, T * 0.00035);
  p = rot(p, 1, 2, T * 0.00021);
  p = rot(p, 0, 2, 0.5);
  const w = 1 / (2.6 - p[3]);
  const x = p[0] * w * 2.2, y = p[1] * w * 2.2, z = p[2] * w * 2.2;
  const s = 1 / (4.2 - z);
  return [x * s * 2.7, -y * s * 2.7];
});
const tesseract = `<svg class="tess" viewBox="-2.3 -2.3 4.6 4.6">${edges.map(([a, b]) =>
  `<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" stroke="#1a1e18" stroke-width="0.02" stroke-linecap="round"/>`).join('')}</svg>`;

const wordmark = readFileSync(new URL('../assets/wordmark.svg', import.meta.url), 'utf8').replace(/<!--[\s\S]*?-->/g, '');

const html = `<!doctype html><style>
  html, body { margin: 0; }
  .card {
    width: 1200px; height: 630px; position: relative; overflow: hidden;
    background-color: #e9e5d8;
    background-image:
      radial-gradient(circle 720px at 88% 0px, color-mix(in srgb, #7a4258 30%, transparent), transparent 70%),
      radial-gradient(circle 640px at 4% 170px, color-mix(in srgb, #b3862f 26%, transparent), transparent 70%),
      radial-gradient(circle 680px at 76% 520px, color-mix(in srgb, #4f7245 22%, transparent), transparent 70%),
      radial-gradient(circle 760px at 14% 700px, color-mix(in srgb, #33607f 24%, transparent), transparent 70%),
      radial-gradient(620px 440px at 30% 50%, #f2efe5 0%, color-mix(in srgb, #f2efe5 55%, transparent) 38%, transparent 72%);
    background-repeat: no-repeat;
  }
  .wordmark { position: absolute; left: 120px; top: 50%; transform: translateY(-50%); height: 177px; }
  .wordmark svg { height: 100%; width: auto; display: block; }
  .tess { position: absolute; right: 90px; top: 50%; transform: translateY(-50%); width: 540px; height: 540px; }
</style><div class="card"><div class="wordmark">${wordmark}</div>${tesseract}</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.locator('.card').screenshot({ path: OUT });
await browser.close();
console.log(`wrote ${OUT} (t=${T})`);
