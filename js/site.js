/**
 * site.js — shared behaviour for every page: nav state, the home graph, the contact form.
 * Vanilla ES module, no build step. Pages are hand-written HTML; the graph is the only thing
 * rendered from data (data/projects.json).
 */

// ─── Settings a human fills in once ──────────────────────────────────────────
// Both are placeholders until Wyatt supplies them (see .claude/CTO-QUESTIONS.md).
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_WITH_FORM_ID';
export const CALENDLY_URL = 'https://calendly.com/REPLACE_WITH_HANDLE';

// ─── Nav ─────────────────────────────────────────────────────────────────────
function setupNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = nav.querySelector('.nav-toggle');
  const links = nav.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }
}

// ─── Home graph ──────────────────────────────────────────────────────────────
async function setupGraph() {
  const canvas = document.getElementById('graph-canvas');
  if (!canvas) return;

  let projects = [];
  try {
    const res = await fetch('/data/projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    projects = await res.json();
  } catch (err) {
    console.error('projects.json failed to load', err);
    return;
  }

  // Tile faces are drawn into canvas textures, so the fonts have to be ready first.
  try {
    await Promise.all([
      document.fonts.load('500 40px "Geist"'),
      document.fonts.load('500 20px "Geist Mono"'),
    ]);
  } catch { /* fall back to the stack */ }

  const { initScene, initScatter2D, hasWebGL } = await import('/js/scene.js');
  const onSelect = (p) => {
    if (p.selected) { window.location.href = p.url; return; }
    document.getElementById('index')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  let view;
  if (hasWebGL()) {
    try { view = initScene(projects, { onSelect }); }
    catch (err) { console.warn('WebGL scene failed, using 2D', err); view = initScatter2D(projects, { onSelect }); }
  } else {
    view = initScatter2D(projects, { onSelect });
  }

  document.getElementById('zoom-in')?.addEventListener('click', () => view.zoomIn());
  document.getElementById('zoom-out')?.addEventListener('click', () => view.zoomOut());
  document.getElementById('zoom-reset')?.addEventListener('click', () => view.reset());
}

// ─── Contact form ────────────────────────────────────────────────────────────
function setupContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.querySelector('[name="_gotcha"]')?.value) return;
    if (FORMSPREE_ENDPOINT.includes('REPLACE')) {
      status.textContent = 'The form is not connected yet. Email us instead, or book a call.';
      return;
    }
    button.disabled = true;
    status.textContent = 'Sending…';
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      status.textContent = 'Sent. We read everything and reply within two working days.';
    } catch {
      status.textContent = 'That did not go through. Try again, or book a call instead.';
    } finally {
      button.disabled = false;
    }
  });

  const cal = document.getElementById('calendly');
  if (cal) {
    if (CALENDLY_URL.includes('REPLACE')) {
      cal.remove();
      const note = document.getElementById('calendly-note');
      if (note) { note.hidden = false; }
    } else {
      cal.src = `${CALENDLY_URL}?hide_gdpr_banner=1&background_color=ffffff&text_color=111112&primary_color=0a5cff`;
    }
  }
}

setupNav();
setupContact();
setupGraph();
