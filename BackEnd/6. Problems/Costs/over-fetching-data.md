## Over-Fetching Data (DB → Server → Client)

### What is it

Every document you pull out of the database costs money three times over: read/compute cost on the database, CPU/memory cost on your server to process it, and network egress cost to send it over the wire (many cloud providers bill for outbound bandwidth, not inbound). Fetching more data than the endpoint actually needs multiplies all three costs for zero benefit.

This is the single highest-leverage cost fix in a typical backend — it is free (no new infra) and usually a one-line change.

| Waste source                                | What it costs you                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `find()` with no projection                 | DB reads + returns every field, including large ones (bio, description, base64 blobs) |
| Fetching full documents to check existence  | Full read cost for something a boolean would answer                                   |
| Returning entire objects to the client      | Extra bytes over the network, extra JSON serialization CPU time                       |
| Deep `.populate()` chains                   | Each populated field is effectively another full query + more payload                 |
| Fetching rows you then filter/discard in JS | DB did the read work for rows you throw away                                          |

### Example

```js
// ❌ EXPENSIVE — fetches everything, ships everything
app.get("/users", async (req, res) => {
  const users = await User.find(); // every field: password hash, address, prefs, bio...
  res.json(users); // all of it goes over the wire, for every request
});

// ❌ EXPENSIVE — fetching a full document just to check it exists
app.post("/signup", async (req, res) => {
  const existing = await User.findOne({ email: req.body.email }); // full doc read
  if (existing) return res.status(409).json({ error: "Email taken" });
  // ...
});
```

### Solution

**Fix 1 — Project only the fields the endpoint needs:**

```js
// ✅ CHEAPER — only requested fields leave the database
app.get("/users", async (req, res) => {
  const users = await User.find().select("name email").lean();
  res.json(users);
});
```

**Fix 2 — Use existence checks instead of full fetches:**

```js
// ✅ CHEAPER — no document body is read or transferred
app.post("/signup", async (req, res) => {
  const exists = await User.exists({ email: req.body.email }); // returns {_id} or null
  if (exists) return res.status(409).json({ error: "Email taken" });
  // ...
});

// Even cheaper for simple counts — countDocuments with a cap when you only need "any/none"
```

**Fix 3 — Shape the response for the client, don't forward the DB document:**

```js
// ✅ CHEAPER — strip fields the client will never render
function toPublicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

app.get("/users", async (req, res) => {
  const users = await User.find().select("name email").lean();
  res.json(users.map(toPublicUser));
});
```

**Fix 4 — Populate only what you display, not whole related documents:**

```js
// ❌ pulls the entire author document
Post.find().populate("author");

// ✅ pulls only the 2 fields actually rendered
Post.find().populate("author", "name avatarUrl");
```

### When to use each solution

| Solution                                    | When to use it                                                                                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Projection (`select`)**                   | Every read endpoint, always. Only ship fields the handler or client actually uses. There is essentially no downside.                                         |
| **`.lean()`**                               | Every read-only query where you won't call `.save()`, instance methods, or need live getters. Skips document hydration — saves server CPU/RAM (not egress).  |
| **`updateOne` / `deleteOne`**               | Any write where the handler never reads the resulting document. Returns only metadata (`matchedCount`, `modifiedCount`) — the doc never leaves MongoDB.      |
| **`findOneAndUpdate` + `select`**           | Writes where you _do_ need the doc back atomically (e.g. new balance after `$inc`). Use `{ new: true, select: "..." }` to return only the fields you'll use. |
| **`.exists()` / `countDocuments`**          | Any time the result is used as a boolean or a number, not the document itself. Prefer `.exists()` for booleans; add `.limit(1)` if using count as existence. |
| **`matchedCount` as 404 check**             | When an existence check merely precedes a write — skip the separate `exists()` query and read `matchedCount === 0` from the write result (one round-trip).   |
| **`.limit()` / pagination**                 | Every list endpoint. Unbounded `find()` scales cost with collection size — cap it before it caps you.                                                        |
| **Response shaping (DTOs)**                 | Any endpoint whose response is consumed by a client you control — never leak internal-only fields (password hashes, internal flags, cost-relevant metadata). |
| **Minimal write responses (`204`, `{id}`)** | Updates/deletes → `sendStatus(204)`; creates → `{ id }` instead of echoing the document. Cuts server→client egress to near zero.                             |
| **Selective `.populate()`**                 | Any relation you render partially (e.g. author name, not the author's entire profile).                                                                       |
