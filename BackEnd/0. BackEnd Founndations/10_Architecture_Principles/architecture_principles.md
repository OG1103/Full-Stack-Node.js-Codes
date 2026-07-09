# 10. Architecture Principles

These principles are not patterns with specific implementations — they are guiding values that inform every design decision. Internalizing them is what separates writing code that works from writing code that scales, evolves, and can be maintained by others.

---

## 10.1 Separation of Concerns

Each module, function, class, or service should have one clearly defined responsibility. The moment a function handles both business logic and database access, it becomes harder to test either in isolation, harder to reuse, and harder to reason about.

The test for this principle: can you describe what a function or module does in one sentence, without using "and"? If not, it is doing too much.

---

## 10.2 Idempotency

An operation is idempotent if executing it N times produces the same result as executing it once. This is a critical property for any operation that may be retried.

**Where idempotency matters most:**
- **Payment processing:** A network timeout after charge submission should not result in a double charge on retry. The solution: the client generates a unique **idempotency key** per transaction; the server stores the result and returns it on duplicate requests instead of re-processing.
- **API design:** PUT and DELETE should be idempotent by definition. Implement them accordingly.
- **Message queue consumers:** Message queues guarantee at-least-once delivery — a message may be delivered more than once. Consumers must be designed to handle duplicate messages without creating duplicate effects.

Design for idempotency proactively. Retrofitting it into systems that assume single delivery is expensive.

---

## 10.3 The 12-Factor App

The 12-Factor App methodology, originally articulated by Heroku, defines twelve practices for building scalable, maintainable backend services. The most universally applicable factors:

| Factor | Principle |
|---|---|
| Codebase | One codebase, tracked in version control, deployed to multiple environments |
| Config | Configuration (database URLs, API keys, port numbers) stored in environment variables, not in code |
| Backing Services | Treat databases, caches, message queues as attached resources — swappable without code changes |
| Stateless Processes | The application stores no local state between requests; all state lives in backing services |
| Port Binding | The app is self-contained and binds to a port itself, rather than relying on a web server to inject it |
| Dev/Prod Parity | Development, staging, and production are as similar as possible |
| Logs as Streams | The app writes logs to stdout as a stream of events; log routing and storage is an infrastructure concern |

---

## 10.4 Designing for Failure

In a distributed system, failures are not exceptional — they are expected. Every external dependency (database, cache, third-party API, other microservice) will eventually fail or become slow. The question is not whether failure will happen, but whether the system is prepared for it.

| Pattern | Description | When to use |
|---|---|---|
| Timeout | Never wait indefinitely for an external call; set a maximum duration | Every external call |
| Retry with exponential backoff | Retry failed calls, doubling the wait time between each attempt | Transient failures (network hiccup) |
| Jitter | Add random variation to retry delays | Prevents all retrying clients from thundering at the same moment |
| Circuit Breaker | After N consecutive failures, stop calling the service for a period; fail fast instead | Protecting from cascading failures to degraded dependencies |
| Fallback | Return cached data, a default value, or a degraded response when a dependency fails | When partial functionality is better than failure |

The goal: a failure in one part of the system does not cascade into a failure of the whole system.

---

## 10.5 Backward Compatibility

APIs are public contracts. Existing consumers depend on the contract being stable. Changing it without warning breaks them.

**The rules:**
- **Additive changes are safe:** Adding a new field to a response, adding a new optional request parameter, adding a new endpoint — these do not break existing consumers.
- **Breaking changes require versioning:** Removing a field, renaming a field, changing a data type, removing an endpoint — these break consumers and require a new API version.
- **Postel's Law (Robustness Principle):** "Be conservative in what you send, liberal in what you accept." Accept additional fields clients may send (ignore unknown fields); only send fields clients are known to expect.

---

## 10.6 Documentation as a Contract

An API that is not documented is an API that cannot be used reliably. Documentation should be treated as part of the API contract, not as an afterthought.

**OpenAPI / Swagger** is the industry standard for describing REST APIs in a machine-readable format (YAML or JSON). An OpenAPI specification:
- Describes every endpoint, its parameters, request body, and response shapes
- Can generate interactive documentation (Swagger UI) automatically
- Can generate client SDKs in multiple languages
- Can be used to validate requests and responses in tests

**API-first design:** Write the OpenAPI contract before writing the implementation. This forces clarity about the API's shape before any code is written and allows frontend/backend teams to work in parallel against the contract.

---

## 10.7 Environment Parity

"It works on my machine" is the symptom of insufficient environment parity. The development, staging, and production environments should be as similar as possible.

Differences between environments create a class of bugs that only appear in production — the most expensive kind to debug. Common sources of divergence:

| Divergence | Solution |
|---|---|
| Different OS / runtime versions | Containerization (Docker) — same image everywhere |
| Different configuration values | All config from environment variables; no code branches per environment |
| Different data | Sanitized production data snapshots for staging |
| Local services vs real services | Use real versions of backing services in development (or close approximations) |

The principle: every environment is a slightly differently configured version of the same artifact. The artifact itself — the code — must not change between environments.
