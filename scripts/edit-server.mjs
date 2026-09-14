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
  if (p !== ROOT && !p.startsWith(ROOT + path.sep)) return null;
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  return fs.existsSync(p) ? p : null;
}

function countOccurrences(hay, needle) {
  if (!needle) return 0;
  let n = 0, i = 0;
  while ((i = hay.indexOf(needle, i)) !== -1) { n++; i += needle.length; }
  return n;
}

function save({ page, before, after, occurrence = 0, pageCount = 1 }) {
  const file = fileFor(page);
  if (!file || !file.endsWith('.html')) return { ok: false, reason: 'no source file for this page' };
  if (typeof before !== 'string' || typeof after !== 'string' || before.trim().length < 3) return { ok: false, reason: 'original text too short to locate safely' };
  const src = fs.readFileSync(file, 'utf8');
  for (const [candidate, encoded] of [[before, false], [encode(before), true]]) {
    const n = countOccurrences(src, candidate);
    if (n === 0) continue;
    if (n !== pageCount || occurrence >= n) return { ok: false, reason: `the page shows that element ${pageCount} time(s) but ${path.relative(ROOT, file)} has it ${n} time(s); reload the page` };
    // Replace the same occurrence the page was showing: document order is source order here.
    let idx = -1;
    for (let k = 0; k <= occurrence; k++) idx = src.indexOf(candidate, idx + 1);
    // Keep the file's own spelling: if the original was found via entities, write entities back.
    // A paragraph split with Shift+Enter comes back as several elements joined by U+2029: each new one
    // goes on its own line, at the indentation of the one it came from.
    const lineStart = src.lastIndexOf('\n', idx - 1) + 1;
    const indent = /^[ \t]*$/.test(src.slice(lineStart, idx)) ? src.slice(lineStart, idx) : '';
    const replacement = (encoded ? encode(after) : after).split(' ').join('\n' + indent);
    fs.writeFileSync(file, src.slice(0, idx) + replacement + src.slice(idx + candidate.length));
    return { ok: true, file: path.relative(ROOT, file), occurrence: n > 1 ? `${occurrence + 1} of ${n}` : undefined };
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
  bar.innerHTML = '<span class="eb-dot"></span><span class="eb-msg">Editing · double-click any text · Enter or click away saves to the source · Shift+Enter new paragraph · Esc cancels · ⌘-click follows links</span><button class="eb-copy" hidden>Copy all changes</button>';
  document.body.prepend(bar);
  const msg = bar.querySelector('.eb-msg');
  const copyBtn = bar.querySelector('.eb-copy');
  const say = (t, ok) => { msg.textContent = t; bar.dataset.state = ok === undefined ? '' : ok ? 'ok' : 'bad'; };
  // The editor's own marks (the green saved flash, the orange failed outline) are not in the file. If
  // they ride along in the text sent to find an element there, it is never found, and every later
  // edit to an element that failed once, or was re-edited within the flash, fails too.
  const MARKS = ['contenteditable', 'data-editing', 'data-saved', 'data-failed', 'data-before', 'data-occurrence', 'data-page-count'];
  const sourceHTML = (el) => { const c = el.cloneNode(true); MARKS.forEach((m) => c.removeAttribute(m)); return c.outerHTML; };

  const style = document.createElement('style');
  style.textContent = [
    '.edit-bar{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;gap:12px;padding:8px 16px;background:#111112;color:#fff;font:500 12px/1.4 "Geist Mono",ui-monospace,monospace;letter-spacing:.04em}',
    '.edit-bar .eb-dot{width:8px;height:8px;border-radius:50%;background:#0a5cff;flex:none}',
    '.edit-bar[data-state="ok"] .eb-dot{background:#1fa084}.edit-bar[data-state="bad"] .eb-dot{background:#d9622b}',
    '.edit-bar .eb-msg{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.edit-bar button{font:inherit;color:#111112;background:#fff;border:0;border-radius:999px;padding:6px 12px;cursor:pointer}',
    'body{padding-top:36px}#nav{top:36px}',
    '.hero-copy,.hero-text{pointer-events:auto !important}', /* the site lets clicks pass through the headline to the graph; editing needs the headline */
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

  document.addEventListener('submit', (e) => { e.preventDefault(); e.stopImmediatePropagation(); say('Form submission is off while editing.', false); }, true);

  document.addEventListener('dblclick', (e) => {
    const t = target(e.target);
    if (!t || t === active) return;
    if (active) commit();
    e.preventDefault();
    // Keep the word the double-click selected, rather than jumping the caret to the end. Taken before
    // contenteditable goes on, which clears the selection.
    const sel = window.getSelection();
    const picked = sel && sel.rangeCount && t.contains(sel.getRangeAt(0).commonAncestorContainer) ? sel.getRangeAt(0).cloneRange() : null;
    active = t;
    // Whole elements, tag and attributes included: text alone can also live inside a meta tag or a
    // longer sentence, and a match there would rewrite the wrong thing.
    // Count twins BEFORE stamping any data-* attribute on the element, or it has none.
    delete t.dataset.saved; delete t.dataset.failed;
    const html = sourceHTML(t);
    const twins = [...document.querySelectorAll(t.tagName)].filter((el) => sourceHTML(el) === html);
    t.dataset.before = html;
    t.dataset.occurrence = String(twins.indexOf(t));
    t.dataset.pageCount = String(twins.length);
    t.setAttribute('contenteditable', 'true');
    t.dataset.editing = '1';
    t.focus();
    if (picked) { sel.removeAllRanges(); sel.addRange(picked); }
    say('Editing. Enter or click away to save, Esc to cancel.');
  });

  document.addEventListener('keydown', (e) => {
    if (!active) return;
    if (e.key === 'Escape') { e.preventDefault(); cancel(); }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(); }
    // Shift+Enter starts a new paragraph (split into separate <p>s on save). Headings, labels and
    // list items take no line breaks.
    if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); if (active.matches('p')) document.execCommand('insertLineBreak'); }
  });

  // Inside the box being edited, a drag always selects. Browsers otherwise treat a drag that starts on
  // already-selected text as picking that text up to move it, which looks like selection is broken
  // and can silently rearrange words. Collapsing the selection at the press point first makes the
  // browser start a fresh selection there. Double/triple-click and Shift-click extend are left alone.
  document.addEventListener('mousedown', (e) => {
    if (!active || !active.contains(e.target) || e.button !== 0 || e.detail > 1 || e.shiftKey) return;
    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed) return;
    let at = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null;
    if (!at && document.caretPositionFromPoint) { const pos = document.caretPositionFromPoint(e.clientX, e.clientY); if (pos) { at = document.createRange(); at.setStart(pos.offsetNode, pos.offset); } }
    if (at) { sel.removeAllRanges(); sel.addRange(at); }
  }, true);
  const inActive = (n) => active && n && active.contains(n.nodeType === 1 ? n : n.parentElement);
  document.addEventListener('dragstart', (e) => { if (inActive(e.target)) e.preventDefault(); }, true);
  document.addEventListener('drop', (e) => { if (inActive(e.target)) e.preventDefault(); }, true);
  // Paste as plain text. Text copied from a page carries its font size and weight as inline styles,
  // and saved that way it overrides the site's type (the Forgiveness "What we found" headline,
  // 2026-09-14).
  document.addEventListener('paste', (e) => {
    if (!inActive(e.target)) return;
    e.preventDefault();
    const text = (e.clipboardData ? e.clipboardData.getData('text/plain') : '').replace(/\s*\n\s*/g, ' ');
    if (text) document.execCommand('insertText', false, text);
  }, true);
  document.addEventListener('focusout', (e) => { if (active && e.target === active) setTimeout(() => { if (active === e.target) commit(); }, 0); });

  function cleanup(t) {
    t.removeAttribute('contenteditable'); delete t.dataset.editing;
  }
  function cancel() {
    const t = active; active = null;
    t.outerHTML = t.dataset.before; say('Cancelled.');
  }
  async function commit() {
    const t = active; active = null;
    const before = t.dataset.before; const occurrence = Number(t.dataset.occurrence || 0); const pageCount = Number(t.dataset.pageCount || 1);
    delete t.dataset.before; delete t.dataset.occurrence; delete t.dataset.pageCount; cleanup(t);
    t.innerHTML = t.innerHTML.replace(/(&nbsp;|\u00a0)+$/, '');
    let after = sourceHTML(t);
    // Line breaks from Shift+Enter (or the <div>s some browsers make instead) become separate
    // paragraphs: one <p> per line with the same attributes, sent joined by U+2029 for the server to
    // put on their own lines. The page gets the same paragraphs, so it keeps matching the file.
    if (t.matches('p') && /<br|<div/i.test(t.innerHTML)) {
      const lines = t.innerHTML.replace(/<div[^>]*>/gi, ' ').replace(/<\/div>/gi, '').replace(/<br[^>]*>/gi, ' ')
        .split(' ').map((s) => s.replace(/^(\s|&nbsp;)+|(\s|&nbsp;)+$/g, '')).filter(Boolean);
      if (lines.length) {
        const shell = t.cloneNode(false); MARKS.forEach((m) => shell.removeAttribute(m));
        const open = shell.outerHTML.slice(0, -'</p>'.length);
        t.innerHTML = lines[0];
        t.insertAdjacentHTML('afterend', lines.slice(1).map((l) => open + l + '</p>').join(''));
        after = lines.map((l) => open + l + '</p>').join(' ');
      }
    }
    if (after === before) { say('No change.'); return; }
    try {
      const res = await fetch('/__save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: location.pathname, before, after, occurrence, pageCount }) });
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
    const text = changes.map((c) => '## ' + c.page + '\nBEFORE: ' + c.before + '\nAFTER:  ' + c.after.split(' ').join('\n')).join('\n\n');
    try { await navigator.clipboard.writeText(text); say('Copied ' + changes.length + ' change(s). Paste them to Claude.', true); }
    catch { say('Could not copy; select the text in the console instead.', false); console.log(text); }
  });
})();
`;

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/__save') {
    const origin = req.headers.origin || '';
    const local = new RegExp(`^https?://(127\\.0\\.0\\.1|localhost):${PORT}$`);
    if (!local.test(origin) || !local.test('http://' + String(req.headers.host || ''))) {
      res.writeHead(403, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: false, reason: 'refused: not from the editor page' })); return;
    }
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
