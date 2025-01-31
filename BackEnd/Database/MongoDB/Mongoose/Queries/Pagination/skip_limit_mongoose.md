
# Using `skip()` and `limit()` in Mongoose

## Introduction

In **Mongoose**, the `skip()` and `limit()` methods are commonly used for implementing **pagination**. They allow you to control how many documents are returned in a query result and where to start returning documents from.

- **`limit()`**: Specifies the maximum number of documents to return.
- **`skip()`**: Specifies the number of documents to skip before starting to return the results.

---

## Syntax

```javascript
Model.find(query).skip(n).limit(m);
```

- `n`: The number of documents to skip.
- `m`: The maximum number of documents to return.

---

## Example Usage

### 1. Basic Example

Assume you have a collection of products and want to retrieve documents in chunks of 5.

```javascript
const getProducts = async (page = 1, limit = 5) => {
  const skip = (page - 1) * limit;
  const products = await Product.find().skip(skip).limit(limit);
  console.log(products);
};
```

- **Page 1**: `skip = (1 - 1) * 5 = 0` → Retrieves the first 5 documents.
- **Page 2**: `skip = (2 - 1) * 5 = 5` → Skips the first 5 documents and retrieves the next 5.
- **Page 3**: `skip = (3 - 1) * 5 = 10` → Skips the first 10 documents and retrieves the next 5.

---

### 2. Example with Filtering and Sorting

You can combine `skip()` and `limit()` with filtering and sorting to create a more complex query.

```javascript
const getFilteredProducts = async (page = 1, limit = 5, company = "ikea") => {
  const skip = (page - 1) * limit;
  const products = await Product.find({ company })
    .sort({ price: 1 }) // Sort by price in ascending order
    .skip(skip)
    .limit(limit);
  console.log(products);
};
```

In this example:

- Only products from the specified company are returned.
- The results are sorted by `price` in ascending order.
- The `skip` and `limit` methods are applied for pagination.

---

## Explanation

1. **`skip(n)`**: Skips the first `n` documents in the result set. It is useful when implementing pagination to display different pages of results.
2. **`limit(m)`**: Limits the number of documents returned to `m`. It ensures that only a fixed number of documents are returned, which is crucial for pagination or when you only need a subset of data.

---

## Practical Use Case: Implementing Pagination in an API

```javascript
app.get("/api/products", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(parseInt(limit));
    res.status(200).json({ status: "success", data: products });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
```

### How It Works:

- The API accepts `page` and `limit` as query parameters.
- `skip` is calculated using the formula `(page - 1) * limit`.
- The result is paginated by applying `skip()` and `limit()` to the query.

---

## Notes

1. **Performance Considerations**:
   - When using `skip()` with large datasets, performance may degrade because MongoDB has to scan and skip over a large number of documents.
   - For better performance with large datasets, consider using **range-based pagination** instead of `skip()`.
   
2. **Combining with `countDocuments()`**:
   - To implement full pagination (including total pages), you can use `countDocuments()` to get the total number of documents and calculate the total number of pages.

   ```javascript
   const totalDocuments = await Product.countDocuments();
   const totalPages = Math.ceil(totalDocuments / limit);
   ```

---

## Conclusion

The `skip()` and `limit()` methods in Mongoose are essential tools for implementing pagination. By combining them with filtering, sorting, and `countDocuments()`, you can create efficient and scalable APIs that return large datasets in smaller, manageable chunks.

---

## References

- [Mongoose Documentation](https://mongoosejs.com/docs/queries.html)
