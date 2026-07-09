# 4. Security

Backend security is not a feature to add at the end — it is a discipline applied throughout the design and development process. The attacker's perspective is: every input is potentially malicious, every endpoint is a potential entry point.

---

## 4.1 The Threat Model Mindset

**Defense in depth:** Layer multiple independent controls so that no single failure results in a full compromise. A SQL injection filter at the router layer is good; parameterized queries at the database layer is also required. If one layer fails, the next layer still holds.

**Principle of least privilege:** Every component, user, and service should have access to only what it needs to perform its function — nothing more. A background job that only reads from a database should not have write permissions.

**Attack surface reduction:** Every endpoint, dependency, and configuration option is a potential attack vector. Disabling unused features, removing unnecessary dependencies, and restricting access are all forms of attack surface reduction.

---

## 4.2 OWASP Top 10

The Open Web Application Security Project (OWASP) maintains the most widely referenced list of critical web application security risks.

| # | Category | What it is | Class of defense |
|---|---|---|---|
| 1 | Broken Access Control | Users acting outside their intended permissions | Enforce authZ server-side on every request |
| 2 | Cryptographic Failures | Weak/missing encryption for sensitive data in transit or at rest | Use TLS, strong algorithms, proper key management |
| 3 | Injection | User input interpreted as code/commands | Parameterized queries, strict input validation |
| 4 | Insecure Design | Architecturally unsound security — no threat modeling | Threat model during design, not after |
| 5 | Security Misconfiguration | Default credentials, verbose errors, unnecessary features enabled | Harden configs, disable defaults, principle of least privilege |
| 6 | Vulnerable Components | Using libraries with known vulnerabilities | Audit dependencies, keep them updated |
| 7 | Auth Failures | Weak session management, weak passwords, credential exposure | Strong auth mechanisms, MFA, account lockout |
| 8 | Data Integrity Failures | Unverified updates to data or code (CI/CD pipeline attacks) | Verify integrity of code and data updates |
| 9 | Logging & Monitoring Failures | Inability to detect or respond to breaches | Structured logging, alerting on anomalies |
| 10 | SSRF | Server tricked into making requests to internal resources | Validate and restrict outbound request targets |

---

## 4.3 Injection Attacks

Injection is the class of vulnerabilities where unsanitized user input is interpreted as code or commands by an interpreter (SQL engine, shell, LDAP directory, NoSQL query engine).

**Root cause:** User-supplied data is concatenated directly into a query or command string.

**Universal defense:**
1. **Parameterized queries / prepared statements:** The query structure is defined separately from user input. The database engine always treats user input as data, never as SQL syntax.
2. **Input validation:** Reject inputs that do not conform to expected types, formats, and ranges before they reach the query layer.

All injection variants (SQL, NoSQL, command injection, LDAP injection) share the same root cause and the same conceptual defense.

---

## 4.4 Cross-Site Scripting (XSS)

XSS is a client-side attack enabled by a server-side failure. The server reflects user-supplied input back to the browser as executable HTML/JavaScript.

| Type | How it works |
|---|---|
| Stored XSS | Malicious script saved to the database; served to all users who view the affected content |
| Reflected XSS | Malicious script in the URL; server reflects it back in the response |
| DOM-based XSS | Client-side JavaScript reads attacker-controlled data (e.g., URL hash) and writes it to the DOM |

**Defenses:**
- **Output encoding:** Escape user-supplied data before inserting it into HTML (convert `<` to `&lt;`, etc.)
- **Content Security Policy (CSP):** HTTP response header that tells the browser which script sources are trusted. Inline scripts and eval are blocked by default.
- Never trust user-supplied HTML content. If rich text is required, use a strict allowlist-based sanitizer.

---

## 4.5 Cross-Site Request Forgery (CSRF)

CSRF exploits the fact that browsers automatically attach cookies to every request to a domain, regardless of which site triggered the request. An attacker can craft a page that causes the victim's browser to send a request to the victim's bank as if the victim intended it.

**CSRF is only a risk with cookie-based authentication.** If authentication uses `Authorization: Bearer` headers (JWT), CSRF is not possible because the attacker's page cannot set custom headers on cross-origin requests.

**Defenses for cookie-based auth:**
- **CSRF token:** A random, unpredictable token embedded in each form/request. The server validates that the token matches what it issued. An attacker cannot read this token from another origin.
- **SameSite cookie attribute:** `SameSite=Strict` or `SameSite=Lax` instructs the browser not to send the cookie on cross-site requests. The simplest and most effective modern defense.
- **Check `Origin` / `Referer` headers:** Reject requests that did not originate from the expected domain.

---

## 4.6 CORS

The **Same-Origin Policy** is a browser security mechanism that blocks JavaScript on one origin from reading responses from a different origin. An origin is defined as `scheme + hostname + port`.

CORS (Cross-Origin Resource Sharing) is the mechanism by which a server grants specific origins permission to relax this restriction. The server communicates this via HTTP response headers.

Key concepts:
- CORS is enforced by **the browser** — server-to-server calls are not subject to CORS
- **Preflight requests:** Before sending requests with custom headers or non-simple methods, the browser sends an `OPTIONS` request to ask the server if the actual request is permitted
- **Wildcard `*`:** Allowing all origins (`Access-Control-Allow-Origin: *`) disables the protection. Never use `*` on authenticated endpoints.
- CORS is about reading the response — it does not prevent the request from being made (that is what CSRF protection handles)

---

## 4.7 HTTPS and Transport Security

TLS (Transport Layer Security, the successor to SSL) provides three properties for data in transit:
- **Confidentiality:** Data is encrypted — eavesdroppers cannot read it
- **Integrity:** Data cannot be modified in transit without detection
- **Authentication:** The server's certificate proves its identity — the client knows it is talking to the real server, not an impersonator

**HSTS (HTTP Strict Transport Security):** An HTTP response header that tells browsers to always use HTTPS for this domain, even if the user types `http://`. Prevents SSL-stripping attacks where an attacker downgrades the connection to plain HTTP.

HTTP should never be used for any endpoint that handles authentication, personal data, or sensitive business logic. Even for entirely public APIs, HTTPS is the baseline expectation.

---

## 4.8 Rate Limiting and Throttling

Without rate limiting, any endpoint can be abused by:
- **Brute force:** Trying thousands of password/token combinations per second
- **Credential stuffing:** Using leaked username/password pairs from other breaches
- **DDoS (Distributed Denial of Service):** Flooding a server with requests to exhaust its resources

**Token bucket algorithm (conceptual):** Each client has a "bucket" that holds tokens up to a maximum. Tokens refill at a fixed rate (e.g., 10 per second). Each request consumes one token. When the bucket is empty, requests are rejected (429 Too Many Requests). This allows short bursts while enforcing a sustained rate.

**Leaky bucket algorithm (conceptual):** Requests are placed in a queue (the bucket) and processed at a fixed output rate. Excess requests overflow and are rejected. This enforces a perfectly smooth rate without allowing bursts.

Rate limiting can be applied at different granularities: per IP address, per user account, per API key, or globally per endpoint.

---

## 4.9 Input Validation Principles

**Always validate on the server.** Client-side validation is a UX convenience — it can be bypassed instantly by any tool that can send HTTP requests (curl, Postman, a custom script).

**Whitelist over blacklist:** Define the set of valid inputs and reject everything else. Blacklisting dangerous inputs requires knowing all possible attack patterns — an enumeration that is always incomplete.

The validation hierarchy:
1. **Type:** Is it a string, number, boolean?
2. **Format:** Does it match the expected pattern (email regex, UUID format, date string)?
3. **Range:** Is a number within acceptable bounds? Is a string within the max length?
4. **Business rules:** Does the value make sense in the business context?

Validation should happen at the system's entry point — before any processing begins.

---

## 4.10 Secrets Management

Secrets are credentials that grant access to protected systems: database passwords, API keys, signing keys, certificates. They require special handling because their exposure leads to direct compromise.

| Practice | Description |
|---|---|
| Never hardcode secrets | A secret in source code is a secret shared with everyone who has ever cloned the repository, including its entire git history |
| Environment variables | The minimum standard — inject secrets at runtime from the environment, not from source code |
| Secret rotation | Secrets should be changed periodically, and immediately upon suspected compromise |
| Least privilege | API keys and database credentials should have only the permissions they need |
| Secrets managers | AWS Secrets Manager, HashiCorp Vault — centralized, audited, automated rotation for production systems |

> For environment variable usage in Node.js, see `1. Node/05_Environment_Variables/`.
