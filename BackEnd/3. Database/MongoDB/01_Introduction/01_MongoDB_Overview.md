# MongoDB — Overview & Atlas

MongoDB is a **NoSQL document database** that stores data in flexible, JSON-like documents (BSON) instead of rows and columns. Each document can have a different structure, making it ideal for evolving data models.

---

## 1. Core Concepts

### Documents

The basic unit of data in MongoDB. A document is a JSON-like object with key-value pairs:

```json
{
  "_id": ObjectId("64f1a2b3c4d5e6f7a8b9c0d1"),
  "name": "John Doe",
  "email": "john@example.com",
  "age": 28,
  "address": {
    "city": "New York",
    "zip": "10001"
  },
  "hobbies": ["reading", "coding"]
}
```

- `_id` is automatically generated if not provided (12-byte `ObjectId`)
- Documents can contain nested objects and arrays
- Maximum document size is **16MB**

### Collections

A group of documents — analogous to a table in SQL. Collections do not enforce a schema by default.

```
Database: myApp
├── Collection: users     → [doc1, doc2, doc3, ...]
├── Collection: products  → [doc1, doc2, ...]
└── Collection: orders    → [doc1, doc2, ...]
```

### Databases

A container for collections. A single MongoDB server can host multiple databases.

---

## 2. Relational vs Non-Relational

| Feature | Relational (SQL) | Non-Relational (MongoDB) |
|---------|------------------|--------------------------|
| Data model | Tables with rows/columns | Collections with documents |
| Schema | Fixed, predefined | Flexible, dynamic |
| Relationships | JOINs across tables | Embedded documents or references |
| Scaling | Vertical (bigger server) | Horizontal (more servers / sharding) |
| Query language | SQL | MongoDB Query Language (MQL) |
| Terminology | Table → Row → Column | Collection → Document → Field |
| Transactions | Native ACID | Supported (since v4.0) |

### When to Use MongoDB

- Rapidly evolving schemas (startups, prototyping)
- Hierarchical or nested data (user profiles, product catalogs)
- High write throughput (logging, IoT, analytics)
- Horizontal scaling needs (sharding)
- Real-time applications (chat, notifications)

### When SQL May Be Better

- Complex relationships with many JOINs
- Strict data integrity requirements (banking, accounting)
- Well-defined, stable schemas

---

## 3. BSON (Binary JSON)

MongoDB stores documents in **BSON** — a binary representation of JSON that supports additional types:

| JSON Type | BSON Additions |
|-----------|---------------|
| String | Same |
| Number | `Int32`, `Int64`, `Double`, `Decimal128` |
| Boolean | Same |
| Array | Same |
| Object | Same |
| null | Same |
| — | `ObjectId`, `Date`, `Binary`, `Regex`, `Timestamp` |

---

## 4. MongoDB Atlas (Cloud)

Atlas is MongoDB's **managed cloud database service**. It handles provisioning, backups, scaling, and security.

### Atlas Hierarchy

```
Organization (company-level)
└── Project (team/app-level)
    └── Cluster (database server)
        └── Database
            └── Collection
                └── Document
```

### Organizations

The top-level container. Represents a company or department:
- Manages billing and access
- Contains multiple projects
- Has organization-level users and roles

### Projects

Group related clusters together:
- One project per application (e.g., "E-Commerce App", "Analytics Platform")
- Separate access control per project
- Each project has its own users, network access, and alerts

### Clusters

The actual database servers:
- **Shared Clusters (M0/M2/M5):** Free or low-cost, good for development
- **Dedicated Clusters (M10+):** Production-ready with full features
- Choose cloud provider (AWS, GCP, Azure) and region
- Automatic backups and monitoring

### Access Control

```
Organization Owner
├── Can manage billing, projects, and org settings
├── Project Owner
│   ├── Can manage clusters, users, network access
│   ├── Database User (read/write to specific databases)
│   └── Read-Only User
└── Organization Member
    └── Limited access based on role
```

**Network Access:** By default, no IP can connect. You must whitelist IPs:
- Specific IP addresses
- `0.0.0.0/0` allows all IPs (development only — never in production)

**Database Users:** Separate from Atlas users. These authenticate to the database itself:
- Username/password authentication
- Scoped to specific databases or roles (`readWrite`, `dbAdmin`, `readAnyDatabase`)

### Getting a Connection String

1. Go to your cluster in Atlas
2. Click **"Connect"**
3. Choose **"Connect your application"**
4. Copy the connection string:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myDatabase?retryWrites=true&w=majority
```

---

## 5. Local vs Atlas Connection

### Local MongoDB

```
mongodb://localhost:27017/myDatabase
```

Requires MongoDB installed locally (Community Server).

### Atlas (Cloud)

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

- `mongodb+srv://` — DNS seedlist connection (auto-discovers replica set members)
- `<username>:<password>` — Database user credentials (not Atlas login)
- `<cluster>.mongodb.net` — Your cluster's hostname
- `<database>` — Default database name
- `retryWrites=true` — Automatically retry failed writes
- `w=majority` — Write concern (acknowledged by majority of replica set)

---

## 6. MongoDB Shell Commands (Quick Reference)

```javascript
// Show databases
show dbs

// Switch to a database (creates it if it doesn't exist)
use myDatabase

// Show collections
show collections

// Insert a document
db.users.insertOne({ name: "John", age: 28 })

// Find documents
db.users.find()
db.users.find({ age: { $gt: 25 } })

// Update a document
db.users.updateOne({ name: "John" }, { $set: { age: 29 } })

// Delete a document
db.users.deleteOne({ name: "John" })

// Drop a collection
db.users.drop()

// Drop a database
db.dropDatabase()
```

---

## 7. Summary

| Concept | Description |
|---------|-------------|
| Document | JSON-like object (basic data unit) |
| Collection | Group of documents (like a table) |
| Database | Container for collections |
| BSON | Binary JSON with extra types |
| Atlas | Managed cloud MongoDB service |
| ObjectId | 12-byte unique identifier |

### Key Points

1. MongoDB is **schema-flexible** — documents in the same collection can have different fields
2. Data is stored as **BSON documents** (not rows/columns)
3. **Embedding** is preferred over JOINs for related data
4. Atlas provides **managed hosting** with automatic backups and scaling
5. Always configure **network access** and **database users** in Atlas
