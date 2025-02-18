# Understanding `pre` Mongoose Hook Methods

## Introduction
Mongoose provides various methods that can be used within hooks (middleware) to track changes, retrieve updates, and control document behavior. These methods are useful for **optimizing performance**, **preventing unnecessary computations**, and **ensuring data integrity**.

---

## **1. `this.isModified(fieldName)`**
The `this.isModified(fieldName)` method checks if a specified field has been modified since the last database read or initialization.

### **How it works:**
- If a field’s value has changed, it returns `true`.
- If the field is unchanged, it returns `false`.
- If called without arguments, it checks if **any** field has changed.

### **Syntax:**
```javascript
this.isModified('fieldName');
this.isModified(); // Checks if any field has been modified
```

### **Common Use Cases:**
- **Prevent unnecessary password hashing**.
- **Track critical field updates**.
- **Optimize performance by avoiding redundant operations**.

---

## **2. `this.isNew`**
The `this.isNew` property is `true` if the document has been newly created and has not been saved to the database yet.

### **How it works:**
- Before the first save, `this.isNew === true`.
- After saving, `this.isNew === false`.

### **Example:**
```javascript
userSchema.pre('save', function(next) {
    if (this.isNew) {
        console.log('New user is being created');
    }
    next();
});
```

---

## **3. `this.modifiedPaths()`**
Returns an array of field names that have been modified in the document.

### **How it works:**
- It lists all the fields that have changed since the document was retrieved or created.

### **Example:**
```javascript
userSchema.pre('save', function(next) {
    console.log('Modified fields:', this.modifiedPaths());
    next();
});
```

---

## **4. `this.get(path)`**
Retrieves the current value of a specific field before saving.

### **How it works:**
- It accesses the field value stored in the document instance.

### **Example:**
```javascript
userSchema.pre('save', function(next) {
    console.log('Current username:', this.get('username'));
    next();
});
```

---

## **5. `this.set(path, value)`**
Manually sets a new value for a field before saving.

### **How it works:**
- This allows overriding a field value dynamically before saving.

### **Example:**
```javascript
userSchema.pre('save', function(next) {
    this.set('lastUpdated', new Date());
    next();
});
```

---

## **6. `this.getUpdate()`** (Query Middleware Only)
Retrieves the update object in `pre('findOneAndUpdate')`, `pre('updateOne')`, and `pre('updateMany')` hooks.

### **How it works:**
- It retrieves the update object passed to an update query.

### **Example:**
```javascript
userSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    console.log('Update object:', update);
    next();
});
```

---

## **7. `this.populate(path)`**
Allows fields to be populated before saving.

### **How it works:**
- Populates referenced fields before saving a document.

### **Example:**
```javascript
userSchema.pre('save', async function(next) {
    await this.populate('profile').execPopulate();
    next();
});
```

---

## **8. `this.validate()`**
Manually triggers schema validation before saving a document.

### **How it works:**
- Calls Mongoose’s built-in validation to ensure all fields conform to schema rules.

### **Example:**
```javascript
userSchema.pre('save', async function(next) {
    try {
        await this.validate();
        next();
    } catch (error) {
        next(error);
    }
});
```

---

## **9. `this.invalidate(field, errorMsg)`**
Manually marks a field as invalid and prevents saving.

### **How it works:**
- Stops the document from being saved if a specific field is invalid.

### **Example:**
```javascript
userSchema.pre('save', function(next) {
    if (!this.username) {
        this.invalidate('username', 'Username is required');
    }
    next();
});
```

---

## **10. `this.markModified(path)`**
Forces Mongoose to mark a field as modified, ensuring it gets saved.

### **How it works:**
- Normally, Mongoose only saves fields that have changed.
- If a field contains an object or array that was mutated, `markModified` tells Mongoose to consider it modified.

### **Example:**
```javascript
userSchema.pre('save', function(next) {
    this.markModified('settings');
    next();
});
```

---

## **Best Practices for Using Mongoose Hook Methods**
1. **Use `this.isModified()` wisely** to avoid unnecessary computations.
2. **For queries, use `this.getUpdate()`** instead of `this.isModified()`.
3. **Always call `next()`** to prevent hanging operations.
4. **Use `this.invalidate()` for custom validation** instead of throwing errors.
5. **Call `this.populate()` before saving** if related documents need to be included.

---

## **Conclusion**
Mongoose provides a variety of hook methods that allow fine-grained control over document and query behavior. By mastering these methods, you can optimize database interactions, improve performance, and ensure data integrity. 🚀

