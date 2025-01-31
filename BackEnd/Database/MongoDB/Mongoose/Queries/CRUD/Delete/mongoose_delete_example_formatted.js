const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/testdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

const User = mongoose.model("User", userSchema);

// 1. deleteOne() - Delete a single document
const deleteSingleUser = async () => {
  try {
    const result = await User.deleteOne({ name: "Alice" });
    console.log("Delete Result:", result);
  } catch (err) {
    console.error("Error deleting user:", err.message);
  }
};

// 2. deleteMany() - Delete multiple documents
const deleteMultipleUsers = async () => {
  try {
    const result = await User.deleteMany({ age: { $lt: 30 } });
    console.log("Bulk Delete Result:", result);
  } catch (err) {
    console.error("Error deleting users:", err.message);
  }
};

// 3. findByIdAndDelete()
const deleteUserById = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    console.log("Deleted User By ID:", user);
  } catch (err) {
    console.error("Error deleting user by ID:", err.message);
  }
};

// 4. findOneAndDelete()
const deleteUser = async () => {
  try {
    const user = await User.findOneAndDelete({ name: "Bob" });
    console.log("Deleted User:", user);
  } catch (err) {
    console.error("Error deleting user:", err.message);
  }
};

// 5. Handling errors
const safeDelete = async () => {
  try {
    const result = await User.deleteOne({ name: "Unknown" });
    console.log("Delete result:", result);
  } catch (err) {
    console.error("Delete failed:", err.message);
  }
};

// Run all delete examples
const runDeleteExamples = async () => {
  await deleteSingleUser();
  await deleteMultipleUsers();
  await deleteUser();
  mongoose.connection.close();
};

runDeleteExamples();
