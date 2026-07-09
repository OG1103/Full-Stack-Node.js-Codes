# 07 — MongoDB Atlas: Backups & Point-in-Time Restore

## Backup Types

| Type | How it works | Available on | Restore capability |
|------|-------------|-------------|-------------------|
| **No backup** | No backups taken | M0 | None |
| **Basic Backup** | Periodic snapshots | FLEX | Restore to a snapshot |
| **Cloud Backup** | Scheduled snapshots to cloud storage | M10+ | Restore to a snapshot |
| **Continuous Cloud Backup** | Continuous oplog tailing | M10+ | Restore to any point in time (to the second) |

---

## How to Enable Backups

1. Go to your cluster → **…** → **Edit Configuration**
2. Scroll to **Additional Settings**
3. Toggle on **Cloud Backup**
4. For production, also enable **Continuous Cloud Backup**
5. Click **Apply**

---

## Backup Schedule (M10+)

Default snapshot schedule (configurable):

| Frequency | Default retention |
|-----------|-----------------|
| Hourly | 2 days |
| Daily | 7 days |
| Weekly | 4 weeks |
| Monthly | 12 months |

### To customize retention:
Cluster → **…** → **Edit Backup Policy**

### Recommended production backup policy:
```
Hourly snapshots    → keep for 3 days
Daily snapshots     → keep for 14 days
Weekly snapshots    → keep for 4 weeks
Monthly snapshots   → keep for 12 months
```

---

## Continuous Cloud Backup

Continuous backup works by tailing the **oplog** (operation log) — a rolling record
of every write operation. This allows you to restore to any exact point in time,
not just snapshot intervals.

**Why it matters:**
- If you run a bad migration at 14:32, you can restore to 14:31:59
- If data corruption is discovered days later, you can restore to before it happened
- Mandatory for any production app with real user data

**Minimum oplog window:**
Atlas guarantees a minimum oplog window (default: 24 hours). As long as you restore
within this window, point-in-time restore is available.

---

## Restoring from a Backup

### Restore to a snapshot
1. Cluster → **…** → **Restore**
2. Select **Snapshot** → choose a snapshot from the list
3. Choose restore destination:
   - **Same cluster** (overwrites existing data)
   - **New cluster** (safe — creates a new cluster with the restored data)
4. Confirm → Atlas begins the restore

### Point-in-time restore
1. Cluster → **…** → **Restore**
2. Select **Point in Time**
3. Enter the exact timestamp you want to restore to
4. Choose restore destination (always start with a new cluster)
5. Confirm

### ⚠️ Always restore to a NEW cluster first
Restoring to the same cluster **permanently overwrites your current data**.
The safe workflow:

```
1. Restore to a new temporary cluster
2. Inspect the data — confirm it looks correct
3. If correct: either
   a. Switch your app's connection string to the restored cluster, OR
   b. Export specific documents and reimport to the main cluster
4. Delete the temporary cluster when done
```

---

## Manual Backup with mongodump

For extra safety, migrating data, or working with M0 clusters (which have no
built-in backups):

### Install MongoDB Database Tools
```bash
# macOS
brew install mongodb-database-tools

# Ubuntu / Debian
sudo apt-get install -y mongodb-database-tools

# Or download from: https://www.mongodb.com/try/download/database-tools
```

### Dump (export) all databases
```bash
mongodump \
  --uri="mongodb+srv://user:pass@cluster.mongodb.net" \
  --out=./backup-$(date +%Y%m%d)
```

### Dump a specific database
```bash
mongodump \
  --uri="mongodb+srv://user:pass@cluster.mongodb.net/myapp_production" \
  --out=./backup
```

### Restore
```bash
mongorestore \
  --uri="mongodb+srv://user:pass@target-cluster.mongodb.net" \
  ./backup
```

### Restore a specific database
```bash
mongorestore \
  --uri="mongodb+srv://user:pass@target-cluster.mongodb.net/myapp_production" \
  --nsInclude="myapp_production.*" \
  ./backup
```

---

## Automate Manual Backups (Cron Job on Server)

```bash
#!/bin/bash
# /scripts/backup-mongo.sh

DATE=$(date +%Y%m%d-%H%M)
BACKUP_DIR="/backups/mongodb/$DATE"
URI="mongodb+srv://backup-user:pass@cluster.mongodb.net/myapp"

mongodump --uri="$URI" --out="$BACKUP_DIR"

# Compress
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

# Optional: upload to S3
aws s3 cp "$BACKUP_DIR.tar.gz" s3://my-backups/mongodb/

echo "Backup complete: $BACKUP_DIR.tar.gz"
```

```bash
# Add to crontab (run daily at 2am)
0 2 * * * /scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1
```

---

## Testing Your Backups

A backup you have never tested is not a real backup.

### Monthly backup test procedure:
1. Trigger a restore to a new cluster (or run mongorestore to a local MongoDB)
2. Connect to the restored cluster
3. Spot-check critical collections:
   ```javascript
   db.users.countDocuments()     // Does count match production?
   db.users.findOne()            // Do documents look correct?
   db.orders.find().sort({createdAt: -1}).limit(5)  // Recent records present?
   ```
4. Verify no data corruption
5. Delete the temporary cluster

---

## Backup Checklist

- [ ] Cloud Backup enabled on production cluster
- [ ] Continuous Cloud Backup enabled on production
- [ ] Backup retention policy set (at least 7 days daily)
- [ ] Backup restore tested at least once
- [ ] Manual mongodump used for M0/dev clusters (no built-in backup)
- [ ] Backup files stored in at least one additional location (e.g. S3)
- [ ] Recovery procedure documented and accessible to the team
