# Mongoose `$unwind` Aggregation Pipeline

The `$unwind` stage in Mongoose's aggregation pipeline is used to **deconstruct an array field** in a document, outputting one document for each element of the array. It is particularly useful when dealing with embedded arrays within a collection and when used after `$lookup` joins.

## Syntax
```js
Model.aggregate([
  {
    $unwind: "$<array_field>"
  }
])
```
- `<array_field>`: The array field that will be flattened into multiple documents.

## Example Dataset
Consider the following `orders` collection:
```js
const orders = [
  { orderId: 1, customer: "John", items: ["Laptop", "Mouse", "Keyboard"] },
  { orderId: 2, customer: "Jane", items: ["Phone", "Charger"] },
  { orderId: 3, customer: "Bob", items: [] }
];
```

## Basic Example: Flattening an Array Field
Deconstruct the `items` array so that each order item appears as a separate document.
```js
Model.aggregate([
  {
    $unwind: "$items"
  }
])
```
### Output:
```js
[
  { orderId: 1, customer: "John", items: "Laptop" },
  { orderId: 1, customer: "John", items: "Mouse" },
  { orderId: 1, customer: "John", items: "Keyboard" },
  { orderId: 2, customer: "Jane", items: "Phone" },
  { orderId: 2, customer: "Jane", items: "Charger" }
]
```

## Using `$unwind` After `$lookup`
Suppose we have an `orders` collection that references a `products` collection.

### **Collections:**
#### `orders` Collection:
```js
const orders = [
  { orderId: 1, customer: "John", productIds: ["P1", "P2"] },
  { orderId: 2, customer: "Jane", productIds: ["P3"] }
];
```
#### `products` Collection:
```js
const products = [
  { productId: "P1", name: "Laptop", price: 1200 },
  { productId: "P2", name: "Mouse", price: 50 },
  { productId: "P3", name: "Phone", price: 800 }
];
```

### **Aggregation Query with `$lookup` and `$unwind`**
```js
Model.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productIds",
      foreignField: "productId",
      as: "productDetails"
    }
  },
  { $unwind: "$productDetails" }
])
```

### **Output (Flattened Product Details):**
```js
[
  { orderId: 1, customer: "John", productDetails: { productId: "P1", name: "Laptop", price: 1200 } },
  { orderId: 1, customer: "John", productDetails: { productId: "P2", name: "Mouse", price: 50 } },
  { orderId: 2, customer: "Jane", productDetails: { productId: "P3", name: "Phone", price: 800 } }
]
```

## Using `$unwind` with Options
When the array field is empty or missing, `$unwind` will **remove the document from the results**. To keep such documents, use `{ preserveNullAndEmptyArrays: true }`.

### Example
```js
Model.aggregate([
  {
    $unwind: {
      path: "$items",
      preserveNullAndEmptyArrays: true
    }
  }
])
```

### Output (Includes Empty Arrays):
```js
[
  { orderId: 1, customer: "John", items: "Laptop" },
  { orderId: 1, customer: "John", items: "Mouse" },
  { orderId: 1, customer: "John", items: "Keyboard" },
  { orderId: 2, customer: "Jane", items: "Phone" },
  { orderId: 2, customer: "Jane", items: "Charger" },
  { orderId: 3, customer: "Bob", items: null }
]
```

## Performance Considerations
- `$unwind` can **increase the number of documents** in the output, which may impact performance.
- Use `$unwind` with `{ preserveNullAndEmptyArrays: true }` if documents without an array field should be retained.
- When used after `$lookup`, it simplifies working with related data.

## Conclusion
The `$unwind` stage in Mongoose’s aggregation pipeline is a powerful tool for breaking down array fields into multiple documents, making data easier to analyze and process. Combined with `$lookup`, it enables efficient joins and structured outputs.

