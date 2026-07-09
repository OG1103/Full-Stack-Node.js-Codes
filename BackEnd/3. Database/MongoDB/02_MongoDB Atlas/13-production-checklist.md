# 13 — MongoDB Atlas: Production Checklist & Best Practices

## Pre-Launch Production Checklist

### Security
- [ ] IP Whitelist has only app server IP(s) — no `0.0.0.0/0`
- [ ] Dedicated DB user created for the app (not `atlasAdmin`)
- [ ] DB user has minimum required permissions (readWrite on specific DB only)
- [ ] Admin DB user is never referenced in application code
- [ ] Connection string stored in environment variables, not source code
- [ ] `.env` and secret files added to `.gitignore`
- [ ] No credentials visible in git history (`git log --all -S "mongodb+srv"`)
- [ ] VPC Peering or Private Endpoint configured (M10+)
- [ ] MFA enabled on all Atlas accounts

### Reliability
- [ ] Continuous Cloud Backup enabled
- [ ] Backup retention set to at least 7 days daily + 4 weeks weekly
- [ ] Backup restore tested at least once end-to-end
- [ ] Alerts configured: CPU, connections, disk, replication lag
- [ ] Alert notifications go to a team channel (not just one person)
- [ ] Atlas status page bookmarked: https://status.mongodb.com

### Performance
- [ ] Indexes created for all query fields (`email`, `userId`, sort fields)
- [ ] Unique indexes on fields that must be unique
- [ ] TTL indexes on time-expiring data (sessions, tokens, logs)
- [ ] Performance Advisor reviewed and suggestions applied
- [ ] Connection pooling implemented correctly in app code
- [ ] `retryWrites=true&w=majority` in connection string
- [ ] Projections used in queries (fetch only needed fields)
- [ ] Pagination implemented — no unbounded `.find()` queries

### Access Control
- [ ] Junior developers do not have production project access
- [ ] Production DB user credentials known only to necessary people
- [ ] Offboarding procedure documented (what to do when someone leaves)

### Monitoring
- [ ] Real-Time Performance Panel tested
- [ ] Billing alert set
- [ ] Incident response plan exists (who to contact, what to do)

---

## Best Practices Reference

### 1. Never use admin credentials in your app
```javascript
// ❌ Admin user in app code
MONGODB_URI=mongodb+srv://admin:adminpass@cluster.mongodb.net/mydb

// ✅ Dedicated app user with minimum permissions
MONGODB_URI=mongodb+srv://myapp-prod:apppass@cluster.mongodb.net/mydb
```

---

### 2. Always use environment variables for credentials
```javascript
// ❌ Hardcoded
mongoose.connect('mongodb+srv://user:pass@cluster.mongodb.net/db');

// ✅ From environment
mongoose.connect(process.env.MONGODB_URI);
```

---

### 3. Separate databases, not just collections, per environment
```
// ❌ All envs in same database — easy to confuse
myapp.users  (prod data)
myapp.users  (dev data — wait, which one am I connected to?)

// ✅ Separate databases, always clear which env
myapp_production.users
myapp_development.users
myapp_staging.users
```

---

### 4. Add indexes before traffic arrives
Don't wait for slow queries to appear in production.
For every collection, index:
- Fields used in `find()` / `where` conditions
- Fields used in `sort()`
- Fields that must be unique (email, username)
- Fields used in `$lookup` / joins

---

### 5. Always test your backup restore procedure
```
Monthly backup test:
1. Restore to temporary cluster
2. Verify document counts match production
3. Verify recent records are present
4. Delete temporary cluster
5. Log the test result and date
```

---

### 6. Rotate credentials when team members leave
When a developer or admin leaves the company:
1. Immediately change all DB user passwords they knew
2. Update connection strings on all servers
3. Revoke their Atlas account access
4. Revoke any VPN access used for DB whitelist
5. Rotate any API keys they had access to

---

### 7. Use meaningful, unambiguous names
```
// ❌ Ambiguous
Cluster: Cluster0
Database: test
Collection: data

// ✅ Clear
Cluster: myapp-prod
Database: myapp_production
Collection: user_accounts
```

---

### 8. Never run schema migrations directly on production
```
Correct migration workflow:
1. Write migration script
2. Test on dev cluster with production-scale data sample
3. Test on staging cluster
4. Take a backup snapshot of production before running
5. Run on production during low-traffic window
6. Monitor immediately after — watch error rates and slow queries
7. Have rollback plan ready (restore from pre-migration snapshot)
```

---

### 9. Keep cluster and app in the same region
Running Atlas in AWS `us-east-1` and your app servers in AWS `eu-west-1`?
Every query crosses the Atlantic. Put them in the same region.

---

### 10. Use connection pooling in every environment
```javascript
// Initialize once at startup, reuse for all requests
const client = new MongoClient(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
});
await client.connect();

// All request handlers reuse this client — never create a new one per request
```

---

## Useful Links

| Resource | URL |
|---------|-----|
| Atlas Dashboard | https://cloud.mongodb.com |
| Atlas Status | https://status.mongodb.com |
| Atlas Documentation | https://www.mongodb.com/docs/atlas |
| MongoDB Manual | https://www.mongodb.com/docs/manual |
| Connection String Reference | https://www.mongodb.com/docs/manual/reference/connection-string |
| Index Reference | https://www.mongodb.com/docs/manual/indexes |
| Aggregation Reference | https://www.mongodb.com/docs/manual/aggregation |
| mongosh (CLI) | https://www.mongodb.com/docs/mongodb-shell |
| MongoDB Database Tools | https://www.mongodb.com/try/download/database-tools |
| IP Check | https://checkip.amazonaws.com |
