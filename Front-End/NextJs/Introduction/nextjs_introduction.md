# Introduction to Next.js

## 1. What is Next.js?

Next.js is a **React framework** that enables **server-side rendering (SSR)**, **static site generation (SSG)**, and **hybrid rendering**. It is designed to enhance React applications by adding features like:

- **Pre-rendering (SSR & SSG)**
- **API routes**
- **File-based routing**
- **Automatic code splitting**
- **Optimized performance and SEO**

It is developed and maintained by **Vercel**.

---

## 2. Why Use Next.js?

Next.js offers several benefits compared to a standard React app.

### 2.1. Server-Side Rendering (SSR)

- **Why?** Improves SEO & performance by **pre-rendering** pages on the server.
- **Example:** Fetching data on the server before sending the page to the client.

```ts
export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();

  return { props: { data } };
}

export default function Page({ data }) {
  return <div>{data.message}</div>;
}
```

### 2.2. Static Site Generation (SSG)

- **Why?** Pre-renders pages **at build time**, making them super fast.
- **Example:** Blog posts or marketing pages.

```ts
export async function getStaticProps() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();

  return { props: { posts } };
}
```

### 2.3. API Routes (Built-in Backend)

- **Why?** Allows creating backend APIs **within the Next.js project**.

```ts
export default function handler(req, res) {
  res.status(200).json({ message: "Hello from API" });
}
```

### 2.4. File-Based Routing

- **Why?** No need to use `react-router-dom`; just create files inside the `/pages` directory.
- Example:
  - `/pages/index.tsx` → `localhost:3000/`
  - `/pages/about.tsx` → `localhost:3000/about`

### 2.5. Image Optimization

Next.js provides the `next/image` component for automatic image optimization.

```ts
import Image from 'next/image';

<Image src="/logo.png" width={200} height={100} alt="Logo" />
```

### 2.6. Automatic Code Splitting

- **Why?** Loads only the JavaScript needed for a page, improving performance.

### 2.7. Middleware (Edge Functions)

- **Why?** Modify requests **before reaching a page** for better performance.

```ts
import { NextResponse } from "next/server";

export function middleware(req) {
  return NextResponse.redirect("/login");
}
```

### 2.8. Hybrid Rendering

Next.js allows combining SSR & SSG within the same project.

### 2.9. Built-in Support for TypeScript

- **Why?** Next.js has built-in support for TypeScript without extra configuration.

```ts
export default function Home(): JSX.Element {
  return <h1>Welcome to Next.js with TypeScript!</h1>;
}
```

---

## 3. When to Use Next.js?

Use Next.js when:
✅ You need **Full-Stack Apps** .  
✅ You need **SEO-friendly** pages (e.g., blogs, e-commerce).  
✅ You want **fast performance** with static pages.  
✅ You need a **built-in backend** for API routes.  
✅ You prefer **automatic optimizations** (e.g., images, scripts).  
✅ You want **file-based routing** (simplifies navigation).  
✅ You are building a **hybrid app** (mix of SSR & SSG).  

---

## 4. When NOT to Use Next.js?

❌ If you're building a **pure client-side** app with no SSR needs.  
❌ If you need a **simple React app** with client-side state-heavy interactions.  
❌ If you're using another meta-framework (e.g., Gatsby, Nuxt.js).  

---

## 5. Conclusion

Next.js is a powerful React framework that enables **server-side rendering**, **static generation**, and **API routes**, making it a great choice for **high-performance, SEO-friendly applications**.

Would you use Next.js in your next project? 🚀

