# Sequelize Queries Guide for MySQL

This guide covers all query types in Sequelize when working with MySQL. Each query type includes explanations, examples, return values, and use cases.

---

## 1. Basic Queries

### **Create**
Insert a new record into a table.

#### Example:
```javascript
import User from './models/User.js'; // Import the User model

const newUser = await User.create({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'securepassword',
});
console.log(newUser);
```

#### Explanation:
- **What it does:** Inserts a new record into the `User` table.
- **Returns:** The newly created record as a Sequelize instance.
  - If the operation is successful, it returns the record object with the created values and additional metadata.
  - If unsuccessful, it throws an error.

#### Output Example:
```javascript
{
  id: 1,
  username: 'john_doe',
  email: 'john@example.com',
  password: 'securepassword',
  createdAt: '2025-01-20T12:00:00.000Z',
  updatedAt: '2025-01-20T12:00:00.000Z'
}
```

If no record is created (e.g., due to validation errors), an error will be thrown.

---

### **Find One**
Retrieve a single record that matches the criteria.

#### Example:
```javascript
import User from './models/User.js';

const user = await User.findOne({ where: { username: 'john_doe' } });
console.log(user);
```

#### Explanation:
- **What it does:** Finds the first record that matches the `where` condition.
- **Returns:**
  - A Sequelize instance of the record if found.
  - `null` if no record matches the condition.

#### Output Example (Record Found):
```javascript
{
  id: 1,
  username: 'john_doe',
  email: 'john@example.com',
  password: 'securepassword',
  createdAt: '2025-01-20T12:00:00.000Z',
  updatedAt: '2025-01-20T12:00:00.000Z'
}
```

If no record is found:
```javascript
null
```

---

### **Find All**
Retrieve all records that match the criteria.

#### Example:
```javascript
import User from './models/User.js';

const users = await User.findAll({ where: { isActive: true }, limit: 10 });
console.log(users);
```

#### Explanation:
- **What it does:** Retrieves multiple records matching the `where` condition.
- **Returns:**
  - An array of Sequelize instances.
  - An empty array (`[]`) if no records are found.

#### Output Example (Records Found):
```javascript
[
  {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    isActive: true,
    createdAt: '2025-01-20T12:00:00.000Z',
    updatedAt: '2025-01-20T12:00:00.000Z'
  },
  {
    id: 2,
    username: 'jane_doe',
    email: 'jane@example.com',
    isActive: true,
    createdAt: '2025-01-21T12:00:00.000Z',
    updatedAt: '2025-01-21T12:00:00.000Z'
  }
]
```

If no records are found:
```javascript
[]
```

---

### **Update**
Update one or more records in a table.

#### Example:
```javascript
import User from './models/User.js';

const updatedCount = await User.update(
  { email: 'new_email@example.com' },
  { where: { username: 'john_doe' } }
);
console.log(`${updatedCount} record(s) updated.`);
```

#### Explanation:
- **What it does:** Updates matching records based on the `where` condition.
- **Returns:** The number of affected rows as an array (e.g., `[1]` if one record was updated).

#### Output Example:
```javascript
1 record(s) updated.
```

If no records are updated:
```javascript
0 record(s) updated.
```

---

### **Delete**
Remove records from a table.

#### Example:
```javascript
import User from './models/User.js';

const deletedCount = await User.destroy({ where: { username: 'john_doe' } });
console.log(`${deletedCount} record(s) deleted.`);
```

#### Explanation:
- **What it does:** Deletes records matching the `where` condition.
- **Returns:** The number of deleted rows.

#### Output Example:
```javascript
1 record(s) deleted.
```

If no records are deleted:
```javascript
0 record(s) deleted.
```

