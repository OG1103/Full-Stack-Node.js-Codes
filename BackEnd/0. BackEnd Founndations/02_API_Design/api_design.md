# 2. API Design

An API (Application Programming Interface) is a formal contract between a backend system and its consumers. Good API design is about making that contract consistent, predictable, and durable — the specific language or framework used to implement it is secondary.

---

## 2.1 What an API Is

An API defines the inputs a consumer can provide and the outputs they can expect, while hiding all implementation details behind a stable interface. This hiding of internals is what allows the backend to evolve (swap databases, change business logic, refactor internals) without breaking the consumers that depend on it.

The three dominant API paradigms, and what each optimizes for:

| Paradigm | Model | Optimizes For | Best Fit |
|---|---|---|---|
| REST | Resources identified by URLs; actions via HTTP methods | Simplicity, cacheability, wide tooling support | CRUD-heavy web APIs, public-facing APIs |
| RPC (gRPC) | Functions/procedures called remotely | Performance, strong typing, streaming | Internal service-to-service communication |
| GraphQL | Single endpoint; client specifies exact data shape | Flexible querying, reducing over/under-fetching | Complex frontends with varied data needs |

---

## 2.2 REST Principles

REST (Representational State Transfer) is not a protocol or a standard — it is an architectural style with six constraints. An API is "RESTful" to the degree it satisfies these constraints. In practice, REST is a spectrum.

The six constraints:
1. **Client-Server:** Separation of concerns between UI and data storage. The client does not need to know how data is stored; the server does not need to know how it is displayed.
2. **Stateless:** Every request from the client must contain all information needed to process it. The server holds no client session state.
3. **Cacheable:** Responses must declare whether they are cacheable. This enables clients and intermediaries (CDNs, proxies) to cache responses and reduce server load.
4. **Uniform Interface:** The most defining constraint. Resources are identified by URIs, manipulated through representations, messages are self-descriptive, and hypermedia links guide navigation.
5. **Layered System:** A client cannot tell whether it is connected directly to the server or to an intermediary (load balancer, cache, API gateway). Each layer only knows about the adjacent layer.
6. **Code on Demand (optional):** Servers can extend client functionality by sending executable code (e.g., JavaScript). Rarely used in practice.

---

## 2.3 Resource Naming Conventions

URLs should identify **resources** (things), not **actions** (verbs). The HTTP method already expresses the action.

| Pattern | Correct | Incorrect |
|---|---|---|
| Use nouns | `/users` | `/getUsers` |
| Use plural | `/users/42` | `/user/42` |
| Nested resource | `/users/42/orders` | `/getUserOrders?id=42` |
| Action via method | `DELETE /users/42` | `/deleteUser/42` |
| Lowercase + hyphens | `/product-categories` | `/productCategories` |
| Filter via query params | `/users?role=admin` | `/adminUsers` |

Nested resources should be used when the child resource only makes sense in the context of the parent. However, nesting deeper than two levels (e.g., `/users/42/orders/7/items`) becomes unwieldy — consider flattening at that point.

---

## 2.4 HTTP Methods as Semantic Verbs

HTTP methods carry semantic meaning that clients, servers, proxies, and caches all rely on.

| Method | Meaning | Idempotent | Safe | Body |
|---|---|---|---|---|
| GET | Read a resource | Yes | Yes | No |
| POST | Create a resource or trigger an action | No | No | Yes |
| PUT | Replace a resource entirely | Yes | No | Yes |
| PATCH | Partially update a resource | No* | No | Yes |
| DELETE | Remove a resource | Yes | No | No |

**Idempotent** means calling the operation N times produces the same result as calling it once. This matters for retry logic: if a network request times out, it is safe to retry idempotent methods without risk of unintended side effects.

**Safe** means the operation does not modify server state. Safe methods can be freely cached and prefetched.

---

## 2.5 Status Codes as a Contract

Status codes communicate the outcome of a request. They are part of the API contract — clients should be able to rely on them to take action without parsing the body.

| Range | Meaning | Examples |
|---|---|---|
| 2xx | Success | 200 OK, 201 Created, 202 Accepted, 204 No Content |
| 3xx | Redirect | 301 Moved Permanently, 304 Not Modified |
| 4xx | Client error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests |
| 5xx | Server error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

**Anti-pattern:** Returning `200 OK` with `{ "success": false, "error": "..." }` in the body. This forces clients to parse every body to know if the request succeeded, breaks HTTP-level monitoring tools, and violates the purpose of status codes.

---

## 2.6 API Versioning Strategies

APIs evolve. Changes that remove or alter existing fields/endpoints break existing consumers. Versioning gives consumers time to migrate.

| Strategy | Example | Pros | Cons |
|---|---|---|---|
| URL path | `/v1/users`, `/v2/users` | Explicit, easy to test in browser | URL is not purely a resource identifier |
| Request header | `Accept: application/vnd.myapi.v2+json` | Keeps URLs clean | Harder to test, less visible |
| Query parameter | `/users?version=2` | Easy to add | Can be accidentally omitted/cached |

URL path versioning is the most widely used in practice due to its explicitness. The most important rule: **never make breaking changes to an existing version**. A breaking change is any change that requires existing consumers to update — removing a field, renaming a field, changing a data type, removing an endpoint.

---

## 2.7 Pagination Patterns

Returning all records in a single response is not viable at scale. Three strategies exist:

| Strategy | How it works | Pros | Cons |
|---|---|---|---|
| Offset / Limit | `?offset=20&limit=10` — skip N records, take M | Simple to implement | Page drift on live data (records inserted mid-browse shift pages) |
| Cursor-based | `?cursor=eyJpZCI6NDJ9&limit=10` — opaque pointer to last seen item | Stable for live data feeds | Requires a sortable unique field; cannot jump to arbitrary pages |
| Keyset | `?after_id=42&limit=10` — filter by last seen key value | Highly performant at scale; database-index-friendly | Only supports sequential navigation |

For most CRUD APIs: offset/limit. For real-time feeds or large datasets: cursor or keyset.

> For the Express/Mongoose implementation, see `2. Express/11_Pagination/`.

---

## 2.8 Response Envelope Design

Consistent response shapes make APIs predictable and easier to consume programmatically.

A standard envelope pattern:

```
Success response:
{
  "data": { ... },        // the actual payload
  "meta": {               // pagination, timing, etc.
    "total": 100,
    "page": 2,
    "limit": 10
  }
}

Error response:
{
  "error": {
    "code": "VALIDATION_ERROR",     // machine-readable code
    "message": "Email is invalid",  // human-readable description
    "details": [                    // optional field-level errors
      { "field": "email", "issue": "must be a valid email address" }
    ]
  }
}
```

Consistency is the goal — clients should never need to special-case individual endpoints. The error shape especially should be uniform across the entire API.
