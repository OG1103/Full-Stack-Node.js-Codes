
# Working with Documents in MongoDB

## Shell Commands/Methods: Insert Documents in a Collection (`insertOne()`, `insertMany()`)

- **`db.<collection_name>.insertOne(document in JSON format)`**:  
  Inserts only one document.

- **`db.<collection_name>.insertMany(array of documents)`**:  
  Inserts many documents. We pass an array of documents, aka array of JSON objects.  
  **Example**:  
  ```javascript
  db.customer.insertMany([{},{},{}])
  ```

- **`db.<collection_name>.insert()`**:  
  If we pass one document, it acts as `insertOne()`. If we pass an array of documents, it acts as `insertMany()`.

---

## Shell Commands/Methods: Fetch Documents from a Collection (`find()`, `findOne()`)

### To Include All Fields in the Returned Object(s):

- **`db.<collection_name>.find()`**:  
  Returns an array of **ALL THE DOCUMENTS** inside the specified collection.

- **`db.<collection_name>.findOne()`**:  
  Returns **THE FIRST DOCUMENT** from the specified collection.

### Applying Filter:

- **Filter**:  
  This is passed as an argument in JSON format (essentially an object). It specifies the criteria that documents must meet to be returned.  
  - If multiple key-value pairs are passed in the filter object, they are **ANDed**.  
  - If no document matches the filter, `find()`/`findOne()` returns `null`.

**Examples**:  
```javascript
db.customer.find({ name: "omar" })  // Returns all documents where name is "omar"
db.customer.findOne({ name: "omar" })  // Returns the first document where name is "omar"
db.customer.findOne({ name: "omar", age: 21 })  // Returns the first document where name is "omar" and age is 21
```

---

### To Include Only Specific Fields in the Returned Object(s):

- **`db.<collection_name>.find/findOne(filter, fields)`**:  
  `fields` is an object specifying which fields to include/exclude using boolean values (`true` for inclusion, `false` for exclusion).

#### Two Approaches to Field Projections:

1. **Excluding Specific Fields**:  
   You can specify which fields to exclude by setting their values to `false` in the projection object.  
   **Example**:  
   ```javascript
   db.customers.findOne({ name: "omar" }, { _id: false, email: false })
   ```  
   This query returns the first document where `name` is "omar", excluding `_id` and `email` fields.

2. **Including Specific Fields**:  
   You can specify which fields to include by setting their values to `true` in the projection object.  
   **Example**:  
   ```javascript
   db.customers.findOne({ name: "omar" }, { name: true, age: true, _id: false })
   ```  
   This will return the first document where `name` is "omar", but only the `name` and `age` fields will be included, and `_id` will be excluded.

#### Applying Field Projections Without Filters:

- If you want to include/exclude fields without applying any filters (i.e., you want to retrieve all documents), you can pass an empty filter `{}` as the first argument.  
  **Example**:  
  ```javascript
  db.customers.find({}, { _id: false, email: false })
  ```  
  This will return all documents from the `customers` collection, but the `_id` and `email` fields will be excluded from each document.

---

## Shell Commands/Methods: Updating Documents in a Collection (`updateOne()`, `updateMany()`)

- **`updateOne({ filterValues }, { $set: {} })`**:  
  Updates a single document that matches the given filter. If multiple documents match the filter, it updates the **first document** it encounters.  
  **Example**:  
  ```javascript
  db.customer.updateOne({ name: "omar" }, { $set: { age: 22, city: "abudhabi" } })
  ```  
  This updates the first document in the `customer` collection where `name` is "omar", setting the `age` to 22 and the `city` to "abudhabi" (creating these fields if they don't exist).

- **`updateMany({ filterValues }, { $set: {} })`**:  
  Updates **all documents** that match the given filter.  
  **Example**:  
  ```javascript
  db.customer.updateMany({ name: "omar" }, { $set: { age: 22, city: "abudhabi" } })
  ```  
  This updates all documents in the `customer` collection where `name` is "omar", setting the `age` to 22 and the `city` to "abudhabi" (creating these fields in the matched documents if they don't exist).

---

## Shell Commands/Methods: `save()`

- The `save()` method is used to update an existing document or insert a new document depending on its document parameter.

---

## Shell Commands/Methods: Deleting Documents from a Collection (`deleteOne()`, `deleteMany()`)

- **`db.<collection_name>.deleteOne({})`**:  
  Deletes the **first document** in the collection.

- **`db.<collection_name>.deleteOne(filter)`**:  
  Deletes the **first document** it encounters that matches the filter object.

- **`db.<collection_name>.deleteMany(filter)`**:  
  Deletes **all documents** it encounters that match the filter object.

- **`db.<collection_name>.deleteMany({})`**:  
  Deletes **all documents** in the collection.

---

## Notes

- Whenever we insert a document in a collection, if we don't explicitly specify the `_id` field, MongoDB automatically adds it with a unique value (`_id: ObjectId("....")`).
