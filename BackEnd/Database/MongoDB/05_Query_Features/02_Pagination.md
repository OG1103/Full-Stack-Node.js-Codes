# Mongoose — Pagination

Pagination divides large result sets into smaller pages. There are two main approaches: **offset-based** (skip/limit) and **cursor-based** pagination.

---

## 1. Offset-Based Pagination (Skip/Limit)

The most common approach. Uses `skip()` to jump past previous pages and `limit()` to control page size.

### Formula

```
skip = (page - 1) * limit
```

| Page | Skip | Limit | Documents Returned |
|------|------|-------|--------------------|
| 1 | 0 | 10 | 1-10 |
| 2 | 10 | 10 | 11-20 |
| 3 | 20 | 10 | 21-30 |

### Basic Implementation

```javascript
const getProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const products = await Product.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return products;
};
```

### Full Pagination with Metadata

```javascript
const getPaginatedResults = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Run both queries in parallel for efficiency
  const [data, total] = await Promise.all([
    Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};
```

### With Filters and Sorting

```javascript
const getFilteredProducts = async (req, res) => {
  const { page = 1, limit = 10, category, minPrice, maxPrice, sort: sortField } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build filter
  const filter = {};
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Build sort
  const sort = {};
  if (sortField === 'price_asc') sort.price = 1;
  else if (sortField === 'price_desc') sort.price = -1;
  else sort.createdAt = -1;

  const [data, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
    Product.countDocuments(filter),  // Count with same filter
  ]);

  res.json({
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  });
};
```

### Performance Limitation

**Skip/limit degrades with large offsets.** MongoDB must scan and discard all skipped documents:

```
Page 1:    skip(0)      → scans 10 docs      → fast
Page 100:  skip(990)    → scans 1000 docs     → slower
Page 1000: skip(9990)   → scans 10000 docs    → slow
```

For large datasets, consider cursor-based pagination.

---

## 2. Cursor-Based Pagination (Range-Based)

Instead of skipping documents, use the last document's ID or a field value as a cursor to fetch the next batch.

### How It Works

```
Request 1: Get first 10 → last doc has _id: "abc123"
Request 2: Get next 10 where _id > "abc123" → last doc has _id: "def456"
Request 3: Get next 10 where _id > "def456" → ...
```

### Implementation

```javascript
const getCursorPaginatedResults = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const cursor = req.query.cursor;  // Last document's _id from previous page

  const filter = {};
  if (cursor) {
    filter._id = { $gt: cursor };  // Get documents after the cursor
  }

  const data = await Product.find(filter)
    .sort({ _id: 1 })
    .limit(limit + 1)  // Fetch one extra to check if there's a next page
    .lean();

  const hasNextPage = data.length > limit;
  if (hasNextPage) data.pop();  // Remove the extra document

  const nextCursor = hasNextPage ? data[data.length - 1]._id : null;

  res.json({
    data,
    pagination: {
      nextCursor,
      hasNextPage,
    },
  });
};
```

### Cursor-Based with Custom Sort

When sorting by a field other than `_id`, include both the sort field and `_id` in the cursor:

```javascript
const getCursorPaginated = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const { lastCreatedAt, lastId } = req.query;

  const filter = {};
  if (lastCreatedAt && lastId) {
    filter.$or = [
      { createdAt: { $lt: new Date(lastCreatedAt) } },
      {
        createdAt: new Date(lastCreatedAt),
        _id: { $lt: lastId },
      },
    ];
  }

  const data = await Product.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasNextPage = data.length > limit;
  if (hasNextPage) data.pop();

  const lastDoc = data[data.length - 1];

  res.json({
    data,
    pagination: {
      hasNextPage,
      nextCursor: hasNextPage
        ? { lastCreatedAt: lastDoc.createdAt, lastId: lastDoc._id }
        : null,
    },
  });
};
```

---

## 3. Offset vs Cursor Comparison

| Feature | Offset (Skip/Limit) | Cursor-Based |
|---------|---------------------|-------------|
| Jump to specific page | Yes | No |
| Total page count | Easy (`countDocuments`) | Not straightforward |
| Performance at page 1000 | Slow | Consistent |
| Implementation | Simple | More complex |
| Real-time data | Can miss/duplicate items | Stable results |
| Use case | Admin panels, small datasets | Infinite scroll, large datasets |

### When to Use Each

**Offset pagination:** Admin dashboards, search results with page numbers, datasets under 10K documents.

**Cursor pagination:** Infinite scroll (social feeds), large datasets (100K+), real-time data where new items are added frequently.

---

## 4. Reusable Pagination Utility

```javascript
const paginate = async (model, filter = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select = '',
    populate = '',
  } = options;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
      .populate(populate)
      .lean(),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

// Usage:
const result = await paginate(Product, { isActive: true }, {
  page: 2,
  limit: 20,
  sort: { price: -1 },
  select: 'name price image',
  populate: 'category',
});
```

---

## 5. Summary

| Method | Approach | Best For |
|--------|---------|----------|
| `skip()` + `limit()` | Offset | Page numbers, small datasets |
| Cursor + `limit()` | Range-based | Infinite scroll, large datasets |

### Key Points

1. **Always sort** when paginating — results must be deterministic
2. Use `Promise.all()` for parallel count + data queries
3. **Parse query params** to numbers (`parseInt`) before using
4. Skip/limit **degrades at large offsets** — consider cursor-based for scale
5. Include `total`, `totalPages`, `hasNextPage`, `hasPrevPage` in API responses
