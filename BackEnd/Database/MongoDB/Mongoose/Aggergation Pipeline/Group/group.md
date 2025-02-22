# Mongoose `$group` Aggregation Pipeline

Mongoose supports the `$group` stage in aggregation pipelines, which allows documents to be grouped together based on a specified identifier and perform aggregation calculations on grouped data. It functions similarly to the `GROUP BY` clause in SQL.

## Syntax

```js
Model.aggregate([
  {
    $group: {
      _id: "<expression>",
      "<field1>": { "<accumulator>": "<expression>" },
      "<field2>": { "<accumulator>": "<expression>" },
    },
  },
]);
```

- `_id`: Defines the grouping key. Documents with the same `_id` value will be grouped together. If `_id : null` it groups everything (all documents) in one document.
- `<accumulator>`: Specifies the aggregation operation to perform, such as `$sum`, `$avg`, `$max`, `$min`, etc.
- `<expression>`: Specifies the field or computed value to aggregate.
- When specifying a field to group by, the field must be prefixed with `$`, even if it is being renamed. For example, to group by `store`, you must use `"_id": "$store"`.

## Basic Example

Consider the following `sales` collection:

```js
const sales = [
  { store: "A", amount: 100, category: "Electronics" },
  { store: "B", amount: 150, category: "Electronics" },
  { store: "A", amount: 200, category: "Clothing" },
  { store: "B", amount: 50, category: "Clothing" },
  { store: "A", amount: 300, category: "Electronics" },
];
```

### Grouping by Store

```js
Model.aggregate([
  {
    $group: {
      _id: "$store",
      total_sales: { $sum: "$amount" },
    },
  },
]);
```

**Explanation:**

- Groups documents by the `store` field.
- Computes the total sales for each store using `$sum`.

**Output:**

```js
[
  { _id: "A", total_sales: 600 },
  { _id: "B", total_sales: 200 },
];
```

## Grouping by Multiple Fields

We can group by multiple fields by using an object for `_id`:

```js
Model.aggregate([
  {
    $group: {
      _id: { store: "$store", category: "$category" },
      total_sales: { $sum: "$amount" },
    },
  },
]);
```

**Output:**

```js
[
  { _id: { store: "A", category: "Electronics" }, total_sales: 400 },
  { _id: { store: "B", category: "Electronics" }, total_sales: 150 },
  { _id: { store: "A", category: "Clothing" }, total_sales: 200 },
  { _id: { store: "B", category: "Clothing" }, total_sales: 50 },
];
```

## Counting Documents per Category

Consider the following `products` collection:

```js
const products = [
  { category: "Electronics", product: "Laptop" },
  { category: "Electronics", product: "Phone" },
  { category: "Clothing", product: "Shirt" },
  { category: "Electronics", product: "Tablet" },
  { category: "Clothing", product: "Jeans" },
];
```

We want to count how many products exist in each category:

```js
Model.aggregate([
  {
    $group: {
      _id: "$category",
      total: { $sum: 1 },
    },
  },
]);
```

## Using Multiple Aggregation Operators

We can use multiple accumulators in a single `$group` stage.

```js
Model.aggregate([
  {
    $group: {
      _id: "$store",
      total_sales: { $sum: "$amount" },
      average_sales: { $avg: "$amount" },
      max_sales: { $max: "$amount" },
      min_sales: { $min: "$amount" },
    },
  },
]);
```

## Complex Example: Grouping and Filtering

Consider a collection of `orders`:

```js
const orders = [
  { customer: "John", amount: 250, status: "Completed" },
  { customer: "Jane", amount: 400, status: "Pending" },
  { customer: "John", amount: 150, status: "Completed" },
  { customer: "Jane", amount: 600, status: "Completed" },
  { customer: "Bob", amount: 500, status: "Completed" },
];
```

To compute total sales per customer for only `Completed` orders:

```js
Model.aggregate([
  { $match: { status: "Completed" } },
  {
    $group: {
      _id: "$customer",
      total_spent: { $sum: "$amount" },
    },
  },
]);
```

## Nested Grouping Example

Consider a collection of `employees`:

```js
const employees = [
  { name: "Alice", department: "IT", salary: 60000 },
  { name: "Bob", department: "HR", salary: 50000 },
  { name: "Charlie", department: "IT", salary: 70000 },
  { name: "David", department: "HR", salary: 45000 },
];
```

To compute average salary per department and total employees per department:

```js
Model.aggregate([
  {
    $group: {
      _id: "$department",
      average_salary: { $avg: "$salary" },
      total_employees: { $sum: 1 },
    },
  },
]);
```

## Grouping by Null for Aggregated Totals

We can group by `_id: null` to calculate aggregated totals across all documents.

### Example: Finding Total Orders per User and Average Orders per User
```js
Model.aggregate([
  {
    $group: {
      _id: "$customer",
      totalOrders: { $sum: 1 }
    },
  },
  {
    $group: {
      _id: null,
      averageOrders: { $avg: "$totalOrders" }
    },
  }
]);
```

### Output:
```js
[
  { _id: null, averageOrders: 1.67 }
]
```

## Conclusion

The `$group` stage in Mongoose aggregation is a powerful tool for summarizing and analyzing data. It allows grouping by one or more fields and supports multiple accumulators like `$sum`, `$avg`, `$max`, and `$min`. Combining `$group` with other stages like `$match` enables more refined data analysis.
