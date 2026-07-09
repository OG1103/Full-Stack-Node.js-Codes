## Webhook Reliability

### What is it

A webhook is when **an external service calls your API** to notify you that something happened (e.g., Stripe calls your `/webhook` endpoint when a payment succeeds).

The problem: webhook delivery is not guaranteed. The external service fires and forgets — if your server is down, your handler throws an error, or the database write fails, the webhook is lost. You never process the event. A payment might go unrecorded, an order might stay unfulfilled, and the customer is charged but gets nothing.

**Two key reliability problems:**

1. **Your handler fails** — the external service gets a non-200 response or a timeout, so it retries. Your handler runs multiple times for the same event — you must handle duplicates (idempotency).
2. **Your handler succeeds but your processing fails** — you return 200 immediately, but the database write after it fails. The event is silently dropped.

### Example

```js
// ❌ BROKEN — unreliable webhook handler

app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Problem 1: if this DB write fails, we already sent 200 — event is silently lost
    await Order.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { status: 'paid' }
    );

    // Problem 2: if Stripe retries, this runs again — could cause duplicate processing
    await sendConfirmationEmail(paymentIntent.metadata.userId);
  }

  res.json({ received: true }); // 200 — but we may have already failed above
});
```

### Solution

**The pattern: acknowledge immediately, process reliably, handle duplicates.**

**Step 1 — Acknowledge immediately (return 200 right away):**

External services like Stripe have short timeout windows (e.g., 30 seconds). If your processing is slow, you risk a timeout even if the event was handled. Return 200 immediately, then process asynchronously.

**Step 2 — Store the raw event first (durable queue):**

Write the event to your database before doing anything else. Even if subsequent processing fails, the event is saved and can be replayed.

**Step 3 — Process idempotently (use the event ID as a unique key):**

Every webhook event has a unique ID. Store processed event IDs so you never process the same event twice.

```js
// Webhook event log schema
const webhookEventSchema = new mongoose.Schema({
  eventId:     { type: String, unique: true, index: true }, // e.g., Stripe event ID
  provider:    String,                                       // 'stripe', 'github', etc.
  type:        String,                                       // event type
  payload:     mongoose.Schema.Types.Mixed,                  // raw event data
  status:      { type: String, enum: ['pending', 'processed', 'failed'], default: 'pending' },
  processedAt: Date,
  error:       String,
  createdAt:   { type: Date, default: Date.now },
});
const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema);
```

```js
// ✅ FIXED — reliable webhook handler
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  // Step 1: Verify the webhook signature
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Step 2: Acknowledge immediately — Stripe gets a 200 right away
  res.json({ received: true });

  // Step 3: Store the event (idempotent — unique index on eventId prevents duplicates)
  try {
    await WebhookEvent.create({
      eventId:  event.id,   // Stripe's unique event ID
      provider: 'stripe',
      type:     event.type,
      payload:  event.data.object,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key — we already stored this event (Stripe retry)
      // Safe to ignore — it will be processed or was already processed
      return;
    }
    console.error('Failed to store webhook event:', err);
    return;
  }

  // Step 4: Process the event
  await processWebhookEvent(event);
});

async function processWebhookEvent(event) {
  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;

      await Order.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: 'paid', paidAt: new Date() }
      );

      await sendConfirmationEmail(paymentIntent.metadata.userId);
    }

    // Mark as processed
    await WebhookEvent.findOneAndUpdate(
      { eventId: event.id },
      { status: 'processed', processedAt: new Date() }
    );

  } catch (err) {
    // Mark as failed so you can find and replay it later
    await WebhookEvent.findOneAndUpdate(
      { eventId: event.id },
      { status: 'failed', error: err.message }
    );
    console.error('Webhook processing failed:', err);
  }
}
```

**Step 5 — Replay failed events (admin endpoint):**

```js
// ✅ Replay any failed webhook events
app.post('/admin/webhooks/replay-failed', async (req, res) => {
  const failedEvents = await WebhookEvent.find({ status: 'failed' });

  for (const record of failedEvents) {
    await processWebhookEvent({ id: record.eventId, type: record.type, data: { object: record.payload } });
  }

  res.json({ replayed: failedEvents.length });
});
```

### When to use each solution

| Solution | When to use it |
|---|---|
| **Acknowledge immediately + async processing** | Always. Never do slow work before returning 200. External services will retry if you take too long. |
| **Store raw event before processing** | Whenever the event has business impact (payments, order updates, user signups). If processing fails, you can replay from the stored record. |
| **Idempotency via unique event ID** | Always. Any webhook provider (Stripe, GitHub, Twilio) retries on failure — your handler must be safe to call multiple times with the same event. |
| **Replay endpoint** | Any production system. Failures happen — you need a way to re-process failed events without waiting for the external service to retry. |
