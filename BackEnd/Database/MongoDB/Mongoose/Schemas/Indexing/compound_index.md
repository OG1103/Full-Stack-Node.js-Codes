# MongoDB Compound Indexes — The Complete Guide

---

## What is a Compound Index?

A compound index is an index on **multiple fields combined**. Instead of indexing one field, you index several fields together in a specific order.

```js
userSchema.index({ role: 1, createdAt: -1, username: 1 })
```

This single index covers queries that involve `role`, `createdAt`, and `username` together — much more powerful than three separate single-field indexes for queries that use all three.

---

## How the Data is Actually Stored

This is the most important thing to understand. A compound index stores data in **nested groups** — like folders inside folders.

Given `{ role: 1, createdAt: -1, username: 1 }`:

```
role: "admin"
    createdAt: 2024-12-01
        username: "alice"
        username: "charlie"
        username: "john"
    createdAt: 2024-11-15
        username: "bob"
        username: "zoo"
    createdAt: 2024-10-03
        username: "mike"

role: "mod"
    createdAt: 2024-12-05
        username: "alice"
        username: "sarah"

role: "user"
    createdAt: 2024-12-10
        username: "dan"
        username: "lisa"
```

Key observations:
- `role` is **globally sorted** across the entire index
- `createdAt` is sorted **within each role group**
- `username` is sorted **within each createdAt group**

This nested structure is exactly why you can never skip a field — each field only makes sense within the context of the fields before it.

---

## The Chain Rule (Most Important Rule)

Think of a compound index as a chain. To use any field in the chain, **every field before it must be accounted for** — either by filtering or sorting on it. You can stop at any point but you can never skip a link.

```
role → createdAt → username
 1st      2nd         3rd
```

To use `createdAt` → `role` must be used first
To use `username` → `role` + `createdAt` must be used first

**You can stop anywhere but never skip:**
```js
// ✅ using just the first field
User.find({ role: "admin" })

// ✅ using first + second
User.find({ role: "admin", createdAt: "2024-12-01" })

// ✅ using all three
User.find({ role: "admin", createdAt: "2024-12-01", username: "alice" })

// ❌ skipped first field
User.find({ createdAt: "2024-12-01" })

// ❌ skipped first and second
User.find({ username: "alice" })

// ❌ skipped second (even though first and third are used)
User.find({ role: "admin", username: "alice" })
```

---

## Filtering vs Sorting — How They Work Together

A field in the index can be **accounted for** in two ways:
1. **Filtering** — exact match in `.find()`
2. **Sorting** — included in `.sort()`

Both count. So to reach `username` (the 3rd field), you need `role` and `createdAt` to be accounted for by either one.

```js
// ✅ role filtered + createdAt filtered → can sort by username
User.find({ role: "admin", createdAt: "2024-12-01" }).sort({ username: 1 })

// ✅ role filtered + createdAt sorted → can sort by username
User.find({ role: "admin" }).sort({ createdAt: -1, username: 1 })

// ✅ role filtered + createdAt sorted → stopping at createdAt is fine
User.find({ role: "admin" }).sort({ createdAt: -1 })

// ❌ role filtered + createdAt skipped → username sort is slow
User.find({ role: "admin" }).sort({ username: 1 })
```

The last example is the sneaky one — even though `role` is filtered and `username` is in the index, skipping `createdAt` breaks the chain. MongoDB can find all admins fast, but then has to sort them by username in memory because `username` is not globally sorted across all admins.

---

## What Happens When You Break the Chain?

MongoDB doesn't crash or throw an error — it just does extra work:

**Finding:** If you skip the first field in filtering, MongoDB does a full collection scan instead of using the index.

**Sorting:** If you skip a field in the middle, MongoDB finds documents using whatever part of the index it can, then sorts the results **in memory**. This is called an in-memory sort and MongoDB has a **32MB limit** on it — large result sets will flat out fail.

```js
// This might fail on large collections if results exceed 32MB
User.find({ role: "admin" }).sort({ username: 1 })
// MongoDB: found admins via index ✅, now sorting 500k admins in memory 💀
```

---

## Sort Directions in Compound Indexes

When sorting, you can either **match the index directions exactly** or **reverse all of them**. What breaks it is reversing only some.

Given `{ role: 1, createdAt: -1, username: 1 }`:

```js
// ✅ exact match
User.find({ role: "admin" }).sort({ createdAt: -1, username: 1 })

// ✅ full reverse — flipping ALL directions is fine
User.find({ role: "admin" }).sort({ createdAt: 1, username: -1 })

// ❌ partial reverse — flipping only SOME directions breaks it
User.find({ role: "admin" }).sort({ createdAt: -1, username: -1 })
User.find({ role: "admin" }).sort({ createdAt: 1, username: 1 })
```

Why? Because a full reverse just means MongoDB reads the index backwards, which it can do efficiently. A partial reverse creates an order that physically doesn't exist in the index and can't be read in one pass.

---

## Why Have Multiple Compound Indexes?

One compound index cannot cover every possible query pattern. Different queries need different indexes.

```js
userSchema.index({ role: 1, createdAt: -1 })  // for: get admins newest first
userSchema.index({ role: 1, createdAt: 1 })   // for: get admins oldest first
userSchema.index({ role: 1, username: 1 })    // for: get admins sorted by name
```

You might think the first index covers the third query — it doesn't. Because `username` is not in the first index at all, sorting by username requires a separate index where it appears right after `role` with nothing in between.

---

## Redundant Indexes — What to Avoid

Thanks to the prefix rule, some indexes are completely redundant:

```js
userSchema.index({ role: 1, createdAt: -1 })  // ← this already covers...
userSchema.index({ role: 1 })                 // ← ...this. redundant, delete it.
```

The first index handles all queries on `role` alone (prefix rule), so the second index is just wasting memory and slowing down writes. Always check if a new single-field index is already covered by an existing compound index before adding it.

---

## The ESR Rule — How to Order Fields

When designing a compound index, follow **ESR** for the best performance:

- **E — Equality** fields first (fields you filter with exact match)
- **S — Sort** fields second
- **R — Range** fields last (greater than, less than, between)

```js
// Query: find all admins, sort by date, where createdAt is in a range
// E = role (exact match filter)
// S = createdAt (sort)
// R = createdAt (range filter)
// Since sort and range share the same field, result:
userSchema.index({ role: 1, createdAt: -1 })

// Query: find verified admins, sort by username, createdAt in a range
// E = verified, role
// S = username
// R = createdAt
userSchema.index({ verified: 1, role: 1, username: 1, createdAt: -1 })
```

Following ESR means MongoDB uses as much of the index as possible before doing any extra work.

---

## Real World Use Cases

### User Admin Panel
```js
// "Show all admins, newest first"
userSchema.index({ role: 1, createdAt: -1 })
User.find({ role: "admin" }).sort({ createdAt: -1 })

// "Show all unverified users, newest first"
userSchema.index({ verified: 1, createdAt: -1 })
User.find({ verified: false }).sort({ createdAt: -1 })
```

### Student Directory
```js
// "Show all CS students at Cairo University, sorted by name"
userSchema.index({ university: 1, major: 1, username: 1 })
User.find({ university: "Cairo University", major: "CS" }).sort({ username: 1 })
```

### E-commerce Products
```js
// "Show all products in Electronics category, sorted by price low to high"
productSchema.index({ category: 1, price: 1 })
Product.find({ category: "Electronics" }).sort({ price: 1 })

// "Show all in-stock Electronics under $500, newest first"
productSchema.index({ category: 1, inStock: 1, price: 1, createdAt: -1 })
Product.find({ category: "Electronics", inStock: true, price: { $lt: 500 } }).sort({ createdAt: -1 })
```

---

## Quick Reference Cheat Sheet

```
Index: { A: 1, B: -1, C: 1 }

FILTERING:
✅ find({ A })
✅ find({ A, B })
✅ find({ A, B, C })
❌ find({ B })           — skipped A
❌ find({ C })           — skipped A and B
❌ find({ A, C })        — skipped B

SORTING:
✅ find({ A }).sort({ B })
✅ find({ A }).sort({ B, C })
✅ find({ A, B }).sort({ C })
✅ find({ A }).sort({ B: -1 })        — reversed single sort field, fine
✅ find({ A }).sort({ B: 1, C: -1 }) — full reverse of index, fine
❌ find({ A }).sort({ C })            — skipped B
❌ find({ A }).sort({ B: -1, C: 1 }) — partial reverse, breaks it

CHAIN RULE:
To use field 2 → field 1 must be filtered or sorted
To use field 3 → field 1 + field 2 must be filtered or sorted
You can stop anywhere, you can never skip.
```

---

## The Bottom Line

Compound indexes are powerful but only when you understand the chain rule. Every field in the index is a link — break the chain by skipping a field and MongoDB falls back to slower operations. Design your indexes around your actual queries, follow the ESR rule for field ordering, and use `.explain()` to verify MongoDB is actually using your index the way you expect.