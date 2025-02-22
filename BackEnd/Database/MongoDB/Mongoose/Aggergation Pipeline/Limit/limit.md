# Mongoose `$limit` Aggregation Pipeline

The `$limit` stage in Mongoose's aggregation pipeline is used to restrict the number of documents returned in the result set. It is useful for pagination and performance optimization by ensuring that only a specific number of documents are processed and retrieved.

## Syntax

```js
Model.aggregate([
  {
    $limit: <number_of_documents>
  }
])
```

- `<number_of_documents>`: Specifies the maximum number of documents to return.

## Example Dataset

Consider the following `products` collection:

```js
const products = [
  { name: "Laptop", price: 1200, category: "Electronics" },
  { name: "Shirt", price: 50, category: "Clothing" },
  { name: "Phone", price: 800, category: "Electronics" },
  { name: "Jeans", price: 70, category: "Clothing" },
  { name: "Tablet", price: 400, category: "Electronics" },
  { name: "Watch", price: 250, category: "Accessories" },
  { name: "Sunglasses", price: 150, category: "Accessories" },
];
```

## Basic Example: Limiting Results

Retrieve only the first 3 products:

```js
Model.aggregate([
  {
    $limit: 3,
  },
]);
```

### Output:

```js
[
  { name: "Laptop", price: 1200, category: "Electronics" },
  { name: "Shirt", price: 50, category: "Clothing" },
  { name: "Phone", price: 800, category: "Electronics" },
];
```

## Using `$limit` After Sorting

Retrieve the top 3 most expensive products:

```js
Model.aggregate([
  {
    $sort: { price: -1 },
  },
  {
    $limit: 3,
  },
]);
```

### Output:

```js
[
  { name: "Laptop", price: 1200, category: "Electronics" },
  { name: "Phone", price: 800, category: "Electronics" },
  { name: "Tablet", price: 400, category: "Electronics" },
];
```

## Using `$limit` After Grouping

Find the total price per category and return only the top 2 categories with the highest total price:

```js
Model.aggregate([
  {
    $group: {
      _id: "$category",
      total_price: { $sum: "$price" },
    },
  },
  {
    $sort: { total_price: -1 },
  },
  {
    $limit: 2,
  },
]);
```

### Output:

```js
[
  { _id: "Electronics", total_price: 2400 },
  { _id: "Accessories", total_price: 400 },
];
```

## Performance Considerations

- `$limit` should be used early in the pipeline when possible to reduce processing overhead.
- When used after `$group`, `$sort`, or `$match`, it helps optimize performance by reducing the number of documents passed to later stages.
- `$limit` is particularly useful in combination with `$skip` for pagination.

## Conclusion

The `$limit` stage in Mongoose’s aggregation pipeline is an essential tool for restricting result sets, optimizing query performance, and implementing pagination. It works effectively with stages like `$sort`, `$group`, and `$match` to refine the dataset efficiently.
