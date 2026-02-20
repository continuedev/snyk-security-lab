# Hands-On Lab: Put Your First Automated Security Agent to Work

Sign up for Continue, connect this sample repo, and watch two security checks catch real vulnerabilities on your PRs.

## What You'll Build

Two Continue checks that run as GitHub status checks on every PR:

1. **Snyk Security Check** (`.continue/checks/snyk-security.md`): Catches PRs that touch code affected by known Snyk findings (lodash CVE-2021-23337, jsonwebtoken CVE-2022-23529) without fixing them.

2. **Secure Coding Patterns** (`.continue/checks/secure-patterns.md`): Enforces no hardcoded secrets, input validation on all endpoints, parameterized database queries, and auth middleware on all non-public routes.

Both checks are already in this repo. You don't need to write them from scratch. The lab walks you through connecting the repo, opening test PRs, and watching the checks work.

## What's in This Repo

A Node.js/Express REST API with users, products, and authentication. The dependencies include intentionally vulnerable versions of lodash (4.17.20) and jsonwebtoken (8.5.1) that Snyk will flag.

```
├── src/
│   ├── routes/
│   │   ├── auth.js          # Login/signup endpoints
│   │   ├── users.js         # User CRUD (imports lodash, Snyk-flagged)
│   │   └── products.js      # Product endpoints (clean)
│   ├── middleware/
│   │   ├── requireAuth.js   # Auth middleware
│   │   └── validateInput.js # Input validation middleware
│   ├── db/
│   │   └── queries.js       # Database query helpers (parameterized)
│   └── app.js               # Express app setup
├── .continue/
│   └── checks/
│       ├── snyk-security.md     # Check 1: Snyk findings enforcement
│       └── secure-patterns.md   # Check 2: Secure coding standards
├── package.json              # Contains vulnerable dependencies
└── .env.example              # Environment variable template
```

## Prerequisites

- GitHub account
- A Snyk account (free tier works)
## Step 1: Sign Up for Continue

1. Go to [continue.dev](https://continue.dev) and sign up for Mission Control
2. Connect your GitHub account

## Step 2: Fork and Connect the Repo

1. Fork this repo to your GitHub account
2. In Mission Control, connect the forked repo
3. Enable the Snyk integration so Snyk scans the repo and identifies the vulnerable dependencies

**Checkpoint:** You should see Snyk findings for `lodash` and `jsonwebtoken` in your Snyk dashboard.

## Step 3: Review the Checks

Open `.continue/checks/` in your fork. Two checks are already defined:

- **`snyk-security.md`** knows about the specific CVEs in this repo's dependencies. It watches for PRs that modify files associated with those findings and requires either a fix or a documented exception.
- **`secure-patterns.md`** enforces four patterns: no hardcoded secrets, input validation on all endpoints, parameterized queries, and auth middleware.

These are plain markdown files in your repo. Version-controlled, reviewable, editable. This is what standards-as-code looks like.

## Step 4: Open Test PR #1, The Red Check

1. In your fork, open a PR from `test/add-admin-endpoint` to `main`
2. Wait for checks to run (30-60 seconds)
3. **Expected:** The Secure Patterns check flags three issues:
   - Hardcoded API key (`sk_live_...`) on line 7 of `admin.js`
   - Missing `requireAuth` middleware on both route handlers
   - Missing input validation on the POST endpoint
4. Review the suggested fixes and accept them
5. Checks go green

**What you're learning:** The checks caught three issues a human reviewer might or might not have noticed. You reviewed the suggestions and accepted them. This is the "building trust" phase.

## Step 5: Open Test PR #2, Snyk + Pattern Violation

1. Open a PR from `test/update-user-query` to `main`
2. Wait for checks
3. **Expected:**
   - **Snyk Security check fails:** The PR modifies `users.js`, which imports `lodash` 4.17.20 (CVE-2021-23337, critical). The PR doesn't upgrade the dependency. The check suggests bumping to 4.17.21+.
   - **Secure Patterns check fails:** The new `/search` endpoint builds SQL queries with string concatenation. The check suggests parameterized queries.
4. Accept both suggestions
5. Checks go green

**What you're learning:** Two checks, two different kinds of catches, both running automatically. The Snyk check caught something based on external vulnerability data. The patterns check caught something based on your team's coding standards.

## Step 6: Open Test PR #3, The Green Check

1. Open a PR from `test/add-product-search` to `main`
2. Wait for checks
3. **Expected:** Both checks pass. Green checks. No action needed.

**What you're learning:** This is what most of your PRs will look like once the checks are running. Green. Handled. You move on.

## Step 7: Customize (Optional)

Open `.continue/checks/secure-patterns.md` in your fork and add a pattern. Ideas:

- Error responses must not include stack traces
- All new files must include a copyright header
- API responses must use consistent envelope format (`{ data, error, meta }`)

Commit the change, open a quick test PR, and verify the check catches the new pattern.

**What you're learning:** These checks are yours to customize. The patterns you enforce are whatever matters to your team. Adding a rule is adding a paragraph to a markdown file.

## Lab Complete

By the end of this lab you have:

- Two security checks running on your repo as GitHub status checks
- Seen them handle three scenarios (two catches, one clean pass)
- Optionally customized one with a pattern from your own codebase

From here, every PR on your repo gets checked automatically.

**Next step:** Add `.continue/checks/` to your real repo and write checks for the patterns your team actually cares about.
