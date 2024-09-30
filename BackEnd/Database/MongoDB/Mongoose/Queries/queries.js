/**
 * Mongoose Queries: Examples and Explanations
 * -------------------------------------------
 * This file contains examples of common queries in Mongoose, such as finding, creating,
 * updating, deleting documents, and joining queries using `populate()` in a MongoDB collection.
 */

// Import mongoose and your model
import mongoose from "mongoose";
const User = mongoose.model("User", userSchema); // Assuming 'User' model is already defined

// Assuming Post model has an 'author' field that references the User model
const Post = mongoose.model("Post", postSchema);

//--------------------------------------------------------------------------------------------------

// 1. **Finding Documents**

/**
 * 1.1 Find All Documents
 * `find()` returns all documents that match the filter. If no filter is provided, it returns all documents.
 */
const findAllUsers = async () => {
  try {
    const users = await User.find({});
    console.log("All users:", users);
  } catch (err) {
    console.error("Error finding users:", err);
  }
};

/**
 * 1.2 Find Documents with a Filter
 * Finds users where age is greater than or equal to 18
 */
const findAdultUsers = async () => {
  try {
    const users = await User.find({ age: { $gte: 18 } });
    console.log("Adult users:", users);
  } catch (err) {
    console.error("Error finding users:", err);
  }
};

/**
 * 1.3 Find One Document
 * `findOne()` finds a single document that matches the filter. Returns the first match.
 */
const findOneUser = async () => {
  try {
    const user = await User.findOne({ name: "John Doe" });
    console.log("Found user:", user);
  } catch (err) {
    console.error("Error finding user:", err);
  }
};

/**
 * 1.4 Find by ObjectId
 * `findById()` finds a document by its unique _id field (ObjectId).
 */
const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    console.log("Found user by ID:", user);
  } catch (err) {
    console.error("Error finding user by ID:", err);
  }
};

//--------------------------------------------------------------------------------------------------

// 2. **Creating Documents**

/**
 * 2.1 Create a New Document
 * `save()` is used after creating an instance of a model to insert it into the database.
 */
const createUser = async () => {
  const newUser = new User({ name: "Jane Doe", age: 25, email: "jane@example.com" });
  try {
    const savedUser = await newUser.save(); // Insert new user
    console.log("User created:", savedUser);
  } catch (err) {
    console.error("Error creating user:", err);
  }
};

/**
 * 2.2 Create Multiple Documents
 * `insertMany()` inserts an array of documents into the collection.
 */
const createMultipleUsers = async () => {
  const users = [
    { name: "Alice", age: 30, email: "alice@example.com" },
    { name: "Bob", age: 35, email: "bob@example.com" },
  ];
  try {
    const insertedUsers = await User.insertMany(users); // Insert multiple users
    console.log("Users created:", insertedUsers);
  } catch (err) {
    console.error("Error inserting multiple users:", err);
  }
};

//--------------------------------------------------------------------------------------------------

// 3. **Updating Documents**

/**
 * 3.1 Update One Document
 * `updateOne()` updates the first document that matches the filter.
 * The `$set` operator is used to specify the fields to update.
 */
const updateUser = async (id) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: id }, // Filter by user ID
      { $set: { age: 28 } } // Update age to 28
    );
    console.log("User updated:", updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
  }
};

/**
 * 3.2 Update Multiple Documents
 * `updateMany()` updates all documents that match the filter.
 */
const updateMultipleUsers = async () => {
  try {
    const result = await User.updateMany(
      { age: { $lt: 30 } }, // Filter users where age is less than 30
      { $set: { isActive: false } } // Set isActive to false
    );
    console.log("Updated users:", result);
  } catch (err) {
    console.error("Error updating multiple users:", err);
  }
};

/**
 * 3.3 Find and Update (FindOneAndUpdate)
 * `findOneAndUpdate()` finds and updates a document, returning the updated document.
 */
const findAndUpdateUser = async () => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { name: "John Doe" }, // Filter by name
      { $set: { age: 32 } }, // Update age to 32
      { new: true } // Return the updated document
    );
    console.log("User updated (find and update):", updatedUser);
  } catch (err) {
    console.error("Error finding and updating user:", err);
  }
};

//--------------------------------------------------------------------------------------------------

// 4. **Deleting Documents**

/**
 * 4.1 Delete One Document
 * `deleteOne()` deletes a single document that matches the filter.
 */
const deleteUser = async (id) => {
  try {
    const deletedUser = await User.deleteOne({ _id: id });
    console.log("User deleted:", deletedUser);
  } catch (err) {
    console.error("Error deleting user:", err);
  }
};

/**
 * 4.2 Delete Multiple Documents
 * `deleteMany()` deletes all documents that match the filter.
 */
const deleteMultipleUsers = async () => {
  try {
    const result = await User.deleteMany({ age: { $gt: 30 } }); // Delete users older than 30
    console.log("Deleted users:", result);
  } catch (err) {
    console.error("Error deleting multiple users:", err);
  }
};

/**
 * 4.3 Find and Delete (FindOneAndDelete)
 * `findOneAndDelete()` finds and deletes a document, returning the deleted document.
 */
const findAndDeleteUser = async () => {
  try {
    const deletedUser = await User.findOneAndDelete({ name: "John Doe" });
    console.log("User deleted (find and delete):", deletedUser);
  } catch (err) {
    console.error("Error finding and deleting user:", err);
  }
};

//--------------------------------------------------------------------------------------------------

// 5. **Other Query Options**

/**
 * 5.1 Counting Documents
 * `countDocuments()` returns the number of documents that match the filter.
 */
const countUsers = async () => {
  try {
    const count = await User.countDocuments({ age: { $gte: 18 } }); // Count users aged 18 or older
    console.log("Number of adult users:", count);
  } catch (err) {
    console.error("Error counting users:", err);
  }
};

/**
 * 5.2 Sorting Results
 * `sort()` is used to sort the query results by one or more fields.
 */
const findAndSortUsers = async () => {
  try {
    const users = await User.find({}).sort({ age: -1 }); // Sort by age in descending order
    console.log("Users sorted by age:", users);
  } catch (err) {
    console.error("Error sorting users:", err);
  }
};

/**
 * 5.3 Limiting Results
 * `limit()` limits the number of documents returned by the query.
 */
const findAndLimitUsers = async () => {
  try {
    const users = await User.find({}).limit(5); // Return only 5 users
    console.log("Limited users:", users);
  } catch (err) {
    console.error("Error limiting users:", err);
  }
};

/**
 * 5.4 Skipping Results
 * `skip()` skips over a specified number of documents in the query result.
 */
const findAndSkipUsers = async () => {
  try {
    const users = await User.find({}).skip(5); // Skip the first 5 users
    console.log("Skipped users:", users);
  } catch (err) {
    console.error("Error skipping users:", err);
  }
};

//--------------------------------------------------------------------------------------------------
// 6. **Joining Queries (Using Population)**

/**
 * 6.1 Find Posts and Populate the Author
 * `populate()` is used to join related documents.
 * In this example, each post has an `author` field that references a `User`.
 */
const findPostsWithAuthors = async () => {
  try {
    const posts = await Post.find({})
      .populate("author", "name email") // Populate 'author' with User's name and email
      .exec(); // Execute the query
    console.log("Posts with authors populated:", posts);
  } catch (err) {
    console.error("Error finding posts with authors:", err);
  }
};

/**
 * 6.2 Find Users and Populate Their Posts
 * You can also populate fields that reference other documents in reverse.
 * Here, we assume that each user has a field `posts` that contains an array of Post ObjectIds.
 */
const findUsersWithPosts = async () => {
  try {
    const users = await User.find({})
      .populate("posts", "title content") // Populate 'posts' with the titles and content from Post documents
      .exec(); // Execute the query
    console.log("Users with populated posts:", users);
  } catch (err) {
    console.error("Error finding users with posts:", err);
  }
};

/**
 * 6.3 Deep Population (Populating Nested References)
 * You can also perform deep population, which involves populating fields within populated documents.
 * For example, populating the author's posts from the Post model, and those posts’ comments, etc.
 */
const findPostsWithAuthorAndComments = async () => {
  try {
    const posts = await Post.find({})
      .populate({
        path: "author", // Populate the author field
        populate: { path: "posts", select: "title" }, // Also populate the posts field within the author document
      })
      .populate({
        path: "comments", // Assuming posts also have a 'comments' field that references a Comment collection
        select: "content author", // Populate comments with content and author fields
        populate: { path: "author", select: "name" }, // Populate the author field inside each comment
      })
      .exec();
    console.log("Posts with populated author and comments:", posts);
  } catch (err) {
    console.error("Error populating posts with author and comments:", err);
  }
};

/**
 * 6.4 Query and Join with Multiple Populates
 * Sometimes you may need to join across multiple references in a single query.
 * You can chain multiple `.populate()` calls or pass an array of populate options.
 */
const findPostsWithMultiplePopulates = async () => {
  try {
    const posts = await Post.find({})
      .populate("author", "name email") // Join with the 'author' field from the User collection
      .populate("comments", "content author") // Join with the 'comments' field from the Comment collection
      .exec();
    console.log("Posts with multiple populated fields:", posts);
  } catch (err) {
    console.error("Error populating posts with multiple fields:", err);
  }
};
