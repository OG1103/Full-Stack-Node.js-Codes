# Advanced Sequelize Queries Guide for MySQL

This guide focuses on advanced query types in Sequelize when working with MySQL, including aliases, joins, subqueries, and selecting specific fields.

---

## 1. Using Aliases and Renaming Columns
Aliases allow you to rename columns in the query result for better readability or compliance with client-side naming conventions.

### **Example with Aliases:**
```javascript
import User from './models/User.js';

const users = await User.findAll({
  attributes: [
    ['username', 'user_name'], // Renaming "username" column to "user_name"
    ['email', 'email_address'],
    'createdAt',
  ],
});

console.log(users);
```

#### Explanation:
- **What it does:** Renames columns in the query result.
- **Returns:** Records with renamed columns.

#### Output Example:
```javascript
[
  {
    user_name: 'john_doe',
    email_address: 'john@example.com',
    createdAt: '2025-01-20T12:00:00.000Z',
  },
  {
    user_name: 'jane_doe',
    email_address: 'jane@example.com',
    createdAt: '2025-01-21T12:00:00.000Z',
  }
]
```

If no records are found:
```javascript
[]
```

---

## 2. Joins with Associations
- To create joining queries using Sequelize, you must define associations between your models.
- Joins in Sequelize are handled using associations (e.g., `hasMany`, `belongsTo`, etc.). You can include related models in your queries.
-  The `as` field used in your queries must match the alias (`as`) specified in the association. Sequelize relies on this as field to identify the correct association to use when constructing the join query.
### **Example with Joins:**


```javascript
//Example association
// Post.js
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

import Post from './models/Post.js';
import User from './models/User.js';

const posts = await Post.findAll({
  include: [
    {
      model: User,
      as: 'author', // Alias for the association
      attributes: ['username', 'email'],
    },
  ],
});

console.log(posts);
```

#### Explanation:
- **What it does:** Joins the `Post` and `User` tables based on their association.
- **Returns:** Posts with their associated user data.

#### Output Example:
```javascript
[
  {
    id: 1,
    title: 'First Post',
    content: 'Hello World!',
    author: {
      username: 'john_doe',
      email: 'john@example.com',
    },
  },
  {
    id: 2,
    title: 'Second Post',
    content: 'Sequelize is awesome!',
    author: {
      username: 'jane_doe',
      email: 'jane@example.com',
    },
  }
]
```

If no posts exist:
```javascript
[]
```

---

## 3. Subqueries
Use raw SQL for subqueries or let Sequelize handle it with nested includes.

### **Example with Subquery:**
```javascript
import { sequelize } from './connectDb.js';

const activeUsers = await sequelize.query(
  `SELECT username, email FROM Users WHERE id IN (SELECT userId FROM Posts WHERE isPublished = true)`
);

console.log(activeUsers);
```

#### Explanation:
- **What it does:** Retrieves users who have published posts.
- **Returns:** Query results as raw data.

#### Output Example:
```javascript
[
  { username: 'john_doe', email: 'john@example.com' },
  { username: 'jane_doe', email: 'jane@example.com' }
]
```

If no results:
```javascript
[]
```

---

## 4. Selecting Specific Fields
You can select only the fields you need to optimize performance and reduce response size.

### **Example:**
```javascript
import User from './models/User.js';

const users = await User.findAll({
  attributes: ['username', 'email'], // Select specific columns
});

console.log(users);
```

#### Explanation:
- **What it does:** Fetches only the `username` and `email` fields for each user.
- **Returns:** Records with only the specified fields.

#### Output Example:
```javascript
[
  { username: 'john_doe', email: 'john@example.com' },
  { username: 'jane_doe', email: 'jane@example.com' }
]
```

If no records are found:
```javascript
[]
```

---

## Summary
This guide provides detailed examples and outputs for advanced Sequelize queries, including:
- **Aliases and Renaming Columns**
- **Joins with Associations**
- **Subqueries**
- **Selecting Specific Fields**

Each example demonstrates query logic, expected outputs, and how to handle cases where no data is returned. Expand these concepts with more advanced scenarios like nested joins or complex subqueries as needed.
