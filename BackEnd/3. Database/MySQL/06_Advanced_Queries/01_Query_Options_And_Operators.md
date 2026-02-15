# Sequelize — Query Options & Operators

Sequelize provides a rich set of options and operators to build complex queries without writing raw SQL. This covers filtering, sorting, pagination, aggregation, grouping, and more.

---

## 1. Query Options Overview

The recommended order for query options:

```javascript
const results = await Model.findAll({
  attributes: [...],         // 1. Which columns to return (SELECT)
  where: { ... },            // 2. Filter conditions (WHERE)
  include: [...],            // 3. Related models / JOINs
  order: [...],              // 4. Sort order (ORDER BY)
  group: [...],              // 5. Grouping (GROUP BY)
  having: { ... },           // 6. Filter after grouping (HAVING)
  limit: 10,                 // 7. Max rows to return (LIMIT)
  offset: 20,                // 8. Skip rows (OFFSET)
  raw: false,                // 9. Return plain objects vs instances
  paranoid: true,            // 10. Include soft-deleted rows
  logging: console.log,      // 11. Log generated SQL
});
```

---

## 2. `attributes` — Select Columns

### Select Specific Columns

```javascript
const users = await User.findAll({
  attributes: ['id', 'username', 'email'],
});
// SELECT id, username, email FROM users
```

### Exclude Columns

```javascript
const users = await User.findAll({
  attributes: { exclude: ['password', 'deletedAt'] },
});
// SELECT id, username, email, ... (everything except password and deletedAt)
```

### Rename Columns (Aliases)

```javascript
const users = await User.findAll({
  attributes: [
    'id',
    ['username', 'user_name'],         // Rename username → user_name in result
    ['email', 'email_address'],
  ],
});
// SELECT id, username AS user_name, email AS email_address FROM users
```

### Aggregation Functions

```javascript
import { fn, col, literal } from 'sequelize';

const stats = await User.findAll({
  attributes: [
    'role',
    [fn('COUNT', col('id')), 'userCount'],       // COUNT(id) AS userCount
    [fn('AVG', col('age')), 'averageAge'],       // AVG(age) AS averageAge
    [fn('MAX', col('age')), 'maxAge'],           // MAX(age)
    [fn('MIN', col('age')), 'minAge'],           // MIN(age)
    [fn('SUM', col('salary')), 'totalSalary'],   // SUM(salary)
  ],
  group: ['role'],
});
```

Available aggregate functions: `COUNT`, `SUM`, `AVG`, `MAX`, `MIN`, `GROUP_CONCAT`.

---

## 3. `where` — Filter Conditions (Operators)

Import operators:

```javascript
import { Op } from 'sequelize';
```

### Comparison Operators

```javascript
const users = await User.findAll({
  where: {
    age: { [Op.eq]: 25 },          // age = 25 (same as just age: 25)
    age: { [Op.ne]: 25 },          // age != 25
    age: { [Op.gt]: 18 },          // age > 18
    age: { [Op.gte]: 18 },         // age >= 18
    age: { [Op.lt]: 65 },          // age < 65
    age: { [Op.lte]: 65 },         // age <= 65
  },
});
```

### Range

```javascript
{
  where: {
    age: { [Op.between]: [18, 65] },        // age BETWEEN 18 AND 65
    age: { [Op.notBetween]: [18, 65] },     // age NOT BETWEEN 18 AND 65
  }
}
```

### `IN` and `NOT IN`

```javascript
{
  where: {
    role: { [Op.in]: ['admin', 'moderator'] },     // role IN ('admin', 'moderator')
    status: { [Op.notIn]: ['banned', 'deleted'] },  // status NOT IN (...)
  }
}
```

### String Matching (LIKE)

```javascript
{
  where: {
    username: { [Op.like]: '%john%' },         // LIKE '%john%' (contains)
    username: { [Op.notLike]: '%admin%' },     // NOT LIKE
    email: { [Op.startsWith]: 'john' },        // LIKE 'john%'
    email: { [Op.endsWith]: '@gmail.com' },    // LIKE '%@gmail.com'
    name: { [Op.substring]: 'doe' },           // LIKE '%doe%'
  }
}
```

### NULL Checks

```javascript
{
  where: {
    deletedAt: { [Op.is]: null },              // IS NULL
    phone: { [Op.not]: null },                 // IS NOT NULL
  }
}
```

### Logical Operators

```javascript
// OR
{
  where: {
    [Op.or]: [
      { role: 'admin' },
      { role: 'moderator' },
    ],
  }
}

// AND (explicit — usually implicit)
{
  where: {
    [Op.and]: [
      { isActive: true },
      { age: { [Op.gte]: 18 } },
    ],
  }
}

// NOT
{
  where: {
    role: { [Op.not]: 'banned' },
  }
}
```

### Combining Conditions

```javascript
// Multiple conditions on the same object are implicit AND
const users = await User.findAll({
  where: {
    isActive: true,                           // AND
    role: { [Op.in]: ['admin', 'user'] },     // AND
    age: { [Op.gte]: 18, [Op.lt]: 65 },      // AND (range)
    [Op.or]: [                                // OR within AND
      { email: { [Op.endsWith]: '@company.com' } },
      { isVIP: true },
    ],
  },
});
```

**SQL equivalent:**
```sql
SELECT * FROM users
WHERE is_active = true
  AND role IN ('admin', 'user')
  AND age >= 18 AND age < 65
  AND (email LIKE '%@company.com' OR is_vip = true)
```

---

## 4. `order` — Sorting

```javascript
// Simple sort
const users = await User.findAll({
  order: [['createdAt', 'DESC']],      // ORDER BY created_at DESC
});

// Multiple sort fields
const users = await User.findAll({
  order: [
    ['lastName', 'ASC'],               // First by lastName A→Z
    ['firstName', 'ASC'],              // Then by firstName A→Z
  ],
});

// Sort by associated model's field
const posts = await Post.findAll({
  include: { model: User, as: 'author' },
  order: [[{ model: User, as: 'author' }, 'username', 'ASC']],
});

// Sort by aggregation
const stats = await User.findAll({
  attributes: ['role', [fn('COUNT', col('id')), 'userCount']],
  group: ['role'],
  order: [[literal('userCount'), 'DESC']],
});
```

---

## 5. `limit` and `offset` — Pagination

```javascript
// Page 1: skip 0, get 10
const page1 = await User.findAll({ limit: 10, offset: 0 });

// Page 2: skip 10, get 10
const page2 = await User.findAll({ limit: 10, offset: 10 });

// Pagination helper
const getPaginatedUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await User.findAndCountAll({
    where: { isActive: true },
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};
```

---

## 6. `group` and `having` — Grouping

```javascript
const roleStats = await User.findAll({
  attributes: [
    'role',
    [fn('COUNT', col('id')), 'userCount'],
    [fn('AVG', col('age')), 'avgAge'],
  ],
  where: { isActive: true },          // WHERE (before grouping)
  group: ['role'],                     // GROUP BY
  having: {
    userCount: { [Op.gte]: 5 },        // HAVING (after grouping)
  },
  order: [[literal('userCount'), 'DESC']],
});

// SQL:
// SELECT role, COUNT(id) AS userCount, AVG(age) AS avgAge
// FROM users
// WHERE is_active = true
// GROUP BY role
// HAVING userCount >= 5
// ORDER BY userCount DESC
```

### `where` vs `having`

| Option | When | Purpose |
|--------|------|---------|
| `where` | Before `GROUP BY` | Filter individual rows |
| `having` | After `GROUP BY` | Filter aggregated groups |

---

## 7. `include` — Joins and Associations

```javascript
// Basic include
const users = await User.findAll({
  include: {
    model: Profile,
    as: 'profile',
    attributes: ['bio', 'avatarUrl'],
  },
});

// Multiple includes
const posts = await Post.findAll({
  include: [
    { model: User, as: 'author', attributes: ['username'] },
    { model: Comment, as: 'comments', attributes: ['content'] },
  ],
});

// Filtered include (only active comments)
const posts = await Post.findAll({
  include: {
    model: Comment,
    as: 'comments',
    where: { isApproved: true },     // Only include approved comments
    required: false,                  // LEFT JOIN (default: INNER JOIN when where is used)
  },
});

// Include all associations
const user = await User.findByPk(1, {
  include: { all: true },
});
```

### `required` Option

| Value | SQL JOIN Type | Behavior |
|-------|-------------|---------|
| `true` | `INNER JOIN` | Only rows with matching association |
| `false` | `LEFT JOIN` | All rows, even without association match |

Default is `false` (LEFT JOIN), but when `where` is used inside `include`, it defaults to `true` (INNER JOIN).

---

## 8. Additional Options

### `raw: true` — Plain Objects

```javascript
const users = await User.findAll({ raw: true });
// Returns plain objects instead of Sequelize instances
// No instance methods (.save(), .destroy(), etc.)
```

### `logging` — Debug SQL

```javascript
const users = await User.findAll({
  where: { isActive: true },
  logging: console.log,  // Prints: SELECT * FROM users WHERE is_active = true
});
```

### `paranoid: false` — Include Soft-Deleted

```javascript
const allUsers = await User.findAll({
  paranoid: false,   // Include rows with deletedAt set
});
```

### `lock` — Row Locking (Transactions)

```javascript
const user = await User.findByPk(1, {
  lock: true,                     // FOR UPDATE lock
  transaction: t,
});
```

---

## 9. All Operators Reference

| Operator | SQL | Example |
|----------|-----|---------|
| `Op.eq` | `=` | `{ age: { [Op.eq]: 25 } }` |
| `Op.ne` | `!=` | `{ status: { [Op.ne]: 'banned' } }` |
| `Op.gt` | `>` | `{ age: { [Op.gt]: 18 } }` |
| `Op.gte` | `>=` | `{ age: { [Op.gte]: 18 } }` |
| `Op.lt` | `<` | `{ age: { [Op.lt]: 65 } }` |
| `Op.lte` | `<=` | `{ age: { [Op.lte]: 65 } }` |
| `Op.between` | `BETWEEN` | `{ age: { [Op.between]: [18, 65] } }` |
| `Op.in` | `IN` | `{ role: { [Op.in]: ['a', 'b'] } }` |
| `Op.notIn` | `NOT IN` | `{ status: { [Op.notIn]: ['x'] } }` |
| `Op.like` | `LIKE` | `{ name: { [Op.like]: '%john%' } }` |
| `Op.startsWith` | `LIKE 'x%'` | `{ name: { [Op.startsWith]: 'J' } }` |
| `Op.endsWith` | `LIKE '%x'` | `{ email: { [Op.endsWith]: '.com' } }` |
| `Op.is` | `IS` | `{ deletedAt: { [Op.is]: null } }` |
| `Op.not` | `IS NOT` | `{ phone: { [Op.not]: null } }` |
| `Op.or` | `OR` | `{ [Op.or]: [{...}, {...}] }` |
| `Op.and` | `AND` | `{ [Op.and]: [{...}, {...}] }` |
| `Op.col` | Column ref | `{ price: { [Op.gt]: col('cost') } }` |

---

## 10. Complete Example

```javascript
import { Op, fn, col, literal } from 'sequelize';

const result = await User.findAndCountAll({
  attributes: [
    'id',
    'username',
    'email',
    'role',
    [fn('COUNT', col('posts.id')), 'postCount'],
  ],
  where: {
    isActive: true,
    createdAt: { [Op.gte]: new Date('2024-01-01') },
    [Op.or]: [
      { role: 'admin' },
      { age: { [Op.gte]: 18 } },
    ],
  },
  include: [
    {
      model: Post,
      as: 'posts',
      attributes: [],
      required: false,
    },
    {
      model: Profile,
      as: 'profile',
      attributes: ['avatarUrl'],
    },
  ],
  group: ['User.id', 'profile.id'],
  having: literal('postCount > 0'),
  order: [[literal('postCount'), 'DESC']],
  limit: 20,
  offset: 0,
  subQuery: false,
});
```

---

## 11. Summary

| Option | Purpose | SQL Equivalent |
|--------|---------|---------------|
| `attributes` | Select columns | `SELECT` |
| `where` | Filter rows | `WHERE` |
| `include` | Join associations | `JOIN` |
| `order` | Sort results | `ORDER BY` |
| `group` | Group rows | `GROUP BY` |
| `having` | Filter groups | `HAVING` |
| `limit` | Max rows | `LIMIT` |
| `offset` | Skip rows | `OFFSET` |
| `raw` | Plain objects | — |
| `paranoid` | Soft-delete control | — |

### Key Points

1. Import operators with `import { Op } from 'sequelize'`
2. Multiple `where` conditions are **implicit AND**
3. Use `[Op.or]` for OR conditions
4. `findAndCountAll()` returns `{ count, rows }` — perfect for pagination
5. `required: false` in `include` produces a **LEFT JOIN** (includes rows without matches)
6. Use `fn()`, `col()`, and `literal()` for aggregate functions and raw expressions
7. Use `logging: console.log` to debug generated SQL queries
