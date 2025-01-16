# Understanding Stripe Payment Flow: From Form Submission to Fund Transfer

This guide explains how payments are processed in Stripe, from the client filling out a form to the successful transfer of funds to a bank account. It includes detailed steps for both development (test mode) and live transactions.

---

## How Stripe Payment Flow Works

### Step-by-Step Flow:

1. **Client Interaction:**

   - A customer fills out a payment form on your website or application.
   - The form includes fields for sensitive information like card details (e.g., Card Number, Expiry, CVC). Stripe's **Elements** is used to securely handle these fields.

2. **Requesting a Payment Intent (Backend):**

   - When the customer submits the form, the frontend sends a request to your backend.
   - Your backend creates a **PaymentIntent** using Stripe's API, specifying the amount, currency, and payment method types (e.g., `card`)., and optionally a destination account (if routing funds to a connected account).
   - The backend sends the **client secret** (a unique identifier for the PaymentIntent) back to the frontend.

3. **Confirming Payment (Frontend):**

   - The frontend uses Stripe's SDK (`@stripe/react-stripe-js`) to confirm the payment by calling `stripe.confirmCardPayment(clientSecret, { payment_method })`.
   - Stripe processes the payment using the provided payment details.
   - If successful, the frontend receives a confirmation, and the customer is notified (e.g., "Payment Successful!").

4. **Funds Processing by Stripe:**

   - Stripe deducts its fees (e.g., 2.9% + $0.30 for card payments) and adds the remaining funds to your **Stripe balance**.

5. **Funds Transfer to Bank Account:**

   - Stripe automatically transfers the funds from your Stripe balance to your linked bank account based on your payout schedule (daily, weekly, or monthly).

6. **Specifying Alternative Destinations:**
   - For marketplaces or platforms, payments can be directed to **connected accounts** using the `transfer_data.destination` field when creating a PaymentIntent.

---

## Development vs. Live Transactions

### Development (Test Mode):

1. **Setup:**

   - Use your **test API keys** from Stripe.
   - Payments are simulated, and no actual money is transferred.

2. **Testing:**

   - Use Stripe's [test card numbers](https://stripe.com/docs/testing) to simulate successful and failed transactions.
   - Example Test Card:
     - Card Number: `4242 4242 4242 4242`
     - Expiry: Any future date (e.g., `12/34`)
     - CVC: Any 3-digit number (e.g., `123`)

3. **Example Workflow:**
   - The frontend calls the backend to create a PaymentIntent.
   - Stripe responds with a test `client_secret`.
   - The frontend confirms the payment, simulating a successful transaction.
   - No real funds are transferred.

### Live Transactions:

1. **Setup:**

   - Use your **live API keys** from Stripe.
   - Ensure your Stripe account is verified with all required details (e.g., business information, bank account).

2. **Processing Payments:**

   - The workflow is the same as in test mode, but payments involve real funds.
   - Card details are tokenized and securely processed by Stripe.

3. **Funds Handling:**
   - Stripe deducts its processing fees and adds the remaining balance to your Stripe account.
   - Funds are transferred to your linked bank account based on your payout schedule.

---

## Detailed Example of Payment Flow

### Development (Test Mode):

#### Backend Code (Node.js):

```javascript
import Stripe from "stripe";
const stripe = new Stripe("sk_test_your_secret_key");

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency, // e.g., 'usd'
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
```

#### Frontend Code (React):

```javascript
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/create-payment-intent", {
        amount: 2000, // $20.00
        currency: "usd",
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("Payment successful!");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CheckoutForm;
```

### Live Transactions:

- Replace `sk_test_` with `sk_live_` and `pk_test_` with `pk_live_` in your backend and frontend.
- Ensure your Stripe account and linked bank account are verified.
- Real funds will be transferred upon successful payment.

---

## Specifying Alternative Destinations

### Connected Accounts:

- Use **Stripe Connect** to direct payments to sub-accounts (e.g., sellers on your platform).
- Specify the destination account using the `transfer_data.destination` field:

#### Backend Example:

```javascript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000, // $50.00
  currency: "usd",
  payment_method_types: ["card"],
  transfer_data: {
    destination: "acct_xxxxxxxxxxxxx", // Connected Account ID
  },
});
//res.json({ clientSecret: paymentIntent.client_secret });
```

### Flow Explanation:

1. **If the Funds Should Go to Your Account:**
   - Do **not** include a `transfer_data.destination` field.
   - Funds are deposited into **your Stripe account** (associated with your API keys).
   - Stripe automatically transfers these funds to your linked bank account based on your payout schedule.

#### Example Back End:

```javascript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000, // $50.00
  currency: "usd",
  payment_method_types: ["card"],
});
//res.json({ clientSecret: paymentIntent.client_secret });
```

- Here, the funds go to your Stripe account (the one linked to your secret key).

2. **If the Funds Should Go to a Client (Connected Account):**
   - Include the `transfer_data.destination` field with the **connected account ID** of the client.
   - Stripe routes the funds to the specified connected account instead of your own.

#### Example Back End:

```javascript
// In Back End
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000, // $50.00
  currency: "usd",
  payment_method_types: ["card"],
  transfer_data: {
    destination: "acct_xxxxxxxxxxxxx", // Connected Account ID
  },
});
//res.json({ clientSecret: paymentIntent.client_secret });
```

3. **Connected Account Payouts:**

   - Each connected account must have a verified **linked bank account**.
   - Stripe automatically transfers funds from the connected account to the client's bank account based on their payout schedule.

4. **How to Create Connected Accounts:**

   - Use the **Stripe Connect API** to create connected accounts for your clients.
   - Example:

   ```javascript
   const account = await stripe.accounts.create({
     type: "express", // Options: 'standard', 'express', 'custom'
     country: "US",
     email: "client@example.com",
   });
   console.log(account.id); // Save this connected account ID for future use
   ```

---

## Purpose of Secret and Publishable Keys

1. **Secret Key (`sk_`)**:

   - Used on the backend for sensitive operations such as creating PaymentIntents, managing connected accounts, and handling payouts.
   - Never expose your secret key in frontend code.

   #### Example Usage:

   ```javascript
   const stripe = require("stripe")("sk_live_your_secret_key");
   const paymentIntent = await stripe.paymentIntents.create({
     amount: 5000,
     currency: "usd",
   });
   ```

2. **Publishable Key (`pk_`)**:

   - Used on the frontend to securely collect and tokenize card details using Stripe Elements.
   - Safe to expose in the browser as it cannot perform sensitive operations.

   #### Example Usage:

   ```javascript
   import { loadStripe } from "@stripe/stripe-js";
   const stripePromise = loadStripe("pk_live_your_publishable_key");
   ```

---

## Key Note on Live Transactions

- In **live mode**, money is sent to the Stripe account linked to your **API keys**.
- Ensure you replace your `test` API keys (`sk_test_` and `pk_test_`) with your `live` API keys (`sk_live_` and `pk_live_`) to process real transactions.
- Funds will automatically be deposited into the bank account linked to your Stripe account based on your payout schedule.
- If you want to direct funds to a different destination, such as a client’s account, you need to:
  1. Use **Stripe Connect** to create a connected account for the client.
  2. Specify the client’s connected account ID in the `transfer_data.destination` field when creating the `PaymentIntent`.

#### Example:

```javascript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000, // $50.00
  currency: "usd",
  payment_method_types: ["card"],
  transfer_data: {
    destination: "acct_xxxxxxxxxxxxx", // Connected Account ID
  },
});
```

- In this case, the funds will be routed to the specified connected account instead of your own Stripe balance.

---

This guide provides a comprehensive explanation of how Stripe processes payments, the purpose of secret and publishable keys, and how to manage payouts both to your account and alternative destinations. Let me know if you need further clarification or additional examples!
