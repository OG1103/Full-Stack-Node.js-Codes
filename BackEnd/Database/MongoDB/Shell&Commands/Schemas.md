
# Schemas

## Importance of Having a Schema

- MongoDB is schema-less, meaning it doesn’t enforce a schema, so documents can have different structures.
- However, when working with real-world projects, you will need some sort of schema to work with a backend application to enforce certain things that might be required in a UI.

### 1. Data Consistency

- **MongoDB’s Flexibility**: MongoDB allows you to store different types of documents in the same collection, meaning each document can have a different structure or fields.
- **Why Schema Helps**: In real-world applications, consistency is key. A schema ensures that certain fields always exist in the data, with the correct data types. 
  This prevents inconsistencies that could cause bugs in the application or UI.
- **Example**: You can define that all user documents must have a `name` (string), `age` (number), and `email` (string). Without a schema, you might accidentally store documents with missing fields or incorrect data types, which could break the UI or backend.

### 2. Enforcing Business Logic

- **MongoDB Without a Schema**: Without a schema, MongoDB will not enforce data rules like required fields, data type validation, or default values.
- **Why Schema Helps**: By defining a schema, you can enforce business logic directly at the database level. 
  For example, you can ensure that all user documents must have a valid email and that age must be greater than 18.

**Mongoose Example**:
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, min: 18 },
  email: { type: String, required: true }
});
```

### 3. Data Validation

- **MongoDB’s Lack of Validation**: Without a schema, MongoDB doesn’t provide built-in validation for data inserted into a collection. This can lead to storing invalid data.
- **Why Schema Helps**: A schema allows you to define validation rules for the data, ensuring that only valid data is inserted into the database. This helps reduce errors and ensures that the application runs smoothly.
- **Example**: You can define that the email field must follow a valid email format, or that age should be a positive number.

### 4. UI and API Integration

- **MongoDB’s Flexibility**: Without a schema, you may end up with missing or malformed data, causing issues in the UI or API integration.
- **Why Schema Helps**: A schema guarantees that your data has a consistent structure, which is critical for integrating with frontend applications, ensuring that the data rendered in the UI is always in the expected format.

### 5. Relationships Between Data

- **MongoDB Without a Schema**: MongoDB doesn’t inherently enforce relationships between collections (like SQL databases do with foreign keys).
- **Why Schema Helps**: With Mongoose, you can define relationships between different collections using references (similar to foreign keys). This allows you to manage relationships between documents more effectively, such as linking an order to a specific user.

---

## Setting Validation Level & Action

### Validation Level

Sets which documents will get validated and when. There are two types:

1. **Strict**: All inserts and updates will be validated.
2. **Moderate**: All inserts are validated, but updates are validated only for documents added after the schema validation was applied.

### Validation Action

Sets what should happen if validation fails. There are two options:

1. **Error**: Throws an error and stops the insert or update.
2. **Warning**: Simply shows a warning to the user, but the insert or update proceeds.

---

## Example

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age"],
      properties: {
        name: {
          bsonType: "string",
          description: "Name must be a string and is required"
        },
        age: {
          bsonType: "int",
          minimum: 0,
          description: "Age must be an integer greater than or equal to 0 and is required"
        }
      }
    }
  },
  validationLevel: "strict",  // Sets validation level to strict (validate all inserts and updates)
  validationAction: "error"   // Sets validation action to error (prevent invalid data from being inserted)
});
```
