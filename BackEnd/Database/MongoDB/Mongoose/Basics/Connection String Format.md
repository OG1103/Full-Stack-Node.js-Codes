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

