
# Relations

When relating a collection to another collection, there are two ways to represent a relation:

1. **Embedded Documents**
2. **References**

---

## 1. Embedded Documents

- We represent a collection within another collection.
- **Example**: Within a customer, we have an embedded document representing the products of this customer.
- **Advantage**: You don't have to query multiple documents to get the desired output.
- **Disadvantage**: Can lead to redundant or duplicate data in a collection.
  - **Example**: If two customers bought the same product, there will be a duplicate entry for that product in both customer documents.
    - **Solution**: Use **references**.

---

## 2. References

- We represent a relation between collections using a foreign key.
- That foreign key is usually the `_id` of the related document.
- **Example**: In a customer document, the `purchases` field contains the IDs of products purchased by the customer, not the actual product documents. The product details are stored in a separate collection, and the customer references the products collection using the `_id` of the product documents.
- **Advantage**: Less or no redundant data.
- **Disadvantage**: Requires querying multiple collections to get the desired result.
  - **Example**: To get the name of a product that a customer purchased, you need to query the customer collection to get the product IDs, and then query the product collection to get the product details using those IDs.

---

## Use Cases: Which Method to Use?

### One-to-One Relation => Embedded Document

- Represent the relation as a nested document. Either collection can have the other as a nested document.
- **Example**: Store a user's contact information as a nested document in the user document.
  ```javascript
  db.collection_name.insertOne({
    name: "omar",
    contact: { email: "test@gmail.com", phone: "01929373673" }
  });
  ```

---

### One-to-One Relation => References

- Use this approach when you're more interested in fields from a specific collection than the other.
- **Example**: If an address document is inside the user document, but you only care about the address fields, you can store the address separately and reference it in the user document.
- In such cases, use references to link the data.

**Querying Multiple Documents (Joining) from Related Collections Using `$lookup` & `aggregate`:**

- **Example**: Assume you're using references. The user collection contains an `address_id` field that references the `_id` field in the address collection.
- To display related address documents for the user, use `$lookup` for joining.

```javascript
db.<collection1>.aggregate([
  {
    $lookup: {
      from: "<collection2>",
      localField: "<field_in_collection1>",
      foreignField: "<field_in_collection2>",
      as: "<output_field_name>"
    }
  }
]);
```

- **Explanation**:
  - `collection1`: The collection where you're starting the query (this collection contains the reference).
  - `from`: The collection you're joining with `collection1`.
  - `localField`: The field in `collection1` that stores the reference (the "joining key").
  - `foreignField`: The field in `collection2` that matches the value in `localField` (the key to join on).
  - `as`: The name of the field in the result where the merged data from `collection2` will be stored.

**Example**:
```javascript
db.customer.aggregate([
  {
    $lookup: {
      from: "address",
      localField: "address_id",
      foreignField: "_id",
      as: "addr"
    }
  }
]);
```
- The result will contain the user details with the joined address details under a field called `addr`.

---

### One-to-Many Relation => Embedded Document

- Same as one-to-one, but ensure that the size of the main document doesn't exceed **16MB**.
- Use embedded documents when you know the total size won't exceed this limit.
- **Example**: For a customer and payment methods (i.e., card details), it's acceptable to use embedded documents since a user won't have many payment methods.

---

### One-to-Many Relation => References

- Use this approach when embedding documents would result in a large document size or potential data overload.
- **Example**: A customer with multiple orders can reference the order IDs, and the order details can be stored in a separate collection.

---

### Many-to-Many Relation => References

- **Example**: An orders collection and a products collection—an order can have many products, and a product can belong to many orders.
- It's not advisable to use embedded documents for many-to-many relations due to redundant or duplicate data.
  - **Reason**: If anything changes, it needs to be updated in multiple places.
- Instead, use references.
- Similar to one-to-many relations, add a reference key in one of the collections, and then join the data as needed.
- **Example**: In the orders collection, store `pids` (product IDs) as a reference key.
