# 1. Client-Server Architecture

Client-server architecture is the foundational model of virtually every backend system on the internet. Understanding it at a conceptual level is the prerequisite for everything that follows.

---

## 1.1 The Client-Server Model

A **client** is any process that initiates a request. A **server** is any process that listens on a port and fulfills requests. The separation exists because it allows the serving logic to be centralized and shared by many clients simultaneously — a single server can respond to thousands of clients without each client needing to run server-side logic locally.

Key characteristics:
- The server is always listening; the client initiates the connection
- The relationship is asymmetric — the server does not initiate communication to the client (in standard HTTP)
- Multiple clients of different types (web browser, mobile app, CLI tool) can share the same server

**Contrast with peer-to-peer (P2P):** In P2P, every node is both a client and a server. There is no central point. P2P is appropriate for file sharing and decentralized systems but introduces significant complexity around consistency and trust.

---

## 1.2 The Request-Response Cycle (Conceptual)

Every HTTP interaction follows the same abstract lifecycle:

```
Client                                Server
  |                                      |
  |--- DNS Lookup (resolve hostname) --->|
  |<-- IP Address returned --------------|
  |                                      |
  |--- TCP Handshake (3-way: SYN) ------>|
  |<-- SYN-ACK --------------------------|
  |--- ACK ----------------------------->|
  |                                      |
  |--- TLS Handshake (for HTTPS) ------->|
  |<-- Certificate + Session Key --------|
  |                                      |
  |--- HTTP Request (method + headers) ->|
  |      + optional body (POST/PUT)      |
  |                                      |
  |    [Server processes the request]    |
  |                                      |
  |<-- HTTP Response (status + headers) -|
  |      + body (JSON, HTML, etc.)       |
```

The entire process from the client's perspective appears instant but involves multiple round trips before a single byte of application data is exchanged. This is why latency (the time for one round trip) matters more than raw bandwidth for small API responses.

> For the Node.js / Express-specific implementation of request and response objects, see `2. Express/03_HTTP_Fundamentals/`.

---

## 1.3 Statelessness

HTTP is a **stateless protocol** by design. Each request is entirely independent — the server holds no memory of previous requests from the same client. After the server sends a response, the connection context is discarded.

Why statelessness matters:
- **Scalability:** Any server instance can handle any request. There is no "sticky" requirement to route a user back to the same server that handled their last request.
- **Simplicity:** Each request carries everything needed to process it. No shared session state needs to be synchronized across servers.
- **The tension:** Users expect continuity (staying logged in, shopping carts persisting). This creates the need for authentication mechanisms that re-establish identity on every request — the core problem that `03_Authentication_And_Authorization/` solves.

---

## 1.4 Synchronous vs Asynchronous Communication

Not all backend communication has to follow the synchronous request-response model.

| Model | How it works | When to use |
|---|---|---|
| Synchronous (HTTP) | Client sends request, waits, gets response | User-facing actions that need an immediate result |
| Asynchronous (Message Queue) | Producer sends a message; consumer processes it later | Background jobs, tasks that can be deferred |
| Real-time (WebSockets) | Persistent bidirectional connection | Live feeds, chat, collaborative tools |
| Event-driven (Pub/Sub) | Publisher emits event; multiple subscribers receive it | Notifications, cache invalidation, cross-service coordination |

The choice of communication model shapes the entire architecture. Asynchronous patterns allow a server to accept work and return `202 Accepted` immediately, processing the work in the background — a critical tool for performance covered in `06_Performance_And_Scalability/`.

---

## Summary

| Concept | Description |
|---|---|
| Client | Initiates requests; can be browser, mobile app, CLI |
| Server | Listens on a port; responds to requests |
| HTTP | Stateless, text-based application protocol |
| DNS | Translates hostname to IP address |
| TLS | Encrypts the connection (HTTPS = HTTP over TLS) |
| Stateless | Each request is independent; no memory between requests |
