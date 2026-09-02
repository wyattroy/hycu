/**
 * scene.js — the Hycu work graph.
 *
 * Descended from the 3D graph on wyattroy.com and the 2×2×2 research map built for a client:
 * same spring-driven orbit, same trick of projecting HTML axis labels onto a WebGL canvas.
 * What is different is what the axes teach. Every label is a word a buyer already knows.
 *
 *   x  understand  ←→  make        what we did
 *   y  product     ←→  idea        the "system" axis — what the work produced
 *   z  one person  ←→  a public    reach — who it touched (a public sits nearest the viewer)
 *
 * The four quadrants of the x/y plane are the studio's four capabilities, captioned on the back
 * wall, so the graph explains what design is without a sentence of copy.
 *
 * Tiles draw their own faces (client, name) into a canvas texture rather than loading images —
 * the site has no photography by ruling (DECISIONS.md, 2026-09-02, "Voice and imagery"), so the
 * type has to carry it.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// ─── Layout ───────────────────────────────────────────────────────────────────
const R = 5.5;             // half-extent of the x/y plane
const Z_FAR = -6;          // one person
const Z_NEAR = 6;          // a public

const TILE = { w: 2.05, h: 1.2, d: 0.14 };        // selected work
const TILE_SMALL = { w: 1.25, h: 0.72, d: 0.08 };  // index

// ─── Palette — the site's own tokens, repeated here because WebGL cannot read CSS ──
const C = {
  bg: '#FFFFFF',
  ink: '#111112',
  ink2: '#59595E',
  ink3: '#9C9CA2',
  rule: '#E8E8EB',
  ruleMid: '#C9C9CE',
  ruleStrong: '#9C9CA2',
  face: '#FFFFFF',
  faceSmall: '#F7F7F8',
  accent: '#0A5CFF',
};

// The one place the site uses colour: a tile's thickness carries the hue of its primary
// capability, and the quadrant captions on the back wall share it. Same values as style.css.
export const CAP_COLORS = {
  'User research':  '#D9622B',
  'Strategy':       '#0A5CFF',
  'Product design': '#1FA084',
  'Systems design': '#7A4FD6',
};
const capColor = (p) => CAP_COLORS[(p.capabilities || [])[0]] || C.ruleMid;

// ─── Camera / interaction feel ────────────────────────────────────────────────
const CAM_ZOOM_MIN = 0.6;
const CAM_ZOOM_MAX = 1.9;
const CAM_START_FRAC = 0.5;
const START_THETA = -0.3;
const START_PHI = 0.14;
const CAM_TARGET = new THREE.Vector3(0, 0, 0);

const ZOOM_STEP = 0.16;
const ZOOM_PINCH_SPEED = 0.05;
const ZOOM_STIFFNESS = 0.16;
const ZOOM_DAMPING = 0.62;

const DRAG_MAX_H = (55 * Math.PI) / 180;
const DRAG_MAX_V = (40 * Math.PI) / 180;
const DRAG_SPEED = 0.0042;
const DRAG_STIFFNESS = 0.16;
const DRAG_DAMPING = 0.62;

const HOVER_SCALE = 1.14;
const SCALE_STIFFNESS = 0.22;
const SCALE_DAMPING = 0.55;

const ENTRY_STAGGER_MS = 70;
const ENTRY_FADE_MS = 600;
const ENTRY_DELAY_MS = 350;

const LABEL_MARGIN = 72;
const DEPTH_LABEL_ANGLE = (6 * Math.PI) / 180;

// Idle drift: a very slow yaw so the depth is visible at rest without anyone touching it.
const DRIFT_AMPL = 0.035;
const DRIFT_PERIOD_MS = 14000;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const makeSpring = (v = 0) => ({ current: v, target: v, velocity: 0 });
function tickSpring(s, k, d) {
  s.velocity += (s.target - s.current) * k;
  s.velocity *= 1 - d;
  s.current += s.velocity;
  return s.current;
}
const frameRateAdjusted = (k, dt) => 1 - Math.pow(1 - k, dt / 16.67);

/* ─── Tile faces ─────────────────────────────────────────────────────────────── */
const FACE_W = 1024;

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (line && ctx.measureText(test).width > maxWidth) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

const SANS = '"Geist", -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif';
const MONO = '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

function makeFace(project) {
  const big = project.selected;
  const size = big ? TILE : TILE_SMALL;
  const H = Math.round(FACE_W * (size.h / size.w));
  const cv = document.createElement('canvas');
  cv.width = FACE_W;
  cv.height = H;
  const ctx = cv.getContext('2d');

  ctx.fillStyle = big ? C.face : C.faceSmall;
  ctx.fillRect(0, 0, FACE_W, H);
  ctx.textBaseline = 'top';

  const padX = big ? 56 : 60;
  let y = big ? 50 : 60;

  if (big) {
    ctx.fillStyle = C.ink3;
    ctx.font = `500 36px ${MONO}`;
    const eyebrow = project.client.toUpperCase().split('').join(' ');
    ctx.fillText(eyebrow, padX, y);
    y += 36 + 44;
  }

  ctx.fillStyle = big ? C.ink : C.ink2;
  const px = big ? 110 : 96;
  ctx.font = `500 ${px}px ${SANS}`;
  ctx.letterSpacing = '-2px';
  const lines = wrapLines(ctx, project.name, FACE_W - padX * 2);
  for (const l of lines.slice(0, big ? 3 : 2)) { ctx.fillText(l, padX, y); y += px * 1.12; }

  if (big) {
    ctx.fillStyle = C.ink3;
    ctx.font = `400 34px ${MONO}`;
    ctx.letterSpacing = '0px';
    ctx.fillText(String(project.year), padX, H - 50 - 34);
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* Quadrant captions on the back wall: the four capabilities, where the work that used them sits. */
function makeQuadrantPanel(q) {
  const S = 512;
  const cv = document.createElement('canvas');
  cv.width = S; cv.height = S;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = CAP_COLORS[q.label] || C.ink3;
  ctx.globalAlpha = 0.42;
  ctx.font = `500 26px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const words = q.label.toUpperCase().split(' ');
  const spaced = words.map((w) => w.split('').join(' '));
  spaced.forEach((w, i) => ctx.fillText(w, S / 2, S / 2 + (i - (spaced.length - 1) / 2) * 40));
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(R, R),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  mesh.position.set(q.x * (R / 2), q.y * (R / 2), Z_FAR - 0.04);
  mesh.renderOrder = -1;
  return mesh;
}

const QUADRANTS = [
  { x: -1, y: -1, label: 'User research' },
  { x: -1, y:  1, label: 'Strategy' },
  { x:  1, y: -1, label: 'Product design' },
  { x:  1, y:  1, label: 'Systems design' },
];

function addScaffold(scene) {
  const g = new THREE.Group();
  QUADRANTS.forEach((q) => g.add(makeQuadrantPanel(q)));

  const faint = new THREE.LineBasicMaterial({ color: C.rule, transparent: true, opacity: 0.9 });
  const mid = new THREE.LineBasicMaterial({ color: C.ruleMid, transparent: true, opacity: 0.7 });
  const strong = new THREE.LineBasicMaterial({ color: C.ruleStrong, transparent: true, opacity: 0.8 });
  const seg = (pts, mat) => g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), mat));

  // Back wall grid
  const back = [];
  for (let i = -R; i <= R + 0.001; i += R / 5) {
    back.push(new THREE.Vector3(i, -R, Z_FAR), new THREE.Vector3(i, R, Z_FAR));
    back.push(new THREE.Vector3(-R, i, Z_FAR), new THREE.Vector3(R, i, Z_FAR));
  }
  seg(back, faint);

  // The 2×2 split, extruded through the depth
  const planes = [];
  for (let z = Z_FAR; z <= Z_NEAR + 0.01; z += 2) {
    planes.push(new THREE.Vector3(0, -R, z), new THREE.Vector3(0, R, z));
    planes.push(new THREE.Vector3(-R, 0, z), new THREE.Vector3(R, 0, z));
  }
  for (const [x, y] of [[0, -R], [0, R], [-R, 0], [R, 0]]) {
    planes.push(new THREE.Vector3(x, y, Z_FAR), new THREE.Vector3(x, y, Z_NEAR));
  }
  seg(planes, mid);

  // Main axes, drawn stronger
  seg([
    new THREE.Vector3(-R, 0, 0), new THREE.Vector3(R, 0, 0),
    new THREE.Vector3(0, -R, 0), new THREE.Vector3(0, R, 0),
  ], strong);

  // Bounding box
  const box = [];
  for (const z of [Z_FAR, Z_NEAR]) {
    const c = [new THREE.Vector3(-R, -R, z), new THREE.Vector3(R, -R, z), new THREE.Vector3(R, R, z), new THREE.Vector3(-R, R, z)];
    for (let i = 0; i < 4; i++) box.push(c[i], c[(i + 1) % 4]);
  }
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    box.push(new THREE.Vector3(sx * R, sy * R, Z_FAR), new THREE.Vector3(sx * R, sy * R, Z_NEAR));
  }
  seg(box, faint);

  scene.add(g);
}

// ═════════════════════════════════════════════════════════════════════════════
export function initScene(projects, { onSelect } = {}) {
  const canvas = document.getElementById('graph-canvas');
  const hoverEl = document.getElementById('graph-hover');
  const isTouch = window.matchMedia('(hover: none)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.bg);
  const camera = new THREE.PerspectiveCamera(44, canvas.offsetWidth / canvas.offsetHeight, 0.1, 400);

  // On desktop the headline sits bottom-left over the canvas, so the volume is pushed right by
  // shifting the projection rather than the model: the orbit centre stays at the origin.
  function applyViewOffset() {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    if (w >= 900) camera.setViewOffset(w, h, -Math.round(w * 0.23), 0, w, h);
    else camera.clearViewOffset();
  }
  applyViewOffset();

  function fitDistance() {
    const half = R * (window.innerWidth < 900 ? 1.2 : 1.36);
    const tanHalfV = Math.tan((camera.fov * Math.PI) / 360);
    return Math.max(half / tanHalfV, half / (tanHalfV * camera.aspect));
  }

  scene.add(new THREE.AmbientLight('#FFFFFF', 2.8));
  const key = new THREE.DirectionalLight('#FFFFFF', 0.7);
  key.position.set(3, 5, 9);
  scene.add(key);

  addScaffold(scene);

  // ─── Tiles ──────────────────────────────────────────────────────────────────
  const tiles = [];
  const startedAt = performance.now();
  const ordered = [...projects].sort((a, b) => b.axes.reach - a.axes.reach); // nearest first

  ordered.forEach((p, i) => {
    const size = p.selected ? TILE : TILE_SMALL;
    const x = (p.axes.make - 0.5) * 2 * R * 0.88;
    const y = (p.axes.idea - 0.5) * 2 * R * 0.88;
    const z = Z_FAR + p.axes.reach * (Z_NEAR - Z_FAR);

    const geo = new THREE.BoxGeometry(size.w, size.h, size.d);
    const edge = new THREE.MeshBasicMaterial({ color: capColor(p), transparent: true, opacity: 0 });
    const face = new THREE.MeshBasicMaterial({ map: makeFace(p), transparent: true, opacity: 0 });
    const back = new THREE.MeshBasicMaterial({ color: C.faceSmall, transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(geo, [edge, edge, edge, edge, face, back]);
    mesh.position.set(x, y, z);
    mesh.frustumCulled = false;

    // A hairline outline so a white tile reads against a white ground.
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(size.w, size.h)),
      new THREE.LineBasicMaterial({ color: p.selected ? C.ruleStrong : C.ruleMid, transparent: true, opacity: 0 })
    );
    outline.position.z = size.d / 2 + 0.001;
    mesh.add(outline);

    mesh.userData = {
      project: p, face, edge, back, outline,
      scale: makeSpring(1), opacity: 0,
      revealAt: ENTRY_DELAY_MS + i * ENTRY_STAGGER_MS,
    };
    scene.add(mesh);
    tiles.push(mesh);
  });

  // ─── Camera state ───────────────────────────────────────────────────────────
  const zoom = makeSpring(CAM_START_FRAC);
  const theta = makeSpring(START_THETA);
  const phi = makeSpring(START_PHI);
  let depthLabelOpacity = 0;
  let hasInteracted = false;

  function resetView() { zoom.target = CAM_START_FRAC; theta.target = START_THETA; phi.target = START_PHI; }

  // ─── Pointer: drag to orbit ─────────────────────────────────────────────────
  let dragging = false, moved = 0, lastX = 0, lastY = 0;
  function pointerDown(x, y) { hasInteracted = true; dragging = true; moved = 0; lastX = x; lastY = y; }
  function pointerMove(x, y) {
    if (!dragging) return;
    const dx = x - lastX, dy = y - lastY;
    lastX = x; lastY = y;
    moved += Math.abs(dx) + Math.abs(dy);
    theta.target = clamp(theta.target - dx * DRAG_SPEED, -DRAG_MAX_H, DRAG_MAX_H);
    phi.target = clamp(phi.target - dy * DRAG_SPEED, -DRAG_MAX_V, DRAG_MAX_V);
  }
  function pointerUp() { dragging = false; }

  canvas.addEventListener('mousedown', (e) => { pointerDown(e.clientX, e.clientY); canvas.style.cursor = 'grabbing'; });
  window.addEventListener('mousemove', (e) => pointerMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', () => { pointerUp(); canvas.style.cursor = ''; });

  let pinchDist = 0;
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) pointerDown(e.touches[0].clientX, e.touches[0].clientY);
    else if (e.touches.length === 2) {
      dragging = false;
      pinchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    }
  }, { passive: true });
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && dragging) {
      // Horizontal intent orbits; vertical intent is left to the page so the hero never traps scroll.
      const dx = e.touches[0].clientX - lastX, dy = e.touches[0].clientY - lastY;
      if (Math.abs(dx) > Math.abs(dy)) { e.preventDefault(); pointerMove(e.touches[0].clientX, e.touches[0].clientY); }
      else dragging = false;
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      if (pinchDist) zoom.target = clamp(zoom.target - (d - pinchDist) * ZOOM_PINCH_SPEED * 0.02, 0, 1);
      pinchDist = d;
    }
  }, { passive: false });
  canvas.addEventListener('touchend', (e) => { if (e.touches.length === 0) { pointerUp(); pinchDist = 0; } }, { passive: true });

  // The wheel is never captured: this graph sits at the top of a page people need to scroll.
  // Zoom is the two buttons and pinch.

  // ─── Raycasting ─────────────────────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;

  function pickAt(cx, cy) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((cx - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((cy - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(tiles, false);
    return hits.length ? hits[0].object : null;
  }
  function showHover(mesh, cx, cy) {
    if (!hoverEl) return;
    if (!mesh) { hoverEl.hidden = true; return; }
    const { project } = mesh.userData;
    const rect = canvas.getBoundingClientRect();
    hoverEl.innerHTML = '';
    const q = document.createElement('span');
    q.className = 'hl-eyebrow';
    q.textContent = project.client;
    hoverEl.append(q, document.createTextNode(project.headline || project.name));
    hoverEl.hidden = false;
    hoverEl.style.left = `${cx - rect.left}px`;
    hoverEl.style.top = `${cy - rect.top}px`;
  }
  canvas.addEventListener('mousemove', (e) => {
    if (dragging) { if (hoverEl) hoverEl.hidden = true; return; }
    const hit = pickAt(e.clientX, e.clientY);
    if (hit !== hovered) { hovered = hit; canvas.style.cursor = hit ? 'pointer' : ''; }
    showHover(hit, e.clientX, e.clientY);
  });
  canvas.addEventListener('mouseleave', () => { hovered = null; if (hoverEl) hoverEl.hidden = true; });
  canvas.addEventListener('click', (e) => {
    if (moved > 6) return;
    const hit = pickAt(e.clientX, e.clientY);
    if (hit && onSelect) onSelect(hit.userData.project);
  });
  if (isTouch) {
    canvas.addEventListener('touchend', (e) => {
      if (moved > 8 || e.changedTouches.length !== 1) return;
      const t = e.changedTouches[0];
      const hit = pickAt(t.clientX, t.clientY);
      if (hit && onSelect) onSelect(hit.userData.project);
    });
  }

  // ─── Labels ─────────────────────────────────────────────────────────────────
  function project(vec) {
    const v = vec.clone().project(camera);
    return { x: (v.x * 0.5 + 0.5) * canvas.offsetWidth, y: (-v.y * 0.5 + 0.5) * canvas.offsetHeight, behind: v.z > 1 };
  }
  function pinToEdge(ox, oy, tx, ty, m) {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    const dx = tx - ox, dy = ty - oy;
    if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return { x: tx, y: ty };
    let t = Infinity;
    if (dx > 0) t = Math.min(t, (w - m.side - ox) / dx);
    if (dx < 0) t = Math.min(t, (m.side - ox) / dx);
    if (dy > 0) t = Math.min(t, (h - m.bottom - oy) / dy);
    if (dy < 0) t = Math.min(t, (m.top - oy) / dy);
    if (!isFinite(t) || t < 0) return { x: clamp(tx, m.side, w - m.side), y: clamp(ty, m.top, h - m.bottom) };
    return { x: ox + dx * t, y: oy + dy * t };
  }
  function placeLabel(el, x, y, rotate = '') {
    const hw = el.offsetWidth / 2 + 6, hh = el.offsetHeight / 2 + 6;
    const cx = clamp(x, hw, Math.max(hw, canvas.offsetWidth - hw));
    const cy = clamp(y, hh, Math.max(hh, canvas.offsetHeight - hh));
    el.style.transform = `translate(-50%, -50%) translate(${cx}px, ${cy}px) ${rotate}`;
  }
  const endpoints = [
    { id: 'label-understand', pos: new THREE.Vector3(-R * 1.14, 0, 0) },
    { id: 'label-make',       pos: new THREE.Vector3( R * 1.14, 0, 0) },
    { id: 'label-product',    pos: new THREE.Vector3(0, -R * 1.14, 0) },
    { id: 'label-idea',       pos: new THREE.Vector3(0,  R * 1.14, 0) },
  ].map((e) => ({ ...e, el: document.getElementById(e.id) }));
  const systemEl = document.getElementById('label-system');
  const reachEl = document.getElementById('label-reach');
  const farEl = document.getElementById('label-one');
  const nearEl = document.getElementById('label-public');

  function margins() {
    const narrow = window.innerWidth < 900;
    const h = canvas.offsetHeight;
    return narrow
      ? { side: 36, top: 52, bottom: 44 }
      : { side: LABEL_MARGIN, top: LABEL_MARGIN + 24, bottom: Math.round(h * 0.3) };
  }

  // ─── Render loop ────────────────────────────────────────────────────────────
  let rafId = null, running = true, lastTs = performance.now();
  const hero = canvas.closest('#hero') || canvas.parentElement;

  function frame() {
    rafId = requestAnimationFrame(frame);
    if (!running) return;
    const now = performance.now();
    const dt = Math.min(now - lastTs, 100);
    lastTs = now;
    const fade = frameRateAdjusted(0.14, dt);

    tickSpring(zoom, ZOOM_STIFFNESS, ZOOM_DAMPING);
    tickSpring(theta, DRAG_STIFFNESS, DRAG_DAMPING);
    tickSpring(phi, DRAG_STIFFNESS, DRAG_DAMPING);

    const drift = (!hasInteracted && !reduceMotion) ? Math.sin((now - startedAt) / DRIFT_PERIOD_MS * Math.PI * 2) * DRIFT_AMPL : 0;
    const dist = fitDistance() * (CAM_ZOOM_MIN + zoom.current * (CAM_ZOOM_MAX - CAM_ZOOM_MIN));
    const pos = new THREE.Vector3(0, 0, dist);
    pos.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(phi.current, theta.current + drift, 0, 'YXZ')));
    camera.position.copy(pos);
    camera.lookAt(CAM_TARGET);
    camera.updateMatrixWorld();

    const elapsed = now - startedAt;
    tiles.forEach((mesh) => {
      const u = mesh.userData;
      const entry = reduceMotion ? 1 : clamp((elapsed - u.revealAt) / ENTRY_FADE_MS, 0, 1);
      u.opacity += (entry - u.opacity) * fade;
      u.face.opacity = u.opacity; u.edge.opacity = u.opacity; u.back.opacity = u.opacity;
      u.outline.material.opacity = u.opacity * (hovered === mesh ? 1 : 0.9);
      u.outline.material.color.set(hovered === mesh ? capColor(u.project) : (u.project.selected ? C.ruleStrong : C.ruleMid));
      u.scale.target = hovered === mesh ? HOVER_SCALE : 1;
      mesh.scale.setScalar(tickSpring(u.scale, SCALE_STIFFNESS, SCALE_DAMPING));
    });

    const origin = project(CAM_TARGET);
    const m = margins();
    endpoints.forEach(({ el, pos: p }) => {
      if (!el) return;
      const pr = project(p);
      if (pr.behind) { el.style.opacity = 0; return; }
      el.style.opacity = 1;
      // Sit at the axis tip, just outside the volume. Only when the tip has left the viewport
      // (zoomed in, or a narrow screen) does the label slide to the screen edge instead.
      const inside = pr.x >= m.side && pr.x <= canvas.offsetWidth - m.side && pr.y >= m.top && pr.y <= canvas.offsetHeight - m.bottom;
      const at = inside ? pr : pinToEdge(origin.x, origin.y, pr.x, pr.y, m);
      placeLabel(el, at.x, at.y);
    });

    // "system" rides the y axis, just off the Idea end, rotated to match it.
    if (systemEl) {
      const a = project(new THREE.Vector3(0, R * 0.55, 0));
      const b = project(new THREE.Vector3(0, R * 0.95, 0));
      const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      const flip = Math.abs(deg) > 90 ? 180 : 0;
      placeLabel(systemEl, (a.x + b.x) / 2 + 14, (a.y + b.y) / 2, `rotate(${deg + flip}deg)`);
      systemEl.style.opacity = 1;
    }

    // Depth labels appear only once the view is off-axis enough for depth to read.
    const offAxis = Math.abs(theta.current + drift) + Math.abs(phi.current);
    const want = offAxis > DEPTH_LABEL_ANGLE ? 1 : 0;
    depthLabelOpacity += (want - depthLabelOpacity) * frameRateAdjusted(0.09, dt);
    const edgeX = R * 1.04, edgeY = -R * 1.04;
    const a = project(new THREE.Vector3(edgeX, edgeY, Z_FAR));
    const b = project(new THREE.Vector3(edgeX, edgeY, Z_NEAR));
    if (reachEl) {
      reachEl.style.opacity = depthLabelOpacity;
      if (depthLabelOpacity > 0.01 && !a.behind && !b.behind) {
        const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        const flip = Math.abs(deg) > 90 ? 180 : 0;
        placeLabel(reachEl, (a.x + b.x) / 2, (a.y + b.y) / 2 + 18, `rotate(${deg + flip}deg)`);
      }
    }
    if (farEl) { farEl.style.opacity = depthLabelOpacity; placeLabel(farEl, a.x, a.y + 18); }
    if (nearEl) { nearEl.style.opacity = depthLabelOpacity; placeLabel(nearEl, b.x, b.y + 18); }

    renderer.render(scene, camera);
  }

  function onResize() {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    applyViewOffset();
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', onResize);

  function updateRunning() { running = hero.getBoundingClientRect().bottom > 0; }
  window.addEventListener('scroll', updateRunning, { passive: true });
  window.addEventListener('focus', updateRunning);

  renderer.compile(scene, camera);
  frame();

  return {
    /* For tests: where each tile currently is on the canvas, in CSS pixels. */
    screenPositions() {
      const r = canvas.getBoundingClientRect();
      return tiles.map((m) => { const s = project(m.position); return { id: m.userData.project.id, url: m.userData.project.url, selected: m.userData.project.selected, x: r.left + s.x, y: r.top + s.y }; });
    },
    zoomIn() { hasInteracted = true; zoom.target = clamp(zoom.target - ZOOM_STEP, 0, 1); },
    zoomOut() { hasInteracted = true; zoom.target = clamp(zoom.target + ZOOM_STEP, 0, 1); },
    reset() { resetView(); hasInteracted = false; },
    dispose() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updateRunning);
      window.removeEventListener('focus', updateRunning);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    },
  };
}

/* ─── 2D fallback — the same 2×2 as SVG, reach as dot size ─────────────────── */
export function initScatter2D(projects, { onSelect } = {}) {
  const host = document.getElementById('graph-2d');
  const canvas = document.getElementById('graph-canvas');
  canvas.hidden = true;
  host.hidden = false;
  const W = 1000, H = 700, pad = 90;
  const sx = (v) => pad + v * (W - pad * 2);
  const sy = (v) => H - pad - v * (H - pad * 2);
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const svg = [`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Work arranged by understand versus make, and product versus idea">`];
  svg.push(`<line x1="${W / 2}" y1="${pad - 30}" x2="${W / 2}" y2="${H - pad + 30}" stroke="${C.ruleMid}"/>`);
  svg.push(`<line x1="${pad - 30}" y1="${H / 2}" x2="${W - pad + 30}" y2="${H / 2}" stroke="${C.ruleMid}"/>`);
  const label = (x, y, t, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Geist Mono, monospace" font-size="12" letter-spacing="2" fill="${C.ink3}">${t}</text>`;
  svg.push(label(pad - 40, H / 2 - 10, 'UNDERSTAND', 'start'), label(W - pad + 40, H / 2 - 10, 'MAKE', 'end'));
  svg.push(label(W / 2, pad - 40, 'IDEA'), label(W / 2, H - pad + 50, 'PRODUCT'));
  for (const p of projects) {
    const r = (p.selected ? 14 : 7) + p.axes.reach * 10;
    svg.push(`<g class="s2d-node" data-id="${esc(p.id)}" style="cursor:pointer">` +
      `<circle cx="${sx(p.axes.make).toFixed(1)}" cy="${sy(p.axes.idea).toFixed(1)}" r="${r.toFixed(1)}" fill="${capColor(p)}" fill-opacity="${p.selected ? 1 : 0.55}"/>` +
      `<text x="${(sx(p.axes.make) + r + 8).toFixed(1)}" y="${(sy(p.axes.idea) + 4).toFixed(1)}" font-family="Geist, sans-serif" font-size="14" fill="${C.ink2}">${esc(p.name)}</text>` +
      `<title>${esc(p.client)} — ${esc(p.name)}</title></g>`);
  }
  svg.push('</svg>');
  host.innerHTML = svg.join('');
  host.querySelectorAll('.s2d-node').forEach((n) => n.addEventListener('click', () => {
    const p = projects.find((x) => x.id === n.dataset.id);
    if (p && onSelect) onSelect(p);
  }));
  return { screenPositions() { return []; }, zoomIn() {}, zoomOut() {}, reset() {}, dispose() {} };
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}
