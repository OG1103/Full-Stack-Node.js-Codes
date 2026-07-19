## Unbounded Results & Large Payloads

### What is it

An endpoint that can return an unbounded number of rows has no ceiling on its cost — one client with a large dataset (or one bot hitting the endpoint in a loop) can force a query that reads and transfers millions of documents. This shows up as database CPU spikes, bandwidth (egress) spend, and — if the process buffers the whole response in memory before sending — server memory spikes that can trigger autoscaling (more instances = more $) or crashes.

| Waste source                                                                             | What it costs you                                                            |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| No `limit` on a list endpoint                                                            | DB scans/returns unbounded rows; response size unbounded                     |
| `skip()`-based pagination on large offsets                                               | MongoDB still walks past all skipped documents — cost grows with page number |
| Uncompressed JSON responses                                                              | More bytes transferred = more egress billed, slower for the client           |
| Returning arrays nested inside arrays (e.g. every order with every line item every time) | Payload size balloons even when the client only needs a summary              |

### Example

```js
// ❌ EXPENSIVE — no cap, no compression, whole table can come back
app.get("/orders", async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }); // could be 500,000 rows
  res.json(orders);
});
```

### Solution

**Fix 1 — Always cap list endpoints with pagination:**

```js
// ✅ CHEAPER — bounded query, bounded response, every time
app.get("/orders", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100); // hard cap at 100
  const page = parseInt(req.query.page) || 1;

  const orders = await Order.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  res.json({ data: orders, page, limit });
});
```

**Fix 2 — Prefer cursor-based pagination for large or deep collections:**

```js
// ✅ CHEAPER at scale — no skip(), so cost stays flat regardless of page depth
app.get("/orders", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const cursor = req.query.cursor; // last-seen _id from the previous page

  const query = { userId: req.user.id, ...(cursor && { _id: { $lt: cursor } }) };
  const orders = await Order.find(query).sort({ _id: -1 }).limit(limit).lean();

  res.json({ data: orders, nextCursor: orders.at(-1)?._id ?? null });
});
```

**Fix 3 — Enable gzip/brotli compression on responses:**

```js
// ✅ CHEAPER egress — compresses JSON responses before they leave the server
import compression from "compression";
app.use(compression());
```

**Fix 4 — Return summaries by default, details on demand:**

```js
// ✅ list endpoint returns a summary shape, not full nested detail
app.get("/orders", async (req, res) => {
  const orders = await Order.find({ userId: req.user.id })
    .select("total status createdAt itemCount") // not the full items[] array
    .limit(20)
    .lean();
  res.json(orders);
});
// A separate GET /orders/:id returns full line-item detail only when actually needed
```

### When to use each solution

| Solution                               | When to use it                                                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Offset pagination (`skip`/`limit`)** | Small-to-medium collections, admin UIs with page numbers. Cap `limit` server-side regardless of what the client requests.       |
| **Cursor pagination**                  | Large collections, infinite scroll, or any endpoint where users page deep (offset cost grows with depth; cursor cost does not). |
| **Compression middleware**             | Always on for JSON APIs — cheap CPU cost, real bandwidth savings, essentially no downside.                                      |
| **Summary vs. detail endpoints**       | Any resource with a heavy nested substructure (line items, comments, attachments) that isn't needed in list views.              |
