
# Sorting in Mongoose Queries

Sorting in Mongoose allows you to retrieve documents from a MongoDB collection in a specified order. You can sort by one or more fields in either ascending or descending order.

---

## 1. Basic Sorting

### Syntax
```javascript
Model.find(query).sort({ field: order });
```
- `field`: The field by which you want to sort the documents.
- `order`: Sorting order. Use `1` for ascending and `-1` for descending.

### Example: Sort by Age in Ascending Order
```javascript
const users = await User.find().sort({ age: 1 });
console.log(users);
```
This query retrieves all users and sorts them by the `age` field in ascending order.

### Example: Sort by Age in Descending Order
```javascript
const users = await User.find().sort({ age: -1 });
console.log(users);
```
This query retrieves all users and sorts them by the `age` field in descending order.

---

## 2. Sorting by Multiple Fields

You can sort by multiple fields by specifying each field in the `sort` object.

### Example: Sort by Age in Ascending Order and then by Name in Descending Order
```javascript
const users = await User.find().sort({ age: 1, name: -1 });
console.log(users);
```
In this example, users are first sorted by `age` in ascending order. If two users have the same age, they are further sorted by `name` in descending order.

---

## 3. Using `sort()` with Query Filters

You can combine `sort()` with query filters to retrieve specific documents in a sorted order.

### Example: Find Users Older Than 18 and Sort by Name
```javascript
const users = await User.find({ age: { $gt: 18 } }).sort({ name: 1 });
console.log(users);
```

---

## 4. Using `sort()` with `select()`

You can use `sort()` together with `select()` to retrieve only specific fields and sort the results.

### Example: Select Only `name` and `age` Fields, and Sort by Age
```javascript
const users = await User.find().select("name age").sort({ age: 1 });
console.log(users);
```

---

## 5. Using `sort()` with `limit()` and `skip()`

You can use `sort()` in combination with `limit()` and `skip()` to implement pagination.

### Example: Sort by Age, Skip the First 5 Documents, and Limit to 10 Documents
```javascript
const users = await User.find().sort({ age: 1 }).skip(5).limit(10);
console.log(users);
```

---

## 6. Sorting with Mongoose `Aggregate`

When using Mongoose’s aggregation framework, you can sort using the `$sort` stage.

### Example: Aggregate and Sort by Age in Descending Order
```javascript
const users = await User.aggregate([
  { $match: { age: { $gte: 18 } } }, // Filter users older than or equal to 18
  { $sort: { age: -1 } } // Sort by age in descending order
]);
console.log(users);
```

### Example: Aggregate and Sort by Multiple Fields
```javascript
const users = await User.aggregate([
  { $sort: { age: 1, name: -1 } } // Sort by age (ascending), then by name (descending)
]);
console.log(users);
```

---

## Summary

- Use `sort()` to retrieve documents in a specific order.
- Specify sorting order using `1` (ascending) or `-1` (descending).
- Combine `sort()` with `limit()`, `skip()`, `select()`, and query filters for more complex queries.
- Use `$sort` when working with Mongoose’s aggregation framework.

By mastering sorting in Mongoose, you can retrieve data in an organized and meaningful way, making your application more efficient and user-friendly.
