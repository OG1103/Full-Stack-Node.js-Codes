# Pagination in Express

Pagination splits large datasets into smaller pages, reducing server load and improving the client experience by returning data in manageable chunks.

---

## 1. Core Concepts

| Term | Description |
|------|-------------|
| `page` | Current page number (default: 1) |
| `limit` | Items per page (default: 10) |
| `skip` | Documents to skip: `(page - 1) * limit` |
| `totalDocuments` | Total items in the collection |
| `totalPages` | `Math.ceil(totalDocuments / limit)` |

### The Skip Formula

```
Page 1, Limit 10 → Skip 0  → Items 1-10
Page 2, Limit 10 → Skip 10 → Items 11-20
Page 3, Limit 10 → Skip 20 → Items 21-30
```

---

## 2. Basic Pagination

```javascript
// GET /api/products?page=2&limit=5
app.get('/api/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find()
      .skip(skip)
      .limit(limit);

    const totalDocuments = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    res.json({
      status: 'success',
      totalDocuments,
      totalPages,
      currentPage: page,
      limit,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

### Response Example

```json
{
  "status": "success",
  "totalDocuments": 50,
  "totalPages": 5,
  "currentPage": 2,
  "limit": 10,
  "data": [
    { "_id": "...", "name": "Product 11", "price": 29.99 },
    { "_id": "...", "name": "Product 12", "price": 39.99 }
  ]
}
```

---

## 3. Pagination with Sorting

```javascript
// GET /api/products?page=1&limit=10&sort=-price (descending price)
app.get('/api/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || '-createdAt'; // Default: newest first
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find()
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalDocuments = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    res.json({
      totalDocuments,
      totalPages,
      currentPage: page,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

### Sort Syntax

| Query | Mongoose Sort | Effect |
|-------|--------------|--------|
| `sort=price` | `{ price: 1 }` | Ascending (low to high) |
| `sort=-price` | `{ price: -1 }` | Descending (high to low) |
| `sort=name,-price` | `{ name: 1, price: -1 }` | Name A-Z, then price high to low |

---

## 4. Pagination with Filtering

```javascript
// GET /api/products?page=1&limit=10&company=ikea&minPrice=20&maxPrice=100
app.get('/api/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || '-createdAt';
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = {};

  if (req.query.company) {
    filter.company = req.query.company;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }

  try {
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Count must use the same filter
    const totalDocuments = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalDocuments / limit);

    res.json({
      totalDocuments,
      totalPages,
      currentPage: page,
      limit,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

**Important:** `countDocuments()` must use the **same filter** as `find()`, otherwise the total count won't match the filtered results.

---

## 5. Reusable Pagination Helper

Extract pagination logic into a reusable function:

```javascript
// utils/paginate.js
export const paginate = async (Model, filter = {}, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const sort = options.sort || '-createdAt';
  const skip = (page - 1) * limit;

  const [data, totalDocuments] = await Promise.all([
    Model.find(filter).sort(sort).skip(skip).limit(limit),
    Model.countDocuments(filter),
  ]);

  return {
    totalDocuments,
    totalPages: Math.ceil(totalDocuments / limit),
    currentPage: page,
    limit,
    data,
  };
};
```

### Usage in Routes

```javascript
import { paginate } from '../utils/paginate.js';

app.get('/api/products', async (req, res) => {
  try {
    const filter = {};
    if (req.query.company) filter.company = req.query.company;

    const result = await paginate(Product, filter, {
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await paginate(User, {}, req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

---

## 6. Adding Previous/Next Links

Provide navigation links for the frontend:

```javascript
app.get('/api/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find().skip(skip).limit(limit);
    const totalDocuments = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      totalDocuments,
    };

    if (page < totalPages) {
      pagination.next = { page: page + 1, limit };
    }
    if (page > 1) {
      pagination.prev = { page: page - 1, limit };
    }

    res.json({ pagination, data: products });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

### Response

```json
{
  "pagination": {
    "currentPage": 2,
    "totalPages": 5,
    "totalDocuments": 50,
    "next": { "page": 3, "limit": 10 },
    "prev": { "page": 1, "limit": 10 }
  },
  "data": [...]
}
```

---

## 7. Summary

| Component | Method | Purpose |
|-----------|--------|---------|
| `skip()` | `(page - 1) * limit` | Skip documents for current page |
| `limit()` | From query param | Restrict results per page |
| `sort()` | From query param | Order results |
| `countDocuments()` | With same filter | Calculate total pages |
| `find()` | With filter object | Apply search/filter criteria |

### Query Parameter Cheatsheet

```
GET /api/products?page=2&limit=10&sort=-price&company=ikea&search=table
```

| Parameter | Purpose | Default |
|-----------|---------|---------|
| `page` | Current page number | 1 |
| `limit` | Items per page | 10 |
| `sort` | Sort field (`-` prefix for descending) | `-createdAt` |
| `company` | Filter by company | None |
| `search` | Search by name (regex) | None |
