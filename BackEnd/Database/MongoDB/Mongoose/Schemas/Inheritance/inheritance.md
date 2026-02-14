# Mongoose Inheritance — Discriminators

---

## What Problem Does Inheritance Solve?

Imagine you're building an app with multiple user types — `Student`, `Teacher`, `Admin`. They all share common fields like `username`, `email`, `password`, but each has unique fields too.

You have three options:

**Option 1: One big schema with everything**
```js
const userSchema = new Schema({
  username: String,
  email: String,
  // student fields
  university: String,
  major: String,
  gpa: Number,
  // teacher fields
  department: String,
  courses: [String],
  // admin fields
  permissions: [String],
  accessLevel: Number
})
```
Problem: Every document carries fields that don't belong to it. A teacher document has `gpa` and `major` sitting there as `null`. Messy, wasteful, hard to validate properly.

**Option 2: Separate collections per type**
```js
const Student = mongoose.model("Student", studentSchema)
const Teacher = mongoose.model("Teacher", teacherSchema)
const Admin   = mongoose.model("Admin", adminSchema)
```
Problem: Can't query all users at once. Auth middleware has to know which collection to check. References from other models (posts, comments) need to know which collection to point to. Painful.

**Option 3: Discriminators**
One collection. Shared base fields. Type-specific fields per model. Query all users or just one type. This is what discriminators give you.

---

## How Discriminators Work Internally

Mongoose adds a special field to every document called the **discriminator key**. This field stores the type name as a string and is how MongoDB knows which type each document is.

```js
// you choose the key name
const userSchema = new Schema({...}, { discriminatorKey: "role" })
//                                                         ^^^
//                             MongoDB stores this field on every document
```

When you create a `Student`, MongoDB stores `role: "Student"` automatically. When you query via the `Student` model, Mongoose automatically adds `{ role: "Student" }` to your query filter behind the scenes. You never have to think about it.

Documents in MongoDB look like:
```js
{ role: "Student", username: "john", university: "Cairo University", ... }
{ role: "Teacher", username: "dr.smith", department: "Engineering", ... }
{ role: "Admin",   username: "superuser", permissions: ["delete", "ban"], ... }
```

All in the **same collection**. Discriminator key is what separates them.

---

## Basic Setup

### Step 1 — Define the Base Schema

The base schema holds everything shared across all types. Keep it to truly common fields.

```js
import mongoose, { Schema } from "mongoose"

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar:   { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  {
    discriminatorKey: "role",   // the field that stores the type
    timestamps: true,           // createdAt + updatedAt on all types
  }
)

export const User = mongoose.model("User", userSchema)
```

### Step 2 — Define Child Schemas

Each child only defines the fields unique to that type. Base fields are inherited automatically.

```js
export const Student = User.discriminator(
  "Student",  // must match what gets stored in the discriminatorKey field
  new Schema({
    university: { type: String, required: true },
    major:      { type: String, required: true },
    gpa:        { type: Number, min: 0, max: 4 },
    enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
  })
)

export const Teacher = User.discriminator(
  "Teacher",
  new Schema({
    department:  { type: String, required: true },
    courses:     [{ type: Schema.Types.ObjectId, ref: "Course" }],
    officeHours: String,
    title:       { type: String, enum: ["Dr", "Prof", "Mr", "Ms"] }
  })
)

export const Admin = User.discriminator(
  "Admin",
  new Schema({
    permissions: [{ type: String, enum: ["ban", "delete", "edit", "promote"] }],
    accessLevel: { type: Number, default: 1, min: 1, max: 5 }
  })
)
```

---

## Creating Documents

The `role` field is set automatically — you never set it manually.

```js
// create a student
const student = await Student.create({
  username: "john_doe",
  email: "john@example.com",
  password: hashedPassword,
  university: "Cairo University",
  major: "Computer Science",
  gpa: 3.8
})
// stored as: { role: "Student", username: "john_doe", university: "Cairo University", ... }

// create a teacher
const teacher = await Teacher.create({
  username: "dr_smith",
  email: "smith@example.com",
  password: hashedPassword,
  department: "Engineering",
  title: "Dr"
})
// stored as: { role: "Teacher", username: "dr_smith", department: "Engineering", ... }
```

---

## Querying

This is where discriminators really shine.

```js
// query a specific type — Mongoose auto adds { role: "Student" } to the filter
const students = await Student.find({ university: "Cairo University" })
const teachers = await Teacher.find({ department: "Engineering" })

// query ALL users regardless of type — use the base model
const everyone = await User.find({})

// query all active users of any type
const activeUsers = await User.find({ isActive: true })

// find one user by email without knowing their type
const user = await User.findOne({ email: "john@example.com" })
// returns the full document including type-specific fields
```

When you query via the base `User` model, Mongoose returns instances of the correct child model automatically. So `user instanceof Student` works correctly even when queried through `User`.

---

## Shared Logic — Methods, Statics, Hooks

Anything defined on the base schema is inherited by all child models. This is where discriminators save you the most code.

### Instance Methods (shared across all types)

```js
// defined once on the base, available on Student, Teacher, Admin
userSchema.methods.toPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    avatar: this.avatar,
    role: this.role
  }
}

userSchema.methods.comparePassword = async function(plainText) {
  return bcrypt.compare(plainText, this.password)
}

// works on any type
const student = await Student.findById(id)
student.toPublicProfile()   // ✅
student.comparePassword("123") // ✅

const teacher = await Teacher.findById(id)
teacher.toPublicProfile()   // ✅
```

### Static Methods (shared across all types)

```js
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

userSchema.statics.findActive = function() {
  return this.find({ isActive: true })
}

// available on all models
await User.findByEmail("john@example.com")    // searches all types
await Student.findByEmail("john@example.com") // searches only students
await Teacher.findActive()                    // only active teachers
```

Note that when called on a child model, `this` refers to that child model — so `Student.findActive()` automatically filters by `role: "Student"` as well.

### Hooks (middleware) — shared on base

```js
// runs before saving ANY user type
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12)
  }
  next()
})

// runs after any user is found
userSchema.post("find", function(docs) {
  console.log(`Fetched ${docs.length} users`)
})
```

---

## Type-Specific Logic

Child schemas can have their own methods, statics, and hooks that only apply to that type.

```js
const studentSchema = new Schema({
  university: String,
  gpa: Number,
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
})

// only available on Student
studentSchema.methods.isHonorsStudent = function() {
  return this.gpa >= 3.7
}

studentSchema.methods.getTranscript = async function() {
  return this.populate("enrolledCourses")
}

studentSchema.statics.findByUniversity = function(university) {
  return this.find({ university })
}

// hooks specific to students
studentSchema.pre("save", function(next) {
  if (this.gpa > 4.0) {
    return next(new Error("GPA cannot exceed 4.0"))
  }
  next()
})

export const Student = User.discriminator("Student", studentSchema)

// usage
const student = await Student.findById(id)
student.isHonorsStudent()   // ✅
student.getTranscript()     // ✅

const teacher = await Teacher.findById(id)
teacher.isHonorsStudent()   // ❌ method doesn't exist on Teacher
```

---

## Advanced: Checking and Narrowing Types

### instanceof checks

When you query through the base model, Mongoose still gives you instances of the correct child class:

```js
const user = await User.findById(id)

if (user instanceof Student) {
  console.log(user.university)  // TypeScript/JS knows it's a student
}

if (user instanceof Teacher) {
  console.log(user.department)
}
```

### Checking via discriminatorKey

```js
const user = await User.findById(id)

switch (user.role) {
  case "Student":
    // handle student logic
    break
  case "Teacher":
    // handle teacher logic
    break
  case "Admin":
    // handle admin logic
    break
}
```

### Narrowing in a list

```js
const users = await User.find({ isActive: true })

const students = users.filter(u => u instanceof Student)
const teachers = users.filter(u => u instanceof Teacher)
```

---

## Advanced: Indexes on Discriminators

Since all types share one collection, indexes are defined on the base schema and apply to all documents.

```js
// these apply to every user type
userSchema.index({ email: 1 }, { unique: true, sparse: true })
userSchema.index({ username: 1 }, { unique: true, sparse: true })
userSchema.index({ role: 1, createdAt: -1 })  // very useful — query by type + date
```

For type-specific indexes, define them on the child schema:

```js
const studentSchema = new Schema({
  university: String,
  major: String,
  gpa: Number
})

// only meaningful for students — sparse so other types don't bloat it
studentSchema.index({ university: 1 }, { sparse: true })
studentSchema.index({ gpa: -1 }, { sparse: true })

export const Student = User.discriminator("Student", studentSchema)
```

Even though these are defined on the child schema, they still live in the `users` collection. The `sparse: true` option is important here — without it, teacher and admin documents (which don't have `university`) get included in the index with null values.

---

## Advanced: Populating Discriminated References

When another model references `User`, populate automatically returns the right type with the right fields.

```js
const postSchema = new Schema({
  title:  String,
  body:   String,
  author: { type: Schema.Types.ObjectId, ref: "User" }
})

const post = await Post.findById(postId).populate("author")

// if author is a Student:
// post.author = { role: "Student", username: "john", university: "Cairo", ... }

// if author is a Teacher:
// post.author = { role: "Teacher", username: "dr.smith", department: "Engineering", ... }
```

Mongoose uses the stored `role` field to instantiate the correct model type automatically. `post.author instanceof Student` works correctly.

---

## Advanced: Embedded Document Discriminators

Discriminators aren't just for top-level models. You can use them on **arrays of subdocuments** too.

Useful when one document needs to contain a mixed array of different types — like an activity feed or an event log.

```js
const eventSchema = new Schema(
  { occurredAt: { type: Date, default: Date.now } },
  { discriminatorKey: "kind" }
)

const userActivitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  events: [eventSchema]
})

const UserActivity = mongoose.model("UserActivity", userActivitySchema)

// register discriminators on the array path
const ClickEvent = UserActivity.schema
  .path("events")
  .discriminator("ClickEvent", new Schema({ x: Number, y: Number, element: String }))

const LoginEvent = UserActivity.schema
  .path("events")
  .discriminator("LoginEvent", new Schema({ ip: String, device: String, success: Boolean }))

const PurchaseEvent = UserActivity.schema
  .path("events")
  .discriminator("PurchaseEvent", new Schema({ amount: Number, productId: Schema.Types.ObjectId }))
```

Creating a document with mixed event types:
```js
await UserActivity.create({
  userId: user._id,
  events: [
    { kind: "LoginEvent",   ip: "192.168.1.1", device: "iPhone", success: true },
    { kind: "ClickEvent",   x: 120, y: 340, element: "buy-button" },
    { kind: "PurchaseEvent", amount: 49.99, productId: product._id },
    { kind: "LoginEvent",   ip: "10.0.0.1", device: "Chrome", success: false }
  ]
})
```

Each subdocument gets its own fields validated and stored correctly — all inside a single parent document.

---

## Advanced: Single Collection vs Multiple Collections Trade-offs

Discriminators use a single collection — which is usually ideal, but has limits you should know about.

**Single collection wins when:**
- Types are queried together frequently (auth, feeds, leaderboards)
- Types share most of their fields
- You want references from other models to point to one place
- You need to sort/filter across all types by shared fields

**Single collection struggles when:**
- One type has 10x more documents than others — the collection grows huge and indexes cover a lot of irrelevant documents
- Types need very different index strategies that would conflict
- Types are truly unrelated and just happen to have a few shared fields

**A hybrid approach** — when one type dominates:
```js
// 95% of your users are Students, 5% are Admins
// put Students in their own collection, use discriminators for the rest
const Admin   = User.discriminator("Admin", adminSchema)
const Teacher = User.discriminator("Teacher", teacherSchema)
// Students get their own model entirely
const Student = mongoose.model("Student", fullStudentSchema)
```

Not a common pattern but worth knowing exists.

---

## Real World Complete Example

```js
import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"

// ─── Base ────────────────────────────────────────────────
const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    avatar:   { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { discriminatorKey: "role", timestamps: true }
)

userSchema.index({ role: 1, createdAt: -1 })

userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12)
  }
  next()
})

userSchema.methods.comparePassword = async function(plain) {
  return bcrypt.compare(plain, this.password)
}

userSchema.methods.toPublic = function() {
  return { id: this._id, username: this.username, role: this.role, avatar: this.avatar }
}

export const User = mongoose.model("User", userSchema)

// ─── Student ─────────────────────────────────────────────
const studentSchema = new Schema({
  university: { type: String, required: true },
  major:      { type: String, required: true },
  gpa:        { type: Number, min: 0, max: 4, default: 0 },
})

studentSchema.index({ university: 1, major: 1 })

studentSchema.methods.isHonors = function() {
  return this.gpa >= 3.7
}

studentSchema.statics.findByUniversity = function(university) {
  return this.find({ university })
}

export const Student = User.discriminator("Student", studentSchema)

// ─── Teacher ─────────────────────────────────────────────
const teacherSchema = new Schema({
  department:  { type: String, required: true },
  title:       { type: String, enum: ["Dr", "Prof", "Mr", "Ms"], required: true },
  courses:     [{ type: Schema.Types.ObjectId, ref: "Course" }],
})

teacherSchema.index({ department: 1 })

teacherSchema.methods.toPublic = function() {
  // override base toPublic to include title
  return { id: this._id, username: `${this.title} ${this.username}`, role: this.role }
}

export const Teacher = User.discriminator("Teacher", teacherSchema)

// ─── Admin ───────────────────────────────────────────────
export const Admin = User.discriminator("Admin", new Schema({
  permissions: [{ type: String, enum: ["ban", "delete", "edit", "promote"] }],
  accessLevel: { type: Number, default: 1, min: 1, max: 5 }
}))
```

Usage:
```js
// auth middleware — works for all types
const user = await User.findOne({ email }).select("+password")
const valid = await user.comparePassword(req.body.password)

// type-specific logic
if (user instanceof Student && user.isHonors()) {
  // grant honors access
}

// query all users for admin panel
const allUsers = await User.find({}).sort({ createdAt: -1 })

// query only students
const csStudents = await Student.findByUniversity("Cairo University")
```

---

## Quick Reference

| What | How |
|------|-----|
| Define base | `new Schema({...}, { discriminatorKey: "role" })` |
| Define child | `BaseModel.discriminator("ChildName", new Schema({...}))` |
| Create child | `Child.create({...})` — role set automatically |
| Query one type | `Child.find({})` — auto filters by role |
| Query all types | `BaseModel.find({})` — returns all |
| Shared method | Define on base schema, inherited by all |
| Override method | Redefine same method name on child schema |
| Type-specific method | Define on child schema only |
| Check type | `doc instanceof Child` or `doc.role === "ChildName"` |
| Embedded discriminators | `schema.path("arrayField").discriminator(...)` |
| Indexes | Base schema for shared, child schema for type-specific |