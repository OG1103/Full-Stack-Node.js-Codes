
import User from "../Schemas&validation/Basic_Schemas.js";

async function run(){
  const user = new User({
    name: "omar",
    age: 21,
  });

  await user.save();

  
}

/**Abstract Explanation of Creating/Inserting a Document in Mongoose:
 * 1. Create an Instance of the Model:
 *      - To create a new document in MongoDB using Mongoose, you first need to create an instance of your model.
 *      - This model instance represents a single document in the MongoDB collection. You provide the fields and their values according to the schema defined for that model.
 *      - Example: const user = new User({ name: "omar", age: 21 });
 * 2. Set Field Values:
 *      - The fields that you pass when creating the model instance are validated against the schema you defined for that model.
 *      - Each field should match the expected data type and any validation rules (e.g., required fields or default values).
 *      - Example: In { name: "omar", age: 21 }, the values are set for the name and age fields, which should match the schema definition
 * 3. Save the Document to the Database:
 *      - Once the model instance is created with the necessary field values, you need to save it to MongoDB.
 *      - The save() method is called on the instance, which triggers Mongoose to send the document to the MongoDB collection.
 *      - Example: await user.save();
 *      - This step inserts the document into the MongoDB collection associated with the model (in this case, the users collection).
 * 4. MongoDB Inserts the Document:
 *      - If the insert operation is successful, MongoDB generates an _id for the document (if not provided) and stores it in the collection.
 * 5. Return or Handle the Result:
 *      - After the save() method is executed, Mongoose returns the saved document, including the auto-generated fields like _id and createdAt (if timestamps are enabled).
 */

/**Another way is to use the create function model.create(object):
 * const user = await User.create({name:"omar",age:21});
 * In this case i dont need the line await user.save(); or creating an instance of the model. 
 * The create function returns the same thing as the save()
 */