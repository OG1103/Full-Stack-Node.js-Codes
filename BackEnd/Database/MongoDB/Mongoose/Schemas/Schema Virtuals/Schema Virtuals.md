# Mongoose Schema Virtuals

Mongoose is a popular Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model your application data. One of the powerful features Mongoose offers is **virtuals**. Virtuals are document properties that you can get and set but are not persisted to MongoDB. They are essentially computed properties on documents.

The virtual field itself doesn't store any data in the database; it simply defines a relationship between two collections based on the reference field.

## Basic Syntax

To define a virtual in Mongoose, you use the `virtual` method on the schema:

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
});

// Define a virtual
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('User', userSchema);
```

In this example, `fullName` is a virtual property that concatenates `firstName` and `lastName`.

## The `.get` Method

The `.get` method is used to define a getter function for a virtual property. This function is called whenever the virtual property is accessed. The function should return the computed value.

### Example: Using `.get`

```javascript
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const user = new User({ firstName: 'John', lastName: 'Doe' });
console.log(user.fullName); // Output: "John Doe"
```

In this example, `fullName` is a virtual property that concatenates `firstName` and `lastName` whenever it is accessed.

## The `.set` Method

The `.set` method is used to define a setter function for a virtual property. This function is called whenever the virtual property is assigned a value. The function can be used to split or manipulate the value and assign it to other fields in the document.

### Example: Using `.set`

```javascript
userSchema.virtual('fullName')
  .get(function() {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function(fullName) {
    const [firstName, lastName] = fullName.split(' ');
    this.firstName = firstName;
    this.lastName = lastName;
  });

const user = new User();
user.fullName = 'John Doe'; // This will call the setter function
console.log(user.firstName); // Output: "John"
console.log(user.lastName);  // Output: "Doe"
```

In this example, the `fullName` virtual has both a getter and a setter. When you assign a value to `fullName`, the setter function splits the value and assigns it to `firstName` and `lastName`.

## Use Cases for Virtuals

### 1. Computed Properties

Virtuals are perfect for computed properties that depend on other fields in the document. For example, you might want to compute a user's full name based on their first and last names.

```javascript
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});
```

### 2. Formatting Data

You can use virtuals to format data before returning it to the client. For example, you might want to format a date or combine multiple fields into a single string.

```javascript
userSchema.virtual('formattedDate').get(function() {
  return this.dateOfBirth.toLocaleDateString('en-US');
});
```

### 3. Referencing Another Model

Virtuals can also be used to reference another model. This is useful when you want to create a relationship between two models without storing the entire document in the database.

#### Example: Referencing Another Model

Suppose you have a `Post` model and a `User` model. You can create a virtual in the `Post` schema to reference the `User` who created the post.

```javascript
const postSchema = new Schema({
  title: String,
  content: String,
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

postSchema.virtual('authorDetails', {
  ref: 'User', // The model to use
  localField: 'authorId', // Find the user where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true, // Only return one document
});

const Post = mongoose.model('Post', postSchema);
```

In this example, `authorDetails` is a virtual that references the `User` model. When you query for a post, you can populate the `authorDetails` virtual to get the user's details.

```javascript
Post.findOne({ title: 'My First Post' })
  .populate('authorDetails')
  .exec((err, post) => {
    if (err) return handleError(err);
    console.log(post.authorDetails); // Output: { firstName: 'John', lastName: 'Doe' }
  });
```

### 4. Combining Fields for Display

You can use virtuals to combine multiple fields for display purposes. For example, you might want to display a user's full address by combining `street`, `city`, `state`, and `zipCode`.

```javascript
userSchema.virtual('fullAddress').get(function() {
  return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}`;
});
```

### 5. Conditional Logic

Virtuals can also include conditional logic to return different values based on the document's state.

```javascript
userSchema.virtual('isAdult').get(function() {
  return this.age >= 18;
});
```

In this example, `isAdult` is a virtual property that returns `true` if the user's age is 18 or older.

## Conclusion

Mongoose virtuals are a powerful feature that allows you to define computed properties on your documents. They are not stored in the database but can be used to format, combine, or reference data in your application. The `.get` method is used to define a getter function for the virtual property, which is called whenever the virtual is accessed. The `.set` method is used to define a setter function, which is called whenever the virtual is assigned a value.

By using virtuals, you can keep your data model clean and efficient while still providing useful computed properties for your application. Whether you need to format data, reference another model, or combine fields, virtuals offer a flexible solution to meet your needs.