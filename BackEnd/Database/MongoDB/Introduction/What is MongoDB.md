
# What is MongoDB?

- MongoDB is a **document-oriented database** solution, which is used for high-volume data storage.
- It is fast and efficient.
- MongoDB uses **collections** and **documents** to store data, in comparison to traditional tables and rows.
- It is a **non-relational**, **NoSQL** database solution.

---

## Relational vs Non-Relational Database

### Relational Database

- A relational database is a collection of tables, and one table might be related to another table in some way.
- These tables store data in the format of **rows** and **columns**.
- Each row represents a data entry in the table, which can have one or more columns.
- The data in a relational database is **normalized**, and each table has a predefined schema (we reference different tables using IDs or primary keys).

**Advantages**:
- Less or no redundant data.

**Disadvantages**:
- To fetch proper data, you might need to join multiple tables, which is performance-intensive.

### Non-Relational Database

- Non-relational databases do not have tables and rows. Instead, they use **collections** and **documents**.
- A **collection** is equivalent to a table, and a **document** is equivalent to a row.
- A collection is a group of one or more documents, and a database can have multiple collections.
- A document can have fields, which are similar to columns in a relational database.
- Non-relational databases are **schema-less**.

---

## What is a Document in a Collection?

- A document stores data in the format of a **JSON object** (JavaScript Object Notation).
- A document consists of **key-value pairs**, where the value can be any data type, including a nested JSON object or another document.
- Values can be strings, numbers, booleans, arrays of documents/objects, arrays of strings/numbers, etc.

**Example**:
If we store some customer's data in MongoDB, it will be stored in the format of a JSON object.

**Document Format**:
```json
{
  "field1": "value1",
  "field2": "value2",
  "field3": "value3"
}
```

- A collection has one or more documents, so essentially a **collection is a collection of JSON objects** (documents).
- Since MongoDB is **schema-less**, it can have any type and number of fields.  
  **Note**: Not all documents in a collection have to have the same fields—some fields might be missing.
- MongoDB doesn’t require a strict schema, so documents in a collection can have different structures.

**Example of a Collection**:
```json
{
  "field1": "value1",
  "field2": "value2",
  "field3": "value3"
}
{
  "field1": "value1",
  "field2": "value2"
}
```

- In the above example, the second document does not have `field3`. This is normal since MongoDB is **schema-less**—not all documents need to have the same structure.
- Since you can store documents with different structures in the same collection, your database can grow with your application according to its needs.
- With MongoDB, you can get started with a basic structure and add more complex data later.
- The ability to store **nested documents** in MongoDB allows for creating complex relationships between data and storing them in the same document. This makes working with such data and fetching it more efficient since it reduces the need for complex joins.
- MongoDB uses **JSON** for performing **CRUD operations**.
