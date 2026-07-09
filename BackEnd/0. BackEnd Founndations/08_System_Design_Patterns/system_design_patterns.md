# 8. System Design Patterns

System design patterns are the recurring architectural solutions to recurring architectural problems. Understanding them by name and trade-off is foundational vocabulary for any backend engineer.

---

## 8.1 Monolith vs Microservices

Both are legitimate architectures. The right choice depends on team size, maturity, and the problem domain.

**Monolith:** The entire application (all business domains) is one deployable unit, one process, one codebase.

| Aspect | Monolith |
|---|---|
| Development | Simple — no distributed systems complexity, no network calls between components |
| Testing | Easy — everything runs in one process; no service mocking needed |
| Deployment | Simple — one artifact to build and deploy |
| Scaling | Must scale the entire application even if only one feature is the bottleneck |
| Failure isolation | A bug in one module can crash the entire application |
| Team scaling | Large teams in the same codebase risk merge conflicts, coupling, and coordination overhead |

**Microservices:** Business domains are separated into independently deployable services that communicate over a network.

| Aspect | Microservices |
|---|---|
| Scaling | Each service scales independently |
| Failure isolation | A failure in one service does not necessarily take down others |
| Technology freedom | Different services can use different languages and databases |
| Deployment | Independent release cycles |
| Complexity | Network latency, distributed transactions, service discovery, observability across services |
| Operational overhead | Requires mature DevOps, CI/CD, and monitoring infrastructure |

**Modular monolith:** A monolith with strict internal module boundaries. Modules communicate through well-defined interfaces, not direct function calls across domain boundaries. This preserves development simplicity while preventing the entanglement that makes monoliths hard to evolve. Often the right starting point before splitting into microservices when pain is real and specific.

> For API Gateway patterns (a key microservices enabler), see `Extra/API Gateway.md`.

---

## 8.2 Layered Architecture

Layered architecture is the most common pattern for organizing backend application code. Each layer has a single responsibility and only communicates with the adjacent layers.

```
┌─────────────────────────────────────────────┐
│            Presentation Layer               │
│  (Routes, Controllers, Request Parsing,     │
│   Response Formatting)                      │
└─────────────────────────┬───────────────────┘
                          │ calls
┌─────────────────────────▼───────────────────┐
│            Business Logic Layer             │
│  (Services, Use Cases, Domain Rules,        │
│   Orchestration of multiple data sources)   │
└─────────────────────────┬───────────────────┘
                          │ calls
┌─────────────────────────▼───────────────────┐
│            Data Access Layer                │
│  (Repositories, Models, ORM queries,        │
│   External API clients)                     │
└─────────────────────────┬───────────────────┘
                          │ reads/writes
┌─────────────────────────▼───────────────────┐
│                Database / Store             │
└─────────────────────────────────────────────┘
```

**Why this separation matters:**
- The Presentation Layer does not know how data is stored — it only serializes/deserializes HTTP
- The Business Logic Layer does not know about HTTP — it can be tested without simulating requests
- The Data Access Layer does not know about business rules — swapping databases does not touch business logic

---

## 8.3 MVC Pattern

MVC (Model-View-Controller) is an older pattern with a specific mapping to the layered architecture in a backend API context.

| MVC Role | In a Backend API |
|---|---|
| Model | The data layer — database schemas, ORM models, business entities |
| View | The response — in an API, this is the JSON (or HTML) returned to the client |
| Controller | The route handler — parses the request, calls the model, returns the view |

**The fat model / fat controller problem:** As business logic grows, developers tend to put it in either the model (a "fat model") or the controller (a "fat controller"). Both create maintenance problems — logic becomes coupled to either data representation or HTTP handling. The solution is a **Service Layer** between the controller and the model, where business logic lives independently.

---

## 8.4 Repository Pattern

The Repository Pattern abstracts the data access logic behind an interface. Instead of writing database queries directly in the service layer, the service layer calls methods on a repository object.

```
Service Layer calls:        userRepository.findById(id)
                            userRepository.save(user)
                            userRepository.findByEmail(email)

Repository implements:      These methods using whatever ORM or raw SQL is appropriate
```

**Benefits:**
- The service layer is decoupled from the specific database technology
- Switching from MongoDB to PostgreSQL means rewriting the repository, not the business logic
- Repository methods can be mocked in unit tests, allowing service logic to be tested without a database

---

## 8.5 Message Queues

A message queue decouples the producer (the service that creates work) from the consumer (the service that processes work). The producer puts a message on the queue and returns immediately. The consumer reads messages at its own pace.

```
Producer ──→ [Message Queue] ──→ Consumer
  (fast)                          (slow is ok)
```

**Benefits:**
- **Traffic absorption:** A spike in requests fills the queue rather than overwhelming the consumer
- **Retry on failure:** If a consumer fails to process a message, the message remains in the queue for another attempt
- **Decoupling:** Producer and consumer evolve independently; neither needs to know the other's implementation
- **Dead-letter queue (DLQ):** Messages that fail repeatedly (after N retries) are moved to a DLQ for manual inspection, rather than being lost or blocking the queue

Examples: RabbitMQ, Amazon SQS, Azure Service Bus, BullMQ (Node.js, built on Redis).

---

## 8.6 Publish/Subscribe (Pub/Sub)

In the pub/sub model, a publisher emits events to a **topic** (or channel) without knowing who is listening. Any number of subscribers can listen to the topic and receive every event independently.

This differs from a message queue:
- **Queue:** One consumer per message. Message is deleted after consumption.
- **Pub/Sub:** All subscribers receive every message on the topic. Publishers and subscribers are fully decoupled.

**Use cases:**
- Email service, SMS service, and push notification service each subscribe to `OrderPlaced` events
- Invalidating cached data when a resource changes: all cache-holding instances subscribe to `ProductUpdated`
- Real-time feeds: all connected clients subscribe to a live score topic

---

## 8.7 Event-Driven Architecture

In event-driven architecture, services communicate by emitting and consuming domain events rather than making direct synchronous calls.

```
Order Service                                                Email Service
  |                                                               |
  |-- emits: { event: "OrderPlaced", orderId: 42 } →  Queue/Bus -|→ sends confirmation email
                                                                  |
                                                         Inventory Service
                                                                  |→ decrements stock
```

**Benefits:**
- **Loose coupling:** The Order Service does not know the Email Service or Inventory Service exist. Adding a new downstream action requires no changes to the Order Service.
- **Independent scaling:** Each consumer service scales based on its own processing load
- **Resilience:** If the Email Service is down, events queue up and are processed when it recovers

**Challenge:** Debugging and tracing a user action across multiple services requires distributed tracing tooling (covered in `09_Error_Handling_And_Logging/`).

---

## 8.8 CQRS (Command Query Responsibility Segregation)

CQRS separates the data model used for writes (commands) from the data model used for reads (queries). In a standard CRUD system, the same model handles both.

```
Standard:   Client → Read/Write Model → DB

CQRS:       Client → Command Model (write) → Write DB
                                               |
                                               | sync/event
                                               ↓
            Client ← Query Model (read) ←  Read DB (denormalized)
```

**When it is appropriate:**
- Read and write data shapes are very different (e.g., writes are normalized domain events; reads are complex aggregated views)
- Read traffic vastly outweighs write traffic and the read model must be independently optimized
- The domain is complex enough to justify the additional complexity

CQRS is an advanced pattern. For most CRUD applications, it is over-engineering. Apply it when the read/write shape mismatch is genuinely painful.
