# 08 — MongoDB Atlas: Monitoring & Alerts

## Built-in Monitoring

Access via: Cluster → **View Monitoring**

Atlas provides real-time and historical metrics for your cluster with no setup required.

---

## Key Metrics to Watch

| Metric | What it measures | Warning threshold |
|--------|-----------------|------------------|
| **Connections** | Active connections to the cluster | > 80% of max |
| **CPU Usage** | Server CPU load | > 75% sustained |
| **Memory Usage** | RAM consumed by MongoDB | > 80% |
| **Disk IOPS** | Read/write operations per second | Sustained at max |
| **Disk Space Used** | Storage consumed | > 75% |
| **Query Targeting Ratio** | Documents scanned vs returned | > 1000 (bad indexes) |
| **Opcounters** | Reads/writes per second | Unexpected spikes |
| **Replication Lag** | Delay between primary and secondary | > 60 seconds |
| **Network In/Out** | Data transferred to/from cluster | Unexpected spikes |
| **Cache Activity** | WiredTiger cache hit/miss ratio | High miss ratio |

---

## Setting Up Alerts

### How to create an alert
1. Project → **Alerts** (left sidebar)
2. Click **Add Alert**
3. Choose the metric and condition
4. Set notification channels (email, Slack, PagerDuty, etc.)
5. Click **Save**

### Recommended production alerts

**High CPU:**
```
Metric:    Host CPU Usage %
Condition: Is greater than 75
Duration:  For at least 5 minutes
Notify:    Email → team@company.com
```

**Too many connections:**
```
Metric:    Connections % of configured limit
Condition: Is greater than 80
Duration:  For at least 2 minutes
Notify:    Email → team@company.com
```

**Low disk space:**
```
Metric:    Disk Space % Used
Condition: Is greater than 75
Duration:  Immediately
Notify:    Email → team@company.com
```

**Slow query detected:**
```
Metric:    Query Targeting: Scanned Objects per Returned
Condition: Is greater than 1000
Duration:  For at least 5 minutes
Notify:    Email → team@company.com
```

**Replication lag:**
```
Metric:    Replication Headroom
Condition: Is less than 1 hour
Duration:  Immediately
Notify:    Email → team@company.com
```

**Cluster down / unreachable:**
```
Metric:    Is Primary?
Condition: False
Duration:  For at least 2 minutes
Notify:    Email + SMS → on-call engineer
```

### Notification channels
Atlas supports:
- Email
- SMS
- Slack
- PagerDuty
- Datadog
- Opsgenie
- VictorOps
- Webhook (custom endpoint)

---

## Performance Advisor

The Performance Advisor analyzes your query patterns and recommends missing indexes.
It is one of the most valuable Atlas features — use it regularly.

### How to access
Cluster → **Performance Advisor** (left sidebar under the cluster)

### What it shows
- Slow queries (taking > 100ms by default)
- Suggested indexes to speed up those queries
- Expected improvement per index

### How to apply a suggested index
1. Review the suggestion
2. Click **Create Index**
3. Atlas builds the index in the background without blocking reads or writes

### Check frequency
- **Weekly** during active development
- **After every major feature release** (new queries may be missing indexes)
- **Immediately** when users report slowness

---

## Query Profiler

Shows detailed information about slow queries executed against your cluster.

### How to access
Cluster → **Performance Advisor** → **Query Profiler** tab

### What it shows
- Query shape (the structure of the query, not the data)
- Execution time
- Documents examined vs documents returned
- Index used (or "COLLSCAN" if no index)

### What to look for
```
Documents Examined: 50,000
Documents Returned: 1

→ This is a full collection scan. You need an index.
   Without it, MongoDB reads 50,000 documents to return 1.
```

```
Execution Time: 850ms

→ Anything over 100ms in production deserves investigation.
```

---

## Real-Time Performance Panel

Shows live operations as they happen — useful for debugging active performance issues.

### How to access
Cluster → **…** → **Real-Time Performance Panel**

### What it shows
- Operations currently executing
- Slowest queries in the last few seconds
- Active connections
- Read/write throughput

### When to use it
- "The app is slow right now" — see what queries are running
- After a deployment — watch for unexpected query patterns
- Load testing — see how the cluster responds

---

## Atlas Logs

Download raw MongoDB logs for deep debugging.

### How to access
Cluster → **…** → **Download Logs**

### Log types
- `mongod.log` — primary MongoDB process log
- Audit logs (M10+ enterprise feature) — logs all access and operations

### What to look for in logs
```
# Connection failures
connection accepted from 203.0.113.5:12345 #1234

# Slow query warnings (logged when > slowms threshold)
command mydb.users command: find ... keysExamined:0 docsExamined:45231 ... 842ms

# Authentication failures  
Authentication failed ... MONGODB-SCRAM ... user "wronguser"
```

---

## Third-Party Monitoring Integrations

For teams using external monitoring stacks:

| Integration | Setup location |
|------------|---------------|
| **Datadog** | Project → Integrations → Datadog |
| **New Relic** | Project → Integrations → New Relic |
| **PagerDuty** | Alert → Notification → PagerDuty |
| **Prometheus** | Available via Atlas Data Federation or custom exporter |
| **Grafana** | Connect to Prometheus exporter |

---

## Monitoring Checklist

- [ ] Alerts configured for CPU, connections, disk, replication lag
- [ ] Notification sent to a team channel (not just one person)
- [ ] Performance Advisor reviewed after every major feature release
- [ ] Billing alert set (Organization → Billing → Billing Alerts)
- [ ] Real-Time Performance Panel used during load tests
