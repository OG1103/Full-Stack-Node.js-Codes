// Import mongoose
import mongoose from "mongoose";

// Define the schema for the 'User' collection
const userSchema = new mongoose.Schema(
  {
    // String type: Name of the user, required field
    name: {
      type: String, // Defines the data type as a string
      required: true, // Makes the field required
      trim: true, // Removes whitespace around the value
    },

    // Number type: Age of the user, optional field
    age: {
      type: Number, // Defines the data type as a number
      min: 0, // Minimum value for the field
      max: 120, // Maximum value for the field
    },

    // Date type: Date when the user was created (with default value)
    createdAt: {
      type: Date, // Defines the data type as a date
      default: Date.now, // Sets the default value to the current date/time
    },

    // Boolean type: Whether the user is active or not, default is true
    isActive: {
      type: Boolean, // Defines the data type as boolean
      default: true, // Default value if not provided
    },

    // Array of Strings type: List of hobbies (strings) for the user
    hobbies: {
      type: [String], // Array of strings
      default: [], // Default value is an empty array
    },

    // Embedded Object (or Subdocument) type: Address with multiple fields
    address: {
      street: {
        type: String, // Street name
        required: true, // Street is required
      },
      city: {
        type: String, // City name
        required: true, // City is required
      },
      zipcode: {
        type: String, // Zipcode as a string
        match: [/^\d{5}$/, "Please enter a valid 5-digit zipcode"], // Validation: 5-digit number
      },
    },

    // Enum type: Role of the user (must be one of the specified values)
    role: {
      type: String, // Role is a string
      enum: ["user", "admin", "guest"], // Only allows these values
      default: "user", // Default value is 'user'
    },

    // Mixed type: Any kind of data (for flexible fields)
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Can store any data type
      default: {}, // Default is an empty object
    },

    // ObjectId type: Reference to another collection (e.g., 'Post')
    // an array of objectIds that refrence another model
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to another collection
        ref: "Post", // The collection it references (Post model)
      },
    ],
  },
  {
    // Schema options
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Notes:
// - The `timestamps` option automatically adds 'createdAt' and 'updatedAt' fields.
// - The `ObjectId` type is used for relationships (references to documents in other collections).
// - You can define validation rules, default values, and more for each field.

// Compile the schema into a model
const User = mongoose.model("User", userSchema);

// Export the model so it can be used in other parts of the app
export default User;
