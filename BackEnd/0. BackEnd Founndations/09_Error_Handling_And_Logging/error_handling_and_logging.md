# 9. Error Handling & Logging

A backend system that does not communicate failures clearly — to clients, to developers, and to itself — is unobservable. Unobservable systems are impossible to debug, support, or improve.

---

## 9.1 Error Categories

**Operational errors:** Expected failures in a correctly functioning program. The program is working as designed, but external circumstances failed. These should be caught and handled gracefully.

| Operational Error | Example |
|---|---|
| Resource not found | `404: User with id 42 not found` |
| Invalid input | `400: Email address is malformed` |
| Unauthorized | `401: No authentication token provided` |
| External service failure | Database connection timeout, third-party API unavailable |
| Rate limited | Client sent too many requests |

**Programmer errors (bugs):** Failures that indicate a defect in the program's logic. These should crash the process (or at least be surfaced loudly) rather than being silently caught — a running program with an undetected bug is often worse than a failed one.

| Programmer Error | Example |
|---|---|
| Null/undefined access | Calling `.toLowerCase()` on `undefined` |
| Logic errors | Using `=` instead of `===` in a condition |
| Type mismatches | Passing a string where a number was expected |

The handling strategy is different for each category: operational errors have known paths and should return appropriate HTTP responses; programmer errors should trigger alerts, logs, and potentially crash the process.

---

## 9.2 Fail Fast Principle

Validate inputs and fail immediately at the system boundary — before any processing begins. The longer invalid data travels through a system before being rejected, the harder it is to trace the source of the problem and the more unintended state may be modified.

Fail fast benefits:
- Errors are produced at the point closest to their cause
- Invalid data never reaches internal processing or the database
- Error messages can be precise and actionable

---

## 9.3 Error Propagation

Errors should bubble up through the call stack to a single centralized error handler, rather than being caught and suppressed at every layer.

**The anti-pattern:**
```
function getUserOrders(userId) {
  try {
    return db.query(...)
  } catch (e) {
    return null  // caller has no idea something went wrong
  }
}
```

Returning `null` on failure forces every caller to implement its own null-checking logic and produces confusing behavior downstream. Prefer letting the error propagate to a layer that can handle it with full context.

---

## 9.4 Consistent Error Response Shape

Every error response from the API should have the same structure. Clients should not need to special-case individual endpoints to handle their errors.

```
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields",
    "details": [
      { "field": "email", "issue": "Must be a valid email address" },
      { "field": "age",   "issue": "Must be a positive integer" }
    ]
  }
}
```

- `code`: Machine-readable string identifier — clients can switch on this value
- `message`: Human-readable description — for developers and end users
- `details`: Optional array for field-level validation errors

Consistency here is more important than the specific structure chosen. Pick one and enforce it everywhere.

---

## 9.5 HTTP Status Codes as Error Signals

| Status Code | Meaning | When to use |
|---|---|---|
| 400 Bad Request | Malformed or invalid input | Validation failure, unparseable JSON |
| 401 Unauthorized | Not authenticated | No token, expired token, invalid token |
| 403 Forbidden | Authenticated but not authorized | User lacks permission for this resource |
| 404 Not Found | Resource does not exist | `GET /users/999` when user 999 does not exist |
| 409 Conflict | State conflict | Creating a user with an email that already exists |
| 422 Unprocessable Entity | Semantically invalid input | Input is well-formed but fails business rules |
| 429 Too Many Requests | Rate limit exceeded | Client has exceeded the request quota |
| 500 Internal Server Error | Unexpected server error | Uncaught exception, programmer error |
| 503 Service Unavailable | Server temporarily unable to handle requests | Maintenance, overload, dependency failure |

---

## 9.6 Logging Principles

**Structured logging:** Emit logs as JSON objects rather than free-form strings. Machine-parseable logs can be queried, aggregated, and alerted on by log management systems (Splunk, Elasticsearch, Datadog, CloudWatch).

```
Unstructured:  "User 42 logged in at 2026-03-20T10:00:00Z"
Structured:    { "timestamp": "2026-03-20T10:00:00Z", "level": "info", "event": "user_login", "userId": 42, "ip": "1.2.3.4" }
```

**Log levels:**

| Level | Use for |
|---|---|
| DEBUG | Verbose diagnostic information useful during development; disabled in production |
| INFO | Normal application events (user logged in, request completed) |
| WARN | Unexpected but non-critical state (deprecated feature used, retry succeeded after failure) |
| ERROR | Failures that require attention (request failed, external service unavailable) |
| FATAL | Unrecoverable failures that cause the process to exit |

**Correlation IDs:** Every incoming request should be assigned a unique request ID (UUID). This ID is attached to every log line produced during that request's lifetime. When a user reports an issue, the support team can find the single request ID and see the entire execution path across all log entries — even across multiple services.

---

## 9.7 What to Log

**Include:**
- Timestamp (ISO 8601, UTC)
- Log level
- Request / trace ID
- The action being performed
- The outcome (success, failure, error code)
- Identifiers for affected entities (user ID, resource ID — not PII)
- Duration for slow operations

**Never include:**
- Passwords (plain text or hashed)
- Authentication tokens (JWT, session IDs, API keys)
- Credit card numbers, bank account details
- Social Security / national ID numbers
- Any data subject to regulatory restrictions (GDPR, HIPAA, PCI-DSS)

**Always log security events:**
- Failed login attempts (with IP address)
- Successful logins and logouts
- Permission denials (403 responses)
- Administrative actions
- Unusual patterns (many 404s from one IP, requests at unusual hours)

---

## 9.8 Monitoring and Alerting

**Logging vs monitoring:** Logging records discrete events. Monitoring tracks metrics over time — rates, percentages, durations.

**Key metrics to track:**

| Metric | Description | Why it matters |
|---|---|---|
| Request rate | Requests per second | Baseline; detects traffic spikes and drops |
| Error rate | Percentage of 5xx responses | Health of the application |
| Latency p50/p95/p99 | Median, 95th, 99th percentile response time | p95/p99 captures the experience of your slowest users |
| Queue depth | Number of pending background jobs | Growing queue signals a processing bottleneck |
| DB query time | Time for database operations | Often the first bottleneck to surface under load |
| Connection pool utilization | % of pool connections in use | Approaching 100% predicts connection wait times |

**Alerting:** Notify on-call engineers when metrics cross defined thresholds (e.g., error rate > 1% for 5 minutes, p99 latency > 2 seconds). Alerts should be actionable — every alert should have a known response procedure.

---

## 9.9 Distributed Tracing

In a monolith, a single log file captures the complete story of a request. In a microservices system, a single user action may pass through 5–10 services. Individual service logs tell fragments of the story; distributed tracing stitches them together.

**How it works:**
1. The first service generates a unique trace ID for the request
2. Every downstream call passes the trace ID in a header (`X-Trace-ID` or the OpenTelemetry `traceparent` header)
3. Each service emits spans — records of work performed — tagged with the trace ID
4. A tracing backend (Jaeger, Zipkin, Datadog APM) collects all spans and visualizes the complete request path as a timeline

The result: a flame graph showing exactly which service was the bottleneck, how long each operation took, and which downstream calls were made. Essential for debugging latency and failures in distributed systems.

> OpenTelemetry is the open-source standard for emitting traces, metrics, and logs in a vendor-neutral format.
