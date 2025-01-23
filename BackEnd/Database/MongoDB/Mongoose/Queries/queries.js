/**
 * Mongoose Queries: Examples and Explanations
 * -------------------------------------------
 * This file contains examples of common queries in Mongoose, including error handling and handling
 * cases where data is not found, such as returning empty arrays or `null`. It also explains what is
 * assigned to the `const` after a successful operation.
 */

// Import mongoose and your model
import mongoose from "mongoose";
const User = mongoose.model("User", userSchema); // Assuming 'User' model is already defined
const Post = mongoose.model("Post", postSchema); // Assuming 'Post' model is already defined

//--------------------------------------------------------------------------------------------------

// 1. **Finding Documents**

/**
 * 1.1 Find All Documents
 * `find()` returns all documents that match the filter. If no filter is provided, it returns all documents.
 * If no documents are found, an empty array is returned.
 * 
 * Successful result: `const users` will be an array of User objects.
 */
const findAllUsers = async () => {
  try {
    const users = await User.find({});
    console.log(users.length === 0 ? "No users found." : "All users:", users);
  } catch (err) {
    console.error("Error finding users:", err);
  }
};

/**
 * 1.2 Find Documents with a Filter and Select Specific Fields
 * Finds users where age is greater than or equal to 18, but only returns their name and email.
 * If no users are found, an empty array is returned.
 * 
 * Successful result: `const users` will be an array of User objects with only `name` and `email` fields.
 */
const findAdultUsersWithFields = async () => {
  try {
    const users = await User.find({ age: { $gte: 18 } }).select("name email");
    console.log(users.length === 0 ? "No adult users found." : "Adult users (name and email only):", users);
  } catch (err) {
    console.error("Error finding users:", err);
  }
};

/**
 * 1.3 Find One Document
 * `findOne()` finds a single document that matches the filter. Returns the first match.
 * If no document is found, `null` is returned.
 * 
 * Successful result: `const user` will be a single User object or `null` if not found.
 */
const findOneUser = async () => {
  try {
    const user = await User.findOne({ name: "John Doe" });
    console.log(user ? "Found user:" : "No user found with the name 'John Doe'.", user);
  } catch (err) {
    console.error("Error finding user:", err);
  }
};

/**
 * 1.4 Find by ObjectId
 * `findById()` finds a document by its unique _id field (ObjectId).
 * If no document is found, `null` is returned.
 * 
 * Successful result: `const user` will be a single User object or `null` if not found.
 */
const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    console.log(user ? "Found user by ID:" : `No user found with the ID: ${id}.`, user);
  } catch (err) {
    console.error("Error finding user by ID:", err);
  }
};

//--------------------------------------------------------------------------------------------------

// 2. **Creating Documents**

/**
 * 2.1 Create a New Document
 * `save()` is used after creating an instance of a model to insert it into the database.
 * Returns the saved document or throws an error if something goes wrong.
 * 
 * Successful result: `const savedUser` will be the newly created User object.
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
 * Returns an array of the inserted documents or throws an error if something goes wrong.
 * 
 * Successful result: `const insertedUsers` will be an array of the newly created User objects.
 */
const createMultipleUsers = async () => {
  const users = [
    { name: "Alice", age: 30, email: "alice@example.com" },
    { name: "Bob", age: 35, email: "bob@example.com" },
  ];
  try {
    const insertedUsers = await User.insertMany(users);
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
 * If no documents match the filter, nothing is updated and the result indicates 0 `matchedCount`.
 * 
 * Successful result: `const updatedUser` will contain metadata, including the `matchedCount` and `modifiedCount` properties.
 */
const updateUser = async (id) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: id }, // Filter by user ID
      { $set: { age: 28 } } // Update age to 28
    );
    console.log(updatedUser.matchedCount === 0 ? `No user found with ID: ${id} to update.` : "User updated:", updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
  }
};

/**
 * 3.2 Update Multiple Documents
 * `updateMany()` updates all documents that match the filter.
 * If no documents match the filter, nothing is updated and the result indicates 0 `matchedCount`.
 * 
 * Successful result: `const result` will contain metadata, including `matchedCount` and `modifiedCount`.
 */
const updateMultipleUsers = async () => {
  try {
    const result = await User.updateMany(
      { age: { $lt: 30 } }, // Filter users where age is less than 30
      { $set: { isActive: false } } // Set isActive to false
    );
    console.log(result.matchedCount === 0 ? "No users under 30 found to update." : "Users updated:", result);
  } catch (err) {
    console.error("Error updating multiple users:", err);
  }
};

/**
 * 3.3 Find and Update (FindOneAndUpdate)
 * `findOneAndUpdate()` finds and updates a document, returning the updated document.
 * If no document is found, `null` is returned.
 * 
 * Successful result: `const updatedUser` will be the updated User object or `null` if not found.
 */
const findAndUpdateUser = async () => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { name: "John Doe" }, // Filter by name
      { $set: { age: 32 } }, // Update age to 32
      { new: true } // Return the updated document
    );
    console.log(updatedUser ? "User updated (find and update):" : "No user found with the name 'John Doe' to update.", updatedUser);
  } catch (err) {
    console.error("Error finding and updating user:", err);
  }
};

//--------------------------------------------------------------------------------------------------

// 4. **Deleting Documents**

/**
 * 4.1 Delete One Document
 * `deleteOne()` deletes a single document that matches the filter.
 * If no documents match the filter, nothing is deleted and the result indicates 0 `deletedCount`.
 * 
 * Successful result: `const deletedUser` will contain metadata, including the `deletedCount` property.
 */
const deleteUser = async (id) => {
  try {
    const deletedUser = await User.deleteOne({ _id: id });
    console.log(deletedUser.deletedCount === 0 ? `No user found with ID: ${id} to delete.` : "User deleted:", deletedUser);
  } catch (err) {
    console.error("Error deleting user:", err);
  }
};

/**
 * 4.2 Delete Multiple Documents
 * `deleteMany()` deletes all documents that match the filter.
 * If no documents match the filter, nothing is deleted and the result indicates 0 `deletedCount`.
 * 
 * Successful result: `const result` will contain metadata, including the `deletedCount` property.
 */
const deleteMultipleUsers = async () => {
  try {
    const result = await User.deleteMany({ age: { $gt: 30 } }); // Delete users older than 30
    console.log(result.deletedCount === 0 ? "No users older than 30 found to delete." : "Deleted users:", result);
  } catch (err) {
    console.error("Error deleting multiple users:", err);
  }
};

/**
 * 4.3 Find and Delete (FindOneAndDelete)
 * `findOneAndDelete()` finds and deletes a document, returning the deleted document.
 * If no document is found, `null` is returned.
 * 
 * Successful result: `const deletedUser` will be the deleted User object or `null` if not found.
 */
const findAndDeleteUser = async () => {
  try {
    const deletedUser = await User.findOneAndDelete({ name: "John Doe" });
    console.log(deletedUser ? "User deleted (find and delete):" : "No user found with the name 'John Doe' to delete.", deletedUser);
  } catch (err) {
    console.error("Error finding and deleting user:", err);
  }
};

//--------------------------------------------------------------------------------------------------

// 5. **Other Query Options**

/**
 * 5.1 Counting Documents
 * `countDocuments()` returns the number of documents that match the filter.
 * If no documents match, the result will be 0.
 * 
 * Successful result: `const count` will be the number of documents that match the filter.
 */
const countUsers = async () => {
  try {
    const count = await User.countDocuments({ age: { $gte: 18 } }); // Count users aged 18 or older
    console.log(count === 0 ? "No adult users found." : "Number of adult users:", count);
  } catch (err) {
    console.error("Error counting users:", err);
  }
};

/**
 * 5.2 Sorting Results
 * `sort()` is used to sort the query results by one or more fields.
 * If no documents are found, an empty array is returned.
 * 
 * Successful result: `const users` will be an array of User objects sorted by the specified field.
 */
const findAndSortUsers = async () => {
  try {
    const users = await User.find({}).sort({ age: -1 }); // Sort by age in descending order
    console.log(users.length === 0 ? "No users found to sort." : "Users sorted by age:", users);
  } catch (err) {
    console.error("Error sorting users:", err);
  }
};

/**
 * 5.3 Limiting Results
 * `limit()` limits the number of documents returned by the query.
 * If no documents are found, an empty array is returned.
 * 
 * Successful result: `const users` will be an array of User objects limited to the specified number.
 */
const findAndLimitUsers = async () => {
  try {
    const users = await User.find({}).limit(5); // Return only 5 users
    console.log(users.length === 0 ? "No users found to limit." : "Limited users:", users);
  } catch (err) {
    console.error("Error limiting users:", err);
  }
};

/**
 * 5.4 Skipping Results
 * `skip()` skips over a specified number of documents in the query result.
 * If no documents are found, an empty array is returned.
 * 
 * Successful result: `const users` will be an array of User objects after skipping the specified number of documents.
 */
const findAndSkipUsers = async () => {
  try {
    const users = await User.find({}).skip(5); // Skip the first 5 users
    console.log(users.length === 0 ? "No users found after skipping." : "Skipped users:", users);
  } catch (err) {
    console.error("Error skipping users:", err);
  }
};

//--------------------------------------------------------------------------------------------------

// 6. **Joining Queries (Using Population)**

/**
 * 6.1 Find Posts and Populate the Author
 * `populate()` is used to join related documents.
 * If no posts or authors are found, the result will be an empty array or `null` for populated fields.
 * 
 * Successful result: `const posts` will be an array of Post objects with populated author fields.
 */
const findPostsWithAuthors = async () => {
  try {
    const posts = await Post.find({}).populate("author", "name email").exec();
    console.log(posts.length === 0 ? "No posts found with authors." : "Posts with authors populated:", posts);
  } catch (err) {
    console.error("Error finding posts with authors:", err);
  }
};

/**
 * 6.2 Find Users and Populate Their Posts
 * Populate fields that reference other documents (e.g., user's posts).
 * If no users or posts are found, the result will be an empty array or `null` for populated fields.
 * 
 * Successful result: `const users` will be an array of User objects with populated posts fields.
 */
const findUsersWithPosts = async () => {
  try {
    const users = await User.find({}).populate("posts", "title content").exec();
    console.log(users.length === 0 ? "No users found with posts." : "Users with populated posts:", users);
  } catch (err) {
    console.error("Error finding users with posts:", err);
  }
};

/**
 * 6.3 Deep Population (Populating Nested References)
 * Perform deep population to populate fields within populated documents.
 * If no documents are found, the result will be `null` or an empty array.
 * 
 * Successful result: `const posts` will be an array of Post objects with deeply populated fields.
 */
const findPostsWithAuthorAndComments = async () => {
  try {
    const posts = await Post.find({})
      .populate({
        path: "author",
        populate: { path: "posts", select: "title" },
      })
      .populate({
        path: "comments",
        select: "content author",
        populate: { path: "author", select: "name" },
      })
      .exec();
    console.log(posts.length === 0 ? "No posts found with authors and comments." : "Posts with populated author and comments:", posts);
  } catch (err) {
    console.error("Error populating posts with author and comments:", err);
  }
};

/**
 * 6.4 Query and Join with Multiple Populates
 * Chain multiple `.populate()` calls or pass an array of populate options.
 * If no posts, authors, or comments are found, the result will be an empty array or `null` for populated fields.
 * 
 * Successful result: `const posts` will be an array of Post objects with multiple populated fields.
 */
const findPostsWithMultiplePopulates = async () => {
  try {
    const posts = await Post.find({})
      .populate("author", "name email")
      .populate("comments", "content author")
      .exec();
    console.log(posts.length === 0 ? "No posts found with multiple populates." : "Posts with multiple populated fields:", posts);
  } catch (err) {
    console.error("Error populating posts with multiple fields:", err);
  }
};
