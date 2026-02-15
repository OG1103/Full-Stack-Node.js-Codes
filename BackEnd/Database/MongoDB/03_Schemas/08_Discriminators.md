# Mongoose — Discriminators (Schema Inheritance)

Discriminators allow you to store **different types of documents** in the same collection while giving each type its own schema and methods. It's Mongoose's implementation of single-collection inheritance.

---

## 1. The Problem

Imagine you have `Student`, `Teacher`, and `Staff` — all are `Person` with shared fields (`name`, `email`, `age`) but each has unique fields:

**Without discriminators:**
- 3 separate collections with duplicated shared fields
- No unified queries across all people

**With discriminators:**
- 1 `people` collection
- Shared fields defined once in a base schema
- Each type adds its own fields
- Query all people together OR filter by type

---

## 2. How Discriminators Work

```
Base Model: Person (collection: 'people')
├── Discriminator: Student (adds 'university', 'major', 'gpa')
├── Discriminator: Teacher (adds 'subject', 'yearsExperience')
└── Discriminator: Staff   (adds 'department', 'role')

All stored in the same 'people' collection with a '__t' field indicating the type.
```

Each document gets a `__t` field (discriminator key):

```javascript
// Student document:
{ _id: ..., name: 'John', email: '...', __t: 'Student', university: 'MIT', gpa: 3.8 }

// Teacher document:
{ _id: ..., name: 'Jane', email: '...', __t: 'Teacher', subject: 'Math', yearsExperience: 10 }
```

---

## 3. Defining Discriminators

### Step 1: Base Schema and Model

```javascript
const personSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 0 },
    phone: String,
  },
  {
    timestamps: true,
    discriminatorKey: '__t',  // Default — can customize
  }
);

// Base model instance methods (shared by all types)
personSchema.methods.getProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    type: this.__t,
  };
};

const Person = mongoose.model('Person', personSchema);
```

### Step 2: Child Schemas (Discriminators)

```javascript
// Student discriminator
const studentSchema = new mongoose.Schema({
  university: { type: String, required: true },
  major: { type: String, required: true },
  gpa: { type: Number, min: 0, max: 4.0 },
  graduationYear: Number,
  courses: [String],
});

// Student-specific methods
studentSchema.methods.isHonors = function () {
  return this.gpa >= 3.5;
};

// Student-specific indexes
studentSchema.index({ university: 1, major: 1 });

const Student = Person.discriminator('Student', studentSchema);


// Teacher discriminator
const teacherSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  yearsExperience: { type: Number, default: 0 },
  certifications: [String],
  salary: Number,
});

teacherSchema.methods.isSenior = function () {
  return this.yearsExperience >= 10;
};

const Teacher = Person.discriminator('Teacher', teacherSchema);


// Staff discriminator
const staffSchema = new mongoose.Schema({
  department: { type: String, required: true },
  role: { type: String, enum: ['admin', 'maintenance', 'security'] },
  shift: { type: String, enum: ['morning', 'afternoon', 'night'] },
});

const Staff = Person.discriminator('Staff', staffSchema);
```

---

## 4. CRUD with Discriminators

### Creating Documents

```javascript
// Create via the child model — __t is set automatically
const student = await Student.create({
  name: 'Alice',
  email: 'alice@university.edu',
  age: 21,
  university: 'MIT',
  major: 'Computer Science',
  gpa: 3.9,
});
// { _id: ..., name: 'Alice', __t: 'Student', university: 'MIT', ... }

const teacher = await Teacher.create({
  name: 'Dr. Smith',
  email: 'smith@school.edu',
  age: 45,
  subject: 'Mathematics',
  yearsExperience: 20,
});
// { _id: ..., name: 'Dr. Smith', __t: 'Teacher', subject: 'Mathematics', ... }
```

### Querying

```javascript
// Query ALL people (regardless of type)
const everyone = await Person.find();
// Returns Students, Teachers, and Staff — all types

// Query only students
const students = await Student.find();
// Automatically filters by __t: 'Student'

// Query only teachers
const teachers = await Teacher.find();

// Query base model with type filter
const allStudents = await Person.find({ __t: 'Student' });
// Same result as Student.find()

// Shared query across types
const youngPeople = await Person.find({ age: { $lt: 25 } });
// Returns all types where age < 25
```

### Using Type-Specific Methods

```javascript
const student = await Student.findOne({ email: 'alice@university.edu' });
student.isHonors();     // true (Student method)
student.getProfile();   // Works (inherited from Person)

const teacher = await Teacher.findOne({ email: 'smith@school.edu' });
teacher.isSenior();     // true (Teacher method)
teacher.getProfile();   // Works (inherited from Person)

// student.isSenior()   // Error — isSenior is not on Student
```

### Updating

```javascript
// Update through child model
await Student.findByIdAndUpdate(studentId, { gpa: 4.0 }, { runValidators: true });

// Update through base model
await Person.findByIdAndUpdate(personId, { phone: '555-1234' });
```

### Deleting

```javascript
await Student.findByIdAndDelete(studentId);
// Or
await Person.findByIdAndDelete(anyPersonId);
```

---

## 5. Custom Discriminator Key

Change the field name used to identify the type:

```javascript
const personSchema = new mongoose.Schema(
  { name: String },
  { discriminatorKey: 'type' }   // Use 'type' instead of '__t'
);

// Documents will have:
// { _id: ..., name: 'Alice', type: 'Student', university: 'MIT' }
```

---

## 6. Embedded Discriminators

Discriminators can also be used inside **arrays** of subdocuments:

```javascript
const eventSchema = new mongoose.Schema({
  name: String,
  activities: [{
    type: { type: String, required: true },
    startTime: Date,
    endTime: Date,
  }],
});

// Different activity types within the array
const workshopSchema = new mongoose.Schema({
  topic: String,
  instructor: String,
  maxParticipants: Number,
});

const talkSchema = new mongoose.Schema({
  speaker: String,
  title: String,
  duration: Number,
});

// Add discriminators to the array path
eventSchema.path('activities').discriminator('Workshop', workshopSchema);
eventSchema.path('activities').discriminator('Talk', talkSchema);

const Event = mongoose.model('Event', eventSchema);

// Usage:
const conference = await Event.create({
  name: 'Tech Conference 2024',
  activities: [
    { type: 'Workshop', topic: 'React', instructor: 'John', startTime: new Date() },
    { type: 'Talk', speaker: 'Jane', title: 'The Future of AI', duration: 45 },
  ],
});
```

---

## 7. Hooks with Discriminators

Hooks defined on the **base schema** run for all types. Hooks on **child schemas** run only for that type:

```javascript
// Runs for ALL person types
personSchema.pre('save', function (next) {
  console.log(`Saving ${this.__t || 'Person'}: ${this.name}`);
  next();
});

// Runs ONLY for Students
studentSchema.pre('save', function (next) {
  if (this.isModified('gpa') && this.gpa >= 3.5) {
    console.log(`${this.name} made the honor roll!`);
  }
  next();
});
```

---

## 8. Practical Example: E-Commerce Products

```javascript
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: String,
    brand: String,
    inStock: { type: Boolean, default: true },
  },
  { discriminatorKey: 'productType', timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

// Electronics
const electronicsSchema = new mongoose.Schema({
  warranty: { type: Number, default: 12 },  // months
  specs: {
    cpu: String,
    ram: String,
    storage: String,
  },
});
const Electronics = Product.discriminator('Electronics', electronicsSchema);

// Clothing
const clothingSchema = new mongoose.Schema({
  size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  color: String,
  material: String,
});
const Clothing = Product.discriminator('Clothing', clothingSchema);

// Books
const bookSchema = new mongoose.Schema({
  author: String,
  isbn: { type: String, unique: true },
  pages: Number,
  genre: String,
});
const Book = Product.discriminator('Book', bookSchema);

// Query all products
const allProducts = await Product.find({ price: { $lt: 50 } });

// Query only electronics
const electronics = await Electronics.find({ 'specs.ram': '16GB' });
```

---

## 9. Summary

| Concept | Description |
|---------|-------------|
| Base Model | Shared fields and methods for all types |
| Discriminator | Child model with additional fields |
| `discriminatorKey` | Field that identifies the type (default: `__t`) |
| `Person.find()` | Returns all types |
| `Student.find()` | Returns only students |
| Embedded discriminators | Different types within subdocument arrays |

### Key Points

1. All discriminated documents live in the **same collection**
2. The `discriminatorKey` (`__t` by default) identifies the document type
3. **Child models** inherit all fields, methods, hooks, and indexes from the base
4. Query the **base model** for cross-type queries, **child model** for type-specific queries
5. Child-specific hooks only run for that type; base hooks run for all
6. Use embedded discriminators for **polymorphic arrays** (different types in one array)
