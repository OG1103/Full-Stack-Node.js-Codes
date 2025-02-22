# Logical Operators in Mongoose Aggregation Pipeline

Mongoose provides several logical operators that can be used within the aggregation pipeline to filter, compare, and manipulate data. Logical operators are often used in `$match`, `$expr`, and `$redact` stages for filtering documents based on complex conditions.

## Logical Operators Overview

| Operator  | Description |
|-----------|-------------|
| `$and`    | Matches documents where all conditions are met. |
| `$or`     | Matches documents where at least one condition is met. |
| `$not`    | Inverts the result of a query expression. |
| `$nor`    | Matches documents where none of the conditions are met. |
| `$expr`   | Allows the use of aggregation expressions within `$match`. |
| `$in`     | Matches documents where a field's value is in an array of values. |

---

## Example Dataset
Consider the following `products` collection:
```js
const products = [
  { name: "Laptop", price: 1200, category: "Electronics", stock: 10 },
  { name: "Shirt", price: 50, category: "Clothing", stock: 50 },
  { name: "Phone", price: 800, category: "Electronics", stock: 0 },
  { name: "Jeans", price: 70, category: "Clothing", stock: 20 },
  { name: "Tablet", price: 400, category: "Electronics", stock: 5 }
];
```

## Using `$and`
Retrieve all `Electronics` products that are in stock.
```js
Model.aggregate([
  {
    $match: {
      $and: [
        { category: "Electronics" },
        { stock: { $gt: 0 } }
      ]
    }
  }
])
```
### Output:
```js
[
  { name: "Laptop", price: 1200, category: "Electronics", stock: 10 },
  { name: "Tablet", price: 400, category: "Electronics", stock: 5 }
]
```

## Using `$or`
Retrieve all `Electronics` or products that cost more than $1000.
```js
Model.aggregate([
  {
    $match: {
      $or: [
        { category: "Electronics" },
        { price: { $gt: 1000 } }
      ]
    }
  }
])
```
### Output:
```js
[
  { name: "Laptop", price: 1200, category: "Electronics", stock: 10 },
  { name: "Phone", price: 800, category: "Electronics", stock: 0 },
  { name: "Tablet", price: 400, category: "Electronics", stock: 5 }
]
```

## Using `$not`
Retrieve all products that are NOT `Electronics`.
```js
Model.aggregate([
  {
    $match: {
      category: { $not: { $eq: "Electronics" } }
    }
  }
])
```
### Output:
```js
[
  { name: "Shirt", price: 50, category: "Clothing", stock: 50 },
  { name: "Jeans", price: 70, category: "Clothing", stock: 20 }
]
```

## Using `$nor`
Retrieve all products that are neither `Electronics` nor priced above $500.
```js
Model.aggregate([
  {
    $match: {
      $nor: [
        { category: "Electronics" },
        { price: { $gt: 500 } }
      ]
    }
  }
])
```
### Output:
```js
[
  { name: "Shirt", price: 50, category: "Clothing", stock: 50 },
  { name: "Jeans", price: 70, category: "Clothing", stock: 20 }
]
```

## Using `$expr`
Retrieve products where `stock` is less than `price / 10`.
```js
Model.aggregate([
  {
    $match: {
      $expr: {
        $lt: [ "$stock", { $divide: [ "$price", 10 ] } ]
      }
    }
  }
])
```
### Output:
```js
[
  { name: "Phone", price: 800, category: "Electronics", stock: 0 },
  { name: "Tablet", price: 400, category: "Electronics", stock: 5 }
]
```

## Using `$in`
Retrieve all products where the category is either `Electronics` or `Clothing`.
```js
Model.aggregate([
  {
    $match: {
      category: { $in: ["Electronics", "Clothing"] }
    }
  }
])
```

### Output:
```js
[
  { name: "Laptop", price: 1200, category: "Electronics", stock: 10 },
  { name: "Shirt", price: 50, category: "Clothing", stock: 50 },
  { name: "Phone", price: 800, category: "Electronics", stock: 0 },
  { name: "Jeans", price: 70, category: "Clothing", stock: 20 },
  { name: "Tablet", price: 400, category: "Electronics", stock: 5 }
]
```

### Additional Example: Using `$in` in a Find Query
Find all products with names "Laptop" or "Phone":
```js
Model.find({ name: { $in: ["Laptop", "Phone"] } })
```
### Output:
```js
[
  { name: "Laptop", price: 1200, category: "Electronics", stock: 10 },
  { name: "Phone", price: 800, category: "Electronics", stock: 0 }
]
```

Find all products with a stock of either `0` or `50`:
```js
Model.find({ stock: { $in: [0, 50] } })
```
### Output:
```js
[
  { name: "Phone", price: 800, category: "Electronics", stock: 0 },
  { name: "Shirt", price: 50, category: "Clothing", stock: 50 }
]
```

## Conclusion
Mongoose’s logical operators allow for powerful filtering capabilities in aggregation pipelines. By combining operators like `$and`, `$or`, `$not`, `$nor`, `$expr`, and `$in`, developers can construct highly flexible queries to extract meaningful insights from datasets.

