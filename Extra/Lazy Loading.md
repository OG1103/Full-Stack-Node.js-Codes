# Lazy Loading

Lazy loading is a strategy where resources (images, modules, data, components) are **not loaded until they are actually needed**. Instead of loading everything upfront when the page/app starts, you load things on-demand — when the user is about to see or use them.

The opposite is **eager loading** — loading everything immediately at startup regardless of whether it will be used.

---

## The Problem It Solves

A large web app might have:
- 50 page components (but the user only visits 2–3 per session)
- 100 images on a long page (but the user only scrolls halfway)
- A heavy charting library used only on the analytics page
- A PDF viewer used only when the user downloads a report

Loading all of this on startup wastes bandwidth, increases initial load time, and makes the app feel slow — especially on mobile or slow connections.

Lazy loading fixes this by deferring the cost until it's actually needed.

---

## 1. Lazy Loading Images (HTML / Browser Native)

The simplest form — the browser natively supports it with one attribute:

```html
<!-- Eager (default) — loads immediately even if off-screen -->
<img src="photo.jpg" alt="Photo">

<!-- Lazy — loads only when near the viewport -->
<img src="photo.jpg" alt="Photo" loading="lazy">
```

The browser automatically loads the image when the user scrolls close to it. No JavaScript needed. This is the standard approach for image-heavy pages.

---

## 2. Lazy Loading JavaScript Modules (Dynamic Import)

In Node.js and modern browsers, `import()` (dynamic import) lets you load a module only when you need it:

```javascript
// Eager — loaded at startup even if never used
import { generatePDF } from './pdfGenerator.js';

// Lazy — loaded only when the function is called
async function downloadReport() {
  const { generatePDF } = await import('./pdfGenerator.js');
  generatePDF(data);
}
```

`import()` returns a Promise. The module file is fetched and executed only when `import()` is called.

### Real Example — Load a Heavy Library on Demand

```javascript
// Without lazy loading — chartjs loads on every page
import Chart from 'chart.js';

// With lazy loading — chartjs loads only when user visits analytics page
async function renderChart(data) {
  const { Chart } = await import('chart.js');
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, { type: 'bar', data });
}
```

---

## 3. Lazy Loading in React (React.lazy + Suspense)

React has built-in support for lazy loading components. Components are split into separate JavaScript bundles and loaded only when rendered:

```javascript
import React, { lazy, Suspense } from 'react';

// Lazy — AnalyticsDashboard.js is NOT included in the initial bundle
const AnalyticsDashboard = lazy(() => import('./AnalyticsDashboard'));
const UserProfile = lazy(() => import('./UserProfile'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Component is fetched only when it's rendered */}
      <AnalyticsDashboard />
    </Suspense>
  );
}
```

`Suspense` wraps the lazy component and shows the `fallback` (a spinner, skeleton, or message) while the component's bundle is being downloaded.

### Route-Based Lazy Loading (Most Common Pattern)

Each route/page is its own bundle. Only the current page's code is loaded:

```javascript
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage     = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const AdminPage    = lazy(() => import('./pages/AdminPage'));

function App() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/admin"    element={<AdminPage />} />
      </Routes>
    </Suspense>
  );
}

// AdminPage.js and its dependencies are never downloaded
// unless the user navigates to /admin
```

---

## 4. Lazy Loading Data (Pagination / Infinite Scroll)

Instead of fetching all records at once, fetch only what's visible:

### Pagination
```javascript
// Fetch only page 1 initially
const [page, setPage] = useState(1);
const [products, setProducts] = useState([]);

useEffect(() => {
  fetch(`/api/products?page=${page}&limit=20`)
    .then(res => res.json())
    .then(data => setProducts(prev => [...prev, ...data]));
}, [page]);

// Load more when user clicks
<button onClick={() => setPage(p => p + 1)}>Load More</button>
```

### Infinite Scroll with Intersection Observer
```javascript
// Load next page when the bottom sentinel element enters the viewport
const sentinelRef = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setPage(p => p + 1);  // Triggers a new fetch
    }
  });

  if (sentinelRef.current) observer.observe(sentinelRef.current);
  return () => observer.disconnect();
}, []);

return (
  <div>
    {products.map(p => <ProductCard key={p._id} product={p} />)}
    <div ref={sentinelRef} />  {/* Invisible trigger at the bottom */}
  </div>
);
```

---

## 5. Lazy Loading in Node.js (Backend Modules)

On the backend, you can defer loading heavy modules (like database drivers, file parsers, or report generators) until the first request that actually needs them:

```javascript
// Eager — pdf library loaded at startup even if no one requests a PDF today
import PDFDocument from 'pdfkit';

// Lazy — loaded only on first PDF request
let PDFDocument;

async function generatePDF(data) {
  if (!PDFDocument) {
    PDFDocument = (await import('pdfkit')).default;
  }
  const doc = new PDFDocument();
  // ...
}
```

This speeds up server startup time and reduces initial memory usage.

---

## Eager vs Lazy — Side-by-Side

| Aspect | Eager Loading | Lazy Loading |
|--------|--------------|--------------|
| When loaded | At startup / page load | On demand (when needed) |
| Initial load time | Slower | Faster |
| Subsequent load | Instant (already loaded) | Small delay on first use |
| Bandwidth | All downloaded upfront | Only what's used is downloaded |
| Complexity | Simple — just import | Requires async handling |
| Best for | Small, always-needed things | Large, infrequently-used things |

---

## When to Use Lazy Loading

**Use lazy loading for:**
- Page/route components that are not on the landing page
- Heavy libraries (charts, PDF, video players, rich text editors)
- Images below the fold (not visible without scrolling)
- Admin panels, settings pages — rarely visited by most users
- Lists with potentially thousands of items

**Keep eager loading for:**
- Core utilities used everywhere (router, state management, auth)
- The landing page content (lazy loading the first screen defeats the purpose)
- Small modules where the async overhead costs more than it saves

---

## Key Points

1. **Lazy loading = load on demand** — only fetch/execute resources when they are about to be used
2. **Fastest way to improve initial load time** on large apps — don't ship code the user might never use
3. **`loading="lazy"`** on `<img>` tags is zero-effort and should be the default for off-screen images
4. **Dynamic `import()`** is the JavaScript mechanism for lazy loading modules — works in both browser and Node.js
5. **React.lazy + Suspense** makes component-level lazy loading declarative and clean
6. **Route-based splitting** is the highest-impact pattern — each page only loads its own code
7. **Always show feedback** (spinner, skeleton) when lazy loading takes time — users need to know something is happening
