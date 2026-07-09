# 04 — MongoDB Atlas: Network Access & Security

## Two Layers of Access Control

Every connection to Atlas must pass through both layers:

```
Incoming connection
        │
        ▼
┌───────────────────────┐
│  Layer 1: Network     │  Is this IP address allowed?
│  Access (IP Whitelist)│
└───────────────────────┘
        │  ✅ IP is on the whitelist
        ▼
┌───────────────────────┐
│  Layer 2: Database    │  Are these credentials valid?
│  User Authentication  │
└───────────────────────┘
        │  ✅ Credentials are valid
        ▼
     Connected ✅
```

Fail either layer → connection rejected, no exceptions.

---

## Layer 1 — Network Access (IP Whitelist)

### What it controls
Which IP addresses are permitted to even attempt a connection to your cluster.
Blocked IPs get a timeout — they never reach the authentication step.

### How to add an IP address
1. Project → **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Enter the IP in CIDR notation
4. Add a descriptive label (e.g. "Production EC2 server")
5. Click **Confirm**
6. Changes propagate in ~1–2 minutes

### CIDR notation explained
```
Specific single IP:    203.0.113.5/32      ← only this exact address
Small office range:    203.0.113.0/24      ← 203.0.113.0 – 203.0.113.255
Allow everyone:        0.0.0.0/0           ← any IPv4 address (⚠️ dev only)
IPv6 allow all:        ::/0                ← any IPv6 address
```

### Recommended settings by environment

| Environment | IP Whitelist | Reason |
|-------------|-------------|--------|
| Production | App server IP only (`/32`) | Least-privilege, max security |
| Staging | Staging server IP + team VPN | Controlled access |
| Development | `0.0.0.0/0` | Dev data isn't sensitive; convenience matters |

### ⚠️ IPs change — common causes of sudden lockouts
- Home/office ISP reassigned your public IP (very common)
- You switched from WiFi to mobile hotspot
- Corporate VPN changed your exit IP
- Your EC2 instance was stopped and restarted (elastic IP not assigned)

**Always check your current IP before troubleshooting:**
```
https://checkip.amazonaws.com
```

### Temporary access
You can add an IP with an expiry time for temporary access:
1. Add IP Address → check **Save as temporary**
2. Set expiry (e.g. 6 hours)
3. Access automatically removes itself

### Using a VPN for teams
If multiple developers need whitelist access:
- Set up a shared static-IP VPN (e.g. Tailscale, WireGuard, AWS Client VPN)
- All developers connect through the VPN
- Whitelist only the VPN's static exit IP
- When someone leaves: remove their VPN access — no Atlas changes needed

---

## Layer 2 — Database Users

### What it controls
What an authenticated connection can do — which databases and collections it can
read from or write to.

### Database users vs Atlas team members
| | Database User | Atlas Team Member |
|-|--------------|------------------|
| What it is | App-level credentials | A person with console access |
| Where managed | Database Access | Organization/Project Members |
| Logs into | Your MongoDB cluster | Atlas web console |
| Used by | Your application code | Humans managing Atlas |
| Example | `myapp-prod-user` | `developer@company.com` |

Your application **never** uses an Atlas team member's email and password.
It always uses a dedicated Database User.

### How to create a database user
1. Project → **Database Access** → **Add New Database User**
2. Authentication method: **Password**
3. Enter username (e.g. `myapp-prod`)
4. Generate or enter a strong password
5. Assign a built-in role (see below)
6. Click **Add User**

### Built-in roles

| Role | Read | Write | Admin | Use for |
|------|------|-------|-------|---------|
| `atlasAdmin` | ✅ | ✅ | ✅ | Never in app code |
| `readWriteAnyDatabase` | ✅ | ✅ | ❌ | App server |
| `readAnyDatabase` | ✅ | ❌ | ❌ | Analytics, reporting |
| `read` (specific DB) | ✅ | ❌ | ❌ | Read-only per database |
| `readWrite` (specific DB) | ✅ | ✅ | ❌ | App server per database |

### Custom roles (fine-grained access)
You can restrict a user to specific collections or operations:
1. **Database Access** → **Custom Roles** → **Add New Custom Role**
2. Define allowed actions per collection
3. Assign the custom role to a user

### Recommended users per cluster

**Production cluster:**
```
myapp-prod-app      → readWrite on myapp_production database (used by app)
myapp-prod-readonly → read on myapp_production database (used for analytics)
myapp-prod-admin    → atlasAdmin (used by you for emergencies, never in code)
```

**Dev cluster:**
```
myapp-dev-app       → readWriteAnyDatabase (used by all developers)
```

---

## VPC Peering

### What it is
A private network tunnel between your cloud VPC (where your servers live) and
Atlas. Traffic flows over the cloud provider's internal network — never over the
public internet.

### When to use it
- Your app servers and Atlas cluster are on the **same cloud provider and region**
- You want to remove public internet exposure entirely
- You want the lowest possible latency between app and database
- Available on **M10 and above only**

### How to set up (AWS example)
1. Atlas → **Network Access** → **Peering** tab → **Add Peering Connection**
2. Select **AWS**
3. Fill in:
   - AWS Account ID
   - VPC ID (from AWS VPC console)
   - VPC CIDR block (e.g. `10.0.0.0/16`)
   - Region (must match Atlas cluster region)
4. Atlas generates a peering request
5. Go to AWS VPC console → **Peering Connections** → accept the request
6. Update your AWS route tables to route Atlas traffic through the peering connection
7. In Atlas Network Access, add your VPC's CIDR block instead of a public IP

### Result
```
App Server (private IP 10.0.1.5)
        ↓ private network
VPC Peering Connection
        ↓ private network
Atlas Cluster
```
No public internet involved. ✅

### Private Endpoints (alternative to VPC Peering)
AWS PrivateLink / Azure Private Link / GCP Private Service Connect.
More secure and simpler to configure than VPC Peering for some setups.
Available on M10+.
- Atlas → **Network Access** → **Private Endpoint** tab

---

## Security Hardening Checklist

- [ ] No `0.0.0.0/0` on production
- [ ] Each app environment has its own dedicated DB user
- [ ] DB users follow least-privilege (only the permissions they need)
- [ ] Admin DB user is never used in application code
- [ ] Credentials stored in environment variables, not source code
- [ ] `.env` and secret files are in `.gitignore`
- [ ] VPC Peering or Private Endpoints set up on production
- [ ] Temporary IP access used for one-off developer access (not permanent)
- [ ] DB user passwords rotated when team members leave
- [ ] Atlas audit logging enabled (M10+, Enterprise feature)
