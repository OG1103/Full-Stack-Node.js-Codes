# Sequelize Guide for MySQL

This guide will walk you through the basics of using Sequelize with MySQL. It includes:

1. Setting up and connecting Sequelize to MySQL.
2. Creating models and migration files.
3. Understanding and executing migration files.
4. Querying data (separate file for queries).

## 1. Setting Up and Connecting Sequelize

### Installation

Install Sequelize and the MySQL2 library:

```bash
npm install sequelize mysql2
```

### Initialize Sequelize

To initialize Sequelize, create a file named `sequelize.js`:

```javascript
// sequelize.js
import { Sequelize } from "sequelize";

// Create a Sequelize instance
const sequelize = new Sequelize("database_name", "username", "password", {
  host: "localhost",
  dialect: "mysql",
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default sequelize;
```

Replace `database_name`, `username`, and `password` with your MySQL credentials.

## 2. Creating Models

To define a new model, import the Sequelize instance from `sequelize.js` and use the `.define` method. Here’s an example of creating a `User` model:

```javascript
// user.model.js
import { DataTypes } from "sequelize";
import sequelize from "./sequelize"; // Import the initialized Sequelize instance

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Validates email format
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users", // Specify a custom table name
    timestamps: true, // Add createdAt and updatedAt fields
    paranoid: true, // Add deletedAt field for soft deletes
    underscored: true, // Use snake_case column names instead of camelCase
  }
);

export default User;
```

### Model Options Explained

- **tableName**: Specify a custom name for the table instead of Sequelize automatically pluralizing the model name.
- **timestamps**: Automatically adds `createdAt` and `updatedAt` fields.
- **paranoid**: Enables soft deletes by adding a `deletedAt` field.
- **underscored**: Converts camelCase column names to snake_case.

## 3. Syncing Models

After defining models, you need to sync them with the database to create or update tables. Import all models and call `sequelize.sync` in a central file:

```javascript
// index.js
import sequelize from "./sequelize";
import User from "./user.model";

(async () => {
  try {
    // Sync all models
    await sequelize.sync({ force: false }); // Options explained below
    console.log("Models have been synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
})();

/**
 * sequelize.sync options:
 * - force: true
 *   Drops existing tables and recreates them. Use this in development/testing when you want to reset the database schema.
 * - alter: true
 *   Updates existing tables to match model definitions without dropping data. Use this for incremental changes in production.
 * - Default (no options):
 *   Creates tables only if they do not exist.
 */

// Additional options:
// sequelize.drop() - Drops all tables in the database.
// sequelize.close() - Closes the database connection.
```

### Syncing Models Individually

If you want to sync specific models instead of all models:

```javascript
await User.sync({ force: false });
```

### Examples of Sync Options

- **Development Reset**: Use `{ force: true }` to drop and recreate all tables:
  ```javascript
  await sequelize.sync({ force: true });
  ```
- **Incremental Updates**: Use `{ alter: true }` to update tables without losing data:
  ```javascript
  await sequelize.sync({ alter: true });
  ```
- **Default Behavior**: If no options are passed, Sequelize will create tables if they don’t exist:
  ```javascript
  await sequelize.sync();
  ```

## 4. Importing Models and Querying

To use models in your application, import them into a central file and use Sequelize query methods:

```javascript
// Example usage in a controller or service file
import User from "./user.model";

(async () => {
  try {
    // Create a new user
    const newUser = await User.create({
      username: "johndoe",
      email: "johndoe@example.com",
      password: "securepassword",
    });

    console.log("User created:", newUser);

    // Fetch all users
    const users = await User.findAll();
    console.log("All users:", users);
  } catch (error) {
    console.error("Error:", error);
  }
})();
```

This guide provides a detailed overview of setting up Sequelize with MySQL, creating models, syncing them with the database, and basic querying. It also includes information on using other Sequelize methods like `.drop()` and `.close()` to manage your database and connections effectively. You can expand on this by adding relationships, advanced querying, and migrations.
