# Creating Connected Accounts

This guide explains how to create connected accounts using Stripe Connect, route payments to those accounts, and ensure payouts are sent to the connected account holders' bank accounts.

---

## 1. What Are Connected Accounts?

Connected accounts are Stripe accounts created on behalf of your platform's users (e.g., clients, vendors) to receive payments and payouts. These accounts are linked to your Stripe platform and can be one of three types:

- **Standard**: Full access to Stripe dashboard.
- **Express**: Limited access through Stripe-hosted interfaces.
- **Custom**: Fully controlled by your platform.

---

## 2. Creating a Connected Account

To create a connected account for a user:

### Example Code:

```javascript
const account = await stripe.accounts.create({
  type: "express", // Options: 'express', 'standard', 'custom'
  country: "US", // The recipient's country
  email: "client@example.com", // The recipient's email
});
console.log(`Connected account created: ${account.id}`);
```

### Key Points:

- **`type`**: Determines the account type (`express`, `standard`, `custom`).
- **`country`**: Must match the user's location.
- **`email`**: The recipient’s email address. This email will receive onboarding instructions and notifications.

---

## 3. Completing Onboarding

For Express or Custom accounts, users must complete onboarding by providing required details, including:

- Personal or business information.
- Bank account details for payouts.
- Acceptance of Stripe’s terms.

### Generating an Onboarding Link:

```javascript
const accountLink = await stripe.accountLinks.create({
  account: account.id, // Connected account ID
  refresh_url: "https://yourplatform.com/reauth",
  return_url: "https://yourplatform.com/success",
  type: "account_onboarding",
});
console.log(`Onboarding link: ${accountLink.url}`);
```
- **`accountLink.url`**: Send this link to the client via email, SMS, or in-app notifications, and prompt them to complete the onboarding process.
- **`refresh_url`**: URL users are redirected to if onboarding is incomplete.
- **`return_url`**: URL users are redirected to after completing onboarding.


---

## 4. Routing Payments to Connected Accounts

Once the connected account is ready, you can route payments to it using the `transfer_data.destination` field in a PaymentIntent.

### Example Code:

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

### Key Points:

- The `destination` field ensures that funds are routed to the connected account instead of your platform's Stripe balance.
- Stripe deducts fees before adding funds to the connected account.

---

## 5. Payouts to Bank Accounts

### How Funds Reach the Connected Account Holder:

1. **Connected Account Balance**:

   - Once payment is processed, funds are added to the connected account’s Stripe balance.

2. **Bank Account Payouts**:

   - During onboarding, the user provides their bank account details.
   - Stripe automatically transfers funds to the user’s bank account based on their payout schedule (daily, weekly, or monthly).

3. **Verification**:
   - Ensure the connected account is fully onboarded before routing payments:
     ```javascript
     const account = await stripe.accounts.retrieve("acct_xxxxxxxxxxxxx");
     if (account.details_submitted && account.charges_enabled) {
       console.log("Account is ready to receive payouts!");
     } else {
       console.log("Client must complete onboarding.");
     }
     ```

### Notes:

- If the user hasn’t completed onboarding or linked a bank account, funds remain in their Stripe balance.
- Standard accounts allow users to manage payouts through their own Stripe dashboard.

---

## 6. Managing Connected Accounts

As the platform owner, you can view and modify settings for connected accounts using Stripe’s API.

### **Viewing Account Details**

To retrieve details of a connected account:

```javascript
const account = await stripe.accounts.retrieve("acct_xxxxxxxxxxxxx");
console.log(account);
```

- **Output Example:**
  ```json
  {
    "id": "acct_xxxxxxxxxxxxx",
    "type": "express",
    "email": "client@example.com",
    "charges_enabled": true,
    "payouts_enabled": true,
    "details_submitted": true,
    "country": "US",
    "settings": {
      "payouts": {
        "schedule": {
          "interval": "daily"
        }
      }
    }
  }
  ```

### **Viewing Account Balance**

To check the balance of a connected account:

```javascript
const balance = await stripe.balance.retrieve({
  stripeAccount: "acct_xxxxxxxxxxxxx",
});
console.log(balance);
```

- **What You Get**: Details about available and pending funds.

### **Viewing Payouts**

To list payouts for a connected account:

```javascript
const payouts = await stripe.payouts.list({
  stripeAccount: "acct_xxxxxxxxxxxxx",
});
console.log(payouts);
```

- **What You Get**: Information on completed, pending, or failed payouts.

### **Modifying Account Settings**

To update a connected account’s settings (e.g., payout schedule):

```javascript
await stripe.accounts.update("acct_xxxxxxxxxxxxx", {
  settings: {
    payouts: {
      schedule: {
        interval: "weekly", // Options: 'daily', 'weekly', 'monthly'
      },
    },
  },
});
console.log("Payout schedule updated");
```

- **What You Can Change**:
  - Payout schedule.
  - Default currency.
  - Account branding settings (e.g., logo).

---

## 7. FAQs

### Does the Recipient Need a Stripe Account?

- No, they don’t need to sign up for Stripe manually.
- You create a connected account for them via the API, and they complete onboarding.

### How Are Payouts Handled?

- Stripe automatically transfers funds from the connected account balance to the user’s bank account.

### What Happens If Onboarding Isn’t Completed?

- Funds remain in the connected account’s balance until onboarding is finished.

---

## Full Workflow Example

### Backend Code:

```javascript
import Stripe from "stripe";
const stripe = new Stripe("sk_test_your_secret_key");

// Step 1: Create a connected account
const account = await stripe.accounts.create({
  type: "express",
  country: "US",
  email: "client@example.com",
});
console.log(`Connected account created: ${account.id}`);

// Step 2: Generate an onboarding link
const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: "https://yourplatform.com/reauth",
  return_url: "https://yourplatform.com/success",
  type: "account_onboarding",
});
console.log(`Onboarding link: ${accountLink.url}`);

// Step 3: Create a PaymentIntent and route funds to the connected account
const paymentIntent = await stripe.paymentIntents.create({
  amount: 10000, // $100.00
  currency: "usd",
  payment_method_types: ["card"],
  transfer_data: {
    destination: account.id, // Route funds to the connected account
  },
});
console.log(`PaymentIntent created: ${paymentIntent.id}`);
```

---

This guide explains the full process of creating connected accounts, routing payments, managing account settings, and ensuring payouts to connected account holders’ bank accounts. Let me know if you need further clarification!
