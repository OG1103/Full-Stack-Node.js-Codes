# Redis Caching — A Comprehensive Guide for MERN Stack Developers

---

## Table of Contents

1. [What is Redis?](#what-is-redis)
2. [How Redis Works](#how-redis-works)
3. [Redis vs Database](#redis-vs-database)
4. [Redis RAM Usage](#redis-ram-usage)
5. [Installation & Setup](#installation--setup)
6. [Connecting Redis to Node.js](#connecting-redis-to-nodejs)
7. [Core Redis Commands](#core-redis-commands)
8. [Caching Patterns](#caching-patterns)
9. [MERN Stack Examples](#mern-stack-examples)
10. [Cache Invalidation](#cache-invalidation)
11. [Sessions with Redis](#sessions-with-redis)
12. [Rate Limiting with Redis](#rate-limiting-with-redis)
13. [Monitoring & Debugging](#monitoring--debugging)
14. [Production Setup on EC2](#production-setup-on-ec2)
15. [Best Practices](#best-practices)
16. [When NOT to Use Redis](#when-not-to-use-redis)

---

## What is Redis?

Redis (Remote Dictionary Server) is an **in-memory data store** that acts as a cache, database, and message broker. Unlike MongoDB or PostgreSQL which store data on disk, Redis stores data **in RAM** — making it extremely fast.

> Think of Redis as your app's short-term memory, while MongoDB is its long-term memory.

```
Request → Node.js → Redis (RAM, fast) → return cached data
                  ↓ (cache miss)
                MongoDB (disk, slower) → store in Redis → return data
```

### Redis is NOT a Library — It's a Separate Server

This is the most important thing to understand: **Redis is not an npm package you install and it just works. It is an actual server process — a completely separate program — that has to be running on its own, independently from your Node.js app.**

Think of it exactly like MongoDB. You don't "install MongoDB" into your code — you run a MongoDB server separately, and then your Node.js app connects to it. Redis works the same way:

```
Your Machine (or EC2 Server)
├── Process 1: Node.js app        (your backend, port 3000)
├── Process 2: MongoDB            (your database, port 27017)
└── Process 3: Redis Server       (your cache, port 6379)  ← separate process
```

All three are independent programs running at the same time. Your Node.js app talks to MongoDB and Redis over TCP connections using their respective ports. If Redis is not running, your app cannot connect to it — just like if MongoDB is down, your app can't read/write data.

The `ioredis` or `redis` npm packages you install in Node.js are just **client libraries** — they are the "phone" your app uses to call Redis. But Redis itself (the server) has to be running separately for that call to go through.

---

### What "In-Memory" Actually Means

When we say Redis is in-memory, we mean it stores all its data directly in **RAM (Random Access Memory)** — the same fast memory your computer uses to run programs.

Compare this to MongoDB or PostgreSQL, which store data on your **hard drive/SSD (disk)**:

```
RAM (Redis)
├── Extremely fast access (~0.1ms)
├── Data lives only while the process is running
├── Limited by how much RAM your machine has
└── Lost on restart (unless persistence is configured)

Disk (MongoDB, PostgreSQL)
├── Slower access (~10–100ms)
├── Data survives restarts and shutdowns
├── Essentially unlimited storage
└── Permanent storage
```

This is why Redis is so fast — reading from RAM is roughly **100–1000x faster** than reading from disk. When your Node.js app asks Redis for data, Redis finds it in RAM and returns it in under a millisecond. If it had to go to disk like MongoDB does, it would take 10–100ms per query.

For a busy API that gets 1000 requests per second, that difference is massive.

---

### How Redis Fits Into Your MERN App

Here is the full picture of how your MERN stack communicates:

```
React (Frontend)
     ↓ HTTP request
Node.js / Express (Backend)
     ↓                    ↓
  Redis Server         MongoDB
  (port 6379)         (port 27017)
  RAM storage          Disk storage
  Fast, temporary      Slow, permanent
```

Your Node.js app is the one talking to both. Redis is never directly touched by your React frontend — it's purely a backend concern. The flow on every API request is:

```
1. React calls GET /api/products
2. Express receives the request
3. Express checks Redis → "Do I have products cached?"
     YES → return from Redis instantly (no DB call)
     NO  → query MongoDB → store result in Redis → return result
4. React gets the response
```

---

### Locally: How Redis Runs on Your Machine

When you develop locally, Redis runs as a **background process on your own computer**. It starts, runs quietly in the background, and listens on `localhost:6379`. Your Node.js app connects to it the same way it connects to your local MongoDB.

```
Your Windows PC
├── WSL Terminal → runs Redis server (background, port 6379)
├── Terminal 1   → runs Node.js backend (port 3000)
├── Terminal 2   → runs React frontend (port 5173)
└── MongoDB      → also running separately (port 27017)
```

Redis stores data only in RAM while it's running. If you restart your computer or stop the Redis process, all cached data is gone — which is fine because the cache is just a copy of what's already in MongoDB. On the next request, it just re-caches from MongoDB.

To start Redis locally:
```bash
# In WSL
sudo service redis start

# Verify it's running
redis-cli ping   # PONG ✅
```

Your Node.js app then connects to `localhost:6379` and everything works.

---

### On Deployment (EC2): How Redis Runs in Production

On your EC2 server, Redis runs as a **system service** — exactly like how Nginx runs as a service that starts automatically when the server boots. It's a separate process on the same machine, listening on `localhost:6379`.

```
Your EC2 Server (e.g. ip-172-31-13-106)
├── Nginx          → reverse proxy (port 80/443)
├── Node.js / PM2  → your backend app (port 3000)
├── MongoDB        → your database (port 27017)
└── Redis          → your cache server (port 6379)  ← running as a system service
```

Because Redis is on the same machine as your Node.js app in this setup, the connection is still `localhost:6379` — your code doesn't change at all between local and production.

You configure Redis to auto-start on boot so you never have to manually start it:

```bash
sudo systemctl enable redis   # auto-start on every reboot
sudo systemctl start redis    # start it now
```

From that point on, every time your EC2 server starts (or restarts after a crash), Redis comes up automatically. Your Node.js app (via PM2) also auto-starts, connects to Redis, and everything is ready.

---

### The Analogy That Ties It All Together

Think of your application like a restaurant:

```
MongoDB  = the kitchen         (permanent, stores everything, takes time)
Redis    = the waiter's notepad (fast, temporary notes for common orders)
Node.js  = the waiter          (talks to both, serves the customer)
React    = the customer        (just wants their food fast)
```

The waiter (Node.js) takes an order (API request). Instead of going to the kitchen (MongoDB) every single time, they check their notepad (Redis) first. If the order is already noted, they serve it instantly. If not, they go to the kitchen, get the food, note it down, and serve it.

The notepad (Redis) is not the kitchen (MongoDB). It's a completely separate thing the waiter carries. And just like a real notepad, it has limited space (RAM) and notes can expire (TTL).

---

## How Redis Works

Redis is a **key-value store** at its core. Everything is stored as a key with a value:

```
Key             →   Value
"user:123"      →   '{"name":"Omar","email":"omar@gmail.com"}'
"products"      →   '[{...},{...},{...}]'
"session:abc"   →   '{"userId":"123","role":"admin"}'
```

It supports multiple data types:

| Type        | Example Use Case                    |
|-------------|-------------------------------------|
| String      | Caching API responses               |
| Hash        | Storing user objects                |
| List        | Activity feeds, queues              |
| Set         | Unique visitors, tags               |
| Sorted Set  | Leaderboards, rankings              |
| JSON        | Caching complex nested objects      |

---

## Redis vs Database

| Feature         | Redis (Cache)         | MongoDB (Database)     |
|-----------------|-----------------------|------------------------|
| Storage         | RAM (in-memory)       | Disk                   |
| Speed           | ~0.1ms                | ~10-100ms              |
| Persistence     | Optional              | Always                 |
| Data Size       | Limited by RAM        | Essentially unlimited  |
| Query Power     | Simple key lookups    | Complex queries        |
| Cost            | Expensive per GB      | Cheap per GB           |
| Use Case        | Frequently read data  | Source of truth        |

**Rule of thumb:** MongoDB stores your data permanently. Redis stores a fast copy of the data you access most often.

---

## Redis RAM Usage

Redis stores **everything in RAM**. Unlike MongoDB where RAM is a cache on top of disk,
Redis RAM **is** the database. When RAM fills up, Redis either rejects writes or starts
evicting data — depending on your configuration.

Understanding how much RAM Redis actually uses is critical before deploying.

---

### Memory Overhead Per Key

Every key in Redis has internal overhead on top of the raw value size:

| What you store | Raw size | Redis actual size | Overhead |
|----------------|----------|-------------------|----------|
| Empty key + value | 0 bytes | ~50–70 bytes | bookkeeping structs |
| Short string (`"OK"`) | 2 bytes | ~56 bytes | string object + key |
| Small JSON (200B) | 200 bytes | ~270 bytes | ~35% overhead |
| Medium JSON (1KB) | 1,024 bytes | ~1,100 bytes | ~7% overhead |
| Large JSON (10KB) | 10,240 bytes | ~10,350 bytes | ~1% overhead |

**Rule:** overhead matters most for small keys. For large cached responses (1KB+),
overhead is negligible. For tiny entries like rate limit counters, overhead can
triple the actual data size.

---

### RAM Usage by What You Store

#### Cached API Responses

```
Average JSON response size: 2KB
1,000 cached routes/pages  × 2KB = ~2MB      ← barely anything
10,000 cached entries      × 2KB = ~20MB
100,000 cached entries     × 2KB = ~200MB
1,000,000 cached entries   × 2KB = ~2GB
```

Most apps cache tens to hundreds of distinct responses.
Unless you are caching per-user data for millions of users, cached responses
use very little RAM.

#### Sessions

```
Average session object: 300–500 bytes (userId, role, metadata)

1,000  active sessions  × 400B = ~400KB
10,000 active sessions  × 400B = ~4MB
100,000 active sessions × 400B = ~40MB
500,000 active sessions × 400B = ~200MB
```

Sessions are small. Even 500,000 concurrent sessions fit in ~200MB.

#### Rate Limit Counters

```
Each counter: ~100 bytes (IP + count integer)

10,000 unique IPs tracked  × 100B = ~1MB
100,000 unique IPs tracked × 100B = ~10MB
```

Rate limit counters are tiny. They also expire (TTL = window size), so they
self-clean and never accumulate indefinitely.

---

### Realistic Total RAM by App Size

| App size | What's cached | Estimated Redis RAM |
|----------|--------------|---------------------|
| **Hobby / dev** | A few routes, < 100 users | 10–50MB |
| **Small production** | ~50 route caches, 5K sessions, rate limiting | 50–200MB |
| **Medium production** | ~500 route caches, 50K sessions, heavy rate limiting | 200MB–1GB |
| **Large production** | Per-user caches, 200K+ sessions, leaderboards | 1–8GB |
| **Enterprise** | Millions of cache entries, global sessions | 8GB+ |

**For most MERN stack apps: 256MB–1GB is sufficient.**

---

### You Must Set maxmemory — Redis Has No Limit By Default

By default, Redis has **no memory limit whatsoever**. If you do not configure one,
Redis will keep consuming RAM for every key you store — indefinitely — until one of
these happens:

```
No maxmemory set → Redis keeps growing
                         ↓
        RAM fills up completely
                         ↓
        OS starts killing processes to reclaim memory
        (it targets the largest consumer — often Redis itself, or Node.js)
                         ↓
        Your app crashes with no warning
```

This is not a theoretical risk. It is the default behavior.
Every key you `SET` without a TTL lives in Redis RAM forever until you manually delete it
or restart the process. Over days and weeks, this adds up.

```
Day 1:   Redis using 50MB    ← fine
Day 7:   Redis using 300MB   ← still fine
Day 30:  Redis using 1.2GB   ← Node.js starts getting OOM killed
Day 60:  Redis using 3GB     ← entire server falls over
```

**Setting `maxmemory` is how you take control.** You tell Redis:
*"you are allowed to use up to X MB of RAM — not a byte more."*
When it hits that limit, the eviction policy decides what to drop to make room.
Without it, Redis decides nothing — it just keeps taking.

**Always set `maxmemory`** in production:

```bash
# /etc/redis/redis.conf
maxmemory 512mb          # hard cap — Redis will not go above this
maxmemory-policy allkeys-lru  # what to do when the cap is hit
```

Or at runtime without restarting:
```bash
redis-cli CONFIG SET maxmemory 512mb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

**Rule of thumb for setting maxmemory:**
```
On a dedicated Redis server:  set to 70–80% of total RAM
On a shared server (with Node.js on same EC2): set to 20–30% of total RAM

Example — t3.medium (4GB RAM) shared with Node.js:
  Node.js processes:  ~1.5GB (3 processes × 500MB each)
  OS overhead:        ~500MB
  Redis maxmemory:    1GB     ← leaves the rest for Node + OS
```

---

### Eviction Policies — What Happens When RAM Is Full

| Policy | Behavior | Best for |
|--------|----------|---------|
| `noeviction` | Returns error on new writes | Never use for a cache |
| `allkeys-lru` | Evicts least recently used key | **General cache — most common choice** |
| `allkeys-lfu` | Evicts least frequently used key | Cache where old-but-popular data matters |
| `volatile-lru` | Evicts LRU key that has a TTL set | Mixed cache + persistent data in same Redis |
| `volatile-ttl` | Evicts key with the shortest remaining TTL | When you want explicit TTL control over eviction |
| `allkeys-random` | Evicts a random key | Rarely useful |

**For a pure caching Redis instance: always use `allkeys-lru`.**
It automatically makes room for new data by dropping whatever was used least recently.

---

### How to Configure Redis Memory (Step by Step)

#### Option A — Edit the config file (persists across restarts)

```bash
sudo nano /etc/redis/redis.conf
```

Find and set these two lines:
```
# Hard cap — Redis will never use more RAM than this
maxmemory 512mb

# What to do when the cap is hit — evict least recently used key
maxmemory-policy allkeys-lru
```

Save the file, then restart Redis to apply:
```bash
sudo systemctl restart redis
```

Verify it took effect:
```bash
redis-cli CONFIG GET maxmemory
redis-cli CONFIG GET maxmemory-policy
```

#### Option B — Set at runtime without restarting (temporary until restart)

```bash
redis-cli CONFIG SET maxmemory 512mb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

Use this for quick changes in production without downtime.
To make it permanent, also update `redis.conf`.

#### Choosing the right maxmemory value

```
Shared EC2 (Node.js + Redis on same server):
  t3.micro  (1GB)  → maxmemory 200mb
  t3.small  (2GB)  → maxmemory 512mb
  t3.medium (4GB)  → maxmemory 1gb
  t3.large  (8GB)  → maxmemory 2gb

Dedicated Redis server:
  Set to 70–80% of total RAM
  e.g. 4GB server → maxmemory 3gb
```

#### Verify your configuration is working

```bash
# See current memory usage and config
redis-cli INFO memory | grep -E "used_memory_human|maxmemory_human|evicted_keys|maxmemory_policy"

# Output example:
# used_memory_human: 45.23M
# maxmemory_human: 512.00M
# maxmemory_policy: allkeys-lru
# evicted_keys: 0           ← 0 means you have enough headroom
```

If `evicted_keys` starts rising above 0, your `maxmemory` is too small —
either increase it or reduce your TTLs to keep fewer keys in memory at once.

---

### Sizing Redis RAM on EC2

Since Redis typically shares an EC2 instance with your Node.js app, plan the split:

```
t3.micro  (1GB RAM):
  OS:       ~250MB
  Node.js:  ~500MB (1–2 processes, small app)
  Redis:    ~250MB   ← tight, set maxmemory 200mb

t3.small  (2GB RAM):
  OS:       ~300MB
  Node.js:  ~800MB (2 processes)
  Redis:    ~512MB  ← comfortable for most small apps

t3.medium (4GB RAM):
  OS:       ~400MB
  Node.js:  ~1.5GB (3–4 processes)
  Redis:    ~1GB    ← handles sessions + caching for medium apps

t3.large  (8GB RAM):
  OS:       ~500MB
  Node.js:  ~3GB   (4+ processes or heavy app)
  Redis:    ~2GB   ← comfortable for large session stores + heavy caching
```

> If Redis RAM needs exceed ~2GB, consider a **dedicated Redis instance** (separate EC2 or
> Amazon ElastiCache) instead of sharing with Node.js.

---

### Monitoring Redis Memory

```bash
# Full memory report
redis-cli INFO memory
```

Key fields to watch:

```
used_memory_human: 45.23M      ← how much Redis is actually using now
used_memory_peak_human: 78.12M ← peak usage ever (shows headroom needed)
maxmemory_human: 512.00M       ← your configured cap
mem_fragmentation_ratio: 1.15  ← ideal: 1.0–1.5. Above 1.5 = fragmentation problem
evicted_keys: 0                ← if > 0, your maxmemory is too small
```

```bash
# See how many keys are stored
redis-cli DBSIZE

# See memory used by a specific key
redis-cli MEMORY USAGE products:all

# Output: 1243   ← bytes used by that single key
```

**If `evicted_keys` is climbing:** Redis is at capacity and dropping data.
Either increase `maxmemory`, shorten TTLs, or cache fewer things.

**If `mem_fragmentation_ratio` > 1.5:** Enable active defragmentation:
```bash
redis-cli CONFIG SET activedefrag yes
```

---

## Installation & Setup

### Locally (Windows via WSL)

```bash
# Open WSL terminal
wsl

# Install Redis
sudo apt update
sudo apt install redis -y

# Start Redis
sudo service redis start

# Validate it's running
redis-cli ping
# Output: PONG ✅
```

### Locally (Mac)

```bash
brew install redis
brew services start redis

redis-cli ping
# Output: PONG ✅
```

### On EC2 (Amazon Linux)

```bash
sudo yum install redis -y
sudo systemctl start redis
sudo systemctl enable redis   # auto-start on every reboot

redis-cli ping
# Output: PONG ✅
```

---

## Connecting Redis to Node.js

### Install the ioredis package

```bash
npm install ioredis
```

### Basic Connection

```javascript
// config/redis.js
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

module.exports = redis;
```

### Environment Variables

```bash
# .env (local)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# .env (production on EC2 — same server)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

> Since Redis runs on the same machine (locally or on EC2), the connection is always `localhost:6379`. Your code doesn't change between environments.

---

## Core Redis Commands

### In Node.js (ioredis)

```javascript
const redis = require('./config/redis');

// SET — store a value (with optional expiry in seconds)
await redis.set('key', 'value');
await redis.set('key', 'value', 'EX', 3600); // expires in 1 hour

// GET — retrieve a value
const value = await redis.get('key');

// DEL — delete a key
await redis.del('key');

// EXISTS — check if key exists
const exists = await redis.exists('key'); // 1 = yes, 0 = no

// TTL — check how many seconds until expiry
const ttl = await redis.ttl('key'); // -1 = no expiry, -2 = doesn't exist

// KEYS — list all keys (use carefully in production)
const keys = await redis.keys('*');

// FLUSHALL — delete everything (use carefully!)
await redis.flushall();
```

### In Redis CLI

```bash
redis-cli

> SET user:123 "Omar"
> GET user:123          # "Omar"
> TTL user:123          # -1 (no expiry)
> EXPIRE user:123 3600  # set expiry to 1 hour
> DEL user:123          # delete
> KEYS *                # list all keys
> FLUSHALL              # clear everything
```

---

## Caching Patterns

### 1. Cache-Aside (Most Common)

The app checks Redis first. On a miss, it fetches from MongoDB and stores in Redis.

```
Request
  ↓
Check Redis → HIT  → Return cached data ✅
           → MISS  → Fetch from MongoDB
                      ↓
                    Store in Redis
                      ↓
                    Return data ✅
```

```javascript
async function getCachedData(key, fetchFn, ttl = 3600) {
  // 1. Try Redis first
  const cached = await redis.get(key);
  if (cached) {
    console.log('✅ Cache HIT:', key);
    return JSON.parse(cached);
  }

  // 2. Cache miss — fetch from DB
  console.log('❌ Cache MISS:', key);
  const data = await fetchFn();

  // 3. Store in Redis for next time
  await redis.set(key, JSON.stringify(data), 'EX', ttl);

  return data;
}
```

### 2. Write-Through

When data is updated in MongoDB, it's also updated in Redis simultaneously.

```javascript
async function updateUser(userId, updates) {
  // Update MongoDB
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });

  // Update Redis cache immediately
  await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600);

  return user;
}
```

### 3. Cache Invalidation on Write

When data is written/updated, delete the cached version so the next read gets fresh data.

```javascript
async function createProduct(data) {
  const product = await Product.create(data);

  // Invalidate the cached products list
  await redis.del('products:all');

  return product;
}
```

---

## MERN Stack Examples

### Example 1: Caching a GET All Products Endpoint

**Without Redis** — every request hits MongoDB:
```javascript
// ❌ Without Redis
router.get('/products', async (req, res) => {
  const products = await Product.find();  // hits DB every time
  res.json(products);
});
```

**With Redis** — only hits MongoDB on first request (or after cache expires):
```javascript
// ✅ With Redis
const redis = require('../config/redis');

router.get('/products', async (req, res) => {
  try {
    const cacheKey = 'products:all';

    // 1. Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({
        source: 'cache',
        data: JSON.parse(cached)
      });
    }

    // 2. Cache miss — query MongoDB
    const products = await Product.find();

    // 3. Store in Redis for 1 hour
    await redis.set(cacheKey, JSON.stringify(products), 'EX', 3600);

    res.json({ source: 'database', data: products });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

### Example 2: Caching a Single User by ID

```javascript
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `user:${id}`;

    // Check Redis
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Fetch from MongoDB
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Cache for 30 minutes
    await redis.set(cacheKey, JSON.stringify(user), 'EX', 1800);

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

### Example 3: Reusable Cache Middleware

Create a middleware that automatically caches any GET route:

```javascript
// middleware/cache.js
const redis = require('../config/redis');

const cacheMiddleware = (ttl = 3600) => {
  return async (req, res, next) => {
    const cacheKey = `cache:${req.originalUrl}`;

    try {
      const cached = await redis.get(cacheKey);

      if (cached) {
        console.log(`✅ Cache HIT: ${cacheKey}`);
        return res.json(JSON.parse(cached));
      }

      console.log(`❌ Cache MISS: ${cacheKey}`);

      // Override res.json to intercept and cache the response
      const originalJson = res.json.bind(res);
      res.json = async (data) => {
        await redis.set(cacheKey, JSON.stringify(data), 'EX', ttl);
        return originalJson(data);
      };

      next();
    } catch (err) {
      next(); // If Redis fails, continue without cache
    }
  };
};

module.exports = cacheMiddleware;
```

**Using the middleware:**

```javascript
const cache = require('../middleware/cache');

// Cache for 1 hour (default)
router.get('/products', cache(), async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Cache for 5 minutes
router.get('/trending', cache(300), async (req, res) => {
  const trending = await Post.find().sort({ views: -1 }).limit(10);
  res.json(trending);
});
```

---

### Example 4: Invalidating Cache on Update/Delete

```javascript
// When a product is updated, delete the cached version
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

    // Invalidate related caches
    await redis.del(`product:${id}`);
    await redis.del('products:all');

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// When a product is deleted
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);

    // Remove from cache
    await redis.del(`product:${id}`);
    await redis.del('products:all');

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

### Example 5: Caching with Pagination

```javascript
router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Include page/limit in the cache key
    const cacheKey = `posts:page:${page}:limit:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments();

    const result = { posts, total, page, limit };

    // Cache for 10 minutes
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 600);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## Cache Invalidation

Cache invalidation is knowing **when to delete or refresh cached data** so your users don't see stale data.

### Strategies

**1. TTL (Time To Live) — set an expiry**
```javascript
// Data expires automatically after 1 hour
await redis.set('key', data, 'EX', 3600);
```

**2. Manual Invalidation — delete on write**
```javascript
// When data changes, delete the cache
await redis.del('products:all');
```

**3. Pattern-based Invalidation — delete multiple keys at once**
```javascript
// Delete all product-related caches
const keys = await redis.keys('products:*');
if (keys.length > 0) {
  await redis.del(...keys);
}
```

### TTL Guidelines

| Data Type             | Recommended TTL     |
|-----------------------|---------------------|
| User profile          | 30 minutes          |
| Product listings      | 1 hour              |
| Homepage/public data  | 5–10 minutes        |
| Session data          | Match JWT expiry    |
| Real-time data        | 10–30 seconds       |
| Static config         | 24 hours            |

---

## Sessions with Redis

Instead of storing sessions in memory (which is lost on restart) or MongoDB (which is slow), store them in Redis:

```bash
npm install express-session connect-redis
```

```javascript
// app.js
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('./config/redis');

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24  // 24 hours
  }
}));
```

Now sessions persist across server restarts and scale across multiple servers.

---

## Rate Limiting with Redis

Prevent abuse by limiting how many requests a user/IP can make:

```javascript
// middleware/rateLimit.js
const redis = require('../config/redis');

const rateLimit = (maxRequests = 100, windowSeconds = 60) => {
  return async (req, res, next) => {
    const ip = req.ip;
    const key = `ratelimit:${ip}`;

    const requests = await redis.incr(key);

    // Set expiry on first request
    if (requests === 1) {
      await redis.expire(key, windowSeconds);
    }

    if (requests > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.'
      });
    }

    // Pass remaining requests in headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - requests);

    next();
  };
};

module.exports = rateLimit;
```

**Using it:**

```javascript
const rateLimit = require('../middleware/rateLimit');

// 10 requests per minute on login route
router.post('/auth/login', rateLimit(10, 60), authController.login);

// 100 requests per minute on general API
router.use('/api', rateLimit(100, 60));
```

---

## Monitoring & Debugging

### Watch live Redis traffic

```bash
redis-cli monitor
```

You'll see every command in real-time:
```
1712345678.123 [0 127.0.0.1:52341] "GET" "products:all"
1712345678.456 [0 127.0.0.1:52341] "SET" "products:all" "[{...}]" "EX" "3600"
```

### Inspect stored keys

```bash
redis-cli

> KEYS *                    # list all keys
> GET products:all          # view a cached value
> TTL products:all          # seconds until expiry
> TYPE products:all         # data type (string, hash, list...)
> DBSIZE                    # total number of keys
```

### Check memory usage

```bash
redis-cli INFO memory
```

### Check Redis stats

```bash
redis-cli INFO stats
```

---

## Production Setup on EC2

### Install and configure

```bash
sudo yum install redis -y
sudo systemctl start redis
sudo systemctl enable redis    # auto-start on reboot
```

### Verify it's running

```bash
sudo systemctl status redis
redis-cli ping                 # PONG
```

### Check your app is connecting to Redis

```bash
# See active connections on port 6379
sudo netstat -tnp | grep 6379
```

### Security — bind Redis to localhost only

By default Redis is only accessible locally, which is correct. Verify in the config:

```bash
sudo nano /etc/redis/redis.conf
```

Make sure this line exists:
```
bind 127.0.0.1
```

This ensures Redis is not exposed to the internet.

---

## Best Practices

**1. Always set a TTL**
```javascript
// ✅ Good — data expires automatically
await redis.set('key', data, 'EX', 3600);

// ❌ Bad — key lives forever, RAM fills up
await redis.set('key', data);
```

**2. Use descriptive, namespaced keys**
```javascript
// ✅ Good
`user:${userId}`
`products:page:${page}`
`session:${sessionId}`

// ❌ Bad
`u${userId}`
`data`
`p`
```

**3. Always JSON.stringify/parse objects**
```javascript
// Storing
await redis.set('user', JSON.stringify(userObject));

// Retrieving
const user = JSON.parse(await redis.get('user'));
```

**4. Handle Redis failures gracefully**
```javascript
// If Redis is down, fall back to the database
try {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
} catch (err) {
  console.error('Redis error, falling back to DB:', err);
}

// Always proceed to DB if Redis fails
const data = await Model.find();
return data;
```

**5. Don't cache sensitive data**
```javascript
// ❌ Don't cache passwords, payment info, or sensitive PII
await redis.set(`user:${id}`, JSON.stringify({ password: '...', card: '...' }));

// ✅ Cache only safe, public-facing data
await redis.set(`user:${id}`, JSON.stringify({ name, email, avatar }));
```

---

## When NOT to Use Redis

- **Data that changes every request** — caching it provides no benefit
- **Unique per-user data with high user count** — you'll cache millions of individual responses and never actually hit the cache
- **Very small datasets** — if MongoDB returns in 2ms, caching won't feel faster
- **Write-heavy endpoints** — if data changes constantly, the cache will always be stale
- **Sensitive data** — passwords, payment info, and private data should never be cached

---

## Summary

```
Redis = Fast temporary storage in RAM
      = Cache layer between your app and MongoDB
      = Also great for sessions, rate limiting, queues

Flow:
  1. Request comes in
  2. Check Redis → HIT? Return instantly ⚡
  3. MISS? → Query MongoDB → Store in Redis → Return data
  4. Next request → HIT ✅

Key rules:
  ✅ Always set TTL
  ✅ Invalidate cache on writes
  ✅ Use namespaced keys
  ✅ Handle Redis failures gracefully
  ✅ Never cache sensitive data
```
