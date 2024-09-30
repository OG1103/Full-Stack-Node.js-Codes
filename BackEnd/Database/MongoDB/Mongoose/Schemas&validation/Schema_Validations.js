/**
 * Mongoose Schema Field Validations and Restrictions
 * --------------------------------------------------
 * This file contains all the common validations and restrictions that can be applied
 * to fields in a Mongoose schema. These validations ensure data consistency and integrity.
 */

// Import mongoose
import mongoose from "mongoose";

// Example Schema with Different Types of Validations
const exampleSchema = new mongoose.Schema(
  {
    /**
     * 1. Type Validation
     *
     * - The `type` field defines the data type of the field.
     * - Supported types: String, Number, Date, Boolean, Array, ObjectId, etc.
     */
    name: {
      type: String, // This field must be a string
    },
    age: {
      type: Number, // This field must be a number
    },

    /**
     * 2. Required Validation
     *
     * - Ensures that a field must have a value (cannot be null or undefined).
     * - Can be set to `true` or false`.
     * - The `required` validation is enclosed in an array:
     *   - First value: `true` (the constraint).
     *   - Second value: Custom error message if the validation fails.
     */
    email: {
      type: String,
      required: [true, "Email is required"], // Email must be provided or it will return this custom error message
    },

    /**
     * 3. Default Value
     *
     * - Provides a default value for the field if none is provided.
     * - Can be static (e.g., a string, number) or a function (e.g., Date.now).
     */
    isActive: {
      type: Boolean,
      default: true, // If not provided, it will default to true
    },
    joinedAt: {
      type: Date,
      default: Date.now, // Will default to the current date and time
    },

    /**
     * 4. String Length Validation
     *
     * - `minlength`: The minimum length of a string.
     * - `maxlength`: The maximum length of a string.
     * - These validations are enclosed in an array:
     *   - First value: The minimum or maximum length constraint.
     *   - Second value: Custom error message if validation fails.
     */
    username: {
      type: String,
      minlength: [5, "Username must be at least 5 characters"], // Minimum 5 characters, with a custom error message
      maxlength: [15, "Username cannot exceed 15 characters"], // Maximum 15 characters, with a custom error message
    },

    /**
     * 5. Number Range Validation
     *
     * - `min`: The minimum value for a number.
     * - `max`: The maximum value for a number.
     * - These validations are enclosed in an array:
     *   - First value: The min or max value constraint.
     *   - Second value: Custom error message if validation fails.
     */
    age: {
      type: Number,
      min: [18, "Age must be at least 18"], // Age cannot be below 18, returns custom error message if validation fails
      max: [65, "Age must be less than or equal to 65"], // Age cannot exceed 65, returns custom error message
    },

    /**
     * 6. Custom Regex Validation
     *
     * - The `match` option allows you to apply a regular expression to validate strings.
     * - The `match` option is also enclosed in an array:
     *   - First value: Regular expression constraint.
     *   - Second value: Custom error message if validation fails.
     */
    phone: {
      type: String,
      match: [/^\d{10}$/, "Phone number must be a valid 10-digit number"], // Validates 10-digit phone numbers
    },

    /**
     * 7. Enum Validation (for String)
     *
     * - The `enum` option allows you to restrict the field to specific values.
     * - It is commonly used for status, roles, or predefined categories.
     * - The `enum` option includes a values array and a custom error message.
     */
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "guest"], // Allowed values
        message: "Role must be either user, admin, or guest", // Custom error message
      },
      default: "user", // Default value if not provided
    },

    /**
     * 8. Unique Validation
     *
     * - Ensures that the value for this field must be unique within the collection.
     * - This does not require an array; it's just a flag set to `true`.
     * - Mongoose does not handle this directly but will ensure MongoDB creates a unique index.
     */
    email: {
      type: String,
      unique: true, // Ensures email is unique within the collection
    },

    /**
     * 9. Custom Validator (Function-based)
     *
     * - The `validate` option allows you to define custom validation logic using a function.
     * - In this case, we check that the password must be at least 8 characters long.
     * - Custom validators do not need to be in an array, but we can include a custom error message.
     */
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.length >= 8; // Custom rule: Password must be at least 8 characters long
        },
        message: "Password must be at least 8 characters long", // Custom error message if validation fails
      },
    },

    /**
     * 10. Mixed Type (Flexible Field)
     *
     * - `Mixed` is a flexible field that allows you to store any type of data (object, array, string, etc.).
     * - This is useful when you have fields with unpredictable or variable structure.
     * - No need for an array, just specifying the type.
     */
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Can store any kind of data
      default: {}, // Default value is an empty object
    },

    /**
     * 11. Array Type (for multiple values)
     *
     * - Arrays can hold multiple values of a specific type.
     * - You can define arrays for strings, numbers, or even objects.
     * - No need for an array here, just specifying type as an array.
     */
    tags: {
      type: [String], // Array of strings
      default: [], // Default to an empty array
    },

    /**
     * 12. Reference (ObjectId)
     *
     * - This defines a reference to another document in a different collection.
     * - Useful for creating relationships between documents (e.g., user and posts).
     * - No need for an array here, just specifying ObjectId and the ref.
     */
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId, // ObjectId reference
        ref: "Post", // Refers to the Post collection
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Compile the schema into a model
const Example = mongoose.model("Example", exampleSchema);

// Example usage:
const newExample = new Example({
  name: "John Doe",
  email: "john@example.com",
  username: "john_doe123",
  age: 30,
  phone: "1234567890",
  role: "user",
  password: "securePassword123",
  tags: ["example", "mongoose"],
});

// Save the document to the database
newExample
  .save()
  .then((doc) => console.log("Document saved:", doc))
  .catch((err) => console.error("Error saving document:", err));

export default Example;
