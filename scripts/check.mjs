#!/usr/bin/env node
/* check.mjs — this repo's proof. Fails on a scrubbed client name, on first-person singular voice
 * in site copy, or on a required page that is missing. See .claude/memory/DECISIONS.md
 * (2026-09-02, "Voice and imagery" and "The unnamed client") for why each of these is a ruling. */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const SCRUB = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/scrub.json"), "utf8"));
const REQUIRED = ["index.html", "work/index.html", "studio/index.html", "contact/index.html", "CNAME", "data/projects.json", "work/pour/index.html", "work/how-to-change-institutions/index.html"];

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "node_modules" || e.name === "scripts") continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(html|js|json|css|md|txt|xml)$/.test(e.name)) files.push(p);
  }
})(ROOT);

const fails = [];
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  const rel = path.relative(ROOT, f);
  for (const term of SCRUB) {
    const re = new RegExp(term, "i");
    const m = text.match(re);
    if (m) fails.push(`${rel}: scrubbed term "${m[0]}"`);
  }
  if (/\.(html|json)$/.test(f)) {
    /* Site copy only: strip tags/attributes, then look for " I " / "I'm" / "my " as a word. */
    const copy = text.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
    const lines = copy.split("\n");
    lines.forEach((line, i) => {
      if (/(^|[\s"(“])(I|I'm|I’m|I've|I’ve|my|My)(?=[\s,.;:!?'’")])/.test(line) && !/tabindex|aria-/.test(line))
        fails.push(`${rel}:${i + 1}: first-person singular: ${line.trim().slice(0, 80)}`);
    });
  }
}
for (const r of REQUIRED) if (!fs.existsSync(path.join(ROOT, r))) fails.push(`missing required file: ${r}`);

// One capability word, and it lives in the data (Wyatt, 2026-09-09). `capabilities[0]` names the
// quadrant a project sits in, colours its cube, and is the exact word the study page and the Work
// card print. Those four drifted apart once already — the pages said "Design research" and "Content
// strategy" where the data said User research and Strategy — so this asserts it rather than trusting
// anyone to remember. The quadrant is read off the axes the way js/scene.js does it: x is
// Understand↔Make, y is Product↔Idea, and the four corners are the four capabilities.
{
  const QUAD = { "-1,-1": "User research", "-1,1": "Strategy", "1,-1": "Product design", "1,1": "Systems design" };
  const projects = JSON.parse(fs.readFileSync(path.join(ROOT, "data/projects.json"), "utf8"));
  const list = Array.isArray(projects) ? projects : projects.projects;
  const cards = fs.readFileSync(path.join(ROOT, "work/index.html"), "utf8");
  for (const p of list) {
    const first = (p.capabilities || [])[0];
    const quad = QUAD[`${p.axes.make >= 0.5 ? 1 : -1},${p.axes.idea >= 0.5 ? 1 : -1}`];
    if (first !== quad) fails.push(`data/projects.json: ${p.id} sits in the ${quad} quadrant but leads with ${first}`);

    const page = fs.readFileSync(path.join(ROOT, `work/${p.id}/index.html`), "utf8");
    const eyebrow = (page.match(/<p class="eyebrow">(.*?)<\/p>/) || [])[1] || "";
    const said = eyebrow.replace(/&middot;/g, "\u00b7").split("\u00b7").map((x) => x.trim()).slice(-2)[0];
    if (said !== first) fails.push(`work/${p.id}/index.html: eyebrow says "${said}", data says "${first}"`);

    const rail = (page.match(/<span class="k">Capabilities<\/span><span>(.*?)<\/span>/) || [])[1];
    const want = (p.capabilities || []).join(", ");
    if (rail !== want) fails.push(`work/${p.id}/index.html: rail says "${rail}", data says "${want}"`);

    const cardCap = (cards.match(new RegExp(`href="/work/${p.id}/">[\\s\\S]*?<span class="year">(.*?)</span>`)) || [])[1];
    if (cardCap !== first) fails.push(`work/index.html: ${p.id} card says "${cardCap}", data says "${first}"`);
  }
}

const report = [`# Test report — ${new Date().toISOString()}`, "", "## Copy check", "", `Files scanned: ${files.length}`, `Failures: ${fails.length}`, "", ...fails.map(f => `- ${f}`)].join("\n") + "\n";
fs.mkdirSync(path.join(ROOT, ".claude"), { recursive: true });
fs.writeFileSync(path.join(ROOT, ".claude/TEST-REPORT.md"), report);
console.log(report);
process.exit(fails.length ? 1 : 0);
