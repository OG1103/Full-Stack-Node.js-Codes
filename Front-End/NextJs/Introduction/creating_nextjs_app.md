# How to Create a Next.js App

## 1. Prerequisites
Before creating a Next.js app, ensure you have:
- **Node.js** (recommended: latest LTS version)
- **npm** or **yarn** installed

Check if Node.js is installed by running:
```sh
node -v
```

---

## 2. Installing Next.js

### 2.1. Using `create-next-app` (Recommended)

The easiest way to start a Next.js project is by using the `create-next-app` CLI tool. It sets up everything automatically.

#### Using `npx` (Recommended)
```sh
npx create-next-app@latest my-next-app
```

#### Using `yarn`
```sh
yarn create next-app my-next-app
```

#### Using `pnpm`
```sh
pnpm create next-app my-next-app
```

- Replace `my-next-app` with your preferred project name.
- It will prompt you to choose **TypeScript or JavaScript**, **ESLint**, and other configurations.

---

## 3. Running the Next.js App

After installation, navigate into your project folder:
```sh
cd my-next-app
```

Start the development server:
```sh
npm run dev
```
or
```sh
yarn dev
```
or
```sh
pnpm dev
```

This starts the server at `http://localhost:3000`.

---

## 4. Project Structure

Inside your Next.js project, you'll see the following structure:

```
my-next-app/
│── pages/           # Next.js pages (Routes)
│   ├── index.js     # Home page (http://localhost:3000/)
│   ├── about.js     # Example about page (http://localhost:3000/about)
│── public/          # Static files like images
│── styles/         # CSS Modules or global styles
│── package.json     # Dependencies and scripts
│── next.config.js   # Next.js configuration file
```

### Key Concepts:
- `pages/` folder defines routes automatically.
- `public/` folder contains static assets.
- `styles/` for styling with CSS or CSS Modules.

---

## 5. Creating a New Page

To create a new page, add a new file inside the `pages/` directory.

Example: Creating `about.js` page:
```js
export default function About() {
  return <h1>About Page</h1>;
}
```

Now you can access this page at `http://localhost:3000/about`.

---

## 6. Building & Deploying the App

To create a production-ready build:
```sh
npm run build
```
or
```sh
yarn build
```
or
```sh
pnpm build
```

Then, start the optimized production server:
```sh
npm start
```
or
```sh
yarn start
```

---

## 7. Deploying Next.js App

Next.js is designed for **easy deployment**. Some common hosting options:
- **Vercel (Recommended)** – Free and optimized for Next.js.
- **Netlify**
- **Docker**
- **Custom Servers (Node.js, Express, etc.)**

To deploy to Vercel:
```sh
npm install -g vercel
vercel
```

---

## 8. Conclusion

Congratulations! 🎉 You've successfully set up a **Next.js app**. Now you can start building your web application with features like **server-side rendering, static site generation, API routes, and more**.

🚀 Happy coding!

