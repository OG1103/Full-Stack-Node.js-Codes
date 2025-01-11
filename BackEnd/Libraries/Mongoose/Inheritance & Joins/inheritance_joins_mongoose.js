
// Inheritance and Joins in Mongoose

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/mongoose_inheritance_joins", { useNewUrlParser: true, useUnifiedTopology: true });

// Base schema for inheritance
const baseSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// User schema inheriting from baseSchema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});
userSchema.add(baseSchema);

const User = mongoose.model("User", userSchema);

// Admin schema inheriting from baseSchema
const adminSchema = new mongoose.Schema({
  role: String,
});
adminSchema.add(baseSchema);

const Admin = mongoose.model("Admin", adminSchema);

// Function to create users and admins
const createUsersAndAdmins = async () => {
  const user = new User({ name: "John Doe", email: "john@example.com" });
  const admin = new Admin({ role: "superadmin" });

  await user.save();
  await admin.save();

  console.log("User and Admin created:", user, admin);
};

// Joins using populate()
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const commentSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Post = mongoose.model("Post", postSchema);
const Comment = mongoose.model("Comment", commentSchema);

// Function to create posts and comments
const createPostsAndComments = async () => {
  const user = new User({ name: "Jane Doe", email: "jane@example.com" });
  await user.save();

  const comment = new Comment({ content: "Great post!", author: user._id });
  await comment.save();

  const post = new Post({ title: "My First Post", content: "Hello World!", author: user._id, comments: [comment._id] });
  await post.save();

  console.log("Post and Comment created:", post, comment);
};

// Function to retrieve posts with populated author and comments
const getPostsWithDetails = async () => {
  const posts = await Post.find({})
    .populate("author", "name email")
    .populate({
      path: "comments",
      select: "content author",
      populate: { path: "author", select: "name" },
    });

  console.log("Posts with populated details:", posts);
};

// Run the functions
(async () => {
  await mongoose.connection.dropDatabase();
  await createUsersAndAdmins();
  await createPostsAndComments();
  await getPostsWithDetails();
  mongoose.connection.close();
})();
