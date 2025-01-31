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

// 1. updateOne() - Update a single document
const updateSingleUser = async () => {
  try {
    const result = await User.updateOne({ name: "Alice" }, { age: 30 });
    console.log("Update Result:", result);
  } catch (err) {
    console.error("Error updating user:", err.message);
  }
};

// 2. updateMany() - Update multiple documents
const updateMultipleUsers = async () => {
  try {
    const result = await User.updateMany({ age: { $lt: 30 } }, { age: 30 });
    console.log("Bulk Update Result:", result);
  } catch (err) {
    console.error("Error updating users:", err.message);
  }
};

// 3. findByIdAndUpdate()
const updateUserById = async (id) => {
  try {
    const user = await User.findByIdAndUpdate(id, { age: 40 }, { new: true });
    console.log("Updated User By ID:", user);
  } catch (err) {
    console.error("Error updating user by ID:", err.message);
  }
};

// 4. findOneAndUpdate()
const updateUser = async () => {
  try {
    const user = await User.findOneAndUpdate({ name: "Bob" }, { age: 32 }, { new: true });
    console.log("Updated User:", user);
  } catch (err) {
    console.error("Error updating user:", err.message);
  }
};

// 5. Using save()
const updateWithSave = async () => {
  try {
    const user = await User.findOne({ name: "Charlie" });
    if (user) {
      user.age = 35;
      await user.save();
      console.log("Saved User:", user);
    } else {
      console.log("User not found.");
    }
  } catch (err) {
    console.error("Error saving updated user:", err.message);
  }
};

// Run all update examples
const runUpdateExamples = async () => {
  await updateSingleUser();
  await updateMultipleUsers();
  await updateUser();
  await updateWithSave();
  mongoose.connection.close();
};

runUpdateExamples();
