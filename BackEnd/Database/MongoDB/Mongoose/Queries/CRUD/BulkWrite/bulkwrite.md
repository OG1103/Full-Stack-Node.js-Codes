## ✅ What is `bulkWrite()`?

`bulkWrite()` is a Mongoose method that lets you **perform many write operations at once** in a single call.  
It’s useful when you need to:
- Insert many documents
- Update multiple records
- Delete multiple items
- Mix all the above in one go

This is **faster** and more **efficient** than calling each method separately.

---

## 🛠️ Syntax

```js
Model.bulkWrite([
  { insertOne: { document: {...} } },
  { updateOne: { filter: {...}, update: {...} } },
  { deleteOne: { filter: {...} } },
  ...
]);
````

Each operation is an object with **exactly one key** like `insertOne`, `updateOne`, etc.

---

## 📌 Example

```js
const result = await User.bulkWrite([
  {
    insertOne: {
      document: {
        name: "Alice",
        email: "alice@example.com",
        age: 25
      }
    }
  },
  {
    updateOne: {
      filter: { email: "bob@example.com" },
      update: { $set: { age: 30 } },
      upsert: true // creates if not found
    }
  },
  {
    deleteOne: {
      filter: { email: "olduser@example.com" }
    }
  }
]);
```

---

## 📤 Example Output (from `console.log(result)`)

```json
{
  "ok": 1,
  "nInserted": 1,
  "nUpserted": 1,
  "nMatched": 0,
  "nModified": 0,
  "nRemoved": 1,
  "insertedCount": 1,
  "upsertedCount": 1,
  "deletedCount": 1
}
```

---

## 🔎 Notes:

* `insertOne` adds a new document.
* `updateOne` modifies the **first match**, optionally creates it if not found (with `upsert: true`).
* `deleteOne` removes the **first match**.

---

## ⚡ Benefits

* Much faster than doing each write operation separately.
* Runs all actions in a **single round trip** to the database.
* Handles mixed operations easily.

---

## 🚨 Warning

* `bulkWrite()` is **not atomic** unless you're using it in a transaction (MongoDB 4.0+).
* Always handle errors — some operations may succeed even if others fail.

---

## ✅ Common Use Cases

* Seeding a database with multiple users or products
* Syncing batch updates
* Deleting or updating expired data

```

---

Let me know if you'd like a version of this tailored to a specific schema like `Product`, `Cart`, or `Order`.
```
