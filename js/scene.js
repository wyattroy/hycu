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

// Vendored (vendor/three.module.js, r160) rather than loaded from a CDN: a content blocker
// blanked the whole hero for Wyatt on 2026-09-02, and the graph is the first thing a visitor sees.
import * as THREE from '/vendor/three.module.js';

// ─── Layout ───────────────────────────────────────────────────────────────────
const R = 5.5;             // half-extent of the x/y plane
const Z_FAR = -6;          // one person
const Z_NEAR = 6;          // a public

const SPREAD = 0.88;       // how much of the box the work is spread across
const PHONE_SPREAD = 1.15; // phone tiles are double size, so they are spread further to match

// Cubes — every side the same length, so a tile reads as a solid however the orbit turns it, and
// the coloured thickness that used to be an edge becomes most of what you see of one.
//
// THE EDGE IS THE PLATE'S OLD HEIGHT, so a tile is exactly as tall as it always was and only its
// width comes in. What is drawn is this times tileScale() — 1.5 on desktop and tablet, 2 on a
// phone — so a selected tile is 1.8 across where the plate was 2.05, and reads much heavier for
// having the other two dimensions to match.
//
// The size was picked by shooting it: at 2.05 the cubes are deep enough to sit on one another
// (Pastry Pirates went behind Teaching Forgiveness, Cited by AI behind What They're Buying) and at
// the small end they stop carrying their own names. An earlier pass tuned this number, SPREAD and
// TIP together against how close the MAKE label came to the Teaching Forgiveness tile, and pushed
// the edge down to keep them apart. That was tuning against a rule Wyatt had already struck — a
// label may have a tile under it, the reader turns the volume — and it is unwound. If you find
// yourself shrinking the work to protect a label, read the placement rule further down first.
const TILE = { w: 1.20, h: 1.20, d: 1.20 };        // selected work
const TILE_SMALL = { w: 0.73, h: 0.73, d: 0.73 };  // index

// ─── Palette — the site's own tokens, repeated here because WebGL cannot read CSS ──
const C = {
  bg: '#FFFFFF', // unused since the canvas went transparent; kept for the 2D fallback's white ground
  ink: '#111112',
  ink2: '#59595E',
  ink3: '#9C9CA2',
  rule: '#E8E8EB',
  ruleMid: '#C9C9CE',
  ruleStrong: '#9C9CA2',
  face: '#FFFFFF',
  faceSmall: '#F7F7F8',
  accent: '#7A4FD6',
};

// The one place the site uses colour: a tile's four sides carry the hue of its primary
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

// The face is always drawn FACE_W across, so a size in here is a fraction of the tile's WIDTH in
// world units — halve that width and the type halves on screen with it. These sizes were set
// against the 2.05-wide plate a selected tile used to be (1.25 for an index one), so a cube face,
// being narrower, needs them scaled up or the names shrink with it.
//
// It cannot scale all the way. A name is wrapped, but a single long word cannot be, and
// "Forgiveness" runs out of the padding first. Across all eight names, with the real Geist served
// to the browser: 1.38 clears by 48px, 1.40 by 33px, 1.42 by 10px, and 1.45 overflows by 12px.
// 1.40 is the ceiling taken, for the margin — one number for every tile, because the names have to
// be one size.
//
// Those figures are the second set. The first were taken in a headless browser that could not
// reach fonts.googleapis.com, so every string was measured in Helvetica and came out ~18% narrow;
// they put the cliff at 1.50 rather than between 1.42 and 1.45. The cap survived the correction,
// the evidence for it did not. If you re-measure this, check the font actually loaded first.
const TYPE_REF_W = { big: 2.05, small: 1.25 };
const TYPE_K_MAX = 1.40;

function makeFace(project) {
  const big = project.selected;
  const size = big ? TILE : TILE_SMALL;
  const K = Math.min((big ? TYPE_REF_W.big : TYPE_REF_W.small) / size.w, TYPE_K_MAX);
  const sz = (n) => Math.round(n * K); // `u` is userData elsewhere in this file
  const H = Math.round(FACE_W * (size.h / size.w));
  const cv = document.createElement('canvas');
  cv.width = FACE_W;
  cv.height = H;
  const ctx = cv.getContext('2d');

  ctx.fillStyle = big ? C.face : C.faceSmall;
  ctx.fillRect(0, 0, FACE_W, H);
  ctx.textBaseline = 'top';

  const padX = sz(big ? 56 : 60);
  let y = sz(big ? 50 : 60);

  if (big) {
    ctx.fillStyle = C.ink3;
    ctx.font = `500 ${sz(36)}px ${MONO}`;
    const eyebrow = project.client.toUpperCase().split('').join(' ');
    ctx.fillText(eyebrow, padX, y);
    y += sz(36) + sz(44);
  }

  ctx.fillStyle = big ? C.ink : C.ink2;
  const px = sz(big ? 110 : 96);
  ctx.font = `500 ${px}px ${SANS}`;
  ctx.letterSpacing = `${(-2 * K).toFixed(2)}px`;
  const lines = wrapLines(ctx, project.name, FACE_W - padX * 2);
  for (const l of lines.slice(0, big ? 3 : 2)) { ctx.fillText(l, padX, y); y += px * 1.12; }

  if (big) {
    ctx.fillStyle = C.ink3;
    ctx.font = `400 ${sz(34)}px ${MONO}`;
    ctx.letterSpacing = '0px';
    ctx.fillText(String(project.year), padX, H - sz(50) - sz(34));
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

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); // transparent: the page's gradient shows through
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);

  const scene = new THREE.Scene();
  scene.background = null;
  renderer.setClearColor(0x000000, 0);
  const camera = new THREE.PerspectiveCamera(44, canvas.offsetWidth / canvas.offsetHeight, 0.1, 400);

  // On desktop the headline sits bottom-left over the canvas, so the volume is pushed right by
  // shifting the projection rather than the model: the orbit centre stays at the origin.
  let pinOffsetY = 0;
  function applyViewOffset() {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    if (w >= 900) camera.setViewOffset(w, h, -Math.round(w * 0.23), 0, w, h);
    else camera.clearViewOffset();
    pinOffsetY = 0; // the pin re-measures against the new stage on the next frame
  }
  applyViewOffset();

  // On a phone the canvas keeps a tall 1:2 frame — its framing and its perspective are what the
  // volume was drawn for — and style.css crops it to the height the volume actually needs.
  const phonePortrait = () => window.innerWidth <= 720 && window.innerHeight > window.innerWidth;
  // Phone tiles are drawn double size: at the width the layout gives them, the faces were too
  // small to read. Wide screens draw them half again as big (Wyatt, 2026-09-09, having seen the
  // cubes at 1x: "make the cubes 50% larger on desktop and tablet sizes"). Scale rather than
  // geometry, so a rotation or a resize picks it up live, and so the phone keeps the size it had.
  const tileScale = () => (window.innerWidth <= 720 ? 2 : 1.5);
  // ...and pushed out towards the walls of the box to win back the room the extra size costs.
  const spread = () => (window.innerWidth <= 720 ? PHONE_SPREAD : SPREAD);

  function fitDistance() {
    const half = R * (window.innerWidth < 900 ? 1.55 : 1.36);
    const tanHalfV = Math.tan((camera.fov * Math.PI) / 360);
    return Math.max(half / tanHalfV, half / (tanHalfV * camera.aspect));
  }

  // How much of the canvas the page actually shows: style.css crops the tall phone canvas to the
  // height the volume needs, so the copy can follow it.
  const stageEl = canvas.parentElement;
  const cropHeight = () => Math.min(stageEl ? stageEl.clientHeight : canvas.offsetHeight, canvas.offsetHeight);

  // The corners of the scaffold box. At double size a tile can hang past them, so the pin below
  // measures the tiles too rather than trusting the box to contain them.
  const BOX_CORNERS = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const z of [Z_FAR, Z_NEAR]) BOX_CORNERS.push(new THREE.Vector3(sx * R, sy * R, z));

  scene.add(new THREE.AmbientLight('#FFFFFF', 2.8));
  const key = new THREE.DirectionalLight('#FFFFFF', 0.7);
  key.position.set(3, 5, 9);
  scene.add(key);

  addScaffold(scene);

  // ─── Tiles ──────────────────────────────────────────────────────────────────
  // Reach maps into the box inset by the tile's own half-depth, so a cube sits INSIDE the front
  // and back walls rather than poking out through them. A card's 0.07 of thickness never showed;
  // half a cube's edge, 0.9 once tileScale() has had it, hangs a long way out of a drawn box.
  const tileZ = (p) => {
    const halfD = ((p.selected ? TILE : TILE_SMALL).d / 2) * tileScale();
    return (Z_FAR + halfD) + p.axes.reach * ((Z_NEAR - Z_FAR) - 2 * halfD);
  };

  const tiles = [];
  const startedAt = performance.now();
  const ordered = [...projects].sort((a, b) => b.axes.reach - a.axes.reach); // nearest first

  ordered.forEach((p, i) => {
    const size = p.selected ? TILE : TILE_SMALL;
    const ax = (p.axes.make - 0.5) * 2 * R;
    const ay = (p.axes.idea - 0.5) * 2 * R;
    const x = ax * spread();
    const y = ay * spread();
    const z = tileZ(p);

    const geo = new THREE.BoxGeometry(size.w, size.h, size.d);
    const edge = new THREE.MeshBasicMaterial({ color: capColor(p), transparent: true, opacity: 0 });
    const face = new THREE.MeshBasicMaterial({ map: makeFace(p), transparent: true, opacity: 0 });
    const back = new THREE.MeshBasicMaterial({ color: C.faceSmall, transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(geo, [edge, edge, edge, edge, face, back]);
    mesh.position.set(x, y, z);
    mesh.frustumCulled = false;

    // A hairline around the printed face, so it reads against a white ground when the cube is
    // near enough to face-on that its coloured sides are hidden. The other eight are left
    // undrawn on purpose: a full wireframe over four coloured faces is fussier than Restraint wants.
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(size.w, size.h)),
      new THREE.LineBasicMaterial({ color: p.selected ? C.ruleStrong : C.ruleMid, transparent: true, opacity: 0 })
    );
    outline.position.z = size.d / 2 + 0.001;
    mesh.add(outline);

    mesh.userData = {
      project: p, face, edge, back, outline, ax, ay,
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

  // Rotated labels flip 180° so they read the right way up. Near ±90° a plain threshold flips
  // every frame and the label flickers; keep the last decision until the angle clearly crosses.
  const flipState = {};
  function stableFlip(key, deg) {
    const a = Math.abs(deg);
    // Inside the band on the first frame, read upward (0): deciding on rounding noise there made the
    // label read upward on some page loads and downward on others.
    if (a > 93) flipState[key] = 180; else if (a < 87) flipState[key] = 0; else if (flipState[key] == null) flipState[key] = 0;
    return flipState[key];
  }

  function resetView() { zoom.target = CAM_START_FRAC; theta.target = START_THETA; phi.target = START_PHI; }

  // ─── Pointer: drag to orbit ─────────────────────────────────────────────────
  // A tap opens a study only when it goes down and comes up on the same tile: a finger that
  // starts on the grid and drifts onto a tile while orbiting was opening studies by accident.
  let dragging = false, moved = 0, lastX = 0, lastY = 0, downHit = null;
  function pointerDown(x, y) { hasInteracted = true; dragging = true; moved = 0; lastX = x; lastY = y; downHit = pickAt(x, y); }
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
      downHit = null; // a pinch is never a tap
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
  // A phone has nothing to hover with: the mousemove a tap synthesises would leave the tooltip
  // parked on the tile, with no pointer left to move off it.
  const noHover = () => isTouch || window.innerWidth <= 720;
  canvas.addEventListener('mousemove', (e) => {
    if (noHover()) { hovered = null; if (hoverEl) hoverEl.hidden = true; return; }
    // A drag hides the tooltip but keeps the tile you are dragging from lit: clearing the hover
    // here dropped its growth and its colour mid-drag, on desktop, for no reason anyone asked for.
    if (dragging) { if (hoverEl) hoverEl.hidden = true; return; }
    const hit = pickAt(e.clientX, e.clientY);
    if (hit !== hovered) { hovered = hit; canvas.style.cursor = hit ? 'pointer' : ''; }
    showHover(hit, e.clientX, e.clientY);
  });
  canvas.addEventListener('mouseleave', () => { hovered = null; if (hoverEl) hoverEl.hidden = true; });
  canvas.addEventListener('click', (e) => {
    if (moved > 6) return;
    const hit = pickAt(e.clientX, e.clientY);
    if (hit && hit === downHit && onSelect) onSelect(hit.userData.project);
  });
  if (isTouch) {
    canvas.addEventListener('touchend', (e) => {
      if (moved > 8 || e.changedTouches.length !== 1) return;
      const t = e.changedTouches[0];
      const hit = pickAt(t.clientX, t.clientY);
      if (hit && hit === downHit && onSelect) onSelect(hit.userData.project);
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
  // Where each tile is on the canvas, as a rectangle. (The public screenRects() below is the same
  // measurement in viewport coordinates, for the tests.)
  const scratch = new THREE.Vector3();
  function tileRects() {
    return tiles.map((m) => {
      const size = m.userData.project.selected ? TILE : TILE_SMALL;
      const hw = (size.w / 2) * m.scale.x, hh = (size.h / 2) * m.scale.y, hd = (size.d / 2) * m.scale.z;
      let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
      // All eight corners. A card was its front face; a cube's outline on screen depends on the
      // angle, so measuring the front face alone would let a label sit on the side of one.
      for (const dx of [-hw, hw]) for (const dy of [-hh, hh]) for (const dz of [-hd, hd]) {
        scratch.set(m.position.x + dx, m.position.y + dy, m.position.z + dz).project(camera);
        const x = (scratch.x * 0.5 + 0.5) * canvas.offsetWidth, y = (-scratch.y * 0.5 + 0.5) * canvas.offsetHeight;
        if (x < left) left = x; if (x > right) right = x;
        if (y < top) top = y; if (y > bottom) bottom = y;
      }
      return { left, right, top, bottom };
    });
  }

  function placeLabel(el, x, y, rotate = '') {
    const hw = el.offsetWidth / 2 + 6, hh = el.offsetHeight / 2 + 6;
    const cx = clamp(x, hw, Math.max(hw, canvas.offsetWidth - hw));
    const cy = clamp(y, hh, Math.max(hh, canvas.offsetHeight - hh));
    el.style.transform = `translate(-50%, -50%) translate(${cx}px, ${cy}px) ${rotate}`;
  }
  // Phones see the volume small and nearly face-on, so the labels need more clearance there.
  //
  // This was briefly 1.38 at every width, to push the labels clear of the cubes. That was wrong
  // and is reverted: a label is not required to clear a tile, and buying clearance here walked
  // UNDERSTAND out into the headline's column for nothing. See the placement below for the rule.
  const TIP = window.innerWidth < 900 ? 1.38 : 1.16;
  const endpoints = [
    // On the front face of the volume rather than the mid-depth axis, so a label sits in front of
    // the work at most angles. It is not required to: a tile may end up under one, and the reader
    // turns the volume to read it.
    { id: 'label-understand', pos: new THREE.Vector3(-R * TIP, 0, Z_NEAR) },
    { id: 'label-make',       pos: new THREE.Vector3( R * TIP, 0, Z_NEAR) },
    { id: 'label-product',    pos: new THREE.Vector3(0, -R * TIP, Z_NEAR) },
    { id: 'label-idea',       pos: new THREE.Vector3(0,  R * TIP, Z_NEAR) },
  ].map((e) => ({ ...e, el: document.getElementById(e.id) }));
  const systemEl = document.getElementById('label-system');
  const reachEl = document.getElementById('label-reach');
  const farEl = document.getElementById('label-one');
  const nearEl = document.getElementById('label-public');

  function margins() {
    const narrow = window.innerWidth < 900;
    const h = canvas.offsetHeight;
    // The phone stage hugs the volume, so IDEA and PRODUCT ride its very edges rather than being
    // held off them: the box top is pinned to the top of the stage and the headline follows the
    // bottom of PRODUCT.
    // The canvas runs on below the crop, so the bottom bound is the bottom of the window, not of
    // the canvas: an axis label parked past it would sit behind the headline.
    if (phonePortrait()) return { side: 36, top: 14, bottom: h - cropHeight() + 12 };
    return narrow
      ? { side: 36, top: 52, bottom: 44 }
      : { side: LABEL_MARGIN, top: LABEL_MARGIN + 24, bottom: 120 };
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

    // On a phone the volume is pinned to the top of the stage: the headline follows straight under
    // the PRODUCT label, so slack above the box would read as a hole beneath the nav. The offset is
    // a screen-space shift, so correcting by the measured overshoot lands it exactly, every frame.
    if (phonePortrait()) {
      let top = Infinity, bottom = -Infinity;
      for (const c of BOX_CORNERS) { const y = project(c).y; if (y < top) top = y; if (y > bottom) bottom = y; }
      for (const t of tileRects()) { if (t.top < top) top = t.top; if (t.bottom > bottom) bottom = t.bottom; }
      // Zoomed in, the volume is taller than the window it is cropped to; then it centres in the
      // window instead, so it is trimmed evenly rather than losing its whole underside.
      const crop = cropHeight();
      const want = (bottom - top) <= crop ? top : top - (crop - (bottom - top)) / 2;
      if (Math.abs(want) > 0.5) {
        pinOffsetY += want;
        const w = canvas.offsetWidth, h = canvas.offsetHeight;
        camera.setViewOffset(w, h, 0, pinOffsetY, w, h);
        camera.updateMatrixWorld();
      }
    }

    const elapsed = now - startedAt;
    tiles.forEach((mesh) => {
      const u = mesh.userData;
      const entry = reduceMotion ? 1 : clamp((elapsed - u.revealAt) / ENTRY_FADE_MS, 0, 1);
      u.opacity += (entry - u.opacity) * fade;
      u.face.opacity = u.opacity; u.edge.opacity = u.opacity; u.back.opacity = u.opacity;
      u.outline.material.opacity = u.opacity * (hovered === mesh ? 1 : 0.9);
      u.outline.material.color.set(hovered === mesh ? capColor(u.project) : (u.project.selected ? C.ruleStrong : C.ruleMid));
      u.scale.target = hovered === mesh ? HOVER_SCALE : 1;
      mesh.scale.setScalar(tickSpring(u.scale, SCALE_STIFFNESS, SCALE_DAMPING) * tileScale());
      mesh.position.x = u.ax * spread(); // re-read every frame so a rotation or a resize lands
      mesh.position.y = u.ay * spread();
      mesh.position.z = tileZ(u.project); // the inset depends on tileScale(), which a resize changes
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
      // A label stays on its own axis even when a tile ends up under it (Wyatt, 2026-09-08): the
      // reader can turn the volume, and a label that wandered off its axis stops meaning anything.
      const at = inside ? pr : pinToEdge(origin.x, origin.y, pr.x, pr.y, m);
      placeLabel(el, at.x, at.y);
    });

    // "system" rides the y axis, just off the Idea end, rotated to match it.
    if (systemEl) {
      const a = project(new THREE.Vector3(0, R * 0.55, 0));
      const b = project(new THREE.Vector3(0, R * 0.95, 0));
      const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      const flip = stableFlip('system', deg);
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
        const flip = stableFlip('reach', deg);
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
    /* For tests: each tile's whole cube as a screen-space bounding box, in CSS pixels. */
    screenRects() {
      const r = canvas.getBoundingClientRect();
      return tiles.map((m) => {
        const size = m.userData.project.selected ? TILE : TILE_SMALL;
        const hw = (size.w / 2) * m.scale.x, hh = (size.h / 2) * m.scale.y, hd = (size.d / 2) * m.scale.z;
        const pts = [];
        for (const dx of [-hw, hw]) for (const dy of [-hh, hh]) for (const dz of [-hd, hd]) pts.push(project(new THREE.Vector3(m.position.x + dx, m.position.y + dy, m.position.z + dz)));
        const xs = pts.map((p) => r.left + p.x), ys = pts.map((p) => r.top + p.y);
        return { id: m.userData.project.id, left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
      });
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
  return { screenPositions() { return []; }, screenRects() { return []; }, zoomIn() {}, zoomOut() {}, reset() {}, dispose() {} };
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}
