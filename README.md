# Continue + Snyk Security Lab

Sample Node.js/Express app for the Continue + Snyk hands-on lab.

## What's in this repo

A basic REST API with users, products, and authentication. The repo has intentionally vulnerable dependencies (lodash, jsonwebtoken) that Snyk will flag, plus `.continue/checks/` with two security checks.

## Checks

- **snyk-security.md**: Catches PRs that touch code affected by known Snyk findings without fixing them
- **secure-patterns.md**: Enforces no hardcoded secrets, input validation, parameterized queries, and auth middleware

## Test branches

- `test/add-admin-endpoint`: Should fail (hardcoded API key, missing auth)
- `test/update-user-query`: Should fail (SQL concatenation, touches Snyk-flagged file)
- `test/add-product-search`: Should pass (clean code, proper patterns)
