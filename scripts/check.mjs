#!/usr/bin/env node
/* check.mjs — this repo's proof. Fails on a scrubbed client name, on first-person singular voice
 * in site copy, or on a required page that is missing. See .claude/memory/DECISIONS.md
 * (2026-09-02, "Voice and imagery" and "The unnamed client") for why each of these is a ruling. */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const SCRUB = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/scrub.json"), "utf8"));
const REQUIRED = ["index.html", "studio/index.html", "contact/index.html", "CNAME", "data/projects.json"];

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

const report = [`# Test report — ${new Date().toISOString()}`, "", `Files scanned: ${files.length}`, `Failures: ${fails.length}`, "", ...fails.map(f => `- ${f}`)].join("\n") + "\n";
fs.mkdirSync(path.join(ROOT, ".claude"), { recursive: true });
fs.writeFileSync(path.join(ROOT, ".claude/TEST-REPORT.md"), report);
console.log(report);
process.exit(fails.length ? 1 : 0);
