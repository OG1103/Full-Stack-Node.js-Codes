const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/testdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  title: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const userSchema = new mongoose.Schema({
  name: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const commentSchema = new mongoose.Schema({
  text: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Post = mongoose.model("Post", postSchema);
const User = mongoose.model("User", userSchema);
const Comment = mongoose.model("Comment", commentSchema);

// 1. Basic populate()
const findUserWithPosts = async () => {
  try {
    const user = await User.findOne({ name: "Alice" }).populate("posts");
    console.log("User with posts:", user);
  } catch (err) {
    console.error("Error populating user:", err.message);
  }
};

// 2. Populating multiple fields
const findUserWithDetails = async () => {
  try {
    const user = await User.findOne({ name: "Bob" }).populate("posts").populate("comments");
    console.log("User with populated fields:", user);
  } catch (err) {
    console.error("Error populating user details:", err.message);
  }
};

// 3. Nested population
const findUserWithFullDetails = async () => {
  try {
    const user = await User.findOne({ name: "Charlie" }).populate({
      path: "posts",
      populate: { path: "comments" },
    });
    console.log("User with nested populated data:", user);
  } catch (err) {
    console.error("Error in deep population:", err.message);
  }
};

// 4. Selecting fields in population
const findUserWithLimitedPostFields = async () => {
  try {
    const user = await User.findOne({ name: "David" }).populate("posts", "title -_id");
    console.log("User with limited post fields:", user);
  } catch (err) {
    console.error("Error limiting populated fields:", err.message);
  }
};

// 5. Populating all users' posts
const findAllUsersWithPosts = async () => {
  try {
    const users = await User.find().populate("posts");
    console.log("All users with populated posts:", users);
  } catch (err) {
    console.error("Error populating all users:", err.message);
  }
};

// Run all populate examples
const runPopulateExamples = async () => {
  await findUserWithPosts();
  await findUserWithDetails();
  await findUserWithFullDetails();
  await findUserWithLimitedPostFields();
  await findAllUsersWithPosts();
  mongoose.connection.close();
};

runPopulateExamples();
