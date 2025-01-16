
# Pagination in Express Backend

## Introduction

Pagination is a technique used to split large datasets into smaller chunks or pages, making it easier to handle and display data efficiently. In the context of a backend API, pagination helps reduce the load on the server and improves the client-side experience by returning data in smaller, manageable amounts.

---

## Common Pagination Parameters

1. **`page`**: Indicates the current page number (default is typically `1`).
2. **`limit`**: Specifies the number of items to return per page (default is typically `10` or `20`).

---

## Example Implementation

### 1. Setting Up a Basic Pagination Route

```javascript
// GET /api/v1/products?page=2&limit=5
app.get('/api/v1/products', async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default values

  try {
    // Convert query parameters to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Skip formula: (page - 1) * limit
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch data from the database with pagination
    const products = await Product.find().skip(skip).limit(limitNumber);

    // Return paginated results
    res.status(200).json({
      status: 'success',
      page: pageNumber,
      limit: limitNumber,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

### 2. Counting Total Documents for Pagination

In most cases, you'll also want to return the **total number of documents** and the **total number of pages**.

```javascript
app.get('/api/v1/products', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch paginated products
    const products = await Product.find().skip(skip).limit(limitNumber);

    // Count total number of documents
    const totalDocuments = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limitNumber);

    res.status(200).json({
      status: 'success',
      totalDocuments,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

---

## Advanced Pagination with Sorting and Filtering

In addition to basic pagination, you might want to add **sorting** and **filtering** functionality.

### Example with Sorting and Filtering

```javascript
app.get('/api/v1/products', async (req, res) => {
  const { page = 1, limit = 10, sort = 'price', company } = req.query;

  try {
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter object
    const filter = company ? { company } : {};

    // Fetch sorted and paginated products
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    const totalDocuments = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalDocuments / limitNumber);

    res.status(200).json({
      status: 'success',
      totalDocuments,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

---

## Explanation

1. **`page` and `limit`**: The query parameters `page` and `limit` control which page of data to return and how many items per page.
2. **`skip`**: The `skip` value determines how many documents to skip before starting to return results. It is calculated using the formula `(page - 1) * limit`.
3. **`limit`**: The `limit` value specifies how many documents to return for the current page.
4. **`countDocuments`**: This method counts the total number of documents in the collection to calculate the total number of pages.
5. **Sorting**: The `sort` method allows sorting the results based on a specific field (e.g., `price`, `name`).
6. **Filtering**: The filter object allows returning only the products that match a specific condition (e.g., `company = 'ikea'`).

---

## Conclusion

Pagination is an essential feature for APIs handling large datasets. By implementing pagination, sorting, and filtering, you can improve the performance of your API and provide a better experience for clients consuming the data.

---

## References

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
