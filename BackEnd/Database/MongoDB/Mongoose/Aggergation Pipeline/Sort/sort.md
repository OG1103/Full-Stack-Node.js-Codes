# Mongoose `$sort` Aggregation Pipeline

The `$sort` stage in Mongoose's aggregation pipeline is used to arrange documents in a specified order based on one or more fields. Sorting can be done in ascending (`1`) or descending (`-1`) order.

## Syntax

```js
Model.aggregate([
  {
    $sort: {
      "<field1>": <order>,
      "<field2>": <order>
    }
  }
])
```

- `<field>`: The field on which sorting will be performed.
- `<order>`: Specifies the sorting order:
  - `1` for ascending order.
  - `-1` for descending order.

## Example Dataset

Consider the following `products` collection:

```js
const products = [
  { name: "Laptop", price: 1200, category: "Electronics" },
  { name: "Shirt", price: 50, category: "Clothing" },
  { name: "Phone", price: 800, category: "Electronics" },
  { name: "Jeans", price: 70, category: "Clothing" },
  { name: "Tablet", price: 400, category: "Electronics" },
];
```

## Sorting by Price in Ascending Order

```js
Model.aggregate([
  {
    $sort: { price: 1 },
  },
]);
```

### Output:

```js
[
  { name: "Shirt", price: 50, category: "Clothing" },
  { name: "Jeans", price: 70, category: "Clothing" },
  { name: "Tablet", price: 400, category: "Electronics" },
  { name: "Phone", price: 800, category: "Electronics" },
  { name: "Laptop", price: 1200, category: "Electronics" },
];
```

## Sorting by Price in Descending Order

```js
Model.aggregate([
  {
    $sort: { price: -1 },
  },
]);
```

## Sorting by Multiple Fields

Sorting by category (ascending) and price (descending):

```js
Model.aggregate([
  {
    $sort: { category: 1, price: -1 },
  },
]);
```

## Sorting After Grouping

Sorting is often used after grouping to arrange aggregated results. Consider grouping by `category` and summing up the `price` values, then sorting by total price in descending order:

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
]);
```

### Output:

```js
[
  { _id: "Electronics", total_price: 2400 },
  { _id: "Clothing", total_price: 120 },
];
```

## Combining `$sort` with Other Stages

Sorting only `Electronics` items by price in descending order:

```js
Model.aggregate([{ $match: { category: "Electronics" } }, { $sort: { price: -1 } }]);
```

## Performance Considerations

- Sorting large datasets can be expensive. Indexes should be used to optimize sorting performance.
- If sorting occurs after `$group`, Mongoose may need to sort the entire dataset in memory, which can impact performance.
- Using indexes on sorted fields can improve efficiency.

## Conclusion

The `$sort` stage in Mongoose’s aggregation pipeline is a powerful tool for ordering query results. It allows sorting on single or multiple fields and can be combined with other stages like `$match` and `$group` to refine results. Proper indexing and ordering strategies help optimize performance when working with large datasets.
