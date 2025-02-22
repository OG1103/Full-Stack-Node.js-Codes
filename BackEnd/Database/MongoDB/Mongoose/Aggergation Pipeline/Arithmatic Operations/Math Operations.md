# Mongoose Mathematical Operations in Aggregation Pipeline

Mongoose supports several mathematical operations within the aggregation pipeline to compute statistics on grouped data. The most commonly used mathematical operators include:

- `$sum`: Computes the sum of numeric values.
- `$avg`: Calculates the average value.
- `$max`: Retrieves the maximum value.
- `$min`: Retrieves the minimum value.
- `$count`: Counts the number of documents in a group.

These operations are typically used within the `$group` stage of the aggregation pipeline.

## Syntax

```js
Model.aggregate([
  {
    $group: {
      _id: "$<field>",
      total: { $sum: "$<field>" },
      average: { $avg: "$<field>" },
      max: { $max: "$<field>" },
      min: { $min: "$<field>" },
      count: { $sum: 1 },
    },
  },
]);
```

## Example Dataset

Consider the following `sales` collection:

```js
const sales = [
  { store: "A", amount: 100 },
  { store: "B", amount: 150 },
  { store: "A", amount: 200 },
  { store: "B", amount: 50 },
  { store: "A", amount: 300 },
];
```

## Using Mathematical Operations

```js
Model.aggregate([
  {
    $group: {
      _id: "$store",
      total_sales: { $sum: "$amount" },
      average_sales: { $avg: "$amount" },
      max_sales: { $max: "$amount" },
      min_sales: { $min: "$amount" },
      transaction_count: { $sum: 1 },
    },
  },
]);
```

### Explanation:

- Groups documents by the `store` field.
- `$sum`: Computes the total sales for each store.
- `$avg`: Computes the average sales amount.
- `$max`: Retrieves the highest sales amount.
- `$min`: Retrieves the lowest sales amount.
- `$sum: 1`: Counts the number of transactions per store.

### Output:

```js
[
  {
    _id: "A",
    total_sales: 600,
    average_sales: 200,
    max_sales: 300,
    min_sales: 100,
    transaction_count: 3,
  },
  {
    _id: "B",
    total_sales: 200,
    average_sales: 100,
    max_sales: 150,
    min_sales: 50,
    transaction_count: 2,
  },
];
```

## Complex Example: Sales Analysis with Filtering

Assume a more complex dataset:

```js
const orders = [
  { customer: "John", amount: 250, status: "Completed" },
  { customer: "Jane", amount: 400, status: "Pending" },
  { customer: "John", amount: 150, status: "Completed" },
  { customer: "Jane", amount: 600, status: "Completed" },
  { customer: "Bob", amount: 500, status: "Completed" },
];
```

To compute statistics only for completed transactions:

```js
Model.aggregate([
  { $match: { status: "Completed" } },
  {
    $group: {
      _id: "$customer",
      total_spent: { $sum: "$amount" },
      average_spent: { $avg: "$amount" },
      max_spent: { $max: "$amount" },
      min_spent: { $min: "$amount" },
      order_count: { $sum: 1 },
    },
  },
]);
```

### Output:

```js
[
  {
    _id: "John",
    total_spent: 400,
    average_spent: 200,
    max_spent: 250,
    min_spent: 150,
    order_count: 2,
  },
  {
    _id: "Jane",
    total_spent: 600,
    average_spent: 600,
    max_spent: 600,
    min_spent: 600,
    order_count: 1,
  },
  {
    _id: "Bob",
    total_spent: 500,
    average_spent: 500,
    max_spent: 500,
    min_spent: 500,
    order_count: 1,
  },
];
```

## Conclusion

Mathematical operations in Mongoose’s aggregation pipeline allow for powerful and efficient data analysis. The `$sum`, `$avg`, `$max`, `$min`, and `$count` operators provide insightful summaries for grouped data, helping businesses and applications make data-driven decisions efficiently.
