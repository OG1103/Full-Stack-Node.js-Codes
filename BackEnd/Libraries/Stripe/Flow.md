# Setting Up Stripe Payments in a Full-Stack Project (Node.js and React)

This guide walks you through setting up Stripe payments in a full-stack project using **Node.js** for the backend and **React** for the frontend. It also explains how money flows during live transactions and how to transfer funds to specific bank accounts.

---

## Prerequisites

1. **Stripe Account**:
   - Create a [Stripe account](https://stripe.com/).
   - Obtain your **publishable key** and **secret key** from the Stripe Dashboard.

2. **Node.js and React Setup**:
   - Have a full-stack project set up with Node.js and React.
   - Install required libraries:
     ```bash
     npm install stripe express cors body-parser @stripe/react-stripe-js @stripe/stripe-js axios
     ```

3. **Environment Variables**:
   - Store your Stripe keys in a `.env` file:
     ```env
     STRIPE_SECRET_KEY=sk_test_your_secret_key
     STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
     ```

---

## Step 1: Backend Setup with Node.js

### 1.1 Install Stripe Library
```bash
npm install stripe
```

### 1.2 Initialize Stripe in Your Backend
Create a file `server.js`:

```javascript
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config(); // Load environment variables

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route: Create a Payment Intent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body; // Expecting amount in smallest currency unit (e.g., cents for USD)

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency, // e.g., 'usd'
      payment_method_types: ["card"],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Notes:
- The `create-payment-intent` endpoint creates a **PaymentIntent** object, which Stripe uses to track the lifecycle of a payment.
- The `clientSecret` returned is passed to the frontend to complete the payment process securely.

---

## Step 2: Frontend Setup with React

### 2.1 Install Required Libraries
```bash
npm install @stripe/react-stripe-js @stripe/stripe-js
```

### 2.2 Initialize Stripe in the Frontend
In your `App.js` or a higher-level component:

```javascript
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm"; // Your custom checkout form

const stripePromise = loadStripe("pk_test_your_publishable_key");

const App = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default App;
```

### 2.3 Create the Checkout Form
Create a file `CheckoutForm.js`:

```javascript
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Create Payment Intent from Backend
      const { data } = await axios.post("http://localhost:5000/create-payment-intent", {
        amount: 2000, // Example: $20.00 in cents
        currency: "usd",
      });

      const clientSecret = data.clientSecret;

      // Confirm Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("Payment successful!");
      }
    } catch (error) {
      setMessage("Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CheckoutForm;
```

### Notes:
- **`CardElement`**: Renders a prebuilt card input UI securely hosted by Stripe.
- **`stripe.confirmCardPayment`**: Completes the payment using the client secret from the backend.

---

## Step 3: Test the Integration

1. Use Stripe's test card numbers to simulate transactions:
   - Card Number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34).
   - CVC: Any 3-digit number (e.g., 123).

2. Start the backend:
   ```bash
   node server.js
   ```

3. Start the React app:
   ```bash
   npm start
   ```

4. Visit the app, enter the card details, and complete the payment.

---

## How Does Money Flow During Live Transactions?

### 1. Payment Collection
- When a user makes a payment, Stripe processes the funds and holds them in your **Stripe balance**.

### 2. Stripe Payouts
- Stripe automatically transfers funds from your balance to your linked **bank account** based on your payout schedule (daily, weekly, or monthly).
- You can configure payout settings in the **Stripe Dashboard**.

### 3. Directing Payments to Specific Accounts

Stripe uses **connected accounts** to direct payments to specific recipients. This is commonly used in marketplace scenarios where payments need to go to individual sellers or service providers.

#### What Are Connected Accounts?
- **Connected accounts** are sub-accounts linked to your platform's Stripe account.
- These accounts represent your users (e.g., sellers, vendors, service providers).
- Each connected account has its own Stripe account ID (e.g., `acct_xxxxxxxxxxxxx`).
- You can create connected accounts using **Stripe Connect**.

#### Types of Connected Accounts
1. **Standard Accounts**:
   - Fully managed by the user (e.g., a seller).
   - Users log in directly to Stripe to manage their account.
2. **Express Accounts**:
   - A simpler setup where your platform handles most Stripe interactions.
3. **Custom Accounts**:
   - Fully controlled by your platform.
   - The user does not interact with Stripe directly.

#### Example: Sending Funds to a Connected Account
To direct a payment to a specific connected account:

1. Add the `transfer_data.destination` field when creating a PaymentIntent:

```javascript
// In Back End
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000, // Amount in cents
  currency: "usd",
  payment_method_types: ["card"],
  transfer_data: {
    destination: "acct_xxxxxxxxxxxxx", // Connected Account ID
  },
});
```

2. Breakdown:
   - **`amount`**: Total amount the customer is charged.
   - **`transfer_data.destination`**: Specifies the connected account to receive the funds.
   - Stripe deducts its fees and your platform fees (if applicable) before transferring the remaining amount to the connected account.

3. Example Use Case:
   - A marketplace platform where a customer pays $50 for a product.
   - The platform deducts a $5 service fee, and Stripe deducts its processing fee.
   - The remaining balance is automatically transferred to the seller’s connected account.

---

### Payout to Bank Accounts

To send funds to a **specific bank account**:
1. Ensure the connected account is set up with a verified bank account.
2. Stripe will automatically transfer funds from the connected account's balance to their linked bank account based on the payout schedule.
3. You can manage connected accounts and their payout settings via the Stripe Dashboard or API.

---

## Summary

| Component       | Role                                              |
|-----------------|--------------------------------------------------|
| **Backend**     | Handles payment creation, verification, and Stripe integration. |
| **Frontend**    | Renders secure payment forms using Stripe Elements. |
| **Stripe**      | Processes payments and securely handles card details. |

This setup ensures PCI compliance, secure transactions, and flexibility for payment processing. Let me know if further clarification is needed!
