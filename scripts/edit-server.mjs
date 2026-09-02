#!/usr/bin/env node
/* edit-server.mjs — edit the site's words in place, in a browser, and have them written back to
 * the source HTML.
 *
 * Wyatt, 2026-09-02: "create a locally hosted tool for me to edit all of the text inline in the page
 * by double-clicking any piece of text." Changes go straight into the files, so git shows the diff
 * and nothing has to be copied back by hand. When an edit cannot be located uniquely in the source
 * (same sentence twice on a page, say), it is kept in a list with a "Copy all changes" button.
 *
 *   npm run edit         →  http://127.0.0.1:8788
 *
 * Local only. Never deploy this; GitHub Pages serves the static files without it. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const PORT = Number(process.env.PORT || 8788);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };

/* The browser hands back innerHTML, where named entities have become characters. The source uses
   the entities. Try both spellings when locating the original text. */
const ENTITIES = [['·', '&middot;'], ['→', '&rarr;'], ['←', '&larr;'], ['–', '&ndash;'], ['—', '&mdash;'], ['“', '&ldquo;'], ['”', '&rdquo;'], ['‘', '&lsquo;'], ['’', '&rsquo;'], ['…', '&hellip;'], ['−', '&minus;'], [' ', '&nbsp;']];
const encode = (s) => ENTITIES.reduce((acc, [ch, ent]) => acc.split(ch).join(ent), s);

function fileFor(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  let p = path.join(ROOT, clean);
  if (!p.startsWith(ROOT)) return null;
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  return fs.existsSync(p) ? p : null;
}

function countOccurrences(hay, needle) {
  if (!needle) return 0;
  let n = 0, i = 0;
  while ((i = hay.indexOf(needle, i)) !== -1) { n++; i += needle.length; }
  return n;
}

function save({ page, before, after }) {
  const file = fileFor(page);
  if (!file || !file.endsWith('.html')) return { ok: false, reason: 'no source file for this page' };
  if (typeof before !== 'string' || typeof after !== 'string' || before.trim().length < 3) return { ok: false, reason: 'original text too short to locate safely' };
  const src = fs.readFileSync(file, 'utf8');
  for (const [candidate, encoded] of [[before, false], [encode(before), true]]) {
    const n = countOccurrences(src, candidate);
    if (n === 1) {
      // Keep the file's own spelling: if the original was found via entities, write entities back.
      const replacement = encoded ? encode(after) : after;
      fs.writeFileSync(file, src.replace(candidate, () => replacement));
      return { ok: true, file: path.relative(ROOT, file) };
    }
    if (n > 1) return { ok: false, reason: `that text appears ${n} times in ${path.relative(ROOT, file)}` };
  }
  return { ok: false, reason: `could not find the original text in ${path.relative(ROOT, file)}` };
}

const EDITOR = String.raw`
(function () {
  const EDITABLE = 'h1,h2,h3,p,li,label,button,a,span,figcaption,dt,dd,td,th';
  const SKIP = '#axis-labels, #graph-hover, .hero-controls, .nav-toggle, .visually-hidden, #graph-2d, .edit-bar';
  const changes = [];
  let active = null;

  const bar = document.createElement('div');
  bar.className = 'edit-bar';
  bar.innerHTML = '<span class="eb-dot"></span><span class="eb-msg">Editing · double-click any text · Enter or click away saves to the source · Esc cancels · ⌘-click follows links</span><button class="eb-copy" hidden>Copy all changes</button>';
  document.body.prepend(bar);
  const msg = bar.querySelector('.eb-msg');
  const copyBtn = bar.querySelector('.eb-copy');
  const say = (t, ok) => { msg.textContent = t; bar.dataset.state = ok === undefined ? '' : ok ? 'ok' : 'bad'; };

  const style = document.createElement('style');
  style.textContent = [
    '.edit-bar{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;gap:12px;padding:8px 16px;background:#111112;color:#fff;font:500 12px/1.4 "Geist Mono",ui-monospace,monospace;letter-spacing:.04em}',
    '.edit-bar .eb-dot{width:8px;height:8px;border-radius:50%;background:#0a5cff;flex:none}',
    '.edit-bar[data-state="ok"] .eb-dot{background:#1fa084}.edit-bar[data-state="bad"] .eb-dot{background:#d9622b}',
    '.edit-bar .eb-msg{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.edit-bar button{font:inherit;color:#111112;background:#fff;border:0;border-radius:999px;padding:6px 12px;cursor:pointer}',
    'body{padding-top:36px}#nav{top:36px}',
    '[data-editing]{outline:2px solid #0a5cff;outline-offset:4px;border-radius:2px;background:rgba(10,92,255,.04)}',
    '[data-saved]{outline:2px solid #1fa084;outline-offset:4px;border-radius:2px;transition:outline-color 1.2s}',
    '[data-failed]{outline:2px solid #d9622b;outline-offset:4px;border-radius:2px}',
  ].join('');
  document.head.append(style);

  function target(node) {
    const el = node.nodeType === 1 ? node : node.parentElement;
    if (!el || el.closest(SKIP)) return null;
    // The innermost editable element that owns real text; a span with a single word inside a
    // paragraph edits alone, a paragraph with inline links edits whole.
    let t = el.closest(EDITABLE);
    if (!t) return null;
    if (t.matches('span,a') && t.parentElement.closest('p,li,h1,h2,h3') && t.textContent.trim().split(/\s+/).length > 3) t = t.parentElement.closest('p,li,h1,h2,h3');
    return t;
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a && !e.metaKey && !e.ctrlKey && !a.closest('.edit-bar')) e.preventDefault();
  }, true);

  document.addEventListener('dblclick', (e) => {
    const t = target(e.target);
    if (!t || t === active) return;
    if (active) commit();
    e.preventDefault();
    active = t;
    t.dataset.before = t.innerHTML;
    t.setAttribute('contenteditable', 'true');
    t.dataset.editing = '1';
    t.focus();
    say('Editing. Enter or click away to save, Esc to cancel.');
  });

  document.addEventListener('keydown', (e) => {
    if (!active) return;
    if (e.key === 'Escape') { e.preventDefault(); cancel(); }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(); }
  });
  document.addEventListener('focusout', (e) => { if (active && e.target === active) setTimeout(() => { if (active === e.target) commit(); }, 0); });

  function cleanup(t) {
    t.removeAttribute('contenteditable'); delete t.dataset.editing;
  }
  function cancel() {
    const t = active; active = null;
    t.innerHTML = t.dataset.before; delete t.dataset.before; cleanup(t); say('Cancelled.');
  }
  async function commit() {
    const t = active; active = null;
    const before = t.dataset.before; delete t.dataset.before; cleanup(t);
    const after = t.innerHTML;
    if (after === before) { say('No change.'); return; }
    try {
      const res = await fetch('/__save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: location.pathname, before, after }) });
      const r = await res.json();
      if (r.ok) { t.dataset.saved = '1'; setTimeout(() => delete t.dataset.saved, 1500); say('Saved to ' + r.file, true); return; }
      throw new Error(r.reason);
    } catch (err) {
      t.dataset.failed = '1';
      changes.push({ page: location.pathname, before, after });
      copyBtn.hidden = false; copyBtn.textContent = 'Copy all changes (' + changes.length + ')';
      say('Not saved automatically (' + err.message + '). Kept in the list.', false);
    }
  }

  copyBtn.addEventListener('click', async () => {
    const text = changes.map((c) => '## ' + c.page + '\nBEFORE: ' + c.before + '\nAFTER:  ' + c.after).join('\n\n');
    try { await navigator.clipboard.writeText(text); say('Copied ' + changes.length + ' change(s). Paste them to Claude.', true); }
    catch { say('Could not copy; select the text in the console instead.', false); console.log(text); }
  });
})();
`;

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/__save') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      let out;
      try { out = save(JSON.parse(body)); } catch (e) { out = { ok: false, reason: e.message }; }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(out));
      console.log(out.ok ? `saved  ${out.file}` : `FAILED ${out.reason}`);
    });
    return;
  }
  if (req.url === '/__edit.js') { res.writeHead(200, { 'Content-Type': TYPES['.js'] }); res.end(EDITOR); return; }
  const file = fileFor(req.url);
  if (!file) { res.writeHead(404); res.end('not found'); return; }
  const ext = path.extname(file);
  res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  if (ext === '.html') {
    const html = fs.readFileSync(file, 'utf8').replace('</body>', '<script src="/__edit.js"></script>\n</body>');
    res.end(html);
  } else {
    res.end(fs.readFileSync(file));
  }
}).listen(PORT, '127.0.0.1', () => console.log(`editing at http://127.0.0.1:${PORT}  (writes into ${ROOT})`));
