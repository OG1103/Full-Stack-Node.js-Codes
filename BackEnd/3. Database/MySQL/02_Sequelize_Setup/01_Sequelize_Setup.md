# Sequelize — Setup & Connection

Sequelize is an **ORM (Object-Relational Mapper)** for Node.js that supports MySQL, PostgreSQL, SQLite, and MariaDB. It lets you interact with your database using JavaScript objects and methods instead of writing raw SQL.

---

## 1. Why Sequelize?

| Feature           | Raw SQL (mysql2) | Sequelize                |
| ----------------- | ---------------- | ------------------------ |
| Query syntax      | SQL strings      | JavaScript methods       |
| Schema management | Manual SQL       | Models + sync/migrations |
| Validation        | Manual           | Built-in validators      |
| Relationships     | Manual JOINs     | Association methods      |
| Migrations        | Manual           | CLI-based migrations     |
| Type safety       | None             | DataTypes enforcement    |

Sequelize adds a **structured abstraction layer** on top of raw SQL, reducing boilerplate and preventing common errors.

---

## 2. Installation

```bash
npm install sequelize mysql2
```

- `sequelize` — The ORM library
- `mysql2` — The MySQL driver that Sequelize uses under the hood

---

## 3. Connection Setup

### Basic Connection

```javascript
// config/database.js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Username
  process.env.DB_PASSWORD, // Password
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql", // Database type
    port: process.env.DB_PORT || 3306,
  },
);

export default sequelize;
```

### Connection with All Options

```javascript
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: 3306,

    // Connection pool
    pool: {
      max: 10, // Maximum connections
      min: 0, // Minimum connections
      acquire: 30000, // Max time (ms) to get a connection before throwing error
      idle: 10000, // Max time (ms) a connection can be idle before release
    },

    // Logging
    logging: false, // Disable SQL logging (set to console.log for debugging)
    // logging: (msg) => logger.debug(msg),  // Custom logger

    // Timezone
    timezone: "+00:00", // Store dates in UTC

    // Query defaults
    define: {
      timestamps: true, // Add createdAt/updatedAt to all models
      underscored: true, // Use snake_case column names
      paranoid: false, // Soft deletes (adds deletedAt)
      freezeTableName: false, // Auto-pluralize table names
    },
  },
);

export default sequelize;
```

### Using Connection URI

```javascript
const sequelize = new Sequelize("mysql://user:password@localhost:3306/mydb", {
  dialect: "mysql",
  logging: false,
});
```

---

## 4. Testing the Connection

```javascript
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected via Sequelize");
  } catch (err) {
    console.error("Unable to connect to database:", err.message);
    process.exit(1);
  }
};

export { connectDB };
```

### Usage in Server

```javascript
import express from "express";
import sequelize from "./config/database.js";
import { connectDB } from "./config/database.js";

const app = express();

connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
```

---

## 5. Syncing Models to Database

After defining models, sync them to create/update tables in the database:

```javascript
// Sync all models
await sequelize.sync();
```

### Sync Options

| Option                  | Behavior                           | When to Use                        |
| ----------------------- | ---------------------------------- | ---------------------------------- |
| `sync()`                | Creates tables if they don't exist | Default / Production               |
| `sync({ force: true })` | **Drops and recreates** all tables | Development reset (destroys data!) |
| `sync({ alter: true })` | Alters tables to match models      | Development (preserves data)       |

```javascript
// Development — reset tables
await sequelize.sync({ force: true });
console.log("All tables dropped and recreated");

// Development — update tables
await sequelize.sync({ alter: true });
console.log("Tables altered to match models");

// Production — only create if missing
await sequelize.sync();
console.log("Tables created if not existing");
```

### Sync Individual Models

```javascript
await User.sync({ alter: true }); // Only sync the User model
```

### Other Utility Methods

```javascript
await sequelize.drop(); // Drop all tables
await sequelize.close(); // Close the connection
```

**Warning:** Never use `force: true` or `drop()` in production — it permanently deletes all data.

---

## 6. Environment Variables

```bash
# .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=myapp
DB_PORT=3306
```

### For Cloud Databases (RDS, PlanetScale, etc.)

```bash
# .env
DB_HOST=my-db-instance.abc123.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=securepassword
DB_NAME=production_db
DB_PORT=3306
```

---

## 7. Project Structure

```
project/
├── config/
│   └── database.js          ← Sequelize connection
├── models/
│   ├── index.js             ← Import and associate all models
│   ├── User.js
│   ├── Post.js
│   └── Comment.js
├── controllers/
├── routes/
├── .env
└── server.js
```

### Central Model Index

```javascript
// models/index.js
import sequelize from "../config/database.js";
import User from "./User.js";
import Post from "./Post.js";
import Comment from "./Comment.js";

// Define associations
User.hasMany(Post, { foreignKey: "authorId", as: "posts" });
Post.belongsTo(User, { foreignKey: "authorId", as: "author" });

Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

export { sequelize, User, Post, Comment };
```

---

## 8. Summary

| Step    | Code                                                  |
| ------- | ----------------------------------------------------- |
| Install | `npm install sequelize mysql2`                        |
| Import  | `import { Sequelize } from 'sequelize'`               |
| Connect | `new Sequelize(db, user, pass, { dialect: 'mysql' })` |
| Test    | `await sequelize.authenticate()`                      |
| Sync    | `await sequelize.sync()`                              |
| Close   | `await sequelize.close()`                             |

### Key Points

1. Always use **environment variables** for credentials
2. Use `sync({ alter: true })` in development, plain `sync()` in production
3. **Never** use `sync({ force: true })` in production
4. Define **associations** in a central model index file
5. Use **connection pooling** for production workloads
6. Set `logging: false` in production, `console.log` during debugging
