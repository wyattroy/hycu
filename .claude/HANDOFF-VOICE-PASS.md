# Handoff: the voice pass on hycudesign.com

Written 3 September 2026 at the end of a long session, for a session that will start with no
memory of it. Wyatt asked for this file before clearing context, and asked that no voice work
begin until he says so in the new session. **Read this whole file, then ask him to confirm the
open questions at the bottom before editing a single sentence.**

Process rules are not repeated here. Read `.claude/OFFICERS.md` (including the two
working-directory incidents), `.claude/memory/DECISIONS.md`, and the top of
`.claude/CEO-REVIEWS.md` first. The short version: every push is gated on a fresh CEO verdict
recorded with `reviewed-commit:`, staging is by path and never `git add -A`, and no command ever
`cd`s out of this repo.

---

## 1. The repo is not clean, and some of the changes are Wyatt's

Twelve files are modified and uncommitted. **Do not `git add -A`, and do not assume the tree is
yours.** Two separate bodies of work are sitting in it:

**The AI set (mine, finished, awaiting his "go" for CEO review and push).** It is the work he
asked for after saying his core competency is now designing AI pipelines for automation and
training:

| File | What is in it |
|---|---|
| `index.html` | the `cap-bar` and `cap-ground` block under the four capability columns **plus, separately, Wyatt's own copy edits (see below)** |
| `studio/index.html` | the same block, and a new `#ai` section, "How we use AI" |
| `style.css` | `.cap-bar`, `.cap-ground`, `.cap-dots` |
| `data/projects.json` | ClaudeKit's `reach` raised from 0.14 to 0.8 so its tile comes forward |
| `work/index.html` | ClaudeKit moved to second position |
| `work/spatial-equity`, `work/oral-care-research`, `work/polycam`, `work/forgiveness`, `work/pour`, `work/how-to-change-institutions` | one or two sentences each naming the AI work already inside that project |

**Wyatt's own edits, inside `index.html`, which are his to commit.** He edits copy through the
inline editor at `npm run edit` (127.0.0.1:8788) while a session works. In `index.html` he
changed the hypercube heading to "Hycu is short for hypercube.", rewrote the opening of that
paragraph, and changed the contact copy to "Say hi. We'd love to hear what you're working on."
with the button reading "Reach out". **Leave those hunks unstaged.** Splitting a file by hunk:
write the hunks you want to `/tmp/x.patch` with the diff header and apply with
`git apply --cached --unidiff-zero`. There is a worked example in the session's scratchpad, and
CEO Review 9 exists because a `git add -A` once swept his edits into a session commit.

## 2. The voice brief

He asked, in his words: *"I want the tone to be professional wyatt, not warm wyatt. but it
should still read as me. the forgiveness-platform proposal is the best example of this."*

### The measurement, and a correction to it

I first told him the site's problem was contractions and sentence length. **That was measured
against the wrong target and I told him so.** Those numbers came from the `my-writing-style`
skill, which describes his *warm* register. Measured against his own *professional* writing, the
site already matches:

| | Site | Professional Wyatt |
|---|---|---|
| Mean sentence | 16.2 words | 17.0 words |
| Sentences with contractions | 14% | 16% |
| Em-dashes | 0 | 0 |

Sources measured for the right-hand column, all readable, all his: `polycam-outreach/README.md`
and `HANDOFF.md`, `forgiveness-platform/README.md` and `.planning/PROJECT.md`,
`floss/site/README.md`. **Re-measure before starting; the script is trivial and the numbers are
the brief.**

### What is actually wrong: rhetoric the site has and he does not

1. **The aphoristic landing.** A paragraph builds and lands on a short flat declarative. Twelve
   of them. "That is the intervention." "The screen is how it stays visible." "That process
   became ClaudeKit." "It ran the making of this site." His skill names this shape and says to
   replace it with the actual reason underneath it.
2. **"Not X but Y."** Seven instances. His skill: *"Fine once. A tic by the third time."*
   Examples on the site: "not a deck to admire", "not as a novelty but as the machinery", "not
   the code", "was not a wall to push against".
3. **Sentences opening "That is / This is / Which is."** Eight.

### What he does that the site does not

These are the traits that make his professional writing sound like him, quoted from his own
files so the next session can match them rather than approximate them:

- **He names the person and what they asked for.** *"Alicia Bruckman, Polycam's CMO, asked Wyatt
  for a spreadsheet of outlets to contact. He said he could do better and also write what to say
  to each one."* The site's studies say "the team asked us" and name almost nobody. Note the
  constraint: names on the site are governed by his ruling in DECISIONS.md, so **ask him before
  adding any name.**
- **He admits what did not work, in the main narrative.** *"An earlier draft was both and was cut
  for it."* *"the usual Whisper route did not work."* *"the cloud session simply could not reach
  them."* Eight studies on this site and almost no failure in any of them.
- **He names limits plainly and early, without drama.** *"Two known limits: there is no speaker
  diarization, so segments are unlabelled, and proper nouns are unreliable."*
- **He states a constraint as a fact and moves on.** No build-up, no payoff.

### The reference document you still need

He named the **forgiveness-platform Scope & Process Plan** as the best example of the target
register. It is at `forgiveness-platform/plan/index.html`, AES-encrypted, password `reach`. **I
tried to open it with a headless browser and the action was correctly blocked**, because a script
entering a password against encrypted content is exactly what that guard is for. I did not work
around it. **Ask Wyatt to paste the text, to unlock it himself, or to approve another route.**
Do not automate the password. Until it is in hand, the traits above are the brief.

## 3. What the pass should and should not do

Do: remove the twelve aphoristic landings by replacing each with the reason underneath it; cut
the "not X but Y" constructions down to at most one on the whole site; let two or three studies
say what did not work, where it is true; keep the professional register, since the numbers say it
is already right.

Do not: add warmth, exclamation, or delight. He ruled explicitly against warm Wyatt for this
site. Do not add names. Do not touch the scrub rules around the oral-care client. Do not rewrite
Wyatt's own card text in `work/index.html` without asking, since he wrote it.

Verification is the same as everywhere else in this repo: `npm run check` and `npm test` (needs
`npm run serve` on 8787), then a fresh CEO before any push.

## 4. Open questions for Wyatt, ask before starting

1. The AI set is finished and uncommitted. Does it go through the CEO and get pushed first, or
   does the voice pass happen on top of it and both ship together?
2. The forgiveness proposal text, per section 2. How does he want it delivered?
3. Should any study gain a real failure that is not yet written down, and if so which? The
   candour trait needs true material and only he has it.
4. The ClaudeKit study never says the repo is public, although its graph position now claims a
   public reach. He was offered a line saying so and has not answered.

## 5. Not part of this, already settled

The 3D graph blur he reported was localhost-only and resolved itself; he confirmed it never
appeared on the live site. **No camera or anisotropy change was made, and none is wanted.** The
composition on the home page is approved as it stands.
