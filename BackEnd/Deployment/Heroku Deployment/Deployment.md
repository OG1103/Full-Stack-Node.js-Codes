# Deploying a MERN Stack Backend Application to Heroku

This guide explains how to deploy your MERN stack backend application (Node.js, Express, MongoDB) to Heroku. It covers everything from setting up your project for deployment to configuring your database on MongoDB Atlas.

---

## **Steps to Deploy MERN Backend on Heroku**

### **1. Prepare Your Backend for Deployment**

Ensure that your backend application is ready for production:

- Copy folder into a separate folder aka make a copy of your project
- Open the copied project
- Clear any GitHub repo associated with the copied folder:`rm -rf .git `
- In `package.json`, add:
  ```json
  "engines": { "node": "version" }
  ```
- In scripts, add:
  ```json
  "start": "node app.js"  // or whatever your entry point is
  ```
- - In `app.js`, add:

  ```javascript
  // add it before setting up any middleware
  app.set("trust proxy", 1); //Express application configures the app to trust a reverse proxy located directly in front of it.

  // Middleware for parsing JSON, cookies, etc.

  // Add your routes and other middleware here
  ```

1. **Create a `Procfile`** in the root of your project.

   - Heroku uses the `Procfile` to determine how to start your application.
   - The `Procfile` has no extension; the file name is: `Procfile`.
   - Add the following line to your `Procfile`:
     ```
     web: node index.js
     ```
     Replace `index.js` with the entry point of your application (e.g., `server.js` or `app.js`).

2. **Set the Port Dynamically**

   - Heroku dynamically assigns a port, so you need to update your code to use the port from the environment variables:
     ```javascript
     const PORT = process.env.PORT || 5000;
     app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
     });
     ```

3. **Set Up Environment Variables**

   - Move any sensitive data (like database URIs or secret keys) to environment variables.
   - For example, if you’re using a MongoDB connection string:

     ```javascript
     const mongoose = require("mongoose");
     const MONGO_URI = process.env.MONGO_URI;

     mongoose
       .connect(MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
       })
       .then(() => console.log("MongoDB connected"))
       .catch((err) => console.error("MongoDB connection error:", err));
     ```

4. **Add a `.gitignore` File**
   - Ensure that your `.env` file and `node_modules` are not pushed to Heroku:
     ```
     node_modules
     .env
     ```

---

### **2. Set Up MongoDB Atlas**

Since Heroku does not provide a built-in MongoDB service, you’ll need to use **MongoDB Atlas**, a cloud-hosted MongoDB service.

1. **Create a MongoDB Atlas Account**

   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.

2. **Create a New Cluster**

   - Follow the instructions to create a new free-tier cluster.
   - Ensure in Network access: change local IP such that we choose the option accessible from anywhere or your server ip. 

3. **Connect to Your Cluster**

   - Once your cluster is ready, click on **Connect** > **Connect Your Application**.
   - Copy the connection string (it will look something like this):
     ```
     mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

4. **Set the Connection String as an Environment Variable**
   - In your backend code, use `process.env.MONGO_URI` to refer to the connection string.

### **2. If Using mySql**

- Host your Database on clever, and update the connection configuration in your application to the corresponding info given to your remote database.
- ```javascript
  export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
  });
  // Use Clever Database Credentials 
  ```

---

### **3. Deploy to Heroku**

1. **Install the Heroku CLI**

   - If you haven’t already, [download and install the Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

2. **Log in to Heroku**

   ```bash
   heroku login
   ```

   This will open a browser window where you can log in to your Heroku account.

3. **Create a New Heroku App**

   ```bash
   heroku create your-app-name
   ```

   Replace `your-app-name` with a unique name for your application.

4. **Initialize a Git Repository (if not already initialized)**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

5. **Add the Heroku Remote**

   ```bash
   heroku git:remote -a your-app-name
   ```

6. **Push Your Code to Heroku**
   ```bash
   git push heroku master
   ```
   This will push your code to Heroku and trigger the deployment process.

---

### **4. Configure Environment Variables on Heroku**

1. **Set Environment Variables**

   ```bash
   heroku config:set MONGO_URI=your-mongodb-connection-string
   heroku config:set JWT_SECRET=your-jwt-secret
   ```

   - These can also be set in the Heroku GUI.

2. **Check Your Configurations**
   ```bash
   heroku config
   ```
   This will display all the environment variables set for your app.

---

### **5. Clone an Existing Project from Heroku**

If you need to clone an existing project that is already deployed on Heroku, follow these steps:

1. **Log in to Heroku**

   ```bash
   heroku login
   ```

2. **Clone the Heroku App**

   ```bash
   heroku git:clone -a your-app-name
   ```

   Replace `your-app-name` with the name of your Heroku app.

3. **Navigate into the Cloned Repository**

   ```bash
   cd your-app-name
   ```

4. **Make Changes and Redeploy**
   After making changes to the cloned project:
   ```bash
   git add .
   git commit -m "Updated project"
   git push heroku master
   ```

---

### **6. Test Your Deployment**

Once the deployment is complete:

1. Open your app in the browser:

   ```bash
   heroku open
   ```

2. Check the logs for any errors:
   ```bash
   heroku logs --tail
   ```

---

### **7. Additional Tips**

- **Use a Build Script**: If you’re deploying both frontend and backend together, create a build script to bundle the frontend and serve it using the backend.
- **Use a Process Manager**: For production deployments, consider using a process manager like `pm2` locally.
- **Enable Heroku Dyno Auto-scaling**: You can enable auto-scaling on Heroku to handle increased traffic automatically.

---

### **Summary**

By following these steps, you can successfully deploy your MERN stack backend application to Heroku using MongoDB Atlas as the database. This approach ensures that your app is production-ready, with secure handling of environment variables and proper connection to a cloud-hosted database.

For more details, check out the official Heroku and MongoDB documentation:

- [Heroku Documentation](https://devcenter.heroku.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
