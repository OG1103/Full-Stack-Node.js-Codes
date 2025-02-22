# Mongoose `$project` Aggregation Pipeline

The `$project` stage in Mongoose's aggregation pipeline is used to shape the output by including, excluding, or computing new fields in the resulting documents. It is useful for controlling the structure of the documents that are passed to subsequent stages in the pipeline.

## Syntax

```js
Model.aggregate([
  {
    $project: {
      "<field1>": <value>,
      "<field2>": <value>,
      "computed_field": { <expression> }
    }
  }
])
```

- `<field>`: The field to include (`1`) or exclude (`0`).
- `computed_field`: A new field that can be computed using expressions such as `$concat`, `$multiply`, `$substr`, etc.

## Example Dataset

Consider the following `employees` collection:

```js
const employees = [
  { name: "Alice", department: "IT", salary: 60000 },
  { name: "Bob", department: "HR", salary: 50000 },
  { name: "Charlie", department: "IT", salary: 70000 },
  { name: "David", department: "HR", salary: 45000 },
];
```

## Including and Excluding Fields

Retrieve only `name` and `department`, excluding `_id`.

```js
Model.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      department: 1,
    },
  },
]);
```

### Output:

```js
[
  { name: "Alice", department: "IT" },
  { name: "Bob", department: "HR" },
  { name: "Charlie", department: "IT" },
  { name: "David", department: "HR" },
];
```

## Computing New Fields

Create a new field `annualBonus` as 10% of `salary`.

```js
Model.aggregate([
  {
    $project: {
      name: 1,
      department: 1,
      salary: 1,
      annualBonus: { $multiply: ["$salary", 0.1] },
    },
  },
]);
```

### Output:

```js
[
  { name: "Alice", department: "IT", salary: 60000, annualBonus: 6000 },
  { name: "Bob", department: "HR", salary: 50000, annualBonus: 5000 },
  { name: "Charlie", department: "IT", salary: 70000, annualBonus: 7000 },
  { name: "David", department: "HR", salary: 45000, annualBonus: 4500 },
];
```

## Renaming Fields

Rename `department` to `dept`.

```js
Model.aggregate([
  {
    $project: {
      name: 1,
      dept: "$department",
    },
  },
]);
```

### Output:

```js
[
  { name: "Alice", dept: "IT" },
  { name: "Bob", dept: "HR" },
  { name: "Charlie", dept: "IT" },
  { name: "David", dept: "HR" },
];
```

## Using String Concatenation

Create a `fullName` field combining `name` and `department`.

```js
Model.aggregate([
  {
    $project: {
      fullName: { $concat: ["$name", " (", "$department", ")"] },
    },
  },
]);
```

### Output:

```js
[
  { fullName: "Alice (IT)" },
  { fullName: "Bob (HR)" },
  { fullName: "Charlie (IT)" },
  { fullName: "David (HR)" },
];
```

## Using `$project` After Grouping

Find the total salary per department and then format the output to include a new computed field `formattedSalary` with a currency symbol.

```js
Model.aggregate([
  {
    $group: {
      _id: "$department",
      totalSalary: { $sum: "$salary" },
    },
  },
  {
    $project: {
      _id: 0,
      department: "$_id",
      totalSalary: 1,
      formattedSalary: { $concat: ["$", { $toString: "$totalSalary" }] },
    },
  },
]);
```

### Output:

```js
[
  { department: "IT", totalSalary: 130000, formattedSalary: "$130000" },
  { department: "HR", totalSalary: 95000, formattedSalary: "$95000" },
];
```

## Performance Considerations

- `$project` is useful for reducing the size of documents passed to later stages, improving performance.
- Excluding `_id` can be beneficial when `_id` is not required.
- Computed fields can help transform data within the aggregation pipeline without modifying the original documents.

## Conclusion

The `$project` stage in Mongoose’s aggregation pipeline is a powerful tool for structuring and transforming query results. By selectively including, excluding, renaming, or computing new fields, `$project` enables efficient and meaningful data manipulation.
