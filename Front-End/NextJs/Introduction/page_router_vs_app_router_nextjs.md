# Page Router vs App Router in Next.js

## 1. Introduction
Next.js has two different routing systems:
- **Page Router (`pages/`)** – Traditional file-based routing used before Next.js 13.
- **App Router (`app/`)** – Introduced in Next.js 13 with the **App Directory**, enabling Server Components.

---

## 2. **Page Router (`pages/`)** – Old Approach

### ✅ **How It Works**
- Uses the `pages/` directory for routing.
- Each file inside `pages/` is automatically a route.
- Uses **getServerSideProps, getStaticProps, and getInitialProps** for data fetching.

### 📂 **Example Project Structure**
```
my-next-app/
│── pages/
│   ├── index.js    # Renders at "/"
│   ├── about.js    # Renders at "/about"
│   ├── contact.js  # Renders at "/contact"
│   ├── api/        # API routes (e.g., "/api/hello")
```

### 📌 **Example Page Component (`pages/index.js`)**
```tsx
export default function Home() {
  return <h1>Welcome to the Home Page</h1>;
}
```

### 📌 **Fetching Data in Page Router (SSR)**
```tsx
export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();

  return { props: { data } };
}

export default function Page({ data }) {
  return <div>{data.message}</div>;
}
```

### 🚀 **Pros:**
✅ Simple, intuitive, and widely used.  
✅ Familiar `getStaticProps` and `getServerSideProps` methods.  
✅ Easier for those used to traditional React components.  

### ❌ **Cons:**
❌ Not optimized for Server Components.  
❌ Cannot fully utilize streaming and React Server Components.  
❌ Requires API routes for backend logic.  

---

## 3. **App Router (`app/`)** – New Approach

### ✅ **How It Works**
- Uses the `app/` directory instead of `pages/`.
- Supports **React Server Components** by default.
- Uses **async/await** for data fetching inside components.
- Introduces **Layout.js**, `loading.js`, and `error.js` for better UI management.

### 📂 **Example Project Structure**
```
my-next-app/
│── app/
│   ├── layout.js    # Layout component for all pages
│   ├── page.js      # Renders at "/"
│   ├── about/
│   │   ├── page.js  # Renders at "/about"
│   ├── contact/
│   │   ├── page.js  # Renders at "/contact"
│   ├── api/         # API routes (e.g., "/api/hello")
```

### 📌 **Example Page Component (`app/page.js`)**
```tsx
export default function Home() {
  return <h1>Welcome to the Home Page</h1>;
}
```

### 📌 **Fetching Data in App Router (SSR)**
```tsx
export default async function Page() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();

  return <div>{data.message}</div>;
}
```

### 🚀 **Pros:**
✅ **Server Components** by default (better performance).  
✅ **Built-in layouts** (`layout.js`) for consistent UI.  
✅ **Improved streaming support** and parallel routes.  
✅ **Async/await inside components** for data fetching.  

### ❌ **Cons:**
❌ Requires learning new patterns like Server Components.  
❌ No `getStaticProps` or `getServerSideProps` (must fetch data inside components).  
❌ Some third-party libraries may not fully support Server Components.  

---

## 4. **Key Differences**

| Feature            | Page Router (`pages/`) | App Router (`app/`) |
|--------------------|----------------------|----------------------|
| **Directory**      | `pages/`             | `app/`              |
| **Routing Type**   | File-based routes    | File-based, but supports layouts |
| **Server Components** | ❌ No (Client Components only) | ✅ Yes (Server Components by default) |
| **Data Fetching**  | `getServerSideProps`, `getStaticProps` | Async/await inside components |
| **Streaming Support** | ❌ No | ✅ Yes |
| **Nested Layouts** | ❌ No | ✅ Yes (via `layout.js`) |
| **API Routes**     | `pages/api/` | `app/api/` |
| **Performance**    | Slower due to Client Components | Faster with Server Components |

---

## 5. **Which One Should You Use?**

✅ **Use Page Router (`pages/`) if:**  
- You are working on an **existing Next.js project** that already uses `pages/`.
- You need **getStaticProps, getServerSideProps, or getInitialProps**.
- You prefer a simpler **React component structure**.

✅ **Use App Router (`app/`) if:**  
- You are **starting a new project** with Next.js 13+.
- You want to use **Server Components** for better performance.
- You need **streaming, layouts, and async/await data fetching**.
- You are building a **modern, optimized Next.js app**.

---

## 6. **Conclusion**

- **Page Router (`pages/`)** is great for traditional SSR/SSG Next.js apps.
- **App Router (`app/`)** is the future of Next.js with Server Components and advanced optimizations.
- **For new projects**, **App Router is recommended**.

🚀 **Next.js 13+ encourages using the App Router for better performance and scalability.**

Would you switch to the App Router? 🤔 Let me know!

