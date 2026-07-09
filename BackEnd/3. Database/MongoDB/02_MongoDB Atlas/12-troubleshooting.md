# 12 — MongoDB Atlas: Troubleshooting

## Quick Diagnostic Checklist

When something breaks, check in this order:

```
1. Is the cluster running and not paused?  →  Atlas dashboard
2. Is the cluster tier active?             →  Check cluster state
3. Is my IP whitelisted?                   →  Network Access
4. Are my DB credentials correct?          →  Database Access
5. Is the connection string correct?       →  Copy fresh from Atlas
6. Is there a network/firewall issue?      →  Try from different network
7. Is Atlas having an incident?            →  https://status.mongodb.com
```

---

## Connection Errors

### `MongoServerError: Authentication failed`
**Cause:** Wrong username or password for the database user.

**Fix:**
1. Atlas → **Database Access** → find your user → **Edit**
2. Click **Edit Password** → set a new strong password
3. Update your `.env` file / environment variable with the new password
4. Restart your app

**Also check:** Special characters in passwords must be URL-encoded in the URI.
`@` → `%40`, `#` → `%23`, `:` → `%3A`

---

### `IP address not whitelisted` / Connection silently times out
**Cause:** The connecting IP is not in Network Access.

**Fix:**
1. Go to [checkip.amazonaws.com](https://checkip.amazonaws.com) → get your current IP
2. Atlas → **Network Access** → **Add IP Address**
3. Enter `YOUR_IP/32`
4. Wait 60–90 seconds for propagation
5. Retry connection

**Common cause:** ISP reassigned your IP, you switched networks, or your EC2
instance was restarted without an Elastic IP.

---

### `MongoServerSelectionError: connection timed out`
**Cause:** Can't reach the cluster at all.

**Check in order:**
1. Is the cluster paused? (M0 pauses after 60 days of inactivity)
   - Atlas dashboard → **Resume Cluster** if paused
2. Is your IP whitelisted? (see above)
3. Are you behind a firewall blocking outbound port 27017?
   - Try: `telnet YOUR_CLUSTER_HOST 27017`
   - Or: `nc -zv YOUR_CLUSTER_HOST 27017`
4. Is the cluster hostname correct in your URI?
   - Copy a fresh URI from Atlas → Connect → Connect your application

---

### `M0 cluster is paused`
M0 (free) clusters pause automatically after **60 days of inactivity**.

**Fix:**
1. Atlas → your cluster → click **Resume**
2. Wait ~2 minutes

**Prevent it:** Make at least one read or write every 60 days.
You can set up a simple cron job that pings the DB:
```javascript
// ping.js — run daily with cron
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);
client.connect().then(() => client.db().command({ ping: 1 })).then(() => {
  console.log('DB pinged');
  client.close();
});
```

---

### `SSL handshake failed` or `TLS error`
**Cause:** Outdated MongoDB driver version.

**Fix:** Update your MongoDB driver:
```bash
# Node.js
npm install mongodb@latest
npm install mongoose@latest

# Python
pip install pymongo --upgrade
```

---

### `MongoNetworkError: connect ECONNREFUSED`
**Cause:** Your app is trying to connect to `localhost` or a wrong host.

**Fix:** Check that your `.env` is loaded correctly and the URI points to Atlas,
not `localhost:27017`.

---

## Performance Problems

### Queries are slow (>100ms)
**Diagnosis:**
```javascript
db.myCollection.find({ status: "active" }).explain("executionStats")
// Look for: "stage": "COLLSCAN"  ← bad, no index
// Look for: "totalDocsExamined" >> "totalDocsReturned"  ← bad, scanning too many docs
```

**Fix:**
1. Atlas → Performance Advisor → apply suggested indexes
2. Run `.explain("executionStats")` on the slow query
3. Create the missing index
4. If already indexed: check if the query could be rewritten

---

### High CPU usage
**Step 1:** Check if it's a query problem (not a tier problem)
1. Atlas → Cluster → **Real-Time Performance Panel**
2. Look for high-cost operations
3. Atlas → **Performance Advisor** → add missing indexes

**Step 2:** If indexes are fine, look for application patterns
- N+1 queries (making 1 query per item in a list instead of 1 query for all)
- Unbounded queries (no limit on large collections)
- Aggregation pipelines without index usage

**Step 3:** Only if above steps are done → upgrade tier

---

### Too many connections / `MongoServerError: too many connections`
**Cause:** App is creating a new connection per request instead of using a pool.

**Fix:**
```javascript
// ❌ Wrong — new connection per request
app.get('/users', async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();  // New connection every request
  // ...
});

// ✅ Correct — connect once, reuse
const client = new MongoClient(uri, { maxPoolSize: 10 });
await client.connect();  // Once at startup

app.get('/users', async (req, res) => {
  const db = client.db();  // Reuse existing connection
  // ...
});
```

---

## Data Problems

### Accidentally deleted documents
**If you have Continuous Backup (M10+):**
1. Cluster → **…** → **Restore** → **Point in Time**
2. Select timestamp just before the deletion
3. Restore to a NEW cluster (do not overwrite production)
4. Verify data, then extract and reimport only the affected documents

**If you only have snapshots:**
1. Cluster → **…** → **Restore** → **Snapshot**
2. Pick the most recent snapshot before the deletion
3. Restore to a new cluster → verify → re-import affected data

**If you have no backups (M0):**
There is no recovery. This is why backups are mandatory for production.

---

### Wrong data written to production (bad migration)
1. **Stop all writes immediately** — take the app offline or put it in read-only mode
2. Assess scope — how many documents affected?
3. If Continuous Backup: use Point-in-Time restore to a new cluster
4. Extract the correct versions of affected documents
5. Apply a corrective migration
6. Bring the app back online

---

## Billing Issues

### Unexpected high bill
1. Organization → **Billing** → **Usage Details**
2. Look for:
   - Auto-scaling scaled up and didn't scale back down
   - Data transfer (egress) charges — happens when cluster and app are in different regions
   - Backup storage growing
   - FLEX tier with unexpectedly high read/write volume

**Set a billing alert** to prevent future surprises:
Organization → **Billing** → **Alert Settings** → add threshold

---

### FLEX tier bill higher than expected
FLEX charges per read/write unit. Common causes of high usage:
- Missing indexes → MongoDB scans many documents per query → more read units charged
- Large result sets returned to app → many read units
- Frequent polling queries from app

Fix: Add indexes, use projections, reduce polling frequency.

---

## Atlas Console Issues

### Can't see a cluster (sub-user)
**Cause:** You don't have access to that project.

**Fix:** Ask an admin (Project Owner) to:
1. Project → **Access Manager** → **Invite to Project**
2. Add your email with appropriate role

### Can't edit network access / security group (sub-user)
**Cause:** Your project role doesn't include Network Access permissions.

**Fix:** You need at least **Project Data Access Admin** role, or ask the admin
to add the IP for you.

---

## Atlas Status

If nothing else explains the issue, check for Atlas incidents:
[https://status.mongodb.com](https://status.mongodb.com)

Filter by:
- Cloud provider (AWS / GCP / Azure)
- Region (e.g. AWS us-east-1)

Atlas occasionally has maintenance windows or regional incidents.
