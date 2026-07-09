## Deadlocks

### What is it

A deadlock happens when **two operations are each waiting for the other to finish** — so neither can ever proceed. They are stuck forever.

Think of it like two people in a narrow hallway, each waiting for the other to step aside. Neither moves, so both are stuck.

In a database, this happens when:
- Transaction A locks Document 1, then tries to lock Document 2
- Transaction B locks Document 2, then tries to lock Document 1
- A is waiting for B to release Document 2, B is waiting for A to release Document 1 — neither ever will

```
Transaction A:  locks User(alice) ──────────────── waiting for User(bob) 🔒
Transaction B:             locks User(bob) ─ waiting for User(alice) 🔒

Both are waiting. Neither can finish. Deadlock.
```

MongoDB detects deadlocks and automatically kills one of the transactions with a `WriteConflict` error, so your app does not hang — but you need to handle that error and retry.

### Example

```js
// ❌ RISKY — different transaction order on the same documents
// Transaction A: alice → bob
async function transferFromAliceToBob(amount) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const alice = await Account.findById('alice_id').session(session); // locks alice first
    await Account.findByIdAndUpdate('alice_id', { $inc: { balance: -amount } }, { session });

    const bob = await Account.findById('bob_id').session(session);     // then locks bob
    await Account.findByIdAndUpdate('bob_id',   { $inc: { balance: +amount } }, { session });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

// Transaction B: bob → alice (reverse order — deadlock risk)
async function transferFromBobToAlice(amount) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const bob = await Account.findById('bob_id').session(session);     // locks bob first
    await Account.findByIdAndUpdate('bob_id',   { $inc: { balance: -amount } }, { session });

    const alice = await Account.findById('alice_id').session(session); // then locks alice
    await Account.findByIdAndUpdate('alice_id', { $inc: { balance: +amount } }, { session });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
```

If both run at the same time, A locks alice and waits for bob, B locks bob and waits for alice — deadlock.

### Solution

**Fix 1 — Always lock documents in the same consistent order.**

If every transaction always processes accounts in the same order (e.g., sorted by ID), they can never form a circular wait.

```js
// ✅ FIXED — always lock in sorted ID order
async function transfer(fromId, toId, amount) {
  // Sort IDs so both transactions always lock in the same order
  const [firstId, secondId] = [fromId, toId].sort();

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Always lock the lower ID first — no circular wait possible
    await Account.findByIdAndUpdate(
      firstId,
      { $inc: { balance: firstId === fromId ? -amount : +amount } },
      { session }
    );
    await Account.findByIdAndUpdate(
      secondId,
      { $inc: { balance: secondId === fromId ? -amount : +amount } },
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

**Fix 2 — Use `withTransaction` with automatic retry.**

MongoDB's `withTransaction` helper automatically retries on transient errors like `WriteConflict` (which is what MongoDB throws when it detects a deadlock).

```js
// ✅ FIXED — withTransaction auto-retries on write conflicts
async function transfer(fromId, toId, amount) {
  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    await Account.findByIdAndUpdate(fromId, { $inc: { balance: -amount } }, { session });
    await Account.findByIdAndUpdate(toId,   { $inc: { balance: +amount } }, { session });
  });
  // withTransaction automatically retries if a WriteConflict occurs

  session.endSession();
}
```

**Fix 3 — Avoid multi-document transactions when a single atomic operation is enough.**

The safest way to avoid deadlocks is to not need multi-document transactions in the first place.

```js
// ✅ BEST — for simple counter/balance updates, use atomic $inc (no transaction needed)
await Account.findByIdAndUpdate(fromId, { $inc: { balance: -amount } });
await Account.findByIdAndUpdate(toId,   { $inc: { balance: +amount } });
// Each is an atomic single-document operation — no locking, no deadlock possible
// (Note: for financial transfers you still want a transaction for atomicity, but
//  for non-critical counters this is fine)
```

### When to use each solution

| Solution | When to use it |
|---|---|
| **Consistent lock order** | Use when you write transactions manually and control the order of operations. Simple and effective. |
| **`withTransaction` with retry** | Use as the default for any transaction code. It handles write conflicts and transient errors automatically without extra logic from you. |
| **Avoid transactions entirely** | Use when your operation can be expressed as a single atomic `$inc` or `$set` on one document. Fewer transactions = fewer deadlock opportunities. |
