# Stripe Overview and Integration in Express

Stripe is a popular payment processing platform that allows businesses to accept payments online and in mobile applications. It supports a wide range of payment methods, including credit and debit cards, wallets (e.g., Apple Pay, Google Pay), and even ACH bank transfers. Stripe provides a simple API to integrate payment processing into your application.

This guide explains how to integrate Stripe into an Express application, configure it, and use it for processing payments.

---

## 1. Getting Started with Stripe

### Prerequisites
1. Create a [Stripe account](https://stripe.com/).
2. Obtain your **API keys** from the Stripe Dashboard:
   - **Publishable key**: Used on the frontend for securely collecting payment details.
   - **Secret key**: Used on the backend for processing payments and other sensitive operations.

### Installation
Install the Stripe Node.js library in your Express project:

```bash
npm install stripe
```

---

## 2. Configuring Stripe in an Express Application

### Setting Up Stripe in Your Backend

#### Step 1: Import and Initialize Stripe

```javascript
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Use your secret key
```

#### Step 2: Create Routes for Payment Handling

Add routes to handle payment processing. Below are examples of creating a payment intent and confirming payments.

**Example Payment Route**:

```javascript
import express from "express";
const router = express.Router();

// Create a Payment Intent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body; // Amount in cents, currency (e.g., "usd")

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret, // Send client secret to the frontend
    });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).json({ error: "Failed to create payment intent." });
  }
});

export default router;
```

### Middleware for Secure Configuration
Store your API keys securely using environment variables:

1. Add the keys to your `.env` file:
   ```env
   STRIPE_SECRET_KEY=sk_test_1234567890abcdef
   STRIPE_PUBLISHABLE_KEY=pk_test_1234567890abcdef
   ```

2. Use `dotenv` to load environment variables:
   ```javascript
   import dotenv from "dotenv";
   dotenv.config();
   ```

---

## 3. Frontend Integration

To collect payment details, Stripe provides the **Stripe.js** library and **Stripe Elements**, which ensure PCI compliance and secure handling of sensitive card information.

### Installation
Include the Stripe.js library on your frontend:

```bash
npm install @stripe/stripe-js
```

### Example Frontend Code

1. Initialize Stripe with your publishable key:

```javascript
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
```

2. Create a Payment Form:

```javascript
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load the Stripe instance with your publishable key
const stripePromise = loadStripe("your-publishable-key");

const StripePayment = () => {
  const stripe = useStripe(); // Stripe instance
  const elements = useElements(); // Elements instance
  const [message, setMessage] = useState(""); // To display payment messages
  const [loading, setLoading] = useState(false); // To manage loading state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripe is not loaded yet!");
      return;
    }

    setLoading(true); // Show loading state

    try {
      // Call your backend to create a PaymentIntent
      const response = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 5000, currency: "usd" }), // $50.00
      });

      const { clientSecret } = await response.json();

      // Confirm the payment with the client secret and card details
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement), // Collect card details
        },
      });

      if (error) {
        setMessage(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === "succeeded") {
        setMessage("Payment successful!");
      }
    } catch (err) {
      setMessage(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h2>Stripe Payment</h2>
        <form onSubmit={handleSubmit}>
          <CardElement />
          <button type="submit" disabled={!stripe || loading} style={{ marginTop: "20px" }}>
            {loading ? "Processing..." : "Pay $50.00"}
          </button>
        </form>
        {message && <p style={{ marginTop: "20px" }}>{message}</p>}
      </div>
    </Elements>
  );
};

export default StripePayment;

// passing the loadStripe instance to the <Elements> container is a required step when using Stripe's Stripe.js and React Stripe.js libraries. This is not something you create yourself but is part of Stripe's built-in system to securely and efficiently manage payment processes.

// Search more on library to generate stripe checkout form 
```

---

## 4. Testing Payments

Stripe provides a test mode to simulate payments without real transactions. Use the test API keys and Stripe's test card numbers (e.g., `4242 4242 4242 4242` for successful payments).

### Test Card Details
| Card Number        | Status            | Additional Info            |
|--------------------|-------------------|----------------------------|
| `4242 4242 4242 4242` | Payment succeeds  | Any CVC, future expiration |
| `4000 0000 0000 9995` | Payment requires 3D Secure | Use this to test 3D Secure |

---

## 5. Webhooks for Event Handling

Stripe Webhooks allow you to handle events like successful payments, refunds, or disputes. Configure your webhook endpoint to listen for specific events.

### Example Webhook Endpoint

```javascript
router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log("Payment succeeded:", paymentIntent.id);
  }

  res.status(200).json({ received: true });
});
```

---

## 6. Key Stripe Features

- **Subscriptions**: Manage recurring billing with Stripe's subscription API.
- **Checkout**: Use prebuilt hosted pages for payment collection.
- **Payment Links**: Create shareable payment links for quick transactions.
- **Fraud Prevention**: Stripe Radar helps detect and prevent fraudulent transactions.

---

## Summary

1. Install the Stripe Node.js library and initialize it with your secret key.
2. Create backend routes for handling payment intents and other Stripe operations.
3. Use Stripe.js and Stripe Elements on the frontend to securely collect payment details.
4. Test transactions using Stripe's test mode and test card details.
5. Configure webhooks to handle post-payment events like payment success or refunds.

Stripe's comprehensive documentation provides further details on advanced features and best practices. Explore the [Stripe Docs](https://stripe.com/docs) for more information.