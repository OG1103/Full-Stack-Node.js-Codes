# API Gateway

An API Gateway is a server that acts as the **single entry point** for all client requests to your backend. Instead of clients talking directly to multiple services, they talk to the gateway — which then routes, transforms, and manages the requests.

Think of it as a **smart traffic controller** that sits in front of
all your backend servers. It receives every request and decides where
it should go.

## Simple Picture:

Client
↓
API Gateway ← single entry point
↓ ↓ ↓
Auth Users Payments
Service Service Service
(8001) (8002) (8003)

## When Do You Need It?

You only need an API Gateway when you have **microservices** —
meaning each feature runs as its own separate server on its own port:

→ Auth service running on port 8001
→ User service running on port 8002  
→ Payment service running on port 8003

Without a gateway, the client would need to know 3 different
addresses. The gateway gives them ONE address and handles
the routing internally.

## When You DON'T Need It:

If all your routes live in ONE Express app:
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/payments', paymentRoutes)

→ Everything on one port
→ One server
→ No API Gateway needed ✅

## What It Does:

- Routes requests to correct service
- Rate limiting
- Authentication
- Load balancing
- Protects backend servers from direct exposure

## What an API Gateway Does

### 1. Routing

Forwards incoming requests to the correct backend service based on the URL path or other rules:

```
GET  /api/users/123     → Users Service
GET  /api/orders        → Orders Service
POST /api/products      → Products Service
POST /api/auth/login    → Auth Service
```

### 2. Authentication & Authorization

The gateway verifies the JWT token (or session) on every incoming request before it reaches any service. Services no longer need to implement auth themselves:

```
Client sends:  Authorization: Bearer <token>
Gateway:       Verifies token → valid? → pass request to service
                              → invalid? → return 401 immediately
```

### 3. Rate Limiting

Limits how many requests a single client can make in a time window, protecting services from abuse or accidental overload:

```
100 requests per minute per IP — gateway enforces this before requests reach services
```

### 4. Load Balancing

If you run multiple instances of a service (for scaling), the gateway distributes requests across them:

```
API Gateway → Users Service instance 1
            → Users Service instance 2
            → Users Service instance 3
```

### 5. Request / Response Transformation

The gateway can modify requests before forwarding and modify responses before returning — adding headers, converting formats, or merging responses from multiple services into one.

### 6. Caching

The gateway can cache responses for common requests, so the backend service is not hit every time.

### 7. Logging & Monitoring

All traffic passes through one point — easy to log every request, measure response times, and detect errors without instrumenting every service individually.

### 8. SSL Termination

HTTPS is handled at the gateway level. Backend services communicate over plain HTTP internally (within a private network), keeping things simpler.

---

## Simple Example — Express as a Minimal API Gateway

You can build a basic gateway with Node.js using `http-proxy-middleware`:

> **How it works in simple terms:**
> You run this gateway on port 3000, and run each of your other
> services separately on their own ports (3001, 3002, 3003).
> Your client only ever talks to port 3000 — the gateway receives
> the request and automatically redirects it to the correct service.
> Your individual services are never exposed directly.

```javascript
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// Auth check middleware (runs on every request)
app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  // Verify token here...
  next();
});

// Route to Users Service
app.use(
  "/api/users",
  createProxyMiddleware({
    target: "http://users-service:3001",
    changeOrigin: true,
  }),
);

// Route to Orders Service
app.use(
  "/api/orders",
  createProxyMiddleware({
    target: "http://orders-service:3002",
    changeOrigin: true,
  }),
);

// Route to Products Service
app.use(
  "/api/products",
  createProxyMiddleware({
    target: "http://products-service:3003",
    changeOrigin: true,
  }),
);

app.listen(3000, () => console.log("Gateway running on port 3000"));
```

> **Example flow:**
> Client sends POST /api/users/login to port 3000
> ↓
> Gateway checks auth token
> ↓
> Redirects to users-service on port 3001
> ↓
> Response comes back through gateway to client

---

## Real-World API Gateways

In production, teams use dedicated gateway tools rather than building their own:

| Tool                | Type                    | Notes                               |
| ------------------- | ----------------------- | ----------------------------------- |
| **AWS API Gateway** | Cloud service           | Pairs with AWS Lambda, EC2, ECS     |
| **NGINX**           | Reverse proxy / gateway | High performance, widely used       |
| **Kong**            | Open source gateway     | Plugin-based, very feature-rich     |
| **Traefik**         | Open source             | Popular in Docker/Kubernetes setups |
| **Express Gateway** | Node.js based           | Built on Express, easy for JS devs  |

---

## API Gateway vs Reverse Proxy

These terms overlap but have a distinction:

| Reverse Proxy                            | API Gateway                                       |
| ---------------------------------------- | ------------------------------------------------- |
| Forwards requests to one or more servers | Also forwards, but adds API-specific features     |
| Handles SSL, load balancing, caching     | Also handles auth, rate limiting, transformations |
| General purpose                          | Designed specifically for APIs                    |

An API gateway IS a reverse proxy, but with extra features built for managing APIs.

---

## Key Points

1. **Single entry point** — clients talk to one URL; services are hidden behind it
2. **Centralized auth** — token verification happens once at the gateway, not in every service
3. **Decouples clients from services** — services can move, change ports, or be replaced without clients caring
4. **Rate limiting and security** at one layer protects all services equally
5. **Essential in microservices** — the more services you have, the more valuable a gateway becomes
6. **Adds one more hop** — gateway introduces a small latency overhead; negligible for most apps
