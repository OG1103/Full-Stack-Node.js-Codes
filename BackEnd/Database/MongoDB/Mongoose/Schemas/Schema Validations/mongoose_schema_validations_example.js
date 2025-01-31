import mongoose from "mongoose";

// Define the schema with validations
const userSchema = new mongoose.Schema(
  {
    // Required field
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true
    },

    // Default value
    isActive: {
      type: Boolean,
      default: true
    },

    // String length validation
    username: {
      type: String,
      minlength: [5, "Username must be at least 5 characters"],
      maxlength: [15, "Username cannot exceed 15 characters"]
    },

    // Number range validation
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [65, "Age must be less than or equal to 65"]
    },

    // Regex validation
    phone: {
      type: String,
      match: [/^\d{10}$/, "Phone number must be a valid 10-digit number"]
    },

    // Enum validation
    role: {
      type: String,
      enum: ["user", "admin", "guest"],
      default: "user"
    },

    // Custom validation
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.length >= 8;
        },
        message: "Password must be at least 8 characters long"
      }
    },

    // Mixed type (Flexible field)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // Reference to another collection
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ]
  },
  {
    timestamps: true // Adds createdAt and updatedAt
  }
);

// Compile the schema into a model
const User = mongoose.model("User", userSchema);

// Example usage: Creating a new user with validations
const newUser = new User({
  email: "john@example.com",
  username: "john_doe123",
  age: 30,
  phone: "1234567890",
  role: "user",
  password: "securePassword123",
  tags: ["example", "mongoose"]
});

// Save the document to the database
newUser
  .save()
  .then((doc) => console.log("Document saved:", doc))
  .catch((err) => console.error("Error saving document:", err));

export default User;
