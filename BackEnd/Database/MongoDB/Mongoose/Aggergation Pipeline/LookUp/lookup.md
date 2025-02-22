# Mongoose `$lookup` Aggregation Pipeline

The `$lookup` stage in Mongoose's aggregation pipeline is used to perform a left outer join with another collection, allowing data from multiple collections to be combined into a single result set.

## Syntax

```js
Model.aggregate([
  {
    $lookup: {
      from: "<foreign_collection>",
      localField: "<local_field>",
      foreignField: "<foreign_field>",
      as: "<new_field>",
    },
  },
]);
```

- `from`: The name of the foreign collection to join.
- `localField`: The field in the current collection that references the foreign collection.
- `foreignField`: The field in the foreign collection that corresponds to `localField`.
- `as`: The name of the new array field where matched documents from the foreign collection will be stored.

## Example Dataset

Consider two collections: `orders` and `customers`.

### `orders` Collection

```js
const orders = [
  { orderId: 1, customerId: "C1", amount: 250 },
  { orderId: 2, customerId: "C2", amount: 400 },
  { orderId: 3, customerId: "C1", amount: 150 },
];
```

### `customers` Collection

```js
const customers = [
  { customerId: "C1", name: "John Doe", email: "john@example.com" },
  { customerId: "C2", name: "Jane Smith", email: "jane@example.com" },
];
```

## Basic Example: Joining Orders with Customers

Retrieve all orders along with customer details.

```js
Model.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "customerId",
      as: "customerDetails",
    },
  },
]);
```

### Output:

```js
[
  {
    orderId: 1,
    customerId: "C1",
    amount: 250,
    customerDetails: [{ customerId: "C1", name: "John Doe", email: "john@example.com" }],
  },
  {
    orderId: 2,
    customerId: "C2",
    amount: 400,
    customerDetails: [{ customerId: "C2", name: "Jane Smith", email: "jane@example.com" }],
  },
  {
    orderId: 3,
    customerId: "C1",
    amount: 150,
    customerDetails: [{ customerId: "C1", name: "John Doe", email: "john@example.com" }],
  },
];
```

## Using `$lookup` with `$unwind`

By default, `$lookup` returns an array of matched documents. To flatten it, use `$unwind`.

```js
Model.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "customerId",
      as: "customerDetails",
    },
  },
  { $unwind: "$customerDetails" },
]);
```

### Output:

```js
[
  {
    orderId: 1,
    customerId: "C1",
    amount: 250,
    customerDetails: { customerId: "C1", name: "John Doe", email: "john@example.com" },
  },
  {
    orderId: 2,
    customerId: "C2",
    amount: 400,
    customerDetails: { customerId: "C2", name: "Jane Smith", email: "jane@example.com" },
  },
  {
    orderId: 3,
    customerId: "C1",
    amount: 150,
    customerDetails: { customerId: "C1", name: "John Doe", email: "john@example.com" },
  },
];
```

## Filtering Lookup Results with `$match`

Retrieve only orders where the customer has an email ending with "example.com".

```js
Model.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "customerId",
      as: "customerDetails",
    },
  },
  { $unwind: "$customerDetails" },
  {
    $match: {
      "customerDetails.email": /example.com$/,
    },
  },
]);
```

## Performance Considerations

- `$lookup` can be costly on large datasets; indexing foreign fields improves performance.
- `$unwind` is useful for simplifying lookup results but increases document size.
- `$match` should be placed early in the pipeline when possible to optimize query efficiency.

## Conclusion

The `$lookup` stage in Mongoose’s aggregation pipeline enables powerful document joining capabilities, allowing efficient querying across collections. Combined with `$unwind` and `$match`, it provides a flexible way to structure and filter relational data efficiently.
