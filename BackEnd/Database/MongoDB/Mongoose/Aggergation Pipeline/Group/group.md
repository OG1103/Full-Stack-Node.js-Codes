# 📊 Mongoose `$group` Aggregation Pipeline – Full Guide

Mongoose (via MongoDB) supports the `$group` stage in aggregation pipelines, allowing you to group documents based on one or more fields and perform calculations like `$sum`, `$avg`, `$max`, etc. This behaves similarly to SQL’s `GROUP BY`.

---

## 🧩 Basic Syntax

```js
Model.aggregate([
  {
    $group: {
      _id: <expression>,
      <newField>: { <accumulator>: <expression> }
    }
  }
]);
````

---

## 🤔 What Is an Expression?

An **expression** in MongoDB aggregation is a way to tell MongoDB **which field or value to use** when performing grouping or calculations.

- Expressions always start with `$` if you're referencing a field (like `$amount` or `$store`).
- You use expressions in two places inside `$group`:

### 1. In `_id` — to define how to group the documents  
### 2. In accumulator operations — to define what value to calculate

### ✅ Example:

```js
$group: {
  _id: "$store",                    // group by the value of the "store" field
  total_sales: { $sum: "$amount" } // sum the values of the "amount" field
}
````

* `$store` is the **expression** used for `_id`
* `$amount` is the **expression** used for `$sum`

---

### 🧮 Computed Expression Example:

You can also use expressions inside other operators:

```js
$sum: { $multiply: [ "$price", "$quantity" ] }
```

This multiplies `price × quantity` for each document and sums the result.



---

## ✅ Example Dataset

```js
const orders = [
  { customer: "Alice", price: 10, quantity: 2 },
  { customer: "Alice", price: 5, quantity: 4 },
  { customer: "Bob", price: 20, quantity: 1 }
];
```

---

## ✅ Group by One Field

```js
Model.aggregate([
  {
    $group: {
      _id: "$customer",
      totalOrders: { $sum: 1 }
    }
  }
]);
```

### Output:

```json
[
  { "_id": "Alice", "totalOrders": 2 },
  { "_id": "Bob", "totalOrders": 1 }
]
```

---

## 🔁 Push Full Documents with `$$ROOT`

You can group by a field and **push entire documents** into a group using `$$ROOT`.

```js
Model.aggregate([
  {
    $group: {
      _id: "$customer",
      orders: { $push: "$$ROOT" }
    }
  }
]);
```

### Output:

```json
[
  {
    "_id": "Alice",
    "orders": [
      { "customer": "Alice", "price": 10, "quantity": 2 },
      { "customer": "Alice", "price": 5, "quantity": 4 }
    ]
  },
  {
    "_id": "Bob",
    "orders": [
      { "customer": "Bob", "price": 20, "quantity": 1 }
    ]
  }
]
```

---

## 🔄 `$sum` with `$multiply`: Compute Total Value

You can combine `$sum` with `$multiply` to calculate total spending per customer:

```js
Model.aggregate([
  {
    $group: {
      _id: "$customer",
      total_spent: {
        $sum: { $multiply: ["$price", "$quantity"] }
      }
    }
  }
]);
```

### Output:

```json
[
  { "_id": "Alice", "total_spent": 40 },
  { "_id": "Bob", "total_spent": 20 }
]
```

### Explanation:

| Customer | Price × Quantity | Subtotal |
| -------- | ---------------- | -------- |
| Alice    | 10 × 2 = 20      | 20       |
| Alice    | 5 × 4 = 20       | 40       |
| Bob      | 20 × 1 = 20      | 20       |

---

Certainly! Here's your `## 📦 Group by Multiple Fields` section with an example output added in clean `.md` format:

---
## 📦 Group by Multiple Fields

To group by more than one field, use an object for `_id`:

```js
Model.aggregate([
  {
    $group: {
      _id: {
        customer: "$customer",
        item: "$productName"
      },
      total: { $sum: "$quantity" }
    }
  }
]);
````

### 📤 Example Input:

```js
[
  { customer: "Alice", productName: "Laptop", quantity: 1 },
  { customer: "Alice", productName: "Laptop", quantity: 2 },
  { customer: "Bob", productName: "Phone", quantity: 1 },
  { customer: "Alice", productName: "Phone", quantity: 1 }
]
```

### ✅ Example Output:

```json
[
  {
    "_id": { "customer": "Alice", "item": "Laptop" },
    "total": 3
  },
  {
    "_id": { "customer": "Bob", "item": "Phone" },
    "total": 1
  },
  {
    "_id": { "customer": "Alice", "item": "Phone" },
    "total": 1
  }
]
```

### 🔍 Explanation:

* This groups orders **by both customer and product**.
* Each unique combination of `customer + productName` becomes a group.
* The `total` field is the **sum of quantities** per group.



---

## 📚 Count Per Category Example

```js
Model.aggregate([
  {
    $group: {
      _id: "$category",
      total: { $sum: 1 }
    }
  }
]);
```

### Output:

```json
[
  { "_id": "Electronics", "total": 3 },
  { "_id": "Clothing", "total": 2 }
]
```

---

## 📊 Multiple Accumulators

```js
Model.aggregate([
  {
    $group: {
      _id: "$store",
      total_sales: { $sum: "$amount" },
      avg_sales: { $avg: "$amount" },
      max_sale: { $max: "$amount" },
      min_sale: { $min: "$amount" }
    }
  }
]);
```

---

## 🔍 Using `$match` Before `$group`

```js
Model.aggregate([
  { $match: { status: "Completed" } },
  {
    $group: {
      _id: "$customer",
      total_spent: { $sum: "$amount" }
    }
  }
]);
```

---

## 🧮 Group All Documents Together

Use `_id: null` to group all documents into a single group:

```js
Model.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: "$amount" },
      average: { $avg: "$amount" }
    }
  }
]);
```

---

## 🧠 Summary Table

| Task                             | Example                                   |
| -------------------------------- | ----------------------------------------- |
| Group by one field               | `_id: "$customer"`                        |
| Group by multiple fields         | `_id: { f1: "$field1", f2: "$field2" }`   |
| Count documents                  | `{ $sum: 1 }`                             |
| Push full documents into a group | `{ $push: "$$ROOT" }`                     |
| Total price × quantity per doc   | `$sum: { $multiply: ["$price", "$qty"] }` |
| Combine with filters             | Use `$match` before `$group`              |

---

## ✅ Conclusion

* Use **expressions** to reference fields or perform calculations inside `$group`.
* Use `$sum`, `$avg`, `$max`, `$min`, and `$push` to build powerful aggregation logic.
* Use `$multiply` inside `$sum` to calculate totals like `price × quantity`.
* Use `$$ROOT` to push entire documents into group buckets.
* Group by one or multiple fields using structured `_id` objects.

MongoDB's aggregation framework is a powerful tool for summarizing, analyzing, and reshaping data right inside the database.

```
```
