# **🚀 Deploying a Node.js Backend on AWS EC2 with Nginx & PM2**

This guide walks you through **deploying a Node.js backend** on an **AWS EC2 instance** with **Nginx as a reverse proxy** and **PM2 to keep it running**.

---

## **1️⃣ Install Node.js, Git, and PM2**

### **Connect to Your EC2 Instance via SSH**
Once your EC2 instance is running, connect to it using SSH:
```sh
ssh -i my-key.pem ec2-user@your-ec2-public-ip
```
Replace `my-key.pem` with your **key file** and `your-ec2-public-ip` with your **instance’s public IP**.

### **Update the System & Install Node.js and Git**
Install Node.js and Git:
```sh
sudo yum update -y
sudo yum install -y nodejs npm git
```
Verify installation:
```sh
node -v
npm -v
git --version
```

### **Install PM2 (Process Manager for Node.js)**
PM2 keeps your backend running after SSH disconnects:
```sh
sudo npm install -g pm2
```

---

## **2️⃣ Clone Your Backend Project & Set Up Environment Variables**

### **Clone the Project from GitHub**
```sh
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_BACKEND_PROJECT.git
```
Replace `YOUR_USERNAME` and `YOUR_BACKEND_PROJECT` with your **GitHub repository details**.

Move into the project directory:
```sh
cd YOUR_BACKEND_PROJECT
```

### **Set Up Environment Variables**
1. Create a `.env` file in your backend directory:
   ```sh
   nano .env
   ```
2. Add your environment variables:
   ```sh
   PORT=5000
   DATABASE_URL=your-database-url
   JWT_SECRET=your-secret-key
   ```
   Save the file (`CTRL + X`, then `Y`, then `ENTER`).

3. Ensure your backend **loads environment variables** using **dotenv**:
   ```sh
   npm install dotenv
   ```
   Add this line to your `server.js` or `index.js` file:
   ```js
   require('dotenv').config();
   ```

### **Ensure Your Package.json Includes a Start Script**
In your `package.json`, add the following script inside the `scripts` object if it doesn’t already exist:
```json
"scripts": {
  "start": "node app.js"
}
```
Replace `app.js` with your **actual entry file** (e.g., `server.js` or `index.js`).

### **Install Dependencies & Build the Project**
```sh
npm install
npm run build  # Run this only if your backend requires a build step
```

---

## **3️⃣ Start the Backend Using PM2**

Since the **port is defined in `.env`**, just run the app normally:
```sh
npm start
```
Now, start and manage the process with PM2:
```sh
pm2 start npm --name "backend-app" -- start
pm2 save
pm2 startup
```
Verify the process:
```sh
pm2 list
```

---

## **4️⃣ Install & Configure Nginx as a Reverse Proxy**

### **Install Nginx**
```sh
sudo yum install -y nginx
```
Enable Nginx to start on boot:
```sh
sudo systemctl enable nginx
```

### **Edit the Nginx Configuration File**
```sh
sudo nano /etc/nginx/nginx.conf
```
Replace the **existing `server {}` block** with:
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Save the file (`CTRL + X`, then `Y`, then `ENTER`).

### **Restart Nginx**
```sh
sudo systemctl restart nginx
```
Verify Nginx is running:
```sh
sudo systemctl status nginx
```

---

## **5️⃣ Allow HTTP Traffic on Port 80 in AWS Security Groups**
1. **Go to AWS Console** → **EC2** → **Security Groups**.
2. Find your **EC2 instance’s Security Group**.
3. Edit **Inbound Rules**:
   - Allow **HTTP (80)** from `0.0.0.0/0`.
   - Allow **HTTPS (443)** if using SSL.

---

## **6️⃣ Test Your Deployment**
Now, try accessing your **backend API in a browser or Postman**:
```sh
http://your-ec2-public-ip
```
🚀 Your backend should be accessible!

---

## **7️⃣ (Optional) Secure with HTTPS (SSL)**

### **Install Certbot (Free SSL)**
```sh
sudo yum install -y certbot python3-certbot-nginx
```

### **Generate an SSL Certificate**
```sh
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### **Auto-Renew SSL Certificate**
```sh
sudo certbot renew --dry-run
```
Now your backend is accessible via **HTTPS**:
```sh
https://yourdomain.com
```

---

## **8️⃣ Modify Server Configurations & Manage PM2**

### **Updating Backend Code Without Stopping It**
```sh
cd ~/YOUR_BACKEND_PROJECT
git pull origin main
npm install
npm run build  # If required
pm2 restart backend-app
```

### **Modify Nginx Config Without Stopping App**
```sh
sudo nano /etc/nginx/nginx.conf
sudo systemctl reload nginx
```

### **Stopping, Restarting, or Removing PM2 Process**
- **Stop the backend:** `pm2 stop backend-app`
- **Restart the backend:** `pm2 restart backend-app`
- **Delete the backend from PM2:** `pm2 delete backend-app`
- **Check running processes:** `pm2 list`
- **Prevent PM2 from restarting on reboot:** `pm2 unstartup`

---

🚀 **Now your Node.js backend is fully deployed on AWS EC2!** 🎉

Let me know if you need further assistance! 😊

