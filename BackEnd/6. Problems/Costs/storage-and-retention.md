## Storage & Retention Costs

### What is it

Databases and object storage are usually billed by **volume stored** (and sometimes by index size, backup size, or IOPS) in addition to per-query cost. Data that nobody ever reads again — old logs, expired sessions, stale soft-deleted rows, uncompressed uploaded files — still costs money every month it sits there. This is a slow, compounding cost: it rarely causes an incident, so it's easy to ignore until the bill is large.

| Waste source                                                | What it costs you                                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Application logs kept forever at verbose level              | Log storage bills grow unbounded; also makes real signals harder to find           |
| Expired sessions/tokens never cleaned up                    | Table/collection grows forever, slowing queries and inflating storage + index cost |
| Soft-deleted rows kept indefinitely                         | Same as above — "deleted" data still billed as live storage                        |
| Uploaded files/images stored at original resolution forever | Object storage cost scales directly with bytes stored                              |
| Indexes added "just in case" on rarely-queried fields       | Every index has a storage cost and a write-cost tax on every insert/update         |

### Example

```js
// ❌ EXPENSIVE — sessions and password-reset tokens accumulate forever
const sessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  token: String,
  expiresAt: Date,
}); // nothing ever removes expired rows — table grows without bound

// ❌ EXPENSIVE — logging full request/response bodies at info level in production
app.use((req, res, next) => {
  console.log(JSON.stringify({ body: req.body, headers: req.headers })); // huge, kept forever by the log platform
  next();
});
```

### Solution

**Fix 1 — Use TTL indexes so MongoDB deletes expired documents automatically:**

```js
// ✅ CHEAPER — MongoDB removes the document once expiresAt passes, no cron needed
const sessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  token: String,
  expiresAt: { type: Date, index: { expires: 0 } }, // TTL index — 0s after expiresAt
});
```

**Fix 2 — Set log levels and retention deliberately per environment:**

```js
// ✅ CHEAPER — verbose logs only in development, structured/minimal in production
const logger = require("pino")({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
});

// Configure your log platform (e.g. CloudWatch, Datadog) with a retention policy
// (e.g. 14–30 days) instead of "keep forever" — most incidents are found within days.
```

**Fix 3 — Archive or hard-delete old soft-deleted data on a schedule:**

```js
// ✅ CHEAPER — periodic job purges soft-deletes older than the retention window
async function purgeOldSoftDeletes() {
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days
  await Order.deleteMany({ deletedAt: { $lt: cutoff } });
}
// Run via a scheduled job (cron, queue worker), not on every request
```

**Fix 4 — Downsize/compress uploaded files before storing them:**

```js
// ✅ CHEAPER — resize/compress images before writing to storage
import sharp from "sharp";

async function processUpload(buffer) {
  return sharp(buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer(); // significantly smaller than the original upload
}
```

**Fix 5 — Only index fields you actually query/sort by:**

```js
// ❌ index added defensively, never queried on — pure storage + write cost
bioSchema.index({ favoriteColor: 1 });

// ✅ index only what read patterns actually use
orderSchema.index({ userId: 1, createdAt: -1 }); // matches a real query pattern
```

### When to use each solution

| Solution                         | When to use it                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| **TTL indexes**                  | Sessions, tokens, verification codes, temporary records — anything with a natural expiry.   |
| **Log level + retention policy** | Every production service. Set intentionally rather than accepting platform defaults.        |
| **Scheduled purge/archive jobs** | Soft-deleted records, completed job records, old audit trails past their compliance window. |
| **Compress/resize on upload**    | Any endpoint accepting user-uploaded images/files.                                          |
| **Index audit**                  | Periodically (e.g. quarterly) — drop indexes with low read usage and a real write-cost tax. |
