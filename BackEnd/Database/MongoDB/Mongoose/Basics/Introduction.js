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

/**Concepts of mongoose:
 * A schema defines what the structure of my data looks like in a document/ collection
 * A model is a schema in an actual form i can use so a model basically represnts the collection in an object format so i can interact with it
 * A query is essentially a query im making against the MongoDB database
 */
