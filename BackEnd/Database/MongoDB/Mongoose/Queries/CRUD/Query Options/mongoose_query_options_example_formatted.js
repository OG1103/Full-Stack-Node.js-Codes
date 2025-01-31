const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/testdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

// 1. select() - Choose fields to return
const findUserWithSelectedFields = async () => {
  try {
    const user = await User.findOne({ name: "Alice" }).select("name age");
    console.log("User with selected fields:", user);
  } catch (err) {
    console.error("Error selecting fields:", err.message);
  }
};

// 2. sort() - Order query results
const findSortedUsers = async () => {
  try {
    const users = await User.find().sort({ age: -1 });
    console.log("Sorted users:", users);
  } catch (err) {
    console.error("Error sorting users:", err.message);
  }
};

// 3. limit() - Restrict number of results
const findLimitedUsers = async () => {
  try {
    const users = await User.find().limit(2);
    console.log("Limited users:", users);
  } catch (err) {
    console.error("Error limiting users:", err.message);
  }
};

// 4. skip() - Offset results (pagination)
const findUsersWithOffset = async () => {
  try {
    const users = await User.find().skip(2).limit(3);
    console.log("Paginated users:", users);
  } catch (err) {
    console.error("Error paginating users:", err.message);
  }
};

// 5. countDocuments() - Count matching documents
const countUsers = async () => {
  try {
    const userCount = await User.countDocuments({ age: { $gte: 30 } });
    console.log("Users count:", userCount);
  } catch (err) {
    console.error("Error counting users:", err.message);
  }
};

// 6. lean() - Optimize query performance
const findLeanUsers = async () => {
  try {
    const users = await User.find().lean();
    console.log("Lean users:", users);
  } catch (err) {
    console.error("Error with lean query:", err.message);
  }
};

// 7. where() - Chain query conditions
const findUsersWhere = async () => {
  try {
    const users = await User.where("age").gt(20).lt(40);
    console.log("Users in age range:", users);
  } catch (err) {
    console.error("Error using where:", err.message);
  }
};

// Run all query option examples
const runQueryOptionsExamples = async () => {
  await findUserWithSelectedFields();
  await findSortedUsers();
  await findLimitedUsers();
  await findUsersWithOffset();
  await countUsers();
  await findLeanUsers();
  await findUsersWhere();
  mongoose.connection.close();
};

runQueryOptionsExamples();
