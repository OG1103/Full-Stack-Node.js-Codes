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

// 1. Using create() to insert a single user
const insertUser = async () => {
  try {
    const user = await User.create({ name: "Alice", age: 25 });
    console.log("User created:", user);
  } catch (err) {
    console.error("Error inserting user:", err.message);
  }
};

// 2. Using create() to insert multiple users
const insertMultipleUsers = async () => {
  try {
    const users = await User.create([
      { name: "Bob", age: 30 },
      { name: "Charlie", age: 35 },
    ]);
    console.log("Users created:", users);
  } catch (err) {
    console.error("Error inserting multiple users:", err.message);
  }
};

// 3. Using insertMany() for bulk insertion
const bulkInsertUsers = async () => {
  try {
    const users = await User.insertMany(
      [
        { name: "David", age: 28 },
        { name: "Eve", age: 22 },
        { name: "", age: 40 } // Invalid (empty name)
      ],
      { ordered: false } // Continues inserting valid documents
    );
    console.log("Bulk insert result:", users);
  } catch (err) {
    console.error("Bulk insert error:", err.message);
  }
};

// 4. Using new Model() + save()
const insertWithSave = async () => {
  try {
    const user = new User({ name: "Frank", age: 32 });
    user.age = 33; // Modify before saving
    await user.save();
    console.log("User saved:", user);
  } catch (err) {
    console.error("Error saving user:", err.message);
  }
};

// 5. Handling insertion errors
const safeInsertUser = async () => {
  try {
    const user = await User.create({ name: "" }); // Missing required field
    console.log("User inserted:", user);
  } catch (err) {
    console.error("Insertion failed:", err.message);
  }
};

// Run all insertion examples
const runInsertExamples = async () => {
  await insertUser();
  await insertMultipleUsers();
  await bulkInsertUsers();
  await insertWithSave();
  await safeInsertUser();
  mongoose.connection.close();
};

runInsertExamples();
