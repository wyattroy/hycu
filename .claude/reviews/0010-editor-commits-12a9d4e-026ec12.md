## Review 10 — 2026-09-02 · editor commits 12a9d4e + 026ec12
reviewed-commit: 026ec12
**One sentence:** *"HOLD — the sweeping-in-Wyatt's-edits fault is genuinely fixed and the Send/Origin fixes are real and tested, but the second commit (026ec12) swaps the editor's 'refuse when the text is ambiguous' rule for a guess that is provably wrong on the home page's own tagline, and that commit carries a test report that ran before its code existed."* **HOLD.**

- **Asked for / delivered:** drag-select PARTIAL (hero proven in repo; cards still HY-18); HTTPS DONE (recorded); "are you seeing my edits" answered consistently with the tree. HY-16 DONE and tested; HY-11 DONE and tested; nbsp strip untested.
- **Delivered but not asked for:** nth-occurrence saving, which introduced the fault: the client counts identical elements, the server counts substrings, so the tagline (also inside the meta description) would rewrite the meta tag and report "Saved". GitHub itself committed a CNAME delete/create to origin/main when the domain was re-entered; branches diverged; a rebase is needed before any push.
- **Unsupported claims:** "proven on a real duplicate" true for one case, hiding the general one; the test report in 026ec12 predates its code; the in-repo test depends on another project's node_modules.
- **Recurrence:** the add -A sweep is fixed; the stale-report / terminal-proof habit recurred.
- **Working session's response (next commit):** matching is now element-level (outerHTML, tag and attributes included) and refuses unless the page's count of identical elements equals the file's; `scripts/edit-test.mjs` now edits the tagline and asserts the meta tag is untouched, and edits the last of two identical tags and asserts one landing on the last tag; rebased onto origin/main.
