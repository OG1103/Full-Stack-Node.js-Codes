## Connections, Batching & Compute Costs

### What is it

Beyond query shape and storage, cost also comes from **how the server uses connections and compute resources**. Opening a new database connection per request, calling a paid external API one item at a time, or running background work inefficiently all burn resources (and often direct per-call billing) that don't scale with the actual amount of work being done.

| Waste source                                                                        | What it costs you                                                                                                           |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Opening a new DB connection per request instead of pooling                          | Connection setup overhead per request; can exhaust the DB's max-connections limit, forcing a bigger (pricier) DB tier       |
| Calling a billed external API (email, SMS, payment lookup) once per item in a loop  | N billed calls instead of 1 batched call                                                                                    |
| Background/cron jobs polling on a tight interval "to be safe"                       | Compute time billed even when there is nothing to do                                                                        |
| Synchronous work blocking the request for something that could run async            | Ties up a server process/thread — under load this forces horizontal scaling (more instances = more $) sooner than necessary |
| Running heavy jobs (reports, exports) inline in the request path instead of a queue | Spiky, unpredictable load forces over-provisioning to handle worst-case bursts                                              |

### Example

```js
// ❌ EXPENSIVE — new connection per request instead of a shared pool
app.get("/data", async (req, res) => {
  const client = await MongoClient.connect(uri); // new connection every request
  const data = await client.db().collection("items").find().toArray();
  res.json(data);
  await client.close();
});

// ❌ EXPENSIVE — one billed email API call per recipient, in a loop
for (const user of subscribers) {
  await emailApi.send({ to: user.email, subject: "Newsletter" }); // N billed calls
}
```

### Solution

**Fix 1 — Connect once, reuse the pool for the life of the process:**

```js
// ✅ CHEAPER — one pooled connection shared across all requests
import mongoose from "mongoose";
await mongoose.connect(uri, { maxPoolSize: 10 }); // set once at startup

app.get("/data", async (req, res) => {
  const data = await Item.find().lean(); // reuses the existing pool
  res.json(data);
});
```

**Fix 2 — Batch calls to billed external APIs instead of looping per item:**

```js
// ✅ CHEAPER — 1 billed call instead of N
await emailApi.sendBulk({
  to: subscribers.map((u) => u.email),
  subject: "Newsletter",
});
```

**Fix 3 — Move slow/heavy work off the request path into a queue:**

```js
// ✅ CHEAPER — request returns immediately; a worker processes the report
// using steady, predictable capacity instead of forcing scale-up on spikes
app.post("/reports", async (req, res) => {
  const job = await reportQueue.add("generate-report", { userId: req.user.id });
  res.status(202).json({ jobId: job.id }); // client polls or gets a webhook later
});
```

**Fix 4 — Size background job intervals to actual need, not "just in case":**

```js
// ❌ checks every 5 seconds even though the data changes once an hour
cron.schedule("*/5 * * * * *", checkForUpdates);

// ✅ matches the actual rate of change — 12x fewer executions billed
cron.schedule("0 * * * *", checkForUpdates); // hourly
```

### When to use each solution

| Solution                       | When to use it                                                                                                        |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Connection pooling**         | Always — configure once at startup, never open a connection per request.                                              |
| **Batched external API calls** | Any provider that offers a bulk/batch endpoint (email, SMS, push notifications, bulk lookups).                        |
| **Queues for heavy/slow work** | Reports, exports, image/video processing, anything that takes seconds and isn't needed synchronously in the response. |
| **Right-sized job intervals**  | Any polling/cron job — match the interval to how often the underlying data actually changes.                          |
