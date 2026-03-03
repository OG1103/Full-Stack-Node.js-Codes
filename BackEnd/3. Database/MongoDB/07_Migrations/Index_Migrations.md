# MongoDB Index Migrations with Mongoose

## The Core Concept

Your Mongoose schema definition and MongoDB's actual indexes are **two completely separate things**.

- **Schema** → just metadata, a description of what indexes you want
- **MongoDB** → the ground truth, what indexes actually exist
- **`syncIndexes()`** → the bridge that makes MongoDB match your schema

---

## The Key Setting: `autoIndex: false`

### What autoIndex does by default (true)

With `autoIndex: true` (Mongoose default), every time your server starts, Mongoose calls `createIndex()` for every index in all your schemas automatically. This means:

- A server restart can trigger index builds on your live production database
- You have **zero control** over when this happens
- On large collections this causes CPU/memory spikes and slow startup while users are active
- If you changed an index in your schema, it drops the old and builds the new **right during startup**

### Disable it globally in production

```javascript
// app.js - before mongoose.connect()
import mongoose from "mongoose";

mongoose.set("autoIndex", false); // nothing touches indexes on restart

await mongoose.connect(process.env.MONGO_URI);
```

With `autoIndex: false`:

- Server restarts are instant, nothing index-related ever runs automatically
- You are fully in control of when indexes are created, changed, or dropped
- You run migrations **at a time you choose** — low traffic, before deployment, whenever

---

## The Key Tool: syncIndexes()

`syncIndexes()` is called on a Mongoose model and does everything automatically:

| Scenario                              | What syncIndexes() does |
| ------------------------------------- | ----------------------- |
| Index in schema, not in MongoDB       | Creates it              |
| Index in MongoDB, removed from schema | Drops it                |
| Index changed in schema               | Drops old, creates new  |
| Index unchanged                       | No-op, skips it         |

It reads your schema definitions and makes MongoDB match exactly — add, remove, or change indexes in your schema and `syncIndexes()` handles all of it.

---

## Initial Setup Flow

### Step 1: Disable autoIndex globally

```javascript
// app.js
import mongoose from "mongoose";

mongoose.set("autoIndex", false);
await mongoose.connect(process.env.MONGO_URI);
```

### Step 2: Define indexes in your schemas as normal

```javascript
// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String },
  age: Number,
  city: String,
});

userSchema.index({ age: 1, city: 1 }); // compound index

export default mongoose.model("User", userSchema);
```

### Step 3: Create your sync script (run this once initially and whenever indexes change)

```javascript
// migrations/sync-indexes.js
import "dotenv/config";
import mongoose from "mongoose";

// import ALL your models so their schemas are registered
import "../models/User.js";
import "../models/Post.js";
import "../models/Order.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  for (const modelName of mongoose.modelNames()) {
    const model = mongoose.model(modelName);
    console.log(`Syncing indexes for ${modelName}...`);
    await model.syncIndexes();
    console.log(`Done`);
  }

  await mongoose.disconnect();
};

run().catch(console.error);
```

### Step 4: Run it locally against your production database

```bash
MONGO_URI=mongodb+srv://your-prod-uri node migrations/sync-indexes.js
```

You don't need to SSH into your server — just point the script at your production connection string from your local machine. Then deploy and restart:

```bash
pm2 restart app
```

---

## Deployment Workflow

Every deployment follows this order:

```
1. Make schema index changes (add, remove, modify)
2. Run sync-indexes.js locally against prod DB  ← indexes updated in MongoDB
3. Push code & pm2 restart                      ← instant startup, indexes already ready
```

If you didn't change any indexes in this deployment, skip step 2 and just `pm2 restart` as normal.

You can even combine them:

```bash
node migrations/sync-indexes.js && pm2 restart app
```

---

## Edge Cases

### Adding a new index

Add it to your schema, run sync. Done.

```javascript
userSchema.index({ username: 1 }); // added
```

```bash
node migrations/sync-indexes.js
```

### Removing an index

Remove it from your schema, run sync. `syncIndexes()` drops it from MongoDB automatically.

```javascript
// removed userSchema.index({ age: 1, city: 1 })
```

```bash
node migrations/sync-indexes.js
```

### Changing an index

Update the schema definition, run sync. Old index dropped, new one created.

```javascript
// before
userSchema.index({ age: 1 });

// after
userSchema.index({ age: 1, city: 1 });
```

```bash
node migrations/sync-indexes.js
```

### Adding a brand new model/collection

Create the model, import it in `sync-indexes.js`, run it. New collection = instant index build (no existing documents to scan).

### Zero-downtime index replacement (millions of documents)

The one edge case where `syncIndexes()` isn't enough. On a massive collection, dropping and rebuilding an index creates a brief window with no index coverage. For critical indexes on large collections, use a manual script instead:

```javascript
// migrations/2024-01-15-replace-age-index.js
import "dotenv/config";
import mongoose from "mongoose";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;

  // Step 1: create NEW index first — old one still alive and covering queries
  await db.collection("users").createIndex({ age: 1, city: 1 }, { name: "age_city_1" });

  // Step 2: only drop old after new is fully built
  await db.collection("users").dropIndex("age_1");

  await mongoose.disconnect();
};

run().catch(console.error);
```

Then update your schema to match and don't run sync since MongoDB already reflects what you want.

### Forgetting to run sync before restart

Queries that rely on a new index will still work but do full collection scans instead — they won't error, just be slow. Fix it by running sync immediately. This is why the habit of always running sync before restart matters.

---

## Checking What Indexes Actually Exist

Before running any migration, always verify the real state in MongoDB:

```javascript
const indexes = await db.collection("users").indexes();
console.log(JSON.stringify(indexes, null, 2));
```

Or in the MongoDB shell:

```
db.users.getIndexes()
```

---

## Summary

|                       | autoIndex: true (default)   | autoIndex: false            |
| --------------------- | --------------------------- | --------------------------- |
| Index created         | Every restart automatically | Only when you run sync      |
| Startup time          | Slower (on index changes)   | Always instant              |
| Risk on schema change | Surprise rebuild on restart | You control when it happens |
| Good for              | Development                 | Production                  |

**The bottom line:** Define indexes in your schemas as normal, set `autoIndex: false`, and run `sync-indexes.js` locally against prod whenever you make index changes before deploying. That's your entire index management strategy.
