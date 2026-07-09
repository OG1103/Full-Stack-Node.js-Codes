## Pagination

### What is it

Pagination is the technique of **splitting a large result set into smaller pages** instead of returning everything at once.

Without pagination, a single API call that returns "all orders" could return 100,000 documents. This will:
- Slow the database to a crawl (reading and sorting 100k documents)
- Use massive amounts of RAM to hold the result in memory
- Saturate the network sending all that data
- Crash the client trying to render it

There are two main pagination strategies: **offset pagination** and **cursor pagination**.

### Example

```js
// ❌ BROKEN — no pagination, returns everything
app.get('/orders', async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  // Returns ALL orders — could be tens of thousands
  res.json(orders);
});
```

### Solution

**Solution 1 — Offset Pagination (page + limit):**

The client sends a `page` number and you use `.skip()` and `.limit()` to return the right slice.

```
Page 1: skip 0,  limit 20 → items 1–20
Page 2: skip 20, limit 20 → items 21–40
Page 3: skip 40, limit 20 → items 41–60
```

```js
// ✅ FIXED — offset pagination
app.get('/orders', async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20); // cap at 100 per page
  const skip  = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 }) // always sort for consistent results
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ userId: req.user.id }),
  ]);

  res.json({
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  });
});

// Client calls: GET /orders?page=2&limit=20
```

**Solution 2 — Cursor Pagination (recommended for large/real-time datasets):**

Instead of skipping rows by number, you use the last item's `_id` (or any indexed field) as a cursor. The next page is everything created **after** that cursor.

```
Page 1: find first 20 items
        → last item has _id = "abc123"
Page 2: find first 20 items WHERE _id > "abc123"
Page 3: find first 20 items WHERE _id > last item from page 2
```

```js
// ✅ FIXED — cursor pagination using _id
app.get('/orders', async (req, res) => {
  const limit  = Math.min(100, parseInt(req.query.limit) || 20);
  const cursor = req.query.cursor; // _id of the last item from the previous page

  // Build the query filter
  const filter = { userId: req.user.id };
  if (cursor) {
    filter._id = { $lt: cursor }; // only items with _id less than the cursor
                                  // (MongoDB ObjectIds are time-ordered, so this = older items)
  }

  const orders = await Order.find(filter)
    .sort({ _id: -1 }) // newest first
    .limit(limit + 1)  // fetch one extra to know if there is a next page
    .lean();

  const hasNextPage = orders.length > limit;
  if (hasNextPage) orders.pop(); // remove the extra item we fetched

  const nextCursor = hasNextPage ? orders[orders.length - 1]._id : null;

  res.json({
    data: orders,
    pagination: {
      nextCursor,    // client sends this as ?cursor=xxx on the next request
      hasNextPage,
    },
  });
});

// Client calls:
// Page 1: GET /orders?limit=20
// Page 2: GET /orders?limit=20&cursor=<nextCursor from page 1>
// Page 3: GET /orders?limit=20&cursor=<nextCursor from page 2>
```

### When to use each solution

| Solution | When to use it |
|---|---|
| **Offset pagination** | Admin dashboards, tables where users need to jump to a specific page ("go to page 5"), or small-to-medium datasets. Simple to implement and intuitive for users. **Drawback:** slow on very large collections because `.skip(10000)` still reads 10,000 documents and discards them. |
| **Cursor pagination** | Infinite scroll feeds (Twitter, Instagram), large collections (millions of records), or real-time data where new items are constantly being inserted. **Advantages:** consistent (new inserts don't shift pages), fast at any depth (always uses an index, never skips). **Drawback:** users cannot jump to a specific page number. |
