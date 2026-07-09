# 06 — MongoDB Atlas: Team Access & Roles

## Access Hierarchy

Atlas has three distinct levels of access. Each is independent.

```
Organization Level Roles
└── Project Level Roles
    └── Database User Roles (for app connections)
```

---

## Organization Roles

Control what a person can do across the entire organization — all projects included.

| Role | Capabilities |
|------|-------------|
| `Organization Owner` | Full control: create/delete projects, manage billing, manage all members |
| `Organization Project Creator` | Can create new projects, but cannot manage other projects they're not invited to |
| `Organization Billing Admin` | View and manage billing only |
| `Organization Read Only` | View organization settings, cannot change anything |
| `Organization Member` | No org-level permissions; can be invited to individual projects |

### Who should be Organization Owner?
- Maximum 1–2 people (founders, CTO)
- Should be the **company email account**, not a personal account
- This is the account that controls billing — protect it with MFA

---

## Project Roles

Control what a person can do within a specific project. Assigned per project —
someone can be Project Owner in dev and have no access to production.

| Role | What they can do |
|------|----------------|
| `Project Owner` | Full control of the project — clusters, users, network, alerts |
| `Project Cluster Manager` | Create/edit/delete clusters, but cannot access data |
| `Project Data Access Admin` | Manage database users and network access |
| `Project Data Access Read/Write` | Connect to databases, read and write data |
| `Project Data Access Read Only` | Connect to databases, read data only |
| `Project Read Only` | View project settings in Atlas console, cannot connect to DB |

---

## Recommended Role Assignment by Team

### Startup example structure

**Organization Level**
```
Founder / CTO       → Organization Owner
Finance             → Organization Billing Admin
Everyone else       → Organization Member (then invited to projects)
```

**Production Project**
```
CTO / Tech Lead     → Project Owner
DevOps / SRE        → Project Cluster Manager
Senior Backend Dev  → Project Data Access Read Only (debugging only)
Junior Dev          → No access to production
QA                  → No access to production
```

**Staging Project** (if you have one)
```
CTO / Tech Lead     → Project Owner
Senior Backend Dev  → Project Data Access Read/Write
QA Engineer         → Project Data Access Read/Write
Junior Dev          → Project Data Access Read Only
```

**Dev Project**
```
CTO / Tech Lead     → Project Owner
All Backend Devs    → Project Data Access Read/Write
Frontend Devs       → Project Data Access Read Only (if they need DB access)
QA Engineers        → Project Data Access Read/Write
```

---

## How to Invite a Team Member

### Step 1 — Invite to the Organization (first time only)
1. Atlas → top-left org dropdown → **Organization Settings**
2. Left sidebar → **Members** → **Invite Members**
3. Enter their email address
4. Assign org role: usually **Organization Member**
5. Click **Send Invite**
6. They receive an email — they must accept to create/link their Atlas account

### Step 2 — Add to a Project
1. Go to the specific project
2. Left sidebar → **Access Manager**
3. Click **Invite to Project**
4. Search for the member by email
5. Assign the appropriate project role
6. Click **Send Invitation**

> A person must be in the organization before they can be added to a project.

### Modifying a member's role
1. Project → **Access Manager** → find the member
2. Click **Edit** next to their name
3. Change role → **Save**

### Removing a member from a project
1. Project → **Access Manager** → find the member
2. Click the **trash icon** → confirm

---

## Offboarding a Team Member (When Someone Leaves)

Do all of these steps:

1. Remove them from all projects (Access Manager in each project)
2. Remove them from the organization (Org Settings → Members)
3. **Rotate all DB user passwords** they may have known
4. **Rotate any API keys** they may have had access to
5. **Update connection strings** on all servers if passwords changed
6. **Revoke their VPN access** if you use a shared VPN for DB whitelist access

---

## API Keys (for Automation & CI/CD)

If you use CI/CD pipelines, scripts, or Terraform that need to manage Atlas
resources (create clusters, manage users, etc.), use API keys — not personal credentials.

### Create an API key
1. Organization → **Access Manager** → **API Keys** tab
2. Click **Create API Key**
3. Enter a description (e.g. "GitHub Actions deployment")
4. Assign minimum required role
5. Copy the **Public Key** and **Private Key** — the private key is shown only once

### Store API keys securely
```bash
# In CI/CD (e.g. GitHub Actions secrets)
ATLAS_PUBLIC_KEY=xxxxx
ATLAS_PRIVATE_KEY=xxxxx

# Never commit these to source control
```

### IP access list for API keys
API keys also have their own IP allowlist.
Add the IPs of your CI/CD servers or use `0.0.0.0/0` for GitHub Actions
(since runner IPs change).

---

## Multi-Factor Authentication (MFA)

Strongly recommended for all Atlas accounts, mandatory for owners.

1. Atlas → top-right avatar → **Account**
2. **Security** tab → **Two-Factor Authentication**
3. Enable with an authenticator app (Authy, Google Authenticator, 1Password)

---

## SSO / Federated Authentication (Enterprise)

For larger teams, you can connect Atlas to your identity provider (Okta, Azure AD,
Google Workspace) so team members log into Atlas using their company SSO.

Atlas → Organization Settings → **Federated Authentication Settings**
