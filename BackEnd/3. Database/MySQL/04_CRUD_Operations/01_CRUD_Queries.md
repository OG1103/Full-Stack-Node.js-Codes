# Sequelize — CRUD Operations

Sequelize provides methods that map directly to SQL `INSERT`, `SELECT`, `UPDATE`, and `DELETE` operations. All methods return Promises and support async/await.

---

## 1. Create (INSERT)

### `Model.create()` — Insert One Row

```javascript
const user = await User.create({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'securepassword',
});

console.log(user.id);         // Auto-generated ID
console.log(user.toJSON());   // Plain object representation
```

**Returns:** A Sequelize model instance of the newly created row.

**SQL equivalent:**
```sql
INSERT INTO users (username, email, password, created_at, updated_at)
VALUES ('john_doe', 'john@example.com', 'securepassword', NOW(), NOW());
```

### `Model.bulkCreate()` — Insert Multiple Rows

```javascript
const users = await User.bulkCreate([
  { username: 'alice', email: 'alice@example.com', password: 'pass1' },
  { username: 'bob', email: 'bob@example.com', password: 'pass2' },
  { username: 'charlie', email: 'charlie@example.com', password: 'pass3' },
]);

console.log(users.length);  // 3
```

### Options for bulkCreate

```javascript
await User.bulkCreate(data, {
  validate: true,            // Run validations (default: false for bulkCreate!)
  ignoreDuplicates: true,    // Skip rows that violate unique constraints
  updateOnDuplicate: ['email'],  // Update these fields if duplicate key
  returning: true,           // Return the created instances (PostgreSQL)
});
```

**Important:** `bulkCreate()` does NOT run validations by default. Pass `{ validate: true }` if you need them.

### `Model.findOrCreate()` — Find or Insert

```javascript
const [user, created] = await User.findOrCreate({
  where: { email: 'john@example.com' },
  defaults: {
    username: 'john_doe',
    password: 'securepassword',
  },
});

if (created) {
  console.log('New user created');
} else {
  console.log('User already exists');
}
```

**Returns:** An array `[instance, wasCreated]` where `wasCreated` is a boolean.

---

## 2. Read (SELECT)

### `findAll()` — Get Multiple Rows

```javascript
// All users
const users = await User.findAll();

// With conditions
const activeUsers = await User.findAll({
  where: { isActive: true },
});

// With all options
const results = await User.findAll({
  attributes: ['id', 'username', 'email'],    // SELECT specific columns
  where: { role: 'admin' },                    // WHERE clause
  order: [['createdAt', 'DESC']],             // ORDER BY
  limit: 10,                                   // LIMIT
  offset: 20,                                  // OFFSET (for pagination)
});
```

**Returns:** An array of model instances. Empty array `[]` if no matches.

### `findOne()` — Get One Row

```javascript
const user = await User.findOne({
  where: { email: 'john@example.com' },
});

if (!user) {
  console.log('User not found');
}
```

**Returns:** A model instance or `null`.

### `findByPk()` — Find by Primary Key

```javascript
const user = await User.findByPk(1);

// With options
const user = await User.findByPk(1, {
  attributes: ['id', 'username', 'email'],
  include: { model: Post, as: 'posts' },
});
```

**Returns:** A model instance or `null`.

### `findAndCountAll()` — Find with Total Count (Pagination)

```javascript
const { count, rows } = await User.findAndCountAll({
  where: { isActive: true },
  limit: 10,
  offset: 0,
});

console.log(count);       // Total matching rows (e.g., 150)
console.log(rows.length); // Rows returned on this page (e.g., 10)
```

Perfect for pagination — `count` gives the total, `rows` gives the current page.

### `count()` — Count Rows

```javascript
const totalUsers = await User.count();
const activeUsers = await User.count({ where: { isActive: true } });
```

### `max()`, `min()`, `sum()` — Aggregations

```javascript
const maxAge = await User.max('age');
const minAge = await User.min('age');
const totalSalary = await User.sum('salary', { where: { role: 'engineer' } });
```

---

## 3. Update (UPDATE)

### `Model.update()` — Update Multiple Rows

```javascript
const [affectedCount] = await User.update(
  { isActive: false },                          // SET values
  { where: { lastLoginAt: { [Op.lt]: cutoffDate } } }  // WHERE clause
);

console.log(`${affectedCount} rows updated`);
```

**Returns:** An array `[affectedCount]`. The number of rows that were changed.

**SQL equivalent:**
```sql
UPDATE users SET is_active = false WHERE last_login_at < '2024-01-01';
```

### Instance Update — Update One Row

```javascript
const user = await User.findByPk(1);

user.email = 'newemail@example.com';
user.role = 'admin';
await user.save();               // Saves all changed fields

// Or update specific fields:
await user.update({ email: 'newemail@example.com', role: 'admin' });
```

### `Model.upsert()` — Insert or Update

```javascript
const [user, created] = await User.upsert({
  id: 1,                         // If this ID exists, update; otherwise, insert
  username: 'john_doe',
  email: 'john@example.com',
});
// created = true if inserted, false if updated
```

### Increment / Decrement

```javascript
// Increment a field
await User.increment('loginCount', { by: 1, where: { id: userId } });

// Decrement
await User.decrement('credits', { by: 10, where: { id: userId } });

// Multiple fields
await User.increment(
  { loginCount: 1, points: 5 },
  { where: { id: userId } }
);
```

---

## 4. Delete (DELETE)

### `Model.destroy()` — Delete Rows

```javascript
const deletedCount = await User.destroy({
  where: { id: userId },
});

console.log(`${deletedCount} row(s) deleted`);
```

**Returns:** The number of deleted rows.

### Bulk Delete

```javascript
// Delete all inactive users
const count = await User.destroy({
  where: { isActive: false },
});

// Delete ALL rows (dangerous!)
await User.destroy({
  where: {},         // Empty where = delete everything
  truncate: true,    // TRUNCATE TABLE (faster, resets auto-increment)
});
```

### Instance Delete

```javascript
const user = await User.findByPk(1);
await user.destroy();
```

### Soft Delete (with `paranoid: true`)

If the model has `paranoid: true`, `destroy()` sets `deletedAt` instead of removing the row:

```javascript
await user.destroy();
// Row still exists with deletedAt set

// Permanently delete:
await user.destroy({ force: true });

// Restore soft-deleted:
await user.restore();

// Include soft-deleted in queries:
const allUsers = await User.findAll({ paranoid: false });
```

---

## 5. Raw Queries

For complex SQL that's hard to express with Sequelize methods:

```javascript
import { QueryTypes } from 'sequelize';

// Select query
const users = await sequelize.query(
  'SELECT * FROM users WHERE role = :role',
  {
    replacements: { role: 'admin' },   // Named parameter
    type: QueryTypes.SELECT,
  }
);

// With positional parameters
const users = await sequelize.query(
  'SELECT * FROM users WHERE age > ? AND role = ?',
  {
    replacements: [18, 'user'],
    type: QueryTypes.SELECT,
  }
);
```

### Query Types

| Type | Purpose |
|------|---------|
| `QueryTypes.SELECT` | Returns array of results |
| `QueryTypes.INSERT` | Returns `[results, metadata]` |
| `QueryTypes.UPDATE` | Returns `[results, metadata]` |
| `QueryTypes.DELETE` | Returns `metadata` |

---

## 6. Handling Errors

### Validation Errors

```javascript
try {
  await User.create({ username: '', email: 'invalid' });
} catch (err) {
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }));
    console.log('Validation errors:', messages);
  }
}
```

### Unique Constraint Errors

```javascript
try {
  await User.create({ email: 'existing@email.com' });
} catch (err) {
  if (err.name === 'SequelizeUniqueConstraintError') {
    console.log('Duplicate entry:', err.errors[0].path);
    // err.errors[0].path = 'email'
  }
}
```

---

## 7. Summary

| Operation | Method | Returns |
|-----------|--------|---------|
| Insert one | `Model.create()` | Model instance |
| Insert many | `Model.bulkCreate()` | Array of instances |
| Find or create | `Model.findOrCreate()` | `[instance, created]` |
| Find all | `Model.findAll()` | Array (or `[]`) |
| Find one | `Model.findOne()` | Instance or `null` |
| Find by ID | `Model.findByPk()` | Instance or `null` |
| Find + count | `Model.findAndCountAll()` | `{ count, rows }` |
| Update many | `Model.update()` | `[affectedCount]` |
| Update one | `instance.update()` | Instance |
| Upsert | `Model.upsert()` | `[instance, created]` |
| Delete | `Model.destroy()` | Deleted count |
| Restore | `instance.restore()` | Instance |
| Count | `Model.count()` | Number |
| Raw SQL | `sequelize.query()` | Depends on type |

### Key Points

1. `findAll()` returns `[]` on no match; `findOne()` returns `null`
2. `bulkCreate()` **skips validation by default** — pass `{ validate: true }`
3. `update()` returns `[affectedCount]` — an array, not a number
4. `destroy()` with `paranoid: true` does a **soft delete**
5. Use `findAndCountAll()` for **paginated** responses
6. Always use **parameterized replacements** in raw queries to prevent SQL injection
