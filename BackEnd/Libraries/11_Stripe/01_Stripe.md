# Stripe — Payment Processing

Stripe is a payment processing platform. The most common integration is **Checkout Sessions** — Stripe hosts the payment page and handles all payment details securely.

---

## 1. Installation

```bash
npm install stripe
```

---

## 2. Setup

### Environment Variables

```
# .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Initialize Stripe

```javascript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

---

## 3. How Checkout Sessions Work

```
1. Client clicks "Pay" → sends request to your server
2. Your server creates a Checkout Session with Stripe
3. Stripe returns a URL to a hosted payment page
4. Client is redirected to Stripe's payment page
5. Customer enters payment info on Stripe's page
6. On success → redirected to your success URL
7. On cancel → redirected to your cancel URL
8. Stripe sends a webhook to confirm payment
```

You **never** handle credit card numbers. Stripe's hosted page handles all sensitive payment data.

---

## 4. Creating a Checkout Session

```javascript
app.post('/api/checkout', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',                    // 'payment' (one-time) or 'subscription'

      // What the customer is buying
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-Shirt',
              description: 'Comfortable cotton t-shirt',
              images: ['https://example.com/tshirt.jpg'],
            },
            unit_amount: 2999,            // $29.99 in cents
          },
          quantity: 2,
        },
      ],

      // Where to redirect after payment
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',

      // Optional: pre-fill customer email
      customer_email: req.body.email,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

### Price Format

Stripe uses **cents** (smallest currency unit):

| Price | `unit_amount` |
|-------|--------------|
| $1.00 | `100` |
| $9.99 | `999` |
| $29.99 | `2999` |
| $100.00 | `10000` |

---

## 5. Dynamic Line Items (From Cart)

```javascript
app.post('/api/checkout', async (req, res) => {
  const { items } = req.body;
  // items = [{ name: 'T-Shirt', price: 29.99, quantity: 2 }, ...]

  const line_items = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: item.images || [],
      },
      unit_amount: Math.round(item.price * 100),  // Convert dollars to cents
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items,
    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    metadata: {
      userId: req.user.id,              // Custom data to reference later
      orderId: req.body.orderId,
    },
  });

  res.json({ url: session.url });
});
```

---

## 6. Checkout Session Options

```javascript
stripe.checkout.sessions.create({
  // Required
  mode: 'payment',                      // 'payment', 'subscription', or 'setup'
  line_items: [...],                     // What to charge for
  success_url: 'https://...',           // Redirect on success
  cancel_url: 'https://...',            // Redirect on cancel

  // Optional
  payment_method_types: ['card'],       // Payment methods to accept
  customer_email: 'user@example.com',   // Pre-fill email
  metadata: { key: 'value' },           // Custom data (retrieved in webhooks)
  shipping_address_collection: {        // Collect shipping address
    allowed_countries: ['US', 'CA'],
  },
  allow_promotion_codes: true,          // Allow discount codes
  expires_after: 30 * 60,              // Session expiry (seconds)
});
```

---

## 7. Webhooks (Payment Confirmation)

**Never rely on the success URL alone** — users can manually navigate to it. Use webhooks for reliable payment confirmation.

```javascript
import express from 'express';

// Webhook endpoint must use raw body (not JSON parsed)
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      // Fulfill the order
      console.log('Payment successful:', session.id);
      console.log('Customer email:', session.customer_email);
      console.log('Amount:', session.amount_total);
      console.log('Metadata:', session.metadata);

      // Update order status in your database
      // await Order.findByIdAndUpdate(session.metadata.orderId, { status: 'paid' });
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent.id);
      break;
    }
  }

  res.json({ received: true });
});
```

**Important:** The webhook route must be registered **before** `app.use(express.json())`, or use `express.raw()` specifically for that route, because Stripe needs the raw request body to verify the signature.

---

## 8. Retrieving a Session

After payment, verify the session on your success page:

```javascript
app.get('/api/checkout/verify', async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      res.json({
        success: true,
        email: session.customer_email,
        amount: session.amount_total / 100,  // Convert cents to dollars
      });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid session' });
  }
});
```

---

## 9. Client-Side (React)

```javascript
const handleCheckout = async () => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: cartItems,
      email: user.email,
    }),
  });

  const { url } = await response.json();
  window.location.href = url;  // Redirect to Stripe's payment page
};

return <button onClick={handleCheckout}>Checkout</button>;
```

---

## 10. Session Response Object

Key fields returned from `stripe.checkout.sessions.create()`:

```javascript
session = {
  id: 'cs_test_...',
  url: 'https://checkout.stripe.com/pay/cs_test_...',  // Redirect URL
  payment_status: 'unpaid',     // 'unpaid', 'paid', 'no_payment_required'
  status: 'open',               // 'open', 'complete', 'expired'
  amount_total: 5998,           // Total in cents
  currency: 'usd',
  customer_email: 'user@example.com',
  metadata: { userId: '123' },
  mode: 'payment',
};
```

---

## 11. Summary

| Step | Action |
|------|--------|
| Install | `npm install stripe` |
| Initialize | `new Stripe(process.env.STRIPE_SECRET_KEY)` |
| Create session | `stripe.checkout.sessions.create({ ... })` |
| Redirect | Send `session.url` to client |
| Confirm payment | Use webhooks (`checkout.session.completed`) |
| Verify | `stripe.checkout.sessions.retrieve(sessionId)` |

### The Complete Flow

```
Client → POST /api/checkout → Server creates session → Returns URL
Client → Redirects to Stripe URL → Customer pays → Stripe redirects to success_url
Stripe → POST /api/webhook → Server confirms payment → Updates database
```

### Key Rules

1. **Prices in cents** — `$29.99` = `2999`
2. **Use webhooks** for payment confirmation (not just the success URL)
3. **Raw body** for webhook endpoint (not JSON parsed)
4. **Never handle card numbers** — Stripe's hosted page handles them
5. **Test mode** uses `sk_test_...` keys (no real charges)
