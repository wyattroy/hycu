/**
 * site.js — shared behaviour for every page: nav state, the home graph, the contact form.
 * Vanilla ES module, no build step. Pages are hand-written HTML; the graph is the only thing
 * rendered from data (data/projects.json).
 */

// ─── Settings a human fills in once ──────────────────────────────────────────
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maeyjowq';

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
    window.location.href = '/work/'; // small tiles have no page of their own: go to the Work list
  };

  let view;
  if (hasWebGL()) {
    try { view = initScene(projects, { onSelect }); }
    catch (err) { console.warn('WebGL scene failed, using 2D', err); view = initScatter2D(projects, { onSelect }); }
  } else {
    view = initScatter2D(projects, { onSelect });
  }

  window.__graph = view; // for the screenshot pass
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
      status.textContent = 'The form is not connected yet.';
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
      status.textContent = 'That did not go through. Please try again.';
    } finally {
      button.disabled = false;
    }
  });
}

// ─── The mark, alive ─────────────────────────────────────────────────────────
// Sixteen vertices in four dimensions, rotated in two planes, projected to three and then to two.
// Drawn with lines only, like the nav mark. Respects reduced motion.
function setupTesseracts() {
  const svgs = document.querySelectorAll('svg.tesseract');
  if (!svgs.length) return;
  const NS = 'http://www.w3.org/2000/svg';
  const verts = [];
  for (let i = 0; i < 16; i++) verts.push([(i & 1) ? 1 : -1, (i & 2) ? 1 : -1, (i & 4) ? 1 : -1, (i & 8) ? 1 : -1]);
  const edges = [];
  for (let a = 0; a < 16; a++) for (let b = a + 1; b < 16; b++) { const d = a ^ b; if (d && !(d & (d - 1))) edges.push([a, b]); }
  const rot = (p, i, j, t) => { const c = Math.cos(t), s = Math.sin(t); const q = p.slice(); q[i] = p[i] * c - p[j] * s; q[j] = p[i] * s + p[j] * c; return q; };
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sets = [...svgs].map((svg) => ({
    svg,
    lines: edges.map(() => {
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('stroke', 'currentColor'); l.setAttribute('stroke-width', '0.024'); l.setAttribute('stroke-linecap', 'round');
      svg.appendChild(l); return l;
    }),
  }));

  function draw(t) {
    const pts = verts.map((v) => {
      let p = rot(v, 0, 3, t * 0.00035);   // x–w
      p = rot(p, 1, 2, t * 0.00021);       // y–z
      p = rot(p, 0, 2, 0.5);               // a fixed tilt so the cube reads as a cube
      const w = 1 / (2.6 - p[3]);          // 4D → 3D perspective
      const x = p[0] * w * 2.2, y = p[1] * w * 2.2, z = p[2] * w * 2.2;
      const s = 1 / (4.2 - z);             // 3D → 2D perspective
      return [x * s * 2.7, -y * s * 2.7];
    });
    for (const { lines } of sets) lines.forEach((l, k) => {
      const [a, b] = edges[k];
      l.setAttribute('x1', pts[a][0]); l.setAttribute('y1', pts[a][1]);
      l.setAttribute('x2', pts[b][0]); l.setAttribute('y2', pts[b][1]);
    });
  }
  if (still) { draw(2400); return; }
  let running = true;
  const frame = (t) => { if (running) draw(t); requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });
}

setupNav();
setupContact();
setupTesseracts();
setupGraph();
