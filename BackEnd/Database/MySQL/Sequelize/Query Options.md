# Sequelize Query Options Explained

Sequelize provides a rich set of options to customize your database queries. These options allow you to control what data is fetched, how it's filtered, sorted, grouped, and more. This guide explains the commonly used Sequelize query options, their purposes, and examples of how to use them.

---

## Recommended Order for Query Options

For clarity and maintainability, it's best to structure query options in the following order:

1. **`attributes`**: Specify which columns to retrieve.
2. **`where`**: Define the filtering criteria.
3. **`include`**: Add related models or associations.
4. **`order`**: Specify how the results should be ordered.
5. **`group`**: Define grouping logic.
6. **`limit` and `offset`**: Handle pagination.

---

## Explanation of Query Options

### 1. `attributes`

Specifies which columns to include in the result. Use this to limit the data returned and improve query performance.

#### Example:

```javascript
const users = await Users.findAll({
  attributes: ["id", "firstName", "email"], // Select specific fields
});
```

#### Aliases with `attributes`:

```javascript
const users = await Users.findAll({
  attributes: [
    "id",
    ["firstName", "first_name_alias"], // Rename column in the result
    [sequelize.fn("COUNT", sequelize.col("id")), "userCount"], // Aggregation
  ],
});
```

---

### 2. `where`

Defines the conditions to filter records. It supports complex conditions, logical operators, and nested queries using Sequelize operators.

#### Operators:
- **`Op.eq`**: Equal to a value.
- **`Op.ne`**: Not equal to a value.
- **`Op.gte`**: Greater than or equal to.
- **`Op.gt`**: Greater than.
- **`Op.lte`**: Less than or equal to.
- **`Op.lt`**: Less than.
- **`Op.in`**: Matches any value in an array.
- **`Op.or`**: Logical OR conditions.
- **`Op.and`**: Logical AND conditions.

#### Example:

```javascript
// basic AND condition
const activeUsers = await Users.findAll({
  where: {
    isActive: true, // Simple condition
    createdAt: {
      [Op.gte]: new Date("2023-01-01"), // Filter by date range
    },
  },
});
```

#### Using Logical Operators:

```javascript
const users = await Users.findAll({
  where: {
    [Op.or]: [
      { role: 'admin' },
      { role: 'manager' },
    ], // Matches users with role 'admin' OR 'manager'
    isActive: true, // Additional condition
  },
});
```

#### Combining `where` with `having`:
- **`where`** filters rows before grouping.
- **`having`** filters grouped rows.

```javascript
const userStats = await Users.findAll({
  attributes: [
    'role',
    [sequelize.fn('COUNT', sequelize.col('id')), 'userCount'],
  ],
  where: {
    isActive: true, // Filters rows before grouping
  },
  group: ['role'],
  having: {
    userCount: {
      [Op.gte]: 10, // Filters groups with 10 or more users
    },
  },
});
```

#### Nested Conditions:

```javascript
const users = await Users.findAll({
  where: {
    isActive: true,
    [Op.and]: [
      { createdAt: { [Op.gte]: new Date("2023-01-01") } },
      { lastLogin: { [Op.lt]: new Date("2023-12-31") } },
    ],
  },
});
```

By using `where`, logical operators, and `having`, you can create highly customized queries to meet complex filtering needs.


---

### 3. `include`

Includes related models or associations. Use this for joins.

#### Example:

```javascript
const usersWithProfiles = await Users.findAll({
  include: [
    {
      model: UserProfile,
      attributes: ["profilePicture", "bio"],
      where: { isActive: true },
    },
  ],
});
```

---

### 4. `order`

Specifies how the results should be sorted.

#### Example:

```javascript
const sortedUsers = await Users.findAll({
  order: [["createdAt", "DESC"]], // Sort by creation date in descending order
});
```

#### Multiple Sorting Criteria:

```javascript
const sortedUsers = await Users.findAll({
  order: [
    ["lastName", "ASC"], // Sort by last name ascending
    ["firstName", "ASC"], // Then sort by first name ascending
  ],
});
```

---

### 5. `group`

Groups the results for aggregation purposes.

#### Example:

```javascript
const userStats = await Users.findAll({
  attributes: ["id", [sequelize.fn("COUNT", sequelize.col("id")), "userCount"]],
  group: ["id"],
});
```

---

### 6. `limit` and `offset`

Handles pagination by limiting the number of results and specifying the starting point.

#### Example:

```javascript
const paginatedUsers = await Users.findAll({
  limit: 10, // Return only 10 records
  offset: 20, // Skip the first 20 records
});
```

---

### Additional Query Options

#### `raw`

Returns plain JavaScript objects instead of Sequelize model instances.

#### Example:

```javascript
const users = await Users.findAll({
  raw: true,
});
```

#### `paranoid`

Controls whether soft-deleted records are included.

#### Example:

```javascript
const users = await Users.findAll({
  paranoid: false, // Include soft-deleted records
});
```

#### `logging`

Logs the generated SQL query for debugging.

#### Example:

```javascript
const users = await Users.findAll({
  logging: console.log, // Logs the SQL query
});
```

#### `having`

Filters aggregated data after grouping.

#### Example:

```javascript
const userStats = await Users.findAll({
  attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "userCount"]],
  group: ["role"],
  having: {
    userCount: {
      [Op.gte]: 10, // Groups with at least 10 users
    },
  },
});
```

---

### Full Example Query:

Here’s a comprehensive example combining multiple options:

```javascript
const userData = await Users.findAll({
  attributes: ["id", "email", [sequelize.fn("COUNT", sequelize.col("id")), "userCount"]],
  where: {
    isActive: true,
    createdAt: {
      [Op.gte]: new Date("2023-01-01"),
    },
  },
  include: [
    {
      model: UserProfile,
      attributes: ["profilePicture"],
    },
  ],
  order: [["createdAt", "DESC"]],
  group: ["Users.id", "UserProfile.profilePicture"],
  having: {
    userCount: {
      [Op.gt]: 5,
    },
  },
  limit: 10,
  offset: 20,
});
```

---

### Best Practices:

1. **Order Options Logically:** Follow the recommended order for clarity.
2. **Use Aliases:** Use aliases in `attributes` and `include` for readable results.
3. **Optimize Queries:** Use `attributes` to limit the data retrieved.
4. **Log Queries:** Enable `logging` during development to debug SQL queries.
5. **Test Performance:** Use tools like `EXPLAIN` to analyze query performance.

This structured approach helps create efficient, maintainable, and readable queries in Sequelize.
