import mongoose from "mongoose";

/**Concepts:
 *  We usually have seperate files for each schema
 */

// Creating a basic schema for a user model
/**
 * A schema takes in an object that consists of key-value pairs
 * The key represents the field name.
 * The value is the datatype that corresponds to the key.
 * The value can later then be an object which represent restrictions on the field,This object can define validation rules, default values, and other constraints.
 * Check Schema types
 */
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  //we define all my fields and corresponding data type
});

//Example of setting advanced declaration of schema with restrictions and validations
const userSchema1 = new mongoose.Schema({
  name: {
    /*Details regarding that field. Ex type and any restrictions/validations */
  },
  age: {
    /*Details regarding that field. Ex type and any restrictions/validations */
  },

  //we define all my fields and corresponding data type
});

// Create a model for that schema
//mongoose.model(): Takes 2 parameters:
// 1- Is the model name / collection name in my database
// 2- is the schema that the model will follow
export default mongoose.model("user", userSchema);
// I export that so then i can use it in other places to query that model/collection.
