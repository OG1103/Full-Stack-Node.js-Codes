// Finding Documents in Mongoose (ES6 Syntax)

import mongoose from "mongoose";

const User = mongoose.model("User", new mongoose.Schema({ name: String, age: Number, email: String }));

// 1. Find All Users
export const findAllUsers = async () => {
  try {
    const users = await User.find({});
    console.log(users.length === 0 ? "No users found." : "All users:", users);
  } catch (err) {
    console.error("Error finding users:", err);
  }
};

// 2. Find One User
export const findOneUser = async () => {
  try {
    const user = await User.findOne({ name: "John Doe" });
    console.log(user ? "Found user:" : "No user found.", user);
  } catch (err) {
    console.error("Error finding user:", err);
  }
};

// 3. Find User by ID
export const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    console.log(user ? "Found user by ID:" : `No user found with ID: ${id}.`, user);
  } catch (err) {
    console.error("Error finding user by ID:", err);
  }
};
