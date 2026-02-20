## Snyk Security Check

Ensure Snyk findings are addressed before code merges.

### What to check:
- Does this PR modify files associated with open Snyk findings (critical or high severity)?
- If yes, does the PR include a fix for the finding (e.g., dependency version bump, code change)?
- If the finding is not addressed, suggest a specific fix.

### Known findings in this repo:
- `lodash` 4.17.20: CVE-2021-23337 (command injection, critical). Fix: upgrade to 4.17.21+
- `jsonwebtoken` 8.5.1: CVE-2022-23529 (insecure key handling, high). Fix: upgrade to 9.0.0+

### How to respond:
- If no open Snyk findings affect the changed files: pass with a brief note.
- If a finding exists and the PR addresses it: pass and note what was resolved.
- If a finding exists and is NOT addressed: fail with a suggested fix and link to the CVE.
