// Setp 1: we import the mongoose library by importing it
import mongoose from "mongoose";

// Step 2: we connect mongoose to a MongoDB database
// The connect() method takes 3 parameters(1,2,3):
// 1- a url/connectionstring for it to connect to
// 2- a call back function which executes once we are connected to a database.
// 3- a callback function that executes incase of an error occurs while making a connection
mongoose.connct(
  "mongodb://localhost/testdb",
  () => {
    console.log("connection established");
  },
  (e) => console.error(e)
);

/** 
 * Key Concepts in Mongoose:
 * 
 * 1. Schema:
 *    - A **schema** defines the structure and rules for a document in a MongoDB collection.
 *    - It specifies the fields, data types, and any validation or restrictions that should be applied to the data.
 *    - The schema acts as a blueprint for how the data should be stored.
 * 
 * 2. Model:
 *    - A **model** is a compiled version of the schema, representing a collection in the database.
 *    - It provides a concrete form of the schema that allows interaction with the data (CRUD operations).
 *    - Using a model, you can create, read, update, and delete documents within a collection.
 * 
 * 3. Query:
 *    - A **query** is an operation or request made to the MongoDB database to retrieve or manipulate data.
 *    - Queries are performed using Mongoose methods (e.g., `find()`, `updateOne()`, `deleteMany()`), and allow you to interact with the database.
 *    - Queries can be used to filter, sort, update, or delete documents in the collection.
 */

