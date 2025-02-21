
# Nested/Embedded Document

- A **nested document** (also known as an embedded document) refers to a document that is stored as a value within another document. 
- Instead of having flat key-value pairs, MongoDB allows you to store complex data structures directly within a document by embedding other documents inside it. 
- This approach is often used to model relationships between data, or to group related information together in a more compact and efficient way.

## Example of an Embedded Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipcode": "10001"
  }
}
```
- `address` is an embedded document containing the `street`, `city`, and `zipcode` fields.

## Another Example: Collection `orders`

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "customerName": "Alice",
  "orderDate": new Date(),
  "items": [
    {
      "productName": "Laptop",
      "quantity": 1,
      "price": 999.99
    },
    {
      "productName": "Mouse",
      "quantity": 2,
      "price": 19.99
    }
  ],
  "totalAmount": 1039.97
}
```
- `items` is an array of embedded documents, each representing an individual item in the order.
- Each item has its own fields like `productName`, `quantity`, and `price`.

---

## Accessing Embedded Documents

- Using dot notation (wrap the field in `""` when using dot notation), you can **access** fields inside an embedded document.

**Example**: Find all users who live in "New York".
```javascript
db.users.find({ "address.city": "New York" });
```

---

## Updating Embedded Documents

- Using dot notation, you can **update** fields inside an embedded document.

**Example**: Update the zipcode of a user with a specific `_id`.
```javascript
db.users.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  { $set: { "address.zipcode": "10002" } }
);
```
- In this example, we're using dot notation to access and update the `zipcode` field inside the `address` embedded document.

---

## Accessing Arrays of Embedded Documents

- To find orders where a specific product is included, you can use dot notation along with array querying.

**Example**: Find all orders that contain the product "Laptop".
```javascript
db.orders.find({ "items.productName": "Laptop" });
```

- For updating, the same approach applies, just with the update syntax.

---

## When to Use Embedded Documents

1. **One-to-One Relationships**: When the data is closely related and will always be accessed together.  
   *Example*: A user and their address.

2. **One-to-Few Relationships**: If a document will contain a small, finite list of related data.  
   *Example*: An order with a list of items.

3. **Denormalized Data**: If you want to avoid the overhead of querying multiple collections and want to store related data together for easier access.

---

## When Not to Use Embedded Documents

1. **One-to-Many Relationships**: If a document contains too many nested documents (e.g., a blog post with thousands of comments), embedding may not be efficient.

2. **Frequent Updates to Sub-Documents**: If the embedded documents are frequently updated independently from the parent document.
