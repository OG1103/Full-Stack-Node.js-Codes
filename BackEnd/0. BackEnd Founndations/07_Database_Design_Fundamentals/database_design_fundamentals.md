# 7. Database Design Fundamentals

Choosing the right database and designing the right schema is one of the most consequential decisions in backend development. The concepts in this section apply regardless of which specific database system is used.

---

## 7.1 SQL vs NoSQL: The Real Trade-off

The question is not "which is better" but "which fits this problem's characteristics."

| Dimension | SQL (Relational) | NoSQL (Document / Key-Value / Wide-Column) |
|---|---|---|
| Schema | Fixed, enforced by the database | Flexible, per-record — can vary across documents |
| Relationships | First-class, via JOINs and foreign keys | Handled by embedding documents or application-level joins |
| Scaling | Primarily vertical; horizontal via sharding (complex) | Designed for horizontal sharding |
| Consistency | ACID transactions by default | Varies: eventual consistency by default in distributed NoSQL |
| Query flexibility | Arbitrary queries via SQL; ad-hoc joins | Queries must match the access patterns the schema was designed for |
| Best fit | Complex, evolving relationships; reporting; financial data | High write volume; flexible/variable data shapes; known access patterns |

Neither model is universally superior. A complex social network with rich reporting needs leans SQL. A high-throughput event log or catalog with simple lookups leans NoSQL. Many systems use both.

---

## 7.2 Normalization

Normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity.

| Normal Form | Rule |
|---|---|
| 1NF (First) | Each column contains atomic (indivisible) values; no repeating groups |
| 2NF (Second) | 1NF + every non-key column depends on the entire primary key (no partial dependencies) |
| 3NF (Third) | 2NF + every non-key column depends only on the primary key (no transitive dependencies) |

In practical terms: if a customer's city is stored in an orders table, and the city must be updated every time it changes, that is a normalization violation. The city should be in the customers table, and orders should reference the customer.

**Denormalization** is the intentional introduction of redundancy for read performance. A pre-computed `total_price` column on an orders table avoids summing line items on every read. Denormalization is a deliberate trade-off made after profiling, not a starting point.

---

## 7.3 Indexing

Indexes are the most impactful performance tool in relational databases. Understanding how they work conceptually informs all indexing decisions.

**B-tree indexes (the default):** A balanced tree data structure where each leaf node contains the indexed value and a pointer to the corresponding row. Traversing from root to leaf is O(log n) regardless of table size.

| Index Type | Description | Use Case |
|---|---|---|
| Single-column | Index on one column | Most common; equality and range queries |
| Composite (multi-column) | Index on two or more columns together | Queries filtering on multiple columns |
| Covering | Index that contains all columns the query needs | Avoids accessing the table at all — "index-only scan" |
| Unique | Enforces uniqueness and allows fast lookup | Email addresses, usernames, external IDs |
| Full-text | Optimized for text search (tokenization, stemming) | Search boxes, document content queries |

**The left-prefix rule (composite indexes):** A composite index on `(last_name, first_name, city)` is usable for queries on `(last_name)`, `(last_name, first_name)`, or `(last_name, first_name, city)`, but not for queries on `(first_name)` or `(city)` alone. The index is only traversable from the leftmost column.

**When indexes hurt:** Every write (INSERT, UPDATE, DELETE) must update all indexes on the table. A table with 10 indexes has 10 times the write overhead of a table with none. Low-cardinality columns (e.g., a boolean `is_active`) make poor indexes because the database still has to read a large fraction of the table.

---

## 7.4 ACID Properties

ACID is a set of properties that guarantee database transactions are processed reliably, even in the face of errors, hardware failures, or concurrent access.

| Property | Meaning | Example |
|---|---|---|
| **Atomicity** | The transaction either fully commits or fully rolls back — no partial state | Transferring money: debit and credit happen together or not at all |
| **Consistency** | The transaction moves the database from one valid state to another, respecting all constraints | A foreign key constraint is never violated after a transaction commits |
| **Isolation** | Concurrent transactions behave as if executed serially — they do not see each other's partial work | Two users booking the last seat simultaneously; only one succeeds |
| **Durability** | Once a transaction commits, it is permanent — a crash cannot undo it | Committed data survives power failure via write-ahead logging |

**Isolation levels** (from weakest to strongest):
1. **Read Uncommitted:** Can see uncommitted changes from other transactions (dirty reads)
2. **Read Committed:** Only sees committed data; may see different values in repeated reads (non-repeatable reads)
3. **Repeatable Read:** Repeated reads within a transaction return the same data (phantom reads still possible)
4. **Serializable:** Full isolation — concurrent transactions produce the same result as if they ran sequentially. Highest correctness, lowest throughput.

---

## 7.5 Transactions

A transaction is a unit of work that must be treated as atomic. All operations within the transaction succeed together or all are rolled back together.

**Use transactions whenever:**
- Multiple tables must be updated consistently (order + inventory + payment)
- A read-then-write must be protected from concurrent modification
- Multiple steps together represent a single business event

**Optimistic vs pessimistic locking:**

| Strategy | How it works | Best fit |
|---|---|---|
| Pessimistic locking | Lock the record before reading it; no other transaction can modify it until the lock is released | High contention, short-lived locks |
| Optimistic locking | Read without locking; include a version number in the update query; fail if another transaction updated the record in the interim | Low contention; long-running operations |

---

## 7.6 The CAP Theorem

In a distributed database system (running across multiple nodes), it is impossible to simultaneously guarantee all three of the following properties:

```
         Consistency
        /            \
       /              \
      / You can pick 2 \
     /                  \
Availability ——————— Partition
                     Tolerance
```

- **Consistency:** Every read receives the most recent write or an error
- **Availability:** Every request receives a response (not necessarily the most recent data)
- **Partition Tolerance:** The system continues to operate even when network partitions (communication failures between nodes) occur

**The practical implication:** Network partitions are unavoidable in any distributed system. Therefore, every distributed database must sacrifice either consistency or availability during a partition. The real choice is **CP** (consistency + partition tolerance) vs **AP** (availability + partition tolerance).

| Choice | Example Systems | Behavior During Partition |
|---|---|---|
| CP | Zookeeper, HBase, most SQL DBs in cluster mode | Rejects requests that cannot be served consistently |
| AP | Cassandra, DynamoDB, CouchDB | Returns potentially stale data rather than failing |

For a single-node database, CAP does not apply — partition tolerance is irrelevant.

---

## 7.7 Database Migrations

A migration is a versioned, repeatable script that modifies the database schema (or data) as the application evolves. Migrations solve the coordination problem: how does a team keep the database schema in sync with the application code?

Key concepts:
- **Up migration:** Applies the change (add a column, create a table, add an index)
- **Down migration:** Reverses the change (drop the column, drop the table) — enables rollback
- **Migration version:** Each migration has a unique, sequential identifier so the migration tool knows which have been applied
- **Idempotency:** A migration that has already been applied must not be applied again

Migrations should run automatically as part of the deployment pipeline. The rule: **never manually alter a production database schema**. All changes go through migrations that are version-controlled alongside the application code.

---

## 7.8 Data Modeling Approaches

The two dominant modeling paradigms reflect their databases' strengths.

**SQL (Entity-Relationship Modeling):**
1. Identify the entities (things) in the domain: users, orders, products
2. Identify attributes of each entity
3. Identify relationships between entities (one-to-many, many-to-many)
4. Normalize to 3NF to eliminate redundancy
5. The schema serves any query — the schema is designed first, queries are written later

**NoSQL Document (Access-Pattern Modeling):**
1. Identify the queries the application will make
2. Design documents to satisfy those queries efficiently — embed data that is always fetched together
3. The schema is optimized for known access patterns, not for flexibility
4. Changing access patterns may require redesigning the data model

The document approach trades query flexibility for performance and simplicity. If you always fetch a user's recent orders together with the user, embedding recent orders in the user document eliminates a separate query.
