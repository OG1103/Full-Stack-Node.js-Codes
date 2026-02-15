# Sequelize — Models & Data Types

A Model represents a **table** in the database. It defines the columns, their data types, validations, and table-level options. Each instance of a model represents a **row** in that table.

---

## 1. Defining a Model

### Using `sequelize.define()`

```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define(
  'User',                    // Model name
  {
    // Column definitions
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'moderator'),
      defaultValue: 'user',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    // Model options
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

export default User;
```

### Using Class Syntax (Alternative)

```javascript
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model {}

User.init(
  {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    sequelize,            // Pass the connection instance
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
```

Both approaches produce identical results. `sequelize.define()` is more common and concise.

---

## 2. All Data Types

### Strings

```javascript
{
  name: DataTypes.STRING,              // VARCHAR(255) — default
  name: DataTypes.STRING(100),         // VARCHAR(100) — custom length
  bio: DataTypes.TEXT,                 // TEXT — up to 65KB
  content: DataTypes.TEXT('long'),     // LONGTEXT — up to 4GB
  content: DataTypes.TEXT('medium'),   // MEDIUMTEXT — up to 16MB
  content: DataTypes.TEXT('tiny'),     // TINYTEXT — up to 255 bytes
  char: DataTypes.CHAR(10),           // CHAR(10) — fixed-length string
}
```

### Numbers

```javascript
{
  age: DataTypes.INTEGER,              // INT (signed, -2B to +2B)
  age: DataTypes.INTEGER.UNSIGNED,     // INT UNSIGNED (0 to 4B)
  count: DataTypes.SMALLINT,           // SMALLINT (-32K to +32K)
  bigNum: DataTypes.BIGINT,            // BIGINT (very large integers)
  price: DataTypes.FLOAT,              // FLOAT (approximate decimals)
  price: DataTypes.DOUBLE,             // DOUBLE (more precision)
  price: DataTypes.DECIMAL(10, 2),     // DECIMAL(10,2) — exact (e.g., 99999999.99)
}
```

**Use `DECIMAL` for money** — `FLOAT` and `DOUBLE` have rounding errors.

### Boolean

```javascript
{
  isActive: DataTypes.BOOLEAN,         // TINYINT(1) — 0 or 1
}
```

### Date and Time

```javascript
{
  birthDate: DataTypes.DATEONLY,       // DATE — '2024-01-15'
  createdAt: DataTypes.DATE,           // DATETIME — '2024-01-15 10:30:00'
  time: DataTypes.TIME,               // TIME — '10:30:00'
}
```

### Enum

```javascript
{
  status: DataTypes.ENUM('active', 'inactive', 'banned'),
  priority: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
}
```

### JSON

```javascript
{
  metadata: DataTypes.JSON,            // JSON column (MySQL 5.7+)
  settings: DataTypes.JSONB,           // JSONB (PostgreSQL only)
}
```

### Binary

```javascript
{
  avatar: DataTypes.BLOB,              // BLOB — binary data
  avatar: DataTypes.BLOB('long'),      // LONGBLOB
}
```

### UUID

```javascript
{
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,    // Auto-generate UUIDv4
    primaryKey: true,
  },
}
```

### Virtual (Computed, Not Stored)

```javascript
{
  fullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
    set(value) {
      throw new Error('Do not try to set the `fullName` value!');
    },
  },
}
```

Virtual fields are **not stored** in the database — computed at runtime (like Mongoose virtuals).

---

## 3. Column Options

```javascript
{
  email: {
    type: DataTypes.STRING,
    allowNull: false,                   // NOT NULL constraint
    unique: true,                       // UNIQUE constraint
    defaultValue: 'user@example.com',   // Default value
    primaryKey: false,                  // PRIMARY KEY
    autoIncrement: false,               // AUTO_INCREMENT (integers only)
    field: 'email_address',             // Custom column name in DB
    comment: 'User email address',      // Column comment
    references: {                       // Foreign key
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',               // FK cascade on update
    onDelete: 'SET NULL',              // FK action on delete
  }
}
```

### Foreign Key Actions

| Action | Behavior |
|--------|---------|
| `CASCADE` | Delete/update child rows when parent changes |
| `SET NULL` | Set FK to NULL when parent is deleted |
| `SET DEFAULT` | Set FK to default value |
| `RESTRICT` | Prevent parent deletion if children exist |
| `NO ACTION` | Same as RESTRICT (default) |

---

## 4. Validations

Sequelize provides built-in validators that run **before** saving to the database:

```javascript
{
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,                     // Must be valid email
      // isEmail: { msg: 'Must be a valid email address' },  // Custom message
    },
  },
  username: {
    type: DataTypes.STRING,
    validate: {
      len: [3, 30],                      // Length between 3 and 30
      isAlphanumeric: true,              // Only letters and numbers
      notEmpty: true,                    // Cannot be empty string
    },
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,                            // Minimum value
      max: 150,                          // Maximum value
      isInt: true,                       // Must be integer
    },
  },
  website: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,                       // Must be valid URL
    },
  },
  status: {
    type: DataTypes.STRING,
    validate: {
      isIn: [['active', 'inactive', 'banned']],  // Must be one of these
    },
  },
  password: {
    type: DataTypes.STRING,
    validate: {
      len: {
        args: [8, 100],
        msg: 'Password must be between 8 and 100 characters',
      },
    },
  },
}
```

### All Built-in Validators

| Validator | Description |
|-----------|-------------|
| `isEmail` | Valid email format |
| `isUrl` | Valid URL |
| `isIP` | Valid IP address |
| `isAlpha` | Letters only |
| `isAlphanumeric` | Letters and numbers |
| `isNumeric` | Numbers only |
| `isInt` | Integer |
| `isFloat` | Float |
| `isDecimal` | Decimal |
| `isLowercase` | Lowercase only |
| `isUppercase` | Uppercase only |
| `notEmpty` | Not empty string |
| `notNull` | Not null |
| `len: [min, max]` | Length range |
| `min` / `max` | Numeric range |
| `isIn: [[...]]` | Value in list |
| `notIn: [[...]]` | Value NOT in list |
| `is: /regex/` | Matches regex |
| `not: /regex/` | Does NOT match regex |
| `contains: 'str'` | Contains substring |
| `notContains: 'str'` | Does NOT contain |
| `isDate` | Valid date |
| `isAfter: 'date'` | After a date |
| `isBefore: 'date'` | Before a date |
| `isUUID: 4` | Valid UUIDv4 |

### Custom Validator

```javascript
{
  age: {
    type: DataTypes.INTEGER,
    validate: {
      isAdult(value) {
        if (value < 18) {
          throw new Error('User must be at least 18 years old');
        }
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    validate: {
      hasUppercase(value) {
        if (!/[A-Z]/.test(value)) {
          throw new Error('Password must contain at least one uppercase letter');
        }
      },
    },
  },
}
```

---

## 5. Model Options

```javascript
sequelize.define('User', { /* columns */ }, {
  tableName: 'users',           // Custom table name (default: pluralized model name)
  timestamps: true,             // Add createdAt and updatedAt (default: true)
  createdAt: 'created_at',      // Custom createdAt column name
  updatedAt: 'updated_at',      // Custom updatedAt column name
  paranoid: true,               // Soft deletes — adds deletedAt column
  deletedAt: 'deleted_at',      // Custom deletedAt column name
  underscored: true,            // Convert camelCase to snake_case columns
  freezeTableName: true,        // Don't pluralize table name
  indexes: [                    // Table indexes
    { unique: true, fields: ['email'] },
    { fields: ['status', 'created_at'] },
  ],
});
```

### `paranoid: true` — Soft Deletes

When enabled, `destroy()` sets `deletedAt` instead of actually deleting the row:

```javascript
// With paranoid: true
await user.destroy();
// Row still exists with deletedAt = '2024-01-15 10:30:00'

// Normal queries automatically exclude soft-deleted rows
const users = await User.findAll();
// Only returns rows where deletedAt IS NULL

// Include soft-deleted rows
const allUsers = await User.findAll({ paranoid: false });

// Permanently delete (force)
await user.destroy({ force: true });

// Restore a soft-deleted row
await user.restore();
```

### `underscored: true` — Snake Case Columns

```javascript
// Without underscored: createdAt, updatedAt, authorId
// With underscored: created_at, updated_at, author_id
```

---

## 6. Getters and Setters

### Getters — Transform Data When Reading

```javascript
{
  firstName: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue('firstName');
      return rawValue ? rawValue.charAt(0).toUpperCase() + rawValue.slice(1) : null;
    },
  },
}
```

### Setters — Transform Data When Writing

```javascript
{
  password: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue('password', bcrypt.hashSync(value, 10));
    },
  },
  email: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    },
  },
}
```

---

## 7. Instance Methods

```javascript
const User = sequelize.define('User', { /* columns */ });

// Add an instance method
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toPublicJSON = function () {
  const { id, username, email, role } = this.toJSON();
  return { id, username, email, role };
};

// Usage:
const user = await User.findByPk(1);
const isMatch = await user.comparePassword('mypassword');
const publicData = user.toPublicJSON();
```

---

## 8. Complete Model Example

```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        isAlphanumeric: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(value) {
        this.setDataValue('email', value.toLowerCase().trim());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [8, 100] },
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 12));
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'moderator'),
      defaultValue: 'user',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { unique: true, fields: ['email'] },
      { fields: ['role', 'is_active'] },
    ],
  }
);

User.prototype.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

export default User;
```

---

## 9. Summary

| Concept | Description |
|---------|-------------|
| Model | Represents a database table |
| DataTypes | Column type definitions (STRING, INTEGER, etc.) |
| `allowNull` | NOT NULL constraint |
| `unique` | UNIQUE constraint |
| `validate` | Built-in and custom validators |
| `paranoid` | Soft deletes with `deletedAt` |
| `underscored` | Snake_case column names |
| Getters/Setters | Transform data on read/write |
| Virtual | Computed fields (not stored) |

### Key Points

1. Use `DECIMAL` for money, not `FLOAT`
2. `paranoid: true` enables **soft deletes** — `destroy()` sets `deletedAt` instead of removing
3. Use **setters** for data transformations (password hashing, email lowercase)
4. Use **validators** to enforce data rules before saving
5. `underscored: true` converts `camelCase` → `snake_case` in the database
6. Always define `allowNull`, `unique`, and `defaultValue` explicitly for clarity
