# Stripe Webhooks: Comprehensive Guide

Webhooks in Stripe are used to listen for events that happen in your Stripe account, such as successful payments, subscription updates, or refunds. This guide explains how to set up and use webhooks with **Node.js (Express)** and **React**, using modern ES6 syntax.

---

## 1. What Are Webhooks?

Webhooks are automated messages sent from Stripe to your server when specific events occur in your Stripe account. They allow you to:

- Respond to payment success or failure events.
- Update your database after subscription changes.
- Send notifications to users for refunds, chargebacks, etc.

### **Common Stripe Events**

Some commonly used webhook events include:

- `payment_intent.succeeded`: When a payment is successfully completed.
- `payment_intent.payment_failed`: When a payment fails.
- `invoice.payment_succeeded`: When an invoice is paid.
- `customer.subscription.created`: When a subscription is created.

---

## 2. Setting Up Webhooks in Stripe Dashboard

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com).
2. Navigate to **Developers > Webhooks**.
3. Click **Add Endpoint** and provide:
   - **URL**: The endpoint where Stripe will send webhook events (e.g., `https://yourdomain.com/webhooks` in production or `http://localhost:5000/webhooks` for testing).
   - **Events to Send**: Choose specific events you want to listen for (e.g., `payment_intent.succeeded`).
4. Copy the **Signing Secret**. This is used to verify that requests come from Stripe.

---

## 3. Implementing Webhooks in Node.js with Express

### **Step 1: Install Dependencies**

Install the necessary Stripe package:

```bash
npm install stripe body-parser
```

### **Step 2: Create the Webhook Endpoint**

Here's an example of setting up a webhook in an Express server:

```javascript
import express from "express";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe("sk_test_your_secret_key"); // Use your secret key

// Use raw body for Stripe signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

const endpointSecret = "whsec_your_signing_secret"; // Replace with your signing secret

// Webhook endpoint
app.post("/webhooks", (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
      break;

    case "invoice.payment_succeeded":
      const invoice = event.data.object;
      console.log(`Invoice paid: ${invoice.id}`);
      break;

    case "customer.subscription.created":
      const subscription = event.data.object;
      console.log(`Subscription created: ${subscription.id}`);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).send("Received!");
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
```

### **Key Points**

- **Raw Body Parsing**: Stripe requires the raw request body for signature verification.
- **Signature Verification**: Always verify the webhook signature using the `stripe-signature` header and the endpoint secret.
- **Event Handling**: Use a `switch` statement to handle different event types.
- **Automatic Event Triggers**: Stripe automatically sends events to your configured webhook URL when related actions, such as payment processing, occur on the frontend or backend.

---

## 4. The `event` Object

The `event` object is sent by Stripe to your webhook endpoint and contains detailed information about the event.

### **Structure of the `event` Object**

```json
{
  "id": "evt_xxxxxxxxxxxxx",
  "object": "event",
  "api_version": "2020-08-27",
  "created": 1622487600,
  "livemode": false,
  "pending_webhooks": 1,
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_xxxxxxxxxxxxx",
      "object": "payment_intent",
      ... // Full details of the PaymentIntent
    }
  }
}
```

### **Key Fields**

- **`id`**: Unique identifier for the event (e.g., `evt_xxxxxxxxxxxxx`).
- **`type`**: The type of event (e.g., `payment_intent.succeeded`).
- **`livemode`**: Indicates if the event occurred in live mode (`true`) or test mode (`false`).
- **`pending_webhooks`**: Number of remaining webhook attempts.
- **`data.object`**: Contains the detailed object related to the event (e.g., a `PaymentIntent`, `Invoice`, or `Subscription`).

### ** All Types Of Events (event.type)**

- Visit: `https://docs.stripe.com/api/events/types?utm_source=chatgpt.com`

### **Example: Accessing Data**

To retrieve details of the `PaymentIntent` from the event:

```javascript
if (event.type === "payment_intent.succeeded") {
  const paymentIntent = event.data.object;
  console.log(`Payment ID: ${paymentIntent.id}`);
  console.log(`Amount Received: ${paymentIntent.amount_received}`);
}
```

---

## 5. Testing Webhooks Locally

Stripe provides the **Stripe CLI** to test webhooks locally.

### **Step 1: Install Stripe CLI**

Follow the instructions to install the [Stripe CLI](https://stripe.com/docs/stripe-cli).

### **Step 2: Forward Events to Localhost**

Run the following command to forward webhook events to your local server:

```bash
stripe listen --forward-to http://localhost:5000/webhooks
```

### **Step 3: Trigger Test Events**

Trigger test events using the Stripe CLI:

```bash
stripe trigger payment_intent.succeeded
```

This will send a test event to your local webhook endpoint.

---

## 6. React: Handling Webhook Notifications

Although webhooks are processed on the backend, you may want to display notifications or updates to users in the frontend (e.g., payment success messages).

### **Example: Fetch Notifications from Backend**

Here’s how you can fetch webhook-related updates in a React app:

```javascript
import React, { useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch("http://localhost:5000/notifications"); // Endpoint to fetch notifications
      const data = await response.json();
      setNotifications(data);
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
```

### **Backend Endpoint for Notifications**

Modify your webhook handler to save notifications:

```javascript
let notifications = []; // Temporary in-memory storage

app.post("/webhooks", (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      notifications.push({ message: `Payment succeeded: ${event.data.object.id}` });
      break;

    case "invoice.payment_succeeded":
      notifications.push({ message: `Invoice paid: ${event.data.object.id}` });
      break;

    default:
      notifications.push({ message: `Unhandled event type: ${event.type}` });
  }

  res.status(200).send("Received!");
});

app.get("/notifications", (req, res) => {
  res.json(notifications);
});
```
