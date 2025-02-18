import mongoose from "mongoose";

// Define schema with various options
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    versionKey: false, // Removes __v field
    collection: "custom_users", // Custom collection name
    capped: { size: 1024, max: 100 }, // Limits to 1024 bytes or 100 docs
    strict: false, // Allows extra fields
    strictQuery: false, // Allows queries with extra fields
    id: false, // Disables virtual id field
    toJSON: { getters: true }, // Enables getters in JSON output
    toObject: { getters: true } // Enables getters in object output
  }
);

// Compile the schema into a model
const User = mongoose.model("User", userSchema);

// Example usage: Creating a new user
const newUser = new User({
  name: "John Doe",
  age: 30,
  role: "admin" // Extra field (allowed because strict: false)
});

// Save the document to the database
newUser
  .save()
  .then((doc) => console.log("Document saved:", doc))
  .catch((err) => console.error("Error saving document:", err));

export default User;
