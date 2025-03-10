# Mongoose $limit and $skip Aggregation Pipeline

The `$limit` and `$skip` stages in Mongoose's aggregation pipeline are used to control the number of documents returned in the result set and to skip a specified number of documents, respectively. These stages are particularly useful for pagination and performance optimization.

## Syntax

### $limit
```js
Model.aggregate([
  {
    $limit: <number_of_documents>
  }
])
```
- `<number_of_documents>`: Specifies the maximum number of documents to return.

### $skip
```js
Model.aggregate([
  {
    $skip: <number_of_documents_to_skip>
  }
])
```
- `<number_of_documents_to_skip>`: Specifies the number of documents to skip.

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

## Using $limit After Sorting

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

## Using $limit and $skip for Pagination

Retrieve the second page of products, assuming 3 products per page:

```js
Model.aggregate([
  {
    $skip: 3,
  },
  {
    $limit: 3,
  },
]);
```

### Output:
```js
[
  { name: "Jeans", price: 70, category: "Clothing" },
  { name: "Tablet", price: 400, category: "Electronics" },
  { name: "Watch", price: 250, category: "Accessories" },
];
```

## Using $limit After Grouping

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

## Using $skip and $limit After Grouping

Find the total price per category, skip the first category, and return the next 2 categories with the highest total price:

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
    $skip: 1,
  },
  {
    $limit: 2,
  },
]);
```

### Output:
```js
[
  { _id: "Accessories", total_price: 400 },
  { _id: "Clothing", total_price: 120 },
];
```

## Performance Considerations

- **$limit**: Should be used early in the pipeline when possible to reduce processing overhead. When used after `$group`, `$sort`, or `$match`, it helps optimize performance by reducing the number of documents passed to later stages.
- **$skip**: Should be used carefully as it can be inefficient with large datasets. It is often used in combination with `$limit` for pagination.
- **Combining $skip and $limit**: This combination is particularly useful for implementing pagination, but it should be used judiciously to avoid performance issues.

## Conclusion

The `$limit` and `$skip` stages in Mongoose’s aggregation pipeline are essential tools for controlling the size of result sets, optimizing query performance, and implementing pagination. They work effectively with stages like `$sort`, `$group`, and `$match` to refine the dataset efficiently. By combining `$skip` and `$limit`, you can easily implement pagination and manage large datasets effectively.