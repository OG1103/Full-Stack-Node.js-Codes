# Transactions in Backend Development

A transaction is a group of database operations that are treated as **one single unit of work**. Either all operations succeed together, or none of them are applied at all.

---

## Table of Contents

1. [What is a Transaction?](#1-what-is-a-transaction)
2. [ACID Properties](#2-acid-properties)
3. [When to Use Transactions](#3-when-to-use-transactions)
4. [When NOT to Use Transactions](#4-when-not-to-use-transactions)
5. [Transactions in MongoDB (Mongoose)](#5-transactions-in-mongodb-mongoose)
6. [Transactions in PostgreSQL (pg / Sequelize)](#6-transactions-in-postgresql-pg--sequelize)
7. [Performance Impact](#7-performance-impact)
8. [Common Mistakes](#8-common-mistakes)
9. [Quick Reference](#9-quick-reference)

---

## 1. What is a Transaction?

Without a transaction, if your code crashes halfway through a multi-step operation, your database is left in a broken, half-updated state.

**Example of the problem — transferring money between two accounts:**

```js
// ❌ NO transaction — dangerous
await Account.findByIdAndUpdate(senderId,   { $inc: { balance: -100 } });
// 💥 server crashes here
await Account.findByIdAndUpdate(receiverId, { $inc: { balance: +100 } });
// sender lost $100, receiver got nothing — data is corrupted
```

**With a transaction:**

```js
// ✅ WITH transaction — safe
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Account.findByIdAndUpdate(senderId,   { $inc: { balance: -100 } }, { session });
  await Account.findByIdAndUpdate(receiverId, { $inc: { balance: +100 } }, { session });
  await session.commitTransaction();       // both succeed → apply changes
} catch (err) {
  await session.abortTransaction();        // any failure → undo everything
} finally {
  session.endSession();
}
```

If anything fails, the transaction rolls back — the database looks exactly as it did before any of the operations ran.

---

## 2. ACID Properties

Every transaction follows ACID guarantees. These are what make transactions safe.

| Property | Meaning | Simple explanation |
|---|---|---|
| **Atomicity** | All or nothing | Either every operation runs, or none do |
| **Consistency** | Data stays valid | The database never goes into a broken state |
| **Isolation** | Operations don't interfere | Two concurrent transactions don't step on each other |
| **Durability** | Changes are permanent | Once committed, data survives crashes/restarts |

> You don't need to configure these — the database engine enforces them automatically when you use transactions.

---

## 3. When to Use Transactions

Use a transaction **only when multiple operations must all succeed or all fail together**.

### Use Case 1 — Money / Balance Transfer

```
Debit account A  ─┐
                  ├── must both succeed, or neither
Credit account B ─┘
```

```js
// Transfer funds — classic transaction use case
async function transferFunds(senderId, receiverId, amount) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sender = await Account.findById(senderId).session(session);
    if (sender.balance < amount) throw new Error('Insufficient funds');

    await Account.findByIdAndUpdate(senderId,   { $inc: { balance: -amount } }, { session });
    await Account.findByIdAndUpdate(receiverId, { $inc: { balance: +amount } }, { session });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
```

---

### Use Case 2 — Order + Inventory Update

When a user places an order, you need to:
1. Create the order document
2. Deduct stock from the product inventory

Both must succeed together. An order with no inventory deducted = overselling.

```js
async function placeOrder(userId, productId, quantity) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await Product.findById(productId).session(session);
    if (product.stock < quantity) throw new Error('Out of stock');

    await Order.create([{ userId, productId, quantity }], { session });
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } },
      { session }
    );

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
```

---

### Use Case 3 — User Registration with Related Records

Creating a user and immediately creating a linked profile/settings document. If the profile creation fails, you don't want an orphaned user record.

```js
async function registerUser(userData) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [user] = await User.create([userData], { session });
    await UserProfile.create([{ userId: user._id, bio: '', avatar: '' }], { session });
    await UserSettings.create([{ userId: user._id, notifications: true }], { session });

    await session.commitTransaction();
    return user;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
```

---

### Use Case 4 — Booking / Seat Reservation

Reserve a seat and mark it as taken. Two users can't book the same seat.

```js
async function bookSeat(userId, seatId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const seat = await Seat.findById(seatId).session(session);
    if (seat.isBooked) throw new Error('Seat already booked');

    await Seat.findByIdAndUpdate(seatId, { isBooked: true, bookedBy: userId }, { session });
    await Booking.create([{ userId, seatId }], { session });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
```

---

## 4. When NOT to Use Transactions

> Transactions add overhead. Only use them when data integrity truly depends on multiple operations.

| Scenario | Use Transaction? | Why |
|---|---|---|
| Creating a single document | No | Single operation is atomic by itself |
| Updating one field on one document | No | Single operation is atomic by itself |
| Reading data (GET requests) | No | Reads don't modify state |
| Logging / analytics writes | No | It's OK if a log entry is lost |
| Sending an email | No | External side-effects can't be rolled back |
| Deleting + creating linked records | **Yes** | Both must succeed together |
| Charging payment + creating order | **Yes** | Financial integrity required |

**Key rule:** If you can afford for one operation to fail without affecting the others, skip the transaction.

---

## 5. Transactions in MongoDB (Mongoose)

### Requirements

- MongoDB must be running as a **Replica Set** (even locally for dev). Standalone MongoDB does **not** support multi-document transactions.
- Mongoose version 5.2+

### Local dev replica set setup (one-time)

```bash
# Start mongod as a single-node replica set
mongod --replSet rs0

# In mongo shell
rs.initiate()
```

### The standard pattern

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  // pass { session } to every operation inside the transaction
  await ModelA.create([data], { session });
  await ModelB.findByIdAndUpdate(id, update, { session });

  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;         // re-throw so your Express error handler catches it
} finally {
  session.endSession();  // always release the session
}
```

> **Important:** When using `create()` inside a transaction, pass the data as an **array** (`[data]`) — that is how Mongoose accepts a session with `create`.

### Using `withTransaction` helper (cleaner)

Mongoose provides a helper that handles commit/abort/retry automatically:

```js
const session = await mongoose.startSession();

await session.withTransaction(async () => {
  await Account.findByIdAndUpdate(senderId,   { $inc: { balance: -100 } }, { session });
  await Account.findByIdAndUpdate(receiverId, { $inc: { balance: +100 } }, { session });
});

session.endSession();
```

`withTransaction` will automatically retry on transient errors (like write conflicts) and abort on failure. Prefer this over manual try/catch when possible.

---

## 6. Transactions in PostgreSQL (pg / Sequelize)

SQL databases have had transactions from the start — the syntax is simpler.

### Raw `pg` client

```js
const { Pool } = require('pg');
const pool = new Pool();

async function transferFunds(senderId, receiverId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, senderId]
    );
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, receiverId]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();  // always return the client to the pool
  }
}
```

### Sequelize (ORM)

```js
const { sequelize } = require('./models');

async function placeOrder(userId, productId, quantity) {
  const t = await sequelize.transaction();
  try {
    await Order.create({ userId, productId, quantity }, { transaction: t });
    await Product.decrement('stock', { by: quantity, where: { id: productId }, transaction: t });

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
```

---

## 7. Performance Impact

Transactions are powerful but **not free**. Here is exactly what they cost and how to minimize it.

### Why transactions are slower

| Overhead | Explanation |
|---|---|
| **Locking** | Documents/rows touched by a transaction are locked — other operations must wait |
| **Write conflict retries** | If two transactions touch the same data, one is aborted and retried |
| **Oplog / WAL overhead** | The database logs every change for rollback capability |
| **Network round-trips** | Each session command (startTransaction, commitTransaction) is an extra round-trip |
| **Session lifecycle** | Acquiring and releasing a session has a small cost |

### Practical rules to keep transactions fast

```
1. Keep transactions SHORT — do the minimum work inside, nothing else
2. Never do slow work inside a transaction (HTTP calls, file I/O, emails)
3. Avoid reading data you don't need to modify inside the transaction
4. Don't hold a transaction open while waiting on user input
5. In MongoDB, the default transaction timeout is 60 seconds — don't rely on it
```

### Do — minimize work inside the transaction

```js
// ✅ Validate BEFORE opening the transaction
const sender = await Account.findById(senderId);       // outside transaction
if (sender.balance < amount) throw new Error('Insufficient funds');

const session = await mongoose.startSession();
session.startTransaction();
try {
  // only the writes go inside
  await Account.findByIdAndUpdate(senderId,   { $inc: { balance: -amount } }, { session });
  await Account.findByIdAndUpdate(receiverId, { $inc: { balance: +amount } }, { session });
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

### Don't — slow operations inside the transaction

```js
// ❌ Never do this
session.startTransaction();
const data = await fetch('https://external-api.com/validate'); // HTTP call blocks lock
await sendEmail(user.email);                                    // slow, can't be rolled back
await Account.findByIdAndUpdate(..., { session });
await session.commitTransaction();
```

### Performance comparison (rough)

| Operation | Relative cost |
|---|---|
| Single document write (no transaction) | 1x |
| 2-operation transaction | ~3–5x |
| 5-operation transaction | ~6–10x |
| Long-held transaction under concurrency | Can cause cascading slowdowns |

> This is why the rule is: **use transactions only where data integrity requires it, not as a default for every multi-step operation.**

---

## 8. Common Mistakes

### 1. Forgetting to pass `{ session }` to every operation

```js
// ❌ Second update runs OUTSIDE the transaction
session.startTransaction();
await User.create([userData], { session });
await Profile.create([profileData]);           // missing session — not in the transaction!
```

### 2. Not calling `session.endSession()` in finally

```js
// ❌ Session leak — eventually exhausts the connection pool
try {
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
}
// endSession never called if an error was thrown
```

Always put `session.endSession()` in a `finally` block.

### 3. Doing work that can't be rolled back inside a transaction

```js
// ❌ Even if the transaction rolls back, the email was already sent
await sendEmail(user.email, 'Your order is confirmed');
await Order.create([order], { session });
await session.commitTransaction();
```

Side effects like emails, webhooks, and payment charges happen outside the database. They cannot be undone by `abortTransaction`. Only trigger them **after** you have successfully committed.

### 4. Using transactions for single-document operations

```js
// ❌ Pointless overhead — single writes are already atomic
session.startTransaction();
await User.findByIdAndUpdate(id, { name: 'Alice' }, { session });
await session.commitTransaction();
```

### 5. Long transactions under high concurrency

If many requests hit the same records, long-held transactions create a write-conflict bottleneck. Keep transactions as short as possible.

---

## 9. Quick Reference

```
When to use a transaction:
  ✅ Multiple documents/tables must update together
  ✅ A failure in step 2 should undo step 1
  ✅ Financial, inventory, or booking operations
  ✅ Creating linked records that must exist together

When NOT to use a transaction:
  ❌ Single document / single row operation
  ❌ Read-only operations
  ❌ Logging, analytics, non-critical writes
  ❌ Operations involving external APIs or emails

Performance rules:
  → Do validation and reads BEFORE opening the transaction
  → Keep the transaction body small and fast
  → Never do I/O (HTTP, file, email) inside a transaction
  → Always release the session in a finally block

MongoDB gotchas:
  → Requires Replica Set — won't work on standalone
  → Pass data as array to Model.create([data], { session })
  → Pass { session } to EVERY operation inside the transaction
  → Prefer session.withTransaction() for auto-retry logic

SQL gotchas:
  → Always call client.release() in finally (pg)
  → Pass { transaction: t } to every Sequelize operation
```
