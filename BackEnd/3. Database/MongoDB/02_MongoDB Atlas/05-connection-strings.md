# 05 — MongoDB Atlas: Connection Strings

## What is a Connection String (URI)?

The connection string is how your application tells the MongoDB driver where
to connect and how to authenticate. It encodes the protocol, credentials,
hostname, database name, and connection options.

### Standard format
```
mongodb+srv://<username>:<password>@<cluster-host>/<database>?<options>
```

### Example
```
mongodb+srv://myapp-prod:s3cur3p@ss@myapp-prod.abc12.mongodb.net/myapp_production?retryWrites=true&w=majority
```

---

## How to Get Your Connection String from Atlas

1. Go to your cluster → click **Connect**
2. Choose **Connect your application**
3. Select your driver language and version
4. Copy the connection string
5. Replace `<password>` with your DB user's actual password
6. Replace `myFirstDatabase` (if present) with your actual database name

---

## Connection String Parts Explained

```
mongodb+srv://myapp-prod:s3cur3p@ss@myapp-prod.abc12.mongodb.net/myapp_production?retryWrites=true&w=majority
│            │           │        │                               │               │
│            │           │        │                               │               └─ options
│            │           │        │                               └─ database name
│            │           │        └─ cluster hostname (from Atlas)
│            │           └─ password
│            └─ username (DB user)
└─ protocol (SRV = DNS-based discovery, handles replica set automatically)
```

### `mongodb+srv` vs `mongodb`
- `mongodb+srv` — uses DNS SRV records; Atlas gives you this by default; handles
  replica set topology automatically; recommended for all Atlas connections
- `mongodb://` — direct connection to specific host(s); used for self-hosted MongoDB

---

## Connection Options

Append these to the URI as query parameters:

| Option | Recommended value | What it does |
|--------|------------------|-------------|
| `retryWrites` | `true` | Retry failed writes automatically (handles failovers) |
| `w` | `majority` | Wait for majority of replica set to confirm write |
| `maxPoolSize` | `10` | Max concurrent connections in the pool |
| `minPoolSize` | `2` | Keep at least N connections open |
| `connectTimeoutMS` | `10000` | Fail if can't connect within 10 seconds |
| `serverSelectionTimeoutMS` | `5000` | Fail if no server found within 5 seconds |
| `readPreference` | `primary` | Always read from primary (consistent reads) |
| `readPreference` | `secondaryPreferred` | Read from secondary when available (reduces primary load) |
| `authSource` | `admin` | Database that stores the user's credentials |

### Recommended production URI
```
mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority&maxPoolSize=10
```

---

## Special Characters in Passwords

If your password contains special characters, they must be URL-encoded:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `#` | `%23` |
| `?` | `%3F` |
| `&` | `%26` |
| `=` | `%3D` |
| `+` | `%2B` |
| ` ` (space) | `%20` |

**Tip:** Avoid special characters in passwords entirely to keep URIs clean.
Use a random alphanumeric password generator.

---

## Environment Variables

### Never hardcode credentials in source code
```javascript
// ❌ Never do this
mongoose.connect('mongodb+srv://admin:password123@cluster.mongodb.net/mydb');

// ✅ Always do this
mongoose.connect(process.env.MONGODB_URI);
```

### .env file structure
```bash
# .env  (local development)
MONGODB_URI=mongodb+srv://myapp-dev:devpassword@myapp-dev.abc12.mongodb.net/myapp_dev?retryWrites=true&w=majority
NODE_ENV=development

# .env.production  (production server)
MONGODB_URI=mongodb+srv://myapp-prod:prodpassword@myapp-prod.xyz99.mongodb.net/myapp_production?retryWrites=true&w=majority
NODE_ENV=production
```

### .gitignore — always include these
```
.env
.env.local
.env.production
.env.*.local
*.pem
```

---

## Connecting in Node.js

### Using Mongoose
```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are defaults in Mongoose 6+ but explicit is fine
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

// server.js
require('dotenv').config();
const connectDB = require('./config/database');
connectDB();
```

### Using the Native Node.js Driver
```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI, {
  maxPoolSize: 10,
});

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(); // uses the database name from the URI
  }
  return db;
}

module.exports = { connectDB };
```

---

## Connecting in Python

### Using PyMongo
```python
from pymongo import MongoClient
import os

client = MongoClient(os.environ["MONGODB_URI"])
db = client.get_database()  # uses database name from URI

# Test connection
client.admin.command("ping")
print("Connected to MongoDB Atlas")
```

### Using Motor (async Python)
```python
import motor.motor_asyncio
import os

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URI"])
db = client.get_database()
```

---

## Setting URI on a Production Server

### On Linux (EC2 / VPS)
```bash
# Add to /etc/environment for system-wide access
echo 'MONGODB_URI="mongodb+srv://..."' | sudo tee -a /etc/environment
source /etc/environment

# Or in your app's systemd service file:
# [Service]
# Environment="MONGODB_URI=mongodb+srv://..."
```

### With PM2 (Node.js process manager)
```bash
# Pass env vars when starting
pm2 start app.js --name myapp --env production

# Or use an ecosystem config file
# ecosystem.config.js:
module.exports = {
  apps: [{
    name: 'myapp',
    script: 'server.js',
    env_production: {
      NODE_ENV: 'production',
      MONGODB_URI: 'mongodb+srv://...'
    }
  }]
};
pm2 start ecosystem.config.js --env production
```

---

## Testing Your Connection

### Using mongosh (MongoDB Shell)
```bash
# Install
npm install -g mongosh

# Connect
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/dbname"

# On success you'll see:
# Atlas atlas-xxxxx-shard-0 [primary] dbname>

# Run a test query
db.runCommand({ ping: 1 })  # Returns: { ok: 1 }
```

### Quick Node.js test script
```javascript
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function test() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    await client.db().command({ ping: 1 });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (e) {
    console.error('❌ Connection failed:', e.message);
  } finally {
    await client.close();
  }
}
test();
```
