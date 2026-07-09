# Mongoose — Pagination

Two main approaches: **offset-based** (skip/limit — simple, supports page numbers) and **cursor-based** (fast at any depth, stable under live data).

| | Offset (skip/limit) | Cursor-based |
|---|---------------------|-------------|
| Jump to page N | Yes | No (next/prev only) |
| Total page count | Easy | Awkward |
| Speed at page 1000 | Slow (scans skipped docs) | Constant |
| Items shifting during browsing | Can duplicate/skip items | Stable |
| Best for | Admin panels, small datasets | Infinite scroll, large datasets |

---

## 1. Offset-Based Pagination (Skip/Limit)

### Formula

```
skip = (page - 1) * limit
```

| Page | Skip | Limit | Returns docs |
|------|------|-------|--------------|
| 1 | 0 | 10 | 1–10 |
| 2 | 10 | 10 | 11–20 |
| 3 | 20 | 10 | 21–30 |

### Full Implementation with Metadata

```javascript
const getPaginatedResults = async (req, res) => {
  // Parse and SANITIZE input — query params are strings and can be garbage
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  // Run data + count queries in parallel
  const [data, total] = await Promise.all([
    Product.find()
      .sort({ createdAt: -1, _id: -1 })   // _id tiebreaker → deterministic order
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(),
  ]);

  res.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  });
};
```

**What happens per situation:**

| Situation | Result |
|-----------|--------|
| Page within range | That page's docs |
| Page beyond the last page | `data: []` — no error, just empty |
| `page=0`, negative, or `page=abc` | Without sanitizing: `parseInt` → `NaN` → `skip(NaN)` throws. Clamp as above |
| Huge `limit` from client | Without a cap, one request can pull the whole collection — always cap (e.g., 100) |
| Empty collection | `data: []`, `total: 0`, `totalPages: 0` |

### With Filters — Count Must Use the SAME Filter

```javascript
const filter = {};
if (category) filter.category = category;
if (minPrice || maxPrice) {
  filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
}

const [data, total] = await Promise.all([
  Product.find(filter).sort({ price: 1, _id: 1 }).skip(skip).limit(limit).lean(),
  Product.countDocuments(filter),   // ← same filter! countDocuments() alone gives wrong totalPages
]);
```

### The Two Big Weaknesses of Skip/Limit

**1. Performance degrades with depth.** MongoDB must scan and discard every skipped document:

```
Page 1:    skip(0)     → scans 10 docs     → fast
Page 100:  skip(990)   → scans 1,000 docs  → slower
Page 1000: skip(9990)  → scans 10,000 docs → slow
```

**2. Unstable under live data (phantom/duplicate items).** If a new doc is inserted at the top between fetching page 1 and page 2, everything shifts down by one — the last item of page 1 reappears as the first item of page 2, and one doc is silently never shown. Cursor-based pagination fixes both problems.

---

## 2. Cursor-Based Pagination

Instead of counting/skipping, remember **where the last page ended** and query "everything after that point":

```
Request 1: first 10           → last doc _id = "abc"
Request 2: where _id > "abc"  → last doc _id = "def"
Request 3: where _id > "def"  → ...
```

Because the query is `{ _id: { $gt: cursor } }` (an indexed range), it's equally fast on page 1 and page 10,000, and inserts elsewhere don't shift your position.

### Basic Implementation (sorted by `_id`)

```javascript
const getCursorPage = async (req, res) => {
  const limit = Math.min(100, parseInt(req.query.limit) || 10);
  const cursor = req.query.cursor;   // last doc's _id from the previous page

  const filter = cursor ? { _id: { $gt: cursor } } : {};

  const data = await Product.find(filter)
    .sort({ _id: 1 })
    .limit(limit + 1)   // fetch ONE extra to know if there's a next page
    .lean();

  const hasNextPage = data.length > limit;
  if (hasNextPage) data.pop();   // remove the extra doc

  res.json({
    data,
    pagination: {
      nextCursor: hasNextPage ? data[data.length - 1]._id : null,
      hasNextPage,
    },
  });
};
```

**The `limit + 1` trick:** fetching one extra document tells you whether more exist without a separate count query. If you got 11 back for a limit of 10, there's a next page.

**Edge cases:**

| Situation | Result |
|-----------|--------|
| No cursor (first page) | First `limit` docs |
| Cursor at the very end | `data: []`, `nextCursor: null` — no error |
| Invalid/malformed cursor | Throws `CastError` — validate or handle as 400 |
| Cursor doc was deleted | Still works — `$gt` is a range, not a lookup on that doc |

### Cursor with a Custom Sort (e.g., newest first)

When sorting by a non-unique field like `createdAt`, two docs can share the same value — the cursor must include a **tiebreaker** (`_id`) or docs on the boundary get skipped or repeated:

```javascript
const { lastCreatedAt, lastId } = req.query;

const filter = {};
if (lastCreatedAt && lastId) {
  filter.$or = [
    { createdAt: { $lt: new Date(lastCreatedAt) } },              // strictly older
    { createdAt: new Date(lastCreatedAt), _id: { $lt: lastId } }, // same time → break tie by _id
  ];
}

const data = await Product.find(filter)
  .sort({ createdAt: -1, _id: -1 })   // sort must match the cursor logic
  .limit(limit + 1)
  .lean();
```

**The rule:** whatever fields you sort by, the cursor must carry all of them plus `_id`, and the filter must express "strictly after the cursor position" using the same order.

---

## 3. Reusable Pagination Utility (offset-based)

```javascript
const paginate = async (model, filter = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1, _id: -1 },
    select = '',
    populate = '',
  } = options;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit).select(select).populate(populate).lean(),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page, limit, total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

// Usage
const result = await paginate(Product, { isActive: true }, {
  page: 2, limit: 20, sort: { price: -1, _id: -1 }, select: 'name price',
});
```

---

## 4. Summary

### Key Points

1. **Always sort when paginating**, and always include `_id` as a tiebreaker — without it, tied docs can swap order between pages (duplicated/missing items).
2. **Sanitize inputs:** clamp `page >= 1`, cap `limit`, guard against `NaN` — `skip(NaN)` and unbounded limits are real failure modes.
3. Count with the **same filter** as the data query, in parallel via `Promise.all`.
4. Page beyond the end → empty array, not an error.
5. Skip/limit gets slow at deep offsets and is unstable under live inserts — switch to cursor-based for feeds and large datasets.
6. Cursor pagination: fetch `limit + 1` to detect the next page; include sort fields + `_id` in the cursor when sorting by non-unique fields.
