# **🚀 Deploying a Next.js App on AWS EC2 with Nginx & PM2**

This guide will walk you through the **step-by-step** process of deploying a **Next.js** app on an **AWS EC2 instance** with **Nginx as a reverse proxy** and **PM2 to keep it running**.

---

## **1️⃣ Install Node.js, Git, and PM2**
### **Connect to Your EC2 Instance via SSH**
Once your EC2 instance is running, connect to it using SSH:
```sh
ssh -i my-key.pem ec2-user@your-ec2-public-ip
```
Replace `my-key.pem` with your actual **key file** and `your-ec2-public-ip` with your EC2 instance’s **public IP**.

### **Update the System & Install Node.js and Git**
Since **Amazon Linux 2** doesn’t include Node.js by default, install it:
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
PM2 helps keep your Next.js app running after SSH disconnects:
```sh
sudo npm install -g pm2
```

---

## **2️⃣ Clone Your Next.js Project & Build It**
### **Clone the Project from GitHub**
Navigate to your home directory and **clone your project**:
```sh
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT.git
```
Replace `YOUR_USERNAME` and `YOUR_PROJECT` with your **GitHub repository details**.

Move into the project directory:
```sh
cd YOUR_PROJECT
```

### **Install Dependencies & Build the Project**
Run the following commands inside your **project directory**:
```sh
npm install
npm run build
```

---

## **3️⃣ Start the Next.js App Using PM2**
Since ports below `1024` require **root access**, we run Next.js on **port 3000**:
```sh
pm run start -- -p 3000
```

Now, use **PM2 to keep it running**:
```sh
pm2 start npm --name "nextjs-app" -- start -- -p 3000
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
Replace the **existing `server {}` block** with the following:
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
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
Verify that Nginx is running:
```sh
sudo systemctl status nginx
```

---

## **5️⃣ Allow HTTP Traffic on Port 80 in AWS Security Groups**
1. **Go to AWS Console** → **EC2** → **Security Groups**.
2. Find your **EC2 instance’s Security Group**.
3. Edit **Inbound Rules**:
   - Allow **HTTP (80)** from `0.0.0.0/0` (Public Access).
   - Allow **HTTPS (443)** if using SSL.

---

## **6️⃣ Test Your Deployment**
Now, try accessing your **Next.js app in a browser**:
```sh
http://your-ec2-public-ip
```
🚀 Your app should be accessible without `:3000`!

---

## **7️⃣ (Optional) Secure with HTTPS (SSL)**
To enable **SSL (HTTPS)**, use **Let's Encrypt**:

### **Install Certbot (Free SSL)**
```sh
sudo yum install -y certbot python3-certbot-nginx
```

### **Generate an SSL Certificate**
Replace `yourdomain.com` with your actual **domain name**:
```sh
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### **Auto-Renew SSL Certificate**
```sh
sudo certbot renew --dry-run
```
Now your Next.js app will be accessible via **HTTPS**:
```sh
https://yourdomain.com
```

---

## **🔄 Updating Configurations While Running**
If your **Next.js app** and **Nginx** are already running, you can edit configurations without stopping the app.

### **Updating Next.js App Without Stopping It**
If you made changes to your app's code (e.g., updating frontend components, fixing bugs):
```sh
cd ~/YOUR_PROJECT
git pull origin main  # Get the latest changes
npm install           # Install new dependencies if needed
npm run build         # Build the updated app
pm2 restart nextjs-app  # Restart the app to apply changes
```
✅ **This keeps your app live while updating.**

---

### **Modifying Nginx Configuration While Running**
1️⃣ Open the Nginx configuration file:
```sh
sudo nano /etc/nginx/nginx.conf
```
2️⃣ Make necessary changes (e.g., updating **proxy_pass**, changing domains, modifying headers).

3️⃣ Save and apply the changes **without stopping your app**:
```sh
sudo systemctl reload nginx  # Reloads Nginx without downtime
```
If needed, restart it:
```sh
sudo systemctl restart nginx
```
✅ **Your app keeps running while Nginx updates.**

---

## **⏸ Stopping the App**
If you want to **stop** your Next.js app completely:
```sh
pm2 stop nextjs-app
```
✅ **This stops the app but keeps it in PM2’s process list.**

---

## **🔄 Restarting or Running the App Again**
If the app is stopped and you want to **restart it**:
```sh
pm2 restart nextjs-app
```
If you **deleted** the app and want to **start it again**:
```sh
pm2 start npm --name "nextjs-app" -- start -- -p 3000
```

✅ **Now your app is back online.**

---

## **💥 Fully Removing the App**
If you **no longer need the app running** and want to remove it completely:
```sh
pm2 delete nextjs-app
```
This removes it from PM2's process list.

---

## **🔥 Summary of Commands**
| **Action** | **Command** |
|------------|------------|
| **Update Next.js app while running** | `git pull origin main && npm install && npm run build && pm2 restart nextjs-app` |
| **Modify Nginx settings without downtime** | `sudo nano /etc/nginx/nginx.conf` → `sudo systemctl reload nginx` |
| **Stop the app** | `pm2 stop nextjs-app` |
| **Restart the app** | `pm2 restart nextjs-app` |
| **Run the app if deleted** | `pm2 start npm --name "nextjs-app" -- start -- -p 3000` |
| **Delete the app from PM2** | `pm2 delete nextjs-app` |

---

Now you **fully understand the flow** of **updating, stopping, and restarting your Next.js app** while keeping it live! 🚀🔥 Let me know if you need more clarification! 😊

