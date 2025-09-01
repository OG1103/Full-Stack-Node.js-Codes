# 🧱 MongoDB Atlas Structure & Access Control

This document provides a structured overview of how MongoDB Atlas is organized — including Organizations, Projects, Clusters, Databases — and how users and database access are managed within each layer.

---

## 🏢 1. Organization

An **Organization** is the highest-level container in MongoDB Atlas.

### Key Features:
- Can contain **multiple Projects**
- Used to manage:
  - **Billing**
  - **Teams**
  - **Organization-wide roles** (e.g., Organization Owner, Billing Admin)
- Provides a shared view of usage across all projects under it

> Think of an organization as your company's Atlas account.

---

## 📁 2. Project

A **Project** is a workspace inside an organization where you define resources and access.

### Key Features:
- Can contain **multiple clusters**
- Each project has:
  - **Database users** (for connecting to clusters)
  - **Project members** (with UI access)
  - **Network access rules** (IP allow list)
- Has its own:
  - **Monitoring**
  - **Alerts**
  - **Backups**
  - **API Keys**

> A project isolates your resources (e.g., staging vs production).

---

## 💠 3. Cluster

A **Cluster** is a MongoDB deployment inside a project. It is the actual database server infrastructure.

### Types of Clusters:
- **Replica Set**: Default; used for high availability
- **Sharded Cluster**: Used for horizontal scaling and large datasets

### Notes:
- Clusters are tied to a specific **cloud provider & region**
- Each project can have **multiple clusters**
- Clusters hold **databases**, **collections**, and **documents**

---

## 🗄️ 4. Database

A **Database** is a logical grouping of data inside a cluster.

### Key Features:
- Contains one or more **collections**
- Collections contain **documents** (MongoDB's version of records)
- Created automatically when you insert data into a new database name

---

## 🔐 5. Database Access in a Project

Database access is managed **at the project level**, but applies to **clusters inside that project**.

### ✅ Database User Scope:

- **Database users are created per project**
- They can access **any cluster within the same project**
- You assign **roles per database** (e.g., readWrite on `ordersDB`) or roles project wide like any database

> 📌 A database user created in one project **cannot access clusters in another project**.

---

## 👥 6. User Types in MongoDB Atlas

There are two types of users you can manage within a project:

---

### 🔹 A) Project Members (UI Access)

These users are invited by **email** and manage resources through the **Atlas UI**.

| Feature | Description |
|--------|-------------|
| Purpose | UI access to manage clusters, backups, users |
| Authentication | Atlas login (email/password) |
| Roles | `Project Owner`, `Project Editor`, `Project ReadOnly` |
| Cannot | Connect to clusters from app code |

> Ideal for developers, admins, DevOps managing infrastructure.

---

### 🔹 B) Database Users (Application Access)

These users are used to **connect from your application to a cluster** via a connection string.

| Feature | Description |
|--------|-------------|
| Purpose | Authenticated access to databases |
| Created in | Project → Database Access |
| Authentication | Username/password in connection string |
| Roles | `read`, `readWrite`, `dbAdmin`, etc. per database |
| Scope | Can access any cluster in the **same project** |
| Cannot | Log into the Atlas UI |

> Example usage in a connection string:
> ```
> mongodb+srv://dbUser123:password@cluster0.mongodb.net/myAppDB
> ```

---

## 🔑 Summary of Access Control

| Layer | User Type | Access Scope | Can Connect to DB? | Can Use UI? |
|-------|-----------|--------------|--------------------|-------------|
| Organization | Org Member | All projects/org-wide | ❌ | ✅ |
| Project | Project Member | One project only | ❌ | ✅ |
| Project | Database User | Any cluster in the project | ✅ | ❌ |

---

## 🧠 Final Notes

- Always whitelist IP addresses under **Network Access** for connection to succeed.
- Database users must be granted **roles per database**, even if they can connect to all clusters in the project.
- You can create **multiple database users** per project, each with different levels of access (e.g., read-only, full access).

---

> For production: avoid using `0.0.0.0/0` as your IP allow list unless using additional security measures like VPC peering or strong auth.