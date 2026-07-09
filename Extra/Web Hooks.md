# Webhooks

---

## What is a Webhook?

A webhook is a way for an **external service to notify your server** when something happens.

Instead of your app constantly asking "did anything change?" — the external service knocks on your door the moment something worth telling you about occurs.

> **One-line definition:** You give an external service a URL. When an event happens on their end, they send an HTTP POST request to that URL. You react to it.

---

## The Core Idea — Who Calls What

There are two fundamentally different communication patterns:

| Pattern          | Who starts it             | Example                                     |
| ---------------- | ------------------------- | ------------------------------------------- |
| Regular API call | **You** call their server | Your app calls `api.stripe.com/charges`     |
| Webhook          | **They** call your server | Stripe calls `yoursite.com/webhooks/stripe` |

With a webhook, **you write the logic, they pull the trigger.**

You set up an endpoint on your server. You register that URL with the external service (Stripe, GitHub, Twilio, etc.). You write the code that runs when they call it. And then you wait — the external service is the one that decides _when_ to fire it, based on events happening on their end.

---

## A Real Example — Stripe Payment

Imagine you're building an e-commerce site. A customer pays. Here's what happens:

### Step 1 — User clicks "Pay" in the browser

```javascript
// Browser-side JavaScript
async function handleCheckout() {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: cart, userId: user.id }),
  });
  const { clientSecret } = await res.json();

  // Use Stripe.js to collect card details and confirm payment
  const { error } = await stripe.confirmCardPayment(clientSecret);
  if (!error) showWaitingScreen(); // "Processing your order..."
}
```

### Step 2 — Your backend creates a PaymentIntent with Stripe

```javascript
// Express backend — POST /api/checkout
app.post("/api/checkout", async (req, res) => {
  const { items, userId } = req.body;
  const amount = calculateTotal(items); // e.g. 4999 cents = $49.99

  // Tell Stripe "a payment of $49.99 is coming"
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata: { userId, items: JSON.stringify(items) },
  });

  // Save a pending order in your DB
  await db.orders.create({
    userId,
    amount,
    status: "pending",
    stripePaymentIntentId: paymentIntent.id,
  });

  // Send the clientSecret to the browser so Stripe.js can complete payment
  res.json({ clientSecret: paymentIntent.client_secret });
});
```

At this point your server's job for this request is done. The browser talks directly to Stripe to collect and charge the card. You never see the raw card number.

### Step 3 — Stripe fires the webhook to your server

Once Stripe confirms the charge, it automatically sends an HTTP POST to the URL you registered in the Stripe dashboard. This is the webhook firing.

```javascript
// POST /api/webhooks/stripe
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    // 1. Verify the signature — proves this is really Stripe, not a fake request
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return res.status(400).send(`Webhook signature invalid: ${err.message}`);
    }

    // 2. Acknowledge immediately — Stripe will retry if you're slow
    res.status(200).send("received");

    // 3. Handle the event type
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;

      // 4. Find the order and mark it paid
      await db.orders.update(
        { stripePaymentIntentId: intent.id },
        { status: "paid", paidAt: new Date() },
      );

      // 5. Send confirmation email
      const order = await db.orders.findOne({
        stripePaymentIntentId: intent.id,
      });
      await emailService.sendConfirmation(order.userId, order);

      // 6. Notify the browser in real time (if using WebSockets)
      websocketServer.notifyUser(order.userId, {
        type: "ORDER_CONFIRMED",
        orderId: order.id,
      });
    }
  },
);
```

### What Stripe's POST body looks like

```json
{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_abc123",
      "amount": 4999,
      "currency": "usd",
      "metadata": {
        "userId": "user_456",
        "items": "[{\"id\":\"shoe_01\",\"qty\":1}]"
      }
    }
  }
}
```
---

## What Happens on the Frontend While It Waits?

After the user pays, the browser needs to know when the order is confirmed. There are three approaches:

### Option 1 — Polling (simplest)

The browser asks your server every few seconds: "is the order ready yet?"

```javascript
const interval = setInterval(async () => {
  const res = await fetch("/api/orders/" + orderId);
  const order = await res.json();

  if (order.status === "paid") {
    clearInterval(interval);
    showConfirmationPage(order);
  }
}, 2000); // check every 2 seconds
```

Simple but wasteful — lots of unnecessary requests.

### Option 2 — WebSockets (real time)

Your backend pushes the update to the browser the instant the webhook fires.

```javascript
// Browser
const ws = new WebSocket("wss://yoursite.com");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "ORDER_CONFIRMED") {
    showConfirmationPage(data.orderId);
  }
};
```

```javascript
// Inside your webhook handler (Step 6 above)
websocketServer.notifyUser(order.userId, {
  type: "ORDER_CONFIRMED",
  orderId: order.id,
});
```

Instant and efficient. Best for real-time UX.

### Option 3 — Redirect (classic, no complexity)

After payment, redirect the browser to `/order-confirmation?id=123`. That page loads the order status server-side. Simple, reliable, no real-time needed.

---

## The Three Rules That Make or Break a Webhook

### 1. Always verify the signature

Without this, anyone on the internet can POST fake events to your URL and trick your server into marking orders as paid, triggering emails, etc.

Stripe sends a `stripe-signature` header. You use your webhook secret to verify it matches the payload.

```javascript
const event = stripe.webhooks.constructEvent(
  req.body, // raw body (NOT parsed JSON)
  req.headers["stripe-signature"],
  process.env.STRIPE_WEBHOOK_SECRET,
);
```

**Note:** You must use `express.raw()` — not `express.json()` — because the signature is computed against the raw bytes.

### 2. Respond with 200 before doing any work

If your handler takes 10 seconds to send an email, Stripe's HTTP request will time out. Stripe assumes delivery failed and retries — now you process the same event twice.

```javascript
// Do this first
res.status(200).send("received");

// Then do the work
await updateDatabase();
await sendEmail();
```

### 3. Handle duplicate events (idempotency)

Because of retries, the same event can arrive more than once. Before updating, check if you've already processed it.

```javascript
const existing = await db.orders.findOne({
  stripePaymentIntentId: intent.id,
  status: 'paid'
});

if (existing) {
  return; // Already processed, skip
}

await db.orders.update(...);
```

Use the payment intent ID (or event ID) as your idempotency key.

---

## Common Webhook Providers and Their Events

| Service      | Event examples                                                                        |
| ------------ | ------------------------------------------------------------------------------------- |
| **Stripe**   | `payment_intent.succeeded`, `invoice.payment_failed`, `customer.subscription.deleted` |
| **GitHub**   | `push`, `pull_request`, `issues`, `workflow_run`                                      |
| **Twilio**   | `message.received`, `call.completed`                                                  |
| **Typeform** | `form_response`                                                                       |
| **Shopify**  | `orders/create`, `products/update`, `fulfillments/create`                             |
| **SendGrid** | `email.delivered`, `email.bounced`, `email.opened`                                    |

---

## When to Use Webhooks vs Polling

| Situation                                      | Use webhooks | Use polling |
| ---------------------------------------------- | ------------ | ----------- |
| Need instant notification                      | ✓            |             |
| Event triggered by a third party               | ✓            |             |
| Your server has no public URL (e.g. localhost) |              | ✓           |
| Querying historical data                       |              | ✓           |
| Simple low-traffic hobby project               | either       | either      |

---

## Testing Webhooks Locally

Your localhost isn't reachable from the internet, so Stripe can't POST to it directly. Use **ngrok** to create a temporary public tunnel:

```bash
# Install ngrok, then run:
ngrok http 3000

# ngrok gives you a public URL like:
# https://a1b2c3d4.ngrok.io

# Register that URL in the Stripe dashboard:
# https://a1b2c3d4.ngrok.io/api/webhooks/stripe
```

The Stripe CLI also lets you forward events directly:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Summary

- A webhook is **logic you write** that an **external service calls** when an event happens on their end.
- You publish a URL. They register it. They POST to it when something happens.
- Your webhook handler receives the data, verifies the request is genuine, acknowledges it immediately with `200 OK`, then does its work.
- The frontend can learn about the result via polling, WebSockets, or a simple redirect.
- Three rules to always follow: **verify the signature**, **respond 200 first**, **handle duplicates**.
