# Mongoose — Setup & Connection

Mongoose is an **ODM (Object Data Modeling)** library for MongoDB and Node.js. It provides schema-based modeling, validation, middleware, and query building on top of the native MongoDB driver.

---

## 1. Why Mongoose?

| Feature            | Native MongoDB Driver | Mongoose                   |
| ------------------ | --------------------- | -------------------------- |
| Schema enforcement | None (schemaless)     | Defined schemas with types |
| Validation         | Manual                | Built-in validators        |
| Middleware         | None                  | Pre/post hooks             |
| Type casting       | Manual                | Automatic                  |
| Population (JOINs) | Manual `$lookup`      | `.populate()`              |
| Default values     | Manual                | Schema defaults            |

Mongoose adds a **structure layer** on top of MongoDB's flexibility while still allowing dynamic data when needed.

---

## 2. Installation

```bash
npm install mongoose
```

---

## 3. Connection Setup

### Basic Connection

```javascript
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
```

### Usage in Server

```javascript
import express from "express";
import connectDB from "./config/db.js";

const app = express();

connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
```

### Connection with Options

```javascript
await mongoose.connect(process.env.MONGO_URI, {
  dbName: "myDatabase", // Specify database name
  maxPoolSize: 10, // Maximum number of connections in pool
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  socketTimeoutMS: 45000, // Timeout for socket inactivity
  family: 4, // Use IPv4
});
```

**Note:** Options like `useNewUrlParser`, `useUnifiedTopology`, `useCreateIndex`, and `useFindAndModify` are **deprecated** in Mongoose 6+. They are enabled by default and no longer need to be specified.

---

## 4. Connection String Formats

### Local MongoDB

```
mongodb://localhost:27017/myDatabase
```

- `mongodb://` — Standard protocol
- `localhost:27017` — Host and port (27017 is default)
- `/myDatabase` — Database name

### Atlas (Cloud)

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myDatabase?retryWrites=true&w=majority
```

- `mongodb+srv://` — SRV protocol (DNS-based discovery)
- Automatically resolves replica set members
- Includes TLS/SSL by default

### Environment Variable

```bash
# .env
MONGO_URI=mongodb+srv://admin:secretpass@cluster0.abc123.mongodb.net/myApp?retryWrites=true&w=majority
```

Always store connection strings in environment variables — never hardcode credentials.

---

## 5. Connection Events

Monitor the connection lifecycle:

```javascript
const db = mongoose.connection;

db.on("connected", () => {
  console.log("Mongoose connected to DB");
});

db.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

db.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed (app termination)");
  process.exit(0);
});
```

---

## 6. Mongoose Core Concepts

### Schema → Model → Document

```
Schema    →  Defines the shape and rules for documents
Model     →  A constructor compiled from a Schema (like a class)
Document  →  An instance of a Model (like an object)
```

```javascript
import mongoose from "mongoose";

// 1. Define a Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
});

// 2. Create a Model
const User = mongoose.model("User", userSchema);
// 'User' → Mongoose creates/uses a collection called 'users' (lowercase, pluralized)

// 3. Create a Document
const newUser = new User({ name: "John", email: "john@example.com", age: 28 });
await newUser.save();

// Or use Model.create() shorthand
const anotherUser = await User.create({
  name: "Jane",
  email: "jane@example.com",
});
```

### How Model Names Map to Collections

| Model Name   | Collection Name |
| ------------ | --------------- |
| `'User'`     | `users`         |
| `'Product'`  | `products`      |
| `'Category'` | `categories`    |
| `'Person'`   | `people`        |

Override with the `collection` schema option:

```javascript
const userSchema = new mongoose.Schema({ ... }, { collection: 'app_users' });
```

---

## 7. Multiple Connections

For apps that connect to multiple databases:

```javascript
const conn1 = mongoose.createConnection("mongodb://localhost:27017/db1");
const conn2 = mongoose.createConnection("mongodb://localhost:27017/db2");

const UserModel = conn1.model("User", userSchema);
const LogModel = conn2.model("Log", logSchema);
```

Each `createConnection()` returns an independent connection with its own models.

---

## 8. Summary

| Step            | Code                                            |
| --------------- | ----------------------------------------------- |
| Install         | `npm install mongoose`                          |
| Import          | `import mongoose from 'mongoose'`               |
| Connect         | `await mongoose.connect(MONGO_URI)`             |
| Define schema   | `new mongoose.Schema({ ... })`                  |
| Create model    | `mongoose.model('Name', schema)`                |
| Create document | `Model.create({ ... })` or `new Model().save()` |

### Key Points

1. Use `mongoose.connect()` with the URI from Atlas or local MongoDB
2. **Deprecated options** (`useNewUrlParser`, etc.) are no longer needed in Mongoose 6+
3. Store connection strings in **environment variables**
4. Monitor connections with `mongoose.connection.on()` events
5. Model names are **automatically pluralized** and lowercased for collection names
