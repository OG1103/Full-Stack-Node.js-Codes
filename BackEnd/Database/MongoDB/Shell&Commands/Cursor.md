# Cursor In MongoDB

- In MongoDB, when you perform a query (e.g., `find()`), it returns a **cursor object** rather than the actual results right away. 
- A cursor is a pointer to the result set of a query (list of documents). It allows you to iterate over the results and process them one at a time or in batches.

## What is a Cursor?

- A cursor is an object that points to a set of documents returned by a query. 
- Instead of loading all results into memory at once, MongoDB uses cursors to retrieve data in a more efficient, streaming way, particularly for large datasets.

## Cursor Methods in MongoDB

Cursors come with several methods that allow you to manipulate and interact with the result set.

1. **toArray()**:
   - Fetches all the documents from the cursor into an array. Returns all the documents instead of batches of documents.
   - Example:
     ```javascript
     db.customers.find({ age: { $gt: 18 } }).toArray();
     ```

2. **forEach()**:
   - Iterates through the cursor and applies a function to each document.

3. **limit(n)**:
   - Limits the number of documents returned by the query to `n`.
   - Example:
     ```javascript
     const cursor = db.customers.find().limit(10);  // Only return 10 documents
     ```

4. **skip(n)**:
   - Skips the first `n` documents in the result set.
   - Example:
     ```javascript
     const cursor = db.customers.find().skip(5);  // Skip the first 5 documents
     ```

5. **sort()**:
   - Sorts the documents by a specified field in ascending (`1`) or descending (`-1`) order.
   - Example:
     ```javascript
     db.customers.find().sort({ age: -1 });  // Sort by age in descending order
     ```
