# MySQL — Overview & Express Setup

MySQL is a **relational database management system (RDBMS)** that stores data in structured tables with rows and columns. It uses **SQL (Structured Query Language)** for querying and managing data, and enforces strict schemas and relationships between tables.

---

## 1. Core Concepts

### Tables, Rows, and Columns

```
Database: myApp
├── Table: users
│   ├── id (INT, PRIMARY KEY, AUTO_INCREMENT)
│   ├── name (VARCHAR(255))
│   ├── email (VARCHAR(255), UNIQUE)
│   └── created_at (DATETIME)
├── Table: posts
│   ├── id (INT, PRIMARY KEY, AUTO_INCREMENT)
│   ├── title (VARCHAR(255))
│   ├── body (TEXT)
│   └── author_id (INT, FOREIGN KEY → users.id)
└── Table: comments
    ├── id (INT, PRIMARY KEY, AUTO_INCREMENT)
    ├── text (TEXT)
    ├── post_id (INT, FOREIGN KEY → posts.id)
    └── user_id (INT, FOREIGN KEY → users.id)
```

| Concept | Description |
|---------|-------------|
| **Database** | Container for tables |
| **Table** | Collection of rows with a fixed schema (like a spreadsheet) |
| **Row** (Record) | A single entry in a table |
| **Column** (Field) | A named attribute with a specific data type |
| **Primary Key** | Unique identifier for each row (usually `id`) |
| **Foreign Key** | Reference to a primary key in another table (creates relationships) |

### MySQL vs MongoDB

| Feature | MySQL (SQL) | MongoDB (NoSQL) |
|---------|------------|----------------|
| Data model | Tables with rows/columns | Collections with documents |
| Schema | Fixed, predefined | Flexible, dynamic |
| Relationships | Foreign keys + JOINs | Embedded docs or references |
| Query language | SQL | MongoDB Query Language |
| Transactions | Native ACID | Supported (since v4.0) |
| Scaling | Vertical (bigger server) | Horizontal (sharding) |
| ORM/ODM | Sequelize, Prisma, Knex | Mongoose |

### When to Use MySQL

- Well-defined, stable schemas (e-commerce, banking, CRM)
- Complex relationships requiring JOINs
- Strict data integrity and ACID transactions
- Reporting and analytics
- Existing SQL expertise on the team

---

## 2. Common Data Types

| Type | Description | Example |
|------|-------------|---------|
| `INT` | Integer | `42` |
| `BIGINT` | Large integer | `9223372036854775807` |
| `FLOAT` / `DOUBLE` | Floating point | `3.14` |
| `DECIMAL(10,2)` | Precise decimal (financial) | `99.99` |
| `VARCHAR(n)` | Variable-length string (max n chars) | `'Hello'` |
| `TEXT` | Long text (up to 65KB) | Blog content |
| `LONGTEXT` | Very long text (up to 4GB) | Large documents |
| `BOOLEAN` / `TINYINT(1)` | True/false | `1` or `0` |
| `DATE` | Date only | `'2024-01-15'` |
| `DATETIME` | Date and time | `'2024-01-15 10:30:00'` |
| `TIMESTAMP` | Auto-updating date/time | Current timestamp |
| `ENUM('a','b','c')` | Restricted values | `'active'` |
| `JSON` | JSON data (MySQL 5.7+) | `'{"key": "value"}'` |
| `BLOB` | Binary data | Images, files |

---

## 3. Installing MySQL

### Local Installation

- **Windows:** Download [MySQL Installer](https://dev.mysql.com/downloads/installer/) or use XAMPP/WAMP
- **macOS:** `brew install mysql`
- **Linux:** `sudo apt install mysql-server`

### GUI Tools

- **phpMyAdmin** — Web-based (included with XAMPP/WAMP)
- **MySQL Workbench** — Official desktop GUI
- **DBeaver** — Universal database GUI
- **TablePlus** — Lightweight GUI

### Access phpMyAdmin

1. Install XAMPP or WAMP
2. Start Apache and MySQL services
3. Navigate to `http://localhost/phpmyadmin`
4. Login with `root` / (blank password by default)

---

## 4. Connecting MySQL to Express (Native Driver)

### Install the mysql2 Package

```bash
npm install mysql2
```

`mysql2` is preferred over `mysql` because it supports Promises, prepared statements, and is faster.

### Connection Setup

```javascript
// config/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'myapp',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,       // Max simultaneous connections
  queueLimit: 0,             // Unlimited queue
});

export default pool;
```

**Pool vs Connection:**
- `createConnection()` — Single connection, must manually manage open/close
- `createPool()` — Pool of connections, automatically manages lifecycle (recommended)

### Using in Express Routes

```javascript
import express from 'express';
import pool from './config/db.js';

const app = express();
app.use(express.json());

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create user (parameterized query — prevents SQL injection)
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update user
app.put('/api/users/:id', async (req, res) => {
  const { name, email } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ id: req.params.id, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
```

### Parameterized Queries (Preventing SQL Injection)

**Always use `?` placeholders** — never concatenate user input into SQL strings:

```javascript
// DANGEROUS — SQL injection vulnerability
const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;

// SAFE — parameterized query
const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
```

### Environment Variables

```bash
# .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=myapp
DB_PORT=3306
```

---

## 5. Common Connection Errors

| Error | Cause | Solution |
|-------|-------|---------|
| `ECONNREFUSED` | MySQL not running | Start MySQL service |
| `ER_NOT_SUPPORTED_AUTH_MODE` | Auth plugin mismatch | Run: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';` |
| `ER_BAD_DB_ERROR` | Database doesn't exist | Create the database first |
| `ER_ACCESS_DENIED_ERROR` | Wrong credentials | Check username/password |

---

## 6. Summary

| Concept | Description |
|---------|-------------|
| MySQL | Relational database with fixed schemas |
| Table | Rows + columns with data types |
| Primary Key | Unique row identifier |
| Foreign Key | Reference to another table |
| `mysql2` | Node.js driver for MySQL |
| Pool | Managed set of database connections |
| `?` placeholders | Prevent SQL injection |

### Key Points

1. Use `mysql2/promise` for async/await support
2. Use **connection pools** (`createPool`), not single connections
3. **Always parameterize queries** with `?` to prevent SQL injection
4. Store credentials in **environment variables**
5. Use a GUI tool (phpMyAdmin, Workbench) for visual database management
