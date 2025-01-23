
# Understanding `.method` and `.static` in Mongoose

Mongoose provides two powerful ways to add custom functionality to your schemas: **instance methods** (`.method`) and **static methods** (`.static`). These allow you to define reusable logic for working with documents or collections in a model.

---

## **1. What is `.method` in Mongoose?**

The `.method` function allows you to define **instance methods** for a Mongoose schema. Instance methods operate on a single document and can access and manipulate the document's data.

### **When to Use `.method`?**
Use `.method` when you need to define behavior or functionality that acts on a single document (e.g., formatting data, calculating a property, or performing a database update for that document).

### **Syntax**
```javascript
schema.methods.methodName = function(args) {
    // Logic here
};
```

### **Example: Instance Method**
```javascript
const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});

// Define an instance method
userSchema.methods.getGreeting = function() {
    return `Hello, my name is ${this.name}!`;
};

const User = mongoose.model('User', userSchema);

// Usage
(async () => {
    const user = new User({ name: 'Alice', age: 25 });
    console.log(user.getGreeting()); // Output: "Hello, my name is Alice!"
})();
```

---

## **2. What is `.static` in Mongoose?**

The `.static` function allows you to define **static methods** for a schema. Static methods operate on the **entire model** (the collection) rather than an individual document.

### **When to Use `.static`?**
Use `.static` when you need to define behavior that works on the model as a whole, such as custom queries, aggregation pipelines, or bulk operations.

### **Syntax**
```javascript
schema.statics.methodName = function(args) {
    // Logic here
};
```

### **Example: Static Method**
```javascript
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    role: String
});

// Define a static method
userSchema.statics.findByRole = function(role) {
    return this.find({ role });
};

const User = mongoose.model('User', userSchema);

// Usage
(async () => {
    await User.create([{ name: 'Alice', role: 'admin' }, { name: 'Bob', role: 'user' }]);
    const admins = await User.findByRole('admin');
    console.log(admins); // Output: List of users with the role 'admin'
})();
```

---

## **3. Difference Between `.method` and `.static`**

| **Feature**         | **`.method` (Instance Methods)**                        | **`.static` (Static Methods)**                 |
|----------------------|---------------------------------------------------------|-----------------------------------------------|
| **Operates On**      | Single document (an instance of the model).             | Entire model (the collection).                |
| **Use Case**         | When you need to manipulate or access data in a single document. | When you need to query or manipulate data across the collection. |
| **Access Context**   | `this` refers to the current document.                  | `this` refers to the model itself.            |
| **Example**          | `user.getGreeting()`                                    | `User.findByRole('admin')`                    |

---

## **4. Using Aggregation Pipelines with `.method` and `.static`**

### **Using Aggregation in Static Methods**
Static methods are ideal for defining reusable aggregation pipelines for complex data analysis or processing.

#### Example: Aggregating Users by Role
```javascript
const userSchema = new mongoose.Schema({
    name: String,
    role: String
});

// Static method using aggregation
userSchema.statics.countByRole = function() {
    return this.aggregate([
        { $group: { _id: "$role", total: { $sum: 1 } } },
        { $sort: { total: -1 } }
    ]);
};

const User = mongoose.model('User', userSchema);

// Usage
(async () => {
    await User.create([
        { name: 'Alice', role: 'admin' },
        { name: 'Bob', role: 'user' },
        { name: 'Charlie', role: 'admin' }
    ]);
    const result = await User.countByRole();
    console.log(result); 
    // Output:
    // [
    //     { _id: "admin", total: 2 },
    //     { _id: "user", total: 1 }
    // ]
})();
```

### **Using Aggregation in Instance Methods**
Instance methods are less commonly used for aggregation but can be helpful when the aggregation depends on the document's data.

#### Example: Finding Related Users Based on Role
```javascript
const userSchema = new mongoose.Schema({
    name: String,
    role: String
});

// Instance method using aggregation
userSchema.methods.findPeers = function() {
    return this.model('User').aggregate([
        { $match: { role: this.role, _id: { $ne: this._id } } }, // Exclude the current user
        { $project: { name: 1, _id: 0 } }
    ]);
};

const User = mongoose.model('User', userSchema);

// Usage
(async () => {
    const [alice, bob, charlie] = await User.create([
        { name: 'Alice', role: 'admin' },
        { name: 'Bob', role: 'admin' },
        { name: 'Charlie', role: 'user' }
    ]);
    const peers = await alice.findPeers();
    console.log(peers);
    // Output:
    // [{ name: "Bob" }]
})();
```

---

## **5. Justifications for Usage**

- **Use `.method`**:
  - When logic depends on a single document's data (e.g., formatting, validation, or related queries).
  - Example: `findPeers` uses the document's role to find similar users.
  
- **Use `.static`**:
  - When logic applies to the entire collection (e.g., aggregating or custom queries).
  - Example: `countByRole` operates on the whole `User` collection.

---

## **Conclusion**
Mongoose's `.method` and `.static` provide powerful ways to extend your models with reusable, meaningful logic. Use instance methods for document-specific functionality and static methods for collection-wide operations, including aggregation pipelines.

Let me know if you need further clarification or examples!

