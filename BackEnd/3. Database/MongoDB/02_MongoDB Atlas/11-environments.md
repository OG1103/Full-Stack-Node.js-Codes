# 11 — MongoDB Atlas: Dev, Staging & Production Environments

## Why Separate Environments?

Each environment serves a different purpose and must be isolated from the others.
Mixing environments is one of the most common causes of data loss and outages.

```
Development  → Developers build and test new features
Staging      → QA tests before release; mirrors production
Production   → Real users, real data
```

**The rule:** code flows up (dev → staging → production). Data never flows down
(never copy production data to dev without sanitizing it first).

---

## Recommended Setup

### Startups and small teams (minimum viable)
```
Organization: My Company
├── myapp-production  (project)
│   └── myapp-prod cluster  [FLEX or M10]
│
└── myapp-dev  (project)
    └── myapp-dev cluster   [M0 — free]
```

### Growing teams (recommended)
```
Organization: My Company
├── myapp-production  (project)
│   └── myapp-prod cluster  [M10+]
│
├── myapp-staging  (project)
│   └── myapp-staging cluster  [M0 or FLEX]
│
└── myapp-dev  (project)
    └── myapp-dev cluster   [M0 — free]
```

---

## Environment Configurations

### Development
| Setting | Value | Reason |
|---------|-------|--------|
| Tier | M0 (Free) | Costs nothing |
| IP Whitelist | `0.0.0.0/0` | Convenience for developers |
| DB User | `myapp-dev` with readWrite | Full access for dev work |
| Backups | Off | Dev data is throwaway |
| Team Access | All developers | Everyone needs it |
| Data | Seeded test data | Never real user data |

### Staging
| Setting | Value | Reason |
|---------|-------|--------|
| Tier | M0 or FLEX | Low traffic |
| IP Whitelist | Staging server IP + team VPN | Controlled |
| DB User | `myapp-staging` with readWrite | App access |
| Backups | Optional | Staging data can be re-seeded |
| Team Access | Senior devs, QA | Not all developers |
| Data | Anonymized copy of prod OR seeded | Never real PII |

### Production
| Setting | Value | Reason |
|---------|-------|--------|
| Tier | FLEX or M10+ | Real traffic |
| IP Whitelist | App server IPs only | Maximum security |
| DB User | `myapp-prod` with readWrite on prod DB | Least privilege |
| Backups | Continuous Cloud Backup | Mandatory |
| Team Access | Founders, CTO, DevOps only | No junior devs |
| Data | Real user data | Protect at all costs |

---

## Environment Variables per Environment

### Local development (.env)
```bash
NODE_ENV=development
MONGODB_URI=mongodb+srv://myapp-dev:devpass@myapp-dev.abc12.mongodb.net/myapp_dev
```

### Staging server (.env or system env)
```bash
NODE_ENV=staging
MONGODB_URI=mongodb+srv://myapp-staging:stagingpass@myapp-staging.def34.mongodb.net/myapp_staging
```

### Production server (system env or secrets manager)
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://myapp-prod:prodpass@myapp-prod.xyz99.mongodb.net/myapp_production
```

### Loading the right config in Node.js
```javascript
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});
```

---

## Database Naming Convention

Use clear, unambiguous names so you always know which environment you're in:

```
myapp_production    ← production data
myapp_staging       ← staging data  
myapp_dev           ← development data
myapp_test          ← automated test data (wiped between test runs)
```

**Never name a database just `myapp` or `db`** — you will eventually lose track
of which environment you're connected to.

---

## Seeding Development Data

Never use real production data in development. Use seed scripts instead.

```javascript
// scripts/seed.js
const mongoose = require('mongoose');
require('dotenv').config();

const seedUsers = [
  { name: 'Alice Test', email: 'alice@example.com', role: 'user' },
  { name: 'Bob Test', email: 'bob@example.com', role: 'admin' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Clear existing data
  await User.deleteMany({});
  
  // Insert seed data
  await User.insertMany(seedUsers);
  
  console.log('Database seeded');
  process.exit(0);
}

seed();
```

```bash
# Run seed
NODE_ENV=development node scripts/seed.js
```

---

## Promoting Code Through Environments

```
1. Developer writes code locally → tests against dev DB
         ↓
2. Code pushed to git → CI runs automated tests against test DB
         ↓
3. Merged to staging branch → deployed to staging → QA tests
         ↓
4. QA approves → merged to main → deployed to production
```

### CI/CD environment variables
Store Atlas URIs as secrets in your CI/CD system:
- GitHub Actions: Settings → Secrets → Actions secrets
- GitLab: Settings → CI/CD → Variables
- CircleCI: Project Settings → Environment Variables

```yaml
# GitHub Actions example
env:
  MONGODB_URI: ${{ secrets.MONGODB_URI_TEST }}
```

---

## Protecting Production Data

### Access controls
- Only 2–3 people should have Atlas console access to the production project
- Developers should never query production directly — use staging for testing
- If a developer needs to investigate a production issue, create a temporary
  read-only DB user, grant access for 1 hour, then revoke it

### Preventing accidental writes to production
In your application code, add a guard:
```javascript
if (process.env.NODE_ENV === 'production' && process.env.MONGODB_URI.includes('dev')) {
  throw new Error('🚨 Production app is trying to connect to dev database!');
}
```

### Sanitizing data when moving from prod to staging
If you ever need to copy production data to staging for debugging:
```javascript
// Remove or anonymize PII before export
db.users.find().forEach(user => {
  db.users_sanitized.insertOne({
    ...user,
    email: `user-${user._id}@example.com`,  // anonymize email
    phone: null,                              // remove phone
    name: `Test User ${user._id}`,           // anonymize name
  });
});
```
