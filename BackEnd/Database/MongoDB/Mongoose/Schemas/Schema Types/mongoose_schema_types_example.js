import mongoose from "mongoose";

// Define the schema for the 'User' collection
const userSchema = new mongoose.Schema(
  {
    // String type: Name of the user, required field
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Number type: Age of the user, optional field
    age: {
      type: Number,
      min: 0,
      max: 120,
    },

    // Date type: Date when the user was created (default: now)
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Boolean type: Whether the user is active or not, default is true
    isActive: {
      type: Boolean,
      default: true,
    },

    // Array of Strings type: List of hobbies (strings) for the user
    hobbies: {
      type: [String],
      default: [],
    },

    // Embedded Object (Subdocument) type: Address with multiple fields
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zipcode: {
        type: String,
        match: [/^\d{5}$/, "Please enter a valid 5-digit zipcode"],
      },
    },

    // Enum type: Role of the user (must be one of the specified values)
    role: {
      type: String,
      enum: ["user", "admin", "guest"],
      default: "user",
    },

    // Mixed type: Any kind of data (for flexible fields)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ObjectId type: Reference to another collection (e.g., 'Post')
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    // Schema options
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Compile the schema into a model
const User = mongoose.model("User", userSchema);

// Export the model so it can be used in other parts of the app
export default User;
