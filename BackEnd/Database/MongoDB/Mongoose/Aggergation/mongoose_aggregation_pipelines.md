
# Aggregation Pipelines in Mongoose

## **What is an Aggregation Pipeline?**
An **aggregation pipeline** in Mongoose (and MongoDB) is a powerful framework for performing advanced data processing and transformation operations. It allows you to process and analyze data in stages, where the output of one stage becomes the input for the next.

Aggregation pipelines are commonly used for tasks like:
- Filtering data.
- Grouping and counting documents.
- Calculating averages, sums, min, and max values.
- Transforming and projecting data into new formats.
- Performing operations like sorting, limiting, and joining collections.

---

## **How Does It Work?**
The aggregation pipeline consists of multiple **stages**, and each stage performs a specific operation on the data. The results from one stage are passed to the next stage.

### **Syntax**
```javascript
Model.aggregate([
    { stage1 },
    { stage2 },
    ...
]);
```
- **`Model.aggregate()`**: Executes the pipeline on the collection.
- **Stages**: Each stage is a MongoDB aggregation operator (e.g., `$match`, `$group`, `$project`).

---

## **Common Aggregation Stages**

### **1. `$match`**
Filters documents based on a condition (similar to a `find` query).
```javascript
Model.aggregate([
    { $match: { status: "active" } }
]);
```
**Example:**
```javascript
const users = await User.aggregate([
    { $match: { age: { $gte: 18 } } }
]);
```
**Output:**
```json
[
    { "_id": "1", "name": "Alice", "age": 25 },
    { "_id": "2", "name": "Bob", "age": 30 }
]
```

### **2. `$group`**
Groups documents by a field and performs aggregations like count, sum, avg, etc.
```javascript
Model.aggregate([
    { $group: { _id: "$role", total: { $sum: 1 } } }
]);
```
**Example:**
```javascript
const usersByRole = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
]);
```
**Output:**
```json
[
    { "_id": "admin", "count": 5 },
    { "_id": "user", "count": 20 }
]
```

### **3. `$project`**
Shapes the output documents by including or excluding specific fields.
```javascript
Model.aggregate([
    { $project: { name: 1, age: 1, _id: 0 } }
]);
```
**Example:**
```javascript
const userProjections = await User.aggregate([
    { $project: { name: 1, age: 1, _id: 0 } }
]);
```
**Output:**
```json
[
    { "name": "Alice", "age": 25 },
    { "name": "Bob", "age": 30 }
]
```

### **4. `$sort`**
Sorts documents by a field (1 for ascending, -1 for descending).
```javascript
Model.aggregate([
    { $sort: { age: -1 } }
]);
```
**Example:**
```javascript
const sortedUsers = await User.aggregate([
    { $sort: { age: -1 } }
]);
```
**Output:**
```json
[
    { "_id": "2", "name": "Bob", "age": 30 },
    { "_id": "1", "name": "Alice", "age": 25 }
]
```

### **5. `$limit` and `$skip`**
Used to limit the number of documents or skip a certain number of documents.
```javascript
Model.aggregate([
    { $limit: 5 },
    { $skip: 10 }
]);
```

---

## **Full Example: Aggregation Pipeline**
### **Scenario**: Get the total number of users by role, only include active users, sort by count in descending order, and return the top 3.

```javascript
const results = await User.aggregate([
    { $match: { status: "active" } }, // Filter only active users
    { $group: { _id: "$role", totalUsers: { $sum: 1 } } }, // Group by role and count users
    { $sort: { totalUsers: -1 } }, // Sort by count in descending order
    { $limit: 3 } // Limit to the top 3 roles
]);
```
**Output:**
```json
[
    { "_id": "user", "totalUsers": 150 },
    { "_id": "admin", "totalUsers": 50 },
    { "_id": "moderator", "totalUsers": 20 }
]
```

---

## **Advanced Topics**

### **1. Joining Collections with `$lookup`**
Performs a join with another collection.
```javascript
Model.aggregate([
    {
        $lookup: {
            from: "orders", // Collection to join
            localField: "_id", // Field from the current collection
            foreignField: "userId", // Field from the joined collection
            as: "orders" // Alias for the joined data
        }
    }
]);
```

### **2. Adding Fields with `$addFields`**
Adds new fields to documents.
```javascript
Model.aggregate([
    { $addFields: { isActive: { $eq: ["$status", "active"] } } }
]);
```

---

## **Benefits of Aggregation Pipelines**
- **Efficiency**: Processes data within the database, reducing data transfer.
- **Flexibility**: Can handle complex queries and transformations.
- **Scalability**: Optimized for large datasets.

---

## **Best Practices**
1. **Index Fields**: Use indexes on fields used in `$match` and `$group` to improve performance.
2. **Minimize Stages**: Combine stages where possible to reduce complexity.
3. **Test with Explain**: Use `.explain()` to analyze query performance.

---

## **Conclusion**
Mongoose's aggregation pipelines are a powerful tool for transforming and analyzing data efficiently. By chaining stages, you can perform complex operations directly in the database, avoiding the need for additional processing in your application.

This guide provides the foundational understanding you need to leverage aggregation pipelines effectively in your projects. Let me know if you need further clarification or examples!
