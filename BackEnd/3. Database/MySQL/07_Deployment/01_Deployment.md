# MySQL — Deployment & Cloud Databases

How to deploy your MySQL database to a cloud provider and connect it to your Node.js application in production.

---

## 1. Cloud MySQL Options

| Provider | Service | Free Tier |
|----------|---------|-----------|
| **AWS** | RDS (Relational Database Service) | 750 hours/month (12 months) |
| **PlanetScale** | Serverless MySQL | 5GB storage, 1B reads/month |
| **Clever Cloud** | Managed MySQL | Free plan available |
| **Railway** | Managed MySQL | $5 credit/month |
| **Google Cloud** | Cloud SQL | 300$ free credits |
| **Azure** | Azure Database for MySQL | 750 hours/month (12 months) |
| **Aiven** | Managed MySQL | Free tier available |

---

## 2. Connecting to a Cloud Database

### Environment Variables

```bash
# .env (production)
DB_HOST=my-database.abc123.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=securepassword
DB_NAME=production_db
DB_PORT=3306
```

### With mysql2

```javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: true,    // Enable SSL for cloud connections
  },
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
```

### With Sequelize

```javascript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
      },
    },
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  }
);

export default sequelize;
```

### Connection URI Format

```javascript
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
});

// DATABASE_URL=mysql://user:password@host:3306/database
```

---

## 3. Deploying with Clever Cloud

### Step 1: Create Account and Add-on

1. Sign up at [clever-cloud.com](https://www.clever-cloud.com/)
2. In the dashboard, click **Add an Add-on**
3. Select **MySQL** and choose a plan
4. Clever Cloud provides credentials: host, port, database name, username, password

### Step 2: Configure Your App

Set the provided credentials as environment variables in your application:

```bash
DB_HOST=<Clever_Cloud_Host>
DB_USER=<Clever_Cloud_Username>
DB_PASSWORD=<Clever_Cloud_Password>
DB_NAME=<Clever_Cloud_Database_Name>
DB_PORT=<Clever_Cloud_Port>
```

### Step 3: Migrate Your Data

1. **Export** your local database from phpMyAdmin (Format: SQL)
2. **Import** the exported `.sql` file into Clever Cloud's phpMyAdmin
3. Verify the tables and data exist in the cloud database

### Step 4: Deploy the Application

1. Create a **Node.js application** in Clever Cloud
2. Link it to your MySQL add-on
3. Set environment variables in the app settings
4. Push your code — Clever Cloud handles the rest

---

## 4. AWS RDS Setup

### Step 1: Create RDS Instance

1. Go to AWS Console → RDS → Create Database
2. Choose **MySQL** engine
3. Select **Free tier** template
4. Set master username and password
5. Configure storage (20 GB default)
6. Enable **public access** (for development only)

### Step 2: Security Group

Allow inbound connections on port `3306`:
- For development: Allow your IP
- For production: Allow only your server's IP/security group

### Step 3: Connect

```bash
DB_HOST=mydb.abc123.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=yourpassword
DB_NAME=myapp
```

---

## 5. Production Checklist

### Security

- [ ] **Never** expose database credentials in code — use environment variables
- [ ] Restrict network access to only your application servers
- [ ] Use **SSL/TLS** connections (`ssl: { rejectUnauthorized: true }`)
- [ ] Use a **dedicated database user** with minimum required permissions
- [ ] Enable **automated backups**
- [ ] Rotate passwords regularly

### Performance

- [ ] Use **connection pooling** (10-20 connections typical)
- [ ] Add **indexes** to frequently queried columns
- [ ] Use `EXPLAIN` to analyze slow queries
- [ ] Enable **query caching** where appropriate
- [ ] Monitor connection count and query performance
- [ ] Use **read replicas** for read-heavy workloads

### Sync Strategy

```javascript
// Production — NEVER use force or alter
await sequelize.sync();

// Use migrations instead for production schema changes
// npx sequelize-cli db:migrate
```

**In production, use migrations** (`sequelize-cli`) instead of `sync()` to manage schema changes safely.

---

## 6. Database Client Tools

| Tool | Type | Best For |
|------|------|---------|
| phpMyAdmin | Web | Quick edits, included with XAMPP |
| MySQL Workbench | Desktop | Full-featured, visual design |
| DBeaver | Desktop | Multi-database support |
| TablePlus | Desktop | Modern, lightweight |
| DataGrip | Desktop | JetBrains IDE integration |

Connect to cloud databases using the same credentials in any of these tools for visual management, query testing, and data inspection.

---

## 7. Summary

| Step | Action |
|------|--------|
| Choose provider | AWS RDS, PlanetScale, Clever Cloud, Railway |
| Get credentials | Host, port, user, password, database name |
| Set env variables | Store in `.env`, configure on hosting platform |
| Enable SSL | `ssl: { rejectUnauthorized: true }` |
| Use connection pool | `connectionLimit: 10` or Sequelize pool config |
| Migrate data | Export local SQL → Import to cloud |
| Use migrations | `sequelize-cli` for production schema changes |

### Key Points

1. **Never hardcode credentials** — always use environment variables
2. **Enable SSL** for all cloud database connections
3. **Restrict network access** — only allow your app server's IP
4. Use **migrations** (not `sync`) for production schema changes
5. **Automate backups** and test restore procedures
6. Monitor performance with database provider's dashboard
