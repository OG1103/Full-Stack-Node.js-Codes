# Stripe Connected Accounts: Onboarding, Access, and Developer Control

This guide explains how Stripe connected accounts work, the onboarding process, types of connected accounts, and the level of access users and developers have. It also covers how onboarding forces users to create a Stripe account and details the flow for using connected accounts effectively.

---

## 1. Onboarding Process

**Onboarding** is the process where users provide Stripe with the required information to verify their identity, link a bank account, and comply with regulatory requirements. Onboarding completion is mandatory for connected accounts to start receiving funds.

### **How Onboarding Works**

1. **When Onboarding Starts**:

   - The process begins after you create a connected account using the `stripe.accounts.create()` API.
   - The user receives a link to complete onboarding.

2. **What Happens During Onboarding**:

   - Users must provide:
     - Personal or business details.
     - Bank account information for payouts.
     - Tax details (if required).
   - Stripe validates the information provided.

3. **Account Creation**:

   - During onboarding, Stripe requires the user to create a **Stripe account** to access their dashboard for certain account types (**Standard** and **Express**).

4. **When Onboarding Is Completed**:
   - Onboarding is considered complete when:
     - The user provides all required details.
     - Stripe successfully verifies the information.
     - For Standard and Express accounts, the user creates their Stripe account login.

---

## 2. Is Creating a Stripe Account Obligatory?

The requirement for creating a Stripe account depends on the type of connected account:

### **Standard Accounts**:

- **Mandatory Stripe Account Creation**:
  - Users must create a Stripe account during onboarding to access the full Stripe dashboard.
- **Purpose**:
  - Enables users to fully manage their connected account independently.
  - They can log in to [Stripe Dashboard](https://dashboard.stripe.com) to view transactions, payouts, and balances and configure account settings like payout schedules.

### **Express Accounts**:

- **Mandatory Stripe Account Creation**:
  - Users must create a Stripe account to access the **limited Express dashboard**.
- **Purpose**:
  - Allows users to view payouts and balances but not configure advanced settings like payout schedules (controlled by the platform).

### **Custom Accounts**:

- **No Stripe Account Creation**:
  - Users do not create or log in to a Stripe account.
- **Purpose**:
  - The platform has full control over the account and manages all configurations, transactions, and payouts.

---

## 3. Types of Connected Accounts

### **1. Standard Accounts**

- **Access**:
  - Full access to the Stripe dashboard.
  - Users can manage their account, view transactions and balances, and configure payout schedules.
- **Use Case**:
  - Best for scenarios where users need full autonomy over their accounts.
- **Developer Role**:
  - The developer retains API access to monitor transactions, route payments, and view account details.

### **2. Express Accounts**

- **Access**:
  - Limited access to a Stripe-hosted Express dashboard.
  - Users can view balances and payouts but cannot configure advanced settings like payout schedules.
- **Use Case**:
  - Ideal for platforms where users need minimal interaction with Stripe.
- **Developer Role**:
  - The developer sets the initial payout schedule during account creation and can modify it later via the Stripe API.
- **Payout Schedule**:
  - Initially set by the developer using:
    ```javascript
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: "client@example.com",
      settings: {
        payouts: {
          schedule: { interval: "weekly" }, // Options: 'daily', 'weekly', 'monthly'
        },
      },
    });
    console.log(`Express account created: ${account.id}`);
    ```
- and can be updated later using :
  ````javascript
      await stripe.accounts.update("acct_xxxxxxxxxxxxx", {
      settings: {
          payouts: {
          schedule: { interval: "weekly" }, // Options: 'daily', 'weekly', 'monthly'
          },
      },
      });
      console.log("Payout schedule updated");
      ```
  ````

### **3. Custom Accounts**

- **Access**:
  - No dashboard for users.
  - The platform fully manages the account via the Stripe API.
- **Use Case**:
  - Suitable for platforms requiring full control over the user's account.
- **Developer Role**:
  - The developer handles everything, including onboarding, payout management, and transaction monitoring.
- **Payout Schedule**:
  - The developer sets and controls the payout schedule entirely via the API. Users have no ability to configure this.
  - During account creation, the payout schedule can be defined:
    ```javascript
    const account = await stripe.accounts.create({
      type: "custom",
      country: "US",
      email: "client@example.com",
      settings: {
        payouts: {
          schedule: { interval: "monthly" },
        },
      },
    });
    console.log(`Custom account created: ${account.id}`);
    ```
  - and can be updated later using :
    ````javascript
        await stripe.accounts.update("acct_xxxxxxxxxxxxx", {
        settings: {
            payouts: {
            schedule: { interval: "weekly" }, // Options: 'daily', 'weekly', 'monthly'
            },
        },
        });
        console.log("Payout schedule updated");
        ```
    ````

---

## 4. Developer Access to Connected Accounts

Regardless of the account type, developers maintain full API-level access to connected accounts.

### **What Developers Can Do**:

1. **View Account Details**:

   ```javascript
   const account = await stripe.accounts.retrieve("acct_xxxxxxxxxxxxx");
   console.log(account);
   ```

   - Fetch account details, such as email, country, verification status, and settings.

2. **Monitor Balances**:

   ```javascript
   const balance = await stripe.balance.retrieve({
     stripeAccount: "acct_xxxxxxxxxxxxx",
   });
   console.log(balance);
   ```

   - View available and pending funds.

3. **Check Payouts**:

   ```javascript
   const payouts = await stripe.payouts.list({
     stripeAccount: "acct_xxxxxxxxxxxxx",
   });
   console.log(payouts);
   ```

   - Retrieve payout history.

4. **Route Payments**:

   ```javascript
   const paymentIntent = await stripe.paymentIntents.create({
     amount: 5000, // $50.00
     currency: "usd",
     payment_method_types: ["card"],
     transfer_data: {
       destination: "acct_xxxxxxxxxxxxx", // Connected account ID
     },
   });
   console.log(`PaymentIntent created: ${paymentIntent.id}`);
   ```

   - Route funds to the connected account.

5. **Update Settings**:
   ```javascript
   await stripe.accounts.update("acct_xxxxxxxxxxxxx", {
     settings: {
       payouts: {
         schedule: { interval: "weekly" }, // Options: 'daily', 'weekly', 'monthly'
       },
     },
   });
   console.log("Payout schedule updated");
   ```
   - Modify payout schedules and other settings.

---

## 5. Flow of Connected Accounts

### **Step-by-Step Flow**:

1. **Create the Connected Account**:

   - Use the `stripe.accounts.create()` API to create the account.
   - Example:
     ```javascript
     const account = await stripe.accounts.create({
       type: "express", // or 'standard', 'custom'
       country: "US",
       email: "client@example.com",
     });
     console.log(`Connected account created: ${account.id}`);
     ```

2. **Send Onboarding Link**:

   - Generate and send an onboarding link for the user to complete:
     ```javascript
     const accountLink = await stripe.accountLinks.create({
       account: account.id,
       refresh_url: "https://yourplatform.com/reauth",
       return_url: "https://yourplatform.com/success",
       type: "account_onboarding",
     });
     console.log(`Onboarding link: ${accountLink.url}`);
     ```

3. **User Completes Onboarding**:

   - The user provides required details, creates a Stripe account (if applicable), and links their bank account.

4. **Start Routing Payments**:

   - Use the `transfer_data.destination` field in a PaymentIntent to send funds to the connected account.

5. **Monitor and Manage Accounts**:
   - Use Stripe’s API to monitor balances, payouts, and transactions.

---

## 6. Summary

- **Onboarding**:

  - Standard and Express accounts require the user to create a Stripe account.
  - Custom accounts do not require a Stripe account; the platform manages everything.

- **Access Levels**:

  - Standard accounts have full dashboard access.
  - Express accounts have limited dashboard access.
  - Custom accounts have no dashboard access; the platform controls everything.

- **Developer Control**:
  - Developers retain API-level access to all connected accounts, regardless of type.

This guide explains how onboarding, account types, and developer access work together to manage Stripe connected accounts effectively. Let me know if further clarification is needed!
