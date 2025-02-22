# Mongoose `$match` Aggregation Pipeline

The `$match` stage in Mongoose's aggregation pipeline is used to filter documents that meet specified conditions. It functions similarly to the `find()` method but within the aggregation framework, allowing for complex filtering before passing data to subsequent stages.

## Syntax
```js
Model.aggregate([
  {
    $match: {
      "<field>": <condition>
    }
  }
])
```
- `<field>`: The field on which filtering is applied.
- `<condition>`: A query condition using comparison operators such as `$eq`, `$gt`, `$lt`, `$gte`, `$lte`, `$ne`, `$in`, `$nin`, etc.

## Example Dataset
Consider the following `orders` collection:
```js
const orders = [
  { customer: "John", amount: 250, status: "Completed" },
  { customer: "Jane", amount: 400, status: "Pending" },
  { customer: "John", amount: 150, status: "Completed" },
  { customer: "Jane", amount: 600, status: "Completed" },
  { customer: "Bob", amount: 500, status: "Completed" }
];
```

## Basic Example: Filtering by Status
Retrieve all completed orders:
```js
Model.aggregate([
  {
    $match: {
      status: "Completed"
    }
  }
])
```
### Output:
```js
[
  { customer: "John", amount: 250, status: "Completed" },
  { customer: "John", amount: 150, status: "Completed" },
  { customer: "Jane", amount: 600, status: "Completed" },
  { customer: "Bob", amount: 500, status: "Completed" }
]
```

## Using `$match` with Comparison Operators
Retrieve orders where `amount` is greater than 200:
```js
Model.aggregate([
  {
    $match: {
      amount: { $gt: 200 }
    }
  }
])
```
### Output:
```js
[
  { customer: "John", amount: 250, status: "Completed" },
  { customer: "Jane", amount: 400, status: "Pending" },
  { customer: "Jane", amount: 600, status: "Completed" },
  { customer: "Bob", amount: 500, status: "Completed" }
]
```

## Using `$match` with Multiple Conditions (`$and`)
Retrieve orders where `amount` is greater than 200 and `status` is "Completed":
```js
Model.aggregate([
  {
    $match: {
      $and: [
        { amount: { $gt: 200 } },
        { status: "Completed" }
      ]
    }
  }
])
```
### Output:
```js
[
  { customer: "John", amount: 250, status: "Completed" },
  { customer: "Jane", amount: 600, status: "Completed" },
  { customer: "Bob", amount: 500, status: "Completed" }
]
```

## Using `$match` with `$in`
Retrieve all orders placed by "John" or "Jane":
```js
Model.aggregate([
  {
    $match: {
      customer: { $in: ["John", "Jane"] }
    }
  }
])
```
### Output:
```js
[
  { customer: "John", amount: 250, status: "Completed" },
  { customer: "Jane", amount: 400, status: "Pending" },
  { customer: "John", amount: 150, status: "Completed" },
  { customer: "Jane", amount: 600, status: "Completed" }
]
```

## Combining `$match` with `$group`
Find total sales per customer but only for completed orders:
```js
Model.aggregate([
  {
    $match: {
      status: "Completed"
    }
  },
  {
    $group: {
      _id: "$customer",
      total_spent: { $sum: "$amount" }
    }
  }
])
```
### Output:
```js
[
  { _id: "John", total_spent: 400 },
  { _id: "Jane", total_spent: 600 },
  { _id: "Bob", total_spent: 500 }
]
```

## Performance Considerations
- `$match` should be placed early in the pipeline to filter out unwanted documents as soon as possible, reducing memory usage and improving performance.
- Indexes on fields used in `$match` conditions can significantly improve query efficiency.
- Combining `$match` with other stages like `$group` and `$sort` allows for optimized data processing.

## Conclusion
The `$match` stage in Mongoose's aggregation pipeline is a powerful filtering tool that enables complex queries by using logical and comparison operators. By using `$match` early in the pipeline and leveraging indexing, developers can improve performance while retrieving meaningful data.

