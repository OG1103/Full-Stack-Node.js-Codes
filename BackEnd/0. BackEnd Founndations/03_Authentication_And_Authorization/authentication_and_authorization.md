# 3. Authentication & Authorization

Authentication and authorization are the two most commonly confused concepts in backend security. They solve distinct problems and are implemented by distinct mechanisms.

---

## 3.1 Authentication vs Authorization

- **Authentication (AuthN):** "Who are you?" — verifying the identity of the entity making the request. The result is a verified identity (user ID, service account, etc.).
- **Authorization (AuthZ):** "What are you allowed to do?" — determining whether the verified identity has permission to perform the requested action on the requested resource.

All authorization depends on successful authentication first. You cannot decide what someone is allowed to do until you know who they are.

---

## 3.2 Session-Based Authentication

In session-based authentication, the server is stateful — it maintains a record of active sessions.

How it works:
1. User submits credentials (username + password)
2. Server verifies credentials and creates a session record in a session store (database, Redis)
3. Server returns a session ID to the client, stored in an HTTP cookie
4. On every subsequent request, the browser automatically sends the cookie
5. Server looks up the session ID in the store to retrieve the user's identity
6. On logout, the server deletes the session record — the session is immediately invalidated

| Aspect | Detail |
|---|---|
| State lives | On the server (session store) |
| Revocation | Instant — delete the session record |
| Horizontal scaling | Hard — all instances must share the same session store (e.g., Redis) |
| Best fit | Traditional web apps, monoliths with a shared session store |

---

## 3.3 Token-Based Authentication (JWT)

In token-based authentication, the server is stateless — it does not store session records. Instead, it issues a signed token that the client stores and presents on each request.

A JWT (JSON Web Token) has three parts, Base64-encoded and dot-separated:
- **Header:** Algorithm used for signing (e.g., HS256, RS256)
- **Payload:** Claims — the data embedded in the token (user ID, roles, expiry time)
- **Signature:** A cryptographic signature that allows the server to verify the token was not tampered with

How it works:
1. User submits credentials
2. Server verifies credentials and issues a signed JWT
3. Client stores the JWT (localStorage or HTTP-only cookie)
4. On every subsequent request, client sends the JWT in the `Authorization: Bearer <token>` header
5. Server verifies the signature — no database lookup required
6. On logout, the client discards the token (but the server cannot force invalidation before expiry)

| Aspect | Detail |
|---|---|
| State lives | In the token (on the client) |
| Revocation | Difficult — requires a token blacklist, which reintroduces state |
| Horizontal scaling | Easy — any instance can verify any token independently |
| Best fit | Microservices, stateless APIs, mobile apps, cross-domain authentication |

---

## 3.4 Sessions vs Tokens: Decision Framework

| Factor | Session-Based | Token-Based (JWT) |
|---|---|---|
| Revocation needed | Yes — instant revocation required | No — acceptable for short-lived tokens |
| Architecture | Monolith or shared session store | Microservices or stateless API |
| Clients | Web browser (cookie-native) | Mobile, SPA, cross-domain |
| Scalability | Requires sticky sessions or shared store | Stateless, scales horizontally freely |
| Security on logout | Server-side invalidation is guaranteed | Client-side discard only |

---

## 3.5 OAuth 2.0

OAuth 2.0 solves the problem of **delegated authorization** — allowing a third-party application to access a user's resources on another service, without the user sharing their credentials with that third party.

The four roles:
- **Resource Owner:** The user who owns the data (e.g., the person with a Google account)
- **Client:** The application requesting access (e.g., your app wanting to read the user's Google contacts)
- **Authorization Server:** The server that authenticates the user and issues tokens (e.g., Google's OAuth server)
- **Resource Server:** The API that holds the protected resources (e.g., Google Contacts API)

The Authorization Code Flow (the most secure and common flow):

```
User clicks "Login with Google" in your app
        |
        v
Your app redirects user to Google's Authorization Server
        |
        v
User logs in to Google and consents to permissions
        |
        v
Google redirects back to your app with an authorization code
        |
        v
Your app's server exchanges the code for an access token
(server-to-server, code never exposed to browser)
        |
        v
Your app uses the access token to call Google APIs on the user's behalf
```

Use OAuth for "Login with Google/GitHub/Facebook" and any case where your app needs to access data on another service. Do not build your own credential-sharing mechanism when OAuth exists.

---

## 3.6 Single Sign-On (SSO)

SSO allows a user to authenticate once and access multiple applications without re-authenticating for each one. A user logs in to an Identity Provider (IdP) and that login session is recognized by all connected applications (Service Providers).

SSO is built on top of protocols like OAuth 2.0 + OpenID Connect (OIDC) or SAML. It is most common in enterprise environments where employees use one set of credentials across dozens of internal tools (HR system, project management, dev tools, etc.).

The key concept: the Identity Provider holds the session, not the individual applications. Applications trust the IdP's assertion of identity.

---

## 3.7 Role-Based Access Control (RBAC)

RBAC is the most widely used authorization model. It structures permissions around three concepts:

```
Users  →  Roles  →  Permissions  →  Resources/Actions

Example:
  User "Alice"  →  Role "Editor"  →  Permission "articles:write"  →  Resource "/articles"
  User "Bob"    →  Role "Viewer"  →  Permission "articles:read"   →  Resource "/articles"
```

| Model | Description | Best Fit |
|---|---|---|
| RBAC | Permissions assigned to roles; users get roles | Most web applications |
| ABAC (Attribute-Based) | Permissions based on attributes of user, resource, and environment | Complex, fine-grained policies |
| ACL (Access Control List) | Explicit list of who can do what to each resource | File systems, document sharing |

RBAC scales better than raw boolean flags on user records. As the application grows, adding a new role is far easier than updating every user record.

---

## 3.8 Password Security Principles

Passwords must never be stored in plain text. The correct approach is one-way hashing, not reversible encryption.

| Concept | Description |
|---|---|
| Plain text | Never acceptable. A database breach exposes all passwords immediately. |
| Symmetric encryption | Reversible. The encryption key becomes a single point of compromise. |
| Hashing (SHA-256) | One-way. But fast — an attacker can compute billions of hashes per second. |
| Hashing + Salt | A random value prepended to the password before hashing. Prevents rainbow table attacks (pre-computed hash lookups). |
| bcrypt / Argon2 | Purpose-built password hashing. Intentionally slow (configurable cost factor). Makes brute force impractical. The correct choice. |

The key principle: use an intentionally slow algorithm. Fast hash functions (SHA-256, MD5) are efficient for data integrity checks — that efficiency is a vulnerability when hashing passwords. bcrypt and Argon2 are designed to remain slow even as hardware improves, by tuning the cost factor upward.

> For the bcrypt implementation in Node.js, see `4. Libraries/04_Bcrypt/`.
