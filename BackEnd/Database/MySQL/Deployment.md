# Deploying an SQL Database on Clever Cloud

This guide explains how to deploy your SQL database (e.g., MySQL) on Clever Cloud, a platform-as-a-service (PaaS) provider. Clever Cloud allows you to deploy and manage databases easily with a few steps.

---

## **1. Create an Account on Clever Cloud**

1. Go to [Clever Cloud](https://www.clever-cloud.com/).
2. Sign up for an account if you don’t already have one.
3. Log in to the Clever Cloud console.

---

## **2. Create a New SQL Database**

1. In the Clever Cloud console, click on **Add an Add-on** in the dashboard.
2. Select your preferred SQL database type, such as:

   - **MySQL**
   - **PostgreSQL**
   - **MariaDB**

3. Configure the database:

   - **Name your database** (e.g., `my_database`).
   - Select a plan that fits your needs (e.g., free, small, medium).
   - Click **Create**.

4. Once created, Clever Cloud will provide you with database credentials, including:
   - Hostname
   - Port
   - Database Name
   - Username
   - Password

Make sure to save these credentials securely.

---

## **3. Connect to Your Database**

### Using a Local SQL Client

1. Install a database client such as **MySQL Workbench**, **DBeaver**, or **pgAdmin**.
2. Use the credentials provided by Clever Cloud to connect:

   - Host: `<Clever_Cloud_Host>`
   - Port: `<Clever_Cloud_Port>`
   - Database Name: `<Clever_Cloud_Database_Name>`
   - Username: `<Clever_Cloud_Username>`
   - Password: `<Clever_Cloud_Password>`

3. Test the connection to verify that it works.

### Connect Using Your Application

Use the database credentials in your application’s database configuration file. For example:

#### In a Node.js Application (Using `mysql2`):

```javascript
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: '<Clever_Cloud_Host>',
    user: '<Clever_Cloud_Username>',
    password: '<Clever_Cloud_Password>',
    database: '<Clever_Cloud_Database_Name>',
    port: <Clever_Cloud_Port>,
});
module.exports = db;
```
#### In a Node.js Application (Using `sequelize`):
```javascript
export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
});
```

---

## **4. Deploy Your Application with Clever Cloud**

1. In the Clever Cloud console, create a new **Node.js**, **Python**, or other application instance.
2. Link the application to your SQL database:

   - Go to the **Environment Variables** section of your application.
   - Add variables to match the database credentials (e.g., `DB_HOST`, `DB_USER`, `DB_PASS`).

3. Push your application code to Clever Cloud, ensuring it includes the configuration to connect to your database.

---

## **5. Testing the Deployment**

1. Deploy your application on Clever Cloud.
2. Access your application via its Clever Cloud URL.
3. Test database-dependent functionality to ensure everything is working as expected.

---

## **6. Managing Your Database**

- Use the Clever Cloud console to monitor:

  - **Database performance**
  - **Storage usage**

- You can also configure automatic backups for your database from the Clever Cloud dashboard.

---

## **7. Troubleshooting**

### Common Issues

1. **Connection Errors**:

   - Ensure your credentials are correct.
   - Check that your database instance is running.

2. **Firewall Rules**:
   - Clever Cloud handles this automatically, but ensure your application’s IP can connect to the database.

### Debugging Tips

- Use logs from the Clever Cloud console to debug connection issues.
- Test connections locally with the provided credentials.

---

This guide provides the basic steps to deploy and connect your SQL database on Clever Cloud. For more advanced features or troubleshooting, refer to Clever Cloud’s [official documentation](https://www.clever-cloud.com/doc/).

1. Go to information and fill details
2. Go to overview and create an application
3. choose your database
4. go to phpmyadmin and export in shape of sql and in clever go to phpmyadmin and import the exported file
5. go to export el celever and fill the details of it in your express app aka the host and db and user and port and password and database name
