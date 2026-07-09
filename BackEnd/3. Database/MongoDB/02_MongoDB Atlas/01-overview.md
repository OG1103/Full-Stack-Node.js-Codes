# 01 — MongoDB Atlas: Overview & Core Concepts

## What is MongoDB Atlas?

MongoDB Atlas is a fully managed cloud database service built on MongoDB. Instead
of installing, patching, and maintaining a MongoDB server yourself, Atlas handles
all of the infrastructure — replication, backups, scaling, security patches, and
monitoring — so you focus on building your application.

Atlas runs on AWS, Google Cloud, and Azure. You pick the cloud provider and region
closest to your app servers when you create a cluster.

---

## How Atlas is Structured

```
Organization
│   Billing, members, and projects all live here.
│
├── Project A  (e.g. "myapp-production")
│   ├── Cluster          ← the actual database server(s)
│   ├── Database Users   ← credentials your app uses to connect
│   ├── Network Access   ← IP whitelist
│   ├── Backups
│   └── Alerts / Monitoring
│
└── Project B  (e.g. "myapp-dev")
    ├── Cluster
    ├── Database Users
    └── Network Access
```

### Organization
The top-level container. Represents your company or team.
- Manages billing across all projects
- Controls who can create new projects
- Example: `Acme Inc`

### Project
A logical group that owns clusters, users, and network settings.
- Access control is scoped per project — a user invited to Project A cannot see Project B
- Use separate projects to isolate environments (production vs development)
- Example: `acme-production`, `acme-dev`

### Cluster
The actual MongoDB server (or set of servers) that stores your data.
- Has a tier (M0, FLEX, M10 …) that determines performance and cost
- Runs as a replica set by default (3 nodes for high availability on paid tiers)
- Contains one or more **databases**, each containing **collections**

---

## Key Terminology

| Term | Meaning |
|------|---------|
| **Cluster** | The database server (or replica set) |
| **Database** | A named container inside a cluster — like a folder |
| **Collection** | Equivalent to a SQL table — holds documents |
| **Document** | A single record stored as BSON (like JSON) |
| **Replica Set** | 3+ nodes storing the same data for high availability |
| **Primary node** | The node that accepts writes |
| **Secondary node** | A read replica that mirrors the primary |
| **Atlas URI** | The connection string your app uses |
| **IP Whitelist** | List of IPs allowed to connect to the cluster |
| **Database User** | App-level credentials (username + password) |

---

## MongoDB vs SQL — Concept Mapping

| SQL Concept | MongoDB Equivalent |
|-------------|-------------------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Index | Index |
| JOIN | `$lookup` (aggregation pipeline) |
| Primary Key | `_id` field (auto-generated) |
| Schema | Flexible (no enforced schema by default) |
| Stored Procedure | Atlas Functions / aggregation pipelines |
| Transaction | Multi-document ACID transactions (v4.0+) |

---

## What Atlas Manages For You

| You used to manage this | Atlas handles it |
|------------------------|-----------------|
| Server provisioning | ✅ |
| MongoDB installation & patching | ✅ |
| Replica set configuration | ✅ |
| Backups | ✅ |
| Failover (if primary goes down) | ✅ |
| TLS/SSL encryption | ✅ |
| Monitoring and alerting | ✅ |
| Storage scaling | ✅ (with auto-scaling) |

---

## What You Still Manage

- Schema design and collection structure
- Indexes (Atlas advises, you create)
- Query optimization
- Application-level data validation
- Who has access (team members and DB users)
- Network access rules (IP whitelist)
- Choosing the right tier for your workload

---

## Data Consistency & Availability

Atlas clusters run as **replica sets** on paid tiers (M10+):
- 3 nodes minimum — 1 primary + 2 secondaries
- If the primary fails, Atlas automatically elects a new primary (usually within 30 seconds)
- Your app should use `retryWrites=true` in the connection string to handle this transparently

On M0 and FLEX, your data is stored on shared infrastructure with Atlas-managed
replication — you don't control the replica set topology directly.

---

## Atlas vs Self-Hosted MongoDB

| | Atlas (Managed) | Self-Hosted |
|-|----------------|-------------|
| Setup time | Minutes | Hours/days |
| Maintenance | Atlas handles | You handle |
| Backups | Built-in | You set up |
| Monitoring | Built-in | You set up |
| Scaling | One click | Manual |
| Cost | Pay per tier | Server + ops time |
| Control | Limited | Full |
| Best for | Most teams | Very specific needs |
