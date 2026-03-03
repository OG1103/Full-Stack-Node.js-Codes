# MongoDB Indexing with Mongoose Discriminators
## Best Practices & Comprehensive Guide

---

## Table of Contents
1. [What is a Discriminator?](#what-is-a-discriminator)
2. [How the Discriminator Key Works](#how-the-discriminator-key-works)
3. [Why Indexing with Discriminators is Different](#why-indexing-with-discriminators-is-different)
4. [The Golden Rule](#the-golden-rule)
5. [Where to Define Indexes](#where-to-define-indexes)
6. [Index Examples by Use Case](#index-examples-by-use-case)
7. [Common Mistakes](#common-mistakes)
8. [Full Real-World Example](#full-real-world-example)
9. [Quick Reference Cheat Sheet](#quick-reference-cheat-sheet)

---

## What is a Discriminator?

A discriminator is a Mongoose feature that allows **multiple schemas to share a single MongoDB collection**, differentiated by a special field called the discriminator key.

```javascript
// Base Schema
const jobSchema = new Schema({ title: String }, { discriminatorKey: "jobSource" });
const Job = mongoose.model("Job", jobSchema);

// Child Schemas (Discriminators)
const InternalJob = Job.discriminator("Internal", InternalJobSchema);
const ExternalJob = Job.discriminator("External", ExternalJobSchema);
```

All documents live in the **same `jobs` collection** in MongoDB:

```
jobs collection
  ├── { jobSource: "Internal", postedByCompany: ..., title: ... }
  ├── { jobSource: "External", externalUrl: ..., title: ... }
  └── { jobSource: "Internal", postedByCompany: ..., title: ... }
```

---

## How the Discriminator Key Works

### Default Key (`__t`)
If you don't specify a custom key, Mongoose uses `__t`:

```javascript
const jobSchema = new Schema({ title: String });
// Stored as: { __t: "Internal", ... }
```

### Custom Key
You can define a more readable key:

```javascript
const jobSchema = new Schema({ title: String }, { discriminatorKey: "jobSource" });
// Stored as: { jobSource: "Internal", ... }
```

### What the String You Pass Becomes
```javascript
Job.discriminator("Internal", InternalJobSchema)
//               ^^^^^^^^^^
//               becomes jobSource: "Internal" in MongoDB

Job.discriminator("External", ExternalJobSchema)
//               ^^^^^^^^^^
//               becomes jobSource: "External" in MongoDB
```

### How Mongoose Uses It Automatically
When you query a child model, Mongoose **automatically injects** the discriminator key filter:

```javascript
// What you write:
InternalJob.find({ postedByCompany: userId })

// What MongoDB actually runs:
{ jobSource: "Internal", postedByCompany: userId }
```

This is why indexes must account for the discriminator key.

---

## Why Indexing with Discriminators is Different

Since all discriminator documents live in the **same collection**, every query on a child model automatically includes a filter on the discriminator key.

### Without Discriminator Key in Index
```javascript
// Index defined:
InternalJobSchema.index({ postedByCompany: 1, createdAt: -1 })

// MongoDB query:
{ jobSource: "Internal", postedByCompany: userId }.sort({ createdAt: -1 })

// What happens:
// 1. MongoDB uses index to find postedByCompany matches (across ALL job types)
// 2. Then separately filters by jobSource: "Internal"
// → Two steps, less efficient ❌
```

### With Discriminator Key in Index
```javascript
// Index defined:
InternalJobSchema.index({ jobSource: 1, postedByCompany: 1, createdAt: -1 })

// MongoDB query:
{ jobSource: "Internal", postedByCompany: userId }.sort({ createdAt: -1 })

// What happens:
// 1. MongoDB uses index to find jobSource + postedByCompany + sort in one shot
// → One step, fully covered ✅
```

---

## The Golden Rule

> **Always put the discriminator key as the FIRST field in child schema indexes.**

```javascript
// ❌ Wrong
InternalJobSchema.index({ postedByCompany: 1, createdAt: -1 })

// ✅ Correct
InternalJobSchema.index({ jobSource: 1, postedByCompany: 1, createdAt: -1 })
```

---

## Where to Define Indexes

### Base Schema Indexes
Define on the base schema when the query runs across **all document types** or filters by `jobSource` itself:

```javascript
// Applies to ALL jobs regardless of type
jobSchema.index({ jobTitle: "text", jobDescription: "text" });
jobSchema.index({ jobType: 1, jobStatus: 1, jobApplicationDeadline: 1, createdAt: -1 });
jobSchema.index({ jobType: 1, jobLocation: 1, jobStatus: 1 });
jobSchema.index({ jobSource: 1, jobViewCount: -1 });   // sort by popularity per type
jobSchema.index({ jobSource: 1, createdAt: -1 });      // recent jobs per type
```

### Child Schema Indexes
Define on the child schema when the query uses **fields specific to that discriminator**:

```javascript
// Only makes sense for InternalJob (postedByCompany doesn't exist on External)
InternalJobSchema.index({ jobSource: 1, postedByCompany: 1, createdAt: -1 });
```

### Decision Guide

| Query | Where to Index |
|---|---|
| All jobs sorted by date | Base schema |
| All jobs filtered by type/status | Base schema |
| Internal jobs by company | Child schema (with discriminator key first) |
| External jobs by source URL | Child schema (with discriminator key first) |
| Text search across all jobs | Base schema |

---

## Index Examples by Use Case

### 1. Fetch all jobs (admin dashboard)
```javascript
// Query: Job.find().sort({ createdAt: -1 })
jobSchema.index({ createdAt: -1 });
```

### 2. Fetch all jobs of a specific type
```javascript
// Query: InternalJob.find().sort({ createdAt: -1 })
// Mongoose runs: { jobSource: "Internal" }.sort({ createdAt: -1 })
jobSchema.index({ jobSource: 1, createdAt: -1 }); // on BASE schema ✅
```

### 3. Fetch a company's posted jobs
```javascript
// Query: InternalJob.find({ postedByCompany: userId }).sort({ createdAt: -1 })
// Mongoose runs: { jobSource: "Internal", postedByCompany: userId }.sort({ createdAt: -1 })
InternalJobSchema.index({ jobSource: 1, postedByCompany: 1, createdAt: -1 }); // on CHILD schema ✅
```

### 4. Sort all internal jobs by view count
```javascript
// Query: InternalJob.find().sort({ jobViewCount: -1 })
// Mongoose runs: { jobSource: "Internal" }.sort({ jobViewCount: -1 })
jobSchema.index({ jobSource: 1, jobViewCount: -1 }); // on BASE schema ✅
```

### 5. Filter jobs by type, status, location
```javascript
// Query: Job.find({ jobType, jobStatus, jobLocation })
jobSchema.index({ jobType: 1, jobLocation: 1, jobStatus: 1 }); // on BASE schema ✅
```

### 6. Full-text search
```javascript
// Query: Job.find({ $text: { $search: "engineer" } })
jobSchema.index({ jobTitle: "text", jobDescription: "text" }); // on BASE schema ✅
```

---

## Common Mistakes

### ❌ Mistake 1: Forgetting the discriminator key in child indexes
```javascript
// Wrong — MongoDB can't fully utilize this
InternalJobSchema.index({ postedByCompany: 1, createdAt: -1 })

// Correct
InternalJobSchema.index({ jobSource: 1, postedByCompany: 1, createdAt: -1 })
```

### ❌ Mistake 2: Putting discriminator key last
```javascript
// Wrong — discriminator key must be FIRST for the index to work properly
InternalJobSchema.index({ postedByCompany: 1, jobSource: 1, createdAt: -1 })

// Correct
InternalJobSchema.index({ jobSource: 1, postedByCompany: 1, createdAt: -1 })
```

### ❌ Mistake 3: Duplicating base schema indexes on child schema
```javascript
// Already on base schema:
jobSchema.index({ jobSource: 1, createdAt: -1 })

// Don't repeat on child schema — it's redundant:
InternalJobSchema.index({ jobSource: 1, createdAt: -1 }) // ❌ unnecessary
```

### ❌ Mistake 4: Querying child model but using base model index expecting full coverage
```javascript
// Base index: { createdAt: -1 }
// Child query: InternalJob.find().sort({ createdAt: -1 })
// Mongoose runs: { jobSource: "Internal" }.sort({ createdAt: -1 })
// The base index { createdAt: -1 } doesn't include jobSource → partial coverage ❌

// Fix — add to base schema:
jobSchema.index({ jobSource: 1, createdAt: -1 }) // ✅
```

---

## Full Real-World Example

```javascript
// ─── Base Job Schema ───────────────────────────────────────────
const jobSchema = new Schema(
  {
    jobTitle:               { type: String, required: true },
    jobDescription:         { type: String, required: true },
    jobType:                { type: String, enum: jobTypeEnum },
    jobStatus:              { type: String, enum: jobStatusEnum, default: "open" },
    jobLocation:            { type: String },
    jobApplicationDeadline: { type: Date },
    jobViewCount:           { type: Number, default: 0 },
  },
  { discriminatorKey: "jobSource", timestamps: true }
);

// Base Schema Indexes — for queries across ALL job types
jobSchema.index({ jobTitle: "text", jobDescription: "text" });
jobSchema.index({ jobType: 1, jobStatus: 1, jobApplicationDeadline: 1, createdAt: -1 });
jobSchema.index({ jobType: 1, jobLocation: 1, jobStatus: 1 });
jobSchema.index({ jobSource: 1, jobViewCount: -1 });
jobSchema.index({ jobSource: 1, createdAt: -1 });

const Job = mongoose.model("Job", jobSchema);


// ─── InternalJob Discriminator ─────────────────────────────────
const InternalJobSchema = new Schema(
  {
    postedByCompany: { type: Schema.Types.ObjectId, ref: "User", required: true },
    applications:    [{ type: Schema.Types.ObjectId, ref: "Application" }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual
InternalJobSchema.virtual("applicantCount").get(function () {
  return this.applications.length;
});

// Child Schema Index — discriminator key FIRST
InternalJobSchema.index({ jobSource: 1, postedByCompany: 1, createdAt: -1 });

const InternalJob = Job.discriminator("Internal", InternalJobSchema);


// ─── ExternalJob Discriminator ─────────────────────────────────
const ExternalJobSchema = new Schema({
  externalUrl:    { type: String, required: true },
  postedByAdmin:  { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Child Schema Index — discriminator key FIRST
ExternalJobSchema.index({ jobSource: 1, postedByAdmin: 1, createdAt: -1 });

const ExternalJob = Job.discriminator("External", ExternalJobSchema);
```

---

## Quick Reference Cheat Sheet

```
┌─────────────────────────────────────────────────────────────┐
│              DISCRIMINATOR INDEXING RULES                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Query on ALL jobs?                                         │
│  → Index on BASE schema                                     │
│                                                             │
│  Query on ONE job type using type-specific fields?          │
│  → Index on CHILD schema                                    │
│  → ALWAYS put discriminatorKey FIRST                        │
│                                                             │
│  Child index structure:                                     │
│  { discriminatorKey: 1, yourField: 1, sortField: -1 }       │
│                                                             │
│  Never duplicate base schema indexes on child schema        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| Scenario | Schema | Index |
|---|---|---|
| All jobs, sort by date | Base | `{ createdAt: -1 }` |
| Jobs by source + date | Base | `{ jobSource: 1, createdAt: -1 }` |
| Jobs by source + views | Base | `{ jobSource: 1, jobViewCount: -1 }` |
| Filter by type/status | Base | `{ jobType: 1, jobStatus: 1 }` |
| Text search | Base | `{ jobTitle: "text", jobDescription: "text" }` |
| Company's internal jobs | Child | `{ jobSource: 1, postedByCompany: 1, createdAt: -1 }` |
| Admin's external jobs | Child | `{ jobSource: 1, postedByAdmin: 1, createdAt: -1 }` |