# Working with Databases and Collections in MongoDB

## Shell Commands/Methods: Initializing Database

- **`show dbs`**:  
  Shows all the databases in the server you are connected to. Only shows the databases that have at least one collection containing at least one document.

- **`db`**:  
  Displays the current selected database.

- **`use <database_name>`**:  
  Allows you to select or use the provided database name. If the specified database doesn't exist, MongoDB creates it and makes it active.  
  **Note**: By default, a `test` database is selected.

- **`db.dropDatabase()`**:  
  Drops the currently selected database.

## Shell Commands/Methods: Working With Collections

- **`db.<collection_name>`**:  
  Creates a collection in the selected database.

- **`db.createCollection(collection_name, { options })`**:  
  Another way to create a collection, with additional options.  
  **Options (key-value pairs):**
  1. **`capped: true`**: Sets a fixed size (must be specified) so that once the collection reaches that size, it overwrites the oldest entries with the new ones.
  2. **`size: N`**: `N` specifies the maximum size in bytes for a capped collection.
  3. **`autoIndexId: true`**: Automatically creates an index on the `_id` field.
  4. **`max: N`**: `N` specifies the maximum number of documents.

- **`show collections`**:  
  Displays all the collections in the selected database.

- **`db.<collection_name>.insertOne({ fields: values })`**:  
  Inserts a single document into the specified collection in the selected database.  
  - If the collection doesn't exist, MongoDB creates it automatically.
  - A document is passed in JSON format as the argument.

- **`db.<collection_name>.find()`**:  
  Returns an array of all the documents inside the specified collection in the selected database.

- **`db.<collection_name>.drop()`**:  
  Drops the specified collection in the selected database.
