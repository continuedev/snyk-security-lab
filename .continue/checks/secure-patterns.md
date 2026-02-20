## Secure Coding Patterns

Enforce our team's secure coding standards on every PR.

### Patterns to enforce:

1. **No hardcoded secrets:** API keys, tokens, passwords, and connection strings must come from environment variables, not be hardcoded in source files. Flag any string that looks like a secret (long alphanumeric strings, strings prefixed with sk_, pk_, key_, etc.).

2. **Input validation required:** All new API route handlers must validate their input using the `validateInput` middleware or explicit validation. Flag new endpoints that accept user input without validation.

3. **Parameterized database queries:** All database queries must use parameterized statements (`pool.query(sql, params)`). Flag any query that uses string concatenation or template literals to build SQL.

4. **Auth middleware required:** All non-public endpoints must use the `requireAuth` middleware. Flag new route handlers that don't include authentication.

### How to respond:
- If all patterns are followed: pass.
- If a violation is found: fail with a suggested fix showing the correct pattern.
