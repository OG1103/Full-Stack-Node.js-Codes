# **1 Set Up an AWS Application Load Balancer (ALB)**
### **Step 1: Create the Load Balancer**
1. **Go to AWS Console** → **EC2** → **Load Balancers**.
2. Click **Create Load Balancer**.
3. Select **Application Load Balancer (ALB)**.
4. **Scheme:** `Internet-facing`. For public load balancer
4. **VPC:** Select the same VPC as your EC2 instances.
5. **AZ:** Select at least **two different AZ** for high availability. You should include your ALB in the same Availability Zones (AZs) as your EC2 instances to ensure proper traffic distribution and high availability.
6. **SECURITY GROUP** Assign security group maybe like to allow only http 80 (Inbound rules).

### **Step 2: Create a Target Group**
1. **Go to EC2** → **Target Groups** → **Create Target Group**.
2. **Target Type:** `Instance`.
3. **Protocol:** `HTTP`.
4. **Port:** `80`.
5. **Health Check Path:** `/`.
6. **Register Both EC2 Instances** to the target group.

### **Step 3: Link Load Balancer to Target Group**
1. Go back to your **ALB settings**.
2. Attach the **target group** to your listener rules.
3. Save the configuration.

---

# **2 Allow Load Balancer Traffic in Security Groups**
1. **Go to AWS Console** → **EC2** → **Security Groups**.
2. Find the **Security Group attached to your EC2 instances**.
3. **Edit Inbound Rules**:
   - Allow **HTTP (80)** from the **Load Balancer Security Group** (not `0.0.0.0/0`).
   - If using **HTTPS**, also allow **port 443**.

---

## **3 Test Your Deployment**
Now, try accessing your **app in a browser** via the **Load Balancer DNS**:
```sh
http://your-load-balancer-dns
```
🚀 Your app should now be **distributed across two EC2 instances** and highly available!

---

## **✅ Final Summary**


### **1 Create & Configure AWS Load Balancer**
- Create an **Application Load Balancer (ALB)**.
- Attach a **Target Group** with two EC2 instances.
- Allow **traffic only from the ALB** in EC2 security groups.

### **2 Test Deployment**
```sh
http://your-load-balancer-dns
```

🚀 **Now your Next.js app is fully deployed, load-balanced, and highly available on AWS!** 🎉

