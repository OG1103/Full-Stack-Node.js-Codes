# Working With MongoDB

## Establishing a Connection

### Connection String Format
- `mongodb://<username>:<password>@<host>:<port>/<database>?<options>`
- **For MongoDB Atlas (cloud-hosted MongoDB service):**
  - `mongodb+srv://<username>:<password>@<cluster-url>/<database>?<options>`

### Example for Local MongoDB
- `mongodb://localhost:27017/myDatabase`
  - `localhost:27017`: Refers to the MongoDB instance running locally on port 27017.
  - `myDatabase`: This is the database you want to connect to. If it doesn't exist, MongoDB will create it the first time you insert data.

### Example for MongoDB Atlas
- `mongodb+srv://user123:password@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority`
  - `myDatabase`: This is the database name you want to connect to. Replace `myDatabase` with the name of the database you intend to use.

## Shell
- **Shell**: A client used to connect to a database server.
- **Commands**:
  - `cls`: Clears the shell terminal.

## Notes
- When working with MongoDB in Node.js using the native MongoDB driver or libraries like Mongoose:
  - Once you've connected to the database and have a reference to the collection, you don't need to prefix with `db.` anymore. You can directly invoke methods on the collection object.
