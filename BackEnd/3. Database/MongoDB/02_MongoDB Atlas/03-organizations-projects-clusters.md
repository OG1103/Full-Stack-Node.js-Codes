# 03 — MongoDB Atlas: Organizations, Projects & Clusters

## The Three-Level Hierarchy

```
Organization  ← company / team level
└── Project   ← environment or product level
    └── Cluster ← the actual database server
```

Understanding this hierarchy is critical because **access control, billing, and
network settings are all scoped to a specific level.**

---

## Organizations

### What it is
The top-level container. Everything in Atlas belongs to an organization.

### What lives here
- Billing (you pay at the org level)
- Organization-level members and their roles
- API keys
- All your projects

### Best practice
- Create **one organization per company**
- Use your company email for the owner account
- Keep the owner account separate from personal developer accounts

### How to create an organization
1. Log into [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click your org name (top-left) → **Create New Organization**
3. Enter the org name
4. Click **Next** → **Create Organization**

---

## Projects

### What it is
A logical grouping inside the org. Each project has its own:
- Clusters
- Database users
- IP whitelist (Network Access)
- Alerts and monitoring
- Team member access

### Key rule: access is scoped to the project
A developer invited to `myapp-dev` **cannot see** `myapp-production` at all.
This is why you use separate projects for different environments.

### Recommended project structure

**Option A — By environment (most common for startups)**
```
Organization: My Company
├── myapp-production
└── myapp-dev
```

**Option B — By product (for companies with multiple products)**
```
Organization: My Company
├── product-a-production
├── product-a-dev
├── product-b-production
└── product-b-dev
```

**Option C — By environment with staging**
```
Organization: My Company
├── myapp-production
├── myapp-staging
└── myapp-dev
```

### Can I have multiple clusters in one project?
Yes, but then you **cannot** restrict a team member to only one cluster within
that project — access applies to everything in the project.

Use separate projects when you need different people to have access to different
clusters. Use one project with multiple clusters when everyone who has project
access should be able to reach all clusters.

### How to create a project
1. Inside your organization → click **New Project**
2. Enter the project name (e.g. `myapp-production`)
3. Optionally invite members during creation, or do it later
4. Click **Create Project**

---

## Clusters

### What it is
The actual MongoDB server (or replica set) that stores your data.

### What to decide when creating a cluster
- **Tier** — M0 (free), FLEX, M10, M20 … (see Tiers guide)
- **Cloud provider** — AWS, Google Cloud, or Azure
- **Region** — pick the region closest to your app servers
- **Name** — you cannot rename a cluster after creation, choose carefully

### Naming convention
```
{app}-{environment}
myapp-prod
myapp-dev
myapp-staging
```

### How to create a cluster
1. Inside a project → click **Create a Cluster** (or **Build a Database**)
2. Choose tier
3. Choose cloud provider and region
4. Enter cluster name
5. Click **Create Cluster**

Creation takes 3–7 minutes.

### Cluster regions — choose wisely
- Always pick the **same cloud provider and region** as your app servers
- This minimizes latency and avoids data transfer costs
- Example: if your EC2 is on AWS `us-east-1`, create your Atlas cluster on AWS `us-east-1`

### Multi-region clusters (advanced)
Available on M10+. You can add nodes in multiple regions for:
- Global low-latency reads (regional read preference)
- Higher availability (survive full region outage)
- Use only when you have users in multiple geographies

---

## Deleting and Terminating

### Terminate a cluster
1. Cluster → **…** → **Terminate**
2. Type the cluster name to confirm
3. ⚠️ This is irreversible — all data is deleted

> M0 clusters do not cost anything. There is no reason to terminate them unless
> you specifically want to delete the data.

### Delete a project
A project can only be deleted if it has no active clusters.
1. Terminate all clusters in the project
2. Project → **Settings** → **Delete Project**

### Delete an organization
An organization can only be deleted if it has no projects.

---

## Migrating a Cluster to a Different Project

Atlas does not support moving a cluster between projects directly.
Your options:

**Option 1 — Atlas Live Migration (paid tiers)**
Use the Live Migration tool to sync data from source to destination
with minimal downtime.

**Option 2 — mongodump / mongorestore (any tier)**
```bash
# Export from source cluster
mongodump --uri="mongodb+srv://user:pass@source-cluster.mongodb.net/dbname" --out=./backup

# Import into destination cluster
mongorestore --uri="mongodb+srv://user:pass@dest-cluster.mongodb.net/dbname" ./backup/dbname
```

**Option 3 — Start fresh (if data is small or disposable)**
Recreate the cluster in the correct project and re-seed data.
