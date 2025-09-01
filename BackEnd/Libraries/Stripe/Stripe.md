Stripe:

## Flow

1. Front end sends a request to backend
2. BackEnd sends a request to Stripe
3. Stripe returns a url session to back end
4. Url session is sent to front end from backend
5. then user pays and transaction is sent to the bank
6. Bank sends a Notify to backend (through stripe) to confirm transaction To BackEnd
7. Backend sends confirmation message to front end .

## Note:

1. You have a secret key and a primary key.
2. while devloping we work in test mode.
3. In test mode, we go to devloper >> Api key
4. We will find publishable key and secret key.
5. Secret key is unique and should always be hidden,
6. we create a session then return the session
7. The returned session will contain data about the session. It will include an url at the end.  
8. That url redirects you to a checkout page with the details 

Absolutely! Here's a clear and well-structured `.md` file that explains how to create a Stripe Checkout session, with detailed notes on `line_items` and `options`, perfect for understanding and referencing:

---

````markdown
# 💳 Stripe Checkout: Session Creation Explained

## ✅ 1. Purpose

Stripe Checkout allows you to redirect users to a secure Stripe-hosted page to complete their payment.  
To create a checkout session, you use:

```js
const session = await stripe.checkout.sessions.create({
  line_items,
  ...options,
});
```
````

---

## 🧩 2. line_items – Products Being Purchased

`line_items` is an array of objects. Each object represents **one item in the cart**. In the end, the price is calculated based on all line_items and quantity for each one 

### ✅ Basic Structure:

```js
line_items: [
  {
    price_data: {
      currency: "usd", // or "egp", "eur", etc.
      unit_amount: totalPrice * 100, // amount in cents (or smallest unit)
      product_data: {
        name: "Product or User Name", // this appears in Stripe UI
      },
    },
    quantity: 1, // how many of this product is being bought
  },
];
```

### 🔍 Notes:

- `unit_amount` must be in **cents**, so multiply total price by `100`.
- `product_data.name` is shown to the user on the Stripe Checkout page. You can use a product name, user’s name, or even an order summary.
- `quantity` defines how many of that item is being purchased.

---

## 🛠️ 3. Options – Session Configuration

These are the other properties passed into `sessions.create()` besides `line_items`.

### ✅ Common Options:

```js
{
  mode: "payment", // required: one-time payment
  success_url: "https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "https://yourapp.com/cancel",
  customer_email: "user@example.com", // send receipt
  client_reference_id: cartId, // to link session to your system (e.g., cart ID or order ID)
  metadata: {
    userId: "abc123",
    orderNote: "Some internal note"
  }
}
```

### 🔍 Explanation of Options:

| Field                 | Description                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `mode`                | Use `"payment"` for one-time purchases.                                                                    |
| `success_url`         | Where the user is redirected after successful payment. `{CHECKOUT_SESSION_ID}` will be replaced by Stripe. |
| `cancel_url`          | Where the user is redirected if they cancel the payment.                                                   |
| `customer_email`      | User’s email. Stripe will send them a receipt.                                                             |
| `client_reference_id` | Helpful to link this session to your DB entry (e.g., cart ID, order ID).                                   |
| `metadata`            | Optional key-value object for storing internal data (e.g., user ID, notes), shipping address.              |

---

## 🚀 Full Example:

```js
const session = await stripe.checkout.sessions.create({
  line_items: [
    {
      price_data: {
        currency: "usd",
        unit_amount: cart.totalPrice * 100,
        product_data: {
          name: user.name,
        },
      },
      quantity: 1,
    },
  ],
  mode: "payment",
  success_url: "https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "https://yourapp.com/cancel",
  customer_email: user.email,
  client_reference_id: cart._id.toString(),
  metadata: {
    userId: user._id.toString(),
    note: "Prepaid order from checkout",
  },
});

res.send(session);
```
Sure! Here's that section formatted for easy copying:

---

## 📦 What the Returned `session` Contains

The object returned by `stripe.checkout.sessions.create(...)` includes many useful fields:

| **Field**             | **Description**                                                       |
| --------------------- | --------------------------------------------------------------------- |
| `id`                  | The session ID (e.g. `cs_test_...`)                                   |
| `url`                 | 🔗 The link to redirect the user to Stripe Checkout                   |
| `customer_email`      | The email used in the session                                         |
| `client_reference_id` | The custom ID you provided (e.g., cart/order ID)                      |
| `amount_total`        | Total payment amount in the smallest currency unit (e.g., cents)      |
| `payment_status`      | Will be `unpaid` initially, becomes `paid` after success              |
| `metadata`            | Any custom key-value data you added (e.g., userId, order notes, etc.) |

---

## 🧠 Summary

- `line_items` defines **what the user is paying for**.
- `options` like `mode`, `email`, and `urls` define **how the checkout session behaves**.
- Always multiply amounts by `100` to convert dollars to cents (or equivalent smallest currency unit).
- Use `client_reference_id` and `metadata` to link Stripe sessions to your app's data.

```

```
